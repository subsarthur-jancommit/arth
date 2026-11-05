import { describe, expect, it } from 'bun:test'

import { HOME_SEQUENCE_ID, pickHomeSequence } from './home-sequence'
import { parseSequenceContent, type SequenceSource } from './sequence-content'

function sequence(id: string): SequenceSource {
  return {
    _id: id,
    situasi: 'Satu kebutuhan menyentuh ruang, sistem, dan pasar.',
    langkah: (['konstruksi', 'teknologi', 'peekabo'] as const).map(
      (kunci, index) => ({
        _key: `step-${index + 1}`,
        unit: { kunci, nama: kunci },
        offerCount: 1,
        offer: [{ _key: `offer-${index + 1}`, slug: kunci, judul: kunci }],
        kalimat: 'Langkah ini dikerjakan unit yang memegangnya.',
      })
    ),
    keterangan: 'Ini rangkaian yang mungkin, bukan catatan proyek terdahulu.',
    metadata: { title: null, description: null, keywords: null, noIndex: null },
  }
}

const published = parseSequenceContent([
  sequence('arthur-rangkaian-studio-siaran'),
  sequence(HOME_SEQUENCE_ID),
])

describe('the sequence the home page shows', () => {
  it('is the café while the Studio names none', () => {
    // The published dataset today: `rangkaianPilihan` is empty, and the
    // café is not the first sequence in the order `/layanan` reads them.
    expect(published).toHaveLength(2)
    expect(pickHomeSequence(published, null)?._id).toBe(HOME_SEQUENCE_ID)
  })

  it('is the one the Studio names, once it names one', () => {
    expect(
      pickHomeSequence(published, 'arthur-rangkaian-studio-siaran')?._id
    ).toBe('arthur-rangkaian-studio-siaran')
  })

  it('falls back to the café when the named one cannot be shown', () => {
    // Withheld by the parser, unpublished, or never there.
    expect(pickHomeSequence(published, 'no-such-sequence')?._id).toBe(
      HOME_SEQUENCE_ID
    )
  })

  it('is nothing when neither can be shown, so the block leaves the page', () => {
    const others = parseSequenceContent([
      sequence('arthur-rangkaian-studio-siaran'),
    ])
    expect(pickHomeSequence(others, null)).toBeNull()
    expect(pickHomeSequence([], null)).toBeNull()
  })
})
