import cn from 'clsx'

import { Link } from '@/components/ui/link'
import { SectionHeader } from '@/components/ui/section-header'
import { CopyAddress } from '@/vault/blocks/copy-address'
import { Reveal } from '@/vault/motion/reveal'

import s from './contact-ledger.module.css'

interface ContactLedgerProps {
  regions: readonly { id: string; name: string }[]
  email: string
  emailHref: string | null
  whatsappHref: string | null
  responseTime: string | null
  address: string
  addressIsPlaceholder: boolean
  socials: readonly { label: string; url: string }[]
  labels: {
    regionsEyebrow: string
    regionsTitle: string
    regionsIntro: string
    regionsLabel: string
    contactEyebrow: string
    contactReadyTitle: string
    whatsapp: string
    email: string
    responseTime: string
    address: string
    socials: string
    copy: string
    copied: string
    copyFailed: string
  }
  className?: string | undefined
}

/**
 * ContactLedger — the confirmed service area beside the current contact gate.
 *
 * Dummy addresses remain readable review material but never become actions.
 * Once a real email arrives, the copy control supplies the one small stamped
 * moment specified for this otherwise quiet page.
 */
export function ContactLedger({
  regions,
  email,
  emailHref,
  whatsappHref,
  responseTime,
  address,
  addressIsPlaceholder,
  socials,
  labels,
  className,
}: ContactLedgerProps) {
  const hasRealChannel = whatsappHref !== null || emailHref !== null

  return (
    <div className={cn(s.ledger, className)}>
      <Reveal as="section" className={s.regions} perItem>
        <SectionHeader
          eyebrow={labels.regionsEyebrow}
          title={labels.regionsTitle}
        />
        <p data-reveal-item className={cn('p-big', s.intro)}>
          {labels.regionsIntro}
        </p>
        <ol aria-label={labels.regionsLabel} className={s.regionList}>
          {regions.map((region, index) => (
            <li key={region.id} data-reveal-item className={s.region}>
              <span aria-hidden="true" className={cn('caption', s.number)}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={cn('h3', s.regionName)}>{region.name}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      {/*
        Channels, only once one is real (owner decision P4, R0). Until K5
        names a channel there is nothing a reader can use here, and a dummy
        address with a note to the editor is worse than no section.
      */}
      {hasRealChannel && (
        <Reveal as="section" id="contact" className={s.contact} perItem>
          <SectionHeader
            eyebrow={labels.contactEyebrow}
            title={labels.contactReadyTitle}
          />

          <div data-reveal-item className={s.channels}>
            {whatsappHref && (
              <Link
                href={whatsappHref}
                newTab
                className={cn('cta', s.primary)}
                data-press="cta"
                data-intent=""
              >
                {labels.whatsapp}
              </Link>
            )}

            {emailHref && (
              <div className={s.fact}>
                <h3 className={cn('caption', s.factLabel)}>{labels.email}</h3>
                <Link href={emailHref} className={cn('p-big', s.email)}>
                  {email}
                </Link>
                <CopyAddress
                  address={email}
                  label={labels.copy}
                  copied={labels.copied}
                  failed={labels.copyFailed}
                />
              </div>
            )}

            {responseTime && (
              <div className={s.fact}>
                <h3 className={cn('caption', s.factLabel)}>
                  {labels.responseTime}
                </h3>
                <p className={cn('p-big', s.factValue)}>{responseTime}</p>
              </div>
            )}

            {!addressIsPlaceholder && (
              <div className={s.fact}>
                <h3 className={cn('caption', s.factLabel)}>{labels.address}</h3>
                <p className={cn('p-big', s.factValue)}>{address}</p>
              </div>
            )}

            {socials.length > 0 && (
              <div className={s.fact}>
                <h3 className={cn('caption', s.factLabel)}>{labels.socials}</h3>
                <ul className={s.socials}>
                  {socials.map((social) => (
                    <li key={social.url}>
                      <Link
                        href={social.url}
                        newTab
                        className={cn('p', s.social)}
                      >
                        {social.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>
      )}
    </div>
  )
}
