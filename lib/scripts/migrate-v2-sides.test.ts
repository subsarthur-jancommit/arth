import { describe, expect, it } from 'bun:test'

import { planSideMigration, type SideDocument } from './migrate-v2-sides'

const line = (value: string) => [
  { _key: 'id', _type: 'internationalizedArrayStringValue', value },
]

const published: SideDocument = {
  _id: 'side-pelaku-proyek',
  _type: 'side',
  kunci: 'pelaku-proyek',
  statusTinjauan: 'disetujui',
  unit: { _ref: 'unit-konstruksi', _type: 'reference' },
  caraMembeli: [
    {
      _key: 'cara-eceran',
      teks: line(
        'Eceran per masalah — saat Anda tahu bagian mana yang tak sanggup ditangani.'
      ),
    },
    { _key: 'cara-lain', teks: line('Langkah yang tidak dikenal.') },
  ],
}

describe('V0 side migration', () => {
  it('splits each known step into a name and a description, without a dash', () => {
    const [plan] = planSideMigration([published])
    expect(plan?.steps[0]).toEqual({
      key: 'cara-eceran',
      before:
        'Eceran per masalah — saat Anda tahu bagian mana yang tak sanggup ditangani.',
      nama: 'Eceran per masalah',
      keterangan:
        'Cocok bila Anda tahu bagian mana yang tak sanggup Anda tangani.',
    })
    expect(JSON.stringify(plan?.set['caraMembeli'])).not.toMatch(/[–—]/u)
  })

  it('keeps an unknown step as its old line, so nothing is lost silently', () => {
    const [plan] = planSideMigration([published])
    expect(plan?.steps[1]).toMatchObject({
      key: 'cara-lain',
      nama: 'Langkah yang tidak dikenal.',
      keterangan: '',
    })
  })

  it('sets only the migrated fields, marked for the owner', () => {
    const [plan] = planSideMigration([{ ...published, _rev: 'rev-1' }])
    expect(plan?.draftId).toBe('drafts.side-pelaku-proyek')
    expect(plan?.targetId).toBe('side-pelaku-proyek')
    expect(plan?.revision).toBe('rev-1')
    expect(plan?.fromPublished).toBe(true)
    expect(
      Object.keys(plan?.set ?? {}).toSorted((a, b) => a.localeCompare(b))
    ).toEqual(['caraMembeli', 'ditulisOleh', 'pembeli', 'statusTinjauan'])
    expect(plan?.set['statusTinjauan']).toBe('perlu-anda')
    expect(plan?.set['pembeli']).toHaveLength(6)
  })

  it('works from the draft when a side has one', () => {
    const plans = planSideMigration([
      published,
      {
        ...published,
        _id: 'drafts.side-pelaku-proyek',
        statusTinjauan: 'perlu-anda',
      },
    ])
    expect(plans).toHaveLength(1)
    expect(plans[0]?.fromPublished).toBe(false)
  })
})
