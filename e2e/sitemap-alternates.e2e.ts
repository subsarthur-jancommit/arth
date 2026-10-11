import { expect, test } from '@playwright/test'

/**
 * The sitemap names only approved translations, and claims no date it cannot
 * back (`app/sitemap.ts`; `docs/HANDOFF.md` §4.8, L6).
 */
function urlBlock(xml: string, path: string): string {
  const block = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((match) => match[1] ?? '')
    .find((body) => new RegExp(`<loc>[^<]*${path}</loc>`).test(body))
  if (!block) throw new Error(`no <url> for ${path}`)
  return block
}

test('the sitemap carries hreflang and honest dates', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  const xml = await response.text()

  expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')

  const workMethod = urlBlock(xml, '/id/cara-kerja')
  for (const [tag, path] of [
    ['id-ID', '/id/cara-kerja'],
    ['x-default', '/id/cara-kerja'],
  ] as const) {
    expect(workMethod).toMatch(
      new RegExp(`hreflang="${tag}" href="[^"]*${path}"`)
    )
  }
  expect(xml).not.toContain('/en/')
  // A page that lists nothing has no date to claim.
  expect(workMethod).not.toContain('<lastmod>')

  // F1-06 keeps the catalogue and journal index out of machine listings,
  // while individual published journal entries remain advertised.
  expect(xml).not.toMatch(/<loc>[^<]*\/id\/(?:work|journal)<\/loc>/)
  const entryDates = [
    ...xml.matchAll(
      /<loc>[^<]*\/id\/journal\/[^<]+<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>/g
    ),
  ].map((match) => Date.parse(match[1] ?? ''))
  expect(entryDates.length).toBeGreaterThan(0)
})
