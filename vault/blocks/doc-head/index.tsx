/**
 * DocHead — the head of a document page, set like the head of a drawing
 * sheet (R5, direction A).
 *
 * Provenance: original work for Arthur. No third-party code copied. The
 * arrangement follows the approved document screens in
 * `docs/r4-arah-visual/` (`gabungan.py`: `.g-head`, `.g-kop`): a label, the
 * title, and a ruled box of facts beside them, the way a sheet carries its
 * title block. The screens also draw a breadcrumb and a lead paragraph; they
 * join this block with the first page that passes them, since a prop no page
 * asks for is a capability nobody can see (`vault/vault-api.test.ts`).
 *
 * ## What it owns, and what the page owns
 *
 * The block owns the markup and the classes; the page owns every word. The
 * facts are `{ term, detail }` pairs so the page decides what a document
 * states about itself, and a list of names (who a page is for) is passed as
 * an array, which the block sets as a plain list.
 *
 * Server-rendered and static: nothing here moves, so there is nothing to
 * reduce under `prefers-reduced-motion` and nothing to wait for without
 * JavaScript.
 */

import cn from 'clsx'
import type { ReactNode } from 'react'

import s from './doc-head.module.css'

export interface DocFact {
  term: string
  detail: ReactNode | readonly string[]
}

interface DocHeadProps {
  eyebrow?: string | undefined
  title: string
  /**
   * `name` for a short title (a situation, a piece of work), `sentence` for
   * a title that is a whole sentence, which reads better a size down.
   */
  titleSize?: 'name' | 'sentence' | undefined
  facts?: readonly DocFact[] | undefined
  className?: string | undefined
}

export function DocHead({
  eyebrow,
  title,
  titleSize = 'name',
  facts,
  className,
}: DocHeadProps) {
  const hasFacts = facts !== undefined && facts.length > 0

  return (
    <header className={cn(s.head, hasFacts && s.withFacts, className)}>
      <div className={s.main}>
        {eyebrow ? <p className={cn('caption', s.eyebrow)}>{eyebrow}</p> : null}
        <h1
          className={cn(
            titleSize === 'sentence' ? 'h2' : 'h1',
            s.title,
            titleSize === 'sentence' && s.sentence
          )}
        >
          {title}
        </h1>
      </div>

      {hasFacts ? (
        <dl className={s.facts}>
          {facts.map((fact) => (
            <div key={fact.term} className={s.fact}>
              <dt className={cn('caption', s.term)}>{fact.term}</dt>
              <dd className={cn('p', s.detail)}>
                {isNameList(fact.detail) ? (
                  <ul className={s.names}>
                    {fact.detail.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  fact.detail
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  )
}

function isNameList(detail: DocFact['detail']): detail is readonly string[] {
  return Array.isArray(detail)
}
