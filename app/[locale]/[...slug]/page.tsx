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
 * It used to get away with it because this directory carried a `loading.tsx`,
 * which made the segment `◐` and gave the dynamic access a hole to stream
 * into. That file moved to the CMS route with the rest of the page, and
 * bringing it back would mean the 404 arrives in a chunk only JavaScript can
 * commit — which `e2e/site-reach.e2e.ts` measured at 28 characters of served
 * HTML.
 *
 * Nothing here needs the segment: every path that reaches this file is a path
 * nothing answers at. So it takes no props, prerenders, and serves the 404 as
 * static HTML.
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
