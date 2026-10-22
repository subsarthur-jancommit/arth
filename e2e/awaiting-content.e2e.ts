import { expect, test } from '@playwright/test'

import { AWAITING_CONTENT } from '../lib/seo/awaiting-content'

/**
 * R0 of the F3 revision (`docs/RENCANA-REVISI-F3.md`), owner decision P4:
 * a page without published content answers a real 404 and is linked from
 * nowhere, and Arthur's untranslated English pages answer 307 to `/id` (K2).
 *
 * Before R0, `/id/cara-kerja` — a primary navigation item — rendered the
 * not-found view over HTTP 200 (`docs/TINJAUAN-F01-F03.md` E3.1).
 */
test.describe('a page awaiting content is not a page yet', () => {
  for (const template of AWAITING_CONTENT) {
    const path = `/id${template}`

    test(`${path} answers a real 404`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status()).toBe(404)
      expect(await response.text()).toContain('Tidak ditemukan')
    })
  }

  test('nothing links to a page awaiting content', async ({ page }) => {
    for (const path of ['/id', '/id/konstruksi', '/id/kontak']) {
      await page.goto(path)
      const hrefs = await page
        .locator('a[href]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')))

      // Anti-vacuum: the page must have links for their absence to mean much.
      expect(hrefs.length, `${path} has no links`).toBeGreaterThan(5)
      for (const template of AWAITING_CONTENT) {
        expect(hrefs, `${path} links to ${template}`).not.toContain(
          `/id${template}`
        )
      }
    }
  })

  test('the sitemap does not advertise a page awaiting content', async ({
    request,
  }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    expect(xml).toContain('/id/kontak')
    for (const template of AWAITING_CONTENT) {
      expect(xml).not.toContain(`/id${template}<`)
    }
  })
})

test.describe('English is offered only where it is written', () => {
  for (const [from, to] of [
    ['/en/konstruksi', '/id/konstruksi'],
    ['/en/konstruksi/pelaku-proyek', '/id/konstruksi/pelaku-proyek'],
    ['/en/peekabo/jaringan', '/id/peekabo/jaringan'],
    ['/en/kontak', '/id/kontak'],
    ['/en/satu-klien-tiga-unit', '/id/satu-klien-tiga-unit'],
  ] as const) {
    test(`${from} answers 307 to ${to}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 })
      expect(response.status()).toBe(307)
      expect(
        new URL(response.headers().location ?? '', 'http://x').pathname
      ).toBe(to)
    })
  }

  test('the English journal and catalogue stay English', async ({
    request,
  }) => {
    for (const path of ['/en/work', '/en/journal']) {
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status(), path).toBe(200)
    }
  })
})

test.describe('the phone menu keeps its display size', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('every route word is at least 40px on a 390px phone', async ({
    page,
  }) => {
    /*
     * Fitted to the longest whole label, "Cara kami bekerja" shrank every word
     * to 28px (`docs/TINJAUAN-F01-F03.md` E8.1). Fitted to the longest word,
     * the sheet measured 48px at 390 × 844 on 2026-10-15.
     */
    await page.goto('/id')
    await page.getByRole('button', { name: /menu/i }).click()
    const sizes = await page
      .locator('#header-nav a')
      .evaluateAll((links) =>
        links
          .filter((link) => (link as HTMLElement).offsetParent !== null)
          .map((link) => Number.parseFloat(getComputedStyle(link).fontSize))
      )

    expect(sizes.length).toBeGreaterThan(2)
    for (const size of sizes) expect(size).toBeGreaterThanOrEqual(40)
  })
})
