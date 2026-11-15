import { SIDES, UNITS } from '@/lib/content/units'

import { type Locale, PUBLISHED_LOCALES } from './routing'

/** The search palette's index (`app/[locale]/search.json`), not a page. */
const SEARCH_INDEX = 'search.json'

/**
 * First segments under `/en` whose pages carry Indonesian editorial content,
 * and the search index that lists them. Within them, the pages in
 * `ENGLISH_PAGES` below are served in English.
 *
 * K2 (`docs/PROGRES-ARTHUR.md`): English follows later, and an `/en` page
 * without a translation answers 307 to its `/id` twin. Until R0 only `/en`
 * itself did, so `/en/konstruksi` rendered English chrome around Indonesian
 * copy (`docs/TINJAUAN-F01-F03.md` C2).
 *
 * A denylist rather than "everything under `/en`": `/en/work` is fully
 * English and stays, an unknown `/en/...` keeps its own 404 instead of being
 * bounced to an `/id` 404, and the retired `/en/journal` (F5-04) its own 410
 * in English, from `lib/seo/route-status.ts`. A new Arthur route is
 * added here in the same change that adds the route.
 */
export const UNTRANSLATED_SEGMENTS: readonly string[] = [
  ...UNITS,
  'halaman',
  'kebijakan',
  'kontak',
  'layanan',
  'metode',
  'pembayaran',
  /*
   * Not a page: the search palette's index (`app/[locale]/search.json`).
   * It follows its pages. While no page is open in English it answers 307 to
   * the Indonesian index, as it did since 2026-10-22, when 13 of its 22 rows
   * linked to `/en` addresses that answered 307. Once one is open, the English
   * index is served and lists only the open pages and the work catalogue
   * (`lib/content/search-index.ts`). Its two readers, the palette and the 404's
   * suggestions (`vault/blocks/wayfinder`), fetch it and follow a 307 if there
   * is one. Draft mode keeps the English index for Presentation, as it keeps
   * the pages.
   */
  SEARCH_INDEX,
]

/**
 * The fourteen pages whose English the owner approved for R7 ("Setujui
 * semua", 15 November 2026, `docs/R7-SERAH-INGGRIS.md`): the home page, the
 * three units, the six sides, `/metode`, `/layanan`, `/pembayaran` and
 * `/kontak`. The only pages `ENGLISH_PAGES` may open.
 */
export const R7_PAGES: readonly string[] = [
  '/',
  ...UNITS.map((unit) => `/${unit}`),
  ...UNITS.flatMap((unit) => SIDES[unit].map((side) => `/${unit}/${side}`)),
  '/metode',
  '/layanan',
  '/pembayaran',
  '/kontak',
]

/**
 * Arthur's pages whose English is open: approved by the owner, written to
 * Sanity, and served at `/en`. Every other page under the segments above
 * keeps answering 307 to its `/id` twin.
 *
 * Locale-free templates (`/`, `/konstruksi`, `/konstruksi/pelaku-proyek`),
 * not segments, and always a subset of `R7_PAGES`. R7 did not cover the
 * situation and work pages under each side (`docs/R7-SERAH-INGGRIS.md` §17),
 * so opening the `konstruksi` segment would serve those in English chrome
 * around Indonesian copy, which is the mixture K2 exists to prevent.
 *
 * K2 as changed on 15 November 2026 (`docs/PROGRES-ARTHUR.md`): a page opens
 * once its English is in Sanity (written 15 November, `docs/R7-CATATAN-TULIS.md`)
 * and every code string it shows is on `main` (UI1 and P2 in #94, the drawing
 * labels L4 in #95). `e2e/english-pages.e2e.ts` proves each open page carries
 * no Indonesian, in its text, `alt`, `aria-label`, `title` and head.
 * Everything that advertises a page reads `localesForTemplate` below: the
 * hreflang (`lib/seo/alternates.ts`), the sitemap and `/llms.txt` through the
 * route catalogue, and the search index. The language switcher
 * (`components/ui/language-switcher`) offers English on exactly these pages,
 * so it can never point at a 307.
 *
 * Twelve of the fourteen are open. `/layanan` and `/pembayaran` wait: their
 * head takes its title and description from plain Sanity fields
 * (`metadata.title`, `metadata.description` on the first sequence and on the
 * `cara-kami-dibayar` page), which hold Indonesian only, and R7 approved no
 * English for them. Opened as they are, an English page would carry an
 * Indonesian title and description.
 */
export const ENGLISH_PAGES: readonly string[] = [
  '/',
  ...UNITS.map((unit) => `/${unit}`),
  ...UNITS.flatMap((unit) => SIDES[unit].map((side) => `/${unit}/${side}`)),
  '/metode',
  '/kontak',
]

/** `/konstruksi/` and `/konstruksi` are one template; `/` stays `/`. */
function normalTemplate(template: string): string {
  return template.length > 1 ? template.replace(/\/+$/, '') : template
}

/** Whether a locale-free template's page is open in English. */
export function isEnglishPage(
  template: string,
  englishPages: readonly string[] = ENGLISH_PAGES
): boolean {
  return englishPages.includes(normalTemplate(template))
}

/**
 * The locales a locale-free template is served and advertised in: the
 * published ones, plus English where the page is open. hreflang, the sitemap,
 * the route catalogue and the search index all read this, so they cannot
 * disagree about which pages are bilingual.
 */
export function localesForTemplate(
  template: string,
  englishPages: readonly string[] = ENGLISH_PAGES
): readonly Locale[] {
  return isEnglishPage(template, englishPages)
    ? [...PUBLISHED_LOCALES, 'en']
    : PUBLISHED_LOCALES
}

/**
 * Every locale that has at least one advertised page: the published ones,
 * plus English once a page is open. What a surface covering the whole site
 * (`/llms.txt`, the search index's prerender) iterates.
 */
export const ADVERTISED_LOCALES: readonly Locale[] =
  ENGLISH_PAGES.length > 0 ? [...PUBLISHED_LOCALES, 'en'] : PUBLISHED_LOCALES

/**
 * The `/id` twin of an untranslated English path, or `null` to leave it.
 *
 * `englishPages` is a parameter only so tests can open pages; the proxy uses
 * the default.
 */
export function publicLocaleRedirect(
  pathname: string,
  englishPages: readonly string[] = ENGLISH_PAGES
): string | null {
  if (pathname === '/en' || pathname === '/en/') {
    return isEnglishPage('/', englishPages) ? null : '/id'
  }

  const match = /^\/en(\/([^/]+)(?:\/.*)?)$/.exec(pathname)
  if (!match) return null

  const [, rest = '', segment] = match
  if (!segment || !UNTRANSLATED_SEGMENTS.includes(segment)) return null
  // The English index is served once it has an English page to list.
  if (segment === SEARCH_INDEX) {
    return englishPages.length > 0 ? null : `/id${rest}`
  }
  return isEnglishPage(rest, englishPages) ? null : `/id${rest}`
}
