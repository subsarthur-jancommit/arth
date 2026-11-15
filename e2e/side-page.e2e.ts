import { expect, test } from '@playwright/test'

import { SIDES, sideTemplate, UNITS } from '../lib/content/units'
import { localizedPath } from '../lib/i18n/paths'
import { localesForTemplate } from '../lib/i18n/public-locale-redirect'
import { routing } from '../lib/i18n/routing'

/**
 * The six side pages orient the reader with a buying path (the network side
 * with its money flow) and an ordinary link to the other side. The generic
 * route sweep supplies console and axe coverage; this spec protects that
 * unit-side relationship.
 *
 * The chapter table is not required here: it renders only once a chapter
 * has published offers (owner decision P4, R0), and none has yet. Its
 * behaviour is covered against fixtures in F3-12, once F2-09 exists.
 * English is visited where R7 has opened it (`localesForTemplate`); a side
 * it has not opened answers 307 to `/id` (K2, R0).
 */
test.describe('side pages', () => {
  for (const locale of routing.locales) {
    for (const unit of UNITS) {
      for (const side of SIDES[unit]) {
        const template = sideTemplate(unit, side)
        if (!localesForTemplate(template).includes(locale)) continue
        const path = localizedPath(locale, template)

        test(`${path} presents its reader path`, async ({ page }) => {
          const response = await page.goto(path)
          expect(response?.status(), 'the side page must exist').toBe(200)

          const h1 = page.locator('main h1')
          await expect(h1, 'the page has no h1').toHaveCount(1)
          expect(
            (await h1.textContent())?.trim().length ?? 0,
            'the h1 is empty'
          ).toBeGreaterThan(0)

          // The network side has its own template (F3-06): the money flow
          // takes the buying path's place.
          const pathEpic =
            side === 'jaringan' ? 'network-money-flow' : 'side-buying-path'
          await expect(
            page.locator(`[data-epic="${pathEpic}"]`),
            'the buying path is missing'
          ).toHaveCount(1)

          const canonical = await page
            .locator('link[rel="canonical"]')
            .getAttribute('href')
          expect(canonical, `${path} declares no canonical`).toBeTruthy()
          expect(
            new URL(canonical ?? '', 'https://example.test').pathname
          ).toBe(path)
        })
      }
    }
  }
})

test.describe('the side switcher works without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('moves between both sides of every unit with an ordinary link', async ({
    page,
  }) => {
    for (const unit of UNITS) {
      const [firstSide, secondSide] = SIDES[unit]
      const firstPath = localizedPath('id', sideTemplate(unit, firstSide))
      const secondPath = localizedPath('id', sideTemplate(unit, secondSide))

      await page.goto(firstPath)
      // The switcher itself; the page also links the other side at its
      // foot, which is a second, separate route out.
      const switcher = page.locator(
        `[data-epic="side-sheet-swap"] a[href="${secondPath}"]`
      )
      await expect(
        switcher,
        `${firstPath} has no ordinary link to ${secondPath}`
      ).toHaveCount(1)

      await switcher.click()
      await expect(page).toHaveURL(new RegExp(`${secondPath}$`))
    }
  })
})
