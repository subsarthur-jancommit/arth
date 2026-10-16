import { describe, expect, it } from 'bun:test'

import messages from '@/messages/id.json'

import { NETWORK_SIDE_FALLBACK, SIDE_FALLBACKS } from './side-fallback'
import { checkDocument, type StyleDocument } from './style-gate'
import { UNIT_FALLBACKS } from './unit-fallback'

/**
 * The copy that ships in code is held to the same errors as Sanity content:
 * no dash used as a pause, no exclamation mark, no emoji, no catalogue code.
 * Warnings are left to a reader; this only stops what a sentence breaks on
 * its face (docs/RENCANA-KONTEKS-V2.md, V0).
 */
const errors = (value: object) =>
  checkDocument(value as StyleDocument)
    .filter((finding) => finding.level === 'error')
    .map((finding) => `${finding.path}: ${finding.rule} (${finding.excerpt})`)

describe('copy in code passes the style gate', () => {
  it('side fallbacks', () => {
    expect(errors(SIDE_FALLBACKS)).toEqual([])
    expect(errors(NETWORK_SIDE_FALLBACK)).toEqual([])
  })

  it('unit fallbacks', () => {
    expect(errors(UNIT_FALLBACKS)).toEqual([])
  })

  it('Indonesian interface strings', () => {
    expect(errors(messages)).toEqual([])
  })
})
