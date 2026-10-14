'use client'

import cn from 'clsx'

import { useReveal } from '@/lib/hooks/use-reveal'
import { Fixings } from '@/vault/motion/fixings'

import s from './offer-boundaries.module.css'

interface OfferBoundariesProps {
  label: string
  children: string
  className?: string | undefined
}

/** The sixth offer block, fixed at all four corners once it enters view. */
export function OfferBoundaries({
  label,
  children,
  className,
}: OfferBoundariesProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      className={cn(s.section, className)}
      data-epic="offer-fixings"
    >
      <Fixings className={s.plate}>
        <h2 className={cn('caption', s.label)}>{label}</h2>
        <p className={cn('p-big', s.copy)}>{children}</p>
      </Fixings>
    </section>
  )
}
