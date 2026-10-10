import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locale as localeRootParam } from 'next/root-params'

import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { SampleContent } from '@/components/ui/sample-content'
import { SectionHeader } from '@/components/ui/section-header'
import { ownerPlaceholder } from '@/lib/content/sample-content'
import { isUnit, UNITS, unitTemplate } from '@/lib/content/units'
import { localizedPath } from '@/lib/i18n/paths'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { generatePageMetadata } from '@/lib/utils/metadata'

import s from './page.module.css'

/**
 * `/[locale]/{unit}` — one page per Arthur unit.
 *
 * ## Why the segment is dynamic and bare
 *
 * A unit is a **top-level** segment: `/konstruksi`, not `/unit/konstruksi`.
 * That is the shape the plan asks for, and it costs something real, recorded
 * here because the cost is easy to forget and hard to debug. A single dynamic
 * segment beats a catch-all in Next's resolution order, so this route matches
 * *every* one-segment path under a locale — which is why the Sanity `page`
 * documents that used to answer at `/about` moved to `/halaman/about`
 * (`app/[locale]/halaman/[slug]/page.tsx` tells that half of the story) and
 * why `lib/content/units.ts` keeps `RESERVED_SLUGS`.
 *
 * ## Why a non-unit value is 404ed twice
 *
 * `notFound()` below is the correct answer and the wrong **status**: under
 * Cache Components a prerendered not-found responds 200, which
 * `e2e/not-found.e2e.ts` documents. A one-segment URL is the depth a crawler
 * is handed in a sitemap, so a 200 there is a lie it acts on. `proxy.ts`
 * answers an unknown single segment with a real 404 before this file is ever
 * reached — `lib/seo/route-status.ts`. This `notFound()` stays as the
 * second line of that defence: it is what answers if the proxy's matcher ever
 * stops covering a path, and it keeps the route honest when read on its own.
 *
 * ## What is on the page, and what is deliberately not
 *
 * The unit's name, and a labelled sample block holding one owner placeholder.
 * Nothing else — and in particular no description of what the unit does.
 * Arthur's units have ready-to-publish headers in the Master Brief, which the
 * content rules require be used **without changing a word**; they are read
 * when the unit content type exists to hold them (F2-02) and the template is
 * built to show them (F3-02). Writing a stand-in sentence here would mean
 * inventing a claim about a business, which is the one thing the rules refuse
 * outright. A placeholder says the same thing honestly.
 *
 * The two sides of each unit are not linked yet either: their pages are F1-04,
 * and a link to a page that does not answer is worse than no link.
 *
 * The other two units **are** linked, and that is not content — it is the
 * only way off this page that is not the browser's back button. A scaffold
 * that is a dead end is a scaffold nobody can walk through, which is also
 * what `e2e/journey.e2e.ts` measures: a reader moving between two pages of
 * the same kind is where a leaked view-transition name does the most damage,
 * and without a sibling link there is no such hop to measure.
 */
interface UnitPageProps {
  params: Promise<{ unit: string }>
}

/**
 * The three units, prerendered.
 *
 * Read from `UNITS` rather than written out, which is the whole reason that
 * module exists: a unit added there gets a page, a sitemap entry, a schema
 * option and a filter chip in one edit. `lib/content/units.test.ts` holds the
 * other end — a unit with no label in either language fails there.
 */
export function generateStaticParams() {
  return UNITS.map((unit) => ({ unit }))
}

export default async function UnitPage({ params }: UnitPageProps) {
  const { unit } = await params

  if (!isUnit(unit)) notFound()

  const [t, tSample] = await Promise.all([
    getTranslations('unit'),
    getTranslations('sample'),
  ])

  return (
    <Wrapper theme="light">
      <article className={s.page}>
        <SectionHeader as="h1" eyebrow={t('eyebrow')} title={t(unit)} />
        <SampleContent
          label={tSample('label')}
          note={tSample('unitNote')}
          className={s.sample}
        >
          <p className="p-big">
            {ownerPlaceholder(t('statementNeed'), t('statementExample'))}
          </p>
        </SampleContent>

        <nav aria-label={t('othersLabel')} className={s.others}>
          {UNITS.filter((other) => other !== unit).map((other) => (
            <Link
              key={other}
              href={unitTemplate(other)}
              className={cn('caption', s.other)}
              data-press="chip"
              data-intent=""
            >
              {t(other)}
            </Link>
          ))}
        </nav>
      </article>
    </Wrapper>
  )
}

export async function generateMetadata({ params }: UnitPageProps) {
  const { unit } = await params
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const t = await getTranslations('unit')

  if (!isUnit(unit)) {
    // Matches the `notFound()` above: without it the 404 would inherit the
    // layout's title and announce itself as a page under whatever was typed.
    const tNotFound = await getTranslations('notFound')
    return generatePageMetadata({
      title: tNotFound('title'),
      noIndex: true,
      url: localizedPath(locale, '/'),
    })
  }

  return generatePageMetadata({
    title: t(unit),
    description: t('metaDescription'),
    // Localized, not the bare template: canonical, og:url and og:locale all
    // come from this one string. See `lib/utils/metadata.ts`.
    url: localizedPath(locale, unitTemplate(unit)),
  })
}
