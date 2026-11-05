import { expect, type Page, test } from '@playwright/test'

/**
 * `situation-leader`, a situation pointing to its unit
 * (`docs/MOTION-SPEC.md` §13.8, R6), on the home page's "Pilih situasi".
 *
 * On a wide screen a row pointed at or focused draws a leader from the
 * situation across to the unit it names, and the unit is inked as the dot
 * lands. On a phone the line is drawn as the row arrives. Under reduced
 * motion no line is drawn, and the unit is named in the link's text in
 * every case.
 *
 * The rows are `data-press="situation"`, so `e2e/interaction-grammar.e2e.ts`
 * already checks that each answers a press and that its intent reaches the
 * keyboard. This file checks what the sweep cannot see: that the line is the
 * leader the card asks for, running from one to the other.
 */

const ROWS = '#situasi li[data-leader-target]'

interface RowState {
  /** The leader's run, as drawn: zero wide until the line is drawn. */
  run: number
  /** Whether the leader is laid out at all. */
  shown: boolean
  /** The gap from the end of the situation to the start of the leader. */
  fromProblem: number
  /** The gap from the leader's dot to the unit's name. */
  toUnit: number
  /** The unit's name, as the link reads it. */
  unit: string
  unitColor: string
}

async function row(page: Page, index: number): Promise<RowState> {
  return page.evaluate(
    ({ selector, i }) => {
      const item = document.querySelectorAll(selector)[i]
      const link = item?.querySelector('a')
      const problem = link?.querySelector(':scope > span:first-child')
      const leader = link?.querySelector('[aria-hidden="true"]')
      const unit = link?.querySelector(
        ':scope > span:last-child > span:last-child'
      )
      const box = (element: Element | null | undefined) =>
        element?.getBoundingClientRect() ?? new DOMRect()
      const run = leader?.children[1]
      return {
        run: box(run).width,
        shown: leader ? getComputedStyle(leader).display !== 'none' : false,
        fromProblem: box(leader).left - box(problem).right,
        toUnit: box(unit).left - box(leader).right,
        unit: unit?.textContent?.trim() ?? '',
        unitColor: unit ? getComputedStyle(unit).color : '',
      }
    },
    { selector: ROWS, i: index }
  )
}

async function toSituations(page: Page) {
  await page.goto('/id', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const first = page.locator(ROWS).first()
  await expect(first, 'the home page lists no situation').toBeVisible()
  await first.scrollIntoViewIfNeeded()
  await page.waitForTimeout(800)
}

test.describe('situation-leader', () => {
  test('a row pointed at draws a leader across to its unit, and inks it', async ({
    page,
  }) => {
    await toSituations(page)
    const rest = await row(page, 0)
    expect(rest.run, 'the leader is drawn before anything points at it').toBe(0)

    await page.locator(ROWS).first().hover()
    await page.waitForTimeout(400)
    const drawn = await row(page, 0)

    // The card's line runs from the situation to its unit, not a gutter
    // in front of the unit's name.
    expect(drawn.run, 'the leader barely leaves the unit').toBeGreaterThan(100)
    expect(drawn.fromProblem).toBeGreaterThanOrEqual(0)
    expect(
      drawn.fromProblem,
      'the leader starts far from its situation'
    ).toBeLessThan(40)
    expect(drawn.toUnit).toBeGreaterThanOrEqual(0)
    expect(drawn.toUnit, 'the leader stops short of its unit').toBeLessThan(40)
    expect(drawn.unitColor, 'the unit was not inked').not.toBe(rest.unitColor)
  })

  test('keyboard focus draws the same leader', async ({ page }) => {
    await toSituations(page)
    await page.keyboard.press('Tab')
    await page.locator(`${ROWS} a`).nth(1).focus()
    await page.waitForTimeout(400)

    const focused = await row(page, 1)
    expect(focused.run, 'focus drew no leader').toBeGreaterThan(100)
    expect((await row(page, 2)).run, 'an unfocused row drew one').toBe(0)
  })

  test('on a phone the leader is drawn as the row arrives', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    })
    const page = await context.newPage()

    try {
      await toSituations(page)
      expect((await row(page, 0)).run, 'no leader on arrival').toBeGreaterThan(
        0
      )
    } finally {
      await context.close()
    }
  })

  test('under reduced motion no line is drawn, and the unit is still named', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    try {
      await toSituations(page)
      await page.locator(ROWS).first().hover()
      await page.waitForTimeout(400)

      const count = await page.locator(ROWS).count()
      for (let i = 0; i < count; i += 1) {
        const state = await row(page, i)
        expect(state.shown, `row ${i} drew a line`).toBe(false)
        expect(state.unit, `row ${i} does not name its unit`).not.toBe('')
      }
    } finally {
      await context.close()
    }
  })
})

test.describe('situation-leader without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('every situation is a link that names its unit', async ({ page }) => {
    await page.goto('/id')
    const links = page.locator(`${ROWS} a[href]`)
    const count = await links.count()
    expect(count, 'the home page lists no situation').toBeGreaterThan(0)

    for (let i = 0; i < count; i += 1) {
      expect(
        (await row(page, i)).unit,
        `situation ${i} names no unit`
      ).not.toBe('')
    }
  })
})
