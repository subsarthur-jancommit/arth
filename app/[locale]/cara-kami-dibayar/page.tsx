import cn from 'clsx'
import type { PortableTextBlock } from 'next-sanity'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { Link } from '@/components/ui/link'
import { fixedPageContent } from '@/lib/content/fixed-page-content'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { RichText } from '@/lib/integrations/sanity/components/rich-text'
import { generatePageMetadata } from '@/lib/utils/metadata'

import s from './page.module.css'

const PAYMENT_SLUG = 'cara-kami-dibayar'

async function paymentForRequest(locale: Locale, stega = true) {
  const { isEnabled: isDraftMode } = await draftMode()
  const content = await fixedPageContent(
    locale,
    PAYMENT_SLUG,
    isDraftMode,
    isDraftMode && stega
  )

  return { content, isDraftMode }
}

/**
 * The reading template for one fixed `page` document, like `/kebijakan`
 * without its legal-review note. Every sentence is the Sanity document's
 * (V6); the code holds only the eyebrow and the contact action, the same
 * header action the home and `/satu-klien-tiga-unit` use.
 */
export default async function PaymentPage() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const { content, isDraftMode } = await paymentForRequest(locale)

  if (!content) return <LocalizedNotFound />

  // SAFETY: fixedPageContent validates that this is a non-empty Portable Text
  // array; see `/kebijakan` for why TypeScript cannot name the equality.
  const body = content.content as PortableTextBlock[]

  return (
    <Wrapper theme="light">
      <article className={s.page}>
        <header className={s.hero}>
          <p className={cn('caption', s.eyebrow)}>Arthur</p>
          <h1 className={cn('h1', s.title)} data-sanity="title">
            {content.title}
          </h1>
        </header>

        {isDraftMode && (
          <p className={cn('caption', s.previewFlag)} role="status">
            Pratinjau draf
          </p>
        )}

        <section className={s.document} data-sanity={content._id}>
          <RichText content={body} />
        </section>

        <p className={s.action}>
          <Link
            href={`/kontak?dari=${PAYMENT_SLUG}`}
            className={cn('caption', s.actionLink)}
            data-press="chip"
          >
            Ceritakan masalahnya
          </Link>
        </p>
      </article>
    </Wrapper>
  )
}

export async function generateMetadata() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  // Never put Stega source maps in the head.
  const { content } = await paymentForRequest(locale, false)

  return generatePageMetadata({
    title: content?.metadata.title ?? content?.title ?? 'Cara kami dibayar',
    ...(content?.metadata.description && {
      description: content.metadata.description,
    }),
    noIndex: !content || content.metadata.noIndex,
    url: `/${locale}/${PAYMENT_SLUG}`,
  })
}
