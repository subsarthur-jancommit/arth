import { expect, test } from '@playwright/test'

import { FEATURED_WORK } from './fixtures'

/**
 * A case says what the work is, to a machine (`lib/seo/schemas.ts`,
 * `creativeWorkSchema`): a `CreativeWork` in the page's language, at the
 * page's own canonical address, made by the studio's `Organization` node.
 * Read from the served HTML, as a crawler reads it.
 */
interface Node {
  '@type'?: string
  '@id'?: string
  name?: string
  url?: string
  inLanguage?: string
  creator?: { '@id'?: string }
}

for (const [locale, tag] of [
  ['en', 'en-US'],
  ['id', 'id-ID'],
] as const) {
  test(`/${locale}/work/${FEATURED_WORK} states the work as CreativeWork`, async ({
    request,
  }) => {
    const html = await (
      await request.get(`/${locale}/work/${FEATURED_WORK}`)
    ).text()

    const nodes: Node[] = [
      ...html.matchAll(
        /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
      ),
    ].map((match) => JSON.parse(match[1] ?? '{}'))

    const work = nodes.find((node) => node['@type'] === 'CreativeWork')
    const studio = nodes.find((node) => node['@type'] === 'Organization')
    expect(work, 'the case page states no CreativeWork').toBeDefined()
    expect(studio, 'no Organization to be made by').toBeDefined()

    expect(work?.name?.trim().length ?? 0).toBeGreaterThan(0)
    expect(work?.inLanguage).toBe(tag)
    expect(work?.creator?.['@id']).toBe(studio?.['@id'])

    // The work's address is the page's own canonical, not a second opinion.
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
    expect(canonical, 'no canonical to compare with').toBeTruthy()
    expect(work?.url).toBe(canonical)
  })
}
