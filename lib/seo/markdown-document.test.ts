import { describe, expect, it } from 'bun:test'

import { absoluteSiteUrl } from './agent-content'
import {
  buildMarkdownDocument,
  buildMarkdownDocumentFromRoutes,
  type MarkdownDocument,
} from './markdown-document'
import { SITE } from './site'

/** Narrows away the redirect/degraded branches for tests asserting on a document body. */
function assertDocumentBody(
  document: MarkdownDocument
): asserts document is Extract<MarkdownDocument, { status: 200 | 404 | 406 }> {
  if (document.status === 303 || document.status === 503) {
    throw new Error(`expected a document body, got status ${document.status}`)
  }
}

describe('buildMarkdownDocument', () => {
  it('returns the advertised Markdown representation for a static route', async () => {
    // '/id', not '/': `localePrefix` is 'always', so every advertised static
    // route carries a locale prefix. '/' only ever redirects.
    const document = await buildMarkdownDocument('/id')
    assertDocumentBody(document)

    expect(document.status).toBe(200)
    expect(document.contentType).toBe('text/markdown; charset=utf-8')
    // Read from SITE rather than spelled out: this assertion held the
    // starter's name in place long after the fork stopped being it.
    expect(document.body).toContain(`# Beranda | ${SITE.name}`)
    expect(document.body).toContain('## When to use')
    expect(document.body).toContain('## How to use')
  })

  it('returns a recoverable Markdown 404 for a path outside static and CMS routes', async () => {
    const document = await buildMarkdownDocument('/missing/nested-route')
    assertDocumentBody(document)

    expect(document.status).toBe(404)
    expect(document.contentType).toBe('text/markdown; charset=utf-8')
    expect(document.body).toContain('/llms.txt')
    expect(document.body).toContain('/sitemap.xml')
  })

  it('points agents to the canonical HTML URL with a 406 when the client accepts only Markdown', () => {
    const document = buildMarkdownDocumentFromRoutes(
      '/about',
      [
        {
          path: '/about',
          label: 'About',
          lastModified: new Date('2026-01-01T00:00:00.000Z'),
        },
      ],
      { htmlAcceptable: false }
    )
    assertDocumentBody(document)

    expect(document.status).toBe(406)
    expect(document.contentType).toBe('text/plain; charset=utf-8')
    expect(document.body).toContain(absoluteSiteUrl('/about'))
    expect(document.body).toContain('Request text/html')
  })

  it('redirects to the HTML document instead of 406ing when the client also accepts text/html', () => {
    const document = buildMarkdownDocumentFromRoutes(
      '/about',
      [
        {
          path: '/about',
          label: 'About',
          lastModified: new Date('2026-01-01T00:00:00.000Z'),
        },
      ],
      { htmlAcceptable: true }
    )

    expect(document.status).toBe(303)
    expect(document.status === 303 && document.location).toBe(
      '/about?format=html'
    )
  })

  it('preserves the original query string in the HTML-fallback redirect alongside format=html', () => {
    const document = buildMarkdownDocumentFromRoutes(
      '/about',
      [
        {
          path: '/about',
          label: 'About',
          lastModified: new Date('2026-01-01T00:00:00.000Z'),
        },
      ],
      { htmlAcceptable: true, search: '?variant=x' }
    )

    expect(document.status).toBe(303)
    expect(document.status === 303 && document.location).toBe(
      '/about?variant=x&format=html'
    )
  })

  it('defaults to html-acceptable when the caller does not specify — never 406s without confirming the client rejected html', () => {
    const document = buildMarkdownDocumentFromRoutes('/about', [
      {
        path: '/about',
        label: 'About',
        lastModified: new Date('2026-01-01T00:00:00.000Z'),
      },
    ])

    expect(document.status).toBe(303)
  })

  it('returns a 503 with a retry hint when the CMS catalog is degraded rather than confirmed empty', () => {
    const document = buildMarkdownDocumentFromRoutes('/outage-only-route', [], {
      catalogDegraded: true,
    })

    expect(document.status).toBe(503)
    expect(document.status === 503 && document.retryAfterSeconds).toBe(60)
    expect(document.status === 503 && document.body).toContain('transient')
  })

  it('still returns 200 for a static route even when the CMS catalog is degraded — static routes never depend on it', () => {
    const document = buildMarkdownDocumentFromRoutes('/id', [], {
      catalogDegraded: true,
    })

    expect(document.status).toBe(200)
  })
})

/*
 * `/cara-kerja` reads its meta description from the CMS. The mirror has to
 * print what that head says, in both places it names the page — the page's
 * own section and the page list every mirror carries.
 */
describe('a page whose head describes itself from the CMS', () => {
  const descriptions = new Map([
    ['/id/cara-kerja', 'Cara kerja, seperti ditulis di Studio.'],
  ])

  it("prints the head's description under This page and in the page list", () => {
    const document = buildMarkdownDocumentFromRoutes('/id/cara-kerja', [], {
      descriptions,
    })
    assertDocumentBody(document)

    expect(document.status).toBe(200)
    expect(document.body).toContain(
      '## This page\n\nCara kerja, seperti ditulis di Studio.\n'
    )
    expect(document.body).toContain(
      `(${absoluteSiteUrl('/id/cara-kerja')}): Cara kerja, seperti ditulis di Studio.`
    )
  })

  it("prints it in another page's list too", () => {
    const document = buildMarkdownDocumentFromRoutes('/id/kontak', [], {
      descriptions,
    })
    assertDocumentBody(document)

    expect(document.body).toContain(
      `(${absoluteSiteUrl('/id/cara-kerja')}): Cara kerja, seperti ditulis di Studio.`
    )
  })

  it('prints no line of its own when nothing could be read', async () => {
    // Hermetic: no CMS is configured under `bun test`, so the resolver reads
    // nothing, and the catalog keeps no copy of the head's sentence.
    const document = await buildMarkdownDocument('/id/cara-kerja')
    assertDocumentBody(document)

    expect(document.status).toBe(200)
    expect(document.body).toContain(
      '## This page\n\nThis representation summarizes the route'
    )
    expect(document.body).toContain(
      `- [Cara kami bekerja](${absoluteSiteUrl('/id/cara-kerja')})\n`
    )
  })
})
