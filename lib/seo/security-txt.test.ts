import { describe, expect, it } from 'bun:test'

import {
  buildSecurityTxt,
  SECURITY_CONTACT,
  SECURITY_POLICY,
} from './security-txt'

const NOW = new Date('2026-10-06T00:00:00Z')
const CANONICAL = 'https://arth.test/.well-known/security.txt'

function field(text: string, name: string): string | undefined {
  return text
    .split('\n')
    .find((line) => line.startsWith(`${name}: `))
    ?.slice(name.length + 2)
}

describe('security.txt', () => {
  it('names the private reporting channel SECURITY.md names', () => {
    const text = buildSecurityTxt({ canonical: CANONICAL, now: NOW })
    expect(field(text, 'Contact')).toBe(SECURITY_CONTACT)
    expect(field(text, 'Policy')).toBe(SECURITY_POLICY)
    expect(SECURITY_CONTACT).toEndWith('/security/advisories/new')
  })

  it('expires within the year RFC 9116 allows, counted from the build', () => {
    const expires = Date.parse(
      field(buildSecurityTxt({ canonical: CANONICAL, now: NOW }), 'Expires') ??
        ''
    )
    expect(expires).toBeGreaterThan(NOW.getTime())
    expect(expires - NOW.getTime()).toBeLessThan(365 * 24 * 60 * 60 * 1000)
  })

  it('states where it lives, and ends with a newline', () => {
    const text = buildSecurityTxt({ canonical: CANONICAL, now: NOW })
    expect(field(text, 'Canonical')).toBe(CANONICAL)
    expect(field(text, 'Preferred-Languages')).toBe('en, id')
    expect(text.endsWith('\n')).toBe(true)
  })
})
