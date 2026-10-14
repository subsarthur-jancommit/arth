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
unit. B1–B3 dan B5–B8 butuh arah dari pemilik (lihat bagian F).

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

## E. Inventaris fitur yang hilang, per halaman

Diukur 15 Oktober 2026 dengan satu Chromium headless pada 1440 × 900:
produksi (`main`, `098893b`) dibanding build lokal branch (`5f7ab7e`). Angka
"momen" adalah jumlah `data-epic` unik di DOM setelah halaman digulir sampai
akhir. Penggolongan:

- **Hilang**: ada di `main`, tidak ada di branch, tidak ada penggantinya.
- **Diganti**: ada padanan Arthur yang benar-benar tampil.
- **Sengaja**: dicabut sesuai rencana atau keputusan K yang tercatat.
- **Bug**: perilaku yang tidak diminta rencana mana pun.

### E1. Beranda `/id`

| No.  | Fitur di `main`                                                                  | Keadaan di branch                                                                                                                       | Golongan                 |
| ---- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| E1.1 | Indeks unit di kolom kanan hero                                                  | Dicabut; dikembalikan di `98c90fe`                                                                                                      | Hilang, sudah dipulihkan |
| E1.2 | Lintasan `arth-passage` yang di-pin: grid menajam, pelat bernomor 01/04 berjalan | Tidak ada. Nama `arth-passage` dipakai untuk deret pintu unit yang hanya bergeser ke samping, tanpa pelat                               | Hilang                   |
| E1.3 | Grid karya dengan material WebGL dan flowmap (`card-crop`, `work-transport`)     | Dicabut. Rencana memang melarang foto fixture di halaman Arthur, tetapi tidak ada pelat pengganti, dan WebGL serta flowmap tetap dimuat | Sengaja, tanpa pengganti |
| E1.4 | Daftar praktik yang berubah bentuk ke halamannya                                 | Pintu unit dengan morph nama unit ke halaman unit (`practice-morph` tampil di `/id/konstruksi`)                                         | Diganti                  |
| E1.5 | `LatestWriting` dengan paku sudut (`latest-writing`)                             | Dicabut; jurnal tidak dipromosikan (F1-06)                                                                                              | Sengaja                  |
| E1.6 | Potret studio di blok pernyataan                                                 | `StudioNote` tinggal teks                                                                                                               | Hilang                   |
| E1.7 | Salin alamat surel (`address-copy`)                                              | Dicabut karena surel masih dummy (K5)                                                                                                   | Sengaja                  |
| E1.8 | Pilih situasi                                                                    | Baru (`situation-leader`), tetapi isinya tiga kalimat yang mengulang pernyataan payung (B7)                                             | Baru, isi lemah          |
| E1.9 | Jumlah keseluruhan                                                               | Tinggi 11.744 → 5.354 px; gambar di `main` 9 → 0; momen 11 → 6                                                                          | —                        |

### E2. Bingkai situs (header, footer, bahasa)

| No.  | Fitur di `main`                                         | Keadaan di branch                                                                                                            | Golongan                                 |
| ---- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| E2.1 | Pengalih EN/ID di header semua halaman (`locale-sheet`) | Tidak tampil di halaman `/id` mana pun                                                                                       | Sengaja (K2), menunggu keputusan pemilik |
| E2.2 | `/en` dan seluruh `/en/*` berbahasa Inggris             | `/en` dialihkan ke `/id`; `/en/*` lainnya tampil dengan antarmuka Inggris dan isi Indonesia (C2)                             | Bug                                      |
| E2.3 | Navigasi Karya, Studio, Jurnal                          | Konstruksi, Teknologi, Peekabo, Cara kami bekerja, Kontak (F1-06). Tautan "Cara kami bekerja" mendarat di halaman 404 (E3.1) | Diganti, satu tautan rusak               |
| E2.4 | Footer: surel bertaut, Instagram, Are.na                | Surel tanpa tautan (dummy), akun sosial dicabut karena fiktif                                                                | Sengaja                                  |
| E2.5 | Cap build di footer (`build-stamp`)                     | Tidak tampil di build lokal karena SHA Vercel tidak ada. Tidak bisa dipastikan dari sesi ini                                 | Belum terverifikasi                      |

### E3. Studio menjadi Cara kami bekerja, dan halaman tetap lain

| No.  | Fitur di `main`                                                                                                                                                                                           | Keadaan di branch                                                                                                                                                                                                                         | Golongan                          |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| E3.1 | `/id/studio`: 6.136 px, 3 gambar, 11 momen (`studio-statement`, `capability-evidence`, `work-measure`, `studio-process`, `engagement-shapes`, `section-link`, `card-crop`, `work-transport`, dan lainnya) | `/id/studio` 308 ke `/id/cara-kerja`, yang **menampilkan halaman 404 dengan HTTP 200** (soft-404) karena dokumen `howWeWork` baru draft. Blok baru (janji dicap, dimensi, unting-unting) ada di kode tetapi tidak pernah tampil ke publik | Bug                               |
| E3.2 | Tidak ada                                                                                                                                                                                                 | `/id/satu-klien-tiga-unit` juga soft-404 dengan HTTP 200 karena belum ada `sequence` terbit                                                                                                                                               | Bug                               |
| E3.3 | Blok `capability-evidence`, `engagement-shapes`, `work-measure`, `project-card`, `passage`, `practice-list`, `latest-writing`                                                                             | Ketujuh blok vault itu tidak lagi dipakai halaman mana pun                                                                                                                                                                                | Hilang dari situs, kode masih ada |

### E4. Unit dan sisi

| No.  | Fitur                                                                       | Keadaan di branch                                                                                                                                                                                                                                          | Golongan     |
| ---- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| E4.1 | Halaman unit di `main` hanya kerangka contoh F1-03 (1.130 px, 0 momen)      | Lebih lengkap: hero unit, dua pintu sisi, masalah, cara kerja, unit berikutnya (3 momen). Tetapi ada pita kosong sekitar 450 px dan tanpa visual (D4)                                                                                                      | Bertambah    |
| E4.2 | Halaman sisi (baru di F1-04)                                                | Pita kosong sekitar 800 px di atas judul; empat cara membeli dicetak sebagai judul raksasa di kolom sempit, tiap butir tujuh sampai sembilan baris, dengan tanda pisah panjang yang dilarang Suara dan gaya aturan 9; tabel bab menampilkan keadaan kosong | Layout rusak |
| E4.3 | Dialek gerak per unit (Konstruksi berat, Teknologi beruntun, Peekabo hidup) | Belum ada; memang dijadwalkan F4-02                                                                                                                                                                                                                        | Sengaja      |

### E5. Yang tidak berubah

`/id/work` dan `/id/journal` tetap utuh (tinggi, gambar, dan momennya sama
dengan `main`), hanya tanpa pengalih bahasa, sesuai F1-06 yang
menyimpannya di luar navigasi.

### E6. Layout dibangun di sekitar placeholder (ditambahkan pemilik)

Pemilik: animasi yang baik tidak mungkin dibangun di atas layout yang buruk.
Buktinya, dari build lokal:

| No.  | Temuan                                                                                                                                                                                                                                                                                                                                             |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E6.1 | Enam dari sebelas paket F3 tidak pernah tampil sebagai halaman berisi. F3-04 (bab) dan F3-05 (offer) tidak punya satu pun dokumen untuk dirender; F3-07 dan F3-08 jatuh ke soft-404 (E3.1, E3.2); F3-10 hanya keadaan kosong; F3-11 memang tidak terlihat. Semuanya dilaporkan selesai di `PHASE-03-REPORT.md` §2 dan di pesan commit "complete …" |
| E6.2 | Kartu offer, unit jualan terpenting situs, belum pernah dilihat siapa pun dalam keadaan terisi. Fixture F2-09 dilewati, jadi bentuk kartu, kerapatan, dan geraknya tidak pernah diuji dengan isi                                                                                                                                                   |
| E6.3 | Ukuran blok ditentukan oleh ketiadaan isi: pita kosong sekitar 450 px di halaman unit dan sekitar 800 px di halaman sisi, pintu unit 58–62 svh dengan 40% ruang kosong, kartu offer 74 svh di ponsel                                                                                                                                               |
| E6.4 | Keadaan kosong mengambil tempat isi: tabel bab di setiap sisi, "Belum dibuka" di jaringan, "Kontak belum dibuka" dan "Pernyataan pemilik belum diterbitkan" di kontak, "Draf kebijakan belum dimasukkan" di kebijakan                                                                                                                              |
| E6.5 | Alamat dummy tampil tiga kali di setiap halaman: blok kontak (ukuran display di beranda), catatan di ajakan unit, dan footer                                                                                                                                                                                                                       |
| E6.6 | Cara membeli di halaman sisi dicetak sebagai judul display di kolom sempit, tujuh sampai sembilan baris per butir; komponen langkah dipakai untuk teks yang bukan judul                                                                                                                                                                            |

### E7. Copywriting (ditambahkan pemilik)

Pemilik: tulisannya tidak sesuai harapan, membingungkan, dan tidak akan
menjual. Pembanding: `Suara dan gaya`, `Aturan isi`, dan `Peta website`.

| No.  | Temuan                                                                                                                                                                                                                                                                                     | Contoh yang tampil ke pembaca                                                                                                                                                                                                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E7.1 | **Catatan kerja internal tayang sebagai kalimat untuk pelanggan.** Kalimat ini ditujukan kepada pemilik atau editor, bukan pembeli                                                                                                                                                         | "Bab akan muncul setelah setidaknya tiga offer di sisi ini disetujui untuk tayang." · "Informasi dummy di bawah hanya menjaga bentuk halaman tetap dapat ditinjau" · "Isi akan muncul di sini setelah disusun di Sanity." · "Ganti sebelum kontak Arthur diterbitkan." · "Akun resmi Arthur akan ditambahkan setelah pemilik menetapkannya." |
| E7.2 | **Istilah katalog internal bocor ke pembeli.** Sisi, bab, offer, lapis, eceran, rakitan, "layanan matang", "pembangunan otonom penuh" adalah bahasa kerja master brief, bukan bahasa pembeli. `Peta website` sudah menyediakan label pembaca untuk jenis dan bab, tetapi tidak dipakai     | "2 sisi pembaca" · "Dua sisi unit" · "Buka sisi" · "Bab yang tersedia untuk dibaca." · "Pilih layanan matang, rakitan ringan, atau pembangunan otonom penuh"                                                                                                                                                                                 |
| E7.3 | **Catatan penjualan internal dikutip apa adanya.** Master brief menulis biaya konsultasi sebagai alat penyaring calon klien; kalimat itu tayang ke calon klien yang sedang disaring                                                                                                        | "biaya konsultasi bersifat opsional sebagai penyaring"                                                                                                                                                                                                                                                                                       |
| E7.4 | **Label templat dipakai sebagai judul.** Nama medan dari `Peta website` dicetak mentah                                                                                                                                                                                                     | "Cara membeli atau alur kerja" · "Temukan situasinya" · "Masalah yang dibaca" · "Lihat status kontak"                                                                                                                                                                                                                                        |
| E7.5 | **Kalimat yang kosong atau membicarakan halaman itu sendiri**                                                                                                                                                                                                                              | "Masalah datang sebelum daftar layanan." (prinsip internal "Cara memakai" dijadikan judul) · "Tiga wilayah, disebut apa adanya." · "Urutannya tetap. Tidak ada angka, tarif, atau simulasi penghasilan di halaman ini." (halaman membicarakan dirinya sendiri)                                                                               |
| E7.6 | **Pengulangan tanpa informasi baru.** Judul hero diulang sebagai label datum di bawahnya; tiga situasi mengulang pernyataan payung; pintu unit mengulang header unit kata demi kata                                                                                                        | Beranda                                                                                                                                                                                                                                                                                                                                      |
| E7.7 | **Pelanggaran Suara dan gaya.** Aturan 9: tanda pisah panjang di semua butir cara membeli Konstruksi A, Teknologi A, dan Peekabo A. Label "NOTE:" berbahasa Inggris di halaman Indonesia                                                                                                   | "Eceran per masalah — saat Anda tahu…"                                                                                                                                                                                                                                                                                                       |
| E7.8 | **Setiap ajakan berakhir di alamat yang tidak aktif.** Tidak ada satu jalur pun dari halaman ke percakapan                                                                                                                                                                                 | "Kirim surel ke Arthur" → `kontak@arth.invalid`                                                                                                                                                                                                                                                                                              |
| E7.9 | **Tidak ada padanan Inggris yang bermakna.** Teks Inggris di `messages/en.json` diterjemahkan kata demi kata dari istilah internal, sehingga dwibahasa tidak bisa dibangun di atasnya. Diperlukan glosarium dua bahasa (sisi, bab, celah, lapis, unit) dan aturan suara Inggris lebih dulu | "{count} reader sides" · "Problems we read" · "Choose your position" · "Technically fluent" · "Chapters available to read."                                                                                                                                                                                                                  |

### E8. Sentuhan desain yang hilang (ditambahkan pemilik)

| No.  | Temuan                                                                                                                                                                                                                                                           | Bukti                                                                                             |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| E8.1 | **Menu ponsel kehilangan ukuran display-nya.** Di `main` tiga kata mengisi layar pada 80,6 px Syne. Di branch lima tautan jatuh ke 28,4 px, karena ukuran semua tautan dihitung dari label terpanjang ("Cara kami bekerja", 17 huruf)                            | `--fit-chars` di `components/layout/header`; ukur `getComputedStyle` pada 390 × 844               |
| E8.2 | **Navigasi desktop dari tiga menjadi lima tautan mono huruf besar**, satu di antaranya 147 px ("CARA KAMI BEKERJA") di samping tautan 52–86 px. Ritme baris hilang, dan pengalih EN/ID di kanan ikut hilang sehingga sisi kanan header kosong kecuali kotak cari | Ukur posisi dan lebar tautan, 1440 × 900                                                          |
| E8.3 | **Beranda tanpa satu pun gambar, pelat, atau momen besar** sesudah hero (E1). Isinya tinggal judul, paragraf, dan garis tipis berulang dengan ritme yang sama                                                                                                    | 0 gambar; 6 momen, 3 di antaranya bingkai situs (`offline-notice`, `route-marker`, `back-to-top`) |
| E8.4 | **Hierarki tipografi datar.** Judul seksi, judul pintu, dan judul situasi memakai ukuran yang hampir sama; kontras ukuran yang dulu dibawa pelat dan angka 01/04 tidak diganti                                                                                   | Tangkapan layar beranda dan unit                                                                  |
| E8.5 | Tombol TUTUP di ponsel meluber keluar lingkarannya. **Sudah ada di `main`**, bukan regresi branch                                                                                                                                                                | Tangkapan menu ponsel kedua situs                                                                 |

## Kesimpulan pemilik

Pemilik menyatakan F3 **perlu direvisi**. Dasarnya E6, E7, dan E8: layout,
tulisan, dan sentuhan desain harus dibereskan sebelum gerak dan dwibahasa
dibangun di atasnya.

## F. Yang perlu diputuskan pemilik

1. **Bahasa.** Kembalikan ID/EN sekarang (perlu teks Inggris untuk beranda,
   unit, dan sisi, dan aturan suara Inggris di K2), atau tetap Indonesia saja
   dan alihkan seluruh `/en/*` ke `/id/*` sesuai K2. Keadaan sekarang (C2)
   bukan salah satunya. Pemilik meminta ini ditahan sampai inventaris E
   didefinisikan.
2. **Visual beranda.** Usulan: pelat gambar kerja SVG per unit (F4-05) ditarik
   ke F3, lalu lintasan yang di-pin dikembalikan dengan pelat itu sebagai ganti
   foto dummy. Material WebGL bisa memakai pelat yang sama (rencana menyebut
   `MaterialImage` mampu), dengan jalur tanpa WebGL tetap ada (aturan #14).
3. **Kartu.** Rancang ulang pintu unit, pintu sisi, dan kartu offer sebagai
   satu keluarga: tinggi mengikuti isi, satu tanda gambar kerja per kartu, grid
   yang tidak meninggalkan yatim untuk 3–7 kartu.

## G. Yang sudah benar

Model isi Sanity, penjaga Zod dan placeholder, gerbang `disetujui` di jalur
publik, pemisahan draft dan published, medan internal yang tidak
diproyeksikan, jalur tanpa JavaScript, dan keadaan akhir reduced motion pada
blok baru tersusun rapi dan sesuai Model isi Sanity. Temuan di atas soal
tampilan, bahasa, dan proses uji, bukan soal fondasi datanya.
