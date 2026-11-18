'use client'

/**
 * CafeScene — the R3F side of the matte café.
 *
 * Provenance: original work for this project. No third-party code copied.
 * Written against the public APIs of @react-three/fiber and three.
 *
 * Rendered inside the root canvas, reached through `<WebGLTunnel>`; see
 * `index.tsx` for the DOM side and `rig.ts` for the café itself.
 *
 * ## Every frame, and what it costs
 *
 * One quad, the size of the art viewport, showing the café's render target.
 * The café is drawn into that target again only when its picture changes:
 * while an assembly plays (`assemble()`), while a need's parts move
 * (`setNeed()`), when the box changes size or the context comes back. At
 * rest nothing is drawn but the quad; off screen, not even that; in a hidden
 * tab the shared loop does not run at all (CLAUDE.md #6: this is a slot in
 * Tempus, through r3f's `useFrame`, never a loop of its own).
 *
 * The box is read in this frame, after every writer (`WEBGL_FRAME_ORDER`),
 * so the quad sits where the DOM box is, the frame it is drawn.
 */

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Mesh, ShaderMaterial, Texture } from 'three'

import { ASSEMBLY_MS } from '@/lib/cafe/assembly'
import { type ShadedFace, shading } from '@/lib/cafe/light'
import { cafe } from '@/lib/cafe/state'
import { useFirstFrame } from '@/webgl/hooks/use-first-frame'

import { type CafeRig, createRig, NEED_INDEX } from './rig'
import { displayFragment, displayVertex } from './shaders'

/** How long the shading may run in one frame before it waits for the next. */
const SHADING_SLICE_MS = 6

/** How far a need's parts rise when it is chosen (G3's default), metres. */
const NEED_LIFT = 0.18
/** How quickly they get there: the time constant of an exponential ease. */
const NEED_TAU = 0.14

interface CafeSceneProps {
  /** The DOM side's root: the art viewport's box. */
  element: HTMLElement
  onFirstFrame: () => void
  /**
   * Called when the context is lost, so the still shows again until the
   * restored context reports a frame (`lib/webgl/hooks/use-first-frame.ts`).
   */
  onContextLost: () => void
}

/** The display quad's uniform, read through the mesh that holds it. */
function textureSlot(mesh: Mesh | null): { value: Texture | null } | null {
  const material = mesh?.material as ShaderMaterial | undefined
  return (material?.uniforms.uCafe as { value: Texture | null }) ?? null
}

export function CafeScene({
  element,
  onFirstFrame,
  onContextLost,
}: CafeSceneProps) {
  const gl = useThree((state) => state.gl)
  const size = useThree((state) => state.size)
  const announce = useFirstFrame(onFirstFrame, onContextLost)
  const quad = useRef<Mesh>(null)
  const rig = useRef<CafeRig | null>(null)
  /*
   * The run this scene has seen (the page's own was played by the still
   * before it mounted), the one it is playing, and what it last drew.
   */
  const motion = useRef({
    seen: cafe.getSnapshot().run,
    run: -1,
    playing: false,
    startedAt: 0,
    lifts: [0, 0, 0, 0],
    drawn: { elapsed: -1, lifts: '', width: 0, height: 0 },
  })

  /*
   * The café's light, worked out a slice per frame (`lib/cafe/light.ts`
   * `shading`), then its scene and target, made in the frame loop and
   * disposed here (CLAUDE.md #15). Until then the still shows.
   */
  const steps = useRef<Generator<void, readonly ShadedFace[]> | null>(null)
  useEffect(() => {
    steps.current = shading()
    return () => {
      steps.current = null
      rig.current?.dispose()
      rig.current = null
    }
  }, [])

  // A restored context has lost the target's picture: draw it again.
  useEffect(() => {
    const canvas = gl.domElement
    const restored = () => {
      if (rig.current) rig.current.dirty = true
    }
    canvas.addEventListener('webglcontextrestored', restored)
    return () => canvas.removeEventListener('webglcontextrestored', restored)
  }, [gl])

  useFrame((state, delta) => {
    const mesh = quad.current
    if (!mesh) return
    if (!rig.current) {
      const pending = steps.current
      if (!pending) return
      const until = performance.now() + SHADING_SLICE_MS
      let step = pending.next()
      while (!step.done && performance.now() < until) step = pending.next()
      if (!step.done) return
      steps.current = null
      rig.current = createRig(step.value)
    }
    const made = rig.current
    if (!made) return
    const hide = () => {
      mesh.visible = false
    }
    // Nothing is drawn into a lost context; the still is showing.
    if (gl.getContext().isContextLost()) return hide()

    const m = motion.current
    const now = state.clock.elapsedTime * 1000
    const { run, need } = cafe.getSnapshot()

    // A run asked for since this scene arrived plays here, and settles.
    if (run > m.seen) {
      m.seen = run
      m.run = run
      m.playing = true
      m.startedAt = now
    }
    let elapsed = ASSEMBLY_MS
    if (m.playing) {
      elapsed = Math.min(ASSEMBLY_MS, now - m.startedAt)
      if (elapsed >= ASSEMBLY_MS) {
        m.playing = false
        cafe.settle(m.run)
      }
    }
    // Held by the page at a point of the assembly (`index.tsx`).
    const hold = Number.parseFloat(element.dataset.cafeAssembly ?? '')
    if (Number.isFinite(hold)) {
      elapsed = Math.min(1, Math.max(0, hold)) * ASSEMBLY_MS
    }

    // The per-need change: the chosen need's parts rise, eased toward the
    // newest choice from wherever they are, so a new choice interrupts.
    const chosen = need ? NEED_INDEX[need] : 0
    const ease = 1 - Math.exp(-Math.min(delta, 0.1) / NEED_TAU)
    m.lifts = m.lifts.map((value, index) => {
      const target = index > 0 && index === chosen ? NEED_LIFT : 0
      const next = value + (target - value) * ease
      return Math.abs(target - next) < 1e-4 ? target : next
    })

    // The box, as the DOM has it in this frame.
    const box = element.getBoundingClientRect()
    if (
      box.width <= 0 ||
      box.height <= 0 ||
      box.bottom <= 0 ||
      box.right <= 0 ||
      box.top >= size.height ||
      box.left >= size.width
    ) {
      return hide()
    }

    // Whole device pixels, so the target's texels meet the screen's.
    const dpr = gl.getPixelRatio()
    const left = Math.round(box.left * dpr)
    const top = Math.round(box.top * dpr)
    const width = Math.max(1, Math.round(box.width * dpr))
    const height = Math.max(1, Math.round(box.height * dpr))

    const lifts = m.lifts.join(',')
    const last = m.drawn
    if (
      made.dirty ||
      last.elapsed !== elapsed ||
      last.lifts !== lifts ||
      last.width !== width ||
      last.height !== height
    ) {
      made.pose(elapsed, m.lifts)
      made.draw(gl, width, height)
      m.drawn = { elapsed, lifts, width, height }
    }

    const slot = textureSlot(mesh)
    if (slot && slot.value !== made.texture) slot.value = made.texture
    const w = width / dpr
    const h = height / dpr
    mesh.position.set(
      left / dpr + w / 2 - size.width / 2,
      size.height / 2 - (top / dpr + h / 2),
      0
    )
    mesh.scale.set(w, h, 1)
    mesh.visible = true

    // Once, and never from a lost context: `useFirstFrame`.
    announce()
  })

  return (
    <mesh ref={quad} visible={false} frustumCulled={false} renderOrder={5}>
      <planeGeometry args={[1, 1]} />
      {/*
        The target holds premultiplied, encoded colour (`rig.ts`), so it is
        put down with `ONE, ONE_MINUS_SRC_ALPHA` and converted no further.
      */}
      <shaderMaterial
        vertexShader={displayVertex}
        fragmentShader={displayFragment}
        uniforms={{ uCafe: { value: null } }}
        transparent
        premultipliedAlpha
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}
