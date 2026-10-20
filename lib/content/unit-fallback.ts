import type { Side, Unit } from '@/lib/content/units'

export interface UnitFallbackPoint {
  _key: string
  teks: string
}

export interface UnitFallbackPillar {
  _key: string
  lead: string
  isi: string
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
  subjudul: string
  pembuka: string
  pilar: readonly UnitFallbackPillar[]
  ringkas: string
  masalah: readonly UnitFallbackPoint[]
  caraKerja: readonly UnitFallbackPoint[]
  sisi: readonly UnitFallbackSide[]
  ajakan: {
    label: string
    sesudahnya: string
  }
}

/**
 * Each unit's ready-to-publish header, word for word from the master brief,
 * so a unit page reads correctly before its Sanity document is published
 * (docs/RENCANA-KONTEKS-V2.md, V1; Aturan isi 11).
 *
 * Generated from the same extraction as the W1 Sanity write
 * (docs/V1-SERAH-W1.md), so the two say the same thing. One sentence is cut
 * whole: the trading-bot sentence in Teknologi's “Kami mengotomatiskan
 * pekerjaan.”, until the owner decides the trading bot's position. The
 * problems and working steps are agent-written, each traced to a buyer quote
 * or header line in the handover.
 *
 * Published Sanity content wins whenever it exists.
 */
export const UNIT_FALLBACKS = {
  konstruksi: {
    kunci: 'konstruksi',
    nama: 'Konstruksi',
    judul: 'Isi celahnya. Bangun sampai jadi. Rawat sesudahnya.',
    subjudul:
      'Konstruksi sipil dari hulu ke hilir untuk Subang, Purwakarta, dan Bandung.',
    pembuka:
      'Proyek konstruksi jarang tersendat karena tidak ada yang mampu membangun. Proyek tersendat di celah-celah: dokumen yang belum siap, tukang yang belum datang, material yang belum tiba atau harganya bergeser, modal yang belum cair, dan laporan yang belum jadi. Kami bekerja di celah-celah itu.',
    pilar: [
      {
        _key: 'pilar-1',
        lead: 'Kami mengisi celah.',
        isi: 'Bagi kontraktor utama, subkontraktor, developer, dan penyedia barang, kami mengambil bagian yang tidak sempat atau tidak sanggup Anda tangani: administrasi dengan pemerintah, tenaga kerja, material, alat, laporan proyek, sampai penjembatanan modal kerja. Anda membeli per masalah, atau menyerahkan seluruh lingkup pekerjaan dari hulu ke hilir dalam satu paket.',
      },
      {
        _key: 'pilar-2',
        lead: 'Kami membangun sampai jadi.',
        isi: 'Bagi pemilik rumah, pemilik usaha, dan pemilik properti, kami mengurus proyek dari hulu ke hilir: estimasi, desain teknis dan visualisasi interior, pekerjaan lapangan, sampai serah terima. Anda tidak perlu mengurus tukang, material, dan jadwal satu per satu.',
      },
      {
        _key: 'pilar-3',
        lead: 'Kami membuat bangunan bekerja lebih produktif.',
        isi: 'Bagi pemilik kafe dan dapur produksi, studio streaming dan workshop media, serta villa, kontrakan, hotel, dan hostel, kami menyesuaikan bangunan dengan cara industrinya mencari uang: alur pelanggan yang lebih cepat, ruang yang lebih tenang, kamar yang lebih layak jual.',
      },
      {
        _key: 'pilar-4',
        lead: 'Kami merawat sesudahnya.',
        isi: 'Lewat Membership Care, pekerja kami menjaga kondisi dan estetika properti Anda secara berkala dan melaporkannya, sehingga nilai bangunan tidak turun karena dibiarkan.',
      },
      {
        _key: 'pilar-5',
        lead: 'Kami bekerja di tiga wilayah yang kami kenal.',
        isi: 'Subang, Purwakarta, dan Bandung. Kepercayaan di proyek lapangan dibangun satu wilayah demi satu wilayah, bersama pemasok, tukang, dan kebiasaan pengadaan yang sudah kami kenal.',
      },
      {
        _key: 'pilar-6',
        lead: 'Cara kami bekerja.',
        isi: 'Kami berkata jujur tentang apa yang bisa dan tidak bisa kami kerjakan. Tenaga ahli kami bekerja di lapangan proyek Anda; kami tidak meminjamkan nama atau sertifikat untuk memenuhi syarat tender. Layanan administrasi membantu Anda menyiapkan dan memahami aturan, bukan mengatur hasil. Lingkup dan harga disepakati tertulis sebelum kerja dimulai.',
      },
    ],
    ringkas:
      'Kami mengisi celah di proyek konstruksi, membangun sampai jadi, dan merawatnya sesudahnya, di Subang, Purwakarta, dan Bandung.',
    masalah: [
      {
        _key: 'masalah-1',
        teks: 'Dokumen tender, termin, dan izin belum siap.',
      },
      {
        _key: 'masalah-2',
        teks: 'Tukang tidak datang tepat waktu dan tidak ada pengendalinya.',
      },
      {
        _key: 'masalah-3',
        teks: 'Harga material bergeser dan barang datang terlambat.',
      },
      {
        _key: 'masalah-4',
        teks: 'Uang muka belum cair, padahal material harus dibayar dulu.',
      },
      {
        _key: 'masalah-5',
        teks: 'Laporan lewat chat dan biaya lapangan tidak terpantau.',
      },
      {
        _key: 'masalah-6',
        teks: 'Anggaran rumah membengkak dan pekerjaannya tidak diawasi.',
      },
    ],
    caraKerja: [
      {
        _key: 'kerja-1',
        teks: 'Ceritakan bangunan atau proyeknya, dengan bahasa Anda sendiri.',
      },
      {
        _key: 'kerja-2',
        teks: 'Kami tentukan sisinya: pelaku proyek atau pemilik bangunan.',
      },
      {
        _key: 'kerja-3',
        teks: 'Kondisi lapangan dilihat langsung sebelum angka apa pun disebut.',
      },
      {
        _key: 'kerja-4',
        teks: 'Lingkup dan harga disepakati tertulis sebelum kerja dimulai.',
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
    subjudul:
      'Bot dan workflow yang bekerja dua puluh empat jam untuk bisnis Anda, di sektor apa pun.',
    pembuka:
      'Kebanyakan bisnis tidak kekurangan aplikasi. Yang mereka kekurangan ada dua: pasar yang belum terbuka, dan pekerjaan berulang yang masih dikerjakan tangan manusia. Kami bekerja tepat di dua titik itu.',
    pilar: [
      {
        _key: 'pilar-1',
        lead: 'Kami membuka pasar.',
        isi: 'Dari usaha yang sudah berjalan, kami membuka kanal pendapatan yang berjalan berdampingan dengannya: lini pulsa dan tagihan, langganan, marketplace, toko produk digital, agen tiket dan travel, layanan yang menyatukan beberapa vendor, merek putih yang disewakan, sampai mesin bayar-per-pakai. Tujuannya bukan menggantikan usaha Anda hari ini, melainkan membuat pendapatan Anda tidak bergantung pada satu sumber.',
      },
      {
        _key: 'pilar-2',
        lead: 'Kami mengotomatiskan pekerjaan.',
        isi: 'Bot kami menjawab, menagih, memantau, dan bertransaksi pukul tiga pagi, ketika tidak ada orang yang berjaga. Workflow kami memindahkan pesanan, permohonan, dan tagihan dari satu tangan ke tangan berikutnya tanpa menunggu diingatkan.',
      },
      {
        _key: 'pilar-3',
        lead: 'Sektornya bisa apa saja, karena mesinnya sama.',
        isi: 'Kuliner, ritel, pendidikan, kesehatan, properti, konstruksi, logistik, keuangan, sampai instansi: yang berbeda hanya masalahnya. Karena itu kami tidak memulai dari daftar layanan. Kami memulai dari masalah yang Anda ceritakan, lalu menentukan apakah jawabannya bot, workflow, atau pasar baru.',
      },
      {
        _key: 'pilar-4',
        lead: 'Di balik layar ada lapisan data yang menentukan umur semuanya.',
        isi: 'Basis data relasional untuk transaksi yang tidak boleh salah, data waktu nyata untuk hal yang tidak boleh terlambat, dan graf relasi untuk hal yang tersembunyi di dalam hubungan: rekomendasi, pola kecurangan, peta pemasok, dan pengetahuan perusahaan yang bisa ditanya.',
      },
      {
        _key: 'pilar-5',
        lead: 'Dua pintu masuk.',
        isi: 'Jika Anda memahami teknis, seperti developer, agensi, software house, atau CTO, masuklah lewat Sisi A: spesialis untuk titik macet yang sedang menghambat Anda. Jika Anda menginginkan hasil akhir yang siap dipakai, masuklah lewat Sisi B: kami mulai dari pasar yang ingin Anda buka atau pekerjaan yang ingin Anda lepaskan dari tangan manusia.',
      },
      {
        _key: 'pilar-6',
        lead: 'Cara kami bekerja.',
        isi: 'Kami tidak membangun dari nol bila layanan yang sudah matang menyelesaikan masalahnya; kami menyarankannya lebih dulu, dan berkata jujur bila sesuatu belum perlu Anda beli. Bisnisnya milik Anda, mereknya milik Anda, datanya milik Anda; kode, akses, dan dokumentasi diserahkan kepada Anda. Kami tidak menjanjikan keuntungan instan. Yang kami berikan adalah perhitungan yang terbuka, otomatisasi yang bekerja, dan pendampingan sampai berjalan. Pembayaran fleksibel: biaya pembangunan, atau kemitraan bagi hasil.',
      },
    ],
    ringkas:
      'Kami membuka pasar baru dan mengotomatiskan pekerjaan berulang lewat bot dan workflow, di sektor apa pun.',
    masalah: [
      {
        _key: 'masalah-1',
        teks: 'Pendapatan masih bergantung pada satu sumber.',
      },
      {
        _key: 'masalah-2',
        teks: 'Pesanan, tagihan, dan laporan masih dikerjakan tangan.',
      },
      { _key: 'masalah-3', teks: 'Pekerjaan berulang menyita waktu tim Anda.' },
      {
        _key: 'masalah-4',
        teks: 'Data lambat, terlambat, atau tidak terhubung satu sama lain.',
      },
      { _key: 'masalah-5', teks: 'Tenggat ketat dan spesialis sulit dicari.' },
    ],
    caraKerja: [
      {
        _key: 'kerja-1',
        teks: 'Ceritakan masalahnya dengan bahasa Anda sendiri.',
      },
      {
        _key: 'kerja-2',
        teks: 'Kami tentukan jawabannya: bot, workflow, atau pasar baru.',
      },
      {
        _key: 'kerja-3',
        teks: 'Layanan yang sudah matang disarankan lebih dulu.',
      },
      {
        _key: 'kerja-4',
        teks: 'Kode, akses, data, dan dokumentasi diserahkan kepada Anda.',
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
    subjudul:
      'Agency marketshare untuk usaha dan brand, berbasis di Subang, Purwakarta, dan Bandung.',
    pembuka:
      'Usaha jarang kalah karena produknya buruk. Usaha kalah karena terlalu sedikit orang yang tahu, belum cukup orang yang percaya, dan tidak ada yang ikut menjualkan. Kami bekerja di ketiga titik itu.',
    pilar: [
      {
        _key: 'pilar-1',
        lead: 'Kami merebut perhatian.',
        isi: 'Iklan di TikTok, Meta, dan Google dijalankan dengan aset yang diproduksi massal: video, foto, animasi, dan desain. Satu hari produksi dirancang untuk mengisi stok konten sebulan.',
      },
      {
        _key: 'pilar-2',
        lead: 'Kami membangun kepercayaan di dunia nyata.',
        isi: 'Kampanye lapangan membawa brand Anda ke tengah warga: event hunting kota, aktivasi di lokasi mitra, sales lapangan, dan campaign talent. Anda bisa membeli satu modul atau menyerahkan kampanye utuh.',
      },
      {
        _key: 'pilar-3',
        lead: 'Kami menghadirkan orang yang menjualkan.',
        isi: 'Kreator, streamer, host live, sales lepas, dan anggota komunitas ikut menjual produk Anda. Mereka dibayar dari penjualan yang benar-benar terjadi.',
      },
      {
        _key: 'pilar-4',
        lead: 'Kami mengoperasikan alatnya untuk Anda.',
        isi: 'Kami melanggan platform pesan dan CRM, lalu menjalankannya untuk satu jenis usaha: leads dibalas, ditindaklanjuti, dan dicatat sampai closing. Anda membeli hasilnya, bukan lisensinya.',
      },
      {
        _key: 'pilar-5',
        lead: 'Kami bekerja di dalam ekosistem platform.',
        isi: 'Toko, kampanye afiliasi, dan siaran live dikelola mengikuti aturan Shopee dan TikTok Shop by Tokopedia yang terus berubah. Biaya dan komisi platform kami hitung ulang setiap kali aturannya bergeser.',
      },
      {
        _key: 'pilar-6',
        lead: 'Cara kami bekerja.',
        isi: 'Target, lingkup, dan laporan disepakati tertulis. Komisi dari mitra kami ungkapkan kepada klien dan anggota. Jaringan kami dibayar dari penjualan, tanpa biaya masuk, tanpa bonus rekrutmen, dan tanpa janji penghasilan.',
      },
    ],
    ringkas:
      'Peekabo membuat usaha Anda dikenal, dipercaya, dan dibeli, lalu menghadirkan kreator, host, sales, dan komunitas yang ikut menjualkannya.',
    masalah: [
      { _key: 'masalah-1', teks: 'Belum banyak yang tahu usaha Anda.' },
      { _key: 'masalah-2', teks: 'Yang tahu belum yakin.' },
      { _key: 'masalah-3', teks: 'Yang yakin belum membeli.' },
      { _key: 'masalah-4', teks: 'Pembeli tidak kembali.' },
      { _key: 'masalah-5', teks: 'Belum ada yang ikut menjualkan.' },
    ],
    caraKerja: [
      { _key: 'kerja-1', teks: 'Ceritakan pasar yang ingin Anda rebut.' },
      {
        _key: 'kerja-2',
        teks: 'Kami tentukan lapis mana yang bekerja lebih dulu.',
      },
      {
        _key: 'kerja-3',
        teks: 'Mulai dari audit, sesi strategi, workshop, atau playbook.',
      },
      {
        _key: 'kerja-4',
        teks: 'Target, lingkup, dan laporan disepakati tertulis.',
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
