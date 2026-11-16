import { z } from 'zod'

import type { FixedPageContent } from '@/lib/content/fixed-page-content'
import type { HowWeWorkContent } from '@/lib/content/how-we-work-content'
import type { SequenceContent } from '@/lib/content/sequence-content'
import { type Locale, routing } from '@/lib/i18n/routing'

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
 * `/metode` kept saying "menunggu tinjauan pemilik" for five days after
 * it was approved (#35).
 *
 * Now the page head calls these functions, and so does
 * `lib/seo/route-descriptions.ts` on the same published read — there is no
 * second copy left to drift.
 *
 * ## No sentence of its own
 *
 * Until 2026-10-23 this module also kept a sentence for each page, printed
 * when the CMS had none: the `/metode` lead and a line for
 * `/layanan`. The lead now lives in the `howWeWork` document's
 * `pembuka`, and a head with nothing written gives no description of its
 * own. No editorial sentence is left in code
 * (`lib/content/editorial-copy.test.ts`).
 *
 * ## A plain field heads the Indonesian page only
 *
 * `/layanan` and `/pembayaran` take their head's title and description from
 * plain Sanity strings (`metadata.title` and `metadata.description`), not
 * from localized arrays, so what the Studio holds there is Indonesian. Their
 * English head is the one the owner approved for each page on 15 November
 * 2026 (R7 blocks L-meta and P-meta, `docs/R7-SERAH-INGGRIS.md`), kept in
 * `messages/en.json` beside the page's other interface strings, the way
 * `/metode` takes its English title from `methodPage.title`.
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

/** What a page's head says: its title, and its description when it has one. */
export interface PageHead {
  title: string
  description: string | null
}

/*
 * The heads a message catalogue holds, parsed rather than trusted: a key that
 * went missing fails here, loudly, instead of reaching a page as the title
 * `servicesPage.metaTitle`.
 */
const catalogueHead = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
})
const catalogueHeads = z.object({
  servicesPage: catalogueHead,
  paymentPage: catalogueHead,
})

/**
 * The head one page takes from a locale's message catalogue.
 *
 * Read with the import `lib/i18n/request.ts` makes, not through next-intl's
 * `getTranslations`: `/llms.txt`, the search index and the Markdown mirrors
 * print these heads too, and they are route handlers, where next-intl's
 * request config cannot run. It reads `next/root-params`, which Next gives
 * to Server Components only.
 */
async function catalogueHeadOf(
  locale: Locale,
  page: keyof z.infer<typeof catalogueHeads>
): Promise<PageHead> {
  const catalogue: { default: unknown } = await import(
    `../../messages/${locale}.json`
  )
  const head = catalogueHeads.parse(catalogue.default)[page]
  return { title: head.metaTitle, description: head.metaDescription }
}

/**
 * `/metode`: its own SEO description, else its first written promise.
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
 * `/layanan`: the first sequence's SEO description, or none.
 * The page reads its metadata from the first sequence only.
 */
export function threeUnitsDescription(
  first: Pick<SequenceContent, 'metadata'>
): string | null {
  return written(first.metadata?.description)
}

/**
 * `/layanan`'s head. In Indonesian, the first sequence's SEO title and
 * description as the Studio wrote them; in English, the head the owner
 * approved (R7 L-meta, `servicesPage.metaTitle` and `metaDescription`).
 */
export async function threeUnitsHead(
  locale: Locale,
  first: Pick<SequenceContent, 'metadata'>
): Promise<PageHead> {
  if (locale !== routing.defaultLocale) {
    return catalogueHeadOf(locale, 'servicesPage')
  }
  return {
    title: first.metadata?.title ?? 'Layanan',
    description: threeUnitsDescription(first),
  }
}

/**
 * `/pembayaran`'s head, by the same rule. In Indonesian, the `page`
 * document's SEO title (else its own title) and SEO description; in English,
 * the head the owner approved (R7 P-meta, `paymentPage.metaTitle` and
 * `metaDescription`). Without its document the page shows the not-found view,
 * which describes nothing in either language.
 */
export async function paymentHead(
  locale: Locale,
  content: Pick<FixedPageContent, 'title' | 'metadata'> | null
): Promise<PageHead> {
  if (locale === routing.defaultLocale) {
    return {
      title: content?.metadata.title ?? content?.title ?? 'Pembayaran',
      description: content?.metadata.description ?? null,
    }
  }
  const approved = await catalogueHeadOf(locale, 'paymentPage')
  return content ? approved : { ...approved, description: null }
}
