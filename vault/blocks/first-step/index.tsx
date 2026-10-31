/**
 * FirstStep — the first step a document page offers, as one block (R5,
 * direction A).
 *
 * Provenance: original work for Arthur. No third-party code copied. The
 * block follows the approved work-page screen in `docs/r4-arah-visual/`
 * (`gabungan.py`, `.g-lp`): a quiet surface, the label, the step in large
 * type, the sentence after it, an optional honest note, then an ink pill and
 * at most one plain link beside it.
 *
 * ## Which words go where
 *
 * The page decides. Where a reader's own button label exists
 * (`docs/R1-GLOSARIUM-PEMBACA.md` §6), it goes on the pill and its sentence
 * stays outside the button, as `body`; with no `title` the body is then the
 * large line. Where a page has a heading and a sentence of its own, they
 * take `title` and `body`, and the pill names where it leads.
 *
 * Until K5 names a channel every first step leads to `/kontak` (P4, R0); the
 * address is the caller's, so the block never assumes it.
 */

import cn from 'clsx'

import { Link } from '@/components/ui/link'
import { Reveal } from '@/vault/motion/reveal'

import s from './first-step.module.css'

interface FirstStepProps {
  id?: string | undefined
  /** The block's heading, set small: "Langkah pertama". */
  label: string
  /** The step itself, in large type. */
  title?: string | undefined
  body?: string | undefined
  /** A muted sentence that keeps the promise honest. */
  note?: string | undefined
  action: { href: string; label: string }
  secondary?: { href: string; label: string } | undefined
  className?: string | undefined
}

export function FirstStep({
  id,
  label,
  title,
  body,
  note,
  action,
  secondary,
  className,
}: FirstStepProps) {
  return (
    <Reveal as="section" id={id} className={cn(s.block, className)} perItem>
      <h2 data-reveal-item className={cn('caption', s.label)}>
        {label}
      </h2>
      {title ? (
        <p data-reveal-item className={cn('h3', s.title)}>
          {title}
        </p>
      ) : null}
      {body ? (
        <p
          data-reveal-item
          className={cn(title ? 'p-big' : 'h3', title ? s.body : s.title)}
        >
          {body}
        </p>
      ) : null}
      {note ? (
        <p data-reveal-item className={cn('p', s.note)}>
          {note}
        </p>
      ) : null}
      <p data-reveal-item className={s.actions}>
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
        {secondary ? (
          <Link href={secondary.href} className={cn('p', s.secondary)}>
            {secondary.label}
          </Link>
        ) : null}
      </p>
    </Reveal>
  )
}
