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
import {
  HOW_WE_WORK_LEAD,
  THREE_UNITS_FALLBACK_DESCRIPTION,
} from '@/lib/seo/page-descriptions'
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
  /**
   * For a page whose head reads its description from the CMS, only the
   * fallback: the surfaces print the head's own, through
   * {@link RouteDescriptions}.
   */
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
 * What a page head says about itself, keyed by localized path
 * (`/id/cara-kerja`), for the pages whose head reads its description from
 * the CMS.
 *
 * `lib/seo/route-descriptions.ts` resolves it from the same published read
 * and the same rule the head uses (`lib/seo/page-descriptions.ts`), and
 * `/llms.txt`, the Markdown mirrors and the search index print it in place of
 * the catalog's own `description`. A path missing from the map prints the
 * catalog's: every code-owned page, and a head-described page whose document
 * could not be read.
 */
export type RouteDescriptions = ReadonlyMap<string, string>

/** Nothing resolved: every route prints the catalog's own description. */
export const NO_ROUTE_DESCRIPTIONS: RouteDescriptions = new Map()

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
    en: 'Konstruksi, for people running projects and for building owners.',
    id: 'Konstruksi, untuk pelaku proyek dan untuk pemilik bangunan.',
  },
  teknologi: {
    en: 'Teknologi, for owners who want it ready to use and for developers and technical teams.',
    id: 'Teknologi, untuk yang ingin hasil siap pakai dan untuk yang paham teknis.',
  },
  peekabo: {
    en: "Peekabo, Arthur's agency, for business owners and brands, and for people who want to help sell.",
    id: 'Peekabo, agency kami, untuk pemilik usaha dan brand, serta untuk yang ingin ikut menjualkan.',
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
    en: 'Konstruksi, for people running projects.',
    id: 'Konstruksi, untuk pelaku proyek.',
  },
  'pemilik-bangunan': {
    en: 'Konstruksi, for building owners.',
    id: 'Konstruksi, untuk pemilik bangunan.',
  },
  'siap-pakai': {
    en: 'Teknologi, for owners who want it ready to use.',
    id: 'Teknologi, untuk yang ingin hasil siap pakai.',
  },
  'paham-teknis': {
    en: 'Teknologi, for developers and technical teams.',
    id: 'Teknologi, untuk yang paham teknis.',
  },
  'pemilik-usaha': {
    en: 'Peekabo, for business owners and brands.',
    id: 'Peekabo, untuk pemilik usaha dan brand.',
  },
  jaringan: {
    en: 'Peekabo, for people who want to help sell.',
    id: 'Peekabo, untuk yang ingin ikut menjualkan.',
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
    /*
     * The surfaces print what the page head says, not this line:
     * `lib/seo/route-descriptions.ts` reads the published `howWeWork`
     * document through the page's own loader and applies the head's own rule
     * (its SEO description, else its first written promise). An edit in the
     * Studio therefore reaches the head and the catalog together.
     *
     * This is printed only when that document cannot be read, and it is the
     * page's own lead, not a copy of anything the Studio holds. Both slots
     * carry it because the page resolves `en` to the Indonesian copy until an
     * English translation is approved (owner, 2026-10-22).
     */
    {
      path: '/cara-kerja',
      label: { en: 'How we work', id: 'Cara kami bekerja' },
      description: { en: HOW_WE_WORK_LEAD, id: HOW_WE_WORK_LEAD },
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    /*
     * Resolved the same way, from the first published sequence's SEO
     * description. The fallback is the head's own, which the head also uses
     * for `en`.
     */
    {
      path: '/satu-klien-tiga-unit',
      label: { en: 'One client, three units', id: 'Satu klien, tiga unit' },
      description: {
        en: THREE_UNITS_FALLBACK_DESCRIPTION,
        id: THREE_UNITS_FALLBACK_DESCRIPTION,
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
