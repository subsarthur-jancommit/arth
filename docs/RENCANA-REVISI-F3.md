# Rencana revisi F3

Tanggal: 15 Oktober 2026. Disusun atas permintaan pemilik, sesudah
inventaris di `docs/TINJAUAN-F01-F03.md` (bagian A sampai E8) dinyatakan
lengkap.

Dokumen ini mengusulkan urutan kerja. Ia tidak mengubah backlog di
`FULL KONTEKS/IMPLEMENTATION PLAN`; bila pemilik menyetujuinya, baris F3 di
`PROGRES-ARTHUR.md` diubah ke **Direvisi** dan paket R di bawah menggantikan
pekerjaan yang tersisa.

## Prinsip urutan

Revisi berjalan dari yang menentukan ke yang ditentukan:

1. **Kata dulu, baru bentuk.** Layout yang dirancang untuk placeholder tidak
   bisa dinilai (E6). Copy yang disetujui menentukan panjang teks, jumlah
   butir, dan hierarki, jadi copy datang sebelum layout.
2. **Bentuk dulu, baru gerak.** Momen di `Sistem animasi` ditempel ke blok
   yang sudah benar ukurannya, bukan sebaliknya.
3. **Bahasa Indonesia dulu, baru Inggris.** Inggris ditulis dari glosarium
   dan copy Indonesia yang sudah disetujui, bukan diterjemahkan kata demi kata
   dari istilah internal (E7.9).
4. **Satu PR per paket**, `ci` dan `e2e` hijau di head, tanpa `[skip ci]`
   (CLAUDE.md #22, PROSEDUR-KERJA).

## Yang harus pemilik putuskan lebih dulu

Empat keputusan menahan paket. Untuk masing-masing ada usulan bawaan supaya
cukup dijawab "pakai usulan" bila setuju.

**Diputuskan 15 Oktober 2026: pemilik memakai usulan bawaan untuk P1, P2, P3,
dan P4.** R0 dan R1 boleh dimulai; R4 dimulai dengan dua sampai tiga arah
pelat sebagai gambar diam untuk dipilih pemilik.

| No.    | Keputusan                                                                                                                             | Kenapa menahan                                                                                                     | Usulan bawaan                                                                                                                                                                                                                                                                                                                                                                                | Menahan paket |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **P1** | **Glosarium pembaca.** Nama yang dilihat pembeli untuk unit, sisi, bab, offer, jenis, dan langkah pertama, beserta padanan Inggrisnya | Istilah katalog bocor ke pembeli (E7.2), dan dwibahasa tidak bisa dibangun tanpa padanan yang bermakna (E7.9)      | Kata "sisi", "bab", "offer", "lapis", "eceran", "rakitan" tidak pernah tampil. Sisi disebut lewat pembacanya ("Untuk pemilik bangunan"). Bab disebut sebagai situasi pembeli. Offer disebut "pekerjaan" di kalimat dan tidak diberi label di kartu. Jenis memakai label pembaca di `Peta website`. Draf glosarium ditulis di R1 untuk disetujui                                              | R1, R3, R7    |
| **P2** | **Arah visual.** Apa yang mengisi beranda dan kartu setelah foto dummy dicabut                                                        | Beranda kini tanpa gambar, pelat, atau momen besar (E1, E8.3)                                                      | Pelat gambar kerja SVG per unit (F4-05) ditarik ke revisi ini: Konstruksi potongan dan denah, Teknologi diagram alur, Peekabo papan kampanye. Lintasan beranda yang di-pin dikembalikan dengan pelat itu. WebGL hanya dipakai bila pelat juga tampil sebagai material; bila tidak, dicabut dari beranda. Dua sampai tiga arah ditunjukkan sebagai gambar diam untuk dipilih sebelum dibangun | R4, R5        |
| **P3** | **Cara copy ditulis dan disetujui**                                                                                                   | Copy sekarang ditulis ke editor, bukan ke pembeli (E7.1–E7.6)                                                      | Agen menulis per halaman mengikuti `Alur kerja dan uji mutu`: lembar rencana, gerbang isi, gerbang gaya. Pemilik menyetujui per halaman di dokumen copy sebelum ada yang ditulis ke Sanity. Halaman uji pertama tetap bab Kuliner dan F&B (Teknologi, hasil siap pakai), sesuai syarat Tahap 2                                                                                               | R1, R2        |
| **P4** | **Aturan halaman yang isinya belum ada**                                                                                              | Catatan kerja tayang, alamat dummy muncul tiga kali, dan dua tautan navigasi berakhir di soft-404 (E3, E6.4, E6.5) | Pembaca tidak pernah melihat catatan untuk editor. Seksi tanpa isi disembunyikan, bukan diganti keadaan kosong. Halaman tanpa isi terbit tidak ditautkan dari navigasi dan menjawab 404 yang asli. Kontak dummy tidak tampil sama sekali; ajakan diarahkan ke halaman kontak sampai K5 diputuskan                                                                                            | R0            |

Dua keputusan lama ikut menentukan hasil akhir, tetapi tidak menahan awal
revisi:

- **K5, kanal kontak.** Selama belum diputuskan, setiap ajakan berakhir di
  halaman kontak tanpa kanal. Semakin cepat diputuskan, semakin cepat situs
  punya jalur ke percakapan (E7.8).
- **F0-06, dataset `ci`.** Tindakan pemilik di dasbor Sanity. Tanpanya,
  fixture untuk merancang kartu dengan isi nyata (R2) hanya bisa ditulis ke
  production sebagai draf.

## Paket revisi

### R0 Stabilkan yang rusak

Pekerjaan mekanis, tidak menunggu P1 sampai P3. Satu PR.

**Status 15 Oktober 2026: selesai.** PR #20, bertumpuk di atas PR #18,
di-merge ke `codex/f2-02-unit-side-model` sebagai `6730a24`. `ci` dan `e2e`
hijau pada head `e5c687f` (run 38679015289: 674 lulus, 0 gagal, 62 dilewati
sebagai `test.fixme` dan opt-out beralasan); preview Vercel ditinjau pemilik.
Tidak ke `main`: PR #18 dipisah lebih dulu (bagian Nasib PR #18). Satu penyesuaian dari usulan awal: `/en/*`
dialihkan hanya untuk rute Arthur yang belum diterjemahkan (unit, sisi,
kontak, cara kerja, satu klien tiga unit, kebijakan, halaman). `/en/work` dan
`/en/journal` sudah berbahasa Inggris penuh dan tetap, sesuai bunyi K2 ("/en
_tanpa terjemahan_").

| Lingkup                                                            | Selesai bila                                                                                                                                                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Soft-404 di `/cara-kerja` dan `/satu-klien-tiga-unit` (E3.1, E3.2) | Halaman tanpa isi terbit menjawab status 404 yang asli, dan tautannya keluar dari navigasi, beranda, dan footer sampai isinya terbit                                                                          |
| `/en/*` campur bahasa (C2)                                         | Selama K2 masih "Indonesia dulu", seluruh `/en/*` dialihkan 307 ke padanan `/id/*`, bukan hanya `/en`                                                                                                         |
| Catatan editor yang tayang (E7.1, E6.5)                            | Tidak ada "NOTE:", "Ganti sebelum…", "setelah disusun di Sanity", atau status internal lain di HTML publik; alamat dummy tidak tampil. Ditambah satu uji yang menggagalkan build bila teks semacam itu muncul |
| Simulasi flowmap tanpa pemakai di beranda (B5)                     | `simTypes` dicabut dari beranda; scene WebGL hero tetap. Flowmap kembali bila R4 memasang pelat sebagai material                                                                                              |
| Menu ponsel 28,4 px (E8.1)                                         | Ukuran tautan tidak lagi ditentukan oleh label terpanjang; diukur ulang pada 390 × 844                                                                                                                        |

### R1 Glosarium dan dokumen copy

Pekerjaan dokumen, tanpa kode. Bergantung pada P1 dan P3.

| Lingkup                                                 | Selesai bila                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Glosarium pembaca ID dan EN                             | Setiap istilah katalog punya nama pembaca, padanan Inggris, dan catatan kapan dipakai; disetujui pemilik        |
| Copy beranda, tiga unit, enam sisi                      | Per halaman: lembar rencana, teks per blok, jejak sumber, hasil gerbang isi dan gerbang gaya; disetujui pemilik |
| Copy cara kerja, satu klien tiga unit, kontak, jaringan | Sama                                                                                                            |
| Copy bab uji Kuliner dan F&B dengan 3 sampai 7 offer    | Sama, dengan daftar pendek offer yang disetujui pemilik                                                         |

Copy yang disetujui ditulis ke draf Sanity sesudah "ok tulis" tersendiri.

**Status 15 Oktober 2026:** glosarium
([`R1-GLOSARIUM-PEMBACA.md`](./R1-GLOSARIUM-PEMBACA.md)) disetujui pemilik.
Serah bab Kuliner dan F&B ([`R1-SERAH-BAB-KULINER.md`](./R1-SERAH-BAB-KULINER.md))
ditulis ulang atas arahan pemilik: tanpa kode katalog di bagian halaman, tanpa
placeholder, dengan pekerjaan yang tayang dipilih agen dari master brief;
disetujui pemilik. Halaman pekerjaan pertama, Bot pesan-antar WhatsApp
([`R1-SERAH-BOT-PESAN-ANTAR.md`](./R1-SERAH-BOT-PESAN-ANTAR.md)), disetujui pemilik. Halaman Pesan dan bayar dari meja
([`R1-SERAH-PESAN-BAYAR-MEJA.md`](./R1-SERAH-PESAN-BAYAR-MEJA.md)) disetujui pemilik. Halaman Layar pesanan di dapur
([`R1-SERAH-LAYAR-DAPUR.md`](./R1-SERAH-LAYAR-DAPUR.md)) menunggu
persetujuan pemilik.

Pada 15 Oktober 2026 pemilik mengarahkan ulang halaman pekerjaan Teknologi: setiap
halaman menawarkan Paket Starter dan Paket Integrator (glosarium bagian 10),
bukan daftar langkah teknis. Ketiga halaman pekerjaan Kuliner ditulis ulang
dalam bentuk itu dan disetujui pemilik. Pola dua paket berlaku untuk
semua halaman pekerjaan Teknologi berikutnya. Halaman Buka langganan makan
harian ([`R1-SERAH-LANGGANAN-MAKAN.md`](./R1-SERAH-LANGGANAN-MAKAN.md))
disetujui pemilik. Halaman Bot stok bahan dan pesan ulang ke pemasok
([`R1-SERAH-BOT-STOK-BAHAN.md`](./R1-SERAH-BOT-STOK-BAHAN.md)), yang terakhir
dari lima pekerjaan Kuliner, menunggu persetujuan pemilik.

Pada 15 Oktober 2026 pemilik menghentikan penulisan halaman pekerjaan satu per
satu: website adalah alat untuk mendatangkan dan mengukur leads, bukan buku.
Pendekatan penggantinya, pola per model offer, ada di
[`R1-PENDEKATAN-POLA-OFFER.md`](./R1-PENDEKATAN-POLA-OFFER.md) dan menunggu
disetujui pemilik pada hari yang sama. Halaman Bot stok bahan menjadi bahan uji pola.

Langkah 2 rekomendasinya dikerjakan di lokal: skema `offer` mendapat medan
`model`, `tingkat`, dan `halamanSendiri`; `situasi` dan `batas` hanya wajib bagi offer
berhalaman sendiri; `langkah` dan `serahan` opsional. Skrip
`lib/scripts/import-catalog.ts` membaca 688 baris master brief dan memisahkan 506
yang otomatis dari 182 yang ditulis tangan, tanpa menulis ke Sanity. Rute yang
membaca `halamanSendiri` dan tampilan dua paket menyusul di R3 dan R5.

Langkah 3 untuk model Teknologi (model 1 sampai 4) dikerjakan di lokal. Jawaban
agen per baris tersimpan di `lib/content/catalog-overrides.ts` dan dibaca skrip
impor; tinjauannya di [`R1-TULIS-TANGAN-TEKNOLOGI.md`](./R1-TULIS-TANGAN-TEKNOLOGI.md).
Dari 316 offer Teknologi, 309 siap; 7 ditahan karena posisi bot trading.
Disetujui pemilik 15 Oktober 2026.

Langkah 3 untuk Konstruksi (model 5 sampai 9 dan perawatan di model 10)
dikerjakan dengan cara yang sama; tinjauannya di
[`R1-TULIS-TANGAN-KONSTRUKSI.md`](./R1-TULIS-TANGAN-KONSTRUKSI.md). Dari 216 offer
Konstruksi, 214 siap; 2 membership perawatan ditahan menunggu keputusan ekonomi
Membership Care. Disetujui pemilik 15 Oktober 2026.

Langkah 3 untuk Peekabo (model 10 sampai 16) selesai dengan cara yang sama;
tinjauannya di [`R1-TULIS-TANGAN-PEEKABO.md`](./R1-TULIS-TANGAN-PEEKABO.md). Dari 156
offer Peekabo, 129 siap. Yang ditahan: 15 offer operator (SaaS pertama), 5 offer ‡
(pilihan sub-agen), dan 7 offer yang nilainya status mitra resmi platform, sampai
Peekabo terdaftar. Disetujui pemilik 15 Oktober 2026.

Seluruh katalog: 652 dari 688 offer siap diturunkan; 36 ditahan menunggu
keputusan pemilik atau pendaftaran program mitra.

Langkah 4, halaman situasi Teknologi, diturunkan oleh `lib/content/situation-pages.ts`
dari master brief dan offer yang siap: 23 halaman, dengan teks Kuliner yang sudah
disetujui tetap di tempatnya (`lib/content/situation-overrides.ts`). Tinjauannya di
[`R1-SITUASI-TEKNOLOGI.md`](./R1-SITUASI-TEKNOLOGI.md). Saat menurunkannya, gerbang gaya
menangkap 17 baris otomatis lagi (kata penguat, judul lebih dari 8 kata, dampak
yang menjanjikan hasil); 15 di Teknologi, 1 di Konstruksi, 1 di Peekabo. Semuanya
ditulis ulang di `catalog-overrides.ts` dan disetujui pemilik bersama halaman
situasinya pada 15 Oktober 2026.

Langkah 5, halaman Cara kami dibayar, ditulis di
[`R1-SERAH-CARA-KAMI-DIBAYAR.md`](./R1-SERAH-CARA-KAMI-DIBAYAR.md), beserta pemendekan
blok cara bayar di halaman pekerjaan sesudah halaman itu terbit. Disetujui
pemilik 15 Oktober 2026, dan pemendekannya sudah diterapkan di halaman Bot
pesan-antar WhatsApp serta Pesan dan bayar dari meja.

Kelima langkah rekomendasi pendekatan pola sudah dikerjakan di lokal. Halaman
Dokumentasi tetap menunggu foto nyata, izin pemiliknya, dan keputusan Bukti
pertama.

### R3, bagian pertama: daftar pekerjaan dan halaman sendiri

PR bertumpuk di atas #21. Kode mengikuti struktur informasi yang disetujui di
pendekatan pola, bagian 3:

- Halaman situasi menampilkan semua offer terbit (batas tujuh dicabut): pintu
  masuk di atas dengan tanda “Mulai dari sini”, sisanya berkelompok di bawah
  label jenisnya, tinggi kartu mengikuti isi (temuan D), dan baris syarat
  untuk offer †.
- Setiap kartu punya tombol “Tanyakan pekerjaan ini” ke `/kontak?dari=…&pekerjaan=…`.
  Keduanya slug halaman, bukan data pengunjung.
- Halaman offer hanya ada untuk offer `halamanSendiri` atau pintu masuk. Kartu,
  jembatan, dan contoh di halaman unit menautkan halaman situasi bila offer
  tidak punya halaman sendiri.
- Halaman offer menampilkan dua paket (`tingkat`) bila diisi, dan syarat di
  bawah dampaknya. Skema `offer` mendapat medan `syarat`.

Belum: blok Cara kami bekerja Teknologi di halaman offer, halaman Cara kami
dibayar, dan pembacaan `dari`/`pekerjaan` di halaman kontak (menunggu K5 dan
F5-06). Semua ini baru terlihat setelah isi ditulis ke Sanity dengan “ok tulis”.

### Penulisan pertama ke Sanity (ok tulis pemilik, 16 Oktober 2026)

Pemilik memberi “ok tulis” untuk 1 bab dan 11 offer Kuliner. Dokumen disusun
`lib/content/sanity-drafts.ts` lewat `import-catalog.ts --drafts`, lalu ditulis
ke dataset `production` sebagai draf: `drafts.arthur-bab-teknologi-siap-pakai-kuliner`
dan `drafts.arthur-offer-kul-01` sampai `-kul-11`. Diverifikasi dengan query:
12 draf, 0 terbit, semua berstatus `perlu-anda`; pintu masuk KUL-01; halaman
sendiri KUL-01 dan KUL-02. Tidak ada yang diterbitkan.

Supaya halaman tampil di situs, pemilik menyetujui dan menerbitkan berurutan:
unit Teknologi, sisi siap pakai, bab Kuliner, lalu offer-nya. Koreksi 16 Oktober 2026: referensi unit di keenam draf sisi ternyata benar
(referensi lemah ke ID terbit unit yang tepat, dengan `_strengthenOnPublish`);
ia terbaca kosong hanya karena unitnya belum terbit, jadi tidak diubah. Atas
“ok tulis” pemilik, urutan sisi siap pakai diubah menjadi 0; sisi paham teknis
juga bernilai 0, sehingga keduanya seri sampai paham teknis diubah menjadi 1.
Draf unit dan sisi ditulis partner dan belum melewati R1; pembuka unit
Teknologi menyunting kalimat header siap tayang.

Menerbitkan dokumen Arthur tidak mengubah produksi: `main` (`098893b`) tidak
membaca tipe unit, sisi, bab, atau offer. Yang berubah hanya preview cabang R0
sampai R3, dan hanya untuk dokumen berstatus `disetujui`. Studio tertanam di
`/cms`; CORS proyek baru memuat `http://localhost:3333`, jadi Studio di preview
belum bisa dipakai sampai pemilik menambahkan origin-nya.

### Penerbitan pertama (keputusan pemilik, 16 Oktober 2026)

Studio lokal gagal dibuka, dan pemilik meminta agen menyetujui dan menerbitkan
lewat MCP Sanity. Keputusan pemilik: rantai Kuliner lengkap; pembuka unit
Teknologi diganti kalimat header siap tayang; sisi paham teknis ke urutan 1.

- Pembuka unit Teknologi dipotong menjadi kalimat header siap tayang apa adanya:
  “Bot dan workflow yang bekerja dua puluh empat jam untuk bisnis Anda, di sektor
  apa pun.” Kalimat suntingan partner dibuang (Aturan isi 11).
- 14 dokumen disetel `disetujui` (16 Oktober 2026) lalu diterbitkan berurutan:
  unit Teknologi, sisi siap pakai, bab Kuliner, 11 offer.
- Diverifikasi dengan predikat query situs (perspektif published): unit, sisi
  (urutan 0, satu bab layak), bab Kuliner dengan 11 offer, dan dua halaman
  pekerjaan dengan dua paket masing-masing.

Produksi (`main`) tidak berubah. Isi baru terbaca di preview cabang R0 sampai
R3 setelah build berikutnya. Isi lain di unit Teknologi (daftar masalah dan cara
kerja) adalah tulisan partner yang belum melewati R1. Jembatan ke
FNB-01 ditulis saat offer itu ada. Skema `offer` butuh medan
`paket` di R2. Belum ada yang ditulis ke Sanity.

Arahan pemilik untuk sisa R1: agen menulis sendiri dari FULL KONTEKS, termasuk
memilih pekerjaan yang tayang, dan mencatat keputusannya beserta sumbernya.
Placeholder hanya untuk fakta yang memang tidak ada di FULL KONTEKS, seperti
nomor kontak.

### R2 Isi wakil untuk merancang

Bergantung pada R1 dan F0-06.

| Lingkup                                    | Selesai bila                                                                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Fixture bab dan offer (F2-09) dari copy R1 | Satu bab dengan 3, 5, dan 7 kartu terisi bisa dibuka di dataset `ci` (atau sebagai draf di pratinjau), dengan slug berawalan `contoh-` |
| Panjang terpendek dan terpanjang           | Setiap blok punya contoh isi pendek dan panjang untuk diuji layout-nya                                                                 |

### R3 Sistem layout

Bergantung pada R1 dan R2. Dikerjakan dengan isi wakil, tidak dengan
placeholder.

| Lingkup                                                                   | Selesai bila                                                                                                                           |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Satu keluarga kartu: pintu unit, pintu sisi, kartu offer (tinjauan D1–D3) | Tinggi mengikuti isi; tidak ada kartu yatim untuk 3, 5, atau 7; satu tanda gambar kerja per kartu; hover dan fokus sama di semua kartu |
| Ritme seksi dan hierarki huruf (E8.4)                                     | Judul seksi, judul kartu, dan isi punya tiga ukuran yang berbeda jelas; pita kosong 450–800 px hilang (tinjauan D4, E6.3)              |
| Cara membeli di halaman sisi (E6.6)                                       | Butir dicetak sebagai daftar langkah, bukan judul display                                                                              |
| Bukti                                                                     | Tangkapan layar 1440 × 900 dan 390 × 844 setiap template, disetujui pemilik sebelum gerak ditambahkan                                  |

### R4 Arah visual dan navigasi

Bergantung pada P2.

| Lingkup                                 | Selesai bila                                                                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Pelat gambar kerja SVG per unit (F4-05) | Tiga set pelat dengan provenance asli; alt menyebut isi gambar                                                                    |
| Lintasan beranda (E1.2)                 | Lintasan yang di-pin kembali dengan pelat Arthur; jalur reduced motion dan tanpa JavaScript tetap utuh                            |
| WebGL (aturan #14, #15)                 | Dipakai hanya bila pelat juga menjadi material; jalur tanpa WebGL tampak disengaja                                                |
| Navbar (E8.1, E8.2)                     | Desktop dan ponsel dirancang ulang untuk lima tujuan; sisi kanan header punya komposisi, termasuk tempat pengalih bahasa untuk R7 |

**Status 24 Oktober 2026:** tiga arah ditunjukkan sebagai gambar diam di
[`docs/r4-arah-visual/`](./r4-arah-visual/README.md) (PR #46): A Lembar kerja,
B Maket cahaya, C Papan proyek. Pemilik memilih **arah B, Maket cahaya** ("Saya
pilih arah B, Maket cahaya."). R4 dibangun dari arah ini: pelat aksonometri
bercahaya sebagai material WebGL di kanvas root, pelat SVG datar sebagai jalur
tanpa WebGL dan reduced motion, dan navbar arah B. Pada hari yang sama pemilik
meminta usulan memakai ketiganya dengan tupoksi berbeda, lalu menyetujui **B dan
A sebagai dasar utama** dan **mencabut arah C** ("SAYA SETUJU UNTUK MENJADIKAN
ARAH B dan ARAH A sebagai DASARAN UTAMANYA. … CABUT ARAH VISUAL C."): B menjadi
panggung (beranda, pembuka unit, lintasan), A menjadi dokumen (halaman situasi
dan pekerjaan, cara kerja, cara dibayar, kebijakan, versi cetak). Situs tetap
monokrom. R5 menerapkan gaya A di halaman dokumen. Huruf dan pembagian halaman
diserahkan pemilik kepada agen dan diputuskan hari itu: Archivo untuk judul,
Geist untuk teks, Instrument Serif miring untuk kutipan pembeli, Geist Mono
untuk label (Syne pensiun); panggung gelap untuk beranda, pembuka unit, Satu
klien tiga unit, dan Kontak, dokumen terang untuk halaman lainnya. Rinciannya di
`docs/r4-arah-visual/hasil-akhir.html`.

**Nama alamat, 30 Oktober 2026.** Atas permintaan pemilik, tiga halaman tetap
memakai alamat formal satu kata tanpa tanda hubung: `/layanan` (dulu
`/satu-klien-tiga-unit`), `/pembayaran` (dulu `/cara-kami-dibayar`), dan
`/metode` (dulu `/cara-kerja`). Alamat lama menjawab 308. Alamat sisi dan
`/work`, `/journal` tidak diubah, atas keputusan pemilik. Rinciannya di
`docs/RENCANA-KONTEKS-V2.md` dan `lib/i18n/renamed-paths.ts`.

**Pelat gambar kerja, 30 Oktober 2026.** Tiga pelat arah B dipindahkan dari
gambar diam ke situs sebagai data di `lib/plates/` dan digambar sebagai SVG
oleh `vault/blocks/plate`: Konstruksi denah lantai 1 dan potongan A-A,
Teknologi diagram alur pesanan, Peekabo papan kampanye pembukaan. Koordinat
dan label mengikuti `docs/r4-arah-visual/model.py`, jadi gambarnya sama dengan
yang dipilih pemilik; satu label diganti ke bahasa pembaca ("Pass-out" menjadi
"Loket saji"). Alt teks dan keterangan ada di `messages/` (`plates`), termasuk
kalimat "Rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan."
Pelat tampil di pita gelap pembuka setiap halaman unit. Lintasan beranda dan
material WebGL menyusul di PR sendiri.

#### Navbar interaktif: rencana, belum dieksekusi

Pemilik, 30 Oktober 2026: "untuk navbar tulis rencana (untuk nanti di
eksekusi) bahwa Kedepannya akan dibuat Dengan sistem animasi yang interaktif."
Bagian ini adalah rencana itu. Belum ada kode yang dibuat untuknya.

**Isi navbar.** Tiga unit (Konstruksi, Teknologi, Peekabo), lalu Layanan,
Metode kerja, Pembayaran, dan Kontak, karena pemilik meminta halaman tetap
bisa dicapai dari navbar atas, bukan hanya dari footer. Di sisi kanan: Cari
(⌘K), ajakan "Ceritakan masalahnya", dan tempat pengalih ID/EN untuk R7.

**Gerak yang direncanakan.**

| Momen               | Perilaku                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Penanda aktif       | Satu penanda bergeser mengikuti tautan yang disorot dan kembali ke halaman aktif               |
| Ikut latar          | Navbar berganti tema saat melewati bagian gelap dan terang halaman yang sama                   |
| Sembunyi dan muncul | Navbar menyingkir saat pembaca menggulir turun, kembali saat menggulir naik                    |
| Lembar menu ponsel  | Kata rute masuk berurutan; tombol Tutup muat di kolomnya (E8.5); Esc dan ketuk di luar menutup |
| Pratinjau unit      | Di desktop, menyorot unit menampilkan pelat datarnya kecil di bawah tautan                     |

**Batas yang tidak berubah.** Hanya `transform` dan `opacity` yang dianimasikan
(aturan #4). Di bawah `prefers-reduced-motion` tidak ada gerak dan semua tautan
tampil penuh (#5). Pergantian tema serta gerak menyingkir dan kembali memakai
ScrollTrigger di RAF bersama, tanpa loop kedua (#6), dan dibersihkan saat
unmount (#7). Menu tetap `popover`, jadi tetap bekerja tanpa JavaScript.
`aria-current`, fokus yang terlihat, dan kontras di kedua tema diuji dengan axe
dan `contrast-situ` (#11, #20).

**Urutan kerja.** Pertama gambar diam dan satu rekaman gerak untuk dipilih
pemilik. Lalu satu PR sesudah tema per halaman (#48) dan huruf (#50) masuk,
diuji `phone-menu`, `site-reach`, `interaction-grammar`, `motion`, dan e2e baru
untuk penanda dan pergantian tema. Pemilik melihatnya di 1440 × 900 dan
390 × 844 sebelum merge.

### R5 Bangun ulang halaman

Bergantung pada R3 dan R4. Satu PR per kelompok halaman: beranda; unit dan
sisi; bab dan offer; cara kerja, satu klien tiga unit, kontak, jaringan,
kebijakan.

| Selesai bila                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------- |
| Setiap halaman memakai copy R1, kartu dan ritme R3, visual R4                                                             |
| Tidak ada halaman yang ditautkan dari navigasi menjawab soft-404                                                          |
| Route-sweep, no-javascript, dan reduced motion hijau di CI untuk setiap rute, termasuk bab dan offer dari fixture (F3-12) |

### R6 Gerak

Bergantung pada R5. Momen `Sistem animasi` dipasang di atas layout yang
sudah disetujui: `situation-leader`, `side-sheet-swap`, `bab-formwork`,
`bab-sift`, `offer-fixings`, `network-money-flow`, `promise-stamp`, dan
`set-depth`. Setiap momen dilihat pemilik di 1440 × 900 dan 390 × 844
sebelum merge. Dialek per unit (F4-02) menyusul sesudahnya.

### R7 Dwibahasa

Bergantung pada R1 (glosarium) dan persetujuan copy Indonesia. Lingkupnya
aturan suara Inggris, copy Inggris untuk halaman yang copy Indonesianya sudah
disetujui, pengalih bahasa kembali, dan K2 diubah tertulis. Selesai bila
setiap halaman `/en` tayang seluruhnya dalam bahasa Inggris, tanpa campuran.

## Nasib PR #18

PR #18 memuat dua jenis pekerjaan. Fondasi F2 (model Sanity, Studio, kendali
terbit, penjaga isi) dinilai baik di tinjauan bagian G. Template F3 yang
akan direvisi.

Usulan: PR #18 **tidak di-merge utuh**. Fondasi F1-05 sampai F2-11 dipisah
ke PR sendiri dan ditinjau lebih dulu, karena revisi F3 berdiri di atasnya.
Template F3 dibawa ke branch revisi sebagai titik awal, bukan sebagai hasil
yang disetujui. Pemisahan ini butuh persetujuan pemilik karena mengubah
riwayat kerja partner.

## Urutan ringkas

```
P4 ─► R0 ────────────────────────────────────────────┐
P1 + P3 ─► R1 ─► R2 ─► R3 ─┐                         │
P2 ───────────────► R4 ────┴─► R5 ─► R6 ─► R7 (K2)   │
F0-06 (pemilik) ─────► R2                            │
PR #18 dipisah ──────────────────────────────────────┘
```

R0 dan R1 bisa berjalan bersamaan. R4 bisa dimulai begitu P2 diputuskan,
sejajar dengan R1 sampai R3.
