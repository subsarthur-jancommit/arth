/**
 * The name this site answers to, in one place.
 *
 * ## Why this module exists at all
 *
 * The name was written out in five places that could not see each other, and
 * two of them were constants that disagreed about being the source:
 * `lib/seo/site.ts` held `SITE.name`, and `lib/content/home-fallback.ts` held
 * its own `name` that the footer read instead. The header's wordmark and the
 * no-JavaScript route-loading shell carried bare literals. So a rename
 * reached the machine surfaces and left the wordmark behind, or the reverse,
 * and nothing failed.
 *
 * ## Why it is not in `lib/seo/site.ts`
 *
 * `site.ts` imports `lib/env`, which reads `process.env` and validates it —
 * including the names of private tokens. The header is a client component, so
 * importing `site.ts` there would pull the environment module into the browser
 * bundle. A name does not need any of that.
 *
 * Dependency-free on purpose, the same reason `lib/base-url.ts` is: anything
 * may import it, on either side of the client boundary, without dragging a
 * dependency along.
 */

/** What the site is called. Every surface reads this. */
export const BRAND_NAME = 'Arthur'

/**
 * Other names the same organisation answers to.
 *
 * `Peekabo` is here because it is Arthur's agency unit's own brand, so it is a
 * name a reader may search for and find the same organisation behind. The two
 * other units are not: they are named for what they do, not branded
 * separately.
 *
 * The previous value was `['Arth Agency']`, which nothing sourced — no
 * document or owner statement ever established it as a name in use. An
 * alternate name is a claim about identity, so an unsourced one is removed
 * rather than renamed.
 */
export const BRAND_ALTERNATE_NAMES = ['Peekabo'] as const
