import type { MetadataRoute } from 'next'

import { AI_CRAWLERS } from '@/lib/seo/robots-policy'
import { BASE_URL } from '@/lib/seo/site'

const DISALLOW = ['/api/draft-mode/']

/**
 * AI answer-engine crawlers, refused by name while the site is placeholder.
 *
 * They are named rather than left to the `*` rule because several only honor
 * a directive addressed to them directly — a bare `*` rule is not a reliable
 * substitute.
 *
 * `Google-Extended` controls Gemini / AI Overviews training data specifically
 * — it is separate from `Googlebot`, which continues to control regular
 * search indexing and is unaffected by this list.
 *
 * ## Why these are refused but search engines are not
 *
 * Search engines stay allowed on purpose, and that is not an oversight. A
 * crawler has to be able to **fetch** a page to **see** its `noindex` — a
 * path refused here is a path whose `X-Robots-Tag` is never read, and a URL
 * refused in robots.txt can still appear in results on the strength of
 * inbound links alone. Allowing the fetch is what makes the noindex work.
 *
 * These crawlers are different in kind: they are here to harvest the text,
 * not to index the URL, so there is nothing to let them read. Refusing the
 * fetch is the whole remedy.
 *
 * This list goes back to `allow: '/'` when real content ships (F5-05, with
 * the noindex release), not before. It lives in `lib/seo/robots-policy.ts` so
 * the gate that reads the published file and this route share one list.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        disallow: '/',
      })),
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
