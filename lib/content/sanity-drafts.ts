/**
 * Draft Sanity documents for a situation page and its offers, built from
 * the approved derivation (`situation-pages.ts`) and the handwritten answers.
 *
 * Pure: this file builds objects and never talks to Sanity. Writing them is
 * a separate act that waits for the owner's "ok tulis"
 * (`docs/PROSEDUR-KERJA.md` §6). Every document is a draft with status
 * `perlu-anda`; only the owner approves and publishes.
 *
 * Child-to-parent references are weak with `_strengthenOnPublish`, as
 * `docs` "Model isi Sanity" prescribes: a parent publishes first, and the
 * Studio strengthens the reference when the child is published.
 */

import type { OfferModel } from './offer-models'
import type { OfferPage } from './offer-pages'
import type { SituationPage } from './situation-pages'

const LOCALE = 'id'

const line = (value: string) => [
  { _key: LOCALE, _type: 'internationalizedArrayStringValue', value },
]
const text = (value: string) => [
  { _key: LOCALE, _type: 'internationalizedArrayTextValue', value },
]

const weakRef = (id: string, type: string) => ({
  _type: 'reference',
  _ref: id,
  _weak: true,
  _strengthenOnPublish: { type },
})

/** Stable ids, so writing again updates the same drafts. */
export const babId = (unit: string, side: string, slug: string) =>
  `arthur-bab-${unit}-${side}-${slug}`
export const offerId = (idKatalog: string) =>
  `arthur-offer-${idKatalog.toLowerCase()}`

const trace = (blok: string, sumber: string, rujukan: string) => ({
  _key: `${blok}-${rujukan}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  _type: 'object',
  blok,
  sumber,
  rujukan,
})

export type DraftOffer = {
  idKatalog: string
  model: OfferModel
  judul: string
  dampak: string
  untukSiapa: string
  jenis: string | undefined
  slug: string
  syarat: string | undefined
  /** True when the row has a handwritten answer in `catalog-overrides.ts`. */
  ditinjau?: boolean
}

export function babDraft(
  page: SituationPage,
  sideId: string,
  sideKey: string,
  urutan: number,
  catalogCode: string,
  handover = 'docs/R1-SITUASI-TEKNOLOGI.md'
) {
  return {
    _id: `drafts.${babId(page.unit, sideKey, page.slug)}`,
    _type: 'bab',
    sisi: weakRef(sideId, 'side'),
    nama: line(page.nama),
    slug: { _type: 'slug', current: page.slug },
    ...(page.pembeli ? { pembeli: line(page.pembeli) } : {}),
    kutipan: text(page.kutipan),
    situasi: text(page.situasi),
    urutan,
    batas: text(page.batas),
    // The schema keeps this reference weak for good: a bridge may point at
    // a page that is not published yet, and the reader page skips it.
    ...(page.jembatan.length > 0
      ? {
          jembatan: page.jembatan.map((bridge, index) => ({
            _key: `jembatan-${index}`,
            _type: 'object',
            offer: {
              _type: 'reference',
              _ref: offerId(bridge.idKatalog),
              _weak: true,
            },
            kalimat: text(bridge.kalimat),
          })),
        }
      : {}),
    ajakan: {
      label: line(page.ajakan.label),
      sesudahnya: text(page.ajakan.sesudahnya),
    },
    metadata: {
      _type: 'metadata',
      title: page.metadata.judul,
      description: page.metadata.deskripsi,
    },
    idKatalog: catalogCode,
    statusTinjauan: 'perlu-anda',
    ditulisOleh: 'agen',
    jejakSumber: [
      trace(
        page.salinan ? 'Nama, kutipan' : 'Nama, kutipan, situasi',
        'Master brief, bab di tabel sisi',
        catalogCode
      ),
      trace('Halaman', handover, page.slug),
      ...(page.salinan
        ? [
            trace(
              'Situasi, pembeli, batas, jembatan, mesin pencari',
              'lib/content/situation-overrides.ts',
              page.salinan
            ),
          ]
        : []),
    ],
  }
}

export function offerDraft(
  offer: DraftOffer,
  parentBabId: string,
  urutan: number,
  entry: boolean,
  page: OfferPage | undefined
) {
  return {
    _id: `drafts.${offerId(offer.idKatalog)}`,
    _type: 'offer',
    bab: weakRef(parentBabId, 'bab'),
    judul: line(offer.judul),
    slug: { _type: 'slug', current: offer.slug },
    dampak: text(offer.dampak),
    untukSiapa: line(offer.untukSiapa),
    jenis: line(offer.jenis ?? ''),
    ...(offer.syarat ? { syarat: text(offer.syarat) } : {}),
    urutan,
    pintuMasuk: entry,
    halamanSendiri: page !== undefined,
    model: offer.model,
    ...(page
      ? {
          situasi: text(page.situasi),
          batas: text(page.batas),
          tingkat: page.tingkat.map((item, index) => ({
            _key: `tingkat-${index}`,
            _type: 'object',
            nama: line(item.nama),
            kalimat: text(item.kalimat),
            poin: item.poin.map((point, pointIndex) => ({
              _key: `poin-${pointIndex}`,
              _type: 'object',
              teks: line(point),
            })),
          })),
          langkahPertama: {
            label: line(page.langkahPertama.label),
            sesudahnya: text(page.langkahPertama.sesudahnya),
          },
          metadata: {
            _type: 'metadata',
            title: page.metadata.title,
            description: page.metadata.description,
          },
        }
      : {}),
    idKatalog: offer.idKatalog,
    statusTinjauan: 'perlu-anda',
    ditulisOleh: 'agen',
    jejakSumber: [
      trace(
        'Judul, dampak, untuk siapa',
        'Master brief, baris offer',
        offer.idKatalog
      ),
      ...(offer.ditinjau
        ? [
            trace(
              'Jawaban tulis tangan',
              'lib/content/catalog-overrides.ts',
              offer.idKatalog
            ),
          ]
        : []),
    ],
  }
}
