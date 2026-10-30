/**
 * UnitHero — the receiving half of a unit door and the unit's statement.
 *
 * Provenance: original work for Arthur. The shared transition keeps the unit
 * name continuous from the home door; ProgressText makes the approved
 * statement readable word by word. Both mechanisms leave the complete text
 * in the document when JavaScript is absent and settle immediately for
 * reduced motion.
 */

import cn from 'clsx'
import { ViewTransition } from 'react'

import { ProgressText } from '@/components/effects/progress-text'
import { transitionName } from '@/lib/motion/transition-name'
import { nameplateStyle } from '@/lib/utils/display-fit'
import { Reveal } from '@/vault/motion/reveal'

import s from './unit-hero.module.css'

interface UnitHeroProps {
  unit: string
  eyebrow: string
  name: string
  title: string
  /** The italic line under a ready-to-publish header, when the unit has one. */
  subtitle?: string | null | undefined
  statement: string
  sideCount: string
  className?: string | undefined
}

export function UnitHero({
  unit,
  eyebrow,
  name,
  title,
  subtitle,
  statement,
  sideCount,
  className,
}: UnitHeroProps) {
  return (
    <header className={cn(s.hero, className)}>
      <Reveal data-epic="practice-morph" className={s.nameplate}>
        <p data-reveal-item className={cn('caption', s.eyebrow)}>
          {eyebrow}
        </p>
        {/* The name's own cell is the box it is fitted to (`.nameplate`). */}
        <div className={cn('nameplate', s.nameCell)}>
          <ViewTransition
            name={transitionName(`practice-${unit}`)}
            share="morph"
            default="none"
          >
            <h1
              data-reveal-item
              className={cn('h1', 'nameplate-title', s.name)}
              style={nameplateStyle(name)}
            >
              {name}
            </h1>
          </ViewTransition>
        </div>
        <p data-reveal-item className={cn('caption', s.sideCount)}>
          {sideCount}
        </p>
      </Reveal>

      <section
        data-unit-statement=""
        data-epic="practice-statement"
        className={s.statement}
        aria-labelledby={`${unit}-statement-title`}
      >
        <h2 id={`${unit}-statement-title`} className={cn('h2', s.title)}>
          {title}
        </h2>
        {subtitle ? (
          <p className={cn('p-big', s.subtitle)}>{subtitle}</p>
        ) : null}
        <p className={cn('p-big', s.copy)}>
          <ProgressText start="top 85%" end="bottom 35%">
            {statement}
          </ProgressText>
        </p>
      </section>
    </header>
  )
}
