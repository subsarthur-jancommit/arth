import { describe, expect, it } from 'bun:test'

import {
  canRenderPublicContent,
  hasPublicPlaceholder,
} from './public-content-guard'

describe('public content guard', () => {
  it('recognizes every placeholder form that cannot reach readers', () => {
    expect(
      hasPublicPlaceholder([
        '[PERLU pemilik memutuskan]',
        'Isi contoh yang belum disetujui',
        'Teks sementara',
      ])
    ).toBe(true)
  })

  it('allows finished reader copy', () => {
    expect(
      canRenderPublicContent('offer/arsip', [
        'Berkas kerja tersusun sebelum pekerjaan dimulai.',
      ])
    ).toBe(true)
  })
})
