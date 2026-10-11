import { expect, test } from '@playwright/test'

/**
 * The sitemap names each page's translations, and claims no date it cannot
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

  const workMethod = urlBlock(xml, '/en/cara-kerja')
  for (const [tag, path] of [
    ['en-US', '/en/cara-kerja'],
    ['id-ID', '/id/cara-kerja'],
    ['x-default', '/en/cara-kerja'],
  ] as const) {
    expect(workMethod).toMatch(
      new RegExp(`hreflang="${tag}" href="[^"]*${path}"`)
    )
  }
  // A page that lists nothing has no date to claim.
  expect(workMethod).not.toContain('<lastmod>')

  // The journal index is as new as its newest entry, not as new as the build.
  const journal = urlBlock(xml, '/en/journal')
  const entryDates = [
    ...xml.matchAll(
      /<loc>[^<]*\/en\/journal\/[^<]+<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>/g
    ),
  ].map((match) => Date.parse(match[1] ?? ''))
  expect(entryDates.length).toBeGreaterThan(0)
  const indexDate = Date.parse(
    journal.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? ''
  )
  expect(indexDate).toBe(Math.max(...entryDates))
})
