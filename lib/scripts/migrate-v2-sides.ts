/**
 * V0 migration: side steps move from one dashed line to a name and a
 * description, and each side gains its buyers (docs/RENCANA-KONTEKS-V2.md
 * §6.2, V0).
 *
 * Read-only by itself. It takes the side documents as JSON (exported by the
 * owner or read through the Sanity connector, drafts included), prints the
 * write plan, and writes the mutations to a file. Nothing reaches Sanity
 * until the owner says “ok tulis” for this plan and the mutations are
 * applied, which follows PROSEDUR-KERJA §6.
 *
 * The values come from `SIDE_FALLBACKS`, matched by each step's `_key`, so the
 * dataset and the code fallback cannot drift apart. The output is one patch
 * per side that sets only `caraMembeli`, `pembeli`, `statusTinjauan`
 * (`perlu-anda`), and `ditulisOleh`, guarded by the revision that was read.
 * A patch on a published ID lands in its draft, never in the published
 * version; the owner approves and publishes, as for any agent write.
 *
 * ```bash
 * bun lib/scripts/migrate-v2-sides.ts --input sides.json --out patches.json
 * ```
 */

import { readFile, writeFile } from 'node:fs/promises'

import { SIDE_FALLBACKS } from '@/lib/content/side-fallback'
import { ALL_SIDES, type Side } from '@/lib/content/units'

interface LocalizedValue {
  _key: string
  _type: string
  language: string
  value: string
}

export interface SideDocument {
  _id: string
  _rev?: string
  _type: 'side'
  kunci: string
  caraMembeli?: readonly { _key: string; [field: string]: unknown }[]
  [field: string]: unknown
}

export interface SidePlan {
  draftId: string
  kunci: Side
  fromPublished: boolean
  steps: {
    key: string
    before: string | null
    nama: string
    keterangan: string
  }[]
  buyers: readonly string[]
  /** The document the patch is addressed to: its draft if one exists. */
  targetId: string
  revision: string | undefined
  /** The fields this migration sets; nothing else on the document changes. */
  set: Record<string, unknown>
}

const localized = (
  value: string,
  type: 'internationalizedArrayStringValue' | 'internationalizedArrayTextValue'
): LocalizedValue[] => [{ _key: 'id', _type: type, language: 'id', value }]

type LocalizedField = readonly { _key?: string; value?: unknown }[] | undefined

/** The Indonesian value of an internationalized field, if it is a string. */
const indonesian = (field: LocalizedField): string | null => {
  const entry = field?.find((item) => item._key === 'id')
  return typeof entry?.value === 'string' ? entry.value : null
}

const isSide = (value: string): value is Side =>
  (ALL_SIDES as readonly string[]).includes(value)

/** The newest version of each side: its draft when one exists. */
function latestSides(documents: readonly SideDocument[]): SideDocument[] {
  const byId = new Map<string, SideDocument>()
  for (const document of documents) {
    const id = document._id.replace(/^drafts\./, '')
    if (!byId.has(id) || document._id.startsWith('drafts.')) {
      byId.set(id, document)
    }
  }
  return [...byId.values()]
}

export function planSideMigration(
  documents: readonly SideDocument[]
): SidePlan[] {
  return latestSides(documents).flatMap((document) => {
    if (!isSide(document.kunci)) return []
    const fallback = SIDE_FALLBACKS[document.kunci]
    const byKey = new Map<string, { nama: string; keterangan: string }>(
      fallback.caraMembeli.map((step) => [step._key, step])
    )
    const current = document.caraMembeli ?? []

    // Steps the fallback does not know keep their old line; a reviewer sees
    // them in the plan rather than losing them silently.
    const steps = current.map((item) => {
      const target = byKey.get(item._key)
      return {
        key: item._key,
        before: indonesian(item['teks'] as LocalizedField),
        nama: target?.nama ?? indonesian(item['teks'] as LocalizedField) ?? '',
        keterangan: target?.keterangan ?? '',
      }
    })

    const publishedId = document._id.replace(/^drafts\./, '')
    const draftId = `drafts.${publishedId}`

    return [
      {
        draftId,
        kunci: document.kunci,
        fromPublished: !document._id.startsWith('drafts.'),
        steps,
        buyers: fallback.pembeli,
        targetId: document._id,
        revision: document._rev,
        set: {
          caraMembeli: steps.map((step) => ({
            _key: step.key,
            _type: 'object',
            nama: localized(step.nama, 'internationalizedArrayStringValue'),
            ...(step.keterangan && {
              keterangan: localized(
                step.keterangan,
                'internationalizedArrayTextValue'
              ),
            }),
          })),
          pembeli: fallback.pembeli.map((buyer, index) => ({
            _key: `pembeli-${index + 1}`,
            _type: 'object',
            teks: localized(buyer, 'internationalizedArrayStringValue'),
          })),
          statusTinjauan: 'perlu-anda',
          ditulisOleh: 'agen',
        },
      },
    ]
  })
}

export function planMarkdown(plans: readonly SidePlan[]): string {
  const lines = [
    '| Dokumen | Sisi | Dari | Langkah | Pembeli |',
    '| --- | --- | --- | --- | --- |',
    ...plans.map(
      (plan) =>
        `| ${plan.draftId} | ${plan.kunci} | ${plan.fromPublished ? 'versi terbit' : 'draf'} | ${plan.steps.length} | ${plan.buyers.length} |`
    ),
  ]
  for (const plan of plans) {
    lines.push(
      '',
      `### ${plan.kunci}`,
      '',
      '| Sebelum | Nama | Keterangan |',
      '| --- | --- | --- |'
    )
    for (const step of plan.steps) {
      lines.push(`| ${step.before ?? ''} | ${step.nama} | ${step.keterangan} |`)
    }
  }
  return lines.join('\n')
}

async function main() {
  const inputIndex = process.argv.indexOf('--input')
  const outIndex = process.argv.indexOf('--out')
  const input = inputIndex === -1 ? undefined : process.argv[inputIndex + 1]
  const out = outIndex === -1 ? undefined : process.argv[outIndex + 1]
  if (!input || !out) {
    console.error(
      'Usage: bun lib/scripts/migrate-v2-sides.ts --input <sides.json> --out <mutations.json>'
    )
    process.exit(1)
  }

  const documents = JSON.parse(await readFile(input, 'utf8')) as SideDocument[]
  const plans = planSideMigration(documents)
  // Keyed by document ID, the shape the Sanity connector's patch call takes.
  const patches = Object.fromEntries(
    plans.map((plan) => [
      plan.targetId,
      {
        ...(plan.revision && { ifRevisionId: plan.revision }),
        patches: [{ set: plan.set }],
      },
    ])
  )
  await writeFile(out, JSON.stringify(patches, null, 2))
  console.log(planMarkdown(plans))
  console.log(
    `\n${plans.length} patch ditulis ke ${out}. Belum ada yang dikirim ke Sanity.`
  )
}

if (import.meta.main) await main()
