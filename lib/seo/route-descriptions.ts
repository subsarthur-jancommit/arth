import {
  type FixedPageContent,
  fixedPageContent,
} from '@/lib/content/fixed-page-content'
import {
  type HowWeWorkContent,
  howWeWorkContent,
} from '@/lib/content/how-we-work-content'
import {
  type SequenceContent,
  sequenceContent,
} from '@/lib/content/sequence-content'
import { localizedPath } from '@/lib/i18n/paths'
import { PUBLISHED_LOCALES, type Locale } from '@/lib/i18n/routing'
import {
  howWeWorkDescription,
  threeUnitsDescription,
} from '@/lib/seo/page-descriptions'
import {
  type RouteDescriptions,
  STATIC_ROUTE_TEMPLATES,
} from '@/lib/seo/route-catalog'

/**
 * The published reads behind the pages whose head describes itself from the
 * CMS. Injected, so the rule below is testable without a network, the same
 * way `resolveSearchIndex` takes its loader.
 */
export interface PageHeadSources {
  howWeWork: (locale: Locale) => Promise<HowWeWorkContent | null>
  sequences: (locale: Locale) => Promise<readonly SequenceContent[]>
  /** Optional so a test that names only the two above still type-checks. */
  fixedPage?: (locale: Locale, slug: string) => Promise<FixedPageContent | null>
}

/*
 * The arguments each page passes outside draft mode, so these are the very
 * `'use cache'` entries the pages fill rather than a second read of the same
 * documents. Published and stega-free, which is what a machine surface needs
 * (`lib/seo/README.md`).
 *
 * The cached loaders also carry the CMS cache tags, and Next propagates a
 * nested `'use cache'` entry's tags to the boundary that awaited it. So the
 * Studio webhook's `revalidateTag('howWeWork')` reaches `/llms.txt` and the
 * search index as well as the page.
 */
const PUBLISHED_SOURCES: PageHeadSources = {
  howWeWork: (locale) => howWeWorkContent(locale, false, false),
  sequences: (locale) => sequenceContent(locale, false),
  fixedPage: (locale, slug) => fixedPageContent(locale, slug, false, false),
}

interface HeadDescribedRoute {
  template: string
  /** What the head says, or `null` when the page has nothing to show. */
  describe: (locale: Locale, sources: PageHeadSources) => Promise<string | null>
}

/*
 * One entry per page whose `generateMetadata` reads its description from the
 * CMS. A page with nothing to show renders its not-found view and has no
 * description; the catalog then keeps its own line, as it does when the read
 * fails.
 */
const HEAD_DESCRIBED_ROUTES: readonly HeadDescribedRoute[] = [
  {
    template: '/cara-kerja',
    describe: async (locale, sources) => {
      const content = await sources.howWeWork(locale)
      return content ? howWeWorkDescription(content) : null
    },
  },
  {
    template: '/satu-klien-tiga-unit',
    describe: async (locale, sources) => {
      const [first] = await sources.sequences(locale)
      return first ? threeUnitsDescription(first) : null
    },
  },
  {
    template: '/cara-kami-dibayar',
    describe: async (locale, sources) => {
      const content = await sources.fixedPage?.(locale, 'cara-kami-dibayar')
      return content?.metadata.description ?? null
    },
  },
]

/**
 * What each head-described page says about itself, for `locales`.
 *
 * Never throws. `/llms.txt` and the search index are prerendered, and one
 * `ECONNRESET` inside a prerender once took a production build down
 * (`resolveSearchIndex` records it). A page whose read fails keeps the
 * catalog's own description, and the failure is logged rather than silent.
 *
 * A page the catalog no longer advertises (`lib/seo/awaiting-content.ts`) is
 * not read at all.
 */
export async function resolveRouteDescriptions(
  locales: readonly Locale[] = PUBLISHED_LOCALES,
  sources: PageHeadSources = PUBLISHED_SOURCES
): Promise<RouteDescriptions> {
  const advertised = new Set(STATIC_ROUTE_TEMPLATES.map((route) => route.path))
  const routes = HEAD_DESCRIBED_ROUTES.filter((route) =>
    advertised.has(route.template)
  )

  const resolved = await Promise.all(
    locales.flatMap((locale) =>
      routes.map(async ({ template, describe }) => {
        const path = localizedPath(locale, template)
        try {
          const description = await describe(locale, sources)
          return description === null ? [] : [[path, description] as const]
        } catch (error) {
          console.warn(
            `[route-descriptions] ${path}: content source unreachable, printing the catalog's own description.`,
            error
          )
          return []
        }
      })
    )
  )

  return new Map(resolved.flat())
}
