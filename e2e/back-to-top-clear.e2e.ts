import { expect, test } from '@playwright/test'

/**
 * At the end of a page, the back-to-top chip covers nothing.
 *
 * On a 390px phone the footer's rights line runs to the right edge, and with
 * 32px under it the chip covered its lower 6px — measured on the live site on
 * 2026-10-05 (`docs/HANDOFF.md` §4.8, A2). The footer now keeps the chip's
 * corner as its minimum bottom padding.
 */
test.describe('the chip leaves the last line alone', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })

  for (const path of ['/en', '/id', '/en/studio']) {
    test(path, async ({ page }) => {
      await page.goto(path)
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight)
      )

      const chip = page.locator('[data-epic="back-to-top"]')
      // Rendered once the page's script reads the scroll; give a slow runner time.
      await expect(chip).toBeVisible({ timeout: 15_000 })
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              window.scrollY + window.innerHeight >=
              document.documentElement.scrollHeight - 2
          )
        )
        .toBe(true)

      const last = await page.locator('footer p').last().boundingBox()
      const box = await chip.boundingBox()
      expect(last, 'no rights line').not.toBeNull()
      expect(box, 'no chip').not.toBeNull()
      if (!last || !box) return

      const overlapsX =
        last.x < box.x + box.width && box.x < last.x + last.width
      const overlapsY =
        last.y < box.y + box.height && box.y < last.y + last.height
      expect(
        overlapsX && overlapsY,
        `the chip (${box.x},${box.y}) covers the last line (${last.x},${last.y}, ${last.width}x${last.height})`
      ).toBe(false)
    })
  }
})
