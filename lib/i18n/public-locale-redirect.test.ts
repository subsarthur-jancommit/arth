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
  })

  it('does not redirect nested routes that may have an actual translation', () => {
    expect(publicLocaleRedirect('/en/cara-kerja')).toBeNull()
    expect(publicLocaleRedirect('/en/work/project')).toBeNull()
  })

  it('does not redirect Indonesian or lookalike paths', () => {
    expect(publicLocaleRedirect('/id')).toBeNull()
    expect(publicLocaleRedirect('/english')).toBeNull()
    expect(publicLocaleRedirect('/enough')).toBeNull()
  })
})
