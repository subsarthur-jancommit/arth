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
])
