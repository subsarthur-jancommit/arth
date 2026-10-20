/**
 * NetworkSide — the special reading path for Peekabo's seller network.
 *
 * The page explains the model before it asks for registration. A live action
 * is deliberately absent until the first commission card exists; showing a
 * disabled-looking link would still suggest a route the business cannot yet
 * honour. The cost is fewer leads now, accepted in exchange for not collecting
 * interest before the fee source, trigger, amount, and payment timing can be
 * shown in writing.
 *
 * Motion carries sequence only. The referrer flow uses the existing Plumb CSS
 * view timeline and stamps each row as it enters. There is no pin or JavaScript
 * animation loop, and the prose never changes position.
 */

import cn from 'clsx'

import { Link } from '@/components/ui/link'
import { Plumb } from '@/vault/motion/plumb'
import { Reveal } from '@/vault/motion/reveal'
import { Stamp } from '@/vault/motion/stamp'

import s from './network-side.module.css'

export interface NetworkPath {
  id: string
  title: string
  description: string
  href: string | null
  chapterName: string | null
}

export interface NetworkStep {
  id: string
  text: string
}

export interface NetworkMoneyStep {
  id: string
  title: string
}

export interface NetworkTerms {
  source: string
  absent: string
  condition: string
}

export interface NetworkLabels {
  pathsEyebrow: string
  pathsTitle: string
  chapterLabel: string
  openPath: string
  workEyebrow: string
  workTitle: string
  moneyEyebrow: string
  moneyTitle: string
  moneyIntro: string
  stamp: string
  termsEyebrow: string
  termsTitle: string
  sourceTitle: string
  absentTitle: string
  conditionTitle: string
  registrationEyebrow: string
}

interface NetworkSideProps {
  paths: readonly NetworkPath[]
  steps: readonly NetworkStep[]
  moneySteps: readonly NetworkMoneyStep[]
  summary: string
  terms: NetworkTerms
  /**
   * The sign-up block, passed only once registration is open. Until the first
   * commission card exists it is omitted rather than shown as "not open yet"
   * (owner decision P4, R0).
   */
  registration?: { title: string; body: string } | undefined
  labels: NetworkLabels
  className?: string | undefined
}

export function NetworkSide({
  paths,
  steps,
  moneySteps,
  summary,
  terms,
  registration,
  labels,
  className,
}: NetworkSideProps) {
  return (
    <div className={cn(s.root, className)}>
      <Reveal as="section" className={s.paths} perItem>
        <header data-reveal-item className={s.sectionHeader}>
          <p className={cn('caption', s.eyebrow)}>{labels.pathsEyebrow}</p>
          <h2 className={cn('h2', s.sectionTitle)}>{labels.pathsTitle}</h2>
        </header>

        <ol className={s.pathList}>
          {paths.map((path, index) => (
            <li key={path.id} data-reveal-item className={s.pathItem}>
              <span aria-hidden="true" className={cn('caption', s.number)}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className={s.pathCopy}>
                <h3 className={cn('h3', s.pathTitle)}>{path.title}</h3>
                <p className={cn('p', s.pathDescription)}>{path.description}</p>
                {path.chapterName && (
                  <p className={cn('caption', s.chapterName)}>
                    {labels.chapterLabel}: {path.chapterName}
                  </p>
                )}
              </div>
              {path.href && (
                <Link
                  href={path.href}
                  className={cn('caption', s.pathLink)}
                  data-press="detail"
                  data-intent=""
                >
                  {labels.openPath}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal as="section" className={s.work} perItem>
        <header data-reveal-item className={s.sectionHeader}>
          <p className={cn('caption', s.eyebrow)}>{labels.workEyebrow}</p>
          <h2 className={cn('h2', s.sectionTitle)}>{labels.workTitle}</h2>
          <p className={cn('p-big', s.summary)}>{summary}</p>
        </header>
        <ol className={s.workList}>
          {steps.map((step, index) => (
            <li key={step.id} data-reveal-item className={s.workStep}>
              <span aria-hidden="true" className={cn('caption', s.number)}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className={cn('p-big', s.workCopy)}>{step.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal
        as="section"
        data-epic="network-money-flow"
        className={s.money}
        perItem
      >
        <header data-reveal-item className={s.sectionHeader}>
          <p className={cn('caption', s.eyebrow)}>{labels.moneyEyebrow}</p>
          <h2 id="network-money-title" className={cn('h2', s.sectionTitle)}>
            {labels.moneyTitle}
          </h2>
          <p className={cn('p', s.sectionNote)}>{labels.moneyIntro}</p>
        </header>
        <Plumb className={s.moneyLine}>
          <ol aria-labelledby="network-money-title" className={s.moneyList}>
            {moneySteps.map((step, index) => (
              <li key={step.id} data-reveal-item className={s.moneyStep}>
                <span aria-hidden="true" className={cn('caption', s.number)}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={cn('h3', s.moneyTitle)}>{step.title}</h3>
                <Stamp trigger="reveal" className={cn('caption', s.stamp)}>
                  {labels.stamp} {index + 1}
                </Stamp>
              </li>
            ))}
          </ol>
        </Plumb>
      </Reveal>

      <Reveal as="section" className={s.terms} perItem>
        <header data-reveal-item className={s.sectionHeader}>
          <p className={cn('caption', s.eyebrow)}>{labels.termsEyebrow}</p>
          <h2 className={cn('h2', s.sectionTitle)}>{labels.termsTitle}</h2>
        </header>
        <dl className={s.termList}>
          <div data-reveal-item className={s.term}>
            <dt className={cn('h3', s.termTitle)}>{labels.sourceTitle}</dt>
            <dd className={cn('p', s.termBody)}>{terms.source}</dd>
          </div>
          <div data-reveal-item className={s.term}>
            <dt className={cn('h3', s.termTitle)}>{labels.absentTitle}</dt>
            <dd className={cn('p', s.termBody)}>{terms.absent}</dd>
          </div>
          <div data-reveal-item className={s.term}>
            <dt className={cn('h3', s.termTitle)}>{labels.conditionTitle}</dt>
            <dd className={cn('p', s.termBody)}>{terms.condition}</dd>
          </div>
        </dl>
      </Reveal>

      {registration && (
        <section className={s.registration}>
          <p className={cn('caption', s.eyebrow)}>
            {labels.registrationEyebrow}
          </p>
          <h2 className={cn('h2', s.registrationTitle)}>
            {registration.title}
          </h2>
          <p className={cn('p-big', s.registrationBody)}>{registration.body}</p>
        </section>
      )}
    </div>
  )
}
