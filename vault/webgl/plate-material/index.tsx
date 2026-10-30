'use client'

/**
 * PlateMaterial — a working-drawing plate lit as WebGL material, direction
 * B's "maket cahaya", over the flat plate it wraps.
 *
 * Provenance: original work for this project. No third-party code copied.
 * Uses Satūs's canvas and tunnel system (`lib/webgl`, MIT, darkroom.engineering)
 * rather than mounting a second canvas, the pattern
 * `vault/webgl/scene-shell` sets out.
 *
 * ## The flat plate first, always
 *
 * The child is `vault/blocks/plate`, server-rendered, and it is what every
 * reader gets: a phone, reduced motion, a browser without WebGL2, a page
 * before its scene has loaded (CLAUDE.md #14). This component adds to it only
 * when the root canvas will mount, which is the same test `<Canvas>` makes,
 * and only once a frame has been drawn does the flat plate step aside
 * (`data-plate-live`, the split `material-image` draws between
 * `data-material-shell` and `data-material`). Until then there is no moment
 * with neither.
 *
 * The flat plate keeps its place in the accessibility tree throughout. Its
 * `<title>` and `<desc>` are the plate's alt text; the canvas is
 * `aria-hidden` and carries nothing a reader would otherwise miss.
 *
 * ## Why the home page, and not the unit pages
 *
 * The root canvas is drawn behind `<main>`, so the page's own ground must be
 * clear for it to show. The home page is a stage from top to bottom. A unit
 * page is a document with a dark band painted across its opening, and a lit
 * plate in that band would sit under the band's paint; drawing the band in
 * WebGL as well would put a seam between DOM and canvas on every scroll. So
 * the unit pages keep their flat plate (`docs/RENCANA-REVISI-F3.md`, R4).
 *
 * ## What the page tells it
 *
 * `data-plate-progress` on this element (0 to 1), which the page's own
 * timeline writes as the reader scrolls; `[data-plate-clip]` above it, the
 * box the plate must stay inside; and `[data-plate-fade]` above it, whose
 * opacity the lit plate takes on.
 */

import cn from 'clsx'
import { type ComponentType, type ReactNode, useEffect, useState } from 'react'

import type { Unit } from '@/lib/content/units'
import { useDeviceDetection } from '@/lib/hooks/use-device-detection'
import { usePreferredReducedMotion } from '@/lib/hooks/use-sync-external'
import { WebGLTunnel } from '@/webgl/components/tunnel'

import type { PlateMaterialScene as PlateMaterialSceneType } from './scene'

import s from './plate-material.module.css'

type SceneComponent = ComponentType<
  React.ComponentProps<typeof PlateMaterialSceneType>
>

/**
 * Fetches the R3F scene only once this component has decided to show it, so
 * three.js reaches no phone and no reader who asked for reduced motion
 * (`e2e/webgl-budget.e2e.ts`). The type import above is erased at build time.
 */
function usePlateScene(enabled: boolean): SceneComponent | null {
  const [Scene, setScene] = useState<SceneComponent | null>(null)

  useEffect(() => {
    if (!enabled || Scene) return

    let cancelled = false
    import('./scene')
      .then(({ PlateMaterialScene }) => {
        // Thunk: `setState` treats a bare function as an updater.
        if (!cancelled) setScene(() => PlateMaterialScene)
      })
      .catch(() => {
        // The flat plate is already the drawing; a failed chunk leaves it.
      })

    return () => {
      cancelled = true
    }
  }, [enabled, Scene])

  return Scene
}

interface PlateMaterialProps {
  unit: Unit
  /** The flat plate, `vault/blocks/plate`. */
  children: ReactNode
  className?: string | undefined
}

export function PlateMaterial({
  unit,
  children,
  className,
}: PlateMaterialProps) {
  const { isWebGL } = useDeviceDetection()
  const prefersReducedMotion = usePreferredReducedMotion()
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [drew, setDrew] = useState(false)

  // The canvas's own test (`lib/webgl/components/canvas`): if it will not
  // mount, nothing here asks it to draw.
  const canRenderWebGL = isWebGL === true && !prefersReducedMotion
  const Scene = usePlateScene(canRenderWebGL)
  const live = canRenderWebGL && Scene !== null && drew

  return (
    <div
      ref={setElement}
      className={cn(s.root, className)}
      data-plate-material=""
      data-plate-live={live ? '' : undefined}
    >
      {canRenderWebGL && Scene && element && (
        <WebGLTunnel>
          {/* oxlint-disable-next-line react/static-components -- not created
              during render: the module's own export, fetched once and held in
              state, so its identity is stable. Holding it is what keeps
              three.js out of the initial graph. */}
          <Scene
            unit={unit}
            element={element}
            onFirstFrame={() => setDrew(true)}
          />
        </WebGLTunnel>
      )}
      {children}
    </div>
  )
}
