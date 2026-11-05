import cn from 'clsx'
import { getTranslations } from 'next-intl/server'

import { Link } from '@/components/ui/link'
import { homeSequence } from '@/lib/content/home-sequence'
import type { Locale } from '@/lib/i18n/routing'
import { UnitSequence } from '@/vault/blocks/unit-sequence'
import { plateSteps } from '@/vault/blocks/unit-sequence/plate-steps'

import s from './home-sequence.module.css'

interface HomeSequenceProps {
  locale: Locale
  /** Sanity draft mode, so Presentation previews the sequence it edits. */
  preview: boolean
  className?: string | undefined
}

/**
 * "Satu klien, tiga unit" on the home page: one sequence, in the block and
 * on the stage `/layanan` uses, and the way to the rest of them there.
 *
 * `docs/RENCANA-KONTEKS-V2.md` §5.1 puts it after the reader's situations and
 * before how Arthur works. Which sequence it is, and why, is
 * `lib/content/home-sequence.ts`. Every sentence is the sequence's own, read
 * from Sanity; the labels are `/layanan`'s, so the two pages name the parts
 * of a sequence the same way. With no publishable sequence the block leaves
 * the page rather than stand empty.
 */
export async function HomeSequence({
  locale,
  preview,
  className,
}: HomeSequenceProps) {
  const [sequence, t, tServices, tPlate] = await Promise.all([
    homeSequence(locale, preview),
    getTranslations('home'),
    getTranslations('servicesPage'),
    getTranslations('plates'),
  ])

  if (!sequence) return null

  // The passage higher on this page shows the same three drawings with their
  // alt text, so here they head their steps for the eye alone.
  const steps = plateSteps(
    sequence,
    (unit) => ({
      job: tPlate(`${unit}.job`),
      title: tPlate(`${unit}.title`),
      description: tPlate(`${unit}.description`),
    }),
    { repeated: true }
  )

  return (
    <div className={className}>
      <UnitSequence
        id="rangkaian"
        situation={sequence.situasi}
        steps={steps}
        note={sequence.keterangan}
        labels={{
          situation: tServices('situation'),
          offer: tServices('offer'),
          possible: tServices('possible'),
          action: tServices('action'),
        }}
      />
      <p className={s.more}>
        <Link
          href="/layanan"
          className={cn('caption', s.link)}
          data-press="detail"
          data-intent=""
        >
          {t('sequenceLink')}
        </Link>
      </p>
    </div>
  )
}
