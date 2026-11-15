import { expect, test } from '@playwright/test'

import { localizedPath } from '../lib/i18n/paths'
import { ENGLISH_PAGES, R7_PAGES } from '../lib/i18n/public-locale-redirect'
import { FEATURED_WORK } from './fixtures'

/**
 * English is offered as a language choice only where R7 has opened it
 * (`ENGLISH_PAGES` in `lib/i18n/public-locale-redirect.ts`). An open page
 * offers both twins from either side, which `e2e/english-pages.e2e.ts`
 * asserts page by page. Every other Indonesian page offers no switch at all,
 * because its English address answers 307 back to it; the section-matching
 * logic is covered by `section.test.ts`.
 */
const CLOSED = [
  ...R7_PAGES.filter((template) => !ENGLISH_PAGES.includes(template)).map(
    (template) => localizedPath('id', template)
  ),
  `/id/work/${FEATURED_WORK}`,
]

test.describe('English is offered only where it is open', () => {
  for (const path of CLOSED) {
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
    // An English page keeps one exit to the approved language
    // (`components/ui/language-switcher/locales.ts`), and no English choice.
    const sheet = page.locator('[data-epic="locale-sheet"]')
    await expect(sheet.locator('a')).toHaveCount(1)
    await expect(sheet.locator('a[hreflang^="en"]')).toHaveCount(0)
  })
})
