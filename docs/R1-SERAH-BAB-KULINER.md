# Serah halaman: Kuliner dan F&B

Teknologi, untuk yang ingin hasil siap pakai · 15 Oktober 2026 · Status: perlu
Anda · Placeholder: tidak ada

Bagian pertama dokumen ini adalah halaman persis seperti yang dibaca pembeli.
Tidak ada kode katalog di sana, dan tidak akan ada di website: kode hanya
tersimpan di grup Internal Studio, dan query publik dijaga tes agar tidak
pernah mengambilnya (`lib/integrations/sanity/queries.test.ts`). Kode katalog
muncul sekali saja, di lampiran internal paling bawah, sebagai jejak sumber.

Semua isi ditulis dari FULL KONTEKS. Tidak ada placeholder dan tidak ada
pertanyaan yang menahan halaman ini; keputusan yang saya ambil dicatat
bersama sumbernya, supaya Anda bisa mengubah yang tidak cocok. Belum ada yang
ditulis ke Sanity; itu menunggu “ok tulis”.

## 1. Halaman seperti yang dibaca pembeli

**Teknologi · Untuk yang ingin hasil siap pakai**

### Kuliner dan F&B

> “Pesanan saya bercampur di chat, kasir kewalahan saat ramai, dan bahan
> sering habis atau terbuang.”

#### Pekerjaan untuk situasi ini

**Bot pesan-antar WhatsApp** · _Mulai dari sini_
Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada admin
yang berjaga.
Untuk pemilik warung dan kedai

**Pesan dan bayar dari meja**
Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur.
Untuk pemilik kafe dan resto

**Layar pesanan di dapur**
Setiap pesanan tampil di layar dapur saat itu juga, berikut urutan dan waktu
sajinya.
Untuk pemilik kafe dan resto

**Buka langganan makan harian**
Pekerja kantor dan penghuni kos bisa berlangganan makan harian, dengan
tagihan yang terkirim otomatis.
Untuk pemilik warung dan kedai

**Bot stok bahan dan pesan ulang ke pemasok**
Stok bahan tercatat, dan pesanan ke pemasok terkirim sendiri saat bahan
menipis.
Untuk pemilik franchise dan usaha banyak outlet

#### Batas dan syarat

Pesan WhatsApp hanya dikirim kepada pelanggan yang setuju menerimanya. Bila
Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar
kami komisi. Kami menyebutkannya sejak awal, dan komisi itu dibayar mitra di
luar biaya yang Anda bayar kepada kami.

#### Bila pekerjaannya berlanjut

Untuk kafe yang belum buka, unit Konstruksi menyiapkan lokasi sewa sampai alur
pelanggan dan dapurnya bekerja.

_(Blok ini baru tampil sesudah halaman kafe siap buka di Konstruksi terbit.
Sampai saat itu, blok dan judulnya tidak tampil.)_

#### Langkah pertama

**[ Minta sesi diagnosis ]**

Di sesi itu kami membedah masalahnya bersama Anda sebelum ada yang dibangun
atau dibeli. Biaya konsultasinya bersifat pilihan.

_(Sampai kanal kontak ditetapkan, tombol membuka halaman kontak.)_

### Di halaman Teknologi untuk hasil siap pakai

Situasi ini tampil di daftar situasi dengan satu baris:

> **Kuliner dan F&B**
> Untuk warung, kafe, katering, produsen makanan, dan usaha dengan banyak
> outlet. Pesanan di chat bercampur, dan kasir kewalahan saat ramai.

### Di mesin pencari

- Judul: Bot dan workflow untuk usaha kuliner
- Deskripsi: Untuk warung, kafe, katering, dan produsen makanan. Pesanan
  WhatsApp dicatat bot, dan tamu memesan serta membayar dari meja.

## 2. Pekerjaan yang ditawarkan di situasi ini

Bab Kuliner di master brief punya sebelas pekerjaan; tidak satu pun bertanda
yang menahan atau mewajibkan rumusan aman. Lima tayang. Aturan memilihnya dari
Peta website: setiap keluhan di kutipan dijawab satu pekerjaan, satu pekerjaan
per jenis sebelum jenis yang sama muncul lagi, dan pekerjaan dengan lingkup
terkecil menjadi pintu masuk.

| Pekerjaan                                       | Tayang                | Alasan                                                                               |
| ----------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------ |
| Bot pesan-antar WhatsApp                        | Ya, pintu masuk       | Menjawab “pesanan bercampur di chat”; lingkup paling kecil di bab ini                |
| Pesan dan bayar dari meja                       | Ya                    | Menjawab “kasir kewalahan saat ramai”; pasangan kafe siap buka di Konstruksi         |
| Layar pesanan di dapur                          | Ya                    | Satu-satunya pekerjaan jenis angka yang menyentuh urutan pesanan di dapur            |
| Buka langganan makan harian                     | Ya                    | Mewakili “buka pasar baru” di header Teknologi, untuk warung yang ada di kutipan     |
| Bot stok bahan dan pesan ulang ke pemasok       | Ya                    | Menjawab “bahan sering habis atau terbuang”                                          |
| Bot reservasi dengan uang muka                  | Tidak, copy disiapkan | Tidak menjawab kutipan. Copy dipakai untuk isi wakil tujuh kartu di R2               |
| Bot ulasan setelah kunjungan                    | Tidak, copy disiapkan | Tidak menjawab kutipan. Copy dipakai untuk isi wakil tujuh kartu di R2               |
| Workflow pesanan, produksi, dan antar           | Tidak                 | Hanya untuk katering; lima kartu sudah menjawab seluruh kutipan                      |
| Buka toko makanan beku ke luar kota             | Tidak                 | Kanal pendapatan kedua; langganan makan harian lebih dekat dengan warung             |
| Buka jaringan waralaba dengan aplikasi bermerek | Tidak                 | Lingkup terbesar di bab ini; lebih cocok sesudah ada pembeli franchise yang bertanya |
| Dasbor penjualan per jam                        | Tidak                 | Jenis angka kedua; layar pesanan di dapur lebih dekat dengan kutipan                 |

Dua kartu yang disiapkan untuk R2 saja, tidak tayang:

**Bot reservasi dengan uang muka**
Reservasi meja masuk lewat bot, dengan uang muka yang tercatat otomatis.
Untuk pemilik kafe dan resto

**Bot ulasan setelah kunjungan**
Setiap tamu diajak menulis ulasan, puas atau tidak, dan draf balasannya
disiapkan.
Untuk pemilik kafe dan resto

## 3. Keputusan yang saya ambil dari konteks

| Hal                   | Keputusan                                                                                                                                                                    | Dasar di FULL KONTEKS                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Komisi dan harga      | Komisi disebut dibayar mitra di luar biaya klien; tidak ada janji bahwa harga vendor tetap                                                                                   | Teknologi, Jalur komisi dua sisi: komisi datang “dari sisi vendor, di samping biaya dari klien”                                         |
| Biaya sesi diagnosis  | “Biaya konsultasinya bersifat pilihan”, tanpa angka                                                                                                                          | Teknologi Sisi B, Alur kerja langkah 2: “Biaya konsultasi bersifat opsional”; Kerangka pemandu keputusan 4: tanpa angka di website      |
| Kanal dan waktu balas | Tidak disebut di halaman ini; tombol membuka halaman kontak                                                                                                                  | Peta website, Aturan formulir: sampai formulir dibangun, ajakan membuka kanal kontak. Nomor dan waktu balas hanya ada di halaman kontak |
| Nama situasi          | “Kuliner dan F&B”, nama master brief                                                                                                                                         | Peta website, Nama bab untuk pembaca; glosarium bagian 4                                                                                |
| Pintu masuk           | Bot pesan-antar WhatsApp                                                                                                                                                     | Peta website, Memilih offer yang tayang butir 3: lingkup terkecil                                                                       |
| Pengungkapan komisi   | Di halaman ini, karena dua dari lima pekerjaan bisa memakai layanan pembayaran pihak lain                                                                                    | Aturan isi, kalimat wajib untuk halaman yang menyarankan vendor atau SaaS                                                               |
| Kalimat jujur header  | “Kami menyarankannya lebih dulu, dan berkata jujur bila sesuatu belum perlu Anda beli” dipasang di halaman Teknologi untuk hasil siap pakai, bukan diulang di setiap situasi | Pola pikir Arthur, Pintu masuk ringan: kalimat itu dipakai di dekat ajakan                                                              |
| Wilayah               | Tidak disebut                                                                                                                                                                | Pola pikir Arthur, pegangan 6: wilayah Teknologi belum diputuskan                                                                       |

## 4. Hasil uji

**Gerbang isi: lolos** di 16 butir. Tidak ada angka hasil, harga, klien,
testimoni, wilayah, atau isi dummy. Dampak yang bergantung pada pihak lain
(antrean kasir, pendapatan langganan, bahan yang tidak habis, meja yang
terisi) ditulis sebagai cara kerja. Kalimat wajib WhatsApp dan komisi ada.
Halaman tidak memuat placeholder, jadi bisa disetujui untuk tayang.

**Gerbang gaya: lolos**, dicek dengan skrip untuk frasa yang tidak dipakai,
kata benda bentukan, tanda pisah, tanda seru, dan panjang kalimat. Kalimat
terpanjang 17 kata. Judul kartu paling panjang 8 kata. Kata “sisi”, “bab”,
“offer”, “lapis”, “eceran”, dan “rakitan” tidak muncul di teks halaman.
“Realtime” dibuang dari judul layar dapur. Satu catatan: kalimat ajakan paling
dekat dengan kalimat generik, dan lolos karena terikat pada sesi diagnosis.

## 5. Usulan di luar tugas

- Master brief, Teknologi Sisi B, Alur kerja langkah 2, memakai “menyajikan
  solusi terbaik” dan “berfungsi sebagai penyaring”. Keduanya tidak boleh
  tampil di website; halaman Teknologi untuk hasil siap pakai nanti memakai kalimat ajakan di atas.
- Judul katalog “Layar dapur realtime” sebaiknya menjadi “Layar pesanan di
  dapur”, supaya katalog dan website sama.
- Halaman pekerjaan untuk lima kartu ini ditulis berikutnya, satu per putaran,
  mulai dari Bot pesan-antar WhatsApp.

## Lampiran internal: jejak sumber

Lampiran ini untuk memeriksa asal kalimat dan untuk menulis ke Sanity. Isinya
masuk medan Internal (`idKatalog`, `jejakSumber`) dan tidak pernah dirender.

| Bagian halaman                 | Kode katalog | Sumber                                                                                                      |
| ------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------- |
| Nama, kutipan, baris situasi   | KUL          | Teknologi Sisi B, bab Kuliner dan F&B: judul, Pembeli, Yang biasa mereka katakan                            |
| Bot pesan-antar WhatsApp       | KUL-01       | Baris offer: judul, dampak, pembeli                                                                         |
| Pesan dan bayar dari meja      | KUL-02       | Baris offer; dampak dari Peta website, Dampak yang perlu diterjemahkan                                      |
| Layar pesanan di dapur         | KUL-03       | Baris offer; judul tanpa “realtime”                                                                         |
| Buka langganan makan harian    | KUL-07       | Baris offer; pendapatan ditulis sebagai langganan dan tagihan                                               |
| Bot stok bahan dan pesan ulang | KUL-08       | Baris offer; “saat bahan menipis” dari tabel pergeseran bahasa Teknologi                                    |
| Bot reservasi dengan uang muka | KUL-04       | Baris offer; dampak dari Peta website (isi wakil R2)                                                        |
| Bot ulasan setelah kunjungan   | KUL-09       | Baris offer; “puas atau tidak” dari aturan main gabungan 7 (isi wakil R2)                                   |
| Batas dan syarat               | –            | Aturan isi, kalimat wajib WhatsApp dan komisi; Teknologi Sisi B Alur kerja langkah 3; Jalur komisi dua sisi |
| Bila pekerjaannya berlanjut    | FNB-01       | Konstruksi Peta & aturan main, pasangan dengan KUL-02; Contoh kalibrasi 3                                   |
| Langkah pertama                | –            | Teknologi Sisi B Alur kerja langkah 2; Pola pikir Arthur, Pintu masuk ringan                                |
| Mesin pencari                  | –            | Suara dan gaya, Bentuk per blok                                                                             |

Medan Sanity: nama ke `bab.nama`, kutipan ke `bab.kutipan`, baris situasi ke
`bab.situasi`, batas ke `bab.batas`, jembatan ke `bab.jembatan`, langkah
pertama ke `bab.ajakan`, kartu ke dokumen `offer` (`judul`, `dampak`,
`untukSiapa`, `jenis`, `urutan`, `pintuMasuk`). Slug situasi: `kuliner`.
