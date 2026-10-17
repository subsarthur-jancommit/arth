import { describe, expect, it } from 'bun:test'

import type { SituationPage } from '@/lib/content/situation-pages'

import {
  audienceOf,
  draftDocuments,
  draftOffer,
  parseBridges,
  parseCatalog,
  parseSituations,
  reviewMarkdown,
} from './import-catalog'

/*
 * A two-row slice in the master brief's own shape: a section heading, an
 * explanatory table the parser must skip, and an offer table.
 */
const SIDE = `# Sisi B: untuk yang ingin hasil akhir siap pakai

## Cara membaca tabel

| Kolom | Artinya |
| --- | --- |
| Jenis | Bot, Workflow |

## Kuliner dan F&B

| ID | Offer | Dampak bagi pembeli | Pembeli | Jenis | Lapis | Bidang |
| --- | --- | --- | --- | --- | --- | --- |
| KUL-01 | **Bot pesan-antar WhatsApp** | Pesanan diterima, dicatat, dan ditagih kapan pun | Warung/kedai | Bot | L2 | B5 |
| KUL-07 | **Buka langganan makan harian** | Pendapatan berulang dari pekerja kantor | Warung/kedai | Pasar | L3 | B2 |
| LIN-09 | **Pembacaan otomatis nota, faktur, dan KTP** † | Data terbaca dari foto | Admin dan keuangan | Workflow | L2 | B9 |
`

const rows = parseCatalog(SIDE, { unit: 'teknologi', side: 'B' })

/** The lanes as the catalogue alone sets them, before any handwritten answer. */
const NO_OVERRIDES = new Map()

describe('parseCatalog', () => {
  it('reads offer rows and skips explanatory tables', () => {
    expect(rows.map((row) => row.idKatalog)).toEqual([
      'KUL-01',
      'KUL-07',
      'LIN-09',
    ])
    expect(rows[0]?.situation).toBe('Kuliner dan F&B')
  })

  it('strips bold and catalogue marks from the title, and keeps the mark apart', () => {
    expect(rows[2]?.title).toBe('Pembacaan otomatis nota, faktur, dan KTP')
    expect(rows[2]?.mark).toBe('†')
  })

  it('drops a Peekabo research service code from the title', () => {
    const [row] = parseCatalog(
      `## Produksi kreatif (PRD)

| ID | Offer | Dampak bagi pembeli | Pembeli | Jenis | Masalah | Model | Asal |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1B-04 | **Foto produk dan lifestyle (02.B)** | Produk tampil layak jual | Brand, seller | Aset | Dibeli | K3 | A |
`,
      { unit: 'peekabo', side: 'A' }
    )
    expect(row?.title).toBe('Foto produk dan lifestyle')
  })
})

describe('draftDocuments', () => {
  const [row] = parseCatalog(
    `## Produksi kreatif (PRD)

| ID | Offer | Dampak bagi pembeli | Pembeli | Jenis | Masalah | Model | Asal |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1B-04 | **Foto produk dan lifestyle** | Produk tampil layak jual | Brand, seller | Aset | Dibeli | K3 | A |
`,
    { unit: 'peekabo', side: 'A' }
  )
  const draft = draftOffer(row!)
  const page: SituationPage = {
    unit: 'peekabo',
    side: 'A',
    nama: 'Produksi kreatif',
    slug: 'produksi-kreatif',
    kutipan: '“Kontennya harus keluar.”',
    situasi: 'Situasi.',
    pintuMasuk: {
      judul: draft.judul,
      dampak: draft.dampak,
      untukSiapa: draft.untukSiapa,
      syarat: undefined,
      idKatalog: '1B-04',
    },
    kelompok: [],
    batas: 'Batas.',
    ajakan: { label: 'Mulai', sesudahnya: 'Sesudahnya.' },
    metadata: { judul: 'Judul', deskripsi: 'Deskripsi.' },
    jembatan: [],
    kandidatJembatan: [],
    ditahan: 0,
    catatan: [],
  }

  it('codes a Peekabo chapter by its heading, not by its first offer', () => {
    const [bab] = draftDocuments(page, 'side-id', [draft])
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line))
    expect(bab.idKatalog).toBe('PRD')
  })
})

describe('draftOffer', () => {
  it('sends a clean row down the automatic lane, with no catalogue code in reader fields', () => {
    const draft = draftOffer(rows[0]!)
    expect(draft.lane).toBe('otomatis')
    expect(draft.model).toBe('sistem-dipasang')
    expect(draft.jenis).toBe('Bot yang bekerja sendiri')
    expect(draft.untukSiapa).toBe('Untuk pemilik warung dan kedai')
    expect(draft.slug).toBe('bot-pesan-antar-whatsapp')
    for (const field of [
      draft.judul,
      draft.dampak,
      draft.untukSiapa,
      draft.slug,
    ]) {
      expect(field).not.toMatch(/[A-Z]{3}-\d{2}/)
    }
  })

  it('hands an impact that promises income to a writer (Aturan isi 3)', () => {
    const draft = draftOffer(rows[1]!, NO_OVERRIDES)
    expect(draft.lane).toBe('tulis-tangan')
    expect(draft.reasons.join()).toContain('dampak')
  })

  it('hands a † offer to a writer for its safe wording', () => {
    const draft = draftOffer(rows[2]!, NO_OVERRIDES)
    expect(draft.lane).toBe('tulis-tangan')
    expect(draft.reasons.join()).toContain('rumusan aman')
  })

  it('holds a row that waits on an open decision', () => {
    const draft = draftOffer({
      ...rows[0]!,
      idKatalog: 'KEU-01',
      situation: 'Keuangan, trading, dan pembiayaan',
    })
    expect(draft.reasons.join()).toContain('posisi bot trading')
  })
})

describe('handwritten overrides', () => {
  const kul07 = rows[1]!
  const lin09 = rows[2]!

  it('settles a flagged impact with the rewritten one', () => {
    const draft = draftOffer(
      kul07,
      new Map([
        [
          'KUL-07',
          {
            keputusan: 'ditulis-ulang',
            dampak: 'Langganan makan harian, ditagih otomatis.',
          },
        ],
      ])
    )
    expect(draft.lane).toBe('otomatis')
    expect(draft.dampak).toBe('Langganan makan harian, ditagih otomatis.')
    expect(draft.ditinjau).toBe(true)
  })

  it('settles † only with a safe wording, and carries its condition', () => {
    const rewritten = draftOffer(
      lin09,
      new Map([['LIN-09', { keputusan: 'ditulis-ulang', dampak: 'x' }]])
    )
    expect(rewritten.lane).toBe('tulis-tangan')

    const safe = draftOffer(
      lin09,
      new Map([
        [
          'LIN-09',
          {
            keputusan: 'rumusan-aman',
            syarat: 'Data KTP dijaga sesuai UU PDP.',
          },
        ],
      ])
    )
    expect(safe.lane).toBe('otomatis')
    expect(safe.syarat).toBe('Data KTP dijaga sesuai UU PDP.')
  })

  it('never releases a row held by an open decision', () => {
    const draft = draftOffer(
      { ...rows[0]!, idKatalog: 'KEU-01', situation: 'Keuangan' },
      new Map([['KEU-01', { keputusan: 'rumusan-aman', syarat: 'x' }]])
    )
    expect(draft.lane).toBe('tulis-tangan')
    expect(draft.reasons.join()).toContain('posisi bot trading')
  })

  it('lets an agent hold a row the catalogue did not mark', () => {
    const draft = draftOffer(
      rows[0]!,
      new Map([['KUL-01', { keputusan: 'ditahan', alasan: 'uji' }]])
    )
    expect(draft.lane).toBe('tulis-tangan')
  })
})

describe('reviewMarkdown', () => {
  it('lists only reviewed rows of the unit asked for, with the code last', () => {
    const reviewed = draftOffer(
      rows[0]!,
      new Map([['KUL-01', { keputusan: 'tetap' as const }]])
    )
    const other = {
      ...reviewed,
      unit: 'konstruksi' as const,
      idKatalog: 'RAK-03',
    }
    const markdown = reviewMarkdown([reviewed, other], 'teknologi')
    expect(markdown).toContain('## Sistem yang dipasang')
    expect(markdown).toContain('| siap | KUL-01 |')
    expect(markdown).not.toContain('RAK-03')
  })
})

describe('audienceOf', () => {
  it('addresses a place of business as its owner, as the approved Kuliner cards do', () => {
    expect(audienceOf('Warung/kedai')).toBe('Untuk pemilik warung dan kedai')
    expect(audienceOf('Franchise/multi-outlet')).toBe(
      'Untuk pemilik franchise dan usaha banyak outlet'
    )
  })

  it('keeps acronyms and roles as written', () => {
    expect(audienceOf('UMKM produksi')).toBe('Untuk UMKM produksi')
    expect(audienceOf('BUMDes')).toBe('Untuk BUMDes')
    expect(audienceOf('Admin dan keuangan')).toBe('Untuk admin dan keuangan')
  })
})

describe('the Pelaku proyek market column', () => {
  const side = [
    '## Tenaga kerja (modul B)',
    '',
    '| ID | Offer | Dampak bagi pembeli | Pembeli | Jenis | Pasar | Modul |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    '| TNK-01 | **Tukang harian** | Tukang datang sesuai jadwal | Kontraktor utama | Celah | Keduanya | B |',
    '| TNK-02 | **Tukang proyek sekolah** | Tukang datang | Kontraktor utama | Celah | Pemerintah | B |',
  ].join('\n')
  const [both, government] = parseCatalog(side, {
    unit: 'konstruksi',
    side: 'A',
  })

  it('reads Pasar into the filter value the chapter page uses', () => {
    expect(both?.market).toBe('keduanya')
    expect(government?.market).toBe('pemerintah')
  })

  it('carries it to the draft, and leaves a side without the column alone', () => {
    expect(both && draftOffer(both, NO_OVERRIDES).pasar).toBe('keduanya')
    expect(rows[0]?.market).toBeUndefined()
    expect(rows[0] && 'pasar' in draftOffer(rows[0], NO_OVERRIDES)).toBe(false)
  })
})

describe('parseSituations and parseBridges', () => {
  it('reads the buyer line and quote of each chapter', () => {
    const [kuliner] = parseSituations(
      [
        '## Kuliner dan F&B',
        '',
        '**Pembeli:** Warung dan kedai.',
        '',
        '**Yang biasa mereka katakan:** “Pesanan saya bercampur di chat.”',
      ].join('\n'),
      { unit: 'teknologi', side: 'B' }
    )
    expect(kuliner?.nama).toBe('Kuliner dan F&B')
    expect(kuliner?.pembeli).toBe('Warung dan kedai.')
    expect(kuliner?.kutipan).toBe('“Pesanan saya bercampur di chat.”')
  })

  it('keeps a chapter that has a quote but no buyer line', () => {
    const [rakitan] = parseSituations(
      [
        '## Paket rakitan menurut profil pembeli',
        '',
        '**Yang biasa mereka katakan:** “Saya butuh paket yang cocok.”',
      ].join('\n'),
      { unit: 'konstruksi', side: 'A' }
    )
    expect(rakitan?.nama).toBe('Paket rakitan menurut profil pembeli')
    expect(rakitan?.pembeli).toBe('')
  })

  it('reads one pair per bridge row and skips other tables', () => {
    const pairs = parseBridges(
      [
        '| Konstruksi | Teknologi | Rangkaian |',
        '| --- | --- | --- |',
        '| FNB-01 Kafe siap buka | KUL-02 Pesan dan bayar dari meja | Kafe baru |',
        '| Ukuran | 216 | 316 |',
      ].join('\n')
    )
    expect(pairs).toEqual([['FNB-01', 'KUL-02']])
  })
})
