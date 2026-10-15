import { describe, expect, it } from 'bun:test'

import { OFFER_MODELS, offerModel, READER_TYPE } from './offer-models'

/**
 * The model of a catalogue row decides its template, so a silent change here
 * would move offers between templates without anyone choosing it. These pin
 * the four places where the models depart from the catalogue's own types
 * (`docs/R1-PENDEKATAN-POLA-OFFER.md`, §1).
 */
describe('offerModel', () => {
  it('puts bots and workflows in one model, because both hand over a running system', () => {
    const place = {
      unit: 'teknologi',
      side: 'B',
      situation: 'Kuliner dan F&B',
    } as const
    expect(offerModel({ ...place, type: 'Bot' })).toBe('sistem-dipasang')
    expect(offerModel({ ...place, type: 'Workflow' })).toBe('sistem-dipasang')
  })

  it('splits Konstruksi gaps by what they hand over', () => {
    const gap = { unit: 'konstruksi', side: 'A', type: 'Celah' } as const
    expect(
      offerModel({
        ...gap,
        situation: 'Administrasi dengan pemerintah (modul A)',
      })
    ).toBe('berkas-administrasi')
    expect(offerModel({ ...gap, situation: 'Tenaga kerja (modul B)' })).toBe(
      'lapangan'
    )
    expect(
      offerModel({
        ...gap,
        situation: 'Modal kerja lewat penjembatanan (modul D)',
      })
    ).toBe('lewat-mitra')
  })

  it('treats assembled packages, which have no type, as whole projects', () => {
    expect(
      offerModel({
        unit: 'konstruksi',
        side: 'A',
        type: undefined,
        situation: 'Paket rakitan menurut profil pembeli',
      })
    ).toBe('proyek-jadi')
  })

  it('gathers every monthly contract, across units', () => {
    expect(
      offerModel({
        unit: 'konstruksi',
        side: 'B',
        type: 'Rawat',
        situation: 'Membership Care (lapis 4)',
      })
    ).toBe('bulanan')
    expect(
      offerModel({
        unit: 'peekabo',
        side: 'A',
        type: 'Operator',
        situation: 'Operator SaaS niche (OPS)',
      })
    ).toBe('bulanan')
  })

  it('puts the whole Peekabo seller side in one model, whatever its type', () => {
    for (const type of ['Jaringan', 'Arah', 'Aset', 'Talenta', 'Kampanye']) {
      expect(
        offerModel({
          unit: 'peekabo',
          side: 'B',
          type,
          situation: 'Kreator, streamer, dan host (KRE)',
        })
      ).toBe('ikut-menjualkan')
    }
  })

  it('refuses a type it does not know rather than guessing a template', () => {
    expect(() =>
      offerModel({
        unit: 'teknologi',
        side: 'B',
        type: 'Celah',
        situation: 'x',
      })
    ).toThrow()
  })

  it('names sixteen models and a reader label for every catalogue type', () => {
    expect(OFFER_MODELS).toHaveLength(16)
    expect(READER_TYPE.size).toBe(18)
  })
})
