import { describe, expect, it } from 'bun:test'

import { localizedPath } from './paths'
import {
  ENGLISH_PAGES,
  isEnglishPage,
  publicLocaleRedirect,
  R7_PAGES,
} from './public-locale-redirect'
import { routing } from './routing'

describe('public locale redirect', () => {
  it('defaults to Indonesian without negotiating from the browser language', () => {
    expect(routing.defaultLocale).toBe('id')
    expect(routing.localeDetection).toBe(false)
  })

  it('sends the unapproved English home to the Indonesian home', () => {
    expect(publicLocaleRedirect('/en')).toBe('/id')
    expect(publicLocaleRedirect('/en/')).toBe('/id')
  })

  it('sends untranslated Arthur pages to their Indonesian twin', () => {
    expect(publicLocaleRedirect('/en/konstruksi')).toBe('/id/konstruksi')
    expect(publicLocaleRedirect('/en/konstruksi/pelaku-proyek')).toBe(
      '/id/konstruksi/pelaku-proyek'
    )
    expect(publicLocaleRedirect('/en/peekabo/jaringan/perujuk')).toBe(
      '/id/peekabo/jaringan/perujuk'
    )
    expect(publicLocaleRedirect('/en/metode')).toBe('/id/metode')
    expect(publicLocaleRedirect('/en/layanan')).toBe('/id/layanan')
    expect(publicLocaleRedirect('/en/kebijakan')).toBe('/id/kebijakan')
    expect(publicLocaleRedirect('/en/pembayaran')).toBe('/id/pembayaran')
    expect(publicLocaleRedirect('/en/kontak')).toBe('/id/kontak')
    expect(publicLocaleRedirect('/en/halaman/tentang')).toBe(
      '/id/halaman/tentang'
    )
  })

  it('sends the English search index to the published one', () => {
    expect(publicLocaleRedirect('/en/search.json')).toBe('/id/search.json')
    expect(publicLocaleRedirect('/id/search.json')).toBeNull()
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
    expect(publicLocaleRedirect('/en/search.json', R7_PAGES)).toBe(
      '/id/search.json'
    )
  })

  it('reads a template with or without its trailing slash', () => {
    expect(isEnglishPage('/konstruksi/', ['/konstruksi'])).toBe(true)
    expect(isEnglishPage('/', ['/'])).toBe(true)
    expect(isEnglishPage('/konstruksi', [])).toBe(false)
  })
})
