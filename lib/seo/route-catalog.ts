import type { MetadataRoute } from 'next'

import {
  SIDES,
  type Side,
  sideTemplate,
  type Unit,
  UNITS,
  unitTemplate,
} from '@/lib/content/units'
import { localizedPath } from '@/lib/i18n/paths'
import { PUBLISHED_LOCALES, type Locale } from '@/lib/i18n/routing'
import { isAwaitingContent } from '@/lib/seo/awaiting-content'
import { type Localized, SITE } from '@/lib/seo/site'

export interface StaticRoute {
  path: string
  /**
   * Both localized, because these strings are read by people and by answer
   * engines: they are what `/llms.txt` and the Markdown representations
   * print next to each link. Leaving them English-only once made `/id/ai` —
   * a machine view removed in Tahap 84 — an Indonesian page listing English
   * descriptions of its own pages — see `lib/seo/site.ts` for the same split applied to entity copy.
   */
  label: Localized<string>
  description: Localized<string>
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  priority: number
}

/**
 * A {@link StaticRoute} expanded to one concrete locale, with its prose
 * already resolved to that language.
 */
export interface LocalizedStaticRoute extends Omit<
  StaticRoute,
  'label' | 'description'
> {
  label: string
  description: string
  /** The locale-free path this entry was expanded from (`/`, `/cara-kerja`). */
  template: string
  locale: Locale
}

/**
 * Starter-owned pages that always exist, independent of an optional CMS.
 *
 * These are **templates**: locale-free paths. They are what deduplication
 * against CMS slugs compares, since a CMS slug is locale-free too. The
 * emitted, per-locale form is {@link STATIC_ROUTES} below — see
 * `lib/i18n/paths.ts` for why the two are deliberately kept distinct.
 */
/*
 * Labels and descriptions for the unit views.
 *
 * Deliberately not read from `messages/*.json`. This catalogue feeds
 * `/llms.txt`, the Markdown representations and the sitemap, all of which are
 * assembled outside any
 * request and therefore outside next-intl's locale context; `SITE` in
 * `lib/seo/site.ts` is hardcoded for the same reason and says so. The rendered
 * page's own `<h1>` does come from the message files, which is why these read
 * as descriptions of a listing rather than as page titles.
 */
const UNIT_LABELS = {
  konstruksi: { en: 'Konstruksi', id: 'Konstruksi' },
  teknologi: { en: 'Teknologi', id: 'Teknologi' },
  peekabo: { en: 'Peekabo', id: 'Peekabo' },
} satisfies Record<Unit, Localized<string>>

/*
 * Structural, not promotional, and deliberately so.
 *
 * These say who each unit is read by — which is sourced, from the plan's own
 * side table — rather than what each unit sells, which is not. The Master
 * Brief's unit headers are the ready-to-publish source for the second kind of
 * sentence, and they are read when the unit pages are written, not here.
 *
 * So no sample label is needed on these: a sentence that only states what is
 * true does not need to be marked as a placeholder. An invented description of
 * offerings would, and is the reason this file does not carry one.
 */
const UNIT_DESCRIPTIONS = {
  konstruksi: {
    en: 'Konstruksi, read from two sides: the people running a project, and the people who own the building.',
    id: 'Konstruksi, dibaca dari dua sisi: yang menjalankan proyek, dan yang memiliki bangunannya.',
  },
  teknologi: {
    en: 'Teknologi, read from two sides: buyers who want a finished thing, and buyers who read the build.',
    id: 'Teknologi, dibaca dari dua sisi: pembeli yang mau hasil siap pakai, dan pembeli yang paham teknis.',
  },
  peekabo: {
    en: "Peekabo, Arthur's agency, read from two sides: brand and business owners, and the seller network.",
    id: 'Peekabo, agency-nya Arthur, dibaca dari dua sisi: pemilik usaha dan brand, dan jaringan penjual.',
  },
} satisfies Record<Unit, Localized<string>>

const SIDE_LABELS = {
  'pelaku-proyek': { en: 'People running a project', id: 'Pelaku proyek' },
  'pemilik-bangunan': { en: 'Building owners', id: 'Pemilik bangunan' },
  'siap-pakai': { en: 'Ready to use', id: 'Siap pakai' },
  'paham-teknis': { en: 'Technically fluent', id: 'Paham teknis' },
  'pemilik-usaha': { en: 'Business owners', id: 'Pemilik usaha' },
  jaringan: { en: 'The seller network', id: 'Jaringan penjual' },
} satisfies Record<Side, Localized<string>>

/*
 * Side descriptions remain taxonomy, not sales copy. They tell a machine
 * which unit and reader vantage point a URL represents without filling the
 * three owner-controlled beats on the visible page with invented claims.
 */
const SIDE_DESCRIPTIONS = {
  'pelaku-proyek': {
    en: 'The Konstruksi side for people running a project.',
    id: 'Sisi Konstruksi untuk pelaku proyek.',
  },
  'pemilik-bangunan': {
    en: 'The Konstruksi side for people who own the building.',
    id: 'Sisi Konstruksi untuk pemilik bangunan.',
  },
  'siap-pakai': {
    en: 'The Teknologi side for people who want something ready to use.',
    id: 'Sisi Teknologi untuk pembaca yang menginginkan hasil siap pakai.',
  },
  'paham-teknis': {
    en: 'The Teknologi side for technically fluent readers.',
    id: 'Sisi Teknologi untuk pembaca yang paham teknis.',
  },
  'pemilik-usaha': {
    en: 'The Peekabo side for business owners.',
    id: 'Sisi Peekabo untuk pemilik usaha.',
  },
  jaringan: {
    en: 'The Peekabo side for the seller network.',
    id: 'Sisi Peekabo untuk jaringan penjual.',
  },
} satisfies Record<Side, Localized<string>>

/*
 * A fixed page still awaiting published content is not advertised anywhere
 * (`lib/seo/awaiting-content.ts`): the proxy answers it 404, and a sitemap,
 * llms.txt or search entry pointing at a 404 is a broken promise.
 */
export const STATIC_ROUTE_TEMPLATES: readonly StaticRoute[] = (
  [
    {
      path: '/',
      label: { en: 'Home', id: 'Beranda' },
      description: SITE.description,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      path: '/cara-kerja',
      label: { en: 'How we work', id: 'Cara kami bekerja' },
      description: {
        en: 'Sample information about how Arthur works, pending owner review.',
        id: 'Informasi contoh tentang cara Arthur bekerja, menunggu tinjauan pemilik.',
      },
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    /*
     * The meta description both sequences carry in Sanity since 2026-10-22
     * (`docs/V3-SERAH-W7-HALAMAN.md` §2, recorded in
     * `docs/V3-CATATAN-TULIS.md`), so the catalog and the page head say the
     * same thing. Sanity's `metadata` field is not localized and the page
     * resolves `en` to the same Indonesian sentence, so both slots carry it
     * until an English translation is approved.
     */
    {
      path: '/satu-klien-tiga-unit',
      label: { en: 'One client, three units', id: 'Satu klien, tiga unit' },
      description: {
        en: 'Rangkaian yang mungkin dari tiga unit Arthur di Subang, Purwakarta, dan Bandung. Setiap unit tetap bisa dibeli sendiri.',
        id: 'Rangkaian yang mungkin dari tiga unit Arthur di Subang, Purwakarta, dan Bandung. Setiap unit tetap bisa dibeli sendiri.',
      },
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/kontak',
      label: { en: 'About and contact', id: 'Tentang dan kontak' },
      description: {
        en: "Arthur's structure, confirmed service area, and current contact status.",
        id: 'Struktur Arthur, wilayah kerja yang sudah dikonfirmasi, dan status kontaknya saat ini.',
      },
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    /*
     * One entry per unit, followed by its two side routes. A sitemap only
     * advertises the sides now that F1-04 gives each one a page that answers.
     *
     * These are not filter permutations of `/work` — they are `○` static pages
     * with their own `<h1>`, their own description and their own canonical, and
     * they are the pages that should rank for a unit's own name rather than
     * the generic index.
     *
     * Generated from the same constant the route's `generateStaticParams` uses,
     * so the sitemap cannot list a view that is not built, or omit one that is.
     */
    ...UNITS.map((unit): StaticRoute => ({
      path: unitTemplate(unit),
      label: UNIT_LABELS[unit],
      description: UNIT_DESCRIPTIONS[unit],
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
    ...UNITS.flatMap((unit) =>
      SIDES[unit].map((side): StaticRoute => ({
        path: sideTemplate(unit, side),
        label: SIDE_LABELS[side],
        description: SIDE_DESCRIPTIONS[side],
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
    ),
  ] satisfies StaticRoute[]
).filter((route) => !isAwaitingContent(route.path))

/**
 * Every static route with approved visitor-facing copy. English stays out of
 * machine surfaces until its translation is approved.
 *
 * This is what gets *advertised*: the sitemap, `/llms.txt`, and the
 * Markdown-representation lookup in `lib/seo/alternates.ts` all read
 * it. Because `localePrefix` is 'always', each entry is also the page's one
 * canonical URL, which is the invariant `alternates.ts` requires — a canonical
 * that disagrees with the sitemap asks a search engine to crawl one URL and
 * index another.
 */
export const STATIC_ROUTES: readonly LocalizedStaticRoute[] =
  PUBLISHED_LOCALES.flatMap((locale) =>
    STATIC_ROUTE_TEMPLATES.map((route) => ({
      ...route,
      label: route.label[locale],
      description: route.description[locale],
      template: route.path,
      locale,
      path: localizedPath(locale, route.path),
    }))
  )
