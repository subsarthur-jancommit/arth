# Security Policy

This repository is the source of **Arth**, a studio website built on Next.js 16
with its content in Sanity. It is a site, not a template or a library, so there
are no versions to support: the code on `main` is the code that is deployed.

## Reporting a vulnerability

**Please do not open a public issue for a security vulnerability.** Report it
privately through this repository's Security tab: choose
[Report a vulnerability](https://github.com/subsarthur-jancommit/arth/security/advisories/new).

Include the affected file or route, the impact, and the steps to reproduce it
(a minimal proof of concept helps).

## Scope

**In scope:** this repository's code — the request proxy (`proxy.ts`) and its
rate limiting, the Sanity revalidation webhook (`app/api/revalidate`), the
integration clients in `lib/integrations/`, and the CI configuration in
`.github/`.

**Out of scope:**

- Vulnerabilities in third-party dependencies. Report those upstream.
- The hosting and content services themselves (Vercel, Sanity), and anything
  that exists only in a deployment's own configuration.

## Safeguards in this repo

- The Content-Security-Policy ships enforced and is composed per integration:
  each integration declares the origins its browser-visible code needs in
  `lib/integrations/registry.ts`, and `lib/integrations/csp.ts` unions them into
  the header that `next.config.ts` sets.
- Routes are rate-limited in `proxy.ts` (`lib/utils/rate-limit.ts`).
- The revalidation webhook verifies Sanity's signature (`next-sanity/webhook`):
  an unset `SANITY_REVALIDATE_SECRET` returns 503 and an invalid signature 401.
- Dependabot keeps the GitHub Actions in `.github/workflows` up to date, weekly.

The site was started from Satūs by darkroom.engineering; that template's licence
notice is kept in [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).
