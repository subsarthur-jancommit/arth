/**
 * Derive offer drafts from the master brief's catalogue tables.
 *
 * The pattern approach (`docs/R1-PENDEKATAN-POLA-OFFER.md`) replaces one
 * handwritten handover per offer with one template per offer model. This
 * script is the mechanical half: it reads every `Sisi …` table under the
 * master brief, assigns each row its model, strips catalogue marks from the
 * title, and sorts every row into one of two lanes.
 *
 * - **otomatis**: no †, not held by an open decision, and an impact line that
 *   does not promise a result someone else controls. Title, impact and
 *   audience come straight from the row.
 * - **tulis-tangan**: everything else, with the reason. An agent writes these
 *   by hand, per model: safe wording for †, a rewritten impact, or nothing
 *   until the owner decides.
 *
 * **It never writes to Sanity.** It reads Markdown and writes one JSON file.
 * Turning that file into draft documents is a separate step that waits for
 * the owner's "ok tulis" (`docs/PROSEDUR-KERJA.md` §6).
 *
 * ```bash
 * bun lib/scripts/import-catalog.ts "D:/ARTH/FULL KONTEKS/Master Brief Katalog"
 * bun lib/scripts/import-catalog.ts <dir> --out /path/outside/repo/offers.json
 * bun lib/scripts/import-catalog.ts <dir> --review docs/R1-TULIS-TANGAN-KONSTRUKSI.md --unit konstruksi
 * bun lib/scripts/import-catalog.ts <dir> --situations docs/R1-SITUASI-TEKNOLOGI.md
 * bun lib/scripts/import-catalog.ts <dir> --drafts kuliner.ndjson --situation kuliner --side-id <id>
 * ```
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import {
  CATALOG_OVERRIDES,
  type CatalogOverride,
} from '@/lib/content/catalog-overrides'
import {
  type CatalogUnit,
  OFFER_MODELS,
  type OfferModel,
  offerModel,
  READER_TYPE,
} from '@/lib/content/offer-models'
import { OFFER_PAGES } from '@/lib/content/offer-pages'
import { babDraft, babId, offerDraft } from '@/lib/content/sanity-drafts'
import { SITUATION_OVERRIDES } from '@/lib/content/situation-overrides'
import {
  deriveSituation,
  type SituationPage,
  type SituationSource,
  situationMarkdown,
  situationSlug,
} from '@/lib/content/situation-pages'
import type { Side } from '@/lib/content/units'

/** Konstruksi's assembled packages have no type column (glossary, §1). */
const ASSEMBLED_LABEL = 'Paket yang disusun menurut posisi Anda di proyek'

/** Rows held by an open decision in the master brief, with the decision. */
const HELD_IDS = new Map<string, string>([
  ['IND-04', 'posisi bot trading'],
  ['IND-05', 'posisi bot trading'],
  ['KEU-01', 'posisi bot trading'],
  ['KEU-02', 'posisi bot trading'],
  ['KEU-05', 'posisi bot trading'],
  ['KEU-07', 'posisi bot trading'],
  ['RWT-01', 'ekonomi Membership Care'],
  ['RWT-09', 'ekonomi Membership Care'],
])

/**
 * Words that put an impact in someone else's hands: the buyer, the market,
 * a platform or a regulator (Aturan isi 3). A match sends the row to the
 * handwritten lane. It is a floor, not a proof; every impact is still read
 * once before it is published.
 */
const RESULT_WORDS =
  /\b(naik|meningkat|bertambah|hilang|berkurang|cair|menang|tepat waktu|laris|ramai|lebih cepat|lebih tinggi|tidak habis|kembali|cepat disewakan|tanpa komplain|terjual|pendapatan|penjualan|keuntungan|menurun|turun|hemat|selalu|tidak lagi)\b/i

export type CatalogRow = {
  idKatalog: string
  unit: CatalogUnit
  side: 'A' | 'B'
  situation: string
  title: string
  impact: string
  buyer: string
  type: string | undefined
  mark: '†' | '‡' | undefined
}

export type OfferDraft = {
  idKatalog: string
  unit: CatalogUnit
  side: 'A' | 'B'
  situation: string
  model: OfferModel
  judul: string
  dampak: string
  untukSiapa: string
  jenis: string | undefined
  slug: string
  /** A † offer's condition, from the handwritten overrides. */
  syarat: string | undefined
  lane: 'otomatis' | 'tulis-tangan'
  /** True when an agent answered this row in `catalog-overrides.ts`. */
  ditinjau: boolean
  reasons: string[]
}

/** The master brief spells the folder "Kontruksi"; both spellings count. */
function unitOf(path: string): CatalogUnit {
  if (path.includes('Kontruksi') || path.includes('Konstruksi'))
    return 'konstruksi'
  if (path.includes('Teknologi')) return 'teknologi'
  return 'peekabo'
}

function markOf(title: string): CatalogRow['mark'] {
  if (title.includes('‡')) return '‡'
  if (title.includes('†')) return '†'
  return undefined
}

const cellsOf = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim())

/** The value of the first header that starts with one of `names`. */
const pick = (header: string[], cells: string[], ...names: string[]) => {
  const index = header.findIndex((name) =>
    names.some((wanted) => name.startsWith(wanted))
  )
  return index === -1 ? '' : (cells[index] ?? '')
}

/** Read every offer row in one side file. Other tables are skipped. */
export function parseCatalog(
  markdown: string,
  place: { unit: CatalogUnit; side: 'A' | 'B' }
): CatalogRow[] {
  const rows: CatalogRow[] = []
  let header: string[] | undefined
  let situation = ''

  for (const line of markdown.split('\n')) {
    if (line.startsWith('## ')) situation = line.slice(3).trim()
    if (!line.startsWith('|')) continue

    const cells = cellsOf(line)
    if (cells[0] === 'ID') {
      header = cells
      continue
    }
    if (!header || cells.length !== header.length) continue
    if (!/^[A-Z0-9]{2,4}-\d{2}$/.test(cells[0] ?? '')) continue

    const raw = pick(header, cells, 'Offer', 'Paket')
    const mark = markOf(raw)
    const type = pick(header, cells, 'Jenis')

    rows.push({
      idKatalog: cells[0] ?? '',
      unit: place.unit,
      side: place.side,
      situation,
      title: raw
        .replace(/\*\*/g, '')
        .replace(/[†‡]/g, '')
        .trim(),
      impact: pick(header, cells, 'Dampak', 'Hasil'),
      buyer: pick(header, cells, 'Pembeli', 'Peserta'),
      type: type || undefined,
      mark,
    })
  }

  return rows
}

/** Each chapter heading with its "Pembeli" line and buyer quote. */
export function parseSituations(
  markdown: string,
  place: { unit: CatalogUnit; side: 'A' | 'B' }
): SituationSource[] {
  const out: SituationSource[] = []
  let current: Partial<SituationSource> = {}
  for (const line of markdown.split('\n')) {
    if (line.startsWith('## ')) current = { nama: line.slice(3).trim() }
    const buyer = /^\*\*(?:Pembeli|Peserta):\*\*\s*(.+)$/.exec(line)
    if (buyer?.[1]) current.pembeli = buyer[1].trim()
    const quote = /^\*\*Yang biasa mereka katakan:\*\*\s*(.+)$/.exec(line)
    if (quote && current.nama && current.pembeli) {
      out.push({
        ...place,
        nama: current.nama,
        pembeli: current.pembeli,
        kutipan: quote[1]?.trim() ?? '',
      })
    }
  }
  return out
}

/** Offer pairs from a unit's bridge tables: two catalogue codes per row. */
export function parseBridges(markdown: string): [string, string][] {
  const code = /^([A-Z0-9]{2,4}-\d{2})\b/
  const pairs: [string, string][] = []
  for (const line of markdown.split('\n')) {
    if (!line.startsWith('|')) continue
    const [first, second] = cellsOf(line)
    const a = code.exec(first ?? '')?.[1]
    const b = code.exec(second ?? '')?.[1]
    if (a && b) pairs.push([a, b])
  }
  return pairs
}

const slugOf = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)

/** Buyers named by their place of business are addressed as its owner. */
const OWNED_PLACES =
  /^(warung|kafe|katering|salon|bengkel|laundry|rental|klinik|apotek|gym|villa|hostel|toko|franchise|pabrik|home industry|bimbel)\b/i

/**
 * "Warung/kedai" becomes "Untuk pemilik warung dan kedai", as on the approved
 * Kuliner cards. Acronyms keep their capitals ("UMKM", "BUMDes").
 */
export function audienceOf(buyer: string): string {
  const plain = buyer
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\//g, ' dan ')
    .replace(/multi-outlet/g, 'usaha banyak outlet')
    .trim()
  if (!plain) return ''
  const lowered = /^[A-Z]{2}/.test(plain)
    ? plain
    : `${plain.charAt(0).toLowerCase()}${plain.slice(1)}`
  return OWNED_PLACES.test(lowered)
    ? `Untuk pemilik ${lowered}`
    : `Untuk ${lowered}`
}

/**
 * Which reasons an override settles. Holds (‡ and open decisions) are never
 * settled here: only the owner's decision releases them.
 */
function settles(override: CatalogOverride | undefined, reason: string) {
  if (!override || override.keputusan === 'ditahan') return false
  if (reason.startsWith('†')) return override.keputusan === 'rumusan-aman'
  return reason.startsWith('dampak')
}

/** Assign the model and the lane. Pure, so a test can pin every rule. */
export function draftOffer(
  row: CatalogRow,
  overrides: ReadonlyMap<string, CatalogOverride> = CATALOG_OVERRIDES
): OfferDraft {
  const model = offerModel({
    unit: row.unit,
    side: row.side,
    type: row.type,
    situation: row.situation,
  })

  const reasons: string[] = []
  if (row.mark === '‡') reasons.push('‡: menunggu pilihan sub-agen')
  if (row.situation.startsWith('Operator SaaS'))
    reasons.push('tertahan: SaaS pertama')
  const held = HELD_IDS.get(row.idKatalog)
  if (held) reasons.push(`tertahan: ${held}`)
  if (row.mark === '†') reasons.push('†: butuh rumusan aman')
  if (RESULT_WORDS.test(row.impact))
    reasons.push('dampak menjanjikan hasil pihak lain: tulis ulang')

  const override = overrides.get(row.idKatalog)
  if (override?.keputusan === 'ditahan')
    reasons.push(`ditahan agen: ${override.alasan ?? 'tanpa alasan'}`)
  const open = reasons.filter((reason) => !settles(override, reason))

  return {
    idKatalog: row.idKatalog,
    unit: row.unit,
    side: row.side,
    situation: row.situation,
    model,
    judul: override?.judul ?? row.title,
    dampak: override?.dampak ?? row.impact,
    untukSiapa: audienceOf(row.buyer),
    jenis: row.type ? READER_TYPE.get(row.type) : ASSEMBLED_LABEL,
    slug: slugOf(override?.judul ?? row.title),
    syarat: override?.syarat,
    lane: open.length === 0 ? 'otomatis' : 'tulis-tangan',
    ditinjau: override !== undefined,
    reasons: open,
  }
}

async function bridgeFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && entry.name === 'Peta & aturan main.md')
    .map((entry) => join(entry.parentPath, entry.name))
  return Promise.all(files.map((file) => readFile(file, 'utf8')))
}

async function sideFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && /^Sisi [AB] /.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
    .toSorted()
}

/**
 * The rows an agent answered, per model, for the owner to read in one pass.
 * The reader's words come first; the catalogue code sits in the last column.
 */
export function reviewMarkdown(
  drafts: OfferDraft[],
  unit?: CatalogUnit
): string {
  const lines = [
    '# Tinjauan tulis tangan',
    '',
    'Dihasilkan `lib/scripts/import-catalog.ts --review` dari',
    '`lib/content/catalog-overrides.ts`. Jangan disunting di sini.',
  ]
  const reviewed = drafts.filter(
    (draft) => draft.ditinjau && (unit === undefined || draft.unit === unit)
  )
  for (const [model, rows] of Map.groupBy(reviewed, (draft) => draft.model)) {
    lines.push(
      '',
      `## ${OFFER_MODELS.find(({ key }) => key === model)?.title ?? model}`,
      '',
      '| Judul | Dampak | Syarat | Status | Kode |',
      '| --- | --- | --- | --- | --- |'
    )
    for (const draft of rows) {
      const status =
        draft.lane === 'otomatis' ? 'siap' : draft.reasons.join('; ')
      lines.push(
        `| ${draft.judul} | ${draft.dampak} | ${draft.syarat ?? ''} | ${status} | ${draft.idKatalog} |`
      )
    }
  }
  return `${lines.join('\n')}\n`
}

/** Side keys in the URL, by unit and catalogue side (Sisi A, Sisi B). */
export const CATALOG_SIDE_KEYS = {
  konstruksi: { A: 'pelaku-proyek', B: 'pemilik-bangunan' },
  teknologi: { A: 'paham-teknis', B: 'siap-pakai' },
  peekabo: { A: 'pemilik-usaha', B: 'jaringan' },
} as const satisfies Record<CatalogUnit, Record<'A' | 'B', Side>>

/**
 * One NDJSON line per draft document: the situation, then its offers in the
 * order the page shows them. Nothing here reaches Sanity.
 */
export function draftDocuments(
  page: SituationPage,
  sideId: string,
  drafts: OfferDraft[],
  urutan = 0,
  handover?: string
): string {
  const sideKey = CATALOG_SIDE_KEYS[page.unit][page.side]
  const items = [
    page.pintuMasuk,
    ...page.kelompok.flatMap((group) => group.items),
  ].filter((item) => item !== undefined)
  const byId = new Map(drafts.map((draft) => [draft.idKatalog, draft]))
  const code = items[0]?.idKatalog.split('-')[0] ?? ''
  const parent = babId(page.unit, sideKey, page.slug)
  const docs = [
    babDraft(page, sideId, sideKey, urutan, code, handover),
    ...items.flatMap((item, index) => {
      const draft = byId.get(item.idKatalog)
      if (!draft) return []
      return [
        offerDraft(
          {
            idKatalog: draft.idKatalog,
            model: draft.model,
            judul: item.judul,
            dampak: item.dampak,
            untukSiapa: item.untukSiapa,
            jenis: draft.jenis,
            slug: draft.slug,
            syarat: item.syarat,
            ditinjau: draft.ditinjau,
          },
          parent,
          index,
          item === page.pintuMasuk,
          OFFER_PAGES.get(draft.idKatalog)
        ),
      ]
    }),
  ]
  return `${docs.map((doc) => JSON.stringify(doc)).join('\n')}\n`
}

/** Every offer draft, chapter and bridge pair in the master brief. */
export async function readCatalog(dir: string) {
  const drafts: OfferDraft[] = []
  const situations: SituationSource[] = []
  for (const file of await sideFiles(dir)) {
    const side = file.includes('Sisi A') ? 'A' : 'B'
    const markdown = await readFile(file, 'utf8')
    const place = { unit: unitOf(file), side } as const
    drafts.push(...parseCatalog(markdown, place).map((row) => draftOffer(row)))
    situations.push(...parseSituations(markdown, place))
  }
  const bridges = (await bridgeFiles(dir)).flatMap(parseBridges)
  return { drafts, situations, bridges }
}

async function main() {
  const dir = process.argv.slice(2).find((arg) => !arg.startsWith('--'))
  const outIndex = process.argv.indexOf('--out')
  const out = outIndex === -1 ? undefined : process.argv[outIndex + 1]
  if (!dir) {
    console.error(
      'Usage: bun lib/scripts/import-catalog.ts <master brief dir> [--out file.json]'
    )
    process.exit(1)
  }

  const { drafts, situations, bridges } = await readCatalog(dir)

  const auto = drafts.filter((draft) => draft.lane === 'otomatis').length
  console.log(
    `${drafts.length} offer dibaca: ${auto} otomatis, ${drafts.length - auto} tulis tangan.`
  )
  const perModel = Map.groupBy(drafts, (draft) => draft.model)
  for (const [model, rows] of perModel) {
    const ready = rows.filter((draft) => draft.lane === 'otomatis').length
    console.log(`  ${model}: ${rows.length} (${ready} otomatis)`)
  }

  const reviewIndex = process.argv.indexOf('--review')
  const review = reviewIndex === -1 ? undefined : process.argv[reviewIndex + 1]
  if (review) {
    const unitIndex = process.argv.indexOf('--unit')
    const unit = unitIndex === -1 ? undefined : process.argv[unitIndex + 1]
    await writeFile(
      review,
      reviewMarkdown(
        drafts,
        unit === 'konstruksi' || unit === 'teknologi' || unit === 'peekabo'
          ? unit
          : undefined
      )
    )
    console.log(`Tinjauan ditulis ke ${review}.`)
  }

  const arg = (name: string) => {
    const index = process.argv.indexOf(name)
    return index === -1 ? undefined : process.argv[index + 1]
  }
  const pages = situations
    .filter((source) => source.unit === 'teknologi')
    .toSorted((a, b) => b.side.localeCompare(a.side))
    .map((source) =>
      deriveSituation(
        source,
        drafts,
        bridges,
        SITUATION_OVERRIDES.get(
          `${source.unit}/${source.side}/${situationSlug(source.nama)}`
        )
      )
    )

  const draftsOut = arg('--drafts')
  if (draftsOut) {
    const slug = arg('--situation')
    const sideId = arg('--side-id')
    const page = pages.find((item) => item.slug === slug)
    if (!page || !sideId) {
      console.error('--drafts needs --situation <slug> and --side-id <id>')
      process.exit(1)
    }
    await writeFile(draftsOut, draftDocuments(page, sideId, drafts))
    console.log(
      `Draf untuk ${page.nama} ditulis ke ${draftsOut}. Tidak ada yang ditulis ke Sanity.`
    )
  }

  const situationsOut = arg('--situations')
  if (situationsOut) {
    await writeFile(
      situationsOut,
      situationMarkdown(pages, 'Halaman situasi Teknologi')
    )
    console.log(`${pages.length} halaman situasi ditulis ke ${situationsOut}.`)
  }

  if (out) {
    await writeFile(out, `${JSON.stringify(drafts, null, 2)}\n`)
    console.log(`Ditulis ke ${out}. Tidak ada yang ditulis ke Sanity.`)
  }
}

if (import.meta.main) await main()
