/**
 * The sixteen offer models from `docs/R1-PENDEKATAN-POLA-OFFER.md`.
 *
 * A model groups offers by what Arthur hands over, not by the situation they
 * sit in, so one template per model can derive a list item from a catalogue
 * row. The model is internal: Studio and the import script read it, and no
 * public query projects it. Readers see the type labels in `READER_TYPE`.
 */

export const OFFER_MODELS = [
  { key: 'sistem-dipasang', title: 'Sistem yang dipasang' },
  { key: 'kanal-pendapatan', title: 'Kanal pendapatan baru' },
  { key: 'angka-laporan', title: 'Angka dan laporan' },
  { key: 'teknis-spesialis', title: 'Pekerjaan teknis spesialis' },
  { key: 'berkas-administrasi', title: 'Berkas dan administrasi proyek' },
  { key: 'lapangan', title: 'Tenaga, alat, dan desain di lapangan' },
  { key: 'proyek-jadi', title: 'Proyek dan bangunan jadi' },
  { key: 'barang', title: 'Barang dan material' },
  { key: 'lewat-mitra', title: 'Lewat mitra berizin' },
  { key: 'bulanan', title: 'Layanan bulanan' },
  { key: 'konten-aset', title: 'Konten dan aset' },
  { key: 'arah-kelas', title: 'Arah, strategi, dan kelas' },
  { key: 'kampanye', title: 'Kampanye berbatas waktu' },
  { key: 'orang', title: 'Orang untuk brand' },
  { key: 'afiliasi', title: 'Afiliasi untuk brand' },
  { key: 'ikut-menjualkan', title: 'Ikut menjualkan' },
] as const

export type OfferModel = (typeof OFFER_MODELS)[number]['key']

export type CatalogUnit = 'konstruksi' | 'teknologi' | 'peekabo'

/** Catalogue type name to the reader label approved in the glossary, §5. */
export const READER_TYPE = new Map<string, string>([
  ['Celah', 'Bagian proyek yang kami ambil'],
  ['Paket', 'Proyek utuh dari hulu ke hilir'],
  ['Pasok', 'Barang dan material'],
  ['Jembatan', 'Modal, alat, dan jaminan lewat mitra'],
  ['Nilai', 'Bangunan yang lebih produktif'],
  ['Rawat', 'Perawatan berkala'],
  ['Bot', 'Bot yang bekerja sendiri'],
  ['Workflow', 'Alur kerja yang berjalan tanpa dikejar'],
  ['Pasar', 'Kanal pendapatan baru'],
  ['Data', 'Angka yang memberi tahu lebih dulu'],
  ['Fondasi', 'Pekerjaan teknis di balik layar'],
  ['Aset', 'Konten dan aset jadi'],
  ['Arah', 'Arah, strategi, dan kelas'],
  ['Kampanye', 'Kampanye berbatas waktu'],
  ['Kelola', 'Dikelola setiap bulan'],
  ['Operator', 'Alatnya kami jalankan'],
  ['Talenta', 'Kreator, host, dan sales'],
  ['Jaringan', 'Dijualkan oleh jaringan'],
])

/** Konstruksi situations whose gap offers hand over paperwork. */
const PAPERWORK_SITUATIONS = [
  'Administrasi dengan pemerintah',
  'Administrasi internal proyek',
  'Konsultan pengadaan',
  'Material: harga',
]

/** Konstruksi situations whose gap offers run through a licensed partner. */
const PARTNER_SITUATIONS = ['Modal kerja', 'Nilai tambah lewat mitra']

const TEKNOLOGI = new Map<string, OfferModel>([
  ['Bot', 'sistem-dipasang'],
  ['Workflow', 'sistem-dipasang'],
  ['Pasar', 'kanal-pendapatan'],
  ['Data', 'angka-laporan'],
  ['Fondasi', 'teknis-spesialis'],
])

const KONSTRUKSI = new Map<string, OfferModel>([
  ['Paket', 'proyek-jadi'],
  ['Nilai', 'proyek-jadi'],
  ['Pasok', 'barang'],
  ['Jembatan', 'lewat-mitra'],
  ['Rawat', 'bulanan'],
])

const PEEKABO = new Map<string, OfferModel>([
  ['Aset', 'konten-aset'],
  ['Arah', 'arah-kelas'],
  ['Kampanye', 'kampanye'],
  ['Talenta', 'orang'],
  ['Jaringan', 'afiliasi'],
  ['Kelola', 'bulanan'],
  ['Operator', 'bulanan'],
])

export type CatalogPlace = {
  unit: CatalogUnit
  side: 'A' | 'B'
  /** The catalogue type, or `undefined` for Konstruksi's assembled packages. */
  type: string | undefined
  situation: string
}

/**
 * The model of one catalogue row. Mechanical by design: the same row always
 * lands in the same model, so the import can run again without review drift.
 */
export function offerModel({
  unit,
  side,
  type,
  situation,
}: CatalogPlace): OfferModel {
  if (unit === 'teknologi') {
    const model = type ? TEKNOLOGI.get(type) : undefined
    if (model) return model
  }

  if (unit === 'konstruksi') {
    // Assembled packages have no type column; they are whole projects.
    if (type === undefined) return 'proyek-jadi'
    if (type === 'Celah') {
      if (PAPERWORK_SITUATIONS.some((name) => situation.startsWith(name)))
        return 'berkas-administrasi'
      if (PARTNER_SITUATIONS.some((name) => situation.startsWith(name)))
        return 'lewat-mitra'
      return 'lapangan'
    }
    const model = KONSTRUKSI.get(type)
    if (model) return model
  }

  if (unit === 'peekabo') {
    // The whole seller side follows the network rules, whatever its type.
    if (side === 'B') return 'ikut-menjualkan'
    const model = type ? PEEKABO.get(type) : undefined
    if (model) return model
  }

  throw new Error(
    `No offer model for ${unit} ${side} "${type}" in "${situation}"`
  )
}
