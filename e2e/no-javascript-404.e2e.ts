import { expect, test } from '@playwright/test'

import { BRAND_NAME } from '../lib/brand'

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

  /*
   * Two segments each, deliberately.
   *
   * These were `/en/no-such-page-here` and `/id/tidak-ada`, one segment. A
   * single segment is now answered by `proxy.ts` with a real 404 and a
   * complete static document — the streaming hole this test exists for does
   * not apply to it, and `e2e/route-status.e2e.ts` asserts that answer
   * instead. Below one segment the in-chrome 404 is still streamed, so this
   * keeps measuring the defect it was written for rather than passing for a
   * new reason.
   */
  for (const path of ['/en/no-such/page-here', '/id/tidak/ada']) {
    test(path, async ({ page }) => {
      await page.goto(path)

      const english = page.getByRole('link', {
        name: `${BRAND_NAME} — English`,
      })
      const indonesian = page.getByRole('link', {
        name: `${BRAND_NAME} — Bahasa Indonesia`,
      })
      await expect(english).toBeVisible()
      await expect(indonesian).toBeVisible()
      await expect(english).toHaveAttribute('href', '/en')
      await expect(indonesian).toHaveAttribute('href', '/id')
    })
  }
})
