import { getTranslations } from 'next-intl/server'
import type { PortableTextBlock } from 'next-sanity'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { locale as localeRootParam } from 'next/root-params'

import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { isConfigured } from '@/integrations/registry'
import { RichText } from '@/integrations/sanity/components/rich-text'
import { sanityFetch } from '@/integrations/sanity/live'
import { pageQuery } from '@/integrations/sanity/queries'
import { getLinkAttributes } from '@/integrations/sanity/utils/link'
import { localizedPath } from '@/lib/i18n/paths'
import { isLocale, routing } from '@/lib/i18n/routing'
import { generateSanityMetadata } from '@/utils/metadata'

/**
 * `sanityFetch` calls `cacheTag()` internally, which under Cache Components
 * (`cacheComponents: true`) is only legal inside a `'use cache'` function —
 * including in draft mode. The official next-sanity pattern: always fetch
 * inside 'use cache', but pass `perspective`/`stega`/`slug` as arguments so
 * they are part of the cache key, and branch on `draftMode()` at the
 * request level. Live edits then land via SanityLive tag revalidation.
 */
const fetchPage = async (
  slug: string,
  perspective: 'published' | 'drafts',
  stega: boolean
) => {
  'use cache'
  return sanityFetch({
    query: pageQuery,
    params: { slug },
    perspective,
    stega,
  })
}

const fetchPageForRequest = async (slug: string) => {
  const { isEnabled: isDraftMode } = await draftMode()
  return isDraftMode
    ? fetchPage(slug, 'drafts', true)
    : fetchPage(slug, 'published', false)
}

interface CmsPageProps {
  params: Promise<{ slug: string }>
}

/**
 * Renders every published Sanity `page` document at `/halaman/<slug>`.
 *
 * ## Why it is under a prefix now, when it used to be the catch-all
 *
 * This file was `app/[locale]/[...slug]/page.tsx` and resolved a CMS page at
 * a bare single segment — `/about`, `/pricing`. Arthur's units are bare
 * single segments too (`/konstruksi`), and a unit is a **dynamic** segment,
 * `app/[locale]/[unit]`. Next resolves a single dynamic segment before a
 * catch-all, so `[unit]` matched `/about` first and the CMS page became
 * unreachable — silently, because an unreachable page does not fail a build.
 *
 * `lib/content/practices.ts` recorded the same collision class when the
 * practice filter moved to a top-level segment, and the remedy there was to
 * reserve one slug. That cannot be scaled to a dynamic segment which takes
 * *every* single segment, so the CMS pages moved under a prefix instead and
 * the owner chose which: `halaman`, the Indonesian for "page", which
 * `lib/content/units.ts` keeps in `RESERVED_SLUGS` so no CMS page can claim
 * it.
 *
 * The cost, stated: every CMS page URL changed, `/about` becoming
 * `/halaman/about`. Nothing was linked to one yet — the dataset holds zero
 * `page` documents, counted on 2026-10-10 — so no address in use was broken.
 *
 * ## What it no longer does
 *
 * It is not the in-chrome 404 any more. That stayed where it was, at
 * `app/[locale]/[...slug]/page.tsx`, which is now nothing but a `notFound()`
 * — so the 404 handler no longer depends on Sanity at all, and this file can
 * be deleted outright when the integration is stripped rather than
 * transformed down to a stub.
 */
export default async function CmsPage({ params }: CmsPageProps) {
  const { slug } = await params

  if (!slug || !isConfigured('sanity')) notFound()

  const { data } = await fetchPageForRequest(slug)

  if (!data) notFound()

  const requestedLocale = await localeRootParam()
  const locale = isLocale(requestedLocale)
    ? requestedLocale
    : routing.defaultLocale
  const linkAttrs = data.link ? getLinkAttributes(data.link, locale) : null
  // SAFETY: PageQueryResult's typegen'd `content` array is the same
  // portable-text block/span/markDefs shape as next-sanity's
  // PortableTextBlock, derived independently by typegen so TS can't unify
  // the two structurally identical types.
  const content = data.content as PortableTextBlock[] | null

  return (
    <Wrapper theme="light">
      <div
        className="flex grow flex-col gap-gap dr-px-16 dr-py-32"
        data-sanity={data._id}
      >
        <h1 data-sanity="title">{data.title}</h1>
        {content && (
          <div data-sanity="content">
            <RichText content={content} />
          </div>
        )}
        {linkAttrs && (
          <Link
            href={linkAttrs.href}
            target={linkAttrs.target}
            rel={linkAttrs.rel}
          >
            {data.link?.text}
          </Link>
        )}
      </div>
    </Wrapper>
  )
}

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
/**
 * The title a soft 404 carries.
 *
 * Every unknown URL rendered the brand name alone as its title — a failure page
 * indistinguishable from the home page in a tab strip, in history, and in a
 * bookmark. The guard was `toHaveTitle(/.+/)`, a regex that matches any
 * non-empty string and so could never fail (`docs/AUDIT-2026-08.md` §Tier 3).
 *
 * It matters more here than on a site that can return a real status: Cache
 * Components force this to answer 200 (documented in `e2e/not-found.e2e.ts`),
 * so the title is one of the few honest signals left. `not-found.tsx` itself
 * cannot export metadata, so it has to come from the route that called
 * `notFound()`.
 */
async function notFoundMetadata() {
  const t = await getTranslations('notFound')
  return { title: t('title') }
}

export async function generateMetadata({ params }: CmsPageProps) {
  const { slug } = await params

  if (!slug || !isConfigured('sanity')) return

  const { data } = await fetchPageForRequest(slug)

  if (!data) return notFoundMetadata()

  const requested = await localeRootParam()
  const locale = isLocale(requested) ? requested : routing.defaultLocale

  // Localized, not the bare template: canonical, og:url and og:locale all
  // come from this one string. See `lib/utils/metadata.ts`.
  return generateSanityMetadata({
    document: data,
    url: localizedPath(locale, `/halaman/${slug}`),
    type: 'website',
  })
}
