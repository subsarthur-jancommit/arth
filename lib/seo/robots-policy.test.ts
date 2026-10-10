import { describe, expect, it } from 'bun:test'

import {
  indexableHostConditions,
  NOINDEX_VALUE,
  normalizeHost,
  parseIndexableHosts,
} from './robots-policy'

/**
 * The placeholder site answered every request without `X-Robots-Tag` and
 * without a meta robots tag, measured on 2026-10-10. These hold the direction
 * the fix depends on: an unlisted host is never indexable, so forgetting to
 * list one fails safe rather than publishing placeholder copy to an index.
 */
describe('which hosts may be indexed', () => {
  it('indexes nothing when no host is listed', () => {
    expect(parseIndexableHosts(undefined)).toEqual([])
    expect(parseIndexableHosts('')).toEqual([])
    expect(parseIndexableHosts('  ')).toEqual([])
    expect(parseIndexableHosts(',,')).toEqual([])
  })

  it('reads a comma-separated list', () => {
    expect(
      parseIndexableHosts('arth.example.com,www.arth.example.com')
    ).toEqual(['arth.example.com', 'www.arth.example.com'])
  })

  it('tolerates the shape a person copies out of a browser', () => {
    expect(parseIndexableHosts(' https://Arth.Example.com/ ')).toEqual([
      'arth.example.com',
    ])
  })

  it('keeps one entry per host', () => {
    expect(parseIndexableHosts('arth.example.com, ARTH.example.com.')).toEqual([
      'arth.example.com',
    ])
  })
})

describe('normalising a host', () => {
  it('drops scheme, path, port and trailing dot, and lower-cases', () => {
    expect(normalizeHost('HTTPS://Arth.Example.com:443/work/')).toBe(
      'arth.example.com'
    )
    expect(normalizeHost('arth.example.com.')).toBe('arth.example.com')
  })

  it('keeps a bracketed IPv6 address whole', () => {
    // Splitting on the first colon would cut the address in half.
    expect(normalizeHost('[::1]:3000')).toBe('[::1]')
  })

  it('returns null for nothing', () => {
    expect(normalizeHost(undefined)).toBeNull()
    expect(normalizeHost('')).toBeNull()
    expect(normalizeHost('  ')).toBeNull()
    expect(normalizeHost(':3000')).toBeNull()
  })
})

/**
 * `headers()` applies an entry when no `missing` condition matches, so an
 * entry with no conditions applies to every request. That is what an empty
 * allowlist has to mean, and it is the case that ships today.
 */
describe('the conditions that exempt the final domain', () => {
  it('exempts nobody while the list is empty', () => {
    expect(indexableHostConditions(undefined)).toEqual([])
  })

  it('names one condition per indexable host', () => {
    expect(
      indexableHostConditions('arth.example.com,www.arth.example.com')
    ).toEqual([
      { type: 'host', value: 'arth.example.com' },
      { type: 'host', value: 'www.arth.example.com' },
    ])
  })
})

describe('the header value', () => {
  it('follows as well as indexes, so a crawler does not walk the placeholder site', () => {
    expect(NOINDEX_VALUE).toBe('noindex, nofollow')
  })
})
