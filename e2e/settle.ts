import type { Page } from '@playwright/test'

/**
 * Waits until no CSS transition on the page is running, or `timeout` passes.
 *
 * A gate that judges what a reader sees (axe's contrast, `contrast-situ`)
 * has to judge it at rest. A fixed sleep only says how long the slowest
 * reveal was when the sleep was written. Since F4-02 a unit's dialect sets
 * its own tempo (`lib/styles/css/dialects.css`): Konstruksi's arrivals run
 * one at a time on a 1000ms settle, so a block of four takes about 2.2s, and
 * a sleep sized to the base grammar's 400ms measured some of them mid-fade.
 * This asks the page instead.
 *
 * Best effort: on timeout it returns rather than throws, so a page that keeps
 * something transitioning is measured as it is, as it was before. Only
 * transitions are waited for. A scroll-driven or looping CSS animation never
 * finishes, and is not a reveal.
 */
export async function transitionsAtRest(page: Page, timeout = 5000) {
  try {
    await page.waitForFunction(
      () =>
        !document
          .getAnimations()
          .some(
            (animation) =>
              'transitionProperty' in animation &&
              animation.playState === 'running'
          ),
      undefined,
      { timeout }
    )
  } catch {
    // Measured as it is: the gate's own fixed wait has already run.
  }
}

/**
 * The settle of the unit whose page is on screen, in milliseconds, or `null`
 * outside a dialect. Resolved on the rendered `<main>` (Next keeps the page
 * just left in the tree, hidden), so a test compares against the stylesheet,
 * not a copied number.
 */
export async function unitSettleMs(page: Page): Promise<number | null> {
  return page.evaluate(() => {
    const main = [...document.querySelectorAll('main')].find(
      (element) => element.getBoundingClientRect().height > 0
    )
    if (!main?.dataset.dialect) return null
    const probe = document.createElement('i')
    probe.style.transitionDuration = 'var(--dialect-settle)'
    main.append(probe)
    const seconds = Number.parseFloat(
      getComputedStyle(probe).transitionDuration
    )
    probe.remove()
    return Math.round(seconds * 1000)
  })
}
