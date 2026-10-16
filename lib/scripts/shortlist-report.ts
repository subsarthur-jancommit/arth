/**
 * Builds docs/DAFTAR-PENDEK.md from the proposals in `lib/content/shortlist.ts`
 * and the master brief, so the owner decides on the real catalogue rows: the
 * title and impact as the web will carry them, the kind, the † wording, and
 * the result of every shortlist rule. Read-only towards Sanity.
 *
 * ```bash
 * bun lib/scripts/shortlist-report.ts "<master brief dir>" > docs/DAFTAR-PENDEK.md
 * ```
 */

import {
  checkShortlist,
  SHORTLIST_PROPOSALS,
  type ShortlistChapter,
} from '@/lib/content/shortlist'

import { type OfferDraft, readCatalog } from './import-catalog'

const SIDE_NAMES: Record<string, string> = {
  'konstruksi|A': 'Konstruksi · Pelaku proyek',
  'konstruksi|B': 'Konstruksi · Pemilik bangunan',
  'teknologi|A': 'Teknologi · Paham teknis',
  'teknologi|B': 'Teknologi · Siap pakai',
  'peekabo|A': 'Peekabo · Pemilik usaha',
  'peekabo|B': 'Peekabo · Jaringan',
}

const cell = (value: string | undefined) =>
  (value ?? '').replaceAll('|', '/').replaceAll('\n', ' ')

function chapterSection(
  chapter: ShortlistChapter,
  drafts: readonly OfferDraft[],
  quote: string | undefined
): string[] {
  const byId = new Map(drafts.map((draft) => [draft.idKatalog, draft]))
  const inChapter = drafts.filter(
    (draft) => draft.situation === chapter.situation
  )
  const chosen = new Set(chapter.pilihan.map((pick) => pick.id))
  const held = new Map(
    (chapter.tahan ?? []).map((hold) => [hold.id, hold.alasan])
  )
  const findings = checkShortlist(chapter, drafts)

  const lines = [
    `### ${chapter.situation}`,
    '',
    ...(quote ? [`> ${quote}`, ''] : []),
    ...(chapter.keputusan ? [`**Keputusan:** ${chapter.keputusan}.`, ''] : []),
    `${chapter.pilihan.length} dari ${inChapter.length} offer. Pintu masuk: **${chapter.entri}**. Aturan: ${findings.length === 0 ? 'lolos' : findings.map((finding) => finding.message).join('; ')}.`,
    '',
    '| # | ID | Judul untuk web | Dampak untuk web | Jenis | † | Alasan | Keputusan Anda |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...chapter.pilihan.map((pick, index) => {
      const draft = byId.get(pick.id)
      return `| ${index + 1} | ${pick.id}${pick.id === chapter.entri ? ' (pintu masuk)' : ''} | ${cell(draft?.judul)} | ${cell(draft?.dampak)} | ${cell(draft?.jenis)} | ${cell(draft?.syarat)} | ${cell(pick.alasan)} | ${chapter.keputusan ? 'tayang' : 'tayang / tahan'} |`
    }),
    '',
  ]

  const rest = inChapter.filter((draft) => !chosen.has(draft.idKatalog))
  const chosenKinds = new Set(
    chapter.pilihan.map((pick) => byId.get(pick.id)?.jenis)
  )
  const defaultReason = (draft: OfferDraft) =>
    chosenKinds.has(draft.jenis)
      ? 'Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab'
      : 'Tidak dipilih: jenisnya tidak menjawab kutipan bab ini'
  if (rest.length > 0) {
    lines.push(
      '<details><summary>Tidak diusulkan</summary>',
      '',
      '| ID | Judul | Alasan |',
      '| --- | --- | --- |',
      ...rest.map(
        (draft) =>
          `| ${draft.idKatalog} | ${cell(draft.judul)} | ${cell(held.get(draft.idKatalog) ?? defaultReason(draft))} |`
      ),
      '',
      '</details>',
      ''
    )
  }
  if (chapter.catatan) lines.push(`Catatan: ${chapter.catatan}`, '')
  return lines
}

async function main() {
  const dir = process.argv[2]
  if (!dir) {
    console.error(
      'Usage: bun lib/scripts/shortlist-report.ts <master brief dir>'
    )
    process.exit(1)
  }
  const { drafts, situations } = await readCatalog(dir)
  const quoteOf = (chapter: ShortlistChapter) =>
    situations.find(
      (situation) =>
        situation.unit === chapter.unit &&
        situation.side === chapter.side &&
        situation.nama === chapter.situation
    )?.kutipan

  const lines = [
    '# Daftar pendek offer',
    '',
    'Usulan agen per bab, sesuai `docs/RENCANA-KONTEKS-V2.md` V2 dan Peta website, “Memilih offer yang tayang”: 3 sampai 7 offer, dipilih terhadap kutipan pembeli bab, satu per jenis sebelum yang kedua, offer lingkup terkecil sebagai pintu masuk, offer ‡ dan yang bergantung pada keputusan terbuka tidak diusulkan, offer † hanya dengan rumusan aman.',
    '',
    'Dokumen ini internal: ID katalog dan tanda † boleh ada di sini dan tidak pernah tampil di situs. Isi kolom **Keputusan Anda**, atau balas per bab. Sesudah keputusan dan “ok tulis”, agen menyetel status di Sanity: `dipilih` atau `ditahan`. Dokumen ini dihasilkan oleh `lib/scripts/shortlist-report.ts`; usulan tersimpan di `lib/content/shortlist.ts`.',
    '',
  ]

  // One section per side, in the order each side first appears.
  const bySide = Map.groupBy(
    SHORTLIST_PROPOSALS,
    (chapter) => `${chapter.unit}|${chapter.side}`
  )
  for (const [side, chapters] of bySide) {
    lines.push(`## ${SIDE_NAMES[side] ?? side}`, '')
    for (const chapter of chapters) {
      lines.push(...chapterSection(chapter, drafts, quoteOf(chapter)))
    }
  }

  console.log(lines.join('\n'))
}

if (import.meta.main) await main()
