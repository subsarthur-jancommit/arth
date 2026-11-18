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

import s from './header.module.css'

/**
 * Site header — the pill navbar of G1 (`docs/RENCANA-VISUAL-GERAK.md`).
 *
 * ## Three zones
 *
 * The owner's technical reference, §4 (`docs/SOLUSI-TEKNIS-VISUAL-GERAK.md`):
 * the wordmark on the left, the navigation capsule in the middle, the call to
 * action and the utilities on the right, on a grid of
 * `auto minmax(0, 1fr) auto`. The capsule is centred in the space the two
 * ends leave, never absolutely, so it cannot run into either of them.
 *
 * Four destinations in the capsule — Konstruksi, Teknologi, Peekabo, Cara
 * kerja — and one action, "Ceritakan kebutuhan", to the contact page. Kontak,
 * Layanan and Pembayaran left the row: they are the menu's second list and
 * the footer's index, so nothing became unreachable, and the action already
 * leads to the contact page.
 *
 * Exactly one link carries `aria-current="page"`, and on the home page none
 * does: the wordmark is the way home and is never "current".
 *
 * ## States, all in CSS
 *
 * Hover shows a soft pill behind the label; the label and the hit box do not
 * move. The current route is a contrasting pill inside the capsule, which a
 * pointer leaving does not take away. Focus is a 2px ring 3px out, which the
 * capsule does not clip and which is not the current route's pill. A press
 * deepens the pill and settles it to 0.98 inside the link's fixed box, so no
 * neighbour moves. The pill is a real element (`.glow`), not a
 * pseudo-element, so `e2e/interaction-grammar.e2e.ts` can read it.
 *
 * ## One navigation, which below 1024px is a sheet — the fork
 *
 * The nav **is** a `popover="auto"` and Menu its `popovertarget`: the
 * browser opens it, closes it on Escape or a tap outside and returns focus
 * to the button, with or without a script. From 1024px the same element is
 * the capsule. One element, not two: a second nav for the sheet put a hidden
 * copy of every route link, and a second `aria-current`, into the desktop
 * page (five gates walked into it).
 *
 * The row folds at 1024px, not at the site's 800px breakpoint: the reference
 * asks for the menu to come early rather than for text to shrink, and 1024
 * is where the three zones still hold in both languages.
 *
 * What the script adds, each from review: the button reads "Close" while the
 * sheet is open, read from the element so a tap before hydration counts, and
 * says so in `aria-expanded` once hydrated; Tab and Shift+Tab stay inside
 * the open sheet and its button (the focus trap); focus landing anywhere
 * else closes it, and what it covers is `inert` while it covers it; a link
 * that navigates closes it, because Next keeps the previous page in a hidden
 * `<Activity>` and Back would reveal it still open; Menu targets its own nav
 * by reference, because that `<Activity>` also means two `#header-nav` in
 * one document; crossing into the row closes it; and a browser without
 * `popover` gets a plain toggle with Escape, a tap outside and focus handed
 * back.
 *
 * ## The bar follows the page — R4
 *
 * A page can paint a section in the other theme (a unit page's dark opening
 * on a light page, the home page's paper need chooser under its dark hero).
 * The bar takes the theme of the section under it, read by an
 * `IntersectionObserver` on a one-pixel line through its middle, and
 * crossfades between two solid grounds by opacity. No frame loop.
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
 * From this width the three zones share one row; below it the capsule and
 * the second list are the Menu's sheet. `header.module.css` and the scroll
 * hold in `lib/styles/css/global.css` use the same 1024px.
 */
const ROW_QUERY = '(min-width: 1024px)'

/*
 * Locale-free templates: `components/ui/link` adds the prefix itself, and
 * handing it `/en/konstruksi` would produce `/en/en/konstruksi`.
 *
 * A destination whose page is still awaiting published content is left out
 * (`lib/seo/awaiting-content.ts`): a link that lands on a 404 is worse than
 * one link fewer.
 */
const UNIT_LINKS = UNITS.map((unit) => ({
  href: unitTemplate(unit),
  unit,
})).filter(({ href }) => !isAwaitingContent(href))

/** The capsule's fourth destination: how Arthur works (`/metode`). */
const METHOD_HREF = '/metode'

/** The menu's second list: reachable here and from the footer's index. */
const SECONDARY_LINKS = [
  { href: '/layanan', labelKey: 'services' },
  { href: '/pembayaran', labelKey: 'payment' },
  { href: '/kontak', labelKey: 'contact' },
] as const

const CONTACT_HREF = '/kontak'

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
 * The stops of the open sheet's focus trap, in order: the button first, then
 * every visible link or button inside the sheet.
 */
function trapStops(button: HTMLElement, nav: HTMLElement) {
  return [
    button,
    ...nav.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
  ].filter((node) => node.getClientRects().length > 0)
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
   * server render carries no `aria-expanded` for a reader with no script:
   * there the popover's own state is all there is.
   */
  const native = useSyncExternalStore(
    subscribeNever,
    supportsPopover,
    () => true
  )
  /* Hydrated: false in the server render, true from the first client one. */
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
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
     * from mount, and reads the element's own state — not React's `open`,
     * which follows the popover's queued `toggle` event. A Shift+Tab inside
     * that gap once found nothing listening (CI, a flaky `phone-menu` run).
     * `beforetoggle` is dispatched synchronously, before the sheet shows, so
     * what it covers is `inert` from the first frame the sheet is on screen.
     */
    const onBeforeToggle = (event: Event) => {
      if ('newState' in event && event.newState === 'open') cover()
      else uncover()
    }

    /*
     * Focus landing anywhere outside the open sheet closes it. With the trap
     * below a keyboard cannot get there by Tab, but a script, the skip link
     * or a click on the bar can, and the sheet is opaque: whatever took focus
     * would sit under it, unseen (WCAG 2.4.11).
     */
    const onFocusIn = (event: FocusEvent) => {
      if (!isOpen(element)) return
      const target = event.target
      if (!(target instanceof Node)) return
      if (element.contains(target) || target === button) return
      closeMenu()
    }

    /*
     * The focus trap — G1. While the sheet is open, Tab from its last stop
     * goes back to the button and Shift+Tab from the button goes to the last
     * stop, so a keyboard walks the sheet and its way out and nothing else.
     * The browser already places the popover right after its button in the
     * focus order, so only the two ends need handling. Escape still closes,
     * by the popover.
     */
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !isOpen(element)) return
      const stops = trapStops(button, element)
      const first = stops[0]
      const last = stops.at(-1)
      if (!first || !last || first === last) return
      const active = document.activeElement
      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      }
    }

    // Crossing into the row, the sheet becomes the capsule: close it first.
    const row = window.matchMedia(ROW_QUERY)
    const onBreakpoint = () => {
      if (row.matches) closeMenu()
    }

    // A tap before hydration may have opened it with nothing listening.
    if (isOpen(element)) cover()

    element.addEventListener('beforetoggle', onBeforeToggle)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('keydown', onKeyDown)
    row.addEventListener('change', onBreakpoint)
    return () => {
      element.removeEventListener('beforetoggle', onBeforeToggle)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('keydown', onKeyDown)
      row.removeEventListener('change', onBreakpoint)
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
   * The bar takes the ground of the section under it — R4.
   *
   * Sections that paint the other theme carry `data-theme`; the bar watches a
   * one-pixel line through its own middle and takes the theme of the last
   * such section crossing it, or the page's when none does. This page's own
   * `<main>`, found from the bar: Next keeps the previous page in a hidden
   * `<Activity>`, and its sections would otherwise be watched too.
   */
  useEffect(() => {
    const header = bar.current
    const main = header?.parentElement?.querySelector('main')
    if (!header || !main) return
    const sections = [...main.querySelectorAll<HTMLElement>('[data-theme]')]
    if (sections.length === 0) return

    const crossing = new Set<Element>()
    const apply = () => {
      const under = sections.findLast((section) => crossing.has(section))
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

  const isCurrent = (href: string) => getLinkIntent(href, pathname).isActive

  const primary = [
    ...UNIT_LINKS.map(({ href, unit }) => ({ href, label: tUnit(unit) })),
    ...(isAwaitingContent(METHOD_HREF)
      ? []
      : [{ href: METHOD_HREF, label: t('method') }]),
  ]
  const secondary = SECONDARY_LINKS.filter(
    ({ href }) => !isAwaitingContent(href)
  )

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
        {/* The sheet's title. The capsule has none: the row is its own. */}
        <p className={s.sheetTitle}>{t('openMenu')}</p>

        <ul className={s.capsule}>
          {primary.map(({ href, label }, index) => (
            <li
              key={href}
              className={s.item}
              // Its place in the sheet's entrance (header.module.css).
              style={{ '--item': index } as CSSProperties}
            >
              <Link
                className={s.link}
                href={href}
                onClick={onRouteClick}
                // `MOTION-SPEC.md` §9: hover, focus and press read on `.glow`.
                data-press="nav"
                data-intent=""
                data-sheet-link=""
                {...(isCurrent(href) && { 'aria-current': 'page' as const })}
              >
                <span aria-hidden="true" className={s.glow} data-glow="" />
                <span className={s.label} data-label="">
                  {label}
                </span>
              </Link>
            </li>
          ))}

          {STORYBOOK_ENABLED && (
            <li className={cn(s.item, s.aside)}>
              <Link
                className={s.link}
                href={STORYBOOK_HREF}
                newTab
                {...(getLinkIntent(STORYBOOK_HREF, pathname, { newTab: true })
                  .isActive && { 'aria-current': 'page' as const })}
              >
                <span aria-hidden="true" className={s.glow} data-glow="" />
                <span className={s.label} data-label="">
                  {t('storybook')}
                  <span aria-hidden="true" className={s.externalMark}>
                    ↗
                  </span>
                </span>
              </Link>
            </li>
          )}
        </ul>

        {/*
          The second list, on the sheet only: Layanan, Pembayaran and Kontak
          left the row in G1 and stay reachable here and in the footer. On the
          row this list is `display: none`, so it is neither seen nor read nor
          focusable there, and none of it is a pressable noun that a desktop
          gate could find hidden.
        */}
        <ul className={s.secondary}>
          {secondary.map(({ href, labelKey }, index) => (
            <li
              key={href}
              style={{ '--item': primary.length + index } as CSSProperties}
            >
              <Link
                className={s.secondaryLink}
                href={href}
                onClick={onRouteClick}
                data-sheet-link=""
                {...(isCurrent(href) && { 'aria-current': 'page' as const })}
              >
                {t(labelKey)}
              </Link>
            </li>
          ))}
        </ul>

        {/*
          The action, on the sheet, where the bar has no room for it (under
          640px). It is the same link as the bar's; only one of the two is
          ever shown. It names no page as current: the contact page is named
          by Kontak above.
        */}
        <Link href={CONTACT_HREF} className={s.sheetCta} onClick={onRouteClick}>
          {t('ctaNeed')}
        </Link>
      </nav>

      {/*
        The right zone: search and the language switcher, then the action at
        the end, mirroring the wordmark at the other edge. Search is not a
        destination but a way of reaching every one, and it stays one press
        away (⌘K, and the early shortcut that listens before hydration).
      */}
      <div className={s.tools}>
        <CommandTrigger className={s.search} />
        {/*
          The language switcher shows only on a page whose English is open,
          and on an English page as the way back (`ENGLISH_PAGES`, #96).
        */}
        <LanguageSwitcher className={s.language} />
        <Link
          href={CONTACT_HREF}
          className={s.cta}
          data-press="cta"
          data-intent=""
        >
          <span className={s.ctaLabel}>{t('ctaNeed')}</span>
        </Link>
      </div>

      {/*
        After the tools in the markup, so it sits at the right edge — under
        the thumb — and the focus order is the order on screen.
      */}
      <button
        ref={menuButton}
        type="button"
        className={s.menuToggle}
        popoverTarget="header-nav"
        aria-controls="header-nav"
        {...(hydrated && { 'aria-expanded': native ? menuOpen : fallbackOpen })}
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
