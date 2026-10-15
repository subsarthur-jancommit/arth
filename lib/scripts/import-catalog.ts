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
 * ```
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import {
  type CatalogUnit,
  type OfferModel,
  offerModel,
  READER_TYPE,
} from '@/lib/content/offer-models'

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
  /\b(naik|meningkat|bertambah|hilang|berkurang|cair|menang|tepat waktu|laris|ramai|lebih cepat|lebih tinggi|tidak habis|kembali|cepat disewakan|tanpa komplain|terjual|pendapatan|penjualan|keuntungan)\b/i

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
  lane: 'otomatis' | 'tulis-tangan'
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

const slugOf = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)

/** "Warung/kedai" becomes "Untuk warung dan kedai". A draft, read before use. */
const audienceOf = (buyer: string) => {
  const plain = buyer.replace(/\s*\([^)]*\)/g, '').replace(/\//g, ' dan ')
  return plain ? `Untuk ${plain.charAt(0).toLowerCase()}${plain.slice(1)}` : ''
}

/** Assign the model and the lane. Pure, so a test can pin every rule. */
export function draftOffer(row: CatalogRow): OfferDraft {
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

  return {
    idKatalog: row.idKatalog,
    unit: row.unit,
    side: row.side,
    situation: row.situation,
    model,
    judul: row.title,
    dampak: row.impact,
    untukSiapa: audienceOf(row.buyer),
    jenis: row.type ? READER_TYPE.get(row.type) : ASSEMBLED_LABEL,
    slug: slugOf(row.title),
    lane: reasons.length === 0 ? 'otomatis' : 'tulis-tangan',
    reasons,
  }
}

async function sideFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && /^Sisi [AB] /.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
    .toSorted()
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

  const drafts: OfferDraft[] = []
  for (const file of await sideFiles(dir)) {
    const side = file.includes('Sisi A') ? 'A' : 'B'
    const rows = parseCatalog(await readFile(file, 'utf8'), {
      unit: unitOf(file),
      side,
    })
    drafts.push(...rows.map(draftOffer))
  }

  const auto = drafts.filter((draft) => draft.lane === 'otomatis').length
  console.log(
    `${drafts.length} offer dibaca: ${auto} otomatis, ${drafts.length - auto} tulis tangan.`
  )
  const perModel = Map.groupBy(drafts, (draft) => draft.model)
  for (const [model, rows] of perModel) {
    const ready = rows.filter((draft) => draft.lane === 'otomatis').length
    console.log(`  ${model}: ${rows.length} (${ready} otomatis)`)
  }

  if (out) {
    await writeFile(out, `${JSON.stringify(drafts, null, 2)}\n`)
    console.log(`Ditulis ke ${out}. Tidak ada yang ditulis ke Sanity.`)
  }
}

if (import.meta.main) await main()
