import type { MetadataRoute } from 'next'

import { templateFromLocalizedPath } from '@/lib/i18n/paths'
import { languageAlternates } from '@/lib/seo/alternates'
import {
  type ContentRoute,
  getAdvertisedRoutes,
  STATIC_ROUTES,
} from '@/lib/seo/routes'
import { BASE_URL } from '@/lib/seo/site'

/**
 * Static routes are listed in `lib/seo/routes.ts` (`STATIC_ROUTES`) —
 * shared with `/llms.txt` so the two surfaces can't drift. A new static
 * route is added there and nowhere else — the catalog is the single source.
 * (Until Tahap 84 it also had to be added to `PAGES` in the `/ai` machine
 * view, a second list that could drift; that route was removed.)
 *
 * Everything past the static catalogue — the journal's entries, and the CMS's
 * pages and projects when Sanity is configured — arrives already expanded
 * from `getAdvertisedRoutes()`. A fresh clone with no CMS env set still gets
 * the journal, because those pages exist without one.
 *
 * ## Alternates and dates — the live audit, 2026-10-05
 *
 * Every URL now carries its hreflang alternates (`xhtml:link`), from the same
 * map the page head uses (`languageAlternates`), so a crawler reading only the
 * sitemap still learns which pages are translations of each other.
 *
 * And `lastmod` is no longer the build's clock. Every static page claimed to
 * have changed at the moment of the last deploy, which teaches a search engine
 * to ignore the field (`docs/HANDOFF.md` §4.8, L6). A page that lists others
 * (`/journal`, `/work`) now takes the date of the newest page it lists; the
 * rest carry no date rather than a false one. Content routes keep their own.
 */

/** Static pages whose content is the list of the pages beneath them. */
const LISTINGS = new Set(['/journal', '/work'])

/** hreflang for one sitemap URL: the head's own map, made absolute. */
function alternatesFor(
  path: string
): MetadataRoute.Sitemap[number]['alternates'] {
  const languages = languageAlternates(path)
  if (!languages) return undefined

  return {
    languages: Object.fromEntries(
      Object.entries(languages).map(([tag, href]) => [
        tag,
        `${BASE_URL}${href}`,
      ])
    ),
  }
}

/** The newest date among the routes listed under `path`, or none. */
function newestUnder(
  path: string,
  routes: readonly ContentRoute[]
): Date | undefined {
  const template = templateFromLocalizedPath(path)
  if (!template || !LISTINGS.has(template)) return undefined

  const dates = routes
    .filter((route) => route.path.startsWith(`${path}/`))
    .map((route) => route.lastModified.getTime())
  return dates.length > 0 ? new Date(Math.max(...dates)) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Already one entry per locale. A CMS slug is locale-free (`/work/rimbun`),
  // and the bare template is not a page — it 307s to whichever locale the
  // fetcher's `Accept-Language` implies — so a sitemap that emitted it would
  // submit a URL that only ever redirects, and one that disagrees with the
  // page's own canonical. `/llms.txt` does the expansion through the same
  // accessor — as the `/ai` machine view did until Tahap 84 removed it —
  // because for a while each surface did its own and they drifted.
  const contentRoutes = await getAdvertisedRoutes()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => {
    const lastModified = newestUnder(route.path, contentRoutes)
    const alternates = alternatesFor(route.path)
    return {
      url: `${BASE_URL}${route.path}`,
      ...(lastModified && { lastModified }),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      ...(alternates && { alternates }),
    }
  })

  const cmsEntries: MetadataRoute.Sitemap = contentRoutes.map((route) => {
    const alternates = alternatesFor(route.path)
    return {
      url: `${BASE_URL}${route.path}`,
      lastModified: route.lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      ...(alternates && { alternates }),
    }
  })

  return [...staticEntries, ...cmsEntries]
}
