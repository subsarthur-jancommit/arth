import { describe, expect, it } from 'bun:test'

import {
  howWeWorkDescription,
  threeUnitsDescription,
} from './page-descriptions'
import { STATIC_ROUTE_TEMPLATES } from './route-catalog'

const firstPromise = {
  _key: 'lingkup',
  judul: 'Lingkup',
  kalimat: 'Lingkup disepakati tertulis.',
}

function metadata(description: string | null) {
  return { title: null, description, keywords: null, noIndex: null }
}

describe('howWeWorkDescription', () => {
  it('says what the Studio wrote as the SEO description', () => {
    expect(
      howWeWorkDescription({
        metadata: metadata('Deskripsi dari Studio.'),
        janji: [firstPromise],
      })
    ).toBe('Deskripsi dari Studio.')
  })

  it('falls back to the first written promise while no SEO description is written', () => {
    expect(
      howWeWorkDescription({ metadata: null, janji: [firstPromise] })
    ).toBe(firstPromise.kalimat)
    expect(
      howWeWorkDescription({ metadata: metadata(null), janji: [firstPromise] })
    ).toBe(firstPromise.kalimat)
  })

  it('reads a blank SEO description as none, and trims a written one', () => {
    // The schema does not trim this field. Before the shared rule, `''`
    // reached the head and was dropped there, so the page carried the
    // site-wide description instead of its own.
    expect(
      howWeWorkDescription({ metadata: metadata('  '), janji: [firstPromise] })
    ).toBe(firstPromise.kalimat)
    expect(
      howWeWorkDescription({
        metadata: metadata('  Deskripsi dari Studio.\n'),
        janji: [firstPromise],
      })
    ).toBe('Deskripsi dari Studio.')
  })

  it('gives none when nothing at all is written', () => {
    // No sentence kept in code stands in for the Studio's
    // (lib/content/editorial-copy.test.ts).
    expect(howWeWorkDescription({ metadata: null, janji: [] })).toBeNull()
  })
})

describe('threeUnitsDescription', () => {
  it('says what the Studio wrote on the first sequence', () => {
    expect(
      threeUnitsDescription({ metadata: metadata('Deskripsi rangkaian.') })
    ).toBe('Deskripsi rangkaian.')
  })

  it('gives none while the first sequence has no SEO description', () => {
    expect(threeUnitsDescription({ metadata: null })).toBeNull()
    expect(threeUnitsDescription({ metadata: metadata(null) })).toBeNull()
  })
})

/*
 * The catalog keeps no description for these two pages. A copy of the
 * head's sentence is the drift this module closed, and a sentence of the
 * catalog's own is editorial text in code; a merge that brings either back
 * fails here.
 */
describe("the catalog's own line for a head-described page", () => {
  const paths = STATIC_ROUTE_TEMPLATES.map((route) => route.path)
  const catalog = (path: string) =>
    STATIC_ROUTE_TEMPLATES.find((route) => route.path === path)?.description

  it('does not exist', () => {
    // Anti-vacuum: a route missing from the catalog has no description either.
    expect(paths).toContain('/metode-kerja')
    expect(paths).toContain('/layanan-terpadu')

    expect(catalog('/metode-kerja')).toBeUndefined()
    expect(catalog('/layanan-terpadu')).toBeUndefined()
  })
})
