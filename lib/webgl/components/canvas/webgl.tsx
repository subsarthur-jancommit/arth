'use client'

import { OrthographicCamera, Preload } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import cn from 'clsx'
import { Suspense, useEffect, useState } from 'react'

import { SheetProvider } from '@/lib/dev/theatre'
import { bumpContextGeneration } from '@/lib/webgl/store'
import { FlowmapProvider } from '@/webgl/components/flowmap-provider'
import { PostProcessing } from '@/webgl/components/postprocessing'
import { RAF } from '@/webgl/components/raf'

import { useCanvas } from './'

import s from './webgl.module.css'

type WebGLCanvasProps = React.HTMLAttributes<HTMLDivElement> & {
  render?: boolean
  postprocessing?: boolean
  alpha?: boolean
  className?: string
  /**
   * Which GPU simulations `FlowmapProvider` mounts. Defaults to none
   * (opt-in) — pass the sims you actually use, e.g. `['flowmap']`, to avoid
   * paying for a GPU pass and window listeners with no consumer.
   */
  simTypes?: ('fluid' | 'flowmap')[]
}

/**
 * Attaches `webglcontextlost`/`webglcontextrestored` listeners to the r3f
 * canvas element. `preventDefault()` on loss tells the browser to attempt
 * automatic restoration instead of treating the loss as permanent (mobile
 * GPU resets and long-backgrounded tabs are the common causes — the root
 * canvas persists across client-side navigation, so without this the sims
 * stay visually broken for the rest of the session). On restore, bumps the
 * shared context generation counter so GPU-resource-owning hooks
 * (useFluidSim, useFlowmapSim) rebuild via their existing create/destroy
 * effect cleanup — their hand-built double-buffered render targets sit
 * outside three.js's own tracked-restore path and don't come back on their
 * own.
 */
function ContextLossHandler() {
  const gl = useThree((state) => state.gl)

  useEffect(() => {
    const canvasEl = gl.domElement

    const handleContextLost = (event: Event) => {
      event.preventDefault()
    }
    const handleContextRestored = () => {
      bumpContextGeneration()
    }

    canvasEl.addEventListener('webglcontextlost', handleContextLost)
    canvasEl.addEventListener('webglcontextrestored', handleContextRestored)

    return () => {
      canvasEl.removeEventListener('webglcontextlost', handleContextLost)
      canvasEl.removeEventListener(
        'webglcontextrestored',
        handleContextRestored
      )
    }
  }, [gl])

  return null
}

/**
 * The r3f canvas itself. Lazy-loaded by `Canvas` (see ./index) once the
 * device supports WebGL; reads its tunnels from the surrounding CanvasContext.
 */
export function WebGLCanvas({
  render = true,
  postprocessing = false,
  alpha = true,
  className,
  simTypes,
  ...props
}: WebGLCanvasProps) {
  // Use context directly for local tunnels
  const { WebGLTunnel, DOMTunnel } = useCanvas()

  /*
   * A new r3f canvas each time React shows this tree again: Tahap 85,
   * corrected after `/work`.
   *
   * `components/layout/wrapper` renders `<Canvas root>` inside the page tree,
   * so every route mounts its own WebGL root. Next's `cachedNavigations`
   * keeps the previous page's tree alive but hidden, and React runs effect
   * **cleanups** for a hidden tree while keeping its DOM and its state. r3f
   * tears its root down from a `useEffect` with `[]` deps: the cleanup
   * unmounts the root and kills its context 500 ms later, and the `<canvas>`
   * element stays attached.
   *
   * Tahap 85 found what that left: a `position: fixed`, viewport-sized canvas
   * with a dead context over the whole page, compositing as flat grey, which
   * the repo owner reported as the page "turning white". Measured on `/en`:
   * mean viewport luminance **34.8** fresh against **143.2** after leaving
   * and returning (`docs/stages/TAHAP-85.md` §1). Its answer was to change
   * the canvas's key once the tree was back and its context had turned out
   * lost.
   *
   * That left two defects, which `e2e/work-return.e2e.ts` measures on `/work`:
   *
   * - **The same canvas came back first.** Showing the tree re-runs r3f's
   *   layout effect, which renders into the root it had torn down before any
   *   effect here can run, so every scene in the tunnel mounted into that
   *   root and sent its texture calls to the dead context. The key change
   *   then unmounted a canvas whose root r3f had already forgotten, so that
   *   tree was never unmounted, and stayed subscribed to the tunnel: plates
   *   mounted later went into it too.
   * - **A return inside r3f's 500 ms** found the context still alive, so the
   *   key never changed; then the timer killed the context with the page on
   *   screen.
   *
   * So the key changes when the tree is hidden, not when it comes back. React
   * runs this cleanup as it hides the tree, and the new key is in place by the
   * time the tree is shown: the canvas that comes back is a new instance,
   * with a new `<canvas>` element and context, and the old one is never
   * rendered again. r3f unmounts each root once, on the way out. A new key
   * is the part that matters, as before: a lost context cannot be revived in
   * place, and `ContextLossHandler` below lives inside the root being torn
   * down.
   *
   * `pointer-events: none` is still why only pixels and WebGL calls can show
   * a defect here: the canvas never appears in `elementsFromPoint`.
   */
  const [generation, setGeneration] = useState(0)

  useEffect(() => () => setGeneration((previous) => previous + 1), [])

  if (!(WebGLTunnel && DOMTunnel)) {
    return null
  }

  return (
    <div className={cn(s.webgl, className)} {...props}>
      {/*
        `aria-hidden` on the canvas, not on the container.

        `CLAUDE.md` #13/#14: 3D is an accent, and no page may depend on WebGL
        to be usable or readable — so nothing R3F draws carries meaning a
        screen-reader user would otherwise miss. Left exposed, the canvas is
        content sitting outside every landmark, which axe reports as `region`
        on every page of the site (moderate impact).

        It goes here rather than on the wrapper because `<DOMTunnel.Out />`
        below is the documented way to overlay *real* HTML on the canvas.
        Hiding the wrapper would silently strip that content from the
        accessibility tree the first time someone used the API.
      */}
      <Canvas
        // Moved on whenever the tree is hidden; see above.
        key={generation}
        aria-hidden="true"
        gl={{
          precision: 'highp',
          powerPreference: 'high-performance',
          // Disable MSAA when DPR is high to avoid redundant work
          antialias: !postprocessing && window.devicePixelRatio < 2,
          alpha,
          ...(postprocessing && { stencil: false, depth: false }),
        }}
        dpr={[1, 2]}
        orthographic
        frameloop="never"
        /*
         * `linear` is deliberately **not** set, and that is a correction.
         *
         * It shipped with the fork and set `outputColorSpace` to linear, which
         * switches off the renderer's sRGB conversion on the way out. three
         * still converts every `new Color(...)` from sRGB *into* linear on the
         * way in, so with the conversion disabled at only one end every
         * custom-shaded colour landed on screen as `authored ^ 2.2`.
         *
         * Measured on the hero, whose wash is the site's one large area of
         * colour: the band between the header and the headline rendered at
         * mean luminance **4.0/255 with the canvas and 15.5/255 with it
         * hidden** — the decoration was subtracting light, and the page looked
         * better with its own accent switched off. Forcing the wash to white
         * and rebuilding gave mean 166, which is what proved the mesh was
         * drawing and the transfer curve was the fault: `#242527` is 39, and
         * `(39 / 255) ^ 2.2 * 255 = 4.1`, matching the measurement exactly.
         *
         * `flat` stays: tone mapping is a photographic curve, and this design
         * system wants the colours it authored, not a graded version of them.
         * `docs/stages/TAHAP-17.md` §4 carries the full measurement.
         */
        flat
        eventSource={document.documentElement}
        eventPrefix="client"
        resize={{ scroll: false, debounce: 500 }}
        // Keep the fixed, full-screen canvas from swallowing DOM clicks. r3f
        // still gets pointer events via `eventSource={document.documentElement}`,
        // so 3D raycasting works while the DOM underneath stays interactive.
        style={{ pointerEvents: 'none' }}
      >
        <SheetProvider id="webgl">
          <OrthographicCamera
            makeDefault
            position={[0, 0, 5000]}
            near={0.001}
            far={10000}
            zoom={1}
          />
          <RAF render={render} />
          <ContextLossHandler />
          <FlowmapProvider {...(simTypes && { simTypes })}>
            {postprocessing && <PostProcessing />}
            <Suspense>
              <WebGLTunnel.Out />
            </Suspense>
          </FlowmapProvider>
          <Preload all />
        </SheetProvider>
      </Canvas>
      <DOMTunnel.Out />
    </div>
  )
}
