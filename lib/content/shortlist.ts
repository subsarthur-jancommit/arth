/**
 * The shortlist: which offers each chapter shows (docs/RENCANA-KONTEKS-V2.md,
 * V2; Peta website, “Memilih offer yang tayang”).
 *
 * The site shows a choice, not the catalogue: three to seven offers per
 * chapter, chosen against the chapter's buyer quote, one per kind before a
 * second of the same kind, with the smallest-scope offer as the way in. The
 * agent proposes here; the owner decides in docs/DAFTAR-PENDEK.md, and only
 * then is anything written to Sanity.
 *
 * Catalogue IDs live in this file and the handover only. They never reach a
 * reader (Peta website, “Dari baris katalog ke kartu website”).
 */

import { MAX_OFFERS_PER_CHAPTER, MIN_OFFERS_PER_CHAPTER } from './content-graph'

export interface ShortlistPick {
  id: string
  /** Why this offer, in one line: which part of the buyer quote it answers. */
  alasan: string
}

export interface ShortlistHold {
  id: string
  alasan: string
}

export interface ShortlistChapter {
  unit: 'konstruksi' | 'teknologi' | 'peekabo'
  side: 'A' | 'B'
  /** The chapter's heading in the master brief, as `readCatalog` names it. */
  situation: string
  /** The offer that opens the chapter: the smallest scope in the list. */
  entri: string
  /** In display order. */
  pilihan: readonly ShortlistPick[]
  /** Offers held back on purpose, with the decision or rule that holds them. */
  tahan?: readonly ShortlistHold[]
  /** What the owner needs to know before deciding this chapter. */
  catatan?: string
  /** The owner's decision, once given: the date and what was decided. */
  keputusan?: string
  /**
   * Set when the whole chapter is held: every offer waits on a decision, or
   * the catalogue has fewer than three. The chapter then shows on its side
   * page as a situation without a page (docs/RENCANA-KONTEKS-V2.md §4.2),
   * and `pilihan` stays empty.
   */
  ditahanBab?: string
}

/** The catalogue facts a shortlist check needs about one offer. */
export interface ShortlistOffer {
  idKatalog: string
  situation: string
  jenis: string | undefined
  syarat: string | undefined
  lane: 'otomatis' | 'tulis-tangan'
  reasons: readonly string[]
}

export interface ShortlistFinding {
  level: 'error' | 'warning'
  message: string
}

const isHeld = (offer: ShortlistOffer) =>
  offer.reasons.some((reason) => /tertahan|‡/u.test(reason))

const needsSafeWording = (offer: ShortlistOffer) =>
  offer.reasons.some((reason) => reason.startsWith('†')) && !offer.syarat

/** Every rule of “Memilih offer yang tayang” this proposal can break. */
export function checkShortlist(
  chapter: ShortlistChapter,
  offers: readonly ShortlistOffer[]
): ShortlistFinding[] {
  const findings: ShortlistFinding[] = []
  const inChapter = new Map(
    offers
      .filter((offer) => offer.situation === chapter.situation)
      .map((offer) => [offer.idKatalog, offer])
  )
  const ids = chapter.pilihan.map((pick) => pick.id)

  if (chapter.ditahanBab) {
    return ids.length > 0
      ? [
          {
            level: 'error',
            message: 'bab ditahan tetapi daftarnya berisi offer',
          },
        ]
      : []
  }

  if (
    ids.length < MIN_OFFERS_PER_CHAPTER ||
    ids.length > MAX_OFFERS_PER_CHAPTER
  ) {
    findings.push({
      level: 'error',
      message: `${ids.length} offer; bab memuat ${MIN_OFFERS_PER_CHAPTER} sampai ${MAX_OFFERS_PER_CHAPTER}`,
    })
  }
  if (new Set(ids).size !== ids.length) {
    findings.push({
      level: 'error',
      message: 'ada offer yang dipilih dua kali',
    })
  }
  if (!ids.includes(chapter.entri)) {
    findings.push({
      level: 'error',
      message: `pintu masuk ${chapter.entri} tidak ada di daftar`,
    })
  }

  for (const id of ids) {
    const offer = inChapter.get(id)
    if (!offer) {
      findings.push({ level: 'error', message: `${id} bukan offer bab ini` })
      continue
    }
    if (isHeld(offer)) {
      findings.push({
        level: 'error',
        message: `${id} tertahan: ${offer.reasons.join('; ')}`,
      })
    }
    if (needsSafeWording(offer)) {
      findings.push({
        level: 'error',
        message: `${id} bertanda † tanpa rumusan aman`,
      })
    }
  }

  // One per kind before a second of the same kind.
  const kinds = ids.map((id) => inChapter.get(id)?.jenis ?? '')
  const distinct = new Set(kinds).size
  if (new Set(kinds.slice(0, distinct)).size !== distinct) {
    findings.push({
      level: 'warning',
      message:
        'urutan mengulang satu jenis sebelum semua jenis di daftar muncul',
    })
  }

  return findings
}

/**
 * The proposals, one side per handover. Konstruksi Pemilik bangunan is W2,
 * the first wave after the frame; Kuliner is trimmed because it is already
 * live with eleven offers.
 */
export const SHORTLIST_PROPOSALS: readonly ShortlistChapter[] = [
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Kuliner dan F&B',
    entri: 'KUL-01',
    pilihan: [
      { id: 'KUL-01', alasan: '“Pesanan saya bercampur di chat”' },
      { id: 'KUL-02', alasan: '“kasir kewalahan saat ramai”' },
      {
        id: 'KUL-07',
        alasan: 'Kanal pendapatan; halamannya sudah disetujui di R1',
      },
      {
        id: 'KUL-03',
        alasan: 'Kasir dan dapur saat ramai; halamannya sudah disetujui di R1',
      },
      { id: 'KUL-08', alasan: '“bahan sering habis atau terbuang”' },
      {
        id: 'KUL-05',
        alasan: 'Katering: pesanan acara menjadi jadwal masak dan antar',
      },
      { id: 'KUL-06', alasan: 'Produsen makanan: pasar di luar kota' },
    ],
    tahan: [
      {
        id: 'KUL-04',
        alasan: 'Tidak dipilih: jenis Bot sudah diwakili tiga kali',
      },
      { id: 'KUL-09', alasan: 'Tidak dipilih: tidak menjawab kutipan bab' },
      {
        id: 'KUL-10',
        alasan: 'Tidak dipilih: untuk franchise, bukan pembeli utama bab',
      },
      {
        id: 'KUL-11',
        alasan:
          'Tidak dipilih: Layar pesanan di dapur sudah mewakili jenis Data',
      },
    ],
    catatan:
      'Bab ini sudah tayang dengan 11 offer. Keempat offer yang tidak dipilih perlu dicabut dari tayang (unpublish) di Studio; itu tindakan terbit, jadi menunggu izin Anda tersendiri.',
  },
  {
    unit: 'konstruksi',
    side: 'B',
    situation: 'Rumah tinggal dan konsumen akhir (lapis 1)',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    entri: 'RMH-10',
    pilihan: [
      {
        id: 'RMH-10',
        alasan: '“Saya takut anggaran membengkak”: angka sebelum memutuskan',
      },
      {
        id: 'RMH-01',
        alasan: 'Rumah pertama, dari hulu ke hilir, garansi tertulis',
      },
      { id: 'RMH-16', alasan: 'Sesudah serah terima: garansi' },
      {
        id: 'RMH-09',
        alasan: '“pekerjaan tidak diawasi”: pengawas atas nama pemilik',
      },
      { id: 'RMH-14', alasan: 'Biaya tersembunyi terdata sebelum renovasi' },
      { id: 'RMH-02', alasan: 'Pemilik rumah lama: renovasi dengan estimasi' },
    ],
    tahan: [
      {
        id: 'RMH-03',
        alasan:
          'Cadangan: bertanda †, rumusan aman sudah ada; pilih bila Anda ingin tambah lantai tampil',
      },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'B',
    situation: 'Desain interior: teknis lapangan dan visualisasi (lapis 1)',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    entri: 'ITR-01',
    pilihan: [
      {
        id: 'ITR-01',
        alasan: 'Langkah terkecil: kebutuhan ruang dirumuskan dulu',
      },
      { id: 'ITR-10', alasan: 'Satu pihak dari visual sampai serah terima' },
      { id: 'ITR-02', alasan: '“tidak bisa membayangkannya”' },
      { id: 'ITR-04', alasan: '“tukang tidak paham maksud saya”' },
      { id: 'ITR-05', alasan: 'Biaya interior dari gambar, bukan tebakan' },
    ],
    catatan:
      'Halaman bab memuat kalimat wajib desain: visual adalah gambaran rencana, bukan jaminan hasil fisik.',
  },
  {
    unit: 'konstruksi',
    side: 'B',
    situation: 'Konstruksi F&B (lapis 3)',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    entri: 'FNB-06',
    pilihan: [
      { id: 'FNB-06', alasan: '“alur dapurnya belum jalan”: lingkup terkecil' },
      {
        id: 'FNB-01',
        alasan:
          '“Lokasinya sudah dapat”: kafe siap buka; jembatan ke Pesan dan bayar dari meja',
      },
      { id: 'FNB-10', alasan: 'Sesudah buka: perawatan outlet' },
      { id: 'FNB-05', alasan: 'Kafe yang menarik: kapasitas duduk' },
      { id: 'FNB-03', alasan: 'Katering dan produsen: dapur produksi' },
      { id: 'FNB-09', alasan: 'Kedai lama yang sudah berjalan' },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'B',
    situation: 'Studio streaming dan workshop media (lapis 3)',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    entri: 'STD-03',
    pilihan: [
      { id: 'STD-03', alasan: 'Langkah terkecil: pencahayaan set' },
      { id: 'STD-04', alasan: '“set saya berantakan”' },
      { id: 'STD-01', alasan: '“Siaran saya terganggu gema”' },
      {
        id: 'STD-09',
        alasan: 'Ruangan biasa jadi studio; jembatan ke Peekabo live',
      },
      {
        id: 'STD-02',
        alasan:
          '“dan listrik”: bertanda †, dikerjakan mitra instalatir berwenang',
      },
      { id: 'STD-08', alasan: 'Podcaster' },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'B',
    situation: 'Makeover villa, kontrakan, hotel, dan hostel (lapis 3)',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    entri: 'HOS-09',
    pilihan: [
      {
        id: 'HOS-09',
        alasan: 'Langkah terkecil: unit dibenahi di antara dua penyewa',
      },
      { id: 'HOS-05', alasan: 'Kamar mandi yang layak' },
      { id: 'HOS-02', alasan: '“Properti saya kusam dan sulit disewakan”' },
      { id: 'HOS-07', alasan: 'Kebocoran musim hujan yang mengganggu tamu' },
      { id: 'HOS-01', alasan: 'Villa yang siap difoto dan ditawarkan' },
      { id: 'HOS-10', alasan: 'Investor: kos baru' },
    ],
    tahan: [
      {
        id: 'HOS-08',
        alasan:
          'Tidak dipilih: “area luar menjadi nilai jual” tidak punya pegangan kerja',
      },
      {
        id: 'HOS-06',
        alasan: 'Tidak dipilih: dampaknya kata sifat (“menarik dari luar”)',
      },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'B',
    situation: 'Membership Care (lapis 4)',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    entri: 'RWT-02',
    pilihan: [
      {
        id: 'RWT-02',
        alasan: '“tidak ada yang merawatnya secara rutin”: inspeksi bulanan',
      },
      { id: 'RWT-04', alasan: 'Kebocoran dicegah sebelum musim hujan' },
      { id: 'RWT-10', alasan: 'Laporan kondisi yang bisa dibaca' },
      { id: 'RWT-05', alasan: '“cepat kusam”: cat dan fasad berkala' },
      { id: 'RWT-03', alasan: 'Kerusakan mendadak' },
    ],
    tahan: [
      {
        id: 'RWT-01',
        alasan: 'Menunggu keputusan ekonomi Membership Care (D5)',
      },
      {
        id: 'RWT-09',
        alasan: 'Menunggu keputusan ekonomi Membership Care (D5)',
      },
      { id: 'RWT-11', alasan: 'Membership penginapan ikut keputusan D5' },
    ],
    catatan:
      'Bentuk hubungan kerja pekerja Membership Care belum diputuskan (keputusan lintas unit 3); halaman bab tidak menyebutnya.',
  },
  {
    unit: 'konstruksi',
    side: 'B',
    situation: 'Nilai tambah lewat mitra (jembatan)',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    entri: 'KOM-01',
    pilihan: [
      {
        id: 'KOM-01',
        alasan: '“Saya butuh pembiayaan”: renovasi lewat mitra berizin',
      },
      { id: 'KOM-06', alasan: 'Peralatan dapur atau studio lewat mitra' },
      {
        id: 'KOM-03',
        alasan: 'Properti hasil makeover lewat perantara berizin',
      },
    ],
    tahan: [
      {
        id: 'KOM-02',
        alasan: 'Mitra asuransi belum ada (master brief, jalur komisi)',
      },
      { id: 'KOM-05', alasan: 'Mitra sewa alat berat belum ada' },
      {
        id: 'KOM-04',
        alasan:
          '“Kenaikan nilai terukur” adalah hasil pasar, bukan pekerjaan Arthur',
      },
    ],
    catatan:
      'Bab ini tepat tiga offer. Halaman memuat kalimat wajib pembiayaan dan pengungkapan komisi; mitra tidak disebut namanya. Bila Anda lebih suka menahan bab ini sampai kartu komisi ada, bab tampil sebagai situasi tanpa halaman.',
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Paket hulu-hilir untuk kontraktor utama',
    entri: 'HHK-03',
    pilihan: [
      {
        id: 'HHK-03',
        alasan:
          'Lingkup terkecil: toilet dan sanitasi sekolah, fungsinya diuji sebelum serah terima',
      },
      {
        id: 'HHK-01',
        alasan:
          '“belum punya subkon yang sanggup menangani semuanya”: rehabilitasi ruang kelas',
      },
      {
        id: 'HHK-04',
        alasan:
          'Atap, plafon, dan drainase dalam satu lingkup, bukan tiga subkon',
      },
      { id: 'HHK-07', alasan: 'Drainase dan saluran' },
      { id: 'HHK-06', alasan: 'Jalan lingkungan cor beton' },
      { id: 'HHK-14', alasan: 'Beberapa pekerjaan dalam satu kontrak subkon' },
      { id: 'HHK-11', alasan: 'Proyek swasta: ruko dan bangunan komersial' },
    ],
    tahan: [
      {
        id: 'HHK-13',
        alasan:
          'Cadangan: bertanda †, kerja sama operasi; pilih bila Anda ingin paket besar tampil',
      },
    ],
    catatan:
      'Urutan bab di halaman Pelaku proyek mengikuti D2: kontraktor utama lebih dulu, jadi bab ini dibuka pertama.',
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Administrasi dengan pemerintah (modul A)',
    entri: 'ADM-01',
    pilihan: [
      {
        id: 'ADM-01',
        alasan:
          '“tender terlewat”: paket di tiga wilayah terkumpul setiap minggu',
      },
      { id: 'ADM-15', alasan: 'Satu tim dari pemantauan sampai penawaran' },
      {
        id: 'ADM-03',
        alasan: '“Dokumen menumpuk”: kualifikasi lengkap sebelum tenggat',
      },
      { id: 'ADM-12', alasan: '“berkas termin selalu terlambat”' },
      { id: 'ADM-05', alasan: 'Harga penawaran dari volume dan harga pasar' },
      {
        id: 'ADM-02',
        alasan: 'Ikut atau lewati diputuskan dari syarat dan HPS',
      },
    ],
    tahan: [
      {
        id: 'ADM-08',
        alasan:
          'Tidak dipilih: bertanda †; sertifikasi lebih aman dibicarakan langsung daripada ditayangkan',
      },
    ],
    catatan:
      'Halaman bab memuat kalimat wajib tender: kami membantu menyiapkan berkas dan memahami aturan, bukan mengatur hasil; nama dan sertifikat tidak dipinjamkan.',
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Tenaga kerja (modul B)',
    entri: 'TNK-01',
    pilihan: [
      { id: 'TNK-01', alasan: '“Tukang tidak datang tepat waktu”' },
      {
        id: 'TNK-03',
        alasan: '“tidak ada yang mengendalikan mereka di lapangan”',
      },
      { id: 'TNK-05', alasan: 'Tim finishing yang terbiasa' },
      { id: 'TNK-12', alasan: 'Absensi dan upah tukang tertib' },
      { id: 'TNK-14', alasan: 'Tenggat ketat tanpa merekrut tetap' },
      {
        id: 'TNK-06',
        alasan: 'Pelaksana di lokasi; bertanda †, nama tidak dipinjamkan',
      },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Material: harga dan penjadwalan (modul C)',
    entri: 'MAT-01',
    pilihan: [
      {
        id: 'MAT-01',
        alasan:
          '“Harga material bergeser”: harga tiga wilayah sebagai pegangan',
      },
      { id: 'MAT-04', alasan: 'Material dengan harga jaringan pemasok' },
      { id: 'MAT-03', alasan: '“jadwalnya tidak sinkron”: material per tahap' },
      { id: 'MAT-08', alasan: '“barang telat”: angkutan sampai lokasi' },
      { id: 'MAT-14', alasan: 'Tiga penawaran dibandingkan sebelum membeli' },
      { id: 'MAT-10', alasan: 'Material masuk, terpakai, dan sisa tercatat' },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Modal kerja lewat penjembatanan (modul D)',
    entri: 'MOD-06',
    pilihan: [
      {
        id: 'MOD-06',
        alasan: 'Lingkup terkecil: kebutuhan kas dan jadwal termin terproyeksi',
      },
      { id: 'MOD-01', alasan: '“material harus dibayar dulu”: tempo material' },
      {
        id: 'MOD-04',
        alasan: '“tagihan termin belum turun”: bertanda †, lewat mitra berizin',
      },
      {
        id: 'MOD-03',
        alasan: '“Uang muka belum cair”: bertanda †, lewat mitra berizin',
      },
      { id: 'MOD-08', alasan: 'Alat dan kendaraan lewat mitra; bertanda †' },
    ],
    tahan: [
      {
        id: 'MOD-02',
        alasan: 'Mitra penjamin belum ada (master brief, jalur komisi)',
      },
      { id: 'MOD-07', alasan: 'Mitra asuransi belum ada' },
      { id: 'MOD-05', alasan: 'Cadangan: kerja sama operasi bertanda †' },
    ],
    catatan:
      'Mekanisme modal kerja belum diputuskan; bab ini ditulis sebagai penjembatanan lewat mitra, sesuai saran master brief. Halaman memuat kalimat wajib: kami tidak memberi pinjaman, pembiayaan dan jaminan berjalan lewat mitra berizin, dan komisi mitra diungkapkan.',
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Alat dan peralatan (modul E)',
    entri: 'ALT-02',
    pilihan: [
      {
        id: 'ALT-02',
        alasan:
          '“Saya butuh alat hanya beberapa hari”: molen, stamper, perancah per hari',
      },
      {
        id: 'ALT-04',
        alasan: 'Alat dengan operator dan BBM dalam satu harga harian',
      },
      { id: 'ALT-03', alasan: 'Alat diantar dan dijemput sesuai jadwal' },
      { id: 'ALT-05', alasan: 'Alat diperiksa sebelum dipakai' },
    ],
    tahan: [
      {
        id: 'ALT-01',
        alasan: 'Mitra sewa alat berat belum ada (master brief, jalur komisi)',
      },
      {
        id: 'ALT-06',
        alasan:
          'Tidak dipilih: mengandaikan alat milik sendiri yang belum tercatat',
      },
    ],
    catatan:
      'Paket alat siap kerja ditulis tanpa alat berat sampai mitra sewa alat berat ada.',
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Administrasi internal proyek (modul F)',
    entri: 'PRJ-04',
    pilihan: [
      {
        id: 'PRJ-04',
        alasan: 'Lingkup terkecil: foto progres 0, 50, dan 100 persen',
      },
      { id: 'PRJ-03', alasan: '“Laporan lewat chat”: format pemberi kerja' },
      { id: 'PRJ-02', alasan: '“kurva S tidak jelas”' },
      { id: 'PRJ-07', alasan: '“biaya lapangan tidak terpantau”' },
      { id: 'PRJ-05', alasan: 'Opname volume untuk termin' },
      {
        id: 'PRJ-14',
        alasan: 'Laporan dari ponsel; jembatan ke unit Teknologi',
      },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Konsultan pengadaan untuk penyedia barang (modul G)',
    entri: 'PNY-01',
    pilihan: [
      {
        id: 'PNY-01',
        alasan: '“bingung mencari barang”: sumber dan harga pembanding',
      },
      {
        id: 'PNY-02',
        alasan: 'Barang diproduksi lewat mitra sesuai spesifikasi',
      },
      { id: 'PNY-07', alasan: '“mengurus TKDN”' },
      {
        id: 'PNY-12',
        alasan: '“margin sehat”: bertanda †, keuntungan wajar dalam HPS',
      },
      { id: 'PNY-08', alasan: 'Etalase katalog elektronik terurus' },
      { id: 'PNY-03', alasan: 'Barang diperiksa sebelum dikirim' },
    ],
    catatan:
      'Konsultan pengadaan hanya melayani paket yang bukan milik Arthur (Konstruksi aturan 3); halaman menyebutnya.',
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Arthur sebagai penyedia untuk instansi (modul G)',
    entri: 'GOV-03',
    pilihan: [
      { id: 'GOV-03', alasan: 'Lingkup terkecil: papan nama dan signage' },
      {
        id: 'GOV-07',
        alasan: '“barang sesuai spesifikasi”: datang bersama pemasangan',
      },
      { id: 'GOV-01', alasan: 'Perabot sekolah' },
      { id: 'GOV-02', alasan: 'Perabot dan perlengkapan kantor' },
      { id: 'GOV-06', alasan: 'Dipesan langsung lewat e-purchasing' },
      { id: 'GOV-08', alasan: 'Klaim garansi ditangani' },
    ],
    tahan: [
      {
        id: 'GOV-05',
        alasan: 'Mitra konveksi belum ada (master brief, jalur komisi)',
      },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Developer perumahan (modul H)',
    entri: 'DEV-05',
    pilihan: [
      {
        id: 'DEV-05',
        alasan:
          'Lingkup terkecil: daftar periksa tiap unit sebelum serah terima',
      },
      { id: 'DEV-02', alasan: '“finishing telat”' },
      {
        id: 'DEV-07',
        alasan: 'Kawasan dirawat sampai diserahkan ke pengelola',
      },
      { id: 'DEV-06', alasan: '“komplain menumpuk”' },
      { id: 'DEV-09', alasan: '“laporan untuk bank belum siap”' },
      {
        id: 'DEV-01',
        alasan: 'Borongan per unit dengan harga yang disepakati',
      },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Kontraktor swasta (lapis 2)',
    entri: 'KSW-01',
    pilihan: [
      {
        id: 'KSW-01',
        alasan: '“kekurangan tenaga”: tukang dan mandor untuk renovasi',
      },
      { id: 'KSW-02', alasan: '“material tepat waktu”' },
      { id: 'KSW-04', alasan: 'Finishing dan materialnya dalam satu paket' },
      { id: 'KSW-03', alasan: 'Tempo material lewat mitra' },
      { id: 'KSW-08', alasan: 'Mutu diawasi sebelum serah terima' },
      { id: 'KSW-06', alasan: 'RAB dan jadwal untuk penawaran ke klien' },
    ],
  },
  {
    unit: 'konstruksi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Paket rakitan menurut profil pembeli',
    entri: 'RAK-09',
    pilihan: [
      {
        id: 'RAK-09',
        alasan: 'Lingkup terkecil: tenaga terkendali dan terbayar tertib',
      },
      { id: 'RAK-01', alasan: 'Kontraktor utama dengan tender pertama' },
      {
        id: 'RAK-03',
        alasan:
          'Termin tertunda karena berkas; contoh kalibrasi yang sudah ditulis',
      },
      { id: 'RAK-08', alasan: 'Subkon baru' },
      { id: 'RAK-10', alasan: 'Harga material yang terus bergeser' },
      { id: 'RAK-16', alasan: 'Developer menjelang serah terima unit' },
      { id: 'RAK-12', alasan: 'Penyedia baru di katalog elektronik' },
    ],
    tahan: [
      { id: 'RAK-07', alasan: 'Menunggu keputusan mekanisme modal kerja' },
      {
        id: 'RAK-04',
        alasan:
          'Tidak dipilih: dampak “tanpa temuan berulang” ada di tangan pemeriksa',
      },
      {
        id: 'RAK-13',
        alasan: 'Tidak dipilih: dampak “tanpa retur” ada di tangan instansi',
      },
    ],
    catatan:
      'Tujuh paket mewakili tujuh posisi pembeli; paket lain tetap bisa dirakit lewat percakapan.',
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Ritel, fesyen, dan e-commerce',
    entri: 'RIT-01',
    pilihan: [
      { id: 'RIT-01', alasan: '“stok saya tidak sinkron”' },
      { id: 'RIT-08', alasan: 'Toko fisik dan online tercatat di satu tempat' },
      {
        id: 'RIT-03',
        alasan: '“Saya bergantung pada marketplace”: toko brand sendiri',
      },
      { id: 'RIT-10', alasan: 'Produk yang sering dibeli bersama' },
      {
        id: 'RIT-09',
        alasan: '“pelanggan datang sekali lalu hilang”: poin dan membership',
      },
      { id: 'RIT-02', alasan: 'Pertanyaan harga dan ongkir dijawab seketika' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Distributor, grosir, dan toko bangunan',
    entri: 'DIS-01',
    pilihan: [
      { id: 'DIS-01', alasan: '“Pesanan sales masuk lewat chat”' },
      { id: 'DIS-09', alasan: '“stok selisih”: opname dengan barcode' },
      {
        id: 'DIS-05',
        alasan: 'Pembeli grosir memesan sendiri sesuai levelnya',
      },
      { id: 'DIS-10', alasan: 'Penjualan per sales dan stok menipis terlihat' },
      {
        id: 'DIS-04',
        alasan: '“piutang telat”: pengingat bertahap lewat WhatsApp',
      },
      {
        id: 'DIS-08',
        alasan:
          '“harga pemasok naik tanpa kabar”: bertanda †, harga jual tetap Anda yang menentukan',
      },
    ],
    catatan:
      'Dampak DIS-04 di katalog (“kas lebih lancar”) ditulis ulang di halaman sebagai pekerjaannya: pengingat piutang terkirim bertahap.',
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Jasa lokal: salon, bengkel, laundry, kos, dan rental',
    entri: 'JAS-01',
    pilihan: [
      { id: 'JAS-01', alasan: '“Jadwal bentrok, pelanggan lupa datang”' },
      { id: 'JAS-06', alasan: '“tagihan kos menunggak”' },
      {
        id: 'JAS-04',
        alasan: '“mesin harus dijaga terus”: laundry koin dengan QRIS',
      },
      { id: 'JAS-10', alasan: 'Status dan pendapatan tiap mesin' },
      { id: 'JAS-02', alasan: 'Bengkel: biaya disetujui lewat ponsel' },
      { id: 'JAS-03', alasan: 'Pengingat servis berkala' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Klinik dan kesehatan',
    entri: 'KES-01',
    pilihan: [
      {
        id: 'KES-01',
        alasan: '“Telepon janji temu menumpuk”: bertanda †, data pasien dijaga',
      },
      { id: 'KES-04', alasan: '“data pasien diketik berulang”: bertanda †' },
      { id: 'KES-08', alasan: 'Paket perawatan berlangganan' },
      { id: 'KES-03', alasan: 'Pasien tahu gilirannya dari ponsel' },
      {
        id: 'KES-02',
        alasan:
          '“pasien lupa kontrol”: bertanda †, hanya untuk pasien yang setuju',
      },
      { id: 'KES-06', alasan: 'Apotek: obat menipis dan kedaluwarsa' },
    ],
    tahan: [
      {
        id: 'KES-07',
        alasan:
          'Tidak dipilih: layanan medis online bergantung pada izin fasilitas; lebih aman lewat percakapan',
      },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Pendidikan dan pelatihan',
    entri: 'EDU-01',
    pilihan: [
      { id: 'EDU-01', alasan: '“SPP menunggak”' },
      { id: 'EDU-02', alasan: '“pendaftaran masih kertas”' },
      {
        id: 'EDU-03',
        alasan:
          '“pendapatan hanya dari kelas tatap muka”: kelas berlangganan online',
      },
      { id: 'EDU-06', alasan: 'Kehadiran dan nilai untuk orang tua' },
      { id: 'EDU-09', alasan: 'Rapor dari nilai harian' },
      { id: 'EDU-05', alasan: 'Modul digital dijual berulang' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Properti, dealer, dan showroom',
    entri: 'PRO-01',
    pilihan: [
      {
        id: 'PRO-01',
        alasan: '“Prospek tercecer”: dijawab seketika dan survei terjadwal',
      },
      { id: 'PRO-02', alasan: 'Prospek sampai berkas KPR' },
      { id: 'PRO-10', alasan: 'Tahap prospek dan penyebab gagal terlihat' },
      {
        id: 'PRO-06',
        alasan:
          '“pengajuan leasing tidak terpantau”: bertanda †, persetujuan di tangan perusahaan pembiayaan',
      },
      { id: 'PRO-07', alasan: '“pelanggan lama tak pernah dihubungi lagi”' },
      { id: 'PRO-05', alasan: 'Dealer: penawaran dan jadwal test drive' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Keuangan, trading, dan pembiayaan',
    entri: 'KEU-09',
    pilihan: [
      { id: 'KEU-09', alasan: '“angsuran dikejar manual”' },
      { id: 'KEU-08', alasan: 'Koperasi: pengajuan sampai angsuran tertib' },
      {
        id: 'KEU-12',
        alasan: 'Konter dan agen: lini pulsa, token, dan tagihan; bertanda †',
      },
      { id: 'KEU-13', alasan: 'Pola transaksi janggal terlihat lebih dini' },
      {
        id: 'KEU-10',
        alasan:
          '“berkas menumpuk”: bertanda †, keputusan tetap di tangan pemberi pembiayaan',
      },
      {
        id: 'KEU-11',
        alasan: 'Agen asuransi: pengingat perpanjangan polis; bertanda †',
      },
    ],
    tahan: [
      { id: 'KEU-01', alasan: 'Menunggu keputusan posisi bot trading' },
      { id: 'KEU-02', alasan: 'Menunggu keputusan posisi bot trading' },
      { id: 'KEU-05', alasan: 'Menunggu keputusan posisi bot trading' },
      { id: 'KEU-07', alasan: 'Menunggu keputusan posisi bot trading' },
      { id: 'KEU-06', alasan: 'Ditahan: bot investasi' },
      {
        id: 'KEU-03',
        alasan:
          'Ikut keputusan posisi bot trading: isinya batas rugi dan ukuran posisi',
      },
      {
        id: 'KEU-04',
        alasan:
          'Ikut keputusan posisi bot trading: peringatan harga untuk trader',
      },
    ],
    catatan:
      'Klausa pertama kutipan bab (“Eksekusi strategi saya tidak konsisten”) tidak dijawab di halaman sampai posisi bot trading diputuskan; saran master brief: hanya lewat percakapan.',
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Konstruksi dan kontraktor',
    entri: 'KON-01',
    pilihan: [
      {
        id: 'KON-01',
        alasan: '“Tender terlewat”: bertanda †, dari situs pengadaan publik',
      },
      { id: 'KON-02', alasan: '“dokumen tidak siap”' },
      { id: 'KON-06', alasan: 'Selisih rencana dan realisasi terlihat' },
      {
        id: 'KON-04',
        alasan: '“laporan lapangan lewat chat”: terkirim walau tanpa sinyal',
      },
      { id: 'KON-07', alasan: '“harga material naik-turun”' },
      {
        id: 'KON-05',
        alasan: '“termin lambat cair”: berkas termin dari laporan lapangan',
      },
    ],
    catatan:
      'Bab ini berpasangan dengan Konstruksi Pelaku proyek (ADM-01 dengan KON-01); jembatannya ditulis di V3.',
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Travel, hospitality, dan event',
    entri: 'TRV-04',
    pilihan: [
      {
        id: 'TRV-04',
        alasan: '“Booking bentrok”: bertanda †, lewat sambungan resmi platform',
      },
      { id: 'TRV-05', alasan: '“tiket event dijual manual”' },
      { id: 'TRV-07', alasan: 'Peserta event terverifikasi di WhatsApp' },
      {
        id: 'TRV-03',
        alasan: '“DP dikejar manual”: booking, DP, dan check-in',
      },
      {
        id: 'TRV-01',
        alasan: 'Biro perjalanan: tiket dan hotel dari supplier; bertanda †',
      },
      { id: 'TRV-09', alasan: 'Musim ramai diperingatkan lebih dulu' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Media, kreator, dan komunitas',
    entri: 'MED-05',
    pilihan: [
      { id: 'MED-05', alasan: '“komunitas dikelola manual”' },
      { id: 'MED-03', alasan: '“pendapatan tipis”: toko produk digital' },
      {
        id: 'MED-06',
        alasan: '“konten dikelola manual”: brief sampai jadwal posting',
      },
      {
        id: 'MED-01',
        alasan: 'Donasi dan alert di layar; jembatan ke studio siaran',
      },
      { id: 'MED-04', alasan: 'Membership penggemar' },
      { id: 'MED-07', alasan: 'Cuplikan siaran ke banyak platform' },
    ],
    tahan: [
      {
        id: 'MED-11',
        alasan:
          'Tidak dipilih: undian tidak dijual di media afiliasi (aturan Agency); lebih aman tidak ditayangkan',
      },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Logistik, armada, dan gudang',
    entri: 'LOG-02',
    pilihan: [
      { id: 'LOG-02', alasan: '“Pelanggan bertanya paketku di mana”' },
      { id: 'LOG-03', alasan: '“klaim kerusakan tanpa bukti”' },
      { id: 'LOG-04', alasan: '“rute boros”' },
      { id: 'LOG-08', alasan: 'Agregator multi-kurir untuk seller' },
      { id: 'LOG-01', alasan: 'Posisi kendaraan terlihat seketika' },
      { id: 'LOG-05', alasan: 'Servis dan dokumen kendaraan tidak terlewat' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Manufaktur ringan, agro, dan UMKM produksi',
    entri: 'MAN-03',
    pilihan: [
      {
        id: 'MAN-03',
        alasan: 'Lingkup terkecil: panen dan biaya tercatat tanpa buku',
      },
      { id: 'MAN-01', alasan: '“Biaya pokok tidak diketahui”' },
      { id: 'MAN-05', alasan: '“hasil tani lewat banyak perantara”' },
      { id: 'MAN-09', alasan: 'Kebutuhan bahan dari pola penjualan' },
      { id: 'MAN-02', alasan: '“mesin berhenti mendadak”' },
      { id: 'MAN-07', alasan: 'Perawatan mesin berkala' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Instansi, desa, dan organisasi publik',
    entri: 'PUB-10',
    pilihan: [
      {
        id: 'PUB-10',
        alasan: 'Lingkup terkecil: syarat dan alur layanan dijawab kapan pun',
      },
      { id: 'PUB-01', alasan: '“Warga harus datang untuk urusan sederhana”' },
      {
        id: 'PUB-05',
        alasan: 'Yayasan dan rumah ibadah: donasi dengan laporan terbuka',
      },
      { id: 'PUB-04', alasan: 'Beban kerja dan waktu penyelesaian terlihat' },
      { id: 'PUB-03', alasan: '“surat menumpuk”: disposisi dengan jejak' },
      {
        id: 'PUB-08',
        alasan: '“laporan wajib disusun manual”: bertanda †, lewat jalur resmi',
      },
      { id: 'PUB-02', alasan: 'Aduan warga lewat WhatsApp' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Jasa profesional dan agensi',
    entri: 'PRF-01',
    pilihan: [
      { id: 'PRF-01', alasan: '“Prospek tidak ditindaklanjuti”' },
      { id: 'PRF-03', alasan: '“laporan klien disusun manual”' },
      { id: 'PRF-10', alasan: 'Jasa berulang menjadi paket bulanan' },
      { id: 'PRF-05', alasan: '“tenggat klien terlewat”' },
      { id: 'PRF-06', alasan: 'Jam kerja menjadi faktur' },
      { id: 'PRF-02', alasan: 'Onboarding klien berurutan' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Kebugaran, olahraga, dan rekreasi',
    entri: 'FIT-03',
    pilihan: [
      { id: 'FIT-03', alasan: '“iuran anggota menunggak”' },
      {
        id: 'FIT-01',
        alasan: '“Jadwal lapangan bentrok”: pemesanan dengan DP',
      },
      {
        id: 'FIT-02',
        alasan: '“lampu harus dijaga orang”: lampu berbayar per jam',
      },
      { id: 'FIT-07', alasan: 'Skor dan klasemen langsung' },
      {
        id: 'FIT-10',
        alasan: '“loker harus dijaga orang”: tiket dan loker QRIS',
      },
      { id: 'FIT-04', alasan: 'Membership dan paket kelas' },
    ],
  },
  {
    unit: 'teknologi',
    side: 'B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Lintas sektor: untuk usaha apa pun',
    entri: 'LIN-17',
    pilihan: [
      {
        id: 'LIN-17',
        alasan:
          '“pendapatan saya bergantung pada satu sumber”: sesi pemetaan, titik mulai di master brief',
      },
      { id: 'LIN-01', alasan: 'Ringkasan penjualan dan kas setiap pagi' },
      {
        id: 'LIN-07',
        alasan:
          '“Pekerjaan berulang menyita waktu tim saya”: persetujuan berjenjang',
      },
      { id: 'LIN-12', alasan: 'Kas, penjualan, dan operasi dalam satu layar' },
      {
        id: 'LIN-03',
        alasan: 'Pertanyaan berulang dijawab dari data perusahaan',
      },
      { id: 'LIN-08', alasan: 'Uang masuk cocok dengan catatan' },
      {
        id: 'LIN-16',
        alasan: 'Jualan di percakapan dengan katalog dan pembayaran',
      },
    ],
    tahan: [
      {
        id: 'LIN-21',
        alasan: 'Tidak dipilih: masih eksperimen menurut katalog',
      },
    ],
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Agency marketing (MKT)',
    entri: '1A-01',
    pilihan: [
      {
        id: '1A-01',
        alasan:
          'Anak tangga 1: sesi strategi sebelum uang iklan keluar (asal A)',
      },
      {
        id: '1A-05',
        alasan:
          'Tim Anda memegang akun, kami mengarahkan setiap bulan (asal T)',
      },
      {
        id: '2B-02',
        alasan:
          '“yang tahu cuma itu-itu saja”: peluncuran online dan lapangan sekaligus (asal T)',
      },
      {
        id: '3A-02',
        alasan: 'Kreator yang cocok dengan audiens Anda (asal A)',
      },
      {
        id: '1A-02',
        alasan: 'Kebocoran anggaran iklan terlihat dalam satu laporan (asal T)',
      },
      {
        id: '2B-03',
        alasan: 'Pembukaan gerai; jembatan ke rangkaian kafe baru (asal T)',
      },
      { id: 'MKT-01', alasan: 'Akun aktif setiap minggu (tercatat di riset)' },
    ],
    catatan:
      'Halaman tidak menjanjikan jangkauan atau penjualan; yang ditulis adalah pekerjaannya (Aturan isi 3).',
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Produksi kreatif (PRD)',
    entri: '1B-04',
    pilihan: [
      {
        id: '1B-04',
        alasan: 'Lingkup terkecil: foto produk dan lifestyle (asal A)',
      },
      {
        id: '1B-12',
        alasan: '“Kontennya harus keluar setiap minggu”: kuota konten bulanan',
      },
      {
        id: '1B-07',
        alasan: 'Produk yang sulit difoto dijelaskan lewat animasi (asal A)',
      },
      { id: '1B-05', alasan: 'Cerita brand dalam film pendek (asal A)' },
      {
        id: 'PRD-01',
        alasan:
          '“tidak ada yang membuatnya”: satu hari syuting untuk stok sebulan, sesuai header Peekabo',
      },
      { id: '1B-09', alasan: 'Semua aset satu kampanye sekaligus (asal T)' },
      { id: '1B-03', alasan: 'Seri konten berbasis isu (asal T)' },
    ],
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Agency solusi kreatif (SOL)',
    entri: '1B-01',
    pilihan: [
      {
        id: '1B-01',
        alasan:
          '“Saya tidak tahu harus bilang apa”: workshop isu dan framing (asal A)',
      },
      { id: 'SOL-12', alasan: 'Arah kreatif dijaga setiap bulan' },
      {
        id: '2A-01',
        alasan:
          'Konsep kampanye lapangan disepakati sebelum anggaran keluar (asal A)',
      },
      { id: '1B-02', alasan: 'Naskah dan hook video pendek (asal T)' },
      {
        id: 'SOL-04',
        alasan:
          '“supaya orang peduli”: satu kalimat posisi dan tiga pesan inti',
      },
      {
        id: 'SOL-02',
        alasan: 'Bahasa dan alasan beli audiens dari mulut mereka sendiri',
      },
    ],
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Operator SaaS niche (OPS)',
    entri: '',
    ditahanBab:
      'Kelima belas offer bab ini menunggu keputusan SaaS pertama dan niche pertama (master brief, keputusan per unit Agency).',
    pilihan: [],
    tahan: [
      {
        id: 'OPS-01',
        alasan: 'Menunggu keputusan SaaS pertama dan niche pertama',
      },
      {
        id: 'OPS-04',
        alasan:
          'Menunggu keputusan SaaS pertama; contoh kalibrasi sudah ditulis',
      },
      {
        id: 'OPS-09',
        alasan: 'Menunggu keputusan SaaS pertama; nama alat belum boleh tampil',
      },
      { id: 'OPS-14', alasan: 'Menunggu keputusan SaaS pertama' },
    ],
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Live commerce untuk brand (LIV)',
    entri: 'LIV-01',
    pilihan: [
      {
        id: 'LIV-01',
        alasan:
          '“tidak sanggup siaran setiap hari”: coba live per jam tanpa kontrak panjang',
      },
      { id: 'LIV-02', alasan: 'Siaran rutin dengan jadwal tetap' },
      {
        id: 'LIV-05',
        alasan:
          '“tidak punya host”: sudut siaran di lokasi Anda; jembatan ke studio Konstruksi',
      },
      { id: 'LIV-06', alasan: 'Host Anda sendiri dilatih dari rekaman' },
      { id: 'LIV-09', alasan: 'Siaran khusus di momen besar' },
      {
        id: 'LIV-04',
        alasan: 'Biaya dasar lebih rendah, sisanya dari penjualan selama live',
      },
    ],
    tahan: [
      {
        id: 'LIV-07',
        alasan:
          'Ditahan: nilainya adalah status program partner platform yang belum terdaftar',
      },
      {
        id: '3A-05',
        alasan:
          'Cadangan: bertanda †, operasi live lengkap; pilih bila Anda ingin paket penuh tampil',
      },
    ],
    catatan:
      'Urutan bab TAL, KRE, dan LIV menunggu keputusan industri keempat dan kelima; daftar ini tidak bergantung padanya.',
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Experiential dan event (EVT)',
    entri: '2A-06',
    pilihan: [
      {
        id: '2B-01',
        alasan:
          '“Saya ingin warga datang”: event hunting kota, bertanda † (asal A)',
      },
      {
        id: '2B-05',
        alasan: 'Produk dibawa ke banyak titik dalam satu rute (asal T)',
      },
      {
        id: '2B-06',
        alasan: '“lalu bercerita”: temu pelanggan dan komunitas (asal T)',
      },
      {
        id: '2A-06',
        alasan: 'Lingkup terkecil: booth dan sampling di lokasi mitra',
      },
      {
        id: '2A-07',
        alasan: 'Perlengkapan, izin lokasi, dan alur peserta; bertanda †',
      },
    ],
    tahan: [
      {
        id: '2B-08',
        alasan:
          'Tidak dipilih: data peserta dibagikan ke sponsor; lebih aman lewat percakapan (UU PDP)',
      },
    ],
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Talenta dan kreator untuk brand (TAL)',
    entri: '2A-03',
    pilihan: [
      {
        id: '2A-03',
        alasan:
          '“orang yang bisa membawakan produk saya”: promotor dan host terlatih (asal A)',
      },
      {
        id: '3A-06',
        alasan: 'Video ulasan dari banyak kreator, dibayar per video',
      },
      {
        id: '3A-01',
        alasan:
          '“bukan sekadar pengikut banyak”: kreator yang kami kelola, bertanda † (asal A)',
      },
      {
        id: '3A-04',
        alasan:
          'Sales atau influencer yang sudah disaring; bertanda † (asal A)',
      },
      { id: '3A-11', alasan: 'Satu wajah yang dikenal warga' },
    ],
    catatan:
      'Bentuk hubungan kerja talenta belum diputuskan (keputusan lintas unit 3); halaman memakai rumusan aman “bentuk hubungan kerja disepakati tertulis”.',
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Outsourcing penjualan (SLS)',
    entri: '3A-08',
    pilihan: [
      {
        id: '3A-08',
        alasan: 'Lingkup terkecil: chat dijawab dan ditutup menjadi pesanan',
      },
      {
        id: '2A-02',
        alasan:
          '“tidak ada yang menindaklanjuti”: tim sales lapangan, bertanda † (asal A)',
      },
      {
        id: '3A-03',
        alasan: 'Penjualan dijalankan atas nama Anda; bertanda † (asal A)',
      },
    ],
    catatan: 'Bab ini tepat tiga offer, semuanya yang ada di katalog.',
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Akademi untuk tim klien (AKD)',
    entri: '',
    ditahanBab:
      'Katalog hanya memuat dua offer (1A-04, 1A-07), kurang dari tiga. Keduanya tetap bisa ditawarkan lewat percakapan sampai ada offer ketiga.',
    pilihan: [],
  },
  {
    unit: 'peekabo',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Ekosistem marketplace dan jaringan komisi (EKO)',
    entri: 'EKO-04',
    pilihan: [
      {
        id: 'EKO-04',
        alasan:
          'Lingkup terkecil: margin dan komisi afiliasi dihitung ulang setiap biaya platform berubah',
      },
      {
        id: '3B-04',
        alasan:
          'SaaS dan vendor yang tepat lewat kami, komisi diungkapkan (asal T)',
      },
      {
        id: '3C-06',
        alasan: '“dijualkan banyak orang”: etalase dan siaran komunitas seller',
      },
      {
        id: '3C-09',
        alasan: 'Anggota komunitas membuat konten untuk brand; bertanda †',
      },
    ],
    tahan: [
      {
        id: 'EKO-01',
        alasan: 'Ditahan: status program partner platform belum terdaftar',
      },
      {
        id: 'EKO-02',
        alasan: 'Ditahan: status program partner platform belum terdaftar',
      },
      {
        id: 'EKO-03',
        alasan: 'Ditahan: status program partner platform belum terdaftar',
      },
      {
        id: '3B-06',
        alasan: 'Ditahan: status program partner platform belum terdaftar',
      },
      { id: 'EKO-05', alasan: 'Ditahan: offer ‡, menunggu pilihan sub-agen' },
      {
        id: 'EKO-06',
        alasan: 'Mitra asuransi belum ada (master brief, jalur komisi)',
      },
    ],
    catatan:
      'Offer yang paling langsung menjawab “mengelola afiliasinya” (TAP, TSP, MCN) tertahan sampai Peekabo terdaftar. Bila Anda lebih suka, bab ini ditahan utuh sampai saat itu.',
  },
  {
    unit: 'teknologi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Individu dan pembelajar',
    entri: 'IND-18',
    pilihan: [
      {
        id: 'IND-18',
        alasan:
          'Lingkup terkecil, padanan audit singkat untuk lapis 1: ide dipetakan dalam satu jam',
      },
      {
        id: 'IND-03',
        alasan: '“ingin membuatnya berjalan”: bot pribadi yang bekerja sendiri',
      },
      {
        id: 'IND-17',
        alasan: 'Angka hidup sendiri di satu layar (profesional dan kreator)',
      },
      {
        id: 'IND-09',
        alasan:
          'Pencari kerja dan kreator: portofolio yang membuka pasar klien',
      },
      {
        id: 'IND-01',
        alasan:
          '“rasa ingin tahu”: eksperimen agen AI dan MCP, sisi eksperimental bab ini',
      },
      {
        id: 'IND-16',
        alasan: 'Mahasiswa: dibimbing sampai demo, tetap mengerjakan sendiri',
      },
      {
        id: 'IND-07',
        alasan:
          'Pencari kerja: lowongan dan beasiswa; bertanda †, hanya dari data publik atau API resmi',
      },
    ],
    tahan: [
      { id: 'IND-04', alasan: 'Menunggu keputusan posisi bot trading' },
      { id: 'IND-05', alasan: 'Menunggu keputusan posisi bot trading' },
      {
        id: 'IND-06',
        alasan:
          'Ikut keputusan posisi bot trading: peringatan harga untuk trader, sama seperti KEU-04',
      },
    ],
    catatan:
      'Pembeli bab ini di katalog menyebut trader mandiri. Sampai posisi bot trading diputuskan, halaman bab tidak menyebut trading, termasuk di daftar pembelinya.',
  },
  {
    unit: 'teknologi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Freelancer dan agensi kecil',
    entri: 'FRL-06',
    pilihan: [
      {
        id: 'FRL-06',
        alasan:
          'Lingkup terkecil: biaya dan jadwal penawaran dihitung sebelum Anda menerima proyek besar',
      },
      {
        id: 'FRL-02',
        alasan: 'Otomatisasi untuk klien tanpa membangun dari awal',
      },
      { id: 'FRL-08', alasan: 'Rilis diuji tanpa merekrut penguji' },
      {
        id: 'FRL-13',
        alasan: 'Jasa yang sering diulang dikemas menjadi produk',
      },
      {
        id: 'FRL-01',
        alasan:
          '“tangan saya kurang”: kami mengerjakan di belakang layar atas nama Anda',
      },
      {
        id: 'FRL-05',
        alasan:
          '“Proyeknya besar”: booking dan checkout dirakit dari modul teruji',
      },
      {
        id: 'FRL-10',
        alasan:
          'Klien Anda tetap dijaga setelah serah terima, tanpa Anda menjaga server',
      },
    ],
    tahan: [
      {
        id: 'FRL-12',
        alasan:
          'Tidak dipilih: pengambilalihan proyek sudah tampil di Software house (SWH-06); satu halaman untuk satu pekerjaan',
      },
      {
        id: 'FRL-03',
        alasan:
          'Tidak dipilih: spesialis pembayaran sudah tampil di Software house (SWH-04)',
      },
    ],
    catatan:
      '“tidak mau menolak klien” dijawab oleh urutan: hitung dulu, kerjakan di belakang layar, lalu jaga setelahnya.',
  },
  {
    unit: 'teknologi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Software house dan perusahaan IT',
    entri: 'SWH-06',
    pilihan: [
      {
        id: 'SWH-06',
        alasan:
          'Lingkup terkecil, padanan audit singkat: proyek bermasalah dinilai jujur dulu',
      },
      {
        id: 'SWH-09',
        alasan: 'Setiap rilis aman dan masalah terdeteksi lebih dulu',
      },
      { id: 'SWH-18', alasan: 'Sumber data rapi untuk produk analitik' },
      {
        id: 'SWH-05',
        alasan: 'Satu produk melayani banyak klien dengan merek masing-masing',
      },
      {
        id: 'SWH-02',
        alasan:
          '“Tenggat ketat”: kapasitas tambahan saat puncak tanpa merekrut tetap',
      },
      {
        id: 'SWH-01',
        alasan: '“spesialis sulit dicari”: tim khusus mengikuti ritme Anda',
      },
      { id: 'SWH-04', alasan: 'Spesialis pembayaran dan rekonsiliasi' },
    ],
    tahan: [
      {
        id: 'SWH-10',
        alasan:
          'Cadangan: bertanda †, pentest dan kepatuhan PDP serta PSE; pilih bila Anda ingin kepatuhan tampil di bab ini',
      },
    ],
    catatan:
      'Tim khusus dan pemeliharaan bulanan adalah dua dari lima cara mulai sisi ini; SWH-01 mewakili yang pertama.',
  },
  {
    unit: 'teknologi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Startup dan CTO',
    entri: 'STA-02',
    pilihan: [
      {
        id: 'STA-02',
        alasan:
          'Lingkup terkecil: minat diukur sebelum satu baris kode ditulis',
      },
      {
        id: 'STA-03',
        alasan:
          '“orang yang terbatas”: keputusan teknologi terarah tanpa merekrut CTO tetap',
      },
      { id: 'STA-05', alasan: 'Pengguna mendaftar dan aktif tanpa dibantu' },
      {
        id: 'STA-10',
        alasan:
          'Pengguna bertanya dalam bahasa sehari-hari, jawaban dari data Anda',
      },
      {
        id: 'STA-01',
        alasan:
          '“harus rilis cepat”: MVP dengan lingkup, biaya, dan tenggat terkunci',
      },
      {
        id: 'STA-04',
        alasan: 'Paket dan tagihan berjalan sejak pengguna pertama',
      },
      {
        id: 'STA-12',
        alasan:
          '“uang terbatas”: pemakaian cloud ditinjau sebelum ronde berikutnya',
      },
    ],
    tahan: [
      {
        id: 'STA-07',
        alasan:
          'Tidak dipilih: spesialis pembayaran sudah tampil di Software house (SWH-04)',
      },
      {
        id: 'STA-11',
        alasan:
          'Tidak dipilih: uji beban mirip SWH-08; lebih tepat lewat percakapan',
      },
    ],
  },
  {
    unit: 'teknologi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Tim IT internal perusahaan',
    entri: 'TIM-10',
    pilihan: [
      {
        id: 'TIM-10',
        alasan:
          '“sistem lama tidak ada yang berani menyentuh”: dipetakan dan ditulis dulu sebelum disentuh',
      },
      {
        id: 'TIM-08',
        alasan:
          '“Pekerjaan operasional menumpuk”: laporan rutin terbit sendiri',
      },
      { id: 'TIM-03', alasan: 'Masalah terdeteksi sebelum pengguna mengeluh' },
      {
        id: 'TIM-05',
        alasan: 'Data lama pindah utuh dari Excel dan sistem warisan',
      },
      {
        id: 'TIM-09',
        alasan:
          'Aplikasi lama diperbarui bertahap tanpa menghentikan operasional',
      },
      {
        id: 'TIM-06',
        alasan: 'Catatan antarsistem cocok tanpa dicocokkan tangan',
      },
      { id: 'TIM-04', alasan: 'Backup terbukti bisa dipulihkan' },
    ],
    tahan: [
      {
        id: 'TIM-14',
        alasan:
          'Tidak dipilih: optimasi database tampil di bab Lapisan data (DAT-03)',
      },
      {
        id: 'TIM-12',
        alasan:
          'Tidak dipilih: gudang data tampil di bab Lapisan data (DAT-04)',
      },
    ],
  },
  {
    unit: 'teknologi',
    side: 'A',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
    situation: 'Lapisan data: SQL, realtime, dan graf',
    entri: 'DAT-03',
    pilihan: [
      {
        id: 'DAT-03',
        alasan: '“Data kami lambat”: lingkup terkecil, query dan indeks',
      },
      {
        id: 'DAT-09',
        alasan: '“terlambat”: peristiwa penting sampai seketika',
      },
      {
        id: 'DAT-04',
        alasan: '“tidak terhubung”: banyak sumber menyatu setiap malam',
      },
      {
        id: 'DAT-08',
        alasan:
          'Realtime: penjualan, mesin, atau armada terlihat saat itu juga',
      },
      {
        id: 'DAT-16',
        alasan: 'Graf: barang dan konten yang sering muncul bersama',
      },
      {
        id: 'DAT-18',
        alasan:
          'Graf: satu pemasok terlambat, produk yang terkena langsung tampak',
      },
    ],
    tahan: [
      {
        id: 'DAT-02',
        alasan:
          'Tidak dipilih: pekerjaannya sama dengan TIM-05 di bab Tim IT internal; satu halaman untuk satu pekerjaan',
      },
      {
        id: 'DAT-17',
        alasan:
          'Tidak dipilih: deteksi kecurangan lebih aman dibicarakan langsung',
      },
    ],
    catatan:
      'Tiga lapis di judul bab masing-masing terwakili: SQL (DAT-03, DAT-04), realtime (DAT-08, DAT-09), graf (DAT-16, DAT-18).',
  },
  {
    unit: 'peekabo',
    side: 'B',
    situation: 'Sales lepas, makelar, dan calo (Open Commission) (OCS)',
    entri: '',
    ditahanBab:
      'Langkah 2 cara bergabung menjanjikan kartu komisi untuk setiap produk: siapa membayar, pemicu, besar, dan kapan cair. Kartunya belum disusun (keputusan 5 di master brief), jadi bab ini ditahan utuh sampai kartu pertama ada.',
    pilihan: [],
    tahan: [
      {
        id: 'OCS-08',
        alasan:
          'Siap saat kartu ada: rujukan ke Arthur sendiri, tanpa mitra luar; calon pintu masuk',
      },
      {
        id: 'OCS-01',
        alasan:
          'Siap saat kartu ada: properti lewat perantara berizin; bertanda †',
      },
      {
        id: 'OCS-02',
        alasan: 'Siap saat kartu ada: kendaraan, fee setelah unit diserahkan',
      },
      {
        id: 'OCS-03',
        alasan:
          'Siap saat kartu ada: pembiayaan, dari insentif yang sah; bertanda †',
      },
      {
        id: 'OCS-05',
        alasan:
          'Siap saat kartu ada: software, komisi berulang selama berlangganan',
      },
      {
        id: 'OCS-09',
        alasan:
          'Siap saat kartu ada: kelas menjual, dijual terpisah dan bukan syarat bergabung',
      },
      { id: '3B-07', alasan: 'Siap saat kartu ada: dasbor rujukan dan komisi' },
      {
        id: 'OCS-04',
        alasan: 'Mitra asuransi belum ada (master brief, jalur komisi)',
      },
      {
        id: 'OCS-06',
        alasan: 'Mitra sewa alat berat belum ada (master brief, jalur komisi)',
      },
      {
        id: 'OCS-07',
        alasan: 'Mitra konveksi belum ada (master brief, jalur komisi)',
      },
      {
        id: '3B-01',
        alasan: 'Ditahan: offer ‡, menunggu pilihan sub-agen (keputusan 1)',
      },
      {
        id: '3B-03',
        alasan:
          'Ditahan: etalase komisi bersinggungan dengan larangan sub-afiliasi platform; ikut keputusan 1 dan 4',
      },
    ],
    catatan:
      'Bila kartu komisi sudah ada, tujuh offer pertama di daftar tahan menjadi daftar pendek bab ini tanpa usulan ulang. Halaman nanti memuat aturan satu tingkat: tanpa biaya bergabung, tanpa bonus rekrutmen, tanpa janji penghasilan.',
  },
  {
    unit: 'peekabo',
    side: 'B',
    situation: 'Anggota komunitas belanja (membership) (MBR)',
    entri: '',
    ditahanBab:
      'Master brief menulis industri komunitas dan membership dibuka setelah ada audiens yang cukup, dan tiga offer intinya (‡) menunggu pilihan sub-agen. Bab ini ditahan utuh sampai keduanya terjawab.',
    pilihan: [],
    tahan: [
      {
        id: '3C-02',
        alasan: 'Siap saat dibuka: tingkat dasar, pro, dan mitra (asal T)',
      },
      {
        id: 'MBR-02',
        alasan:
          'Siap saat dibuka: iuran tahunan dengan plafon manfaat yang jelas',
      },
      {
        id: '3C-04',
        alasan:
          'Siap saat dibuka: patungan harga grosir, mengikuti aturan perlindungan konsumen',
      },
      { id: '3C-05', alasan: 'Siap saat dibuka: kelas khusus anggota' },
      { id: 'MBR-04', alasan: 'Siap saat dibuka: harga anggota untuk UMKM' },
      {
        id: '3C-01',
        alasan: 'Ditahan: offer ‡, menunggu pilihan sub-agen (keputusan 1)',
      },
      {
        id: '3B-02',
        alasan: 'Ditahan: offer ‡, menunggu pilihan sub-agen (keputusan 1)',
      },
      {
        id: 'MBR-01',
        alasan: 'Ditahan: offer ‡, menunggu pilihan sub-agen (keputusan 1)',
      },
      {
        id: 'MBR-03',
        alasan:
          'Ikut keputusan D5 Membership Care: perawatan properti tertahan di Konstruksi',
      },
      {
        id: '3B-08',
        alasan:
          'Ditahan: kode dan tautan bergantung pada status afiliasi platform yang belum terdaftar',
      },
    ],
    catatan:
      'Bila dibuka, lima offer pertama di daftar tahan menjadi daftar pendek bab ini.',
  },
  {
    unit: 'peekabo',
    side: 'B',
    situation: 'Kreator, streamer, dan host (KRE)',
    entri: 'KRE-03',
    pilihan: [
      {
        id: 'KRE-03',
        alasan:
          '“penghasilannya belum menentu”: dibayar per jam atau per bulan sebagai host toko brand; bentuk kerja disepakati tertulis',
      },
      {
        id: '3A-09',
        alasan:
          '“bisa live berjam-jam”: dilatih membaca penonton dan menutup penjualan; kelas dijual terpisah, bukan syarat bergabung',
      },
      {
        id: 'KRE-05',
        alasan: 'Rekaman diedit menjadi klip, thumbnail, dan jadwal unggah',
      },
      {
        id: 'KRE-06',
        alasan:
          'Kontrak brand dicarikan dan diurus, biaya manajemen hanya dari kontrak yang kami bawa',
      },
    ],
    tahan: [
      {
        id: 'KRE-01',
        alasan: 'Ditahan: status agency LIVE belum terdaftar (keputusan 4)',
      },
      {
        id: 'KRE-02',
        alasan: 'Ditahan: status MCN belum terdaftar (keputusan 4)',
      },
      {
        id: 'KRE-04',
        alasan:
          'Ditahan: studio siaran Peekabo belum tercatat ada; jembatannya ke studio Konstruksi',
      },
    ],
    catatan:
      'Industri talenta dibuka lebih dulu menurut master brief. Halaman tidak menjanjikan penghasilan; yang ditulis adalah bentuk bayarannya (per jam, per bulan, dari kontrak).',
  },
]
