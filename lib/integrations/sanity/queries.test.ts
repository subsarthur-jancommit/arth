/**
 * Guards the locale handling in `queries.ts`.
 *
 * Localized fields are stored by sanity-plugin-internationalized-array as
 * `[{ _key: 'en', value: … }]`, and read back by filtering on `_key`. Two
 * things about that are easy to get wrong, and both fail silently:
 *
 *  - the fallback locale is written as a literal (typegen cannot follow a
 *    variable), duplicating `lib/i18n/routing.ts`. Add a locale, forget these,
 *    and that language serves the wrong fallback forever with no error.
 *  - reverting to dynamic property access (`field[$locale]`) still works at
 *    runtime but makes typegen infer an array where a string comes back, so
 *    every consumer is written against a shape that never occurs.
 */

import { describe, expect, it } from 'bun:test'

import { routing } from '@/lib/i18n/routing'

import {
  chapterPageQuery,
  chapterPagePreviewQuery,
  featuredProjectsQuery,
  faqsForPathQuery,
  howWeWorkPreviewQuery,
  howWeWorkQuery,
  offerPageQuery,
  pageQuery,
  projectQuery,
  projectsQuery,
  sequencesQuery,
  sidePageQuery,
  siteSettingsQuery,
  unitPageQuery,
} from './queries'

/** Every query that projects a localized field. */
const LOCALIZED_QUERIES = {
  chapterPageQuery,
  howWeWorkQuery,
  howWeWorkPreviewQuery,
  offerPageQuery,
  pageQuery,
  projectsQuery,
  featuredProjectsQuery,
  projectQuery,
  sequencesQuery,
  siteSettingsQuery,
} as const

describe('localized queries', () => {
  it('selects the active locale by filtering on _key', () => {
    for (const [name, query] of Object.entries(LOCALIZED_QUERIES)) {
      expect(query, `${name} does not read $locale`).toContain(
        '[_key == $locale][0].value'
      )
    }
  })

  it('falls back to the default locale, which the schema guarantees exists', () => {
    // A translation may legitimately be missing. Without the fallback the
    // field resolves to null and renders blank rather than untranslated.
    for (const [name, query] of Object.entries(LOCALIZED_QUERIES)) {
      expect(query, `${name} has no fallback`).toContain(
        `[_key == "${routing.defaultLocale}"][0].value`
      )
    }
  })

  it('never uses dynamic property access on a localized field', () => {
    // `field[$locale]` is correct at runtime but types as an array, because
    // typegen cannot know a parameter's value. Filtering an array types
    // correctly; indexing an object by a param does not.
    for (const [name, query] of Object.entries(LOCALIZED_QUERIES)) {
      expect(query, `${name} indexes an object by parameter`).not.toMatch(
        /\w+\[\$locale\]/
      )
    }
  })

  it('takes $locale as its only locale parameter', () => {
    // $defaultLocale was dropped when the fallback became a literal. A query
    // still referencing it would throw, since no caller passes it.
    for (const [name, query] of Object.entries(LOCALIZED_QUERIES)) {
      expect(
        query,
        `${name} references a parameter no caller passes`
      ).not.toContain('$defaultLocale')
    }
  })
})

describe('fixed-page migration', () => {
  it('prefers two-language fields while leaving old pages readable', () => {
    expect(pageQuery).toContain('judul[_key == $locale]')
    expect(pageQuery).toContain('isi[_key == $locale]')
    expect(pageQuery).toMatch(/\btitle\b/)
    expect(pageQuery).toMatch(/\bcontent\b/)
  })

  it('does not make an editorial link a page requirement', () => {
    expect(pageQuery).not.toContain('\n    link')
  })
})

describe('sequence and FAQ queries', () => {
  it('lists only reader-facing sequence fields', () => {
    expect(sequencesQuery).toContain('_type == "sequence"')
    expect(sequencesQuery).toContain('"keterangan"')
    expect(sequencesQuery).not.toContain('...')
  })

  it('limits FAQ lookup to its explicit path', () => {
    expect(faqsForPathQuery).toContain('$path in halaman')
  })
})

describe('how we work queries', () => {
  it('keeps editorial review out of public while allowing draft preview', () => {
    expect(howWeWorkQuery).toContain('statusTinjauan == "disetujui"')
    expect(howWeWorkPreviewQuery).not.toContain('statusTinjauan')

    for (const query of [howWeWorkQuery, howWeWorkPreviewQuery]) {
      expect(query).not.toContain('jejakSumber')
      expect(query).not.toContain('ditulisOleh')
    }
  })
})

describe('offer query', () => {
  it('keeps an offer under its addressed chapter, side, and unit', () => {
    expect(offerPageQuery).toContain('_type == "offer"')
    expect(offerPageQuery).toContain('bab->slug.current == $chapter')
    expect(offerPageQuery).toContain('bab->sisi->kunci == $side')
    expect(offerPageQuery).toContain('bab->sisi->unit->kunci == $unit')
  })

  it('does not project fields from the Internal Studio group', () => {
    for (const field of [
      'idKatalog',
      'jejakSumber',
      'ditulisOleh',
      'tanggalDisetujui',
    ]) {
      expect(offerPageQuery).not.toContain(field)
    }
    expect(offerPageQuery).toContain('statusTinjauan == "disetujui"')
  })
})

describe('chapter query', () => {
  it('keeps a chapter under its addressed side and unit', () => {
    expect(chapterPageQuery).toContain('_type == "bab"')
    expect(chapterPageQuery).toContain('sisi->kunci == $side')
    expect(chapterPageQuery).toContain('sisi->unit->kunci == $unit')
  })

  it('lists only approved chapters belonging to a side', () => {
    expect(sidePageQuery).toContain('_type == "bab"')
    expect(sidePageQuery).toContain('sisi._ref == ^._id')
    expect(sidePageQuery).toContain('statusTinjauan == "disetujui"')
  })

  it('lists only approved sides belonging to a unit', () => {
    expect(unitPageQuery).toContain('_type == "side"')
    expect(unitPageQuery).toContain('unit._ref == ^._id')
    expect(unitPageQuery).toContain('statusTinjauan == "disetujui"')
  })

  it('selects only fields that are safe to render', () => {
    // Internal editorial fields arrive in F2-07. Listing the public shape now
    // keeps that later boundary additive instead of trying to contain `...`.
    expect(chapterPageQuery).not.toContain('...')
  })

  it('lists only approved offer cards belonging to the chapter', () => {
    expect(chapterPageQuery).toContain('_type == "offer"')
    expect(chapterPageQuery).toContain('bab._ref == ^._id')
    expect(chapterPageQuery).toContain('statusTinjauan == "disetujui"')
    expect(chapterPageQuery).toContain('order(urutan asc)')
  })

  it('projects card fields without exposing internal editorial fields', () => {
    for (const field of ['untukSiapa', 'jenis', 'pasar', 'dampak']) {
      expect(chapterPageQuery).toContain(field)
    }

    for (const field of [
      'idKatalog',
      'jejakSumber',
      'ditulisOleh',
      'tanggalDisetujui',
    ]) {
      expect(chapterPageQuery).not.toContain(field)
    }
  })

  it('only resolves published bridge targets on the public route', () => {
    expect(chapterPageQuery).toContain('offer->statusTinjauan == "disetujui"')
    expect(chapterPagePreviewQuery).not.toContain(
      'offer->statusTinjauan == "disetujui"'
    )
  })
})

describe('network side query', () => {
  it('selects the public network terms without Internal Studio fields', () => {
    for (const field of [
      'jaringan.caraKerja',
      'jaringan.asalKomisi',
      'jaringan.yangTidakAda',
      'jaringan.syarat',
      'jaringan.ajakanDaftar',
    ]) {
      expect(sidePageQuery).toContain(field)
    }

    expect(sidePageQuery).not.toContain('jejakSumber')
    expect(sidePageQuery).not.toContain('ditulisOleh')
  })
})

describe('site settings cutover', () => {
  it('reads only approved Arthur settings on the public path', () => {
    expect(siteSettingsQuery).toContain(
      '_type == "siteSettings" && statusTinjauan == "disetujui"'
    )
    expect(siteSettingsQuery).not.toContain('_type == "studioSettings"')
  })

  it('projects the Arthur editorial and contact fields explicitly', () => {
    expect(siteSettingsQuery).toContain('heroJudul')
    expect(siteSettingsQuery).not.toContain('headline[_key == $locale]')
    expect(siteSettingsQuery).toContain('"email": kanal.email')
    expect(siteSettingsQuery).toContain('"socials": akunSosial')
    expect(siteSettingsQuery).toContain(
      'coalesce(alamat[_key == $locale][0].value'
    )
    expect(siteSettingsQuery).toContain('pernyataanPemilik')
    expect(siteSettingsQuery).not.toContain('statement[_key == $locale]')
    expect(siteSettingsQuery).toContain('"situasi": situasi[]')
    expect(siteSettingsQuery).toContain(
      '"teks": coalesce(teks[_key == $locale]'
    )
    expect(siteSettingsQuery).toContain('"ajakan": {')
    expect(siteSettingsQuery).toContain(
      '"rangkaianPilihan": rangkaianPilihan->{ _id }'
    )
  })
})
