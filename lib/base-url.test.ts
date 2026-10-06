import { describe, expect, it } from 'bun:test'

import { LOCAL_BASE_URL, resolveBaseUrl } from './base-url'

/**
 * The live site published `https://localhost:3000` in every canonical until
 * the origin learned to read Vercel's own production domain
 * (`docs/HANDOFF.md` §4.8, L1). These hold the order: a value someone set,
 * then Vercel's, then localhost.
 */
describe('where the site lives', () => {
  it('prefers the value someone set', () => {
    expect(
      resolveBaseUrl({
        explicit: 'https://arth.studio',
        vercelProductionHost: 'arth-test-01.vercel.app',
      })
    ).toBe('https://arth.studio')
  })

  it("falls back to Vercel's production domain, with a scheme", () => {
    expect(
      resolveBaseUrl({ vercelProductionHost: 'arth-test-01.vercel.app' })
    ).toBe('https://arth-test-01.vercel.app')
  })

  it('does not double a scheme Vercel might one day include', () => {
    expect(
      resolveBaseUrl({
        vercelProductionHost: 'https://arth-test-01.vercel.app',
      })
    ).toBe('https://arth-test-01.vercel.app')
  })

  it('keeps localhost for local development and CI', () => {
    expect(resolveBaseUrl({})).toBe(LOCAL_BASE_URL)
    expect(resolveBaseUrl({ vercelProductionHost: '  ' })).toBe(LOCAL_BASE_URL)
  })
})
