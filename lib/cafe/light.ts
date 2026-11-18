/**
 * The light on the café: one broad key, a soft fill, the sky, and contact
 * shadows. Computed once, on the CPU, for both renderers.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## Matte, so the light can be baked
 *
 * Every material is matte (Lambertian): how bright a face looks does not
 * depend on where it is seen from. So the shading is worked out here, per
 * face, and both renderers draw the result: the still as SVG fills, the
 * WebGL renderer as vertex colours (`vault/webgl/cafe/rig.ts`). Nothing moves
 * the lights, and a camera that tilts a degree or two (G4) sees the same
 * light on every face, which is what a matte object under fixed lights does.
 *
 * ## The lights, as the reference sets them (§5, path B)
 *
 * - **Key:** one broad light above and to the left, `KEY`, with an angular
 *   radius of `KEY_RADIUS`: broad, so the shadows it casts have soft edges.
 * - **Fill:** from the other side, low, at `FILL_RATIO` of the key: inside
 *   the reference's 0.25–0.4, so the shaded sides stay readable.
 * - **Sky:** a hemisphere, brighter above than below, hidden where the roof
 *   and the walls hide it: the interior's soft darkness.
 * - **Contact shadows:** `model.ts` `FOOTPRINTS`, drawn by the renderers.
 *
 * ## Exposure
 *
 * Fixed on a reference material, plaster: a plaster face square to the key,
 * in the open, shows exactly plaster's authored colour. The key's intensity
 * is solved for that (`KEY_INTENSITY`) and every other light is a ratio of
 * it, so a change of material never changes the exposure and nothing
 * compensates for a colour space with intensity (`color.ts`).
 *
 * ## What a face is painted with
 *
 * A face's `paint` has two layers. `base` is the face before the roof is on:
 * lit by the key wherever the shell does not hide it. `shade` is the face
 * once everything is in place, and only exists where it differs from the
 * base: the roof's shadow on the interior, the sky it hides. While the roof
 * arrives (`assembly.ts`), the shade fades in over the base, so the room
 * falls into shade as it is roofed; at rest only the shade shows.
 *
 * A shade can be a ramp rather than one colour: the soft edge of the roof's
 * shadow across a floor or a wall. A ramp is two colours and a linear
 * coordinate in world space, `t = dot(gradient, point) + offset`, 0 on the
 * shadowed side and 1 on the lit one. The WebGL renderer evaluates `t` at
 * each vertex, and the still fits the same function in its own plane.
 */

import { type Linear, luminance, toLinear } from './color'
import {
  add,
  centroid,
  cross,
  dot,
  enter,
  type Face,
  length,
  normalize,
  scale,
  sub,
  type Vec3,
} from './geometry'
import {
  MATERIALS,
  materialOf,
  type Part,
  PARTS,
  REFERENCE_MATERIAL,
  ROOF_STAGE,
} from './model'
import { facesEye } from './view'

/** Towards the key light: above, to the left, a little in front. */
export const KEY: Vec3 = normalize([-0.62, 1, 0.48])
/** Half the key's apparent size: a broad source, so soft shadow edges. */
export const KEY_RADIUS = (6.5 * Math.PI) / 180

/** Towards the fill: the other side, lower, from the camera's side. */
export const FILL: Vec3 = normalize([0.85, 0.3, 0.75])
/** The fill's strength as a share of the key's. */
export const FILL_RATIO = 0.32

/** The sky above and the ground's bounce below, as shares of the key. */
const SKY_RATIO = 0.2
const GROUND_RATIO = 0.06

/** Light reaching a face with normal `normal`, as a share of the key's. */
function irradiance(normal: Vec3, key: number, sky: number): number {
  const keyTerm = Math.max(0, dot(normal, KEY)) * key
  const fillTerm = Math.max(0, dot(normal, FILL)) * FILL_RATIO
  const up = 0.5 + 0.5 * normal[1]
  const ambient = SKY_RATIO * up * sky + GROUND_RATIO * (1 - up)
  return keyTerm + fillTerm + ambient
}

/**
 * The key's intensity, solved so that the reference material square to the
 * key, under an open sky, shows its own colour: irradiance 1 at that face.
 */
export const KEY_INTENSITY = 1 / irradiance(KEY, 1, 1)

/** A material's colour under some irradiance, in linear light. */
const lit = (albedo: Linear, light: number): Linear => [
  albedo[0] * light * KEY_INTENSITY,
  albedo[1] * light * KEY_INTENSITY,
  albedo[2] * light * KEY_INTENSITY,
]

/** The authored colours, in linear light. */
export const ALBEDO = Object.fromEntries(
  Object.entries(MATERIALS).map(([name, value]) => [name, toLinear(value)])
) as Record<keyof typeof MATERIALS, Linear>

/** The reference material's own luminance, which the exposure lands on. */
export const REFERENCE_LUMINANCE = luminance(ALBEDO[REFERENCE_MATERIAL])

/** A colour as it shows on a face with this normal, in the open. */
export const shadeOpen = (albedo: Linear, normal: Vec3) =>
  lit(albedo, irradiance(normal, 1, 1))

/** A blocker, with a bounding sphere to skip it cheaply. */
interface Occluder {
  readonly part: Part
  readonly center: Vec3
  readonly radius: number
}

function occluderOf(item: Part): Occluder {
  const points = item.solid.faces.flatMap((face) => face.points)
  const center = centroid(points)
  const radius = Math.max(...points.map((point) => length(sub(point, center))))
  return { part: item, center, radius }
}

const OCCLUDERS = PARTS.filter((item) => item.occluder).map(occluderOf)
const SHELL_OCCLUDERS = OCCLUDERS.filter((item) => item.part.stage < ROOF_STAGE)

/**
 * The distance along a ray from `point` towards `direction` (unit length) to
 * the nearest blocker, or `null` when nothing is in the way.
 */
function blocked(
  point: Vec3,
  direction: Vec3,
  occluders: readonly Occluder[],
  self: Part
): number | null {
  let nearest: number | null = null
  for (const item of occluders) {
    if (item.part === self) continue
    // The bounding sphere first, in scalars: most rays miss most blockers.
    const cx = item.center[0] - point[0]
    const cy = item.center[1] - point[1]
    const cz = item.center[2] - point[2]
    const along = cx * direction[0] + cy * direction[1] + cz * direction[2]
    if (along < -item.radius) continue
    const apart = cx * cx + cy * cy + cz * cz - along * along
    if (apart > item.radius * item.radius) continue
    const hit = enter(point, direction, item.part.solid)
    if (hit !== null && (nearest === null || hit < nearest)) nearest = hit
  }
  return nearest
}

/**
 * Directions over the sky, spread evenly and weighted towards the zenith
 * (cosine-weighted, on a Fibonacci spiral).
 */
const SKY_RAYS: readonly Vec3[] = Array.from({ length: 12 }, (_, index) => {
  const u = (index + 0.5) / 12
  const radius = Math.sqrt(u)
  const angle = index * Math.PI * (3 - Math.sqrt(5))
  return [
    radius * Math.cos(angle),
    Math.sqrt(Math.max(0, 1 - u)),
    radius * Math.sin(angle),
  ] as Vec3
})

/** How much of the sky a face sees, from a few points on it, 0–1. */
function skyOf(
  samples: readonly Vec3[],
  normal: Vec3,
  occluders: readonly Occluder[],
  self: Part
): number {
  let open = 0
  let total = 0
  // At most four points: the sky changes slowly across a face.
  const step = Math.max(1, Math.floor(samples.length / 4))
  for (let index = 0; index < samples.length; index += step) {
    const point = samples[index]
    if (!point) continue
    for (const ray of SKY_RAYS) {
      // The half of the sky in front of the face, and a little beyond it.
      const weight = Math.max(0, dot(ray, normal) + 0.35)
      if (weight <= 0) continue
      total += weight
      if (blocked(point, ray, occluders, self) === null) open += weight
    }
  }
  return total > 0 ? open / total : 1
}

/** Whether a point on a face's plane lies inside the (convex) face. */
function inside(face: Face, point: Vec3): boolean {
  const { points, normal } = face
  return points.every((current, index) => {
    const next = points[(index + 1) % points.length] ?? current
    return dot(cross(sub(next, current), sub(point, current)), normal) >= -1e-9
  })
}

/** A face's area. */
export function areaOf(face: Face): number {
  const [first] = face.points
  let area = 0
  if (!first) return area
  for (let index = 1; index < face.points.length - 1; index++) {
    const b = face.points[index]
    const c = face.points[index + 1]
    if (b && c) area += length(cross(sub(b, first), sub(c, first))) / 2
  }
  return area
}

/**
 * Points spread over a face, a little in from its edges and lifted off it,
 * so a ray from them does not start inside the part that owns the face.
 * More points on larger faces.
 */
function samplesOf(face: Face): Vec3[] {
  const area = areaOf(face)
  let count = 1
  if (area > 4) count = 7
  else if (area > 0.6) count = 5
  else if (area > 0.05) count = 2

  const [first, second] = face.points
  const u = normalize(first && second ? sub(second, first) : [1, 0, 0])
  const v = cross(face.normal, u)
  const center = centroid(face.points)
  const coords = face.points.map((point) => {
    const offset = sub(point, center)
    return [dot(offset, u), dot(offset, v)] as const
  })
  const u0 = Math.min(...coords.map(([a]) => a))
  const u1 = Math.max(...coords.map(([a]) => a))
  const v0 = Math.min(...coords.map(([, b]) => b))
  const v1 = Math.max(...coords.map(([, b]) => b))
  const lift = scale(face.normal, 0.004)
  const points: Vec3[] = []
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      const a = u0 + ((i + 0.5) / count) * (u1 - u0)
      const b = v0 + ((j + 0.5) / count) * (v1 - v0)
      const point = add(center, add(scale(u, a), scale(v, b)))
      if (inside(face, point)) points.push(add(point, lift))
    }
  }
  if (points.length === 0) points.push(add(center, lift))
  return points
}

/** A colour, or a ramp between two along a world-space coordinate. */
export interface Fill {
  /** At `t = 0`: the shadowed side of a ramp, or the one colour. */
  readonly from: Linear
  /** At `t = 1`; the same as `from` for a single colour. */
  readonly to: Linear
  /** `t = dot(gradient, point) + offset`; zero for a single colour. */
  readonly gradient: Vec3
  readonly offset: number
}

export interface Paint {
  /** Before the roof: lit wherever the shell does not hide the key. */
  readonly base: Fill
  /** Once the roof is on, where it differs from the base. */
  readonly shade: Fill | null
}

const flat = (colour: Linear): Fill => ({
  from: colour,
  to: colour,
  gradient: [0, 0, 0],
  offset: 0,
})

/** Whether a fill is a ramp rather than one colour. */
export const isRamp = (fill: Fill) => length(fill.gradient) > 0

/** Whether two colours differ enough to be seen as two. */
const differs = (a: Linear, b: Linear) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) > 0.004

/**
 * The key's visibility over a face, as a single colour or a ramp across the
 * soft edge of a shadow.
 *
 * The hard shadow is found from the samples (blocked or not, along the key's
 * centre); where some are blocked and some are not, the edge between them is
 * placed along the direction that separates them, and given the width a
 * broad light of `KEY_RADIUS` casts at the blocker's distance.
 */
function keyFill(
  face: Face,
  samples: readonly Vec3[],
  albedo: Linear,
  occluders: readonly Occluder[],
  self: Part,
  sky: number
): Fill {
  const open = lit(albedo, irradiance(face.normal, 1, sky))
  if (dot(face.normal, KEY) <= 0) return flat(open)
  const closed = lit(albedo, irradiance(face.normal, 0, sky))

  const hits = samples.map((point) => blocked(point, KEY, occluders, self))
  const distances = hits.filter((hit): hit is number => hit !== null)
  if (distances.length === 0) return flat(open)
  if (distances.length === samples.length) return flat(closed)

  const litPoints = samples.filter((_, index) => hits[index] === null)
  const darkPoints = samples.filter((_, index) => hits[index] !== null)
  const toward = sub(centroid(litPoints), centroid(darkPoints))
  const along = normalize(
    sub(toward, scale(face.normal, dot(toward, face.normal)))
  )
  const coordinate = (point: Vec3) => dot(along, point)
  // The edge, found between the last shadowed and the first lit sample by
  // halving: a few rays place it far more finely than the samples are set.
  const last = darkPoints.reduce((a, b) =>
    coordinate(b) > coordinate(a) ? b : a
  )
  const first = litPoints.reduce((a, b) =>
    coordinate(b) < coordinate(a) ? b : a
  )
  let dark = last
  let light = first
  for (let step = 0; step < 7; step++) {
    const half = scale(add(dark, light), 0.5)
    if (blocked(half, KEY, occluders, self) === null) light = half
    else dark = half
  }
  const edge = coordinate(scale(add(dark, light), 0.5))
  const distance =
    distances.reduce((sum, value) => sum + value, 0) / distances.length
  const width = Math.max(0.08, 2 * Math.tan(KEY_RADIUS) * distance)
  // t = 0 at `edge - width / 2`, in shadow; 1 at `edge + width / 2`, lit.
  return {
    from: closed,
    to: open,
    gradient: scale(along, 1 / width),
    offset: 0.5 - edge / width,
  }
}

/** One face of the model, with its paint. */
export interface ShadedFace {
  readonly part: Part
  readonly face: Face
  readonly paint: Paint
}

function shadeFace(item: Part, face: Face): ShadedFace {
  const albedo = ALBEDO[materialOf(item, face)]
  // The terrace and the plinth are lit in the open; a face turned from the
  // camera is never seen, by either renderer, so its light is not worked out.
  if (!item.receives || !facesEye(face.normal, centroid(face.points))) {
    const open = flat(shadeOpen(albedo, face.normal))
    return { part: item, face, paint: { base: open, shade: null } }
  }
  const samples = samplesOf(face)
  const skyAfter = skyOf(samples, face.normal, OCCLUDERS, item)
  const final = keyFill(face, samples, albedo, OCCLUDERS, item, skyAfter)
  // A part that arrives after the roof is only ever seen under it.
  if (item.stage > ROOF_STAGE) {
    return { part: item, face, paint: { base: final, shade: null } }
  }
  const skyBefore = skyOf(samples, face.normal, SHELL_OCCLUDERS, item)
  const base = keyFill(face, samples, albedo, SHELL_OCCLUDERS, item, skyBefore)
  const same =
    !differs(base.from, final.from) &&
    !differs(base.to, final.to) &&
    length(sub(base.gradient, final.gradient)) < 1e-6
  return { part: item, face, paint: { base, shade: same ? null : final } }
}

/** Each part's extent, to skip the parts a point cannot be in. */
const BOUNDS = new Map(
  PARTS.map((item) => {
    const points = item.solid.faces.flatMap((face) => face.points)
    const low = [0, 1, 2].map((axis) =>
      Math.min(...points.map((point) => point[axis] ?? 0))
    )
    const high = [0, 1, 2].map((axis) =>
      Math.max(...points.map((point) => point[axis] ?? 0))
    )
    return [item, { low, high }] as const
  })
)

/** Whether a point is inside a convex solid, or on its surface. */
function within(point: Vec3, item: Part): boolean {
  const box = BOUNDS.get(item)
  if (
    box &&
    point.some(
      (value, axis) =>
        value < (box.low[axis] ?? 0) - 1e-6 ||
        value > (box.high[axis] ?? 0) + 1e-6
    )
  ) {
    return false
  }
  return item.solid.faces.every(({ points, normal }) => {
    const anchor = points[0]
    return !anchor || dot(normal, sub(point, anchor)) <= 1e-6
  })
}

/**
 * Whether a face lies against another part, all of it: a wall's top under
 * its roof, a shelf's back on the wall, a leg's top under its seat. No one
 * can see such a face, so neither renderer draws it.
 */
function buried(item: Part, face: Face): boolean {
  const center = centroid(face.points)
  const probes = face.points.map((point) =>
    add(add(point, scale(sub(center, point), 0.02)), scale(face.normal, 1e-3))
  )
  return PARTS.some(
    (other) => other !== item && probes.every((probe) => within(probe, other))
  )
}

let cache: readonly ShadedFace[] | null = null

/**
 * The shading, a part at a time: every face of the model that can be seen
 * from somewhere, shaded, and kept once done.
 *
 * Tens of milliseconds of ray casting in all. The server runs it whole
 * (`shadedFaces`); the WebGL renderer runs it a few milliseconds per frame
 * on the shared loop (`vault/webgl/cafe/scene.tsx`), so it is never one long
 * task on the reader's main thread.
 */
export function* shading(): Generator<void, readonly ShadedFace[]> {
  if (cache) return cache
  const faces: ShadedFace[] = []
  for (const item of PARTS) {
    for (const face of item.solid.faces) {
      // A face turned from the camera is never seen; only one turned to it
      // is worth asking whether something covers it.
      const seen = facesEye(face.normal, centroid(face.points))
      if (seen && buried(item, face)) continue
      faces.push(shadeFace(item, face))
    }
    yield
  }
  cache = faces
  return faces
}

/** Every face of the model, shaded: the whole of `shading`, at once. */
export function shadedFaces(): readonly ShadedFace[] {
  if (cache) return cache
  const steps = shading()
  let step = steps.next()
  while (!step.done) step = steps.next()
  return step.value
}

/** A ramp's coordinate at a point, clamped to 0–1. */
export const rampAt = (fill: Fill, point: Vec3) =>
  Math.min(1, Math.max(0, dot(fill.gradient, point) + fill.offset))

/** The pool's opacity at `r`, a share of its radius from the centre. */
export function poolFalloff(r: number): number {
  const x = Math.min(1, Math.max(0, r))
  const s = x * x * (3 - 2 * x)
  return (1 - s) ** 1.5
}
