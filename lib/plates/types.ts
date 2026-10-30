/**
 * The vocabulary every working-drawing plate is written in.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The line roles and their weights are the ones `docs/r4-arah-visual/gambar.py`
 * drew the approved stills with (`style_b(flat=True)`, R4, 24 October 2026),
 * restated here so the site draws the same plate the owner chose.
 *
 * ## One description, two renderers
 *
 * A plate is data: paths grouped by what they are for, and text placed in the
 * plate's own units. `vault/blocks/plate` turns it into inline SVG, which is
 * what a reader without WebGL sees and what assistive technology reads. The
 * WebGL material of the stage pages draws the same data into a canvas
 * texture. Neither renderer decides a weight or a dash of its own; both read
 * them from the two tables below, so the flat plate and the lit one cannot
 * drift apart.
 *
 * Colour is not here at all. A plate is drawn in the ink of whatever ground
 * it sits on (`currentColor`), with `ground` meaning the page colour behind
 * it, so the same plate is paper on ink on a stage page and ink on paper in a
 * document.
 */

import type { Unit } from '@/lib/content/units'

/** What a mark is for, which decides how it is drawn. */
export type MarkRole =
  /** Walls the cutting plane passes through. */
  | 'cut'
  /** Columns on the grid, filled solid. */
  | 'column'
  /** The glazing in the shopfront, two thin lines. */
  | 'glass'
  /** Furniture and fittings seen from above. */
  | 'furniture'
  /** Furniture the section cuts through. */
  | 'furnitureCut'
  /** What sits above the cutting plane, dashed. */
  | 'hidden'
  /** The stair's walking line. */
  | 'stair'
  /** A door leaf, drawn open. */
  | 'doorLeaf'
  /** The arc a door leaf sweeps. */
  | 'doorArc'
  /** The guests' route from the street to a table, dashed. */
  | 'guest'
  /** The route of stock, preparation and service, dotted. */
  | 'kitchen'
  /** What the section sees beyond the cut. */
  | 'elevation'
  /** A wall the section sees beyond the cut, lightly filled. */
  | 'elevationWall'
  /** The ground line. */
  | 'ground'
  /** Grid lines through the columns, chain-dashed. */
  | 'axis'
  /** Dimension lines, lane rules and column rules. */
  | 'dimension'
  /** The oblique tick where a dimension meets a line. */
  | 'tick'
  /** The cutting plane's trace on the plan, chain-dashed. */
  | 'cutLine'
  /** The heavy stub at each end of the cutting plane. */
  | 'cutEnd'
  /** The view arrow at each end of the cutting plane. */
  | 'cutArrow'
  /** Solid arrowheads and solid glyph halves. */
  | 'arrow'
  /** Grid bubbles and the sheet reference: ground-filled rings. */
  | 'bubble'
  /** Thin outlined marks: the north point, level triangles. */
  | 'outline'
  /** The outlined half of the north point. */
  | 'outlineThin'
  /** A swimlane rule in a flow diagram. */
  | 'lane'
  /** A flow diagram's connector. */
  | 'edge'
  /** A connector for what returns, dashed. */
  | 'edgeDash'
  /** A step in a flow diagram. */
  | 'node'
  /** A card on the campaign board. */
  | 'card'
  /** A storyboard frame. */
  | 'frame'
  /** The small drawing inside a storyboard frame. */
  | 'glyph'
  /** The innermost ring around the café, solid. */
  | 'ring'
  /** The outer rings around the café, dashed. */
  | 'ringDash'
  /** The café's own mark inside the rings, filled. */
  | 'solid'

/** How a mark role is drawn, in plate units. */
export interface MarkStyle {
  /** Stroke width; absent for a mark that is only filled. */
  stroke?: number
  strokeOpacity?: number
  /** `ink` is the line colour, `ground` the page colour behind the plate. */
  fill?: 'ink' | 'ground'
  fillOpacity?: number
  dash?: readonly number[]
  round?: boolean
}

export const MARK_STYLES: Record<MarkRole, MarkStyle> = {
  cut: { stroke: 1.7, fill: 'ink', fillOpacity: 0.16 },
  column: { fill: 'ink' },
  glass: { stroke: 0.9 },
  furniture: { stroke: 1.15, strokeOpacity: 0.58 },
  furnitureCut: { stroke: 1.3, fill: 'ink', fillOpacity: 0.1 },
  hidden: { stroke: 0.9, strokeOpacity: 0.32, dash: [6, 4] },
  stair: { stroke: 1.1 },
  doorLeaf: { stroke: 1.5 },
  doorArc: { stroke: 0.8, strokeOpacity: 0.55 },
  guest: { stroke: 2.4, dash: [10, 6], round: true },
  kitchen: { stroke: 2.8, dash: [0.5, 6.5], round: true },
  elevation: { stroke: 1.05, strokeOpacity: 0.55 },
  elevationWall: {
    stroke: 1,
    strokeOpacity: 0.6,
    fill: 'ink',
    fillOpacity: 0.06,
  },
  ground: { stroke: 2.4 },
  axis: { stroke: 0.9, strokeOpacity: 0.45, dash: [22, 5, 3, 5] },
  dimension: { stroke: 0.9, strokeOpacity: 0.8 },
  tick: { stroke: 1.6 },
  cutLine: { stroke: 1.4, dash: [20, 5, 3, 5] },
  cutEnd: { stroke: 3.4 },
  cutArrow: { stroke: 1.4 },
  arrow: { fill: 'ink' },
  bubble: { stroke: 1.3, fill: 'ground' },
  outline: { stroke: 1.2 },
  outlineThin: { stroke: 1 },
  lane: { stroke: 1, strokeOpacity: 0.22 },
  edge: { stroke: 1.6 },
  edgeDash: { stroke: 1.6, dash: [7, 5] },
  node: { stroke: 1.5, strokeOpacity: 0.85, fill: 'ink', fillOpacity: 0.05 },
  card: { stroke: 1.2, strokeOpacity: 0.8, fill: 'ink', fillOpacity: 0.05 },
  frame: { stroke: 1.1 },
  glyph: { stroke: 1 },
  ring: { stroke: 1.1 },
  ringDash: { stroke: 1.1, strokeOpacity: 0.7, dash: [4, 4] },
  solid: { fill: 'ink', fillOpacity: 0.9 },
}

/**
 * Every path of one role, as one SVG path.
 *
 * One element per role rather than per line: a plan is a few hundred lines
 * and about twenty kinds of line, and a dash pattern restarts at every
 * subpath in SVG and canvas alike, so merging changes nothing a reader sees.
 * Roles are kept in the order they were first drawn, which is what puts a
 * grid bubble over the axis it sits on.
 */
export interface PlateMark {
  role: MarkRole
  d: string
}

/** What a run of text is, which decides its face, size and ink. */
export type TextRole =
  /** Room and lane names: mono capitals with a halo of ground. */
  | 'label'
  /** Dimensions, levels, grid numbers. */
  | 'figure'
  /** A drawing's own title: display capitals. */
  | 'title'
  /** A step or card's name. */
  | 'nodeTitle'
  /** The line under a step or card's name. */
  | 'nodeNote'
  /** A note beside a connector, or a board's aside. */
  | 'note'

/** How a text role is set, in plate units. */
export interface TextStyle {
  face: 'mono' | 'display'
  size: number
  weight: number
  opacity?: number
  tracking?: number
  /** A stroke of ground under the glyphs, so a label reads across a line. */
  halo?: number
}

export const TEXT_STYLES: Record<TextRole, TextStyle> = {
  label: { face: 'mono', size: 14.5, weight: 500, opacity: 0.82, tracking: 1 },
  figure: { face: 'mono', size: 13, weight: 400 },
  title: { face: 'display', size: 22, weight: 700, tracking: 0.5 },
  nodeTitle: { face: 'display', size: 17, weight: 600 },
  nodeNote: { face: 'mono', size: 13, weight: 400, opacity: 0.75 },
  note: { face: 'mono', size: 12, weight: 400, opacity: 0.75 },
}

/** The halo under a label: wide enough to clear a line, narrower than a gap. */
export const LABEL_HALO = 4.35

/** A run of text on a plate. */
export interface PlateText {
  role: TextRole
  x: number
  y: number
  /** One entry per line, already in the case it is drawn in. */
  lines: readonly string[]
  anchor?: 'start' | 'middle' | 'end'
  /** Degrees about (x, y), clockwise. */
  rotate?: number
  /** Centred on y rather than sitting on it, for a rotated label. */
  central?: boolean
  /** Line height as a multiple of the size. */
  leading?: number
  /** A size or weight this one run departs from its role on. */
  size?: number
  weight?: number
}

/**
 * A region of a plate that moves on its own when the plate is lit as a model:
 * Konstruksi's plan lies down and its section stands up behind it. A flat
 * plate draws its parts where they are; only the WebGL material separates
 * them.
 */
export interface PlatePart {
  id: 'sheet' | 'plan' | 'section'
  /** `[x, y, width, height]` in plate units, inside the view box. */
  rect: readonly [number, number, number, number]
}

/** One unit's working drawing, in its own units. */
export interface Plate {
  unit: Unit
  /** `[x, y, width, height]`: the part of the plate units that is drawn. */
  viewBox: readonly [number, number, number, number]
  marks: readonly PlateMark[]
  texts: readonly PlateText[]
  /** At least one; together they cover the view box. */
  parts: readonly PlatePart[]
}
