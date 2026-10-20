import { describe, expect, it } from 'bun:test'

import { OFFER_PAGES } from './offer-pages'
import { babDraft, offerDraft } from './sanity-drafts'
import type { SituationPage } from './situation-pages'

const page: SituationPage = {
  unit: 'teknologi',
  side: 'B',
  nama: 'Kuliner dan F&B',
  slug: 'kuliner',
  kutipan: '“Pesanan saya bercampur di chat.”',
  situasi: 'Untuk warung.',
  pintuMasuk: undefined,
  kelompok: [],
  batas: 'Batas.',
  ajakan: { label: 'Minta sesi diagnosis', sesudahnya: 'Sesudahnya.' },
  metadata: { judul: 'Judul', deskripsi: 'Deskripsi' },
  jembatan: [],
  kandidatJembatan: [],
  ditahan: 0,
  catatan: [],
}

const offer = {
  idKatalog: 'KUL-01',
  model: 'sistem-dipasang' as const,
  judul: 'Bot pesan-antar WhatsApp',
  dampak: 'Bot mencatat pesanan.',
  untukSiapa: 'Untuk pemilik warung dan kedai',
  jenis: 'Bot yang bekerja sendiri',
  slug: 'bot-pesan-antar-whatsapp',
  syarat: undefined,
}

describe('babDraft', () => {
  const bab = babDraft(page, 'side-id', 'siap-pakai', 0, 'KUL')

  it('is a draft waiting for the owner, never a published document', () => {
    expect(bab._id.startsWith('drafts.')).toBe(true)
    expect(bab.statusTinjauan).toBe('perlu-anda')
  })

  it('points at its side with a weak reference strengthened on publish', () => {
    expect(bab.sisi).toEqual({
      _type: 'reference',
      _ref: 'side-id',
      _weak: true,
      _strengthenOnPublish: { type: 'side' },
    })
  })

  it('writes reader text in Indonesian, in the localized array shape', () => {
    expect(bab.nama).toEqual([
      {
        _key: 'id',
        _type: 'internationalizedArrayStringValue',
        value: 'Kuliner dan F&B',
      },
    ])
    expect(bab.kutipan[0]?._type).toBe('internationalizedArrayTextValue')
  })
})

describe('babDraft for a shortlisted chapter', () => {
  const bab = babDraft(
    {
      ...page,
      unit: 'konstruksi',
      slug: 'fnb',
      pembeli: 'Untuk pemilik kafe dan resto.',
      jembatan: [{ kalimat: 'Kalimat jembatan.', idKatalog: 'KUL-02' }],
    },
    'side-id',
    'pemilik-bangunan',
    2,
    'FNB',
    'docs/V3-SERAH-W2.md'
  )

  it('lives under its own unit and side, at its place in the side', () => {
    expect(bab._id).toBe('drafts.arthur-bab-konstruksi-pemilik-bangunan-fnb')
    expect(bab.urutan).toBe(2)
  })

  it('writes the buyers as one reader line', () => {
    expect('pembeli' in bab && bab.pembeli[0]?.value).toBe(
      'Untuk pemilik kafe dan resto.'
    )
  })

  it('points a bridge at its offer with a reference that stays weak', () => {
    expect('jembatan' in bab && bab.jembatan[0]?.offer).toEqual({
      _type: 'reference',
      _ref: 'arthur-offer-kul-02',
      _weak: true,
    })
  })

  it('traces the page to the handover it was approved from', () => {
    expect(bab.jejakSumber[1]?.sumber).toBe('docs/V3-SERAH-W2.md')
  })

  it('traces handwritten chapter copy to the file that holds it', () => {
    const traced = babDraft(
      { ...page, salinan: 'konstruksi/B/fnb' },
      'side-id',
      'pemilik-bangunan',
      2,
      'FNB'
    ).jejakSumber
    expect(traced[0]?.blok).toBe('Nama, kutipan')
    expect(traced[2]).toMatchObject({
      sumber: 'lib/content/situation-overrides.ts',
      rujukan: 'konstruksi/B/fnb',
    })
  })

  it('leaves both fields out when the chapter has neither', () => {
    const plain = babDraft(page, 'side-id', 'siap-pakai', 0, 'KUL')
    expect('pembeli' in plain).toBe(false)
    expect('jembatan' in plain).toBe(false)
  })
})

describe('offerDraft', () => {
  it('keeps the catalogue code in the internal fields only', () => {
    const draft = offerDraft(offer, 'bab-id', 3, false, undefined)
    expect(draft.idKatalog).toBe('KUL-01')
    const reader = JSON.stringify([
      draft.judul,
      draft.dampak,
      draft.untukSiapa,
      draft.jenis,
      draft.slug,
    ])
    expect(reader).not.toMatch(/[A-Z]{3}-\d{2}/)
  })

  it('names the handwritten answers file only for a row that has one', () => {
    const sources = (ditinjau: boolean) =>
      offerDraft(
        { ...offer, ditinjau },
        'b',
        0,
        false,
        undefined
      ).jejakSumber.map((item) => item.sumber)
    expect(sources(true)).toContain('lib/content/catalog-overrides.ts')
    expect(sources(false)).not.toContain('lib/content/catalog-overrides.ts')
  })

  it('gives a list-only offer no page blocks', () => {
    const draft = offerDraft(offer, 'bab-id', 3, false, undefined)
    expect(draft.halamanSendiri).toBe(false)
    expect('tingkat' in draft).toBe(false)
    expect('situasi' in draft).toBe(false)
  })

  it('writes the approved page blocks for an offer with its own page', () => {
    const draft = offerDraft(
      offer,
      'bab-id',
      0,
      true,
      OFFER_PAGES.get('KUL-01')
    )
    expect(draft.halamanSendiri).toBe(true)
    expect(draft.pintuMasuk).toBe(true)
    expect('tingkat' in draft && draft.tingkat.length).toBe(2)
  })

  it('carries a † condition only when there is one', () => {
    expect('syarat' in offerDraft(offer, 'b', 0, false, undefined)).toBe(false)
    expect(
      offerDraft(
        { ...offer, syarat: 'Hanya dari data publik.' },
        'b',
        0,
        false,
        undefined
      ).syarat
    ).toEqual([
      {
        _key: 'id',
        _type: 'internationalizedArrayTextValue',
        value: 'Hanya dari data publik.',
      },
    ])
  })
})
