import { expect, test } from '@playwright/test'

/**
 * Without JavaScript, a 404 still leads somewhere.
 *
 * The 404 streams into a hole only a script can fill (`e2e/site-reach.e2e.ts`
 * records why), so a reader without JavaScript got the loading bars and
 * nothing else — measured on the live site on 2026-10-05
 * (`docs/HANDOFF.md` §4.8, A3). `components/ui/route-loading` now carries a
 * `<noscript>` with one sentence in each language and both front doors.
 */
test.describe('a 404 without JavaScript offers the front doors', () => {
  test.use({ javaScriptEnabled: false })

  for (const path of ['/en/no-such-page-here', '/id/tidak-ada']) {
    test(path, async ({ page }) => {
      await page.goto(path)

      const english = page.getByRole('link', { name: 'Arth — English' })
      const indonesian = page.getByRole('link', {
        name: 'Arth — Bahasa Indonesia',
      })
      await expect(english).toBeVisible()
      await expect(indonesian).toBeVisible()
      await expect(english).toHaveAttribute('href', '/en')
      await expect(indonesian).toHaveAttribute('href', '/id')
    })
  }
})
