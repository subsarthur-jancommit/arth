/**
 * The three units Arthur covers, and the two sides each one is read from.
 *
 * ## Why this module exists at all
 *
 * The same lists are needed by systems that cannot see each other: the Sanity
 * schema's closed list, the `/{unit}` and `/{unit}/{side}` routes and their
 * `generateStaticParams`, the sitemap and route catalogue, the catalogue
 * filters, the navigation, and the structured data. Written out separately
 * they drift, and the drift is silent — a route with no schema value renders
 * an empty page, a schema value with no route is unreachable, and neither
 * fails a build.
 *
 * `lib/content/units.test.ts` is the other half: it checks that every key here
 * is labelled in both languages and that the structured data advertises the
 * same number of things the catalogue can filter by.
 *
 * ## Units, not practices
 *
 * This replaces `lib/content/practices.ts`, which held `consulting`,
 * `ai-data` and `commission` — the three things a single agency did. Arthur is
 * not one agency: it is an umbrella over three units, and Peekabo is the
 * agency among them. That is a different shape, not a rename, which is why
 * the sides below exist and practices had no equivalent.
 *
 * The values are keys and are not localised, for the reason `practices.ts`
 * recorded and which still holds: a localised segment would give one page two
 * different URLs, and `/konstruksi` would stop meaning the same thing in each
 * language. Human labels live in `messages/*.json`.
 */

/**
 * The three units, in the order a reader meets them.
 *
 * `peekabo` is the agency's own brand rather than a description of it, which
 * is why it reads unlike the other two. `lib/brand.ts` records it as an
 * alternate name for the organisation for the same reason.
 */
export const UNITS = ['konstruksi', 'teknologi', 'peekabo'] as const

export type Unit = (typeof UNITS)[number]

export function isUnit(value: string | undefined): value is Unit {
  // SAFETY: `UNITS` is a readonly tuple of string literals. Widening it to
  // `readonly string[]` only relaxes the element type for `includes`, which
  // cannot accept an argument outside the narrower union, and reads no
  // property the tuple does not have. Same shape as `isLocale` in
  // `lib/i18n/routing.ts`.
  return value !== undefined && (UNITS as readonly string[]).includes(value)
}

/**
 * The two sides of each unit, in the order that unit opens with.
 *
 * A side is a buyer, not a service: Konstruksi splits by the reader's role on
 * a project, Teknologi by how technical the reader is, and Peekabo by which
 * end of a sale they stand at. So the pair is never interchangeable, and the
 * order is not alphabetical — it is the entry the unit leads with.
 *
 * **Teknologi leads with `siap-pakai`, which is its side B.** The other two
 * lead with their side A. That asymmetry is deliberate and comes from the
 * plan's own entry column, not from a sort: the reader Teknologi expects to
 * meet first is the one who wants a finished thing, not the one who wants to
 * read the build.
 */
export const SIDES = {
  konstruksi: ['pelaku-proyek', 'pemilik-bangunan'],
  teknologi: ['siap-pakai', 'paham-teknis'],
  peekabo: ['pemilik-usaha', 'jaringan'],
} as const satisfies Record<Unit, readonly [string, string]>

export type Side = (typeof SIDES)[Unit][number]

/**
 * The editor-facing title of each unit, for the Studio's closed list.
 *
 * A third thing from the reader's label in `messages/*.json` and from the key
 * itself: the Studio is not localised, and an editor picking a radio option
 * should read a name rather than a slug.
 *
 * Written out rather than derived by capitalising the key. A key is lower-case
 * and hyphenated by construction, so capitalising it happens to work for these
 * three and would quietly mangle the first branded or two-word unit added
 * after them. `satisfies Record<Unit, string>` is what makes a unit added
 * without a title fail to compile instead.
 */
export const UNIT_STUDIO_TITLES = {
  konstruksi: 'Konstruksi',
  teknologi: 'Teknologi',
  peekabo: 'Peekabo',
} as const satisfies Record<Unit, string>

/** Every side across every unit, for a sweep that does not care which unit. */
export const ALL_SIDES = UNITS.flatMap((unit) => SIDES[unit]) as readonly Side[]

export function isSideOf(unit: Unit, value: string | undefined): boolean {
  return (
    value !== undefined && (SIDES[unit] as readonly string[]).includes(value)
  )
}

/**
 * The locale-free path of a unit's page.
 *
 * A unit is a **top-level** segment — `/konstruksi`, not `/unit/konstruksi` —
 * which is what makes `RESERVED_SLUGS` below load-bearing rather than tidy.
 */
export function unitTemplate(unit: Unit): string {
  return `/${unit}`
}

/** The locale-free path of a side's page, under its own unit. */
export function sideTemplate(unit: Unit, side: string): string {
  return `/${unit}/${side}`
}

/**
 * Slugs a CMS page may never take, because a static route already answers
 * there.
 *
 * ## Why this is larger than the one guard it replaces
 *
 * `practices.ts` had to forbid exactly one slug, `practice`, because that was
 * the single segment its filter lived under. Arthur has no such prefix: each
 * unit **is** a top-level segment, so three slugs are spoken for instead of
 * one, and the other fixed pages of the umbrella take more.
 *
 * Next resolves static segments before `app/[locale]/[...slug]`, so the
 * static page always wins. A CMS page published at one of these slugs would
 * not error — it would simply never be reachable, and nothing would say so.
 * The schema refuses them instead, at the point where someone types one.
 */
export const RESERVED_SLUGS = [
  ...UNITS,
  'cara-kerja',
  'kontak',
  'kebijakan',
  'satu-klien-tiga-unit',
  // Still live from the previous site, and still reachable by URL even after
  // they leave the navigation (F1-06).
  'work',
  'journal',
  // Sanity Studio, which `proxy.ts` keeps unlocalised.
  'cms',
] as const

/**
 * The character the capability lines are authored with, between items.
 *
 * Carried over from `practices.ts` unchanged, including its reason: a line in
 * `messages/{en,id}.json` holds several pieces of information in one string,
 * and the middle dot is the only thing separating them. No capability's name
 * contains one.
 */
export const CAPABILITY_SEPARATOR = '·'

/**
 * One authored capability line, read back as the items it was written from.
 *
 * The alternative — a named message key per item — does not type-check where
 * it is needed, because the caller maps over the whole union and TypeScript
 * cannot correlate the two halves through a `.map()`. `practices.ts` recorded
 * that at length; the conclusion has not changed, so the line stays one
 * readable sentence for whoever translates it and the guarantee lives in the
 * test instead.
 *
 * A line that lost its separators degrades to a one-item list rather than an
 * empty section, and the test is what stops that reaching a reader.
 */
export function capabilityItems(line: string): readonly string[] {
  return line
    .split(CAPABILITY_SEPARATOR)
    .map((item) => item.trim())
    .filter((item) => item !== '')
}
