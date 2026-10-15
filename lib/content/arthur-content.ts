import { z } from 'zod'

import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import type { Side, Unit } from '@/lib/content/units'
import type { Locale } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  sidePagePreviewQuery,
  sidePageQuery,
  unitPagePreviewQuery,
  unitPageQuery,
} from '@/lib/integrations/sanity/queries'

const textSchema = z.string().trim().min(1)

const pointSchema = z.object({
  _key: z.string(),
  teks: textSchema.nullable(),
})

/** A labelled header paragraph, copied word for word from the master brief. */
const pillarSchema = z.object({
  _key: z.string(),
  lead: textSchema.nullable(),
  isi: textSchema.nullable(),
})

/** One way to buy, or one workflow step: a name, then when it fits or what happens. */
const buyingStepSchema = z.object({
  _key: z.string(),
  nama: textSchema.nullable(),
  keterangan: textSchema.nullable(),
  /** The pre-V2 one-line form, read until the migration has run. */
  teks: textSchema.nullable(),
})

const callToActionSchema = z.object({
  label: textSchema.nullable(),
  sesudahnya: textSchema.nullable(),
})

const offerCardSchema = z.object({
  _id: z.string(),
  slug: textSchema.nullable(),
  /** Whether the offer renders its own page (pattern approach, section 3). */
  punyaHalaman: z.boolean(),
  judul: textSchema.nullable(),
  dampak: textSchema.nullable(),
  untukSiapa: textSchema.nullable(),
  jenis: textSchema.nullable(),
  bab: z
    .object({
      slug: textSchema.nullable(),
      side: z
        .object({
          kunci: textSchema,
          unit: textSchema.nullable(),
        })
        .nullable(),
    })
    .nullable(),
})

const unitContentSchema = z.object({
  kunci: z.string(),
  nama: textSchema.nullable(),
  judul: textSchema.nullable(),
  pembuka: textSchema.nullable(),
  subjudul: textSchema.nullable(),
  pilar: z.array(pillarSchema).nullable(),
  ringkas: textSchema.nullable(),
  masalah: z.array(pointSchema).nullable(),
  caraKerja: z.array(pointSchema).nullable(),
  sisi: z
    .array(
      z.object({
        _id: z.string(),
        kunci: textSchema,
        nama: textSchema.nullable(),
        judul: textSchema.nullable(),
      })
    )
    .nullable(),
  contohOffer: z.array(offerCardSchema).nullable(),
  jembatan: z
    .array(
      z.object({
        _key: z.string(),
        kalimat: textSchema.nullable(),
        offer: offerCardSchema.nullable(),
      })
    )
    .nullable(),
  ajakan: callToActionSchema.nullable(),
})

const networkSchema = z.object({
  caraKerja: textSchema.nullable(),
  asalKomisi: textSchema.nullable(),
  yangTidakAda: textSchema.nullable(),
  syarat: textSchema.nullable(),
  ajakanDaftar: callToActionSchema.nullable(),
})

const sideContentSchema = z.object({
  kunci: z.string(),
  nama: textSchema.nullable(),
  judul: textSchema.nullable(),
  pembeli: z.array(pointSchema).nullable(),
  caraMembeli: z.array(buyingStepSchema).nullable(),
  langkahPertama: callToActionSchema.nullable(),
  bab: z
    .array(
      z.object({
        _id: z.string(),
        slug: textSchema.nullable(),
        nama: textSchema.nullable(),
        kutipan: textSchema.nullable(),
        situasi: textSchema.nullable(),
        urutan: z.number().nullable(),
        jumlahOffer: z.number().int().nonnegative(),
        jenis: z.array(textSchema).nullable(),
        pintuMasuk: z
          .object({
            _id: z.string(),
            slug: textSchema.nullable(),
            judul: textSchema.nullable(),
            dampak: textSchema.nullable(),
          })
          .nullable(),
      })
    )
    .nullable(),
  urutan: z.number().nullable(),
  jaringan: networkSchema.nullable(),
})

export type UnitContent = z.infer<typeof unitContentSchema>
export type SideContent = z.infer<typeof sideContentSchema>

/**
 * Reads only the fields F2-02 makes public for a unit route.
 *
 * The parsed boundary is deliberate: content records come from an external
 * dataset whose schema can be ahead of or behind this deployed application.
 * Returning null on an incomplete record preserves the explicitly marked
 * scaffold instead of rendering malformed or invented copy as Arthur's.
 */
export async function unitContent(
  locale: Locale,
  unit: Unit,
  preview = false
): Promise<UnitContent | null> {
  'use cache'

  if (!isConfigured('sanity')) return null

  const { data } = await sanityFetch({
    query: preview ? unitPagePreviewQuery : unitPageQuery,
    params: { locale, unit },
    perspective: preview ? 'drafts' : 'published',
    stega: preview,
  })
  const parsed = unitContentSchema.safeParse(data)

  if (!parsed.success || parsed.data.kunci !== unit) return null

  const values = [
    parsed.data.nama,
    parsed.data.judul,
    parsed.data.pembuka,
    parsed.data.subjudul,
    parsed.data.ringkas,
    ...(parsed.data.pilar?.flatMap((pillar) => [pillar.lead, pillar.isi]) ??
      []),
    ...(parsed.data.masalah?.map((item) => item.teks) ?? []),
    ...(parsed.data.caraKerja?.map((item) => item.teks) ?? []),
    ...(parsed.data.sisi?.flatMap((side) => [side.nama, side.judul]) ?? []),
    ...(parsed.data.contohOffer?.flatMap((offer) => [
      offer.judul,
      offer.dampak,
      offer.untukSiapa,
      offer.jenis,
    ]) ?? []),
    ...(parsed.data.jembatan?.flatMap((bridge) => [
      bridge.kalimat,
      bridge.offer?.judul,
      bridge.offer?.dampak,
      bridge.offer?.untukSiapa,
    ]) ?? []),
    parsed.data.ajakan?.label,
    parsed.data.ajakan?.sesudahnya,
  ]

  return canRenderPublicContent(`unit/${unit}`, values) ? parsed.data : null
}

/**
 * Reads only the fields F2-02 makes public for a side route.
 *
 * `unit` stays a route parameter as well as an asserted relation in GROQ:
 * a side with the right key under another unit must never surface at this
 * address, even while editorial documents are being assembled.
 */
export async function sideContent(
  locale: Locale,
  unit: Unit,
  side: Side,
  preview = false
): Promise<SideContent | null> {
  'use cache'

  if (!isConfigured('sanity')) return null

  const { data } = await sanityFetch({
    query: preview ? sidePagePreviewQuery : sidePageQuery,
    params: { locale, side, unit },
    perspective: preview ? 'drafts' : 'published',
    stega: preview,
  })
  const parsed = sideContentSchema.safeParse(data)

  if (!parsed.success || parsed.data.kunci !== side) return null

  const values = [
    parsed.data.nama,
    parsed.data.judul,
    ...(parsed.data.pembeli?.map((item) => item.teks) ?? []),
    ...(parsed.data.caraMembeli?.flatMap((item) => [
      item.nama,
      item.keterangan,
      item.teks,
    ]) ?? []),
    parsed.data.langkahPertama?.label,
    parsed.data.langkahPertama?.sesudahnya,
    ...(parsed.data.bab?.flatMap((bab) => [
      bab.nama,
      bab.kutipan,
      bab.situasi,
      ...(bab.jenis ?? []),
      bab.pintuMasuk?.judul,
      bab.pintuMasuk?.dampak,
    ]) ?? []),
    parsed.data.jaringan?.caraKerja,
    parsed.data.jaringan?.asalKomisi,
    parsed.data.jaringan?.yangTidakAda,
    parsed.data.jaringan?.syarat,
    parsed.data.jaringan?.ajakanDaftar?.label,
    parsed.data.jaringan?.ajakanDaftar?.sesudahnya,
  ]

  return canRenderPublicContent(`side/${unit}/${side}`, values)
    ? parsed.data
    : null
}
