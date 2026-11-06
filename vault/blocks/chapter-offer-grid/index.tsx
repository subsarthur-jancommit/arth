'use client'

/**
 * Provenance: original work for this project. No third-party code copied.
 */

import cn from 'clsx'
import { useRef, useState, useSyncExternalStore } from 'react'

import { Link } from '@/components/ui/link'
import { useReveal } from '@/lib/hooks/use-reveal'
import { FLIP_ID, SIFT_MOVE, useFlipGrid } from '@/vault/motion/flip'
import { Formwork } from '@/vault/motion/formwork'
import { OfferArrivalLink } from '@/vault/motion/offer-arrival'

import s from './chapter-offer-grid.module.css'

type Market = 'pemerintah' | 'swasta' | 'keduanya' | null
type MarketFilter = 'semua' | 'pemerintah' | 'swasta'

export interface ChapterOfferCard {
  id: string
  title: string
  impact: string
  /** Already reads "Untuk …"; rendered as written. */
  audience: string
  type: string
  market: Market
  /** A † offer's condition, one short line under the impact. */
  condition: string | null
  /** The offer's own page, or `null` when it lives only in this list. */
  href: string | null
  /** The contact page, carrying the situation and the offer it came from. */
  askHref: string
  /** The situation's entry offer, shown first and larger. */
  entry: boolean
}

interface ChapterOfferGridProps {
  offers: readonly ChapterOfferCard[]
  label: string
  marketLabel: string
  allLabel: string
  governmentLabel: string
  privateLabel: string
  entryLabel: string
  askLabel: string
  readLabel: string
  conditionLabel: string
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

/** Group the cards by type, keeping the order in which each type appears. */
function byType(offers: readonly ChapterOfferCard[]) {
  return [...Map.groupBy(offers, (offer) => offer.type)].map(
    ([type, items]) => ({ type, items })
  )
}

function OfferCard({
  offer,
  entryLabel,
  askLabel,
  readLabel,
  conditionLabel,
}: {
  offer: ChapterOfferCard
  entryLabel: string
  askLabel: string
  readLabel: string
  conditionLabel: string
}) {
  return (
    <Formwork className={s.formwork}>
      {/* `data-offer-card`: what a press on its offer link lifts
          (`offer-arrival`, `vault/motion/offer-arrival`). A card with its own
          offer page carries the moment's name too, for the interaction-
          grammar report (`docs/MOTION-SPEC.md` §13.11). */}
      <div
        className={cn(s.card, offer.entry && s.entry)}
        data-offer-card=""
        {...(offer.href && { 'data-epic': 'offer-arrival' })}
      >
        {offer.entry ? (
          <span className={cn('caption', s.entryLabel)}>{entryLabel}</span>
        ) : null}
        <span className={offer.entry ? 'h3' : cn('p-big', s.title)}>
          {offer.title}
        </span>
        <span className={cn('p', s.impact)}>{offer.impact}</span>
        {offer.condition ? (
          <span className={cn('p', s.condition)}>
            {conditionLabel}: {offer.condition}
          </span>
        ) : null}
        <span className={cn('caption', s.audience)}>{offer.audience}</span>
        <span className={s.actions}>
          {/* Chapter to offer is `offer-arrival` (§13.11): one transition,
              so the link carries it and `set-depth` stands aside. */}
          {offer.href ? (
            <OfferArrivalLink
              href={offer.href}
              className={cn('caption', s.read)}
            >
              {readLabel}
            </OfferArrivalLink>
          ) : null}
          <Link
            href={offer.askHref}
            className={cn('caption', s.ask)}
            data-intent=""
          >
            {askLabel}
          </Link>
        </span>
      </div>
    </Formwork>
  )
}

/**
 * Every published offer of one situation, as the pattern approach lists them
 * (`docs/R1-PENDEKATAN-POLA-OFFER.md`, section 3): the entry offer first,
 * then the rest grouped under their reader type label. Card height follows
 * the content, so a situation with twenty offers stays a list, not a wall.
 *
 * Each card asks a question that can be measured: its link to the contact
 * page carries the situation and the offer, and nothing about the reader.
 * Only an offer with its own page links to one.
 *
 * The formwork sits on the card itself while FLIP owns only the positions of
 * list items. Filtering must never animate the reading link or change the
 * semantic list that a non-JavaScript reader sees.
 *
 * R6 (`docs/MOTION-SPEC.md` §13.2): `bab-formwork` is each card arriving in
 * its form as it reaches the reader, the form struck a beat later; `bab-sift`
 * is a market chip moving the cards that stay, 400ms `ease-out-quart`, with
 * `--stagger-cards` between them. Under reduced motion neither happens: the
 * cards have no form and the filter's result is simply there.
 */
export function ChapterOfferGrid({
  offers,
  label,
  marketLabel,
  allLabel,
  governmentLabel,
  privateLabel,
  entryLabel,
  askLabel,
  readLabel,
  conditionLabel,
  marketFilter,
  className,
}: ChapterOfferGridProps) {
  const [market, setMarket] = useState<MarketFilter>('semua')
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  )
  const gridRef = useRef<HTMLDivElement | null>(null)
  const revealRef = useReveal<HTMLDivElement>({ perItem: true })
  const canFilter =
    marketFilter && offers.some((offer) => offer.market !== null)
  const visible = offers.filter((offer) => isInMarket(offer, market))
  const entry = visible.find((offer) => offer.entry)
  const groups = byType(visible.filter((offer) => offer !== entry))
  const card = { entryLabel, askLabel, readLabel, conditionLabel }

  useFlipGrid(gridRef, market, SIFT_MOVE)

  return (
    <section className={cn(s.section, className)} data-epic="bab-sift">
      <div className={s.heading}>
        <p className="caption">{label}</p>
      </div>

      {/*
       * A named group of toggle buttons. `aria-label` on a `div` with no role
       * names nothing a reader can reach, and axe could not decide
       * `aria-prohibited-attr` on it (e2e run 41187949698, R5). `group` is
       * the role that carries the name.
       */}
      <div
        role="group"
        className={s.filters}
        aria-label={marketLabel}
        hidden={!hasHydrated || !canFilter}
      >
        <button
          type="button"
          aria-pressed={market === 'semua'}
          className={s.filter}
          data-press="chip"
          onClick={() => setMarket('semua')}
        >
          {allLabel}
        </button>
        <button
          type="button"
          aria-pressed={market === 'pemerintah'}
          className={s.filter}
          data-press="chip"
          onClick={() => setMarket('pemerintah')}
        >
          {governmentLabel}
        </button>
        <button
          type="button"
          aria-pressed={market === 'swasta'}
          className={s.filter}
          data-press="chip"
          onClick={() => setMarket('swasta')}
        >
          {privateLabel}
        </button>
      </div>

      <div
        ref={(node) => {
          gridRef.current = node
          revealRef.current = node
        }}
        className={s.groups}
        data-epic="bab-formwork"
      >
        {entry ? (
          <div className={s.entryItem} {...{ [FLIP_ID]: entry.id }}>
            <OfferCard offer={entry} {...card} />
          </div>
        ) : null}

        {groups.map((group) => (
          <section key={group.type} className={s.group}>
            <h3 className={cn('caption', s.type)}>{group.type}</h3>
            <ul className={s.grid}>
              {group.items.map((offer) => (
                <li
                  key={offer.id}
                  {...{ [FLIP_ID]: offer.id }}
                  className={s.item}
                >
                  <OfferCard offer={offer} {...card} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
