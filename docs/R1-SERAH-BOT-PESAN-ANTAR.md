# Serah halaman: Bot pesan-antar WhatsApp

Halaman pekerjaan di Kuliner dan F&B, Teknologi, untuk yang ingin hasil siap
pakai · 15 Oktober 2026 · Status: disetujui pemilik, 15 Oktober 2026 (versi dua paket) · Placeholder:
tidak ada

Pekerjaan pertama dari lima yang tayang di [halaman Kuliner](./R1-SERAH-BAB-KULINER.md).
Versi ini menggantikan versi langkah kerja sebelumnya. Arahan pemilik 15
Oktober 2026: halaman menawarkan Paket Starter dan Paket Integrator sesuai
keadaan klien, menonjolkan cara dibayar yang fleksibel, dan konsultasi yang
tidak menambah fitur tanpa alasan (glosarium bagian 10). Belum ada yang ditulis
ke Sanity.

## 1. Halaman seperti yang dibaca pembeli

**Teknologi · Kuliner dan F&B · Bot yang bekerja sendiri**

### Bot pesan-antar WhatsApp

Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada admin yang berjaga.

#### Untuk siapa

Untuk pemilik warung dan kedai yang menerima pesanan lewat WhatsApp.

#### Situasinya

Pesanan warung Anda masuk lewat chat, bercampur dengan pesan lain. Saat tidak ada yang berjaga, pesanan menunggu sampai ada yang sempat membalas.

#### Dua paket

**Paket Starter**
Bot dipasang di nomor WhatsApp usaha Anda memakai layanan yang sudah jadi.

- Pesanan diterima dan dicatat kapan pun.
- Tagihan terkirim ke pelanggan untuk setiap pesanan.

**Paket Integrator**
Bot disambungkan ke pembayaran dan aturan usaha Anda.

- Uang yang masuk cocok dengan catatan pesanan.
- Harga dan promo berjalan menurut aturan Anda.

Di kedua paket, data pesanan tetap milik Anda, dan akses serta dokumentasinya
diserahkan kepada Anda.

#### Cara kami bekerja

Paket untuk usaha Anda ditentukan di sesi diagnosis, dari masalah yang Anda
ceritakan. Kami tidak membangun dari nol bila layanan yang sudah matang menyelesaikan masalahnya; kami menyarankannya lebih dulu, dan berkata jujur bila sesuatu belum perlu Anda beli.

Bayarannya bisa berupa biaya pembangunan atau kemitraan bagi hasil. Bila
layanan jadi Anda beli lewat kami, mitra membayar kami komisi di luar biaya
Anda, dan kami menyebutkannya sejak awal.

#### Batas dan syarat

Bot berjalan lewat kanal resmi WhatsApp usaha Anda, dan pesan hanya dikirim kepada pelanggan yang setuju menerimanya. Pengantaran tidak termasuk; kurirnya tetap dari usaha Anda.

#### Langkah pertama

**[ Minta sesi diagnosis ]**

Di sesi itu kami melihat cara pesanan masuk hari ini dan menentukan paket yang cukup. Bila
belum waktunya, kami mengatakannya terus terang dan menyarankan persiapan satu
sampai tiga bulan. Biaya konsultasinya bersifat pilihan.

_(Sampai kanal kontak ditetapkan, tombol membuka halaman kontak.)_

### Di mesin pencari

- Judul: Bot pesan-antar WhatsApp untuk warung dan kedai
- Deskripsi: Bot mencatat dan menagih setiap pesanan WhatsApp warung Anda. Mulai dengan Paket Starter atau Integrator lewat sesi diagnosis.
- Alamat: `/id/teknologi/siap-pakai/kuliner/bot-pesan-antar-whatsapp`

## 2. Keputusan yang saya ambil dari konteks

| Hal                         | Keputusan                                                                                                               | Dasar                                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Dua paket                   | Starter memakai layanan yang sudah jadi; Integrator merakit dan menyambungkan ke pembayaran, catatan, atau aturan usaha | Arahan pemilik 15 Okt 2026; Teknologi Sisi B, Alur kerja langkah 3 (layanan matang, rakit ringan)                   |
| Isi poin paket              | Dari kolom dampak dan bidang di balik pekerjaan ini, tanpa fitur tambahan                                               | Arahan pemilik: tidak menambah fitur tanpa alasan; Aturan isi 4                                                     |
| Bangun penuh                | Tidak ditawarkan di halaman ini                                                                                         | Langkah 3: bangun otonom penuh hanya untuk franchise, multi-cabang, dan perusahaan besar                            |
| Langkah teknis              | Tidak ditulis di halaman; dipakai untuk mengisi poin paket                                                              | Arahan pemilik: versi sebelumnya terasa seperti layanan berat                                                       |
| Cara dibayar                | Biaya pembangunan, kemitraan bagi hasil, atau komisi mitra yang diungkapkan                                             | Header Teknologi (siap tayang), Cara kami bekerja; Jalur komisi dua sisi; Aturan isi, kalimat wajib vendor dan SaaS |
| Kalimat jujur               | Dipakai apa adanya di blok Cara kami bekerja                                                                            | Header Teknologi (siap tayang); Pola pikir Arthur, Pintu masuk ringan                                               |
| Untuk siapa, situasi, batas | Sama dengan versi yang sudah disetujui                                                                                  | Versi sebelumnya                                                                                                    |

## 3. Hasil uji

**Gerbang isi: lolos.** Tidak ada angka hasil, harga, klien, testimoni,
wilayah, atau isi dummy. Kedua paket hanya berisi yang ada di baris katalog dan
bidangnya. Pengungkapan komisi dan satu batas ada.

**Gerbang gaya: lolos**, dicek dengan skrip. Kalimat jujur adalah teks siap
tayang dan bebas dari uji gaya. Poin paket paling panjang 9 kata.

## 4. Usulan di luar tugas

- Halaman Teknologi untuk hasil siap pakai menjelaskan dua paket ini sekali,
  supaya pembeli mengenalnya sebelum membuka pekerjaan mana pun.
- Skema dokumen `offer` belum punya medan paket. Usul untuk R2: medan `paket`
  berisi dua objek (nama, kalimat, poin), menggantikan `langkah` dan
  `serahan` di halaman Teknologi. Perubahan skema lewat PR biasa.
- Halaman berikutnya: Pesan dan bayar dari meja.

## Lampiran internal: jejak sumber

Untuk memeriksa asal kalimat dan menulis ke Sanity. Tidak pernah dirender.

| Blok                       | Kode katalog | Sumber                                                                                                                        |
| -------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Judul, dampak, untuk siapa | KUL-01       | Baris offer; bidang B5, B8, B2                                                                                                |
| Paket Starter              | KUL-01       | B5 Integrasi WhatsApp API; kolom dampak (diterima, dicatat, ditagih)                                                          |
| Paket Integrator           | KUL-01       | B2 Integrasi Pembayaran (“uang yang masuk selalu cocok dengan catatan”); B8 Aturan Bisnis (“harga bertingkat, komisi, promo”) |
| Batas                      | KUL-01       | Teknologi aturan 7; aturan main gabungan 6; bidang tanpa B3 (kurir)                                                           |
| Cara kami bekerja          | –            | Header Teknologi, Cara kami bekerja; Alur kerja langkah 2 sampai 4                                                            |
| Langkah pertama            | –            | Teknologi Sisi B, Alur kerja langkah 2 dan 5                                                                                  |

Medan Sanity (dokumen `offer`): `jenis` (“Bot yang bekerja sendiri”), `urutan` 0,
`pintuMasuk` ya, slug `bot-pesan-antar-whatsapp`, `idKatalog` KUL-01. Paket
menunggu medan baru (bagian 4).
