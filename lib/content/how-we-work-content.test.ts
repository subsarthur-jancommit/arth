import { describe, expect, it } from 'bun:test'

import {
  type HowWeWorkSource,
  resolveHowWeWorkContent,
} from './how-we-work-content'

const validContent: HowWeWorkSource = {
  _id: 'howWeWork',
  janji: [{ _key: 'scope', judul: 'Lingkup', kalimat: 'Lingkup disepakati.' }],
  hakMilikKlien: 'Hak milik ditulis dalam kesepakatan.',
  pengungkapanKomisi: 'Komisi diungkapkan sebelum kerja dimulai.',
  yangTidakDijual: 'Arthur tidak menjual hasil yang tidak dikendalikan.',
  wilayah: [{ _key: 'subang', nama: 'Subang' }],
  contohFormat: 'Keputusan dicatat bersama penanggung jawabnya.',
  metadata: {
    title: null,
    description: null,
    keywords: null,
    noIndex: true,
  },
}

describe('resolveHowWeWorkContent', () => {
  it('keeps a complete work-method document', () => {
    const result = resolveHowWeWorkContent(validContent)
    expect(result).not.toBeNull()
    expect(result?._id).toBe('howWeWork')
    expect(result?.janji).toHaveLength(1)
  })

  it('keeps the page when the optional work-format example is empty', () => {
    expect(
      resolveHowWeWorkContent({ ...validContent, contohFormat: null })
    ).not.toBeNull()
  })

  it('withholds incomplete promises', () => {
    expect(
      resolveHowWeWorkContent({
        ...validContent,
        janji: [{ _key: 'scope', judul: '', kalimat: 'Lingkup disepakati.' }],
      })
    ).toBeNull()
  })

  it('withholds editorial placeholders from any reader field', () => {
    expect(
      resolveHowWeWorkContent({
        ...validContent,
        contohFormat: '[PERLU PEMILIK] format laporan',
      })
    ).toBeNull()
  })
})
