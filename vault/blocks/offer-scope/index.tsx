'use client'

import cn from 'clsx'

import { useReveal } from '@/lib/hooks/use-reveal'
import { Dimension } from '@/vault/motion/dimension'

import s from './offer-scope.module.css'

export interface OfferScopeItem {
  id: string
  text: string
}

interface OfferScopeProps {
  workLabel: string
  measureLabel: string
  measureFrom: string
  measureTo: string
  steps: readonly OfferScopeItem[]
  deliverablesLabel: string
  deliverables: readonly OfferScopeItem[]
  className?: string | undefined
}

/**
 * The fourth and fifth offer blocks: work in order, then concrete handover.
 *
 * A plain ordered list keeps the sequence useful without JavaScript. The
 * reveal only introduces each line; it never pins the reader or changes the
 * order. Dimension names the fixed span between the incoming problem and the
 * outgoing handover, which is the meaning assigned to it by Arthur's motion
 * grammar.
 */
export function OfferScope({
  workLabel,
  measureLabel,
  measureFrom,
  measureTo,
  steps,
  deliverablesLabel,
  deliverables,
  className,
}: OfferScopeProps) {
  const workRef = useReveal<HTMLElement>({ perItem: true })
  const deliverablesRef = useReveal<HTMLElement>({ perItem: true })

  return (
    <div className={cn(s.scope, className)}>
      <section ref={workRef} className={s.work}>
        <div data-reveal-item="" className={s.measure}>
          <h2 className="caption">{workLabel}</h2>
          <Dimension
            from={measureFrom}
            to={measureTo}
            marks={steps.slice(1).map((_, index) => (index + 1) / steps.length)}
            className="caption"
          >
            {measureLabel}
          </Dimension>
        </div>

        <ol className={s.steps}>
          {steps.map((step, index) => (
            <li key={step.id} data-reveal-item="" className={s.step}>
              <span className={cn('caption', s.number)} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="p-big">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section ref={deliverablesRef} className={s.deliverables}>
        <h2 data-reveal-item="" className="caption">
          {deliverablesLabel}
        </h2>
        <ul>
          {deliverables.map((item) => (
            <li key={item.id} data-reveal-item="" className="p-big">
              {item.text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
