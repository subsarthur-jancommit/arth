import { defineQuery } from 'next-sanity'

// Page queries
export const pageQuery = defineQuery(`
  *[_type == "page" && statusTinjauan == "disetujui" && slug.current == $slug][0] {
    _id,
    "title": coalesce(judul[_key == $locale][0].value, judul[_key == "id"][0].value, title),
    slug,
    "content": coalesce(
      isi[_key == $locale][0].value,
      isi[_key == "id"][0].value,
      content
    )[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          ...,
          internalLink->{_type, slug, title}
        }
      }
    },
    metadata,
    publishedAt,
    _updatedAt
  }
`)

// ---------------------------------------------------------------------------
// Localized content
// ---------------------------------------------------------------------------

/**
 * Locale selection for `internationalizedArray*` fields.
 *
 * The plugin stores each localized field as `[{ _key: 'en', value: … }]`, so
 * a value is picked by filtering on `_key` and taking the first match. The
 * `coalesce` falls back to Indonesian when a translation has not been written
 * yet — without it the field resolves to null and the page renders a blank
 * heading rather than an untranslated one, which is the worse failure.
 *
 * ## Why these are constants, not a helper function
 *
 * `sanity typegen` extracts queries by static analysis. It follows const
 * string bindings — which is why `richTextWithLinks` above works — but cannot
 * evaluate a function call. An earlier `localized(field)` helper failed with
 * "Could not find binding for node" and silently generated NO types for any
 * localized query. Verbose constants are the price of that check working.
 *
 * ## Why `[_key == $locale]` is safe here, unlike `field[$locale]`
 *
 * This is an array FILTER, which is what GROQ brackets are actually for.
 * The previous localized-object model used `field[$locale]` as dynamic
 * property access: correct at runtime, but typegen cannot know a parameter's
 * value and typed it as `Array<LocaleString>` where a string comes back.
 * Filtering an array types correctly — verified: every localized field below
 * generates `string | null`.
 *
 * The fallback locale is a literal because typegen needs one, duplicating
 * `lib/i18n/routing.ts`. `queries.test.ts` asserts the two stay in step.
 */
const localizedTitle = `"title": coalesce(title[_key == $locale][0].value, title[_key == "id"][0].value)`
const localizedEngagement = `"engagement": coalesce(engagement[_key == $locale][0].value, engagement[_key == "id"][0].value)`
const localizedCoverAlt = `"coverAlt": coalesce(cover.alt[_key == $locale][0].value, cover.alt[_key == "id"][0].value)`
/** Fields shared by the work grid and the project detail page. */
const projectCardFields = `
  _id,
  slug,
  year,
  client,
  span,
  featured,
  // The response key remains practice while legacy work views are migrated.
  // Source documents prefer the F2-02 unit field and fall back to practice.
  "practice": coalesce(unit, practice),
  cover{ ..., "lqip": asset->metadata.lqip },
  ${localizedTitle},
  ${localizedEngagement},
  ${localizedCoverAlt}
`

/**
 * The public catalogue, in one place.
 *
 * `listed` is absent on every document written before the field existed, and
 * `listed != false` is deliberately not `listed == true`: the former treats a
 * missing value as listed, which is the safe default and means no migration is
 * needed. A work is hidden only when the editor explicitly turns it off.
 *
 * Every surface that *advertises* a work reuses this, so "hidden" cannot mean
 * one thing on the home page and another in the sitemap — which is exactly
 * what it did (`docs/AUDIT-2026-08.md` §2.2).
 */
const isListed = `_type == "project" && listed != false`

/**
 * Journal entries.
 *
 * `listed != false` matches the projects' rule and for the same reason: the
 * field is absent on anything written before it existed, so a missing value
 * has to mean listed or every existing document would vanish.
 *
 * The index does **not** project `body`. An index that fetched every entry's
 * full Portable Text would grow with the archive while showing none of it —
 * the entry route fetches its own.
 */
const isListedEntry = `_type == "journalEntry" && listed != false`

const localizedSummary = `"summary": coalesce(summary[_key == $locale][0].value, summary[_key == "id"][0].value)`

const journalCardFields = `
  _id,
  "slug": slug.current,
  date,
  // Keep the compatibility response key used by legacy journal views.
  "practice": coalesce(unit, practice),
  ${localizedTitle},
  ${localizedSummary}
`

/** The journal index, newest first. */
export const journalEntriesQuery = defineQuery(`
  *[${isListedEntry}] | order(date desc) {
    ${journalCardFields}
  }
`)

/** One entry, with its body. */
export const journalEntryQuery = defineQuery(`
  *[${isListedEntry} && slug.current == $slug][0] {
    ${journalCardFields},
    "body": coalesce(body[_key == $locale][0].value, body[_key == "id"][0].value)
  }
`)

/** Slugs for `generateStaticParams`. */
export const journalSlugsQuery = defineQuery(`
  *[${isListedEntry}].slug.current
`)

/** Every listed project, in curated order. */
export const projectsQuery = defineQuery(`
  *[${isListed}] | order(order asc, publishedAt desc) {
    ${projectCardFields}
  }
`)

/** Home-page selection only. */
export const featuredProjectsQuery = defineQuery(`
  *[${isListed} && featured == true] | order(order asc, publishedAt desc) {
    ${projectCardFields}
  }
`)

/**
 * The work index, optionally narrowed to one unit.
 *
 * `$practice` is a transitional parameter name whose value is a unit key.
 * It is null for the unfiltered view, and GROQ's `||` short-circuits
 * so the comparison is skipped entirely rather than matching nothing.
 */
export const workIndexQuery = defineQuery(`
  *[${isListed} && ($practice == null || coalesce(unit, practice) == $practice)]
    | order(order asc, publishedAt desc) {
    ${projectCardFields}
  }
`)

/**
 * Every listed work's unit, for the filter chips.
 *
 * ## Why the raw list rather than `array::unique`
 *
 * Until Tahap 43 this was `array::unique(…)` and answered one question:
 * which practices have work behind them, so a chip is never a dead end. The
 * chips now also state **how much** work is behind each one — the count the
 * reader sees before pressing, and the payload the cursor carries — and a
 * deduplicated list cannot answer that.
 *
 * Counting happens in TypeScript rather than in a second GROQ round trip:
 * the values are already crossing the wire, six of them, and `Catalogue`
 * needs both answers from the same snapshot. Two queries could disagree.
 *
 * `defined(practice)` is gone for the same reason. A listed work with no
 * practice still counts towards the "All" chip's total, and dropping it here
 * would have made that total quietly smaller than the catalogue it labels.
 * Nulls are filtered where the values are counted.
 */
export const practicesQuery = defineQuery(`
  *[${isListed}]{ "unit": coalesce(unit, practice) }.unit
`)

/**
 * One project, with everything the detail page renders — plus two projections
 * that exist only for metadata, and that were both missing.
 *
 * `excerpt`: `generateSanityMetadata` derives a description from a field of
 * that name, and only `article` had one. So every project page shipped with
 * no `<meta name="description">` and no `og:description`, and a search engine
 * invented a snippet for the whole portfolio. `pt::text` flattens the Portable
 * Text body to a plain string, which is what `truncateDescription` wants.
 *
 * `ogImage`: `schemas/project.ts` tells the editor the cover is "used in the
 * work grid **and as the OpenGraph image**". It was not — the queries never
 * dereferenced the asset, so every shared artwork link rendered the same
 * generic wordmark card. On a site made of paintings that is the most direct
 * loss there is. See `docs/AUDIT-2026-08.md` §1.3.
 *
 * Note for anyone extending this: GROQ has `//` line comments and **no** block
 * comments. A `/* *\/` inside the template literal is a syntax error that
 * typegen reports as "Unexpected end of query" at an unrelated position, and
 * the query then silently vanishes from `sanity.types.ts`.
 */
export const projectQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    ${projectCardFields},
    scope,
    publishedAt,
    metadata,
    _updatedAt,
    "body": coalesce(body[_key == $locale][0].value, body[_key == "id"][0].value)[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          ...,
          internalLink->{_type, slug, title}
        }
      }
    },
    gallery[]{
      ...,
      "lqip": asset->metadata.lqip,
      "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "id"][0].value)
    },
    // The arc. Projected inline for the same reason gallery is: the shape is
    // used by exactly one query, so a shared constant would buy nothing.
    // The _key taken here is the chapter's own -- the _key inside each
    // coalesce scopes to the localized array being filtered, not to this one
    // -- and it is what StepSequence takes as its stable key.
    //
    // No backticks in this comment, and that is not style. Everything from
    // the opening backtick of defineQuery to its close is one JS template
    // literal, so a backtick here ends the string early. Typegen then exits
    // 0, reports "0 queries and 27 schema types", and every query type in
    // sanity.types.ts silently disappears. The note above this query warns
    // about block comments for the same reason; this is the neighbouring
    // hazard, found by walking into it.
    chapters[]{
      _key,
      "heading": coalesce(heading[_key == $locale][0].value, heading[_key == "id"][0].value),
      "body": coalesce(body[_key == $locale][0].value, body[_key == "id"][0].value)
    },
    "outcome": coalesce(outcome[_key == $locale][0].value, outcome[_key == "id"][0].value),
    // Metadata-only projections. See the note above this query.
    "excerpt": pt::text(
      coalesce(body[_key == $locale][0].value, body[_key == "id"][0].value)
    ),
    "ogImage": cover.asset->{
      url,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height
    }
  }
`)

/**
 * Slugs only, for `generateStaticParams`.
 *
 * Deliberately not locale-parameterised: the slug is shared across languages,
 * so one list drives both locales' routes.
 */
export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)].slug.current
`)

/**
 * Arthur's site singleton. `studioSettings` stays in this read path until its
 * one existing production fixture is migrated through procedure §6.
 */
export const siteSettingsQuery = defineQuery(`
  *[
    (_type == "siteSettings" && statusTinjauan == "disetujui") ||
    _type == "studioSettings"
  ]
    | order((_type == "siteSettings") desc, _updatedAt desc)[0] {
    _id,
    name,
    "email": coalesce(kanal.email, email),
    "socials": coalesce(akunSosial, socials),
    portrait,
    metadata,
    "headline": coalesce(
      heroJudul[_key == $locale][0].value,
      heroJudul[_key == "id"][0].value,
      headline[_key == $locale][0].value,
      headline[_key == "id"][0].value
    ),
    "subline": coalesce(
      heroSubjudul[_key == $locale][0].value,
      heroSubjudul[_key == "id"][0].value,
      subline[_key == $locale][0].value,
      subline[_key == "id"][0].value
    ),
    "portraitAlt": coalesce(portrait.alt[_key == $locale][0].value, portrait.alt[_key == "id"][0].value),
    "statement": coalesce(
      pernyataanPemilik[_key == $locale][0].value,
      pernyataanPemilik[_key == "id"][0].value,
      statement[_key == $locale][0].value,
      statement[_key == "id"][0].value
    ),
    "address": coalesce(alamat[_key == $locale][0].value, alamat[_key == "id"][0].value),
    "wilayah": wilayah[]{
      _key,
      "name": coalesce(nama[_key == $locale][0].value, nama[_key == "id"][0].value)
    }
  }
`)

/** Published reader-facing content for one Arthur unit. */
export const unitPageQuery = defineQuery(`
  *[_type == "unit" && statusTinjauan == "disetujui" && kunci == $unit][0] {
    kunci,
    "nama": coalesce(nama[_key == $locale][0].value, nama[_key == "id"][0].value),
    "judul": coalesce(judul[_key == $locale][0].value, judul[_key == "id"][0].value),
    "pembuka": coalesce(pembuka[_key == $locale][0].value, pembuka[_key == "id"][0].value),
    "masalah": masalah[]{
      _key,
      "teks": coalesce(teks[_key == $locale][0].value, teks[_key == "id"][0].value)
    },
    "caraKerja": caraKerja[]{
      _key,
      "teks": coalesce(teks[_key == $locale][0].value, teks[_key == "id"][0].value)
    },
    "sisi": *[
      _type == "side" &&
      statusTinjauan == "disetujui" &&
      unit._ref == ^._id
    ] | order(urutan asc) {
      _id,
      kunci,
      "nama": coalesce(nama[_key == $locale][0].value, nama[_key == "id"][0].value),
      "judul": coalesce(judul[_key == $locale][0].value, judul[_key == "id"][0].value)
    },
    "ajakan": {
      "label": coalesce(ajakan.label[_key == $locale][0].value, ajakan.label[_key == "id"][0].value),
      "sesudahnya": coalesce(ajakan.sesudahnya[_key == $locale][0].value, ajakan.sesudahnya[_key == "id"][0].value)
    }
  }
`)

/** Published reader-facing content for one side of an Arthur unit. */
export const sidePageQuery = defineQuery(`
  *[_type == "side" && statusTinjauan == "disetujui" && kunci == $side && unit->kunci == $unit][0] {
    kunci,
    "nama": coalesce(nama[_key == $locale][0].value, nama[_key == "id"][0].value),
    "judul": coalesce(judul[_key == $locale][0].value, judul[_key == "id"][0].value),
    "caraMembeli": caraMembeli[]{
      _key,
      "teks": coalesce(teks[_key == $locale][0].value, teks[_key == "id"][0].value)
    },
    "langkahPertama": {
      "label": coalesce(langkahPertama.label[_key == $locale][0].value, langkahPertama.label[_key == "id"][0].value),
      "sesudahnya": coalesce(langkahPertama.sesudahnya[_key == $locale][0].value, langkahPertama.sesudahnya[_key == "id"][0].value)
    },
    "bab": *[
      _type == "bab" &&
      statusTinjauan == "disetujui" &&
      sisi._ref == ^._id
    ] | order(urutan asc) {
      _id,
      "slug": slug.current,
      "nama": coalesce(nama[_key == $locale][0].value, nama[_key == "id"][0].value),
      "kutipan": coalesce(kutipan[_key == $locale][0].value, kutipan[_key == "id"][0].value),
      urutan
    },
    urutan,
    "jaringan": {
      "caraKerja": coalesce(jaringan.caraKerja[_key == $locale][0].value, jaringan.caraKerja[_key == "id"][0].value),
      "asalKomisi": coalesce(jaringan.asalKomisi[_key == $locale][0].value, jaringan.asalKomisi[_key == "id"][0].value),
      "yangTidakAda": coalesce(jaringan.yangTidakAda[_key == $locale][0].value, jaringan.yangTidakAda[_key == "id"][0].value),
      "syarat": coalesce(jaringan.syarat[_key == $locale][0].value, jaringan.syarat[_key == "id"][0].value),
      "ajakanDaftar": {
        "label": coalesce(jaringan.ajakanDaftar.label[_key == $locale][0].value, jaringan.ajakanDaftar.label[_key == "id"][0].value),
        "sesudahnya": coalesce(jaringan.ajakanDaftar.sesudahnya[_key == $locale][0].value, jaringan.ajakanDaftar.sesudahnya[_key == "id"][0].value)
      }
    }
  }
`)

/** Published chapter content for the future nested Arthur route. */
export const chapterPageQuery = defineQuery(`
  *[_type == "bab" && statusTinjauan == "disetujui" && slug.current == $slug && sisi->kunci == $side && sisi->unit->kunci == $unit][0] {
    _id,
    "slug": slug.current,
    "nama": coalesce(nama[_key == $locale][0].value, nama[_key == "id"][0].value),
    "kutipan": coalesce(kutipan[_key == $locale][0].value, kutipan[_key == "id"][0].value),
    "situasi": coalesce(situasi[_key == $locale][0].value, situasi[_key == "id"][0].value),
    urutan,
    "batas": coalesce(batas[_key == $locale][0].value, batas[_key == "id"][0].value),
    "offers": *[
      _type == "offer" &&
      statusTinjauan == "disetujui" &&
      bab._ref == ^._id
    ] | order(urutan asc) {
      _id,
      "slug": slug.current,
      "judul": coalesce(judul[_key == $locale][0].value, judul[_key == "id"][0].value),
      "dampak": coalesce(dampak[_key == $locale][0].value, dampak[_key == "id"][0].value),
      pasar,
      urutan
    },
    "ajakan": {
      "label": coalesce(ajakan.label[_key == $locale][0].value, ajakan.label[_key == "id"][0].value),
      "sesudahnya": coalesce(ajakan.sesudahnya[_key == $locale][0].value, ajakan.sesudahnya[_key == "id"][0].value)
    }
  }
`)

/** Published reader-facing content for one Arthur offer. */
export const offerPageQuery = defineQuery(`
  *[_type == "offer" && statusTinjauan == "disetujui" && slug.current == $slug && bab->slug.current == $chapter && bab->sisi->kunci == $side && bab->sisi->unit->kunci == $unit][0] {
    _id,
    "slug": slug.current,
    "judul": coalesce(judul[_key == $locale][0].value, judul[_key == "id"][0].value),
    "dampak": coalesce(dampak[_key == $locale][0].value, dampak[_key == "id"][0].value),
    "untukSiapa": coalesce(untukSiapa[_key == $locale][0].value, untukSiapa[_key == "id"][0].value),
    "jenis": coalesce(jenis[_key == $locale][0].value, jenis[_key == "id"][0].value),
    pasar,
    "situasi": coalesce(situasi[_key == $locale][0].value, situasi[_key == "id"][0].value),
    "langkah": langkah[]{
      _key,
      "teks": coalesce(teks[_key == $locale][0].value, teks[_key == "id"][0].value)
    },
    "serahan": serahan[]{
      _key,
      "teks": coalesce(teks[_key == $locale][0].value, teks[_key == "id"][0].value)
    },
    "batas": coalesce(batas[_key == $locale][0].value, batas[_key == "id"][0].value),
    "langkahPertama": {
      "label": coalesce(langkahPertama.label[_key == $locale][0].value, langkahPertama.label[_key == "id"][0].value),
      "sesudahnya": coalesce(langkahPertama.sesudahnya[_key == $locale][0].value, langkahPertama.sesudahnya[_key == "id"][0].value)
    },
    "jembatan": {
      "offer": offer->{
        "slug": slug.current,
        "judul": coalesce(judul[_key == $locale][0].value, judul[_key == "id"][0].value)
      },
      "kalimat": coalesce(jembatan.kalimat[_key == $locale][0].value, jembatan.kalimat[_key == "id"][0].value)
    },
    metadata
  }
`)

/** All published three-unit sequences for the dedicated Arthur route. */
export const sequencesQuery = defineQuery(`
  *[_type == "sequence" && statusTinjauan == "disetujui"] {
    _id,
    "situasi": coalesce(situasi[_key == $locale][0].value, situasi[_key == "id"][0].value),
    "langkah": langkah[]{
      _key,
      "unit": unit->{ kunci, "nama": coalesce(nama[_key == $locale][0].value, nama[_key == "id"][0].value) },
      "offer": offer[]{
        _key,
        "slug": @->slug.current,
        "judul": coalesce(@->judul[_key == $locale][0].value, @->judul[_key == "id"][0].value)
      },
      "kalimat": coalesce(kalimat[_key == $locale][0].value, kalimat[_key == "id"][0].value)
    },
    "keterangan": coalesce(keterangan[_key == $locale][0].value, keterangan[_key == "id"][0].value),
    metadata
  }
`)

/** The Arthur singleton behind the future Cara kami bekerja route. */
export const howWeWorkQuery = defineQuery(`
  *[_type == "howWeWork" && statusTinjauan == "disetujui"][0] {
    _id,
    "janji": janji[]{
      _key,
      "judul": coalesce(judul[_key == $locale][0].value, judul[_key == "id"][0].value),
      "kalimat": coalesce(kalimat[_key == $locale][0].value, kalimat[_key == "id"][0].value)
    },
    "hakMilikKlien": coalesce(hakMilikKlien[_key == $locale][0].value, hakMilikKlien[_key == "id"][0].value),
    "pengungkapanKomisi": coalesce(pengungkapanKomisi[_key == $locale][0].value, pengungkapanKomisi[_key == "id"][0].value),
    "yangTidakDijual": coalesce(yangTidakDijual[_key == $locale][0].value, yangTidakDijual[_key == "id"][0].value),
    "wilayah": wilayah[]{
      _key,
      "nama": coalesce(nama[_key == $locale][0].value, nama[_key == "id"][0].value)
    },
    "contohFormat": coalesce(contohFormat[_key == $locale][0].value, contohFormat[_key == "id"][0].value),
    metadata
  }
`)

/** Short FAQ entries mounted on a concrete locale-free path. */
export const faqsForPathQuery = defineQuery(`
  *[_type == "faq" && statusTinjauan == "disetujui" && $path in halaman] {
    _id,
    "pertanyaan": coalesce(pertanyaan[_key == $locale][0].value, pertanyaan[_key == "id"][0].value),
    "jawaban": coalesce(jawaban[_key == $locale][0].value, jawaban[_key == "id"][0].value)
  }
`)
