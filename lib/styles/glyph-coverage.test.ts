/**
 * The copy asks for no glyph that would download a whole extra font file.
 *
 * The three families come from `next/font/google`, which preloads their
 * `latin` files and declares every other subset by `unicode-range`. A single
 * letter outside `latin` makes the browser fetch that family's next subset in
 * full: the footer's "Satūs" cost every page Inter's whole `latin-ext` file,
 * 133,704 bytes, until F4-06 perbaikan cut its "ū" into a file of its own
 * (`lib/styles/font-files/README.md`). On a slow phone link production
 * requested that file ahead of the preloaded faces (`docs/F4-06-UKUR.md` §8).
 *
 * This reads the message catalogues, not the CMS: Sanity's copy was audited
 * on production on 2026-11-13 (all 20 sitemap pages, nothing outside `latin`
 * but "ū" and "⌘" from here, and one "→" set in the code), and
 * `e2e/font-first-paint.e2e.ts` holds the rendered home and unit pages to the
 * same rule by what they actually download.
 */

import { describe, expect, it } from 'bun:test'

/**
 * Google Fonts' `latin` subset, as served for all three families (read from
 * production's `@font-face` rules on 2026-11-13).
 */
const LATIN: [number, number][] = [
  [0x0000, 0x00ff],
  [0x0131, 0x0131],
  [0x0152, 0x0153],
  [0x02bb, 0x02bc],
  [0x02c6, 0x02c6],
  [0x02da, 0x02da],
  [0x02dc, 0x02dc],
  [0x0304, 0x0304],
  [0x0308, 0x0308],
  [0x0329, 0x0329],
  [0x2000, 0x206f],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2191, 0x2191],
  [0x2193, 0x2193],
  [0x2212, 0x2212],
  [0x2215, 0x2215],
  [0xfeff, 0xfeff],
  [0xfffd, 0xfffd],
]

/**
 * Glyphs outside `latin` that the copy may use, and where. Anywhere else they
 * would fetch a whole subset, so the place is part of the allowance.
 */
const ALLOWED = new Map<string, { keys: readonly string[]; why: string }>([
  [
    'ū',
    {
      keys: ['footer.builtOn'],
      why: 'served by lib/styles/font-files/inter-u-macron.woff2, which only the colophon line names',
    },
  ],
  [
    '⌘',
    {
      keys: ['search.shortcut'],
      why: 'no face on the site covers it, so it fetches no file; the reader’s system font draws it',
    },
  ],
])

/** A message catalogue: strings, nested by key. */
type MessageNode =
  | string
  | number
  | boolean
  | null
  | MessageNode[]
  | { [key: string]: MessageNode }

const inLatin = (codePoint: number) =>
  LATIN.some(([from, to]) => codePoint >= from && codePoint <= to)

/** Every string in a message catalogue, with its dotted key. */
function* strings(node: MessageNode, path = ''): Generator<[string, string]> {
  if (typeof node === 'string') {
    yield [path, node]
  } else if (Array.isArray(node)) {
    for (const [index, value] of node.entries()) {
      yield* strings(value, `${path}[${index}]`)
    }
  } else if (node !== null && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      yield* strings(value, path ? `${path}.${key}` : key)
    }
  }
}

describe('glyph coverage (messages/*.json)', () => {
  for (const catalogue of ['messages/id.json', 'messages/en.json']) {
    it(`${catalogue} needs no glyph outside the shipped files`, async () => {
      const messages: MessageNode = await Bun.file(catalogue).json()
      const strays: string[] = []
      for (const [key, text] of strings(messages)) {
        for (const glyph of new Set(text)) {
          const codePoint = glyph.codePointAt(0) ?? 0
          if (inLatin(codePoint)) continue
          if (ALLOWED.get(glyph)?.keys.includes(key)) continue
          strays.push(
            `${key}: "${glyph}" (U+${codePoint.toString(16).toUpperCase().padStart(4, '0')})`
          )
        }
      }
      expect(
        strays,
        `These would make every page download a whole extra font subset. Cut the glyph into lib/styles/font-files (README there says how) and route its element, or write it without that glyph:\n${strays.join('\n')}`
      ).toEqual([])
    })
  }

  it('every allowance is still used, so none outlives its reason', async () => {
    const used = new Set<string>()
    for (const catalogue of ['messages/id.json', 'messages/en.json']) {
      const messages: MessageNode = await Bun.file(catalogue).json()
      for (const [key, text] of strings(messages)) {
        for (const glyph of ALLOWED.keys()) {
          if (text.includes(glyph)) used.add(`${glyph} ${key}`)
        }
      }
    }
    for (const [glyph, { keys }] of ALLOWED) {
      for (const key of keys) {
        expect(
          used.has(`${glyph} ${key}`),
          `"${glyph}" is allowed in ${key}, which no longer uses it`
        ).toBe(true)
      }
    }
  })
})
