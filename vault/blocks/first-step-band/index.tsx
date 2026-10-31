/**
 * FirstStepBand: how the work is held, then the one thing to do next.
 *
 * Provenance: original work for this project. No third-party code copied.
 * Composed after the closing screen of the home page the owner approved in
 * R4 (`docs/r4-arah-visual/gabungan.py`, `beranda_bawah`): the terms of the
 * work as a ruled list on the left, the first step and its action on the
 * right, on the stage's dark ground.
 *
 * ## Why the two sit together
 *
 * The first step asks a reader to tell a stranger about their problem. The
 * list beside it is what they are told in return before they do: that scope
 * and price are agreed in writing, that what is built stays theirs, that a
 * commission is disclosed. Set side by side, the promise answers the ask in
 * the same glance; set a screen apart, the ask arrives first and alone.
 *
 * ## The words are the caller's
 *
 * Both columns are passed in. On the home page the list is the umbrella
 * header's last labelled paragraph, one sentence per row, word for word, and
 * the title is the header's own call to action.
 *
 * ## Motion
 *
 * The rows enter with the shared reveal, item by item. Under reduced motion
 * and without JavaScript everything is visible from the first paint
 * (`vault/motion/reveal`), so the action is never waiting on an animation.
 */

import cn from 'clsx'

import { Link } from '@/components/ui/link'
import { Reveal } from '@/vault/motion/reveal'

import s from './first-step-band.module.css'

interface FirstStepBandProps {
  /** The anchor the header and the hero point at. */
  id: string
  /** The terms of the work, one sentence per row. Left out when absent. */
  terms?: { title: string; items: readonly string[] } | undefined
  eyebrow: string
  title: string
  action: { href: string; label: string }
  className?: string | undefined
}

export function FirstStepBand({
  id,
  terms,
  eyebrow,
  title,
  action,
  className,
}: FirstStepBandProps) {
  return (
    <Reveal
      as="section"
      id={id}
      className={cn(s.band, terms && s.withTerms, className)}
      perItem
    >
      {terms ? (
        <div className={s.terms}>
          <h2 data-reveal-item className={cn('caption', s.label)}>
            {terms.title}
          </h2>
          <ul className={s.termList}>
            {terms.items.map((item) => (
              <li key={item} data-reveal-item className={cn('p-big', s.term)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={s.step}>
        <p data-reveal-item className={cn('caption', s.label)}>
          {eyebrow}
        </p>
        <h2 data-reveal-item className={cn('h2', s.title)}>
          {title}
        </h2>
        <p data-reveal-item className={s.actionRow}>
          <Link
            href={action.href}
            className={cn('cta', s.action)}
            data-press="cta"
            data-intent=""
          >
            {action.label}
            <span aria-hidden="true" className={s.arrow}>
              →
            </span>
          </Link>
        </p>
      </div>
    </Reveal>
  )
}
