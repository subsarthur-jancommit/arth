/**
 * Handwritten answers for situation pages, keyed `unit/side/slug`, where the
 * slug is the one derived from the chapter's reader name. A Teknologi page
 * without an entry here is derived entirely by `deriveSituation`; a page
 * built from the shortlist (`shortlistSituation`) lists what it still lacks.
 */

import type { SituationOverride } from './situation-pages'

export const SITUATION_OVERRIDES = new Map<string, SituationOverride>([
  // Approved by the owner, docs/R1-SERAH-BAB-KULINER.md.
  [
    'teknologi/B/kuliner',
    {
      situasi:
        'Untuk warung, kafe, katering, produsen makanan, dan usaha dengan banyak outlet. Pesanan di chat bercampur, dan kasir kewalahan saat ramai.',
      metadata: {
        judul: 'Bot dan workflow untuk usaha kuliner',
        deskripsi:
          'Untuk warung, kafe, katering, dan produsen makanan. Pesanan WhatsApp dicatat bot, dan tamu memesan serta membayar dari meja.',
      },
      jembatan: [
        {
          offer: 'FNB-01',
          kalimat:
            'Untuk kafe yang belum buka, unit Konstruksi menyiapkan lokasi sewa sampai alur pelanggan dan dapurnya bekerja.',
        },
      ],
      pintuMasuk: 'KUL-01',
    },
  ],
  // V3 wave W2, Konstruksi Sisi B (docs/V3-SERAH-W2.md). Copy from the
  // chapter, its row in Peta pembeli, Alur kerja, and Konstruksi aturan main.
  [
    'konstruksi/B/rumah-tinggal',
    {
      pembeli:
        'Untuk keluarga yang membangun rumah pertama, pemilik rumah lama, pemilik ruko, dan calon pembangun.',
      situasi:
        'Anda ingin rumah jadi tanpa anggaran yang membengkak. Anggaran dihitung dari gambar sebelum Anda memutuskan, dan pekerjaannya diawasi satu pihak sampai serah terima.',
      batas:
        'Angka disebut setelah kondisi lapangan disurvei, dan lingkup serta harga disepakati tertulis sebelum kerja dimulai. Perubahan struktur dihitung tenaga ahli berwenang, dan bangunan baru atau penambahan bangunan dimulai setelah persetujuan bangunan gedung terbit.',
      metadata: {
        judul: 'Bangun dan renovasi rumah di Subang, Purwakarta, Bandung',
        deskripsi:
          'Untuk keluarga dan pemilik rumah. Anggaran dihitung dari gambar sebelum membangun, pekerjaan diawasi sampai serah terima, lalu ada masa garansi tertulis.',
      },
    },
  ],
  [
    'konstruksi/B/desain-interior',
    {
      pembeli:
        'Untuk pemilik rumah dan pemilik usaha yang ingin interior tertata.',
      situasi:
        'Anda tahu ruangan yang Anda mau, tetapi sulit menjelaskannya kepada tukang. Kebutuhan ruang dirumuskan dulu, ruangannya divisualisasikan, lalu tukang bekerja dari gambar yang jelas.',
      batas:
        'Visual adalah gambaran rencana, bukan jaminan hasil fisik. Hak cipta gambar dan visual diatur di kontrak, dan gambar struktur dibuat tenaga ahli berwenang. Lingkup dan harga disepakati tertulis sebelum kerja dimulai.',
      metadata: {
        judul: 'Desain interior dari visual sampai gambar kerja tukang',
        deskripsi:
          'Untuk pemilik rumah dan usaha di Subang, Purwakarta, Bandung. Kebutuhan ruang dirumuskan, ruangan divisualisasikan, lalu tukang bekerja dari gambar kerja.',
      },
    },
  ],
  [
    'konstruksi/B/konstruksi-f-b',
    {
      slug: 'fnb',
      pembeli:
        'Untuk pemilik kafe dan resto, pemilik warung, produsen makanan dan katering, dan pemilik banyak outlet.',
      situasi:
        'Lokasinya sudah dapat, tetapi belum berbentuk kafe dan alur dapurnya belum jalan. Kami menata dapur, ruang duduk, dan tampilannya sampai alur pelanggan dan dapurnya bekerja.',
      batas:
        'Angka disebut setelah lokasi disurvei, dan lingkup serta harga disepakati tertulis sebelum kerja dimulai.',
      jembatan: [
        {
          offer: 'KUL-02',
          kalimat:
            'Kafe yang baru jadi bisa langsung memakai pesan dan bayar dari meja, yang dipasang unit Teknologi.',
        },
      ],
      metadata: {
        judul: 'Konstruksi kafe, resto, dan dapur produksi',
        deskripsi:
          'Untuk pemilik kafe, resto, warung, dan katering. Lokasi sewa dibenahi sampai alur pelanggan dan dapurnya bekerja, di Subang, Purwakarta, dan Bandung.',
      },
    },
  ],
  [
    'konstruksi/B/studio-streaming',
    {
      pembeli:
        'Untuk streamer dan kreator, agensi konten, workshop media, dan podcaster.',
      situasi:
        'Siaran Anda terganggu gema, listrik yang tidak stabil, atau set yang berantakan. Akustik, kelistrikan, cahaya, dan set ditangani satu pihak sampai ruangannya siap siaran.',
      batas:
        'Instalasi listrik dikerjakan mitra instalatir berwenang. Angka disebut setelah ruangan disurvei, dan lingkup serta harga disepakati tertulis sebelum kerja dimulai.',
      metadata: {
        judul: 'Studio siaran dan podcast: akustik, listrik, cahaya, set',
        deskripsi:
          'Untuk streamer, kreator, dan podcaster. Gema, listrik, cahaya, dan set ditangani sampai ruangan siap siaran, di Subang, Purwakarta, dan Bandung.',
      },
    },
  ],
  [
    'konstruksi/B/makeover-villa',
    {
      pembeli:
        'Untuk pemilik villa, pemilik kontrakan dan kos, pemilik hostel dan hotel kecil, dan investor properti sewa.',
      situasi:
        'Properti Anda kusam dan sulit disewakan dengan tarif yang pantas. Kamar mandi, atap, dan tampilannya dibenahi, dan unit kontrakan atau kos bisa dibenahi di sela pergantian penyewa.',
      batas:
        'Kami membenahi bangunannya; tarif dan tingkat hunian tetap ditentukan pasar dan cara Anda mengelolanya. Angka disebut setelah properti disurvei, dan lingkup serta harga disepakati tertulis sebelum kerja dimulai.',
      metadata: {
        judul: 'Makeover villa, kontrakan, kos, dan hostel',
        deskripsi:
          'Untuk pemilik villa, kontrakan, kos, dan hostel. Kamar mandi, atap, dan tampilan properti sewa dibenahi, di Subang, Purwakarta, dan Bandung.',
      },
    },
  ],
  [
    'konstruksi/B/membership-care',
    {
      pembeli:
        'Untuk pemilik properti, investor dengan banyak properti, dan pemilik penginapan.',
      situasi:
        'Properti Anda cepat kusam karena tidak ada yang merawatnya secara rutin. Kondisinya diperiksa setiap bulan dan dilaporkan dengan foto, jadi perawatan diputuskan dari data.',
      batas:
        'Perawatan berjalan menurut jadwal dan lingkup yang disepakati tertulis. Perbaikan di luar lingkup dicatat dan baru dikerjakan setelah Anda setuju.',
      metadata: {
        judul: 'Membership Care: perawatan rutin bangunan',
        deskripsi:
          'Untuk pemilik properti dan penginapan di Subang, Purwakarta, dan Bandung. Inspeksi bulanan dengan laporan foto, perawatan atap, cat, dan fasad.',
      },
    },
  ],
  [
    'konstruksi/B/nilai-tambah-lewat-mitra',
    {
      slug: 'lewat-mitra',
      pembeli:
        'Untuk pemilik rumah, pemilik usaha, serta pemilik villa dan kontrakan.',
      situasi:
        'Anda butuh pembiayaan untuk renovasi atau peralatan, atau ingin properti hasil makeover dipasarkan. Kami tidak memberi pinjaman; kami menghubungkan Anda dengan mitra berizin dan menjelaskan syaratnya secara terbuka. Bila Anda memakai mitra lewat kami, mitra membayar kami komisi, dan kami menyebutkannya sejak awal.',
      batas:
        'Kami tidak memberi pinjaman; pembiayaan berjalan lewat mitra berizin, dan penjualan atau sewa lewat perantara properti berizin. Bila Anda memakai mitra lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Pembiayaan renovasi dan pemasaran properti lewat mitra',
        deskripsi:
          'Untuk pemilik rumah, usaha, villa, dan kontrakan di Subang, Purwakarta, Bandung. Pembiayaan dan pemasaran lewat mitra berizin, komisi disebut sejak awal.',
      },
    },
  ],
  // V3 wave W3, Konstruksi Sisi A (docs/V3-SERAH-W3.md). Copy from the
  // chapter, Peta pembeli, Cara membeli, and Konstruksi aturan main 1 to 13.
  [
    'konstruksi/A/paket-hulu-hilir-untuk-kontraktor-utama',
    {
      slug: 'hulu-hilir',
      pembeli: 'Untuk kontraktor utama proyek pemerintah dan swasta.',
      situasi:
        'Paketnya sudah menang, tetapi belum ada subkon yang sanggup memegang semuanya. Satu subkon memegang tenaga, material, alat, dan laporan untuk satu lingkup pekerjaan, dari hulu ke hilir.',
      batas:
        'Lingkup dan harga disepakati tertulis sebelum kerja dimulai. Pekerjaan struktur dihitung tenaga ahli berwenang, dan keselamatan kerja serta kelaikan alat dipenuhi di lokasi.',
      metadata: {
        judul: 'Subkon hulu-hilir untuk kontraktor utama',
        deskripsi:
          'Untuk kontraktor utama di Subang, Purwakarta, dan Bandung. Satu subkon memegang tenaga, material, alat, dan laporan untuk satu lingkup pekerjaan.',
      },
    },
  ],
  [
    'konstruksi/A/administrasi-dengan-pemerintah',
    {
      slug: 'administrasi-pemerintah',
      pembeli: 'Untuk kontraktor utama, subkontraktor, dan penyedia barang.',
      situasi:
        'Dokumen menumpuk, tender terlewat, dan berkas termin selalu terlambat. Paket dipantau setiap minggu, berkas kualifikasi dan penawaran disiapkan, dan berkas termin dijaga lengkap.',
      batas:
        'Kami membantu menyiapkan berkas dan memahami aturan, bukan mengatur hasil tender. Nama dan sertifikat tidak dipinjamkan. Keputusan pemenang dan pencairan termin tetap di tangan pemberi kerja.',
      metadata: {
        judul: 'Administrasi tender dan termin untuk kontraktor',
        deskripsi:
          'Untuk kontraktor dan penyedia di Subang, Purwakarta, dan Bandung. Paket tender dipantau, berkas kualifikasi disiapkan, dan berkas termin dijaga lengkap.',
      },
    },
  ],
  [
    'konstruksi/A/tenaga-kerja',
    {
      pembeli:
        'Untuk kontraktor utama, subkontraktor, dan developer perumahan.',
      situasi:
        'Tukang tidak datang tepat waktu dan tidak ada yang mengendalikan mereka di lapangan. Tukang datang sesuai jadwal, mandor mengendalikan mereka setiap hari, dan upahnya tercatat tertib.',
      batas:
        'Tenaga ahli bekerja di lapangan proyek Anda; nama dan sertifikatnya tidak dipinjamkan. Lingkup dan harga disepakati tertulis sebelum kerja dimulai.',
      metadata: {
        judul: 'Tukang, mandor, dan tim finishing untuk proyek',
        deskripsi:
          'Untuk kontraktor dan developer di Subang, Purwakarta, dan Bandung. Tukang datang sesuai jadwal, mandor mengendalikan di lapangan, dan upah tercatat tertib.',
      },
    },
  ],
  [
    'konstruksi/A/material',
    {
      pembeli:
        'Untuk kontraktor utama, subkontraktor, developer perumahan, dan penyedia barang.',
      situasi:
        'Harga material bergeser, barang telat, dan jadwalnya tidak sinkron dengan pekerjaan. Harga di tiga wilayah dipegang sebagai acuan, dan material dijadwalkan tiba per tahap.',
      batas:
        'Harga material tetap ditentukan pemasok; daftar harga kami menjadi pegangan untuk RAB dan negosiasi. Lingkup dan harga disepakati tertulis sebelum kerja dimulai.',
      metadata: {
        judul: 'Harga dan jadwal material proyek',
        deskripsi:
          'Untuk kontraktor, subkon, dan developer di Subang, Purwakarta, dan Bandung. Harga material tiga wilayah dipegang, dan material tiba per tahap.',
      },
    },
  ],
  [
    'konstruksi/A/modal-kerja-lewat-penjembatanan',
    {
      slug: 'modal-kerja',
      pembeli:
        'Untuk kontraktor utama, subkontraktor, penyedia barang, dan developer perumahan.',
      situasi:
        'Uang muka belum cair, material harus dibayar dulu, dan tagihan termin belum turun. Kami tidak memberi pinjaman; kebutuhan kas dipetakan lebih dulu, lalu dijembatani lewat tempo material dan mitra pembiayaan berizin. Bila Anda memakai mitra lewat kami, mitra membayar kami komisi, dan kami menyebutkannya sejak awal.',
      batas:
        'Kami tidak memberi pinjaman dan tidak menghimpun dana klien; pembiayaan dan jaminan berjalan lewat mitra berizin. Bila Anda memakai mitra lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Modal kerja proyek lewat mitra berizin',
        deskripsi:
          'Untuk kontraktor dan subkon. Kas proyek dipetakan, lalu dijembatani lewat tempo material dan mitra berizin. Kami tidak memberi pinjaman.',
      },
    },
  ],
  [
    'konstruksi/A/alat',
    {
      pembeli:
        'Untuk kontraktor utama, subkontraktor, dan developer perumahan.',
      situasi:
        'Anda butuh alat hanya beberapa hari dan tidak mau membelinya. Peralatan ringan disewakan per hari, diantar ke lokasi, dan diperiksa sebelum dipakai.',
      batas:
        'Alat diperiksa kelaikannya sebelum dipakai, dan keselamatan kerja di lokasi dipenuhi. Bab ini mencakup peralatan ringan; alat berat tidak termasuk. Harga harian dan jadwal antar jemput disepakati tertulis sebelum alat dikirim.',
      metadata: {
        judul: 'Sewa peralatan ringan per hari untuk proyek',
        deskripsi:
          'Untuk kontraktor dan subkon di Subang, Purwakarta, dan Bandung. Molen, stamper, dan perancah per hari, diantar ke lokasi dan diperiksa sebelum dipakai.',
      },
    },
  ],
  [
    'konstruksi/A/administrasi-internal-proyek',
    {
      slug: 'administrasi-proyek',
      pembeli:
        'Untuk kontraktor utama, subkontraktor, developer perumahan, dan penyedia barang.',
      situasi:
        'Laporan lewat chat, kurva S tidak jelas, dan biaya lapangan tidak terpantau. Laporan disusun dalam format pemberi kerja, kurva S diperbarui setiap minggu, dan anggaran dibandingkan dengan realisasinya.',
      batas:
        'Laporan dan opname disusun dari kondisi lapangan; persetujuan termin tetap di tangan pemberi kerja. Lingkup dan harga disepakati tertulis sebelum kerja dimulai.',
      metadata: {
        judul: 'Laporan proyek, kurva S, dan pengendalian biaya',
        deskripsi:
          'Untuk kontraktor dan developer di Subang, Purwakarta, dan Bandung. Laporan format pemberi kerja, kurva S mingguan, dan anggaran dibanding realisasi.',
      },
    },
  ],
  [
    'konstruksi/A/konsultan-pengadaan-untuk-penyedia-barang',
    {
      slug: 'konsultan-pengadaan',
      pembeli: 'Untuk penyedia barang bagi instansi pemerintah.',
      situasi:
        'Anda penyedia, tetapi sulit mencari barang dengan margin sehat dan mengurus TKDN. Sumber barang dan harga pembanding dicari sebelum Anda menawar, dan pengajuan TKDN didampingi.',
      batas:
        'Kami menjadi konsultan hanya untuk paket yang bukan milik Arthur, karena peran penyedia dan konsultan tidak dipegang pada paket yang sama. Keuntungan dalam HPS dijaga wajar dan dapat diperiksa auditor. Sertifikat TKDN diterbitkan lembaga berwenang; kami mendampingi pengajuannya.',
      metadata: {
        judul: 'Konsultan pengadaan untuk penyedia barang pemerintah',
        deskripsi:
          'Untuk penyedia barang di Subang, Purwakarta, dan Bandung. Sumber dan harga pembanding dicari, margin dihitung, dan pengajuan TKDN didampingi.',
      },
    },
  ],
  [
    'konstruksi/A/arthur-sebagai-penyedia-untuk-instansi',
    {
      slug: 'penyedia-instansi',
      pembeli: 'Untuk sekolah, dinas, kantor, kelurahan, dan desa.',
      situasi:
        'Instansi butuh barang sesuai spesifikasi, tepat waktu, dan dengan dokumen lengkap. Kami menjadi penyedia: barang dibuat menurut spesifikasi, dipasang bila perlu, dan klaim garansinya ditangani.',
      batas:
        'Kami menjadi penyedia hanya untuk paket yang tidak kami dampingi sebagai konsultan. Barang dibuat sesuai spesifikasi pengadaan, dan keuntungan dalam HPS dijaga wajar serta dapat diperiksa auditor.',
      metadata: {
        judul: 'Pengadaan perabot, papan, dan perlengkapan instansi',
        deskripsi:
          'Untuk sekolah, dinas, kelurahan, dan desa di Subang, Purwakarta, dan Bandung. Barang sesuai spesifikasi, bersama pemasangan dan garansi.',
      },
    },
  ],
  [
    'konstruksi/A/developer-perumahan',
    {
      pembeli: 'Untuk developer perumahan.',
      situasi:
        'Unit selesai, tetapi finishing telat, komplain menumpuk, dan laporan untuk bank belum siap. Setiap unit diperiksa sebelum serah terima, komplain pembeli diperbaiki, dan laporan progres per unit disusun untuk bank.',
      batas:
        'Laporan progres disusun untuk bank; keputusan pencairan KPR tetap di tangan bank. Lingkup dan harga per unit disepakati tertulis sebelum kerja dimulai.',
      metadata: {
        judul: 'Finishing dan serah terima unit untuk developer',
        deskripsi:
          'Untuk developer perumahan di Subang, Purwakarta, dan Bandung. Unit diperiksa sebelum serah terima, komplain diperbaiki, laporan progres untuk bank.',
      },
    },
  ],
  [
    'konstruksi/A/kontraktor-swasta',
    {
      pembeli:
        'Untuk kontraktor swasta dan kontraktor pemerintah yang juga mengerjakan proyek swasta.',
      situasi:
        'Proyek swasta Anda kekurangan tenaga dan material yang datang tepat waktu. Tukang dengan mandor, material per tahap, dan tim finishing tersedia untuk proyek klien Anda.',
      batas:
        'Lingkup dan harga disepakati tertulis sebelum kerja dimulai. Tempo material berjalan lewat mitra; kami tidak memberi pinjaman. Bila Anda memakai mitra lewat kami, mitra membayar kami komisi, dan kami menyebutkannya sejak awal.',
      metadata: {
        judul: 'Tenaga dan material untuk kontraktor swasta',
        deskripsi:
          'Untuk kontraktor swasta di Subang, Purwakarta, dan Bandung. Tukang dengan mandor, material per tahap, dan tim finishing untuk proyek klien Anda.',
      },
    },
  ],
  [
    'konstruksi/A/paket-rakitan-menurut-profil-pembeli',
    {
      slug: 'paket-rakitan',
      pembeli:
        'Untuk kontraktor utama, subkontraktor, developer perumahan, dan penyedia barang, menurut posisinya di proyek.',
      situasi:
        'Anda butuh paket yang cocok dengan posisi Anda sekarang, bukan semua layanan. Setiap paket dimulai dari satu posisi dan satu masalah, lalu diisi layanan seminimal mungkin.',
      batas:
        'Berkas tender disiapkan, bukan diatur hasilnya, dan nama serta sertifikat tidak dipinjamkan. Lingkup dan harga disepakati tertulis sebelum kerja dimulai.',
      metadata: {
        judul: 'Paket layanan konstruksi menurut posisi Anda',
        deskripsi:
          'Untuk kontraktor, subkon, developer, dan penyedia di Subang, Purwakarta, dan Bandung. Paket dimulai dari satu masalah dan diisi layanan seminimal mungkin.',
      },
    },
  ],
])
