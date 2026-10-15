/**
 * How much of the master brief is live: the table in section 1 of
 * docs/RENCANA-KONTEKS-TAYANG.md, measured instead of estimated.
 *
 * Three sources, none of them written to:
 *
 * - the catalogue, through `readCatalog` (the same reader the import uses);
 * - Sanity's public API, published perspective, no token;
 * - the production site, by counting the distinct offers each published
 *   situation page asks about (`pekerjaan=` in its contact links).
 *
 * The preview sits behind Vercel Authentication, so its numbers are checked
 * in a signed-in browser, not here.
 *
 * ```bash
 * NEXT_PUBLIC_SANITY_PROJECT_ID=<id> bun lib/scripts/measure-rollout.ts "<master brief dir>"
 * bun lib/scripts/measure-rollout.ts <dir> --site https://arth-test-01.vercel.app
 * ```
 */

import { DERIVED_UNITS } from '@/lib/content/situation-pages'

import { readCatalog } from './import-catalog'

const API_VERSION = '2025-03-01'

export type Row = { label: string; value: number; of: number }

export const percent = (value: number, of: number) =>
  of === 0 ? '0%' : `${((value / of) * 100).toFixed(1).replace('.', ',')}%`

export function rolloutTable(rows: readonly Row[]): string {
  return [
    '| Ukuran | Angka | Persen |',
    '| --- | --- | --- |',
    ...rows.map(
      (row) =>
        `| ${row.label} | ${row.value} dari ${row.of} | ${percent(row.value, row.of)} |`
    ),
  ].join('\n')
}

/** Distinct offer slugs a page asks about through its contact links. */
export function askedOffers(html: string): number {
  return new Set(
    [...html.matchAll(/pekerjaan=([a-z0-9-]+)/g)].map((match) => match[1])
  ).size
}

type Published = {
  units: number
  sides: number
  chapters: { unit: string; side: string; slug: string }[]
  offers: number
}

async function published(
  projectId: string,
  dataset: string
): Promise<Published> {
  const query = `{
    "units": count(*[_type == "unit" && statusTinjauan == "disetujui"]),
    "sides": count(*[_type == "side" && statusTinjauan == "disetujui"]),
    "chapters": *[_type == "bab" && statusTinjauan == "disetujui"]{
      "unit": sisi->unit->kunci, "side": sisi->kunci, "slug": slug.current
    },
    "offers": count(*[_type == "offer" && statusTinjauan == "disetujui"])
  }`
  const url = `https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(query)}&perspective=published`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Sanity answered ${response.status}`)
  const body = (await response.json()) as { result: Published }
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
  const ready = drafts.filter((draft) => draft.lane === 'otomatis')
  const chapters = Map.groupBy(
    drafts,
    (draft) => `${draft.unit}|${draft.side}|${draft.situation}`
  )
  const eligible = [...chapters.values()].filter(
    (rows) => rows.filter((row) => row.lane === 'otomatis').length >= 3
  )
  const showable = eligible.reduce(
    (sum, rows) => sum + rows.filter((row) => row.lane === 'otomatis').length,
    0
  )
  const derived = eligible.filter((rows) =>
    DERIVED_UNITS.includes(rows[0]?.unit ?? 'konstruksi')
  ).length

  const live = await published(projectId, dataset)
  let onProduction = 0
  for (const chapter of live.chapters) {
    const response = await fetch(
      `${site}/id/${chapter.unit}/${chapter.side}/${chapter.slug}`
    )
    if (response.ok) onProduction += askedOffers(await response.text())
  }

  console.log(
    rolloutTable([
      {
        label: 'Offer tampil di produksi',
        value: onProduction,
        of: ready.length,
      },
      { label: 'Offer terbit di Sanity', value: live.offers, of: ready.length },
      { label: 'Copy offer siap', value: ready.length, of: drafts.length },
      {
        label: 'Batas atas yang bisa tampil',
        value: showable,
        of: drafts.length,
      },
      {
        label: 'Bab layak (≥3 offer siap)',
        value: eligible.length,
        of: chapters.size,
      },
      {
        label: 'Halaman situasi diturunkan',
        value: derived,
        of: eligible.length,
      },
      { label: 'Bab terbit', value: live.chapters.length, of: eligible.length },
      { label: 'Sisi terbit', value: live.sides, of: 6 },
      { label: 'Unit terbit', value: live.units, of: 3 },
    ])
  )
  console.log(
    `\nDiukur ${new Date().toISOString()} terhadap ${site} dan dataset ${dataset}.`
  )
}

if (import.meta.main) await main()
