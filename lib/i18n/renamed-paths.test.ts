/**
 * The renamed-address table, and the ways it could go wrong.
 *
 * Every row stops an old address from resolving on its own, so the failures
 * that matter are a row pointing at a page that does not answer, a row whose
 * old segment is still a live page, and a row the guess table also claims.
 */

import { describe, expect, it } from 'bun:test'

import { LIVE_SEGMENTS } from '@/lib/seo/route-status'

import { GUESSED_KEYS, REAL_SEGMENTS } from './guessed-paths'
import { RENAMED_SEGMENTS, renamedDestination } from './renamed-paths'
import { routing } from './routing'

describe('renamed paths', () => {
  it('sends each old address to the page it became, in its own locale', () => {
    for (const locale of routing.locales) {
      expect(renamedDestination(`/${locale}/satu-klien-tiga-unit`)).toBe(
        `/${locale}/layanan`
      )
      expect(renamedDestination(`/${locale}/cara-kami-dibayar`)).toBe(
        `/${locale}/pembayaran`
      )
      expect(renamedDestination(`/${locale}/cara-kerja`)).toBe(
        `/${locale}/metode`
      )
      expect(renamedDestination(`/${locale}/studio`)).toBe(`/${locale}/metode`)
    }
  })

  it('moves the Markdown mirror with its page', () => {
    expect(renamedDestination('/id/cara-kerja.md')).toBe('/id/metode.md')
    expect(renamedDestination('/id/satu-klien-tiga-unit.md')).toBe(
      '/id/layanan.md'
    )
  })

  it('leaves new addresses, deeper paths and unknown locales alone', () => {
    expect(renamedDestination('/id/metode')).toBeNull()
    expect(renamedDestination('/id/layanan.md')).toBeNull()
    expect(renamedDestination('/id/cara-kerja/lebih')).toBeNull()
    expect(renamedDestination('/xx/cara-kerja')).toBeNull()
    expect(renamedDestination('/cara-kerja')).toBeNull()
    expect(renamedDestination('/id')).toBeNull()
  })

  it('points every row at a page that answers, never at another old address', () => {
    for (const [old, now] of RENAMED_SEGMENTS) {
      expect(LIVE_SEGMENTS, `${old} -> ${now}`).toContain(now)
      expect(LIVE_SEGMENTS, `${old} is still a live page`).not.toContain(old)
      expect(RENAMED_SEGMENTS.has(now), `${now} is itself renamed`).toBe(false)
    }
  })

  it('shares no segment with the guess table or the real routes', () => {
    const claimed = [...GUESSED_KEYS, ...REAL_SEGMENTS].filter((segment) =>
      RENAMED_SEGMENTS.has(segment)
    )

    expect(claimed, `claimed twice: ${claimed.join(', ')}`).toEqual([])
  })
})
