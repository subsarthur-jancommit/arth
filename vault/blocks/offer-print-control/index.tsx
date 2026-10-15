'use client'

import cn from 'clsx'

import s from './offer-print-control.module.css'

interface OfferPrintControlProps {
  label: string
  className?: string | undefined
}

/** Opens the browser's native print sheet; the offer CSS owns paper layout. */
export function OfferPrintControl({
  label,
  className,
}: OfferPrintControlProps) {
  return (
    <button
      type="button"
      className={cn('caption', s.button, className)}
      onClick={() => window.print()}
    >
      {label}
    </button>
  )
}
