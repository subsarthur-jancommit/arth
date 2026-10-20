import cn from 'clsx'
import { ViewTransition } from 'react'

import { Link } from '@/components/ui/link'
import { SectionHeader } from '@/components/ui/section-header'
import type { Unit } from '@/lib/content/units'
import { unitTemplate } from '@/lib/content/units'
import { transitionName } from '@/lib/motion/transition-name'
import { Datum } from '@/vault/motion/datum'
import { Horizontal } from '@/vault/motion/horizontal'
import { Reveal } from '@/vault/motion/reveal'

import s from './unit-doors.module.css'

export interface UnitDoor {
  value: Unit
  label: string
  title: string
  intro: string
}

interface UnitDoorsProps {
  units: readonly UnitDoor[]
  statement: string
  datumLabel: string
  eyebrow: string
  title: string
  linkLabel: string
  className?: string | undefined
}

/** Arthur's three unit doors, set out from the umbrella statement. */
export function UnitDoors({
  units,
  statement,
  datumLabel,
  eyebrow,
  title,
  linkLabel,
  className,
}: UnitDoorsProps) {
  const doors = units.map((unit, index) => (
    <Link
      key={unit.value}
      href={unitTemplate(unit.value)}
      transition="morph"
      className={s.door}
      data-press="unit-door"
      data-intent=""
    >
      <span className={cn('caption', s.index)}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <ViewTransition
        name={transitionName(`practice-${unit.value}`)}
        share="morph"
        default="none"
      >
        <h3 className={cn('h2', s.name)}>{unit.label}</h3>
      </ViewTransition>
      <p className={cn('h3', s.title)}>{unit.title}</p>
      <p className={cn('p', s.intro)}>{unit.intro}</p>
      <span className={cn('caption', s.action)}>{linkLabel}</span>
    </Link>
  ))

  return (
    <section id="unit" className={cn(s.section, className)}>
      <SectionHeader reveal eyebrow={eyebrow} title={title} />
      <Reveal className={s.layout}>
        <Datum
          className={s.datum}
          above={
            <p data-reveal-item className={cn('p-big', s.statement)}>
              {statement}
            </p>
          }
          label={datumLabel}
          below={
            <Horizontal
              name="arth-passage"
              label={title}
              items={doors}
              className={s.run}
            />
          }
        />
      </Reveal>
    </section>
  )
}
