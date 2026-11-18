/**
 * Solids for the café illustration: convex polyhedra made of planar faces.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * Every part of the model is one convex solid, and every face of a solid is a
 * convex planar polygon whose points run counter-clockwise seen from outside,
 * with its outward normal. Convexity is what keeps both renderers simple: a
 * ray meets a solid in one interval (`light.ts` casts the shadows that way),
 * and the faces of one solid that face the camera never cover each other
 * (`still.ts` only has to order faces of different solids).
 */

export type Vec3 = readonly [number, number, number]

export const add = (a: Vec3, b: Vec3): Vec3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
]
export const sub = (a: Vec3, b: Vec3): Vec3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
]
export const scale = (a: Vec3, k: number): Vec3 => [
  a[0] * k,
  a[1] * k,
  a[2] * k,
]
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
export const length = (a: Vec3) => Math.hypot(a[0], a[1], a[2])
export function normalize(a: Vec3): Vec3 {
  const size = length(a)
  return size > 0 ? scale(a, 1 / size) : [0, 0, 0]
}

/** The mean of some points. */
export function centroid(points: readonly Vec3[]): Vec3 {
  let x = 0
  let y = 0
  let z = 0
  for (const [px, py, pz] of points) {
    x += px
    y += py
    z += pz
  }
  const n = Math.max(points.length, 1)
  return [x / n, y / n, z / n]
}

/** A planar convex polygon, counter-clockwise from outside. */
export interface Face {
  readonly points: readonly Vec3[]
  /** Outward, unit length. */
  readonly normal: Vec3
}

/** A convex polyhedron. */
export interface Solid {
  readonly faces: readonly Face[]
  readonly center: Vec3
}

/** Newell's normal: robust for any planar polygon, whatever its winding. */
function newell(points: readonly Vec3[]): Vec3 {
  let x = 0
  let y = 0
  let z = 0
  points.forEach((current, index) => {
    const next = points[(index + 1) % points.length] ?? current
    x += (current[1] - next[1]) * (current[2] + next[2])
    y += (current[2] - next[2]) * (current[0] + next[0])
    z += (current[0] - next[0]) * (current[1] + next[1])
  })
  return normalize([x, y, z])
}

/**
 * A solid from its polygons, each turned to face outward: a polygon whose
 * normal points into the solid is reversed. That leaves the primitives below
 * free to list a profile in either direction.
 */
function solid(polygons: readonly (readonly Vec3[])[]): Solid {
  const center = centroid(polygons.flat())
  const faces = polygons.map((points) => {
    const normal = newell(points)
    const outward = dot(normal, sub(centroid(points), center)) >= 0
    return outward
      ? { points, normal }
      : { points: [...points].reverse(), normal: scale(normal, -1) }
  })
  return { faces, center }
}

/** An axis-aligned box from its two opposite corners. */
export function box(min: Vec3, max: Vec3): Solid {
  const [x0, y0, z0] = min
  const [x1, y1, z1] = max
  return solid([
    [
      [x0, y0, z1],
      [x1, y0, z1],
      [x1, y1, z1],
      [x0, y1, z1],
    ],
    [
      [x1, y0, z0],
      [x0, y0, z0],
      [x0, y1, z0],
      [x1, y1, z0],
    ],
    [
      [x1, y0, z1],
      [x1, y0, z0],
      [x1, y1, z0],
      [x1, y1, z1],
    ],
    [
      [x0, y0, z0],
      [x0, y0, z1],
      [x0, y1, z1],
      [x0, y1, z0],
    ],
    [
      [x0, y1, z1],
      [x1, y1, z1],
      [x1, y1, z0],
      [x0, y1, z0],
    ],
    [
      [x0, y0, z0],
      [x1, y0, z0],
      [x1, y0, z1],
      [x0, y0, z1],
    ],
  ])
}

/** The axis a profile is extruded along. */
export type Axis = 'x' | 'y' | 'z'

/**
 * A convex profile extruded along an axis, between two positions on it.
 *
 * The profile's two coordinates are the other two axes in this order: for
 * `z`, (x, y); for `x`, (z, y); for `y`, (x, z). A sloped roof is a profile
 * along `z`, a round table top a polygon along `y`.
 */
export function prism(
  axis: Axis,
  profile: readonly (readonly [number, number])[],
  from: number,
  to: number
): Solid {
  const at = ([a, b]: readonly [number, number], along: number): Vec3 => {
    if (axis === 'z') return [a, b, along]
    if (axis === 'x') return [along, b, a]
    return [a, along, b]
  }
  const near = profile.map((point) => at(point, from))
  const far = profile.map((point) => at(point, to))
  const sides = profile.map((_, index) => {
    const next = (index + 1) % profile.length
    return [
      near[index] ?? near[0] ?? [0, 0, 0],
      near[next] ?? near[0] ?? [0, 0, 0],
      far[next] ?? far[0] ?? [0, 0, 0],
      far[index] ?? far[0] ?? [0, 0, 0],
    ] as const
  })
  return solid([near, far, ...sides])
}

/** A regular polygon's points around a centre, for `prism('y', …)`. */
export function ngon(
  cx: number,
  cz: number,
  radius: number,
  sides: number,
  turn = 0
): [number, number][] {
  return Array.from({ length: sides }, (_, index) => {
    const angle = turn + (index / sides) * Math.PI * 2
    return [cx + Math.cos(angle) * radius, cz + Math.sin(angle) * radius]
  })
}

/** A cylinder, as an upright regular prism. */
export const column = (
  cx: number,
  cz: number,
  radius: number,
  y0: number,
  y1: number,
  sides = 8
) => prism('y', ngon(cx, cz, radius, sides, Math.PI / sides), y0, y1)

/** A truncated cone, upright: a lamp shade, a hopper. */
export function frustum(
  cx: number,
  cz: number,
  bottom: number,
  top: number,
  y0: number,
  y1: number,
  sides = 8
): Solid {
  const turn = Math.PI / sides
  const ring = (radius: number, y: number): Vec3[] =>
    ngon(cx, cz, radius, sides, turn).map(([x, z]) => [x, y, z])
  const lower = ring(bottom, y0)
  const upper = ring(top, y1)
  const sidesOf = lower.map((point, index) => {
    const next = (index + 1) % sides
    return [
      point,
      lower[next] ?? point,
      upper[next] ?? point,
      upper[index] ?? point,
    ] as const
  })
  return solid([lower, upper, ...sidesOf])
}

/** A regular icosahedron: a low-poly mass of leaves. */
export function icosahedron(center: Vec3, radius: number): Solid {
  const t = (1 + Math.sqrt(5)) / 2
  const raw: Vec3[] = [
    [-1, t, 0],
    [1, t, 0],
    [-1, -t, 0],
    [1, -t, 0],
    [0, -1, t],
    [0, 1, t],
    [0, -1, -t],
    [0, 1, -t],
    [t, 0, -1],
    [t, 0, 1],
    [-t, 0, -1],
    [-t, 0, 1],
  ]
  const points = raw.map((point) =>
    add(center, scale(normalize(point), radius))
  )
  const triangles = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ] as const
  return solid(
    triangles.map((triangle) =>
      triangle.map((index) => points[index] ?? center)
    )
  )
}

/**
 * Where a ray meets a convex solid, as the distance along the ray to the
 * point it enters, or `null` when it misses. The ray starts outside, so a
 * ray that begins inside reports the distance 0.
 */
export function enter(
  origin: Vec3,
  direction: Vec3,
  body: Solid
): number | null {
  let near = 0
  let far = Number.POSITIVE_INFINITY
  // Scalar arithmetic only: this runs for every shadow ray (`light.ts`).
  for (const { points, normal } of body.faces) {
    const anchor = points[0]
    if (!anchor) continue
    const [nx, ny, nz] = normal
    const along = nx * direction[0] + ny * direction[1] + nz * direction[2]
    const outside =
      nx * (origin[0] - anchor[0]) +
      ny * (origin[1] - anchor[1]) +
      nz * (origin[2] - anchor[2])
    if (Math.abs(along) < 1e-12) {
      if (outside > 0) return null
      continue
    }
    const t = -outside / along
    if (along < 0) near = Math.max(near, t)
    else far = Math.min(far, t)
    if (near > far) return null
  }
  return far > 1e-6 ? near : null
}
