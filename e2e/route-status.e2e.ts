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
  for (const unit of UNITS) {
    test(`/id/${unit} answers 200`, async ({ request }) => {
      const response = await request.get(`/id/${unit}`, { maxRedirects: 0 })
      expect(response.status()).toBe(200)
    })

    // Untranslated, so its English address answers with the Indonesian
    // twin rather than a page (K2, R0).
    test(`/en/${unit} answers 307 to /id/${unit}`, async ({ request }) => {
      const response = await request.get(`/en/${unit}`, { maxRedirects: 0 })
      expect(response.status()).toBe(307)
      expect(
        new URL(response.headers().location ?? '', 'http://x').pathname
      ).toBe(`/id/${unit}`)
    })
  }

  /*
   * A fixed page that left `lib/seo/awaiting-content.ts` in R5, once both
   * approved sequences were published. An empty read renders the not-found
   * view over 200 (`docs/TINJAUAN-F01-F03.md` E3.2), so the status alone
   * would pass against that; the heading and a sequence are asserted too.
   */
  test('/id/satu-klien-tiga-unit answers 200 with its sequences', async ({
    request,
  }) => {
    const response = await request.get('/id/satu-klien-tiga-unit', {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toContain('Tiga unit. Satu urutan kerja.')
    expect(html).toContain('data-epic="three-unit-splice"')
  })

  /*
   * The last fixed page to leave `lib/seo/awaiting-content.ts`, in V5, once
   * its text was published marked for legal review. The not-found view
   * would pass the status alone, so the policy section is asserted, and so
   * are the review note and the noindex the page keeps until that review.
   */
  test('/id/kebijakan answers 200 with its policy, marked for legal review', async ({
    request,
  }) => {
    const response = await request.get('/id/kebijakan', { maxRedirects: 0 })
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toContain('aria-label="Draf isi kebijakan"')
    expect(html).toContain('Masih menunggu tinjauan ahli hukum.')
    expect(html).toMatch(/<meta name="robots" content="[^"]*noindex/)
  })

  /*
   * The page Teknologi work pages refer to for payment. Its words come from
   * one published `page` document; the not-found view would pass the status
   * alone, so a section heading and the contact action's origin are asserted.
   */
  test('/id/cara-kami-dibayar answers 200 with its payment ways', async ({
    request,
  }) => {
    const response = await request.get('/id/cara-kami-dibayar', {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toContain('Kemitraan bagi hasil')
    expect(html).toContain('dari=cara-kami-dibayar')
  })

  test('/id/halaman/cara-kami-dibayar answers 308 to its own route', async ({
    request,
  }) => {
    const response = await request.get('/id/halaman/cara-kami-dibayar', {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(308)
    expect(
      new URL(response.headers().location ?? '', 'http://x').pathname
    ).toBe('/id/cara-kami-dibayar')
  })

  test('a Teknologi work page links to Cara kami dibayar', async ({
    request,
  }) => {
    const html = await (
      await request.get(
        '/id/teknologi/siap-pakai/kuliner/bot-pesan-antar-whatsapp'
      )
    ).text()
    // Next's Link writes `href` after the other props, so attribute order is
    // not fixed: find the tag that carries the marker, then check its target.
    const link = html.match(/<a\b[^>]*\bdata-payment-link\b[^>]*>/)?.[0]
    expect(link).toContain('href="/id/cara-kami-dibayar"')
  })

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
