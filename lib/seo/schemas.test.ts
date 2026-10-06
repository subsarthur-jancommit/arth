import { describe, expect, it } from 'bun:test'

import { creativeWorkSchema, ORGANIZATION_ID, WEBSITE_ID } from './schemas'

describe('a case as CreativeWork', () => {
  it('names the work, its studio and its site, in the page language', () => {
    expect(
      creativeWorkSchema({
        name: 'Arus Balik',
        url: 'https://arth.test/en/work/arus-balik',
        inLanguage: 'en-US',
      })
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Arus Balik',
      url: 'https://arth.test/en/work/arus-balik',
      inLanguage: 'en-US',
      creator: { '@id': ORGANIZATION_ID },
      isPartOf: { '@id': WEBSITE_ID },
    })
  })

  it('carries what the page knows, and dates the work by its year', () => {
    const schema = creativeWorkSchema({
      name: 'Arus Balik',
      url: 'https://arth.test/id/work/arus-balik',
      inLanguage: 'id-ID',
      description: 'Sebuah kasus.',
      image: 'https://cdn.sanity.test/cover.jpg?w=1200&auto=format',
      year: 2025,
      datePublished: '2025-11-02T09:00:00Z',
      dateModified: '2026-01-15T10:30:00Z',
      practice: 'Konsultasi',
    })

    expect(schema.dateCreated).toBe('2025')
    expect(schema.about).toEqual({ '@type': 'Thing', name: 'Konsultasi' })
    expect(schema.description).toBe('Sebuah kasus.')
    expect(schema.image).toContain('cover.jpg')
    expect(schema.datePublished).toBe('2025-11-02T09:00:00Z')
    expect(schema.dateModified).toBe('2026-01-15T10:30:00Z')
  })

  it('emits no key it has no value for', () => {
    const schema = creativeWorkSchema({
      name: 'Untitled',
      url: 'https://arth.test/en/work/untitled',
      inLanguage: 'en-US',
      description: '',
      image: undefined,
      year: undefined,
      practice: undefined,
    })

    for (const key of [
      'description',
      'image',
      'dateCreated',
      'datePublished',
      'dateModified',
      'about',
    ]) {
      expect(key in schema, `${key} was emitted empty`).toBe(false)
    }
  })
})
