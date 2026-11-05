import { expect, type Page, test } from '@playwright/test'

import { FEATURED_WORK } from './fixtures'

/**
 * A breadcrumb trail sits below the fixed header, not under it.
 *
 * It rendered under it — y=31 behind a 58px header on a phone, y=47 behind
 * 72px on a desktop — so the trail was invisible and keyboard focus landed on
 * links the header covered entirely (WCAG 2.2 SC 2.4.11). Measured on the live
 * site on 2026-10-05 (`docs/HANDOFF.md` §4.8, A1).
 *
 * ## Why it reads a project page
 *
 * This was `e2e/practice-trail.e2e.ts` and swept `/practice/<value>`, which
 * is retired; then the journal entry, which F5-04 retired too. The defect was
 * never about either route: the overlap came from the fixed header and
 * `components/ui/breadcrumbs`, which the project page still renders.
 * Measured on production on 2026-11-01: y=120 under a header ending at 72 on
 * a desktop, y=91 under 58 on a phone.
 */

const CASE = `work/${FEATURED_WORK}`
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

test.describe('a breadcrumb trail clears the header', () => {
  test(`desktop, /en/${CASE}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await trailClearsHeader(page, `/en/${CASE}`, 'Breadcrumb')
  })

  test(`desktop, /id/${CASE}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await trailClearsHeader(page, `/id/${CASE}`, 'Remah roti')
  })

  test.describe('on a phone', () => {
    test.use({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })

    test(`/en/${CASE}`, async ({ page }) => {
      await trailClearsHeader(page, `/en/${CASE}`, 'Breadcrumb')
    })

    test(`/id/${CASE}`, async ({ page }) => {
      await trailClearsHeader(page, `/id/${CASE}`, 'Remah roti')
    })
  })
})
