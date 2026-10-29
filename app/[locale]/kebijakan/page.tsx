import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import type { PortableTextBlock } from 'next-sanity'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { fixedPageContent } from '@/lib/content/fixed-page-content'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { RichText } from '@/lib/integrations/sanity/components/rich-text'
import { generatePageMetadata } from '@/lib/utils/metadata'

import s from './page.module.css'

const POLICY_SLUG = 'kebijakan'

async function policyForRequest(locale: Locale, stega = true) {
  const { isEnabled: isDraftMode } = await draftMode()
  const content = await fixedPageContent(
    locale,
    POLICY_SLUG,
    isDraftMode,
    isDraftMode && stega
  )

  return { content, isDraftMode }
}

export default async function PolicyPage() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const [{ content, isDraftMode }, t] = await Promise.all([
    policyForRequest(locale),
    getTranslations('policyPage'),
  ])
  /*
   * The page is public since V5 left `lib/seo/awaiting-content.ts`, so an
   * unpublished or withheld document shows the not-found view, as
   * `/metode-kerja` does, rather than an empty state written for the editor.
   */
  if (!content) return <LocalizedNotFound />

  // SAFETY: fixedPageContent validates that this is a non-empty Portable Text
  // array. TypeGen and @portabletext/react derive equivalent shapes through
  // different packages, so TypeScript cannot name their structural equality.
  const body = content.content as PortableTextBlock[]

  return (
    <Wrapper theme="light">
      <article className={s.page}>
        <header className={s.hero}>
          <p className={cn('caption', s.eyebrow)}>{t('eyebrow')}</p>
          <h1 className={cn('h1', s.title)} data-sanity="title">
            {content.title}
          </h1>
          <p className={cn('p-big', s.lead)}>{t('lead')}</p>
        </header>

        {isDraftMode && (
          <p className={cn('caption', s.previewFlag)} role="status">
            {t('draftPreview')}
          </p>
        )}

        <aside className={s.reviewNote} aria-labelledby="legal-review-title">
          <p className={cn('caption', s.noteLabel)}>{t('reviewEyebrow')}</p>
          <h2 id="legal-review-title" className={cn('h3', s.noteTitle)}>
            {t('reviewTitle')}
          </h2>
          <p className={cn('p', s.noteBody)}>{t('reviewBody')}</p>
        </aside>

        <section
          className={s.document}
          aria-label={t('documentLabel')}
          data-sanity={content._id}
        >
          <RichText content={body} />
        </section>
      </article>
    </Wrapper>
  )
}

export async function generateMetadata() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const [{ content }, t] = await Promise.all([
    // Match the active draft/published perspective, but never put Stega source
    // maps in title, description, canonical, or social metadata.
    policyForRequest(locale, false),
    getTranslations('policyPage'),
  ])

  return generatePageMetadata({
    title: content?.metadata.title ?? content?.title ?? t('metaTitle'),
    description:
      content?.metadata.description ?? content?.excerpt ?? t('metaDescription'),
    ...(content?.metadata.keywords && {
      keywords: content.metadata.keywords,
    }),
    // F3-10 is a legal-review gate, not merely an editor checkbox. This stays
    // noindex even when a Sanity page is approved; releasing it requires the
    // later, explicit post-review change. The cost is no organic discovery of
    // the policy page during review.
    noIndex: true,
    url: `/${locale}/kebijakan`,
  })
}
