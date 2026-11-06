'use client'

/**
 * offer-arrival — a chapter's card leaves the list, and its offer arrives
 * (`docs/MOTION-SPEC.md` §13.11, F4-03).
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## What the motion says
 *
 * Derived from `project-arrival`, without a photo. On `/work` a card's cover
 * carries the reader into its project. An offer has no cover, so its card
 * itself leaves: the press lifts the card out of the chapter's list
 * (TRANSPORT), and on the offer page its title block rises the last stretch
 * into place (SETTLE), the way a cast piece is lifted from its formwork and
 * set where it stands. The offer page's own moments follow as the reader
 * scrolls: the steps in order, the measure, the fixings.
 *
 * One click, one transition (§13.11). The card's link navigates with the
 * `morph` intent, so the page overlay stands aside and `set-depth` draws no
 * circle over this exchange.
 *
 * ## Why the Web Animations API and not a view transition
 *
 * A chapter and its offers are one route (`[...slug]`), and a view
 * transition does not start for a navigation inside one route: #70 measured
 * it for the side switcher (`app/[locale]/[unit]/[side]/side-switcher.tsx`
 * has the reason). So the card and the title move themselves, on the
 * browser's own animation timeline: no loop of this module's (`CLAUDE.md`
 * #6), only `transform` and `opacity` (#4), and the title by `transform`
 * alone, so its words are never half-transparent.
 *
 * ## At the unit's tempo
 *
 * An offer belongs to one unit, so both halves take that unit's settle and
 * curve (`lib/styles/css/dialects.css`, F4-02), read from the element, which
 * sits inside the `<main>` that carries `data-dialect`. Outside a dialect
 * they fall back to the base grammar: 400ms `ease-in-out-quart` for the lift,
 * 800ms `ease-out-expo` for the settle, the same beats as `side-sheet-swap`.
 *
 * ## At the edges
 *
 * - The lift is cut short when Next hides the chapter for the offer.
 * - A late page never leaves the card invisible: if the card is still on
 *   screen when the lift ends, it plays back and waits there, readable.
 * - The offer's title is handed focus when it arrives, in both motion modes:
 *   the link that held focus left with the chapter.
 * - Reduced motion moves nothing; without a script the link is a link.
 */

import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react'

import { Link } from '@/components/ui/link'

/** The ids the two halves run under, which `e2e/one-navigation.e2e.ts` reads. */
const LIFT = 'offer-arrival-lift'
const SETTLE = 'offer-arrival-settle'

/** Where a card press is going, as its anchor renders it. */
let arrivingTo: string | null = null

/** A motion token's value in milliseconds, or the fallback when it is absent. */
function tokenMs(styles: CSSStyleDeclaration, token: string, fallback: number) {
  const raw = styles.getPropertyValue(token).trim()
  const value = Number.parseFloat(raw)
  if (Number.isNaN(value)) return fallback
  return raw.endsWith('ms') ? value : value * 1000
}

/** An easing token's value, or the fallback when it is absent. */
function tokenEase(
  styles: CSSStyleDeclaration,
  token: string,
  fallback: string
) {
  return styles.getPropertyValue(token).trim() || fallback
}

/** The unit's settle and curve at `element`, or the base beat given. */
function beat(
  element: Element,
  base: { duration: string; fallbackMs: number; ease: string; fallback: string }
) {
  const styles = getComputedStyle(element)
  return {
    duration: tokenMs(
      styles,
      '--dialect-settle',
      tokenMs(styles, base.duration, base.fallbackMs)
    ),
    easing: tokenEase(
      styles,
      '--dialect-ease',
      tokenEase(styles, base.ease, base.fallback)
    ),
  }
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** TRANSPORT: the pressed card lifts out of the list. */
function liftCard(card: HTMLElement) {
  const animation = card.animate(
    [
      { transform: 'none', opacity: 1 },
      { transform: 'translateY(-1.5rem)', opacity: 0 },
    ],
    {
      id: LIFT,
      ...beat(card, {
        duration: '--duration',
        fallbackMs: 400,
        ease: '--ease-in-out-quart',
        fallback: 'ease-in-out',
      }),
      fill: 'forwards',
    }
  )
  // Still on screen once lifted: the offer is late, so the card comes back
  // to be read rather than waiting there invisible.
  void animation.finished.then(
    () => {
      if (card.checkVisibility()) animation.reverse()
    },
    () => undefined
  )
}

function noteArrival(event: MouseEvent<HTMLElement>) {
  // A modified press opens another tab and leaves the chapter where it is.
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  arrivingTo = event.currentTarget.getAttribute('href')
  const card = event.currentTarget.closest('[data-offer-card]')
  if (card instanceof HTMLElement && !reducedMotion()) liftCard(card)
}

/** Whether the page now open was reached by a card press. Reads once. */
function arrivedByPress() {
  const arrived = arrivingTo !== null && arrivingTo === window.location.pathname
  arrivingTo = null
  return arrived
}

interface OfferArrivalLinkProps {
  href: string
  className?: string | undefined
  children: ReactNode
}

/**
 * A chapter card's link to its offer. The card it sits in is marked
 * `data-offer-card`, which is what the press lifts.
 */
export function OfferArrivalLink({
  href,
  className,
  children,
}: OfferArrivalLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      transition="morph"
      onClick={noteArrival}
      data-press="offer"
      data-intent=""
    >
      {children}
    </Link>
  )
}

/**
 * SETTLE, on the offer page: placed anywhere inside the page's `<article>`,
 * it finds that article's title block and settles it when the page was
 * reached by a card press. Renders nothing a reader can see.
 */
export function OfferArrival() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sheet = ref.current?.closest('article')
    if (!sheet || !arrivedByPress()) return

    /*
     * This page's own title, found from the marker rather than from the
     * document: Next keeps the chapter just left in the tree, hidden, so the
     * way back is instant, and `main h1` would name both (e2e run
     * 41954397719).
     */
    const title = sheet.querySelector('h1')
    if (title instanceof HTMLElement) {
      title.tabIndex = -1
      title.focus({ preventScroll: true })
    }

    const block = title?.closest('header')
    if (!block || reducedMotion()) return

    const animation = block.animate(
      [{ transform: 'translateY(1.75rem)' }, { transform: 'none' }],
      {
        id: SETTLE,
        ...beat(block, {
          duration: '--duration-slow',
          fallbackMs: 800,
          ease: '--ease-out-expo',
          fallback: 'ease-out',
        }),
      }
    )
    return () => animation.cancel()
  }, [])

  return <span ref={ref} hidden />
}
