import { expect, test } from '@playwright/test'

import { localizedPath } from '../lib/i18n/paths'
import { ENGLISH_PAGES } from '../lib/i18n/public-locale-redirect'
import { FEATURED_WORK } from './fixtures'

/**
 * The sitemap names only approved translations, and claims no date it cannot
 * back (`app/sitemap.ts`; `docs/HANDOFF.md` §4.8, L6). English is approved
 * page by page: a page R7 has opened is listed in both languages, each entry
 * naming both twins, and every other page in Indonesian alone.
 */
function urlBlock(xml: string, path: string): string {
  const block = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((match) => match[1] ?? '')
    .find((body) => new RegExp(`<loc>[^<]*${path}</loc>`).test(body))
  if (!block) throw new Error(`no <url> for ${path}`)
  return block
}

function hreflangOf(block: string, tag: string): string | undefined {
  return new RegExp(`hreflang="${tag}" href="[^"]*?(/(?:en|id)[^"]*)"`).exec(
    block
  )?.[1]
}

test('the sitemap carries hreflang and honest dates', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  const xml = await response.text()

  expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')

  // Opened in English by R7: both twins listed, each naming both.
  for (const template of ['/kontak', '/metode', '/layanan', '/pembayaran']) {
    const indonesian = localizedPath('id', template)
    const english = localizedPath('en', template)
    for (const path of [indonesian, english]) {
      const block = urlBlock(xml, path)
      expect(hreflangOf(block, 'id-ID'), path).toBe(indonesian)
      expect(hreflangOf(block, 'en-US'), path).toBe(english)
      expect(hreflangOf(block, 'x-default'), path).toBe(indonesian)
    }
  }

  // Not opened: Indonesian alone, and no English entry. R7 opened all
  // fourteen of its pages; a work page, which it did not cover, stays closed.
  for (const template of [`/work/${FEATURED_WORK}`]) {
    const indonesian = localizedPath('id', template)
    const block = urlBlock(xml, indonesian)
    expect(hreflangOf(block, 'id-ID'), indonesian).toBe(indonesian)
    expect(hreflangOf(block, 'x-default'), indonesian).toBe(indonesian)
    expect(block).not.toContain('hreflang="en-US"')
    expect(xml).not.toContain(`/en${template}</loc>`)
  }

  // Every English entry is an open page, and every open page is listed.
  const english = [...xml.matchAll(/<loc>[^<]*?(\/en(?:\/[^<]*)?)<\/loc>/g)]
    .map((match) => match[1] ?? '')
    .sort()
  expect(english).toEqual(
    ENGLISH_PAGES.map((template) => localizedPath('en', template)).sort()
  )

  // A page that lists nothing has no date to claim.
  expect(urlBlock(xml, '/id/kontak')).not.toContain('<lastmod>')

  // F1-06 keeps the catalogue index out of machine listings. The journal's
  // entries were advertised until F5-04 retired `/journal`; every address
  // under it answers 410 now, so none is listed.
  expect(xml).not.toMatch(/<loc>[^<]*\/id\/work<\/loc>/)
  expect(xml).not.toMatch(/<loc>[^<]*\/(?:en|id)\/journal(?:\/[^<]*)?<\/loc>/)
})
