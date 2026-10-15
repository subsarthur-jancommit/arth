/**
 * PromiseStamp — Arthur's written commitments, each marked when read.
 *
 * The list remains an ordinary ordered list: motion does not carry meaning
 * that the document lacks. `Reveal` observes each promise separately, and
 * Stamp reuses its normal timing only when that row arrives. Without
 * JavaScript and under reduced motion, every mark is already visible.
 */

import cn from 'clsx'

import { Reveal } from '@/vault/motion/reveal'
import { Stamp } from '@/vault/motion/stamp'

import s from './promise-stamp.module.css'

export interface WrittenPromise {
  id: string
  title: string
  body: string
}

interface PromiseStampProps {
  title: string
  eyebrow: string
  stampLabel: string
  promises: readonly WrittenPromise[]
  id?: string | undefined
  className?: string | undefined
}

export function PromiseStamp({
  title,
  eyebrow,
  stampLabel,
  promises,
  id = 'janji-kerja',
  className,
}: PromiseStampProps) {
  const headingId = `${id}-title`

  return (
    <Reveal
      as="section"
      id={id}
      data-epic="promise-stamp"
      perItem
      className={cn(s.section, className)}
    >
      <header data-reveal-item className={s.header}>
        <p className={cn('caption', s.eyebrow)}>{eyebrow}</p>
        <h2 id={headingId} className={cn('h2', s.title)}>
          {title}
        </h2>
      </header>

      <ol aria-labelledby={headingId} className={s.list}>
        {promises.map((promise, index) => (
          <li key={promise.id} data-reveal-item className={s.promise}>
            <span aria-hidden="true" className={cn('caption', s.number)}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className={s.copy}>
              <h3 className={cn('h3', s.promiseTitle)}>{promise.title}</h3>
              <p className={cn('p', s.body)}>{promise.body}</p>
            </div>
            <Stamp trigger="reveal" className={cn('caption', s.stamp)}>
              {stampLabel}
            </Stamp>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}
