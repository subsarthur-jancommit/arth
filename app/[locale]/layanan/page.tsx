import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { sequenceContent } from '@/lib/content/sequence-content'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { threeUnitsDescription } from '@/lib/seo/page-descriptions'
import { generatePageMetadata } from '@/lib/utils/metadata'
import { UnitSequence } from '@/vault/blocks/unit-sequence'
import { plateSteps } from '@/vault/blocks/unit-sequence/plate-steps'

import s from './page.module.css'

async function sequencesForRequest(locale: Locale) {
  const { isEnabled: isDraftMode } = await draftMode()
  const sequences = await sequenceContent(locale, isDraftMode)

  return { sequences, isDraftMode }
}

export default async function ThreeUnitsPage() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const [{ sequences }, t, tPlate] = await Promise.all([
    sequencesForRequest(locale),
    getTranslations('servicesPage'),
    getTranslations('plates'),
  ])

  if (sequences.length === 0) return <LocalizedNotFound />

  // Dark: the three units presented in order, the way a pitch shows them, so
  // it is a stage page (R4, page map in `docs/DESIGN-SYSTEM.md` §1).
  return (
    <Wrapper theme="dark">
      <article className={s.page}>
        <header className={s.hero}>
          <p className={cn('caption', s.eyebrow)}>{t('eyebrow')}</p>
          <h1 className={cn('h1', s.title)}>{t('title')}</h1>
          <p className={cn('p-big', s.lead)}>{t('lead')}</p>
        </header>

        {sequences.map((sequence) => {
          // Each step headed by its unit's drawing when it draws this work
          // (`vault/blocks/unit-sequence/plate-steps.tsx` holds the rule).
          const steps = plateSteps(sequence, (unit) => ({
            job: tPlate(`${unit}.job`),
            title: tPlate(`${unit}.title`),
            description: tPlate(`${unit}.description`),
          }))

          return (
            <UnitSequence
              key={sequence._id}
              id={`rangkaian-${sequence._id}`}
              situation={sequence.situasi}
              steps={steps}
              note={sequence.keterangan}
              labels={{
                situation: t('situation'),
                offer: t('offer'),
                possible: t('possible'),
                action: t('action'),
              }}
            />
          )
        })}
      </article>
    </Wrapper>
  )
}

export async function generateMetadata() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const { sequences, isDraftMode } = await sequencesForRequest(locale)
  const first = sequences[0]

  if (!first) return { robots: { index: false } }

  // The rule `/llms.txt`, the search index and the Markdown mirror apply too
  // (`lib/seo/route-descriptions.ts`), so they cannot disagree with it.
  const description = threeUnitsDescription(first)

  return generatePageMetadata({
    title: first.metadata?.title ?? 'Layanan',
    ...(description && { description }),
    ...(first.metadata?.keywords && { keywords: first.metadata.keywords }),
    noIndex: isDraftMode || first.metadata?.noIndex === true,
    url: `/${locale}/layanan`,
  })
}
