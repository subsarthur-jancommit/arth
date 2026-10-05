import { buildSecurityTxt } from '@/lib/seo/security-txt'
import { BASE_URL } from '@/lib/seo/site'

/**
 * `/.well-known/security.txt` — where to report a vulnerability, in the format
 * tools read (RFC 9116). The fields and why they say what they say are in
 * `lib/seo/security-txt.ts`.
 *
 * The proxy leaves it alone for the reason `/llms.txt` gives: its last segment
 * has a dot, so it is never negotiated as a page or sent to a locale.
 *
 * `'use cache'` on the builder, not the handler, as in
 * `app/llms.txt/route.ts`: a cached boundary serializes its return value, and
 * a `Response` is not a plain object. The clock is read once per build, which
 * is what makes `Expires` renew with every deploy.
 */
async function buildBody(): Promise<string> {
  'use cache'
  return buildSecurityTxt({
    canonical: `${BASE_URL}/.well-known/security.txt`,
    now: new Date(),
  })
}

export async function GET() {
  return new Response(await buildBody(), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
