import { expect, test } from '@playwright/test'

/**
 * `/favicon.ico` answers with the icon, not with a page.
 *
 * The site has `app/icon.png` and no `.ico`; the conventional path used to
 * fall through to the `[locale]` segment and return the home page as HTML,
 * with a 200 (`docs/HANDOFF.md` §4.8, L4). `next.config.ts` now redirects it.
 */
test('the conventional favicon path leads to the icon', async ({ request }) => {
  const redirect = await request.get('/favicon.ico', { maxRedirects: 0 })
  expect(redirect.status()).toBe(308)
  expect(redirect.headers().location).toBe('/icon.png')

  const icon = await request.get('/favicon.ico')
  expect(icon.status()).toBe(200)
  expect(icon.headers()['content-type']).toContain('image/png')
})
