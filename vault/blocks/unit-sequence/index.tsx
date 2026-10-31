/**
 * UnitSequence — three Arthur units joined into one possible working order.
 *
 * The ordered list carries the full meaning without motion. Each step arrives
 * independently; `Splice` joins one unit to the next only after the earlier
 * step is readable, then `Level` settles beneath the complete three-part run.
 * With JavaScript absent or reduced motion enabled, every joint and the level
 * line are already in their final state.
 */

import cn from 'clsx'
import type { ReactNode } from 'react'

import { Link } from '@/components/ui/link'
import { Level } from '@/vault/motion/level'
import { Reveal } from '@/vault/motion/reveal'
import { Splice } from '@/vault/motion/splice'

import s from './unit-sequence.module.css'

export interface SequenceOffer {
  id: string
  title: string
}

export interface SequenceStep {
  id: string
  unit: string
  unitKey: 'konstruksi' | 'teknologi' | 'peekabo'
  body: string
  offers: readonly SequenceOffer[]
  /**
   * The unit's working drawing for this step, when it draws this very
   * work (R5, after the approved "Satu klien, tiga unit" screen). The
   * page decides; a step with no drawing of its own shows none.
   */
  media?: ReactNode
}

interface UnitSequenceProps {
  id: string
  situation: string
  steps: readonly SequenceStep[]
  note: string
  labels: {
    situation: string
    offer: string
    possible: string
    action: string
  }
  className?: string | undefined
}

export function UnitSequence({
  id,
  situation,
  steps,
  note,
  labels,
  className,
}: UnitSequenceProps) {
  const headingId = `${id}-title`

  return (
    <Reveal
      as="section"
      id={id}
      data-epic="three-unit-splice"
      className={cn(s.sequence, className)}
      perItem
    >
      <header data-reveal-item className={s.header}>
        <p className={cn('caption', s.eyebrow)}>{labels.situation}</p>
        <h2 id={headingId} className={cn('h2', s.situation)}>
          {situation}
        </h2>
      </header>

      <ol aria-labelledby={headingId} className={s.steps}>
        {steps.map((step, index) => (
          <li
            key={step.id}
            data-reveal-item
            data-unit={step.unitKey}
            className={s.step}
          >
            {step.media ? <div className={s.media}>{step.media}</div> : null}
            <div className={s.stepHead}>
              <span aria-hidden="true" className={cn('caption', s.number)}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={cn('h3', s.unit)}>{step.unit}</h3>
            </div>
            <p className={cn('p-big', s.body)}>{step.body}</p>
            <div className={s.offerGroup}>
              <p className={cn('caption', s.offerLabel)}>{labels.offer}</p>
              <ul className={s.offers}>
                {step.offers.map((offer) => (
                  <li key={offer.id} className={cn('p', s.offer)}>
                    {offer.title}
                  </li>
                ))}
              </ul>
            </div>
            {index < steps.length - 1 && <Splice className={s.splice} />}
          </li>
        ))}
      </ol>

      <div data-reveal-item className={s.completion}>
        <Level className={s.level} />
        <div className={s.noteBlock}>
          <p className={cn('caption', s.eyebrow)}>{labels.possible}</p>
          <p className={cn('p-big', s.note)}>{note}</p>
          <Link
            href="/#contact"
            className={cn('caption', s.action)}
            data-press="detail"
            data-intent=""
          >
            {labels.action}
          </Link>
        </div>
      </div>
    </Reveal>
  )
}
