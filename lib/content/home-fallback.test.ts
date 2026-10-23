/**
 * Guards what `siteSettings` decides and what the placeholder contact covers.
 *
 * Since V6 the headline, the subline, and the statement come from the CMS or
 * not at all; only the contact fields fall back, to a placeholder that says
 * it is one, until K5. An inverted check would render the placeholder over
 * the studio's real address, on a page that still looks perfectly fine.
 *
 * The empty-string cases are the ones worth the most here. Sanity stores `""`
 * for a field an editor opened and cleared, so a plain `??` would treat that
 * as content and render a blank heading.
 */

import { describe, expect, it } from 'bun:test'

import { resolveHomeContent } from './home-fallback'

describe('resolveHomeContent', () => {
  it('has no words of its own when there is no settings document', () => {
    const en = resolveHomeContent('en', null)
    const id = resolveHomeContent('id', null)

    expect(en.headline).toBeNull()
    expect(id.headline).toBeNull()
    expect(en.subline).toBeNull()
    expect(en.statement).toBeNull()
    expect(en.socials).toEqual([])
    expect(en.address).toBe('0 Example Street, Example City, Indonesia')
    expect(id.address).toBe('Jl. Contoh No. 00, Kota Contoh, Indonesia')
    expect(en.fallbacks.address).toBe(true)
  })

  it('reads the CMS field by field', () => {
    const resolved = resolveHomeContent('en', {
      name: 'Arth Studio',
      headline: 'A real headline from the CMS',
    })

    expect(resolved.name).toBe('Arth Studio')
    expect(resolved.headline).toBe('A real headline from the CMS')
    // A field the document lacks stays empty: no copy stands in for it.
    expect(resolved.subline).toBeNull()
    expect(resolved.statement).toBeNull()
    // The contact fields keep the placeholder rather than blanking out.
    expect(resolved.email.length).toBeGreaterThan(0)

    /*
     * Origin is per field because resolution is per field: this document
     * supplies a name and a headline and nothing else, so the email and the
     * address are still the placeholder, and the page has to say so.
     */
    expect(resolved.fallbacks.email).toBe(true)
    expect(resolved.fallbacks.address).toBe(true)
  })

  it('treats an emptied field as absent, not as content', () => {
    const resolved = resolveHomeContent('en', {
      headline: '',
      subline: '   ',
      email: '',
    })

    const placeholder = resolveHomeContent('en', null)
    expect(resolved.headline).toBeNull()
    expect(resolved.subline).toBeNull()
    expect(resolved.email).toBe(placeholder.email)
  })

  it('keeps reserved-domain contact addresses on the labeled placeholder path', () => {
    for (const email of ['studio@arth.example', 'kontak@arth.invalid']) {
      const resolved = resolveHomeContent('id', { email })
      const fallback = resolveHomeContent('id', null)

      expect(resolved.email).toBe(fallback.email)
      expect(resolved.fallbacks.email).toBe(true)
    }
  })

  it('keeps an example postal address on the labeled placeholder path', () => {
    const resolved = resolveHomeContent('id', {
      address: 'Jl. Contoh No. 00, Kota Contoh, Indonesia',
    })

    expect(resolved.fallbacks.address).toBe(true)
    expect(resolved.address).toBe('Jl. Contoh No. 00, Kota Contoh, Indonesia')
  })

  it('uses a real address from the CMS without the placeholder flag', () => {
    const resolved = resolveHomeContent('id', {
      address: 'Jl. Merdeka No. 1, Subang',
    })

    expect(resolved.address).toBe('Jl. Merdeka No. 1, Subang')
    expect(resolved.fallbacks.address).toBe(false)
  })

  it('reads a CMS statement', () => {
    const blocks = [{ _type: 'block', children: [] }]
    const resolved = resolveHomeContent('en', { statement: blocks })

    expect(resolved.statement).toBe(blocks)
  })

  it('treats an empty statement as none', () => {
    expect(resolveHomeContent('en', { statement: [] }).statement).toBeNull()
  })

  it('drops half-filled social rows rather than rendering a dead link', () => {
    const resolved = resolveHomeContent('en', {
      socials: [
        { label: 'Instagram', url: 'https://instagram.com/arth' },
        { label: 'No URL yet' },
        { url: 'https://example.test' },
      ],
    })

    expect(resolved.socials).toEqual([
      { label: 'Instagram', url: 'https://instagram.com/arth' },
    ])
  })

  it('falls back when every social row is unusable', () => {
    const resolved = resolveHomeContent('en', { socials: [{ label: 'x' }] })
    expect(resolved.socials).toEqual(resolveHomeContent('en', null).socials)
  })

  it('withholds an entire settings document when one public field is a placeholder', () => {
    const resolved = resolveHomeContent('id', {
      headline: '[PERLU pemilik menyetujui judul]',
      subline: 'Subjudul yang tidak boleh lolos sendiri.',
    })

    expect(resolved.headline).toBeNull()
    expect(resolved.subline).toBeNull()
  })
})
