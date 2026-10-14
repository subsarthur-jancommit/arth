import { describe, expect, it } from 'bun:test'

import {
  NETWORK_MONEY_STEP_KEYS,
  NETWORK_PATH_KEYS,
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
})
