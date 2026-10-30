'use client'

import cn from 'clsx'
import { useTranslations } from 'next-intl'
import type { CSSProperties, MouseEvent } from 'react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import { CommandTrigger } from '@/components/ui/command'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { getLinkIntent, Link } from '@/components/ui/link'
import { BRAND_NAME } from '@/lib/brand'
import { UNITS, unitTemplate } from '@/lib/content/units'
import { usePathname } from '@/lib/i18n/navigation'
import { isAwaitingContent } from '@/lib/seo/awaiting-content'
import { RouteMarker } from '@/vault/motion/route-marker'

import s from './header.module.css'

/**
 * Site header.
 *
 * Replaces the Satūs starter header, which showed a "Satūs" wordmark, the raw
 * pathname as a debug readout, and links to darkroom's own repository. Useful
 * while forking; not something to ship on a studio's site.
 *
 * ## The home page holds the sections; Contact is the one shortcut
 *
 * The home page is one long page (`docs/ROADMAP.md` §1.2), and until Tahap 54
 * this header rendered its four section anchors alongside the three routes —
 * seven links, two of them duplicating a route's own name. `ROUTE_LINKS`
 * below carries the argument and the count.
 *
 * Most sections remain part of the home page's reading flow. F1-06 adds one
 * direct shortcut to Contact because it is a top-level destination; the other
 * four links point to Arthur's three units and work-method page.
 *
 * ## Locale
 *
 * Every internal link goes through `components/ui/link`, which routes through
 * next-intl so the reader's language survives the navigation. `usePathname`
 * here is next-intl's too — it returns the path with the prefix stripped, so
 * active-state comparison is template-against-template. Using the bare
 * `next/navigation` version compares `/id` against `/`, which is never equal,
 * and every item renders inactive. See `components/ui/link/link.test.ts`.
 *
 * ## One navigation, which on a phone is a popover — the fork
 *
 * MENU was a React state toggle over a dropdown of three 11px mono links.
 * With scripting off the button did nothing and the nav stayed
 * `display: none`, so a phone had no route links in its header at all; only
 * the footer led anywhere (the design-critique workflow, deferred item 9).
 *
 * Now the nav **is** a `popover="auto"`, and MENU its `popovertarget`: the
 * browser opens it, closes it on Escape or a tap outside, returns focus to
 * the button — none of it needs a script. On a phone it is a sheet under the
 * bar with the current destinations at display size; on desktop the same element is
 * the header's row, as it always was.
 *
 * One element, not two. The first version of this rendered a second nav for
 * the sheet, and that put a hidden copy of every route link — and a second
 * `aria-current` — into the desktop page. Five gates walked into it, each
 * reasonably: a "first link to /en/practice/…" or "every `[data-press]`" that
 * landed on a link nobody could see. The sheet is generated from the same
 * five destinations as desktop navigation, while the footer repeats only
 * the three units and work-method page.
 *
 * What the script adds (each from review): the button reads "Close" while
 * the sheet is open, read from the element so a tap before hydration counts;
 * focus landing anywhere outside the sheet closes it, and what it covers is
 * `inert` while it covers it, so neither Tab nor a screen reader ends up on
 * content hidden under an opaque sheet; a link that navigates closes it,
 * because each page renders its own header and Next keeps the previous page
 * in a hidden `<Activity>` — without this, Back reveals that page with its
 * sheet still open; MENU targets its own nav by reference, because that
 * `<Activity>` also means two `#header-nav` in one document; crossing into
 * desktop closes it; and a browser without `popover` gets a plain toggle with
 * `aria-expanded`, Escape, a tap outside, and focus handed back.
 *
 * ## The bar follows the page — R4
 *
 * The navbar plan in `docs/RENCANA-REVISI-F3.md` (R4), built:
 *
 * - **The rule previews.** `RouteMarker` with `previews`: it goes to the link
 *   pointed at or focused, and slides back to the current one.
 * - **The ground is the page's.** A page can paint a section in the other
 *   theme (a unit page's dark opening on a light page). The bar takes the
 *   theme of the section under it, read by an `IntersectionObserver` on a
 *   one-pixel line through its middle, and crossfades its ground by opacity.
 *   No frame loop: an observer is called only when a section crosses.
 * - **It steps aside.** Going down the page, the bar slides up out of the
 *   way; going up, it comes back. It stays while the sheet is open, while
 *   focus is in it, near the top of the page, and under reduced motion. A
 *   passive scroll listener, not a second loop (CLAUDE.md #6).
 * - **The sheet's words are measured, each its own.** E8.1: every route word
 *   is set as large as its own widest word allows, measured in the face it is
 *   drawn in; the per-character estimate stays as the size before a script
 *   runs, and without one.
 * - **Close fits its box.** E8.5: both labels are in the button at once, the
 *   one not showing hidden, so the box is the wider word's and never changes.
 * - **The right side is composed.** Search, the first step ("Ceritakan
 *   masalahnya", to the contact page, from 1100px where the row has room),
 *   and the language switcher's place for R7, in that order.
 *
 * The plan's list named seven destinations; this keeps five, the R4 row's
 * number and the one the brief for this build asked for. Two more entries in
 * `ROUTE_LINKS` add Layanan and Pembayaran.
 */

// In local dev, link straight to the Storybook dev server. In deployed builds,
// link to the /storybook proxy (see next.config.ts), shown only when
// NEXT_PUBLIC_STORYBOOK_URL is configured — so a production build with no
// Storybook host shows no link.
const STORYBOOK_HREF =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:6006'
    : '/storybook/'
const STORYBOOK_ENABLED =
  process.env.NODE_ENV === 'development' ||
  Boolean(process.env.NEXT_PUBLIC_STORYBOOK_URL)

/**
 * The primary navigation: three units, the work-method page, and contact.
 *
 * Locale-free templates: `components/ui/link` adds the prefix itself, and
 * handing it `/en/work` would produce `/en/en/work`.
 *
 * ## Why this list has five destinations
 *
 * Until Tahap 54 this nav rendered the home page's four in-page anchors
 * (`#work`, `#practice`, `#studio`, `#contact`) *and* three routes. On `/en`
 * that shipped **seven** links inside one `<nav aria-label="Primary">`,
 * of which two pairs carried the same accessible name and different
 * destinations — `Work` → `#work` beside `Work` → `/en/work`, and the same
 * for `Studio`. A reader cannot tell those apart, and a screen-reader user
 * walking the link list gets the ambiguity twice.
 *
 * It also broke this file's own rule three lines further down: the row is
 * capped at one line, and seven is not one line.
 *
 * The nav now answers the Arthur map directly: three units, Metode kerja,
 * and Kontak. The catalogue and journal indexes remain addressable but are
 * not promoted in navigation. The wordmark to the left is the home link and
 * carries `aria-label="<brand> —
 * home"`; a fourth item spelling "Home" beside it would be the same duplicate
 * this change removes.
 */
const UNIT_LINKS = UNITS.map((unit) => ({
  href: unitTemplate(unit),
  labelKey: unit,
}))

/*
 * A destination whose page is still awaiting published content is left out
 * (`lib/seo/awaiting-content.ts`): a primary link that lands on a 404 is
 * worse than one link fewer.
 */
const ROUTE_LINKS = [
  ...UNIT_LINKS.map((link) => ({ ...link, kind: 'unit' as const })),
  { href: '/metode', labelKey: 'studio' as const, kind: 'nav' as const },
  { href: '/kontak', labelKey: 'contact' as const, kind: 'nav' as const },
].filter(({ href }) => !isAwaitingContent(href))

/** The size the sheet's words are measured at, and their tracking there. */
const FIT_PROBE = 100
const SHEET_TRACKING = -0.04

/**
 * The share of the column a fitted word may take. The canvas measures the
 * advance, and a glyph's ink can reach a little past it.
 */
const FIT_MARGIN = 0.96

/** Scroll smaller than this, in either direction, changes nothing. */
const SCROLL_NOISE = 4

/**
 * Whether this browser has the popover API.
 *
 * Never read during the server render: the server has no `HTMLElement`.
 * Components read it through `useSyncExternalStore`, whose server snapshot
 * keeps the markup the same on both sides.
 */
function supportsPopover() {
  return (
    typeof HTMLElement !== 'undefined' &&
    Object.hasOwn(HTMLElement.prototype, 'popover')
  )
}

/** Marks or releases nodes as `inert` — the page under the open sheet. */
function setInert(nodes: readonly HTMLElement[], inert: boolean) {
  for (const node of nodes) node.inert = inert
}

/**
 * Whether the nav is open as a sheet right now, read from the element — in
 * whichever way this browser opens it. Never from React state, which lags
 * the popover by a queued `toggle` event.
 */
function isOpen(nav: HTMLElement) {
  return supportsPopover()
    ? nav.matches(':popover-open')
    : nav.hasAttribute('data-open')
}

/**
 * A store that never changes, for a value read once on the client — the
 * shape `lib/hooks/use-device-detection.ts` uses for the same need.
 */
function subscribeNever() {
  // oxlint-disable-next-line eslint/no-empty-function -- required unsubscribe signature; nothing to tear down since the value is never notified
  return () => {}
}

export function Header() {
  const pathname = usePathname()
  /*
   * Only for a browser without `popover` — there, `data-open` is what opens
   * the sheet (the stylesheet's `.nav[data-open]`). Everywhere else the
   * browser owns the open state and this stays false.
   */
  const [fallbackOpen, setFallbackOpen] = useState(false)
  /*
   * Whether the browser owns the open state. True on the server, so the
   * server render carries no `aria-expanded`: with a popover the browser
   * computes that state itself, and an explicit "false" baked into the HTML
   * would contradict it for a reader with no script.
   */
  const native = useSyncExternalStore(
    subscribeNever,
    supportsPopover,
    () => true
  )
  const nav = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const bar = useRef<HTMLElement>(null)
  const t = useTranslations('nav')
  const tUnit = useTranslations('workIndex')

  /*
   * The sheet's open state is the browser's, so it is read from the element
   * rather than mirrored into React. Subscribing re-reads it too, which is
   * what catches a tap that opened the sheet before hydration — the `toggle`
   * it fired then had no listener, and React does not replay it.
   */
  const subscribeToggle = useCallback((onChange: () => void) => {
    const element = nav.current
    element?.addEventListener('toggle', onChange)
    return () => element?.removeEventListener('toggle', onChange)
  }, [])
  const menuOpen = useSyncExternalStore(
    subscribeToggle,
    () => supportsPopover() && (nav.current?.matches(':popover-open') ?? false),
    () => false
  )

  /*
   * Each route word is fitted to its own longest *word* — R4, E8.1.
   *
   * Until R4 the words shared one size, fitted to the longest word among all
   * of them, so "Kontak" was set as small as "Konstruksi". Now each link
   * carries its own count, which is the size the server renders and the size
   * a reader without a script keeps: `lib/styles/css/global.css`
   * `.nameplate-title` measured the face's widest glyph run at 0.72em per
   * character, and the sheet uses the same figure. Once the face has loaded,
   * the effect below measures the real words and replaces the estimate.
   *
   * A multi-word label still wraps (`header.module.css`), so no single word
   * can overflow and none shrinks for its neighbour.
   */
  const fitChars = (label: string) =>
    Math.max(...label.split(/\s+/).map((word) => Array.from(word).length))

  const closeMenu = useCallback(() => {
    const element = nav.current
    if (!element) return
    if (supportsPopover()) {
      if (element.matches(':popover-open')) element.hidePopover()
      return
    }
    // The fallback has no browser focus-restore: a link that goes
    // `display: none` under focus drops it to `<body>`, so it is handed back.
    if (element.contains(document.activeElement)) menuButton.current?.focus()
    setFallbackOpen(false)
  }, [])

  const open = menuOpen || fallbackOpen

  /*
   * What the sheet covers is out of reach while it covers it, for a screen
   * reader's cursor as much as for Tab: a swipe past the last route read the
   * page underneath.
   *
   * The nodes this marks are remembered, so closing gives back exactly those
   * — never one something else had made `inert` — and marking twice is a
   * no-op rather than a second list that forgets the first.
   */
  const covered = useRef<HTMLElement[]>([])
  const cover = useCallback(() => {
    if (covered.current.length > 0) return
    covered.current = [
      ...document.querySelectorAll<HTMLElement>('main, footer'),
    ].filter((node) => node.getClientRects().length > 0 && !node.inert)
    setInert(covered.current, true)
  }, [])
  const uncover = useCallback(() => {
    setInert(covered.current, false)
    covered.current = []
  }, [])

  useEffect(() => {
    const element = nav.current
    const button = menuButton.current
    if (!element || !button) return

    /*
     * This header's own nav, by reference. Next keeps the previous page in a
     * hidden `<Activity>`, header and all, so after a client navigation the
     * document holds two `#header-nav` — measured — and `popovertarget`
     * resolves an id to the first in the tree. The id stays for the page a
     * reader without a script loads, where there is only ever one.
     */
    if ('popoverTargetElement' in button) button.popoverTargetElement = element

    /*
     * What has to hold the instant the sheet opens is wired to the element,
     * from mount, and reads the element's own state — not React's `open`.
     * That follows the popover's `toggle` event, which the browser queues,
     * and the effect that used to attach these listeners ran after it: a
     * Shift+Tab inside that gap found nothing listening, and the sheet stayed
     * open over whatever took focus. CI caught it, once, as a flaky
     * `phone-menu` run on the way to `main`.
     *
     * `beforetoggle` is dispatched synchronously, before the sheet shows, so
     * what it covers is `inert` from the first frame the sheet is on screen.
     */
    const onBeforeToggle = (event: Event) => {
      if ('newState' in event && event.newState === 'open') cover()
      else uncover()
    }

    /*
     * Focus landing anywhere outside the open sheet closes it — the fork,
     * from review. `popover="auto"` is not modal, and the sheet is opaque:
     * a Tab past the last link, a Shift+Tab from MENU to search, the skip
     * link — each put focus on something under the sheet, where no one could
     * see it (WCAG 2.4.11), and search opened its palette underneath.
     * Listening on the document, not the nav, is what catches the paths
     * that never pass through the sheet at all.
     */
    const onFocusIn = (event: FocusEvent) => {
      if (!isOpen(element)) return
      const target = event.target
      if (!(target instanceof Node)) return
      if (element.contains(target) || target === button) return
      closeMenu()
    }

    // Crossing into desktop, the sheet becomes the row: close it first.
    const desktop = window.matchMedia('(min-width: 800px)')
    const onBreakpoint = () => {
      if (desktop.matches) closeMenu()
    }

    // A tap before hydration may have opened it with nothing listening.
    if (isOpen(element)) cover()

    element.addEventListener('beforetoggle', onBeforeToggle)
    document.addEventListener('focusin', onFocusIn)
    desktop.addEventListener('change', onBreakpoint)
    return () => {
      element.removeEventListener('beforetoggle', onBeforeToggle)
      document.removeEventListener('focusin', onFocusIn)
      desktop.removeEventListener('change', onBreakpoint)
      // Hidden with its page, the sheet is not left open behind it.
      closeMenu()
      uncover()
    }
  }, [closeMenu, cover, uncover])

  useEffect(() => {
    if (!fallbackOpen) return
    cover()

    // The fallback has neither the browser's Escape nor its light dismiss.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeMenu()
      menuButton.current?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (nav.current?.contains(target) || menuButton.current?.contains(target))
        return
      closeMenu()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      uncover()
    }
  }, [fallbackOpen, closeMenu, cover, uncover])

  /*
   * The sheet's words, measured — E8.1.
   *
   * On a phone, each route word is set so its widest word fills the sheet's
   * column, measured with the canvas in the face the word is drawn in, at
   * the sheet's own tracking. The column is the header's content box: the
   * sheet is laid out with the same `--safe` inset, and the header is there
   * to measure while the sheet is still shut. Measured again when the
   * viewport changes; the 14svh cap stays the stylesheet's.
   */
  useEffect(() => {
    const header = bar.current
    const list = nav.current?.querySelector('ul')
    const context = document.createElement('canvas').getContext('2d')
    if (!header || !list || !context) return

    const phone = window.matchMedia('(max-width: 799.98px)')
    const fit = () => {
      if (!phone.matches) return
      const box = getComputedStyle(header)
      const column =
        header.clientWidth -
        Number.parseFloat(box.paddingLeft) -
        Number.parseFloat(box.paddingRight)
      for (const link of list.querySelectorAll<HTMLElement>(
        '[data-route-word]'
      )) {
        const face = getComputedStyle(link)
        context.font = `${face.fontWeight} ${FIT_PROBE}px ${face.fontFamily}`
        const widest = Math.max(
          ...(link.textContent ?? '')
            .split(/\s+/)
            .filter(Boolean)
            .map(
              (word) =>
                context.measureText(word).width +
                SHEET_TRACKING * FIT_PROBE * Array.from(word).length
            )
        )
        if (widest > 0) {
          link.style.setProperty(
            '--fit-size',
            `${((column * FIT_MARGIN) / widest) * FIT_PROBE}px`
          )
        }
      }
    }

    let cancelled = false
    document.fonts.ready
      .then(() => {
        if (!cancelled) fit()
      })
      .catch(() => {
        // The per-character estimate stays, which is the size without a script.
      })
    phone.addEventListener('change', fit)
    window.addEventListener('resize', fit)
    return () => {
      cancelled = true
      phone.removeEventListener('change', fit)
      window.removeEventListener('resize', fit)
    }
  }, [])

  /*
   * The bar takes the ground of the section under it — R4.
   *
   * Sections that paint the other theme carry `data-theme` (the unit pages'
   * dark opening); the bar watches a one-pixel line through its own middle
   * and takes the theme of the last such section crossing it, or the page's
   * when none does. This page's own `<main>`, found from the bar: Next keeps
   * the previous page in a hidden `<Activity>`, and its sections would
   * otherwise be watched too.
   */
  useEffect(() => {
    const header = bar.current
    const main = header?.parentElement?.querySelector('main')
    if (!header || !main) return
    const sections = [...main.querySelectorAll<HTMLElement>('[data-theme]')]
    if (sections.length === 0) return

    const crossing = new Set<Element>()
    const apply = () => {
      const under = sections.filter((section) => crossing.has(section)).at(-1)
      const theme = under?.getAttribute('data-theme')
      if (theme === 'dark' || theme === 'light') {
        header.setAttribute('data-theme', theme)
      } else {
        header.removeAttribute('data-theme')
      }
    }

    let observer: IntersectionObserver | null = null
    const watch = () => {
      observer?.disconnect()
      crossing.clear()
      const line = Math.round(header.offsetHeight / 2)
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) crossing.add(entry.target)
            else crossing.delete(entry.target)
          }
          apply()
        },
        {
          rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px`,
        }
      )
      for (const section of sections) observer.observe(section)
    }

    watch()
    window.addEventListener('resize', watch)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', watch)
      header.removeAttribute('data-theme')
    }
  }, [])

  /*
   * The bar steps aside going down and comes back going up — R4.
   *
   * Read from the page's own scroll events, which Lenis fires as it moves the
   * page, so this adds no frame loop. It never hides near the top, while the
   * sheet is open, while focus is in the bar (a keyboard reader must see
   * where they are), or for a reader who asked for reduced motion.
   */
  useEffect(() => {
    const header = bar.current
    const element = nav.current
    if (!header || !element) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let last = window.scrollY
    const show = () => header.removeAttribute('data-hidden')
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - last
      last = y
      if (
        reduced.matches ||
        isOpen(element) ||
        header.contains(document.activeElement) ||
        y < header.offsetHeight * 2
      ) {
        show()
        return
      }
      if (delta > SCROLL_NOISE) header.setAttribute('data-hidden', '')
      else if (delta < -SCROLL_NOISE) show()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    header.addEventListener('focusin', show)
    element.addEventListener('beforetoggle', show)
    return () => {
      window.removeEventListener('scroll', onScroll)
      header.removeEventListener('focusin', show)
      element.removeEventListener('beforetoggle', show)
      show()
    }
  }, [])

  const onRouteClick = (event: MouseEvent<HTMLElement>) => {
    // A modified click opens a new tab and leaves the reader here, menu and
    // all.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    closeMenu()
  }

  return (
    <header ref={bar} className={s.header}>
      <Link href="/" className={s.brand} aria-label={`${BRAND_NAME} — home`}>
        {BRAND_NAME}
      </Link>

      <nav
        ref={nav}
        id="header-nav"
        popover="auto"
        aria-label={t('primary')}
        className={s.nav}
        {...(fallbackOpen && { 'data-open': '' })}
        /*
         * Lenis listens for the wheel on the window and scrolls the page
         * itself; this attribute tells it to leave a gesture that starts in
         * the open sheet alone. Only while open — on the desktop row it would
         * hand the wheel to the browser and the page would jump rather than
         * glide.
         */
        {...(open && { 'data-lenis-prevent': '' })}
      >
        <ul className={s.navList}>
          {/*
            The routes, on every page — Tahap 38.

            This nav rendered `sections` and nothing else, and only the home
            page passes any. Measured: nine of eleven page types shipped a
            header of wordmark, search and language switcher, with **zero**
            route links, while a project page offered exactly one way out of
            its own content.

            `footer/index.tsx` already argued that the site needs persistent
            route navigation and put it in the footer, where it is below every
            page. This is the same three destinations at the top, where
            someone who has just landed on a project from search will look.

            Tahap 54 removed the home-page anchors that used to sit above
            these, so this is now the whole list.
          */}
          {ROUTE_LINKS.map(({ href, labelKey, kind }, index) => {
            const label = kind === 'unit' ? tUnit(labelKey) : t(labelKey)
            return (
              <li
                key={href}
                className={s.navItem}
                style={{ '--item': index } as CSSProperties}
              >
                <Link
                  className={cn('caption', s.navLink)}
                  href={href}
                  onClick={onRouteClick}
                  // `MOTION-SPEC.md` §9.
                  data-press="nav"
                  data-intent=""
                  // The sheet's size for this word (E8.1), measured above.
                  data-route-word=""
                  style={{ '--fit-chars': fitChars(label) } as CSSProperties}
                  {...(getLinkIntent(href, pathname).isActive && {
                    'aria-current': 'page' as const,
                  })}
                >
                  {label}
                </Link>
              </li>
            )
          })}

          {STORYBOOK_ENABLED && (
            <li className={cn(s.navItem, s.navAside)}>
              <Link
                className={cn('caption', s.navLink)}
                href={STORYBOOK_HREF}
                newTab
                {...(getLinkIntent(STORYBOOK_HREF, pathname, { newTab: true })
                  .isActive && { 'aria-current': 'page' as const })}
              >
                {t('storybook')}
                <span aria-hidden="true" className={s.externalMark}>
                  ↗
                </span>
              </Link>
            </li>
          )}
        </ul>

        {/*
          The rule under the current route, slid to the one pressed before
          the page turns — Tata & Gerak, stage 2. Desktop only: on a phone
          the sheet's current word carries an underline of its own.
        */}
        <RouteMarker className={s.marker} previews />
      </nav>

      {/*
        Search sits beside the language switcher rather than inside the nav:
        it is not a destination, it is a way of reaching every destination.
        Its own file records why it is a visible button and not only a ⌘K
        shortcut, and why almost nothing of it ships to a page that never
        opens it.

        The two are one group so the header can place them as one — Tahap 87.
        As separate children of a `space-between` row, each sat wherever the
        leftover space fell; together they mirror the wordmark at the other
        `--safe` edge. `header.module.css` has the measurement.
      */}
      <div className={s.tools}>
        <CommandTrigger className={s.search} />
        {/*
          The first step, at the end of the row — R4. A link, not a
          destination: it leads to the same contact page the nav names, so it
          carries no `aria-current` and the nav keeps the one "you are here".
          From 1100px, where the row has room for it; a phone's sheet already
          lists Kontak.
        */}
        <Link
          href="/kontak"
          className={cn('caption', s.cta)}
          data-press="cta"
          data-intent=""
        >
          {t('cta')}
        </Link>
        {/*
          The language switcher's place, last on the right. It renders nothing
          while Indonesian is the only published language, and takes this
          place when R7 publishes English.
        */}
        <LanguageSwitcher className={s.language} />
      </div>

      {/*
        After the tools in the markup, so it sits at the right edge — under
        the thumb — and the focus order is the order on screen. It sat
        between the wordmark and search, with the language switcher moved
        past it by `order`, so the thumb had to reach the middle of the bar.
      */}
      <button
        ref={menuButton}
        type="button"
        className={cn('caption', s.menuToggle)}
        popoverTarget="header-nav"
        aria-controls="header-nav"
        {...(!native && { 'aria-expanded': fallbackOpen })}
        onClick={() => {
          if (!supportsPopover()) setFallbackOpen((was) => !was)
        }}
      >
        {/*
          Both words, one hidden — E8.5. The box is always the wider word's,
          so "Tutup" fits the outline "Menu" drew and nothing moves when the
          label changes. `visibility: hidden` keeps the hidden word out of the
          button's name as well as out of sight.
        */}
        <span className={s.menuLabel} data-shown={open ? undefined : ''}>
          {t('openMenu')}
        </span>
        <span className={s.menuLabel} data-shown={open ? '' : undefined}>
          {t('closeMenu')}
        </span>
      </button>
    </header>
  )
}
