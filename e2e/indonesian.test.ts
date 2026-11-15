import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

import { PLATE_WORDS_EN } from '@/lib/plates/words'
import { STATIC_ROUTE_TEMPLATES } from '@/lib/seo/route-catalog'

import { indonesianWords, sameAsTwin, wordsOf } from './indonesian'

/**
 * Every string in a message catalogue, by its dotted key.
 *
 * Read from disk, not imported, as `lib/content/units.test.ts` does and for
 * its reason: once typegen has run, `@/messages/en.json` resolves to the
 * declaration next-intl generates (`messages/en.d.json.ts`), which `tsc`
 * rejects without `allowArbitraryExtensions`. A value that is not a string
 * or a nested group fails the read rather than being skipped.
 */
function catalogue(locale: 'en' | 'id'): Map<string, string> {
  const file = `messages/${locale}.json`
  const found = new Map<string, string>()
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'))
  const pending: [path: string, node: unknown][] = [['', parsed]]
  for (let next = pending.pop(); next; next = pending.pop()) {
    const [path, node] = next
    if (typeof node === 'string') {
      found.set(path, node)
    } else if (typeof node === 'object' && node !== null) {
      for (const [key, value] of Object.entries(node)) {
        pending.push([path ? `${path}.${key}` : key, value])
      }
    } else {
      throw new Error(`${file}: ${path} is neither a string nor a group`)
    }
  }
  return found
}

describe('indonesianWords', () => {
  it('finds no Indonesian in the approved English', () => {
    const english = [
      ...catalogue('en').values(),
      ...Object.values(PLATE_WORDS_EN).flatMap((words) => Object.values(words)),
      ...STATIC_ROUTE_TEMPLATES.flatMap((route) => [
        route.label.en,
        route.description?.en ?? '',
      ]),
    ]
    // Anti-vacuum: an empty corpus would pass.
    expect(english.length).toBeGreaterThan(400)

    const flagged = english
      .map((text) => ({ text, words: indonesianWords(text) }))
      .filter(({ words }) => words.length > 0)
    expect(flagged).toEqual([])
  })

  it('catches every Indonesian interface string of three words or more', () => {
    const english = catalogue('en')
    const checked = [...catalogue('id')].filter(
      ([key, text]) => english.get(key) !== text && wordsOf(text).length >= 3
    )
    expect(checked.length).toBeGreaterThan(100)

    const missed = checked.filter(
      ([, text]) => indonesianWords(text).length === 0
    )
    expect(missed).toEqual([])
  })

  it('reads past addresses, emails and paths', () => {
    expect(indonesianWords('kontak@arth.invalid')).toEqual([])
    expect(
      indonesianWords('See /kontak and https://example.com/layanan')
    ).toEqual([])
    expect(indonesianWords('Ceritakan masalahnya')).toEqual([
      'ceritakan',
      'masalahnya',
    ])
  })

  it('leaves names, and the name of a language, alone', () => {
    expect(
      indonesianWords(
        'Konstruksi, Teknologi, and Peekabo, in Subang, Purwakarta, and Bandung'
      )
    ).toEqual([])
    expect(indonesianWords('Switch to Bahasa Indonesia')).toEqual([])
  })
})

describe('sameAsTwin', () => {
  it('finds copy left untranslated, whatever its words', () => {
    expect(
      sameAsTwin(
        ['Live per jam', 'Order at the table'],
        ['Live per jam', 'Pesan dari meja']
      )
    ).toEqual(['Live per jam'])
  })

  it('ignores single words and strings made only of names', () => {
    const both = ['Peekabo', 'Membership Care', 'Subang, Purwakarta', '01']
    expect(sameAsTwin(both, both)).toEqual([])
  })

  it('compares words, not punctuation or case', () => {
    expect(sameAsTwin(['Live per jam.'], ['LIVE PER JAM'])).toEqual([
      'Live per jam.',
    ])
  })
})
