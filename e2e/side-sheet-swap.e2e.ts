import { expect, type Page, test } from '@playwright/test'

import { SIDES, sideTemplate } from '../lib/content/units'
import { localizedPath } from '../lib/i18n/paths'

/**
 * `side-sheet-swap`, one side of a unit exchanged for the other
 * (`docs/MOTION-SPEC.md` §13.1, R6).
 *
 * INTENT: the rule under the switcher goes to the side pointed at or
 * focused. TRANSPORT and SETTLE: a press navigates with the `side-sheet`
 * transition type, and the page's `<ViewTransition>` lets `global.css` lift
 * the old sheet away and settle the new one. The page overlay stands aside,
 * so no detail circle or panel covers the exchange. The new sheet's title is
 * handed focus, in both motion modes.
 *
 * The card's planned verification is the no-JavaScript link, which
 * `e2e/side-page.e2e.ts` already covers, the reduced-motion final state, and
 * the named moment. This file covers the last two and the sequence itself.
 *
 * Next keeps the page just left in the tree, hidden, so the way back is
 * instant. After a switch the document holds both sheets, and every lookup
 * here asks for the visible one (e2e run 41954397719 found two `main h1`).
 *
 * The exchange is found by what ran, not by transition type. A press makes
 * two view transitions in production: the first carries the `side-sheet`
 * type and only moves the URL, the second changes the sheets and carries no
 * type (e2e run 41983464648; `lib/motion/side-sheet.ts`).
 */

const [FIRST, SECOND] = SIDES.konstruksi
const FROM = localizedPath('id', sideTemplate('konstruksi', FIRST))
const TO = localizedPath('id', sideTemplate('konstruksi', SECOND))
const SWITCHER = '[data-epic="side-sheet-swap"]:visible'
const OTHER = `${SWITCHER} a[href="${TO}"]`
const TITLE = 'main h1:visible'

/** One view transition the page started, as the browser ran it. */
interface Exchange {
  types: string[]
  /** `ready` once the browser took both pictures; `skipped` if it gave up. */
  state: 'pending' | 'ready' | 'skipped'
  /** Every animation on its pseudo-elements at `ready`, `name@pseudo`. */
  animations: string[]
  readyAt: number | null
  doneAt: number | null
}

interface SheetRecord {
  /** Every view transition the page started. */
  transitions: Exchange[]
  /** Every `data-state` the page overlay passed through. */
  states: string[]
}

declare global {
  var __sheet: SheetRecord
}

/**
 * Records every view transition and the overlay's states for the whole life
 * of the document. As in `e2e/set-depth.e2e.ts`, the overlay is looked for
 * once the document exists, never before `<html>` is parsed.
 *
 * A transition's animations are read at its `ready`, not at some moment
 * after the URL changes. React commits the new page, URL included, inside
 * the transition's update and then waits up to 500ms for fonts and images in
 * view before the browser takes the new picture and starts animating
 * (`startViewTransition` in react-dom). Sampled 100ms after the URL changed,
 * the exchange had not begun yet, and the sample was empty (e2e run
 * 41956728827).
 */
async function record(page: Page) {
  await page.addInitScript(() => {
    const seen: SheetRecord = { transitions: [], states: [] }
    globalThis.__sheet = seen

    const original = document.startViewTransition?.bind(document)
    if (original) {
      document.startViewTransition = (argument) => {
        const exchange: Exchange = {
          types:
            argument && typeof argument === 'object'
              ? [...(argument.types ?? [])]
              : [],
          state: 'pending',
          animations: [],
          readyAt: null,
          doneAt: null,
        }
        seen.transitions.push(exchange)
        const transition = original(argument)
        transition.ready.then(
          () => {
            exchange.state = 'ready'
            exchange.readyAt = performance.now()
            exchange.animations = document.documentElement
              .getAnimations({ subtree: true })
              .flatMap((animation) => {
                const effect = animation.effect
                const pseudo =
                  effect instanceof KeyframeEffect ? effect.pseudoElement : null
                if (!pseudo?.startsWith('::view-transition')) return []
                const name =
                  animation instanceof CSSAnimation
                    ? animation.animationName
                    : 'script'
                return [`${name}@${pseudo}`]
              })
          },
          () => {
            exchange.state = 'skipped'
          }
        )
        const ended = () => {
          exchange.doneAt = performance.now()
        }
        transition.finished.then(ended, ended)
        return transition
      }
    }

    const watch = (tries: number) => {
      const overlay = document.querySelector('[data-page-transition]')
      if (overlay) {
        new MutationObserver(() =>
          seen.states.push(overlay.getAttribute('data-state') ?? '-')
        ).observe(overlay, {
          attributes: true,
          attributeFilter: ['data-state'],
        })
      } else if (tries > 0) {
        setTimeout(() => watch(tries - 1), 100)
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => watch(100))
    } else {
      watch(100)
    }
  })
}

/** Whether focus is on the title of the sheet now on screen. */
async function titleHasFocus(page: Page) {
  return page.evaluate(() => {
    const focused = document.activeElement
    return (
      focused instanceof HTMLElement &&
      focused.matches('main h1') &&
      focused.checkVisibility()
    )
  })
}

/**
 * Every view transition a press made, once all of them have ended: React's
 * wait for fonts and images, the URL's transition, then the 1200ms exchange
 * fit well inside the first 2.5s on CI's runner.
 */
async function exchangeOf(page: Page) {
  await page.waitForTimeout(2500)
  await page.waitForFunction(
    () =>
      globalThis.__sheet.transitions.every(
        (transition) => transition.doneAt !== null
      ),
    undefined,
    { timeout: 5000 }
  )
  return page.evaluate(() => globalThis.__sheet)
}

/** The transition that ran a given half, if one did. */
function ranHalf(transitions: Exchange[], half: string) {
  return transitions.find((transition) =>
    transition.animations.some((animation) => animation.startsWith(half))
  )
}

/** Both halves of the exchange ran, and the settle ran its length. */
function expectBothHalves(transitions: Exchange[]) {
  const ran = JSON.stringify(
    transitions.map(({ types, state, animations }) => ({
      types,
      state,
      animations,
    }))
  )
  const lift = ranHalf(transitions, 'side-sheet-lift@::view-transition-old(')
  const settle = ranHalf(
    transitions,
    'side-sheet-settle@::view-transition-new('
  )
  expect(lift, `the old sheet did not lift: ${ran}`).toBeDefined()
  expect(settle, `the new sheet did not settle: ${ran}`).toBeDefined()
  // SETTLE waits 400ms for the old sheet to go, then takes 800ms.
  expect(
    (settle?.doneAt ?? 0) - (settle?.readyAt ?? 0),
    'the exchange ended before the new sheet had settled'
  ).toBeGreaterThanOrEqual(1100)
}

/** The switcher's rule and the link it should be under, as boxes. */
async function markerUnder(page: Page, selector: string) {
  const marker = await page
    .locator(`${SWITCHER} [data-epic="route-marker"]`)
    .boundingBox()
  const link = await page.locator(selector).boundingBox()
  expect(marker, 'the switcher has no rule').not.toBeNull()
  expect(link, `no link at ${selector}`).not.toBeNull()
  if (!marker || !link) return false
  return (
    Math.abs(marker.x - link.x) <= 2 && Math.abs(marker.width - link.width) <= 2
  )
}

test.describe('side-sheet-swap', () => {
  test('a press exchanges the sheet, with no circle, and focuses the new title', async ({
    page,
  }) => {
    await record(page)
    await page.goto(FROM)
    await page.waitForTimeout(1500)

    // INTENT: the rule goes to the side pointed at before anything is pressed.
    await page.locator(OTHER).hover()
    await page.waitForTimeout(400)
    expect(
      await markerUnder(page, OTHER),
      'the rule did not go to the side pointed at'
    ).toBe(true)

    await page.locator(OTHER).click()
    await page.waitForURL((url) => url.pathname === TO)

    const { transitions, states } = await exchangeOf(page)
    expectBothHalves(transitions)
    expect(
      transitions.some((transition) => transition.types.includes('set-depth')),
      'the switcher opened a detail circle'
    ).toBe(false)
    expect(
      states.filter((state) => state !== 'idle'),
      'the page overlay covered the exchange'
    ).toEqual([])

    await expect(page.locator(TITLE)).toBeVisible()
    expect(await titleHasFocus(page), 'focus was not handed to the title').toBe(
      true
    )
    expect(
      await markerUnder(page, `${SWITCHER} a[aria-current="page"]`),
      'the rule is not under the side now open'
    ).toBe(true)
  })

  test('the rule answers keyboard focus as it answers a pointer', async ({
    page,
  }) => {
    await page.goto(FROM)
    await page.waitForTimeout(1500)

    // A real key first, so the focus below is a keyboard one.
    await page.keyboard.press('Tab')
    await page.locator(OTHER).focus()
    await page.waitForTimeout(400)
    expect(
      await markerUnder(page, OTHER),
      'the rule did not go to the focused side'
    ).toBe(true)

    await page.keyboard.press('Enter')
    await page.waitForURL((url) => url.pathname === TO)
    await page.waitForTimeout(1600)
    expect(await titleHasFocus(page), 'focus was not handed to the title').toBe(
      true
    )
  })

  test('the link at the foot of the sheet makes the same exchange', async ({
    page,
  }) => {
    await record(page)
    await page.goto(FROM)
    await page.waitForTimeout(1500)

    const foot = page.locator(
      `main nav:not([data-epic="side-sheet-swap"]) a[href="${TO}"]`
    )
    await foot.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await foot.click()
    await page.waitForURL((url) => url.pathname === TO)

    const { transitions } = await exchangeOf(page)
    expectBothHalves(transitions)
    expect(await titleHasFocus(page)).toBe(true)
  })

  test('under reduced motion the new sheet appears at once, its title focused', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    try {
      await record(page)
      await page.goto(FROM)
      await page.waitForTimeout(1000)

      await page.locator(OTHER).click()
      await page.waitForURL((url) => url.pathname === TO)
      // Long enough for every transition the press makes to have run; the
      // assertion is on how long each took, not on when it was read.
      await page.waitForTimeout(1500)

      const { transitions } = await page.evaluate(() => globalThis.__sheet)
      for (const transition of transitions) {
        expect(
          transition.animations.filter((animation) =>
            animation.startsWith('side-sheet')
          ),
          'the sheet moved for a reader who asked for no motion'
        ).toEqual([])
        expect(
          transition.doneAt,
          'a view transition is still holding the page'
        ).not.toBeNull()
        expect(
          (transition.doneAt ?? 0) - (transition.readyAt ?? 0),
          'the new sheet did not appear at once'
        ).toBeLessThan(200)
      }
      await expect(page.locator(TITLE)).toBeVisible()
      expect(
        await titleHasFocus(page),
        'focus was not handed to the title'
      ).toBe(true)
    } finally {
      await context.close()
    }
  })
})
