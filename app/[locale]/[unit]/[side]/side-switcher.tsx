'use client'

/**
 * The side switcher, and the links that carry `side-sheet-swap`
 * (`docs/MOTION-SPEC.md` §13.1, R6).
 *
 * INTENT, 200ms `ease-out-quart`: the rule under the current side goes to
 * the side pointed at or focused, and stays on the one pressed. TRANSPORT,
 * 400ms `ease-in-out-quart`: the press lifts and fades the sheet on screen.
 * SETTLE, 800ms `ease-out-expo`: the new sheet's title block rises the last
 * stretch into place as it arrives. The page overlay stands aside, which is
 * what the `morph` intent asks of it: the sheet itself is what moves, so a
 * circle or a panel over it would hide the only thing worth watching.
 *
 * Without a script both are ordinary links (`e2e/side-page.e2e.ts`).
 *
 * ## Why the Web Animations API and not a view transition
 *
 * A view transition never ran for this exchange in production (e2e runs
 * 41983464648 and 41988334124): a press makes one transition, which carries
 * its type but changes nothing, and the commit that swaps the sheets starts
 * none, because React only starts one for transition, retry and idle lanes
 * and that commit runs in another. So the sheets move themselves, on the
 * browser's own animation timeline: no loop of this module's (`CLAUDE.md`
 * #6), only `transform` and `opacity` (#4).
 *
 * The lift runs on the live sheet and is cut short when Next hides it for
 * the new one, which is the exchange landing. If the navigation is late, the
 * sheet is never left invisible: when the lift ends with the sheet still on
 * screen, it plays back to where it was and waits there, readable.
 *
 * ## At the unit's tempo
 *
 * A side page belongs to one unit, so TRANSPORT and SETTLE take that unit's
 * dialect (`lib/styles/css/dialects.css`, F4-02): its settle and its curve,
 * read from the sheet, which sits inside the `<main>` that carries
 * `data-dialect`. Konstruksi exchanges its sheets over a long expo settle,
 * Teknologi in one short quart step, Peekabo on gleasing. The values above
 * are the fallbacks, the base grammar. INTENT, the rule under the switcher,
 * is the press grammar and keeps its shared beat, and so does the focus
 * hand-over.
 *
 * ## Focus
 *
 * The new sheet's title is handed focus when it arrives. The link that held
 * focus left with the old sheet, so without this a keyboard reader would be
 * returned to the document's body. The card asks for it under reduced
 * motion, where the sheet changes with no movement to say so; it is done in
 * both modes because the body is no better a place to be left with motion.
 */

import cn from 'clsx'
import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react'

import { Link } from '@/components/ui/link'
import { RouteMarker } from '@/vault/motion/route-marker'

import s from './page.module.css'

/** The ids the two halves run under, which `e2e/side-sheet-swap.e2e.ts` reads. */
const LIFT = 'side-sheet-lift'
const SETTLE = 'side-sheet-settle'

/**
 * Where a press on a side-sheet link is going, as its anchor renders it.
 *
 * Kept in the module because the link that was pressed leaves with its
 * sheet: only the next sheet's switcher is there to read it.
 */
let switchingTo: string | null = null

/** Lifts the sheet on screen. Set by that sheet's switcher while it is shown. */
let liftSheet: (() => void) | null = null

function noteSwitch(event: MouseEvent<HTMLElement>) {
  // A modified press opens another tab and leaves this sheet where it is.
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  switchingTo = event.currentTarget.getAttribute('href')
  liftSheet?.()
}

/** Whether the page now open was reached by a side-sheet press. Reads once. */
function arrivedBySwitch() {
  const arrived =
    switchingTo !== null && switchingTo === window.location.pathname
  switchingTo = null
  return arrived
}

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

interface SideSheetLinkProps {
  href: string
  className?: string | undefined
  children: ReactNode
}

/** A link to the other side of this unit, exchanged as a sheet. */
export function SideSheetLink({
  href,
  className,
  children,
}: SideSheetLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      transition="morph"
      onClick={noteSwitch}
      data-press="side-sheet"
      data-intent=""
    >
      {children}
    </Link>
  )
}

interface SideSwitcherProps {
  label: string
  eyebrow: string
  sides: readonly { href: string; name: string; current: boolean }[]
}

export function SideSwitcher({ label, eyebrow, sides }: SideSwitcherProps) {
  const current = sides.find((side) => side.current)?.href
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = ref.current
    const sheet = nav?.closest('article')
    if (!nav || !sheet) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    /*
     * Read from the sheet, not the document root: the unit's dialect is set
     * on `<main>`, and only an element inside it can see it. The tokens are
     * the root's, inherited, so the fallbacks read what they always did.
     */
    const styles = getComputedStyle(sheet)
    const tempo = (token: string, fallback: number) =>
      tokenMs(styles, '--dialect-settle', tokenMs(styles, token, fallback))
    const curve = (token: string, fallback: string) =>
      tokenEase(styles, '--dialect-ease', tokenEase(styles, token, fallback))
    const running: Animation[] = []

    if (arrivedBySwitch()) {
      /*
       * This sheet's own title, found from the switcher rather than from the
       * document. Next keeps the page just left in the tree, hidden, so the
       * way back is instant: `main h1` names both titles then (e2e run
       * 41954397719), and only this one is the sheet that arrived.
       */
      const title = sheet.querySelector('h1')
      if (title instanceof HTMLElement) {
        title.tabIndex = -1
        title.focus({ preventScroll: true })
      }

      // SETTLE: the title block, by `transform` alone, so its words are
      // never half-transparent at any moment a reader could look at them.
      const block = title?.closest('header')
      if (block && !reduced) {
        running.push(
          block.animate(
            [{ transform: 'translateY(1.75rem)' }, { transform: 'none' }],
            {
              id: SETTLE,
              duration: tempo('--duration-slow', 800),
              easing: curve('--ease-out-expo', 'ease-out'),
            }
          )
        )
      }
    }

    // TRANSPORT: everything under the switcher, which itself holds still.
    const lift = () => {
      for (const block of sheet.children) {
        if (block === nav || !(block instanceof HTMLElement)) continue
        const animation = block.animate(
          [
            { transform: 'none', opacity: 1 },
            { transform: 'translateY(-1.5rem)', opacity: 0 },
          ],
          {
            id: LIFT,
            duration: tempo('--duration', 400),
            easing: curve('--ease-in-out-quart', 'ease-in-out'),
            fill: 'forwards',
          }
        )
        running.push(animation)
        // Still on screen once lifted: the navigation is late, so the sheet
        // comes back to be read rather than waiting there invisible.
        void animation.finished.then(
          () => {
            if (block.checkVisibility()) animation.reverse()
          },
          () => undefined
        )
      }
    }
    if (!reduced) liftSheet = lift

    /*
     * Hidden by Next for the next sheet, or gone: nothing of this sheet's
     * motion may outlive it, least of all a lift held at opacity 0 that a
     * later Back would show.
     */
    return () => {
      if (liftSheet === lift) liftSheet = null
      for (const animation of running) animation.cancel()
    }
  }, [current])

  return (
    <nav
      ref={ref}
      aria-label={label}
      className={s.switcher}
      data-epic="side-sheet-swap"
    >
      <p className={cn('caption', s.switcherLabel)}>{eyebrow}</p>
      {sides.map((side) =>
        side.current ? (
          // The sheet already open: a press on it opens nothing (`set-depth`
          // knows a link to the open page and draws no circle for it).
          <Link
            key={side.href}
            href={side.href}
            className={s.switcherLink}
            aria-current="page"
            data-press="side-sheet"
            data-intent=""
          >
            {side.name}
          </Link>
        ) : (
          <SideSheetLink
            key={side.href}
            href={side.href}
            className={s.switcherLink}
          >
            {side.name}
          </SideSheetLink>
        )
      )}
      <RouteMarker previews />
    </nav>
  )
}
