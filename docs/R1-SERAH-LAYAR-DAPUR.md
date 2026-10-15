# Serah halaman: Layar pesanan di dapur

Halaman pekerjaan di Kuliner dan F&B, Teknologi, untuk yang ingin hasil siap
pakai · 15 Oktober 2026 · Status: perlu Anda · Placeholder: tidak ada

Pekerjaan ketiga dari lima yang tayang di [halaman Kuliner](./R1-SERAH-BAB-KULINER.md),
ditulis dengan cara yang sama seperti
[Pesan dan bayar dari meja](./R1-SERAH-PESAN-BAYAR-MEJA.md). Belum ada yang
ditulis ke Sanity.

## 1. Halaman seperti yang dibaca pembeli

**Teknologi · Kuliner dan F&B · Angka yang memberi tahu lebih dulu**

### Layar pesanan di dapur

Setiap pesanan tampil di layar dapur saat itu juga, berikut urutan dan waktu
sajinya.

#### Untuk siapa

Untuk pemilik kafe dan resto yang dapurnya kewalahan saat ramai.

#### Situasinya

Di jam ramai, pesanan menumpuk dan dapur sulit tahu mana yang masuk lebih
dulu. Lama setiap pesanan menunggu tidak tercatat.

#### Yang kami kerjakan

1. Membedah alur pesanan dari kasir sampai dapur di sesi diagnosis.
2. Memakai layanan yang sudah matang lebih dulu, membangun hanya bila perlu.
3. Menuliskan lingkup dan harga sebelum kerja dimulai.
4. Menawarkan dua cara bayar: biaya pembangunan atau kemitraan bagi hasil.
5. Menampilkan setiap pesanan di layar dapur saat pesanan masuk.
6. Menyusun urutan pesanan menurut waktu masuk.
7. Mencatat waktu saji setiap pesanan.
8. Mendampingi sampai layar dipakai dapur Anda.

#### Yang Anda terima

- Layar dapur yang menampilkan pesanan saat itu juga.
- Urutan pesanan menurut waktu masuk.
- Catatan waktu saji setiap pesanan.
- Data pesanan yang tetap milik Anda.
- Akses dan dokumentasi yang diserahkan kepada Anda.

#### Batas dan syarat

Perangkat layar di dapur, seperti monitor atau tablet, tidak termasuk.

Bila Anda membeli aplikasi jadi lewat kami, mitra membayar kami komisi. Kami
menyebutkannya sejak awal, dan komisi itu dibayar mitra di luar biaya yang
Anda bayar kepada kami.

#### Langkah pertama

**[ Minta sesi diagnosis ]**

Di sesi itu kami melihat alur pesanan dari kasir ke dapur hari ini, sebelum
ada yang dibangun atau dibeli. Bila belum waktunya, kami mengatakannya terus
terang dan menyarankan persiapan satu sampai tiga bulan. Biaya konsultasinya
bersifat pilihan.

_(Sampai kanal kontak ditetapkan, tombol membuka halaman kontak. Halaman ini
tidak punya blok “Bila pekerjaannya berlanjut”; alasannya di bagian 2.)_

### Di mesin pencari

- Judul: Layar pesanan di dapur untuk kafe dan resto
- Deskripsi: Setiap pesanan tampil di layar dapur saat itu juga, berikut urutan
  dan waktu sajinya. Mulai dari sesi diagnosis.
- Alamat: `/id/teknologi/siap-pakai/kuliner/layar-pesanan-di-dapur`

## 2. Keputusan yang saya ambil dari konteks

| Hal                          | Keputusan                                                                      | Dasar di FULL KONTEKS                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Judul                        | “Layar pesanan di dapur”, tanpa “realtime”, seperti kartu yang sudah disetujui | Suara dan gaya, aturan 13: istilah asing hanya yang dipakai pembeli sehari-hari                   |
| Dampak                       | “Terpantau” ditulis sebagai yang tampil dan tercatat                           | Kolom dampak: pesanan tampil seketika, urutan dan waktu saji terpantau                            |
| Untuk siapa                  | Pemilik kafe dan resto yang dapurnya kewalahan saat ramai                      | Kolom Pembeli “Kafe/resto”; kutipan bab (“saat ramai”)                                            |
| Langkah 5 sampai 7           | Pesanan tampil, urutan menurut waktu masuk, waktu saji tercatat                | Dua bidang di balik pekerjaan ini: antarmuka dan dasbor, aturan bisnis dan workflow; kolom dampak |
| Satu hal yang tidak termasuk | Perangkat layar (monitor atau tablet)                                          | Pekerjaan ini tidak memakai bidang integrasi perangkat keras                                      |
| Pengungkapan komisi          | Ya, untuk aplikasi jadi                                                        | Langkah 2 bisa menyarankan layanan matang; Aturan isi, kalimat wajib vendor dan SaaS              |
| Kalimat wajib WhatsApp       | Tidak dipakai                                                                  | Pekerjaan ini tidak mengirim pesan ke pelanggan                                                   |
| Jembatan                     | Tidak ada                                                                      | Tidak ada pasangan antarunit untuk pekerjaan ini di Peta & aturan main ketiga unit                |
| Sumber pesanan               | Tidak dijanjikan tersambung ke kasir yang sudah ada                            | Baris katalog tidak menyebut integrasi kasir; sumber pesanan dibahas di sesi diagnosis            |

## 3. Hasil uji

**Gerbang isi: lolos** di 16 butir. Tidak ada angka hasil, harga, klien,
testimoni, wilayah, atau isi dummy. Waktu saji yang lebih cepat tidak
dijanjikan; yang dijanjikan hanya bahwa waktunya tercatat. Kalimat wajib
komisi ada, dan halaman menyebut satu batas (perangkat layar).

**Gerbang gaya: lolos**, dicek dengan skrip. Kalimat terpanjang 19 kata. Situasi dua kalimat tanpa
kalimat tentang Arthur. Poin daftar paling panjang 11 kata dan sejajar.

## 4. Usulan di luar tugas

- Halaman berikutnya: Buka langganan makan harian.

## Lampiran internal: jejak sumber

Untuk memeriksa asal kalimat dan menulis ke Sanity. Tidak pernah dirender.

| Blok                  | Kode katalog | Sumber                                                                             |
| --------------------- | ------------ | ---------------------------------------------------------------------------------- |
| Judul, dampak         | KUL-03       | Baris offer; judul tanpa “realtime”                                                |
| Untuk siapa           | KUL-03       | Kolom Pembeli “Kafe/resto”; kutipan bab                                            |
| Situasinya            | KUL / KUL-03 | Kutipan bab Kuliner; kolom dampak (urutan dan waktu saji)                          |
| Langkah 1 sampai 4, 8 | –            | Teknologi Sisi B, Alur kerja langkah 2 sampai 4; header Teknologi; header Arthur   |
| Langkah 5, 7          | KUL-03 / B10 | Bidang Pengembangan Dashboard dan Antarmuka Aplikasi                               |
| Langkah 6             | KUL-03 / B8  | Bidang Pengembangan Aturan Bisnis dan Workflow                                     |
| Yang Anda terima      | KUL-03       | Kolom dampak; header Teknologi (data milik Anda, akses dan dokumentasi diserahkan) |
| Batas, paragraf 1     | KUL-03       | Bidang KUL-03 tanpa B13 Integrasi Perangkat Keras dan IoT                          |
| Batas, paragraf 2     | –            | Aturan isi, kalimat wajib vendor dan SaaS                                          |
| Langkah pertama       | –            | Teknologi Sisi B, Alur kerja langkah 2 dan 5                                       |

Medan Sanity (dokumen `offer`): `judul`, `dampak`, `untukSiapa`, `jenis` (“Angka
yang memberi tahu lebih dulu”), `situasi`, `langkah` (8 butir), `serahan` (5
butir), `batas`, `langkahPertama`, `urutan` 2, `pintuMasuk` tidak, `bab` ke
Kuliner dan F&B, slug `layar-pesanan-di-dapur`, `idKatalog` KUL-03.
