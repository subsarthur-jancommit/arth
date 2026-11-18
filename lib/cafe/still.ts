/**
 * The still: the café projected to a flat-shaded SVG, from the same model,
 * camera and light as the WebGL renderer.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The polygon clipping is Sutherland–Hodgman and the ordering a topological
 * sort (Kahn), both written here from their textbook definitions.
 *
 * ## Why an SVG, worked out from the model
 *
 * Without WebGL, under reduced motion, before the canvas has drawn and after
 * a lost context, the reader sees this instead (CLAUDE.md #14). Built from
 * the same faces, the same camera (`view.ts`) and the same paint
 * (`light.ts`), it is the same picture by construction, not a render kept in
 * sync by hand: change the model and both change. Nothing is rendered on a
 * laptop and nothing is downloaded; the server writes it into the page.
 *
 * ## Order
 *
 * SVG paints in document order, so the faces are ordered back to front.
 * Sorting by distance is not enough for a model of long walls and small
 * chairs, so every pair of faces whose outlines overlap on screen is asked
 * which is in front where they overlap, and the answers are sorted
 * topologically. Among the faces free to go next, the sort keeps to the
 * stage it is in, so each assembly stage falls into as few runs as the
 * depth order allows: each run is one animated group (`still.tsx`).
 */

import { DROP } from './assembly'
import { encode, hex, type Linear, quantize, toLinear } from './color'
import { centroid, dot, type Face, sub, type Vec3 } from './geometry'
import {
  type Fill,
  isRamp,
  poolFalloff,
  type ShadedFace,
  shadedFaces,
} from './light'
import { type Footprint, FOOTPRINTS, POOL, type Stage, STAGES } from './model'
import {
  facesEye,
  project,
  rayThrough,
  toCamera,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from './view'

type Point = readonly [number, number]

/** Encoded sRGB as the hex both renderers show. */
const shown = (colour: Linear) => hex(quantize(encode(colour)))

/** A polygon's points, as the `points` attribute writes them. */
const pointsOf = (points: readonly Point[]) =>
  points.map(([x, y]) => `${round(x)},${round(y)}`).join(' ')

const round = (value: number) => Math.round(value * 10) / 10

function signedArea(polygon: readonly Point[]): number {
  let area = 0
  polygon.forEach(([x0, y0], index) => {
    const [x1, y1] = polygon[(index + 1) % polygon.length] ?? [x0, y0]
    area += x0 * y1 - x1 * y0
  })
  return area / 2
}

/** The part of convex `subject` inside convex `clip` (Sutherland–Hodgman). */
export function clipConvex(
  subject: readonly Point[],
  clip: readonly Point[]
): Point[] {
  const orientation = Math.sign(signedArea(clip)) || 1
  let output: Point[] = [...subject]
  clip.forEach(([ax, ay], index) => {
    const [bx, by] = clip[(index + 1) % clip.length] ?? [ax, ay]
    const inside = ([px, py]: Point) =>
      orientation * ((bx - ax) * (py - ay) - (by - ay) * (px - ax)) >= 0
    // Where P→Q meets the line A→B: cross(B − A, P + t(Q − P) − A) = 0.
    const crossing = ([px, py]: Point, [qx, qy]: Point): Point => {
      const ex = qx - px
      const ey = qy - py
      const denominator = (bx - ax) * ey - (by - ay) * ex
      const side = (bx - ax) * (py - ay) - (by - ay) * (px - ax)
      const t = denominator === 0 ? 0 : -side / denominator
      return [px + ex * t, py + ey * t]
    }
    const input = output
    output = []
    input.forEach((current, i) => {
      const previous = input[(i + input.length - 1) % input.length] ?? current
      if (inside(current)) {
        if (!inside(previous)) output.push(crossing(previous, current))
        output.push(current)
      } else if (inside(previous)) {
        output.push(crossing(previous, current))
      }
    })
  })
  return output
}

/** The mean of some screen points. */
function middle(points: readonly Point[]): Point {
  let x = 0
  let y = 0
  for (const [px, py] of points) {
    x += px
    y += py
  }
  const n = Math.max(points.length, 1)
  return [x / n, y / n]
}

/** A face as the sort sees it. */
interface Node {
  readonly shaded: ShadedFace
  readonly screen: Point[]
  readonly bounds: readonly [number, number, number, number]
  /** Distance of its centre from the eye. */
  readonly depth: number
  /** Its plane in camera space: `dot(normal, p) = distance`. */
  readonly normal: Vec3
  readonly distance: number
}

function nodeOf(shaded: ShadedFace): Node {
  const projected = shaded.face.points.map((point) => project(point))
  const screen = projected.map(({ x, y }): Point => [x, y])
  const xs = screen.map(([x]) => x)
  const ys = screen.map(([, y]) => y)
  const [first] = shaded.face.points
  const anchor = toCamera(first ?? [0, 0, 0])
  // The normal as a direction: the camera transform without its translation.
  const tip = toCamera([
    (first?.[0] ?? 0) + shaded.face.normal[0],
    (first?.[1] ?? 0) + shaded.face.normal[1],
    (first?.[2] ?? 0) + shaded.face.normal[2],
  ])
  const normal = sub(tip, anchor)
  return {
    shaded,
    screen,
    bounds: [
      Math.min(...xs),
      Math.min(...ys),
      Math.max(...xs),
      Math.max(...ys),
    ],
    depth: -toCamera(centroid(shaded.face.points))[2],
    normal,
    distance: dot(normal, anchor),
  }
}

/** Distance from the eye to a node's plane, through a screen point. */
function depthAt(node: Node, [x, y]: Point): number | null {
  const ray = rayThrough(x, y)
  const along = dot(node.normal, ray)
  if (Math.abs(along) < 1e-9) return null
  return node.distance / along
}

/**
 * Which of two overlapping faces is behind, or `null` when their outlines do
 * not overlap or the question has no answer (edge-on, or touching only).
 */
function behind(a: Node, b: Node): Node | null {
  const [ax0, ay0, ax1, ay1] = a.bounds
  const [bx0, by0, bx1, by1] = b.bounds
  if (ax1 <= bx0 || bx1 <= ax0 || ay1 <= by0 || by1 <= ay0) return null
  const overlap = clipConvex(a.screen, b.screen)
  if (overlap.length < 3 || Math.abs(signedArea(overlap)) < 0.5) return null
  const at = middle(overlap)
  const da = depthAt(a, at)
  const db = depthAt(b, at)
  if (da === null || db === null || Math.abs(da - db) < 1e-6) return null
  return da > db ? a : b
}

/**
 * Back to front, keeping each stage's faces together where the depth order
 * allows (Kahn's algorithm, choosing among the free faces).
 */
function order(nodes: readonly Node[]): Node[] {
  const after = nodes.map(() => [] as number[])
  const waiting = nodes.map(() => 0)
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    if (!a) continue
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]
      if (!b || a.shaded.part === b.shaded.part) continue
      const back = behind(a, b)
      if (!back) continue
      const [from, to] = back === a ? [i, j] : [j, i]
      after[from]?.push(to)
      waiting[to] = (waiting[to] ?? 0) + 1
    }
  }

  const done = nodes.map(() => false)
  const sorted: Node[] = []
  let stage: Stage | null = null
  while (sorted.length < nodes.length) {
    const free = nodes
      .map((node, index) => ({ node, index }))
      .filter(({ index }) => !done[index] && waiting[index] === 0)
    // A cycle: release the farthest face left, as a painter would.
    const pool =
      free.length > 0
        ? free
        : nodes
            .map((node, index) => ({ node, index }))
            .filter(({ index }) => !done[index])
            .sort((p, q) => q.node.depth - p.node.depth)
            .slice(0, 1)
    const sameStage = pool.filter(
      ({ node }) => node.shaded.part.stage === stage
    )
    const choices = sameStage.length > 0 ? sameStage : pool
    // Stay in the stage with the most faces free, farthest first.
    const counts = new Map<Stage, number>()
    for (const { node } of choices) {
      const s = node.shaded.part.stage
      counts.set(s, (counts.get(s) ?? 0) + 1)
    }
    let best: { node: Node; index: number } | undefined
    for (const choice of choices) {
      if (!best) {
        best = choice
        continue
      }
      const countChoice = counts.get(choice.node.shaded.part.stage) ?? 0
      const countBest = counts.get(best.node.shaded.part.stage) ?? 0
      if (
        countChoice > countBest ||
        (countChoice === countBest && choice.node.depth > best.node.depth)
      ) {
        best = choice
      }
    }
    if (!best) break
    done[best.index] = true
    sorted.push(best.node)
    stage = best.node.shaded.part.stage
    for (const next of after[best.index] ?? []) {
      waiting[next] = (waiting[next] ?? 0) - 1
    }
  }
  return sorted
}

/** A linear gradient in the still's space. */
export interface StillGradient {
  readonly id: string
  readonly x1: number
  readonly y1: number
  readonly x2: number
  readonly y2: number
  readonly from: string
  readonly to: string
}

/**
 * A ramp's coordinate, fitted as an affine function of the still's own x
 * and y over a face's corners (least squares), and written as the two ends
 * of an SVG linear gradient: `t` is 0 at the first and 1 at the second.
 */
function gradientOf(id: string, fill: Fill, face: Face): StillGradient {
  const rows = face.points.map((point) => {
    const { x, y } = project(point)
    return { x, y, t: dot(fill.gradient, point) + fill.offset }
  })
  const n = rows.length
  const mx = rows.reduce((sum, row) => sum + row.x, 0) / n
  const my = rows.reduce((sum, row) => sum + row.y, 0) / n
  const mt = rows.reduce((sum, row) => sum + row.t, 0) / n
  let sxx = 0
  let sxy = 0
  let syy = 0
  let sxt = 0
  let syt = 0
  for (const row of rows) {
    const dx = row.x - mx
    const dy = row.y - my
    const dt = row.t - mt
    sxx += dx * dx
    sxy += dx * dy
    syy += dy * dy
    sxt += dx * dt
    syt += dy * dt
  }
  const determinant = sxx * syy - sxy * sxy
  const a =
    Math.abs(determinant) > 1e-9 ? (sxt * syy - syt * sxy) / determinant : 0
  const b =
    Math.abs(determinant) > 1e-9 ? (syt * sxx - sxt * sxy) / determinant : 0
  const size = a * a + b * b
  // t(x, y) = mt + a (x - mx) + b (y - my). Its zero along the gradient,
  // and one gradient's length further on.
  const start: Point =
    size > 0 ? [mx - (a * mt) / size, my - (b * mt) / size] : [mx, my]
  const end: Point =
    size > 0 ? [start[0] + a / size, start[1] + b / size] : [mx + 1, my]
  return {
    id,
    x1: round(start[0]),
    y1: round(start[1]),
    x2: round(end[0]),
    y2: round(end[1]),
    from: shown(fill.from),
    to: shown(fill.to),
  }
}

/** One painted polygon: a hex colour, or a gradient's id. */
export interface StillPolygon {
  readonly points: string
  readonly fill: string
  readonly gradient: string | null
}

/** A contact shadow, blurred and kept to the surface it lies on. */
export interface StillContact {
  readonly id: string
  readonly points: string
  readonly opacity: number
  /** The blur filter's index in `Still.blurs`. */
  readonly blur: number
  /** The receiving face's clip, or `null` on the ground. */
  readonly clip: string | null
  readonly stage: Stage
}

export interface StillFace {
  readonly id: string
  readonly base: StillPolygon
  readonly shade: StillPolygon | null
  readonly contacts: readonly StillContact[]
}

export interface StillRun {
  readonly stage: Stage
  readonly faces: readonly StillFace[]
}

export interface Still {
  readonly width: number
  readonly height: number
  readonly gradients: readonly StillGradient[]
  /**
   * Blurs, as standard deviations along the still's x and y: a contact
   * shadow lies on the ground, so its softness is foreshortened like it.
   */
  readonly blurs: readonly (readonly [number, number])[]
  readonly clips: readonly { readonly id: string; readonly points: string }[]
  readonly pool: {
    readonly points: string
    /** The radial gradient's transform: unit circle to the pool's ellipse. */
    readonly transform: string
    readonly color: string
    readonly stops: readonly {
      readonly offset: number
      readonly opacity: number
    }[]
  }
  readonly ground: readonly StillContact[]
  readonly runs: readonly StillRun[]
  /** Each stage's drop on screen, for its animation. */
  readonly drops: Readonly<
    Record<Stage, { readonly x: number; readonly y: number }>
  >
}

/**
 * A blur's standard deviations on screen, rounded to a step of 1.5 units so
 * that contact shadows share a few filters.
 */
const quantum = (value: number) => Math.max(1, Math.round(value / 1.5) * 1.5)

/**
 * A ground-plane Gaussian of `sigma` metres at `point`, as seen: the spread
 * of its two axes, projected, measured along the still's x and y.
 */
function blurAt(point: Vec3, sigma: number): readonly [number, number] {
  const at = project(point)
  const x = project([point[0] + 1, point[1], point[2]])
  const z = project([point[0], point[1], point[2] + 1])
  const ux = x.x - at.x
  const uy = x.y - at.y
  const vx = z.x - at.x
  const vy = z.y - at.y
  return [
    quantum(sigma * Math.hypot(ux, vx)),
    quantum(sigma * Math.hypot(uy, vy)),
  ]
}

function contactOf(
  print: Footprint,
  clip: string | null,
  blurs: [number, number][]
): StillContact {
  const y = print.y + 0.001
  const corners: Vec3[] = [
    [print.x0, y, print.z0],
    [print.x1, y, print.z0],
    [print.x1, y, print.z1],
    [print.x0, y, print.z1],
  ]
  const screen = corners.map((corner): Point => {
    const { x, y: sy } = project(corner)
    return [x, sy]
  })
  const center: Vec3 = [(print.x0 + print.x1) / 2, y, (print.z0 + print.z1) / 2]
  const [sx, sy] = blurAt(center, print.soft)
  let blur = blurs.findIndex(([bx, by]) => bx === sx && by === sy)
  if (blur < 0) blur = blurs.push([sx, sy]) - 1
  return {
    id: print.id,
    points: pointsOf(screen),
    opacity: print.strength,
    blur,
    clip,
    stage: print.stage,
  }
}

/** The pool of light: a disc on the ground, as a polygon and a gradient. */
function poolOf(): Still['pool'] {
  const [cx, , cz] = POOL.center
  const outline = Array.from({ length: 72 }, (_, index): Point => {
    const angle = (index / 72) * Math.PI * 2
    const { x, y } = project([
      cx + Math.cos(angle) * POOL.radius,
      0,
      cz + Math.sin(angle) * POOL.radius,
    ])
    return [x, y]
  })
  const c = project([cx, 0, cz])
  const u = project([cx + POOL.radius, 0, cz])
  const v = project([cx, 0, cz + POOL.radius])
  const matrix = [u.x - c.x, u.y - c.y, v.x - c.x, v.y - c.y, c.x, c.y]
    .map((value) => round(value))
    .join(' ')
  return {
    points: pointsOf(outline),
    transform: `matrix(${matrix})`,
    color: shown(toLinear(POOL.color)),
    stops: [0, 0.2, 0.4, 0.6, 0.8, 1].map((offset) => ({
      offset,
      opacity: Math.round(POOL.alpha * poolFalloff(offset) * 1000) / 1000,
    })),
  }
}

/** Each stage's drop, measured on screen at the stage's own centre. */
function dropsOf(): Still['drops'] {
  const entries = STAGES.map((_, index) => {
    const stage = index as Stage
    const points = shadedFaces()
      .filter(({ part }) => part.stage === stage)
      .flatMap(({ face }) => face.points)
    const center = centroid(points)
    const from = project(center)
    const to = project([center[0], center[1] + DROP[stage], center[2]])
    return [
      stage,
      { x: round(to.x - from.x), y: round(to.y - from.y) },
    ] as const
  })
  return Object.fromEntries(entries) as Still['drops']
}

function build(): Still {
  const visible = shadedFaces().filter(({ face }) =>
    facesEye(face.normal, centroid(face.points))
  )
  const sorted = order(visible.map(nodeOf))

  const gradients: StillGradient[] = []
  const clips: { id: string; points: string }[] = []
  const blurs: [number, number][] = []
  const paint = (fill: Fill, face: Face, id: string): StillPolygon => {
    const points = pointsOf(
      face.points.map((point): Point => {
        const { x, y } = project(point)
        return [x, y]
      })
    )
    if (!isRamp(fill)) return { points, fill: shown(fill.from), gradient: null }
    const gradient = gradientOf(id, fill, face)
    gradients.push(gradient)
    return { points, fill: gradient.from, gradient: gradient.id }
  }

  /** Footprints by the part they lie on. */
  const onPart = new Map<string, Footprint[]>()
  for (const print of FOOTPRINTS) {
    if (print.receiver === null) continue
    const list = onPart.get(print.receiver) ?? []
    list.push(print)
    onPart.set(print.receiver, list)
  }

  const runs: { stage: Stage; faces: StillFace[] }[] = []
  sorted.forEach((node, index) => {
    const { part, face, paint: shading } = node.shaded
    const id = `f${index}`
    // A part's contact shadows lie on its top face.
    const prints = face.normal[1] > 0.9 ? (onPart.get(part.id) ?? []) : []
    let clip: string | null = null
    if (prints.length > 0) {
      clip = `c${index}`
      clips.push({ id: clip, points: pointsOf(node.screen) })
    }
    const entry: StillFace = {
      id,
      base: paint(shading.base, face, `${id}b`),
      shade: shading.shade ? paint(shading.shade, face, `${id}s`) : null,
      contacts: prints.map((print) => contactOf(print, clip, blurs)),
    }
    const last = runs.at(-1)
    if (last && last.stage === part.stage) last.faces.push(entry)
    else runs.push({ stage: part.stage, faces: [entry] })
  })

  const ground = FOOTPRINTS.filter((print) => print.receiver === null).map(
    (print) => contactOf(print, null, blurs)
  )
  return {
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
    gradients,
    blurs,
    clips,
    pool: poolOf(),
    ground,
    runs,
    drops: dropsOf(),
  }
}

let cache: Still | null = null

/** The still, worked out once per process. */
export function still(): Still {
  cache ??= build()
  return cache
}
