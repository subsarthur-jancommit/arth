import { describe, expect, it } from 'bun:test'

import { checkDocument, checkText, sentences } from './style-gate'

const rules = (text: string, verbatim = false) =>
  checkText(text, { verbatim }).map((finding) => finding.rule)

describe('style gate', () => {
  it('rejects a dash used as a pause, and keeps a hyphen inside a word', () => {
    expect(rules('Eceran per masalah — saat Anda tahu bagiannya.')).toContain(
      'tanda-pisah'
    )
    expect(rules('Eceran per masalah - saat Anda tahu bagiannya.')).toContain(
      'tanda-pisah'
    )
    expect(rules('Bot pesan-antar WhatsApp untuk kedai.')).toEqual([])
  })

  it('rejects an exclamation mark, an emoji, and a catalogue code', () => {
    expect(rules('Daftar sekarang!')).toEqual(['tanda-seru'])
    expect(rules('Pesanan masuk 🚀')).toEqual(['emoji'])
    expect(rules('© 2026 Arthur.')).toEqual([])
    expect(rules('Lihat RAK-03 untuk paketnya.')).toEqual(['kode-katalog'])
    expect(rules('Dasbor komisi 3B-07.')).toEqual(['kode-katalog'])
  })

  it('warns on a sentence over 25 words and on listed phrases', () => {
    const long = `${Array.from({ length: 26 }, () => 'kata').join(' ')}.`
    expect(rules(long)).toEqual(['kalimat-panjang'])
    expect(rules('Kami kontraktor terpercaya.')).toEqual(['frasa: terpercaya'])
    expect(rules('Solusi tepat untuk usaha Anda.')).toContain('frasa: solusi')
  })

  it('does not read a listed word inside another word', () => {
    expect(rules('Kami mengandalkan pemasok setempat.')).toEqual([])
  })

  it('spares ready-to-publish text the warnings, not the errors', () => {
    const header =
      'Usaha jarang berhenti karena satu masalah besar. Usaha tersendat di tiga tempat: proyek yang macet di celah administrasi, tenaga, material, dan modal; pekerjaan berulang yang masih dikerjakan tangan; dan pasar yang belum cukup mengenal, memercayai, dan membeli.'
    expect(rules(header, true)).toEqual([])
    expect(rules('Judul — siap tayang', true)).toEqual(['tanda-pisah'])
  })

  it('splits sentences on terminal punctuation', () => {
    expect(sentences('Satu. Dua? Tiga; empat: lima')).toEqual([
      'Satu.',
      'Dua?',
      'Tiga;',
      'empat:',
      'lima',
    ])
  })

  it('walks a Sanity document, skipping internal and machine fields', () => {
    const findings = checkDocument(
      {
        _id: 'unit-konstruksi',
        kunci: 'konstruksi',
        judul: [{ _key: 'id', value: 'Isi celahnya. Bangun sampai jadi.' }],
        pembuka: [{ _key: 'id', value: 'Kami terpercaya — sejak dulu.' }],
        caraKerja: [{ _key: 'a', teks: [{ _key: 'id', value: 'Halo!' }] }],
        jejakSumber: [{ _key: 'b', sumber: 'RAK-03 — catatan' }],
        slug: { current: 'rak-03' },
      },
      ['pembuka']
    )

    expect(findings.map(({ path, rule }) => `${path} ${rule}`)).toEqual([
      'pembuka[0] tanda-pisah',
      'caraKerja[0].teks[0] tanda-seru',
    ])
  })
})
