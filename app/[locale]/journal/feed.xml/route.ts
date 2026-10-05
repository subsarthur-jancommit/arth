import { getTranslations } from 'next-intl/server'

import { resolveJournalEntries } from '@/lib/content/journal-fallback'
import { localizedPath } from '@/lib/i18n/paths'
import { isLocale, LOCALE_TAGS, type Locale, routing } from '@/lib/i18n/routing'
import { buildAtomFeed, FEED_PATH, FEED_TITLES } from '@/lib/seo/atom-feed'
import { BASE_URL, SITE } from '@/lib/seo/site'

/**
 * `/[locale]/journal/feed.xml` — the journal as an Atom feed, one per language.
 *
 * ## Why the proxy leaves it alone
 *
 * The same reason `search.json` gives: `proxy.ts` skips content negotiation
 * for any path whose last segment contains a dot, so this is never treated as
 * a page document, and it carries its locale in the path.
 *
 * ## The entries it lists, and why not the CMS's
 *
 * Exactly the entries the journal's pages serve — `resolveJournalEntries`
 * with no CMS data, the same call `journalContentRoutes` makes for the sitemap
 * (`lib/seo/routes.ts` records why). A feed that listed CMS slugs while the
 * entry route still serves the scaffolding would hand a reader 404s. When the
 * entry route starts reading the CMS, this changes with it.
 *
 * ## `'use cache'` wraps the builder, not the handler
 *
 * As in `app/llms.txt/route.ts`: a cached boundary serializes its return
 * value, and a `Response` is not a plain object.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

async function buildFeed(locale: Locale): Promise<string> {
  'use cache'
  const t = await getTranslations({ locale, namespace: 'journal' })

  return buildAtomFeed({
    selfUrl: `${BASE_URL}${localizedPath(locale, FEED_PATH)}`,
    pageUrl: `${BASE_URL}${localizedPath(locale, '/journal')}`,
    title: FEED_TITLES[locale],
    subtitle: t('intro'),
    language: LOCALE_TAGS[locale],
    author: SITE.name,
    entries: resolveJournalEntries(locale, null).map((entry) => ({
      url: `${BASE_URL}${localizedPath(locale, `/journal/${entry.slug}`)}`,
      title: entry.title,
      summary: entry.summary,
      body: entry.body,
      date: entry.date,
    })),
  })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  if (!isLocale(locale)) {
    return new Response('Not found.\n', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }

  return new Response(await buildFeed(locale), {
    headers: {
      'content-type': 'application/atom+xml; charset=utf-8',
      // The sitemap's and the palette index's cadence: the journal changes
      // when the studio publishes, and a reader an hour behind is not a defect.
      'cache-control':
        'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
