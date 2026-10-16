import type { Side } from '@/lib/content/units'

interface SideFallbackStep {
  _key: string
  /** The way to buy, or the workflow step. */
  nama: string
  /** When the way fits, or what happens at the step. */
  keterangan: string
}

export interface SideFallback {
  kunci: Side
  nama: string
  judul: string
  /** Buyers on this side, from the unit's Peta pembeli, written as people. */
  pembeli: readonly string[]
  caraMembeli: readonly SideFallbackStep[]
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
    pembeli: [
      'Kontraktor utama',
      'Subkontraktor',
      'Penyedia barang untuk pemerintah',
      'Instansi pembeli barang',
      'Developer perumahan',
      'Kontraktor swasta',
    ],
    caraMembeli: [
      {
        _key: 'cara-eceran',
        nama: 'Eceran per masalah',
        keterangan:
          'Cocok bila Anda tahu bagian mana yang tak sanggup Anda tangani.',
      },
      {
        _key: 'cara-hulu-hilir',
        nama: 'Paket hulu-hilir',
        keterangan:
          'Cocok bila Anda ingin satu subkon memegang seluruh lingkup pekerjaan.',
      },
      {
        _key: 'cara-rakitan',
        nama: 'Paket rakitan menurut profil',
        keterangan:
          'Cocok bila Anda ingin kombinasi layanan yang sudah disesuaikan dengan posisi Anda.',
      },
      {
        _key: 'cara-konsultan',
        nama: 'Konsultan atau penyedia',
        keterangan:
          'Cocok bila Anda membeli atau menjual barang untuk pemerintah.',
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
    pembeli: [
      'Keluarga dan pemilik rumah',
      'Pemilik kafe, resto, dan dapur produksi',
      'Streamer, kreator, dan workshop media',
      'Pemilik villa, kontrakan, hotel, dan hostel',
      'Pemilik properti',
    ],
    caraMembeli: [
      {
        _key: 'alur-cerita',
        nama: 'Ceritakan bangunan atau masalahnya',
        keterangan:
          'Kami mencari pekerjaan yang paling dekat dengan bangunan Anda.',
      },
      {
        _key: 'alur-survei',
        nama: 'Survei kondisi lapangan',
        keterangan:
          'Kondisi bangunan dan lokasi dilihat langsung sebelum angka apa pun disebut.',
      },
      {
        _key: 'alur-estimasi',
        nama: 'Estimasi dan visual',
        keterangan:
          'Anggaran dihitung dan, bila perlu, ruangan divisualisasikan sebelum dikerjakan.',
      },
      {
        _key: 'alur-lingkup',
        nama: 'Lingkup dan harga tertulis',
        keterangan: 'Disepakati sebelum kerja dimulai.',
      },
      {
        _key: 'alur-kerja',
        nama: 'Pekerjaan dan pengawasan',
        keterangan: 'Tenaga, material, dan jadwal dikelola satu pihak.',
      },
      {
        _key: 'alur-serah',
        nama: 'Serah terima dan garansi',
        keterangan: 'Hasil diperiksa terhadap gambar sebelum diserahkan.',
      },
      {
        _key: 'alur-rawat',
        nama: 'Perawatan',
        keterangan:
          'Bila Anda mau, Membership Care menjaga nilai bangunan sesudahnya.',
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
    pembeli: [
      'Pemilik warung, toko, salon, dan bengkel',
      'Pemilik usaha menengah, franchise, dan multi-cabang',
      'Klinik, sekolah, koperasi, dan desa',
      'Trader dan investor individu',
      'Kreator dan pengelola komunitas',
      'Kontraktor, developer perumahan, dan penyedia barang',
      'Pemilik konter, agen, dan reseller',
      'Pemilik usaha yang mencari pendapatan tambahan',
    ],
    caraMembeli: [
      {
        _key: 'alur-cerita',
        nama: 'Ceritakan masalahnya',
        keterangan:
          'Kami mencari pekerjaan yang paling dekat dengan usaha Anda.',
      },
      {
        _key: 'alur-diagnosis',
        nama: 'Sesi diagnosis',
        keterangan:
          'Kami membedah masalahnya dan menyajikan pilihan yang paling sesuai. Biaya konsultasi bersifat opsional dan berfungsi sebagai penyaring.',
      },
      {
        _key: 'alur-jalur',
        nama: 'Pilih jalur',
        keterangan:
          'Pakai layanan yang sudah matang, rakit ringan dari beberapa layanan, atau bangun penuh untuk usaha multi-cabang dan perusahaan besar.',
      },
      {
        _key: 'alur-bayar',
        nama: 'Pilih cara bayar',
        keterangan: 'Biaya pembangunan, atau kemitraan bagi hasil.',
      },
      {
        _key: 'alur-persiapan',
        nama: 'Bila belum waktunya',
        keterangan:
          'Kami menyampaikannya terus terang dan menyarankan langkah persiapan selama satu sampai tiga bulan.',
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
    pembeli: [
      'Individu, pembelajar, dan hobbyist',
      'Freelancer dan agensi kecil',
      'Software house dan perusahaan IT',
      'Startup founder dan CTO',
      'Tim IT internal',
    ],
    caraMembeli: [
      {
        _key: 'cara-audit',
        nama: 'Audit singkat harga tetap',
        keterangan: 'Cocok bila Anda belum yakin penyebab masalahnya.',
      },
      {
        _key: 'cara-spesifik',
        nama: 'Satu layanan spesifik',
        keterangan:
          'Cocok bila Anda tahu masalahnya dan lingkup serta tenggatnya jelas.',
      },
      {
        _key: 'cara-proyek',
        nama: 'Proyek utuh lintas spesialis',
        keterangan: 'Cocok bila Anda butuh hasil dari rancangan sampai rilis.',
      },
      {
        _key: 'cara-tim',
        nama: 'Tim khusus di bawah arahan Anda',
        keterangan: 'Cocok bila Anda butuh tenaga yang mengikuti ritme Anda.',
      },
      {
        _key: 'cara-rawat',
        nama: 'Kontrak pemeliharaan bulanan',
        keterangan: 'Cocok bila sistem sudah berjalan dan harus dijaga.',
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
    pembeli: [
      'UMKM dan usaha lokal',
      'Brand dan seller marketplace',
      'Usaha F&B, penginapan, dan studio',
      'Dealer, properti, klinik, salon, bengkel, dan kursus',
      'Instansi, desa wisata, dan program CSR',
      'Pendiri dan tim produk',
      'Agensi lain',
      'Vendor dan pemilik program komisi',
    ],
    caraMembeli: [
      {
        _key: 'cara-partial',
        nama: 'Satu modul',
        keterangan:
          'Cocok bila Anda sudah punya sebagian dan hanya butuh satu bagian, misalnya talenta, aset, atau laporan saja.',
      },
      {
        _key: 'cara-full',
        nama: 'Kampanye utuh',
        keterangan:
          'Cocok bila Anda ingin kampanye dari konsep sampai laporan dipegang satu tim.',
      },
      {
        _key: 'cara-bulanan',
        nama: 'Kelola bulanan',
        keterangan:
          'Cocok bila Anda ingin akun, iklan, toko, atau siaran berjalan setiap bulan tanpa tim sendiri.',
      },
      {
        _key: 'cara-operator',
        nama: 'Operator',
        keterangan:
          'Cocok bila Anda ingin hasil dari alat pemasaran tanpa membeli dan menjalankan alatnya sendiri.',
      },
      {
        _key: 'cara-hasil',
        nama: 'Sebagian dari hasil',
        keterangan:
          'Cocok bila Anda ingin sebagian biaya dikaitkan dengan leads atau penjualan.',
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
    pembeli: [
      'Sales lepas, makelar, calo, dan mandor',
      'Anggota komunitas',
      'Kreator, streamer, dan host',
    ],
    caraMembeli: [
      {
        _key: 'alur-daftar',
        nama: 'Daftar gratis dan pilih jalur',
        keterangan:
          'Rujuk transaksi, jadi anggota, atau jadi kreator dan host.',
      },
      {
        _key: 'alur-kode',
        nama: 'Terima kode atau tautan pribadi',
        keterangan:
          'Beserta kartu komisi untuk setiap produk: siapa yang membayar, pemicunya, besarnya, dan kapan cair.',
      },
      {
        _key: 'alur-rujuk',
        nama: 'Rujuk pembeli atau ikuti kampanye',
        keterangan: 'Setiap rujukan tercatat atas nama Anda.',
      },
      {
        _key: 'alur-bagian',
        nama: 'Terima bagian Anda',
        keterangan:
          'Setelah mitra membayar komisinya kepada kami, dipotong pajak sesuai aturan.',
      },
      {
        _key: 'alur-rekrut',
        nama: 'Tanpa target rekrutmen',
        keterangan: 'Tidak ada bonus dari orang yang Anda ajak.',
      },
    ],
    langkahPertama: {
      label: 'Daftar gratis dan pilih jalur',
      sesudahnya:
        'Anda menerima kode atau tautan pribadi beserta kartu komisi untuk setiap produk.',
    },
  },
} as const satisfies Record<Side, SideFallback>
