import { expect, type Page, test } from '@playwright/test'

import { UNITS, unitTemplate } from '../lib/content/units'
import { localizedPath } from '../lib/i18n/paths'

/**
 * `practice-statement`, the unit's statement read word by word as the reader
 * scrolls (`vault/blocks/unit-hero`, `components/effects/progress-text`;
 * listed under "Moments as built" in `docs/MOTION-SPEC.md`).
 *
 * Each word starts dim and comes up to full as the scroll passes from the
 * statement's top at 85% of the viewport to its bottom at 35%, the first
 * word first: the scroll is the clock, scrubbed 1:1. Under reduced motion
 * the scroll is not linked at all and every word comes up at once.
 *
 * `unit-page.e2e.ts` holds that the statement is there; this holds that it
 * moves, and that it ends readable. The words are the spans the split
 * leaves inside the `aria-hidden` copy; the accessible copy beside it is
 * whole text and never dims.
 */

const STATEMENT = '[data-unit-statement] span[aria-hidden="true"]'
const WORDS = `${STATEMENT} > span`

/** Every word's opacity, first word first. */
async function words(page: Page) {
  return page
    .locator(WORDS)
    .evaluateAll((spans) =>
      spans.map((span) => Number(getComputedStyle(span).opacity))
    )
}

/** Where the scrub starts and ends, as scroll positions. */
async function scrub(page: Page) {
  return page.locator(STATEMENT).evaluate((copy) => {
    const box = copy.getBoundingClientRect()
    return {
      start: box.top + window.scrollY - window.innerHeight * 0.85,
      end: box.bottom + window.scrollY - window.innerHeight * 0.35,
      margin: window.innerHeight * 0.25,
    }
  })
}

async function scrollTo(page: Page, y: number) {
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: 'instant' }),
    Math.max(0, Math.round(y))
  )
}

test.describe('practice-statement', () => {
  for (const unit of UNITS)
    test(`/id/${unit}: the statement comes up word by word with the scroll`, async ({
      page,
    }) => {
      await page.goto(localizedPath('id', unitTemplate(unit)))

      // Split, and the words dimmed: until the scroll reaches its end the
      // statement's last word is not yet at full.
      await expect(
        page.locator(WORDS),
        'the statement was never split into words'
      ).not.toHaveCount(0)
      expect(
        await page.locator(WORDS).count(),
        'a one-word statement cannot show an order'
      ).toBeGreaterThan(1)
      await expect
        .poll(async () => (await words(page)).at(-1), {
          message: 'the last word is at full before the reader reaches it',
        })
        .toBeLessThan(1)

      const { start, end, margin } = await scrub(page)
      expect(end, 'the scrub ends before the page can scroll').toBeGreaterThan(
        0
      )

      // Halfway through: the first word is ahead of the last.
      await scrollTo(page, (Math.max(start, 0) + end) / 2)
      await expect
        .poll(
          async () => {
            const opacity = await words(page)
            return (opacity[0] ?? 0) - (opacity.at(-1) ?? 0)
          },
          { message: 'halfway, the first word is not ahead of the last' }
        )
        .toBeGreaterThan(0)

      // Past the end: every word at full, and it stays readable.
      await scrollTo(page, end + margin)
      await expect
        .poll(async () => Math.min(...(await words(page))), {
          message: 'past the end of the scrub a word is still dim',
        })
        .toBe(1)
    })

  test('under reduced motion every word comes up without a scroll', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()

    try {
      await page.goto(localizedPath('id', unitTemplate(UNITS[0])))
      expect(
        await page.evaluate(
          () => matchMedia('(prefers-reduced-motion: reduce)').matches
        ),
        'reduced-motion emulation did not apply'
      ).toBe(true)

      await expect(
        page.locator(WORDS),
        'the statement was never split into words'
      ).not.toHaveCount(0)
      await expect
        .poll(async () => Math.min(...(await words(page))), {
          message: 'under reduced motion a word stayed dim',
        })
        .toBe(1)
      expect(
        await page.evaluate(() => window.scrollY),
        'the page scrolled'
      ).toBe(0)
    } finally {
      await context.close()
    }
  })
})
