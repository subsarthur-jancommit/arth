import { describe, expect, it } from 'bun:test'

import type { ShortlistChapter } from './shortlist'
import {
  deriveSituation,
  readerName,
  shortlistSituation,
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

describe('shortlistSituation', () => {
  const chapter: ShortlistChapter = {
    unit: 'teknologi',
    side: 'B',
    situation: 'Kuliner dan F&B',
    entri: 'KUL-02',
    pilihan: [
      { id: 'KUL-03', alasan: 'a' },
      { id: 'KUL-02', alasan: 'b' },
      { id: 'KUL-01', alasan: 'c' },
    ],
    keputusan: 'Disetujui',
  }
  const copy = {
    situasi: 'Pesanan di chat bercampur.',
    batas: 'Batas bab.',
    metadata: { judul: 'Judul', deskripsi: 'Deskripsi' },
  }
  const page = shortlistSituation(chapter, source, offers, [], copy)
  const shown = () =>
    [page.pintuMasuk, ...page.kelompok.flatMap((g) => g.items)].map(
      (i) => i?.idKatalog
    )

  it('shows exactly the decided offers, entry first, then in decided order', () => {
    expect(shown()).toEqual(['KUL-02', 'KUL-03', 'KUL-01'])
  })

  it('groups by type in the order the shortlist first places each type', () => {
    expect(page.kelompok.map((g) => g.label)).toEqual([
      'Angka yang memberi tahu lebih dulu',
      'Bot yang bekerja sendiri',
    ])
  })

  it('is complete when every block has its copy', () => {
    expect(page.catatan).toEqual([])
    expect(page.batas).toBe('Batas bab.')
    expect(page.situasi).toBe('Pesanan di chat bercampur.')
  })

  it('counts as held only what is not ready, not what was left unpicked', () => {
    expect(page.ditahan).toBe(1)
  })

  it('drops an offer that is not ready or not in the chapter, and says so', () => {
    const odd = shortlistSituation(
      {
        ...chapter,
        pilihan: [
          ...chapter.pilihan,
          { id: 'KUL-05', alasan: 'd' },
          { id: 'FNB-01', alasan: 'e' },
        ],
      },
      source,
      offers,
      [],
      copy
    )
    const all = [odd.pintuMasuk, ...odd.kelompok.flatMap((g) => g.items)]
    expect(all.map((i) => i?.idKatalog)).toEqual(['KUL-02', 'KUL-03', 'KUL-01'])
    expect(odd.catatan).toContain('KUL-05 belum siap tayang.')
    expect(odd.catatan).toContain('FNB-01 tidak ada di bab ini.')
  })

  it('lists every block still missing instead of guessing it', () => {
    const bare = shortlistSituation(chapter, source, offers, [])
    expect(bare.catatan).toEqual([
      'Batas bab ini belum ditulis.',
      'Situasi bab ini belum ditulis.',
      'Teks mesin pencari belum ditulis.',
    ])
  })

  it('flags a list under three and an entry that is not shown', () => {
    const thin = shortlistSituation(
      { ...chapter, entri: 'KUL-08', pilihan: chapter.pilihan.slice(0, 2) },
      source,
      offers,
      [],
      copy
    )
    expect(thin.catatan.join(' ')).toContain('paling sedikit tiga')
    expect(thin.catatan.join(' ')).toContain('Pintu masuk tidak ada')
  })

  it('takes the first step of a Konstruksi side from that side', () => {
    const fnb = shortlistSituation(
      {
        ...chapter,
        unit: 'konstruksi',
        situation: 'Konstruksi F&B (lapis 3)',
        entri: 'FNB-01',
        pilihan: [{ id: 'FNB-01', alasan: 'a' }],
      },
      { ...source, unit: 'konstruksi', nama: 'Konstruksi F&B (lapis 3)' },
      offers,
      [],
      { ...copy, slug: 'fnb' }
    )
    expect(fnb.nama).toBe('Konstruksi F&B')
    expect(fnb.slug).toBe('fnb')
    expect(fnb.ajakan.label).toBe('Ceritakan bangunannya')
  })

  it('says a chapter held whole gets no page', () => {
    const held = shortlistSituation(
      { ...chapter, pilihan: [], ditahanBab: 'Menunggu keputusan.' },
      source,
      offers,
      [],
      copy
    )
    expect(held.catatan[0]).toContain('ditahan utuh')
    expect(held.catatan.join(' ')).not.toContain('paling sedikit tiga')
  })
})

describe('readerName', () => {
  it('drops the agent labels and keeps the reader words', () => {
    expect(readerName('Konstruksi F&B (lapis 3)')).toBe('Konstruksi F&B')
    expect(readerName('Tenaga kerja (modul B)')).toBe('Tenaga kerja')
    expect(readerName('Nilai tambah lewat mitra (jembatan)')).toBe(
      'Nilai tambah lewat mitra'
    )
    expect(readerName('Kuliner dan F&B')).toBe('Kuliner dan F&B')
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
