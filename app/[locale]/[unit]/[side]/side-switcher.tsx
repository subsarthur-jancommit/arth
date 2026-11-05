'use client'

/**
 * The side switcher, and the links that carry `side-sheet-swap`
 * (`docs/MOTION-SPEC.md` §13.1, R6).
 *
 * INTENT, 200ms `ease-out-quart`: the rule under the current side goes to
 * the side pointed at or focused, and stays on the one pressed. TRANSPORT and
 * SETTLE belong to `SideSheet`, the page's `<ViewTransition>`: a press sends
 * the sheet on screen away and names the one it opens, `global.css` lifts and
 * fades the first and settles the second's title block. The page overlay
 * stands aside, which is what the `morph` intent asks of it: the sheet itself
 * is what moves, so a circle or a panel over it would hide the only thing
 * worth watching.
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
import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useSyncExternalStore,
  ViewTransition,
} from 'react'

import { Link } from '@/components/ui/link'
import {
  SIDE_SHEET_ENTER,
  SIDE_SHEET_EXIT,
  SIDE_SHEET_IN,
  SIDE_SHEET_OUT,
  SIDE_SHEET_TYPES,
} from '@/lib/motion/side-sheet'
import { RouteMarker } from '@/vault/motion/route-marker'

import s from './page.module.css'

/**
 * The exchange a press asked for: the side it sends away and the side it
 * opens, both as addresses the way a link to them renders its `href`.
 *
 * A store in the module rather than state in a component, because the sheet
 * that was pressed leaves with the press and only the next sheet is there to
 * read what was asked; and because the sheet on screen has to re-render with
 * its exit class before the navigation commits, which a store's change
 * does synchronously.
 */
interface Exchange {
  from: string
  to: string
}

let exchange: Exchange | null = null
const listeners = new Set<() => void>()

function setExchange(next: Exchange | null) {
  exchange = next
  for (const listener of listeners) listener()
}

function subscribeExchange(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const exchangeNow = () => exchange
const noExchange = () => null

/**
 * How long a press is taken to be under way: React's wait for fonts and
 * images (up to 500ms), the transition of the commit that moves the URL,
 * then the 1200ms exchange, with room for a slow answer. Afterwards the
 * exchange is forgotten, so a press whose navigation never landed cannot
 * name a sheet on a later, unrelated one; and the pictures stop letting the
 * pointer through.
 */
const EXCHANGE_WINDOW = 4000
let exchangeEnds: ReturnType<typeof setTimeout> | undefined

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
  const to = event.currentTarget.getAttribute('href')
  if (!to) return
  setExchange({ from: window.location.pathname, to })

  const root = document.documentElement
  root.dataset.sheetSwap = ''
  clearTimeout(exchangeEnds)
  exchangeEnds = setTimeout(() => {
    delete root.dataset.sheetSwap
    setExchange(null)
  }, EXCHANGE_WINDOW)
}

/** Whether the page now open was reached by a side-sheet press. Reads once. */
function arrivedBySwitch() {
  const arrived = exchange?.to === window.location.pathname
  if (arrived) setExchange(null)
  return arrived
}

interface SideSheetProps {
  /** This side's own address, as a link to it renders its `href`. */
  path: string
  children: ReactNode
}

/**
 * The sheet `side-sheet-swap` exchanges: everything under the switcher.
 *
 * Its classes are chosen by the press, not only by the `side-sheet`
 * transition type. React gives a transition's types to its first commit, and
 * in production that commit only moves the URL; the sheets change in a later
 * commit that carries none (`lib/motion/side-sheet.ts` has the evidence). So
 * the press names both: the sheet on screen re-renders with its exit class
 * before the navigation commits, and the sheet that mounts reads that it is
 * the one asked for. The type maps stay for a commit that does carry the
 * type. Once the new sheet has arrived the exchange is forgotten, and a
 * sheet Next kept hidden reads that again the moment it is shown.
 *
 * No element of its own, so the layout is the page's: React names each
 * top-level block of the sheet that is on screen.
 */
export function SideSheet({ path, children }: SideSheetProps) {
  const asked = useSyncExternalStore(subscribeExchange, exchangeNow, noExchange)

  return (
    <ViewTransition
      enter={asked?.to === path ? SIDE_SHEET_IN : SIDE_SHEET_ENTER}
      exit={asked?.from === path ? SIDE_SHEET_OUT : SIDE_SHEET_EXIT}
      default="none"
    >
      {children}
    </ViewTransition>
  )
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
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!arrivedBySwitch()) return
    /*
     * This sheet's own title, found from the switcher rather than from the
     * document. Next keeps the page just left in the tree, hidden, so the
     * way back is instant: `main h1` names both titles then (e2e run
     * 41954397719), and only this one is the sheet that arrived.
     */
    const title = ref.current?.closest('article')?.querySelector('h1')
    if (!(title instanceof HTMLElement)) return
    title.tabIndex = -1
    title.focus({ preventScroll: true })
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
