'use client'

import cn from 'clsx'

import { useReveal } from '@/lib/hooks/use-reveal'
import { Leader } from '@/vault/motion/leader'

import s from './offer-audience.module.css'

interface OfferAudienceProps {
  label: string
  children: string
  className?: string | undefined
}

/** The reader note points directly to the person this offer is for. */
export function OfferAudience({
  label,
  children,
  className,
}: OfferAudienceProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section ref={ref} className={cn(s.section, className)}>
      <h2 data-reveal-item="" className={cn('caption', s.label)}>
        {label}
      </h2>
      <div data-reveal-item="" className={s.answer}>
        <Leader className={s.leader} />
        <p className="h3">{children}</p>
      </div>
    </section>
  )
}
