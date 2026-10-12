import { describe, expect, it } from 'bun:test'

import { forbidPlaceholders } from './internal'

describe('forbidPlaceholders', () => {
  it('rejects a placeholder at any nested reader path', () => {
    expect(
      forbidPlaceholders({
        _id: 'drafts/test-offer',
        _type: 'offer',
        _createdAt: '2026-10-12T00:00:00Z',
        _updatedAt: '2026-10-12T00:00:00Z',
        _rev: 'test',
        ajakan: { label: [{ value: '[PERLU PEMILIK menentukan kanal' }] },
      })
    ).toBe('Ganti placeholder di ajakan.label[0].value sebelum menerbitkan.')
  })

  it('accepts a complete reader document', () => {
    expect(
      forbidPlaceholders({
        _id: 'test-offer',
        _type: 'offer',
        _createdAt: '2026-10-12T00:00:00Z',
        _updatedAt: '2026-10-12T00:00:00Z',
        _rev: 'test',
        judul: [{ value: 'Berkas kualifikasi yang tersusun' }],
      })
    ).toBe(true)
  })
})
