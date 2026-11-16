import { describe, expect, it } from 'bun:test'

import {
  howWeWorkDescription,
  paymentHead,
  threeUnitsDescription,
  threeUnitsHead,
} from './page-descriptions'
import { STATIC_ROUTE_TEMPLATES } from './route-catalog'

/**
 * The English heads the owner approved on 15 November 2026 ("Setujui
 * keempatnya"), word for word, typographic apostrophe included: R7 blocks
 * L-meta and P-meta in `docs/R7-SERAH-INGGRIS.md`. Changing one needs a new
 * approval, so a change that reaches `messages/en.json` alone fails here.
 */
const APPROVED = {
  layanan: {
    title: 'One client, three units: construction, systems, and marketing',
    description:
      'A possible sequence across Arthur’s three units in Subang, Purwakarta, and Bandung. Each unit can also be hired on its own.',
  },
  pembayaran: {
    title: 'How we are paid, set in writing before work starts',
    description:
      'Where our pay comes from and what costs fall on you, set in writing before work starts.',
  },
}

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
 * `metadata.title` and `metadata.description` are plain Sanity strings, so
 * they head the Indonesian page only. The English head is the owner's
 * approved one, whatever the Studio holds.
 */
describe('threeUnitsHead', () => {
  const written = {
    metadata: { ...metadata('Deskripsi rangkaian.'), title: 'Judul rangkaian' },
  }

  it('heads the Indonesian page with what the Studio wrote', async () => {
    expect(await threeUnitsHead('id', written)).toEqual({
      title: 'Judul rangkaian',
      description: 'Deskripsi rangkaian.',
    })
    // Nothing written: the title the page has always fallen back to.
    expect(await threeUnitsHead('id', { metadata: null })).toEqual({
      title: 'Layanan',
      description: null,
    })
  })

  it('heads the English page with what the owner approved', async () => {
    expect(await threeUnitsHead('en', written)).toEqual(APPROVED.layanan)
    expect(await threeUnitsHead('en', { metadata: null })).toEqual(
      APPROVED.layanan
    )
  })
})

describe('paymentHead', () => {
  const page = {
    title: 'Cara kami dibayar',
    metadata: {
      title: 'Judul pembayaran',
      description: 'Deskripsi pembayaran.',
      keywords: null,
      noIndex: false,
    },
  }

  it('heads the Indonesian page with what the Studio wrote', async () => {
    expect(await paymentHead('id', page)).toEqual({
      title: 'Judul pembayaran',
      description: 'Deskripsi pembayaran.',
    })
    // No SEO title: the document's own.
    expect(
      await paymentHead('id', {
        ...page,
        metadata: { ...page.metadata, title: null },
      })
    ).toEqual({
      title: 'Cara kami dibayar',
      description: 'Deskripsi pembayaran.',
    })
    // No document: the not-found view, titled as before and undescribed.
    expect(await paymentHead('id', null)).toEqual({
      title: 'Pembayaran',
      description: null,
    })
  })

  it('heads the English page with what the owner approved', async () => {
    expect(await paymentHead('en', page)).toEqual(APPROVED.pembayaran)
    // No document: the not-found view describes nothing in English either.
    expect(await paymentHead('en', null)).toEqual({
      title: APPROVED.pembayaran.title,
      description: null,
    })
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
    expect(paths).toContain('/metode')
    expect(paths).toContain('/layanan')

    expect(catalog('/metode')).toBeUndefined()
    expect(catalog('/layanan')).toBeUndefined()
  })
})
