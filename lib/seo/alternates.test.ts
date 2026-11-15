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

import { ENGLISH_PAGES } from '@/lib/i18n/public-locale-redirect'
import { LOCALE_TAGS } from '@/lib/i18n/routing'

import { routeAlternates } from './alternates'
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
    expect(alternates('/id/metode').canonical).toBe('/id/metode')
  })

  it('matches the URL the sitemap submits, for every advertised route', () => {
    // The invariant, asserted against the real catalogue rather than a fixture:
    // whatever the sitemap emits must be exactly what that page canonicalizes
    // to.
    for (const route of STATIC_ROUTES) {
      expect(alternates(route.path).canonical).toBe(route.path)
    }
  })

  it('advertises every language the page is served in, plus x-default', () => {
    // Open in English since R7, so both twins name both.
    expect(ENGLISH_PAGES).toContain('/metode')
    for (const path of ['/id/metode', '/en/metode']) {
      expect(alternates(path).languages).toEqual({
        [LOCALE_TAGS.id]: '/id/metode',
        [LOCALE_TAGS.en]: '/en/metode',
        'x-default': '/id/metode',
      })
    }
  })

  it('does not present an unapproved locale as a translation', () => {
    // Not opened by R7: Indonesian alone, and no hreflang on the English
    // address (which answers 307 anyway).
    expect(ENGLISH_PAGES).not.toContain('/layanan')
    expect(alternates('/id/layanan').languages).toEqual({
      [LOCALE_TAGS.id]: '/id/layanan',
      'x-default': '/id/layanan',
    })
    expect(alternates('/en/layanan').languages).toBeUndefined()
    // A work page has no approved English at all.
    expect(alternates('/id/work/x').languages?.['en-US']).toBeUndefined()
    expect(alternates('/en/work').languages).toBeUndefined()
  })

  it('advertises no hreflang for an unlocalized route', () => {
    // /studio has no translation. Advertising one would point crawlers at a
    // URL that does not exist.
    expect(alternates('/studio').languages).toBeUndefined()
  })

  it('announces no feed now that the journal is retired (F5-04)', () => {
    // `/journal/feed.xml` left with the journal, so a page that still linked
    // it would send a reader app to an address that answers 410.
    for (const path of ['/id', '/id/kontak', '/en/work']) {
      expect(alternates(path).types?.['application/atom+xml']).toBeUndefined()
    }
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
