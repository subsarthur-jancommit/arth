import {
  publishedJournalEntries,
  resolveJournalEntries,
} from '@/lib/content/journal-fallback'
import type { Unit } from '@/lib/content/units'
import type { Locale } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'
import { journalEntriesQuery } from '@/lib/integrations/sanity/queries'

/**
 * The studio's published journal documents. Called only from the cached
 * readers below, which is where `sanityFetch`'s cache tag has to be set.
 */
async function journalDocuments(locale: Locale) {
  return isConfigured('sanity')
    ? (
        await sanityFetch({
          query: journalEntriesQuery,
          params: { locale },
          perspective: 'published',
          stega: false,
        })
      ).data
    : null
}

/**
 * The journal's entries, resolved the way the index resolves them
 * (`resolveJournalEntries`): the studio's published entries when there are
 * any, the scaffolding otherwise, never a mix — so no page that reads them
 * can disagree with `/journal` about what has been written, or in what order.
 */
async function resolvedEntries(locale: Locale) {
  return resolveJournalEntries(locale, await journalDocuments(locale))
}

/**
 * The writing filed under a unit — read by each case study on a project page
 * (`engagement-writing`).
 *
 * Filtered here rather than in GROQ, so the query and its generated type stay
 * the index's own; trimmed to the four fields a listing reads, so the cached
 * result carries no bodies.
 *
 * `entry.practice` is the Sanity field name, not the vocabulary: it holds
 * unit keys, and F2-02 renames the field along with its stored data. See
 * `lib/integrations/sanity/schemas/journalEntry.ts`, which records why both
 * halves are renamed together or not at all.
 */
export async function writingForUnit(locale: Locale, unit: Unit) {
  'use cache'
  return (await resolvedEntries(locale))
    .filter((entry) => entry.practice === unit)
    .map(({ slug, date, title, summary }) => ({ slug, date, title, summary }))
}

/**
 * The newest published entry — the first the journal index lists — for the
 * home page (round 6, `latest-writing`). `null` when the studio has published
 * none: the home page is Arthur's front door, and the journal's scaffolding
 * was written for the old site, so it never reaches it (V6, Aturan isi 13).
 */
export async function latestWriting(locale: Locale) {
  'use cache'
  const [entry] = publishedJournalEntries(await journalDocuments(locale))
  if (!entry) return null

  const { slug, date, title, summary, practice } = entry
  return { slug, date, title, summary, unit: practice }
}
