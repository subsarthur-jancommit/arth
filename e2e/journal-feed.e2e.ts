import { expect, test } from '@playwright/test'

/**
 * The journal can be followed — an Atom feed per language, announced in the
 * page head and offered as a link at the end of the index
 * (`app/[locale]/journal/feed.xml/route.ts`).
 */
test.describe('the journal feed', () => {
  for (const [locale, tag, label] of [
    ['en', 'en-US', 'Follow the journal (Atom feed)'],
    ['id', 'id-ID', 'Ikuti jurnal (umpan Atom)'],
  ] as const) {
    test(`/${locale}/journal/feed.xml is Atom, and every entry opens`, async ({
      request,
    }) => {
      const response = await request.get(`/${locale}/journal/feed.xml`)
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain(
        'application/atom+xml'
      )

      const xml = await response.text()
      expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom"')
      expect(xml).toContain(`xml:lang="${tag}"`)

      const ids = [...xml.matchAll(/<entry>\s*<id>([^<]+)<\/id>/g)].map(
        (match) => match[1] ?? ''
      )
      expect(ids.length, 'the feed lists no entries').toBeGreaterThan(0)

      for (const id of ids) {
        const path = new URL(id).pathname
        expect(path.startsWith(`/${locale}/journal/`)).toBe(true)
        expect(
          (await request.get(path)).status(),
          `${path} does not open`
        ).toBe(200)
      }
    })

    test(`/${locale}/journal announces its feed and links to it`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/journal`)

      const announced = page.locator(
        'link[rel="alternate"][type="application/atom+xml"]'
      )
      await expect(announced).toHaveCount(1)
      expect(await announced.getAttribute('href')).toContain(
        `/${locale}/journal/feed.xml`
      )

      await expect(page.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        `/${locale}/journal/feed.xml`
      )
    })
  }
})
