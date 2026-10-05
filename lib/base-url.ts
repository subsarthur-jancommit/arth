/**
 * Where the site lives — the origin every absolute URL is built on.
 *
 * Dependency-free on purpose: `next.config.ts` imports it by relative path,
 * and Next's config loader mis-resolves `@/` aliases in anything it requires
 * transitively (see the note on `./integrations/registry`'s imports).
 *
 * ## The order, and why Vercel's domain is second
 *
 * 1. `NEXT_PUBLIC_BASE_URL`, when someone set it. A custom domain is a
 *    person's decision, so a value they wrote wins.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL`, which every Vercel build and function
 *    carries without anyone setting it: the project's shortest production
 *    domain, or its `*.vercel.app` alias when it has none, without a scheme.
 * 3. `https://localhost:3000`, for local development and CI — unchanged.
 *
 * The site went live on 2026-10-05 with neither (1) set nor (2) read, and every
 * canonical, hreflang alternate, sitemap entry, OG image and JSON-LD `@id`
 * pointed at localhost (`docs/HANDOFF.md` §4.8, L1). A preview deployment gets
 * the production domain too, which is correct rather than a compromise: a
 * preview's canonical is the page it previews, and Vercel already marks
 * previews `noindex`.
 */

/** The origin used when nothing says where the site lives. */
export const LOCAL_BASE_URL = 'https://localhost:3000'

export interface BaseUrlSource {
  /** `NEXT_PUBLIC_BASE_URL`, as configured. */
  explicit?: string | undefined
  /** `VERCEL_PROJECT_PRODUCTION_URL`: a host name, normally without a scheme. */
  vercelProductionHost?: string | undefined
}

export function resolveBaseUrl(source: BaseUrlSource): string {
  if (source.explicit) return source.explicit

  const host = source.vercelProductionHost?.trim()
  if (!host) return LOCAL_BASE_URL

  // Vercel documents the value without a scheme; tolerate one rather than
  // emitting `https://https://…` if that ever changes.
  return /^https?:\/\//.test(host) ? host : `https://${host}`
}
