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
  // V3 wave W4, Teknologi Sisi B (docs/V3-SERAH-W4.md). Copy from the
  // chapter, Peta pembeli, and Teknologi aturan main; wilayah is not
  // stated, because the Teknologi region is still undecided.
  [
    'teknologi/B/ritel',
    {
      pembeli:
        'Untuk seller marketplace, brand fesyen dan kecantikan, pemilik toko fisik, serta reseller dan dropshipper.',
      situasi:
        'Anda bergantung pada marketplace, stok tidak sinkron, dan pelanggan datang sekali lalu hilang. Stok di semua kanal diambil dari satu sumber, dan toko brand sendiri menyimpan data pembeli Anda.',
      batas:
        'Sinkron stok dengan marketplace berjalan lewat sambungan resmi setiap platform. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk ritel, fesyen, dan e-commerce',
        deskripsi:
          'Untuk seller marketplace, brand, dan toko fisik. Stok semua kanal dari satu sumber, dan chat pembeli dijawab seketika.',
      },
    },
  ],
  [
    'teknologi/B/distributor',
    {
      pembeli:
        'Untuk distributor, grosir, toko bangunan, dan tim sales lapangan.',
      situasi:
        'Pesanan sales masuk lewat chat, stok selisih, dan piutang telat. Pesanan sales masuk langsung ke gudang, stok dicocokkan berkala, dan pengingat piutang terkirim bertahap.',
      batas:
        'Pesan WhatsApp hanya dikirim kepada pelanggan yang setuju menerimanya. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk distributor dan grosir',
        deskripsi:
          'Untuk distributor, grosir, dan toko bangunan. Pesanan sales masuk langsung ke gudang, stok dicocokkan berkala, dan piutang diingatkan bertahap.',
      },
    },
  ],
  [
    'teknologi/B/jasa-lokal',
    {
      pembeli:
        'Untuk salon dan barbershop, bengkel, laundry, pemilik kos dan kontrakan, serta rental PS dan photobox.',
      situasi:
        'Jadwal bentrok, pelanggan lupa datang, tagihan kos menunggak, dan mesin harus dijaga terus. Pelanggan memesan jadwal lewat bot, tagihan kos berjalan sendiri, dan mesin laundry menyala setelah bayar QRIS.',
      batas:
        'Pesan WhatsApp hanya dikirim kepada pelanggan yang setuju menerimanya. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk salon, bengkel, laundry, dan kos',
        deskripsi:
          'Untuk salon, bengkel, laundry, dan kos. Booking dan pengingat lewat bot, tagihan kos berjalan sendiri, dan mesin laundry menyala dengan QRIS.',
      },
    },
  ],
  [
    'teknologi/B/klinik',
    {
      pembeli:
        'Untuk klinik pratama, gigi, dan kecantikan, praktik mandiri, apotek, dan laboratorium.',
      situasi:
        'Telepon janji temu menumpuk, data pasien diketik berulang, dan pasien lupa kontrol. Pasien membuat janji lewat bot, datanya tidak diketik ulang di setiap meja, dan pengingat kontrol dikirim kepada pasien yang setuju.',
      batas:
        'Data pasien dijaga sebagai data pribadi yang sensitif, sesuai UU PDP, dan pesan hanya dikirim kepada pasien yang setuju menerimanya. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk klinik dan apotek',
        deskripsi:
          'Untuk klinik, praktik mandiri, dan apotek. Janji temu lewat bot, data pasien tidak diketik ulang, dan pengingat kontrol bagi pasien yang setuju.',
      },
    },
  ],
  [
    'teknologi/B/pendidikan',
    {
      pembeli:
        'Untuk sekolah swasta, yayasan, pesantren, bimbel dan kursus, serta pengajar mandiri.',
      situasi:
        'SPP menunggak, pendaftaran masih kertas, dan pendapatan hanya dari kelas tatap muka. Tagihan SPP terkirim ke orang tua, pendaftaran berjalan online, dan kelas berlangganan dibuka di samping kelas tatap muka.',
      batas:
        'Data siswa dan orang tua dijaga sesuai UU PDP; sambungan ke sistem pemerintah hanya lewat jalur resmi. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk sekolah, bimbel, dan kursus',
        deskripsi:
          'Untuk sekolah swasta, pesantren, dan bimbel. Tagihan SPP terkirim sendiri, pendaftaran berjalan online, dan kelas berlangganan dibuka.',
      },
    },
  ],
  [
    'teknologi/B/properti',
    {
      pembeli:
        'Untuk agen dan developer properti, dealer dan showroom kendaraan, serta broker.',
      situasi:
        'Prospek tercecer, pengajuan leasing tidak terpantau, dan pelanggan lama tak pernah dihubungi lagi. Pertanyaan calon pembeli dijawab seketika, tahap prospek terlihat, dan pelanggan lama menerima pengingat.',
      batas:
        'Persetujuan KPR dan leasing tetap di tangan bank dan perusahaan pembiayaan berizin. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk agen properti dan dealer',
        deskripsi:
          'Untuk agen properti, developer, dan dealer kendaraan. Calon pembeli dijawab seketika, prospek terpantau, dan pelanggan lama diingatkan.',
      },
    },
  ],
  [
    'teknologi/B/keuangan',
    {
      pembeli:
        'Untuk koperasi dan BMT, pemberi pembiayaan, agen asuransi, pemilik konter dan agen, dan fintech kecil.',
      situasi:
        'Angsuran dikejar manual dan berkas menumpuk. Angsuran dan iuran ditagih serta dicocokkan otomatis, dan berkas pemohon diverifikasi dengan setiap keputusan tercatat.',
      batas:
        'Keputusan pembiayaan tetap di tangan pemberi pembiayaan berizin, dan asuransi dijual agen berlisensi. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk koperasi, BMT, dan agen',
        deskripsi:
          'Untuk koperasi, BMT, pemberi pembiayaan, dan konter. Angsuran ditagih dan dicocokkan otomatis, dan berkas pemohon diverifikasi tercatat.',
      },
    },
  ],
  [
    'teknologi/B/konstruksi',
    {
      pembeli:
        'Untuk kontraktor utama, subkontraktor, developer perumahan, dan penyedia barang untuk pemerintah.',
      situasi:
        'Tender terlewat, dokumen tidak siap, laporan lapangan lewat chat, dan termin lambat cair. Paket baru dipantau setiap hari, laporan lapangan terkirim walau tanpa sinyal, dan berkas termin terkumpul dari laporannya.',
      batas:
        'Data tender diambil dari situs pengadaan publik; kami membantu menyiapkan, bukan mengatur hasil. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      jembatan: [
        {
          offer: 'ADM-03',
          kalimat:
            'Dokumen kualifikasi tender juga bisa disiapkan unit Konstruksi, dari data perusahaan yang sama.',
        },
      ],
      metadata: {
        judul: 'Bot dan workflow untuk kontraktor dan penyedia',
        deskripsi:
          'Untuk kontraktor dan penyedia barang. Paket tender dipantau setiap hari, laporan lapangan terkirim tanpa sinyal, dan berkas termin terkumpul.',
      },
    },
  ],
  [
    'teknologi/B/travel',
    {
      pembeli:
        'Untuk biro perjalanan, pemilik villa dan hostel, penyelenggara event, dan pengelola desa wisata.',
      situasi:
        'Booking bentrok, DP dikejar manual, dan tiket event dijual manual. Ketersediaan kamar sinkron di semua kanal, tamu membayar DP dan check-in mandiri, dan tiket event dijual online dengan QR.',
      batas:
        'Sinkron kamar berjalan lewat sambungan resmi setiap platform, dan produk agen mengikuti kontrak dengan supplier. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk villa, biro perjalanan, dan event',
        deskripsi:
          'Untuk villa, hostel, biro perjalanan, dan penyelenggara event. Kamar tidak dobel pesan, DP dan check-in mandiri, dan tiket event dengan QR.',
      },
    },
  ],
  [
    'teknologi/B/media',
    {
      pembeli:
        'Untuk streamer, kreator, pengelola komunitas, podcaster, dan media lokal.',
      situasi:
        'Audiens Anda besar tetapi pendapatan tipis, dan konten serta komunitas dikelola manual. Komunitas disambut dan ditagih otomatis, produk digital dan membership dijual berulang, dan jadwal konten terkoordinasi.',
      batas:
        'Kami membangun kanalnya; pendapatan tetap ditentukan audiens Anda. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk kreator dan komunitas',
        deskripsi:
          'Untuk streamer, kreator, dan pengelola komunitas. Komunitas dikelola bot, produk digital dan membership dijual berulang, dan konten terjadwal.',
      },
    },
  ],
  [
    'teknologi/B/logistik',
    {
      pembeli:
        'Untuk ekspedisi lokal, pemilik armada, pengelola gudang, dan agen.',
      situasi:
        'Pelanggan bertanya paketnya di mana, rute boros, dan klaim kerusakan tanpa bukti. Pelanggan diberi kabar di setiap tahap, rute disusun lebih efisien, dan serah terima tercatat dengan foto serta tanda tangan.',
      batas:
        'Pesan WhatsApp hanya dikirim kepada pelanggan yang setuju menerimanya. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk ekspedisi dan armada',
        deskripsi:
          'Untuk ekspedisi lokal dan pemilik armada. Pelanggan dikabari di setiap tahap, rute lebih efisien, dan serah terima tercatat sebagai bukti.',
      },
    },
  ],
  [
    'teknologi/B/manufaktur-ringan',
    {
      pembeli:
        'Untuk home industry, pabrik kecil, petani, peternak dan pembudidaya, serta kelompok tani.',
      situasi:
        'Biaya pokok tidak diketahui, mesin berhenti mendadak, dan hasil tani lewat banyak perantara. Panen dan biaya tercatat lewat WhatsApp, biaya pokok tiap batch terkontrol, dan hasil tani dijual langsung ke pembeli.',
      batas:
        'Harga jual hasil tani tetap Anda dan pembeli yang menentukan. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk UMKM produksi dan kelompok tani',
        deskripsi:
          'Untuk home industry, pabrik kecil, dan kelompok tani. Panen dan biaya tercatat, biaya pokok terkontrol, dan hasil tani dijual langsung.',
      },
    },
  ],
  [
    'teknologi/B/instansi',
    {
      pembeli:
        'Untuk pemerintah desa dan kelurahan, dinas, yayasan dan lembaga sosial, serta rumah ibadah.',
      situasi:
        'Warga harus datang untuk urusan sederhana, surat menumpuk, dan laporan wajib disusun manual. Syarat layanan dijawab kapan pun, surat diurus online, dan disposisi bergerak dengan jejak yang jelas.',
      batas:
        'Sambungan ke sistem pemerintah hanya lewat kerja sama atau jalur resmi instansinya, dan data warga dijaga sesuai UU PDP. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk desa, kelurahan, dan dinas',
        deskripsi:
          'Untuk pemerintah desa, kelurahan, dinas, dan yayasan. Layanan dijawab kapan pun, surat diurus online, dan disposisi berjejak.',
      },
    },
  ],
  [
    'teknologi/B/jasa-profesional',
    {
      pembeli:
        'Untuk konsultan, agensi, kantor akuntan, notaris dan hukum, arsitek, dan perusahaan jasa B2B.',
      situasi:
        'Prospek tidak ditindaklanjuti, laporan klien disusun manual, dan tenggat klien terlewat. Prospek disaring dan dijadwalkan bot, laporan bulanan terbit sendiri, dan tenggat klien diingatkan.',
      batas:
        'Pesan WhatsApp hanya dikirim kepada pelanggan yang setuju menerimanya. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk konsultan dan agensi',
        deskripsi:
          'Untuk konsultan, agensi, kantor akuntan, dan hukum. Prospek disaring bot, laporan klien terbit sendiri, dan tenggat diingatkan.',
      },
    },
  ],
  [
    'teknologi/B/kebugaran',
    {
      pembeli:
        'Untuk pengelola lapangan futsal dan badminton, gym dan studio, penyelenggara liga, komunitas olahraga, pelatih, serta pengelola kolam renang dan wahana.',
      situasi:
        'Jadwal lapangan bentrok, iuran anggota menunggak, dan lampu serta loker harus dijaga orang. Lapangan dipesan dengan DP, iuran diingatkan, dan lampu menyala setelah pembayaran.',
      batas:
        'Pesan WhatsApp hanya dikirim kepada pelanggan yang setuju menerimanya. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk lapangan, gym, dan kolam renang',
        deskripsi:
          'Untuk pengelola lapangan, gym, studio, dan wahana. Lapangan dipesan dengan DP, iuran diingatkan, dan lampu menyala setelah bayar.',
      },
    },
  ],
  [
    'teknologi/B/lintas-sektor',
    {
      pembeli:
        'Untuk pemilik usaha, manajer operasional, admin dan keuangan, tim penjualan, dan pemasaran.',
      situasi:
        'Pekerjaan berulang menyita waktu tim Anda, dan pendapatan bergantung pada satu sumber. Laporan, persetujuan, dan rekonsiliasi berjalan sendiri, dan peluang model bisnis baru dipetakan dengan perhitungan terbuka.',
      batas:
        'Model bisnis baru dipilih dari aset dan pelanggan yang Anda punya; hasilnya tetap ditentukan pasar. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Bot dan workflow untuk usaha apa pun',
        deskripsi:
          'Untuk pemilik usaha, operasional, dan keuangan. Laporan, persetujuan, dan rekonsiliasi berjalan sendiri, dan model bisnis baru dipetakan.',
      },
    },
  ],
  // V3 wave W5, Peekabo Sisi A (docs/V3-SERAH-W5.md). Copy from the
  // chapter, Peta pembeli, and Peekabo aturan main; wilayah from the
  // Peekabo header and the Sisi A introduction.
  [
    'peekabo/A/agency-marketing',
    {
      pembeli:
        'Untuk UMKM, brand lokal, seller marketplace, usaha jasa, dan instansi.',
      situasi:
        'Produk Anda bagus, tetapi yang tahu baru itu-itu saja. Platform, sasaran, dan pesan dipilih sebelum uang iklan keluar, lalu akun, peluncuran, dan kreator dijalankan untuk menjangkau orang baru.',
      batas:
        'Kami tidak menjanjikan jangkauan atau penjualan. Target, lingkup, dan laporan disepakati tertulis sebelum kerja dimulai, dan iklan mengikuti aturan setiap platform.',
      jembatan: [
        {
          offer: 'FNB-01',
          kalimat:
            'Untuk kafe yang belum buka, unit Konstruksi menyiapkan tempatnya sebelum kampanye pembukaan berjalan.',
        },
      ],
      metadata: {
        judul: 'Agency marketing di Subang, Purwakarta, dan Bandung',
        deskripsi:
          'Untuk UMKM, brand lokal, dan seller. Strategi ads sebelum uang iklan keluar, akun dikelola setiap minggu, dan peluncuran online serta lapangan.',
      },
    },
  ],
  [
    'peekabo/A/produksi-kreatif',
    {
      pembeli:
        'Untuk brand, UMKM, seller, usaha F&B, developer dan penginapan, kreator, dan agensi lain.',
      situasi:
        'Kontennya harus keluar setiap minggu, tetapi tidak ada yang membuatnya. Satu hari syuting dirancang untuk mengisi stok konten sebulan, dan kuota bulanan menjaga konten keluar tanpa negosiasi ulang per proyek.',
      batas:
        'Hak pakai setiap aset, jumlah revisi, dan ukuran per platform disepakati tertulis sebelum produksi. Isu yang dipakai dalam konten dipilih dari sudut yang aman bagi brand Anda.',
      metadata: {
        judul: 'Produksi foto, video, dan animasi untuk brand',
        deskripsi:
          'Untuk brand, UMKM, dan seller di Subang, Purwakarta, dan Bandung. Foto produk, film brand, animasi, dan satu hari syuting untuk stok konten.',
      },
    },
  ],
  [
    'peekabo/A/agency-solusi-kreatif',
    {
      pembeli:
        'Untuk pendiri, pemilik usaha, brand, dan agensi yang butuh arah sebelum produksi.',
      situasi:
        'Anda tidak tahu harus bilang apa supaya orang peduli. Isu, sudut cerita, dan pesan inti disepakati dalam workshop, lalu arah kreatifnya dijaga setiap bulan.',
      batas:
        'Konsep diserahkan sebagai arah tertulis yang siap diproduksi, dan produksinya dapat dipesan terpisah. Kami tidak menjanjikan seberapa jauh konten menyebar.',
      metadata: {
        judul: 'Workshop konsep, pesan, dan arah kreatif brand',
        deskripsi:
          'Untuk pendiri, pemilik usaha, dan brand. Isu, sudut cerita, dan pesan inti disepakati dalam workshop sebelum produksi, lalu arah kreatif dijaga.',
      },
    },
  ],
  [
    'peekabo/A/live-commerce-untuk-brand',
    {
      slug: 'live-commerce',
      pembeli: 'Untuk seller dan brand di TikTok Shop, Shopee, dan Tokopedia.',
      situasi:
        'Anda tidak punya host dan tidak sanggup siaran setiap hari. Live dicoba per jam dengan host dan operator kami, lalu dapat naik menjadi siaran rutin dengan jadwal tetap dan laporan bulanan.',
      batas:
        'Siaran dan promo mengikuti aturan setiap platform yang berlaku saat dijalankan. Kami tidak menjanjikan angka penjualan; pada bagi hasil, porsinya disepakati tertulis sebelum siaran pertama.',
      jembatan: [
        {
          offer: 'STD-09',
          kalimat:
            'Ruangan Anda juga bisa diubah menjadi studio oleh unit Konstruksi, lalu siarannya kami jalankan.',
        },
      ],
      metadata: {
        judul: 'Live commerce dengan host dan operator',
        deskripsi:
          'Untuk seller dan brand di TikTok Shop, Shopee, dan Tokopedia. Coba live per jam dengan host dan operator, lalu siaran rutin dengan jadwal tetap.',
      },
    },
  ],
  [
    'peekabo/A/experiential',
    {
      slug: 'event',
      pembeli: 'Untuk brand lokal, merchant, sponsor, dan instansi.',
      situasi:
        'Anda ingin warga datang, mencoba, lalu bercerita. Produk dicoba di tempat orang sudah berkumpul, dibawa ke banyak titik, atau menjadi tujuan event hunting kota.',
      batas:
        'Izin keramaian, izin lokasi, dan keselamatan peserta dipenuhi sebelum acara, dan lomba berbasis kemampuan dibedakan dari undian. Data peserta tidak dibagikan ke sponsor tanpa persetujuan peserta.',
      jembatan: [
        {
          offer: 'TRV-05',
          kalimat:
            'Tiket dan check-in peserta juga bisa berjalan lewat QR yang dipasang unit Teknologi.',
        },
      ],
      metadata: {
        judul: 'Event dan aktivasi brand di Subang, Purwakarta, Bandung',
        deskripsi:
          'Untuk brand lokal, merchant, dan sponsor. Booth dan sampling di lokasi mitra, roadshow keliling, temu pelanggan, dan event hunting kota.',
      },
    },
  ],
  [
    'peekabo/A/talenta',
    {
      pembeli:
        'Untuk brand dan usaha yang butuh wajah, suara, dan tangan untuk membawakan produknya.',
      situasi:
        'Anda butuh orang yang terlatih membawakan produk Anda. Promotor dan host dilatih membawakan produk Anda, dan kreator yang kami kelola membangun cerita brand secara konsisten.',
      batas:
        'Bentuk hubungan kerja setiap talenta dan sales disepakati tertulis sebelum mulai. Konten kreator mengikuti aturan iklan setiap platform, dan kami tidak menjanjikan jumlah penonton.',
      metadata: {
        judul: 'Promotor, host, dan kreator untuk brand',
        deskripsi:
          'Untuk brand dan usaha di Subang, Purwakarta, dan Bandung. Promotor dan host terlatih, kreator yang dikelola, dan video ulasan dibayar per video.',
      },
    },
  ],
  [
    'peekabo/A/outsourcing-penjualan',
    {
      pembeli:
        'Untuk seller, usaha jasa, brand, dan distributor yang punya leads tetapi kekurangan tangan penjual.',
      situasi:
        'Leads masuk, tetapi tidak ada yang menindaklanjuti sampai jadi. Chat calon pembeli dijawab dan ditutup menjadi pesanan, dan tim sales lapangan mendatangi calon pembeli dengan target harian.',
      batas:
        'Bentuk hubungan kerja sales disepakati tertulis sebelum mulai. Target dan laporan juga disepakati tertulis; angka penjualan tidak dijanjikan.',
      jembatan: [
        {
          offer: 'RIT-02',
          kalimat:
            'Di luar jam kerja, bot dari unit Teknologi bisa menjawab chat lebih dulu, lalu admin kami menutup penjualannya.',
        },
      ],
      metadata: {
        judul: 'Admin chat dan tim sales untuk usaha Anda',
        deskripsi:
          'Untuk seller dan usaha jasa yang punya leads. Chat calon pembeli dijawab sampai menjadi pesanan, dan tim sales lapangan bekerja dengan target harian.',
      },
    },
  ],
  [
    'peekabo/A/ekosistem-marketplace',
    {
      pembeli:
        'Untuk seller, brand, dan vendor yang ingin produknya dijual banyak orang.',
      situasi:
        'Anda ingin produk dijualkan banyak orang, tetapi tidak tahu cara mengelola afiliasinya. Harga jual dan komisi afiliasi dihitung ulang setiap biaya platform berubah, dan produk masuk etalase komunitas seller.',
      batas:
        'Jaringan kami dibayar dari penjualan, tanpa biaya masuk, tanpa bonus rekrutmen, dan tanpa janji penghasilan. Bila Anda memakai SaaS atau vendor yang kami rujuk, mitra itu membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Afiliasi dan jaringan komisi untuk seller',
        deskripsi:
          'Untuk seller, brand, dan vendor. Harga dan komisi afiliasi dihitung ulang setiap biaya platform berubah, dan produk masuk etalase komunitas.',
      },
    },
  ],
  // V3 wave W6, Teknologi Sisi A (docs/V3-SERAH-W6.md). Copy from the
  // chapter, Peta pembeli, and Teknologi aturan main; wilayah is not
  // stated, because the Teknologi region is still undecided.
  [
    'teknologi/A/individu',
    {
      pembeli:
        'Untuk pembelajar, hobbyist, pencari kerja, profesional dan kreator, developer, serta mahasiswa.',
      situasi:
        'Anda punya selera atau rasa ingin tahu yang spesifik dan ingin membuatnya berjalan. Ide Anda dipetakan dalam satu jam, lalu bot, dasbor, atau portofolionya dapat dibangun.',
      batas:
        'Bot pemantau hanya mengambil data publik atau API resmi yang mengizinkannya. Kode sumber, data, dan dokumentasi diserahkan kepada Anda, sehingga Anda tidak terkunci pada kami.',
      metadata: {
        judul: 'Bot, dasbor, dan proyek teknis untuk individu',
        deskripsi:
          'Untuk pembelajar, hobbyist, profesional, dan mahasiswa. Ide dipetakan dalam satu jam, lalu bot, dasbor, atau portofolio dibangun.',
      },
    },
  ],
  [
    'teknologi/A/freelancer',
    {
      pembeli: 'Untuk freelancer, agensi kecil, serta studio web dan desain.',
      situasi:
        'Proyeknya besar, tangan Anda kurang, dan Anda tidak mau menolak klien. Biaya dan jadwal penawaran dihitung lebih dulu, proyeknya kami kerjakan atas nama Anda, lalu dijaga setelah serah terima.',
      batas:
        'Lingkup tertulis sebelum kerja dimulai; temuan di luar lingkup dicatat, tidak dikerjakan tanpa kesepakatan baru. Kode sumber, data, dan dokumentasi diserahkan kepada Anda, sehingga Anda tidak terkunci pada kami.',
      metadata: {
        judul: 'Subkontrak teknis untuk freelancer dan agensi kecil',
        deskripsi:
          'Untuk freelancer dan agensi kecil. Biaya dan jadwal penawaran dihitung, proyek dikerjakan di belakang layar, lalu dijaga setelah serah terima.',
      },
    },
  ],
  [
    'teknologi/A/software-house',
    {
      pembeli: 'Untuk software house, perusahaan IT, dan tim produk.',
      situasi:
        'Tenggat Anda ketat dan spesialis sulit dicari. Proyek bermasalah dinilai jujur lebih dulu, lalu spesialis bekerja mengikuti ritme Anda atau menambah kapasitas saat puncak.',
      batas:
        'Lingkup tertulis sebelum kerja dimulai; temuan di luar lingkup dicatat, tidak dikerjakan tanpa kesepakatan baru. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'Spesialis teknis untuk software house dan perusahaan IT',
        deskripsi:
          'Untuk software house dan tim produk. Audit kode dan pengambilalihan proyek, tim khusus mengikuti ritme Anda, dan kapasitas tambahan saat puncak.',
      },
    },
  ],
  [
    'teknologi/A/startup',
    {
      pembeli:
        'Untuk founder, startup SaaS, startup B2B, serta startup fintech dan marketplace.',
      situasi:
        'Anda harus rilis cepat dengan uang dan orang yang terbatas. Minat diukur sebelum kode ditulis, MVP dibangun dengan biaya dan tenggat terkunci, dan keputusan teknologi diarahkan tanpa CTO tetap.',
      batas:
        'Lingkup, biaya, dan tenggat MVP dikunci tertulis sebelum kerja dimulai, dan kode sumber serta akses server diserahkan kepada Anda. Bila Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang Anda bayar kepada kami.',
      metadata: {
        judul: 'MVP, CTO paruh waktu, dan uji minat untuk startup',
        deskripsi:
          'Untuk founder dan startup SaaS. Minat diukur sebelum kode ditulis, MVP dengan biaya dan tenggat terkunci, dan CTO paruh waktu.',
      },
    },
  ],
  [
    'teknologi/A/tim-it-internal-perusahaan',
    {
      slug: 'tim-it',
      pembeli:
        'Untuk tim IT, tim data, serta tim keuangan dan IT di perusahaan.',
      situasi:
        'Pekerjaan operasional menumpuk dan sistem lama tidak ada yang berani menyentuh. Sistem lama dipetakan dan ditulis lebih dulu, lalu laporan rutin terbit sendiri dan aplikasi diperbarui bertahap.',
      batas:
        'Data perusahaan dijaga sesuai UU PDP, dan akses kami dibatasi pada sistem yang disepakati tertulis. Modernisasi berjalan bertahap tanpa menghentikan operasional, dan dokumentasinya diserahkan kepada tim Anda.',
      metadata: {
        judul: 'Dokumentasi, migrasi, dan otomasi untuk tim IT',
        deskripsi:
          'Untuk tim IT dan tim data di perusahaan. Sistem lama dipetakan dan ditulis, laporan rutin terbit sendiri, dan aplikasi lama diperbarui bertahap.',
      },
    },
  ],
  [
    'teknologi/A/lapisan-data',
    {
      pembeli: 'Untuk tim produk, tim data, tim IT, dan startup.',
      situasi:
        'Data Anda lambat, terlambat, atau tidak terhubung satu sama lain. Query dan indeks dirapikan, peristiwa penting sampai seketika, dan data dari banyak sumber menyatu setiap malam.',
      batas:
        'Data pribadi di basis data Anda dijaga sesuai UU PDP. Lingkup tertulis sebelum kerja dimulai; temuan di luar lingkup dicatat, tidak dikerjakan tanpa kesepakatan baru.',
      metadata: {
        judul: 'Optimasi SQL, data realtime, dan graf',
        deskripsi:
          'Untuk tim produk, data, dan IT. Query dan indeks dirapikan, peristiwa penting sampai seketika, dan data dari banyak sumber menyatu.',
      },
    },
  ],
])
