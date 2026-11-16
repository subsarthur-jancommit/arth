/**
 * The three tags that must agree, and used not to.
 *
 * `generatePageMetadata` derives the canonical, `og:url` and `og:locale` from
 * one argument. Callers passed a locale-free *template* (`/work/mural`) where
 * a *localized path* (`/en/work/mural`) was needed, and all three went wrong
 * at once — but only the canonical was covered by a test, and the work page
 * happened to override it, so the suite stayed green while every page shipped
 * an `og:url` that disagreed with its own canonical and an `og:locale` that
 * said `en_US` in Indonesian.
 *
 * These tests assert the agreement, not the individual values, because
 * agreement is the property that broke.
 */

import { describe, expect, it } from 'bun:test'

import { localizedPath } from '@/lib/i18n/paths'
import { ENGLISH_PAGES } from '@/lib/i18n/public-locale-redirect'
import { routing } from '@/lib/i18n/routing'
import { BASE_URL } from '@/lib/seo/site'

import { generatePageMetadata, truncateDescription } from './metadata'

/** `openGraph` is a wide union in Next's types; narrow once, readably. */
function openGraphOf(metadata: ReturnType<typeof generatePageMetadata>) {
  const og = metadata.openGraph
  if (!og) throw new Error('no openGraph block')
  return og
}

function canonicalOf(metadata: ReturnType<typeof generatePageMetadata>) {
  const canonical = metadata.alternates?.canonical
  if (typeof canonical !== 'string') {
    throw new Error(`canonical was ${String(canonical)}, expected a string`)
  }
  return canonical
}

const PATHS = ['/', '/metode', '/work/mural-panas-sore']

describe('generatePageMetadata', () => {
  it('resolves og:url to the same page as the canonical', () => {
    for (const locale of routing.locales) {
      for (const template of PATHS) {
        const url = localizedPath(locale, template)
        const metadata = generatePageMetadata({ url })

        // The canonical is root-relative (Next resolves it against
        // metadataBase); og:url is absolute. Same page, two spellings.
        expect(openGraphOf(metadata).url).toBe(`${BASE_URL}${url}`)
        expect(canonicalOf(metadata)).toBe(url)
      }
    }
  })

  it("reports the locale in OpenGraph's spelling, not hreflang's", () => {
    // Underscore, not hyphen. `og:locale` is `language_TERRITORY`; the
    // hyphenated BCP 47 tag belongs in `<html lang>` and hreflang, and a
    // consumer reading it here silently falls back to its own default.
    // `/metode` is open in English (R7), so each twin names the other.
    expect(ENGLISH_PAGES).toContain('/metode')
    const en = openGraphOf(generatePageMetadata({ url: '/en/metode' }))
    const id = openGraphOf(generatePageMetadata({ url: '/id/metode' }))

    expect(en.locale).toBe('en_US')
    expect(id.locale).toBe('id_ID')
    expect(en.alternateLocale).toEqual(['id_ID'])
    expect(id.alternateLocale).toEqual(['en_US'])
  })

  it('names an English alternate only where English is open', () => {
    // A work page has no approved English: its Indonesian card claims none,
    // and an English preview of it names the Indonesian page it stands for.
    const id = openGraphOf(generatePageMetadata({ url: '/id/work/x' }))
    const en = openGraphOf(generatePageMetadata({ url: '/en/work/x' }))

    expect(id.alternateLocale).toEqual([])
    expect(en.alternateLocale).toEqual(['id_ID'])
  })

  it('falls back to the default locale for unlocalized routes', () => {
    // `/studio` and `/llms.txt` carry no prefix and have no language
    // alternative to declare — the fallback is correct there, and only there.
    expect(openGraphOf(generatePageMetadata({ url: '/studio' })).locale).toBe(
      'id_ID'
    )
  })

  it('declares hreflang only for approved translations on a localized path', () => {
    expect(
      generatePageMetadata({ url: '/id/metode' }).alternates?.languages
    ).toEqual({
      'id-ID': '/id/metode',
      'en-US': '/en/metode',
      'x-default': '/id/metode',
    })
    // A situation page, which R7 did not translate, names Indonesian alone.
    const situation = '/id/teknologi/siap-pakai/kuliner'
    expect(
      generatePageMetadata({ url: situation }).alternates?.languages
    ).toEqual({
      'id-ID': situation,
      'x-default': situation,
    })
  })
})

describe('truncateDescription', () => {
  it('returns empty string for absent input so callers can use ||', () => {
    expect(truncateDescription(null)).toBe('')
    expect(truncateDescription('   ')).toBe('')
  })

  it('cuts on a word boundary', () => {
    expect(truncateDescription('one two three four', 9)).toBe('one two…')
  })

  it('hard-clips a single word longer than the limit', () => {
    expect(truncateDescription('abcdefghijkl', 5)).toBe('abcde…')
  })
})
