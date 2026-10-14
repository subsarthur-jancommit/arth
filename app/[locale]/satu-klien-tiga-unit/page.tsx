import cn from 'clsx'
import { draftMode } from 'next/headers'
import { locale as localeRootParam } from 'next/root-params'

import { LocalizedNotFound } from '@/app/[locale]/not-found'
import { Wrapper } from '@/components/layout/wrapper'
import { sequenceContent } from '@/lib/content/sequence-content'
import { isLocale, type Locale, routing } from '@/lib/i18n/routing'
import { generatePageMetadata } from '@/lib/utils/metadata'
import { type SequenceStep, UnitSequence } from '@/vault/blocks/unit-sequence'

import s from './page.module.css'

async function sequencesForRequest(locale: Locale) {
  const { isEnabled: isDraftMode } = await draftMode()
  const sequences = await sequenceContent(locale, isDraftMode)

  return { sequences, isDraftMode }
}

export default async function ThreeUnitsPage() {
  const requested = await localeRootParam()
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale
  const { sequences } = await sequencesForRequest(locale)

  if (sequences.length === 0) return <LocalizedNotFound />

  return (
    <Wrapper theme="light">
      <article className={s.page}>
        <header className={s.hero}>
          <p className={cn('caption', s.eyebrow)}>Satu klien, tiga unit</p>
          <h1 className={cn('h1', s.title)}>Tiga unit. Satu urutan kerja.</h1>
          <p className={cn('p-big', s.lead)}>
            Mulai dari situasi Anda. Baca pekerjaan setiap unit dalam urutan
            yang ditetapkan—sebagai kemungkinan, bukan riwayat proyek.
          </p>
        </header>

        {sequences.map((sequence) => {
          const steps: SequenceStep[] = sequence.langkah.map((step) => ({
            id: step._key,
            unit: step.unit.nama,
            unitKey: step.unit.kunci,
            body: step.kalimat,
            offers: step.offer.map((offer) => ({
              id: offer._key,
              title: offer.judul,
            })),
          }))

          return (
            <UnitSequence
              key={sequence._id}
              id={`rangkaian-${sequence._id}`}
              situation={sequence.situasi}
              steps={steps}
              note={sequence.keterangan}
              labels={{
                situation: 'Situasi',
                offer: 'Offer dalam langkah ini',
                possible: 'Rangkaian yang mungkin',
                action: 'Ceritakan masalahnya',
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

  return generatePageMetadata({
    title: first.metadata?.title ?? 'Satu klien, tiga unit',
    description:
      first.metadata?.description ??
      'Rangkaian kerja yang mungkin lintas Konstruksi, Teknologi, dan Peekabo.',
    ...(first.metadata?.keywords && { keywords: first.metadata.keywords }),
    noIndex: isDraftMode || first.metadata?.noIndex === true,
    url: `/${locale}/satu-klien-tiga-unit`,
  })
}
