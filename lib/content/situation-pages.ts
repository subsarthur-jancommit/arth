/**
 * Step 4 of the pattern approach (`docs/R1-PENDEKATAN-POLA-OFFER.md`): a
 * situation page derived from its chapter in the master brief and the offer
 * drafts that are ready, instead of a handwritten handover per page.
 *
 * The page follows section 3 of that document: the buyer's quote, one entry
 * offer marked "Mulai dari sini", the other ready offers grouped by their
 * reader type label, the situation's limits, and one first step. Offers that
 * are held never appear, and neither does any catalogue code.
 */

import type { CatalogUnit } from './offer-models'
import type { ShortlistChapter } from './shortlist'

/**
 * Units whose situation pages are derived today. A unit joins this list in
 * the phase that builds its derivation (docs/RENCANA-KONTEKS-TAYANG.md).
 */
export const DERIVED_UNITS: readonly CatalogUnit[] = ['teknologi']

export type SituationSource = {
  unit: CatalogUnit
  side: 'A' | 'B'
  /** The chapter heading in the master brief. */
  nama: string
  /** The chapter's "Pembeli" line, without the label. */
  pembeli: string
  /** The chapter's "Yang biasa mereka katakan" quote, with its quote marks. */
  kutipan: string
}

/** The fields of an offer draft a situation page reads. */
export type SituationOffer = {
  idKatalog: string
  situation: string
  unit: CatalogUnit
  side: 'A' | 'B'
  judul: string
  dampak: string
  untukSiapa: string
  jenis: string | undefined
  syarat: string | undefined
  lane: 'otomatis' | 'tulis-tangan'
}

export type SituationOverride = {
  situasi?: string
  /** The chapter's buyers as people, for `bab.pembeli`. */
  pembeli?: string
  /** Limits written for this chapter, replacing the unit default. */
  batas?: string
  /** A shorter address than the one derived from the chapter name. */
  slug?: string
  metadata?: { judul: string; deskripsi: string }
  /** Bridge sentences, keyed by the target offer's catalogue code. */
  jembatan?: { offer: string; kalimat: string }[]
  /** The entry offer, when the first ready offer is not the smallest scope. */
  pintuMasuk?: string
}

export type ListItem = {
  judul: string
  dampak: string
  untukSiapa: string
  syarat: string | undefined
  /** Internal: written to `idKatalog`, never rendered. */
  idKatalog: string
}

export type SituationPage = {
  unit: CatalogUnit
  side: 'A' | 'B'
  nama: string
  slug: string
  kutipan: string
  situasi: string
  pembeli?: string
  pintuMasuk: ListItem | undefined
  kelompok: { label: string; items: ListItem[] }[]
  batas: string
  ajakan: { label: string; sesudahnya: string }
  metadata: { judul: string; deskripsi: string }
  jembatan: { kalimat: string; idKatalog: string }[]
  /** Bridges the brief maps, waiting for a sentence. Internal. */
  kandidatJembatan: string[]
  /** How many offers of this chapter are held. Internal. */
  ditahan: number
  /** What still needs a person before the page can be published. Internal. */
  catatan: string[]
  /** The `situation-overrides.ts` key the chapter copy came from. Internal. */
  salinan?: string
}

/** Reader type labels in the order a Teknologi page shows them. */
const TYPE_ORDER = [
  'Bot yang bekerja sendiri',
  'Alur kerja yang berjalan tanpa dikejar',
  'Kanal pendapatan baru',
  'Angka yang memberi tahu lebih dulu',
  'Pekerjaan teknis di balik layar',
]

const MESSAGE_WORDS = /WhatsApp|pesan|pengingat|kabar|notifikasi/i

/** Owner-approved for Kuliner (docs/R1-SERAH-BAB-KULINER.md). */
const CONSENT =
  'Pesan WhatsApp hanya dikirim kepada pelanggan yang setuju menerimanya.'
const COMMISSION =
  'Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.'
const SCOPE =
  'Lingkup tertulis sebelum kerja dimulai; temuan di luar lingkup dicatat, tidak dikerjakan tanpa kesepakatan baru.'

/** The first step per Teknologi reader (glossary, section 6). */
const FIRST_STEP = {
  B: {
    label: 'Minta sesi diagnosis',
    sesudahnya:
      'Di sesi itu kami membedah masalahnya bersama Anda sebelum ada yang dibangun atau dibeli. Biaya konsultasinya bersifat pilihan.',
  },
  A: {
    label: 'Minta audit singkat',
    sesudahnya:
      'Audit singkat berharga tetap, untuk Anda yang belum yakin penyebab masalahnya. Hasilnya menentukan apakah cukup satu layanan atau proyek utuh.',
  },
} as const

/**
 * The first step outside Teknologi, as the side page already states it, so
 * a chapter and its side never promise two different beginnings.
 */
const SIDE_FIRST_STEP = {
  // Konstruksi Sisi B, Alur kerja steps 1 and 2; the side page's langkahPertama.
  'konstruksi/B': {
    label: 'Ceritakan bangunannya',
    sesudahnya: 'Kami survei kondisi lapangan sebelum angka apa pun disebut.',
  },
  // Konstruksi Sisi A, Cara membeli: eceran first; the side's langkahPertama.
  'konstruksi/A': {
    label: 'Mulai dari satu celah',
    sesudahnya:
      'Pilih eceran per masalah untuk bagian yang tidak sanggup Anda tangani; paket hulu-hilir dan paket rakitan dapat menyusul.',
  },
  // Teknologi Sisi A, Lima cara mulai; the side page's langkahPertama.
  'teknologi/A': {
    label: 'Mulai dengan audit singkat',
    sesudahnya:
      'Kami mencari penyebab masalah sebelum Anda memilih satu layanan, proyek utuh, tim khusus, atau pemeliharaan.',
  },
  // Peekabo Sisi A, the side page's langkahPertama (Tangga nilai step 1).
  'peekabo/A': {
    label: 'Mulai dari audit atau sesi strategi',
    sesudahnya:
      'Langkah awal dapat berupa audit, sesi strategi, workshop, atau playbook; produksi, kampanye, tim, talenta, dan jaringan menyusul bila dibutuhkan.',
  },
} as const satisfies Partial<
  Record<`${CatalogUnit}/${'A' | 'B'}`, { label: string; sesudahnya: string }>
>

function sideFirstStep(unit: CatalogUnit, side: 'A' | 'B') {
  const key = `${unit}/${side}`
  return Object.hasOwn(SIDE_FIRST_STEP, key)
    ? SIDE_FIRST_STEP[key as keyof typeof SIDE_FIRST_STEP]
    : undefined
}

/**
 * The chapter name a reader sees: the master brief's heading without the
 * agent's labels (Peta website, Nama bab untuk pembaca), and without the
 * chapter code Peekabo headings end with, since no code is ever shown.
 */
export function readerName(nama: string): string {
  return nama.replace(
    /\s*\((?:lapis|modul) [^)]*\)|\s*\(jembatan\)|\s*\([A-Z]{3}\)$/g,
    ''
  )
}

/** "Kuliner dan F&B" → "kuliner"; "Jasa lokal: salon, …" → "jasa-lokal". */
export function situationSlug(nama: string): string {
  const head = (nama.split(/[,:]/)[0] ?? nama).split(' dan ')[0] ?? nama
  return head
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Lowercase the first letter unless the word is an acronym (UMKM, BUMDes). */
const lowerFirst = (text: string) =>
  /^[A-Z]{2}/.test(text)
    ? text
    : `${text.charAt(0).toLowerCase()}${text.slice(1)}`

/** Catalogue cells carry no final stop; a sentence on the page does. */
const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`)

const item = (offer: SituationOffer): ListItem => ({
  judul: offer.judul,
  dampak: sentence(offer.dampak),
  untukSiapa: offer.untukSiapa,
  syarat: offer.syarat,
  idKatalog: offer.idKatalog,
})

function metadataOf(
  source: SituationSource,
  entry: SituationOffer | undefined
): { judul: string; deskripsi: string } {
  const lead =
    source.side === 'B' ? 'Bot dan workflow untuk' : 'Spesialis teknis untuk'
  const full = lowerFirst(source.nama.split(':')[0] ?? source.nama)
  const head = lowerFirst(source.nama.split(/[,:]/)[0] ?? source.nama)
  // Search titles stop at 60 characters; the first named buyer carries it.
  const judul =
    `${lead} ${full}`.length <= 60 ? `${lead} ${full}` : `${lead} ${head}`
  const opener = `Untuk ${lowerFirst(source.pembeli.replace(/\.$/, ''))}.`
  const step =
    source.side === 'B'
      ? 'Mulai dari sesi diagnosis.'
      : 'Mulai dari audit singkat.'
  const candidates = [
    `${opener} ${entry?.dampak ?? ''}`.trim(),
    `${entry?.dampak ?? ''} ${step}`.trim(),
    opener,
  ]
  return {
    judul,
    deskripsi:
      candidates.find((text) => text.length <= 155) ?? opener.slice(0, 155),
  }
}

/** Derive one Teknologi situation page. Pure, so a test can pin it. */
export function deriveSituation(
  source: SituationSource,
  offers: SituationOffer[],
  bridges: [string, string][],
  override: SituationOverride = {}
): SituationPage {
  const inChapter = offers.filter(
    (offer) =>
      offer.unit === source.unit &&
      offer.side === source.side &&
      offer.situation === source.nama
  )
  const ready = inChapter.filter((offer) => offer.lane === 'otomatis')
  const entry =
    ready.find((offer) => offer.idKatalog === override.pintuMasuk) ?? ready[0]
  const rest = ready.filter((offer) => offer !== entry)

  const groups = Map.groupBy(rest, (offer) => offer.jenis ?? 'Lainnya')
  const kelompok = [...groups]
    .toSorted(
      ([a], [b]) =>
        (TYPE_ORDER.indexOf(a) + 1 || 99) - (TYPE_ORDER.indexOf(b) + 1 || 99)
    )
    .map(([label, items]) => ({ label, items: items.map(item) }))

  const shown = [entry, ...rest].filter((offer) => offer !== undefined)
  const sendsMessages = shown.some((offer) =>
    MESSAGE_WORDS.test(`${offer.judul} ${offer.dampak}`)
  )
  const batas =
    source.side === 'B'
      ? [sendsMessages ? CONSENT : undefined, COMMISSION]
          .filter(Boolean)
          .join(' ')
      : `${SCOPE} ${COMMISSION}`

  const readyIds = new Set(
    offers.filter((o) => o.lane === 'otomatis').map((o) => o.idKatalog)
  )
  const chapterIds = new Set(ready.map((offer) => offer.idKatalog))
  const kandidatJembatan = bridges
    .filter(([a, b]) => chapterIds.has(a) !== chapterIds.has(b))
    .map(([a, b]) => (chapterIds.has(a) ? b : a))
    .filter((target) => readyIds.has(target) && !chapterIds.has(target))

  const jembatan = (override.jembatan ?? [])
    .slice(0, 2)
    .map(({ offer, kalimat }) => ({ kalimat, idKatalog: offer }))

  const metadata = override.metadata ?? metadataOf(source, entry)
  const catatan: string[] = []
  if (ready.length < 3)
    catatan.push(
      `Hanya ${ready.length} pekerjaan siap; halaman bab butuh paling sedikit tiga.`
    )
  if (metadata.judul.length > 60)
    catatan.push('Judul mesin pencari lebih dari 60 karakter.')
  if (kandidatJembatan.length > 0 && jembatan.length === 0)
    catatan.push(
      'Jembatan dipetakan di master brief; kalimatnya ditulis saat halaman tujuannya terbit.'
    )

  return {
    unit: source.unit,
    side: source.side,
    nama: source.nama,
    slug: situationSlug(source.nama),
    kutipan: source.kutipan,
    situasi: override.situasi ?? `Untuk ${lowerFirst(source.pembeli)}`,
    pintuMasuk: entry ? item(entry) : undefined,
    kelompok,
    batas,
    ajakan: FIRST_STEP[source.side],
    metadata,
    jembatan,
    kandidatJembatan: [...new Set(kandidatJembatan)],
    ditahan: inChapter.length - ready.length,
    catatan,
  }
}

/**
 * One chapter page from the owner's shortlist (`shortlist.ts`): exactly the
 * offers decided, with the decided entry first. The rest are grouped by type,
 * as the chapter template shows them, and the groups follow the order in
 * which the shortlist first places each type. The page carries no choice of
 * its own, so it works for every unit. What still needs a person lands in
 * `catatan` instead of being guessed.
 */
export function shortlistSituation(
  chapter: ShortlistChapter,
  source: SituationSource,
  offers: SituationOffer[],
  bridges: [string, string][],
  override: SituationOverride = {}
): SituationPage {
  const inChapter = offers.filter(
    (offer) =>
      offer.unit === chapter.unit &&
      offer.side === chapter.side &&
      offer.situation === chapter.situation
  )
  const byId = new Map(inChapter.map((offer) => [offer.idKatalog, offer]))
  const catatan: string[] = []
  if (chapter.ditahanBab)
    catatan.push('Bab ditahan utuh; halaman babnya tidak dibuat.')

  const picked = chapter.pilihan.flatMap(({ id }) => {
    const offer = byId.get(id)
    if (!offer) {
      catatan.push(`${id} tidak ada di bab ini.`)
      return []
    }
    if (offer.lane !== 'otomatis') {
      catatan.push(`${id} belum siap tayang.`)
      return []
    }
    return [offer]
  })
  const entry = picked.find((offer) => offer.idKatalog === chapter.entri)
  const rest = picked.filter((offer) => offer !== entry)
  // Groups follow the shortlist: a type appears where its first offer was
  // placed, because the order answers the quote clause by clause.
  const kelompok = [
    ...Map.groupBy(rest, (offer) => offer.jenis ?? 'Lainnya'),
  ].map(([label, items]) => ({ label, items: items.map(item) }))

  const ajakan =
    sideFirstStep(chapter.unit, chapter.side) ??
    (chapter.unit === 'teknologi' ? FIRST_STEP[chapter.side] : undefined)

  if (!chapter.ditahanBab && picked.length < 3)
    catatan.push(
      `Hanya ${picked.length} pekerjaan siap; halaman bab butuh paling sedikit tiga.`
    )
  if (!chapter.ditahanBab && !entry)
    catatan.push('Pintu masuk tidak ada di antara pekerjaan yang tayang.')
  if (!override.batas) catatan.push('Batas bab ini belum ditulis.')
  if (!override.situasi) catatan.push('Situasi bab ini belum ditulis.')
  if (!override.metadata) catatan.push('Teks mesin pencari belum ditulis.')
  if (!ajakan) catatan.push('Langkah pertama sisi ini belum ditulis.')

  const metadata = override.metadata ?? metadataOf(source, entry)
  if (metadata.judul.length > 60)
    catatan.push('Judul mesin pencari lebih dari 60 karakter.')
  if (metadata.deskripsi.length > 155)
    catatan.push('Deskripsi mesin pencari lebih dari 155 karakter.')

  const readyIds = new Set(
    offers.filter((o) => o.lane === 'otomatis').map((o) => o.idKatalog)
  )
  const chapterIds = new Set(picked.map((offer) => offer.idKatalog))
  const kandidatJembatan = bridges
    .filter(([a, b]) => chapterIds.has(a) !== chapterIds.has(b))
    .map(([a, b]) => (chapterIds.has(a) ? b : a))
    .filter((target) => readyIds.has(target) && !chapterIds.has(target))
  const jembatan = (override.jembatan ?? [])
    .slice(0, 2)
    .map(({ offer, kalimat }) => ({ kalimat, idKatalog: offer }))

  const nama = readerName(source.nama)
  const salinan = `${chapter.unit}/${chapter.side}/${situationSlug(nama)}`
  return {
    unit: chapter.unit,
    side: chapter.side,
    nama,
    slug: override.slug ?? situationSlug(nama),
    kutipan: source.kutipan,
    situasi: override.situasi ?? `Untuk ${lowerFirst(source.pembeli)}`,
    ...(override.pembeli ? { pembeli: override.pembeli } : {}),
    pintuMasuk: entry ? item(entry) : undefined,
    kelompok,
    batas: override.batas ?? '',
    ajakan: ajakan ?? { label: '', sesudahnya: '' },
    metadata,
    jembatan,
    kandidatJembatan: [...new Set(kandidatJembatan)],
    // Held means not ready to publish; an offer the owner simply did not
    // pick is still ready and is not counted here.
    ditahan: inChapter.filter((offer) => offer.lane !== 'otomatis').length,
    catatan,
    ...(Object.keys(override).length > 0 ? { salinan } : {}),
  }
}

const line = (entry: ListItem) =>
  `**${entry.judul}**  \n${entry.dampak}  \n_${entry.untukSiapa}_${entry.syarat ? `  \nSyarat: ${entry.syarat}` : ''}`

/** The pages as a buyer reads them, for the owner's review. */
export function situationMarkdown(
  pages: SituationPage[],
  title: string
): string {
  const out = [
    `# ${title}`,
    '',
    'Dihasilkan `lib/scripts/import-catalog.ts --situations` dari master brief,',
    '`lib/content/catalog-overrides.ts`, dan `lib/content/situation-overrides.ts`.',
    'Jangan disunting di sini. Kode katalog hanya ada di catatan internal tiap halaman.',
  ]
  for (const page of pages) {
    out.push('', '---', '', `## ${page.nama}`, '', `> ${page.kutipan}`)
    if (page.pembeli) out.push('', `_${page.pembeli}_`)
    if (page.pintuMasuk)
      out.push('', `**Mulai dari sini.** ${line(page.pintuMasuk)}`)
    for (const group of page.kelompok) {
      out.push('', `### ${group.label}`, '')
      out.push(group.items.map(line).join('\n\n'))
    }
    out.push('', '### Batas dan syarat', '', page.batas)
    if (page.jembatan.length > 0) {
      out.push('', '### Bila pekerjaannya berlanjut', '')
      out.push(page.jembatan.map((bridge) => bridge.kalimat).join('\n\n'))
    }
    out.push(
      '',
      '### Langkah pertama',
      '',
      `**[ ${page.ajakan.label} ]**`,
      '',
      page.ajakan.sesudahnya
    )
    out.push(
      '',
      `**Di daftar situasi:** ${page.situasi}`,
      '',
      `**Mesin pencari:** ${page.metadata.judul} · ${page.metadata.deskripsi}`
    )
    const internal = [
      `alamat \`${page.slug}\``,
      `pintu masuk ${page.pintuMasuk?.idKatalog ?? 'tidak ada'}`,
      `${page.ditahan} ditahan`,
      page.kandidatJembatan.length > 0
        ? `kandidat jembatan ${page.kandidatJembatan.join(', ')}`
        : undefined,
      ...page.catatan,
    ].filter(Boolean)
    out.push('', `_Internal: ${internal.join('; ').replace(/\.$/, '')}._`)
  }
  return `${out.join('\n')}\n`
}
