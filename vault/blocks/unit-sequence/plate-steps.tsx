/**
 * A sequence's steps as `UnitSequence` takes them, each headed by its unit's
 * working drawing when the step's work is the job that drawing shows.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * Shared by `/layanan` and the home page, so the rule that a drawing never
 * stands for work it does not show is written once. A unit's plate draws one
 * job — the café's plan and section, its order flow, its opening campaign
 * (`messages` `plates.*.job`) — and heads a step only when that step's work
 * is that job.
 */

import type { SequenceContent } from '@/lib/content/sequence-content'
import type { Unit } from '@/lib/content/units'
import type { Locale } from '@/lib/i18n/routing'
import { PLATE_NOTE } from '@/lib/plates'
import { Plate } from '@/vault/blocks/plate'

import type { SequenceStep } from './index'

/** What a unit's plate says: the job it draws, its name, what it shows. */
export interface PlateCopy {
  job: string
  title: string
  description: string
}

export function plateSteps(
  sequence: SequenceContent,
  plateCopy: (unit: Unit) => PlateCopy,
  options: {
    /** The words inside the drawings are the reader's (R7, block L4). */
    locale: Locale
    /**
     * The same drawings, with the same alt text, already sit higher on the
     * page (the home page's passage). The plates still head their steps for
     * a sighted reader, and are hidden from assistive technology, so a screen
     * reader is not read three long descriptions a second time.
     */
    repeated?: boolean
  }
): SequenceStep[] {
  return sequence.langkah.map((step) => {
    const unit = step.unit.kunci
    const copy = plateCopy(unit)
    const drawsThisWork = step.offer.some((offer) => offer.judul === copy.job)
    /*
     * With its legend and the note that the café is an example (G2), unless
     * the plate is repeated: then the passage above already carries both,
     * once.
     */
    const plate = (
      <Plate
        unit={unit}
        locale={options.locale}
        title={copy.title}
        description={copy.description}
        legend={!options.repeated}
        note={options.repeated ? undefined : PLATE_NOTE[options.locale]}
      />
    )

    return {
      id: step._key,
      unit: step.unit.nama,
      unitKey: unit,
      body: step.kalimat,
      offers: step.offer.map((offer) => ({
        id: offer._key,
        title: offer.judul,
      })),
      ...(drawsThisWork && {
        media: options.repeated ? <div aria-hidden="true">{plate}</div> : plate,
      }),
    }
  })
}
