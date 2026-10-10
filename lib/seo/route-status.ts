import { BRAND_NAME } from '@/lib/brand'
import { UNITS, type Unit } from '@/lib/content/units'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'

/**
 * The two honest answers a URL can get before rendering starts: gone, and
 * never existed.
 *
 * ## Why this is not `notFound()`
 *
 * Cache Components force a prerendered page's response to 200, which
 * `e2e/not-found.e2e.ts` documents and which is why every unknown URL on this
 * site has been a *soft* 404 — a page that says "not found" over a status
 * that says "here it is". A crawler believes the status.
 *
 * `proxy.ts` runs before route matching, so a real status is available there
 * and nowhere else. `lib/i18n/guessed-paths.ts` already relies on that for
 * its 308s and says so at length.
 *
 * ## Why the body is a hand-written document
 *
 * Middleware cannot render a React tree, and it cannot attach a status to a
 * rewrite — so a response with a real 404 or 410 cannot also be the site's
 * own 404 page with its chrome, fonts and Lenis wiring. The choice is
 * therefore between a correct status with a plain body and a wrong status
 * with the designed body.
 *
 * This takes the status and makes the body as much of a page as a standalone
 * document can be: the wordmark, the site's two palettes, the same
 * label/code/message/recovery shape as `components/ui/not-found-view`, and
 * real links out. It is **not** the full chrome, and that is a cost, stated
 * here rather than discovered later.
 *
 * `style-src` carries `'unsafe-inline'` (`lib/integrations/csp.ts`), so the
 * inline stylesheet below is within the policy the rest of the site runs
 * under rather than an exception made for it.
 */

/** `410 Gone`: it was a page here, and it is not coming back. */
export const GONE_STATUS = 410

/** `404 Not Found`: nothing was ever published at this address. */
export const NOT_FOUND_STATUS = 404

/**
 * Locale-free prefixes that answer `410 Gone`.
 *
 * These are the practice routes. They were real, indexable pages of the
 * portfolio site this project was forked from — `/practice/<value>` was a
 * topic page per practice, and `/work/practice/<value>` was the 308 that fed
 * it — and Arthur reads by unit instead, with no practice to map them onto.
 *
 * `410` rather than `404`, and rather than a redirect: a redirect would claim
 * `/practice/consulting` and `/konstruksi` are the same subject, which is the
 * one thing that is certainly untrue — the three units are not the three
 * practices renamed. `410` tells a crawler to drop the URL instead of
 * re-checking it, which is what should happen to a page with no successor.
 */
export const GONE_PREFIXES = [
  '/practice',
  '/work/practice',
  /*
   * The Indonesian spelling, which was a row in `lib/i18n/guessed-paths.ts`
   * answering `/id/praktik` with a 308 to a home-page anchor. Found by
   * `e2e/route-status.e2e.ts` on the first CI run: without it the reader who
   * typed the label they were shown got a generic `404` while the reader who
   * typed the English one got `410`, which is two different stories about the
   * same retired subject. A unit's own segment needs no second spelling — it
   * is the same string in both languages by construction.
   */
  '/praktik',
] as const

/**
 * Single segments under a locale that a page really answers.
 *
 * ## Why this list exists and why it is dangerous to forget
 *
 * `app/[locale]/[unit]/page.tsx` is a dynamic segment, so it matches *any*
 * single segment and then calls `notFound()` for the ones that are not units
 * — at 200, for the reason above. To answer 404 honestly the proxy has to
 * know, before rendering, which single segments are real; and a list of real
 * routes that is maintained by hand is a list that goes stale the first time
 * a route is added.
 *
 * So it is not maintained by hand. `lib/seo/route-status.test.ts` reads
 * `app/[locale]/` and fails when a static directory there is missing from
 * this list — the same shape of gate `e2e/route-sweep.e2e.ts` applies to the
 * sitemap. A new page therefore cannot ship behind a 404 silently.
 *
 * `cms` is absent on purpose: `proxy.ts`'s `NON_LOCALIZED_PREFIXES` keeps
 * Sanity Studio out of the localized tree entirely, so it never reaches this
 * check.
 */
export const LIVE_SEGMENTS: readonly string[] = [
  ...UNITS,
  'halaman',
  'journal',
  'search.json',
  'studio',
  'work',
]

/** Whether `pathname` is one of the retired practice addresses. */
export function isGonePath(pathname: string): boolean {
  const withoutLocale = stripLocale(pathname).path
  return GONE_PREFIXES.some(
    (prefix) =>
      withoutLocale === prefix || withoutLocale.startsWith(`${prefix}/`)
  )
}

/**
 * Whether `pathname` is `/{locale}/{segment}` for a segment nothing answers.
 *
 * Deliberately only one segment deep, which is the depth
 * `app/[locale]/[unit]` competes at. Anything deeper is left to the router
 * and its in-chrome 404 (`app/[locale]/[...slug]/page.tsx`): a 404 with the
 * site's own chrome is worth more there than a correct status, because
 * nothing deeper was ever advertised to a crawler.
 */
export function isUnknownSingleSegment(pathname: string): boolean {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length !== 2) return false

  const [maybeLocale, segment] = parts
  if (!maybeLocale || !segment) return false
  if (!isLocale(maybeLocale)) return false

  return !LIVE_SEGMENTS.includes(segment)
}

/** The locale a path announces, and the path with that prefix removed. */
function stripLocale(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  const [first] = parts

  if (first !== undefined && isLocale(first)) {
    return { locale: first, path: `/${parts.slice(1).join('/')}` }
  }

  return { locale: routing.defaultLocale, path: pathname }
}

interface StatusCopy {
  /** The mono label above the code, as `not-found-view` renders it. */
  label: string
  message: string
  description: string
  tryPrefix: string
  home: string
}

/*
 * Copy, hardcoded in both languages.
 *
 * next-intl's message catalogue is request-scoped and loaded by the React
 * tree; middleware has neither. `lib/seo/route-catalog.ts` and
 * `lib/seo/site.ts` hold their prose the same way and record the same
 * reason — so these strings are a third instance of a known pattern rather
 * than a new one.
 *
 * No claim is made in any of them: they describe what happened to a URL. The
 * content rules ask for a source behind every sentence that carries a claim
 * and exempt the ones that only point somewhere else.
 */
const GONE_COPY = {
  en: {
    label: 'Gone',
    message: 'This page has been withdrawn',
    description: `${BRAND_NAME} is read by unit now, and the page that used to be here has no successor among them.`,
    tryPrefix: 'The three units are',
    home: 'Go home',
  },
  id: {
    label: 'Sudah tidak ada',
    message: 'Halaman ini sudah ditarik',
    description: `${BRAND_NAME} sekarang dibaca per unit, dan halaman yang dulu di sini tidak punya penerus di antaranya.`,
    tryPrefix: 'Tiga unitnya',
    home: 'Ke beranda',
  },
} satisfies Record<Locale, StatusCopy>

const NOT_FOUND_COPY = {
  en: {
    label: 'Not found',
    message: 'Nothing is published at this address',
    description: `No page of ${BRAND_NAME} answers here.`,
    tryPrefix: 'The three units are',
    home: 'Go home',
  },
  id: {
    label: 'Tidak ditemukan',
    message: 'Tidak ada yang terbit di alamat ini',
    description: `Tidak ada halaman ${BRAND_NAME} yang menjawab di sini.`,
    tryPrefix: 'Tiga unitnya',
    home: 'Ke beranda',
  },
} satisfies Record<Locale, StatusCopy>

/** The reader-facing name of each unit. */
const UNIT_LINK_LABELS = {
  konstruksi: 'Konstruksi',
  teknologi: 'Teknologi',
  peekabo: 'Peekabo',
} satisfies Record<Unit, string>

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * One standalone branded document for a real 404 or 410.
 *
 * `noindex, nofollow` is repeated in the document even though
 * `next.config.ts` sets `X-Robots-Tag` on every response: this body is
 * written by middleware, and a header can be dropped by a proxy in front of
 * it while the markup cannot.
 */
export function brandedStatusDocument(
  status: typeof GONE_STATUS | typeof NOT_FOUND_STATUS,
  pathname: string
): string {
  const { locale } = stripLocale(pathname)
  const copy =
    status === GONE_STATUS ? GONE_COPY[locale] : NOT_FOUND_COPY[locale]
  const prefix = `/${locale}`

  const unitLinks = UNITS.map(
    (unit) =>
      `<a href="${prefix}/${unit}">${escapeHtml(UNIT_LINK_LABELS[unit])}</a>`
  ).join(' · ')

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(copy.message)} — ${escapeHtml(BRAND_NAME)}</title>
<style>
:root { color-scheme: light dark; --bg: #f6f5f3; --fg: #141414; --muted: #141414b3; --line: #14141426; }
@media (prefers-color-scheme: dark) { :root { --bg: #0f0f0f; --fg: #f6f5f3; --muted: #f6f5f3b3; --line: #f6f5f326; } }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, sans-serif; }
header { padding: 1.5rem 1rem; }
.wordmark { font-weight: 600; letter-spacing: 0.02em; text-decoration: none; color: inherit; }
main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem 4rem; }
.panel { width: 100%; max-width: 34rem; border: 1px solid var(--line); border-radius: 0.75rem; padding: 2rem 1.5rem; text-align: center; }
.label { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
.code { font-size: clamp(3rem, 12vw, 5rem); line-height: 1; margin: 0.5rem 0 1rem; font-weight: 500; }
h1 { font-size: 1.25rem; line-height: 1.3; margin: 0 0 0.75rem; font-weight: 500; }
p { margin: 0 0 1rem; color: var(--muted); line-height: 1.6; font-size: 0.9375rem; }
a { color: inherit; }
.home { display: inline-block; margin-top: 0.5rem; padding: 0.625rem 1.25rem; border: 1px solid var(--line); border-radius: 999px; text-decoration: none; }
</style>
</head>
<body>
<header><a class="wordmark" href="${prefix}">${escapeHtml(BRAND_NAME)}</a></header>
<main>
<div class="panel">
<div class="label">${escapeHtml(copy.label)}</div>
<div class="code">${status}</div>
<h1>${escapeHtml(copy.message)}</h1>
<p>${escapeHtml(copy.description)}</p>
<p>${escapeHtml(copy.tryPrefix)} ${unitLinks}.</p>
<a class="home" href="${prefix}">${escapeHtml(copy.home)}</a>
</div>
</main>
</body>
</html>
`
}
