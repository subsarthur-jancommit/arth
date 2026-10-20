import { describe, expect, it } from 'bun:test'

import { type ContactSource, resolveContactContent } from './contact-content'

function completeSource(): ContactSource {
  return {
    _id: 'siteSettings',
    name: 'Arthur',
    statement: [
      {
        _type: 'block',
        _key: 'statement',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'statement-text',
            marks: [],
            text: 'Arthur bekerja dari masalah yang perlu diputuskan.',
          },
        ],
      },
    ],
    regions: [
      { _key: 'subang', name: 'Subang' },
      { _key: 'purwakarta', name: 'Purwakarta' },
      { _key: 'bandung', name: 'Bandung' },
    ],
    address: 'Jl. Pekerjaan No. 1, Subang, Indonesia',
    channel: {
      email: 'hello@arthur.co.id',
      whatsapp: '+62 812 3456 7890',
      responseTime: 'Pesan dibaca pada hari kerja.',
    },
    socials: [
      {
        _key: 'instagram',
        label: 'Instagram',
        url: 'https://instagram.com/arthur',
      },
    ],
    metadata: {
      title: 'Tentang dan kontak Arthur',
      description: 'Cara menghubungi Arthur.',
      keywords: ['Arthur', 'kontak'],
      noIndex: false,
    },
  }
}

describe('contact content boundary', () => {
  it('keeps the approved dummy values visible but inactive and noindexed', () => {
    const content = resolveContactContent('id', null)

    expect(content.email).toBe('kontak@arth.invalid')
    expect(content.emailHref).toBeNull()
    expect(content.emailIsPlaceholder).toBe(true)
    expect(content.addressIsPlaceholder).toBe(true)
    expect(content.contactReady).toBe(false)
    expect(content.noIndex).toBe(true)
    expect(content.regions.map((region) => region.name)).toEqual([
      'Subang',
      'Purwakarta',
      'Bandung',
    ])
  })

  it('opens real channels only when the contact facts are complete', () => {
    const content = resolveContactContent('id', completeSource())

    expect(content.emailHref).toBe('mailto:hello@arthur.co.id')
    expect(content.whatsappHref).toBe('https://wa.me/6281234567890')
    expect(content.contactReady).toBe(true)
    expect(content.noIndex).toBe(false)
  })

  it('refuses invalid social and WhatsApp destinations', () => {
    const source = completeSource()
    source.channel.whatsapp = 'nomor menyusul'
    source.socials = [
      {
        _key: 'unsafe',
        label: 'Unsafe',
        url: 'javascript:alert(1)',
      },
    ]

    const content = resolveContactContent('id', source)
    expect(content.whatsappHref).toBeNull()
    expect(content.socials).toEqual([])
    expect(content.contactReady).toBe(true)
  })

  it('withholds an owner statement carrying an editorial marker', () => {
    const source = completeSource()
    source.statement = [
      {
        _type: 'block',
        _key: 'statement',
        children: [{ _type: 'span', text: '[PERLU PEMILIK: pernyataan]' }],
      },
    ]

    const content = resolveContactContent('id', source)
    expect(content.statement).toBeNull()
    expect(content.contactReady).toBe(false)
    expect(content.noIndex).toBe(true)
  })
})
