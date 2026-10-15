import { describe, expect, it } from 'bun:test'

import {
  checkGraph,
  type GraphDocument,
  graphReport,
  latestVersions,
} from './content-graph'

const text = (value: string) => [{ _key: 'id', value }]
const ok = 'disetujui'

const unit: GraphDocument = {
  _id: 'unit-teknologi',
  _type: 'unit',
  kunci: 'teknologi',
  statusTinjauan: ok,
}
const side: GraphDocument = {
  _id: 'side-siap-pakai',
  _type: 'side',
  kunci: 'siap-pakai',
  unit: { _ref: 'unit-teknologi' },
  statusTinjauan: ok,
}
const chapter: GraphDocument = {
  _id: 'bab-kuliner',
  _type: 'bab',
  sisi: { _ref: 'side-siap-pakai' },
  slug: { current: 'kuliner' },
  kutipan: text('Pesanan saya bercampur di chat.'),
  statusTinjauan: ok,
}
const offer = (
  n: number,
  extra: Partial<GraphDocument> = {}
): GraphDocument => ({
  _id: `offer-${n}`,
  _type: 'offer',
  bab: { _ref: 'bab-kuliner' },
  slug: { current: `pekerjaan-${n}` },
  judul: text(`Pekerjaan ${n}`),
  statusTinjauan: ok,
  ...extra,
})

const checks = (documents: GraphDocument[]) =>
  checkGraph(documents).map((finding) => `${finding.id} ${finding.check}`)

describe('content graph', () => {
  it('passes a coherent chapter with three to seven offers', () => {
    expect(checks([unit, side, chapter, offer(1), offer(2), offer(3)])).toEqual(
      []
    )
  })

  it('reports a chapter outside three to seven offers', () => {
    expect(checks([unit, side, chapter, offer(1)])).toEqual([
      'bab-kuliner bab-terlalu-sedikit',
    ])
    const eleven = Array.from({ length: 11 }, (_, index) => offer(index + 1))
    expect(checks([unit, side, chapter, ...eleven])).toEqual([
      'bab-kuliner bab-terlalu-banyak',
    ])
  })

  it('reports a missing parent and an approved child under an unapproved parent', () => {
    expect(
      checks([unit, side, offer(1, { bab: { _ref: 'bab-hilang' } })])
    ).toEqual(['offer-1 induk-hilang'])
    expect(
      checks([unit, { ...side, statusTinjauan: 'perlu-anda' }, chapter])
    ).toContain('bab-kuliner induk-belum-disetujui')
  })

  it('reports a side key that is not one of its unit’s sides', () => {
    expect(checks([unit, { ...side, kunci: 'pelaku-proyek' }])).toContain(
      'side-siap-pakai kunci-sisi'
    )
  })

  it('reports a slug used twice under the same chapter', () => {
    expect(
      checks([
        unit,
        side,
        chapter,
        offer(1),
        offer(2),
        offer(3, { slug: { current: 'pekerjaan-1' } }),
      ])
    ).toContain('offer-3 slug-ganda')
  })

  it('reports a bridge to an offer readers cannot open', () => {
    expect(
      checks([
        unit,
        side,
        chapter,
        offer(1, { jembatan: { offer: { _ref: 'offer-lain' } } }),
        offer(2),
        offer(3),
      ])
    ).toContain('offer-1 rujukan-belum-terbit')
  })

  it('carries the style gate, sparing verbatim fields its warnings', () => {
    expect(
      checks([
        unit,
        side,
        chapter,
        offer(1, { dampak: text('Pesanan masuk — cepat!') }),
        offer(2),
        offer(3),
      ])
    ).toEqual(['offer-1 gaya: tanda-pisah', 'offer-1 gaya: tanda-seru'])
  })

  it('reads the draft over the published version', () => {
    const latest = latestVersions([
      chapter,
      { ...chapter, _id: 'drafts.bab-kuliner', statusTinjauan: 'perlu-anda' },
    ])
    expect(latest).toHaveLength(1)
    expect(latest[0]?.statusTinjauan).toBe('perlu-anda')
  })

  it('reads situations only on the home settings, not chapter prose', () => {
    expect(
      checks([
        unit,
        side,
        { ...chapter, situasi: text('Kasir kewalahan saat ramai.') },
        offer(1),
        offer(2),
        offer(3),
        {
          _id: 'siteSettings',
          _type: 'siteSettings',
          statusTinjauan: ok,
          situasi: [{ _key: 'kuliner' }],
        },
      ])
    ).toEqual(['siteSettings situasi-tanpa-bab'])
  })

  it('prints a clean report when nothing is found', () => {
    expect(graphReport([], 4)).toContain('Grafik isi bersih.')
  })
})
