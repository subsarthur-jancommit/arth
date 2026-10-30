/**
 * Konstruksi's plate: the ground-floor plan of a café in a rented shophouse,
 * and section A-A through it, sharing one scale and one set of grid lines.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The building, its coordinates and its labels are the ones
 * `docs/r4-arah-visual/model.py` drew for the stills the owner chose (R4,
 * 24 October 2026): the café of the `/layanan` sequence, where Konstruksi
 * readies a rented space until the guests' route and the kitchen work. The
 * measurements belong to the drawing, at its own scale; they are not a
 * project's.
 *
 * ## Units
 *
 * The model is in metres. `x` runs from the street (0) to the back wall (14);
 * `y` from the far party wall (0) to the near one (5). The section cuts at
 * `CUT_Y` and looks towards `y = 0`, with `z` up from the ground floor.
 * Everything is projected once, at 56 plate units to the metre: the plan with
 * `y` down the plate, the section with `z` up it, both on the same `x`.
 */

import {
  arc,
  circle,
  type Point,
  polygon,
  polyline,
  segment,
  sheet,
} from './draw'
import type { Plate } from './types'

/** Plate units per metre. */
const SCALE = 56

/** Where the plan's and the section's origins fall on the plate. */
const PLAN_ORIGIN: Point = [80 + 2.6 * SCALE, 72 + 1.87 * SCALE]
const SECTION_ORIGIN: Point = [80 + 2.6 * SCALE, 1000]

/** The structural grid, along `x`. */
const AXES = [0, 4.6, 9.2, 14] as const

/** Where section A-A cuts the plan. */
const CUT_Y = 2.8

function plan(x: number, y: number): Point {
  return [PLAN_ORIGIN[0] + x * SCALE, PLAN_ORIGIN[1] + y * SCALE]
}

function section(x: number, z: number): Point {
  return [SECTION_ORIGIN[0] + x * SCALE, SECTION_ORIGIN[1] - z * SCALE]
}

/** A rectangle in metres, as its four corners. */
function box(x0: number, y0: number, x1: number, y1: number): Point[] {
  return [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ]
}

type Project = (a: number, b: number) => Point

function outline(project: Project, corners: readonly Point[]): string {
  return polygon(corners.map(([a, b]) => project(a, b)))
}

function run(project: Project, points: readonly Point[]): Point[] {
  return points.map(([a, b]) => project(a, b))
}

/** Room and fitting names: text, x, y in metres, anchor, rotation. */
type Label = readonly [string, number, number, 'start' | 'middle', number]

const PLAN_LABELS: readonly Label[] = [
  ['Teras', -0.8, 4.4, 'middle', 0],
  ['Jalan', -2.38, 3.9, 'middle', -90],
  ['Alur pelanggan', 0.45, 3.2, 'start', 0],
  ['Ruang duduk', 4.2, 3.2, 'middle', 0],
  ['Tangga naik', 6.4, 1.32, 'middle', 0],
  ['Bar', 7.9, 2.8, 'middle', -90],
  ['Dapur', 11.1, 2.4, 'middle', 0],
  ['Kompor', 11.3, 1.15, 'start', 0],
  ['Olah', 11.3, 4.8, 'middle', 0],
  ['Gudang', 13.25, 2.34, 'middle', 0],
  ['Cuci', 13.12, 3.8, 'middle', -90],
  ['Bahan', 14.62, 0.66, 'middle', 0],
  ['Saji', 6.75, 4.28, 'middle', 0],
]

/*
 * "Loket saji" where the stills said "Pass-out": the same hatch between bar
 * and kitchen, named in the reader's language rather than the trade's.
 */
const SECTION_LABELS: readonly Label[] = [
  ['Teras', -0.85, 0.3, 'middle', 0],
  ['Kanopi', -0.75, 3.15, 'middle', 0],
  ['Ruang duduk', 2.75, 1.55, 'middle', 0],
  ['Tangga', 6.15, 2.3, 'middle', 0],
  ['Bar', 7.9, 1.35, 'middle', 0],
  ['Loket saji', 9.45, 1.12, 'start', 0],
  ['Dapur', 11.2, 1.5, 'middle', 0],
  ['Kompor', 10.9, 0.38, 'middle', 0],
  ['Cerobong', 11.25, 5.2, 'start', 0],
  ['Gudang', 13.25, 1.95, 'middle', 0],
  ['Bahan', 13.25, 1.62, 'middle', 0],
  ['Lantai 2', 2.45, 5.1, 'middle', 0],
]

const LEVELS = [
  [0, '±0,00'],
  [3.6, '+3,60'],
  [7, '+7,00'],
] as const

/** The arrowhead on a route or a stair, in plate units. */
const ARROW = 11

function drawPlan(draw: ReturnType<typeof sheet>) {
  const p = (corners: readonly Point[]) => outline(plan, corners)

  // Walls the plane cuts: both party walls, the back wall with its service
  // door, the kitchen wall with the serving hatch and its door, the store,
  // and the stubs either side of the shopfront.
  for (const wall of [
    box(-0.15, -0.15, 14.15, 0),
    box(-0.15, 5, 14.15, 5.15),
    box(14, 0, 14.15, 0.5),
    box(14, 1.4, 14.15, 5),
    box(9.2, 0, 9.35, 2.2),
    box(9.2, 3.4, 9.35, 4.2),
    box(12.4, 0, 12.5, 1.2),
    box(12.4, 2, 12.5, 2.7),
    box(12.5, 2.6, 14, 2.7),
    box(-0.15, 0, 0, 0.3),
    box(-0.15, 4.7, 0, 5),
  ]) {
    draw.mark('cut', p(wall))
  }
  for (const x of AXES) {
    for (const y of [0, 5]) {
      draw.mark('column', p(box(x - 0.15, y - 0.15, x + 0.15, y + 0.15)))
    }
  }
  for (const [y0, y1] of [
    [0.3, 1.6],
    [3.6, 4.7],
  ] as const) {
    for (const x of [-0.11, -0.04]) {
      draw.mark('glass', segment(plan(x, y0), plan(x, y1)))
    }
  }

  // Bench along the wall, three tables with a stool each, three tables on
  // the far side with a stool either end.
  draw.mark('furniture', p(box(0.6, 0, 4.8, 0.45)))
  for (const cx of [1.3, 2.75, 4.2]) {
    draw.mark('furniture', p(box(cx - 0.35, 0.6, cx + 0.35, 1.3)))
    draw.mark('furniture', p(box(cx - 0.2, 1.45, cx + 0.2, 1.85)))
  }
  for (const cx of [1.3, 3.2, 5.1]) {
    draw.mark('furniture', p(box(cx - 0.35, 4.15, cx + 0.35, 4.85)))
    for (const sx of [-0.8, 0.4]) {
      draw.mark('furniture', p(box(cx + sx, 4.3, cx + sx + 0.4, 4.7)))
    }
  }
  // Bar, the serving hatch, the cooking line and its burners, the hood
  // above it, the preparation table, the sink, the store's shelf.
  draw.mark('furniture', p(box(7.6, 1.4, 8.2, 4.2)))
  draw.mark('furniture', p(box(9.05, 2.2, 9.5, 3.4)))
  draw.mark('furniture', p(box(9.6, 0, 12.2, 0.65)))
  for (const bx of [10, 10.6, 11.2, 11.8]) {
    draw.mark('furniture', circle(plan(bx, 0.33), 0.17 * SCALE))
  }
  draw.mark('hidden', p(box(9.6, 0, 12.2, 0.9)))
  draw.mark('furniture', p(box(10.4, 4.35, 12.2, 5)))
  draw.mark('furniture', p(box(13.35, 3, 14, 4.6)))
  draw.mark('furniture', p(box(13.5, 3.2, 13.88, 4.4)))
  draw.mark('furniture', p(box(12.6, 0, 14, 0.4)))

  // The stair: eighteen risers over 4.2 m; those above the cutting plane are
  // dashed, past the break line.
  draw.mark('furniture', p(box(5, 0, 9.2, 1)))
  const tread = 4.2 / 18
  for (let i = 1; i < 18; i += 1) {
    const x = 5 + i * tread
    draw.mark(i <= 5 ? 'furniture' : 'hidden', segment(plan(x, 0), plan(x, 1)))
  }
  draw.mark(
    'furniture',
    polyline(
      run(plan, [
        [6.12, 1],
        [6.24, 0.6],
        [6.1, 0.45],
        [6.22, 0],
      ])
    )
  )
  draw.arrow(
    'stair',
    run(plan, [
      [5.2, 0.5],
      [8.95, 0.5],
    ]),
    ARROW
  )

  // Doors: hinge, the leaf's end when shut, and how far it swings.
  for (const [hinge, shut, degrees] of [
    [[0, 1.6], [0, 2.6], 70],
    [[0, 3.6], [0, 2.6], -70],
    [[9.35, 5], [9.35, 4.2], 80],
    [[12.5, 2], [12.5, 1.2], 80],
    [[14, 1.4], [14, 0.5], -80],
  ] as const) {
    const centre = plan(hinge[0], hinge[1])
    const r = Math.hypot(shut[0] - hinge[0], shut[1] - hinge[1]) * SCALE
    const from = Math.atan2(shut[1] - hinge[1], shut[0] - hinge[0])
    const sweep = (degrees * Math.PI) / 180
    const open: Point = [
      centre[0] + r * Math.cos(from + sweep),
      centre[1] + r * Math.sin(from + sweep),
    ]
    draw.mark('doorLeaf', segment(centre, open))
    draw.mark('doorArc', arc(centre, r, from, sweep))
  }

  // The guests' route from the street to a table, then stock, preparation
  // and service; the two never cross.
  draw.arrow(
    'guest',
    run(plan, [
      [-2, 2.6],
      [0.5, 2.6],
      [2.1, 2.72],
      [2.75, 2.25],
      [2.75, 1.98],
    ]),
    ARROW
  )
  for (const route of [
    [
      [14.8, 0.95],
      [13.5, 0.95],
      [12.95, 1.6],
      [12.1, 1.6],
      [11.6, 4.28],
    ],
    [
      [10.45, 4.28],
      [10.45, 0.82],
    ],
    [
      [10.1, 0.85],
      [9.7, 1.7],
      [9.6, 2.8],
      [9, 2.8],
      [8.7, 3.6],
      [8.6, 4.55],
      [7.4, 4.62],
      [6, 4.5],
    ],
  ] as const) {
    draw.arrow('kitchen', run(plan, route), ARROW)
  }
}

function drawSection(draw: ReturnType<typeof sheet>) {
  const p = (corners: readonly Point[]) => outline(section, corners)

  // Ground slab, terrace, first floor, roof and parapets, the shopfront's
  // wall stubs, the back wall, and the kitchen wall either side of the hatch.
  for (const wall of [
    box(-0.15, -0.25, 14.15, 0),
    box(-1.6, -0.2, -0.15, 0),
    box(-0.15, 3.4, 14.15, 3.6),
    box(-0.15, 6.8, 14.15, 7),
    box(-0.15, 7, 0, 7.4),
    box(14, 7, 14.15, 7.4),
    box(-0.15, 2.9, 0, 3.4),
    box(-0.15, 3.6, 0, 4.4),
    box(-0.15, 6, 0, 6.8),
    box(14, 0, 14.15, 6.8),
    box(9.2, 0, 9.35, 0.9),
    box(9.2, 1.5, 9.35, 3.4),
  ]) {
    draw.mark('cut', p(wall))
  }
  // The canopy over the terrace.
  draw.mark(
    'cut',
    p([
      [0, 2.95],
      [-1.4, 2.8],
      [-1.4, 2.72],
      [0, 2.87],
    ])
  )
  draw.mark('furnitureCut', p(box(7.6, 0, 8.2, 1.05)))
  draw.mark('furnitureCut', p(box(7.45, 1.05, 8.2, 1.11)))
  for (const [z0, z1] of [
    [0, 2.5],
    [2.55, 2.9],
    [4.4, 6],
  ] as const) {
    for (const x of [-0.11, -0.04]) {
      draw.mark('glass', segment(section(x, z0), section(x, z1)))
    }
  }
  draw.mark(
    'ground',
    polyline(
      run(section, [
        [-2.6, -0.15],
        [-1.6, -0.15],
        [-1.6, 0],
      ])
    )
  )
  draw.mark('ground', segment(section(14.15, 0), section(14.6, 0)))

  // Beyond the cut: the bench and the tables with their pendants, the stair
  // and its balustrade, the cooking line, hood and flue, the store's wall,
  // and the first floor's tables.
  draw.mark('elevation', p(box(0.6, 0, 4.8, 0.45)))
  draw.mark('elevation', p(box(0.6, 0.45, 4.8, 0.95)))
  for (const cx of [1.3, 2.75, 4.2]) {
    draw.mark('elevation', p(box(cx - 0.35, 0.72, cx + 0.35, 0.76)))
    draw.mark('elevation', p(box(cx - 0.2, 0, cx + 0.2, 0.88)))
    draw.mark(
      'elevation',
      segment(section(cx - 0.2, 0.45), section(cx + 0.2, 0.45))
    )
    draw.mark('elevation', segment(section(cx, 3.4), section(cx, 2.3)))
    draw.mark(
      'elevation',
      p([
        [cx - 0.18, 2.12],
        [cx + 0.18, 2.12],
        [cx + 0.08, 2.3],
        [cx - 0.08, 2.3],
      ])
    )
  }
  const tread = 4.2 / 18
  const riser = 3.6 / 18
  const flight: Point[] = [[5, 0]]
  for (let i = 0; i < 18; i += 1) {
    flight.push(
      [5 + i * tread, (i + 1) * riser],
      [5 + (i + 1) * tread, (i + 1) * riser]
    )
  }
  draw.mark('elevation', polyline(run(section, flight)))
  draw.mark('elevation', segment(section(5.35, 0), section(9.2, 3.3)))
  draw.mark('elevation', segment(section(5.05, 1.1), section(9.2, 4.5)))
  draw.mark('elevation', segment(section(5, 4.5), section(9.2, 4.5)))
  for (let i = 0; i < 8; i += 1) {
    const x = 5 + i * 0.6
    draw.mark('elevation', segment(section(x, 3.6), section(x, 4.5)))
  }
  draw.mark('elevation', p(box(9.6, 0, 12.2, 0.85)))
  for (const bx of [9.95, 10.55, 11.15, 11.75]) {
    draw.mark('elevation', p(box(bx, 0.85, bx + 0.3, 0.93)))
  }
  draw.mark(
    'elevation',
    p([
      [9.6, 1.9],
      [12.2, 1.9],
      [11.7, 2.4],
      [10.1, 2.4],
    ])
  )
  for (const [z0, z1] of [
    [2.4, 3.4],
    [3.6, 6.8],
    [7, 7.85],
  ] as const) {
    draw.mark('elevation', p(box(10.75, z0, 11.05, z1)))
  }
  draw.mark(
    'elevation',
    p([
      [10.5, 7.85],
      [11.3, 7.85],
      [10.9, 8.05],
    ])
  )
  draw.mark('elevationWall', p(box(12.5, 0, 14, 3.4)))
  draw.mark('elevation', segment(section(9, 0.9), section(9.55, 0.9)))
  for (const cx of [1.5, 3.4]) {
    draw.mark('elevation', p(box(cx - 0.35, 4.32, cx + 0.35, 4.36)))
    draw.mark('elevation', p(box(cx - 0.2, 3.6, cx + 0.2, 4.48)))
    draw.mark('elevation', segment(section(cx, 6.8), section(cx, 5.75)))
    draw.mark(
      'elevation',
      p([
        [cx - 0.18, 5.57],
        [cx + 0.18, 5.57],
        [cx + 0.08, 5.75],
        [cx - 0.08, 5.75],
      ])
    )
  }
}

/** Grid lines from the bubbles above the plan down through the section. */
function drawAxes(draw: ReturnType<typeof sheet>) {
  const bottom = section(0, -0.35)[1]
  AXES.forEach((x, i) => {
    const [ax, top] = plan(x, -1.28)
    draw.mark('axis', segment([ax, top], [ax, bottom]))
    const centre = plan(x, -1.55)
    draw.mark('bubble', circle(centre, 0.27 * SCALE))
    draw.text('figure', centre[0], centre[1] + 5, String(i + 1), {
      anchor: 'middle',
      size: 14,
      weight: 500,
    })
  })
}

/** Dimensions, the cutting plane's trace and the north point. */
function drawPlanMarks(draw: ReturnType<typeof sheet>) {
  const tick = ([cx, cy]: Point) =>
    draw.mark('tick', segment([cx - 5, cy + 5], [cx + 5, cy - 5]))

  const y = -0.7
  draw.mark('dimension', segment(plan(AXES[0], y), plan(AXES[3], y)))
  for (const x of AXES) {
    draw.mark('dimension', segment(plan(x, y - 0.12), plan(x, y + 0.12)))
    tick(plan(x, y))
  }
  for (let i = 0; i < AXES.length - 1; i += 1) {
    const x0 = AXES[i] ?? 0
    const x1 = AXES[i + 1] ?? 0
    const [tx, ty] = plan((x0 + x1) / 2, y - 0.14)
    draw.text('figure', tx, ty, (x1 - x0).toFixed(2).replace('.', ','), {
      anchor: 'middle',
    })
  }
  const side = 15.25
  draw.mark('dimension', segment(plan(side, 0), plan(side, 5)))
  for (const end of [0, 5]) {
    draw.mark(
      'dimension',
      segment(plan(side - 0.12, end), plan(side + 0.12, end))
    )
    tick(plan(side, end))
  }
  const [wx, wy] = plan(side + 0.22, 2.5)
  draw.text('figure', wx, wy, '5,00', {
    anchor: 'middle',
    rotate: -90,
    central: true,
  })

  draw.mark('cutLine', segment(plan(-2.6, CUT_Y), plan(14.7, CUT_Y)))
  for (const [end, direction] of [
    [-2.6, 1],
    [14.7, -1],
  ] as const) {
    const foot = plan(end, CUT_Y)
    const tip = plan(end, CUT_Y - 0.58)
    draw.mark('cutEnd', segment(foot, plan(end + 0.45 * direction, CUT_Y)))
    draw.arrow('cutArrow', [foot, tip], 10)
    const [lx, ly] = plan(end, CUT_Y - 0.82)
    draw.text('figure', lx, ly, 'A', {
      anchor: 'middle',
      size: 17,
      weight: 600,
    })
  }

  const [nx, ny] = plan(-2.05, 0.45)
  const r = 0.3 * SCALE
  draw.mark('outline', circle([nx, ny], r))
  draw.mark(
    'arrow',
    polygon([
      [nx, ny - r],
      [nx + r * 0.42, ny + r * 0.6],
      [nx, ny + r * 0.3],
    ])
  )
  draw.mark(
    'outlineThin',
    polygon([
      [nx, ny - r],
      [nx - r * 0.42, ny + r * 0.6],
      [nx, ny + r * 0.3],
    ])
  )
  draw.text('figure', nx, ny - r - 7, 'U', {
    anchor: 'middle',
    weight: 600,
  })
}

/** Floor levels at the right of the section. */
function drawLevels(draw: ReturnType<typeof sheet>) {
  for (const [z, level] of LEVELS) {
    const [lx, ly] = section(14.55, z)
    draw.mark(
      'outline',
      polygon([
        [lx, ly],
        [lx - 7, ly - 11],
        [lx + 7, ly - 11],
      ])
    )
    draw.mark('dimension', segment([lx - 12, ly], [lx + 48, ly]))
    draw.text('figure', lx + 12, ly - 5, level)
  }
}

function drawLabels(
  draw: ReturnType<typeof sheet>,
  labels: readonly Label[],
  project: Project
) {
  for (const [name, a, b, anchor, rotate] of labels) {
    const [x, y] = project(a, b)
    draw.text(
      'label',
      x,
      y,
      name.toLocaleUpperCase('id'),
      rotate === 0 ? { anchor } : { anchor, rotate, central: true }
    )
  }
}

function build(): Plate {
  const draw = sheet()
  drawAxes(draw)
  drawPlan(draw)
  drawPlanMarks(draw)
  drawLabels(draw, PLAN_LABELS, plan)
  drawSection(draw)
  drawLevels(draw)
  drawLabels(draw, SECTION_LABELS, section)
  draw.text('title', 80, 512, 'DENAH LANTAI 1')
  draw.text('title', 80, 1066, 'POTONGAN A-A')
  /*
   * Where the plan's sheet ends and the section's begins: under the plan's
   * title (its baseline is 512) and above the flue's cap (549). The lit model
   * lays the first down and stands the second up behind it.
   */
  return draw.done(
    'konstruksi',
    [50, 50, 1080, 1050],
    [
      { id: 'plan', rect: [50, 50, 1080, 480] },
      { id: 'section', rect: [50, 530, 1080, 570] },
    ]
  )
}

export const KONSTRUKSI_PLATE: Plate = build()
