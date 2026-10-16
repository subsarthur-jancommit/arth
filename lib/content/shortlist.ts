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
    situation: 'Kuliner dan F&B',
    keputusan: 'Disetujui pemilik seperti diusulkan, 16 Oktober 2026',
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
]
