'use client'

/**
 * Hero — the first screen of the home page, rebuilt for G1
 * (`docs/RENCANA-VISUAL-GERAK.md`, the reference's §4 and §6).
 *
 * Provenance: original work for this project. No third-party code copied.
 * Composes this project's own vault primitives over Satūs's canvas system.
 *
 * ## A scene shell, in two layers
 *
 * The reference's §6 separates what is read from what moves:
 *
 * ```text
 * SceneShell (layout; fixed size)
 * ├─ ReadingLayer (H1, caption, controls; no decorative transform)
 * └─ ArtViewport (overflow clip; pointer-events: none for decoration)
 * ```
 *
 * `.reading` is the reading layer: the headline, one sentence of scope and
 * the action, and nothing in it moves for decoration — the magnet that used
 * to pull the action toward the pointer is gone, and the entrance is the
 * headline rising into place once and the two lines under it fading in.
 *
 * `.art` is the art viewport: 7 columns of title and 5 of art on desktop,
 * with the art's box fixed by its aspect ratio, so nothing shifts when the
 * art arrives. It holds today's art — the grid and the grain that used to
 * sit behind the headline, where the reference no longer allows texture —
 * until G3 replaces it with the matte café. It is decoration: `aria-hidden`,
 * no pointer events, clipped to its own corners.
 *
 * The wash under both is `SceneShell` from `vault/webgl/scene-shell`, as
 * before: a gradient, not a texture, drawn by WebGL across the whole hero
 * (its quad covers the canvas's viewport, so it cannot be confined to the
 * art's box) with a CSS gradient where WebGL is not used.
 *
 * ## Order on a phone
 *
 * H1, the sentence of scope, the action — and then the need chooser, which
 * the page renders straight after this block. The art viewport is left out
 * under the desktop breakpoint: the reference makes the illustration
 * optional there, and the unit index that used to sit above the headline is
 * gone, so nothing comes before the benefit.
 *
 * ## Height
 *
 * The content's, not the viewport's. The hero filled 100svh (Tahap 49); the
 * reference asks for the three needs to be seen after the introduction and
 * before any long explanation, so the hero ends where its content does and
 * the chooser starts in the first screen.
 *
 * ## Accessibility
 *
 * - One `<h1>` per page, and it is this one.
 * - The wash and the art are `aria-hidden` decoration and carry no meaning.
 * - Under reduced motion the headline renders as plain text, the reveals
 *   resolve instantly, and the wash falls back to a still gradient. The hero
 *   is fully legible in every one of those paths.
 */

import cn from 'clsx'
import type { ReactNode } from 'react'

import { useReveal } from '@/lib/hooks/use-reveal'
import { GridPattern } from '@/vault/magic/grid-pattern'
import { NoiseTexture } from '@/vault/magic/noise-texture'
import { TextReveal } from '@/vault/motion/text-reveal'
import { SceneShell } from '@/vault/webgl/scene-shell'

import s from './hero.module.css'

interface HeroProps {
  /**
   * The headline. A plain string, because `TextReveal` hands the text to
   * SplitText, which takes ownership of the rendered text nodes.
   */
  headline: string
  /** One sentence of scope. A hero is not a paragraph. */
  subline?: string | undefined
  /** The single call to action. One, not three. */
  action: ReactNode
  className?: string | undefined
}

export function Hero({ headline, subline, action, className }: HeroProps) {
  const ref = useReveal<HTMLDivElement>()

  return (
    /*
     * `data-epic` names one of the two choreographed moments a page is
     * allowed (`MOTION-SPEC.md` §9.5); `e2e/interaction-grammar.e2e.ts`
     * reports it by that name.
     */
    <section className={cn(s.hero, className)} data-epic="hero-arrival">
      <div className={s.wash}>
        <SceneShell />
      </div>

      <div className={s.shell}>
        <div ref={ref} className={s.reading}>
          <TextReveal
            as="h1"
            split="lines"
            // `hero-arrival` is this section's named moment, so the heading
            // is allowed the choreographed band (Tahap 40).
            pace="epic"
            className={s.headline}
          >
            {headline}
          </TextReveal>

          {subline && (
            <p data-reveal-item className={s.subline}>
              {subline}
            </p>
          )}

          <div data-reveal-item className={s.action}>
            {action}
          </div>
        </div>

        <div className={s.art} aria-hidden="true" data-art-viewport="">
          <NoiseTexture className={s.artGrain} />
          <GridPattern width={48} height={48} className={s.artGrid} />
        </div>
      </div>
    </section>
  )
}
