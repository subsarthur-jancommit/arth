import { defineQuery } from 'next-sanity'
import { z } from 'zod'

import {
  type SequenceContent,
  sequenceContent,
} from '@/lib/content/sequence-content'
import type { Locale } from '@/lib/i18n/routing'
import { isConfigured } from '@/lib/integrations/registry'
import { sanityFetch } from '@/lib/integrations/sanity/live'

/**
 * The sequence the home page shows when the Studio names none: the new café.
 *
 * `docs/RENCANA-KONTEKS-V2.md` §5.1 gives the home page one "Satu klien, tiga
 * unit" sequence, `docs/V3-SERAH-W7-HALAMAN.md` §2 proposed this one because
 * the umbrella header already uses a café as its example, and the owner
 * decided on 2026-10-31: "Ya, tampilkan". It is a document id rather than a
 * sentence, so no words of Arthur's live here; every line the block shows is
 * the sequence's own, read from Sanity.
 */
export const HOME_SEQUENCE_ID = 'arthur-rangkaian-kafe-baru'

/*
 * `siteSettings.rangkaianPilihan` is the Studio's own place for this choice
 * (§6.1). It is empty on the published dataset, and filling it is a Sanity
 * write, which a code change does not make (`docs/PROSEDUR-KERJA.md` §6). So
 * the field wins once someone sets it, and the owner's decision above answers
 * until then.
 *
 * Hand-written rather than typegen'd, like `lib/seo/routes.ts`: the answer is
 * one reference id, validated below.
 */
const chosenSequenceQuery = defineQuery(`
  *[_type == "siteSettings" && statusTinjauan == "disetujui"][0].rangkaianPilihan._ref
`)

const chosenSequencePreviewQuery = defineQuery(`
  *[_type == "siteSettings"][0].rangkaianPilihan._ref
`)

const chosenIdSchema = z.string().min(1).nullable().catch(null)

/** The sequence id the Studio chose for the home page, if it chose one. */
async function chosenSequenceId(preview: boolean): Promise<string | null> {
  'use cache'

  if (!isConfigured('sanity')) return null

  const { data } = await sanityFetch({
    query: preview ? chosenSequencePreviewQuery : chosenSequenceQuery,
    perspective: preview ? 'drafts' : 'published',
    stega: false,
  })

  return chosenIdSchema.parse(data ?? null)
}

/**
 * The renderable sequence the home page shows: the Studio's choice when it
 * made one and that sequence can be shown, the café otherwise, and nothing
 * when neither is published and complete — the block then leaves the page
 * rather than show a sequence nobody chose.
 */
export function pickHomeSequence(
  sequences: readonly SequenceContent[],
  chosen: string | null
): SequenceContent | null {
  return (
    sequences.find((sequence) => sequence._id === chosen) ??
    sequences.find((sequence) => sequence._id === HOME_SEQUENCE_ID) ??
    null
  )
}

/** The home page's sequence, read the way `/layanan` reads all of them. */
export async function homeSequence(
  locale: Locale,
  preview = false
): Promise<SequenceContent | null> {
  const [sequences, chosen] = await Promise.all([
    sequenceContent(locale, preview),
    chosenSequenceId(preview),
  ])

  return pickHomeSequence(sequences, chosen)
}
