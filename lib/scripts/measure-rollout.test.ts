import { describe, expect, it } from 'bun:test'

import {
  askedOffers,
  honestRows,
  percent,
  rolloutTable,
} from './measure-rollout'

describe('measure-rollout', () => {
  it('writes a percentage with an Indonesian decimal comma', () => {
    expect(percent(11, 652)).toBe('1,7%')
    expect(percent(652, 652)).toBe('100,0%')
    expect(percent(0, 0)).toBe('0%')
  })

  it('renders one Markdown row per measurement', () => {
    const table = rolloutTable([
      { label: 'Offer terbit di Sanity', value: 11, of: 652 },
    ])
    expect(table.split('\n')).toEqual([
      '| Ukuran | Angka | Persen |',
      '| --- | --- | --- |',
      '| Offer terbit di Sanity | 11 dari 652 | 1,7% |',
    ])
  })

  it('counts each offer a page asks about once, however often it is linked', () => {
    const html = [
      '<a href="/id/kontak?dari=dapur&amp;pekerjaan=bot-pesan-antar">',
      '<a href="/id/kontak?dari=dapur&pekerjaan=bot-pesan-antar">',
      '<a href="/id/kontak?dari=dapur&pekerjaan=layar-dapur">',
    ].join('')
    expect(askedOffers(html)).toBe(2)
    expect(askedOffers('<main>Halaman tidak ditemukan</main>')).toBe(0)
  })

  it('prints a count without a denominator as a bare number', () => {
    expect(
      rolloutTable([{ label: 'Halaman pekerjaan terbit', value: 2 }])
    ).toContain('| Halaman pekerjaan terbit | 2 | - |')
  })

  it('counts approved pages and chapters, never catalogue rows', () => {
    const doc = (type: string, id: string, extra = {}) => ({
      _id: id,
      _type: type,
      statusTinjauan: 'disetujui',
      ...extra,
    })
    const rows = honestRows({
      chapters: 55,
      shownOnProduction: 3,
      documents: [
        doc('unit', 'u', { kunci: 'teknologi' }),
        doc('side', 's', { kunci: 'siap-pakai', unit: { _ref: 'u' } }),
        doc('bab', 'b', { sisi: { _ref: 's' }, slug: { current: 'kuliner' } }),
        doc('offer', 'o1', { bab: { _ref: 'b' }, halamanSendiri: true }),
        doc('offer', 'o2', { bab: { _ref: 'b' } }),
        doc('offer', 'o3', { bab: { _ref: 'b' } }),
        { _id: 'u2', _type: 'unit', statusTinjauan: 'perlu-anda' },
      ],
    })
    const value = (label: string) =>
      rows.find((row) => row.label === label)?.value
    expect(value('Halaman disetujui pemilik')).toBe(3)
    expect(value('Bab terbit')).toBe(1)
    expect(value('Offer terpilih dan disetujui')).toBe(3)
    expect(value('Halaman pekerjaan terbit')).toBe(1)
    expect(value('Offer tampil di produksi')).toBe(3)
  })
})
