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
 * `proxy.ts` (the 404), the header and footer (the links), the home page (the
 * work-method link), and `lib/seo/route-catalog.ts` (sitemap, `llms.txt`,
 * search index). A path added here disappears from all of them at once.
 *
 * Sanity draft mode is exempt in the proxy, so Presentation can still preview
 * these routes while their documents are drafts.
 */
export const AWAITING_CONTENT = [
  '/cara-kerja',
  '/satu-klien-tiga-unit',
  '/kebijakan',
] as const

/** Whether a locale-free template (`/cara-kerja`) is still awaiting content. */
export function isAwaitingContent(template: string): boolean {
  return (AWAITING_CONTENT as readonly string[]).includes(template)
}
