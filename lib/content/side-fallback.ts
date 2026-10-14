import type { Side } from '@/lib/content/units'

interface SideFallbackPoint {
  _key: string
  teks: string
}

export interface SideFallback {
  kunci: Side
  nama: string
  judul: string
  caraMembeli: readonly SideFallbackPoint[]
  langkahPertama: {
    label: string
    sesudahnya: string
  }
}

/**
 * Reader copy from the owner-approved initial Sanity draft for Peekabo's
 * seller-network side. It remains a fallback until that draft is approved
 * and published; no registration mechanism is inferred from it.
 */
export const NETWORK_SIDE_FALLBACK = {
  caraKerja:
    'Rujukan dicatat atas nama anggota melalui kode atau tautan pribadi. Bagian dibayar setelah penjualan terjadi dan mitra membayar komisinya.',
  asalKomisi:
    'Penghasilan datang dari penjualan yang benar-benar terjadi dan sudah dibayar mitra, bukan dari merekrut orang lain.',
  yangTidakAda:
    'Tidak ada biaya masuk, target rekrutmen, bonus rekrutmen, atau janji penghasilan.',
  syarat:
    'Pembayaran dilakukan setelah mitra membayar komisi dan dipotong pajak sesuai aturan.',
  ajakanDaftar: {
    label: 'Daftar gratis dan pilih jalur',
    sesudahnya:
      'Pilih rujuk transaksi, jadi anggota, atau jadi kreator dan host.',
  },
} as const

/**
 * Review-safe copy copied verbatim from the six owner-approved Sanity drafts.
 * Published content wins field-for-field; this keeps the side templates useful
 * while those records deliberately remain unpublished.
 */
export const SIDE_FALLBACKS = {
  'pelaku-proyek': {
    kunci: 'pelaku-proyek',
    nama: 'Untuk pelaku proyek',
    judul:
      'Bagian mana dari proyek Anda yang belum ada yang mengerjakan? Kami isi.',
    caraMembeli: [
      {
        _key: 'cara-eceran',
        teks: 'Eceran per masalah — saat Anda tahu bagian mana yang tak sanggup ditangani.',
      },
      {
        _key: 'cara-hulu-hilir',
        teks: 'Paket hulu-hilir — saat Anda ingin satu subkon memegang seluruh lingkup pekerjaan.',
      },
      {
        _key: 'cara-rakitan',
        teks: 'Paket rakitan menurut profil — saat Anda ingin kombinasi layanan yang disesuaikan dengan posisi Anda.',
      },
      {
        _key: 'cara-konsultan',
        teks: 'Konsultan atau penyedia — saat Anda membeli atau menjual barang untuk pemerintah.',
      },
    ],
    langkahPertama: {
      label: 'Mulai dari satu celah',
      sesudahnya:
        'Pilih eceran per masalah untuk bagian yang tidak sanggup Anda tangani; paket hulu-hilir dan paket rakitan dapat menyusul.',
    },
  },
  'pemilik-bangunan': {
    kunci: 'pemilik-bangunan',
    nama: 'Untuk pemilik bangunan',
    judul:
      'Ceritakan bangunan yang Anda inginkan. Kami urus dari hulu ke hilir.',
    caraMembeli: [
      { _key: 'alur-cerita', teks: 'Ceritakan bangunan atau masalahnya.' },
      {
        _key: 'alur-survei',
        teks: 'Survei kondisi bangunan dan lokasi sebelum angka apa pun disebut.',
      },
      {
        _key: 'alur-estimasi',
        teks: 'Hitung estimasi dan, bila perlu, visualisasikan ruangan.',
      },
      {
        _key: 'alur-lingkup',
        teks: 'Sepakati lingkup dan harga tertulis sebelum kerja dimulai.',
      },
      {
        _key: 'alur-kerja',
        teks: 'Kelola tenaga, material, jadwal, dan pengawasan dari satu pihak.',
      },
      {
        _key: 'alur-serah',
        teks: 'Periksa hasil terhadap gambar sebelum serah terima.',
      },
      {
        _key: 'alur-rawat',
        teks: 'Lanjutkan perawatan lewat Membership Care bila diperlukan.',
      },
    ],
    langkahPertama: {
      label: 'Ceritakan bangunannya',
      sesudahnya: 'Kami survei kondisi lapangan sebelum angka apa pun disebut.',
    },
  },
  'siap-pakai': {
    kunci: 'siap-pakai',
    nama: 'Untuk yang ingin hasil siap pakai',
    judul:
      'Ceritakan pasar yang ingin dibuka atau pekerjaan yang ingin dilepas. Sisanya kami jalankan.',
    caraMembeli: [
      {
        _key: 'alur-cerita',
        teks: 'Ceritakan masalah dengan bahasa Anda sendiri.',
      },
      {
        _key: 'alur-diagnosis',
        teks: 'Bedah masalah dalam sesi diagnosis; biaya konsultasi bersifat opsional sebagai penyaring.',
      },
      {
        _key: 'alur-jalur',
        teks: 'Pilih layanan matang, rakitan ringan, atau pembangunan otonom penuh bila skalanya tepat.',
      },
      {
        _key: 'alur-bayar',
        teks: 'Pilih biaya pembangunan atau kemitraan bagi hasil.',
      },
      {
        _key: 'alur-persiapan',
        teks: 'Bila belum waktunya, terima saran persiapan satu sampai tiga bulan.',
      },
    ],
    langkahPertama: {
      label: 'Mulai dengan sesi diagnosis',
      sesudahnya:
        'Kami membedah masalahnya dan menyajikan pilihan yang paling sesuai; biaya konsultasi bersifat opsional sebagai penyaring.',
    },
  },
  'paham-teknis': {
    kunci: 'paham-teknis',
    nama: 'Untuk yang paham teknis',
    judul:
      'Spesialis untuk titik macet teknis Anda, dari basis data sampai rilis otomatis.',
    caraMembeli: [
      {
        _key: 'cara-audit',
        teks: 'Audit singkat harga tetap — saat penyebab masalah belum jelas.',
      },
      {
        _key: 'cara-spesifik',
        teks: 'Satu layanan spesifik — saat masalah, lingkup, dan tenggat sudah jelas.',
      },
      {
        _key: 'cara-proyek',
        teks: 'Proyek utuh lintas spesialis — dari rancangan sampai rilis.',
      },
      {
        _key: 'cara-tim',
        teks: 'Tim khusus — bekerja di bawah arahan dan ritme Anda.',
      },
      {
        _key: 'cara-rawat',
        teks: 'Kontrak pemeliharaan bulanan — untuk menjaga sistem yang sudah berjalan.',
      },
    ],
    langkahPertama: {
      label: 'Mulai dengan audit singkat',
      sesudahnya:
        'Kami mencari penyebab masalah sebelum Anda memilih satu layanan, proyek utuh, tim khusus, atau pemeliharaan.',
    },
  },
  'pemilik-usaha': {
    kunci: 'pemilik-usaha',
    nama: 'Untuk pemilik usaha dan brand',
    judul:
      'Pasar mana yang ingin Anda rebut? Kami siapkan perhatian, kepercayaan, dan penjualnya.',
    caraMembeli: [
      {
        _key: 'cara-partial',
        teks: 'Partial: satu modul — saat Anda hanya membutuhkan talenta, aset, laporan, atau bagian tertentu.',
      },
      {
        _key: 'cara-full',
        teks: 'Full: kampanye utuh — dari konsep sampai laporan dipegang satu tim.',
      },
      {
        _key: 'cara-bulanan',
        teks: 'Kelola bulanan — untuk akun, iklan, toko, atau siaran tanpa tim sendiri.',
      },
      {
        _key: 'cara-operator',
        teks: 'Operator — beli hasil dari alat pemasaran tanpa menjalankan alatnya sendiri.',
      },
      {
        _key: 'cara-hasil',
        teks: 'Sebagian dari hasil — kaitkan sebagian biaya dengan leads atau penjualan.',
      },
    ],
    langkahPertama: {
      label: 'Mulai dari audit atau sesi strategi',
      sesudahnya:
        'Langkah awal dapat berupa audit, sesi strategi, workshop, atau playbook; produksi, kampanye, tim, talenta, dan jaringan menyusul bila dibutuhkan.',
    },
  },
  jaringan: {
    kunci: 'jaringan',
    nama: 'Untuk jaringan penjual',
    judul:
      'Punya audiens, jaringan, atau bakat menjual? Dapatkan bagian dari setiap penjualan yang Anda bawa.',
    caraMembeli: [
      {
        _key: 'alur-daftar',
        teks: 'Daftar gratis dan pilih jalur: rujuk transaksi, jadi anggota, atau jadi kreator dan host.',
      },
      {
        _key: 'alur-kode',
        teks: 'Terima kode atau tautan pribadi beserta kartu komisi setiap produk.',
      },
      {
        _key: 'alur-rujuk',
        teks: 'Rujuk pembeli atau ikuti kampanye; setiap rujukan tercatat atas nama Anda.',
      },
      {
        _key: 'alur-bagian',
        teks: 'Terima bagian setelah mitra membayar komisi, dipotong pajak sesuai aturan.',
      },
      {
        _key: 'alur-rekrut',
        teks: 'Tidak ada target rekrutmen atau bonus dari orang yang Anda ajak.',
      },
    ],
    langkahPertama: {
      label: 'Daftar gratis dan pilih jalur',
      sesudahnya:
        'Anda menerima kode atau tautan pribadi beserta kartu komisi untuk setiap produk.',
    },
  },
} as const satisfies Record<Side, SideFallback>
