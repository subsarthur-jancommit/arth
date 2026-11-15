import { describe, expect, it } from 'bun:test'

import { PLATE_WORDS_EN } from '@/lib/plates/words'
import { STATIC_ROUTE_TEMPLATES } from '@/lib/seo/route-catalog'
import en from '@/messages/en.json'
import id from '@/messages/id.json'

import { indonesianWords, sameAsTwin, wordsOf } from './indonesian'

/** Every string in a message file, by its dotted key. */
function strings(messages: unknown, prefix = ''): Map<string, string> {
  const found = new Map<string, string>()
  if (typeof messages === 'string') {
    found.set(prefix, messages)
    return found
  }
  if (messages && typeof messages === 'object') {
    for (const [key, value] of Object.entries(messages)) {
      for (const [path, text] of strings(
        value,
        prefix ? `${prefix}.${key}` : key
      ))
        found.set(path, text)
    }
  }
  return found
}

describe('indonesianWords', () => {
  it('finds no Indonesian in the approved English', () => {
    const english = [
      ...strings(en).values(),
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
    const english = strings(en)
    const checked = [...strings(id)].filter(
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
