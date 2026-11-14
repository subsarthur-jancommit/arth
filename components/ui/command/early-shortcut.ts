/**
 * Ctrl+K (⌘K on a Mac) pressed before the page has hydrated is kept, not lost.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## The defect this exists for
 *
 * `CommandTrigger` (`./index.tsx`) listens for the shortcut from an effect, so
 * its listener exists only once the header has hydrated. A reader who pressed
 * the shortcut before then got nothing, and in Chrome the browser's own
 * Ctrl+K took the press to the address bar instead.
 *
 * Measured in CI on `/en/work` (main #308, both attempts): the press landed
 * at 1.11 s, just after `networkidle`. The page's first link prefetches,
 * which only start once hydration has run its effects, came at 1.35 s. The
 * palette never opened. `e2e/grid-underlay.e2e.ts` had pressed at that moment
 * for months and won the race; it began to lose every time once the network
 * went quiet earlier, after #80 inlined the CSS.
 *
 * ## How
 *
 * `EARLY_SHORTCUT_SCRIPT` runs during document parse, from the root layout. It
 * counts the presses and takes the browser's default away from them until the
 * trigger is ready. The trigger, once its own listener is attached, takes the
 * count and replays it: an odd count opens the palette, as those presses
 * would have toggled it. From then on the early listener stands aside.
 *
 * `script-src` carries `'unsafe-inline'` as this project's documented base
 * policy (`lib/integrations/csp.ts`), as for the curtain's session guard
 * (`vault/motion/curtain`), so this adds no new exposure.
 */

/** What the early listener and the trigger share, on `window`. */
interface EarlyShortcut {
  /** Presses counted while no trigger was ready. */
  presses: number
  /** True while a trigger's own listener is attached. */
  ready: boolean
}

declare global {
  interface Window {
    __arthCommandShortcut?: EarlyShortcut
  }
}

/**
 * The parse-time listener. The same test as the trigger's own listener:
 * `k` with Ctrl or ⌘, and nothing else asked of the event.
 */
export const EARLY_SHORTCUT_SCRIPT =
  "(function(){var s=window.__arthCommandShortcut={presses:0,ready:false};document.addEventListener('keydown',function(e){if(s.ready||e.key!=='k'||!(e.metaKey||e.ctrlKey))return;e.preventDefault();s.presses++})})()"

/**
 * Marks a trigger ready and hands back the presses that came before it. The
 * early listener ignores every press from here on. 0 when the early script
 * never ran.
 */
export function takeEarlyPresses(): number {
  const early = window.__arthCommandShortcut
  if (!early) return 0
  early.ready = true
  const { presses } = early
  early.presses = 0
  return presses
}

/** The trigger is gone: count presses again until one is ready. */
export function releaseEarlyPresses(): void {
  const early = window.__arthCommandShortcut
  if (early) early.ready = false
}
