import { describe, expect, it } from 'bun:test'

import {
  deriveSituation,
  type SituationOffer,
  type SituationSource,
  situationMarkdown,
  situationSlug,
} from './situation-pages'

const source: SituationSource = {
  unit: 'teknologi',
  side: 'B',
  nama: 'Kuliner dan F&B',
  pembeli: 'Warung dan kedai, kafe dan resto.',
  kutipan: '“Pesanan saya bercampur di chat.”',
}

const offer = (
  idKatalog: string,
  jenis: string,
  extra: Partial<SituationOffer> = {}
): SituationOffer => ({
  idKatalog,
  situation: 'Kuliner dan F&B',
  unit: 'teknologi',
  side: 'B',
  judul: `Pekerjaan ${idKatalog.slice(-2)}`,
  dampak: 'Pesanan tercatat',
  untukSiapa: 'Untuk pemilik kafe dan resto',
  jenis,
  syarat: undefined,
  lane: 'otomatis',
  ...extra,
})

const offers = [
  offer('KUL-01', 'Bot yang bekerja sendiri', {
    dampak: 'Bot mencatat pesanan WhatsApp.',
  }),
  offer('KUL-03', 'Angka yang memberi tahu lebih dulu'),
  offer('KUL-02', 'Alur kerja yang berjalan tanpa dikejar'),
  offer('KUL-05', 'Bot yang bekerja sendiri', { lane: 'tulis-tangan' }),
  offer('FNB-01', 'Proyek utuh dari hulu ke hilir', {
    unit: 'konstruksi',
    situation: 'Konstruksi F&B (lapis 3)',
  }),
]

describe('deriveSituation', () => {
  const page = deriveSituation(source, offers, [['FNB-01', 'KUL-02']])

  it('opens with the first ready offer and keeps it out of the groups', () => {
    expect(page.pintuMasuk?.idKatalog).toBe('KUL-01')
    const grouped = page.kelompok.flatMap((group) =>
      group.items.map((i) => i.idKatalog)
    )
    expect(grouped).not.toContain('KUL-01')
  })

  it('never shows an offer that is not ready', () => {
    const all = [page.pintuMasuk, ...page.kelompok.flatMap((g) => g.items)]
    expect(all.map((i) => i?.idKatalog)).not.toContain('KUL-05')
    expect(page.ditahan).toBe(1)
  })

  it('orders groups bot, workflow, channel, numbers', () => {
    expect(page.kelompok.map((g) => g.label)).toEqual([
      'Alur kerja yang berjalan tanpa dikejar',
      'Angka yang memberi tahu lebih dulu',
    ])
  })

  it('ends every impact with a stop, as a sentence on the page', () => {
    expect(page.kelompok[0]?.items[0]?.dampak).toBe('Pesanan tercatat.')
  })

  it('adds the consent sentence when an offer sends messages, and always the commission', () => {
    expect(page.batas).toContain('setuju menerimanya')
    expect(page.batas).toContain('mitra membayar kami komisi')
  })

  it('lists a mapped bridge as a candidate until a sentence is written', () => {
    expect(page.kandidatJembatan).toEqual(['FNB-01'])
    expect(page.jembatan).toEqual([])
  })

  it('uses an approved override in place of derived text', () => {
    const approved = deriveSituation(source, offers, [], {
      situasi: 'Untuk warung.',
      jembatan: [{ offer: 'FNB-01', kalimat: 'Kalimat jembatan.' }],
    })
    expect(approved.situasi).toBe('Untuk warung.')
    expect(approved.jembatan[0]?.kalimat).toBe('Kalimat jembatan.')
  })

  it('warns when a chapter has fewer than three ready offers', () => {
    const thin = deriveSituation(source, offers.slice(0, 2), [])
    expect(thin.catatan.join()).toContain('paling sedikit tiga')
    expect(page.catatan.join()).not.toContain('paling sedikit tiga')
  })

  it('keeps every catalogue code out of the page a buyer reads', () => {
    const markdown = situationMarkdown([page], 'Uji')
    const forBuyer = markdown.replace(/_Internal:.*_/g, '')
    expect(forBuyer).not.toMatch(/[A-Z]{3}-\d{2}/)
  })
})

describe('situationSlug', () => {
  it('keeps the first named buyer', () => {
    expect(situationSlug('Kuliner dan F&B')).toBe('kuliner')
    expect(
      situationSlug('Jasa lokal: salon, bengkel, laundry, kos, dan rental')
    ).toBe('jasa-lokal')
    expect(situationSlug('Lintas sektor: untuk usaha apa pun')).toBe(
      'lintas-sektor'
    )
  })
})
