/**
 * The 404/410 layer, and the one way it can go quietly wrong.
 *
 * `proxy.ts` answers an unknown single segment with a real `404` before
 * anything renders, which it can only do by consulting a list of the segments
 * that *are* real (`LIVE_SEGMENTS`). A list of routes maintained by hand goes
 * stale the first time a route is added — and the failure is the bad kind: the
 * new page is built, prerendered and in the sitemap, and the proxy 404s it
 * before the router ever sees it. Nothing errors.
 *
 * So the list is checked against the filesystem, which is the same instrument
 * `e2e/route-sweep.e2e.ts` uses on the sitemap. A new static directory under
 * `app/[locale]/` fails here until it is listed.
 */

import { describe, expect, it } from 'bun:test'
import { readdirSync } from 'node:fs'

import { UNITS } from '@/lib/content/units'
import { REAL_SEGMENTS } from '@/lib/i18n/guessed-paths'

import {
  brandedStatusDocument,
  GONE_PREFIXES,
  GONE_STATUS,
  isGonePath,
  isUnknownSingleSegment,
  LIVE_SEGMENTS,
  NOT_FOUND_STATUS,
} from './route-status'

/**
 * The static single segments the router really answers under a locale.
 *
 * Read from disk rather than imported: the claim is about what is on the
 * filesystem, and route files are not importable from a unit test. Dynamic
 * directories (`[unit]`, `[...slug]`) are excluded — a dynamic segment
 * matches everything, which is the reason this module exists rather than
 * something it can prove — and route groups (`(chrome)`) are not path
 * segments at all.
 */
function staticSegmentsOnDisk(): string[] {
  return readdirSync('app/[locale]', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('[') && !name.startsWith('('))
}

describe('the live-segment list stays true', () => {
  it('lists every static route directory under a locale', () => {
    const missing = staticSegmentsOnDisk().filter(
      (segment) => !LIVE_SEGMENTS.includes(segment)
    )

    expect(
      missing,
      `these pages exist and proxy.ts would answer 404 for them: ${missing.join(', ')}`
    ).toEqual([])
  })

  it('lists every unit', () => {
    const missing = UNITS.filter((unit) => !LIVE_SEGMENTS.includes(unit))
    expect(missing, 'a unit page the proxy would 404').toEqual([])
  })

  it('claims nothing that is neither a unit nor a directory', () => {
    // The other direction: an entry left behind after a route is deleted
    // turns a real 404 into the soft 200 this layer exists to replace.
    const known = new Set<string>([...UNITS, ...staticSegmentsOnDisk()])
    const stale = LIVE_SEGMENTS.filter((segment) => !known.has(segment))

    expect(
      stale,
      `nothing answers at these, so they should 404: ${stale.join(', ')}`
    ).toEqual([])
  })

  it('agrees with the guessed-path table about what is real', () => {
    // `REAL_SEGMENTS` stops a typo-redirect shadowing a page; this list stops
    // the proxy 404ing one. Two lists, one fact — so a segment in one and not
    // the other is a disagreement about whether a page exists.
    const missing = [...REAL_SEGMENTS].filter(
      (segment) => !LIVE_SEGMENTS.includes(segment)
    )
    expect(missing, 'segments the two lists disagree about').toEqual([])
  })
})

describe('gone', () => {
  it('answers for every retired prefix, in both languages', () => {
    for (const prefix of GONE_PREFIXES) {
      expect(isGonePath(`/en${prefix}`)).toBe(true)
      expect(isGonePath(`/id${prefix}`)).toBe(true)
      expect(isGonePath(`/en${prefix}/anything`)).toBe(true)
      // Unprefixed, which is what a request arriving before the locale
      // router looks like.
      expect(isGonePath(prefix)).toBe(true)
    }
  })

  it('does not swallow a path that merely starts with the same letters', () => {
    expect(isGonePath('/en/practices-of-the-house')).toBe(false)
    expect(isGonePath('/en/work/practical-guide')).toBe(false)
  })

  it('leaves live pages alone', () => {
    expect(isGonePath('/en/work')).toBe(false)
    for (const unit of UNITS) expect(isGonePath(`/id/${unit}`)).toBe(false)
  })
})

describe('an unknown single segment', () => {
  it('is only ever one segment under a real locale', () => {
    expect(isUnknownSingleSegment('/en/nothing-here')).toBe(true)
    expect(isUnknownSingleSegment('/id/tidak-ada')).toBe(true)

    // Two segments: the router's in-chrome 404 handles those, deliberately.
    expect(isUnknownSingleSegment('/en/nothing/here')).toBe(false)
    // Not a locale.
    expect(isUnknownSingleSegment('/fr/nothing')).toBe(false)
    // No locale at all — next-intl redirects these before anything else.
    expect(isUnknownSingleSegment('/nothing')).toBe(false)
    expect(isUnknownSingleSegment('/en')).toBe(false)
    expect(isUnknownSingleSegment('/')).toBe(false)
  })

  it('is never a page that answers', () => {
    for (const segment of LIVE_SEGMENTS) {
      expect(
        isUnknownSingleSegment(`/en/${segment}`),
        `${segment} is a real page and must not 404`
      ).toBe(false)
    }
  })
})

describe('the branded document', () => {
  for (const status of [GONE_STATUS, NOT_FOUND_STATUS] as const) {
    it(`carries the status, the brand and a way out for ${status}`, () => {
      const html = brandedStatusDocument(status, '/id/practice/apa-pun')

      expect(html).toStartWith('<!doctype html>')
      expect(html, 'the locale of the path it answers for').toContain(
        '<html lang="id">'
      )
      expect(html).toContain(String(status))
      expect(html, 'the wordmark').toContain('Arthur')
      // Never indexable, said in the markup as well as the header: a header
      // can be dropped by a proxy in front of this, the markup cannot.
      expect(html).toContain('name="robots" content="noindex, nofollow"')
      // A way out, per unit, in the reader's own language prefix.
      for (const unit of UNITS) expect(html).toContain(`href="/id/${unit}"`)
    })
  }

  it('falls back to the default locale when the path names none', () => {
    expect(brandedStatusDocument(NOT_FOUND_STATUS, '/practice')).toContain(
      '<html lang="en">'
    )
  })

  it('escapes what it interpolates', () => {
    // Nothing reader-supplied reaches the document today, which is exactly
    // when an escaping helper rots. Asserted so it cannot.
    const html = brandedStatusDocument(GONE_STATUS, '/en/practice')
    expect(html).not.toContain('<script')
  })
})
