import { describe, expect, it } from 'bun:test'

import { askedOffers, percent, rolloutTable } from './measure-rollout'

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
})
