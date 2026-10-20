import { describe, expect, it } from 'bun:test'

import {
  type FixedPageSource,
  resolveFixedPageContent,
} from './fixed-page-content'

const validPage: FixedPageSource = {
  _id: 'page-policy',
  title: 'Kebijakan Arthur',
  slug: { current: 'kebijakan' },
  content: [
    {
      _key: 'block-1',
      _type: 'block',
      children: [{ _key: 'span-1', _type: 'span', text: 'Isi kebijakan.' }],
    },
  ],
  excerpt: 'Isi kebijakan.',
  metadata: {
    title: 'Kebijakan Arthur',
    description: 'Dokumen kebijakan Arthur.',
    keywords: ['kebijakan'],
    noIndex: true,
  },
  publishedAt: null,
  _updatedAt: '2026-10-15T00:00:00.000Z',
}

describe('resolveFixedPageContent', () => {
  it('keeps a complete reader-safe page', () => {
    expect(resolveFixedPageContent(validPage)).toMatchObject({
      _id: 'page-policy',
      title: 'Kebijakan Arthur',
      metadata: { noIndex: true },
    })
  })

  it('withholds placeholders nested inside Portable Text', () => {
    const page = structuredClone(validPage)
    page.content = [
      {
        _key: 'block-1',
        _type: 'block',
        children: [{ _key: 'span-1', _type: 'span', text: '[PERLU AHLI]' }],
      },
    ]

    expect(resolveFixedPageContent(page)).toBeNull()
  })

  it('withholds empty and malformed documents', () => {
    expect(resolveFixedPageContent({ ...validPage, content: [] })).toBeNull()
    expect(resolveFixedPageContent(null)).toBeNull()
  })
})
