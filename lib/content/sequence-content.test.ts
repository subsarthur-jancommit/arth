import { describe, expect, it } from 'bun:test'

import { parseSequenceContent, type SequenceSource } from './sequence-content'

function completeSequence(): SequenceSource {
  return {
    _id: 'sequence-1',
    situasi: 'Satu kebutuhan menyentuh ruang, sistem, dan pasar.',
    langkah: [
      {
        _key: 'step-1',
        unit: { kunci: 'konstruksi', nama: 'Konstruksi' },
        offerCount: 1,
        offer: [{ _key: 'offer-1', slug: 'ruang', judul: 'Ruang kerja' }],
        kalimat: 'Ruang kerja ditata untuk kebutuhan yang sudah dipetakan.',
      },
      {
        _key: 'step-2',
        unit: { kunci: 'teknologi', nama: 'Teknologi' },
        offerCount: 1,
        offer: [{ _key: 'offer-2', slug: 'sistem', judul: 'Sistem kerja' }],
        kalimat: 'Sistem kerja mengikuti alur yang benar-benar dipakai.',
      },
      {
        _key: 'step-3',
        unit: { kunci: 'peekabo', nama: 'Peekabo' },
        offerCount: 1,
        offer: [{ _key: 'offer-3', slug: 'pasar', judul: 'Jalur pasar' }],
        kalimat: 'Jalur pasar disusun setelah penawaran siap dijelaskan.',
      },
    ],
    keterangan: 'Ini rangkaian yang mungkin, bukan catatan proyek terdahulu.',
    metadata: {
      title: 'Satu klien, tiga unit',
      description: 'Tiga unit dalam satu urutan kerja.',
      keywords: ['rangkaian kerja'],
      noIndex: false,
    },
  }
}

describe('sequence content boundary', () => {
  it('accepts exactly three complete steps', () => {
    expect(parseSequenceContent([completeSequence()])).toHaveLength(1)
  })

  it('withholds a sequence when a referenced offer was filtered out', () => {
    const complete = completeSequence()
    const value = {
      ...complete,
      langkah: (complete.langkah ?? []).map((step, index) =>
        index === 0 ? { ...step, offerCount: 2 } : step
      ),
    }

    expect(parseSequenceContent([value])).toEqual([])
  })

  it('withholds a sequence with a missing unit or the wrong step count', () => {
    const complete = completeSequence()
    const steps = complete.langkah ?? []
    const second = steps[1]!
    const withoutUnit = {
      ...complete,
      langkah: [steps[0]!, { ...second, unit: null }, steps[2]!],
    }
    const short = { ...complete, langkah: steps.slice(0, 2) }

    expect(parseSequenceContent([withoutUnit, short])).toEqual([])
  })

  it('withholds editorial placeholders before rendering', () => {
    const value = {
      ...completeSequence(),
      keterangan: '[PERLU pemilik] tentukan catatan rangkaian.',
    }

    expect(parseSequenceContent([value])).toEqual([])
  })
})
