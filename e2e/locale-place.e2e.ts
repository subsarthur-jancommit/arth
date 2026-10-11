import { expect, test } from '@playwright/test'

import { FEATURED_WORK } from './fixtures'

/**
 * Only Indonesian is approved for visitor-facing navigation. The language
 * switcher remains hidden until there is a second approved destination;
 * its section-matching logic is covered by `section.test.ts` meanwhile.
 */
test.describe('unapproved English is not offered as a language choice', () => {
  for (const path of ['/id', `/id/work/${FEATURED_WORK}`]) {
    test(`${path} offers no English switch`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      await expect(page.locator('[data-epic="locale-sheet"]')).toHaveCount(0)
      await expect(page.locator('header a[href^="/en"]')).toHaveCount(0)
      await expect(page.locator('footer a[href^="/en"]')).toHaveCount(0)
    })
  }

  test('a direct English preview does not advertise a language switch', async ({
    page,
  }) => {
    const path = `/en/work/${FEATURED_WORK}`
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveURL(new RegExp(`${path}$`))
    await expect(page.locator('[data-epic="locale-sheet"]')).toHaveCount(0)
  })
})
