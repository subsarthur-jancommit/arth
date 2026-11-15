import { describe, expect, it } from 'bun:test'

import { localizedPath } from './paths'
import {
  ADVERTISED_LOCALES,
  ENGLISH_PAGES,
  isEnglishPage,
  localesForTemplate,
  publicLocaleRedirect,
  R7_PAGES,
} from './public-locale-redirect'
import { routing } from './routing'

/** No page open in English: the state from R0 until R7. */
const NONE: readonly string[] = []

describe('public locale redirect', () => {
  it('defaults to Indonesian without negotiating from the browser language', () => {
    expect(routing.defaultLocale).toBe('id')
    expect(routing.localeDetection).toBe(false)
  })

  it('sends an English home that is not open to the Indonesian home', () => {
    expect(publicLocaleRedirect('/en', NONE)).toBe('/id')
    expect(publicLocaleRedirect('/en/', NONE)).toBe('/id')
  })

  it('sends untranslated Arthur pages to their Indonesian twin', () => {
    expect(publicLocaleRedirect('/en/konstruksi', NONE)).toBe('/id/konstruksi')
    expect(publicLocaleRedirect('/en/konstruksi/pelaku-proyek', NONE)).toBe(
      '/id/konstruksi/pelaku-proyek'
    )
    expect(publicLocaleRedirect('/en/peekabo/jaringan/perujuk', NONE)).toBe(
      '/id/peekabo/jaringan/perujuk'
    )
    expect(publicLocaleRedirect('/en/metode', NONE)).toBe('/id/metode')
    expect(publicLocaleRedirect('/en/layanan', NONE)).toBe('/id/layanan')
    expect(publicLocaleRedirect('/en/kebijakan', NONE)).toBe('/id/kebijakan')
    expect(publicLocaleRedirect('/en/pembayaran', NONE)).toBe('/id/pembayaran')
    expect(publicLocaleRedirect('/en/kontak', NONE)).toBe('/id/kontak')
    expect(publicLocaleRedirect('/en/halaman/tentang', NONE)).toBe(
      '/id/halaman/tentang'
    )
  })

  it('sends the English search index to the published one while no page is open', () => {
    expect(publicLocaleRedirect('/en/search.json', NONE)).toBe(
      '/id/search.json'
    )
    expect(publicLocaleRedirect('/id/search.json', NONE)).toBeNull()
  })

  it('leaves the translated legacy routes and unknown paths alone', () => {
    expect(publicLocaleRedirect('/en/work')).toBeNull()
    expect(publicLocaleRedirect('/en/work/project')).toBeNull()
    expect(publicLocaleRedirect('/en/journal/entry')).toBeNull()
    expect(publicLocaleRedirect('/en/no-such-page-here')).toBeNull()
    expect(publicLocaleRedirect('/en/konstruksi-lain')).toBeNull()
  })

  it('does not redirect Indonesian or lookalike paths', () => {
    expect(publicLocaleRedirect('/id')).toBeNull()
    expect(publicLocaleRedirect('/id/konstruksi')).toBeNull()
    expect(publicLocaleRedirect('/english')).toBeNull()
    expect(publicLocaleRedirect('/enough')).toBeNull()
  })
})

describe('English pages opened by R7', () => {
  it('scopes R7 to the fourteen pages whose English the owner approved', () => {
    expect(R7_PAGES).toHaveLength(14)
    expect(new Set(R7_PAGES).size).toBe(R7_PAGES.length)
    expect(R7_PAGES).toContain('/')
    expect(R7_PAGES).toContain('/peekabo/jaringan')
    expect(R7_PAGES).not.toContain('/kebijakan')
  })

  it('opens only approved pages, and serves every page it opens', () => {
    for (const page of ENGLISH_PAGES) {
      expect(R7_PAGES).toContain(page)
      expect(publicLocaleRedirect(localizedPath('en', page))).toBeNull()
    }
  })

  it('holds back the two pages whose head is still Indonesian', () => {
    // `/layanan` and `/pembayaran` print a plain Indonesian title and
    // description from Sanity (`ENGLISH_PAGES` records why).
    expect(R7_PAGES.filter((page) => !ENGLISH_PAGES.includes(page))).toEqual([
      '/layanan',
      '/pembayaran',
    ])
    expect(publicLocaleRedirect('/en/layanan')).toBe('/id/layanan')
    expect(publicLocaleRedirect('/en/pembayaran')).toBe('/id/pembayaran')
    expect(publicLocaleRedirect('/en/kebijakan')).toBe('/id/kebijakan')
    expect(publicLocaleRedirect('/en/peekabo/jaringan/perujuk')).toBe(
      '/id/peekabo/jaringan/perujuk'
    )
  })

  it('serves an open page in English and keeps the pages under it closed', () => {
    const open = ['/', '/konstruksi', '/konstruksi/pelaku-proyek']
    expect(publicLocaleRedirect('/en', open)).toBeNull()
    expect(publicLocaleRedirect('/en/', open)).toBeNull()
    expect(publicLocaleRedirect('/en/konstruksi', open)).toBeNull()
    expect(publicLocaleRedirect('/en/konstruksi/', open)).toBeNull()
    expect(
      publicLocaleRedirect('/en/konstruksi/pelaku-proyek', open)
    ).toBeNull()
    expect(
      publicLocaleRedirect('/en/konstruksi/pelaku-proyek/tenaga-kerja', open)
    ).toBe('/id/konstruksi/pelaku-proyek/tenaga-kerja')
    expect(publicLocaleRedirect('/en/konstruksi/pemilik-bangunan', open)).toBe(
      '/id/konstruksi/pemilik-bangunan'
    )
    expect(publicLocaleRedirect('/en/teknologi', open)).toBe('/id/teknologi')
  })

  it('keeps pages outside R7 closed with every R7 page open', () => {
    for (const page of R7_PAGES) {
      expect(publicLocaleRedirect(localizedPath('en', page), R7_PAGES)).toBe(
        null
      )
    }
    expect(publicLocaleRedirect('/en/kebijakan', R7_PAGES)).toBe(
      '/id/kebijakan'
    )
    expect(publicLocaleRedirect('/en/halaman/tentang', R7_PAGES)).toBe(
      '/id/halaman/tentang'
    )
  })

  it('serves the English search index once any page is open', () => {
    expect(publicLocaleRedirect('/en/search.json', ['/'])).toBeNull()
    expect(publicLocaleRedirect('/en/search.json')).toBeNull()
  })

  it('reads a template with or without its trailing slash', () => {
    expect(isEnglishPage('/konstruksi/', ['/konstruksi'])).toBe(true)
    expect(isEnglishPage('/', ['/'])).toBe(true)
    expect(isEnglishPage('/konstruksi', [])).toBe(false)
  })
})

describe('the languages a page is served in', () => {
  it('is Indonesian everywhere, and English on an open page', () => {
    expect(localesForTemplate('/metode', ['/metode'])).toEqual(['id', 'en'])
    expect(localesForTemplate('/metode/', ['/metode'])).toEqual(['id', 'en'])
    expect(localesForTemplate('/layanan', ['/metode'])).toEqual(['id'])
    expect(localesForTemplate('/work/project', ['/metode'])).toEqual(['id'])
    expect(localesForTemplate('/metode', NONE)).toEqual(['id'])
  })

  it('advertises English once any page is open', () => {
    expect(ENGLISH_PAGES.length).toBeGreaterThan(0)
    expect(ADVERTISED_LOCALES).toEqual(['id', 'en'])
  })
})
