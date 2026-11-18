/**
 * The café, modelled in code: the one source both renderers draw from.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The design follows the owner's concept (17 November 2026, kept outside the
 * repository): a matte architectural model of a small café on a plinth, with
 * a mono-pitch roof, an open front, a glazed end, a kitchen block, and a
 * terrace with a tree. It sets the direction; the layout here is its own.
 *
 * Units are metres, roughly. x runs left to right along the café, y up,
 * z towards the front, where the camera is (`view.ts`).
 *
 * ## What each part carries
 *
 * - **material**, a key into `MATERIALS`, authored in OKLCH like the site's
 *   tokens (`color.ts`). A face square to the key light shows exactly this
 *   colour (`light.ts` sets the exposure that way).
 * - **stage**, the step of the assembly it arrives in (`assembly.ts`): the
 *   ground, the shell, the roof, the fit-out, the furniture.
 * - **need**, which of the home page's three needs it belongs to, for G4's
 *   per-need change (`state.ts`): the building is Konstruksi's, the counter
 *   and its machines Teknologi's, the tables and the terrace Peekabo's.
 * - **occluder**, whether it blocks the key light. Only the large masses do:
 *   the roofs, the walls, the kitchen block. Furniture is anchored by contact
 *   shadows instead (`FOOTPRINTS`).
 */

import { type Oklch, oklch } from './color'
import {
  box,
  column,
  type Face,
  frustum,
  icosahedron,
  prism,
  type Solid,
  type Vec3,
} from './geometry'

export const MATERIALS = {
  /** The plinth's body: a darker stone than the terrace on it. */
  stone: oklch(0.56, 0.016, 62),
  /** The terrace: the plinth's top layer. */
  concrete: oklch(0.66, 0.016, 75),
  /** Walls. The reference material the exposure is fixed on. */
  plaster: oklch(0.86, 0.02, 80),
  /** The roofs' tops: a shade under the walls, so the room stays the subject. */
  roof: oklch(0.79, 0.018, 76),
  /** Floor, ceiling, counter top, shelves, table tops. */
  oak: oklch(0.66, 0.055, 62),
  /** Frames, posts, chairs, stools, the trunk. */
  walnut: oklch(0.42, 0.045, 50),
  /** The counter's body and the planter: the one warm accent. */
  clay: oklch(0.58, 0.085, 42),
  /** The machine, lamp shades, the door, the sign. */
  ink: oklch(0.27, 0.012, 60),
  /** Jars, the pastry case. */
  ceramic: oklch(0.92, 0.012, 85),
  foliage: oklch(0.6, 0.065, 122),
  soil: oklch(0.32, 0.025, 55),
} as const satisfies Record<string, Oklch>

export type Material = keyof typeof MATERIALS

/** The material whose lit face sets the exposure (`light.ts`). */
export const REFERENCE_MATERIAL: Material = 'plaster'

/** The home page's three needs (`app/[locale]/page.tsx`, `need.*`). */
export type CafeNeed = 'building' | 'systems' | 'market'

/** The assembly's steps, in order (`assembly.ts`). */
export const STAGES = [
  'ground',
  'shell',
  'roof',
  'fitout',
  'furniture',
] as const
export type Stage = 0 | 1 | 2 | 3 | 4

/** The stage whose arrival puts the interior in shade (`light.ts`). */
export const ROOF_STAGE: Stage = 2

export interface Part {
  readonly id: string
  readonly solid: Solid
  readonly material: Material
  /** A different material for some faces: a roof's ceiling, a planter's soil. */
  readonly faceMaterial?: (face: Face) => Material | undefined
  readonly stage: Stage
  readonly need: CafeNeed | null
  readonly occluder: boolean
  /**
   * Whether the key's shadows and the hidden sky darken it. The plinth and
   * the terrace do not: a shadow on the terrace would come from several
   * masses at once, which one soft edge per face cannot draw, so they are
   * anchored by contact shadows alone (`FOOTPRINTS`).
   */
  readonly receives: boolean
}

/** Heights the parts sit on. */
export const PLINTH_TOP = 0.4
export const FLOOR_TOP = 0.48
const COUNTER_TOP = 1.47

/** The main roof's underside: 4.45 at the glazed end, falling to the right. */
const ROOF = { x0: -5.2, x1: 2.3, high: 4.45, low: 3.05, thickness: 0.26 }
export function roofUnderside(x: number): number {
  const t = (x - ROOF.x0) / (ROOF.x1 - ROOF.x0)
  return ROOF.high + (ROOF.low - ROOF.high) * t
}

/** Faces pointing down get the ceiling's material, the rest the part's. */
const underside =
  (material: Material) =>
  (face: Face): Material | undefined =>
    face.normal[1] < -0.5 ? material : undefined

/** Faces pointing up get another material: a planter's soil. */
const topside =
  (material: Material) =>
  (face: Face): Material | undefined =>
    face.normal[1] > 0.5 ? material : undefined

interface PartOptions {
  need?: CafeNeed | null
  occluder?: boolean
  receives?: boolean
  faceMaterial?: (face: Face) => Material | undefined
}

function part(
  id: string,
  body: Solid,
  material: Material,
  stage: Stage,
  options: PartOptions = {}
): Part {
  return {
    id,
    solid: body,
    material,
    stage,
    need: options.need ?? null,
    occluder: options.occluder ?? false,
    receives: options.receives ?? true,
    ...(options.faceMaterial && { faceMaterial: options.faceMaterial }),
  }
}

/** A table with a square top on a pedestal, standing on `y`. */
function squareTable(id: string, x: number, z: number, y: number): Part[] {
  const top = y + 0.7
  return [
    part(
      `${id}-top`,
      box([x - 0.38, top, z - 0.38], [x + 0.38, top + 0.05, z + 0.38]),
      'oak',
      4,
      { need: 'market' }
    ),
    part(`${id}-leg`, column(x, z, 0.04, y + 0.03, top, 6), 'walnut', 4, {
      need: 'market',
    }),
    part(
      `${id}-foot`,
      box([x - 0.19, y, z - 0.19], [x + 0.19, y + 0.03, z + 0.19]),
      'walnut',
      4,
      { need: 'market' }
    ),
  ]
}

/** A round table, for the terrace. */
function roundTable(id: string, x: number, z: number, y: number): Part[] {
  const top = y + 0.72
  return [
    part(`${id}-top`, column(x, z, 0.36, top, top + 0.05, 10), 'oak', 4, {
      need: 'market',
    }),
    part(`${id}-leg`, column(x, z, 0.035, y + 0.03, top, 6), 'walnut', 4, {
      need: 'market',
    }),
    part(`${id}-foot`, column(x, z, 0.17, y, y + 0.03, 8), 'walnut', 4, {
      need: 'market',
    }),
  ]
}

/**
 * A chair standing on `y`, its back on the side `facing` points away from:
 * a chair facing `+x` has its back at its `-x` edge.
 */
function chair(
  id: string,
  x: number,
  z: number,
  y: number,
  facing: '+x' | '-x' | '+z' | '-z'
): Part[] {
  const half = 0.2
  const seat = y + 0.44
  const leg = 0.035
  const legs: Part[] = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].map(([sx = 0, sz = 0], index) => {
    const lx = x + sx * (half - leg)
    const lz = z + sz * (half - leg)
    return part(
      `${id}-leg-${index}`,
      box([lx - leg / 2, y, lz - leg / 2], [lx + leg / 2, seat, lz + leg / 2]),
      'walnut',
      4,
      { need: 'market' }
    )
  })
  const back = (() => {
    const thick = 0.05
    const lo = seat + 0.05
    const hi = seat + 0.45
    if (facing === '+x')
      return box([x - half, lo, z - half], [x - half + thick, hi, z + half])
    if (facing === '-x')
      return box([x + half - thick, lo, z - half], [x + half, hi, z + half])
    if (facing === '+z')
      return box([x - half, lo, z - half], [x + half, hi, z - half + thick])
    return box([x - half, lo, z + half - thick], [x + half, hi, z + half])
  })()
  return [
    part(
      `${id}-seat`,
      box([x - half, seat, z - half], [x + half, seat + 0.05, z + half]),
      'walnut',
      4,
      { need: 'market' }
    ),
    part(`${id}-back`, back, 'walnut', 4, { need: 'market' }),
    ...legs,
  ]
}

/** A stool at the counter. */
function stool(id: string, x: number, z: number): Part[] {
  const seat = FLOOR_TOP + 0.66
  return [
    part(`${id}-seat`, column(x, z, 0.16, seat, seat + 0.05, 8), 'walnut', 4, {
      need: 'market',
    }),
    part(`${id}-leg`, column(x, z, 0.03, FLOOR_TOP, seat, 6), 'walnut', 4, {
      need: 'market',
    }),
  ]
}

/** A pendant lamp hanging from the roof above `x, z`. */
function lamp(id: string, x: number, z: number, bottom: number): Part[] {
  const shadeTop = bottom + 0.24
  return [
    part(
      `${id}-shade`,
      frustum(x, z, 0.26, 0.07, bottom, shadeTop, 10),
      'ink',
      3,
      { need: 'systems' }
    ),
    part(
      `${id}-cord`,
      box(
        [x - 0.012, shadeTop, z - 0.012],
        [x + 0.012, roofUnderside(x), z + 0.012]
      ),
      'ink',
      3,
      { need: 'systems' }
    ),
  ]
}

/** A jar on a shelf. */
const jar = (
  id: string,
  x: number,
  z: number,
  y: number,
  radius: number,
  height: number
) =>
  part(id, column(x, z, radius, y, y + height, 8), 'ceramic', 3, {
    need: 'systems',
  })

const BACK = -2.4
const FRONT = 1.3
const LEFT = -4.6
const HALL_RIGHT = 1.8

function build(): Part[] {
  const parts: Part[] = []
  const push = (...items: Part[]) => parts.push(...items)

  // 0 — the ground: a stone plinth with a concrete terrace on it.
  push(
    part('plinth', box([-6.1, 0, -3.5], [5.3, 0.32, 3.55]), 'stone', 0, {
      need: 'building',
      receives: false,
    }),
    part(
      'terrace',
      box([-6.02, 0.32, -3.42], [5.22, PLINTH_TOP, 3.47]),
      'concrete',
      0,
      { need: 'building', receives: false }
    )
  )

  // 1 — the shell: the floor, the walls, the glazed end, the kitchen block.
  push(
    part(
      'floor',
      box([LEFT, PLINTH_TOP, BACK], [HALL_RIGHT, FLOOR_TOP, FRONT]),
      'oak',
      1,
      { need: 'building' }
    ),
    part(
      'back-wall',
      prism(
        'z',
        [
          [-4.8, PLINTH_TOP],
          [HALL_RIGHT, PLINTH_TOP],
          [HALL_RIGHT, roofUnderside(HALL_RIGHT)],
          [-4.8, roofUnderside(-4.8)],
        ],
        -2.6,
        BACK
      ),
      'plaster',
      1,
      { need: 'building', occluder: true }
    ),
    part(
      'end-wall',
      box([-4.8, PLINTH_TOP, BACK], [LEFT, 1.2, FRONT]),
      'plaster',
      1,
      { need: 'building', occluder: true }
    )
  )
  // The glazed end: posts and two rails, no glass, as an architect's model
  // shows glazing.
  const endTop = roofUnderside(-4.7)
  for (const [index, z] of [-2.35, -1.1, 0.15, 1.25].entries()) {
    push(
      part(
        `mullion-${index}`,
        box([-4.75, 1.2, z - 0.05], [-4.65, endTop, z + 0.05]),
        'walnut',
        1,
        { need: 'building' }
      )
    )
  }
  push(
    part(
      'transom',
      box([-4.76, 2.55, BACK], [-4.64, 2.63, FRONT]),
      'walnut',
      1,
      { need: 'building' }
    ),
    part(
      'head',
      box([-4.77, endTop - 0.12, BACK], [-4.63, endTop, FRONT]),
      'walnut',
      1,
      { need: 'building' }
    ),
    part(
      'post-left',
      box([-5.02, PLINTH_TOP, 1.88], [-4.88, roofUnderside(-4.95), 2.02]),
      'walnut',
      1,
      { need: 'building' }
    ),
    part(
      'post-right',
      box([1.88, PLINTH_TOP, 1.88], [2.02, roofUnderside(1.95), 2.02]),
      'walnut',
      1,
      { need: 'building' }
    ),
    part(
      'kitchen',
      box([HALL_RIGHT, PLINTH_TOP, -2.6], [4.6, 2.7, 0.7]),
      'plaster',
      1,
      { need: 'building', occluder: true }
    ),
    part(
      'kitchen-door',
      box([2.3, PLINTH_TOP, 0.7], [3.1, 2.2, 0.74]),
      'ink',
      1,
      { need: 'building' }
    ),
    part('kitchen-window', box([4.6, 1.5, -1.8], [4.64, 2.1, -0.2]), 'ink', 1, {
      need: 'building',
    })
  )

  // 2 — the roofs: the mono-pitch over the hall, a flat one over the kitchen.
  push(
    part(
      'roof',
      prism(
        'z',
        [
          [ROOF.x0, ROOF.high],
          [ROOF.x1, ROOF.low],
          [ROOF.x1, ROOF.low + ROOF.thickness],
          [ROOF.x0, ROOF.high + ROOF.thickness],
        ],
        -2.9,
        2.25
      ),
      'roof',
      2,
      { need: 'building', occluder: true, faceMaterial: underside('oak') }
    ),
    part('kitchen-roof', box([1.7, 2.7, -2.8], [4.8, 2.86, 0.9]), 'roof', 2, {
      need: 'building',
      occluder: true,
    })
  )

  // 3 — the fit-out: the counter, its machines, shelves and jars, the lamps.
  push(
    part(
      'counter',
      box([-0.6, FLOOR_TOP, -1.6], [1.5, 1.4, -0.95]),
      'clay',
      3,
      { need: 'systems' }
    ),
    part(
      'counter-top',
      box([-0.66, 1.4, -1.65], [1.56, COUNTER_TOP, -0.9]),
      'oak',
      3,
      { need: 'systems' }
    ),
    part(
      'machine',
      box([0.55, COUNTER_TOP, -1.55], [1.05, 1.85, -1.15]),
      'ink',
      3,
      { need: 'systems' }
    ),
    part(
      'machine-tray',
      box([0.6, 1.85, -1.5], [1, 1.88, -1.2]),
      'ceramic',
      3,
      { need: 'systems' }
    ),
    part('grinder', column(0.25, -1.35, 0.09, COUNTER_TOP, 1.82, 8), 'ink', 3, {
      need: 'systems',
    }),
    part('hopper', frustum(0.25, -1.35, 0.06, 0.12, 1.82, 2, 8), 'ceramic', 3, {
      need: 'systems',
    }),
    part(
      'case',
      box([-0.5, COUNTER_TOP, -1.55], [-0.05, 1.72, -1.1]),
      'ceramic',
      3,
      { need: 'systems' }
    ),
    part('shelf-low', box([-0.4, 2.05, BACK], [1.6, 2.1, -2.15]), 'oak', 3, {
      need: 'systems',
    }),
    part('shelf-high', box([-0.4, 2.55, BACK], [1.6, 2.6, -2.15]), 'oak', 3, {
      need: 'systems',
    }),
    jar('jar-0', -0.2, -2.27, 2.1, 0.08, 0.22),
    jar('jar-1', 0.15, -2.27, 2.1, 0.07, 0.18),
    jar('jar-2', 0.5, -2.27, 2.1, 0.09, 0.24),
    jar('jar-3', 0.9, -2.27, 2.1, 0.07, 0.2),
    jar('jar-4', 1.3, -2.27, 2.1, 0.08, 0.22),
    jar('jar-5', -0.1, -2.27, 2.6, 0.07, 0.2),
    jar('jar-6', 0.35, -2.27, 2.6, 0.09, 0.24),
    jar('jar-7', 0.8, -2.27, 2.6, 0.07, 0.18),
    jar('jar-8', 1.25, -2.27, 2.6, 0.08, 0.22),
    ...lamp('lamp-a', -3.55, -0.5, 2.3),
    ...lamp('lamp-b', -1.95, 0.35, 2.3),
    ...lamp('lamp-c', 0.45, -1.25, 2.35)
  )

  // 4 — the furniture: tables and chairs inside, stools at the counter, and
  // the terrace with its planter, tree, table and sign.
  push(
    ...squareTable('table-a', -3.55, -0.5, FLOOR_TOP),
    ...chair('chair-a1', -4.2, -0.5, FLOOR_TOP, '+x'),
    ...chair('chair-a2', -2.9, -0.5, FLOOR_TOP, '-x'),
    ...squareTable('table-b', -1.95, 0.35, FLOOR_TOP),
    ...chair('chair-b1', -1.95, -0.3, FLOOR_TOP, '+z'),
    ...chair('chair-b2', -1.95, 1, FLOOR_TOP, '-z'),
    ...stool('stool-0', -0.25, -0.55),
    ...stool('stool-1', 0.45, -0.55),
    ...stool('stool-2', 1.15, -0.55),
    part(
      'planter',
      box([-5.6, PLINTH_TOP, 2.3], [-4.4, 0.95, 3.3]),
      'clay',
      4,
      {
        need: 'market',
        faceMaterial: topside('soil'),
      }
    ),
    part('trunk', column(-5, 2.8, 0.06, 0.95, 2.35, 6), 'walnut', 4, {
      need: 'market',
    }),
    part('leaves-0', icosahedron([-5, 2.6, 2.8], 0.56), 'foliage', 4, {
      need: 'market',
    }),
    part('leaves-1', icosahedron([-5.42, 2.36, 2.98], 0.42), 'foliage', 4, {
      need: 'market',
    }),
    part('leaves-2', icosahedron([-4.6, 2.42, 2.66], 0.44), 'foliage', 4, {
      need: 'market',
    }),
    part('leaves-3', icosahedron([-5.08, 3.02, 2.72], 0.4), 'foliage', 4, {
      need: 'market',
    }),
    ...roundTable('table-c', -2.9, 2.8, PLINTH_TOP),
    ...chair('chair-c1', -3.6, 2.8, PLINTH_TOP, '+x'),
    ...chair('chair-c2', -2.2, 2.8, PLINTH_TOP, '-x'),
    part(
      'sign',
      prism(
        'x',
        [
          [2.85, PLINTH_TOP],
          [3.35, PLINTH_TOP],
          [3.1, PLINTH_TOP + 0.9],
        ],
        0.05,
        0.55
      ),
      'ink',
      4,
      { need: 'market' }
    )
  )

  return parts
}

/** The model, built once. */
export const PARTS: readonly Part[] = build()

/** A part's material for one of its faces. */
export const materialOf = (item: Part, face: Face): Material =>
  item.faceMaterial?.(face) ?? item.material

/**
 * A contact shadow: the soft darkening where something stands on a surface.
 *
 * A rounded rectangle on a horizontal receiver, in plan (x, z), blurred by
 * `soft` metres. It arrives with the part that casts it (`stage`) and moves
 * with the surface it lies on (`receiver`).
 */
export interface Footprint {
  readonly id: string
  readonly x0: number
  readonly z0: number
  readonly x1: number
  readonly z1: number
  /** The receiver's height. */
  readonly y: number
  /** Blur, in metres: the Gaussian's standard deviation. */
  readonly soft: number
  /** Opacity at the centre, 0–1. */
  readonly strength: number
  /** The caster's stage: when the shadow fades in. */
  readonly stage: Stage
  /** The part it lies on, or `null` for the ground under the plinth. */
  readonly receiver: string | null
}

function footprint(
  id: string,
  [x0, z0, x1, z1]: readonly [number, number, number, number],
  receiver: string | null,
  y: number,
  stage: Stage,
  soft: number,
  strength: number
): Footprint {
  return { id, x0, z0, x1, z1, y, soft, strength, stage, receiver }
}

/** Where a footprint of half-size `h` sits around `x, z`. */
const around = (x: number, z: number, h: number) =>
  [x - h, z - h, x + h, z + h] as const

export const FOOTPRINTS: readonly Footprint[] = [
  footprint('plinth', [-6.1, -3.5, 5.3, 3.55], null, 0, 0, 0.32, 0.6),
  footprint(
    'kitchen',
    [HALL_RIGHT, -2.6, 4.6, 0.7],
    'terrace',
    PLINTH_TOP,
    1,
    0.18,
    0.45
  ),
  footprint(
    'floor',
    [LEFT, BACK, HALL_RIGHT, FRONT],
    'terrace',
    PLINTH_TOP,
    1,
    0.1,
    0.35
  ),
  footprint(
    'back-wall',
    [-4.8, -2.6, HALL_RIGHT, BACK],
    'floor',
    FLOOR_TOP,
    1,
    0.16,
    0.4
  ),
  footprint(
    'end-wall',
    [-4.8, BACK, LEFT, FRONT],
    'floor',
    FLOOR_TOP,
    1,
    0.14,
    0.35
  ),
  footprint(
    'post-left',
    around(-4.95, 1.95, 0.07),
    'terrace',
    PLINTH_TOP,
    1,
    0.08,
    0.4
  ),
  footprint(
    'post-right',
    around(1.95, 1.95, 0.07),
    'terrace',
    PLINTH_TOP,
    1,
    0.08,
    0.4
  ),
  footprint(
    'counter',
    [-0.6, -1.6, 1.5, -0.95],
    'floor',
    FLOOR_TOP,
    3,
    0.12,
    0.4
  ),
  footprint(
    'machine',
    [0.55, -1.55, 1.05, -1.15],
    'counter-top',
    COUNTER_TOP,
    3,
    0.05,
    0.35
  ),
  footprint(
    'grinder',
    around(0.25, -1.35, 0.09),
    'counter-top',
    COUNTER_TOP,
    3,
    0.04,
    0.3
  ),
  footprint(
    'case',
    [-0.5, -1.55, -0.05, -1.1],
    'counter-top',
    COUNTER_TOP,
    3,
    0.05,
    0.3
  ),
  footprint(
    'table-a',
    around(-3.55, -0.5, 0.38),
    'floor',
    FLOOR_TOP,
    4,
    0.22,
    0.22
  ),
  footprint(
    'table-b',
    around(-1.95, 0.35, 0.38),
    'floor',
    FLOOR_TOP,
    4,
    0.22,
    0.22
  ),
  footprint(
    'chair-a1',
    around(-4.2, -0.5, 0.2),
    'floor',
    FLOOR_TOP,
    4,
    0.08,
    0.32
  ),
  footprint(
    'chair-a2',
    around(-2.9, -0.5, 0.2),
    'floor',
    FLOOR_TOP,
    4,
    0.08,
    0.32
  ),
  footprint(
    'chair-b1',
    around(-1.95, -0.3, 0.2),
    'floor',
    FLOOR_TOP,
    4,
    0.08,
    0.32
  ),
  footprint(
    'chair-b2',
    around(-1.95, 1, 0.2),
    'floor',
    FLOOR_TOP,
    4,
    0.08,
    0.32
  ),
  footprint(
    'stool-0',
    around(-0.25, -0.55, 0.14),
    'floor',
    FLOOR_TOP,
    4,
    0.07,
    0.3
  ),
  footprint(
    'stool-1',
    around(0.45, -0.55, 0.14),
    'floor',
    FLOOR_TOP,
    4,
    0.07,
    0.3
  ),
  footprint(
    'stool-2',
    around(1.15, -0.55, 0.14),
    'floor',
    FLOOR_TOP,
    4,
    0.07,
    0.3
  ),
  footprint(
    'planter',
    [-5.6, 2.3, -4.4, 3.3],
    'terrace',
    PLINTH_TOP,
    4,
    0.14,
    0.5
  ),
  footprint(
    'table-c',
    around(-2.9, 2.8, 0.34),
    'terrace',
    PLINTH_TOP,
    4,
    0.2,
    0.24
  ),
  footprint(
    'chair-c1',
    around(-3.6, 2.8, 0.2),
    'terrace',
    PLINTH_TOP,
    4,
    0.08,
    0.32
  ),
  footprint(
    'chair-c2',
    around(-2.2, 2.8, 0.2),
    'terrace',
    PLINTH_TOP,
    4,
    0.08,
    0.32
  ),
  footprint(
    'sign',
    [0.05, 2.85, 0.55, 3.35],
    'terrace',
    PLINTH_TOP,
    4,
    0.08,
    0.35
  ),
]

/**
 * The pool of light the model stands in: a disc on the ground, its colour at
 * the centre, fading to nothing at its edge (`light.ts` `poolAlpha`).
 */
export const POOL = {
  center: [0.4, 0, 0.6] as Vec3,
  radius: 7.6,
  color: oklch(0.4, 0.024, 62),
  alpha: 0.6,
}
