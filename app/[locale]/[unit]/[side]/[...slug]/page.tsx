import { getTranslations } from 'next-intl/server'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { NoScriptFrontDoors } from '@/components/ui/route-loading'
import { localizedPath } from '@/lib/i18n/paths'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { generatePageMetadata } from '@/lib/utils/metadata'

/**
 * The localized 404 uses the shared header and footer, whose client links
 * read the current pathname. Declaring this catch-all blocking keeps that
 * complete chrome in the no-JavaScript response instead of replacing it with
 * an empty Suspense shell. The accepted cost is limited to invalid deep URLs:
 * they render dynamically with private, no-store caching. Valid side pages
 * remain prerendered by their sibling route.
 */
export const instant = false

/**
 * Preserve the localized catch-all beneath the new side route.
 *
 * Next prefers `[unit]/[side]` over `[...slug]`. Once that more-specific
 * branch exists, a third segment below it no longer falls back to
 * `app/[locale]/[...slug]`; without this floor Next renders the bare root 404
 * outside the localized chrome. The page deliberately reads no params: every
 * path that reaches it is invalid, and avoiding request data keeps its shell
 * prerenderable for the same reason as the original locale catch-all.
 */
export default function DeepSideNotFound() {
  return (
    <>
      <LocalizedNotFound />
      <NoScriptFrontDoors />
    </>
  )
}

export async function generateMetadata() {
  const [requested, t] = await Promise.all([
    localeRootParam(),
    getTranslations('notFound'),
  ])
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  return generatePageMetadata({
    title: t('title'),
    noIndex: true,
    url: localizedPath(locale, '/'),
  })
}
