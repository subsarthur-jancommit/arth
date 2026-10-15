import { describe, expect, it } from 'bun:test'

import { draftOffer, parseCatalog } from './import-catalog'

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
})

describe('draftOffer', () => {
  it('sends a clean row down the automatic lane, with no catalogue code in reader fields', () => {
    const draft = draftOffer(rows[0]!)
    expect(draft.lane).toBe('otomatis')
    expect(draft.model).toBe('sistem-dipasang')
    expect(draft.jenis).toBe('Bot yang bekerja sendiri')
    expect(draft.untukSiapa).toBe('Untuk warung dan kedai')
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
    const draft = draftOffer(rows[1]!)
    expect(draft.lane).toBe('tulis-tangan')
    expect(draft.reasons.join()).toContain('dampak')
  })

  it('hands a † offer to a writer for its safe wording', () => {
    const draft = draftOffer(rows[2]!)
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
