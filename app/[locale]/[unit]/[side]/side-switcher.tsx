'use client'

/**
 * The side switcher, and the links that carry `side-sheet-swap`
 * (`docs/MOTION-SPEC.md` §13.1, R6).
 *
 * INTENT, 200ms `ease-out-quart`: the rule under the current side goes to
 * the side pointed at or focused, and stays on the one pressed. TRANSPORT and
 * SETTLE belong to the page: a press navigates with the `side-sheet`
 * transition type, the page's `<ViewTransition>` hands the old sheet and the
 * new one to `global.css`, and the old sheet lifts and fades while the new
 * one's title block settles. The page overlay stands aside, which is what the
 * `morph` intent asks of it: the sheet itself is what moves, so a circle or
 * a panel over it would hide the only thing worth watching.
 *
 * Without a script both are ordinary links (`e2e/side-page.e2e.ts`).
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
import { type MouseEvent, type ReactNode, useEffect } from 'react'

import { Link } from '@/components/ui/link'
import { SIDE_SHEET_TYPES } from '@/lib/motion/side-sheet'
import { RouteMarker } from '@/vault/motion/route-marker'

import s from './page.module.css'

/**
 * Where a press on a side-sheet link is going, as its anchor renders it.
 *
 * Kept in the module because the link that was pressed unmounts with its
 * sheet: only the next sheet's switcher is there to read it.
 */
let switchingTo: string | null = null

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
}

/** Whether the page now open was reached by a side-sheet press. Reads once. */
function arrivedBySwitch() {
  const arrived =
    switchingTo !== null && switchingTo === window.location.pathname
  switchingTo = null
  return arrived
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
      transitionTypes={SIDE_SHEET_TYPES}
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

  useEffect(() => {
    if (!arrivedBySwitch()) return
    const title = document.querySelector<HTMLElement>('main h1')
    if (!title) return
    title.tabIndex = -1
    title.focus({ preventScroll: true })
  }, [current])

  return (
    <nav aria-label={label} className={s.switcher} data-epic="side-sheet-swap">
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
