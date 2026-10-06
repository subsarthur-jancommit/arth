import { describe, expect, it } from 'bun:test'

import { buildAtomFeed, escapeXml, type Feed, feedDate } from './atom-feed'

const FEED: Feed = {
  selfUrl: 'https://arth.test/en/journal/feed.xml',
  pageUrl: 'https://arth.test/en/journal',
  title: 'Arth — Journal',
  subtitle: 'Notes on method & decisions.',
  language: 'en-US',
  author: 'Arth',
  entries: [
    {
      url: 'https://arth.test/en/journal/older',
      title: 'Older',
      summary: 'Written first.',
      body: ['One.', 'Two.'],
      date: '2025-12-04',
    },
    {
      url: 'https://arth.test/en/journal/newer',
      title: 'Newer <draft> & "quoted"',
      summary: 'Written second.',
      body: ['Only paragraph.'],
      date: '2026-02-11',
    },
  ],
}

describe('the journal feed', () => {
  it('is an Atom document that declares its language and itself', () => {
    const xml = buildAtomFeed(FEED)
    expect(xml.startsWith('<?xml version="1.0" encoding="utf-8"?>')).toBe(true)
    expect(xml).toContain(
      '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-US">'
    )
    expect(xml).toContain(
      '<link rel="self" type="application/atom+xml" href="https://arth.test/en/journal/feed.xml"/>'
    )
    expect(xml).toContain('<id>https://arth.test/en/journal/feed.xml</id>')
  })

  it('lists the newest entry first and dates the feed by it', () => {
    const xml = buildAtomFeed(FEED)
    expect(xml.indexOf('/journal/newer')).toBeLessThan(
      xml.indexOf('/journal/older')
    )
    expect(xml).toContain('<updated>2026-02-11T00:00:00Z</updated>')
  })

  it('escapes what XML would otherwise read as markup', () => {
    const xml = buildAtomFeed(FEED)
    expect(xml).toContain(
      '<title>Newer &lt;draft&gt; &amp; &quot;quoted&quot;</title>'
    )
    expect(xml).toContain('Notes on method &amp; decisions.')
    expect(escapeXml(`a'b`)).toBe('a&apos;b')
  })

  it('keeps every paragraph of the body', () => {
    expect(buildAtomFeed(FEED)).toContain(
      '<content type="text">One.\n\nTwo.</content>'
    )
  })

  it('never emits an invalid date', () => {
    expect(feedDate('2026-02-11')).toBe('2026-02-11T00:00:00Z')
    expect(feedDate('2026-02-11T09:30:00Z')).toBe('2026-02-11T09:30:00Z')
    expect(feedDate('not a date')).toBe('1970-01-01T00:00:00Z')
  })

  it('dates an empty journal at the epoch rather than now', () => {
    expect(buildAtomFeed({ ...FEED, entries: [] })).toContain(
      '<updated>1970-01-01T00:00:00Z</updated>'
    )
  })
})
