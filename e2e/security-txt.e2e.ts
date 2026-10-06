import { expect, test } from '@playwright/test'

/**
 * `/.well-known/security.txt` exists and points at the private reporting
 * channel `SECURITY.md` names (`lib/seo/security-txt.ts`).
 */
test('security.txt states where to report, until when', async ({ request }) => {
  const response = await request.get('/.well-known/security.txt')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')

  const text = await response.text()
  expect(text).toContain(
    'Contact: https://github.com/subsarthur-jancommit/arth/security/advisories/new'
  )
  expect(text).toMatch(/^Canonical: \S+\/\.well-known\/security\.txt$/m)

  const expires = Date.parse(text.match(/^Expires: (\S+)$/m)?.[1] ?? '')
  expect(expires, 'Expires is missing or not a date').toBeGreaterThan(
    Date.now()
  )
})
