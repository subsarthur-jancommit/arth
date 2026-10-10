import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

/**
 * The in-chrome 404 for anything two or more segments deep.
 *
 * ## What it is for
 *
 * `notFound()` here renders `app/[locale]/not-found.tsx` inside this route
 * group's chrome and providers — header, footer, theme, Lenis — rather than
 * the bare root layout. Without a route at this depth, Next falls back to
 * `app/not-found.tsx`, which has none of that, so `/id/apa/pun` would answer
 * with an unstyled page under the wrong `lang`.
 *
 * ## Why it is a single-segment deep floor and nothing else
 *
 * Until F1-03 this file also served every CMS page, at a bare single segment.
 * `app/[locale]/[unit]/page.tsx` now competes at that depth and wins — Next
 * resolves a single dynamic segment before a catch-all — so the CMS pages
 * moved to `app/[locale]/halaman/[slug]/page.tsx` and this file kept only the
 * job it had on top. One consequence is worth stating: this route no longer
 * touches Sanity, so the in-chrome 404 works identically with the
 * integration stripped out, which is what `lib/scripts/integration-bundles.ts`
 * previously needed a per-op strip transform to arrange.
 *
 * ## Why a single segment does not reach this file
 *
 * `/id/tidak-ada` is matched by `[unit]`, which 404s it. But a prerendered
 * `notFound()` answers **200** under Cache Components (`e2e/not-found.e2e.ts`
 * documents the mechanism), and a single segment is the depth a crawler was
 * actually given in a sitemap, so a wrong status there is a real cost.
 * `proxy.ts` answers an unknown single segment with a real 404 before
 * rendering — see `lib/seo/route-status.ts`. Below that depth the trade is
 * taken the other way round: the designed page, at 200.
 */
/*
 * No `params`, and the omission is load-bearing.
 *
 * The first version of this file awaited `params` "to keep the signature
 * honest". The production build refused it: reading `params` outside a
 * `<Suspense>` is a request-time access, so the route stopped being
 * prerenderable — *"Next.js encountered uncached or runtime data during
 * prerendering"*, measured on the build, the same class of failure
 * `app/[locale]/work/catalogue.tsx` records at length.
 *
 * Nothing here needs the segment anyway: every path that reaches this file is
 * a path nothing answers at. So it takes no props.
 *
 * ## The `loading.tsx` beside this file, and the trade it buys
 *
 * Measured on the production build with it removed: this route's prerendered
 * document carried `status: 404` — a *real* one — and **1657 bytes** of HTML
 * with no heading, no recovery links and no 404 copy at all. The route is
 * `◐` regardless, because the locale layout has Suspense boundaries of its
 * own, so the 404 view is postponed either way; without `loading.tsx` there
 * is simply nothing in its place.
 *
 * So the file stays, and the trade is stated rather than discovered: this
 * route answers **200** (Cache Components flushes the shell's status before
 * `notFound()` resolves — `e2e/not-found.e2e.ts` documents the mechanism) and
 * in exchange `components/ui/route-loading`'s `<noscript>` serves both front
 * doors to a reader without JavaScript, which `e2e/no-javascript-404.e2e.ts`
 * asserts and which was a defect measured on the live site.
 *
 * That trade is only acceptable because the depth that matters is covered
 * elsewhere: a **single** segment is the depth a crawler is handed in a
 * sitemap, and `proxy.ts` answers it with a real 404 and a complete document
 * before any of this runs (`lib/seo/route-status.ts`). Nothing advertises a
 * path two segments deep that does not exist.
 */
export default function DeepNotFound() {
  notFound()
}

/**
 * The title the 404 carries.
 *
 * `not-found.tsx` cannot export metadata, so it has to come from the route
 * that called `notFound()`. Without this every unknown URL carried the brand
 * name alone — a failure page indistinguishable from the home page in a tab
 * strip, in history and in a bookmark (`docs/AUDIT-2026-08.md` §Tier 3).
 */
export async function generateMetadata() {
  const t = await getTranslations('notFound')
  return { title: t('title') }
}
