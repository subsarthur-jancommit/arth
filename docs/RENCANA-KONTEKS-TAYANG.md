# Rencana: konteks Master Brief sampai tayang di produksi

16 Oktober 2026 · Status: perlu Anda · Rencana saja; belum ada fase yang
dijalankan.

Tujuannya menutup jurang antara isi yang siap dan isi yang tayang. Copy yang
sudah disetujui tidak ditulis ulang. Yang dibangun adalah jalur dari isi siap
ke halaman produksi, satu situasi utuh lebih dulu.

## 1. Angka awal, diukur ulang 16 Oktober 2026

| Ukuran                                               | Angka        | Persen | Cara mengukur                                                                                     |
| ---------------------------------------------------- | ------------ | ------ | ------------------------------------------------------------------------------------------------- |
| Offer tampil di produksi (`arth-test-01.vercel.app`) | 0 dari 652   | 0%     | `curl` halaman Kuliner produksi: soft 404, nol kartu; `main` (`098893b`) tidak membaca tipe offer |
| Offer tampil di preview PR #22                       | 11 dari 652  | 1,7%   | Preview `ccfd15b`, halaman Kuliner: 11 tombol “Tanyakan pekerjaan ini”                            |
| Copy offer siap                                      | 652 dari 688 | 94,8%  | `bun lib/scripts/import-catalog.ts <master brief> --out offers.json`                              |
| Batas atas yang bisa tampil                          | 650 dari 688 | 94,5%  | 2 offer siap ada di bab Akademi, yang hanya punya 2 offer (di bawah syarat tiga)                  |
| Bab layak (≥3 offer siap)                            | 53 dari 55   | 96,4%  | Sama, dikelompokkan per bab. Tidak layak: Operator SaaS (0 siap), Akademi (2 siap)                |
| Halaman situasi diturunkan                           | 23 dari 53   | 43,4%  | Teknologi saja (`--situations`)                                                                   |
| Bab terbit                                           | 1 dari 53    | 1,9%   | Query Sanity, perspektif raw, `statusTinjauan == "disetujui"` dan bukan draf                      |
| Sisi terbit                                          | 1 dari 6     | 16,7%  | Sama (5 lainnya masih draf)                                                                       |
| Unit terbit                                          | 1 dari 3     | 33,3%  | Sama (2 lainnya masih draf)                                                                       |

Rincian per sisi (bab layak, offer di bab layak): Teknologi B 17/197,
Teknologi A 6/112, Konstruksi A 12/142, Konstruksi B 7/72, Peekabo A 8/102,
Peekabo B 3/25 (halaman jalur jaringan, bukan daftar).

Tertahan (36): 15 SaaS pertama, 7 status mitra platform belum terdaftar, 6
posisi bot trading, 5 pilihan sub-agen (‡), 2 ekonomi Membership Care, 1 bot
investasi yang dekat dengan trading.

**Tiga temuan saat mengukur yang mengubah urutan:**

1. CI menjalankan e2e terhadap dataset `production` (`.github/workflows/ci.yml`).
   Setiap penerbitan mengubah isi yang diuji e2e.
2. Kode sekarang memberi halaman sendiri kepada setiap pintu masuk. Hanya dua
   offer yang punya blok halaman. Bila batch berikutnya terbit apa adanya,
   tombol “Baca halamannya” pada 52 pintu masuk lain menuju halaman 404.
3. Rute `/api/revalidate` ada di kode dan membutuhkan `SANITY_REVALIDATE_SECRET`.
   Apakah webhook Sanity dan rahasianya terpasang tidak bisa dibaca dari sesi ini.

## 2. Fase

Urutannya mendahulukan angka “offer tampil di produksi”. Fase 1 membawa
Kuliner ke produksi sebelum batch besar mana pun.

### Fase 0. Alat ukur dan dua perbaikan kecil (1 PR, ditumpuk di #22)

- **Pekerjaan:** skrip `lib/scripts/measure-rollout.ts`, yang menghasilkan
  tabel bagian 1 dari katalog, dari API publik Sanity (perspektif published),
  dan dari halaman produksi.
- **Perbaikan:** pintu masuk tidak lagi otomatis punya halaman sendiri.
  `punyaHalaman` dan rute offer hanya membaca `halamanSendiri`. “Mulai dari sini”
  tetap tampil di daftar. Halaman pintu masuk dibuat per batch saat isinya
  disetujui (keputusan K-B).
- **Celah yang ditutup:** sebagian 11 (e2e berhenti bergantung pada isi yang
  terbit, lewat fixture lokal di uji unit).
- **Kriteria selesai:** skrip mencetak tabel yang sama dengan bagian 1;
  `ci` dan `e2e` hijau.
- **Angka:** belum naik; mengukur.

### Fase 1. Kuliner tayang di produksi

- **Pekerjaan:**
  1. Pulihkan beranda `main` di atas tumpukan, karena beranda F3 kehilangan
     11 momen dan separuh tingginya (TINJAUAN B). Satu PR di #22.
  2. Merge berurutan: #22 ke #21, #21 ke #18, lalu #18 ke `main`. Setiap merge
     dilakukan dengan `ci` dan `e2e` hijau di head-nya dan setelah Anda
     meninjau preview.
  3. Periksa produksi sesudah merge: deployment untuk SHA merge berstatus READY,
     dan halaman Kuliner produksi menampilkan 11 kartu.
- **Celah yang ditutup:** 4 dan 9. Halaman yang dibuat statis diperiksa dengan
  memuat ulang sesudah terbit; bila tidak menyegar, Anda memasang webhook (K-D).
- **PR:** pemulihan beranda; merge tumpukan ke `main`.
- **Dari Anda:** keputusan K-A (jalur merge), tinjauan preview per PR, dan K-D.
- **Kriteria selesai:** produksi menampilkan Kuliner dengan 11 kartu, dua
  halaman pekerjaan, dan beranda yang sama dengan sebelum merge.
- **Angka:** offer di produksi 0 → 11 (0% → 1,7%).

### Fase 2. Teknologi lengkap (2 batch Sanity, 1 PR kode)

- **Pekerjaan kode (1 PR):** halaman Cara kami dibayar; blok Cara kami bekerja
  Teknologi di halaman pekerjaan; katalog rute, peta situs, `llms.txt`, dan
  pencarian memuat bab dan halaman pekerjaan yang terbit; 404 asli untuk
  bab dan offer yang tidak terbit (daftar terbit dibaca saat build, lalu
  revalidasi).
- **Copy R1:** unit Teknologi (masalah, cara kerja) dan sisi paham teknis
  ditulis ulang dari header siap tayang dan alur kerja Sisi A, satu serah.
- **Batch Sanity:** B1 = 16 bab siap pakai yang tersisa (186 offer); B2 = 6 bab
  paham teknis (112 offer) dengan sisinya.
- **Celah yang ditutup:** 2 (Teknologi), 3 (Teknologi), 5, 7, 8.
- **Dari Anda:** persetujuan copy unit dan sisi; “ok tulis” B1 dan B2;
  keputusan terbit per batch.
- **Kriteria selesai:** 23 halaman situasi Teknologi tampil di produksi; peta
  situs memuat 23 bab; bab yang tidak terbit menjawab 404.
- **Angka:** offer di produksi 11 → 309 (1,7% → 47,4%); situasi terbit
  1 → 23 (1,9% → 43,4%).

### Fase 3. Konstruksi (1 PR kode, 2 batch Sanity)

- **Pekerjaan kode:** penurun halaman situasi untuk Konstruksi: urutan jenis,
  langkah pertama per pembaca (glosarium bagian 6), batas bawaan model 5–9
  (kalimat tender, visual, pinjaman), saring pasar pemerintah dan swasta di
  Sisi A. Tinjauan `R1-SITUASI-KONSTRUKSI.md`.
- **Copy R1:** unit Konstruksi dan kedua sisinya.
- **Batch Sanity:** B3 = 12 bab pelaku proyek (142 offer); B4 = 7 bab pemilik
  bangunan (72 offer).
- **Celah yang ditutup:** 1 (Konstruksi), 2, 3.
- **Kriteria selesai:** 19 situasi Konstruksi tampil; saring pasar bekerja di
  Sisi A.
- **Angka:** offer di produksi 309 → 523 (47,4% → 80,2%); situasi 23 → 42.

### Fase 4. Peekabo dan jembatan (1 PR kode, 2 batch Sanity)

- **Pekerjaan kode:** penurun halaman situasi Peekabo Sisi A; tiga halaman jalur
  jaringan (perujuk, anggota, kreator) untuk Sisi B, memakai templat jaringan
  dengan seluruh kalimat wajib; jembatan antarunit ditulis untuk semua pasangan
  yang kedua offernya sudah terbit.
- **Copy R1:** unit Peekabo dan kedua sisinya; tiga halaman jalur.
- **Batch Sanity:** B5 = 8 bab Peekabo A (102 offer); B6 = 3 jalur (25 offer).
- **Celah yang ditutup:** 1 (Peekabo), 2, 3, 12.
- **Kriteria selesai:** 11 situasi Peekabo dan 3 jalur tampil; jembatan tampil
  hanya bila tujuannya terbit.
- **Angka:** offer di produksi 523 → 650 (80,2% → 94,5%); situasi 42 → 53.

### Fase 5. Funnel penuh

- **Pekerjaan:** halaman kontak membaca `dari` dan `pekerjaan` dan mengisi pesan
  WhatsApp awal; formulir sesudah F5-06.
- **Celah yang ditutup:** 6.
- **Dari Anda:** K5 (kanal dan waktu balas).
- **Kriteria selesai:** setiap tombol tanya membuka kontak dengan nama
  pekerjaannya terisi.

### Fase 6. Isi wakil untuk e2e, lalu visual dan dwibahasa

- **F0-06:** dataset `ci` dengan isi wakil satu situasi; CI berhenti memakai
  `production`. Didahulukan ke Fase 1 bila Anda membuat dataset lebih cepat.
- **R4 visual** dan **R7 dwibahasa** sesudah isi Indonesia tayang, karena
  keduanya membungkus halaman yang sudah ada.
- **Celah yang ditutup:** 11, 13.

Celah 10 (CORS Studio) ditutup oleh keputusan K-C kapan pun Anda siap; ia tidak
menahan fase mana pun, karena penulisan dan penerbitan bisa lewat MCP atas
keputusan Anda.

## 3. Keputusan pemilik

| #   | Keputusan                                                                               | Yang tertahan                             | Usulan agen                                                                       | Batas yang disarankan |
| --- | --------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------- | --------------------- |
| K-A | Jalur merge ke `main`                                                                   | Fase 1 dan seterusnya                     | Merge tumpukan berurutan setelah beranda `main` dipulihkan (bagian 4)             | Sebelum Fase 1        |
| K-B | Pintu masuk tanpa halaman sendiri sampai isinya ditulis                                 | Fase 0; mencegah 52 tautan 404            | Setujui; halaman pintu masuk menyusul per batch                                   | Sebelum Fase 0        |
| K-C | Origin CORS untuk Studio di `/cms`                                                      | Studio di preview dan produksi            | Tambahkan `https://arth-test-01.vercel.app` dan alias cabang preview yang dipakai | Kapan saja            |
| K-D | Webhook revalidasi Sanity ke `/api/revalidate` dan `SANITY_REVALIDATE_SECRET` di Vercel | Halaman statis menyegar sendiri           | Pasang, atau terima bahwa isi baru tampil sesudah deploy berikutnya               | Sebelum Fase 2        |
| K-E | Dataset `ci` (F0-06)                                                                    | e2e yang tidak bergantung pada isi terbit | Buat dataset `ci`                                                                 | Sebelum Fase 2        |
| K5  | Kanal kontak dan waktu balas                                                            | Fase 5                                    | WhatsApp sebagai kanal utama, email cadangan                                      | Sebelum Fase 5        |
| —   | SaaS pertama                                                                            | 15 offer Operator                         | Pilih satu alat; offer yang memakainya dilepas                                    | Kapan saja            |
| —   | Posisi bot trading                                                                      | 7 offer Teknologi                         | Hanya lewat percakapan (saran master brief)                                       | Kapan saja            |
| —   | Pilihan sub-agen (1) atau (2)                                                           | 5 offer ‡                                 | Sesuai master brief                                                               | Kapan saja            |
| —   | Ekonomi Membership Care                                                                 | 2 offer perawatan                         | Pilih satu dari dua                                                               | Kapan saja            |
| —   | Pendaftaran program mitra platform                                                      | 7 offer Peekabo                           | Tahan sampai terdaftar                                                            | Sesudah terdaftar     |
| —   | Kartu komisi per mitra                                                                  | Tombol daftar di jalur jaringan           | Tampilkan cara kerja, buka pendaftaran setelah kartu pertama                      | Sebelum Fase 4        |
| —   | Bab Akademi (2 offer)                                                                   | 2 offer                                   | Tampil di situasi Arah, strategi, dan kelas, atau tunggu offer ketiga             | Sebelum Fase 4        |

## 4. Jalur merge ke `main`

Tumpukan sekarang lurus: `main` tidak tertinggal satu commit pun dari #18, #21,
dan #22. #22 berbeda 247 berkas dari `main`.

| Pilihan                                | Cara                                                                | Risiko bagi situs tayang                                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| A. Utuh                                | Merge #22 → #21 → #18 → `main`                                      | Beranda F3 menggantikan beranda `main` (11 momen hilang); halaman yang menunggu isi menjawab 404; `/en/*` diarahkan ke `/id` |
| **B. Utuh, beranda dipulihkan (usul)** | Satu PR di #22 memulihkan beranda `main`, lalu merge berurutan      | Halaman menunggu isi menjawab 404 dan `/en/*` dialihkan; keduanya keputusan K1/K2 yang sudah Anda ambil                      |
| C. Sempit                              | PR baru dari `main` yang memetik skema, query, dan rute Arthur saja | Paling aman bagi beranda, tetapi memetik dari 247 berkas berisiko tertinggal satu sambungan; paling lama                     |

Setiap merge mengikuti aturan 22–24: `ci` dan `e2e` hijau di head SHA, preview
ditinjau, lalu produksi diperiksa sesudah merge. Tidak ada promote, rollback,
atau redeploy oleh agen.

## 5. Batch Sanity

| Batch | Isi                                  | Dokumen                           | Fase    |
| ----- | ------------------------------------ | --------------------------------- | ------- |
| B0    | Kuliner (sudah terbit)               | 1 bab, 11 offer                   | Selesai |
| B1    | Teknologi siap pakai, 16 bab sisanya | 16 bab, 186 offer                 | 2       |
| B2    | Teknologi paham teknis               | 1 sisi, 6 bab, 112 offer          | 2       |
| B3    | Konstruksi pelaku proyek             | 1 unit, 1 sisi, 12 bab, 142 offer | 3       |
| B4    | Konstruksi pemilik bangunan          | 1 sisi, 7 bab, 72 offer           | 3       |
| B5    | Peekabo pemilik usaha                | 1 unit, 1 sisi, 8 bab, 102 offer  | 4       |
| B6    | Peekabo jaringan                     | 1 sisi, 3 jalur, 25 offer         | 4       |

Setiap batch berjalan dengan urutan yang sama:

1. **Uji kering.** `import-catalog.ts --drafts` menghasilkan NDJSON. Ukurannya
   dicek supaya setiap panggilan tulis di bawah 100 KB.
2. **“Ok tulis”** dari Anda, menyebut batch-nya.
3. **Tulis sebagai draf** berstatus `perlu-anda`.
4. **Verifikasi draf** dengan query predikat situs.
5. **Keputusan Anda:** setujui dan terbitkan.
6. **Terbitkan berurutan:** unit, sisi, bab, lalu offer.
7. **Verifikasi terbit** dengan query perspektif published dan pemeriksaan
   preview, termasuk status setiap alamat situasi dan pekerjaan.

## 6. Pengukuran berulang

`bun lib/scripts/measure-rollout.ts` (dibangun di Fase 0) mencetak tabel
bagian 1 dari tiga sumber:

- katalog, lewat `import-catalog.ts`;
- Sanity, lewat API publik dengan perspektif published;
- produksi, dengan menghitung kartu di setiap halaman situasi yang terbit.

Ia tidak membutuhkan token dan tidak menulis apa pun. Angka preview tetap
diperiksa dengan browser yang login, karena preview berada di balik Vercel
Authentication.

## 7. Risiko

| Risiko                                                          | Penanganan                                                                                     |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| e2e membaca `production`, sehingga penerbitan mengubah hasil CI | K-E (dataset `ci`); sampai itu, setiap batch diikuti satu run e2e sebelum batch berikutnya     |
| Beranda tayang turun mutu saat merge                            | Pilihan B: beranda `main` dipulihkan sebelum merge                                             |
| Tautan ke halaman pekerjaan yang tidak ada                      | Fase 0 (K-B); uji unit memastikan `punyaHalaman` sama dengan rute offer                        |
| Copy partner yang belum lewat R1 ikut terbit                    | Unit dan sisi ditulis ulang sebelum batch yang memakainya; Teknologi di Fase 2                 |
| Halaman statis tidak menyegar sesudah terbit                    | K-D; sampai itu, isi tampil setelah deploy berikutnya                                          |
| Bug yang baru muncul saat isi terbit (seperti `$slug` hari ini) | Setiap batch diperiksa di preview sebelum produksi; tes parameter query sudah dikunci          |
| Isi terbit bisa dibaca publik lewat API Sanity                  | Tidak ada tanda †, ‡, alasan tahan, atau catatan tinjauan di dokumen; semuanya tinggal di repo |
| Master brief berubah setelah impor                              | Impor dijalankan ulang per batch; perbedaan ditinjau sebelum “ok tulis”                        |
| PR besar sulit ditinjau                                         | Satu PR per fase; preview ditinjau per PR                                                      |
