import { describe, expect, it } from 'bun:test'

import { localesForLanguageSwitcher } from './locales'

describe('localesForLanguageSwitcher', () => {
  it('does not advertise English from the approved Indonesian site', () => {
    expect(localesForLanguageSwitcher('id')).toEqual([])
  })

  it('gives an English preview or old deep link a route back to Indonesian', () => {
    expect(localesForLanguageSwitcher('en')).toEqual(['id'])
  })

  it('gives an invalid locale a route to the approved language', () => {
    expect(localesForLanguageSwitcher('unknown')).toEqual(['id'])
  })
})
