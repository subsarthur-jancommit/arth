# Catatan tulis R7

Setiap penulisan ke Sanity untuk R7 (dwibahasa), menurut rencana
`docs/R7-TULIS-SANITY.md`. Gaya dan urutannya sama dengan
`docs/V4-CATATAN-TULIS.md`. Semua jalur file di bawah relatif terhadap
`ARTH/_cadangan-sanity/2026-11-15-r7/`, di luar repositori.

**Izin.** Pemilik menjawab "ok tulis" untuk rencana itu pada 15 November 2026,
diteruskan oleh sesi koordinator. Pesan koordinator berikutnya di hari yang sama
menetapkan jalurnya: konektor Sanity (MCP) dengan akun pemilik, tanpa token,
menurut `docs/PROSEDUR-KERJA.md` §6 "Lewat konektor Sanity (MCP)". Urutannya
cadangan, migrasi, cadangan lagi, Inggris, lalu uji kering ulang dan hitungan
GROQ sebelum dan sesudah. Berhenti dan lapor bila ada yang berbeda dari uji
kering. Di luar daftar itu aturan #25 tetap berlaku: tidak ada tulisan Sanity lain
dan tidak ada perubahan pengaturan.

**Yang tidak terjadi.** Tidak ada dokumen yang dihapus, tidak ada teks Indonesia
yang berubah, dan tidak ada deploy skema atau Studio.

**Cara kerja untuk setiap tulisan.** Proyek `az53j4l1`, dataset `production`.
Setiap patch membuat draf dari revisi terbit, dijaga `ifRevisionId`, satu
transaksi per draf. Penerbitan memakai satu panggilan `publish_documents` per
kelompok, dijaga `_rev` setiap draf yang dibaca tepat sebelumnya. Satu kelompok
terbit dalam satu transaksi: semua dokumennya berbagi satu `_rev`, dan revisi
itulah id transaksinya di tabel di bawah. Sebelum dan sesudah menulis, dataset
mentah berisi 408 dokumen: 404 terbit dan 4 draf `sanity.previewUrlSecret` milik
sistem. Tidak ada draf isi dan tidak ada versi rilis, sebelum maupun sesudah.

## 1. Cadangan pertama

- **File:** `cadangan/production-export-2026-11-15T030155Z.ndjson`, diambil
  03.01 UTC (10.01 WIB).
- **Isi:** 391 dokumen, 754.375 byte, sha256
  `f46a3d02983b70c08059d25648583cf3b3034a48a897c2ddb4c6b3cd23bef77c`.
- **Catatan:** ekspor publik, tanpa token. Karena tidak ada draf isi, ekspor ini
  lengkap untuk isi; 13 aset gambar ikut di dalamnya.

## 2. Migrasi medan `language`

- **Uji kering:** dijalankan ulang terhadap cadangan 1 sebelum menulis. Hasilnya
  360 dokumen dan 2.187 nilai, dan file mutasinya identik byte demi byte dengan
  uji kering di rencana.
- **Dokumen uji:** `arthur-offer-dis-01`, 16 nilai. Terbit di revisi
  `OaB0QVNuvZ77iKDYjlNUrO` dan diperiksa dulu sebelum dokumen lain disentuh.
- **Sisanya:** uji kering ulang terhadap data tayang menghasilkan 359 dokumen dan
  2.171 nilai, ditulis dalam 15 kelompok. Daftar dokumen per kelompok ada di
  `tulis/migrasi-2/lot/ids.json`.
- **Waktu:** 03.03 sampai 03.22 UTC (10.03 sampai 10.22 WIB).

| Kelompok | Dokumen | Transaksi terbit         |
| -------- | ------- | ------------------------ |
| uji      | 1       | `OaB0QVNuvZ77iKDYjlNUrO` |
| 1        | 25      | `yZdZ03GzT7aYLb9PIAbplM` |
| 2        | 25      | `FpGa507GOKtlcJVthYqwsP` |
| 3        | 25      | `yZdZ03GzT7aYLb9PIAc2hm` |
| 4        | 25      | `OaB0QVNuvZ77iKDYjlNwN2` |
| 5        | 25      | `OaB0QVNuvZ77iKDYjlOIUo` |
| 6        | 25      | `yZdZ03GzT7aYLb9PIAcgle` |
| 7        | 25      | `OaB0QVNuvZ77iKDYjlOUc1` |
| 8        | 25      | `yZdZ03GzT7aYLb9PIAd3Su` |
| 9        | 25      | `OaB0QVNuvZ77iKDYjlOkpG` |
| 10       | 25      | `OaB0QVNuvZ77iKDYjlOutS` |
| 11       | 25      | `OaB0QVNuvZ77iKDYjlP1DO` |
| 12       | 25      | `OaB0QVNuvZ77iKDYjlP7Io` |
| 13       | 25      | `FpGa507GOKtlcJVthYrpeD` |
| 14       | 25      | `FpGa507GOKtlcJVthYrtzd` |
| 15       | 9       | `OaB0QVNuvZ77iKDYjlPH1E` |

**Menyimpang dari rencana.** Rencana menyebut 18 transaksi berisi 20 dokumen.
Lewat konektor, migrasi berjalan sebagai 1 dokumen uji ditambah 15 kelompok
berisi paling banyak 25 dokumen, yaitu batas satu panggilan konektor. Isi dan
penjaganya sama; hanya pengelompokannya yang berbeda. Penulisan Inggris kembali
memakai kelompok 20 seperti rencana.

**Diperiksa sesudahnya:**

- Uji kering ulang menemukan 0 nilai. Yang berlabel kini 371 dokumen dan 2.448
  nilai: 360 dokumen dan 2.187 nilai dari migrasi ini, ditambah 11 dokumen dan
  261 nilai yang sudah berlabel sebelumnya. Tujuh dokumen fixture (98 nilai)
  tidak disentuh.
- `skrip/periksa.py` membandingkan 391 dari 391 dokumen dengan cadangan 1:
  semuanya sama kecuali `language` yang ditambahkan, dan setiap `language` sama
  dengan `_key`-nya. Fixture sama persis.
- Hitungan GROQ (tabel di bagian 5) dan empat cuplikan nilai lewat API publik:
  `_key` tetap `id`, `language` bernilai `id`, dan teksnya tampil di halaman
  `/id` yang memakainya.
- Ke-20 URL di sitemap menjawab 200.

## 3. Cadangan kedua

- **File:** `cadangan/production-export-2026-11-15T032812Z.ndjson`, diambil
  03.28 UTC (10.28 WIB).
- **Isi:** 391 dokumen, 813.227 byte, sha256
  `73ff7af1fa865aae1684d862e5e59d96603a5db587b4a509aeee3c39427bbfe7`.
- **Dibandingkan dengan cadangan 1:** id dokumennya sama. Ada 360 dokumen yang
  berubah, hanya di `language`, `_rev`, `_updatedAt`, dan `_system` (metadata
  terbit).

## 4. Inggris

- **Uji kering:** dijalankan terhadap cadangan 2 dan terhadap data tayang, dengan
  hasil 776 medan di 370 dokumen dan 0 pemeriksaan gagal. File mutasi kedua run
  identik byte demi byte, jadi cadangan 2 mutakhir. Daftar medannya (791 baris)
  identik dengan uji kering di rencana.
- **Bentuk:** setiap nilai `{_key: "en", _type, language: "en", value}`
  disisipkan sesudah item terakhir lariknya (`insert` sesudah `[-1]`), sehingga
  item Indonesia tidak ditulis ulang.
- **Kelompok:** 19 kelompok, 18 berisi 20 dokumen dan satu berisi 10, sama dengan
  rencana. Kelompok 1 (48 KB) di-patch dalam 5 panggilan dan kelompok 19 (23 KB)
  dalam 3 panggilan, supaya setiap teks utuh. Terbitnya tetap satu panggilan per
  kelompok. Daftar dokumen per kelompok ada di `tulis/inggris-live/lot/ids.json`.
- **Diperiksa setiap kelompok:** dokumen kelompok itu dibandingkan dengan
  cadangan 2. Sesudah item `en` diambil, sisanya harus sama. Lalu uji kering
  dijalankan ulang terhadap data tayang. Medan yang "sudah tertulis" (Inggrisnya
  sama dengan teks yang disetujui) harus sama dengan jumlah kumulatif rencana, dan
  tidak boleh ada yang gagal. Ke-19 kelompok lolos, dari 207 medan sampai 776.
- **Waktu:** 03.34 sampai 03.52 UTC (10.34 sampai 10.52 WIB).

| Kelompok | Dokumen | Medan kumulatif | Transaksi terbit         |
| -------- | ------- | --------------- | ------------------------ |
| 1        | 20      | 207             | `FpGa507GOKtlcJVthYtYNp` |
| 2        | 20      | 247             | `yZdZ03GzT7aYLb9PIAgZf8` |
| 3        | 20      | 288             | `yZdZ03GzT7aYLb9PIAh3i2` |
| 4        | 20      | 317             | `OaB0QVNuvZ77iKDYjlSs5T` |
| 5        | 20      | 343             | `OaB0QVNuvZ77iKDYjlSwMO` |
| 6        | 20      | 371             | `yZdZ03GzT7aYLb9PIAhL4e` |
| 7        | 20      | 398             | `yZdZ03GzT7aYLb9PIAhQbO` |
| 8        | 20      | 424             | `yZdZ03GzT7aYLb9PIAhVDg` |
| 9        | 20      | 452             | `OaB0QVNuvZ77iKDYjlT7XX` |
| 10       | 20      | 480             | `OaB0QVNuvZ77iKDYjlTEKV` |
| 11       | 20      | 505             | `yZdZ03GzT7aYLb9PIAhi22` |
| 12       | 20      | 532             | `FpGa507GOKtlcJVthYuxkH` |
| 13       | 20      | 559             | `yZdZ03GzT7aYLb9PIAhq20` |
| 14       | 20      | 585             | `yZdZ03GzT7aYLb9PIAhvIc` |
| 15       | 20      | 611             | `FpGa507GOKtlcJVthYv5DL` |
| 16       | 20      | 639             | `yZdZ03GzT7aYLb9PIAi7CW` |
| 17       | 20      | 664             | `yZdZ03GzT7aYLb9PIAiDJY` |
| 18       | 20      | 690             | `yZdZ03GzT7aYLb9PIAiJEU` |
| 19       | 10      | 776             | `OaB0QVNuvZ77iKDYjlTgJB` |

**Diperiksa sesudahnya:**

- Uji kering ulang menyisakan 0 medan untuk ditulis: 776 medan sudah tertulis
  sama dengan teks yang disetujui, dan 0 gagal.
- Uji kering migrasi tetap 0 nilai. Yang berlabel kini 3.224 nilai, yaitu 2.448
  nilai `id` ditambah 776 nilai `en`.
- `skrip/periksa.py` membandingkan 391 dari 391 dokumen dengan cadangan 2: sama
  sesudah item `en` yang ditambahkan diambil.
- Dataset mentah tetap 408 dokumen, dengan 0 draf dan 0 versi.
- Ke-20 URL di sitemap menjawab 200. `/en` tetap 307 ke `/id`, karena segmennya
  belum dibuka.

## 5. Hitungan GROQ sebelum dan sesudah

Kolom "sebelum" dihitung dengan groq-js atas file cadangan, jadi kuerinya sama
persis dengan yang dikirim ke data tayang untuk kolom "sesudah". Skripnya
`skrip/bukti.ts`, dan keluarannya `tulis/bukti-migrasi.md` dan
`tulis/bukti-inggris.md`.

| Kueri                                                                                   | Cadangan 1 | Sesudah migrasi | Sesudah Inggris |
| --------------------------------------------------------------------------------------- | ---------- | --------------- | --------------- |
| `count(*[!(_id in path("_.**")) && !(_type match "sanity.*")])`                         | 378        | 378             | 378             |
| `count(*[_type == "offer" && judul[_key == "id"][0].language == "id"])`                 | 0          | 305             | 305             |
| `count(*[_type == "bab" && nama[_key == "id"][0].language == "id"])`                    | 0          | 51              | 51              |
| `count(*[_type == "sequence" && situasi[_key == "id"][0].language == "id"])`            | 0          | 2               | 2               |
| `count(*[_type == "offer" && defined(judul[_key == "id"][0].value)])`                   | 305        | 305             | 305             |
| `count(*[_type == "unit" && judul[_key == "id"][0].language == "id"])`                  | 3          | 3               | 3               |
| `count(*[_type == "offer" && defined(jenis[_key == "en"][0])])`                         | 0          | 0               | 305             |
| `count(*[_type == "bab" && defined(nama[_key == "en"][0])])`                            | 0          | 0               | 51              |
| `count(*[_type == "side" && defined(judul[_key == "en"][0])])`                          | 0          | 0               | 6               |
| `count(*[_type == "unit" && defined(judul[_key == "en"][0])])`                          | 0          | 0               | 3               |
| `count(*[_type == "sequence" && defined(situasi[_key == "en"][0])])`                    | 0          | 0               | 2               |
| `count(*[_id == "siteSettings" && defined(heroJudul[_key == "en"][0])])`                | 0          | 0               | 1               |
| `count(*[_id == "howWeWork" && defined(pembuka[_key == "en"][0])])`                     | 0          | 0               | 1               |
| `count(*[_id == "arthur-page-cara-kami-dibayar"][0].isi[_key == "en"][0].value)` (blok) | null       | null            | 16              |

Baris pertama tidak menghitung 13 aset gambar (`sanity.imageAsset`). Baris
`defined(judul[_key == "id"][0].value)` yang tetap 305 membuktikan bahwa kueri
situs, yang membaca `[_key == "id"]`, tetap menemukan setiap nilai.

## 6. Perubahan skrip selama penulisan

- `periksa.py`: fixture kini dibandingkan persis dengan cadangannya. Kedua
  penulisan tidak menyentuh fixture, dan pemeriksaan `language` versi awal
  menandai tujuh fixture yang memang tidak dimigrasi.
- `tulis_inggris.py`: blok P1 yang sudah ada dan sama dengan teks yang disetujui
  kini dihitung "sudah tertulis". Versi awal selalu menganggapnya gagal, jadi
  uji kering sesudah menulis tidak akan pernah bersih. Ditambah hitungan "already
  written". File mutasi dan undo identik byte demi byte sebelum dan sesudah
  perubahan ini. sha256-nya kini `5c1fc79260a4…`, bukan `5506a631fc01…` seperti
  di tabel rencana.
- Skrip baru: `lot.py` (kelompok untuk konektor), `potong.py` (memecah satu
  kelompok menjadi beberapa panggilan patch), `pantau.sh` (pemeriksaan setiap
  kelompok), dan `bukti.ts` (hitungan GROQ dan revisi).
- Contoh GROQ di rencana, `count(*[_type == "offer" && defined(jenis[_key == "en"])])`,
  selalu menghitung semua offer. Filter yang tidak cocok tetap mengembalikan larik
  kosong, dan larik kosong itu `defined`. Bukti di sini memakai
  `defined(jenis[_key == "en"][0])`.

| Skrip                 | sha256 (12 awal) |
| --------------------- | ---------------- |
| `umum.py`             | `1858e0d076d0`   |
| `ekspor.py`           | `d63ecf17b32e`   |
| `migrasi_language.py` | `a41c979fdde4`   |
| `tulis_inggris.py`    | `5c1fc79260a4`   |
| `periksa.py`          | `24dfec5f0e9a`   |
| `lot.py`              | `cc97fa0dbd90`   |
| `potong.py`           | `a0947f0ac110`   |
| `pantau.sh`           | `6c3005b89703`   |
| `bukti.ts`            | `61e2694af6d9`   |

## 7. Temuan

- **Skema yang ter-deploy tertinggal dari skema repo.** Tiga medan ada di data
  dan di skema repo, tetapi tidak ada di skema yang ter-deploy ke Content Lake:
  - `kalimatJujur` di `unit` (`lib/integrations/sanity/schemas/unit.ts:147`)
  - `jalurJaringan` di `bab` (`bab.ts:91`)
  - `pembuka` di `howWeWork` (`howWeWork.ts:28`)

  Validasi konektor melaporkannya sebagai medan tak dikenal ("existing schema
  issues") pada draf yang memuatnya. Situs membaca ketiganya, dan Studio di `/cms`
  memakai skema repo. Tidak ada yang diubah. Deploy skema termasuk pengaturan
  Sanity (aturan #25), jadi itu keputusan pemilik.

- **Inggris belum tampil ke pembaca.** `/en` tetap 307 ke `/id` sampai PR kode
  (#94 dan #95) merge, lalu PR yang mengeluarkan segmennya dari
  `UNTRANSLATED_SEGMENTS`, satu per halaman.

## 8. Cara membatalkan

- **Inggris:** `tulis/inggris-live/tulis-inggris.undo.json` melepas 776 nilai
  `[_key == "en"]` di 370 dokumen.
- **Migrasi:** `tulis/migrasi/migrasi-language.undo.json` melepas `language` di
  2.187 jalur, 360 dokumen. Bila keduanya dibatalkan, Inggris dulu, lalu migrasi.
- Keduanya dijalankan dengan cara yang sama: patch berkunci revisi, lalu terbit
  berkunci draf. Keduanya butuh izin pemilik.
- **Jalan terakhir:** cadangan 1 (sebelum semua tulisan) dan cadangan 2 (sesudah
  migrasi, sebelum Inggris).
