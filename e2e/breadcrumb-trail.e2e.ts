import { expect, type Page, test } from '@playwright/test'

/**
 * A breadcrumb trail sits below the fixed header, not under it.
 *
 * It rendered under it — y=31 behind a 58px header on a phone, y=47 behind
 * 72px on a desktop — so the trail was invisible and keyboard focus landed on
 * links the header covered entirely (WCAG 2.2 SC 2.4.11). Measured on the live
 * site on 2026-10-05 (`docs/HANDOFF.md` §4.8, A1).
 *
 * ## Why it reads the journal rather than the practice pages
 *
 * This was `e2e/practice-trail.e2e.ts` and swept `/practice/<value>`, which
 * is retired. The defect was never about that route: the overlap came from
 * the fixed header and `components/ui/breadcrumbs`, which two routes still
 * render — the journal entry and the project page. A journal entry is the
 * better subject of the two, because `lib/content/journal-fallback.ts`
 * guarantees one exists at a known slug in both languages whether or not the
 * CMS has anything, so the gate cannot pass by skipping.
 */

/**
 * The scaffolding entry every build has, in both languages.
 *
 * Taken from `lib/content/journal-fallback.ts` by slug rather than imported:
 * the claim is about a URL a reader can open, and the fallback's slugs are
 * the same in both locales by construction, which
 * `lib/content/journal-fallback.test.ts` asserts.
 */
const ENTRY = 'scope-is-the-deliverable'
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
  test(`desktop, /en/journal/${ENTRY}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await trailClearsHeader(page, `/en/journal/${ENTRY}`, 'Breadcrumb')
  })

  test(`desktop, /id/journal/${ENTRY}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await trailClearsHeader(page, `/id/journal/${ENTRY}`, 'Remah roti')
  })

  test.describe('on a phone', () => {
    test.use({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })

    test(`/en/journal/${ENTRY}`, async ({ page }) => {
      await trailClearsHeader(page, `/en/journal/${ENTRY}`, 'Breadcrumb')
    })

    test(`/id/journal/${ENTRY}`, async ({ page }) => {
      await trailClearsHeader(page, `/id/journal/${ENTRY}`, 'Remah roti')
    })
  })
})
