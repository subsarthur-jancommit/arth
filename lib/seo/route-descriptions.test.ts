import { describe, expect, it, spyOn } from 'bun:test'

import type { HowWeWorkContent } from '@/lib/content/how-we-work-content'
import type { SequenceContent } from '@/lib/content/sequence-content'
import type { Locale } from '@/lib/i18n/routing'

import { STATIC_ROUTES } from './route-catalog'
import {
  type PageHeadSources,
  resolveRouteDescriptions,
} from './route-descriptions'

const howWeWork: HowWeWorkContent = {
  _id: 'howWeWork',
  janji: [
    { _key: 'lingkup', judul: 'Lingkup', kalimat: 'Lingkup disepakati.' },
  ],
  hakMilikKlien: 'Hak milik ditulis dalam kesepakatan.',
  pengungkapanKomisi: 'Komisi diungkapkan sebelum kerja dimulai.',
  yangTidakDijual: 'Arthur tidak menjual hasil yang tidak dikendalikan.',
  wilayah: [{ _key: 'subang', nama: 'Subang' }],
  contohFormat: null,
  metadata: {
    title: null,
    description: 'Cara kerja, seperti ditulis di Studio.',
    keywords: null,
    noIndex: null,
  },
}

function step(index: number, kunci: 'konstruksi' | 'teknologi' | 'peekabo') {
  return {
    _key: `langkah-${index}`,
    unit: { kunci, nama: kunci },
    offerCount: 1,
    offer: [{ _key: `offer-${index}`, slug: `offer-${index}`, judul: 'Offer' }],
    kalimat: 'Langkah yang mungkin.',
  }
}

const sequence: SequenceContent = {
  _id: 'rangkaian-1',
  situasi: 'Satu kebutuhan menyentuh ruang, sistem, dan pasar.',
  langkah: [step(1, 'konstruksi'), step(2, 'teknologi'), step(3, 'peekabo')],
  keterangan: 'Ini rangkaian yang mungkin.',
  metadata: {
    title: null,
    description: 'Rangkaian, seperti ditulis di Studio.',
    keywords: null,
    noIndex: null,
  },
}

function sources(overrides: Partial<PageHeadSources> = {}): PageHeadSources {
  return {
    howWeWork: () => Promise.resolve(howWeWork),
    sequences: () => Promise.resolve([sequence]),
    ...overrides,
  }
}

describe('resolveRouteDescriptions', () => {
  it('says what each page head says, under its localized path', async () => {
    const descriptions = await resolveRouteDescriptions(['id'], sources())

    expect([...descriptions]).toEqual([
      ['/id/metode-kerja', 'Cara kerja, seperti ditulis di Studio.'],
      ['/id/layanan-terpadu', 'Rangkaian, seperti ditulis di Studio.'],
    ])
  })

  it('follows the head when the Studio has written no SEO description', async () => {
    const descriptions = await resolveRouteDescriptions(
      ['id'],
      sources({
        howWeWork: () => Promise.resolve({ ...howWeWork, metadata: null }),
        sequences: () => Promise.resolve([{ ...sequence, metadata: null }]),
      })
    )

    // The first written promise, and nothing for the sequence page: what
    // the two heads print in that state.
    expect(descriptions.get('/id/metode-kerja')).toBe('Lingkup disepakati.')
    expect(descriptions.has('/id/layanan-terpadu')).toBe(false)
  })

  it('reads every locale it is asked for, in that locale', async () => {
    const asked: Locale[] = []
    const descriptions = await resolveRouteDescriptions(
      ['en', 'id'],
      sources({
        howWeWork: (locale) => {
          asked.push(locale)
          return Promise.resolve(howWeWork)
        },
      })
    )

    expect(asked.toSorted()).toEqual(['en', 'id'])
    expect([...descriptions.keys()].toSorted()).toEqual([
      '/en/metode-kerja',
      '/en/layanan-terpadu',
      '/id/metode-kerja',
      '/id/layanan-terpadu',
    ])
  })

  it('describes only pages the catalog advertises', async () => {
    const advertised = STATIC_ROUTES.map((route) => route.path)
    const descriptions = await resolveRouteDescriptions(['id'], sources())

    expect(descriptions.size).toBeGreaterThan(0)
    for (const path of descriptions.keys()) expect(advertised).toContain(path)
  })

  it('leaves a page with nothing to show to the catalog', async () => {
    const descriptions = await resolveRouteDescriptions(
      ['id'],
      sources({
        howWeWork: () => Promise.resolve(null),
        sequences: () => Promise.resolve([]),
      })
    )

    expect(descriptions.size).toBe(0)
  })

  /*
   * `/llms.txt` and the search index are prerendered, so a throw here would
   * not be a failed request but a failed build — the case `resolveSearchIndex`
   * records. A failed read costs one page its head's sentence, never the
   * other page's, and is logged rather than silent.
   */
  it('a failed read costs only that page, and is logged', async () => {
    const warn = spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      const descriptions = await resolveRouteDescriptions(
        ['id'],
        sources({
          howWeWork: () => Promise.reject(new Error('read ECONNRESET')),
        })
      )

      expect(descriptions.has('/id/metode-kerja')).toBe(false)
      expect(descriptions.get('/id/layanan-terpadu')).toBe(
        'Rangkaian, seperti ditulis di Studio.'
      )
      expect(warn).toHaveBeenCalledTimes(1)
    } finally {
      warn.mockRestore()
    }
  })

  it('reads the real loaders by default, which answer nothing without a CMS', async () => {
    // `bun test` does not load `.env.local`, so Sanity is unconfigured here
    // (the reason is in `.github/workflows/ci.yml`) and no fetch runs.
    expect((await resolveRouteDescriptions()).size).toBe(0)
  })
})
