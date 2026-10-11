/**
 * hreflang and canonical invariants.
 *
 * The rule this file protects is stated in `alternates.ts` itself: a page's
 * canonical must be the same URL `app/sitemap.ts` submits. If they disagree, a
 * search engine is asked to crawl one URL and index another, and it picks —
 * usually not the one you wanted. Bilingual routing is where that breaks most
 * easily, because every page gains a second, nearly identical URL.
 */

import { describe, expect, it } from 'bun:test'

import { LOCALE_TAGS, PUBLISHED_LOCALES } from '@/lib/i18n/routing'

import { routeAlternates } from './alternates'
import { FEED_TITLES } from './atom-feed'
import { STATIC_ROUTES } from './route-catalog'

/**
 * `Metadata['alternates']` is `AlternateURLs | null | undefined`, so every
 * access needs narrowing. Asserting once here keeps the tests readable and
 * makes a genuinely absent return fail with a clear message rather than a
 * cascade of "possibly undefined".
 */
function alternates(path: string) {
  const result = routeAlternates(path)
  if (!result) throw new Error(`routeAlternates('${path}') returned nothing`)
  return result
}

describe('routeAlternates', () => {
  it('is self-referential — canonical is the path passed in', () => {
    expect(alternates('/en').canonical).toBe('/en')
    expect(alternates('/id/cara-kerja').canonical).toBe('/id/cara-kerja')
  })

  it('matches the URL the sitemap submits, for every advertised route', () => {
    // The invariant, asserted against the real catalogue rather than a fixture:
    // whatever the sitemap emits must be exactly what that page canonicalizes
    // to.
    for (const route of STATIC_ROUTES) {
      expect(alternates(route.path).canonical).toBe(route.path)
    }
  })

  it('advertises only approved translations plus x-default', () => {
    const languages = alternates('/id/cara-kerja').languages

    for (const locale of PUBLISHED_LOCALES) {
      expect(languages?.[LOCALE_TAGS[locale]]).toBe(`/${locale}/cara-kerja`)
    }

    expect(languages?.['x-default']).toBe('/id/cara-kerja')
    expect(alternates('/en/cara-kerja').languages).toBeUndefined()
  })

  it('does not present an unapproved locale as a translation', () => {
    expect(alternates('/en').languages).toBeUndefined()
    expect(alternates('/id').languages?.['en-US']).toBeUndefined()
  })

  it('advertises no hreflang for an unlocalized route', () => {
    // /studio has no translation. Advertising one would point crawlers at a
    // URL that does not exist.
    expect(alternates('/studio').languages).toBeUndefined()
  })

  it("announces the journal's feed on the journal's pages, in their language", () => {
    expect(alternates('/en/journal').types?.['application/atom+xml']).toEqual([
      { url: '/en/journal/feed.xml', title: FEED_TITLES.en },
    ])
    expect(
      alternates('/id/journal/scope-is-the-deliverable').types?.[
        'application/atom+xml'
      ]
    ).toEqual([{ url: '/id/journal/feed.xml', title: FEED_TITLES.id }])
    expect(alternates('/en/cara-kerja').types?.['application/atom+xml']).toBe(
      undefined
    )
  })

  it('keeps the shared llms.txt alternate on every route', () => {
    // Regression guard for the exact bug alternates.ts documents: Next merges
    // metadata shallowly, so a route declaring its own `alternates` drops the
    // parent's entire object. Every route must therefore go through this
    // helper and keep the plain-text link.
    const types = alternates('/id').types
    expect(types?.['text/plain']).toEqual([
      { url: '/llms.txt', title: 'llms.txt' },
    ])
  })
})
