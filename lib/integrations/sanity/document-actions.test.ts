import { describe, expect, it } from 'bun:test'

import { isArthurContentType } from './document-actions'

describe('Arthur document actions', () => {
  it('limits the review workflow to reader-facing Arthur documents', () => {
    for (const type of [
      'siteSettings',
      'unit',
      'side',
      'bab',
      'offer',
      'sequence',
      'howWeWork',
      'faq',
      'page',
    ]) {
      expect(isArthurContentType(type)).toBe(true)
    }

    for (const type of ['project', 'journalEntry', 'studioSettings']) {
      expect(isArthurContentType(type)).toBe(false)
    }
  })
})
