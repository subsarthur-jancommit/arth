import { expect, test } from '@playwright/test'

import { SIDES, UNITS } from '../lib/content/units'
import { routing } from '../lib/i18n/routing'

/**
 * Each unit has a page, exactly one URL, and exposes its two reader sides.
 *
 * ## What this file replaces
 *
 * `e2e/practice-page.e2e.ts`, which measured three things about
 * `/practice/<value>`: that each page existed and named itself, that it
 * filtered the catalogue to its own work, and that the old filtered-catalogue
 * URL redirected to it so one subject had one URL.
 *
 * Two of those three survive. The filter assertion does not, and its absence
 * is deliberate rather than overlooked: a unit page is not a listing. The
 * catalogue's own filter is still measured, at `/work?unit=<value>`, by
 * `e2e/catalogue-layout.e2e.ts` and `e2e/response-headers.e2e.ts`. The
 * redirect assertion is replaced by the status gate below — the old URL does
 * not redirect any more, it is `410 Gone`, and `e2e/route-status.e2e.ts`
 * proves that.
 *
 * ## Why canonicality is asserted, not assumed
 *
 * A page can exist, render and still be the second address for its subject.
 * One subject with two URLs splits what an answer engine reads and makes a
 * reader choose between them for no reason, so the canonical link is read
 * back from the served HTML rather than inferred from the route shape.
 */

test.describe('unit pages', () => {
  for (const locale of routing.locales) {
    for (const unit of UNITS) {
      test(`/${locale}/${unit} is a page about the unit`, async ({ page }) => {
        const response = await page.goto(`/${locale}/${unit}`)
        expect(response?.status(), 'the unit page must exist').toBe(200)

        // The unit names itself, at the top of the outline.
        const h1 = page.locator('main h1')
        await expect(h1, 'the page has no h1').toHaveCount(1)
        expect(
          (await h1.textContent())?.trim().length ?? 0,
          'the h1 is empty'
        ).toBeGreaterThan(0)

        // The approved statement and both routes into the unit stay present.
        await expect(
          page.locator('[data-unit-statement]'),
          'the unit statement is missing'
        ).toHaveCount(1)
        for (const side of SIDES[unit]) {
          await expect(
            page.locator(`main a[href="/${locale}/${unit}/${side}"]`),
            `the page does not link to its ${side} side`
          ).not.toHaveCount(0)
        }
      })
    }
  }

  for (const unit of UNITS) {
    test(`/en/${unit} is the one canonical URL for ${unit}`, async ({
      page,
      request,
    }) => {
      const html = await (await request.get(`/en/${unit}`)).text()
      const canonical = html.match(
        /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/
      )?.[1]

      expect(canonical, `/en/${unit} declares no canonical`).toBeTruthy()
      expect(
        new URL(canonical ?? '', 'https://example.test').pathname,
        'the unit page points its canonical somewhere else'
      ).toBe(`/en/${unit}`)

      await page.goto(`/en/${unit}`)
      expect(
        new URL(page.url()).pathname,
        'the unit page redirected away from its own address'
      ).toBe(`/en/${unit}`)
    })
  }

  /*
   * The scaffold must not be a dead end.
   *
   * Written as a gate because it is the one navigational promise this page
   * makes before F3-02 gives it content, and because `e2e/journey.e2e.ts`
   * depends on it: its second hop is unit → unit, and without these links
   * there is no same-component navigation on the site to measure.
   */
  test('a unit page links onward through the three-unit circuit', async ({
    page,
  }) => {
    const [first] = UNITS
    await page.goto(`/en/${first}`)

    const next = UNITS[1]
    await expect(
      page.locator(`main a[href="/en/${next}"]`),
      `/en/${first} does not link onward to /en/${next}`
    ).not.toHaveCount(0)

    await expect(
      page.locator(`main a[href="/en/${first}"]`),
      'a unit page links to itself'
    ).toHaveCount(0)
  })
})
