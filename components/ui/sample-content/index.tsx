import cn from 'clsx'
import type { ReactNode } from 'react'

import { SAMPLE_CONTENT_ATTRIBUTE } from '@/lib/content/sample-content'

import s from './sample-content.module.css'

/**
 * A block of text the site is honest about not meaning yet.
 *
 * ## Why a visible label and not a code comment
 *
 * The content rules this project works to allow dummy text on the site while
 * it is being built — motion and layout cannot be judged against empty boxes
 * — on one condition: it shows **on screen** that it is sample content. The
 * condition is the whole point. A page of plausible sentences with no mark is
 * indistinguishable from a page of claims, and the reader who cannot tell is
 * exactly the reader the rule protects. A comment in the source protects
 * nobody.
 *
 * ## Why it is a component rather than a convention
 *
 * Three things have to agree about the mark: this label, the render guard
 * that will refuse to serve a marked block on an indexable page, and the e2e
 * sweep that asserts every scaffolded page carries one. A convention drifts
 * between three readers; `lib/content/sample-content.ts` owns the attribute
 * and all three read it from there.
 *
 * ## What it deliberately does not do
 *
 * It does not hide the text, and it does not gate it behind a flag. The text
 * is there to be looked at — the fork's own standard is that work is judged
 * by looking at it. What the label changes is what a reader is allowed to
 * conclude from it.
 */
interface SampleContentProps {
  /** The label, localized by the caller. Short: two or three words. */
  label: string
  /**
   * One sentence on what will replace this and where it comes from. Optional,
   * because a block whose own text already says so does not need it twice.
   */
  note?: string | undefined
  children: ReactNode
  className?: string | undefined
}

export function SampleContent({
  label,
  note,
  children,
  className,
}: SampleContentProps) {
  return (
    <div
      className={cn(s.block, className)}
      // The attribute is the contract; the border is only how a person sees
      // it. Spread rather than written literally so the key cannot drift
      // from the constant the guard greps for.
      {...{ [SAMPLE_CONTENT_ATTRIBUTE]: 'true' }}
    >
      <p className={cn('caption', s.label)}>{label}</p>
      <div className={s.body}>{children}</div>
      {note && <p className={cn('caption', s.note)}>{note}</p>}
    </div>
  )
}
