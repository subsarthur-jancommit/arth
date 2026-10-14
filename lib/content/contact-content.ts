import { stegaClean } from '@sanity/client/stega'
import { z } from 'zod'

import {
  FALLBACK_CONTACT,
  resolveHomeContent,
} from '@/lib/content/home-fallback'
import { canRenderPublicContent } from '@/lib/content/public-content-guard'
import type { Locale } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import {
  contactPagePreviewQuery,
  contactPageQuery,
} from '@/lib/integrations/sanity/queries'
import { emailSchema } from '@/lib/utils/validation'

const contactSourceSchema = z.object({
  _id: z.string(),
  name: z.string().nullable(),
  statement: z.array(z.unknown()).nullable(),
  regions: z
    .array(
      z.object({
        _key: z.string(),
        name: z.string().nullable(),
      })
    )
    .nullable(),
  address: z.string().nullable(),
  channel: z.object({
    email: z.string().nullable(),
    whatsapp: z.string().nullable(),
    responseTime: z.string().nullable(),
  }),
  socials: z
    .array(
      z.object({
        _key: z.string(),
        label: z.string().nullable(),
        url: z.string().nullable(),
      })
    )
    .nullable(),
  metadata: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    keywords: z.array(z.string()).nullable(),
    noIndex: z.boolean().nullable(),
  }),
})

export type ContactSource = z.infer<typeof contactSourceSchema>

interface ContactRegion {
  id: string
  name: string
}

interface ContactMetadata {
  title: string | null
  description: string | null
  keywords: string[] | null
}

export interface ContactContent {
  name: string
  statement: unknown[] | null
  regions: readonly ContactRegion[]
  regionsAreFallback: boolean
  email: string
  emailHref: string | null
  emailIsPlaceholder: boolean
  whatsappHref: string | null
  responseTime: string | null
  address: string
  addressIsPlaceholder: boolean
  socials: readonly { label: string; url: string }[]
  contactReady: boolean
  noIndex: boolean
  metadata: ContactMetadata
}

const REGION_FALLBACKS: readonly ContactRegion[] = [
  { id: 'subang', name: 'Subang' },
  { id: 'purwakarta', name: 'Purwakarta' },
  { id: 'bandung', name: 'Bandung' },
]

function clean(value: string | null | undefined): string | null {
  if (!value) return null
  const cleaned = stegaClean(value).trim()
  return cleaned === '' ? null : cleaned
}

function safeSocials(
  socials: ContactSource['socials']
): readonly { label: string; url: string }[] {
  return (socials ?? []).flatMap((social) => {
    const label = clean(social.label)
    const url = clean(social.url)
    if (!label || !url) return []

    try {
      const protocol = new URL(url).protocol
      return protocol === 'https:' || protocol === 'http:'
        ? [{ label, url }]
        : []
    } catch {
      return []
    }
  })
}

function whatsappHref(value: string | null | undefined): string | null {
  const cleaned = clean(value)
  if (!cleaned) return null

  const digits = cleaned.replace(/\D/g, '')
  return /^[1-9]\d{7,14}$/.test(digits) ? `https://wa.me/${digits}` : null
}

function safeStatement(
  statement: ContactSource['statement']
): unknown[] | null {
  if (!statement || statement.length === 0) return null

  const plain = stegaClean(JSON.stringify(statement))
  return canRenderPublicContent('contact/owner-statement', [plain])
    ? statement
    : null
}

/**
 * Resolve the fixed contact page without turning an undecided K5 into a fact.
 *
 * Reserved-domain email and example address values remain visible review
 * material, but never become links or a claim that contact is open. The cost
 * is an intentionally noindexed page until a real channel, response time,
 * address, and owner statement are all present.
 */
export function resolveContactContent(
  locale: Locale,
  value: ContactSource | null
): ContactContent {
  const parsed = contactSourceSchema.safeParse(value)
  if (value && !parsed.success) {
    console.warn('Arthur contact settings withheld: the document is malformed.')
  }
  const source = parsed.success ? parsed.data : null
  const statement = safeStatement(source?.statement ?? null)
  const socials = safeSocials(source?.socials ?? null)
  const resolved = resolveHomeContent(
    locale,
    source
      ? {
          name: clean(source.name),
          email: clean(source.channel.email),
          address: clean(source.address),
          statement,
          socials,
        }
      : null
  )

  const sourceRegions = (source?.regions ?? []).flatMap((region) => {
    const name = clean(region.name)
    if (
      !name ||
      !canRenderPublicContent(`contact/region/${region._key}`, [name])
    )
      return []
    return [{ id: region._key, name }]
  })
  const completeRegions =
    sourceRegions.length > 0 &&
    sourceRegions.length === (source?.regions?.length ?? 0)
  const regions = completeRegions ? sourceRegions : REGION_FALLBACKS

  const cmsEmailIsValid =
    !resolved.fallbacks.email && emailSchema.safeParse(resolved.email).success
  const email = cmsEmailIsValid ? resolved.email : FALLBACK_CONTACT.email
  const emailIsPlaceholder = !cmsEmailIsValid
  const responseTime = clean(source?.channel.responseTime)
  const whatsapp = whatsappHref(source?.channel.whatsapp)
  const contactReady =
    (whatsapp !== null || !emailIsPlaceholder) &&
    responseTime !== null &&
    !resolved.fallbacks.address &&
    statement !== null

  return {
    name: resolved.name,
    statement,
    regions,
    regionsAreFallback: !completeRegions,
    email,
    emailHref: emailIsPlaceholder ? null : `mailto:${email}`,
    emailIsPlaceholder,
    whatsappHref: whatsapp,
    responseTime,
    address: resolved.address,
    addressIsPlaceholder: resolved.fallbacks.address,
    socials: resolved.socials,
    contactReady,
    noIndex: source?.metadata.noIndex === true || !contactReady,
    metadata: {
      title: clean(source?.metadata.title),
      description: clean(source?.metadata.description),
      keywords:
        source?.metadata.keywords
          ?.map((keyword) => clean(keyword))
          .filter((keyword): keyword is string => keyword !== null) ?? null,
    },
  }
}

/** Read the contact page through separate public and authenticated-draft paths. */
export async function contactContent(
  locale: Locale,
  preview = false
): Promise<ContactContent> {
  'use cache'

  if (!isConfigured('sanity')) return resolveContactContent(locale, null)

  const { data } = await sanityFetch({
    query: preview ? contactPagePreviewQuery : contactPageQuery,
    params: { locale },
    perspective: preview ? 'drafts' : 'published',
    stega: preview,
  })

  return resolveContactContent(locale, data)
}
