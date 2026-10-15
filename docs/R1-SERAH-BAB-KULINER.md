# Serah halaman: bab Kuliner dan F&B (Teknologi, hasil siap pakai)

Tanggal: 15 Oktober 2026 · Status: perlu Anda · Placeholder: ada (3)

Halaman uji pertama R1, sesuai keputusan P3. Ditulis mengikuti `Alur kerja dan
uji mutu`: lembar rencana, teks per blok, dua gerbang, format serah. Istilah
mengikuti [glosarium pembaca](./R1-GLOSARIUM-PEMBACA.md). Belum ada yang
ditulis ke Sanity; penulisan menunggu persetujuan daftar pendek, persetujuan
teks, lalu “ok tulis” tersendiri.

## Daftar pendek offer (serahan pertama)

Aturannya dari Peta website, Memilih offer yang tayang: 3 sampai 7 offer, tanpa
offer ‡, offer tanpa † lebih dulu, satu offer per jenis sebelum offer kedua
dari jenis yang sama. Bab ini tidak punya offer † atau ‡. Kolom Keputusan Anda
diisi oleh Anda; offer tanpa keputusan belum boleh ditulis.

| Urutan | ID     | Offer                                           | Jenis    | Tanda | Usulan agen             | Alasan                                                                                     | Keputusan Anda | Tanggal |
| ------ | ------ | ----------------------------------------------- | -------- | ----- | ----------------------- | ------------------------------------------------------------------------------------------ | -------------- | ------- |
| 1      | KUL-01 | Bot pesan-antar WhatsApp                        | Bot      | –     | Tayang, **pintu masuk** | Menjawab keluhan pertama di kutipan (“pesanan bercampur di chat”); lingkup terkecil        |                |         |
| 2      | KUL-02 | Pesan dan bayar dari meja                       | Workflow | –     | Tayang                  | Menjawab “kasir kewalahan saat ramai”; juga jembatan ke FNB-01                             |                |         |
| 3      | KUL-03 | Layar dapur realtime                            | Data     | –     | Tayang                  | Satu-satunya jenis Data yang dekat dengan kutipan (urutan pesanan di dapur)                |                |         |
| 4      | KUL-07 | Buka langganan makan harian                     | Pasar    | –     | Tayang                  | Mewakili separuh header Teknologi, “buka pasar baru”, untuk warung                         |                |         |
| 5      | KUL-08 | Bot stok bahan dan pesan ulang ke pemasok       | Bot      | –     | Tayang                  | Menjawab “bahan sering habis atau terbuang”; Bot kedua, jadi urutan kelima                 |                |         |
| 6      | KUL-04 | Bot reservasi dengan uang muka                  | Bot      | –     | Cadangan                | Tidak menjawab kutipan; berguna untuk fixture tujuh kartu di R2                            |                |         |
| 7      | KUL-09 | Bot ulasan setelah kunjungan                    | Bot      | –     | Cadangan                | Tidak menjawab kutipan; bila tayang, membawa kalimat wajib ulasan dan jembatan kedua       |                |         |
| –      | KUL-05 | Workflow pesanan, produksi, dan antar           | Workflow | –     | Tidak diusulkan         | Hanya untuk katering; batas tujuh kartu                                                    |                |         |
| –      | KUL-06 | Buka toko makanan beku ke luar kota             | Pasar    | –     | Tidak diusulkan         | Pasar kedua; KUL-07 lebih dekat dengan warung di kutipan                                   |                |         |
| –      | KUL-10 | Buka jaringan waralaba dengan aplikasi bermerek | Pasar    | –     | Tidak diusulkan         | Lingkup terbesar di bab ini; cocok sebagai halaman pekerjaan sesudah ada pembeli franchise |                |         |
| –      | KUL-11 | Dasbor penjualan per jam                        | Data     | –     | Tidak diusulkan         | Data kedua; KUL-03 lebih dekat dengan kutipan                                              |                |         |

Bila Anda menyetujui lima yang diusulkan, halaman tayang dengan lima kartu.
KUL-04 dan KUL-09 ditulis juga di bawah supaya R2 bisa membuat fixture tiga,
lima, dan tujuh kartu dari copy yang sama tanpa menunggu putaran baru.

## Rencana

| Kolom             | Isi                                                                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Halaman           | Halaman situasi (bab), di bawah Teknologi, Untuk yang ingin hasil siap pakai. Alamat usulan: `/id/teknologi/siap-pakai/kuliner`                                             |
| Pembaca           | Warung dan kedai, kafe dan resto, katering, produsen makanan, franchise dan multi-outlet                                                                                    |
| Kata-kata pembeli | “Pesanan saya bercampur di chat, kasir kewalahan saat ramai, dan bahan sering habis atau terbuang.”                                                                         |
| Unit dan sisi     | Teknologi, Sisi B. Pertanyaan 2: pekerjaan berulang lewat sistem. Pertanyaan 3: pembaca tidak perlu memahami kode                                                           |
| Offer terpilih    | Pesanan di chat: KUL-01. Kasir kewalahan: KUL-02. Urutan di dapur: KUL-03. Pasar baru untuk warung: KUL-07. Bahan habis: KUL-08. Semuanya tanpa tanda, menunggu persetujuan |
| Dampak siap web   | Tabel di blok Kartu. KUL-02 memakai rumusan Peta website; KUL-07 dan KUL-08 diterjemahkan dari hasil menjadi cara kerja (Aturan isi 3)                                      |
| Langkah pertama   | Sesi diagnosis (Pintu masuk ringan, Teknologi B). Berbayar atau tidak: placeholder                                                                                          |
| Kalimat wajib     | Pesan WhatsApp hanya untuk pelanggan yang setuju (KUL-01). Pengungkapan komisi, karena jalur “pakai layanan matang” bisa menyarankan layanan pembayaran (KUL-02, KUL-07)    |
| Jembatan          | FNB-01 Kafe siap buka dari lokasi sewa (Konstruksi). Kedua, hanya bila KUL-09 tayang: MKT-08 Manajemen reputasi (Peekabo)                                                   |
| Keputusan terbuka | Tidak ada yang menahan bab ini. Posisi bot trading hanya menyentuh bab Keuangan                                                                                             |
| Placeholder       | Komisi dan harga untuk klien; sesi diagnosis berbayar atau tidak; kanal dan waktu balas (K5)                                                                                |

## Teks halaman

### Blok 0: nama dan alamat

- Nama (`bab.nama`): **Kuliner dan F&B**
- Slug: `kuliner`
- Urutan di sisi (`bab.urutan`): 0, karena bab pertama di master brief dan
  satu-satunya bab yang sudah punya copy

### Blok 1: situasi (`bab.situasi`, tampil di halaman sisi)

> Untuk warung, kafe, katering, produsen makanan, dan usaha dengan banyak
> outlet. Pesanan di chat bercampur, dan kasir kewalahan saat ramai.

### Blok 2: kata-kata pembeli (`bab.kutipan`, pembuka halaman situasi)

> “Pesanan saya bercampur di chat, kasir kewalahan saat ramai, dan bahan sering
> habis atau terbuang.”

Kutipan master brief apa adanya. Di layar tampil tanpa label.

### Blok 3: kartu pekerjaan (dari dokumen offer, urut `offer.urutan`)

Setiap kartu: judul, satu kalimat dampak, label untuk siapa. Tanpa label
“offer” dan tanpa ID.

| Urutan | ID     | Judul kartu (`offer.judul`)               | Kalimat dampak (`offer.dampak`)                                                                        | Untuk siapa (`offer.untukSiapa`)                |
| ------ | ------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 0      | KUL-01 | Bot pesan-antar WhatsApp                  | Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada admin yang berjaga.              | Untuk pemilik warung dan kedai                  |
| 1      | KUL-02 | Pesan dan bayar dari meja                 | Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur.                                  | Untuk pemilik kafe dan resto                    |
| 2      | KUL-03 | Layar pesanan di dapur                    | Setiap pesanan tampil di layar dapur saat itu juga, berikut urutan dan waktu sajinya.                  | Untuk pemilik kafe dan resto                    |
| 3      | KUL-07 | Buka langganan makan harian               | Pekerja kantor dan penghuni kos bisa berlangganan makan harian, dengan tagihan yang terkirim otomatis. | Untuk pemilik warung dan kedai                  |
| 4      | KUL-08 | Bot stok bahan dan pesan ulang ke pemasok | Stok bahan tercatat, dan pesanan ke pemasok terkirim sendiri saat bahan menipis.                       | Untuk pemilik franchise dan usaha banyak outlet |
| 5      | KUL-04 | Bot reservasi dengan uang muka            | Reservasi meja masuk lewat bot, dengan uang muka yang tercatat otomatis.                               | Untuk pemilik kafe dan resto                    |
| 6      | KUL-09 | Bot ulasan setelah kunjungan              | Setiap tamu diajak menulis ulasan, puas atau tidak, dan draf balasannya disiapkan.                     | Untuk pemilik kafe dan resto                    |

Label jenis (bila kartu dikelompokkan): Bot yang bekerja sendiri; Alur kerja
yang berjalan tanpa dikejar; Angka yang memberi tahu lebih dulu; Kanal
pendapatan baru.

Yang diubah dari baris katalog:

| ID     | Di katalog                                                                              | Di kartu, dan alasannya                                                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KUL-01 | Pesanan diterima, dicatat, dan ditagih kapan pun tanpa admin yang berjaga               | Tiga serangkai dipecah; isinya tetap                                                                                                                                    |
| KUL-02 | Antrean kasir hilang; pesanan langsung masuk ke dapur dengan pembayaran sudah selesai   | Rumusan Peta website. Antrean bergantung pada kebiasaan tamu (Aturan isi 3)                                                                                             |
| KUL-03 | Judul “Layar dapur realtime”                                                            | “Realtime” bukan kata yang dipakai pembeli sehari-hari (Suara dan gaya 13). Makna tidak berubah                                                                         |
| KUL-07 | Pendapatan berulang dari pekerja kantor dan penghuni kos, ditagih otomatis              | Pendapatan bergantung pada pembeli, jadi ditulis sebagai yang dibuka: langganan dan tagihannya                                                                          |
| KUL-08 | Bahan tidak habis dan tidak terbuang; pesanan ke pemasok terkirim dengan sendirinya     | Habis dan terbuang bergantung pada pemakaian dan pemasok. “Saat bahan menipis” dari pergeseran bahasa Teknologi: “Stok yang memesan ulang ke pemasok dengan sendirinya” |
| KUL-04 | Meja terisi dengan DP yang masuk otomatis; tamu yang batal tanpa kabar berkurang        | Rumusan Peta website                                                                                                                                                    |
| KUL-09 | Semua tamu diajak menulis ulasan sesuai kebijakan platform dan draf tanggapan disiapkan | “Puas atau tidak” menggantikan “sesuai kebijakan platform”, supaya kalimat wajib ulasan terbaca di kartu                                                                |

### Blok 4: batas dan syarat (`bab.batas`)

> Pesan WhatsApp hanya dikirim kepada pelanggan yang setuju menerimanya. Bila
> Anda membeli layanan pembayaran atau aplikasi jadi lewat kami, mitra membayar
> kami komisi. Kami menyebutkannya sejak awal. [PERLU PEMILIK: apakah harga
> untuk Anda berubah karena komisi itu · misalnya “harga untuk Anda tetap
> sama”]

Bila KUL-09 tayang, kalimat pertama menjadi: “Pesan WhatsApp, termasuk
permintaan ulasan, hanya dikirim kepada pelanggan yang setuju menerimanya.”
Kalimat wajib ulasan sudah terbaca di kartunya (“puas atau tidak”).

### Blok 5: bila pekerjaannya berlanjut (`bab.jembatan`, paling banyak dua)

1. Ke FNB-01 (Konstruksi):
   > Untuk kafe yang belum buka, unit Konstruksi menyiapkan lokasi sewa sampai
   > alur pelanggan dan dapurnya bekerja.
2. Ke MKT-08 (Peekabo), hanya bila KUL-09 tayang:
   > Untuk ulasan dan profil peta yang perlu dirawat setiap bulan, Peekabo
   > mengelolanya.

Jembatan hanya tampil bila offer tujuannya sudah terbit. FNB-01 dan MKT-08
belum ada di daftar pendek mana pun, jadi blok ini kosong sampai halaman
Konstruksi dan Peekabo menyusul, dan halaman tidak menampilkan judul blok
yang kosong (P4).

### Blok 6: ajakan (`bab.ajakan`)

- Label tombol: **Minta sesi diagnosis**
- Sesudahnya:
  > Di sesi itu kami membedah masalahnya bersama Anda sebelum ada yang
  > dibangun atau dibeli. [PERLU PEMILIK: apakah sesi diagnosis berbayar ·
  > misalnya “berbayar” atau “tanpa biaya”] [PERLU PEMILIK: kanal dan waktu
  > balas · misalnya “WhatsApp, dibalas dalam satu hari kerja”]

Sampai K5 diputuskan, tombol menuju `/kontak`.

### Blok 7: mesin pencari (`bab.metadata`)

- Judul (36 karakter): Bot dan workflow untuk usaha kuliner
- Deskripsi (124 karakter): Untuk warung, kafe, katering, dan produsen
  makanan. Pesanan WhatsApp dicatat bot, dan tamu memesan serta membayar dari
  meja.

Tanpa nama wilayah: wilayah kerja Teknologi belum diputuskan (Pola pikir
Arthur, pegangan 6).

## Jejak sumber

| Blok       | Sumber                                                                                                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 Nama     | Teknologi Sisi B, judul bab “Kuliner dan F&B”; Peta rute dan komponen, contoh alamat `…/siap-pakai/kuliner`                                                                                                                |
| 1 Situasi  | Teknologi Sisi B, baris Pembeli bab Kuliner; kutipan bab yang sama                                                                                                                                                         |
| 2 Kutipan  | Teknologi Sisi B, “Yang biasa mereka katakan”, bab Kuliner                                                                                                                                                                 |
| 3 Kartu    | KUL-01, KUL-02, KUL-03, KUL-07, KUL-08, KUL-04, KUL-09: judul, dampak, pembeli. KUL-02 dan KUL-04: Peta website, Dampak yang perlu diterjemahkan. Label jenis: Peta website                                                |
| 4 Batas    | Aturan isi, kalimat wajib “Pesan WhatsApp dan email” dan “Menyarankan vendor, SaaS”; Teknologi Sisi B Alur kerja langkah 3; Teknologi Peta & aturan main, Jalur komisi dua sisi (Xendit untuk pembayaran, QRIS, langganan) |
| 5 Jembatan | Konstruksi Peta & aturan main, pasangan FNB-01 dan KUL-02; FNB-01 di Konstruksi Sisi B; Contoh kalibrasi 3. Agency Peta & aturan main, pasangan MKT-08 dan KUL-09                                                          |
| 6 Ajakan   | Teknologi Sisi B Alur kerja langkah 2; Pola pikir Arthur, Pintu masuk ringan                                                                                                                                               |
| 7 Metadata | Suara dan gaya, Bentuk per blok; Pembeli dan dampak KUL-01, KUL-02                                                                                                                                                         |

## Offer yang dipakai

| ID     | Tanda | Rumusan aman yang dipakai                            |
| ------ | ----- | ---------------------------------------------------- |
| KUL-01 | –     | Tidak perlu                                          |
| KUL-02 | –     | Tidak perlu                                          |
| KUL-03 | –     | Tidak perlu                                          |
| KUL-07 | –     | Tidak perlu                                          |
| KUL-08 | –     | Tidak perlu                                          |
| KUL-04 | –     | Tidak perlu (cadangan)                               |
| KUL-09 | –     | Tidak perlu (cadangan); kalimat wajib ulasan berlaku |

## Placeholder terbuka

- [PERLU PEMILIK: apakah harga untuk Anda berubah karena komisi itu · misalnya
  “harga untuk Anda tetap sama”]
- [PERLU PEMILIK: apakah sesi diagnosis berbayar · misalnya “berbayar” atau
  “tanpa biaya”]
- [PERLU PEMILIK: kanal dan waktu balas · misalnya “WhatsApp, dibalas dalam
  satu hari kerja”] (K5)

## Pertanyaan untuk pemilik

1. **Daftar pendek.** Usul agen: lima tayang (KUL-01, KUL-02, KUL-03, KUL-07,
   KUL-08), dua cadangan (KUL-04, KUL-09). Akibatnya halaman tayang dengan
   lima kartu, dan R2 tetap punya copy untuk fixture tujuh kartu.
2. **Pintu masuk bab.** Usul agen: KUL-01, karena menjawab keluhan pertama di
   kutipan dan lingkupnya paling kecil. KUL-01 juga salah satu dari tiga demo
   yang diusulkan master brief, tetapi halaman tidak menyebutnya sebagai demo
   sebelum demo itu ada.
3. **Nama bab.** Usul agen: tetap “Kuliner dan F&B” seperti master brief, sesuai
   aturan nama bab di Peta website. Alternatifnya “Usaha kuliner”, yang lebih
   dekat dengan warung tetapi menyimpang dari nama katalog.
4. **Kalimat jujur dari header Teknologi.** Pola pikir Arthur meminta kalimat
   “kami menyarankannya lebih dulu, dan berkata jujur bila sesuatu belum perlu
   Anda beli” dipakai di dekat ajakan. Ajakan bab hanya punya satu kalimat
   sesudahnya. Usul agen: kalimat itu dipasang di halaman sisi Teknologi,
   tempat sesi diagnosis dijelaskan, bukan diulang di setiap bab.
5. **Pengungkapan komisi di halaman bab.** Usul agen: ya, karena dua dari lima
   pekerjaan bisa memakai layanan pembayaran pihak lain. Alternatifnya hanya di
   halaman pekerjaan KUL-02 dan KUL-07; akibatnya batas bab tinggal satu
   kalimat.

## Hasil uji

**Gerbang isi:** lolos, kecuali butir 6 yang menunggu Anda.

| Butir                                     | Hasil                                                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1 Jejak sumber                            | Lolos: setiap blok punya baris di Jejak sumber                                                              |
| 2 Klaim ada di sumber                     | Lolos: semua dampak dari baris offer; satu tambahan (“saat bahan menipis”) dari pergeseran bahasa Teknologi |
| 3 Bebas angka hasil, klien, testimoni     | Lolos                                                                                                       |
| 4 Bebas harga                             | Lolos: berbayar atau tidak menjadi placeholder                                                              |
| 5 Dampak pihak lain sebagai cara kerja    | Lolos: KUL-02, KUL-04, KUL-07, KUL-08 diterjemahkan                                                         |
| 6 Semua offer di daftar disetujui         | **Belum**: daftar pendek menunggu keputusan Anda                                                            |
| 7 Offer † dengan rumusan aman             | Tidak berlaku: tidak ada offer †                                                                            |
| 8 Yang sengaja tidak dijual               | Lolos: tidak disebut                                                                                        |
| 9 Kalimat wajib lengkap                   | Lolos: WhatsApp dan komisi. Batas satu hal berlaku untuk halaman pekerjaan, bukan halaman ini               |
| 10 Teks siap tayang tidak diubah          | Lolos: tidak ada teks siap tayang yang dipakai; kutipan apa adanya                                          |
| 11 Nama program mitra, logo platform      | Lolos: tidak ada; WhatsApp disebut sebagai kanal pelanggan, bukan status mitra                              |
| 12 Halaman jaringan                       | Tidak berlaku                                                                                               |
| 13 Wilayah                                | Lolos: tidak ada wilayah yang disebut                                                                       |
| 14 Angka riset                            | Tidak berlaku                                                                                               |
| 15 Placeholder untuk yang tidak diketahui | Lolos: tiga placeholder                                                                                     |
| 16 Bebas isi dummy                        | Lolos: tidak ada yang diambil dari situs uji                                                                |

**Gerbang gaya:** lolos, dengan satu catatan.

| Uji                 | Hasil                                                                                                                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tukar nama          | Lolos tipis: kalimat ajakan (“kami membedah masalahnya”) paling dekat dengan generik; ia lolos karena terikat pada sesi diagnosis dan pada urutan “sebelum ada yang dibangun atau dibeli” dari Alur kerja Teknologi Sisi B |
| Pegangan            | Lolos: setiap dampak menyebut benda (pesanan, layar dapur, tagihan, stok, uang muka)                                                                                                                                       |
| Meja                | Lolos menurut agen; perlu dibacakan Anda                                                                                                                                                                                   |
| Lalu apa            | Lolos: kalimat “kami membedah” dilanjutkan “sebelum ada yang dibangun atau dibeli” di kalimat yang sama                                                                                                                    |
| Hapus kata sifat    | Lolos: tidak ada kata sifat tentang Arthur                                                                                                                                                                                 |
| Pokok kalimat       | Lolos: satu kalimat berpokok “kami” (“kami membedah”) dan satu berpokok “mitra” (“mitra membayar kami komisi”), keduanya diikuti kata kerja pekerjaan                                                                      |
| Kata benda bentukan | Lolos: nol “melakukan”, “memberikan”, “memiliki” (dicek dengan skrip)                                                                                                                                                      |
| Frasa               | Lolos: nol temuan dari daftar frasa yang tidak dipakai (dicek dengan skrip)                                                                                                                                                |
| Tanda baca          | Lolos: nol tanda pisah, tanda seru, emoji                                                                                                                                                                                  |
| Kapital judul       | Lolos                                                                                                                                                                                                                      |
| Istilah             | Lolos: WhatsApp, bot, workflow, franchise, outlet, F&B. “Realtime” dibuang dari judul KUL-03. “F&B” dan “outlet” ikut nama dan baris Pembeli di master brief                                                               |
| Panjang             | Lolos: kalimat terpanjang 16 kata (jembatan 1)                                                                                                                                                                             |
| Batas blok          | Lolos: judul kartu paling panjang 8 kata (KUL-08); dampak satu kalimat; batas 3 kalimat; jembatan 1 kalimat                                                                                                                |
| Pola                | Lolos: nol pertanyaan, nol “bukan sekadar”. Tiga serangkai hanya di kutipan pembeli, yang bebas dari uji ini                                                                                                               |
| Pembuka dan penutup | Lolos: blok situasi dibuka dengan pembaca, batas dengan pesan pelanggan, ajakan dengan sesi                                                                                                                                |

Catatan: kalimat dampak KUL-01, KUL-03, dan KUL-07 sama-sama 14 kata. Uji
Panjang ditujukan untuk kalimat yang dibaca berurutan dalam satu paragraf;
di sini ketiganya ada di kartu yang terpisah, jadi tidak diubah. Bila Anda
menilai kartu dibaca berurutan, KUL-03 dipendekkan menjadi “Pesanan tampil di
layar dapur saat itu juga, berikut urutannya.”

**Perbedaan antara prompt dan kerangka yang ditemukan:**

1. Peta website memakai nama bab master brief tanpa kode, sedangkan P1
   meminta bab disebut sebagai situasi pembeli. Keduanya dipenuhi dengan
   memakai nama master brief sebagai nama, dan baris `bab.situasi` sebagai
   cara bab diperkenalkan di halaman sisi (glosarium bagian 4).
2. Template halaman bab di Peta website tidak punya blok situasi, tetapi Model
   isi Sanity punya `bab.situasi`. Di serah ini, situasi dipakai di halaman
   sisi saja, dan halaman bab dibuka dengan kutipan.

## Usulan di luar tugas

- **Master brief, Teknologi Sisi B, Alur kerja langkah 2:** “menyajikan solusi
  terbaik” dan “berfungsi sebagai penyaring” memakai frasa yang tidak dipakai
  di website, dan kalimat kedua yang tayang di F3 (temuan E7). Usul: rumusan
  untuk halaman sisi, “Di sesi diagnosis kami membedah masalahnya bersama Anda
  sebelum ada yang dibangun atau dibeli.” Master brief tetap Anda yang
  mengubah.
- **KUL-03:** judul katalog memakai “realtime”. Usul: judul katalog menjadi
  “Layar pesanan di dapur”, supaya kartu dan katalog sama.
- **Halaman offer.** Halaman pekerjaan untuk lima offer ini ditulis sesudah
  daftar pendek disetujui, satu per putaran, mulai dari KUL-01.
