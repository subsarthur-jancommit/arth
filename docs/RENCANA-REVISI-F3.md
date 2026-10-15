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
Peekabo terdaftar. Menunggu persetujuan pemilik.

Seluruh katalog: 652 dari 688 offer siap diturunkan; 36 ditahan menunggu
keputusan pemilik atau pendaftaran program mitra. Skema `offer` butuh medan
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
