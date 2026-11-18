'use client'

/**
 * CafeIllustration — the home hero's matte café: an SVG still that every
 * reader gets, and the same café drawn by WebGL where WebGL is used. G3 of
 * `docs/RENCANA-VISUAL-GERAK.md`, the reference's §5 path B.
 *
 * Provenance: original work for this project. No third-party code copied.
 * Uses Satūs's canvas and tunnel system (`lib/webgl`, MIT,
 * darkroom.engineering) rather than mounting a second canvas, the pattern
 * `vault/webgl/scene-shell` sets out.
 *
 * ## The still first, always
 *
 * The child is `CafeStill` (`still.tsx`), written by the server: on a
 * phone, under reduced motion, without WebGL2, before the scene has loaded,
 * and while a context is lost, it is the picture (CLAUDE.md #14). It
 * assembles itself in CSS from the first paint, once.
 *
 * Where the root canvas will mount (the test `<Canvas>` makes), the scene's
 * chunk is fetched at once, but the scene is only mounted once the still's
 * assembly has finished, so WebGL never takes over halfway through an
 * arrival: it takes over a café at rest, and draws exactly the café at rest
 * (the same model, camera and light, `lib/cafe`). Only once it has drawn a
 * frame does the still step aside, by opacity, keeping its box: there is no
 * moment with neither, and no layout shift either way.
 *
 * ## What the page can ask of it
 *
 * `lib/cafe/state.ts`: `assemble()`, the `phase` (`data-cafe-state` here),
 * and `setNeed()` (`data-cafe-need`). The same from outside React, as DOM
 * events on this element: `cafe:assemble`, and `cafe:need` with a need or
 * `null` as `detail`. Asked to assemble with the canvas drawing, the scene
 * plays it; with no canvas, the still replays its own.
 *
 * `data-cafe-assembly`, a number from 0 to 1 written on this element, holds
 * the WebGL assembly at that point instead of letting it play: for a
 * screenshot of the café mid-assembly (`e2e/g3-cafe.e2e.ts`), and for G4 if
 * it scrubs the assembly by hand.
 */

import cn from 'clsx'
import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { cafe, isCafeNeed, useCafe } from '@/lib/cafe/state'
import { useDeviceDetection } from '@/lib/hooks/use-device-detection'
import { useReveal } from '@/lib/hooks/use-reveal'
import { usePreferredReducedMotion } from '@/lib/hooks/use-sync-external'
import { WebGLTunnel } from '@/webgl/components/tunnel'

import type { CafeScene as CafeSceneType } from './scene'

import s from './cafe.module.css'

type SceneComponent = ComponentType<React.ComponentProps<typeof CafeSceneType>>

/**
 * Fetches the R3F scene only once this component has decided to show it, so
 * three.js reaches no phone and no reader who asked for reduced motion
 * (`e2e/webgl-budget.e2e.ts`). The type import above is erased at build time.
 */
function useCafeScene(enabled: boolean): SceneComponent | null {
  const [Scene, setScene] = useState<SceneComponent | null>(null)

  useEffect(() => {
    if (!enabled || Scene) return

    let cancelled = false
    import('./scene')
      .then(({ CafeScene }) => {
        // Thunk: `setState` treats a bare function as an updater.
        if (!cancelled) setScene(() => CafeScene)
      })
      .catch(() => {
        // The still is already the café; a failed chunk leaves it.
      })

    return () => {
      cancelled = true
    }
  }, [enabled, Scene])

  return Scene
}

/**
 * Resolves once every CSS animation under `root` has finished: at once when
 * there are none (reduced motion, a hidden box, a browser without
 * `getAnimations`), and also when one is cancelled.
 */
async function arrived(root: Element | null, restart: boolean): Promise<void> {
  if (!root || typeof root.getAnimations !== 'function') return
  const animations = root.getAnimations({ subtree: true })
  if (restart) {
    for (const animation of animations) {
      animation.currentTime = 0
      animation.play()
    }
  }
  await Promise.all(
    animations.map((animation) =>
      animation.finished.then(
        () => undefined,
        () => undefined
      )
    )
  )
}

interface CafeIllustrationProps {
  /** The still, `CafeStill`, written by the server. */
  children: ReactNode
  className?: string | undefined
}

export function CafeIllustration({
  children,
  className,
}: CafeIllustrationProps) {
  const { isWebGL } = useDeviceDetection()
  const prefersReducedMotion = usePreferredReducedMotion()
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const { phase, run, need } = useCafe()

  /*
   * The run the still is playing, and whether it is replaying one it was
   * asked for after the page's own. `null` once it has arrived.
   */
  const [still, setStill] = useState<{ run: number; replay: boolean } | null>(
    null
  )
  const [arrivedOnce, setArrivedOnce] = useState(false)
  const [drew, setDrew] = useState(false)
  /** The newest run the still has been given to play. */
  const played = useRef(-1)

  const canRenderWebGL = isWebGL === true && !prefersReducedMotion
  const Scene = useCafeScene(canRenderWebGL)
  const live = canRenderWebGL && Scene !== null && drew

  // The page's own arrival: a run of its own, played by the still in CSS.
  useEffect(() => {
    const own = cafe.assemble()
    played.current = own
    setStill({ run: own, replay: false })
  }, [])

  /*
   * Forgotten whenever the café leaves the screen with its page, as
   * `vault/webgl/plate-material` does: `cachedNavigations` keeps a hidden
   * tree's state, and the canvas after Back is a new one. Until it draws,
   * the still shows.
   */
  useEffect(() => () => setDrew(false), [])

  // A later run, asked for while no canvas is drawing: the still replays it.
  useEffect(() => {
    if (live || phase !== 'assembling' || run <= played.current) return
    played.current = run
    setStill({ run, replay: true })
  }, [live, phase, run])

  // The still's animations, waited for, then the run settled.
  useLayoutEffect(() => {
    if (!element || !still) return
    let cancelled = false
    arrived(element.querySelector('svg'), still.replay)
      .then(() => {
        if (cancelled) return
        cafe.settle(still.run)
        setStill(null)
        setArrivedOnce(true)
      })
      .catch(() => {
        // `arrived` does not reject; nothing to recover.
      })
    return () => {
      cancelled = true
    }
  }, [element, still])

  // The same surface as DOM events, for a page outside React.
  useEffect(() => {
    if (!element) return
    const assemble = () => {
      cafe.assemble()
    }
    const choose = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null
      cafe.setNeed(isCafeNeed(detail) ? detail : null)
    }
    element.addEventListener('cafe:assemble', assemble)
    element.addEventListener('cafe:need', choose)
    return () => {
      element.removeEventListener('cafe:assemble', assemble)
      element.removeEventListener('cafe:need', choose)
    }
  }, [element])

  return (
    <div
      ref={setElement}
      className={cn(s.root, className)}
      data-cafe=""
      data-cafe-state={phase}
      data-cafe-need={need ?? undefined}
      data-cafe-live={live ? '' : undefined}
      data-cafe-settled={still === null && arrivedOnce ? '' : undefined}
      data-cafe-replay={still?.replay ? '' : undefined}
    >
      {canRenderWebGL && Scene && element && arrivedOnce && (
        <WebGLTunnel>
          {/* oxlint-disable-next-line react/static-components -- not created
              during render: the module's own export, fetched once and held in
              state, so its identity is stable. Holding it is what keeps
              three.js out of the initial graph. */}
          <Scene
            element={element}
            onFirstFrame={() => setDrew(true)}
            // The still again while the context is lost, until the restored
            // one reports a frame (`use-first-frame`).
            onContextLost={() => setDrew(false)}
          />
        </WebGLTunnel>
      )}
      {children}
    </div>
  )
}

interface CafeAsideProps {
  /** The still, `CafeStill`, with ids of its own. */
  children: ReactNode
}

/**
 * The café on a phone: after the three needs, in a box of its own, still
 * only (WebGL is a desktop's). It assembles when the reader reaches it.
 */
export function CafeAside({ children }: CafeAsideProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={s.aside} aria-hidden="true" data-cafe-aside="">
      {children}
    </div>
  )
}
