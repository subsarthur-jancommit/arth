import { stegaClean } from '@sanity/client/stega'
import { z } from 'zod'

import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import type { Locale } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import { pagePreviewQuery, pageQuery } from '@/lib/integrations/sanity/queries'

const pageSourceSchema = z.object({
  _id: z.string(),
  title: z.string().nullable(),
  slug: z.object({ current: z.string().nullable().optional() }).nullable(),
  content: z.array(z.unknown()).nullable(),
  excerpt: z.string().nullable(),
  metadata: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    keywords: z.array(z.string()).nullable(),
    noIndex: z.boolean().nullable(),
  }),
  publishedAt: z.string().nullable(),
  _updatedAt: z.string(),
})

export type FixedPageSource = z.infer<typeof pageSourceSchema>

export interface FixedPageContent {
  _id: string
  title: string
  content: unknown[]
  excerpt: string | null
  metadata: {
    title: string | null
    description: string | null
    keywords: string[] | null
    noIndex: boolean
  }
  publishedAt: string | null
  _updatedAt: string
}

function clean(value: string | null | undefined): string | null {
  if (!value) return null
  const cleaned = stegaClean(value).trim()
  return cleaned === '' ? null : cleaned
}

/**
 * Validate the CMS response before it becomes reader-facing HTML.
 *
 * Studio validation can be bypassed by imports and direct API writes. The
 * render boundary therefore rejects an incomplete page or any editorial
 * placeholder. The cost is deliberate: one malformed page disappears until
 * it is repaired instead of leaking an internal note to readers or metadata.
 */
export function resolveFixedPageContent(
  value: FixedPageSource | null
): FixedPageContent | null {
  const parsed = pageSourceSchema.safeParse(value)
  if (!parsed.success) {
    if (value) console.warn('Arthur fixed page withheld: malformed document.')
    return null
  }

  const source = parsed.data
  const cleanTitle = clean(source.title)
  if (!cleanTitle || !source.content || source.content.length === 0) {
    console.warn('Arthur fixed page withheld: title or content is empty.')
    return null
  }

  const serializedContent = stegaClean(JSON.stringify(source.content))
  const cleanMetadataTitle = clean(source.metadata.title)
  const cleanDescription = clean(source.metadata.description)
  const cleanExcerpt = clean(source.excerpt)
  const cleanKeywords =
    source.metadata.keywords
      ?.map((keyword) => clean(keyword))
      .filter((keyword): keyword is string => keyword !== null) ?? null

  if (
    !canRenderPublicContent(`page/${source._id}`, [
      cleanTitle,
      serializedContent,
      cleanMetadataTitle,
      cleanDescription,
      cleanExcerpt,
      ...(cleanKeywords ?? []),
    ])
  ) {
    return null
  }

  return {
    _id: source._id,
    // Keep Stega on reader fields during authenticated preview so Visual
    // Editing can locate them. Metadata is cleaned below and its caller also
    // fetches with stega disabled.
    title: source.title ?? cleanTitle,
    content: source.content,
    excerpt: cleanExcerpt,
    metadata: {
      title: cleanMetadataTitle,
      description: cleanDescription,
      keywords: cleanKeywords,
      noIndex: source.metadata.noIndex === true,
    },
    publishedAt: source.publishedAt,
    _updatedAt: source._updatedAt,
  }
}

/** Read a fixed page through separate public and authenticated-draft paths. */
export async function fixedPageContent(
  locale: Locale,
  slug: string,
  preview = false,
  stega = preview
): Promise<FixedPageContent | null> {
  'use cache'

  if (!isConfigured('sanity')) return null

  const { data } = await sanityFetch({
    query: preview ? pagePreviewQuery : pageQuery,
    params: { locale, slug },
    perspective: preview ? 'drafts' : 'published',
    stega,
  })

  return resolveFixedPageContent(data)
}
