# Serah halaman: Pesan dan bayar dari meja

Halaman pekerjaan di Kuliner dan F&B, Teknologi, untuk yang ingin hasil siap
pakai · 15 Oktober 2026 · Status: disetujui pemilik, 15 Oktober 2026 (versi dua paket) · Placeholder:
tidak ada

Pekerjaan kedua dari lima yang tayang di [halaman Kuliner](./R1-SERAH-BAB-KULINER.md).
Versi ini menggantikan versi langkah kerja sebelumnya. Arahan pemilik 15
Oktober 2026: halaman menawarkan Paket Starter dan Paket Integrator sesuai
keadaan klien, menonjolkan cara dibayar yang fleksibel, dan konsultasi yang
tidak menambah fitur tanpa alasan (glosarium bagian 10). Belum ada yang ditulis
ke Sanity.

## 1. Halaman seperti yang dibaca pembeli

**Teknologi · Kuliner dan F&B · Alur kerja yang berjalan tanpa dikejar**

### Pesan dan bayar dari meja

Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur.

#### Untuk siapa

Untuk pemilik kafe dan resto yang kasirnya kewalahan saat ramai.

#### Situasinya

Di jam ramai, tamu kafe Anda mengantre di kasir untuk memesan dan membayar. Kasir kewalahan.

#### Dua paket

**Paket Starter**
Menu pesan dari meja memakai layanan yang sudah jadi.

- Tamu memesan dan membayar dari meja.
- Pesanan masuk ke dapur dengan pembayaran sudah selesai.

**Paket Integrator**
Pesanan dari meja disambungkan ke catatan dan aturan kafe Anda.

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

Perangkat keras di kafe Anda, seperti tablet atau printer, tidak termasuk.

#### Bila pekerjaannya berlanjut

Untuk kafe yang belum buka, unit Konstruksi menyiapkan lokasi sewa sampai alur pelanggan dan dapurnya bekerja.

_(Blok ini baru tampil sesudah halaman kafe siap buka di Konstruksi terbit.)_

#### Langkah pertama

**[ Minta sesi diagnosis ]**

Di sesi itu kami melihat alur pesanan di kafe Anda hari ini dan menentukan paket yang cukup. Bila
belum waktunya, kami mengatakannya terus terang dan menyarankan persiapan satu
sampai tiga bulan. Biaya konsultasinya bersifat pilihan.

_(Sampai kanal kontak ditetapkan, tombol membuka halaman kontak.)_

### Di mesin pencari

- Judul: Pesan dan bayar dari meja untuk kafe dan resto
- Deskripsi: Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur. Mulai dengan Paket Starter atau Integrator.
- Alamat: `/id/teknologi/siap-pakai/kuliner/pesan-dan-bayar-dari-meja`

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
- Halaman berikutnya: Layar pesanan di dapur.

## Lampiran internal: jejak sumber

Untuk memeriksa asal kalimat dan menulis ke Sanity. Tidak pernah dirender.

| Blok                        | Kode katalog | Sumber                                                                            |
| --------------------------- | ------------ | --------------------------------------------------------------------------------- |
| Judul, dampak, untuk siapa  | KUL-02       | Baris offer; bidang B8, B10, B2                                                   |
| Paket Starter               | KUL-02       | B10 Antarmuka Aplikasi; dampak dari Peta website, Dampak yang perlu diterjemahkan |
| Paket Integrator            | KUL-02       | B2 Integrasi Pembayaran; B8 Aturan Bisnis                                         |
| Batas                       | KUL-02       | Bidang tanpa B13 (perangkat keras)                                                |
| Bila pekerjaannya berlanjut | KUL-02       | FNB-01, Konstruksi Peta & aturan main; Contoh kalibrasi 3                         |
| Cara kami bekerja           | –            | Header Teknologi, Cara kami bekerja; Alur kerja langkah 2 sampai 4                |
| Langkah pertama             | –            | Teknologi Sisi B, Alur kerja langkah 2 dan 5                                      |

Medan Sanity (dokumen `offer`): `jenis` (“Alur kerja yang berjalan tanpa dikejar”), `urutan` 1,
`pintuMasuk` tidak, slug `pesan-dan-bayar-dari-meja`, `idKatalog` KUL-02. Paket
menunggu medan baru (bagian 4).
