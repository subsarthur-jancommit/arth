/**
 * How far Arthur's site has come, in the measures of
 * docs/RENCANA-KONTEKS-V2.md §9: pages the owner approved, chapters
 * published, offers chosen, and content defects still open.
 *
 * It replaces the first version's “copy offer siap 652 dari 688”, which
 * counted catalogue rows an import could read and read as if 652 pages were
 * written. Nothing here counts the catalogue as progress; the catalogue only
 * supplies the number of chapters (55).
 *
 * Three sources, none of them written to:
 *
 * - the catalogue, through `readCatalog`, for the chapter count;
 * - Sanity's public API, published perspective, no token;
 * - the production site, by counting the distinct offers each published
 *   chapter asks about (`pekerjaan=` in its contact links).
 *
 * ```bash
 * NEXT_PUBLIC_SANITY_PROJECT_ID=<id> bun lib/scripts/measure-rollout.ts "<master brief dir>"
 * bun lib/scripts/measure-rollout.ts <dir> --site https://arth-test-01.vercel.app
 * ```
 */

import {
  checkGraph,
  type GraphDocument,
  MAX_OFFERS_PER_CHAPTER,
} from '@/lib/content/content-graph'

import { readCatalog } from './import-catalog'

const API_VERSION = '2025-03-01'

/** Content pages in the V2 page map (§3), offer pages excluded. */
export const PLANNED_CONTENT_PAGES = 70

export type Row = { label: string; value: number; of?: number }

export const percent = (value: number, of: number) =>
  of === 0 ? '0%' : `${((value / of) * 100).toFixed(1).replace('.', ',')}%`

export function rolloutTable(rows: readonly Row[]): string {
  return [
    '| Ukuran | Angka | Persen |',
    '| --- | --- | --- |',
    ...rows.map((row) =>
      row.of === undefined
        ? `| ${row.label} | ${row.value} | - |`
        : `| ${row.label} | ${row.value} dari ${row.of} | ${percent(row.value, row.of)} |`
    ),
  ].join('\n')
}

/** Distinct offer slugs a page asks about through its contact links. */
export function askedOffers(html: string): number {
  return new Set(
    [...html.matchAll(/pekerjaan=([a-z0-9-]+)/g)].map((match) => match[1])
  ).size
}

const approved = (documents: readonly GraphDocument[], type: string) =>
  documents.filter(
    (document) =>
      document._type === type && document.statusTinjauan === 'disetujui'
  )

/**
 * The honest measures from published documents alone.
 *
 * A page counts when the document that fills it is approved: the settings
 * fill the home and contact pages, each unit and side its own page, each
 * chapter its page, and the sequence, working, and policy documents theirs.
 */
export function honestRows(input: {
  documents: readonly GraphDocument[]
  chapters: number
  shownOnProduction: number
}): Row[] {
  const { documents, chapters } = input
  const settings = approved(documents, 'siteSettings').length > 0 ? 2 : 0
  const pages =
    settings +
    approved(documents, 'unit').length +
    approved(documents, 'side').length +
    approved(documents, 'bab').length +
    (approved(documents, 'sequence').length > 0 ? 1 : 0) +
    approved(documents, 'howWeWork').length +
    approved(documents, 'page').length
  const offers = approved(documents, 'offer')
  const findings = checkGraph(documents)

  return [
    {
      label: 'Halaman disetujui pemilik',
      value: pages,
      of: PLANNED_CONTENT_PAGES,
    },
    {
      label: 'Bab terbit',
      value: approved(documents, 'bab').length,
      of: chapters,
    },
    {
      label: 'Offer terpilih dan disetujui',
      value: offers.length,
      of: chapters * MAX_OFFERS_PER_CHAPTER,
    },
    {
      label: 'Halaman pekerjaan terbit',
      value: offers.filter((offer) => offer['halamanSendiri'] === true).length,
    },
    { label: 'Offer tampil di produksi', value: input.shownOnProduction },
    {
      label: 'Cacat isi terbuka (error)',
      value: findings.filter((finding) => finding.severity === 'error').length,
    },
    {
      label: 'Cacat isi terbuka (peringatan)',
      value: findings.filter((finding) => finding.severity === 'warning')
        .length,
    },
  ]
}

async function publishedDocuments(
  projectId: string,
  dataset: string
): Promise<GraphDocument[]> {
  const url = `https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?perspective=published`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query:
        '*[_type in ["siteSettings", "unit", "side", "bab", "offer", "faq", "sequence", "howWeWork", "page"]]',
    }),
  })
  if (!response.ok) throw new Error(`Sanity answered ${response.status}`)
  const body = (await response.json()) as { result: GraphDocument[] }
  return body.result
}

async function main() {
  const dir = process.argv.slice(2).find((arg) => !arg.startsWith('--'))
  const siteIndex = process.argv.indexOf('--site')
  const site =
    siteIndex === -1
      ? 'https://arth-test-01.vercel.app'
      : process.argv[siteIndex + 1]
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  if (!dir || !projectId) {
    console.error(
      'Usage: NEXT_PUBLIC_SANITY_PROJECT_ID=<id> bun lib/scripts/measure-rollout.ts <master brief dir> [--site <url>]'
    )
    process.exit(1)
  }

  const { drafts } = await readCatalog(dir)
  const chapters = new Set(
    drafts.map((draft) => `${draft.unit}|${draft.side}|${draft.situation}`)
  ).size

  const documents = await publishedDocuments(projectId, dataset)
  const byId = new Map(documents.map((document) => [document._id, document]))
  let shownOnProduction = 0
  for (const chapter of approved(documents, 'bab')) {
    const side = chapter.sisi?._ref ? byId.get(chapter.sisi._ref) : undefined
    const unit = side?.unit?._ref ? byId.get(side.unit._ref) : undefined
    if (!side?.kunci || !unit?.kunci || !chapter.slug?.current) continue
    const response = await fetch(
      `${site}/id/${unit.kunci}/${side.kunci}/${chapter.slug.current}`
    )
    if (response.ok) shownOnProduction += askedOffers(await response.text())
  }

  console.log(
    rolloutTable(honestRows({ documents, chapters, shownOnProduction }))
  )
  console.log(
    `\nDiukur ${new Date().toISOString()} terhadap ${site} dan dataset ${dataset}. Rincian cacat: bun lib/scripts/check-content-graph.ts`
  )
}

if (import.meta.main) await main()
