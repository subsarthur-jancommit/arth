/**
 * How the café is seen: one camera, one projection, shared by both renderers.
 *
 * Provenance: original work for this project. No third-party code copied.
 * The matrices are the standard look-at and perspective constructions, laid
 * out column-major as WebGL and three.js read them.
 *
 * The still (`still.ts`) projects every point through `project`; the WebGL
 * renderer gives its camera `VIEW_MATRIX` and `PROJECTION_MATRIX` unchanged
 * (`vault/webgl/cafe/rig.ts`). So the two frame the model identically, and
 * the hand-over from one to the other moves nothing.
 *
 * The camera stands in front and to the right of the café, a little above
 * it, with a long lens: an architect's model on a table, seen by someone
 * standing beside it. The key light comes from the other side (`light.ts`),
 * so the faces turned to the camera divide into lit, half-lit and shaded.
 */

import { cross, dot, normalize, sub, type Vec3 } from './geometry'
import { PARTS } from './model'

/** The still's coordinate space: a 4:3 box, the art viewport's ratio. */
export const VIEW_WIDTH = 1200
export const VIEW_HEIGHT = 900
export const ASPECT = VIEW_WIDTH / VIEW_HEIGHT

/** Vertical field of view: long, so the model is not distorted. */
export const FOV_DEGREES = 24
export const NEAR = 1
export const FAR = 80

const AZIMUTH = (30 * Math.PI) / 180
const ELEVATION = (14 * Math.PI) / 180
const DISTANCE = 30

export const TARGET: Vec3 = [-0.4, 1.7, 0.1]
export const EYE: Vec3 = [
  TARGET[0] + DISTANCE * Math.sin(AZIMUTH) * Math.cos(ELEVATION),
  TARGET[1] + DISTANCE * Math.sin(ELEVATION),
  TARGET[2] + DISTANCE * Math.cos(AZIMUTH) * Math.cos(ELEVATION),
]
export const UP: Vec3 = [0, 1, 0]

/**
 * Room left around the model, as shares of the frame: more above, where the
 * roof drops in from (`assembly.ts`), than at the sides.
 */
const MARGIN = { left: 0.05, right: 0.05, top: 0.12, bottom: 0.07 }

/** A 4 × 4 matrix, column-major. */
export type Matrix = readonly number[]

const FOCAL = 1 / Math.tan((FOV_DEGREES * Math.PI) / 360)

/** The camera's basis: right, up, and back (towards the eye). */
const BACK = normalize(sub(EYE, TARGET))
const RIGHT = normalize(cross(UP, BACK))
const TRUE_UP = cross(BACK, RIGHT)

/** World to camera space. */
export const VIEW_MATRIX: Matrix = [
  RIGHT[0],
  TRUE_UP[0],
  BACK[0],
  0,
  RIGHT[1],
  TRUE_UP[1],
  BACK[1],
  0,
  RIGHT[2],
  TRUE_UP[2],
  BACK[2],
  0,
  -dot(RIGHT, EYE),
  -dot(TRUE_UP, EYE),
  -dot(BACK, EYE),
  1,
]

/** A point in camera space: x right, y up, z towards the eye. */
export const toCamera = (point: Vec3): Vec3 => {
  const offset = sub(point, EYE)
  return [dot(RIGHT, offset), dot(TRUE_UP, offset), dot(BACK, offset)]
}

/** A camera-space point to normalised device coordinates, before the fit. */
const toNdc = ([x, y, z]: Vec3): [number, number] => {
  const w = -z
  return [((FOCAL / ASPECT) * x) / w, (FOCAL * y) / w]
}

/**
 * The frame, fitted to the model: a scale and an offset in device
 * coordinates that put the model's projected bounds inside the margins.
 * Measured on the model itself, so a change to the model keeps it framed.
 */
const FIT = (() => {
  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  for (const item of PARTS) {
    for (const face of item.solid.faces) {
      for (const point of face.points) {
        const [x, y] = toNdc(toCamera(point))
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
  }
  const spanX = 2 * (1 - MARGIN.left - MARGIN.right)
  const spanY = 2 * (1 - MARGIN.top - MARGIN.bottom)
  const k = Math.min(spanX / (maxX - minX), spanY / (maxY - minY))
  // The model's centre goes to the centre of the area inside the margins.
  const targetX = MARGIN.left - MARGIN.right
  const targetY = MARGIN.bottom - MARGIN.top
  return {
    scale: k,
    x: targetX - k * ((minX + maxX) / 2),
    y: targetY - k * ((minY + maxY) / 2),
  }
})()

/** Camera to clip space: the perspective, then the fit. */
export const PROJECTION_MATRIX: Matrix = (() => {
  const a = (FOCAL / ASPECT) * FIT.scale
  const b = FOCAL * FIT.scale
  const c = (FAR + NEAR) / (NEAR - FAR)
  const d = (2 * FAR * NEAR) / (NEAR - FAR)
  // Column-major: x, y, z, w columns. The fit's offset multiplies w, which
  // is -z, so it sits in the third column with a minus sign.
  return [a, 0, 0, 0, 0, b, 0, 0, -FIT.x, -FIT.y, c, -1, 0, 0, d, 0]
})()

export interface Projected {
  /** In the still's 1200 × 900 box. */
  readonly x: number
  readonly y: number
  /** Distance in front of the eye, along its line of sight. */
  readonly depth: number
}

/** A world point to the still's box. */
export function project(point: Vec3): Projected {
  const camera = toCamera(point)
  const [nx, ny] = toNdc(camera)
  const x = FIT.scale * nx + FIT.x
  const y = FIT.scale * ny + FIT.y
  return {
    x: ((x + 1) / 2) * VIEW_WIDTH,
    y: ((1 - y) / 2) * VIEW_HEIGHT,
    depth: -camera[2],
  }
}

/** The camera-space direction through a point of the still's box. */
export function rayThrough(x: number, y: number): Vec3 {
  const nx = ((x / VIEW_WIDTH) * 2 - 1 - FIT.x) / FIT.scale
  const ny = (1 - (y / VIEW_HEIGHT) * 2 - FIT.y) / FIT.scale
  return [(nx * ASPECT) / FOCAL, ny / FOCAL, -1]
}

/** Whether a face turns towards the eye. */
export const facesEye = (normal: Vec3, point: Vec3) =>
  dot(normal, sub(EYE, point)) > 1e-9
