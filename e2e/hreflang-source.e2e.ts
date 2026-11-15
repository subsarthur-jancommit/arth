import { expect, test } from '@playwright/test'

import { SITUATION_ROUTES } from './fixtures'

/** A situation page: R7 did not translate it, so it has no English. */
const [SITUATION] = SITUATION_ROUTES

/**
 * One set of hreflang per page, and it is the page's.
 *
 * next-intl's proxy used to send a `Link` header of its own beside the head's
 * alternates, and the two disagreed — `en`/`id` against `en-US`/`id-ID`, and an
 * `x-default` on the bare root (which only redirects) against `/en`. Measured
 * on the live site on 2026-10-05 (`docs/HANDOFF.md` §4.8, L5); `alternateLinks:
 * false` in `lib/i18n/routing.ts` removed the header. The head names English
 * only on a page R7 has opened (`localesForTemplate`); every page names
 * Indonesian and the Indonesian default.
 */
test.describe('hreflang comes from the page alone', () => {
  for (const [path, english] of [
    ['/id', true],
    ['/id/kontak', true],
    ['/id/layanan', true],
    [SITUATION, false],
  ] as const) {
    test(`${path} advertises only its own languages in the head`, async ({
      request,
    }) => {
      const response = await request.get(path)
      expect(response.status()).toBe(200)

      const link = response.headers().link ?? ''
      expect(link, 'a Link header still carries hreflang').not.toContain(
        'hreflang'
      )

      const html = await response.text()
      expect(html).toContain('hrefLang="id-ID"')
      expect(html).toContain('hrefLang="x-default"')
      if (english) expect(html).toContain('hrefLang="en-US"')
      else expect(html).not.toContain('hrefLang="en-US"')
    })
  }

  // A page R7 did not open has no public English address at all: it
  // answers 307 to its Indonesian twin (K2, R0), so there is no English
  // document to carry an hreflang. Draft mode keeps the preview reachable.
  test('an untranslated English page answers with its Indonesian twin', async ({
    request,
  }) => {
    const response = await request.get(SITUATION.replace(/^\/id/, '/en'), {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(307)
    expect(
      new URL(response.headers().location ?? '', 'http://x').pathname
    ).toBe(SITUATION)
  })
})
