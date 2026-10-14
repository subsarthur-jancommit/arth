# Tinjauan F1–F3 (PR #18)

Tanggal: 15 Oktober 2026. Ditulis atas permintaan pemilik, terhadap branch
`codex/f2-02-unit-side-model` pada head `5f7ab7e` (46 commit di atas `main`).

Sumber pembanding: `FULL KONTEKS/` (Master brief, Rencana implementasi,
Backlog, Sistem animasi, Peta rute dan komponen, Peta website, Suara dan gaya),
`docs/PROGRES-ARTHUR.md`, `docs/PHASE-03-REPORT.md`, dan produksi
(`main`, `arth-test-01.vercel.app`).

## Cara bukti diambil

- Preview Vercel PR #18 terkunci SSO dan tidak bisa dibuka sesi ini, jadi
  branch dibangun lokal (`bun run build`, exit 0) dan dijalankan sekali dengan
  `next start` untuk diambil gambarnya, lalu dimatikan.
- Satu Chromium headless, berurutan, 1440 × 900 dan 390 × 844. Gambar
  disimpan di luar repo.
- Angka tinggi halaman dan jumlah `data-epic` di bawah dibaca dari DOM, bukan
  perkiraan. Tidak ada angka kinerja di dokumen ini (aturan #19).
- E2E tidak dijalankan lokal (PROSEDUR-KERJA melarangnya). E2E dijalankan
  ulang di GitHub Actions oleh commit yang membawa dokumen ini.

## A. Proses

| No. | Temuan                                                                                                                                                                                                                           | Bukti                                                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| A1  | 46 commit tidak pernah melewati `ci` maupun `e2e`; sembilan terakhir membawa `[skip ci]`                                                                                                                                         | `gh pr view 18`: hanya check Vercel; tidak ada run Actions di branch |
| A2  | 54 berkas e2e diubah tanpa pernah dijalankan. Beberapa berkurang banyak (`locale-place` +19/−39 baris, `route-budget` +3/−12, `route-sweep` dan `promises` ditulis ulang). Tidak ada bukti mana yang lulus dan mana yang melemah | `git diff --stat main...5f7ab7e -- e2e`                              |
| A3  | F1-05 sampai F3-11 (21 paket) ada di satu PR. Rencana memecahnya per prompt supaya tinjauan per potongan kecil                                                                                                                   | Instruksi Prompting, "Urutan paket kerja"                            |

**Ditindak di commit ini:** protokol awal dihidupkan lagi. Commit ini tidak
membawa `[skip ci]`, jadi `ci` dan `e2e` berjalan pada head PR #18. Hasilnya
yang menentukan langkah berikut, bukan laporan lokal.

## B. Beranda dibanding `main`

| No. | Temuan                                                                                                                                                                                                                                                                                                   | Bukti                                                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| B1  | Halaman tinggal kurang dari separuh: **11.744 px → 5.354 px** pada 1440 × 900. Yang hilang: lintasan `Passage` yang di-pin (pelat bernomor 01/04 dan grid yang menajam), grid karya dengan material WebGL dan flowmap, daftar praktik, `LatestWriting` (fixings), potret studio                          | Ukur DOM; `git show main:app/[locale]/page.tsx`                  |
| B2  | Momen yang terlacak turun dari 11 ke 6 `data-epic`. Hilang: `locale-sheet`, `work-transport`, `card-crop`, `latest-writing`, `address-copy`                                                                                                                                                              | `document.querySelectorAll('[data-epic]')` di kedua situs        |
| B3  | **Tidak ada satu pun unsur visual** di beranda selain teks dalam kotak bergaris. Rencana memang melarang foto dummy di halaman Arthur, tetapi juga menulis "gerak Arthur tidak menunggu foto: garis, huruf, dan gambar kerja yang digambar sendiri sudah cukup". Foto dicabut, penggantinya tidak dibuat | Sistem animasi, "Gambar dan aset"; tangkapan layar               |
| B4  | Indeks hero (kolom kanan atas) dicabut. Ini regresi Tahap 67: separuh atas layar pertama kembali kosong                                                                                                                                                                                                  | `main` mengoper `index`, branch tidak                            |
| B5  | `webgl` dan `FLOWMAP_SIM` masih dipasang di beranda, padahal satu-satunya pemakai flowmap (material grid karya) sudah dicabut. Pembaca tetap mengunduh three.js dan GPU tetap menjalankan simulasi tanpa hasil yang terlihat (dugaan dari kode, belum diukur)                                            | Komentar di `main` sendiri menyebut biaya simulasi tanpa pemakai |
| B6  | Nama `arth-passage` dipakai ulang untuk `Horizontal` biasa. `interaction-grammar` akan melaporkan momen yang bukan lintasan yang di-pin                                                                                                                                                                  | `vault/blocks/unit-doors`                                        |
| B7  | "Pilih situasi Anda" hanya berisi tiga kalimat yang mengulang pernyataan payung kata demi kata. Master brief "Cara memakai" punya 14 situasi dalam bahasa klien yang menunjuk unit, sisi, dan bab                                                                                                        | `HOME_SITUATION_FALLBACKS`                                       |
| B8  | Teks terbesar sesudah judul hero adalah alamat dummy `kontak@arth.invalid` dalam ukuran display                                                                                                                                                                                                          | Tangkapan layar beranda                                          |

**Ditindak di commit ini:** B4. Indeks hero kembali, diisi label tiga pintu
unit. B1–B3 dan B5–B8 butuh arah dari pemilik (lihat bagian E).

## C. Bahasa ID/EN

| No. | Temuan                                                                                                                                                                                                                                       | Bukti                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| C1  | Pengalih bahasa hilang dari semua halaman `/id`. Ini mengikuti K1/K2 yang tercatat di `PROGRES-ARTHUR.md` ("Inggris menyusul"), jadi bukan keputusan partner sendiri. Bila pemilik kini ingin ID/EN tayang, K2 perlu diubah tertulis         | `PUBLISHED_LOCALES = ['id']`                       |
| C2  | **Bug:** hanya `/en` persis yang dialihkan. `/en/konstruksi` dan rute dalam lainnya menjawab 200 dengan antarmuka Inggris ("HOW WE WORK", "2 reader sides") dan isi Indonesia. Ini tidak memenuhi K2 (307 ke `/id`) dan juga bukan dwibahasa | `publicLocaleRedirect`; tangkapan `/en/konstruksi` |
| C3  | Teks cadangan beranda bahasa Inggris masih teks studio lama "Arth" ("Work that has to hold up… Consulting, AI and data"). Cadangan unit dan sisi hanya ada dalam bahasa Indonesia                                                            | `lib/content/home-fallback.ts`                     |

## D. Kartu dan layout

| No. | Temuan                                                                                                                                                                                                                      | Bukti                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| D1  | Pintu unit: tiga kotak bergaris setinggi 58–62 svh dengan warna isi sama dengan latar. Teks di atas, tautan di bawah, sekitar 40% kotak kosong, tanpa pelat atau tanda gambar kerja. Terbaca sebagai wireframe, bukan pintu | `unit-doors.module.css`; tangkapan layar |
| D2  | Kartu offer `min-height: min(74svh, 36rem)` di ponsel: tiap kartu sekitar satu layar penuh untuk empat baris teks. Dua kolom di desktop meninggalkan kartu yatim saat jumlahnya 3, 5, atau 7, padahal bab memang berisi 3–7 | `chapter-offer-grid.module.css`          |
| D3  | Pintu sisi `min-height` 320/375 vw di ponsel, pola kosong yang sama                                                                                                                                                         | `side-doors.module.css`                  |
| D4  | Halaman unit: sekitar 450 px pita kosong di antara judul unit dan judul header pada 1440 × 900; separuh kanan hero kosong                                                                                                   | Tangkapan `/id/konstruksi`               |
| D5  | Kartu offer berganti latar saat disorot tanpa transisi, sedangkan pintu unit punya transisi. Satu situs, dua perilaku kartu                                                                                                 | CSS kedua blok                           |
| D6  | Ukuran ditulis `calc(n / 375 * 100vw)` mentah di blok baru, sedangkan blok lain memakai `mobile-vw()` / `desktop-vw()`. Bukan pelanggaran sejak fork, tetapi menyulitkan penyelarasan                                       | CSS blok baru                            |

## E. Yang perlu diputuskan pemilik

1. **Bahasa.** Kembalikan ID/EN sekarang (perlu teks Inggris untuk beranda,
   unit, dan sisi, dan aturan suara Inggris di K2), atau tetap Indonesia saja
   dan alihkan seluruh `/en/*` ke `/id/*` sesuai K2. Keadaan sekarang (C2)
   bukan salah satunya.
2. **Visual beranda.** Usulan: pelat gambar kerja SVG per unit (F4-05) ditarik
   ke F3, lalu lintasan yang di-pin dikembalikan dengan pelat itu sebagai ganti
   foto dummy. Material WebGL bisa memakai pelat yang sama (rencana menyebut
   `MaterialImage` mampu), dengan jalur tanpa WebGL tetap ada (aturan #14).
3. **Kartu.** Rancang ulang pintu unit, pintu sisi, dan kartu offer sebagai
   satu keluarga: tinggi mengikuti isi, satu tanda gambar kerja per kartu, grid
   yang tidak meninggalkan yatim untuk 3–7 kartu.

## F. Yang sudah benar

Model isi Sanity, penjaga Zod dan placeholder, gerbang `disetujui` di jalur
publik, pemisahan draft dan published, medan internal yang tidak
diproyeksikan, jalur tanpa JavaScript, dan keadaan akhir reduced motion pada
blok baru tersusun rapi dan sesuai Model isi Sanity. Temuan di atas soal
tampilan, bahasa, dan proses uji, bukan soal fondasi datanya.
