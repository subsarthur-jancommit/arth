import { describe, expect, test } from 'bun:test'

import { resolveJournalEntries } from './journal-fallback'
import type { SearchEntry } from './search-index'
import {
  buildSearchIndex,
  journalEntries,
  matchScore,
  pageEntries,
  projectEntries,
  resolveSearchIndex,
  searchHaystack,
} from './search-index'
import { UNITS } from './units'

/**
 * What these assert, and why each one is here.
 *
 * The palette is another consumer of facts the sitemap and `/llms.txt`
 * already read (`/[locale]/ai` did too, until Tahap 84 removed it). The risk is not that it renders wrong — that is
 * visible — but that it drifts: a page added to the catalogue and missing from
 * the palette, or an Indonesian palette listing English prose. Both are silent,
 * and both are checked here.
 */

describe('page entries', () => {
  test('every static route reaches the palette, in both languages', () => {
    const en = pageEntries('en')
    const id = pageEntries('id')

    expect(en.length).toBe(id.length)
    expect(en.length).toBeGreaterThan(UNITS.length)

    // Same routes, different prose — the failure this catches is an
    // Indonesian palette carrying English labels, which is exactly what
    // `route-catalog.ts` was localized to prevent.
    expect(en.map((entry) => entry.id)).toEqual(id.map((entry) => entry.id))
    expect(en.map((entry) => entry.label)).not.toEqual(
      id.map((entry) => entry.label)
    )
  })

  test('unit pages are told apart from the rest', () => {
    const units = pageEntries('en').filter((entry) => entry.kind === 'unit')
    expect(units.length).toBe(UNITS.length)
    /*
     * A unit page's address is a bare segment — `/en/konstruksi` — so there
     * is no prefix to assert on, which is exactly the collision that moved
     * the CMS pages to `/halaman/<slug>`. The href is compared to the unit
     * list instead, which is a stronger check than a prefix was: a chip
     * pointing at `/en/konstruksii` would have passed the old assertion.
     */
    expect(units.map((entry) => entry.href).sort()).toEqual(
      UNITS.map((unit) => `/en/${unit}`).sort()
    )
  })

  test('the Arthur destinations are present without promoting hidden indexes', () => {
    const paths = pageEntries('id').map((entry) => entry.href)
    // Published and approved on 2026-10-17, so R5 removed them from
    // `lib/seo/awaiting-content.ts` and the index offers them.
    expect(paths).toContain('/id/cara-kerja')
    expect(paths).toContain('/id/satu-klien-tiga-unit')
    expect(paths).toContain('/id/kontak')
    for (const unit of UNITS) expect(paths).toContain(`/id/${unit}`)
    expect(paths).not.toContain('/id/work')
    expect(paths).not.toContain('/id/journal')
  })

  test('every entry carries a label, a description and a locale-prefixed href', () => {
    for (const locale of ['en', 'id'] as const) {
      // The two pages whose head reads its description from the CMS get it
      // from the route handler's read; the catalog keeps no copy.
      const descriptions = new Map([
        [`/${locale}/cara-kerja`, 'Lingkup disepakati tertulis.'],
        [`/${locale}/satu-klien-tiga-unit`, 'Rangkaian yang mungkin.'],
      ])
      for (const entry of pageEntries(locale, descriptions)) {
        expect(entry.label.trim()).not.toBe('')
        expect(entry.description.trim()).not.toBe('')
        expect(entry.href).toStartWith(`/${locale}`)
      }
    }
  })
})

describe('project entries', () => {
  const projects = [
    {
      slug: { current: 'arus-balik' },
      title: 'Arus Balik',
      client: 'Rumah Tanjung',
      year: 2025,
      engagement: 'Commissioned work',
    },
    // No slug: there is no page to open, so it must not become a result.
    { slug: null, title: 'Untitled', client: null, year: null },
    // No title: nothing to show on the row.
    { slug: { current: 'ghost' }, title: '  ', client: 'X', year: 2024 },
  ]

  test('a project becomes one result, with its client and year', () => {
    const entries = projectEntries('en', projects)

    expect(entries.length).toBe(1)
    expect(entries[0]?.label).toBe('Arus Balik')
    expect(entries[0]?.href).toBe('/en/work/arus-balik')
    expect(entries[0]?.meta).toBe('Rumah Tanjung · 2025')
  })

  test('the client name is searchable even though the title omits it', () => {
    const [entry] = projectEntries('en', projects)
    expect(entry).toBeDefined()
    if (!entry) return
    expect(searchHaystack(entry)).toContain('tanjung')
  })

  test('no projects is not an error', () => {
    expect(projectEntries('en', null)).toEqual([])
    expect(projectEntries('en', [])).toEqual([])
  })
})

describe('journal entries', () => {
  test('the date is formatted in the reader’s locale, from the ISO string', () => {
    const entries = resolveJournalEntries('id', null)
    const results = journalEntries('id', entries)

    expect(results.length).toBe(entries.length)
    // Indonesian month names, not English ones — the same reason the journal
    // index formats at render time rather than storing a formatted string.
    expect(results.some((entry) => entry.meta?.includes('Februari'))).toBe(true)
  })

  test('every entry points at its own page', () => {
    for (const entry of journalEntries('en', resolveJournalEntries('en', null)))
      expect(entry.href).toStartWith('/en/journal/')
  })
})

describe('the whole index', () => {
  const index = buildSearchIndex('en', {
    projects: [
      {
        slug: { current: 'arus-balik' },
        title: 'Arus Balik',
        client: 'Rumah Tanjung',
        year: 2025,
        engagement: 'Commissioned work',
      },
    ],
    journal: resolveJournalEntries('en', null),
  })

  test('ids are unique, so a listbox can point at exactly one row', () => {
    const ids = index.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('it carries all four kinds, pages first and writing last', () => {
    const kinds = index.map((entry) => entry.kind)
    expect(new Set(kinds)).toEqual(
      new Set(['page', 'unit', 'project', 'journal'])
    )
    expect(kinds[0]).toBe('page')
    expect(kinds.at(-1)).toBe('journal')
  })

  test('the haystack is lowercased and holds everything the row shows', () => {
    for (const entry of index) {
      const haystack = searchHaystack(entry)
      expect(haystack).toBe(haystack.toLowerCase())
      expect(haystack).toContain(entry.label.toLowerCase())
    }
  })
})

describe('match score', () => {
  const journal = journalEntries('en', resolveJournalEntries('en', null))
  const scope = journal.find((entry) => entry.label.startsWith('Scope'))
  const mention: SearchEntry = {
    id: 'page:mention',
    kind: 'page',
    label: 'Arthur',
    description: 'scope',
    href: '/en',
    meta: null,
  }

  test('the defect it was written for: a title beats a passing mention', () => {
    expect(scope).toBeDefined()
    if (!scope) return

    /*
     * Measured before this function existed. A static page's description
     * contains "scoped", so with structural ordering alone, typing the first
     * word of this journal entry's own headline highlighted that page and
     * Enter opened it.
     */
    expect(searchHaystack(mention)).toContain('scope')
    expect(matchScore(scope, 'scope')).toBeGreaterThan(
      matchScore(mention, 'scope')
    )
  })

  test('the four grades', () => {
    expect(scope).toBeDefined()
    if (!scope) return

    expect(matchScore(scope, 'scope')).toBe(3) // title starts with it
    expect(matchScore(scope, 'deliverable')).toBe(2) // title contains it
    expect(matchScore(scope, 'ships')).toBe(1) // only the summary carries it
    expect(matchScore(scope, 'zzzz')).toBe(0) // not a result at all
  })

  test('an empty query leaves every entry equal, so the resting order stands', () => {
    const index = buildSearchIndex('en', {
      projects: null,
      journal: resolveJournalEntries('en', null),
    })
    for (const entry of index) {
      expect(matchScore(entry, '')).toBe(1)
      expect(matchScore(entry, '   ')).toBe(1)
    }
  })

  test('it is case- and whitespace-insensitive, like the field a reader types in', () => {
    expect(scope).toBeDefined()
    if (!scope) return
    expect(matchScore(scope, '  SCOPE ')).toBe(3)
  })
})

describe('word order and the query as words', () => {
  const project = {
    slug: { current: 'arus-balik' },
    title: 'Arus Balik',
    client: 'Rumah Tanjung',
    year: 2025,
    engagement: 'Architecture review, six weeks',
  }
  const index = buildSearchIndex('en', {
    projects: [project],
    journal: resolveJournalEntries('en', null),
  })
  const find = (query: string) =>
    index.filter((entry) => matchScore(entry, query) > 0).map((e) => e.label)
  const broadMatch: SearchEntry = {
    id: 'page:scope-only',
    kind: 'page',
    label: 'Scope notes',
    description: 'scope',
    href: '/en',
    meta: null,
  }

  /*
   * Each of these returned nothing before the query was read as words.
   * `docs/stages/TAHAP-30.md` §2 carries the measurement.
   */
  test('the words may arrive in any order', () => {
    expect(find('arus balik')).toContain('Arus Balik')
    expect(find('balik arus')).toContain('Arus Balik')
  })

  test('two facts from the same rail can be typed together', () => {
    // "Rumah Tanjung · 2025" is one line on the row; typing both halves of it
    // is an obviously reasonable thing to do, and it matched nothing.
    expect(find('tanjung 2025')).toContain('Arus Balik')
  })

  test("a title's own words, without its connectives", () => {
    expect(find('scope deliverable')).toContain('Scope is the deliverable')
    expect(find('deliverable scope')).toContain('Scope is the deliverable')
  })

  test('every word must appear — a second word narrows, never widens', () => {
    const one = [broadMatch, ...index]
      .filter((entry) => matchScore(entry, 'scope') > 0)
      .map((entry) => entry.label)
    const two = [broadMatch, ...index]
      .filter((entry) => matchScore(entry, 'scope deliverable') > 0)
      .map((entry) => entry.label)
    expect(two.length).toBeLessThan(one.length)
    // An OR would have made this longer, which is the behaviour that makes a
    // search feel broken.
    expect(two.length).toBeGreaterThan(0)
  })

  test('a word that appears nowhere still excludes the row', () => {
    expect(find('arus zzzz')).toEqual([])
  })

  test('the whole query as typed still outranks the same words scattered', () => {
    const entry = index.find((e) => e.label === 'Scope is the deliverable')
    expect(entry).toBeDefined()
    if (!entry) return
    expect(matchScore(entry, 'scope is')).toBe(3)
    expect(matchScore(entry, 'deliverable scope')).toBe(2)
  })
})

/**
 * The case that took a production build down.
 *
 * `/[locale]/search.json` is prerendered, so a throw inside it is not a failed
 * request — it is `Export encountered an error … exiting the build`. One
 * `ECONNRESET` from Sanity did exactly that, after the client's own five
 * retries had already been spent, which is why a job re-run was never the fix.
 *
 * These assert the two halves that matter: the build survives, and the reader
 * is not handed an empty page list when only the *content* source is gone.
 */
describe('an unreachable content source', () => {
  test('degrades to the page index instead of throwing', async () => {
    const index = await resolveSearchIndex('en', () => {
      throw new Error('read ECONNRESET')
    })

    expect(index.length).toBeGreaterThan(0)
    expect(index.every((entry) => entry.kind !== 'project')).toBe(true)
    // Every static route still reaches the palette: those come from
    // `lib/seo/route-catalog.ts` and need no network at all.
    expect(index.filter((entry) => entry.kind === 'page').length).toBe(
      pageEntries('en').filter((entry) => entry.kind === 'page').length
    )
  })

  test('a rejected promise degrades the same way as a synchronous throw', async () => {
    const index = await resolveSearchIndex('id', () =>
      Promise.reject(new Error('read ECONNRESET'))
    )

    expect(index.length).toBeGreaterThan(0)
    expect(index.every((entry) => entry.href.startsWith('/id'))).toBe(true)
  })

  test('a source that answers is passed straight through', async () => {
    const index = await resolveSearchIndex('en', () =>
      Promise.resolve({
        projects: [{ slug: { current: 'a-project' }, title: 'A Project' }],
        journal: resolveJournalEntries('en', null),
      })
    )

    expect(index.some((entry) => entry.kind === 'project')).toBe(true)
  })
})

/**
 * A page whose head reads its description from the CMS.
 *
 * The row has to say what the head says, which the route handler resolves
 * with `resolveRouteDescriptions` and hands over like the rest of its data.
 * The catalog's own line is only the fallback for a read that failed.
 */
describe('a description the page head resolved', () => {
  const descriptions = new Map([
    ['/id/cara-kerja', 'Cara kerja, seperti ditulis di Studio.'],
  ])
  const row = (entries: readonly SearchEntry[], href: string) =>
    entries.find((entry) => entry.href === href)

  test("replaces the catalog's own on that page's row and nowhere else", () => {
    const plain = pageEntries('id')
    const described = pageEntries('id', descriptions)

    expect(row(described, '/id/cara-kerja')?.description).toBe(
      'Cara kerja, seperti ditulis di Studio.'
    )
    expect(
      described.filter((entry) => entry.href !== '/id/cara-kerja')
    ).toEqual(plain.filter((entry) => entry.href !== '/id/cara-kerja'))
  })

  test('belongs to one locale: the other keeps its own', () => {
    expect(row(pageEntries('en', descriptions), '/en/cara-kerja')).toEqual(
      row(pageEntries('en'), '/en/cara-kerja')
    )
  })

  test('reaches the index whether the content source answers or not', async () => {
    const answered = await resolveSearchIndex(
      'id',
      () =>
        Promise.resolve({
          projects: null,
          journal: resolveJournalEntries('id', null),
        }),
      descriptions
    )
    const unreachable = await resolveSearchIndex(
      'id',
      () => Promise.reject(new Error('read ECONNRESET')),
      descriptions
    )

    for (const index of [answered, unreachable]) {
      expect(row(index, '/id/cara-kerja')?.description).toBe(
        'Cara kerja, seperti ditulis di Studio.'
      )
    }
  })
})
