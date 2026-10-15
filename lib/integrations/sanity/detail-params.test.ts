import { describe, expect, it } from 'bun:test'

import { chapterQueryParams, offerQueryParams } from './detail-params'
import {
  chapterPagePreviewQuery,
  chapterPageQuery,
  offerPagePreviewQuery,
  offerPageQuery,
} from './queries'

/** Every `$name` a query references, outside of string literals. */
function referencedParams(query: string): string[] {
  const withoutStrings = query.replace(/"(?:[^"\\]|\\.)*"/g, '""')
  return [...new Set(withoutStrings.match(/\$[a-zA-Z_]\w*/g) ?? [])].map(
    (name) => name.slice(1)
  )
}

const route = {
  unit: 'teknologi',
  side: 'siap-pakai',
  chapter: 'kuliner',
  offer: 'bot-pesan-antar-whatsapp',
}

/*
 * Sanity rejects a query that references a parameter it was not given, and
 * the route showed readers its error page. This pins the contract the
 * unit tests used to miss: they read the query text, never its parameters.
 */
describe('detail routes supply every parameter their query references', () => {
  for (const [name, query] of [
    ['chapterPageQuery', chapterPageQuery],
    ['chapterPagePreviewQuery', chapterPagePreviewQuery],
  ] as const) {
    it(name, () => {
      const supplied: string[] = Object.keys(chapterQueryParams(route, 'id'))
      expect(
        referencedParams(query).filter((p) => !supplied.includes(p))
      ).toEqual([])
    })
  }

  for (const [name, query] of [
    ['offerPageQuery', offerPageQuery],
    ['offerPagePreviewQuery', offerPagePreviewQuery],
  ] as const) {
    it(name, () => {
      const supplied: string[] = Object.keys(offerQueryParams(route, 'id'))
      expect(
        referencedParams(query).filter((p) => !supplied.includes(p))
      ).toEqual([])
    })
  }

  it('names the document being read $slug: the chapter, then the offer', () => {
    expect(chapterQueryParams(route, 'id').slug).toBe('kuliner')
    expect(offerQueryParams(route, 'id').slug).toBe('bot-pesan-antar-whatsapp')
    expect(offerQueryParams(route, 'id').chapter).toBe('kuliner')
  })
})
