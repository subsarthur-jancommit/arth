'use client'

/**
 * PlateMaterialScene — the R3F side of the lit plate.
 *
 * Provenance: original work for this project. No third-party code copied.
 * Written against the public APIs of @react-three/fiber and three.
 *
 * Rendered *inside* the root canvas, reached through `<WebGLTunnel>`. See
 * `index.tsx` for the DOM side and `shaders.ts` for how a pose becomes a
 * drawing on screen.
 *
 * ## The model
 *
 * At rest a part is exactly where the flat plate draws it: the same box, the
 * same size, facing the reader. As the plate's progress runs, the parts turn
 * into a model of light seen from above and to one side: Konstruksi's plan
 * lies down and its section stands up along the plan's far wall, the way
 * direction B's still drew them; a flow diagram or a board leans back like a
 * sheet on a table. Then the camera keeps turning slowly, so the model is
 * passed rather than shown. Progress is the page's to give
 * (`data-plate-progress`), so the turn follows the reader's scroll.
 */

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import {
  AdditiveBlending,
  CanvasTexture,
  type IUniform,
  LinearFilter,
  LinearMipmapLinearFilter,
  Matrix4,
  type Mesh,
  type Texture,
  Vector2,
  Vector4,
} from 'three'

import type { Unit } from '@/lib/content/units'
import { PLATES, type PlatePart } from '@/lib/plates'
import { drawPlate, type PlateFaces } from '@/lib/plates/canvas'

import { fragmentShader, vertexShader } from './shaders'

/**
 * Texture width in pixels, sharp at the frame's size. By arithmetic, not by
 * measurement: Konstruksi's 1600 × 1556 at four bytes, with its mip chain, is
 * about 13 MB of GPU memory, and the other two a little less.
 */
const TEXTURE_WIDTH = 1600

/** The share of progress spent turning from the sheet into the model. */
const ASSEMBLE = 0.6

/** The share of the assembly each of Konstruksi's two parts takes. */
const STAGGER = 0.7

/** How the model is seen: from above, from one side, and how far it turns. */
const PITCH = (32 * Math.PI) / 180
const YAW = (-24 * Math.PI) / 180
const ORBIT = (14 * Math.PI) / 180

/** How far back a single sheet leans once it is a model. */
const SHEET_LEAN = (62 * Math.PI) / 180

/** Focal length as a multiple of the drawing's height: a mild perspective. */
const FOCAL = 2.4

/**
 * How large each model sits in its cell and how far it is lifted to sit in
 * the middle of it, as shares of the drawing's height. Set by eye on a
 * headless render of this same math, not on the site: the section standing
 * behind Konstruksi's plan makes that model taller than a sheet.
 */
const MODEL: Record<Unit, { scale: number; lift: number }> = {
  konstruksi: { scale: 0.82, lift: -0.2 },
  teknologi: { scale: 0.92, lift: 0 },
  peekabo: { scale: 0.92, lift: 0 },
}

interface PlateUniforms {
  [uniform: string]: IUniform
  uTexture: IUniform<Texture | null>
  uModel: IUniform<Matrix4>
  uSize: IUniform<Vector2>
  uCrop: IUniform<Vector4>
  uAnchor: IUniform<Vector2>
  uPixel: IUniform<Vector2>
  uFocal: IUniform<number>
  uClip: IUniform<Vector4>
  uOpacity: IUniform<number>
  uScan: IUniform<number>
}

function createUniforms(): PlateUniforms {
  return {
    uTexture: { value: null },
    uModel: { value: new Matrix4() },
    uSize: { value: new Vector2(1, 1) },
    uCrop: { value: new Vector4(0, 0, 1, 1) },
    uAnchor: { value: new Vector2() },
    uPixel: { value: new Vector2(1, 1) },
    uFocal: { value: 1000 },
    uClip: { value: new Vector4() },
    uOpacity: { value: 1 },
    uScan: { value: -1 },
  }
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const lerp = (from: number, to: number, t: number) => from + (to - from) * t
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

/** The page's faces, read where the plate is, so the texture sets the same. */
function facesOf(element: Element): PlateFaces {
  const style = getComputedStyle(element)
  return {
    mono: style.getPropertyValue('--font-mono').trim() || 'monospace',
    display: style.getPropertyValue('--font-display').trim() || 'sans-serif',
  }
}

/**
 * Scratch values, reused every frame rather than allocated. Shared by every
 * plate on the page, which is safe: frame callbacks run one after another.
 */
const scratch = {
  camera: new Matrix4(),
  part: new Matrix4(),
  step: new Matrix4(),
  offset: new Vector2(),
  plan: new Vector2(),
}

/**
 * One part's pose at `turn` (0 the flat plate, 1 the model), around the
 * drawing's centre, in pixels with y up.
 */
function pose(
  part: PlatePart,
  offset: Vector2,
  size: Vector2,
  plan: Vector2 | null,
  turn: number,
  out: Matrix4
) {
  const { step } = scratch
  if (part.id === 'plan') {
    out.makeTranslation(lerp(offset.x, 0, turn), lerp(offset.y, 0, turn), 0)
    out.multiply(step.makeRotationX((-Math.PI / 2) * turn))
  } else if (part.id === 'section' && plan) {
    // Its foot along the plan's far edge, standing up from it.
    out.makeTranslation(
      lerp(offset.x, 0, turn),
      lerp(offset.y, size.y / 2, turn),
      lerp(0, -plan.y / 2, turn)
    )
  } else {
    out.makeTranslation(offset.x, offset.y, 0)
    out.multiply(step.makeRotationX(-SHEET_LEAN * turn))
  }
}

interface PlateMaterialSceneProps {
  unit: Unit
  /** The DOM side's root, which holds the flat plate's `<svg>`. */
  element: HTMLElement
  onFirstFrame: () => void
}

export function PlateMaterialScene({
  unit,
  element,
  onFirstFrame,
}: PlateMaterialSceneProps) {
  const plate = PLATES[unit]
  const { parts } = plate
  const gl = useThree((state) => state.gl)
  const size = useThree((state) => state.size)
  const dpr = useThree((state) => state.viewport.dpr)

  const [texture, setTexture] = useState<CanvasTexture | null>(null)
  const [uniforms] = useState(() => parts.map(() => createUniforms()))
  const meshes = useRef<(Mesh | null)[]>([])
  const announced = useRef(false)

  /*
   * The texture is drawn once the page's faces have loaded, so its labels
   * are set in Geist Mono and Onest rather than whatever a canvas falls back
   * to. Created here, so it is disposed here (CLAUDE.md #15): three disposes
   * what JSX made, and this was not made by JSX.
   */
  useEffect(() => {
    let cancelled = false
    let made: CanvasTexture | null = null

    document.fonts.ready
      .then(() => {
        if (cancelled) return
        const canvas = drawPlate(plate, TEXTURE_WIDTH, facesOf(element))
        if (!canvas) return
        made = new CanvasTexture(canvas)
        made.generateMipmaps = true
        made.minFilter = LinearMipmapLinearFilter
        made.magFilter = LinearFilter
        made.anisotropy = gl.capabilities.getMaxAnisotropy()
        setTexture(made)
      })
      .catch(() => {
        // No texture, no mesh: the flat plate stays, and it is the same
        // drawing.
      })

    return () => {
      cancelled = true
      made?.dispose()
    }
  }, [plate, element, gl])

  useEffect(() => {
    for (const set of uniforms) set.uTexture.value = texture
  }, [texture, uniforms])

  useFrame(() => {
    const svg = element.querySelector('svg')
    const hide = () => {
      for (const mesh of meshes.current) if (mesh) mesh.visible = false
    }
    if (!texture || !svg) return hide()

    // The flat plate's box as drawn now, every transform above it included:
    // the reel's wipe, the drawing's counter-move, the frame's settle.
    const box = svg.getBoundingClientRect()
    const frame = element.closest('[data-plate-clip]')?.getBoundingClientRect()
    const left = Math.max(box.left, frame?.left ?? 0, 0)
    const right = Math.min(box.right, frame?.right ?? size.width, size.width)
    const top = Math.max(box.top, frame?.top ?? 0, 0)
    const bottom = Math.min(
      box.bottom,
      frame?.bottom ?? size.height,
      size.height
    )
    if (box.width <= 0 || box.height <= 0 || left >= right || top >= bottom) {
      return hide()
    }

    const fade = element.closest('[data-plate-fade]')
    const opacity = fade ? Number(getComputedStyle(fade).opacity) : 1
    const progress = clamp01(Number(element.dataset.plateProgress ?? 0))
    const assembly = clamp01(progress / ASSEMBLE)
    const turn = easeInOut(assembly)
    const orbit = clamp01((progress - ASSEMBLE) / (1 - ASSEMBLE))
    /*
     * Konstruksi's parts take turns: the plan lies down first, then the
     * section rises along its far wall, so the model is seen being put
     * together rather than two sheets passing through each other.
     */
    const turnOf = (part: PlatePart) =>
      part.id === 'plan'
        ? easeInOut(clamp01(assembly / STAGGER))
        : part.id === 'section'
          ? easeInOut(clamp01((assembly - (1 - STAGGER)) / STAGGER))
          : turn

    // The drawing inside the box, as `preserveAspectRatio` fits it.
    const [viewX, viewY, viewWidth, viewHeight] = plate.viewBox
    const fit = Math.min(box.width / viewWidth, box.height / viewHeight)
    const drawingHeight = viewHeight * fit
    const model = MODEL[unit]

    const { camera, part: partMatrix } = scratch
    camera
      .makeTranslation(0, model.lift * drawingHeight * turn, 0)
      .multiply(
        scratch.step.makeScale(
          lerp(1, model.scale, turn),
          lerp(1, model.scale, turn),
          lerp(1, model.scale, turn)
        )
      )
      .multiply(scratch.step.makeRotationX(PITCH * turn))
      .multiply(scratch.step.makeRotationY(YAW * turn + ORBIT * orbit))

    const anchorX = ((box.left + box.width / 2) / size.width) * 2 - 1
    const anchorY = 1 - ((box.top + box.height / 2) / size.height) * 2
    const planPart = parts.find((part) => part.id === 'plan')
    const plan = planPart
      ? scratch.plan.set(planPart.rect[2] * fit, planPart.rect[3] * fit)
      : null

    parts.forEach((part, index) => {
      const set = uniforms[index]
      const mesh = meshes.current[index]
      if (!set || !mesh) return
      const [x, y, w, h] = part.rect

      set.uSize.value.set(w * fit, h * fit)
      const offset = scratch.offset.set(
        (x + w / 2 - (viewX + viewWidth / 2)) * fit,
        -(y + h / 2 - (viewY + viewHeight / 2)) * fit
      )
      pose(part, offset, set.uSize.value, plan, turnOf(part), partMatrix)
      set.uModel.value.multiplyMatrices(camera, partMatrix)
      set.uCrop.value.set(
        (x - viewX) / viewWidth,
        1 - (y + h - viewY) / viewHeight,
        w / viewWidth,
        h / viewHeight
      )
      set.uAnchor.value.set(anchorX, anchorY)
      set.uPixel.value.set(2 / size.width, 2 / size.height)
      set.uFocal.value = FOCAL * drawingHeight
      set.uClip.value.set(
        left * dpr,
        (size.height - bottom) * dpr,
        right * dpr,
        (size.height - top) * dpr
      )
      set.uOpacity.value = opacity
      set.uScan.value = turn > 0 && turn < 1 ? turn : -1
      mesh.visible = opacity > 0.001
    })

    if (!announced.current) {
      announced.current = true
      onFirstFrame()
    }
  })

  return (
    <>
      {parts.map((part, index) => (
        <mesh
          key={part.id}
          ref={(mesh) => {
            meshes.current[index] = mesh
          }}
          // Displaced in the vertex shader, so three's bounds are not its own.
          frustumCulled={false}
          visible={false}
        >
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms[index] ?? createUniforms()}
            transparent
            premultipliedAlpha
            depthTest={false}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  )
}
