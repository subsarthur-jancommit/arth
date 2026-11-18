/**
 * The café for WebGL: its scene, camera and render target, built from
 * `lib/cafe` and drawn only when something changes.
 *
 * Provenance: original work for this project. No third-party code copied.
 * Written against the public API of three.
 *
 * ## Drawn once, shown every frame
 *
 * The root canvas redraws everything every frame (`lib/webgl`), and the café
 * is still almost all of the time. So it is not drawn into the root scene:
 * it is drawn into a render target of its own, with its own camera
 * (`lib/cafe/view.ts`, the still's), only when its picture changes — while
 * it assembles, while a need moves it, when its box changes size, after a
 * lost context. Every other frame, the root scene shows that target on one
 * quad (`scene.tsx`). Off screen, not even the quad is drawn.
 *
 * The target is multisampled, so the café's edges are smooth at any device
 * pixel ratio, and holds encoded sRGB with premultiplied alpha: the shaders
 * write the still's own encoded colours (`shaders.ts`) and blend them the
 * way a browser composites the still's SVG.
 *
 * ## What is disposed
 *
 * Everything made here: three geometries, three materials, the target and
 * its texture, in `dispose()` (CLAUDE.md #15). The quad that shows the
 * target is JSX, and r3f disposes it.
 */

import {
  BufferAttribute,
  BufferGeometry,
  Color,
  type IUniform,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  type Texture,
  Vector2,
  Vector3,
  type WebGLRenderer,
  WebGLRenderTarget,
} from 'three'

import { roofShadeAt, stageAt } from '@/lib/cafe/assembly'
import { encode, type Linear, quantize, toLinear } from '@/lib/cafe/color'
import { centroid, dot, type Vec3 } from '@/lib/cafe/geometry'
import type { Fill, ShadedFace } from '@/lib/cafe/light'
import {
  type CafeNeed,
  FOOTPRINTS,
  PARTS,
  POOL,
  type Stage,
  STAGES,
} from '@/lib/cafe/model'
import { PROJECTION_MATRIX, toCamera, VIEW_MATRIX } from '@/lib/cafe/view'

import {
  contactFragment,
  contactVertex,
  modelFragment,
  modelVertex,
  poolFragment,
  poolVertex,
} from './shaders'

/** The needs, as the shader indexes them: 0 is none. */
export const NEED_INDEX: Record<CafeNeed, number> = {
  building: 1,
  systems: 2,
  market: 3,
}

/** A colour as both renderers show it: encoded, in 8-bit steps. */
const shown = (colour: Linear) => quantize(encode(colour))

const rampAt = (fill: Fill, point: Vec3) =>
  dot(fill.gradient, point) + fill.offset

/** The model: every face, as triangles, back to front within each stage. */
function modelGeometry(shaded: readonly ShadedFace[]): BufferGeometry {
  const faces = [...shaded].sort((a, b) => {
    if (a.part.stage !== b.part.stage) return a.part.stage - b.part.stage
    const da = -toCamera(centroid(a.face.points))[2]
    const db = -toCamera(centroid(b.face.points))[2]
    return db - da
  })
  const position: number[] = []
  const stage: number[] = []
  const need: number[] = []
  const base0: number[] = []
  const base1: number[] = []
  const shade0: number[] = []
  const shade1: number[] = []
  const ramp: number[] = []

  for (const { part, face, paint } of faces) {
    const shade = paint.shade ?? paint.base
    const b0 = shown(paint.base.from)
    const b1 = shown(paint.base.to)
    const s0 = shown(shade.from)
    const s1 = shown(shade.to)
    const corner = (point: Vec3) => {
      position.push(...point)
      stage.push(part.stage)
      need.push(part.need ? NEED_INDEX[part.need] : 0)
      base0.push(...b0)
      base1.push(...b1)
      shade0.push(...s0)
      shade1.push(...s1)
      ramp.push(rampAt(paint.base, point), rampAt(shade, point))
    }
    const [first] = face.points
    if (!first) continue
    for (let index = 1; index < face.points.length - 1; index++) {
      const b = face.points[index]
      const c = face.points[index + 1]
      if (!b || !c) continue
      corner(first)
      corner(b)
      corner(c)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(position), 3)
  )
  geometry.setAttribute(
    'aStage',
    new BufferAttribute(new Float32Array(stage), 1)
  )
  geometry.setAttribute('aNeed', new BufferAttribute(new Float32Array(need), 1))
  geometry.setAttribute(
    'aBase0',
    new BufferAttribute(new Float32Array(base0), 3)
  )
  geometry.setAttribute(
    'aBase1',
    new BufferAttribute(new Float32Array(base1), 3)
  )
  geometry.setAttribute(
    'aShade0',
    new BufferAttribute(new Float32Array(shade0), 3)
  )
  geometry.setAttribute(
    'aShade1',
    new BufferAttribute(new Float32Array(shade1), 3)
  )
  geometry.setAttribute('aRamp', new BufferAttribute(new Float32Array(ramp), 2))
  return geometry
}

/** The top face's extent of the part a shadow lies on, in plan. */
function receiverBounds(id: string | null): [number, number, number, number] {
  const receiver = id ? PARTS.find((item) => item.id === id) : undefined
  if (!receiver) return [-1e4, -1e4, 1e4, 1e4]
  const points = receiver.solid.faces.flatMap((face) => face.points)
  const xs = points.map(([x]) => x)
  const zs = points.map(([, , z]) => z)
  return [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)]
}

/** The contact shadows: one quad each, lying on its receiver. */
function contactGeometry(): BufferGeometry {
  const position: number[] = []
  const rect: number[] = []
  const clip: number[] = []
  const spec: number[] = []
  for (const print of FOOTPRINTS) {
    const receiver = print.receiver
      ? PARTS.find((item) => item.id === print.receiver)
      : undefined
    const reach = print.soft * 3
    const x0 = print.x0 - reach
    const x1 = print.x1 + reach
    const z0 = print.z0 - reach
    const z1 = print.z1 + reach
    const y = print.y + 0.002
    const bounds = receiverBounds(print.receiver)
    const corners: Vec3[] = [
      [x0, y, z1],
      [x1, y, z1],
      [x1, y, z0],
      [x0, y, z1],
      [x1, y, z0],
      [x0, y, z0],
    ]
    for (const corner of corners) {
      position.push(...corner)
      rect.push(print.x0, print.z0, print.x1, print.z1)
      clip.push(...bounds)
      spec.push(print.soft, print.strength, print.stage, receiver?.stage ?? 0)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(position), 3)
  )
  geometry.setAttribute('aRect', new BufferAttribute(new Float32Array(rect), 4))
  geometry.setAttribute('aClip', new BufferAttribute(new Float32Array(clip), 4))
  geometry.setAttribute('aSpec', new BufferAttribute(new Float32Array(spec), 4))
  return geometry
}

/** The pool of light: a square on the ground, the disc drawn inside it. */
function poolGeometry(): BufferGeometry {
  const [cx, , cz] = POOL.center
  const r = POOL.radius
  const corners: Vec3[] = [
    [cx - r, 0, cz + r],
    [cx + r, 0, cz + r],
    [cx + r, 0, cz - r],
    [cx - r, 0, cz + r],
    [cx + r, 0, cz - r],
    [cx - r, 0, cz - r],
  ]
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(corners.flat()), 3)
  )
  return geometry
}

/** The uniforms every café material shares: where each stage is. */
interface StageUniforms {
  [uniform: string]: IUniform
  uCafeLift: IUniform<number[]>
  uCafeAlpha: IUniform<number[]>
}

export interface CafeRig {
  readonly scene: Scene
  readonly camera: PerspectiveCamera
  readonly target: WebGLRenderTarget
  /** The picture needs drawing again: a new context, a new size. */
  dirty: boolean
  /** Places every stage `elapsed` ms into the assembly, and the needs. */
  pose(elapsed: number, needs: readonly number[]): void
  /** Draws the café into its target, at `width` × `height` device pixels. */
  draw(gl: WebGLRenderer, width: number, height: number): void
  readonly texture: Texture
  dispose(): void
}

/** The café's scene and target, from its shaded faces (`lib/cafe/light`). */
export function createRig(shaded: readonly ShadedFace[]): CafeRig {
  const stageUniforms: StageUniforms = {
    uCafeLift: { value: STAGES.map(() => 0) },
    uCafeAlpha: { value: STAGES.map(() => 1) },
  }
  const roof: IUniform<number> = { value: 1 }
  const needs: IUniform<number[]> = { value: [0, 0, 0, 0] }

  const model = new Mesh(
    modelGeometry(shaded),
    new ShaderMaterial({
      vertexShader: modelVertex,
      fragmentShader: modelFragment,
      uniforms: { ...stageUniforms, uCafeNeed: needs, uCafeRoof: roof },
      transparent: true,
      depthWrite: true,
      depthTest: true,
    })
  )
  model.renderOrder = 1
  model.frustumCulled = false

  const contacts = new Mesh(
    contactGeometry(),
    new ShaderMaterial({
      vertexShader: contactVertex,
      fragmentShader: contactFragment,
      uniforms: { ...stageUniforms },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -4,
    })
  )
  contacts.renderOrder = 2
  contacts.frustumCulled = false

  const [cx, , cz] = POOL.center
  const pool = new Mesh(
    poolGeometry(),
    new ShaderMaterial({
      vertexShader: poolVertex,
      fragmentShader: poolFragment,
      uniforms: {
        ...stageUniforms,
        uCafePoolCenter: { value: new Vector2(cx, cz) },
        uCafePoolRadius: { value: POOL.radius },
        uCafePoolColor: { value: new Vector3(...shown(toLinear(POOL.color))) },
        uCafePoolAlpha: { value: POOL.alpha },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })
  )
  pool.renderOrder = 0
  pool.frustumCulled = false

  const scene = new Scene()
  scene.add(pool, model, contacts)

  /*
   * The still's camera, exactly: its world transform is the inverse of the
   * view matrix, and its projection is the still's, fit included. Never
   * `updateProjectionMatrix()`, which would rebuild it without the fit.
   */
  const camera = new PerspectiveCamera()
  camera.matrixAutoUpdate = false
  camera.matrix.fromArray([...VIEW_MATRIX]).invert()
  camera.updateMatrixWorld(true)
  camera.projectionMatrix.fromArray([...PROJECTION_MATRIX])
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()

  const target = new WebGLRenderTarget(1, 1, {
    samples: 4,
    depthBuffer: true,
    stencilBuffer: false,
  })

  const rig: CafeRig = {
    scene,
    camera,
    target,
    texture: target.texture,
    dirty: true,
    pose(elapsed, lifts) {
      STAGES.forEach((_, index) => {
        const { lift, alpha } = stageAt(index as Stage, elapsed)
        stageUniforms.uCafeLift.value[index] = lift
        stageUniforms.uCafeAlpha.value[index] = alpha
      })
      roof.value = roofShadeAt(elapsed)
      lifts.forEach((value, index) => {
        needs.value[index] = value
      })
    },
    draw(gl, width, height) {
      if (target.width !== width || target.height !== height) {
        target.setSize(width, height)
      }
      const previous = gl.getRenderTarget()
      const clearAlpha = gl.getClearAlpha()
      const clearColor = gl.getClearColor(new Color())
      gl.setRenderTarget(target)
      gl.setClearColor(0x000000, 0)
      gl.clear(true, true, false)
      gl.render(scene, camera)
      gl.setRenderTarget(previous)
      gl.setClearColor(clearColor, clearAlpha)
      rig.dirty = false
    },
    dispose() {
      for (const mesh of [pool, model, contacts]) {
        mesh.geometry.dispose()
        mesh.material.dispose()
      }
      target.dispose()
    },
  }
  return rig
}
