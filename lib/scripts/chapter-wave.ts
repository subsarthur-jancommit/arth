/**
 * V3 of `docs/RENCANA-KONTEKS-V2.md`: the chapter pages of one wave, built
 * from the owner's shortlist (`lib/content/shortlist.ts`) and the chapter
 * copy in `lib/content/situation-overrides.ts`.
 *
 * Only chapters with an owner decision are built, and a chapter held whole
 * is skipped. Each page shows exactly the offers decided, in the decided
 * order, so the script makes no choice the owner did not make.
 *
 * **It never writes to Sanity.** It writes the handover the owner reads and,
 * on request, one NDJSON file of draft documents outside the repository.
 * Writing those drafts waits for the owner's "ok tulis"
 * (`docs/PROSEDUR-KERJA.md` §6).
 *
 * ```bash
 * bun lib/scripts/chapter-wave.ts "D:/ARTH/FULL KONTEKS/Master Brief Katalog" --wave W2
 * bun lib/scripts/chapter-wave.ts <dir> --wave W2 --drafts /outside/w2.ndjson --side-id <id>
 * ```
 */

import { writeFile } from 'node:fs/promises'

import type { CatalogUnit } from '@/lib/content/offer-models'
import { SHORTLIST_PROPOSALS } from '@/lib/content/shortlist'
import { SITUATION_OVERRIDES } from '@/lib/content/situation-overrides'
import {
  readerName,
  type SituationOffer,
  type SituationPage,
  type SituationSource,
  shortlistSituation,
  situationMarkdown,
  situationSlug,
} from '@/lib/content/situation-pages'
import { checkText, type StyleFinding } from '@/lib/content/style-gate'

import { draftDocuments, readCatalog } from './import-catalog'

export type Wave = {
  unit: CatalogUnit
  side: 'A' | 'B'
  judul: string
  /** Where each block's words come from, for the handover's source trail. */
  dasar: readonly string[]
  /** Decided chapters this wave leaves alone, already published earlier. */
  kecuali?: readonly string[]
}

/** The waves of section 8.4, as they are written. */
export const WAVES = {
  W2: {
    unit: 'konstruksi',
    side: 'B',
    judul: 'Konstruksi, untuk pemilik bangunan',
    dasar: [
      'Nama bab, kutipan: Konstruksi Sisi B, judul bab dan “Yang biasa mereka katakan”, apa adanya; label lapis dan jembatan dibuang (Peta website, Nama bab untuk pembaca).',
      'Untuk siapa: baris Pembeli bab itu, ditulis sebagai orang.',
      'Situasi: kutipan bab dan kolom “Yang mereka cari” di Peta pembeli unit Konstruksi, dijawab dengan dampak offer pintu masuk.',
      'Kartu pekerjaan: baris offer di daftar pendek yang disetujui, judul dan dampak katalog; urutan dan pintu masuk dari keputusan pemilik.',
      'Batas: Konstruksi Sisi B Alur kerja langkah 2 dan 4; Konstruksi aturan main 7 (pembiayaan), 10 (struktur dan persetujuan bangunan), 11 (instalasi listrik), 13 (visual); Aturan isi aturan 3 dan kalimat wajib komisi.',
      'Jembatan: tabel Jembatan ke unit teknologi; hanya yang halaman tujuannya sudah terbit.',
      'Langkah pertama: Konstruksi Sisi B Alur kerja langkah 1 dan 2, sama dengan langkah pertama halaman sisi.',
      'Mesin pencari: Suara dan gaya, bentuk per blok; wilayah dari header Konstruksi.',
    ],
  },
  W3: {
    unit: 'konstruksi',
    side: 'A',
    judul: 'Konstruksi, untuk pelaku proyek',
    dasar: [
      'Nama bab, kutipan: Konstruksi Sisi A, judul bab dan “Yang biasa mereka katakan”, apa adanya; label modul dan lapis dibuang (Peta website, Nama bab untuk pembaca).',
      'Untuk siapa: baris Pembeli bab itu, ditulis sebagai orang; untuk paket rakitan, pembeli paketnya.',
      'Situasi: kutipan bab dan kolom “Yang mereka cari” di Peta pembeli unit Konstruksi, dijawab dengan dampak offer yang dipilih.',
      'Kartu pekerjaan: baris offer di daftar pendek yang disetujui, judul, dampak, dan pasar katalog; urutan dan pintu masuk dari keputusan pemilik.',
      'Batas: Konstruksi aturan main 1 (tenaga ahli dan sertifikat), 2 (tender), 3 (penyedia dan konsultan), 4 (margin dalam HPS), 7 (modal kerja), 9 (keselamatan dan alat), 10 (struktur); Aturan isi aturan 3 dan kalimat wajib tender, pembiayaan, dan komisi.',
      'Jembatan: tidak ada; halaman tujuan di unit Teknologi belum terbit.',
      'Langkah pertama: Konstruksi Sisi A Cara membeli, sama dengan langkah pertama halaman sisi.',
      'Mesin pencari: Suara dan gaya, bentuk per blok; wilayah dari pengantar Sisi A.',
    ],
  },
  W4: {
    unit: 'teknologi',
    side: 'B',
    judul: 'Teknologi, untuk hasil siap pakai',
    kecuali: ['Kuliner dan F&B'],
    dasar: [
      'Nama bab, kutipan: Teknologi Sisi B, judul bab dan “Yang biasa mereka katakan”, apa adanya.',
      'Untuk siapa: baris Pembeli bab itu, ditulis sebagai orang; di bab keuangan tanpa pembeli trading, karena posisi bot trading belum diputuskan.',
      'Situasi: kutipan bab dan kolom “Yang mereka cari” di Peta pembeli unit Teknologi, dijawab dengan dampak offer yang dipilih.',
      'Kartu pekerjaan: baris offer di daftar pendek yang disetujui; dampak DIS-04 ditulis ulang sebagai pekerjaannya (Aturan isi 3).',
      'Batas: Teknologi aturan main 3 (kanal dan supplier), 4 (data pribadi dan kesehatan), 5 (layanan pemerintah), 6 (data publik), 7 (pesan hanya dengan izin); Aturan isi aturan 3; kalimat komisi yang sudah disetujui di bab Kuliner (Jalur komisi dua sisi).',
      'Jembatan: tabel Jembatan ke unit teknologi di Konstruksi; tampil setelah halaman tujuannya terbit.',
      'Langkah pertama: Teknologi Sisi B Alur kerja langkah 2, sama dengan bab Kuliner yang sudah terbit.',
      'Mesin pencari: pola judul bab Kuliner; wilayah tidak disebut karena wilayah Teknologi belum diputuskan.',
      'Kuliner dan F&B sudah terbit dan tidak ditulis ulang di gelombang ini.',
    ],
  },
  W5: {
    unit: 'peekabo',
    side: 'A',
    judul: 'Peekabo, untuk pemilik usaha dan brand',
    dasar: [
      'Nama bab, kutipan: Peekabo Sisi A, judul bab dan “Yang biasa mereka katakan”, apa adanya; kode bab di judul dibuang, karena kode katalog tidak pernah tampil.',
      'Untuk siapa: baris Pembeli bab itu, ditulis sebagai orang.',
      'Situasi: kutipan bab dan kolom “Yang mereka cari” di Peta pembeli unit Agency, dijawab dengan dampak offer yang dipilih.',
      'Kartu pekerjaan: baris offer di daftar pendek yang disetujui; kode layanan riset di judul, seperti 02.B, dibuang.',
      'Batas: Peekabo Cara kami bekerja (target, lingkup, dan laporan tertulis; jaringan tanpa biaya masuk, bonus rekrutmen, atau janji penghasilan); Peta & aturan main aturan 2 dan 3 (platform), 8 (hubungan kerja), 9 (event dan undian), 10 (data peserta); Aturan isi aturan 3; kalimat komisi di bab yang merujuk SaaS atau vendor.',
      'Jembatan: tabel Jembatan ke unit konstruksi dan teknologi; tampil setelah halaman tujuannya terbit.',
      'Langkah pertama: sama dengan langkah pertama halaman sisi Pemilik usaha.',
      'Mesin pencari: Suara dan gaya, bentuk per blok; wilayah dari header Peekabo dan pengantar Sisi A.',
      'Operator SaaS niche dan Akademi untuk tim klien ditahan utuh sesuai daftar pendek, jadi tidak punya halaman.',
    ],
  },
} as const satisfies Record<string, Wave>

/**
 * Chapters the owner decided for this wave that the catalogue no longer
 * names. A renamed heading would otherwise drop a decided page in silence.
 */
export function missingChapters(
  wave: Wave,
  sources: SituationSource[]
): string[] {
  return SHORTLIST_PROPOSALS.filter(
    (chapter) =>
      chapter.unit === wave.unit &&
      chapter.side === wave.side &&
      chapter.keputusan !== undefined &&
      chapter.ditahanBab === undefined &&
      !wave.kecuali?.includes(chapter.situation) &&
      !sources.some(
        (source) =>
          source.unit === chapter.unit &&
          source.side === chapter.side &&
          source.nama === chapter.situation
      )
  ).map((chapter) => chapter.situation)
}

/** The pages of one wave, in the order the side lists its chapters. */
export function wavePages(
  wave: Wave,
  sources: SituationSource[],
  offers: SituationOffer[],
  bridges: [string, string][]
): { page: SituationPage; urutan: number }[] {
  return sources
    .filter((source) => source.unit === wave.unit && source.side === wave.side)
    .flatMap((source, urutan) => {
      const chapter = SHORTLIST_PROPOSALS.find(
        (item) =>
          item.unit === wave.unit &&
          item.side === wave.side &&
          item.situation === source.nama
      )
      if (!chapter?.keputusan || chapter.ditahanBab) return []
      if (wave.kecuali?.includes(chapter.situation)) return []
      const key = `${wave.unit}/${wave.side}/${situationSlug(readerName(source.nama))}`
      const page = shortlistSituation(
        chapter,
        source,
        offers,
        bridges,
        SITUATION_OVERRIDES.get(key)
      )
      return [{ page, urutan }]
    })
}

/** Every style finding on the words a reader of the page sees. */
export function pageFindings(page: SituationPage): StyleFinding[] {
  const cards = [
    page.pintuMasuk,
    ...page.kelompok.flatMap((group) => group.items),
  ].filter((item) => item !== undefined)
  const fields: [string, string | undefined][] = [
    ['situasi', page.situasi],
    ['pembeli', page.pembeli],
    ['batas', page.batas],
    ['ajakan.label', page.ajakan.label],
    ['ajakan.sesudahnya', page.ajakan.sesudahnya],
    ['metadata.judul', page.metadata.judul],
    ['metadata.deskripsi', page.metadata.deskripsi],
    ...page.jembatan.map((bridge, index): [string, string] => [
      `jembatan[${index}]`,
      bridge.kalimat,
    ]),
    ...cards.flatMap((card, index): [string, string | undefined][] => [
      [`kartu[${index}].judul`, card.judul],
      [`kartu[${index}].dampak`, card.dampak],
      [`kartu[${index}].untukSiapa`, card.untukSiapa],
      [`kartu[${index}].syarat`, card.syarat],
    ]),
  ]
  return [
    ...checkText(page.kutipan, { path: 'kutipan', verbatim: true }),
    ...checkText(page.nama, { path: 'nama', verbatim: true }),
    ...fields.flatMap(([path, value]) =>
      value ? checkText(value, { path }) : []
    ),
  ]
}

/** The handover the owner reads before "ok tulis". */
export function waveMarkdown(
  name: string,
  wave: Wave,
  pages: { page: SituationPage; urutan: number }[],
  missing: readonly string[] = []
): string {
  const gate = pages.map(({ page }) => {
    const findings = pageFindings(page)
    const errors = findings.filter((f) => f.level === 'error').length
    const warnings = findings.length - errors
    const detail = findings
      .map((f) => `${f.rule} di ${f.path} (“${f.excerpt}”)`)
      .join('; ')
    return `| ${page.nama} | ${errors} | ${warnings} | ${page.catatan.length === 0 ? 'lengkap' : page.catatan.join(' ')} | ${detail} |`
  })
  const body = situationMarkdown(
    pages.map(({ page }) => page),
    `Serah ${name}: ${wave.judul}`
  )
  const lines = body.split('\n')
  const title = lines[0] ?? ''
  // The pages start at the first rule; the lines before it name the other
  // script that shares this renderer.
  const rest = lines.slice(lines.indexOf('---') - 1)
  return [
    title,
    '',
    `Gelombang ${name} dari \`docs/RENCANA-KONTEKS-V2.md\` bagian 8.4, fase V3. Dihasilkan \`lib/scripts/chapter-wave.ts --wave ${name}\`; jangan disunting di sini. Isi kartu mengikuti daftar pendek yang Anda setujui (\`docs/DAFTAR-PENDEK.md\`), dan setiap kalimat lain ditulis dari FULL KONTEKS. Tidak ada placeholder. Belum ada yang ditulis ke Sanity; itu menunggu “ok tulis”.`,
    '',
    '## Asal kalimat',
    '',
    ...wave.dasar.map((line) => `- ${line}`),
    '',
    '## Hasil gerbang gaya',
    '',
    '| Bab | Galat | Peringatan | Kelengkapan | Rincian |',
    '| --- | --- | --- | --- | --- |',
    ...gate,
    ...missing.map(
      (situation) =>
        `| ${situation} | 1 | 0 | Bab yang Anda putuskan tidak ditemukan di master brief. |  |`
    ),
    ...rest,
  ].join('\n')
}

async function main() {
  const dir = process.argv.slice(2).find((arg) => !arg.startsWith('--'))
  const arg = (flag: string) => {
    const index = process.argv.indexOf(flag)
    return index === -1 ? undefined : process.argv[index + 1]
  }
  const name = arg('--wave') ?? ''
  const wave: Wave | undefined = Object.hasOwn(WAVES, name)
    ? WAVES[name as keyof typeof WAVES]
    : undefined
  if (!dir || !wave) {
    console.error(
      `Usage: bun lib/scripts/chapter-wave.ts <master brief dir> --wave <${Object.keys(WAVES).join('|')}>`
    )
    process.exit(1)
  }

  const { drafts, situations, bridges } = await readCatalog(dir)
  const pages = wavePages(wave, situations, drafts, bridges)
  const missing = missingChapters(wave, situations)
  const out = arg('--out') ?? `docs/V3-SERAH-${name}.md`
  await writeFile(out, waveMarkdown(name, wave, pages, missing))
  console.log(`${pages.length} halaman bab ditulis ke ${out}.`)

  const errors = pages.flatMap(({ page }) =>
    pageFindings(page).filter((finding) => finding.level === 'error')
  )
  const incomplete = pages.filter(({ page }) => page.catatan.length > 0)
  if (errors.length > 0 || incomplete.length > 0 || missing.length > 0) {
    console.error(
      `${errors.length} galat gaya; ${incomplete.length} halaman belum lengkap; ${missing.length} bab tidak ditemukan.`
    )
    process.exitCode = 1
  }

  const draftsOut = arg('--drafts')
  if (draftsOut) {
    const sideId = arg('--side-id')
    if (!sideId) {
      console.error('--drafts needs --side-id <id>')
      process.exit(1)
    }
    if (process.exitCode === 1) {
      console.error('Draf tidak ditulis: perbaiki galat dan kelengkapan dulu.')
      return
    }
    await writeFile(
      draftsOut,
      pages
        .map(({ page, urutan }) =>
          draftDocuments(page, sideId, drafts, urutan, out)
        )
        .join('')
    )
    console.log(
      `Draf ditulis ke ${draftsOut}. Tidak ada yang ditulis ke Sanity.`
    )
  }
}

if (import.meta.main) await main()
