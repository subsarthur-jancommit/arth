import { describe, expect, it } from 'bun:test'

import { publicLocaleRedirect } from './public-locale-redirect'
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
    expect(publicLocaleRedirect('/en/cara-kerja')).toBe('/id/cara-kerja')
    expect(publicLocaleRedirect('/en/kontak')).toBe('/id/kontak')
    expect(publicLocaleRedirect('/en/halaman/tentang')).toBe(
      '/id/halaman/tentang'
    )
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
