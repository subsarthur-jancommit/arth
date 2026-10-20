import cn from 'clsx'
import { getTranslations } from 'next-intl/server'
import type { PortableTextBlock } from 'next-sanity'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { contactContent } from '@/lib/content/contact-content'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { RichText } from '@/lib/integrations/sanity/components/rich-text'
import { generatePageMetadata } from '@/lib/utils/metadata'
import { ContactLedger } from '@/vault/blocks/contact-ledger'
import { StudioNote } from '@/vault/blocks/studio-note'

import s from './page.module.css'

async function contactForRequest(locale: Locale) {
  const { isEnabled: isDraftMode } = await draftMode()
  const content = await contactContent(locale, isDraftMode)
  return { content, isDraftMode }
}

export default async function ContactPage() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const [{ content, isDraftMode }, t] = await Promise.all([
    contactForRequest(locale),
    getTranslations('contactPage'),
  ])
  const statement = content.statement as PortableTextBlock[] | null
  const hasRealChannel =
    content.whatsappHref !== null || content.emailHref !== null

  return (
    <Wrapper theme="light" lenis={{ anchors: true }}>
      <article className={s.page}>
        <header className={s.hero}>
          <p className={cn('caption', s.eyebrow)}>{t('eyebrow')}</p>
          <h1 className={cn('h1', s.title)}>{t('title')}</h1>
          <p className={cn('p-big', s.lead)}>{t('lead')}</p>
          {hasRealChannel && (
            <Link
              href="#contact"
              className={cn('caption', s.heroAction)}
              data-press="cta"
              data-intent=""
            >
              {t('heroAction')}
            </Link>
          )}
        </header>

        {isDraftMode && (
          <p className={cn('caption', s.previewFlag)} role="status">
            {t('draftPreview')}
          </p>
        )}

        {/* The owner's statement, once there is one (P4: no empty states). */}
        {statement && (
          <StudioNote
            id="pernyataan-pemilik"
            className={s.ownerStatement}
            eyebrow={t('ownerEyebrow')}
            title={t('ownerTitle')}
          >
            <RichText content={statement} paragraphClassName="p-big" />
          </StudioNote>
        )}

        <ContactLedger
          className={s.ledger}
          regions={content.regions}
          email={content.email}
          emailHref={content.emailHref}
          whatsappHref={content.whatsappHref}
          responseTime={content.responseTime}
          address={content.address}
          addressIsPlaceholder={content.addressIsPlaceholder}
          socials={content.socials}
          labels={{
            regionsEyebrow: t('regionsEyebrow'),
            regionsTitle: t('regionsTitle'),
            regionsIntro: t('regionsIntro'),
            regionsLabel: t('regionsLabel'),
            contactEyebrow: t('contactEyebrow'),
            contactReadyTitle: t('contactReadyTitle'),
            whatsapp: t('whatsapp'),
            email: t('email'),
            responseTime: t('responseTime'),
            address: t('address'),
            socials: t('socials'),
            copy: t('copy'),
            copied: t('copied'),
            copyFailed: t('copyFailed'),
          }}
        />
      </article>
    </Wrapper>
  )
}

export async function generateMetadata() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const [{ content, isDraftMode }, t] = await Promise.all([
    contactForRequest(locale),
    getTranslations('contactPage'),
  ])

  return generatePageMetadata({
    title: content.metadata.title ?? t('metaTitle'),
    description: content.metadata.description ?? t('metaDescription'),
    ...(content.metadata.keywords && { keywords: content.metadata.keywords }),
    noIndex: isDraftMode || content.noIndex,
    url: `/${locale}/kontak`,
  })
}
