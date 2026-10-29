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
      expect(guessedDestination(`/${locale}/contact`)).toBe(`/${locale}/kontak`)
      expect(guessedDestination(`/${locale}/karya`)).toBe(`/${locale}/work`)
      expect(guessedDestination(`/${locale}/layanan`)).toBe(
        `/${locale}/layanan-terpadu`
      )
      expect(guessedDestination(`/${locale}/pembayaran`)).toBe(
        `/${locale}/ketentuan-pembayaran`
      )
      expect(guessedDestination(`/${locale}/tentang`)).toBe(`/${locale}/kontak`)
    }
  })

  it('redirects the English label and leaves the real route alone', () => {
    expect(guessedDestination('/id/kontak')).toBeNull()
    expect(guessedDestination('/en/contact')).toBe('/en/kontak')
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
    expect(guessedDestination('/id/kontak')).toBeNull()
    // The machine view.
    expect(guessedDestination('/en/studio')).toBeNull()
    expect(guessedDestination('/en/metode-kerja')).toBeNull()
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

  it('leaves old addresses to the renamed table', () => {
    // `lib/i18n/renamed-paths.ts` answers these before this table runs.
    // Stated as a test so the omission reads as a decision rather than a gap.
    expect(guessedDestination('/en/studio')).toBeNull()
    expect(guessedDestination('/id/metode-kerja')).toBeNull()
    expect(guessedDestination('/id/studio')).toBeNull()
    expect(guessedDestination('/id/cara-kerja')).toBeNull()
    expect(guessedDestination('/id/satu-klien-tiga-unit')).toBeNull()
  })
})
