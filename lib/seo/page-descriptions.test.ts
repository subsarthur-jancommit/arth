import { describe, expect, it } from 'bun:test'

import {
  HOW_WE_WORK_LEAD,
  howWeWorkDescription,
  THREE_UNITS_FALLBACK_DESCRIPTION,
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

  it('ends at the page lead when nothing at all is written', () => {
    expect(howWeWorkDescription({ metadata: null, janji: [] })).toBe(
      HOW_WE_WORK_LEAD
    )
  })
})

describe('threeUnitsDescription', () => {
  it('says what the Studio wrote on the first sequence', () => {
    expect(
      threeUnitsDescription({ metadata: metadata('Deskripsi rangkaian.') })
    ).toBe('Deskripsi rangkaian.')
  })

  it("falls back to the page's own sentence", () => {
    expect(threeUnitsDescription({ metadata: null })).toBe(
      THREE_UNITS_FALLBACK_DESCRIPTION
    )
    expect(threeUnitsDescription({ metadata: metadata(null) })).toBe(
      THREE_UNITS_FALLBACK_DESCRIPTION
    )
  })
})

/*
 * The catalog keeps a description for these two pages only as the line to
 * print when the CMS cannot be read. It must be what the head itself says
 * with nothing written, never a sentence copied out of the Studio: a copy is
 * the drift this module closed, and a merge that brings one back fails here.
 */
describe("the catalog's own line for a head-described page", () => {
  const catalog = (path: string) =>
    STATIC_ROUTE_TEMPLATES.find((route) => route.path === path)?.description

  it('is the head with nothing written, in both slots', () => {
    const howWeWork = howWeWorkDescription({ metadata: null, janji: [] })
    const threeUnits = threeUnitsDescription({ metadata: null })

    expect(catalog('/cara-kerja')).toEqual({ en: howWeWork, id: howWeWork })
    expect(catalog('/satu-klien-tiga-unit')).toEqual({
      en: threeUnits,
      id: threeUnits,
    })
  })
})
