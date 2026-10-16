import { describe, expect, it } from 'bun:test'

import {
  checkShortlist,
  SHORTLIST_PROPOSALS,
  type ShortlistChapter,
  type ShortlistOffer,
} from './shortlist'

const situation = 'Bab uji'
const offer = (
  idKatalog: string,
  jenis: string,
  extra: Partial<ShortlistOffer> = {}
): ShortlistOffer => ({
  idKatalog,
  situation,
  jenis,
  syarat: undefined,
  lane: 'otomatis',
  reasons: [],
  ...extra,
})

const offers = [
  offer('A-01', 'Celah'),
  offer('A-02', 'Paket'),
  offer('A-03', 'Celah'),
  offer('A-04', 'Rawat'),
  offer('A-05', 'Paket', { reasons: ['†: butuh rumusan aman'] }),
  offer('A-06', 'Paket', {
    reasons: ['†: butuh rumusan aman'],
    syarat: 'Dikerjakan pihak berizin.',
  }),
  offer('A-07', 'Rawat', {
    lane: 'tulis-tangan',
    reasons: ['tertahan: keputusan terbuka'],
  }),
]

const chapter = (
  pilihan: string[],
  entri = pilihan[0] ?? ''
): ShortlistChapter => ({
  unit: 'konstruksi',
  side: 'B',
  situation,
  entri,
  pilihan: pilihan.map((id) => ({ id, alasan: 'uji' })),
})

const messages = (pilihan: string[], entri?: string) =>
  checkShortlist(chapter(pilihan, entri), offers).map(
    (finding) => finding.message
  )

describe('shortlist rules', () => {
  it('passes three to seven offers, one per kind first', () => {
    expect(messages(['A-01', 'A-02', 'A-04', 'A-03'])).toEqual([])
  })

  it('rejects fewer than three or more than seven offers', () => {
    expect(messages(['A-01', 'A-02'])[0]).toContain('2 offer')
  })

  it('rejects an entry offer that is not in the list', () => {
    expect(messages(['A-01', 'A-02', 'A-04'], 'A-03')).toContain(
      'pintu masuk A-03 tidak ada di daftar'
    )
  })

  it('rejects a held offer and a † offer without safe wording', () => {
    const found = messages(['A-01', 'A-02', 'A-04', 'A-07', 'A-05'])
    expect(found.some((message) => message.startsWith('A-07 tertahan'))).toBe(
      true
    )
    expect(found).toContain('A-05 bertanda † tanpa rumusan aman')
  })

  it('accepts a † offer once its safe wording exists', () => {
    expect(messages(['A-01', 'A-06', 'A-04'])).toEqual([])
  })

  it('warns when a kind repeats before every kind has appeared', () => {
    expect(messages(['A-01', 'A-03', 'A-02', 'A-04'])).toContain(
      'urutan mengulang satu jenis sebelum semua jenis di daftar muncul'
    )
  })

  it('rejects an offer from another chapter', () => {
    expect(messages(['A-01', 'A-02', 'Z-99'])).toContain(
      'Z-99 bukan offer bab ini'
    )
  })

  it('accepts a held chapter only with an empty list', () => {
    const held = { ...chapter([]), ditahanBab: 'menunggu keputusan' }
    expect(checkShortlist(held, offers)).toEqual([])
    expect(
      checkShortlist({ ...chapter(['A-01']), ditahanBab: 'x' }, offers)
    ).toHaveLength(1)
  })

  it('keeps every proposal within three to seven, with its entry in the list', () => {
    for (const proposal of SHORTLIST_PROPOSALS.filter(
      (item) => !item.ditahanBab
    )) {
      const ids = proposal.pilihan.map((pick) => pick.id)
      expect(ids.length).toBeGreaterThanOrEqual(3)
      expect(ids.length).toBeLessThanOrEqual(7)
      expect(ids).toContain(proposal.entri)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})
