import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * A card in hand shows crop marks at its plate's corners — Tata & Gerak,
 * stage 3 (`vault/motion/crop-marks`, in `vault/blocks/project-card`).
 *
 * The marks live outside the plate, in the space a card shares with its
 * caption and its neighbours, so where they end is what can go wrong
 * quietly: a mark that reaches the caption draws through the work's title.
 */
const CARD = 'article[data-span] a[data-press="card"]'

/**
 * The opacity each of the first card's corners comes to rest at, top left
 * round.
 *
 * ## Read at rest, not raced — the flake on run 42327047092
 *
 * "drawn for the keyboard too" failed once there and passed on retry. The
 * failed attempt's page snapshot has the first card as the active element,
 * so focus had landed; yet five seconds later every corner still read `0`,
 * and the screenshot taken at the end still shows the entrance curtain over
 * the page. The curtain is CSS alone and gone a second after it starts on
 * any machine (`vault/motion/curtain`), so the page's animation clock had not
 * moved for those five seconds: on CI's software GPU, `/work`'s WebGL
 * material holds the main thread while its first frames are built, and a CSS
 * transition does not advance in the meantime. `readSettled` in
 * `e2e/material-layer.e2e.ts` recorded the same thing in Tahap 91: a
 * transition created and still at `currentTime: 0`. A poll on the computed
 * opacity was measuring how busy the runner was.
 *
 * So each corner's transitions are finished before it is read. That keeps
 * every claim this file makes — which corners show, and in which state — and
 * drops the one it never meant to make: how soon a starved runner gets to
 * its next frame. `getAnimations()` brings the style up to date first, so a
 * transition the last change started is among the ones it finishes.
 */
function corners(page: Page) {
  return page
    .locator(CARD)
    .first()
    .evaluate((link) =>
      [...link.querySelectorAll('[data-epic="card-crop"] [data-corner]')].map(
        (corner) => {
          for (const animation of corner.getAnimations()) animation.finish()
          return getComputedStyle(corner).opacity
        }
      )
    )
}

/** Whether the first card matches `selector`, read in the page. */
function cardMatches(page: Page, selector: string) {
  return page
    .locator(CARD)
    .first()
    .evaluate((link, wanted) => link.matches(wanted), selector)
}

test.describe('a card in hand shows its crop marks', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('drawn under the pointer, gone when it leaves', async ({ page }) => {
    await page.goto('/en/work')
    const card = page.locator(CARD).first()
    expect(await corners(page), 'marks before the pointer came').toEqual([
      '0',
      '0',
      '0',
      '0',
    ])

    await card.hover()
    // The premise, checked rather than assumed: a failure below should say
    // whether the card was in hand at all.
    await expect
      .poll(() => cardMatches(page, ':hover'), {
        message: 'the card is not under the pointer',
      })
      .toBe(true)
    await expect.poll(() => corners(page)).toEqual(['1', '1', '1', '1'])

    await page.mouse.move(2, 2)
    await expect
      .poll(() => cardMatches(page, ':hover'), {
        message: 'the card is still under the pointer',
      })
      .toBe(false)
    await expect.poll(() => corners(page)).toEqual(['0', '0', '0', '0'])
  })

  test('drawn for the keyboard too', async ({ page }) => {
    await page.goto('/en/work')
    // A real key first, so the focus below is `:focus-visible`.
    await page.keyboard.press('Tab')
    const card = page.locator(CARD).first()
    await card.focus()

    // The premise, checked rather than assumed: focus on the card, and the
    // keyboard kind of focus the marks answer to.
    await expect(card, 'the card does not hold the focus').toBeFocused()
    expect(
      await cardMatches(page, ':focus-visible'),
      'the card holds the focus but not as :focus-visible'
    ).toBe(true)
    await expect.poll(() => corners(page)).toEqual(['1', '1', '1', '1'])
  })

  test('the marks below the plate end above the caption', async ({ page }) => {
    for (const width of [800, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/en/work')

      const room = await page
        .locator(CARD)
        .first()
        .evaluate((link) => {
          const plate = link.querySelector('[data-plate-frame]')
          const title = link.querySelector('h3')
          const corner = link.querySelector('[data-corner="bottom-left"]')
          if (!plate || !title || !corner) return null
          // The column's line under the plate: from its top inset, its height.
          const line = getComputedStyle(corner, '::after')
          const reach =
            Number.parseFloat(line.top) + Number.parseFloat(line.height)
          const gap =
            title.getBoundingClientRect().top -
            plate.getBoundingClientRect().bottom
          return gap - reach
        })

      expect(room, `${width}px: no card to measure`).not.toBeNull()
      expect(
        room,
        `${width}px: the crop mark reaches the caption`
      ).toBeGreaterThan(0)
    }
  })
})
