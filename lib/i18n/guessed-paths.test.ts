/**
 * The guessed-path table, and the two ways it could go wrong.
 *
 * A redirect table is a small amount of code that quietly owns a large
 * promise: every URL it names stops resolving normally. The two failures that
 * matter are it shadowing a real route, and it sending a reader somewhere
 * that does not exist. Both are checked here rather than trusted.
 */

import { describe, expect, it } from 'bun:test'

import { UNITS } from '@/lib/content/units'

import {
  GUESSED_KEYS,
  guessedDestination,
  REAL_SEGMENTS,
} from './guessed-paths'
import { routing } from './routing'

describe('guessed paths', () => {
  it('never shadows a segment that already resolves', () => {
    const collisions = GUESSED_KEYS.filter((key) => REAL_SEGMENTS.has(key))

    expect(
      collisions,
      `these segments are real routes and must not be redirected: ${collisions.join(', ')}`
    ).toEqual([])
  })

  it('sends every locale to its own copy of the destination', () => {
    for (const locale of routing.locales) {
      expect(guessedDestination(`/${locale}/contact`)).toBe(
        `/${locale}#contact`
      )
      expect(guessedDestination(`/${locale}/karya`)).toBe(`/${locale}/work`)
    }
  })

  it('answers to both spellings of a label', () => {
    expect(guessedDestination('/id/kontak')).toBe('/id#contact')
    expect(guessedDestination('/en/contact')).toBe('/en#contact')
  })

  /*
   * The practice rows were removed in F1-03, and their absence is asserted
   * rather than left as a gap: `/en/practice` must reach `proxy.ts`'s
   * `410 Gone` instead of being redirected to a home-page anchor, and a row
   * silently reinstated here would take that answer away again.
   */
  it('no longer redirects the retired practice segments', () => {
    expect(guessedDestination('/en/practice')).toBeNull()
    expect(guessedDestination('/id/praktik')).toBeNull()
  })

  it('leaves a unit segment to its own page', () => {
    for (const unit of UNITS) {
      expect(guessedDestination(`/en/${unit}`)).toBeNull()
      expect(guessedDestination(`/id/${unit}`)).toBeNull()
    }
  })

  it('leaves real routes and deeper paths alone', () => {
    // The catalogue, which a redirect would send to itself.
    expect(guessedDestination('/en/work')).toBeNull()
    expect(guessedDestination('/id/work')).toBeNull()
    // The machine view.
    expect(guessedDestination('/en/studio')).toBeNull()
    // Three segments: a real project page.
    expect(guessedDestination('/en/work/arus-balik')).toBeNull()
  })

  it('ignores anything that is not a locale-prefixed single segment', () => {
    expect(guessedDestination('/contact')).toBeNull()
    expect(guessedDestination('/fr/contact')).toBeNull()
    expect(guessedDestination('/en')).toBeNull()
    expect(guessedDestination('/')).toBeNull()
    expect(guessedDestination('')).toBeNull()
  })

  it('does not redirect studio, which becomes a real route in Tahap 24', () => {
    // Stated as a test so the omission reads as a decision rather than a gap.
    expect(guessedDestination('/en/studio')).toBeNull()
    expect(guessedDestination('/id/studio')).toBeNull()
  })
})
