# F4-06 — Ukur di perangkat nyata

Paket F4-06 dari _Rencana Implementasi Website Arthur_. Selesai bila LCP, INP,
dan CLS setiap template diukur di laptop dan di satu ponsel kelas menengah
lewat 4G yang dibatasi, dan setiap hasil di atas ambang "baik" dibawa ke
pemilik bersama pilihan perbaikannya.

Dokumen ini memuat bagian agen, yaitu pengukuran lab di GitHub Actions terhadap
produksi, dan cara mengukur untuk bagian pemilik, yaitu ponsel sendiri (§6).
Ditulis 6–7 November 2026, PR #78.

Ambang "baik" yang dipakai: **LCP 2,5 s, CLS 0,1, INP 200 ms**. Lab tidak
punya INP (§1), jadi **TBT 200 ms** dipakai sebagai proksinya, dan disebut
begitu.

## Ringkasan

- **Desktop (proksi laptop): baik di ke-13 template, di kedua run.** LCP
  0,63–0,80 s, CLS paling besar 0,015, TBT paling besar 32 ms.
- **CLS: baik di semua template dan semua varian.** Paling besar 0,029.
- **LCP ponsel: di atas 2,5 s di ke-13 template,** baik dimodelkan
  (3,16–3,93 s) maupun dengan pembatasan yang benar-benar diterapkan
  (2,51–3,24 s). Elemen LCP-nya sudah ada di lukisan pertama; yang terlambat
  adalah lukisan pertama itu sendiri. Di 4G yang lambat, lukisan pertama
  menunggu berkas CSS terakhir (enam sampai delapan per halaman), yang berbagi
  jalur dengan huruf dan JavaScript yang diminta bersamaan (§3).
- **TBT ponsel (proksi INP): di atas 200 ms di lima template** dalam sedikitnya
  satu pengukuran: beranda (di ketiganya), unit, `/work`, halaman pekerjaan, dan
  sisi jaringan. Angkanya sangat bergantung pada kecepatan runner (§2, §4.B).
- **Satu temuan kecil:** huruf "ū" di catatan kaki ("Satūs") membuat browser
  mengunduh satu berkas huruf 131 KB di jaringan lambat (§4.A).
- **INP sungguhan hanya bisa datang dari ponsel pemilik (§6).**
- **Tidak ada perubahan kode situs di PR ini.** Setiap temuan adalah
  pertukaran yang keputusannya milik pemilik (§5); pilihan perbaikannya di §4.
- **Sesudah F4-06 perbaikan (§8, produksi `ac9eb5c`):** lukisan pertama ponsel
  di 4G lambat 0,95–1,25 s dari 2,5–3,2 s; teks LCP menunggu hurufnya sendiri
  dan tampil 0,2–1,4 s lebih lambat di 11 template, karena sebelumnya dilukis
  dengan huruf pengganti. A3 adalah tuas berikutnya.

## 1. Cara diukur, dan batasnya

- **Di mana.** Workflow `.github/workflows/lighthouse-ukur.yml`, dijalankan
  manual: Actions → Lighthouse ukur → Run workflow. Skripnya
  `.github/scripts/lighthouse-ukur.mjs`. Tidak ada yang dijalankan di laptop.
- **Apa.** Lighthouse 13.5.0 (disematkan) dengan Chrome milik runner
  (HeadlessChrome 156), hanya kategori _performance_, terhadap
  https://arth-test-01.vercel.app. Tiga run per halaman per varian; yang
  dilaporkan adalah median setiap metrik, dan rentangnya ikut ditulis.
- **Dua pengukuran lengkap.** Run 42247088223 (head `d86d7c6`, tiga varian)
  dan run 42249548838 (head `17dac71`, empat varian). Ringkasan setiap run ada
  di halaman run dan di artefak `lighthouse-ringkasan` (90 hari); setiap
  laporan Lighthouse ada di artefak `lighthouse-<varian>` (30 hari).
- **Halaman.** Satu halaman per template yang disebut paket:

  | Template      | Halaman yang diukur                                                          |
  | ------------- | ---------------------------------------------------------------------------- |
  | Beranda       | `/id`                                                                        |
  | Unit          | `/id/konstruksi`                                                             |
  | Sisi          | `/id/konstruksi/pelaku-proyek`                                               |
  | Bab           | `/id/konstruksi/pelaku-proyek/hulu-hilir`                                    |
  | Offer         | `/id/teknologi/siap-pakai/kuliner/bot-pesan-antar-whatsapp`                  |
  | Sisi jaringan | `/id/peekabo/jaringan`                                                       |
  | Halaman tetap | `/id/layanan`, `/id/metode`, `/id/pembayaran`, `/id/kebijakan`, `/id/kontak` |
  | Katalog       | `/id/work`, `/id/work/arus-balik`                                            |

- **Varian.**
  - `mobile`: profil bawaan Lighthouse, layar 412 × 823 (moto g power 2022),
    150 ms RTT, 1,6 Mbps, CPU diperlambat 4×; Lighthouse menyebut jaringan ini
    _slow 4G_. Halaman dimuat tanpa pembatasan, lalu metriknya dimodelkan dari
    jejaknya (model Lantern). Ini angka yang sejenis dengan PageSpeed Insights.
  - `mobile-applied`: profil yang sama, tetapi benar-benar diterapkan ke browser
    selama memuat (`--throttling-method=devtools`), sehingga metriknya
    teramati, bukan dimodelkan. Ditambahkan sesudah run pertama; alasannya di
    §3.
  - `desktop`: preset desktop Lighthouse (1350 × 940, 40 ms RTT, 10 Mbps, CPU
    tidak diperlambat), dengan WebGL dimatikan di browser.
  - `desktop-webgl`: tiga rute WebGL dengan SwiftShader diizinkan, sehingga
    kanvas terpasang dan three.js diunduh dan dijalankan. GPU-nya perangkat
    lunak, jadi waktu _main thread_-nya batas atas.
- **Sebelum diukur,** setiap halaman diminta sekali. Semua menjawab 200 tanpa
  pengalihan; Vercel menjawab dari cache (`PRERENDER` atau `HIT`).

Batasnya, yang harus dibaca bersama angkanya (aturan keras #19):

1. **Ini lab, bukan lapangan.** Tidak ada pengguna sungguhan di angka ini.
2. **Tidak ada INP.** Mode navigasi Lighthouse tidak melihat interaksi apa pun.
   TBT dilaporkan sebagai proksinya; TBT rendah tidak menjamin INP baik, dan
   sebaliknya.
3. **Runner bukan ponsel.** Perlambatan CPU 4× diterapkan pada CPU runner
   GitHub yang kebetulan didapat. `benchmarkIndex` runner dicatat per varian;
   antara dua run ia berbeda sampai 1,7 kali, dan TBT ponsel ikut naik 1,8
   sampai 3,4 kali (§2). Angka itu dicatat untuk membandingkan, tidak dipakai untuk
   mengoreksi.
4. **Runner tidak di Indonesia.** Waktu respons server diamati dari jaringan
   GitHub; jarak pembaca di Indonesia ke edge Vercel berbeda.
5. **Setiap run adalah kunjungan pertama.** Lighthouse menghapus penyimpanan
   sebelum setiap run, jadi tirai pembuka yang hanya muncul sekali per sesi
   ikut tampil di setiap pengukuran (§3).
6. **Pembatasan yang diterapkan DevTools bukan jaringan 4G sungguhan.** Ia
   menambah latensi per permintaan dan membatasi lebar pita, tetapi tidak
   meniru cara jaringan nyata dan browser mendahulukan permintaan. Ponsel
   pemilik di 4G sungguhan adalah penentunya (§6).

## 2. Hasil

Median tiga run per halaman. "Di atas baik" ditandai bila median di sedikitnya
satu run melewati ambang; bila hanya satu run, run itu disebut.

### Ponsel, dimodelkan (`mobile`)

`benchmarkIndex` runner: run 1 4160, run 2 2428.

| Template      | LCP s (run 1 / run 2) | CLS terbesar | TBT ms (run 1 / run 2) | FCP s (run 2) | Di atas "baik"   |
| ------------- | --------------------- | ------------ | ---------------------- | ------------- | ---------------- |
| Beranda       | 3,78 / 3,77           | 0,000        | 260 / 521              | 1,22          | LCP, TBT         |
| Unit          | 3,49 / 3,62           | 0,000        | 88 / 243               | 1,07          | LCP, TBT (run 2) |
| Sisi          | 3,48 / 3,62           | 0,000        | 51 / 172               | 1,07          | LCP              |
| Bab           | 3,33 / 3,39           | 0,016        | 76 / 151               | 1,06          | LCP              |
| Offer         | 3,33 / 3,46           | 0,000        | 67 / 150               | 1,11          | LCP              |
| Sisi jaringan | 3,48 / 3,62           | 0,000        | 84 / 176               | 1,07          | LCP              |
| /layanan      | 3,33 / 3,32           | 0,000        | 88 / 192               | 1,07          | LCP              |
| /metode       | 3,33 / 3,31           | 0,000        | 57 / 152               | 1,06          | LCP              |
| /pembayaran   | 3,18 / 3,16           | 0,000        | 66 / 116               | 0,92          | LCP              |
| /kebijakan    | 3,18 / 3,17           | 0,000        | 42 / 128               | 0,96          | LCP              |
| /kontak       | 3,41 / 3,39           | 0,000        | 67 / 151               | 1,07          | LCP              |
| /work         | 3,93 / 3,92           | 0,000        | 116 / 316              | 1,11          | LCP, TBT (run 2) |
| /work/<slug>  | 3,93 / 3,92           | 0,000        | 92 / 254               | 1,07          | LCP, TBT (run 2) |

### Ponsel, pembatasan diterapkan (`mobile-applied`, run 2)

`benchmarkIndex` runner: 2976.

| Template      | LCP s (rentang)  | CLS (rentang)       | TBT ms (rentang) | FCP s | Di atas "baik" |
| ------------- | ---------------- | ------------------- | ---------------- | ----- | -------------- |
| Beranda       | 3,04 (3,02–3,80) | 0,000 (0,000–0,000) | 885 (794–1777)   | 3,04  | LCP, TBT       |
| Unit          | 3,01 (2,95–3,02) | 0,014 (0,014–0,014) | 332 (329–345)    | 3,01  | LCP, TBT       |
| Sisi          | 2,95 (2,94–2,96) | 0,000 (0,000–0,000) | 168 (165–176)    | 2,95  | LCP            |
| Bab           | 2,79 (2,73–2,82) | 0,016 (0,016–0,016) | 178 (174–180)    | 2,79  | LCP            |
| Offer         | 2,79 (2,77–2,81) | 0,000 (0,000–0,000) | 143 (140–148)    | 2,79  | LCP            |
| Sisi jaringan | 2,94 (2,92–3,02) | 0,013 (0,000–0,013) | 240 (225–261)    | 2,94  | LCP, TBT       |
| /layanan      | 2,70 (2,68–2,73) | 0,000 (0,000–0,000) | 175 (172–186)    | 2,70  | LCP            |
| /metode       | 2,73 (2,70–2,73) | 0,000 (0,000–0,000) | 152 (147–153)    | 2,73  | LCP            |
| /pembayaran   | 2,51 (2,50–2,54) | 0,029 (0,029–0,029) | 90 (85–92)       | 2,51  | LCP            |
| /kebijakan    | 2,53 (2,51–2,55) | 0,007 (0,007–0,007) | 93 (92–94)       | 2,53  | LCP            |
| /kontak       | 2,81 (2,76–2,83) | 0,000 (0,000–0,000) | 118 (115–119)    | 2,81  | LCP            |
| /work         | 3,15 (3,15–3,19) | 0,001 (0,001–0,001) | 427 (415–437)    | 3,15  | LCP, TBT       |
| /work/<slug>  | 3,24 (3,19–3,32) | 0,000 (0,000–0,000) | 360 (342–378)    | 3,24  | LCP, TBT       |

### Desktop, tanpa WebGL (`desktop`)

`benchmarkIndex` runner: run 1 3412, run 2 2958.

| Template      | LCP s (run 1 / run 2) | CLS terbesar | TBT ms (run 1 / run 2) | FCP s (run 2) | Di atas "baik" |
| ------------- | --------------------- | ------------ | ---------------------- | ------------- | -------------- |
| Beranda       | 0,72 / 0,71           | 0,000        | 5 / 32                 | 0,31          | —              |
| Unit          | 0,73 / 0,71           | 0,000        | 0 / 0                  | 0,31          | —              |
| Sisi          | 0,72 / 0,70           | 0,000        | 0 / 0                  | 0,31          | —              |
| Bab           | 0,69 / 0,70           | 0,003        | 0 / 0                  | 0,31          | —              |
| Offer         | 0,69 / 0,70           | 0,000        | 0 / 0                  | 0,31          | —              |
| Sisi jaringan | 0,72 / 0,70           | 0,000        | 0 / 0                  | 0,30          | —              |
| /layanan      | 0,69 / 0,67           | 0,000        | 0 / 0                  | 0,31          | —              |
| /metode       | 0,68 / 0,67           | 0,000        | 0 / 0                  | 0,31          | —              |
| /pembayaran   | 0,64 / 0,63           | 0,000        | 0 / 0                  | 0,28          | —              |
| /kebijakan    | 0,73 / 0,63           | 0,015        | 0 / 0                  | 0,28          | —              |
| /kontak       | 0,69 / 0,67           | 0,000        | 0 / 0                  | 0,31          | —              |
| /work         | 0,77 / 0,78           | 0,000        | 1 / 0                  | 0,31          | —              |
| /work/<slug>  | 0,80 / 0,78           | 0,000        | 0 / 0                  | 0,31          | —              |

### Desktop dengan WebGL (`desktop-webgl`)

`benchmarkIndex` runner: run 1 2439, run 2 3971. JavaScript terunduh dengan
WebGL sekitar 300 KB lebih banyak di ketiga rute, di kedua run; rinciannya di
`docs/F4-04-WEBGL.md` §6 (PR #77).

| Template     | LCP s (run 1 / run 2) | CLS terbesar | TBT ms (run 1 / run 2) | FCP s (run 2) | Di atas "baik" |
| ------------ | --------------------- | ------------ | ---------------------- | ------------- | -------------- |
| Beranda      | 0,74 / 0,70           | 0,000        | 196 / 30               | 0,30          | —              |
| /work        | 0,77 / 0,78           | 0,000        | 35 / 0                 | 0,31          | —              |
| /work/<slug> | 0,78 / 0,78           | 0,000        | 28 / 0                 | 0,31          | —              |

Di run 1, TBT beranda dengan WebGL bermedian 196 ms, tepat di bawah ambang,
dengan satu run 661 ms.

## 3. LCP ponsel: model, lalu kenyataan

**Di model (`mobile`),** LCP 3,16–3,93 s di ke-13 template, padahal FCP
sekitar 1,1 s. Jejak yang sama, yang dimuat tanpa pembatasan, menunjukkan
elemen LCP sudah dilukis di lukisan pertama: LCP teramati sama dengan FCP
teramati di 12 template (misalnya `/metode` 248/248 ms dan beranda 319/319 ms,
median run 2), dan 15 ms sesudahnya di `/work`. Elemen LCP-nya teks di layar
pertama (judul, kutipan, atau paragraf); di `/work` dan halaman pekerjaan,
sampul pertama.

Model Lantern menganggap LCP menunggu semua yang diminta sebelum LCP teramati.
Di jejak tanpa pembatasan itu (laporan pertama setiap halaman, run 2) jumlahnya
473–612 KB per halaman: HTML 16–35 KB, CSS 25–45 KB, huruf 206 KB, JavaScript
219–304 KB. FCP dimodelkan hanya dari yang memblokir render, sehingga dua angka
itu terpisah sejauh itu.

**Dengan pembatasan yang diterapkan (`mobile-applied`),** LCP 2,51–3,24 s, dan
**LCP sama dengan FCP di setiap halaman.** Jarak antara FCP dan LCP di model
memang artefak model, tetapi lukisan pertama itu sendiri terlambat. Di laporan
pertama setiap halaman:

- HTML selesai di 0,68–0,92 s;
- berkas CSS terakhir (dari enam sampai delapan) baru selesai di 2,39–3,20 s,
  dan lukisan pertama mengikutinya (2,50–3,80 s);
- sebelum lukisan pertama, 604–743 KB sudah diminta tetapi baru 134–295 KB yang
  selesai. Yang diminta bersamaan dengan CSS: empat berkas huruf yang
  di-_preload_ dengan prioritas tinggi (206 KB) dan 219–304 KB JavaScript;
  satu berkas huruf lagi (131 KB, §4.A) diminta tepat menjelang lukisan
  pertama.

Jadi di 4G yang lambat, CSS yang kecil (24–45 KB) yang memblokir render
berbagi lebar pita dengan sekitar setengah megabita lain, dan lukisan pertama
menunggunya. Seberapa besar efek ini di jaringan 4G sungguhan, yang
mendahulukan permintaan dengan cara yang tidak ditiru DevTools, hanya bisa
dijawab ponsel (§6).

**Tirai pembuka tidak terlihat oleh LCP, tetapi terlihat oleh pembaca.**
_Filmstrip_ Lighthouse untuk `/metode` (run 42247088223, laporan pertama
`mobile`, dimuat tanpa pembatasan) menunjukkan tirai gelap bertulisan Arthur
di 750 ms dan halaman di 1125 ms, sementara LCP tercatat di 276 ms, di bawah
tirai. Tirai tidak mengubah
angka LCP, dan pada kunjungan pertama isi halaman tampil sekitar satu detik
sesudah LCP-nya. Itu keputusan rancangan F4-03 (tirai sekali per sesi), bukan
cacat; dicatat supaya angka LCP tidak dibaca sebagai "isi tampil saat itu".

## 4. Di atas ambang "baik", dan pilihan perbaikannya

Tidak satu pun di bawah ini dikerjakan di PR ini (§5). Tidak ada angka
penghematan yang dijanjikan: setiap pilihan harus diukur ulang dengan workflow
yang sama sesudah dikerjakan, dan di ponsel.

### A. LCP ponsel (ke-13 template)

1. **CSS di dalam HTML.** Mekanisme yang terukur di §3 adalah lukisan pertama
   menunggu berkas CSS terakhir. Next.js 16.3.4 menyediakan
   `experimental.inlineCss`, yang menaruh CSS di `<head>` sebagai `<style>`
   sehingga tiba bersama HTML (fitur eksperimental; dokumentasinya ada di
   `node_modules/next/dist/docs`). Pertukarannya: CSS tidak lagi tersimpan di
   cache antar halaman dan setiap halaman lebih besar. Perlu dicek terhadap CSP
   dan SRI situs. Menggabung berkas CSS lewat `cssChunking` sudah dicoba
   sebelumnya dan menghasilkan lebih banyak berkas (catatan di
   `next.config.ts`).
2. **Huruf.** Empat berkas, 206 KB, di-_preload_ dengan prioritas tinggi di
   setiap halaman (`lib/styles/fonts.ts`): Inter normal dan italic dengan sumbu
   `opsz`, Onest, dan Geist Mono. Pilihannya: mem-_preload_ hanya yang dipakai
   layar pertama, atau melepas sumbu `opsz` sehingga berkas Inter lebih kecil
   (kehilangan potongan Inter Display di ukuran judul). Pertukarannya: huruf
   yang datang belakangan terlihat berganti setelah teks tampil.
3. **Satu huruf "ū", 131 KB.** Catatan kaki setiap halaman berbunyi "Dibangun
   di atas Satūs oleh darkroom.engineering, …" (`messages/id.json`,
   `footer.builtOn`). "ū" ada di subset _latin-ext_ Inter, yang tidak
   di-_preload_, jadi browser mengunduh berkas itu (131 KB) hanya untuk satu
   huruf. Di semua 39 run `mobile-applied` berkas itu diminta, tepat menjelang
   lukisan pertama; di run tanpa pembatasan yang diperiksa hanya 2 dari 117.
   Mengapa berbeda belum dipastikan. Ia tidak menunda LCP, tetapi memakai lebar
   pita yang dibutuhkan JavaScript sesudahnya. Pilihannya keputusan isi:
   menulis "Satus", atau membiarkan.
4. **JavaScript.** 219–304 KB diminta sebelum lukisan pertama, semuanya
   _async_ berprioritas rendah tetapi berbagi jalur. Lighthouse menandai 25–57
   KiB JavaScript yang tidak terpakai per halaman dan sekitar 14 KiB _legacy
   JavaScript_ (sintaks dan _polyfill_ untuk browser lama) di setiap halaman.
   Pilihannya: pecah komponen klien di bawah lipatan dengan impor dinamis, dan
   tinjau target browser (`browserslist`); target browser adalah keputusan
   dukungan, bukan sekadar teknis. Catatan: total JavaScript di run tanpa
   pembatasan termasuk potongan rute lain yang di-_prefetch_ sesudah halaman
   dimuat (di `/metode`, lima skrip, 69 KB, di 473 ms).
5. **Terima, dan pantau.** Bila ponsel pemilik di 4G sungguhan (§6) memberi LCP
   di bawah 2,5 s, angka lab dibaca sebagai skenario jaringan yang lambat,
   bukan pengalaman pembaca biasa, dan workflow dijalankan ulang setelah
   perubahan besar.

### B. TBT ponsel (beranda, unit, `/work`, halaman pekerjaan, sisi jaringan)

| Template      | `mobile` run 1 | `mobile` run 2 | `mobile-applied` |
| ------------- | -------------- | -------------- | ---------------- |
| Beranda       | 260 ms         | 521 ms         | 885 ms           |
| Unit          | 88 ms          | 243 ms         | 332 ms           |
| /work         | 116 ms         | 316 ms         | 427 ms           |
| /work/<slug>  | 92 ms          | 254 ms         | 360 ms           |
| Sisi jaringan | 84 ms          | 176 ms         | 240 ms           |

Delapan template lain di bawah 200 ms di ketiga pengukuran. Yang terbaca dari
laporan `mobile-applied`:

- **Hidrasi React.** Tugas panjang terbesar di setiap template ada di runtime
  React (`2li3q7frhfbye.js`, 225 KB mentah, 72 KB terkompresi): 621 ms di
  beranda, 311 ms di `/work`, 258 ms di unit, 255 ms di halaman pekerjaan, 185
  ms di sisi jaringan, dan 140 ms di `/metode` yang tetap di bawah ambang. Itu
  hidrasi pohon halaman; makin besar pohonnya, makin panjang tugasnya.
- **Runtime gerak bersama.** Skrip kecil (`1hb6addeg678s.js`, 28 KB mentah)
  yang memuat jam animasi (Tempus), kait GSAP, dan pengamat reveal. Waktu CPU
  yang teratribusi kepadanya selama pemuatan: 360–842 ms di ke-13 template.
- **Beranda** menghabiskan 928 ms untuk _Style & Layout_ di `mobile-applied`,
  dan laporan `mobile` run 1 menandai _forced reflow_ (tata letak dibaca
  sesudah ditulis) sekitar 38 ms.

Pilihan:

1. **Pecah hidrasi.** Bungkus bagian di bawah lipatan dengan `<Suspense>`;
   React menghidrasi tiap batas terpisah dan memberi jeda di antaranya, sehingga
   satu tugas panjang menjadi beberapa tugas pendek.
2. **Kurangi yang harus dihidrasi.** Jadikan bagian yang tidak interaktif Server
   Component.
3. **Tunda gerak yang belum terlihat.** Bangun timeline GSAP (lintasan pelat di
   beranda, gerak katalog) baru ketika bagiannya mendekati layar.

### C. Beranda di desktop dengan WebGL

Tidak di atas ambang menurut median, tetapi dekat: 196 ms di run 1 dengan satu
run 661 ms, 30 ms di run 2. Pilihan ada di `docs/F4-04-WEBGL.md` (PR #77):
lepas wash hero, atau lepas WebGL di beranda. Satu pilihan tambahan: pasang
kanvas sesudah browser senggang (`requestIdleCallback`), supaya evaluasi
three.js keluar dari jendela pemuatan.

### D. Data lapangan yang terus berjalan

Situs belum mengumpulkan Web Vitals dari pembacanya. Dua jalan, keduanya
keputusan pemilik:

1. **Vercel Speed Insights.** Butuh komponen di kode dan pengaktifan di dasbor
   Vercel. Dasbor adalah wewenang pemilik (aturan keras #25); biaya dan batas
   paketnya diperiksa pemilik di sana.
2. **Pelapor `web-vitals` sendiri.** Kode kecil yang mengirim LCP, CLS, dan INP
   ke titik akhir milik situs; butuh tempat menyimpan dan kebijakan privasi
   yang menyebutnya.

Laporan CrUX publik (data lapangan yang dipakai PageSpeed Insights) baru
mungkin setelah halaman bisa diindeks di F5-05 dan lalu lintasnya cukup.

## 5. Yang tidak diperbaiki di PR ini

Tidak ada perubahan kode situs. Paket meminta hanya memperbaiki yang jelas
cacat dan murah. Setiap temuan di §4 adalah pertukaran yang keputusannya milik
pemilik: CSS di HTML lawan cache, _preload_ huruf lawan kilasan huruf, ejaan
"Satūs" lawan 131 KB, gerak dan hidrasi lawan waktu _main thread_.

## 6. Bagian pemilik: mengukur di ponsel sendiri

Tujuannya: LCP, CLS, dan INP untuk ke-13 halaman di §1, di satu ponsel kelas
menengah, lewat 4G. Hanya ini yang bisa memberi INP, dan hanya ini yang
mengukur ponsel sungguhan.

**Yang dibutuhkan:** ponsel Android dengan Chrome, laptop dengan Chrome, kabel
USB, dan data seluler 4G di ponsel dengan Wi-Fi ponsel dimatikan.

1. **Aktifkan debugging USB di ponsel.** Setelan → Tentang ponsel → ketuk
   _Nomor build_ tujuh kali. Lalu buka _Opsi pengembang_ dan nyalakan
   _Debugging USB_. Letak menunya berbeda per merek.
2. **Sambungkan ke laptop.** Pasang kabel, buka `chrome://inspect/#devices` di
   Chrome laptop, dan izinkan debugging bila ponsel bertanya.
3. **Buka halaman di ponsel.** Di Chrome ponsel, buka tab Samaran baru dan
   ketik alamat halaman pertama dari §1. Tab Samaran baru untuk setiap halaman
   membuat setiap kunjungan menjadi kunjungan pertama, sama seperti lab.
4. **Periksa dari laptop.** Di `chrome://inspect`, di bawah nama ponsel, klik
   **inspect** pada tab itu. DevTools terbuka untuk tab di ponsel.
5. **Baca LCP dan CLS.** Buka panel **Performance**. Bila panel menampilkan
   **Live metrics**, muat ulang halaman (Ctrl+R di jendela DevTools), tunggu
   halaman tenang, lalu baca LCP dan CLS. Bila tidak, klik tombol
   _Record and reload_, tunggu rekaman selesai, lalu baca LCP dan CLS di
   rekaman itu.
6. **Baca INP.** Di ponsel, pakai halaman seperti biasa: ketuk menu, ketuk satu
   tombol atau tautan di halaman, gulir. Baca INP di Live metrics, atau rekam
   dengan tombol rekam biasa sambil mengetuk dan baca jalur _Interactions_.
   Jangan pindah halaman sebelum angkanya dicatat.
7. **Catat,** lalu ulangi untuk halaman berikutnya.

| Halaman | LCP (s) | CLS | INP (ms) | Catatan (ponsel, sinyal) |
| ------- | ------- | --- | -------- | ------------------------ |
| `/id`   |         |     |          |                          |
| …       |         |     |          |                          |

Yang dihitung "baik": LCP paling lama 2,5 s, CLS paling besar 0,1, INP paling
lama 200 ms. Angka di atas itu dibawa bersama pilihan di §4.

Catatan:

- **iPhone** butuh Mac untuk memeriksa Safari dari jauh. Tanpa Mac, pakai ponsel
  Android.
- **Laptop** bisa diukur dengan cara yang sama tanpa kabel: buka halaman di
  Chrome laptop, DevTools → Performance → Live metrics. Itu angka laptop
  sungguhan, pelengkap varian `desktop` di §2.
- **Kunjungan kedua dalam satu sesi** (pindah halaman lewat tautan di situs,
  bukan tab baru) tidak memutar tirai dan memakai JavaScript yang sudah
  tersimpan. Boleh dicatat terpisah; lab di §2 hanya mengukur kunjungan
  pertama.
- **Menjalankan ulang lab** sesudah perubahan: Actions → Lighthouse ukur → Run
  workflow di `main`, dengan masukan bawaan. Ringkasannya muncul di halaman run.

## 7. Yang tidak dikerjakan

- **Ponsel dan laptop sungguhan.** Bagian agen hanya lab. Angka lapangan
  datang dari §6.
- **INP.** Tidak ada di lab; lihat §1.
- **Perbaikan.** Tidak ada yang dikerjakan; lihat §5.
- **Penyebab perbedaan berkas huruf latin-ext** antara run diterapkan dan run
  tanpa pembatasan belum dipastikan (§4.A butir 3).
- **Kalibrasi CPU.** Perlambatan 4× tidak disesuaikan dengan `benchmarkIndex`
  runner; dua run dengan runner berbeda dilaporkan berdampingan, tidak
  dirata-rata.
- **Data lapangan berkelanjutan.** Situs belum mengumpulkan Web Vitals dari
  pembaca (tidak ada Vercel Speed Insights atau pelapor `web-vitals`), dan
  situs masih `noindex`, jadi laporan CrUX publik juga belum ada. Pilihannya di
  §4.D.

## 8. Sesudah F4-06 perbaikan: produksi `ac9eb5c`

Yang masuk `main` lewat PR #80 (`ac9eb5c`, 13 November 2026), sesudah pemilik
menjawab "Ya, merge #80" atas dua biaya yang dibawa kepadanya:

- **CSS di dalam HTML** (`experimental.inlineCss`, §4.A butir 1);
- **`font-display: block`** untuk Onest, Inter, dan Geist Mono. Pemilik menolak
  teks yang tampil dulu dengan huruf pengganti lalu berganti ("SAYA INGIN
  DESAINNYA TERLIHAT JELAS juga"), jadi teks menunggu hurufnya sendiri;
- **huruf pengganti yang diukur seukuran huruf aslinya**
  (`lib/styles/css/font-fallbacks.css`). Produksi sebelumnya tidak punya
  pengganti yang disesuaikan sama sekali.

Hidrasi dan kanvas beranda (#81) tidak masuk: B1 menyembunyikan isi dari
pembaca tanpa JavaScript, dan B2 serta C tidak terukur lebih baik daripada
selisih antar-run (lab A/B lewat masukan `ref`, #82).

Diukur ulang ke produksi sesudah produksi menyajikan `ac9eb5c` (stempel di
catatan kaki, 10.47 UTC): run 43411813922, workflow yang sama tanpa `ref`, empat
varian, median tiga run. **Angka lab dari produksi, bukan angka lapangan**
(aturan #19). TBT tetap proksi lab untuk INP, dan di sini tidak bisa dibaca
sebagai perubahan karena runner sesudahnya lebih lambat (`benchmarkIndex` di
tiap tabel). "Sebelum" adalah run 1 dan run 2 di §2.

### Ringkas

- **Lukisan pertama di ponsel dengan 4G lambat yang diterapkan: dari 2,5–3,2 s
  menjadi 0,95–1,25 s di ke-13 template.** Yang tampil pertama adalah bingkai
  dan warna halaman; teks menyusul dengan hurufnya sendiri.
- **LCP teks tampil lebih lambat di 11 template (0,2–1,4 s), dan ini bukan
  hurufnya yang datang lebih lambat.** Di produksi, berkas huruf yang
  di-_preload_ tiba sekitar 4,0–4,5 s di 4G lambat, sebelum maupun sesudah
  penggabungan. Sebelumnya, teks LCP dilukis 1,4–1,5 s sebelum hurufnya tiba
  (tiga template yang diperiksa, tabel di bawah), jadi dengan huruf pengganti;
  sekarang ia menunggu. Saat halaman pertama kali
  tampil dengan desainnya sendiri tidak mundur. `/work` dan halaman pekerjaan,
  yang LCP-nya gambar, jauh lebih cepat: 3,15 → 1,30 s dan 3,24 → 1,43 s.
- **Jendela tiga detik sempit di produksi.** Huruf terakhir layar pertama tiba
  3,0–3,1 s sesudah lukisan pertama di tiga template yang diperiksa, tepat di
  batas jendela _block_
  Chrome. Di sebagian muatan, huruf pengganti bisa tampil sesaat sebelum
  hurufnya tiba. Lab di runner memberi sekitar satu detik ruang; produksi
  tidak.
- **CLS:** kini nol di Unit, sisi jaringan, dan `/kebijakan` (sebelumnya
  0,014, 0,013, 0,007). `/pembayaran` 0,027 (sebelumnya 0,029); baru dan kecil
  di `/layanan` 0,006 dan `/kontak` 0,008. Yang tersisa berasal dari judul
  Onest yang patah barisnya berbeda dengan penggantinya. Semua jauh di bawah
  0,1.
- **Yang akan mempercepat huruf: A3, keputusan isi pemilik (§4.A butir 3).**
  Berkas latin-ext Inter (131,6 KB) untuk "ū" di catatan kaki kini diminta
  pada 0,9–1,5 s (sebelumnya 2,5–3,7 s), dengan prioritas di atas berkas yang
  di-_preload_, di koneksi HTTP/2 yang sama. HTML juga membesar karena CSS ada
  di dalamnya: 16–35 KB menjadi 39–77 KB terkompresi.
- **Desktop:** FCP 0,34–0,43 s (sebelumnya 0,28–0,31 s) dan LCP 0,69–0,82 s
  (sebelumnya 0,63–0,80 s), pada runner yang lebih lambat (`benchmarkIndex`
  2364, sebelumnya 2958–3412). Semua jauh di dalam "baik"; CLS tidak berubah.
- **Ponsel dimodelkan (`mobile`):** LCP sama atau sedikit lebih baik di 12
  template. `/pembayaran` satu-satunya yang bergeser jauh (LCP 3,16 → 3,76 s,
  FCP 0,92 → 1,66 s); penyebabnya belum diperiksa.

### Kapan huruf tiba, sebelum dan sesudah (`mobile-applied`; LCP median, waktu huruf dari run pertama)

| Template   | LCP sebelum → sesudah | Berkas _preload_ terakhir tiba, sebelum → sesudah | Berkas "ū" diminta, sebelum → sesudah |
| ---------- | --------------------- | ------------------------------------------------- | ------------------------------------- |
| Beranda    | 3,04 → 3,30 s         | 4,49 → 4,32 s                                     | 3,69 → 1,49 s                         |
| Unit       | 3,01 → 4,20 s         | 4,38 → 4,21 s                                     | 2,92 → 1,08 s                         |
| /kebijakan | 2,53 → 3,95 s         | 4,04 → 4,01 s                                     | 2,50 → 0,90 s                         |

### Tabel lengkap

#### Ponsel, dimodelkan (`mobile`)

`benchmarkIndex` runner: sebelum run 1 4160, run 2 2428; sesudah 2977.

| Template      | LCP s sebelum (run 1 / run 2) | LCP s sesudah | FCP s sebelum (run 2) | FCP s sesudah | TBT ms sebelum (run 1 / run 2) | TBT ms sesudah | CLS sebelum (terbesar) | CLS sesudah |
| ------------- | ----------------------------- | ------------- | --------------------- | ------------- | ------------------------------ | -------------- | ---------------------- | ----------- |
| Beranda       | 3,78 / 3,77                   | **3,77**      | 1,22                  | **1,37**      | 260 / 521                      | **412**        | 0,000                  | **0,000**   |
| Unit          | 3,49 / 3,62                   | **3,62**      | 1,07                  | **1,11**      | 88 / 243                       | **226**        | 0,000                  | **0,000**   |
| Sisi          | 3,48 / 3,62                   | **3,47**      | 1,07                  | **1,11**      | 51 / 172                       | **156**        | 0,000                  | **0,000**   |
| Bab           | 3,33 / 3,39                   | **3,02**      | 1,06                  | **1,11**      | 76 / 150                       | **136**        | 0,016                  | **0,000**   |
| Offer         | 3,33 / 3,46                   | **3,32**      | 1,11                  | **1,11**      | 67 / 150                       | **136**        | 0,000                  | **0,000**   |
| Sisi jaringan | 3,48 / 3,62                   | **3,47**      | 1,07                  | **1,17**      | 84 / 176                       | **183**        | 0,000                  | **0,000**   |
| /layanan      | 3,33 / 3,32                   | **3,32**      | 1,07                  | **1,11**      | 88 / 192                       | **181**        | 0,000                  | **0,000**   |
| /metode       | 3,33 / 3,31                   | **3,32**      | 1,06                  | **1,15**      | 57 / 152                       | **140**        | 0,000                  | **0,000**   |
| /pembayaran   | 3,18 / 3,16                   | **3,76**      | 0,92                  | **1,66**      | 66 / 116                       | **107**        | 0,000                  | **0,000**   |
| /kebijakan    | 3,18 / 3,17                   | **3,17**      | 0,96                  | **0,96**      | 42 / 128                       | **83**         | 0,000                  | **0,000**   |
| /kontak       | 3,41 / 3,39                   | **3,32**      | 1,07                  | **1,12**      | 67 / 151                       | **117**        | 0,000                  | **0,000**   |
| /work         | 3,93 / 3,92                   | **3,78**      | 1,11                  | **1,21**      | 116 / 316                      | **168**        | 0,000                  | **0,000**   |
| /work/<slug>  | 3,93 / 3,92                   | **3,92**      | 1,07                  | **1,15**      | 92 / 254                       | **226**        | 0,000                  | **0,000**   |

#### Ponsel, pembatasan diterapkan (`mobile-applied`)

`benchmarkIndex` runner: sebelum run 2 2976; sesudah 2457.

| Template      | LCP s sebelum | LCP s sesudah | FCP s sebelum | FCP s sesudah | TBT ms sebelum | TBT ms sesudah | CLS sebelum | CLS sesudah |
| ------------- | ------------- | ------------- | ------------- | ------------- | -------------- | -------------- | ----------- | ----------- |
| Beranda       | 3,04          | **3,30**      | 3,04          | **1,21**      | 885            | **1122**       | 0,000       | **0,000**   |
| Unit          | 3,01          | **4,20**      | 3,01          | **1,13**      | 332            | **440**        | 0,014       | **0,000**   |
| Sisi          | 2,95          | **3,18**      | 2,95          | **1,14**      | 168            | **258**        | 0,000       | **0,000**   |
| Bab           | 2,79          | **4,07**      | 2,79          | **1,12**      | 178            | **284**        | 0,016       | **0,016**   |
| Offer         | 2,79          | **3,06**      | 2,79          | **1,11**      | 143            | **234**        | 0,000       | **0,000**   |
| Sisi jaringan | 2,94          | **3,16**      | 2,94          | **1,16**      | 240            | **336**        | 0,013       | **0,000**   |
| /layanan      | 2,70          | **2,94**      | 2,70          | **1,10**      | 175            | **299**        | 0,000       | **0,006**   |
| /metode       | 2,73          | **3,89**      | 2,73          | **1,09**      | 152            | **241**        | 0,000       | **0,000**   |
| /pembayaran   | 2,51          | **2,98**      | 2,51          | **0,95**      | 90             | **154**        | 0,029       | **0,027**   |
| /kebijakan    | 2,53          | **3,95**      | 2,53          | **0,97**      | 93             | **153**        | 0,007       | **0,000**   |
| /kontak       | 2,81          | **3,04**      | 2,81          | **1,05**      | 118            | **212**        | 0,000       | **0,008**   |
| /work         | 3,15          | **1,30**      | 3,15          | **1,21**      | 427            | **557**        | 0,001       | **0,000**   |
| /work/<slug>  | 3,24          | **1,43**      | 3,24          | **1,25**      | 360            | **502**        | 0,000       | **0,000**   |

#### Desktop, tanpa WebGL (`desktop`)

`benchmarkIndex` runner: sebelum run 1 3412, run 2 2958; sesudah 2364.

| Template      | LCP s sebelum (run 1 / run 2) | LCP s sesudah | FCP s sebelum (run 2) | FCP s sesudah | TBT ms sebelum (run 1 / run 2) | TBT ms sesudah | CLS sebelum (terbesar) | CLS sesudah |
| ------------- | ----------------------------- | ------------- | --------------------- | ------------- | ------------------------------ | -------------- | ---------------------- | ----------- |
| Beranda       | 0,72 / 0,71                   | **0,79**      | 0,31                  | **0,43**      | 5 / 32                         | **30**         | 0,000                  | **0,000**   |
| Unit          | 0,73 / 0,71                   | **0,82**      | 0,31                  | **0,42**      | 0 / 0                          | **9**          | 0,000                  | **0,000**   |
| Sisi          | 0,72 / 0,70                   | **0,82**      | 0,31                  | **0,42**      | 0 / 0                          | **6**          | 0,000                  | **0,000**   |
| Bab           | 0,69 / 0,70                   | **0,71**      | 0,31                  | **0,34**      | 0 / 0                          | **0**          | 0,003                  | **0,003**   |
| Offer         | 0,69 / 0,70                   | **0,71**      | 0,31                  | **0,34**      | 0 / 0                          | **0**          | 0,000                  | **0,000**   |
| Sisi jaringan | 0,72 / 0,70                   | **0,82**      | 0,30                  | **0,42**      | 0 / 0                          | **6**          | 0,000                  | **0,000**   |
| /layanan      | 0,69 / 0,67                   | **0,69**      | 0,31                  | **0,36**      | 0 / 0                          | **2**          | 0,000                  | **0,000**   |
| /metode       | 0,68 / 0,67                   | **0,79**      | 0,31                  | **0,42**      | 0 / 0                          | **0**          | 0,000                  | **0,000**   |
| /pembayaran   | 0,64 / 0,63                   | **0,76**      | 0,28                  | **0,40**      | 0 / 0                          | **7**          | 0,000                  | **0,000**   |
| /kebijakan    | 0,73 / 0,63                   | **0,76**      | 0,28                  | **0,40**      | 0 / 0                          | **2**          | 0,000                  | **0,000**   |
| /kontak       | 0,69 / 0,67                   | **0,79**      | 0,31                  | **0,43**      | 0 / 0                          | **0**          | 0,000                  | **0,000**   |
| /work         | 0,77 / 0,78                   | **0,79**      | 0,31                  | **0,35**      | 1 / 0                          | **10**         | 0,000                  | **0,000**   |
| /work/<slug>  | 0,80 / 0,78                   | **0,79**      | 0,31                  | **0,36**      | 0 / 0                          | **2**          | 0,000                  | **0,000**   |

#### Desktop dengan WebGL (`desktop-webgl`)

`benchmarkIndex` runner: sebelum run 1 2439, run 2 3970; sesudah 2314.

| Template     | LCP s sebelum (run 1 / run 2) | LCP s sesudah | FCP s sebelum (run 2) | FCP s sesudah | TBT ms sebelum (run 1 / run 2) | TBT ms sesudah | CLS sebelum (terbesar) | CLS sesudah |
| ------------ | ----------------------------- | ------------- | --------------------- | ------------- | ------------------------------ | -------------- | ---------------------- | ----------- |
| Beranda      | 0,74 / 0,70                   | **0,70**      | 0,30                  | **0,34**      | 196 / 30                       | **148**        | 0,000                  | **0,000**   |
| /work        | 0,77 / 0,78                   | **0,78**      | 0,31                  | **0,34**      | 35 / 0                         | **25**         | 0,000                  | **0,000**   |
| /work/<slug> | 0,78 / 0,78                   | **0,78**      | 0,31                  | **0,35**      | 28 / 0                         | **18**         | 0,000                  | **0,000**   |
