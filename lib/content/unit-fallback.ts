import type { Side, Unit } from '@/lib/content/units'

export interface UnitFallbackPoint {
  _key: string
  teks: string
}

export interface UnitFallbackSide {
  _id: string
  kunci: Side
  nama: string
  judul: string
}

export interface UnitFallback {
  kunci: Unit
  nama: string
  judul: string
  pembuka: string
  masalah: readonly UnitFallbackPoint[]
  caraKerja: readonly UnitFallbackPoint[]
  sisi: readonly UnitFallbackSide[]
  ajakan: {
    label: string
    sesudahnya: string
  }
}

/**
 * Review-safe unit copy sourced from the initial Sanity drafts approved by
 * the owner on 2026-10-13.
 *
 * Published Sanity content wins whenever it exists. These records keep the
 * unit routes complete while the approved drafts remain unpublished; they do
 * not introduce clients, results, prices, statistics, or unapproved offers.
 */
export const UNIT_FALLBACKS = {
  konstruksi: {
    kunci: 'konstruksi',
    nama: 'Konstruksi',
    judul: 'Isi celahnya. Bangun sampai jadi. Rawat sesudahnya.',
    pembuka:
      'Konstruksi sipil dari hulu ke hilir untuk Subang, Purwakarta, dan Bandung. Proyek tersendat di celah dokumen, tenaga, material, modal, dan laporan; kami bekerja di celah-celah itu.',
    masalah: [
      { _key: 'masalah-dokumen', teks: 'Dokumen proyek belum siap.' },
      { _key: 'masalah-tenaga', teks: 'Tenaga kerja belum datang.' },
      {
        _key: 'masalah-material',
        teks: 'Material belum tiba atau harganya bergeser.',
      },
      { _key: 'masalah-modal', teks: 'Modal kerja belum cair.' },
      { _key: 'masalah-laporan', teks: 'Laporan proyek belum jadi.' },
    ],
    caraKerja: [
      {
        _key: 'cara-celah',
        teks: 'Ambil satu celah proyek atau seluruh lingkup pekerjaan.',
      },
      {
        _key: 'cara-hulu-hilir',
        teks: 'Kelola estimasi, desain, pekerjaan lapangan, dan serah terima.',
      },
      {
        _key: 'cara-tertulis',
        teks: 'Sepakati lingkup dan harga tertulis sebelum kerja dimulai.',
      },
    ],
    sisi: [
      {
        _id: 'fallback-pelaku-proyek',
        kunci: 'pelaku-proyek',
        nama: 'Untuk pelaku proyek',
        judul:
          'Bagian mana dari proyek Anda yang belum ada yang mengerjakan? Kami isi.',
      },
      {
        _id: 'fallback-pemilik-bangunan',
        kunci: 'pemilik-bangunan',
        nama: 'Untuk pemilik bangunan',
        judul:
          'Ceritakan bangunan yang Anda inginkan. Kami urus dari hulu ke hilir.',
      },
    ],
    ajakan: {
      label: 'Ceritakan bangunan atau proyeknya.',
      sesudahnya: 'Kami tentukan celah mana yang kami isi.',
    },
  },
  teknologi: {
    kunci: 'teknologi',
    nama: 'Teknologi',
    judul: 'Buka pasar baru. Otomatiskan sisanya.',
    pembuka:
      'Bot dan workflow yang bekerja dua puluh empat jam untuk bisnis Anda, di sektor apa pun. Kami bekerja pada pasar yang belum terbuka dan pekerjaan berulang yang masih dikerjakan tangan manusia.',
    masalah: [
      { _key: 'masalah-pasar', teks: 'Pasar baru belum terbuka.' },
      {
        _key: 'masalah-berulang',
        teks: 'Pekerjaan berulang masih dikerjakan tangan manusia.',
      },
      {
        _key: 'masalah-data',
        teks: 'Data transaksi, waktu nyata, dan relasi belum tertata.',
      },
    ],
    caraKerja: [
      {
        _key: 'cara-diagnosis',
        teks: 'Mulai dari masalah, lalu tentukan bot, workflow, atau pasar baru.',
      },
      {
        _key: 'cara-matang',
        teks: 'Sarankan layanan matang lebih dulu bila sudah menyelesaikan masalah.',
      },
      {
        _key: 'cara-serah',
        teks: 'Serahkan kode, akses, data, dan dokumentasi kepada klien.',
      },
    ],
    sisi: [
      {
        _id: 'fallback-siap-pakai',
        kunci: 'siap-pakai',
        nama: 'Untuk yang ingin hasil siap pakai',
        judul:
          'Ceritakan pasar yang ingin dibuka atau pekerjaan yang ingin dilepas. Sisanya kami jalankan.',
      },
      {
        _id: 'fallback-paham-teknis',
        kunci: 'paham-teknis',
        nama: 'Untuk yang paham teknis',
        judul:
          'Spesialis untuk titik macet teknis Anda, dari basis data sampai rilis otomatis.',
      },
    ],
    ajakan: {
      label: 'Sampaikan masalahnya.',
      sesudahnya: 'Kami tentukan bot, workflow, atau pasar barunya.',
    },
  },
  peekabo: {
    kunci: 'peekabo',
    nama: 'Peekabo',
    judul:
      'Rebut perhatian. Bangun kepercayaan. Biarkan jaringan yang menjual.',
    pembuka:
      'Agency marketshare untuk usaha dan brand, berbasis di Subang, Purwakarta, dan Bandung. Kami bekerja saat terlalu sedikit orang yang tahu, belum cukup orang yang percaya, dan belum ada yang ikut menjualkan.',
    masalah: [
      {
        _key: 'masalah-dikenal',
        teks: 'Terlalu sedikit orang yang tahu.',
      },
      {
        _key: 'masalah-dipercaya',
        teks: 'Belum cukup orang yang percaya.',
      },
      {
        _key: 'masalah-dibeli',
        teks: 'Belum ada cukup orang yang ikut menjualkan.',
      },
    ],
    caraKerja: [
      {
        _key: 'cara-perhatian',
        teks: 'Jalankan iklan dan produksi aset untuk merebut perhatian.',
      },
      {
        _key: 'cara-kepercayaan',
        teks: 'Bawa brand ke lapangan untuk membangun kepercayaan.',
      },
      {
        _key: 'cara-jaringan',
        teks: 'Libatkan kreator, host, sales, dan komunitas untuk menjualkan.',
      },
      {
        _key: 'cara-tertulis',
        teks: 'Sepakati target, lingkup, komisi, dan laporan secara terbuka.',
      },
    ],
    sisi: [
      {
        _id: 'fallback-pemilik-usaha',
        kunci: 'pemilik-usaha',
        nama: 'Untuk pemilik usaha dan brand',
        judul:
          'Pasar mana yang ingin Anda rebut? Kami siapkan perhatian, kepercayaan, dan penjualnya.',
      },
      {
        _id: 'fallback-jaringan',
        kunci: 'jaringan',
        nama: 'Untuk jaringan penjual',
        judul:
          'Punya audiens, jaringan, atau bakat menjual? Dapatkan bagian dari setiap penjualan yang Anda bawa.',
      },
    ],
    ajakan: {
      label: 'Ceritakan pasar yang ingin Anda rebut.',
      sesudahnya: 'Kami tentukan lapis mana yang bekerja lebih dulu.',
    },
  },
} as const satisfies Record<Unit, UnitFallback>
