import { z } from 'zod'

import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import type { Locale } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  sequencesPreviewQuery,
  sequencesQuery,
} from '@/lib/integrations/sanity/queries'

const textSchema = z.string().trim().min(1)

const sequenceOfferSchema = z.object({
  _key: z.string(),
  slug: textSchema,
  judul: textSchema,
})

const sequenceStepSchema = z
  .object({
    _key: z.string(),
    unit: z.object({
      kunci: z.enum(['konstruksi', 'teknologi', 'peekabo']),
      nama: textSchema,
    }),
    offerCount: z.number().int().min(1).max(2),
    offer: z.array(sequenceOfferSchema).min(1).max(2),
    kalimat: textSchema,
  })
  .refine((step) => step.offer.length === step.offerCount, {
    message: 'Every referenced offer must remain renderable.',
    path: ['offer'],
  })

const sequenceSchema = z.object({
  _id: z.string(),
  situasi: textSchema,
  langkah: z.array(sequenceStepSchema).length(3),
  keterangan: textSchema,
  metadata: z
    .object({
      title: textSchema.nullable(),
      description: textSchema.nullable(),
      keywords: z.array(textSchema).nullable(),
      noIndex: z.boolean().nullable(),
    })
    .nullable(),
})

export type SequenceContent = z.infer<typeof sequenceSchema>

interface SequenceSourceOffer {
  _key: string
  slug: string | null
  judul: string | null
}

interface SequenceSourceStep {
  _key: string
  unit: {
    kunci: string | null
    nama: string | null
  } | null
  offerCount: number | null
  offer: SequenceSourceOffer[] | null
  kalimat: string | null
}

/** Named external shape accepted from both published and Stega draft reads. */
export interface SequenceSource {
  _id: string
  situasi: string | null
  langkah: SequenceSourceStep[] | null
  keterangan: string | null
  metadata: {
    title: string | null
    description: string | null
    keywords: string[] | null
    noIndex: boolean | null
  }
}

/**
 * Treat Sanity as an external boundary rather than trusting its current
 * schema deployment. One malformed sequence is withheld without removing a
 * different complete one; the cost is that an editorial mistake can make a
 * single proposed sequence disappear until its references are repaired.
 */
export function parseSequenceContent(
  value: readonly SequenceSource[]
): SequenceContent[] {
  return value.flatMap((candidate, index) => {
    const parsed = sequenceSchema.safeParse(candidate)
    if (!parsed.success) {
      console.warn(`Arthur sequence withheld: item ${index + 1} is incomplete.`)
      return []
    }

    const values = [
      parsed.data.situasi,
      parsed.data.keterangan,
      parsed.data.metadata?.title,
      parsed.data.metadata?.description,
      ...(parsed.data.metadata?.keywords ?? []),
      ...parsed.data.langkah.flatMap((step) => [
        step.unit.nama,
        step.kalimat,
        ...step.offer.map((offer) => offer.judul),
      ]),
    ]

    return canRenderPublicContent(`sequence/${parsed.data._id}`, values)
      ? [parsed.data]
      : []
  })
}

/** Read the sequence page with separate public and authenticated-draft paths. */
export async function sequenceContent(
  locale: Locale,
  preview = false
): Promise<SequenceContent[]> {
  'use cache'

  if (!isConfigured('sanity')) return []

  const { data } = await sanityFetch({
    query: preview ? sequencesPreviewQuery : sequencesQuery,
    params: { locale },
    perspective: preview ? 'drafts' : 'published',
    stega: preview,
  })

  return parseSequenceContent(data)
}
