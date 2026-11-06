# F4-04 — WebGL per halaman

Paket F4-04 dari _Rencana Implementasi Website Arthur_. Selesai bila pemilik
menyetujui daftar halaman yang memakai WebGL, dan jalur tanpa WebGL di setiap
halaman terlihat disengaja. Dokumen ini bagian agen: inventaris, pemeriksaan
jalur tanpa WebGL, tangkapan layar di CI, dan usulan daftar. Ditulis 6
November 2026 terhadap `main` `0b39bfe`, PR #77.

## Usulan untuk pemilik

| Rute                                              | Yang ditambahkan WebGL                                                                                                  | Yang dilihat pembaca tanpa WebGL                                                                                                 | Usulan                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `/id` (beranda)                                   | Wash hero berbutir di kanvas; tiga pelat gambar kerja di lintasan beranda menyala sebagai maket dan berputar ikut gulir | Gradien CSS dari token yang sama; tiga pelat SVG datar yang sama, dipin dan bergulir (di bawah _reduced motion_ berdiri di alur) | **Simpan**                                                                  |
| `/id/work`                                        | Permukaan material pada foto katalog: lengkung mengikuti penunjuk, hanyut pelan, geser ikut kecepatan gulir             | Foto `<img>` biasa, pelat yang tayang sejak Tahap 12a                                                                            | **Simpan apa adanya** (instruksi pemilik: `/work` tidak diubah); ikut F5-04 |
| `/id/work/<slug>`                                 | Permukaan material yang sama pada sampul pekerjaan                                                                      | Sampul `<img>` biasa                                                                                                             | **Simpan apa adanya**; ikut F5-04                                           |
| Rute lain (unit, sisi, bab, offer, halaman tetap) | Tidak ada                                                                                                               | —                                                                                                                                | **Tidak ditambah**                                                          |

Alasannya:

- **Beranda simpan.** Pelat yang menyala adalah momen gerak terbesar situs, dan
  hanya desktop dengan WebGL2 yang membayarnya. Ponsel, pembaca dengan
  _reduced motion_, dan browser tanpa WebGL tidak mengunduh three.js sama
  sekali (diuji, §2). Jalur tanpa WebGL adalah desain yang sama: gradien yang
  sama, pelat yang sama.
- **`/work` dan `/work/<slug>` simpan apa adanya.** Pemilik meminta `/work` dan
  katalog fotonya tetap seperti sekarang. Catatan: isi `/work` adalah proyek
  _fixture_ yang menunggu keputusan hapus di F5-04. Kalau `/work` pensiun di
  sana, dua dari tiga rute WebGL ikut pergi, dan WebGL tinggal di beranda.
- **Tidak menambah rute.** Halaman unit sudah diputuskan tidak memakai pelat
  menyala: pita gelap pembukanya dicat di DOM, dan pelat di kanvas akan tertutup
  cat itu atau bersambung kelihatan dengan DOM
  (`vault/webgl/plate-material/index.tsx`, R4). Halaman dokumen terang tidak
  punya permukaan yang bisa diambil alih kanvas. Menambah WebGL berarti
  menambah sekitar 300 KB JavaScript untuk desktop (§6) tanpa permukaan yang
  menunggu untuk dinyalakan.

Pilihan lain untuk pemilik, kalau biaya beranda dirasa terlalu besar:

1. **Lepas wash hero, simpan pelat.** Wash berbutir adalah rancangan yang sama
   dengan gradien CSS-nya (dua token yang sama, arah yang sama); bedanya butir
   halus. Hemat satu gambar layar penuh per bingkai. three.js tetap diunduh
   untuk pelat, jadi berat JavaScript tidak turun.
2. **Lepas WebGL di beranda.** Pelat SVG datar dan gradien CSS tetap. Hemat
   sekitar 300 KB JavaScript di desktop. Waktu _main thread_ yang dihemat
   bergantung pada mesin: di lab antara hampir nol dan sekitar 190 ms (§6).

Yang diminta dari pemilik: setujui tabel di atas, atau pilih salah satu
pilihan. Juga keputusan tentang vonis perangkat di §3.

## 1. Inventaris: tiga rute, dikonfirmasi

`docs/MOTION-SPEC.md` §11.1 menyebut tiga rute membawa three.js: beranda,
`/work`, dan halaman pekerjaan. Itu benar di `0b39bfe`:

- **Kanvas akar hanya dipasang lewat `<Wrapper webgl>`.** Tepat tiga halaman
  memberi prop itu: `app/[locale]/page.tsx`, `app/[locale]/work/catalogue.tsx`,
  dan `app/[locale]/work/[slug]/page.tsx`. `app/[locale]/layout.tsx` merender
  `<OptionalFeatures />` tanpa `webgl`, jadi tidak ada kanvas bersama di
  layout.
- **Isi kanvas hanya masuk lewat `<WebGLTunnel>`,** dan pemakainya hanya tiga
  komponen di `vault/webgl/`. `SceneShell` dipakai `vault/blocks/hero`, yang
  hanya dipakai beranda. `PlateMaterial` hanya dipakai beranda. `MaterialImage`
  dipakai `project-card` (lewat `project-grid` dengan `material`, hanya
  `/work`) dan `project-hero` (hanya halaman pekerjaan). Tidak ada rute yang
  memakai adegan tanpa memasang kanvasnya.

| Rute              | Prop `Wrapper`                      | Adegan dan material                                                                                                       | Penanda DOM yang tetap                                      |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `/id`             | `webgl gsap`, tanpa `simTypes`      | `vault/webgl/scene-shell` (`GradientScene`: rampa diagonal dan butir) di hero; `vault/webgl/plate-material` di tiga pelat | `[data-accent-region]`, `[data-plate-material]` dan SVG-nya |
| `/id/work`        | `webgl simTypes={['flowmap']} gsap` | `vault/webgl/material-image` di setiap sampul katalog, membaca _flowmap_ penunjuk                                         | `[data-material-shell]` dan `<img>`-nya                     |
| `/id/work/<slug>` | `webgl simTypes={['flowmap']} gsap` | `vault/webgl/material-image` di sampul `project-hero`                                                                     | `[data-material-shell]` dan `<img>`-nya                     |

## 2. Jalur tanpa WebGL (aturan keras #14)

Situs memutuskan sendiri di `lib/hooks/use-device-detection.ts` dan
`lib/webgl/components/canvas`: kanvas dipasang bila browser punya WebGL2,
lebar layar paling sedikit 800 px, dan pembaca tidak meminta _reduced motion_.
Selain itu, tidak ada kanvas dan tidak ada three.js yang diunduh.

| Jalur                                              | Yang terjadi                                              | Diuji oleh                                                                                                      |
| -------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Ponsel (lebar < 800 px)                            | Tidak ada kanvas; gradien CSS, pelat datar, `<img>`       | `webgl-paths` (baru, 390 × 844 di ketiga rute), `webgl-budget` (proyek mobile)                                  |
| Desktop tanpa WebGL2                               | Sama                                                      | `webgl-paths` (baru, Chromium dengan `--disable-webgl`, kedua ukuran)                                           |
| _Reduced motion_                                   | Sama; pelat lintasan tidak dipin dan berdiri di alur      | `webgl-paths` (baru, ketiga rute), `webgl-budget` (beranda), `plate-paths`                                      |
| WebGL dimaksud, tetapi belum atau gagal menggambar | DOM tetap tampil sampai adegan melaporkan bingkai pertama | Pelat: `plate-paths`. Wash hero: uji baru di `webgl-paths`. Foto material: kontrak di kode, ujinya `fixme` (§7) |
| Tanpa JavaScript                                   | HTML server: gradien, pelat, dan `<img>` sudah ada        | `no-javascript`, `plate-paths`                                                                                  |

Yang ditegakkan `e2e/webgl-paths.e2e.ts` di setiap jalur yang memutuskan
tanpa WebGL, untuk tiga rute dan dua ukuran:

- tidak ada `<canvas>`;
- tidak ada potongan three.js yang terunduh (dikenali dari isinya, sama dengan
  `webgl-budget`, yang sebelumnya hanya memeriksa beranda di bawah _reduced
  motion_);
- setiap wash hero melukis gradien CSS dan berukuran;
- setiap pelat datar tampil penuh (opasitas 1) dan tidak mengaku menyala;
- setiap foto material punya `<img>`, tampil penuh, dan tidak mengaku menjadi
  material;
- premisnya diperiksa dulu: browser `--disable-webgl` memang tidak memberi
  WebGL2, dan _reduced motion_ memang berlaku. Kalau tidak, uji gagal, bukan
  memotret jalur WebGL dengan nama yang salah.

## 3. Vonis perangkat lemah

`useDeviceDetection` hanya menimbang dua hal untuk WebGL: ada WebGL2 dan lebar
paling sedikit 800 px (`isWebGL = supportsWebGL && isDesktop`). Kanvas lalu
menambahkan syarat tanpa _reduced motion_. Tidak ada pemeriksaan CPU, memori,
kelas GPU, atau sentuhan. Akibatnya:

- **Ponsel** selalu mendapat jalur datar, kuat atau lemah. Ini sudah benar dan
  diuji.
- **Laptop lemah yang punya WebGL2** mendapat kanvas penuh. Laptop yang
  browsernya tidak memberi WebGL2 (misalnya karena GPU-nya diblokir browser)
  jatuh ke jalur datar, dan jalur itu diuji (§2); seberapa sering itu terjadi
  pada GPU lemah tidak diuji di sini.
- **Tablet dalam posisi mendatar** (lebar 800 px ke atas, layar sentuh) mendapat
  kanvas dan _flowmap_ penunjuk, padahal tidak punya _hover_. `isTouchOnly`
  sudah dihitung di hook yang sama tetapi tidak dipakai untuk WebGL.

Rekaman JSON tiap kunjungan di `webgl-paths` menyimpan masukan vonis itu (lebar,
WebGL2, _reduced motion_, sentuhan saja, jumlah inti CPU), supaya keputusannya
bisa dibaca dari artefak, bukan ditebak.

Pilihan, tanpa satu pun dikerjakan di PR ini:

1. **Biarkan.** Vonis sekarang sederhana dan sudah diuji.
2. **Tolak GPU berkinerja buruk:** periksa WebGL2 dengan
   `failIfMajorPerformanceCaveat: true`. Menurut spesifikasi WebGL, konteks
   tidak dibuat bila kinerjanya akan jauh di bawah aplikasi native. Belum diuji
   di sini. Efek samping yang pasti: CI merender dengan GPU perangkat lunak,
   jadi gerbang WebGL di CI butuh jalur paksa sendiri.
3. **Kecualikan perangkat sentuh saja** (`isTouchOnly`), sehingga tablet
   mendapat jalur datar.

Usulan: 3 layak dipertimbangkan bila pemilik ingin tablet sama dengan ponsel; 2
hanya bila ada keluhan dari perangkat nyata, karena biayanya ada di
infrastruktur uji.

## 4. Perbaikan di PR ini

### 4.1 Wash hero menunggu bingkai pertama

`vault/webgl/scene-shell` mengganti gradien CSS-nya dengan cangkang kosong
begitu potongan adegannya tiba. Padahal kanvas baru menggambar beberapa
bingkai kemudian: ia masih mengambil potongannya sendiri, membangun _renderer_,
lalu merender. Di sela itu hero tanpa wash sama sekali, dan bila kanvas tidak
pernah menggambar (renderer gagal setelah pemeriksaan WebGL2 lolos, atau
konteks ditolak browser), hero tetap tanpa wash. Itulah kotak kosong yang
dilarang `docs/MOTION-SPEC.md` §11.2. Pelat datar dan foto material sudah
menunggu bingkai yang tergambar sebelum menepi; wash hero sekarang juga.

Gradien kini tetap di cangkang sampai `onFirstFrame`, lalu hilang di _commit_
yang sama yang menaikkan `data-accent-live`. Uji baru di `webgl-paths` membaca
setiap bingkai dari skrip pertama sampai mesh menyala, dan gagal bila ada satu
bingkai pun tanpa gradien maupun mesh.

Uji itu dijalankan dulu tanpa perbaikan, terhadap kode `main`: run 42248805090
pada `11ee22d`. Hasilnya merah seperti yang diharapkan. Hero tanpa wash maupun
mesh pada **35 dari 64 bingkai** sebelum mesh menyala, dan pada 21 dari 44
bingkai di percobaan ulang. Kedelapan belas kunjungan lain di berkas yang sama
lulus di run itu (815 lulus, 1 gagal, 51 dilewati di seluruh suite).

### 4.2 Pelat yang menunggu tidak lagi tampil di bingkai

Ditemukan di tangkapan layar run yang sama, dengan dan tanpa WebGL. Di
lintasan beranda, pelat 2 dan 3 menunggu di bawah bingkai
(`translateY(101%)`), tetapi gambarnya sudah membawa pose masuk dari timeline:
digeser ke atas 30% dan diperbesar 1,2 kali, karena `fromTo` GSAP langsung
merender keadaan awalnya. Pelat tidak memotong gambarnya sendiri, jadi gambar
pelat 2 dan 3 menjulur kembali ke dalam bingkai dan tergambar di atas pelat 1
selama pelat 1 tampil: di atas gambarnya di 1440 × 900, dan di atas
keterangannya ("01 / 03 Konstruksi, Kafe siap buka dari lokasi sewa") di
390 × 844, sehingga teksnya sulit dibaca.

Diukur di produksi lewat browser bawaan aplikasi, hanya membaca DOM: gambar
yang menunggu menjulur 201 px ke dalam bingkai setinggi 517 px, dan 35 dari 96
titik di dalam bingkai jatuh pada pelat yang menunggu. Dengan `overflow: clip`
dipasang pada pelat di halaman itu: 0 dari 96.

Perbaikannya:

- `vault/blocks/passage/passage.module.css`: `.plate { overflow: clip }` saat
  dipin, sehingga gambar bergerak berlawanan di dalam pelat yang membawanya,
  seperti yang dimaksud komentar timeline. Blok _reduced motion_ dan aturan
  tanpa JavaScript tetap `overflow: visible` untuk pelat di alur, jadi kedua
  jalur itu tidak berubah.
- `vault/blocks/passage/index.tsx`: setiap pelat juga ditandai
  `data-plate-clip`.
- `vault/webgl/plate-material/scene.tsx`: pelat yang menyala dipotong oleh
  setiap `[data-plate-clip]` di atasnya, bukan hanya yang terdekat. Di browser
  dengan GPU, pelat menyala yang menunggu juga tergambar di atas pelat 1
  sebelum perubahan ini, walaupun DOM-nya sudah dipotong.
- `e2e/plate-paths.e2e.ts`: uji baru, di proyek desktop dan mobile. Selama pelat
  pertama tampil, tidak ada titik di bingkai yang jatuh pada pelat lain.

Uji ini tidak dibuktikan merah di CI secara terpisah. Bukti cacatnya adalah
tangkapan layar run 42248805090 dan pengukuran produksi di atas; logika uji
yang sama memberi 35 dari 96 di produksi sebelum perbaikan.

## 5. Tangkapan layar

Diambil di GitHub Actions, bukan di laptop. Setiap run `e2e` PR ini
mengunggah artefak `playwright-report`; tangkapan layarnya ada di
`test-results/f4-04-webgl/`, dengan nama
`<rute>__<ukuran>__<jalur>__<1-top|2-anchor>.png`, ditambah satu berkas
`.json` per kunjungan berisi vonis dan faktanya. Artefak disimpan 7 hari
(`retention-days` di `ci.yml`). Cara membukanya: halaman run → bagian
_Artifacts_ → `playwright-report` → unduh zip. Bila sudah kedaluwarsa, _Re-run
jobs_ pada job `e2e` di head terakhir PR membuatnya lagi.

- rute: `home`, `work`, `work-detail`;
- ukuran: `1440x900`, `390x844` (perangkat proyek mobile: DPR 3, sentuh);
- jalur: `webgl` (browser biasa), `no-webgl` (`--disable-webgl`),
  `reduced-motion`;
- `1-top`: layar pertama; `2-anchor`: bagian yang dibawa WebGL di bawahnya
  (lintasan pelat di beranda, sampul di halaman pekerjaan).

Ditinjau dari run 42248805090 (sebelum kedua perbaikan), 36 gambar dan 18
rekaman:

- **Rekaman.** Di setiap jalur tanpa WebGL: 0 kanvas, tidak ada potongan
  three.js, wash hero berupa gradien CSS, ketiga pelat datar beropasitas 1,
  semua foto tampil. Di jalur WebGL 1440: satu kanvas, three.js terunduh (dua
  potongan, 51 KB dan 858 KB sebelum kompresi), dan setiap penanda menyala sudah
  ada saat gambar diambil (wash, tiga pelat, foto yang di layar).
- **Beranda, hero.** Dengan WebGL wash gelap berbutir halus; tanpa WebGL dan di
  bawah _reduced motion_ komposisi yang sama dengan gradien CSS yang rata. Tidak
  ada yang hilang: judul, indeks unit, dan ajakan sama di ketiga jalur.
- **Beranda, lintasan.** Pelat menyala dan pelat datar memiliki komposisi yang
  sama. Di ketiga jalur, pelat 2 dan 3 menjulur ke atas pelat 1: cacat §4.2,
  yang tidak berasal dari WebGL.
- **`/work` dan `/work/<slug>`.** Dengan dan tanpa WebGL hampir tidak bisa
  dibedakan dalam gambar diam; materialnya bergerak, bukan berwarna. Tanpa
  WebGL, foto adalah foto biasa dengan tata letak yang sama.
- **390 × 844.** Ketiga rute tanpa kanvas di ketiga jalur, sesuai vonis lebar.

Penilaian: jalur tanpa WebGL di ketiga rute terlihat disengaja, dengan satu
pengecualian, lintasan beranda, yang diperbaiki di §4.2. Run pada head terakhir
PR ini membuat ulang semua gambar dengan kedua perbaikan terpasang.

## 6. Biaya, dari pengukuran lab F4-06

Diukur di GitHub Actions oleh workflow F4-06 (PR #78), dua kali: run
42247088223 dan run 42249548838. Lighthouse 13.5.0, preset desktop, median
tiga run per halaman, terhadap produksi. Varian `desktop` mematikan WebGL di
browser; `desktop-webgl` mengizinkan SwiftShader sehingga kanvas terpasang.
GPU-nya perangkat lunak, jadi TBT varian WebGL adalah batas atas, bukan angka
laptop dengan GPU.

| Rute              | JS terunduh tanpa → dengan WebGL (run 1; run 2) | TBT median dengan WebGL (run 1; run 2) | TBT median tanpa WebGL (run 1; run 2) | LCP median tanpa → dengan WebGL (run 1) |
| ----------------- | ----------------------------------------------- | -------------------------------------- | ------------------------------------- | --------------------------------------- |
| `/id`             | 316 → 618 KB; 317 → 617 KB                      | 196 ms (rentang 166–661); 30 ms        | 5 ms; 32 ms                           | 0,72 → 0,74 s                           |
| `/id/work`        | 373 → 679 KB; 374 → 678 KB                      | 35 ms; 0 ms                            | 1 ms; 0 ms                            | 0,77 → 0,77 s                           |
| `/id/work/<slug>` | 374 → 679 KB; 374 → 678 KB                      | 28 ms; 0 ms                            | 0 ms; 0 ms                            | 0,80 → 0,78 s                           |

LCP dan CLS tidak berubah karena WebGL, di kedua run. Yang pasti adalah
unduhannya: sekitar 300 KB lebih, sama di kedua run. Waktu _main thread_
beranda dengan WebGL tidak stabil: median 196 ms di run pertama (satu run 661
ms) dan 30 ms di run kedua. `benchmarkIndex` runner varian itu 2439 di run
pertama dan 3971 di run kedua; runner yang lebih lambat memberi TBT yang jauh
lebih besar. Angka ini batas atas yang bergantung pada mesin, bukan janji
untuk laptop pembaca.

## 7. Yang tidak dikerjakan

- **Tidak ada tangkapan layar atau Playwright di laptop** (PROSEDUR-KERJA §3
  langkah 2). Semua tangkapan layar berasal dari CI.
- **Mutu visual jalur WebGL tidak dinilai dari tangkapan layar.** Renderer
  perangkat lunak di CI diketahui kadang tidak menyertakan lapisan WebGL dalam
  tangkapan (`visual-substance.e2e.ts`, Tahap 100). Rekaman JSON mencatat apakah
  penanda menyala sudah ada saat gambar diambil. Jalur WebGL dijaga gerbangnya
  sendiri.
- **Tidak diuji di tablet atau GPU lemah sungguhan.** Vonis di §3 dibaca dari
  kode dan dari rekaman CI, bukan dari perangkat.
- **`failIfMajorPerformanceCaveat` tidak dicoba.** Pilihan 2 di §3 adalah usulan.
- **Biaya di GPU sungguhan tidak diukur.** Runner CI tidak punya GPU.
- **Temuan, tidak dikerjakan: kontrak foto material di `/work` tanpa uji
  aktif.** Empat uji di `e2e/material-layer.e2e.ts` ("no plate is ever a blank
  box", COMMIT mengembalikan foto ke DOM, COMMIT lewat papan ketik, memori GPU
  tidak tumbuh) berstatus `fixme` sejak V1 mencabut grid karya dari beranda
  (`e2e/removed-in-f3.ts`, `plates`). Materialnya masih hidup di `/work` dan
  halaman pekerjaan. Yang masih menjaganya: `material-occlusion` dan
  `material-frame` (jalur WebGL), dan `webgl-paths` (jalur tanpa WebGL).
  Mengarahkan keempat uji itu ke `/work` adalah tindak lanjut tersendiri; isi
  dan tampilan `/work` tidak perlu berubah untuk itu.
