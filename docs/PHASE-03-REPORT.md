# Laporan implementasi Phase 03

Tanggal pengukuran terakhir: **15 Oktober 2026**

Branch tinjauan: `codex/f2-02-unit-side-model`

PR tinjauan: **#18**

Dokumen ini mencatat proses F3-01 sampai F3-12, apa yang ditambahkan, dan apa
yang sengaja ditahan. Ia tidak menggantikan `PROGRES-ARTHUR.md`; papan status
itu tetap sumber status per paket.

## 1. Cara kerja yang dipakai

1. Membaca `KONTEKS-TIM.md`, `PROGRES-ARTHUR.md`, sumber konteks di
   `FULL KONTEKS/`, serta empat berkas cadangan pemilik.
2. Menurunkan tiap halaman dari urutan pembaca: situasi → unit → sisi → bab →
   offer → langkah pertama. Daftar layanan tidak dijadikan titik masuk.
3. Memisahkan jalur Sanity publik dan pratinjau. Jalur publik selalu memakai
   perspektif `published` dan gerbang `statusTinjauan == "disetujui"`; jalur
   pratinjau memakai perspektif draft terautentikasi tanpa melemahkan query
   publik.
4. Memproyeksikan allowlist medan pembaca. `jejakSumber`, `ditulisOleh`,
   `tanggalDisetujui`, status editorial, dan medan Internal Studio tidak ikut
   ke komponen halaman.
5. Memvalidasi hasil query pada batas aplikasi dengan Zod dan penjaga
   placeholder. Dokumen tidak lengkap ditahan seluruhnya, bukan dirender
   sebagian sebagai fakta Arthur.
6. Menjaga fungsi dasar tanpa JavaScript: tautan tetap tautan, tabel tetap
   semantik, dan gerak hanya lapisan tambahan. Reduced motion selalu mendapat
   keadaan akhir yang dapat dibaca.
7. Memeriksa copy terhadap aturan sumber: tidak menambah harga, statistik,
   testimoni, alamat, hasil, atau janji yang tidak didukung.
8. Menjalankan typegen, format, lint/typecheck, uji unit, build produksi, dan
   tinjauan visual. Playwright tidak dijalankan karena pemilik melarang seluruh
   e2e lokal maupun GitHub Actions sampai diminta kembali.

## 2. Hasil per paket

| Paket | Hasil di branch                                                                                                                              |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| F3-01 | Beranda payung dengan tiga pintu unit, pilihan situasi, rangkaian, cara kerja, dan langkah pertama.                                          |
| F3-02 | Template unit yang dimulai dari masalah pembeli, dua sisi, cara kerja, jembatan bersyarat, dan CTA.                                          |
| F3-03 | Template sisi dengan urutan pembelian, tabel bab semantik, pertukaran sisi, dan keadaan kosong yang jujur.                                   |
| F3-04 | Template bab dengan 3–7 kartu offer, batas, penyaring pasar Konstruksi, jembatan, dan ajakan.                                                |
| F3-05 | Template offer delapan blok, langkah, serahan, batas, langkah pertama, jembatan, dan lembar cetak.                                           |
| F3-06 | Halaman Jaringan dengan tiga jalur, alur uang empat langkah, asal komisi, larangan, syarat, dan gerbang pendaftaran.                         |
| F3-07 | Halaman satu klien–tiga unit dengan tepat tiga langkah dan validasi relasi offer lengkap.                                                    |
| F3-08 | Halaman Cara kami bekerja dari singleton Sanity, termasuk janji, hak milik, pengungkapan komisi, batas, wilayah, dan format kerja.           |
| F3-09 | Halaman Tentang dan kontak, wilayah layanan, pernyataan pemilik bersyarat, ledger kontak, dan status K5.                                     |
| F3-10 | Halaman tetap `/id/kebijakan`, jalur draft Presentation, keadaan kosong tanpa contoh hukum, dan gerbang legal `noindex`.                     |
| F3-11 | Penjaga render untuk seluruh model Phase 03, termasuk Portable Text halaman tetap dan singleton Cara kerja.                                  |
| F3-12 | Definisi route dan validasi data sudah siap; pelaksanaan Playwright rute bab/offer dan matriks ponsel ditahan oleh F2-09 serta larangan e2e. |

## 3. Fitur dan informasi yang ditambahkan

- Hierarki publik Arthur: unit, sisi, bab, dan offer dengan alamat kanonis
  berbahasa Indonesia.
- Halaman tetap untuk beranda, satu klien–tiga unit, cara kerja, tentang dan
  kontak, serta kebijakan.
- Draft preview Sanity yang terpisah dari konten publik untuk seluruh permukaan
  editorial Phase 03.
- Presentation Studio untuk rute unit, sisi, bab, offer, rangkaian, kontak,
  cara kerja, halaman umum, dan kebijakan.
- Pemetaan tautan dokumen `page` yang benar ke `/halaman/<slug>`, dengan
  `/kebijakan` sebagai rute tetap khusus. Bentuk lama `/<slug>` tidak lagi
  diarahkan ke unit dinamis secara keliru.
- Metadata tanpa Stega. Fetch metadata memakai perspektif yang sama dengan
  halaman, tetapi selalu mematikan Stega agar karakter sumber tidak masuk ke
  title, description, canonical, Open Graph, atau Twitter card.
- Sitemap dan keluaran mesin hanya menerima halaman tetap yang disetujui dan
  boleh diindeks. Halaman kebijakan tetap dikeluarkan selama tinjauan hukum.
- Penjaga Zod dan placeholder untuk `siteSettings`, unit, sisi, bab, offer,
  sequence, `howWeWork`, kontak, dan `page` beserta Portable Text-nya.
- Copy antarmuka Indonesia dan Inggris untuk status halaman kebijakan. Bahasa
  Inggris tetap hanya untuk pratinjau; kebijakan publik locale tetap mengikuti
  keputusan K2 yang mengarahkan pembaca ke Indonesia.
- Tautan Kebijakan di footer sehingga status dokumennya dapat dicapai tanpa
  mengiklankannya ke mesin pencari.

## 4. Fitur dan informasi yang dicabut atau ditahan sementara

| Item                                       | Keadaan sementara                                                              | Syarat untuk mengaktifkan kembali                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Karya pilihan dan jurnal contoh di beranda | Tidak lagi dipromosikan sebagai isi Arthur.                                    | Karya/isi nyata telah disetujui dan diterbitkan.                                               |
| Offer pada unit, sisi, dan bab             | Blok hanya muncul bila relasi dan jumlah kontennya lengkap.                    | Dokumen bab dan 3–7 offer per bab tersedia serta disetujui.                                    |
| Contoh rangkaian tiga unit                 | Tidak ada rangkaian karangan; rute menahan diri saat Sanity kosong.            | Sequence dan seluruh relasi unit/offer disetujui.                                              |
| Email `kontak@arth.invalid`                | Teks dummy ber-NOTE, tanpa `mailto:` atau tombol salin.                        | K5 menetapkan kanal nyata dan pemilik mengganti data.                                          |
| Alamat contoh                              | Teks dummy ber-NOTE, tidak disebut kantor atau lokasi kunjungan.               | Pemilik memasukkan alamat/fakta lokasi yang benar.                                             |
| WhatsApp, waktu balas, dan akun resmi      | Tidak ditampilkan sebagai kanal aktif.                                         | K5 dan data nyata tersedia.                                                                    |
| Formulir kontak                            | Tidak dibuat.                                                                  | K5 selesai dan tinjauan keamanan F5-06 lulus.                                                  |
| Pendaftaran jaringan                       | Tombol ditahan.                                                                | Kartu komisi pertama menjelaskan sumber, pemicu, jumlah, dan waktu pembayaran.                 |
| Isi hukum contoh                           | Tidak dibuat. `/kebijakan` menunjukkan status peninjauan ketika Sanity kosong. | Draf bersumber ditulis dengan izin khusus, ditinjau ahli hukum, lalu gerbang dilepas terpisah. |
| Indexing halaman kebijakan                 | Selalu `noindex`, walau dokumen CMS kelak disetujui secara editorial.          | Tinjauan hukum selesai dan pemilik menyetujui pelepasan gerbang.                               |
| Pilihan bahasa Inggris di publik           | Tidak dipromosikan; `/en` mengikuti keputusan K2 menuju `/id`.                 | Terjemahan disetujui untuk diterbitkan.                                                        |
| E2E dan matriks ponsel otomatis            | Tidak dijalankan atau dipicu.                                                  | Pemilik secara eksplisit mengizinkan e2e dan fixture F2-09 tersedia di dataset `ci`.           |

## 5. Keadaan Sanity yang diukur

- Production memuat draft awal yang telah diizinkan: satu `siteSettings`, tiga
  unit, enam sisi, dan satu `howWeWork`; semuanya tetap draft.
- Query published untuk isi awal tetap menghasilkan nol dokumen, jadi tidak
  ada publish terselubung.
- Pada 15 Oktober 2026, tipe `page` berjumlah nol pada perspektif published
  maupun drafts. Karena itu `/kebijakan` menampilkan keadaan peninjauan yang
  aman, bukan teks kebijakan buatan.
- Tidak ada penulisan, patch, publish, perubahan CORS, atau perubahan setelan
  Sanity dalam penyelesaian F3-10/F3-11 ini.

## 6. Verifikasi dan batas bukti

Yang dibuktikan secara lokal:

- Bun tepat `1.3.5`.
- TypeGen menghasilkan 30 query dan 40 tipe skema.
- Uji terarah F3-10/F3-11 lulus 98/98.
- TypeScript strict lulus.
- `bun run check` lulus penuh: 660 uji, 2.393 assertion, dan 0 gagal; lint,
  format, TypeScript strict, plugin lint, aset, serta penjaga copy publik ikut
  lulus.
- Build produksi selesai dan menghasilkan 103/103 halaman, termasuk
  `/id/kebijakan`.
- Pemeriksaan HTTP membuktikan `/id/kebijakan` merespons 200 dan alias lama
  `/id/halaman/kebijakan` merespons 308 ke rute kanonis.
- Tinjauan visual desktop dan viewport ponsel 390 × 844 menunjukkan hierarki,
  status legal, keadaan kosong, dan layout kebijakan tetap terbaca tanpa
  overflow yang terlihat.
- React Doctor memberi skor 84/100 tanpa regresi baru; tiga peringatan yang
  tersisa berasal dari kompleksitas dua halaman dinamis lama dan await dalam
  skrip pemeriksaan copy yang sudah ada sebelum paket ini.

Yang **tidak** diklaim:

- Tidak ada klaim bahwa rute bab/offer telah diuji end-to-end terhadap fixture
  Sanity, karena F2-09 masih menunggu dataset `ci`.
- Tidak ada klaim bahwa policy telah lolos tinjauan hukum.
- Tidak ada klaim bahwa kanal kontak dummy dapat menerima pesan.
- Tidak ada klaim bahwa bahasa Inggris siap diterbitkan.
- Tidak ada klaim bahwa GitHub Actions berjalan; commit branch memakai
  `[skip ci]` untuk mematuhi instruksi pemilik.

## 7. Gerbang sesudah tinjauan pemilik

1. Pemilik meninjau tampilan branch/Preview PR #18.
2. Pemilik menyediakan dataset `ci` sebelum F2-09 dan F3-12 runtime.
3. Izin e2e harus diberikan kembali secara eksplisit sebelum Playwright lokal
   atau GitHub Actions dijalankan.
4. Setiap tulisan baru ke Sanity tetap membutuhkan `ok tulis` yang menyebut
   lingkupnya. Izin lama tidak diperluas ke halaman kebijakan, bab, atau offer.
5. K5 tetap diperlukan untuk kanal kontak nyata; K9 tetap diperlukan sebelum
   noindex situs umum dilepas. Gerbang legal kebijakan berdiri terpisah dari
   kedua keputusan itu.
