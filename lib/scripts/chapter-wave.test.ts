import { describe, expect, it } from 'bun:test'

import { SHORTLIST_PROPOSALS } from '@/lib/content/shortlist'
import { SITUATION_OVERRIDES } from '@/lib/content/situation-overrides'
import { readerName, situationSlug } from '@/lib/content/situation-pages'
import { checkText } from '@/lib/content/style-gate'
import { SIDES } from '@/lib/content/units'

import { missingChapters, type Wave, WAVES } from './chapter-wave'
import { CATALOG_SIDE_KEYS } from './import-catalog'

/*
 * The catalogue itself lives outside the repository, so these tests pin what
 * the repository owns: every chapter a wave will build has its copy, and the
 * copy passes the style gate before the owner reads it.
 */

describe('CATALOG_SIDE_KEYS', () => {
  it('maps Sisi A and Sisi B onto the two route keys of each unit', () => {
    for (const [unit, keys] of Object.entries(CATALOG_SIDE_KEYS)) {
      expect(new Set([keys.A, keys.B])).toEqual(
        new Set(SIDES[unit as keyof typeof SIDES])
      )
    }
  })
})

for (const [name, wave] of Object.entries(WAVES) as [string, Wave][]) {
  const chapters = SHORTLIST_PROPOSALS.filter(
    (chapter) =>
      chapter.unit === wave.unit &&
      chapter.side === wave.side &&
      chapter.keputusan !== undefined &&
      chapter.ditahanBab === undefined &&
      !wave.kecuali?.includes(chapter.situation)
  )

  describe(`wave ${name}`, () => {
    it('builds only chapters the owner decided', () => {
      expect(chapters.length).toBeGreaterThan(0)
    })

    it('names every decided chapter the catalogue no longer has', () => {
      const sources = chapters.map((chapter) => ({
        unit: chapter.unit,
        side: chapter.side,
        nama: chapter.situation,
        pembeli: '',
        kutipan: '',
      }))
      expect(missingChapters(wave, sources)).toEqual([])
      expect(missingChapters(wave, sources.slice(1))).toEqual(
        chapters.slice(0, 1).map((chapter) => chapter.situation)
      )
    })

    for (const chapter of chapters) {
      const key = `${wave.unit}/${wave.side}/${situationSlug(readerName(chapter.situation))}`
      const copy = SITUATION_OVERRIDES.get(key)

      describe(readerName(chapter.situation), () => {
        it('has every block a reader sees', () => {
          expect(copy?.situasi).toBeTruthy()
          expect(copy?.pembeli).toBeTruthy()
          expect(copy?.batas).toBeTruthy()
          expect(copy?.metadata?.judul).toBeTruthy()
          expect(copy?.metadata?.deskripsi).toBeTruthy()
        })

        it('fits the search result limits', () => {
          expect(copy?.metadata?.judul.length ?? 0).toBeLessThanOrEqual(60)
          expect(copy?.metadata?.deskripsi.length ?? 0).toBeLessThanOrEqual(155)
        })

        it('keeps limits and situation to three sentences', () => {
          const count = (text = '') =>
            text.split(/(?<=[.?])\s+/u).filter(Boolean).length
          expect(count(copy?.situasi)).toBeLessThanOrEqual(3)
          expect(count(copy?.batas)).toBeLessThanOrEqual(3)
        })

        it('passes the style gate with no error and no warning', () => {
          const texts = [
            copy?.situasi,
            copy?.pembeli,
            copy?.batas,
            copy?.metadata?.judul,
            copy?.metadata?.deskripsi,
            ...(copy?.jembatan ?? []).map((bridge) => bridge.kalimat),
          ].filter((text): text is string => Boolean(text))
          expect(texts.flatMap((text) => checkText(text))).toEqual([])
        })

        it('bridges only to an offer the owner decided to show', () => {
          const shown = new Set(
            SHORTLIST_PROPOSALS.filter(
              (item) => item.keputusan !== undefined
            ).flatMap((item) => item.pilihan.map((pick) => pick.id))
          )
          for (const bridge of copy?.jembatan ?? [])
            expect(shown.has(bridge.offer)).toBe(true)
        })
      })
    }
  })
}
