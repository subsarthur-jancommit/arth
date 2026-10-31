import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { howWeWorkContent } from '@/lib/content/how-we-work-content'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { howWeWorkDescription } from '@/lib/seo/page-descriptions'
import { generatePageMetadata } from '@/lib/utils/metadata'
import { DocHead } from '@/vault/blocks/doc-head'
import { PromiseStamp, type WrittenPromise } from '@/vault/blocks/promise-stamp'
import { Dimension } from '@/vault/motion/dimension'
import { Plumb } from '@/vault/motion/plumb'
import { Reveal } from '@/vault/motion/reveal'

import s from './page.module.css'

async function howWeWorkForRequest(locale: Locale, stega = true) {
  const { isEnabled: isDraftMode } = await draftMode()
  const data = await howWeWorkContent(locale, isDraftMode, isDraftMode && stega)

  return { data, isDraftMode }
}

export default async function HowWeWorkPage() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const [{ data }, t] = await Promise.all([
    howWeWorkForRequest(locale),
    getTranslations('methodPage'),
  ])

  if (!data) return <LocalizedNotFound />

  const promises: WrittenPromise[] =
    data.janji?.flatMap((promise) =>
      promise.judul && promise.kalimat
        ? [
            {
              id: promise._key,
              title: promise.judul,
              body: promise.kalimat,
            },
          ]
        : []
    ) ?? []
  const terms = [
    { id: 'hak-milik', title: t('ownership'), body: data.hakMilikKlien },
    {
      id: 'pengungkapan-komisi',
      title: t('commission'),
      body: data.pengungkapanKomisi,
    },
    {
      id: 'yang-tidak-dijual',
      title: t('notSold'),
      body: data.yangTidakDijual,
    },
  ].flatMap((term) => (term.body ? [{ ...term, body: term.body }] : []))
  const regions =
    data.wilayah?.flatMap((region) =>
      region.nama ? [{ id: region._key, name: region.nama }] : []
    ) ?? []
  const regionMarks =
    regions.length > 2
      ? regions
          .slice(1, -1)
          .map((_, index) => (index + 1) / (regions.length - 1))
      : []

  return (
    <Wrapper theme="light">
      <article className={s.page}>
        {/*
         * A document head (R5, direction A). It replaced a hero held at 72svh
         * whose height sat empty above a two-word title.
         */}
        <DocHead eyebrow={t('eyebrow')} title={t('title')}>
          {data.pembuka ? (
            <p className={cn('p-big', s.lead)}>{data.pembuka}</p>
          ) : null}
        </DocHead>

        {promises.length > 0 && (
          <PromiseStamp
            eyebrow={t('promisesEyebrow')}
            title={t('promisesTitle')}
            stampLabel={t('stamp')}
            promises={promises}
          />
        )}

        {terms.length > 0 && (
          <Reveal as="section" id="batas-kerja" className={s.terms} perItem>
            <header data-reveal-item className={s.sectionHeader}>
              <p className={cn('caption', s.eyebrow)}>{t('termsEyebrow')}</p>
              <h2 id="batas-kerja-title" className={cn('h2', s.sectionTitle)}>
                {t('termsTitle')}
              </h2>
            </header>
            <Plumb className={s.plumb}>
              <dl aria-labelledby="batas-kerja-title" className={s.termList}>
                {terms.map((term) => (
                  <div key={term.id} data-reveal-item className={s.term}>
                    <dt className={cn('h3', s.termTitle)}>{term.title}</dt>
                    <dd className={cn('p', s.termBody)}>{term.body}</dd>
                  </div>
                ))}
              </dl>
            </Plumb>
          </Reveal>
        )}

        {regions.length > 0 && (
          <Reveal as="section" className={s.regions}>
            <header data-reveal-item className={s.sectionHeader}>
              <p className={cn('caption', s.eyebrow)}>{t('regionsEyebrow')}</p>
              <h2 id="wilayah-kerja-title" className={cn('h2', s.sectionTitle)}>
                {t('regionsTitle')}
              </h2>
            </header>

            {regions.length > 1 ? (
              <Dimension
                from={regions[0]?.name ?? ''}
                to={regions.at(-1)?.name ?? ''}
                marks={regionMarks}
                className={s.regionMeasure}
              >
                {t('regionCount', { count: regions.length })}
              </Dimension>
            ) : (
              <p data-reveal-item className={cn('caption', s.regionMeasure)}>
                {t('regionCount', { count: 1 })}
              </p>
            )}

            <ul aria-labelledby="wilayah-kerja-title" className={s.regionList}>
              {regions.map((region) => (
                <li key={region.id} data-reveal-item className="p-big">
                  {region.name}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {data.contohFormat && (
          <Reveal as="section" className={s.format}>
            <p data-reveal-item className={cn('caption', s.eyebrow)}>
              {t('formatEyebrow')}
            </p>
            <p data-reveal-item className={cn('p-big', s.formatCopy)}>
              {data.contohFormat}
            </p>
          </Reveal>
        )}
      </article>
    </Wrapper>
  )
}

export async function generateMetadata() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale

  const { data, isDraftMode } = await howWeWorkForRequest(locale, false)
  if (!data) return { robots: { index: false } }

  const keywords = data.metadata?.keywords
  // The rule `/llms.txt`, the search index and the Markdown mirror apply too
  // (`lib/seo/route-descriptions.ts`), so they cannot disagree with it.
  const description = howWeWorkDescription(data)

  return generatePageMetadata({
    title: data.metadata?.title ?? 'Metode kerja',
    ...(description && { description }),
    ...(keywords && { keywords }),
    noIndex: isDraftMode || data.metadata?.noIndex === true,
    url: `/${locale}/metode`,
  })
}
