'use client'

import cn from 'clsx'
import { useRef, useState, useSyncExternalStore } from 'react'

import { Link } from '@/components/ui/link'
import { type Side, type Unit } from '@/lib/content/units'
import { useReveal } from '@/lib/hooks/use-reveal'
import { FLIP_ID, useFlipGrid } from '@/vault/motion/flip'
import { Formwork } from '@/vault/motion/formwork'

import s from './chapter-offer-grid.module.css'

type Market = 'pemerintah' | 'swasta' | 'keduanya' | null
type MarketFilter = 'semua' | 'pemerintah' | 'swasta'

export interface ChapterOfferCard {
  id: string
  slug: string
  title: string
  impact: string
  audience: string
  type: string
  market: Market
}

interface ChapterOfferGridProps {
  offers: readonly ChapterOfferCard[]
  unit: Unit
  side: Side
  chapter: string
  label: string
  marketLabel: string
  allLabel: string
  governmentLabel: string
  privateLabel: string
  audienceLabel: string
  typeLabel: string
  marketFilter: boolean
  className?: string | undefined
}

function isInMarket(offer: ChapterOfferCard, filter: MarketFilter) {
  if (filter === 'semua') return true
  return offer.market === filter || offer.market === 'keduanya'
}

function subscribeToHydration() {
  return () => undefined
}

/**
 * Reader-facing offer cards for one chapter.
 *
 * The formwork sits on the card itself while FLIP owns only the positions of
 * list items. This separation matters: filtering must never animate the
 * reading link or change the semantic list that a non-JavaScript reader sees.
 */
export function ChapterOfferGrid({
  offers,
  unit,
  side,
  chapter,
  label,
  marketLabel,
  allLabel,
  governmentLabel,
  privateLabel,
  audienceLabel,
  typeLabel,
  marketFilter,
  className,
}: ChapterOfferGridProps) {
  const [market, setMarket] = useState<MarketFilter>('semua')
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  )
  const gridRef = useRef<HTMLUListElement | null>(null)
  const revealRef = useReveal<HTMLUListElement>({ perItem: true })
  const canFilter =
    marketFilter && offers.some((offer) => offer.market !== null)
  const visibleOffers = offers.filter((offer) => isInMarket(offer, market))

  useFlipGrid(gridRef, market)

  return (
    <section className={cn(s.section, className)} data-epic="bab-sift">
      <div className={s.heading}>
        <p className="caption">{label}</p>
      </div>

      <div
        className={s.filters}
        aria-label={marketLabel}
        hidden={!hasHydrated || !canFilter}
      >
        <button
          type="button"
          aria-pressed={market === 'semua'}
          className={s.filter}
          onClick={() => setMarket('semua')}
        >
          {allLabel}
        </button>
        <button
          type="button"
          aria-pressed={market === 'pemerintah'}
          className={s.filter}
          onClick={() => setMarket('pemerintah')}
        >
          {governmentLabel}
        </button>
        <button
          type="button"
          aria-pressed={market === 'swasta'}
          className={s.filter}
          onClick={() => setMarket('swasta')}
        >
          {privateLabel}
        </button>
      </div>

      <ul
        ref={(node) => {
          gridRef.current = node
          revealRef.current = node
        }}
        className={s.grid}
        data-epic="bab-formwork"
      >
        {visibleOffers.map((offer) => (
          <li key={offer.id} {...{ [FLIP_ID]: offer.id }} className={s.item}>
            <Formwork className={s.formwork}>
              <Link
                href={`/${unit}/${side}/${chapter}/${offer.slug}`}
                className={s.card}
                data-press="offer"
                data-intent=""
              >
                <span className={cn('caption', s.type)}>
                  {typeLabel}: {offer.type}
                </span>
                <span className="h3">{offer.title}</span>
                <span className={cn('p-big', s.impact)}>{offer.impact}</span>
                <span className={cn('p', s.audience)}>
                  {audienceLabel}: {offer.audience}
                </span>
              </Link>
            </Formwork>
          </li>
        ))}
      </ul>
    </section>
  )
}
