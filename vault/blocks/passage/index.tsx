'use client'

import { useGSAP } from '@gsap/react'
import cn from 'clsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type ReactNode, useRef } from 'react'

import { usePreferredReducedMotion } from '@/lib/hooks/use-sync-external'

import s from './passage.module.css'

/**
 * Passage — the home page's pinned path: the units' working drawings, one
 * plate at a time, then the section they open.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## What it carries now — R4
 *
 * Tahap 49 built this as a reel of the featured works' covers, and V1 of
 * `docs/RENCANA-KONTEKS-V2.md` took it off the page with them: those works
 * were never Arthur's (decision D1). R4 brings it back with what the home
 * page was missing in their place, the three plates of direction B
 * (`docs/r4-arah-visual/`): Konstruksi's plan and section of a café,
 * Teknologi's order flow for it, Peekabo's campaign board for its opening.
 * One café, three units, which is the order the unit list below reads in.
 *
 * | Fraction | Movement |
 * | --- | --- |
 * | 0 → 0.15 | The frame settles (`yPercent 8 → 0`, `scale 0.94 → 1`) |
 * | 0.08 → 0.8 | One share per plate. Each after the first wipes up through the frame with its caption while the one before fades, its drawing counter-moving from `scale 1.2`; then the plate rests, and its `data-plate-progress` runs from 0 to 1 |
 * | 0.78 → 0.94 | The section title rises through its mask |
 * | 0.88 → 1 | The stage drifts up as the pin releases |
 *
 * The rest is for reading, and on a desktop with WebGL it is also the turn:
 * `vault/webgl/plate-material` reads the progress and lights the plate as a
 * model that turns as the reader scrolls (direction B). Without the material
 * a plate simply holds still for its share.
 *
 * ## No grid behind it any more
 *
 * The covers' reel sat on the site's twelve-column grid (`vault/magic/
 * grid-pattern`). The plates are drawings on their own grid lines, and the
 * field behind them only made them busier; it also ran under the passage's
 * own words, where `e2e/contrast-situ.e2e.ts` found the eyebrow at 4.45:1 on
 * a phone, one line of the grid under an 11px caption (CI #53, first run).
 * The passage stands on the page's ground alone.
 *
 * ## The plates are content now, and read as content
 *
 * The reel used to be `aria-hidden`: every cover in it was repeated by the
 * card below it. A plate is not repeated anywhere on this page, so each one
 * is a `<figure>`: the drawing names itself (`vault/blocks/plate`, `role="img"`
 * with a title and a description) and its caption says which unit, which
 * work and which drawing. A screen reader meets the three figures in order
 * whether or not the reel is moving. Nothing in the reel is focusable, so
 * no focus target can sit in a parked plate.
 *
 * ## Whole without motion, and whole without JavaScript
 *
 * A reel that rests on its first plate hides the other two, so the reel is
 * only a reel when it can move. Under reduced motion the stylesheet lays the
 * figures out one after another, every plate in the flow and fully visible,
 * and no ScrollTrigger is created, so no pin spacer adds empty scroll
 * (`e2e/journey.e2e.ts`). Without JavaScript the same unwrap comes from a
 * `<noscript>` rule, the idiom `vault/motion/horizontal` uses, for the reason
 * `vault/motion/curtain` records: `@media (scripting: none)` is not yet
 * universal.
 *
 * ## This is not scroll hijacking
 *
 * The reader scrolls at their own rate; `End` still reaches the footer; `Tab`
 * still walks the whole page; letting go stops the movement instantly. What
 * is pinned is **what is visible**, not **how fast the page scrolls**.
 */

/** A plate as the reel shows it. */
export interface PassagePlate {
  /** Stable key: the unit. */
  id: string
  /** The unit's name, over the caption. */
  unit: string
  /** The work the drawing belongs to. */
  title: string
  /** Which drawing it is. */
  meta: string
  /** The drawing, which carries its own accessible name. */
  media: ReactNode
}

/**
 * Screens of scroll per plate, on top of the intro and the title's rise:
 * enough for a plate to arrive, be read, and turn.
 */
const SCREENS_PER_PLATE = 0.9

/** Screens of scroll the passage spends before and after the plates. */
const SCREENS_AROUND = 1.2

/**
 * The title's travel through its mask, as a percentage of its own height.
 *
 * All of it, and with no fade (R5). The rise was 40% with `opacity` 0 to 1,
 * and a scrubbed fade rests wherever the reader stops: at 1280x720 the title
 * held at 0.567, which put the muted "Gambar kerja" at 3.72:1 where 4.5:1 is
 * needed (`e2e/contrast-situ.e2e.ts`, run 41175849016). A line that starts
 * wholly under its mask is hidden without a fade, so on its way up every
 * glyph shown is at full ink, the way `TextReveal` hides its lines.
 */
const TITLE_RISE = 100

/** How far into the frame a drawing starts, and how much larger. */
const PLATE_COUNTER = -30
const PLATE_ENTRY_SCALE = 1.2

/** Where the plates' shares begin and end, as fractions of the pin. */
const PLATES_FROM = 0.08
const PLATES_TO = 0.8

/** The share of a plate's time spent arriving; the rest is its progress. */
const ARRIVAL = 0.3

/** Stable across renders, so a page that passes no plates re-renders nothing. */
const NO_PLATES: readonly PassagePlate[] = []

/** A reel of one is a still, not a reel. */
const REEL_MINIMUM = 2

/** Three units, three plates; past six the pin would start withholding the page. */
const REEL_MAXIMUM = 6

/** Index as the reel prints it: `01`, `02` … */
function index(value: number) {
  return String(value).padStart(2, '0')
}

/**
 * The reduced-motion unwrap, for a reader with scripting off.
 *
 * Static and self-authored, with no interpolation, the same terms as the
 * `<noscript>` rules in `vault/motion/horizontal` and `vault/motion/curtain`.
 * It targets the markers below rather than the module's hashed class names,
 * which a string written here cannot know. Keep it in step with the
 * stylesheet's `@media (--reduced-motion)` block.
 */
const NOSCRIPT_STYLE =
  '[data-passage]{min-height:auto!important}' +
  '[data-passage-stage]{padding-block:0!important}' +
  '[data-passage-frame]{display:grid!important;gap:calc(var(--section-lead) * 2)!important;height:auto!important;overflow:visible!important}' +
  '[data-passage-plate]{position:relative!important;inset:auto!important;transform:none!important}' +
  '[data-passage-drawing] svg{height:auto!important;max-height:75svh!important}'

interface PassageProps {
  /**
   * The section header this passage delivers.
   *
   * A slot rather than props, because the header is
   * `components/ui/section-header` and already owns its own typography. The
   * page owns the words; this block owns only when they arrive.
   */
  children: ReactNode
  /** The plates the reel runs through. Fewer than two draws no reel. */
  plates?: readonly PassagePlate[] | undefined
  /**
   * One line under the frame that holds for every plate: that each is a
   * possible sequence, not a project done. Said once rather than three times
   * to a screen reader.
   */
  note?: ReactNode | undefined
  className?: string | undefined
}

export function Passage({
  children,
  plates = NO_PLATES,
  note,
  className,
}: PassageProps) {
  const root = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePreferredReducedMotion()
  const reel =
    plates.length >= REEL_MINIMUM ? plates.slice(0, REEL_MAXIMUM) : []
  const count = reel.length

  useGSAP(
    () => {
      const element = root.current
      if (!element) return

      /*
       * Read `matchMedia` as well as the hook, for the reason
       * `vault/motion/text-reveal` records: the hook's server snapshot is
       * `false`, so the first commit — the one this effect runs in — sees
       * `false` even for a reader who has the preference on.
       */
      const reduced =
        prefersReducedMotion ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      /*
       * No reel, no pin. A passage with nothing to run through would hold a
       * title-high strip under the fixed header while the reader scrolled
       * past nothing.
       */
      if (reduced || count === 0) return

      gsap.registerPlugin(ScrollTrigger)

      const title = element.querySelector(`.${s.title}`)
      const stage = element.querySelector(`.${s.stage}`)
      const frame = element.querySelector(`.${s.frame}`)
      if (!title || !stage || !frame) return

      const screens = SCREENS_AROUND + SCREENS_PER_PLATE * count

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: `+=${Math.round(screens * 100)}%`,
          pin: true,
          /*
           * Half a second of catch-up, the same figure `vault/motion/parallax`
           * uses. Shared so the two scrubbed mechanisms on this page settle
           * at the same rate; two different smoothings read as two systems
           * disagreeing rather than as one page.
           */
          scrub: 0.5,
          pinSpacing: true,
        },
      })

      timeline
        /*
         * The frame settles, but is never hidden. The covers used to fade in
         * with the pin; a plate is the content of this section, and a reader
         * arriving from the hero should meet the first drawing rather than a
         * screen of empty grid.
         */
        .fromTo(
          frame,
          { yPercent: 8, scale: 0.94 },
          { yPercent: 0, scale: 1, duration: 0.15 },
          0
        )

      /*
       * The plates, one share each. The first rests in the frame already;
       * each one after it wipes up while the one before fades, and its
       * drawing moves the other way and settles from a larger scale: two
       * transforms in opposite directions, which is what makes a flat wipe
       * read as depth. Then the plate rests for the rest of its share, and
       * its progress runs, for the material to turn it by.
       */
      const plateNodes = [...element.querySelectorAll(`.${s.plate}`)]
      const drawingNodes = [...element.querySelectorAll(`.${s.drawing}`)]
      const share = (PLATES_TO - PLATES_FROM) / count
      for (let i = 0; i < count; i += 1) {
        const from = PLATES_FROM + share * i
        const plate = plateNodes[i]
        const drawing = drawingNodes[i]
        if (!plate || !drawing) continue

        const arrival = i === 0 ? 0 : share * ARRIVAL
        const previous = plateNodes[i - 1]
        if (i > 0) {
          timeline
            /*
             * `y: 0` on both ends, and it is load-bearing. At rest the
             * stylesheet parks this plate with `translateY(101%)`; GSAP
             * reads that computed matrix back as a **pixel** `y`, and a tween
             * of `yPercent` alone would stack on top of it — the plate would
             * travel from 202% to 101% and never enter the frame. Measured
             * in Tahap 49: the first build showed one cover under every
             * index.
             */
            .fromTo(
              plate,
              { y: 0, yPercent: 101 },
              { y: 0, yPercent: 0, duration: arrival },
              from
            )
            .fromTo(
              drawing,
              { yPercent: PLATE_COUNTER, scale: PLATE_ENTRY_SCALE },
              { yPercent: 0, scale: 1, duration: arrival },
              from
            )
        }
        if (i > 0 && previous) {
          timeline.fromTo(
            previous,
            { opacity: 1 },
            { opacity: 0, duration: arrival },
            from
          )
        }

        // The rest of the share: progress for the material, if there is one.
        const material = plate.querySelector('[data-plate-material]')
        if (material) {
          timeline.fromTo(
            material,
            { attr: { 'data-plate-progress': 0 } },
            { attr: { 'data-plate-progress': 1 }, duration: share - arrival },
            from + arrival
          )
        }
      }

      timeline
        .fromTo(
          title,
          { yPercent: TITLE_RISE },
          { yPercent: 0, duration: 0.16 },
          0.78
        )
        /*
         * The release. The stage drifts up as the pin lets go, so the passage
         * reads as lifting away rather than as the page jumping past it —
         * the same asymmetry `page-transition` uses on its way out.
         */
        .fromTo(stage, { yPercent: 0 }, { yPercent: -6, duration: 0.12 }, 0.88)

      return () => {
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    },
    /*
     * `revertOnUpdate`, so a dependency change tears down what the last run
     * built before the next one runs. Without it, turning reduced motion on
     * mid-visit left the pin alive, and a change in the number of plates
     * would have stacked a second pin over the first.
     */
    {
      dependencies: [prefersReducedMotion, count],
      scope: root,
      revertOnUpdate: true,
    }
  )

  return (
    <section
      ref={root}
      className={cn(s.passage, count > 0 && s.withReel, className)}
      /*
       * A named moment, so `e2e/interaction-grammar.e2e.ts` can report it by
       * name rather than point at an anonymous element.
       */
      data-epic="arth-passage"
      data-passage=""
      /*
       * The heading inside is announced by this moment rather than by the
       * reveal contract: a container reveal and a scrubbed passage would be
       * two entrances competing for one element (`MOTION-SPEC.md` §9.4
       * rule 2).
       */
      data-reveal-exempt=""
    >
      {count > 0 && (
        <noscript>
          {/* oxlint-disable-next-line react/no-danger -- a static, self-authored string with no interpolation; `style-src` carries 'unsafe-inline' as the documented base policy (lib/integrations/csp.ts), and the rule must reach markup that no script will unwrap */}
          <style dangerouslySetInnerHTML={{ __html: NOSCRIPT_STYLE }} />
        </noscript>
      )}
      <div className={s.stage} data-passage-stage="">
        {count > 0 && (
          <div className={s.reel}>
            <div className={s.frame} data-passage-frame="" data-plate-clip="">
              {reel.map((plate, position) => (
                <figure
                  key={plate.id}
                  className={s.plate}
                  data-passage-plate=""
                  data-plate-fade=""
                >
                  <div className={s.drawing} data-passage-drawing="">
                    {plate.media}
                  </div>
                  <figcaption className={s.caption}>
                    <span className={s.count}>
                      <span className={cn('h2', s.countValue)}>
                        {index(position + 1)}
                      </span>
                      <span className={cn('caption', s.countTotal)}>
                        / {index(count)}
                      </span>
                    </span>
                    <span className={cn('caption', s.captionUnit)}>
                      {plate.unit}
                    </span>
                    <span className={cn('p-big', s.captionTitle)}>
                      {plate.title}
                    </span>
                    <span className={cn('caption', s.captionMeta)}>
                      {plate.meta}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            {note ? <p className={cn('caption', s.note)}>{note}</p> : null}
          </div>
        )}
        <div className={s.mask}>
          <div className={s.title}>{children}</div>
        </div>
      </div>
    </section>
  )
}
