import type { Locale } from '@/lib/i18n/routing'
import { type RouteDescriptions, STATIC_ROUTES } from '@/lib/seo/route-catalog'
import type { ContentRoute } from '@/lib/seo/routes'
import { SITE, siteFacts } from '@/lib/seo/site'

export function absoluteSiteUrl(path: string): string {
  return new URL(path, `${SITE.url}/`).toString()
}

/**
 * Every static route, as a Markdown list.
 *
 * `locale` filters rather than translates: `STATIC_ROUTES` already holds one
 * entry per language with its prose resolved, so passing a locale lists that
 * language's pages and omitting it lists both. `/llms.txt` wants both — it is
 * one unlocalized document describing a bilingual site — while a Markdown
 * representation of `/id/work` should not be half English.
 *
 * `descriptions` is required, not defaulted: a caller that forgot it would
 * print the catalog's fallback for a page whose head says something else,
 * which is the drift `lib/seo/page-descriptions.ts` exists to close.
 */
export function buildStaticRoutesMarkdown(
  descriptions: RouteDescriptions,
  locale?: Locale
): string {
  return STATIC_ROUTES.filter(
    (route) => locale === undefined || route.locale === locale
  )
    .map(
      (route) =>
        `- [${route.label}](${absoluteSiteUrl(route.path)}): ${descriptions.get(route.path) ?? route.description}`
    )
    .join('\n')
}

export function buildCmsRoutesMarkdown(
  cmsRoutes: readonly ContentRoute[]
): string {
  if (cmsRoutes.length === 0) return ''

  const links = cmsRoutes
    .map((route) => `- [${route.label}](${absoluteSiteUrl(route.path)})`)
    .join('\n')

  return `\n\n## Published content\n\n${links}`
}

export function buildAgentGuidanceMarkdown(locale?: Locale): string {
  const guidance = siteFacts(locale).agentGuidance
  if (!guidance) return ''

  const sections: string[] = []

  if (guidance.whenToUse.length > 0) {
    sections.push(
      `## When to use\n\n${guidance.whenToUse
        .map((useCase) => `- **${useCase.name}:** ${useCase.description}`)
        .join('\n')}`
    )
  }

  if (guidance.howToUse.length > 0) {
    sections.push(
      `## How to use\n\n${guidance.howToUse
        .map((instruction, index) => `${index + 1}. ${instruction}`)
        .join('\n')}`
    )
  }

  return sections.length > 0 ? `\n\n${sections.join('\n\n')}` : ''
}

export function buildDeveloperResourcesMarkdown(): string {
  const resources = SITE.developerResources
  if (!resources || resources.length === 0) return ''

  const links = resources
    .map(
      (resource) =>
        `- [${resource.name}](${resource.url}): ${resource.description}`
    )
    .join('\n')

  return `\n\n## Developer resources\n\n${links}`
}
