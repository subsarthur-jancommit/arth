import { BRAND_ALTERNATE_NAMES, BRAND_NAME } from '@/lib/brand'
import { APP_BASE_URL } from '@/lib/env'
import { type Locale, routing } from '@/lib/i18n/routing'

/**
 * Canonical facts about the site owner.
 *
 * Single source of truth for entity copy: the JSON-LD graph, any crawlable
 * "about" prose, and `/llms.txt` all read from here, so they can never
 * disagree with each other.
 *
 * Hardcoded on purpose. Answer engines (ChatGPT, Claude, Perplexity, Google
 * AI Overviews) cite what they can read as plain text — if these values
 * render empty, the site has no citable identity. If editors need to own
 * this copy, back it with a CMS singleton and keep these as fallbacks.
 *
 * Prefer phrasing that does not go stale: "commissioned work" beats
 * "12 commissions in 2026". Values still waiting on the studio are marked
 * with a TODO below rather than guessed.
 *
 * ## Prose is per-locale; identity is not
 *
 * The site is bilingual, and until Tahap 10 this file was not: every fact
 * here was one English string, so `/id` shipped an English `<meta
 * name="description">`, an English `schema.org` `description`, English
 * `knowsAbout` terms and English agent instructions. The UI was translated
 * and everything a machine reads was not — which is the half a reader never
 * sees and an answer engine only sees.
 *
 * So the fields split by whether language changes them. A name, a URL, a
 * logo and an email address are the same in both languages and stay plain
 * strings; a sentence, a service list and a set of instructions are
 * {@link Localized}. Being a `Record<Locale, …>` rather than a partial map is
 * deliberate: adding a locale to `lib/i18n/routing.ts` becomes a type error
 * here rather than a silent fallback to English.
 */

/**
 * A value the studio states differently in each language.
 *
 * Total over `Locale`, so a new locale cannot be added without translating
 * every field — see the note above.
 */
export type Localized<T> = Record<Locale, T>
export interface AgentUseCase {
  /** Short job name that an agent can match against its task. */
  name: string
  /** Concrete boundary for when this site or product is a good fit. */
  description: string
}

export interface AgentGuidance {
  whenToUse: readonly AgentUseCase[]
  /** Ordered instructions for starting or continuing the job. */
  howToUse: readonly string[]
}

export interface DeveloperResource {
  name: string
  description: string
  /** Absolute URL so the resource also works outside the rendered site. */
  url: string
}

export interface SiteFacts {
  /** Display name, exactly as it should be cited. */
  name: string
  /** Other spellings people search for (casing variants, abbreviations). */
  alternateNames: readonly string[]
  url: string
  /** Absolute URL — relative paths are ignored by most consumers. */
  logo: string
  /** One or two sentences: who, where, for whom. Answers "what is X?". */
  description: Localized<string>
  /** ISO year or date. */
  foundingDate?: string
  /** Human-readable location, e.g. 'Buenos Aires, Argentina'. */
  locationName?: string
  /** ISO 3166-1 alpha-2, e.g. 'AR'. */
  addressCountry?: string
  areaServed?: Localized<string>
  /** What you sell, in the words a buyer would use. */
  services: Localized<readonly string[]>
  /** Topics you are an authority on — feeds schema.org `knowsAbout`. */
  knowsAbout: Localized<readonly string[]>
  email?: string
  /** Profile URLs (social, directories) — feeds schema.org `sameAs`. */
  sameAs: readonly string[]
  /** Task-oriented instructions for agents. Omit when the site is not callable. */
  agentGuidance?: Localized<AgentGuidance>
  /** Real, public technical resources. Never list a surface that is not shipped. */
  developerResources?: readonly DeveloperResource[]
}

/**
 * Canonical, normalized base URL — the single place every absolute URL in
 * the app (sitemap, robots, `/llms.txt`, JSON-LD) derives from.
 *
 * `APP_BASE_URL` (`lib/env.ts`) already carries the fallback chain
 * (`NEXT_PUBLIC_BASE_URL`, then Vercel's production domain, then
 * `https://localhost:3000` — `lib/base-url.ts`); this just normalizes it once. `NEXT_PUBLIC_BASE_URL` is validated with `z.url()`, which permits
 * a trailing slash. Everything below concatenates onto this, so an
 * unnormalized value would emit `//icon.png` and `//#organization` — a
 * broken logo and a JSON-LD `@id` that no longer matches the one other nodes
 * reference. Strip it once, here, rather than in every consumer.
 */
export const BASE_URL = APP_BASE_URL.replace(/\/+$/, '')

/*
 * ## Placeholders are marked, not hidden
 *
 * The studio has not supplied contact details, a founding year, or profile
 * URLs yet. Rather than invent them, the fields that need a real answer are
 * either omitted or use the `.example` TLD (RFC 2606 — reserved, never
 * resolves, so a placeholder can never accidentally reach a stranger). That
 * matches `lib/content/home-fallback.ts`, which uses the same address.
 *
 * `docs/PANDUAN-STUDIO.md` §6 lists exactly which of these the studio has to
 * hand over before launch.
 */
export const SITE: SiteFacts = {
  name: BRAND_NAME,
  alternateNames: [...BRAND_ALTERNATE_NAMES],
  url: BASE_URL,
  logo: `${BASE_URL}/icon.png`,
  description: {
    en: 'Arthur is an umbrella over three units: Konstruksi, Teknologi, and Peekabo, the agency among them. Each unit is read from two sides.',
    id: 'Arthur adalah payung atas tiga unit: Konstruksi, Teknologi, dan Peekabo, agency di antaranya. Tiap unit dibaca dari dua sisi.',
  },
  areaServed: { en: 'Worldwide', id: 'Seluruh dunia' },
  /*
   * One entry per unit, and `lib/content/units.test.ts` enforces the
   * arithmetic: this list must not advertise a different number of things
   * than the catalogue can filter by, which is the drift that happens when a
   * unit is added in one place and forgotten in the other.
   *
   * ## Why each entry is a name and a domain, and nothing more
   *
   * The previous entries read as offerings — "Strategy and architecture
   * consulting" — and were written when the site described a different
   * business. Arthur's own description of what each unit sells exists, in the
   * Master Brief's unit headers, and the content rules require those be used
   * **without changing a word**. They are read when the unit content type
   * exists to hold them, not paraphrased here from the unit's name.
   *
   * What is left is what is sourced: the three unit names, from the plan, and
   * the plain meaning of each — construction, technology, and, for Peekabo,
   * that it is the agency among them, which the plan states outright. A
   * fourth clause about capability would be an invented claim about a
   * business, which is the one thing the rules refuse.
   */
  services: {
    en: [
      'Konstruksi — construction',
      'Teknologi — technology',
      'Peekabo — the agency unit',
    ],
    id: [
      'Konstruksi — konstruksi',
      'Teknologi — teknologi',
      'Peekabo — unit agency',
    ],
  },
  /*
   * Topics, at the same width as `services` and for the same reason: three
   * domains, sourced from the three unit names, rather than a longer list
   * claiming expertise nothing in the plan establishes. `lib/seo/schemas.ts`
   * omits the field entirely when it is empty, so a shorter honest list
   * costs nothing a longer invented one would have bought.
   */
  knowsAbout: {
    en: ['Construction', 'Technology', 'Agency work'],
    id: ['Konstruksi', 'Teknologi', 'Pekerjaan agency'],
  },
  /*
   * No email, on purpose — Tahap 35.
   *
   * This carried `studio@arth.example` with a TODO beside it. `.example` is
   * RFC 2606's reserved TLD: it is guaranteed never to resolve, which makes
   * it a fine placeholder for a person to look at and a fabricated fact for a
   * machine to record. It reached `schema.org/Organization.email` on every
   * page, plus `/en/ai` and `/id/ai`.
   *
   * Its consumer guards on its absence (`lib/seo/schemas.ts:139`; the
   * `/ai` machine view did too until Tahap 84 removed it), so leaving it
   * unset omits the field
   * rather than publishing an empty one. Silence is not a claim; a reserved
   * address is.
   *
   * The human-facing pages still show a placeholder contact, labelled as one.
   * `docs/stages/TAHAP-35.md` §3.1 is where that split is argued.
   *
   * TODO(studio): the real address goes here, and the gate in
   * `e2e/promises.e2e.ts` keeps `.example` from coming back with it.
   */
  // Deliberately empty. `sameAs` asserts "these profiles are the same entity";
  // a guessed handle asserts it about someone else's account.
  sameAs: [],
  agentGuidance: {
    en: {
      whenToUse: [
        {
          name: 'Find the right unit',
          description:
            'Use Arthur to find which of its three units — Konstruksi, Teknologi or Peekabo — covers a piece of work, and which side of that unit a reader stands on.',
        },
        {
          name: 'Review past work',
          description:
            'Use Arthur to review completed work with its client, year, engagement shape and scope before making an approach.',
        },
      ],
      howToUse: [
        'Start at /en/konstruksi, /en/teknologi or /en/peekabo (Indonesian: /id/konstruksi and its siblings). Each unit page is the entry to that unit.',
        'Browse the full catalogue at /en/work (English) or /id/work (Indonesian), narrowed by unit at /en/work?unit=konstruksi. Each entry lists client, year, engagement and scope.',
        'Expect a scope and an estimate before anything is agreed rather than after.',
      ],
    },
    id: {
      whenToUse: [
        {
          name: 'Menemukan unit yang tepat',
          description:
            'Pakai Arthur untuk menemukan unit mana di antara Konstruksi, Teknologi, dan Peekabo yang mencakup sebuah pekerjaan, dan dari sisi mana pembacanya berdiri.',
        },
        {
          name: 'Menelusuri pekerjaan sebelumnya',
          description:
            'Pakai Arthur untuk menelusuri pekerjaan yang sudah selesai beserta klien, tahun, bentuk keterlibatan, dan lingkupnya sebelum menghubungi.',
        },
      ],
      howToUse: [
        'Mulai di /id/konstruksi, /id/teknologi, atau /id/peekabo (Inggris: /en/konstruksi dan seterusnya). Halaman unit adalah pintu masuk unit itu.',
        'Telusuri katalog lengkapnya di /id/work (Bahasa Indonesia) atau /en/work (Inggris), dipersempit per unit di /id/work?unit=konstruksi. Tiap entri mencantumkan klien, tahun, keterlibatan, dan lingkup.',
        'Lingkup dan perkiraan diberikan sebelum apa pun disepakati, bukan sesudah.',
      ],
    },
  },
  // No `developerResources`: this is an agency site, not a developer product,
  // and the field's own contract is to never list a surface that is not shipped.
}

/**
 * {@link SITE} with every {@link Localized} field collapsed to one language.
 *
 * This is what consumers read. `SITE.description` is a `Record`, so a caller
 * that forgets the locale gets a type error rather than `[object Object]` in
 * a meta tag.
 */
export interface ResolvedSiteFacts extends Omit<
  SiteFacts,
  'description' | 'areaServed' | 'services' | 'knowsAbout' | 'agentGuidance'
> {
  description: string
  areaServed?: string
  services: readonly string[]
  knowsAbout: readonly string[]
  agentGuidance?: AgentGuidance
}

/**
 * Resolves the site facts for one language.
 *
 * The default is not a convenience — three real surfaces have no locale to
 * pass and never will: `app/manifest.ts` (one manifest per origin),
 * `/llms.txt` and `/robots.txt` (unlocalized by convention, and the
 * convention is what crawlers look for). They get the default locale, and
 * `alternates.ts` still advertises both language versions of every page they
 * point at, so nothing is hidden — it is simply stated once, in the site's
 * primary language.
 *
 * Every surface that *does* know its locale must pass it. `lib/seo/
 * markdown-document.ts` derives one from the requested path rather than
 * defaulting, because a request for `/id/work.md` states its language in the
 * URL.
 */
export function siteFacts(
  locale: Locale = routing.defaultLocale
): ResolvedSiteFacts {
  // The five localized fields are pulled out of the spread rather than
  // overwritten after it. Under `exactOptionalPropertyTypes` an optional
  // `Localized<T>` arriving via `...SITE` is not assignable to an optional
  // `T`, so the spread has to not carry them at all.
  const {
    description,
    areaServed,
    services,
    knowsAbout,
    agentGuidance,
    ...rest
  } = SITE

  const resolved: ResolvedSiteFacts = {
    ...rest,
    description: description[locale],
    services: services[locale],
    knowsAbout: knowsAbout[locale],
  }

  if (areaServed) resolved.areaServed = areaServed[locale]
  if (agentGuidance) resolved.agentGuidance = agentGuidance[locale]

  return resolved
}

/** "a, b, and c" — prose-friendly list for entity copy. */
const CONJUNCTION = {
  en: 'and',
  id: 'dan',
} satisfies Record<Locale, string>

/**
 * "a, b, and c" in English; "a, b, dan c" in Indonesian.
 *
 * The locale argument arrived in Tahap 35. Before it, `/id/ai` printed
 * "Konsultasi strategi dan arsitektur, Rekayasa AI dan data, **and**
 * Pengerjaan pesanan" — an English conjunction inside a page whose every
 * other word is Indonesian, on the surface built for machines to read.
 *
 * The default keeps `/llms.txt` and the manifest unchanged: both are
 * single-origin, unlocalized documents by convention, and both carry written
 * reasoning for resolving to the default locale.
 */
export function formatList(
  items: readonly string[],
  locale: Locale = routing.defaultLocale
): string {
  if (items.length <= 1) return items[0] ?? ''
  const last = items[items.length - 1]
  return `${items.slice(0, -1).join(', ')}, ${CONJUNCTION[locale]} ${last}`
}
