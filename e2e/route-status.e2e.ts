import { expect, test } from '@playwright/test'

import { UNITS } from '../lib/content/units'
import { routing } from '../lib/i18n/routing'

/**
 * The statuses, read off the wire.
 *
 * ## Why this can only be measured here
 *
 * Under Cache Components a prerendered `notFound()` answers **200**, which
 * `e2e/not-found.e2e.ts` documents at length. So every unknown URL on this
 * site was a soft 404: a page saying "not found" over a status saying "here it
 * is". A crawler believes the status, and a one-segment URL is exactly the
 * depth a crawler is handed in a sitemap.
 *
 * `proxy.ts` runs before route matching, so it is the one layer where a real
 * status is available — and the only way to prove a real status is to ask the
 * server for one. `lib/seo/route-status.test.ts` covers the decisions; this
 * covers the responses.
 *
 * ## Why the body is asserted too
 *
 * A correct status with a bare `Not found.` body passes a status check and
 * still hands a reader a dead end. The package's own criterion is "status
 * asli **dan halaman bermerek, bukan teks polos**", so both halves are
 * measured: the status, and that the page carries the wordmark and a way out.
 */

const GONE_PATHS = [
  '/en/practice',
  '/id/praktik',
  '/en/practice/consulting',
  '/id/practice/ai-data',
  '/en/work/practice/commission',
] as const

test.describe('a retired address answers 410, not 404 and not a redirect', () => {
  for (const path of GONE_PATHS) {
    test(`${path} is gone`, async ({ request }) => {
      // `maxRedirects: 0` is the point: a 308 to the home page would have
      // satisfied a naive "does it resolve" check while telling a crawler the
      // subject moved, which it did not.
      const response = await request.get(path, { maxRedirects: 0 })

      expect(response.status(), `${path} did not answer 410`).toBe(410)

      const html = await response.text()
      expect(html, `${path} answered with plain text`).toContain('<!doctype')
      expect(html, `${path} carries no wordmark`).toContain('Arthur')
      expect(html, `${path} offers no way out`).toContain('href="/')
      expect(html, `${path} is missing its meta robots`).toContain(
        'content="noindex, nofollow"'
      )
    })
  }
})

test.describe('an address nothing answers at returns a real 404', () => {
  for (const locale of routing.locales) {
    test(`/${locale}/no-such-page-here is a real 404`, async ({ request }) => {
      const response = await request.get(`/${locale}/no-such-page-here`, {
        maxRedirects: 0,
      })

      expect(response.status()).toBe(404)

      const html = await response.text()
      expect(html).toContain('<!doctype')
      expect(html, 'the document speaks the locale it was asked in').toContain(
        `<html lang="${locale}"`
      )
      // The three units, which is where a lost reader is sent.
      for (const unit of UNITS) {
        expect(html, `the 404 does not offer ${unit}`).toContain(
          `href="/${locale}/${unit}"`
        )
      }
    })
  }
})

test.describe('the pages that do answer are untouched by all of it', () => {
  for (const locale of routing.locales) {
    for (const unit of UNITS) {
      test(`/${locale}/${unit} answers 200`, async ({ request }) => {
        const response = await request.get(`/${locale}/${unit}`, {
          maxRedirects: 0,
        })
        expect(response.status()).toBe(200)
      })
    }
  }

  /*
   * The machine files, which the proxy's matcher deliberately excludes.
   *
   * Listed because the gone-and-missing logic sits *after* that matcher, and
   * a change that widened the matcher to reach them would be exactly the kind
   * of change that looks harmless — `proxy.test.ts` asserts the exclusions,
   * and this asserts the consequence.
   */
  for (const path of ['/robots.txt', '/sitemap.xml', '/llms.txt']) {
    test(`${path} answers 200`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status()).toBe(200)
    })
  }
})
