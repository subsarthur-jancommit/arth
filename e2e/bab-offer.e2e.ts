import { expect, type Page, test } from '@playwright/test'

import { SITUATION_ROUTES, WORK_ROUTES } from './fixtures'

/**
 * R6's chapter and offer moments (`docs/MOTION-SPEC.md` §13.2 and §13.3).
 *
 * - `bab-formwork`: each offer card arrives inside a dashed form, and the
 *   form is struck a beat later. The chapter grid reveals per item, and the
 *   form used to be keyed on the container alone, which in that mode never
 *   stops being hidden, so every card kept its form for good.
 * - `bab-sift`: a market chip moves the cards that stay, 400ms
 *   `ease-out-quart`, where the catalogue's move is 800ms.
 * - `offer-fixings`: the boundaries plate is fixed at its four corners,
 *   clockwise and one at a time.
 *
 * The planned verification is the no-JavaScript and reduced-motion states on
 * a chapter and an offer, which `no-javascript` and `motion` already sweep
 * for visibility; this file checks the moments themselves. The chapter is
 * the one whose offers carry a market, so it is the one with a filter.
 */

const CHAPTER = SITUATION_ROUTES[1]
const OFFER = WORK_ROUTES[1]
const CARDS = '[data-epic="bab-formwork"] [data-reveal-item]'
const CHIPS = '[data-epic="bab-sift"] [role="group"] button'
const FIXINGS = '[data-epic="offer-fixings"] [data-corner]'

/** Each card's form, as its opacity, in reading order. */
async function forms(page: Page) {
  return page.evaluate(
    (selector) =>
      [...document.querySelectorAll(selector)].map((card) =>
        Number(getComputedStyle(card, '::after').opacity)
      ),
    CARDS
  )
}

/** Each card's own opacity, in reading order. */
async function cardOpacities(page: Page) {
  return page.evaluate(
    (selector) =>
      [...document.querySelectorAll(selector)].map((card) =>
        Number(getComputedStyle(card).opacity)
      ),
    CARDS
  )
}

/** Brings every card past the reading line, one after another. */
async function readGrid(page: Page) {
  const cards = page.locator(CARDS)
  const count = await cards.count()
  expect(count, `${CHAPTER} lists no offer`).toBeGreaterThan(0)
  for (let i = 0; i < count; i += 1) {
    await cards.nth(i).scrollIntoViewIfNeeded()
    await page.waitForTimeout(150)
  }
}

/** The durations of the FLIP animations running on the grid's items. */
async function siftDurations(page: Page) {
  return page.evaluate(() =>
    document.getAnimations().flatMap((animation) => {
      const effect = animation.effect
      if (!(effect instanceof KeyframeEffect)) return []
      const target = effect.target
      if (!(target instanceof Element) || !target.hasAttribute('data-flip-id'))
        return []
      const keyframes = effect.getKeyframes()
      const moves = keyframes.some(
        (frame) =>
          typeof frame.transform === 'string' &&
          frame.transform.startsWith('translate3d') &&
          frame.opacity === undefined
      )
      return moves ? [Number(effect.getTiming().duration)] : []
    })
  )
}

/** The fixings' transforms and their timing, clockwise from the first. */
async function fixings(page: Page) {
  return page.evaluate(
    (selector) =>
      [...document.querySelectorAll(selector)].map((mark) => {
        const style = getComputedStyle(mark)
        return {
          transform: style.transform,
          delay: Number.parseFloat(style.transitionDelay) * 1000,
          duration: Number.parseFloat(style.transitionDuration) * 1000,
        }
      }),
    FIXINGS
  )
}

test.describe('bab-formwork', () => {
  test('each card arrives in its form, and every form is struck', async ({
    page,
  }) => {
    await page.goto(CHAPTER)
    await page.waitForTimeout(800)
    // The grid starts below the fold, so nothing has arrived yet.
    const before = await forms(page)
    expect(before.at(-1), 'the last card has no form before it arrives').toBe(1)

    await readGrid(page)
    // The form holds 800ms after its card arrives, then takes 400ms to go.
    await page.waitForTimeout(2000)

    expect(await forms(page), 'a form was never struck').toEqual(
      before.map(() => 0)
    )
    expect(await cardOpacities(page), 'a card did not arrive').toEqual(
      before.map(() => 1)
    )
  })
})

test.describe('bab-sift', () => {
  test('a market chip moves the cards that stay in the standard band', async ({
    page,
  }) => {
    await page.goto(CHAPTER)
    await page.waitForTimeout(800)
    await readGrid(page)
    await page.waitForTimeout(1200)

    const chips = page.locator(CHIPS)
    await expect(chips, `${CHAPTER} shows no market filter`).toHaveCount(3)
    const all = await page.locator(CARDS).count()

    await chips.nth(1).scrollIntoViewIfNeeded()
    await chips.nth(1).click()
    await page.waitForTimeout(60)
    const durations = await siftDurations(page)
    await page.waitForTimeout(1500)
    const shown = await page.locator(CARDS).count()

    expect(
      durations.every((duration) => duration === 400),
      String(durations)
    ).toBe(true)
    if (shown !== all) {
      expect(durations.length, 'the filter moved nothing').toBeGreaterThan(0)
    }
    await expect(chips.nth(1)).toHaveAttribute('aria-pressed', 'true')
    expect(await cardOpacities(page)).toEqual(
      Array.from({ length: shown }, () => 1)
    )

    await chips.nth(0).click()
    await page.waitForTimeout(1500)
    await expect(page.locator(CARDS)).toHaveCount(all)
  })
})

test.describe('offer-fixings', () => {
  test('the plate is fixed clockwise, one corner at a time', async ({
    page,
  }) => {
    await page.goto(OFFER)
    await page.waitForTimeout(800)

    const marks = await fixings(page)
    expect(marks, `${OFFER} has no fixings`).toHaveLength(4)
    // One at a time: each waits until the one before it has been driven home.
    for (let i = 1; i < marks.length; i += 1) {
      const [previous, mark] = [marks[i - 1], marks[i]]
      if (!previous || !mark) continue
      expect(
        mark.delay - previous.delay,
        `corner ${i} starts before corner ${i - 1} is fixed`
      ).toBeGreaterThanOrEqual(previous.duration)
    }

    await page.locator('[data-epic="offer-fixings"]').scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)
    expect(
      (await fixings(page)).map((mark) => mark.transform),
      'a corner was never fixed'
    ).toEqual(['none', 'none', 'none', 'none'])
  })
})

test.describe('chapter and offer moments under reduced motion', () => {
  test('no form, no move, and every fixing already in place', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    try {
      await page.goto(CHAPTER)
      await page.waitForTimeout(600)
      const shownForms = await forms(page)
      expect(shownForms, 'a card was given a form').toEqual(
        shownForms.map(() => 0)
      )

      const chips = page.locator(CHIPS)
      await chips.nth(1).scrollIntoViewIfNeeded()
      await chips.nth(1).click()
      await page.waitForTimeout(60)
      expect(await siftDurations(page), 'the filter animated').toEqual([])
      const shown = await page.locator(CARDS).count()
      await page.waitForTimeout(600)
      await expect(page.locator(CARDS)).toHaveCount(shown)
      expect(await cardOpacities(page)).toEqual(
        Array.from({ length: shown }, () => 1)
      )

      await page.goto(OFFER)
      await page.waitForTimeout(400)
      expect((await fixings(page)).map((mark) => mark.transform)).toEqual([
        'none',
        'none',
        'none',
        'none',
      ])
    } finally {
      await context.close()
    }
  })
})

test.describe('chapter and offer moments without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('cards stand without forms, the filter is absent, the plate is fixed', async ({
    page,
  }) => {
    await page.goto(CHAPTER)
    const noForms = await forms(page)
    expect(noForms.length, `${CHAPTER} lists no offer`).toBeGreaterThan(0)
    expect(noForms).toEqual(noForms.map(() => 0))
    await expect(
      page.locator('[data-epic="bab-sift"] [role="group"]')
    ).toBeHidden()

    await page.goto(OFFER)
    expect((await fixings(page)).map((mark) => mark.transform)).toEqual([
      'none',
      'none',
      'none',
      'none',
    ])
  })
})
