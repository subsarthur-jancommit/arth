import type { HowWeWorkContent } from '@/lib/content/how-we-work-content'
import type { SequenceContent } from '@/lib/content/sequence-content'

/**
 * What a page head says about itself, for the pages whose head reads its
 * description from the CMS — written once, for the head and for every
 * surface that lists the page.
 *
 * ## The defect this closes
 *
 * `lib/seo/route-catalog.ts` used to carry a hand-copied sentence for each of
 * these pages, and `/llms.txt`, the Markdown mirrors and the search palette
 * printed it. Nothing compared it with `<meta name="description">`, so an
 * edit in the Studio changed the head and left the copy behind. That is how
 * `/cara-kerja` kept saying "menunggu tinjauan pemilik" for five days after
 * it was approved (#35).
 *
 * Now the page head calls these functions, and so does
 * `lib/seo/route-descriptions.ts` on the same published read — there is no
 * second copy left to drift.
 *
 * ## Why this module imports no Sanity code
 *
 * The catalog reads the fallbacks below, and the command palette — a client
 * component — imports the catalog through `lib/content/search-index.ts`. The
 * two `import type` lines above are erased at compile time.
 */

/**
 * The lead under the `/cara-kerja` heading. The catalog prints it as the
 * page's description when the published document cannot be read.
 */
export const HOW_WE_WORK_LEAD =
  'Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai.'

/** `/satu-klien-tiga-unit`'s description while its first sequence has none. */
export const THREE_UNITS_FALLBACK_DESCRIPTION =
  'Rangkaian kerja yang mungkin lintas Konstruksi, Teknologi, dan Peekabo.'

/**
 * A CMS string, with an empty box an editor left treated as no answer.
 *
 * The how-we-work schema does not trim its SEO description, so `''` used to
 * reach the head as a description and was then dropped by the head's own
 * truthiness check, leaving the page with the site-wide sentence.
 */
function written(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/**
 * `/cara-kerja`: its own SEO description, else its first written promise.
 *
 * The published document always has a first promise — the schema requires at
 * least one, each with a sentence — so the lead is reached only by a value
 * that bypassed that schema.
 */
export function howWeWorkDescription(
  content: Pick<HowWeWorkContent, 'metadata' | 'janji'>
): string {
  return (
    written(content.metadata?.description) ??
    written(content.janji[0]?.kalimat) ??
    HOW_WE_WORK_LEAD
  )
}

/**
 * `/satu-klien-tiga-unit`: the first sequence's SEO description, else the
 * page's own. The page reads its metadata from the first sequence only.
 */
export function threeUnitsDescription(
  first: Pick<SequenceContent, 'metadata'>
): string {
  return (
    written(first.metadata?.description) ?? THREE_UNITS_FALLBACK_DESCRIPTION
  )
}
