import { expect, type Page, test } from '@playwright/test'

import { PRACTICES } from '../lib/content/practices'

/**
 * A practice page's breadcrumb trail sits below the fixed header.
 *
 * It rendered under it — y=31 behind a 58px header on a phone, y=47 behind
 * 72px on a desktop — so the trail was invisible and keyboard focus landed on
 * links the header covered entirely (WCAG 2.2 SC 2.4.11). Measured on the live
 * site on 2026-10-05 (`docs/HANDOFF.md` §4.8, A1).
 */
async function trailClearsHeader(page: Page, path: string, label: string) {
  await page.goto(path)
  const trail = page.getByRole('navigation', { name: label })
  await expect(trail).toBeVisible()

  const header = await page.locator('header').first().boundingBox()
  const box = await trail.boundingBox()
  expect(header, 'no header box').not.toBeNull()
  expect(box, 'no trail box').not.toBeNull()
  if (!header || !box) return

  expect(
    box.y,
    `${path}: the trail starts at ${box.y}, under a header ending at ${header.y + header.height}`
  ).toBeGreaterThanOrEqual(header.y + header.height)
}

test.describe('the practice trail clears the header', () => {
  for (const practice of PRACTICES) {
    test(`desktop, /en/practice/${practice}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await trailClearsHeader(page, `/en/practice/${practice}`, 'Breadcrumb')
    })
  }

  test.describe('on a phone', () => {
    test.use({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })

    test('/en/practice/consulting', async ({ page }) => {
      await trailClearsHeader(page, '/en/practice/consulting', 'Breadcrumb')
    })

    test('/id/practice/ai-data', async ({ page }) => {
      await trailClearsHeader(page, '/id/practice/ai-data', 'Remah roti')
    })
  })
})
