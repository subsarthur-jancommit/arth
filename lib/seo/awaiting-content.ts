/**
 * Fixed Arthur pages that exist in code but have no published content yet.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## Why a static list
 *
 * Each of these routes renders an empty state or the not-found view when its
 * Sanity document is unpublished — at HTTP 200, because Cache Components force
 * a prerendered page's status (`lib/seo/route-status.ts`). The owner's
 * decision P4 (`docs/RENCANA-REVISI-F3.md`) is that a page without published
 * content answers a real 404 and is not linked from anywhere.
 *
 * The proxy cannot ask Sanity on every request without adding a network call
 * to each page view. It does not need to: content for these pages goes live
 * through the R5 pull request that wires the owner-approved copy, and that
 * same pull request removes the path from this list. Publishing and leaving
 * the list are one reviewed change.
 *
 * ## Who reads it
 *
 * `proxy.ts` (the 404), the header and footer (the links), and
 * `lib/seo/route-catalog.ts` (sitemap, `llms.txt`, search index). A path
 * added here disappears from each of them that names it, at once.
 *
 * Leaving the list only brings a page back where it is named. When
 * `/layanan-terpadu` left it, the proxy was the only reader that knew the
 * page, so the same change gave it a catalog entry. `/kebijakan`, the last
 * one, left it in V5 and stays out of the catalog on purpose: it is `noindex`
 * until its legal review is done, so only the footer links it.
 *
 * The list is empty now. It stays, so that the next fixed page built before
 * its copy is approved can wait here the same way.
 *
 * Sanity draft mode is exempt in the proxy, so Presentation can still preview
 * these routes while their documents are drafts.
 */
export const AWAITING_CONTENT: readonly string[] = []

/** Whether a locale-free template (`/metode-kerja`) is still awaiting content. */
export function isAwaitingContent(template: string): boolean {
  return AWAITING_CONTENT.includes(template)
}
