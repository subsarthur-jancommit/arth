import { resolveHomeContent } from '@/lib/content/home-fallback'
import type { Locale } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import { siteSettingsQuery } from '@/lib/integrations/sanity/queries'

/**
 * The studio's name and address, for pages other than the home page — the
 * case study's enquiry link (`vault/blocks/engagement-enquiry`).
 *
 * Resolved exactly as the home page's contact block resolves them
 * (`resolveHomeContent`): what the owner has published in `siteSettings`
 * when there is something, `FALLBACK_CONTACT` otherwise — the same address the
 * footer shows. One source, so no two places a reader can write from name
 * different addresses. The same query the home page reads, with no new fields,
 * so nothing about its generated type changes.
 */
export async function studioContact(locale: Locale) {
  'use cache'
  const settings = isConfigured('sanity')
    ? (
        await sanityFetch({
          query: siteSettingsQuery,
          params: { locale },
          perspective: 'published',
          stega: false,
        })
      ).data
    : null

  const { name, email, fallbacks } = resolveHomeContent(locale, settings)
  return { name, email, emailIsPlaceholder: fallbacks.email }
}
