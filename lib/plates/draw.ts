/**
 * The pen a plate is drawn with: path data from points, and a sheet that
 * collects marks by role and text in order.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The arrowhead, the wrapping estimate and the door arc follow
 * `docs/r4-arah-visual/gambar.py` and `pelat_dasar.py`, which drew the stills
 * the owner chose (R4, 24 October 2026); they are restated, not transcribed,
 * so that the site owns the drawing it serves.
 */

import type { MarkRole, Plate, PlateMark, PlateText, TextRole } from './types'

export type Point = readonly [number, number]

/** A tenth of a unit is finer than any plate is ever shown. */
function num(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return Object.is(rounded, -0) ? '0' : String(rounded)
}

function point([x, y]: Point): string {
  return `${num(x)} ${num(y)}`
}

/** An open run of straight lines. */
export function polyline(points: readonly Point[]): string {
  const [first, ...rest] = points
  if (!first) return ''
  return `M${point(first)}${rest.map((p) => `L${point(p)}`).join('')}`
}

/** A closed outline. */
export function polygon(points: readonly Point[]): string {
  return points.length > 0 ? `${polyline(points)}Z` : ''
}

export function segment(a: Point, b: Point): string {
  return polyline([a, b])
}

export function rectangle(x: number, y: number, w: number, h: number): string {
  return polygon([
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ])
}

/** A full circle, as two half arcs: one subpath either renderer can stroke. */
export function circle([cx, cy]: Point, r: number): string {
  return `M${point([cx - r, cy])}A${num(r)} ${num(r)} 0 1 0 ${point([cx + r, cy])}A${num(r)} ${num(r)} 0 1 0 ${point([cx - r, cy])}Z`
}

/**
 * An arc about `centre` from angle `from` through `sweep` radians, both in
 * the plate's own sense: y runs down, so a positive sweep turns clockwise on
 * screen, which is SVG's sweep flag 1.
 */
export function arc(
  centre: Point,
  r: number,
  from: number,
  sweep: number
): string {
  const [cx, cy] = centre
  const start: Point = [cx + r * Math.cos(from), cy + r * Math.sin(from)]
  const end: Point = [
    cx + r * Math.cos(from + sweep),
    cy + r * Math.sin(from + sweep),
  ]
  return `M${point(start)}A${num(r)} ${num(r)} 0 0 ${sweep > 0 ? 1 : 0} ${point(end)}`
}

/** A filled arrowhead with its tip on `b`, pointing away from `a`. */
export function arrowhead(a: Point, b: Point, size: number): Point[] {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const length = Math.hypot(dx, dy) || 1
  const ux = dx / length
  const uy = dy / length
  const base: Point = [b[0] - ux * size, b[1] - uy * size]
  const half = size / 2
  return [
    b,
    [base[0] - uy * half, base[1] + ux * half],
    [base[0] + uy * half, base[1] - ux * half],
  ]
}

/** Geist Mono's advance, which is what a plate's notes are set in. */
const MONO_ADVANCE = 0.6

/**
 * Lines of a note broken to fit `width`, estimated from the mono advance.
 *
 * An estimate, not a measurement, and a slightly generous one, the same
 * figure the stills were drawn with: a monospaced face is the one case where
 * counting characters is close to exact.
 */
export function wrap(text: string, size: number, width: number): string[] {
  const perLine = Math.max(1, Math.floor(width / (size * MONO_ADVANCE)))
  const lines: string[] = []
  let current = ''
  for (const word of text.split(/\s+/u).filter(Boolean)) {
    const next = current ? `${current} ${word}` : word
    if (current && next.length > perLine) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Options a run of text may carry beyond its role and position. */
type TextOptions = Omit<PlateText, 'role' | 'x' | 'y' | 'lines'>

/**
 * Collects one plate: marks merged by role in the order each role first
 * appears, and text in the order it was placed.
 */
export function sheet() {
  const marks = new Map<MarkRole, string[]>()
  const texts: PlateText[] = []

  function mark(role: MarkRole, d: string) {
    if (!d) return
    const paths = marks.get(role)
    if (paths) paths.push(d)
    else marks.set(role, [d])
  }

  function text(
    role: TextRole,
    x: number,
    y: number,
    content: string | readonly string[],
    options: TextOptions = {}
  ) {
    const lines = typeof content === 'string' ? content.split('\n') : content
    texts.push({ role, x, y, lines, ...options })
  }

  /** A polyline ending in a filled arrowhead. */
  function arrow(role: MarkRole, points: readonly Point[], size: number) {
    mark(role, polyline(points))
    const tip = points.at(-1)
    const from = points.at(-2)
    if (tip && from) mark('arrow', polygon(arrowhead(from, tip, size)))
  }

  /** The plate, as one sheet unless it names its parts. */
  function done(
    unit: Plate['unit'],
    viewBox: Plate['viewBox'],
    parts: Plate['parts'] = [{ id: 'sheet', rect: viewBox }]
  ): Plate {
    const merged: PlateMark[] = [...marks].map(([role, paths]) => ({
      role,
      d: paths.join(''),
    }))
    return { unit, viewBox, marks: merged, texts, parts }
  }

  return { mark, text, arrow, done }
}

export type Sheet = ReturnType<typeof sheet>
