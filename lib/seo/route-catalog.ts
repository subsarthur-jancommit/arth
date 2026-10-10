import type { MetadataRoute } from 'next'

import { type Unit, UNITS, unitTemplate } from '@/lib/content/units'
import { localizedPath } from '@/lib/i18n/paths'
import { type Locale, routing } from '@/lib/i18n/routing'
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
  /** The locale-free path this entry was expanded from (`/`, `/studio`). */
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

export const STATIC_ROUTE_TEMPLATES: readonly StaticRoute[] = [
  {
    path: '/',
    label: { en: 'Home', id: 'Beranda' },
    description: SITE.description,
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    path: '/journal',
    label: { en: 'Journal', id: 'Jurnal' },
    description: {
      en: 'Notes on how the work is scoped, decided and delivered: method rather than announcements.',
      id: 'Catatan tentang bagaimana pekerjaan ditentukan lingkupnya, diputuskan, dan dikirim: metode, bukan pengumuman.',
    },
    changeFrequency: 'weekly',
    priority: 0.6,
  },
  {
    path: '/studio',
    label: { en: 'Studio', id: 'Studio' },
    description: {
      en: 'How the work is scoped, decided and delivered, the units it runs through, and the colophon for this site.',
      id: 'Bagaimana pekerjaan ditentukan lingkupnya, diputuskan, dan dikirim, unit yang menjalankannya, serta kolofon situs ini.',
    },
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: '/work',
    label: { en: 'Work', id: 'Karya' },
    description: {
      en: 'The full catalogue of completed engagements, with client, year, engagement and scope for each.',
      id: 'Katalog lengkap penugasan yang sudah selesai, lengkap dengan klien, tahun, bentuk keterlibatan, dan lingkupnya.',
    },
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  /*
   * One entry per unit. Side routes join when F1-04 builds their pages — a
   * sitemap must not advertise a page that does not answer yet.
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
]

/**
 * Every static route, expanded across every locale — `/en`, `/id`,
 * `/en/studio`, `/id/studio`.
 *
 * This is what gets *advertised*: the sitemap, `/llms.txt`, and the
 * Markdown-representation lookup in `lib/seo/alternates.ts` all read
 * it. Because `localePrefix` is 'always', each entry is also the page's one
 * canonical URL, which is the invariant `alternates.ts` requires — a canonical
 * that disagrees with the sitemap asks a search engine to crawl one URL and
 * index another.
 */
export const STATIC_ROUTES: readonly LocalizedStaticRoute[] =
  routing.locales.flatMap((locale) =>
    STATIC_ROUTE_TEMPLATES.map((route) => ({
      ...route,
      label: route.label[locale],
      description: route.description[locale],
      template: route.path,
      locale,
      path: localizedPath(locale, route.path),
    }))
  )
