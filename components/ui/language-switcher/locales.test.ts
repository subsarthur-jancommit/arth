import { describe, expect, it } from 'bun:test'

import { localizedPath } from '@/lib/i18n/paths'
import {
  ENGLISH_PAGES,
  publicLocaleRedirect,
  R7_PAGES,
} from '@/lib/i18n/public-locale-redirect'

import { localesForLanguageSwitcher } from './locales'

/** A situation page under a side: R7 did not translate it. */
const BAB = '/konstruksi/pelaku-proyek/tenaga-kerja'

describe('localesForLanguageSwitcher', () => {
  it('does not advertise English from an Indonesian page that is not open', () => {
    expect(localesForLanguageSwitcher('id', '/konstruksi', [])).toEqual([])
    expect(localesForLanguageSwitcher('id', '/work/project', [])).toEqual([])
  })

  it('gives an English preview or old deep link a route back to Indonesian', () => {
    expect(localesForLanguageSwitcher('en', '/konstruksi', [])).toEqual(['id'])
    expect(localesForLanguageSwitcher('en', '/work/project', [])).toEqual([
      'id',
    ])
  })

  it('gives an invalid locale a route to the approved language', () => {
    expect(localesForLanguageSwitcher('unknown', '/', [])).toEqual(['id'])
  })

  it('offers both languages, Indonesian first, on a page whose English is open', () => {
    const open = ['/', '/konstruksi']
    expect(localesForLanguageSwitcher('id', '/konstruksi', open)).toEqual([
      'id',
      'en',
    ])
    expect(localesForLanguageSwitcher('en', '/konstruksi', open)).toEqual([
      'id',
      'en',
    ])
    expect(localesForLanguageSwitcher('id', '/konstruksi/', open)).toEqual([
      'id',
      'en',
    ])
    expect(localesForLanguageSwitcher('id', '/', open)).toEqual(['id', 'en'])
  })

  it('does not carry an open page to the pages under it', () => {
    expect(
      localesForLanguageSwitcher('id', '/konstruksi/pelaku-proyek', [
        '/konstruksi',
      ])
    ).toEqual([])
  })

  it('offers English on exactly the pages the proxy serves in English', () => {
    // Every R7 page open, as when R7 is done, then the list as it is today.
    for (const open of [R7_PAGES, ENGLISH_PAGES]) {
      for (const page of open) {
        expect(localesForLanguageSwitcher('id', page, open)).toEqual([
          'id',
          'en',
        ])
        expect(publicLocaleRedirect(localizedPath('en', page), open)).toBeNull()
      }
    }

    // A page under an open side stays Indonesian, and its English address
    // still redirects.
    expect(localesForLanguageSwitcher('id', BAB, R7_PAGES)).toEqual([])
    expect(publicLocaleRedirect(localizedPath('en', BAB), R7_PAGES)).toBe(
      `/id${BAB}`
    )
  })

  it('follows ENGLISH_PAGES on every R7 page', () => {
    for (const page of R7_PAGES) {
      expect(localesForLanguageSwitcher('id', page)).toEqual(
        ENGLISH_PAGES.includes(page) ? ['id', 'en'] : []
      )
    }
  })
})
