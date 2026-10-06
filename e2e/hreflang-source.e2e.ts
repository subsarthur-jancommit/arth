import { expect, test } from '@playwright/test'

/**
 * One set of hreflang per page, and it is the page's.
 *
 * next-intl's proxy used to send a `Link` header of its own beside the head's
 * alternates, and the two disagreed — `en`/`id` against `en-US`/`id-ID`, and an
 * `x-default` on the bare root (which only redirects) against `/en`. Measured
 * on the live site on 2026-10-05 (`docs/HANDOFF.md` §4.8, L5); `alternateLinks:
 * false` in `lib/i18n/routing.ts` removed the header. This holds both halves:
 * the header stays gone, and the head still carries the alternates.
 */
test.describe('hreflang comes from the page alone', () => {
  for (const path of ['/en', '/id', '/en/studio', '/id/journal']) {
    test(`${path} sends no hreflang Link header, and the head has them`, async ({
      request,
    }) => {
      const response = await request.get(path)
      expect(response.status()).toBe(200)

      const link = response.headers().link ?? ''
      expect(link, 'a Link header still carries hreflang').not.toContain(
        'hreflang'
      )

      const html = await response.text()
      expect(html).toContain('hrefLang="en-US"')
      expect(html).toContain('hrefLang="id-ID"')
      expect(html).toContain('hrefLang="x-default"')
    })
  }
})
