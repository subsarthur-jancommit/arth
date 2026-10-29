# Rencana konteks V2: isi yang benar, relasi data yang koheren

Ditulis 16 Oktober 2026, sesudah Fase 1 selesai. Status: **usulan, menunggu
persetujuan pemilik**. Rencana ini menggantikan bagian isi di
`docs/RENCANA-KONTEKS-TAYANG.md` (fase 2 sampai 6). Animasi, visual R4,
bahasa Inggris, dan formulir **ditunda** atas perintah pemilik.

Sumber yang dibaca ulang untuk rencana ini, semuanya di `D:\ARTH\FULL KONTEKS`:
Master brief, header dan rincian tiga unit (Peta & aturan main, Sisi A, Sisi B),
seluruh USER KNOWLEDGE MAP (Kerangka pemandu, Pola pikir Arthur, Peta website,
Aturan isi, Suara dan gaya, Contoh kalibrasi, Alur kerja dan uji mutu), dan
IMPLEMENTATION PLAN (Rencana implementasi, Peta rute dan komponen, Model isi
Sanity, Daftar pendek offer, Backlog).

---

## 0. Posisi sekarang (diukur, bukan diperkirakan)

| Yang diukur                     | Hasil                                                        | Cara ukur                                                     |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| Merge `main`                    | `0b79bcc`, tumpukan #23 → #22 → #21 → #18 digabung berurutan | `ci` dan `e2e` hijau di setiap head, preview ditinjau pemilik |
| Deployment produksi             | READY untuk `0b79bcc`                                        | `gh api .../deployments` dan stempel versi di halaman         |
| Uji asap                        | `/` dan `/en` ke `/id`; halaman utama 200; revalidate 401    | Perintah §3 langkah 9 PROSEDUR-KERJA                          |
| Offer tampil di produksi        | 11 (bab Kuliner), dua halaman pekerjaan dengan dua paket     | `lib/scripts/measure-rollout.ts`, lalu dicek per halaman      |
| Dokumen Arthur terbit di Sanity | 1 unit, 1 sisi, 1 bab, 11 offer                              | API publik, perspektif published                              |

### Koreksi atas laporan saya sebelumnya

Pemilik benar bahwa progres ditulis berlebihan. Tiga hal yang saya koreksi:

1. **“Copy offer siap 652 dari 688” menyesatkan.** Angka itu menghitung baris
   katalog yang lolos impor otomatis, bukan halaman yang sudah ditulis manusiawi
   dan disetujui. Isi yang benar-benar siap tayang hari ini hanya bab Kuliner.
   Ukuran ini diganti di V0 (bagian 9).
2. **Situs menayangkan katalog, padahal sumbernya meminta pilihan.** Peta website
   menulis: website menayangkan pilihan, 3 sampai 7 offer per bab, yang disetujui
   pemilik. Bab Kuliner menampilkan 11 offer. Rencana lama memakai “offer tampil
   dari 652” sebagai tujuan; tujuan itu salah dan dicabut.
3. **Halaman unit dan sisi ditulis ulang dari ringkasan, bukan dari teks siap
   tayang.** Aturan isi 11 melarang mengubah kata header siap tayang. Halaman
   Konstruksi hari ini memotong dan memparafrasekan header aslinya.

### Cacat yang terlihat di produksi hari ini

Dibaca dari HTML produksi `0b79bcc`, 16 Oktober 2026.

| Halaman                        | Cacat                                                                                                                                                                                                    | Asal                                                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `/id/konstruksi`               | Header siap tayang dipotong dan diubah katanya; empat paragraf “Kami mengisi celah …” tidak ada sama sekali                                                                                              | `lib/content/unit-fallback.ts`; skema `unit` tidak punya tempat untuk paragraf header; halaman unit tidak punya blok pilar |
| Semua halaman unit             | Label editor tampil ke pembaca: “2 sisi pembaca”, “Masalah yang dibaca”, “Masalah datang sebelum daftar layanan.”                                                                                        | `messages/id.json` (`unit.sideCount`, `unit.problemsEyebrow`, `unit.problemsTitle`)                                        |
| `/id/konstruksi/pelaku-proyek` | Tanda pisah panjang di setiap langkah (Suara dan gaya aturan 9); seluruh kalimat langkah masuk ke judul langkah dan isi langkah kosong; label “Cara membeli atau alur kerja”; **tidak ada satu pun bab** | `lib/content/side-fallback.ts` (14 tanda pisah); `messages/id.json` (`side.*`); belum ada bab Konstruksi di Sanity         |
| `/id/peekabo/pemilik-usaha`    | Istilah Inggris tanpa alasan (“Partial”, “Full”); tidak ada bab                                                                                                                                          | `lib/content/side-fallback.ts`                                                                                             |
| Beranda                        | Hero dan susunan sudah dipulihkan (Fase 1), tetapi bagian “Bagaimana kami bekerja” memakai pernyataan payung, dan grid karya masih fixture                                                               | Keputusan Fase 1; bukan isi Arthur                                                                                         |

Koreksi 16 Oktober: teks yang semula saya catat “tampil dua kali” ternyata salinan untuk pembaca layar (`sr-only`) dan lapisan animasi (`aria-hidden`); pembaca melihatnya sekali. Itu bukan cacat dan tidak diubah.

Akar masalahnya satu: **isi editorial masih tinggal di kode** (`unit-fallback.ts`,
`side-fallback.ts`, `home-fallback.ts`, `messages/*.json`) dan **skema Sanity
belum punya tempat untuk bentuk asli sumbernya**. Selama dua hal itu benar,
setiap revisi isi berarti PR kode, dan setiap PR kode bisa merusak isi.

---

## 1. Tujuan dan batas

**Tujuan akhir** (perintah pemilik, 16 Oktober 2026):

1. Konteks website setia pada acuan, ditulis dengan suara yang manusiawi.
2. Sanity menjadi satu-satunya tempat isi editorial, dan website bisa diperbarui
   atau diganti isinya dengan cermat tanpa PR kode.

**Ukuran selesai V2:** halaman yang dibuka pembaca menjelaskan siapa Arthur, apa
yang dikerjakan tiap unit, dan pekerjaan apa yang cocok untuk situasinya; setiap
kalimat bisa ditelusuri ke sumbernya; pemilik bisa mengganti satu kalimat di
Studio dan melihatnya tayang tanpa menyentuh repo.

**Tidak dikerjakan di V2:** animasi baru, pelat gambar kerja, WebGL baru, bahasa
Inggris, formulir, domain akhir. Gerak yang ada dibiarkan; tidak ada momen baru.

---

## 2. Prinsip isi (diambil dari sumber, bukan aturan baru)

| #   | Prinsip                                                                                                                                        | Sumber                                       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| P1  | Halaman dibuka dari situasi pembaca, lalu offer yang menjawabnya, lalu langkah pertama yang ringan                                             | Pola pikir Arthur, enam pegangan             |
| P2  | Website menayangkan **pilihan**, bukan katalog: 3 sampai 7 offer per bab, disetujui pemilik                                                    | Peta website, Memilih offer yang tayang      |
| P3  | Header siap tayang (payung dan tiga unit, termasuk Versi ringkas dan Judul Sisi) dipakai **kata demi kata**; boleh dipotong utuh, tidak diubah | Aturan isi 11; Kerangka pemandu              |
| P4  | Kutipan “Yang biasa mereka katakan” (55 bab) adalah pembuka halaman bab, apa adanya                                                            | Pola pikir Arthur; Peta website              |
| P5  | Satu halaman, satu tugas; blok yang tidak melayani tugas itu dibuang                                                                           | Peta website, Template per jenis halaman     |
| P6  | Yang belum diketahui **tidak tampil**. Pemilik meminta tanpa placeholder di layar; celahnya dicatat di hasil serah, bukan di halaman           | Instruksi pemilik; Aturan isi 12 disesuaikan |
| P7  | Kode, tanda †/‡, dan catatan internal tidak pernah sampai ke HTML maupun ke dokumen yang terbit                                                | Peta website; Model isi Sanity               |
| P8  | Teks antarmuka (tombol, navigasi) di `messages`; teks editorial hanya di Sanity                                                                | Rencana implementasi, Rencana isi dan CMS    |

---

## 3. Berapa halaman yang dibangun

Angka dari master brief: 55 bab (Konstruksi 19, Teknologi 23, Peekabo 13).

| Jenis halaman             | Rute                              | Jumlah                                  | Layout             | Sumber isi utama                                     |
| ------------------------- | --------------------------------- | --------------------------------------- | ------------------ | ---------------------------------------------------- |
| Beranda                   | `/id`                             | 1                                       | Unik               | Header Arthur; Cara memakai (14 situasi)             |
| Unit                      | `/id/{unit}`                      | 3                                       | Template unit      | Header unit; Peta pembeli; Footer                    |
| Sisi                      | `/id/{unit}/{sisi}`               | 5 (+ jaringan di bawah)                 | Template sisi      | Judul Sisi; Cara membeli/Alur kerja; daftar bab      |
| Jaringan (Peekabo Sisi B) | `/id/peekabo/jaringan`            | 1                                       | Unik               | Sisi B Agency, Cara bergabung; aturan jaringan       |
| Bab                       | `/id/{unit}/{sisi}/{bab}`         | 55 (52 bab + 3 jalur jaringan)          | Template bab       | Kutipan, pembeli, 3 sampai 7 offer terpilih          |
| Pekerjaan (offer)         | `/id/{unit}/{sisi}/{bab}/{offer}` | 1 per bab sebagai awal, paling banyak 2 | Template pekerjaan | Baris offer; alur kerja sisi; aturan unit            |
| Layanan terpadu           | `/id/layanan-terpadu`             | 1 (empat rangkaian di dalamnya)         | Unik               | Rangkaian tiga unit                                  |
| Metode kerja              | `/id/metode-kerja`                | 1                                       | Unik               | Header Arthur, Cara kami bekerja; pembeda yang boleh |
| Ketentuan pembayaran      | `/id/ketentuan-pembayaran`        | 1 (sudah disetujui sebagai copy, R1)    | Template baca      | `docs/R1-SERAH-CARA-KAMI-DIBAYAR.md`                 |
| Kontak                    | `/id/kontak`                      | 1                                       | Unik               | siteSettings                                         |
| Kebijakan                 | `/id/kebijakan`                   | 1 (tiga bagian)                         | Template baca      | Aturan main gabungan 4, 6, 9                         |
| 404 / 410                 | -                                 | 1 template                              | Unik               | messages                                             |

**Total halaman isi: 70** (1 + 3 + 5 + 1 + 55 + 1 + 1 + 1 + 1 + 1), ditambah
**55 sampai 110 halaman pekerjaan** yang dibuat bertahap; dua di antaranya sudah
terbit (Kuliner). Kartu offer di bab: paling banyak 55 × 7 = 385; perkiraan
realistis sekitar 275 (rata-rata 5 per bab).

**Nama dan alamat formal, 2026-10-30.** Atas permintaan pemilik, tiga halaman tetap memakai nama formal: `satu-klien-tiga-unit` menjadi `layanan-terpadu` (Layanan terpadu), `cara-kami-dibayar` menjadi `ketentuan-pembayaran` (Ketentuan pembayaran), dan `cara-kerja` menjadi `metode-kerja` (Metode kerja). Alamat lama, juga `/studio`, menjawab 308 ke alamat baru (`lib/i18n/renamed-paths.ts`), dan keempat halaman tetap ada di indeks footer. Slug Sanity halaman pembayaran tetap `cara-kami-dibayar`; judul yang tersimpan di Sanity belum diubah.

---

## 4. Alur pembaca dan routing

### 4.1 Empat pintu masuk

```
A. Dari beranda, lewat situasi (jalan tercepat)
   Beranda → "Pilih situasi Anda" (14 kalimat) → halaman bab → kartu offer
           → [halaman pekerjaan, bila ada] → Kontak (dari=bab&pekerjaan=offer)

B. Dari beranda, lewat unit (pembaca yang menjelajah)
   Beranda → pintu unit → Unit → pintu sisi → Sisi → daftar bab → Bab → …

C. Dari mesin pencari atau tautan langsung (paling sering kelak)
   Bab atau halaman pekerjaan → remah roti (Unit / Sisi / Bab) → naik satu tingkat

D. Calon penjual (Peekabo Sisi B)
   Beranda atau Peekabo → Jaringan → jalur (perujuk, anggota, kreator) → daftar
```

### 4.2 Aturan perpindahan antarhalaman

| Dari      | Ke mana pembaca bisa pergi                                                                                                       | Yang tidak boleh ada                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Beranda   | 3 unit, 14 situasi (langsung ke bab), Satu klien tiga unit, Cara kerja, Kontak                                                   | Daftar layanan; angka karangan            |
| Unit      | 2 sisi (urutan dari kolom Pintu masuk: Teknologi membuka Sisi B lebih dulu), contoh pekerjaan per jenis, unit berikutnya, Kontak | Bab yang belum terbit sebagai tautan mati |
| Sisi      | Semua bab sisi itu sebagai situasi; sisi lain unit yang sama; langkah pertama sisi; kembali ke unit                              | Kode modul atau lapis                     |
| Bab       | 3 sampai 7 kartu; halaman pekerjaan bila ada; jembatan ke unit lain (maks. 2); bab sebelum/sesudah di sisi yang sama; Kontak     | Lebih dari 7 kartu; jembatan di kartu     |
| Pekerjaan | Kontak dengan konteks; kembali ke bab; jembatan (maks. 1); pekerjaan lain di bab yang sama (maks. 3)                             | Harga; janji hasil di tangan pihak lain   |

**Bab tanpa halaman.** Selama bab belum terbit, kartunya di halaman sisi tetap
tampil sebagai situasi (nama bab, kutipan pembeli, satu kalimat) dengan satu
tautan “Ceritakan situasi ini” ke Kontak. Ini perluasan keputusan K-B ke tingkat
bab: tidak ada tautan ke halaman kosong, dan halaman sisi tetap informatif sejak
hari pertama, karena kutipannya teks sumber apa adanya.

**Remah roti** di setiap halaman di bawah unit. **Navigasi header** tetap: tiga
unit, Cara kami bekerja, Kontak. **Palet perintah dan pencarian** hanya memuat
halaman yang terbit.

### 4.3 Satu ajakan per halaman, berbeda per tingkat

| Halaman              | Ajakan (sumber)                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------ |
| Beranda              | “Ceritakan masalahnya. Kami tentukan unit mana yang bekerja lebih dulu.” (Header Arthur)   |
| Unit Konstruksi      | “Ceritakan bangunan atau proyeknya. Kami tentukan celah mana yang kami isi.” (Header unit) |
| Unit Teknologi       | “Sampaikan masalahnya. Kami tentukan bot, workflow, atau pasar barunya.” (Header unit)     |
| Unit Peekabo         | “Ceritakan pasar yang ingin Anda rebut. Kami tentukan lapis mana yang bekerja lebih dulu.” |
| Sisi, bab, pekerjaan | Langkah pertama sisi itu (tabel Pintu masuk ringan)                                        |
| Jaringan             | Daftar gratis sebagai perujuk, **ditutup** sampai kartu komisi pertama ada (keputusan 6)   |

Semua ajakan menuju `/id/kontak?dari=<slug>&pekerjaan=<slug>`; tidak ada data
pribadi di URL.

---

## 5. Layout: unik dan berulang

Layout **unik** dibangun sekali untuk halaman yang tugasnya khas. Layout
**berulang** adalah template yang diisi query Sanity, dipakai puluhan kali, dan
tidak boleh bergantung pada panjang isi tertentu.

### 5.1 Layout unik

| Halaman               | Susunan blok (berurutan)                                                                                                                                                                          | Catatan layout                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Beranda               | Hero payung (judul, subjudul, ajakan) · tiga pintu unit (judul unit + versi satu kalimat) · Pilih situasi Anda (14) · Satu klien, tiga unit (1 rangkaian) · Cara kami bekerja (3 janji) · Ajakan  | Komposisi `main` dipertahankan sampai R4; grid karya fixture **dicabut** dari beranda di V1 karena isinya bukan isi Arthur (Aturan isi 13) |
| Unit                  | Hero unit (header siap tayang) · empat pilar header (“Kami mengisi celah.” …) · dua pintu sisi · masalah yang dijawab · contoh pekerjaan per jenis · cara kami bekerja (paragraf header) · ajakan | Satu template, tiga isi; pilar tampil sebagai daftar bernomor yang tenang                                                                  |
| Jaringan              | Judul Sisi B · cara kerja (Cara bergabung) · dari mana bagian Anda berasal · yang tidak ada · syarat · tiga jalur · ajakan tertutup                                                               | Kalimat wajib jaringan selalu tampil utuh                                                                                                  |
| Satu klien, tiga unit | Pengantar · empat rangkaian, masing-masing: situasi, tiga langkah (Konstruksi, Teknologi, Peekabo) · keterangan “rangkaian yang mungkin”                                                          | Rangkaian ditulis sebagai cara kerja yang mungkin, bukan proyek yang sudah ada                                                             |
| Cara kami bekerja     | Lima janji tertulis · hak milik klien · komisi diungkapkan · yang tidak kami jual · wilayah                                                                                                       | Tanpa testimoni, tanpa angka                                                                                                               |
| Kontak                | Pernyataan pemilik (bila ada) · wilayah · kanal · teks persetujuan data                                                                                                                           | Kanal menunggu K5                                                                                                                          |

### 5.2 Layout berulang (template yang diisi query)

**Template sisi** (5 halaman). Query: `side` per kunci + semua `bab` sisi itu.

| Blok                      | Medan                                   | Batas dan aturan kosong                                                        |
| ------------------------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| Judul sisi                | `side.judul` (Judul Sisi, siap tayang)  | Wajib                                                                          |
| Untuk siapa               | `side.pembeli[]`                        | 3 sampai 6 nama pembeli; dari Peta pembeli                                     |
| Cara membeli / alur kerja | `side.caraMembeli[]: {nama, cocokBila}` | Dua kolom, tanpa tanda pisah; 4 sampai 7 butir                                 |
| Situasi (daftar bab)      | Semua `bab` sisi itu, urut `bab.urutan` | Bab terbit: tautan ke bab. Bab belum terbit: kutipan + “Ceritakan situasi ini” |
| Langkah pertama           | `side.langkahPertama`                   | Wajib                                                                          |
| Sisi lain                 | `side` lain di unit yang sama           | Satu tautan                                                                    |

**Template bab** (55 halaman). Query: `bab` per slug di sisi dan unit + offer
`disetujui` di bab itu, `[0...7]`, urut `offer.urutan`.

| Blok                 | Medan                                                            | Batas                                                                |
| -------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| Kutipan pembeli      | `bab.kutipan`                                                    | Apa adanya dari sumber                                               |
| Nama bab dan pembeli | `bab.nama`, `bab.pembeli`                                        | Nama untuk pembaca (Peta website, Nama bab untuk pembaca)            |
| Situasi              | `bab.situasi`                                                    | 2 sampai 3 kalimat                                                   |
| Kartu pekerjaan      | `offer.judul`, `offer.dampak`, `offer.untukSiapa`, `offer.jenis` | 3 sampai 7; dikelompokkan per label jenis bila lebih dari satu jenis |
| Batas dan syarat     | `bab.batas`                                                      | Wajib bila ada offer †; kalimat wajib dari Aturan isi                |
| Jembatan             | `bab.jembatan[]`                                                 | Maks. 2 kalimat pernyataan                                           |
| Ajakan               | `bab.ajakan` atau `side.langkahPertama`                          | -                                                                    |

**Template pekerjaan** (bertahap). Delapan blok Peta website, dalam bentuk dua
paket yang sudah disetujui untuk Teknologi; Konstruksi dan Peekabo memakai
tingkat dari alur kerjanya sendiri (survei → estimasi → kerja → serah terima;
anak tangga 1 → produksi → kampanye).

**Komponen berulang lain:** kartu situasi (beranda dan sisi), kartu pekerjaan,
pintu unit, pintu sisi, blok jembatan, blok ajakan, blok tanya jawab (maks. 5).
Semua grid memakai `minmax(0, 1fr)` (aturan #12) dan tinggi kartu mengikuti isi.

---

## 6. Model data Sanity V2

### 6.1 Peta relasi

```
siteSettings (1)
  ├─ situasi[] ──weak──▶ bab        (14 situasi Cara memakai; menggantikan string unit/sisi)
  └─ rangkaianPilihan ──weak──▶ sequence

unit (3) ◀──strong── side (6) ◀──strong── bab (55) ◀──strong── offer (≤688 draf; terbit ≈275)
  └─ contohOffer[] ──weak──▶ offer        bab.jembatan[] ──weak──▶ offer (unit lain)
                                          offer.jembatan ──weak──▶ offer (unit lain)
sequence (4) └─ langkah[] {unit, offer[] ──weak──▶ offer}
faq (bebas)  └─ halaman ──weak──▶ unit | side | bab | offer   (menggantikan string path)
howWeWork (1), page (kebijakan)
```

Referensi kuat hanya dari anak ke induk, ditulis lemah dengan
`_strengthenOnPublish` (sudah berlaku). Urutan selalu di anak (`urutan`), tidak
di daftar referensi induk.

### 6.2 Perubahan skema

| Tipe           | Tambah atau ubah                                                                                                                                      | Alasan                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `siteSettings` | `header: {judul, subjudul, pembuka, pilar[]: {lead, isi}, caraKami, ajakan}`; `situasi[]: {teks, bab (ref)}`; `ringkas: {satuKalimat, tigaKalimat}`   | Header Arthur punya lima paragraf berlabel; sekarang tidak muat |
| `unit`         | `header` dengan bentuk yang sama; `ringkas`; `judulSisi: {a, b}` dihapus dari kode dan pindah ke `side.judul`; `masalah[]` tetap; `caraKerja[]` tetap | Empat pilar Konstruksi dan Teknologi hilang di produksi         |
| `side`         | `judul`; `pembeli[]`; `caraMembeli[]: {nama, cocokBila}` menggantikan daftar teks bertanda pisah                                                      | Tanda pisah dan isi langkah kosong di produksi                  |
| `bab`          | `nama` (nama untuk pembaca); `pembeli`; `pasar` (hanya Konstruksi A, untuk penyaring)                                                                 | Nama bab Agency berbeda dari katalog                            |
| `offer`        | Tidak ada medan baru; `pintuMasuk` dan `halamanSendiri` tetap (K-B)                                                                                   | Sudah cukup                                                     |
| `faq`          | `halaman` menjadi referensi lemah                                                                                                                     | Path string putus saat slug berubah                             |

Setiap perubahan medan membawa **rencana tulis §6**: data lama dipindahkan
sebelum PR skema digabung. Medan lama tidak dihapus sebelum migrasi terbukti.

### 6.3 Validasi yang menjaga koherensi

| Aturan                                                                                             | Tempat                                  |
| -------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `bab.sisi` harus sisi yang sah untuk unit itu; `side.kunci` harus ada di daftar unitnya            | Validasi Studio + uji                   |
| Slug offer unik di dalam satu bab; slug bab unik di dalam satu sisi                                | Validasi Studio                         |
| Bab hanya bisa disetujui bila punya 3 sampai 7 offer berstatus `dipilih` atau `disetujui`          | Aksi Setujui                            |
| Teks memuat `[PERLU`, label isi contoh, tanda pisah sebagai jeda, tanda seru, kode katalog → error | Validasi Studio (gerbang gaya otomatis) |
| Kalimat di atas 25 kata, judul di atas 9 kata, frasa terlarang → peringatan                        | Validasi Studio                         |
| Referensi ke dokumen yang belum terbit tidak dirender                                              | Query (sudah berlaku)                   |

### 6.4 Pemeriksa grafik isi (alat baru)

`lib/scripts/check-content-graph.ts`, hanya membaca, dijalankan sebelum dan
sesudah setiap “ok tulis”:

- dokumen yatim (bab tanpa sisi terbit, offer tanpa bab terbit);
- bab terbit dengan kurang dari 3 atau lebih dari 7 offer;
- situasi beranda yang menunjuk bab belum terbit;
- jembatan ke offer yang belum terbit;
- teks yang gagal gerbang gaya otomatis;
- selisih antara daftar pendek yang disetujui dan status di Sanity.

Hasilnya satu tabel Markdown, dilampirkan di setiap laporan tulis.

---

## 7. CMS yang bisa diperbarui dengan cermat

| Kebutuhan pemilik               | Cara kerjanya                                                                                                  | Status sekarang                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Mengganti satu kalimat tanpa PR | Isi editorial dipindah dari kode ke Sanity (V1); `messages` hanya teks tombol                                  | Belum: unit dan sisi masih dari kode                |
| Melihat draf sebelum terbit     | Pratinjau Presentation per tipe (F2-10)                                                                        | Sebagian                                            |
| Tidak salah terbit              | Setujui lalu Terbitkan, hanya akun pemilik; validasi gerbang gaya                                              | Setujui dan Terbitkan sudah ada                     |
| Perubahan tampil tanpa deploy   | Webhook revalidasi Sanity ke `/api/revalidate` (K-D); diuji dengan satu terbit dan dua kali muat ulang (F0-02) | Rahasia terpasang (401); webhook belum diverifikasi |
| Membatalkan perubahan           | Riwayat dokumen Sanity (Restore) dan dokumen terbit tidak ditimpa skrip                                        | Bawaan Sanity                                       |
| Tahu apa yang berubah           | Laporan pemeriksa grafik isi sebelum dan sesudah                                                               | Baru (V0)                                           |
| Panduan untuk pemilik           | `docs/PANDUAN-STUDIO.md`: urutan terbit unit, sisi, bab, offer; cara mengganti isi; cara mundur                | Perlu ditulis ulang                                 |

---

## 8. Rencana copywriting

### 8.1 Cara menulis setiap halaman

Alur tetap enam langkah Kerangka pemandu, dengan dua perubahan dari pemilik:

1. Agen menulis dari FULL KONTEKS sendiri; **tidak ada placeholder di halaman**.
   Yang benar-benar butuh fakta pemilik (harga, kanal, nama mitra, rekam jejak)
   dihilangkan dari halaman dan dicatat di hasil serah.
2. Lembar rencana dan hasil serah **dipendekkan**: satu halaman serah per
   halaman web, berisi teks, jejak sumber per blok, dan hasil dua gerbang.
   Tidak ada laporan progres panjang.

**Uji manusiawi** (selain gerbang gaya): dibacakan keras, apakah pemilik akan
mengucapkannya di meja yang sama kepada calon klien. Kalimat yang gagal ditulis
ulang dengan benda yang bisa dipegang: berkas, tukang, termin, pesanan, host.

### 8.2 Peta sumber per blok

| Blok                      | Diambil dari                                              | Boleh ditulis ulang?                                                                                     |
| ------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Hero dan pilar beranda    | Header Arthur (siap tayang)                               | Tidak; hanya dipotong utuh                                                                               |
| Hero dan pilar unit       | Header project unit (siap tayang)                         | Tidak; hanya dipotong utuh. Kalimat bot trading di header Teknologi dipotong sampai posisinya diputuskan |
| Pintu unit di beranda     | Versi ringkas satu kalimat                                | Tidak                                                                                                    |
| Judul sisi                | Judul Sisi A/B di Versi ringkas                           | Tidak                                                                                                    |
| Untuk siapa (sisi)        | Peta pembeli kolom Pembeli                                | Ya, sebagai orang                                                                                        |
| Cara membeli / alur kerja | Cara membeli, Alur kerja, Lima cara mulai, Cara bergabung | Ya, bentuk dua kolom                                                                                     |
| Kutipan bab               | “Yang biasa mereka katakan”                               | Tidak                                                                                                    |
| Situasi bab               | Kutipan + Pembeli + Peta pembeli kolom “Yang mereka cari” | Ya, 2 sampai 3 kalimat                                                                                   |
| Kartu pekerjaan           | Baris offer: judul, dampak, pembeli, jenis                | Ya, setelah uji Aturan isi 3                                                                             |
| Batas                     | Peta & aturan main unit; kalimat wajib                    | Inti tetap, susunan boleh                                                                                |
| Jembatan                  | Jembatan antarunit dan rangkaian                          | Ya, satu kalimat pernyataan                                                                              |

### 8.3 Contoh arah untuk unit Konstruksi (yang dikeluhkan pemilik)

Hari ini halaman unit menulis ringkasan buatan sendiri. Versi V2 memakai header
asli, utuh:

- **Judul:** Isi celahnya. Bangun sampai jadi. Rawat sesudahnya.
- **Subjudul:** Konstruksi sipil dari hulu ke hilir untuk Subang, Purwakarta, dan Bandung.
- **Pembuka:** “Proyek konstruksi jarang tersendat karena tidak ada yang mampu
  membangun. Proyek tersendat di celah-celah …” (paragraf asli).
- **Empat pilar:** Kami mengisi celah · Kami membangun sampai jadi · Kami membuat
  bangunan bekerja lebih produktif · Kami merawat sesudahnya (paragraf asli).
- **Wilayah dan cara kami bekerja:** dua paragraf asli terakhir.
- **Pintu sisi:** “Bagian mana dari proyek Anda yang belum ada yang mengerjakan?
  Kami isi.” dan “Ceritakan bangunan yang Anda inginkan. Kami urus dari hulu ke hilir.”

Halaman sisi Pemilik bangunan lalu menampilkan tujuh situasi dari kutipan asli,
misalnya Rumah tinggal: “Saya takut anggaran membengkak dan pekerjaan tidak
diawasi.” Setiap situasi menjadi pintu ke 3 sampai 7 pekerjaan yang dipilih,
dengan dampak yang ditulis sebagai pekerjaan, bukan hasil: RMH-10 menjadi
“Anggaran dihitung dari gambar dan harga pasar sebelum Anda memutuskan.”

### 8.4 Urutan penulisan

Dari yang paling dekat ke pola Kuliner yang sudah disetujui, ke yang paling
banyak aturannya.

| Gelombang | Isi                                                                             | Halaman | Alasan urutan                                                          |
| --------- | ------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| W1        | Beranda, tiga unit, lima sisi (header siap tayang + daftar bab sebagai situasi) | 9       | Bingkai situs; hampir seluruhnya teks siap tayang, risiko isi terendah |
| W2        | Konstruksi Sisi B: RMH, ITR, FNB, STD, HOS, RWT, KOM                            | 7 bab   | Keluhan pemilik; pembeli B2C paling dekat dengan pola Kuliner          |
| W3        | Konstruksi Sisi A: 12 bab, urutan menunggu keputusan pembeli B2B                | 12 bab  | Paling banyak offer † dan kalimat wajib tender/modal                   |
| W4        | Teknologi Sisi B, 16 bab sisanya                                                | 16 bab  | Pola sudah teruji di Kuliner                                           |
| W5        | Peekabo Sisi A: 10 bab, dibuka lima masalah marketshare                         | 10 bab  | Banyak nama platform; aturan status mitra                              |
| W6        | Teknologi Sisi A: 6 bab                                                         | 6 bab   | Pembaca teknis; bahasa paling berbeda                                  |
| W7        | Peekabo jaringan + tiga jalur, Satu klien tiga unit, Cara kerja, Kebijakan      | 6       | Paling banyak kalimat wajib; sebagian menunggu keputusan               |

Halaman pekerjaan (offer) ditulis **setelah** babnya terbit, mulai dari offer
pintu masuk tiap bab.

---

## 9. Fase eksekusi

Setiap fase berakhir di PR dengan `ci` dan `e2e` hijau dan tinjauan preview oleh
pemilik (aturan 22 sampai 24). Setiap tulisan ke Sanity menunggu “ok tulis” yang
menyebut isinya.

| Fase   | Isi                                                                                                                                                                                                                               | PR / tulis                                            | Selesai bila                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **V0** | Skema V2 (bagian 6.2) dengan migrasi; validasi gerbang gaya otomatis; pemeriksa grafik isi; `measure-rollout` diganti ukuran jujur; label editor di `messages` diganti; tanda pisah dan isi langkah kosong di template diperbaiki | 1 PR kode; 1 “ok tulis” migrasi                       | Studio memuat medan baru; pemeriksa grafik isi bersih; tidak ada label editor di HTML produksi |
| **V1** | W1: beranda, tiga unit, lima sisi ditulis ke Sanity; grid karya fixture dicabut dari beranda; fallback unit dan sisi di kode hanya memuat teks siap tayang apa adanya                                                             | 1 PR kode; 1 “ok tulis” per unit                      | Pemilik menyetujui dan menerbitkan; halaman unit menampilkan header asli utuh                  |
| **V2** | Daftar pendek 55 bab: usulan 3 sampai 7 offer per bab, satu sisi per serahan, di `docs/DAFTAR-PENDEK.md`                                                                                                                          | Dokumen; 1 “ok tulis” per sisi untuk status           | Setiap bab punya keputusan pemilik                                                             |
| **V3** | Bab per gelombang W2 sampai W6                                                                                                                                                                                                    | 1 “ok tulis” per sisi; PR hanya bila template berubah | Bab terbit menampilkan 3 sampai 7 kartu; pemeriksa grafik isi bersih                           |
| **V4** | Halaman pekerjaan untuk offer pintu masuk tiap bab                                                                                                                                                                                | 1 “ok tulis” per sisi                                 | Setiap bab terbit punya satu halaman pekerjaan                                                 |
| **V5** | W7: jaringan, rangkaian, cara kerja, kebijakan, tanya jawab                                                                                                                                                                       | 1 PR bila template; “ok tulis” per halaman            | Kalimat wajib lengkap; kebijakan ditandai untuk tinjauan ahli hukum                            |
| **V6** | Fallback editorial dicabut dari kode; dummy siap dihapus (F5-04) atas izin hapus terpisah                                                                                                                                         | 1 PR                                                  | Tidak ada teks editorial di kode; uji gagal bila ada                                           |

### Ukuran progres yang jujur (menggantikan tabel lama)

| Ukuran                         | Arti                                               |
| ------------------------------ | -------------------------------------------------- |
| Halaman disetujui pemilik / 70 | Hanya halaman yang lolos dua gerbang dan disetujui |
| Bab terbit / 55                | Bab dengan 3 sampai 7 kartu, terbit di produksi    |
| Offer terpilih dan disetujui   | Isi daftar pendek, bukan isi katalog               |
| Halaman pekerjaan terbit       | Halaman dengan delapan blok, terbit                |
| Cacat isi terbuka              | Temuan pemeriksa grafik isi dan gerbang gaya       |

---

## 10. Keputusan pemilik yang dibutuhkan

Hanya yang menahan fase; sisanya punya usulan bawaan yang berlaku sampai
pemilik memutuskan lain.

| #   | Keputusan                                                                | Menahan                           | Usulan bawaan                                                                         |
| --- | ------------------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------- |
| D1  | Setujui rencana ini, termasuk pencabutan grid karya fixture dari beranda | V0, V1                            | Setuju                                                                                |
| D2  | Pembeli B2B Konstruksi yang diutamakan                                   | Urutan bab W3                     | Kontraktor utama lebih dulu (urutan tabel Cara memakai: HHK, lalu TNK, MAT, ALT, MOD) |
| D3  | Kanal kontak dan waktu balas (K5)                                        | Ajakan di semua halaman           | WhatsApp utama, email cadangan; sampai diputuskan, ajakan menuju halaman Kontak       |
| D4  | Webhook revalidasi Sanity (K-D)                                          | V1, perubahan tampil tanpa deploy | Pasang; agen menguji dengan satu terbit                                               |
| D5  | Ekonomi Membership Care (RWT-01 atau RWT-09)                             | Bab RWT                           | Tahan keduanya; tampilkan RWT-02, RWT-04, RWT-10                                      |

---

## 11. Risiko

| Risiko                                                         | Penanganan                                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Migrasi skema membuat dokumen terbit tidak terbaca             | Medan lama dibiarkan sampai migrasi terbukti; ekspor dataset sebelum “ok tulis” |
| e2e membaca dataset production, jadi terbit mengubah hasil uji | Uji memakai predikat, bukan teks; dataset `ci` (K-E) tetap diusulkan            |
| Gerbang gaya otomatis terlalu ketat untuk teks siap tayang     | Teks siap tayang dan kutipan dikecualikan lewat penanda medan                   |
| Satu “ok tulis” per sisi terlalu besar untuk ditinjau          | Serahan dibagi per bab bila pemilik meminta                                     |
| Bab dengan kurang dari 3 offer layak                           | Bab tampil sebagai situasi tanpa halaman (bagian 4.2)                           |
