import { describe, expect, it } from 'bun:test'

import {
  chapterForPath,
  NETWORK_MONEY_STEP_KEYS,
  NETWORK_PATH_KEYS,
  NETWORK_PATH_STUDIO_TITLES,
} from '@/lib/content/network'

describe('the seller-network structure', () => {
  it('keeps the three paths named by F3-06 in their reading order', () => {
    expect(NETWORK_PATH_KEYS).toEqual(['referrer', 'member', 'creator'])
  })

  it('keeps the referrer money flow at exactly four steps', () => {
    expect(NETWORK_MONEY_STEP_KEYS).toEqual([
      'refer',
      'buy',
      'partnerPays',
      'arthurPays',
    ])
  })

  it('gives the Studio a title for every path and no other', () => {
    expect(Object.keys(NETWORK_PATH_STUDIO_TITLES)).toEqual([
      ...NETWORK_PATH_KEYS,
    ])
  })
})

describe('the chapter each network path opens', () => {
  const creators = {
    name: 'Kreator, streamer, dan host',
    networkPath: 'creator',
  }

  it('is the chapter written for that path, not the one at its position', () => {
    // Production on 2026-10-23: one chapter, first in the list. Pairing by
    // position showed it under "Rujuk transaksi".
    const chapters = [creators]

    expect(chapterForPath('referrer', chapters)).toBeUndefined()
    expect(chapterForPath('member', chapters)).toBeUndefined()
    expect(chapterForPath('creator', chapters)).toBe(creators)
  })

  it('follows the path a chapter names when the order changes', () => {
    const referrers = { name: 'Rujuk pembeli', networkPath: 'referrer' }
    const chapters = [creators, referrers]

    expect(chapterForPath('referrer', chapters)).toBe(referrers)
    expect(chapterForPath('creator', chapters)).toBe(creators)
  })

  it('leaves a chapter that names no path off every path', () => {
    const chapters = [{ name: 'Tanpa jalur', networkPath: null }]

    for (const path of NETWORK_PATH_KEYS) {
      expect(chapterForPath(path, chapters)).toBeUndefined()
    }
  })
})
