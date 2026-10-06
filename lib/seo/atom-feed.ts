import type { Locale } from '@/lib/i18n/routing'

/**
 * The journal as an Atom feed (RFC 4287) — pure, so the document can be
 * tested without a route.
 *
 * The journal says it is method rather than announcements, and a reader who
 * wants the next piece had no way to be told: no feed, and no `rel="alternate"`
 * for a reader app to find. `app/[locale]/journal/feed.xml/route.ts` serves
 * one per language from the same entries the journal pages render.
 *
 * Atom rather than RSS 2.0: it has one date format (RFC 3339), a required
 * stable `id` per entry, and a declared language — the three things RSS leaves
 * to convention.
 */

export interface FeedEntry {
  /** Absolute URL of the entry — its `id` and its link. */
  url: string
  title: string
  summary: string
  /** The body, as the paragraphs it is written in. */
  body: readonly string[]
  /** The date the entry was written: `YYYY-MM-DD`, or a full ISO timestamp. */
  date: string
}

export interface Feed {
  /** Absolute URL of the feed itself (`rel="self"`), which is also its `id`. */
  selfUrl: string
  /** Absolute URL of the page the feed mirrors (`rel="alternate"`). */
  pageUrl: string
  title: string
  subtitle: string
  /** BCP 47 tag, for `xml:lang`. */
  language: string
  author: string
  entries: readonly FeedEntry[]
}

/** The feed's title per language, shared with the `<link>` that announces it. */
export const FEED_TITLES = {
  en: 'Arth — Journal',
  id: 'Arth — Jurnal',
} as const satisfies Record<Locale, string>

/** The feed's path under a locale, for the route and its announcements. */
export const FEED_PATH = '/journal/feed.xml'

/** The five characters XML reserves, as entities. */
function xmlEntity(char: string): string {
  switch (char) {
    case '&':
      return '&amp;'
    case '<':
      return '&lt;'
    case '>':
      return '&gt;'
    case '"':
      return '&quot;'
    case "'":
      return '&apos;'
    default:
      return char
  }
}

export function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, xmlEntity)
}

/**
 * An entry's date as RFC 3339.
 *
 * A bare `YYYY-MM-DD` is midnight UTC on that day. Anything unparseable
 * becomes the Unix epoch rather than an invalid `<updated>`, which would make
 * a strict reader reject the whole feed for one bad date.
 */
export function feedDate(date: string): string {
  const parsed = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00Z` : date
  )
  const valid = Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
  return valid.toISOString().replace('.000Z', 'Z')
}

export function buildAtomFeed(feed: Feed): string {
  const entries = feed.entries.toSorted((a, b) =>
    feedDate(b.date).localeCompare(feedDate(a.date))
  )
  // The newest entry's date, or the epoch for an empty journal: `updated` is
  // required, and inventing "now" would tell a reader something changed.
  const updated = entries[0] ? feedDate(entries[0].date) : feedDate('')

  const items = entries
    .map(
      (entry) => `  <entry>
    <id>${escapeXml(entry.url)}</id>
    <title>${escapeXml(entry.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(entry.url)}"/>
    <published>${feedDate(entry.date)}</published>
    <updated>${feedDate(entry.date)}</updated>
    <summary>${escapeXml(entry.summary)}</summary>
    <content type="text">${escapeXml(entry.body.join('\n\n'))}</content>
  </entry>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${escapeXml(feed.language)}">
  <id>${escapeXml(feed.selfUrl)}</id>
  <title>${escapeXml(feed.title)}</title>
  <subtitle>${escapeXml(feed.subtitle)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${escapeXml(feed.selfUrl)}"/>
  <link rel="alternate" type="text/html" href="${escapeXml(feed.pageUrl)}"/>
  <updated>${updated}</updated>
  <author><name>${escapeXml(feed.author)}</name></author>
${items}
</feed>
`
}
