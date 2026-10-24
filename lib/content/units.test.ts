/**
 * The unit vocabulary agrees with itself.
 *
 * ## What this catches that nothing else does
 *
 * Four separate places name Arthur's three units, and nothing but this test
 * checks that a key added in one appears in the others:
 *
 *  - `lib/content/units.ts` — the canonical keys, which drive the `/{unit}`
 *    routes, the Studio's closed list, the sitemap and the catalogue filter;
 *  - `messages/{en,id}.json` — the human labels for those keys;
 *  - `lib/seo/site.ts` `services` — what the JSON-LD tells an answer engine;
 *  - `SIDES` in the same module — the two sides each unit is read from.
 *
 * Adding a fourth unit without a label would produce a page whose `<h1>` is
 * the raw key (React renders the key when next-intl has none), and structured
 * data advertising three services for a catalogue that filters into four.
 * Neither fails a build, a type check or axe.
 *
 * This replaces `lib/content/practices.test.ts`, keeps its assertions, and
 * adds the one the practice vocabulary had no equivalent for: a unit with
 * only one side, or three.
 *
 * ## Why it reads the JSON rather than the typed dictionary
 *
 * `messages/en.d.json.ts` gives next-intl its types, so a *missing* key is
 * already a type error at the call site. What it cannot say is whether the
 * Indonesian file has the same keys as the English one — the types are
 * generated from `en` alone. Reading both files is the only way to compare
 * them.
 */

import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

import {
  unitPagePreviewQuery,
  unitPageQuery,
} from '@/lib/integrations/sanity/queries'
import { unit as unitSchema } from '@/lib/integrations/sanity/schemas/unit'
import { SITE } from '@/lib/seo/site'

import {
  ALL_SIDES,
  isSideOf,
  isUnit,
  SIDES,
  UNIT_STUDIO_TITLES,
  UNITS,
  unitSteps,
} from './units'

/**
 * Read from disk, not imported.
 *
 * `import … from '../../messages/en.json'` resolves to `messages/en.d.json.ts`
 * — the declaration next-intl's types are generated into — and `tsc` rejects
 * it without `allowArbitraryExtensions`. Reading the file is also the more
 * honest instrument: the claim is about what the *dictionaries* hold, and a
 * declaration file is a description of one of them.
 */
function dictionary(locale: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(
    readFileSync(`messages/${locale}.json`, 'utf8')
  )
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(`messages/${locale}.json is not an object`)
  }
  // SAFETY: established as a non-null object immediately above, and every
  // value read from it below is either compared to a string or treated as
  // missing — a wrong shape reads as "no label", which fails loudly rather
  // than passing quietly.
  return parsed as Record<string, unknown>
}

function section(locale: string, path: readonly string[]) {
  let node: unknown = dictionary(locale)
  for (const key of path) {
    if (typeof node !== 'object' || node === null) return {}
    node = (node as Record<string, unknown>)[key]
  }
  if (typeof node !== 'object' || node === null) return {}
  return node as Record<string, string | undefined>
}

const LOCALES = ['en', 'id'] as const

describe('the unit vocabulary agrees with itself', () => {
  it('has something to check', () => {
    // A vocabulary that emptied would pass every assertion below.
    expect(UNITS.length).toBeGreaterThan(1)
  })

  it('recognises its own keys and nothing else', () => {
    for (const unit of UNITS) expect(isUnit(unit)).toBe(true)
    expect(isUnit('practice')).toBe(false)
    expect(isUnit(undefined)).toBe(false)
    // The old vocabulary must not answer: `/consulting` has to reach the
    // proxy's 404 rather than render a page named after a retired practice.
    expect(isUnit('consulting')).toBe(false)
  })

  for (const locale of LOCALES) {
    it(`labels every unit in ${locale}, on the unit page and in the catalogue`, () => {
      const unitNamespace = section(locale, ['unit'])
      const catalogue = section(locale, ['workIndex'])

      const missingOnPage = UNITS.filter(
        (unit) => (unitNamespace[unit] ?? '').trim() === ''
      )
      const missingInCatalogue = UNITS.filter(
        (unit) => (catalogue[unit] ?? '').trim() === ''
      )

      expect(
        missingOnPage,
        `${locale}: units with no page label — the <h1> would render the raw key`
      ).toEqual([])
      expect(
        missingInCatalogue,
        `${locale}: units with no catalogue label — a filter chip would render the raw key`
      ).toEqual([])
    })
  }

  it('gives every unit a Studio title', () => {
    const missing = UNITS.filter(
      (unit) => (UNIT_STUDIO_TITLES[unit] ?? '').trim() === ''
    )
    expect(
      missing,
      'units an editor would pick by slug rather than by name'
    ).toEqual([])
  })

  it('advertises exactly as many services as it can filter by', () => {
    /*
     * Deliberately a count, not a mapping.
     *
     * `services` is prose for an answer engine, so it cannot be compared key
     * by key without inventing a second translation table that would then
     * need its own test. What is worth guarding is the arithmetic: the
     * JSON-LD must not claim a different number of things than the catalogue
     * can show.
     */
    for (const locale of LOCALES) {
      expect(
        SITE.services[locale].length,
        `${locale}: JSON-LD advertises ${SITE.services[locale].length} services for ${UNITS.length} filterable units`
      ).toBe(UNITS.length)
    }
  })

  it('says the same number of things in both languages', () => {
    // A locale that lost an entry would still pass the count above if the
    // other lost one too; this catches the ordinary case, one language edited
    // and the other forgotten.
    expect(SITE.services.en.length).toBe(SITE.services.id.length)
    expect(SITE.knowsAbout.en.length).toBe(SITE.knowsAbout.id.length)
  })
})

/*
 * The sides, which practices had no equivalent for.
 *
 * Every page, route and `generateStaticParams` under a unit reads `SIDES`, so
 * a unit with one side would silently publish half a pair and a unit with
 * three would publish a page the design has no slot for. `satisfies
 * Record<Unit, readonly [string, string]>` catches a missing *key*; only a
 * test catches the wrong *length*, because a tuple type is satisfied by a
 * longer array.
 */
describe('every unit is read from exactly two sides', () => {
  for (const unit of UNITS) {
    it(`gives ${unit} two distinct sides`, () => {
      const sides = SIDES[unit]
      expect(sides).toHaveLength(2)
      expect(new Set(sides).size, `${unit}: the same side twice`).toBe(2)
      for (const side of sides) {
        expect(side.trim(), `${unit}: an empty side key`).not.toBe('')
        expect(isSideOf(unit, side)).toBe(true)
      }
    })
  }

  it("never gives one unit another unit's side", () => {
    for (const unit of UNITS) {
      const foreign = ALL_SIDES.filter(
        (side) => !(SIDES[unit] as readonly string[]).includes(side)
      )
      for (const side of foreign) {
        expect(
          isSideOf(unit, side),
          `${unit} answered to ${side}, which belongs to another unit`
        ).toBe(false)
      }
    }
  })

  it('has no side name shared between two units', () => {
    // A shared name would make `/konstruksi/x` and `/teknologi/x` two pages
    // with one key, which is how a side's content ends up on the wrong unit.
    expect(new Set(ALL_SIDES).size).toBe(ALL_SIDES.length)
  })

  it('counts every side exactly once across the units', () => {
    expect(ALL_SIDES).toHaveLength(UNITS.length * 2)
  })

  for (const locale of LOCALES) {
    it(`labels every side in ${locale}`, () => {
      const sideNamespace = section(locale, ['side'])
      const missing = ALL_SIDES.filter(
        (side) => (sideNamespace[side] ?? '').trim() === ''
      )

      expect(
        missing,
        `${locale}: sides with no label — a heading or route link would render the raw key`
      ).toEqual([])
    })
  }
})

/*
 * `vault/blocks/capability-set` lists a unit's own steps on the unit page:
 * `unit.caraKerja` in Sanity, one item per step. Until 2026-10-23 these tests
 * read the `studio.capabilities` lines in the message files instead, the copy
 * of the old `/studio` page. No page had read them since `/studio` became a
 * redirect, and they left with that namespace (V6 of
 * `docs/RENCANA-KONTEKS-V2.md`: no editorial text in code).
 *
 * The two failures they guarded against move with the source. A unit with no
 * line would render an empty section: the Studio now refuses to publish a
 * unit without a step, and the page omits the section when none arrives. A
 * translator who drops a dot would split a line differently per language:
 * each step is now one item in one array, read in the visitor's language with
 * the Indonesian text as its fallback, so every locale gets the same steps.
 */
describe("the capability block reads every unit's steps from Sanity", () => {
  it('cannot publish a unit without a step', () => {
    const field = unitSchema.fields.find(
      (candidate) => candidate.name === 'caraKerja'
    )
    // Not every field in the schema declares `validation`; narrow first.
    const validation =
      field && 'validation' in field ? field.validation : undefined
    // A chainable stand-in for the Studio's Rule that records each call.
    const calls: string[] = []
    const rule = new Proxy(
      {},
      {
        get:
          (_target, name, receiver) =>
          (...args: unknown[]) => {
            calls.push(`${String(name)}(${args.join(', ')})`)
            return receiver
          },
      }
    )

    expect(typeof validation).toBe('function')
    if (typeof validation === 'function') validation(rule as never)
    expect(calls).toEqual(['required()', 'min(1)'])
  })

  it('reads the same steps in every locale, Indonesian as the fallback', () => {
    for (const query of [unitPageQuery, unitPagePreviewQuery]) {
      expect(query).toMatch(
        /"caraKerja": caraKerja\[\]\{\s*_key,\s*"teks": coalesce\(teks\[_key == \$locale\]\[0\]\.value, teks\[_key == "id"\]\[0\]\.value\)/
      )
    }
  })

  it('drops an empty step rather than publishing it', () => {
    expect(
      unitSteps([
        { teks: 'Satu' },
        { teks: null },
        { teks: '  ' },
        { teks: 'Dua' },
      ])
    ).toEqual(['Satu', 'Dua'])
    expect(unitSteps(null)).toEqual([])
  })
})
