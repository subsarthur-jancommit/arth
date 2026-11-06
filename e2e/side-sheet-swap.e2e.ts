import { expect, type Page, test } from '@playwright/test'

import { SIDES, sideTemplate, UNITS } from '../lib/content/units'
import { localizedPath } from '../lib/i18n/paths'

/**
 * `side-sheet-swap`, one side of a unit exchanged for the other
 * (`docs/MOTION-SPEC.md` §13.1, R6).
 *
 * INTENT: the rule under the switcher goes to the side pointed at or
 * focused. TRANSPORT: the press lifts and fades the sheet on screen, 400ms.
 * SETTLE: the new sheet's title block rises into place as it arrives, 800ms.
 * Both run on the Web Animations API (`side-switcher.tsx` has why not a view
 * transition), under the ids `side-sheet-lift` and `side-sheet-settle`, and
 * this file records every such call with the sheet it moved. The page overlay
 * stands aside, so no detail circle or panel covers the exchange. The new
 * sheet's title is handed focus, in both motion modes.
 *
 * Next keeps the page just left in the tree, hidden, so the way back is
 * instant. After a switch the document holds both sheets, and every lookup
 * here asks for the visible one (e2e run 41954397719 found two `main h1`).
 *
 * A side page speaks its unit's dialect (F4-02, `lib/styles/css/dialects.css`),
 * so TRANSPORT and SETTLE both run on the unit's settle, not on the 400ms and
 * 800ms above, which are the base grammar's: the expected durations are read
 * from the page, and one test runs the exchange on every unit.
 */

const [FIRST, SECOND] = SIDES.konstruksi
const FROM = localizedPath('id', sideTemplate('konstruksi', FIRST))
const TO = localizedPath('id', sideTemplate('konstruksi', SECOND))
const SWITCHER = '[data-epic="side-sheet-swap"]:visible'
const OTHER = `${SWITCHER} a[href="${TO}"]`
const TITLE = 'main h1:visible'

/** One `animate()` call for the exchange, with the sheet it moved. */
interface Half {
  id: string
  /** The title of the sheet the moved block belongs to. */
  sheet: string
  duration: number
  /** The last keyframe's opacity, when it sets one. */
  endOpacity: number | null
  at: number
}

interface SheetRecord {
  halves: Half[]
  /** The transition types of every view transition the page started. */
  types: string[][]
  /** Every `data-state` the page overlay passed through. */
  states: string[]
}

declare global {
  var __sheet: SheetRecord
}

/**
 * Records the exchange's animations, the types of every view transition and
 * the overlay's states for the whole life of the document. As in
 * `e2e/set-depth.e2e.ts`, the overlay is looked for once the document
 * exists, never before `<html>` is parsed.
 */
async function record(page: Page) {
  await page.addInitScript(() => {
    const seen: SheetRecord = { halves: [], types: [], states: [] }
    globalThis.__sheet = seen

    const animate = Element.prototype.animate
    Element.prototype.animate = function (keyframes, options) {
      const animation = animate.call(this, keyframes, options)
      const id = typeof options === 'object' ? (options.id ?? '') : ''
      if (id.startsWith('side-sheet')) {
        const frames = Array.isArray(keyframes) ? keyframes : []
        const last = frames.at(-1)
        seen.halves.push({
          id,
          sheet:
            this.closest('article')?.querySelector('h1')?.textContent?.trim() ??
            '',
          duration:
            typeof options === 'object' ? Number(options.duration ?? 0) : 0,
          endOpacity:
            last && last.opacity !== undefined ? Number(last.opacity) : null,
          at: performance.now(),
        })
      }
      return animation
    }

    const original = document.startViewTransition?.bind(document)
    if (original) {
      document.startViewTransition = (argument) => {
        seen.types.push(
          argument && typeof argument === 'object'
            ? [...(argument.types ?? [])]
            : []
        )
        return original(argument)
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

/**
 * The settle of the unit whose sheet is on screen, in milliseconds, or `null`
 * outside a dialect. Resolved in the page, so this compares against the
 * stylesheet, not a copied number.
 */
async function unitSettle(page: Page): Promise<number | null> {
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

/**
 * Both halves ran, each on its own sheet, lift first, and both at `settle`:
 * the unit's, or §13.1's 400ms and 800ms outside a dialect.
 */
function expectBothHalves(
  halves: Half[],
  from: string,
  to: string,
  settle: number | null
) {
  const ran = JSON.stringify(halves)
  const lifts = halves.filter((half) => half.id === 'side-sheet-lift')
  const settles = halves.filter((half) => half.id === 'side-sheet-settle')

  expect(lifts.length, `the old sheet did not lift: ${ran}`).toBeGreaterThan(0)
  for (const lift of lifts) {
    expect(lift.sheet, 'a lift moved another sheet').toBe(from)
    expect(lift.duration, 'TRANSPORT is off its tempo').toBe(settle ?? 400)
    expect(lift.endOpacity, 'the lift does not fade').toBe(0)
  }
  expect(settles, `the new title did not settle: ${ran}`).toHaveLength(1)
  expect(settles[0]?.sheet, 'the settle moved another sheet').toBe(to)
  expect(settles[0]?.duration, 'SETTLE is off its tempo').toBe(settle ?? 800)
  expect(settles[0]?.endOpacity, 'the settle fades the title').toBeNull()
  expect(
    (lifts[0]?.at ?? 0) <= (settles[0]?.at ?? 0),
    'the new title settled before the old sheet lifted'
  ).toBe(true)
}

test.describe('side-sheet-swap', () => {
  test('a press exchanges the sheet, with no circle, and focuses the new title', async ({
    page,
  }) => {
    await record(page)
    await page.goto(FROM)
    await page.waitForTimeout(1500)
    const from = (await page.locator(TITLE).textContent())?.trim() ?? ''
    const settle = await unitSettle(page)

    // INTENT: the rule goes to the side pointed at before anything is pressed.
    await page.locator(OTHER).hover()
    await page.waitForTimeout(400)
    expect(
      await markerUnder(page, OTHER),
      'the rule did not go to the side pointed at'
    ).toBe(true)

    await page.locator(OTHER).click()
    await page.waitForURL((url) => url.pathname === TO)
    await page.waitForTimeout(1500)

    const to = (await page.locator(TITLE).textContent())?.trim() ?? ''
    const { halves, types, states } = await page.evaluate(
      () => globalThis.__sheet
    )
    expectBothHalves(halves, from, to, settle)
    expect(
      types.some((list) => list.includes('set-depth')),
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
    const from = (await page.locator(TITLE).textContent())?.trim() ?? ''
    const settle = await unitSettle(page)

    const foot = page.locator(
      `main nav:not([data-epic="side-sheet-swap"]) a[href="${TO}"]`
    )
    await foot.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await foot.click()
    await page.waitForURL((url) => url.pathname === TO)
    await page.waitForTimeout(1500)

    const to = (await page.locator(TITLE).textContent())?.trim() ?? ''
    const { halves } = await page.evaluate(() => globalThis.__sheet)
    expectBothHalves(halves, from, to, settle)
    expect(await titleHasFocus(page)).toBe(true)
  })

  test('a late page never leaves the lifted sheet invisible', async ({
    page,
  }) => {
    /*
     * Every RSC request answers 5s late, so the press lands long before the
     * next sheet can. The lift ends at the unit's settle (400ms in the base
     * grammar) with the old sheet still on screen, and it must then come back
     * to be read: by twice the lift and a margin, well before the 5s.
     */
    await page.route(/[?&]_rsc=/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      await route.continue().catch(() => undefined)
    })
    await page.goto(FROM)
    await page.waitForTimeout(1500)
    const from = (await page.locator(TITLE).textContent())?.trim() ?? ''
    const lift = (await unitSettle(page)) ?? 400

    await page.locator(OTHER).click()
    await page.waitForTimeout(2 * lift + 500)

    const waiting = await page.evaluate((title) => {
      const heading = [...document.querySelectorAll('main h1')].find(
        (element) => element.textContent?.trim() === title
      )
      const block = heading?.closest('header')
      if (!(block instanceof HTMLElement) || !block.checkVisibility())
        return 'gone'
      return getComputedStyle(block).opacity
    }, from)
    expect(
      waiting === 'gone' || waiting === '1',
      `the lifted sheet was left at opacity ${waiting} while the page was late`
    ).toBe(true)
  })

  /*
   * F4-02: each unit exchanges its sheets at its own tempo. Both halves run
   * on the unit's settle, which differs between the three units (1000ms,
   * 200ms and 400ms in `dialects.css`, read here from the page).
   */
  test('the exchange runs at each unit`s tempo', async ({ page }) => {
    await record(page)
    const seen = new Map<string, number>()

    for (const unit of UNITS) {
      const [first, second] = SIDES[unit]
      const from = localizedPath('id', sideTemplate(unit, first))
      const to = localizedPath('id', sideTemplate(unit, second))
      await page.goto(from)
      await page.waitForTimeout(1500)
      const settle = await unitSettle(page)
      expect(settle, `${from} speaks no dialect`).not.toBeNull()

      await page.locator(`${SWITCHER} a[href="${to}"]`).click()
      await page.waitForURL((url) => url.pathname === to)
      await page.waitForTimeout(1500)

      const { halves } = await page.evaluate(() => globalThis.__sheet)
      expect(
        [...new Set(halves.map((half) => half.duration))],
        `${unit} exchanged off its tempo: ${JSON.stringify(halves)}`
      ).toEqual([settle])
      seen.set(unit, settle ?? 0)
    }

    expect(new Set(seen.values()).size, 'two units exchange alike').toBe(3)
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
      await page.waitForTimeout(1000)

      const { halves } = await page.evaluate(() => globalThis.__sheet)
      expect(
        halves,
        'the sheet moved for a reader who asked for no motion'
      ).toEqual([])
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
