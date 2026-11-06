'use client'

/**
 * PageTransition — route-change overlay.
 *
 * Provenance: original work for this project. No third-party code copied.
 * Built on Next.js's `onNavigate`/`usePathname`, both public APIs.
 *
 * Mount once in a layout, above `{children}`. A panel sweeps up across the
 * viewport when a navigation *starts* and continues off the top once the new
 * route has committed.
 *
 * ```tsx
 * // app/[locale]/layout.tsx
 * <PageTransition />
 * {children}
 * ```
 *
 * ## Two bugs this component shipped with
 *
 * Neither was noticed, because it was never mounted. It sat in `vault/motion/`
 * for ten stages, complete with a story and reduced-motion handling, doing
 * nothing (`docs/stages/TAHAP-11.md` §2.4). A component that is never
 * rendered is never wrong, which is the most expensive kind of finished.
 *
 * **It ran at the wrong moment.** The whole cover-then-reveal sequence fired
 * from a `usePathname()` change — and a pathname change is the moment the
 * **new** route has already rendered. The reader would have watched the page
 * they asked for get progressively covered, then uncovered: 1.2 seconds spent
 * hiding the thing they were waiting to see. A transition needs two moments
 * and the App Router publishes only one; `lib/motion/navigation-signal.ts`
 * supplies the other from `onNavigate` on `<Link>`, which fires only for real
 * client-side navigations — never for a modified click, a new-tab click, or
 * an external href.
 *
 * **It cost GSAP to do a job CSS does.** GSAP is mounted per page here
 * (`components/layout/wrapper`), and only the home page opts in — so a
 * GSAP-driven overlay would have animated on exactly one route, which for a
 * transition is the same as none. Turning GSAP on everywhere to fix that
 * would have put ~69KB on every route to move one element along one axis.
 * `vault/motion/README.md` is explicit: reach for CSS before GSAP. This costs
 * nothing and runs on the compositor.
 *
 * ## One axis, and why
 *
 * The panel translates rather than scaling. A scale wipe has to flip its
 * transform origin between the two halves, and a navigation that resolves
 * mid-cover — the common case, since routes here are prerendered and
 * prefetched — would jump as the anchor moved. Translating on one axis has no
 * anchor to move: interrupt it anywhere and the panel simply carries on out
 * of the top.
 *
 * ## Timing
 *
 * Cover is fast, reveal is slower. That is the asymmetry the `ui-ux-pro-max`
 * motion data asks for — *"exit animation should always resolve faster than
 * entrance so back/forward feels snappy"* — and it is also the honest shape:
 * covering happens while the reader is waiting, and every millisecond of it
 * is latency they can feel; uncovering happens once the page is there.
 *
 * Navigation is never blocked on either.
 *
 * ## The failure mode that matters
 *
 * An overlay that covers and never uncovers is a blank screen. Three things
 * prevent it:
 *
 *   - the CSS parks the panel below the viewport, so with no JavaScript at
 *     all the overlay is simply absent rather than stuck;
 *   - `maxWait` uncovers regardless if the route never commits — a cancelled
 *     navigation, a same-route link, a failed fetch. The `ui-ux-pro-max`
 *     guidance names this exactly: *"don't tie the overlay's reveal directly
 *     to data-fetch completion without a max-wait timeout"*;
 *   - the reveal is a single terminal state, so an interrupted cover cannot
 *     strand the panel part-way.
 *
 * ## Accessibility
 *
 * - `aria-hidden` and `pointer-events: none` — the overlay is decoration and
 *   can never trap focus or swallow a click.
 * - Under `prefers-reduced-motion` the overlay removes itself. There is no
 *   "reduced" version worth showing: a full-viewport wipe is precisely the
 *   kind of large-area motion the preference exists to suppress, and the
 *   route change is already communicated by the content changing.
 *
 *   Precisely: it removes itself *on hydration*. `usePreferredReducedMotion`
 *   reads a media query and the server has no media to query, so the markup
 *   is in the server-rendered HTML for every reader — measured, not assumed
 *   (`e2e/motion.e2e.ts`). The CSS `@media (--reduced-motion) { display:
 *   none }` rule is what covers that window, which makes it load-bearing
 *   rather than the belt-and-braces it is labelled as. The panel is never
 *   visible to a reader who asked for no motion; it is briefly present.
 * - Route changes are announced by the browser's own navigation handling; this
 *   component adds no live region, because a decorative wipe should not be
 *   narrated.
 *
 * ## set-depth: the detail circle (R6, `docs/MOTION-SPEC.md` §13.10)
 *
 * A link press no longer raises the panel. A ring is drawn round the point
 * that was pressed (COMMIT, 150ms) and a circle of the contrasting ground
 * opens out of it until it covers the screen (TRANSPORT, 400ms,
 * `ease-in-out-quart`): the detail mark on a drawing that sends the reader
 * into another sheet of the set. It then fades off the new page while that
 * page's title settles (SETTLE, 800ms, `ease-out-expo`, `global.css`).
 *
 * A circle that slow could not hide the swap on its own. Routes here are
 * prefetched, so the new page commits about 50ms after the press, when an
 * `ease-in-out-quart` circle has barely started. Holding the navigation back
 * until the circle closed would break the rule above, so the browser holds
 * the *picture* instead: the link navigates with the `set-depth` transition
 * type, the keyed `<ViewTransition>` mark below makes React start a view
 * transition for it, and `global.css` keeps the old page's snapshot on screen
 * and the new page's hidden until `data-depth="covered"` says the circle is
 * complete. The overlay is named for that transition so it stays live above
 * both. A browser without view transitions skips the hold and sees the swap
 * happen under the opening circle, the way the panel always behaved.
 *
 * The circle takes `--color-secondary` from the link that was pressed, so it
 * is ink on a light sheet and paper on the dark stage: going from the stage
 * into a document, the paper circle becomes the document's own ground.
 *
 * Back and forward keep the panel, faster (§13.10 "Back navigation"); a
 * second press while the circle is open moves it to the new link and covers
 * until the last destination commits.
 */

import { usePathname } from 'next/navigation'
import {
  type CSSProperties,
  type TransitionEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  ViewTransition,
} from 'react'

import { usePreferredReducedMotion } from '@/lib/hooks/use-sync-external'
import { DEPTH_TYPE, subscribeNavigation } from '@/lib/motion/navigation-signal'
import type {
  NavigationIntent,
  NavigationSource,
} from '@/lib/motion/navigation-signal'
import { useHistoryNavigation } from '@/lib/motion/use-history-navigation'

import c from './depth-circle.module.css'
import s from './page-transition.module.css'

/**
 * `idle` parks the panel below the viewport with no transition, so returning
 * to it after a reveal is instant and invisible rather than a slide back down.
 */
type State = 'idle' | 'covering' | 'revealing'

/**
 * The shortest time the cover is allowed to be up before the reveal replaces
 * it — two frames at 60fps.
 *
 * Not a duration anyone sees: it is the floor that makes the cover *exist*.
 * `MOTION-SPEC.md` §9.4 rule 7 says a history navigation is dressed, and a
 * state that never paints is not a dressing. See `reveal()` for the
 * measurement that turned this from an assumption into a number.
 */
// motion-exempt: a scheduling floor, not a declared animation. A token would
// be wrong — the value is "long enough for one paint", not one of the bands.
const MIN_COVER = 32

/**
 * Milliseconds after which the panel parks itself even if `transitionend`
 * never arrives. Longer than the slowest declared reveal (400ms) with room to
 * spare, so it is a floor and not a second timing decision.
 */
const SETTLE = 900

/**
 * How long the detail circle takes to close over the page: `--duration`, the
 * TRANSPORT beat in `page-transition.module.css`. The fade waits for it, and
 * so does `data-depth="covered"`, which is what lets `global.css` swap the
 * held snapshot for the new page once nothing of either shows.
 */
// motion-exempt: mirrors `--duration` (400ms) so the script and the
// stylesheet agree on when the circle is closed; it declares no animation.
const DEPTH_COVER = 400

/**
 * How long `data-arrival` stays on the root: the SETTLE beat
 * (`--duration-slow`, 800ms) with a frame to spare, so the title's animation
 * is never cut off and the attribute never outlives it by much.
 */
// motion-exempt: a cleanup floor for the SETTLE animation, not a duration.
const ARRIVAL = 900

/**
 * A press older than this is not the one that started the navigation, so the
 * circle opens from the middle of the screen instead of from a stale point.
 */
// motion-exempt: a staleness window for an input record, not a duration.
const PRESS_FRESH = 1000

/** How often to look again for a view transition still holding the page. */
// motion-exempt: a polling interval for a cleanup, not a duration.
const RELEASE_RETRY = 100

/**
 * Whether the browser is in the middle of a view transition. A browser that
 * cannot parse the pseudo-class throws, and is treated as running none.
 */
function viewTransitionRunning() {
  try {
    return document.documentElement.matches(':active-view-transition')
  } catch {
    return false
  }
}

/**
 * Keeps the old page held under the circle (e2e run 42044019856, R6).
 *
 * The commit a `depth` press starts moves the URL and re-keys the mark, and
 * changes nothing outside a `<ViewTransition>`. React then cancels the root
 * of that view transition (react-dom, the host root's after-mutation step):
 * it sets `view-transition-name: none` on `<html>`, hides
 * `::view-transition-group(root)` and shrinks `::view-transition`, so the old
 * page was never held and the swap showed under a circle that had barely
 * opened. React leaves the root alone when `<html>` already names it inline,
 * and its own restore only clears a `none`, so the press names the root
 * `root` (the browser's own name for it) and the release takes it off.
 */
function holdRoot() {
  document.documentElement.style.setProperty('view-transition-name', 'root')
}

function releaseRoot() {
  const style = document.documentElement.style
  if (style.getPropertyValue('view-transition-name') === 'root')
    style.removeProperty('view-transition-name')
}

/** What a press on a link leaves for the navigation it starts. */
interface Press {
  x: number
  y: number
  at: number
  /** The pressed link's `--color-secondary`: the ground that contrasts. */
  ground: string
  /** The link points at the page already open, so there is nothing to open. */
  samePage: boolean
}

/** The enter and exit class of the mark, for a `set-depth` navigation only. */
const DEPTH_CLASS = { [DEPTH_TYPE]: DEPTH_TYPE, default: 'none' }

function pressOf(event: MouseEvent): Press | null {
  if (!(event.target instanceof Element)) return null
  const link = event.target.closest('a[href]')
  if (!(link instanceof HTMLAnchorElement)) return null

  // A keyboard activation is a click with no detail and no pointer position,
  // so the link's own centre stands in for the point that was pressed.
  const box = link.getBoundingClientRect()
  const keyboard = event.detail === 0
  const url = new URL(link.href, window.location.href)

  return {
    x: keyboard ? box.left + box.width / 2 : event.clientX,
    y: keyboard ? box.top + box.height / 2 : event.clientY,
    at: performance.now(),
    ground: getComputedStyle(link).getPropertyValue('--color-secondary').trim(),
    samePage:
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname &&
      url.search === window.location.search,
  }
}

/**
 * Where the circle opens and how far it has to reach: to the corner farthest
 * from that point, so at full size it leaves nothing of the page uncovered.
 */
function depthStyle(press: Press | null): CSSProperties {
  const width = window.innerWidth
  const height = window.innerHeight
  const x = press?.x ?? width / 2
  const y = press?.y ?? height / 2
  const reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))

  return {
    '--depth-x': `${Math.round(x)}px`,
    '--depth-y': `${Math.round(y)}px`,
    '--depth-r': `${Math.ceil(reach) + 2}px`,
    ...(press?.ground && { '--depth-ground': press.ground }),
  } as CSSProperties
}

interface PageTransitionProps {
  /**
   * Milliseconds to wait for a route commit before revealing anyway.
   *
   * Not a timing choice — a safety net, so a navigation that never produces a
   * pathname change cannot leave a panel over a working page.
   */
  maxWait?: number | undefined
}

export function PageTransition({ maxWait = 2000 }: PageTransitionProps) {
  const [state, setState] = useState<State>('idle')
  /*
   * Which control started the navigation, kept so the stylesheet can time the
   * two differently. `ui-ux-pro-max`'s page-transition row is explicit that
   * "exit should always resolve faster than entrance … so back/forward feels
   * snappy", and that is the only guidance its database carries about the
   * direction a reader travels — `docs/stages/TAHAP-16.md` §2.4 records that
   * it has nothing at all on whether a back navigation should move.
   */
  const [source, setSource] = useState<NavigationSource>('link')
  /*
   * Which panel it is. A `sheet` — the same page in the other language —
   * crosses sideways instead of rising (Orientasi, stage 4); `depth` is the
   * detail circle; `morph` never reaches here, because a morph is never
   * covered.
   */
  const [kind, setKind] = useState<Exclude<NavigationIntent, 'morph'>>('cover')
  /** Where the detail circle opens, its reach, and its ground. */
  const [depth, setDepth] = useState<CSSProperties>({})
  const pathname = usePathname()
  const prefersReducedMotion = usePreferredReducedMotion()

  // The browser's own back and forward controls press no link, so nothing
  // else in the app announces them. Called unconditionally, as hooks must be;
  // under reduced motion nobody is subscribed and the announcement is inert.
  useHistoryNavigation()

  // Set while a navigation is in flight, so the pathname effect can tell a
  // covered route change from a first paint, a back button, or a hash change.
  const covering = useRef(false)
  /** The pending timer that lets the cover paint before the reveal replaces it. */
  const paint = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** When the cover went up, so the reveal can tell whether it has been seen. */
  const coveredAt = useRef(0)
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null)
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** The kind in flight, for `reveal`, which must not depend on render. */
  const kindNow = useRef<Exclude<NavigationIntent, 'morph'>>('cover')
  /** The last press on a link, recorded before its navigation is announced. */
  const press = useRef<Press | null>(null)
  /** Marks the circle closed, `DEPTH_COVER` after it began to open. */
  const closed = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Takes `data-arrival` off the root once the title has settled. */
  const arrival = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * @param arrived The route committed. `false` when `maxWait` gave up on it,
   *   so there is no new title to settle.
   */
  const reveal = useCallback((arrived: boolean) => {
    if (!covering.current) return
    covering.current = false
    if (safety.current) clearTimeout(safety.current)
    const isDepth = kindNow.current === 'depth'

    /*
     * Never in the same commit as the cover — Tahap 42.
     *
     * The comment below has described this collapse since Tahap 16a: when
     * `covering` and `revealing` land together, the DOM attribute goes
     * straight from `idle` to `revealing` and the cover **never paints**. The
     * fix then was to move the signal to the Navigation API, which fires
     * ~14ms earlier — and that comment says exactly what was wrong with it:
     * *"the two states are far enough apart" is a timing assumption*.
     *
     * Tahap 42 collected on that assumption. Adding a per-frame consumer to
     * the footer — which every route renders — was enough to close the gap,
     * and `e2e/journey.e2e.ts` reported a back navigation reaching
     * `revealing:history` and `idle:history` with no `covering` in between.
     * Isolated by building without the change and re-running: the same probe
     * passed, so it was the timing, not the instrument.
     *
     * A history navigation is supposed to be *dressed* (`MOTION-SPEC.md` §9.4
     * rule 7). One frame is the smallest thing that makes it true rather than
     * likely: the cover has painted by the next animation frame, so the
     * reveal has something to reveal from.
     *
     * A timer, not a `requestAnimationFrame`. The project's own motion gate
     * rejects a bare rAF outside `lib/dev/` and `lib/scripts/` — correctly,
     * since that is how a second loop gets in — and this file already keeps
     * two timers for the other two nets, so the mechanism is the one it
     * already uses. A timer is also the more robust of the two here: rAF is
     * throttled in a background tab, and a navigation started before the tab
     * was hidden would sit covered until it came back.
     *
     * The wait is what is *left* of the minimum, so a cover that has already
     * been up longer than that reveals with no added delay at all — which is
     * the normal case, and the reason this costs nothing on a slow route.
     */
    const shown = performance.now() - coveredAt.current
    if (paint.current) clearTimeout(paint.current)
    paint.current = setTimeout(
      () => {
        paint.current = null
        // The circle is closed by now; say so before it starts to fade, in
        // case this timer won the race with the one that marks it.
        if (isDepth) document.documentElement.dataset.depth = 'covered'
        setState('revealing')
        if (settle.current) clearTimeout(settle.current)
        settle.current = setTimeout(() => setState('idle'), SETTLE)

        /*
         * SETTLE. The new page's title settles as the circle fades off it,
         * and only after a real arrival: when `maxWait` gave up, the title
         * under the circle is the one the reader already had.
         */
        if (isDepth && arrived) {
          const root = document.documentElement
          root.dataset.arrival = 'depth'
          if (arrival.current) clearTimeout(arrival.current)
          arrival.current = setTimeout(() => {
            delete root.dataset.arrival
          }, ARRIVAL)
        }
      },
      /*
       * The detail circle waits until it has closed. Fading a circle that is
       * still opening would show its edge travelling across the new page,
       * and the held snapshot only gives way at `data-depth="covered"`.
       */
      Math.max(0, (isDepth ? DEPTH_COVER : MIN_COVER) - shown)
    )
    /*
     * A second net, for the other end of the sweep.
     *
     * The panel returns to `idle` on `transitionend`, and that event is not
     * guaranteed to arrive: if `covering` and `revealing` land in the same
     * React commit, the DOM attribute changes without the intermediate state
     * ever painting, and a browser that starts no transition fires no
     * `transitionend`. The panel then sits at `revealing` — off-screen, but
     * permanently mid-sweep, so the next navigation animates from the wrong
     * place.
     *
     * Observed once during Tahap 16a, with the journey gate reporting it
     * exactly: `hop 3 back: the route overlay was left at "revealing"
     * instead of idle`. Moving the signal onto the Navigation API — which
     * fires ~14ms earlier than `popstate` — removed the collapse that caused
     * it, but "the two states are far enough apart" is a timing assumption,
     * and this is what makes the stranded state unrepresentable instead.
     *
     * `SETTLE` is comfortably longer than the slowest reveal the stylesheet
     * declares, so it never pre-empts a transition that is genuinely running.
     */
  }, [])

  /*
   * Where a press landed, recorded on the way down to the link. A capture
   * listener on the document runs before React's own click handling, so the
   * record is in place by the time the link's `onNavigate` announces the
   * navigation. Passive, and it only reads the pressed link.
   */
  useEffect(() => {
    if (prefersReducedMotion) return

    const onPress = (event: MouseEvent) => {
      press.current = pressOf(event)
    }
    document.addEventListener('click', onPress, {
      capture: true,
      passive: true,
    })
    return () => document.removeEventListener('click', onPress, true)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return

    return subscribeNavigation(({ intent, source: from }) => {
      // A navigation that morphs a shared element must not be covered: the
      // whole point of the morph is that the reader watches one object move
      // between two pages, and a panel over the top hides exactly that.
      if (intent === 'morph') return

      if (intent === 'depth') {
        const pressed =
          press.current && performance.now() - press.current.at < PRESS_FRESH
            ? press.current
            : null
        // A link to the page already open has no other sheet to open onto,
        // and its route never changes, so a circle would wait out `maxWait`.
        if (pressed?.samePage) return

        setDepth(depthStyle(pressed))
        const root = document.documentElement
        holdRoot()
        root.dataset.depth = 'rising'
        if (closed.current) clearTimeout(closed.current)
        closed.current = setTimeout(() => {
          root.dataset.depth = 'covered'
        }, DEPTH_COVER)
      }

      covering.current = true
      coveredAt.current = performance.now()
      kindNow.current = intent
      setKind(intent)
      setSource(from)
      setState('covering')
      if (safety.current) clearTimeout(safety.current)
      safety.current = setTimeout(() => reveal(false), maxWait)
    })
  }, [maxWait, prefersReducedMotion, reveal])

  // The other half of the pair: the new route has committed. `reveal` no-ops
  // unless a navigation actually covered the screen.
  useEffect(() => {
    reveal(true)
  }, [pathname, reveal])

  /*
   * Parked again: nothing is held for the circle any more. Released only
   * once no view transition is running, because `global.css`'s hold rules
   * leaving mid-transition would give the old page's snapshot the browser's
   * default cross-fade, and it would flash back over the new page. The
   * retry is this effect's own timer, stopped when the overlay leaves idle
   * (a new press sets the attribute again) or unmounts.
   */
  useEffect(() => {
    if (state !== 'idle') return
    if (closed.current) clearTimeout(closed.current)
    let retry: ReturnType<typeof setTimeout> | undefined
    const release = () => {
      if (viewTransitionRunning()) {
        retry = setTimeout(release, RELEASE_RETRY)
        return
      }
      delete document.documentElement.dataset.depth
      releaseRoot()
    }
    release()
    return () => clearTimeout(retry)
  }, [state])

  useEffect(
    () => () => {
      if (safety.current) clearTimeout(safety.current)
      if (settle.current) clearTimeout(settle.current)
      if (paint.current) clearTimeout(paint.current)
      if (closed.current) clearTimeout(closed.current)
      if (arrival.current) clearTimeout(arrival.current)
      delete document.documentElement.dataset.depth
      delete document.documentElement.dataset.arrival
      releaseRoot()
    },
    []
  )

  if (prefersReducedMotion) return null

  const circleOpen = kind === 'depth' && state !== 'idle'

  return (
    <>
      {/*
        The mark that makes React start a view transition for a `set-depth`
        navigation. Keyed by the path, so every route change unmounts one and
        mounts the next, and only the `set-depth` type gives them a class:
        every other navigation leaves it inert. React names a boundary only
        when its element is inside the viewport at commit time, so the mark
        is one fixed pixel in the corner (`components/ui/link` records that
        rule). It paints nothing.
      */}
      <ViewTransition
        key={pathname}
        enter={DEPTH_CLASS}
        exit={DEPTH_CLASS}
        default="none"
      >
        <span aria-hidden="true" className={c.mark} />
      </ViewTransition>
      <div
        className={s.overlay}
        /*
         * Names the overlay for a gate, so it can be counted rather than
         * guessed at from a class name — Tahap 48.
         *
         * The same lesson `components/ui/marquee` records: CSS modules put
         * the source filename into every generated class, so a `[class*="…"]`
         * selector measures the stylesheet rather than the page.
         * `e2e/entrance.e2e.ts` asserts this panel and the entrance curtain
         * are never both on screen, and that assertion needs a name it can
         * trust.
         */
        data-page-transition=""
        /*
         * The moment this overlay draws (`docs/MOTION-SPEC.md` §13.10), so
         * the interaction-grammar report can list it and attribute the
         * circle's movement to it. On the overlay rather than on every
         * `<Link>`: the links are its trigger, nearly every link on the site
         * is one, and the overlay is what moves.
         */
        data-epic="set-depth"
        data-state={state}
        data-source={source}
        data-kind={kind}
        aria-hidden="true"
        /*
         * Named only while a circle is open, so the view transition that
         * holds the old page captures the overlay on its own and keeps it
         * live above both pages (`global.css`). Idle, it stays out of every
         * other view transition, the morphs included.
         */
        style={
          circleOpen ? { ...depth, viewTransitionName: 'page-depth' } : depth
        }
        // Park it again once it has left the top of the screen, or once the
        // circle has faded. Off-screen or clear at both ends, so the reset is
        // never visible. The circle's own transitions bubble here too; only
        // its fade marks the end, never the ring arriving at COMMIT.
        onTransitionEnd={(event: TransitionEvent<HTMLDivElement>) => {
          if (state !== 'revealing') return
          const child = event.target !== event.currentTarget
          if (child && event.propertyName !== 'opacity') return
          if (settle.current) clearTimeout(settle.current)
          setState('idle')
        }}
      >
        {/* The circle, and the ring drawn round the press it opens out of. */}
        <span className={c.circle} />
        <span className={c.ring} />
      </div>
    </>
  )
}
