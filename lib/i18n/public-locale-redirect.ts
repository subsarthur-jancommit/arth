import { SIDES, UNITS } from '@/lib/content/units'

/**
 * First segments under `/en` whose pages carry Indonesian editorial content,
 * and the search index that lists them.
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
   * It lists the pages above, so in English it could only describe them in
   * descriptions nobody approved, and link to `/en` addresses that answer 307
   * anyway — 13 of its 22 rows, measured on production 2026-10-22. Its two
   * readers, the palette and the 404's suggestions (`vault/blocks/wayfinder`),
   * fetch it and follow the 307, so `/en/work` keeps both over the published
   * index. Draft mode keeps the English index for
   * Presentation, as it keeps the pages.
   */
  'search.json',
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
 * once its English is in Sanity and every code string it shows is on `main`,
 * one page at a time, each in its own PR with an e2e proof that the page
 * carries no Indonesian. That same PR makes `lib/seo/alternates.ts` and the
 * sitemap read this list. The language switcher
 * (`components/ui/language-switcher`) offers English on exactly these pages,
 * so it can never point at a 307.
 *
 * Empty until the first page opens.
 */
export const ENGLISH_PAGES: readonly string[] = []

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
  return isEnglishPage(rest, englishPages) ? null : `/id${rest}`
}
