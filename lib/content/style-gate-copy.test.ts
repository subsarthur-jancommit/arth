import { describe, expect, it } from 'bun:test'

import messages from '@/messages/id.json'

import { checkDocument, type StyleDocument } from './style-gate'

/**
 * The copy that ships in code is held to the same errors as Sanity content:
 * no dash used as a pause, no exclamation mark, no emoji, no catalogue code.
 * Warnings are left to a reader; this only stops what a sentence breaks on
 * its face (docs/RENCANA-KONTEKS-V2.md, V0).
 *
 * Since V6 the interface strings are the only such copy: the unit and side
 * fallbacks this file also checked were removed, and
 * `editorial-copy.test.ts` keeps them out.
 */
const errors = (value: object) =>
  checkDocument(value as StyleDocument)
    .filter((finding) => finding.level === 'error')
    .map((finding) => `${finding.path}: ${finding.rule} (${finding.excerpt})`)

describe('copy in code passes the style gate', () => {
  it('Indonesian interface strings', () => {
    expect(errors(messages)).toEqual([])
  })
})
