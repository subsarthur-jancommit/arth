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
 * `/metode-kerja` kept saying "menunggu tinjauan pemilik" for five days after
 * it was approved (#35).
 *
 * Now the page head calls these functions, and so does
 * `lib/seo/route-descriptions.ts` on the same published read — there is no
 * second copy left to drift.
 *
 * ## No sentence of its own
 *
 * Until 2026-10-23 this module also kept a sentence for each page, printed
 * when the CMS had none: the `/metode-kerja` lead and a line for
 * `/layanan-terpadu`. The lead now lives in the `howWeWork` document's
 * `pembuka`, and a head with nothing written gives no description of its
 * own. No editorial sentence is left in code
 * (`lib/content/editorial-copy.test.ts`).
 */

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
 * `/metode-kerja`: its own SEO description, else its first written promise.
 *
 * The published document always has a first promise — the schema requires at
 * least one, each with a sentence — so `null` is reached only by a value
 * that bypassed that schema.
 */
export function howWeWorkDescription(
  content: Pick<HowWeWorkContent, 'metadata' | 'janji'>
): string | null {
  return (
    written(content.metadata?.description) ?? written(content.janji[0]?.kalimat)
  )
}

/**
 * `/layanan-terpadu`: the first sequence's SEO description, or none.
 * The page reads its metadata from the first sequence only.
 */
export function threeUnitsDescription(
  first: Pick<SequenceContent, 'metadata'>
): string | null {
  return written(first.metadata?.description)
}
