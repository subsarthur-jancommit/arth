import { stegaClean } from '@sanity/client/stega'
import { z } from 'zod'

import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import type { Locale } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  howWeWorkPreviewQuery,
  howWeWorkQuery,
} from '@/lib/integrations/sanity/queries'

const textSchema = z.string().trim().min(1)

const howWeWorkSourceSchema = z.object({
  _id: z.string(),
  janji: z
    .array(
      z.object({
        _key: z.string(),
        judul: textSchema,
        kalimat: textSchema,
      })
    )
    .min(1),
  hakMilikKlien: textSchema,
  pengungkapanKomisi: textSchema,
  yangTidakDijual: textSchema,
  wilayah: z.array(z.object({ _key: z.string(), nama: textSchema })).min(1),
  // Optional in the Studio schema, and the page renders without it.
  contohFormat: textSchema.nullable(),
  metadata: z
    .object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      keywords: z.array(z.string()).nullable(),
      noIndex: z.boolean().nullable(),
    })
    .nullable(),
})

export interface HowWeWorkSource {
  _id: string
  janji:
    | {
        _key: string
        judul: string | null
        kalimat: string | null
      }[]
    | null
  hakMilikKlien: string | null
  pengungkapanKomisi: string | null
  yangTidakDijual: string | null
  wilayah: { _key: string; nama: string | null }[] | null
  contohFormat: string | null
  metadata: {
    title: string | null
    description: string | null
    keywords: string[] | null
    noIndex: boolean | null
  } | null
}

export type HowWeWorkContent = z.infer<typeof howWeWorkSourceSchema>

function clean(value: string | null | undefined): string | null {
  if (!value) return null
  const cleaned = stegaClean(value).trim()
  return cleaned === '' ? null : cleaned
}

/**
 * Fail closed when a direct CMS write bypasses the Studio's requirements.
 * The cost is that one incomplete singleton withholds the whole work-method
 * page; rendering a partial promise as Arthur's policy would be worse.
 */
export function resolveHowWeWorkContent(
  value: HowWeWorkSource | null
): HowWeWorkContent | null {
  const parsed = howWeWorkSourceSchema.safeParse(value)
  if (!parsed.success) {
    if (value)
      console.warn('Arthur work method withheld: document is incomplete.')
    return null
  }

  const content = parsed.data
  const values = [
    content.hakMilikKlien,
    content.pengungkapanKomisi,
    content.yangTidakDijual,
    content.contohFormat,
    ...content.janji.flatMap((promise) => [promise.judul, promise.kalimat]),
    ...content.wilayah.map((region) => region.nama),
    clean(content.metadata?.title),
    clean(content.metadata?.description),
    ...(content.metadata?.keywords ?? []).map((keyword) => clean(keyword)),
  ]

  const cleanValues = values.map((value) =>
    typeof value === 'string' ? stegaClean(value) : value
  )

  return canRenderPublicContent('how-we-work', cleanValues) ? content : null
}

export async function howWeWorkContent(
  locale: Locale,
  preview = false,
  stega = preview
): Promise<HowWeWorkContent | null> {
  'use cache'

  if (!isConfigured('sanity')) return null

  const { data } = await sanityFetch({
    query: preview ? howWeWorkPreviewQuery : howWeWorkQuery,
    params: { locale },
    perspective: preview ? 'drafts' : 'published',
    stega,
  })

  return resolveHowWeWorkContent(data)
}
