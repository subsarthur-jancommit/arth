# G2 — Matriks isolasi render plate

18 November 2026. Ini bukti untuk G2 (kejernihan render) dari rencana visual
dan gerak. Matriksnya mengikuti referensi teknis pemilik
(`SOLUSI-TEKNIS-VISUAL-GERAK.md` §2): setiap perbandingan mengubah satu
variabel saja, dengan viewport, huruf, posisi gulir, progres, dan latar yang
sama.

Setiap baris di bawah memisahkan dua jenis bukti: **terlihat** (dari gambar
CI) dan **dihitung** (dari kode).

## Ringkasan

- **Teks "kopong" berasal dari plate datar, bukan dari WebGL.** Plate SVG di
  panggung gelap memakai `drop-shadow`. Bayangan itu ikut menangkap goresan
  latar di balik setiap label, jadi tiap kata berdiri dalam kabut terang yang
  dipeluk garis gelap tepat di tepi huruf. Hurufnya terbaca sebagai garis luar
  yang kosong. Plate datar inilah yang dilihat ponsel, pembaca dengan reduced
  motion, `/layanan`, dan desktop sebelum plate WebGL mengambil alih (baris A,
  `label-dpr1.png`, `label-dpr2.png`).
- **Glyph tidak rusak sebelum masuk WebGL.** Kanvas tekstur yang ditampilkan
  browser pada ukuran baca sama bentuknya dengan SVG (A). Sampling WebGL hanya
  melunakkannya sedikit (B).
- **Kesan hologram berasal dari halo dan scan.** Halo dibaca dua level mip di
  atas lalu ditambahkan ke setiap goresan, sehingga setiap huruf membengkak dan
  berpendar (D-halo, dan plate apa adanya di baris F). Pita scan menebalkan apa
  pun yang dilaluinya, label juga (D-scan).
- **Perspektif membuat label tidak terbaca, apa pun shadernya.** Datar, label
  14,5 satuan sudah hanya 7,3 px CSS pada 1440 × 900. Saat denah rebah,
  tingginya tinggal sekitar 3–4 px (E, `denah-condong.png`).
- **H1 hero padat di setiap keadaan.** Ini benar saat bergerak, saat diam,
  tanpa lapisan `will-change`, tanpa mask, dan tanpa split. Masalahnya tidak
  berasal dari komposit DOM headline (G).
- **Temuan sampingan:** kanvas root menggambar wash hero (`vault/webgl/scene-shell`,
  mesh seluas viewport) di setiap frame, juga di belakang passage. Jadi latar
  di belakang plate WebGL adalah wash yang lebih terang, bukan tinta halaman
  (A dibanding B). Wilayah hero milik G1; dicatat untuk G1/G4.

## Cara gambar dibuat

- **Spec:** `e2e/plate-matrix.e2e.ts`, dengan init script `e2e/plate-matrix.ts`.
  Varian shader dibuat di sisi tes. Fragment shader plate diganti sebelum
  three mengompilasinya, dan blending setiap varian dipasang hanya di sekitar
  draw call plate. Situs tidak membawa sakelar diagnosis apa pun. Baris yang
  shadernya gagal dikompilasi dinyatakan gagal, sehingga gambar kosong tidak
  bisa lolos.
- **Tempat:** beranda `/id`, viewport 1440 × 900, DPR 1 dan DPR 2. Plate
  pertama (Konstruksi) difoto di posisi rehatnya: 0,16 dari panjang pin
  passage, sesudah bingkai mapan. Baris A–E menahan plate dengan menulis
  `data-plate-progress` sesudah passage diam, jadi tidak ada yang bergerak saat
  gambar diambil.
- **Gambar yang dibahas:** run CI #367 (head `e358027`, PR #102), artefak
  `playwright-report`, folder `test-results/plate-matrix.e2e.ts-…/`. Artefak
  itu tersimpan sampai 24 November 2026. Setiap folder juga berisi
  `facts.json`: kotak plate, `fit`, ukuran setiap peran teks di layar, jumlah
  draw call plate, varian yang benar-benar sampai ke shader, dan log
  kompilasinya.
- **Potongan di dokumen ini** (`docs/g2-matriks/`) diambil dari gambar run #367
  tanpa diolah, hanya dipotong dan diperbesar dengan nearest-neighbour:
  - `label-dpr1.png` (DPR 1, 6×) dan `label-dpr2.png` (DPR 2, 3×): label
    "ALUR PELANGGAN RUANG DUDUK" yang sama, dari atas ke bawah A-svg,
    A-texture, B-neutral, (DPR 1 saja: C-normal-dark), D-halo, (DPR 1 saja:
    D-scan), dan plate apa adanya ditahan di progres 0;
  - `denah-condong.png` (DPR 1, 4×): denah di E-end.

### Batas bukti

CI menggambar WebGL lewat **SwiftShader**, rasterizer perangkat lunak
(`CLAUDE.md` #19). Ia saksi yang sah untuk bentuk glyph dan cara lapisan
dikomposit. Ia **bukan** saksi waktu frame. Dokumen ini tidak memuat angka
kelancaran atau lag, dan gambar baris F bukan bukti seberapa halus gerak di
perangkat pembaca. GPU pembaca bisa memfilter tekstur sedikit berbeda dari
SwiftShader; yang dipakai adalah arah temuannya, bukan nilai pikselnya.

## Ukuran teks plate

**Terukur di halaman** (`facts.json`, run #367): kotak gambar plate pertama
1045 × 528 px, `fit` 0,503 pada 1440 × 900. Jadi saat plate datar, ukuran di
layar adalah:

| Peran teks | Satuan plate | px CSS |
| ---------- | -----------: | -----: |
| label      |         14,5 |   7,29 |
| angka      |           13 |   6,54 |
| catatan    |           12 |   6,03 |
| judul      |           22 |  11,06 |

**Dihitung** dari matematika `scene.tsx` dan vertex shader yang sama (`pose()`,
kamera, `FOCAL`): tinggi label 14,5 satuan di tengah setiap bagian, pada
bingkai yang sama.

| Progres          | Konstruksi: denah | Konstruksi: potongan | Teknologi | Peekabo |
| ---------------- | ----------------: | -------------------: | --------: | ------: |
| 0 (datar)        |               7,3 |                  7,3 |       8,0 |     7,9 |
| 0,3 (tengah)     |               3,2 |                  6,0 |       7,4 |     7,4 |
| 0,6 (condong)    |               4,1 |                  5,1 |       6,6 |     6,6 |
| 1 (akhir, orbit) |               3,7 |                  5,1 |       6,4 |     6,4 |

Pada 1280 × 720, ukuran default proyek `desktop` di CI, bingkainya 381 px.
Di sana semua angka di atas sekitar 28 % lebih kecil (dihitung). Di ponsel
390 × 844, plate datar menaruh label pada **4,81 px** di beranda dan
**4,33 px** di `/layanan` (terukur, `e2e/plate-shots.e2e.ts`, run #367).

## Baris per baris

### A — kanvas asli datar pada ukuran baca akhir

Folder `…-the-neutral-shader-the-turn-desktop`, berkas `A-texture.png` dan
`A-svg.png`. Kanvas tekstur (1600 × 1556) dipasang tepat di atas kotak SVG
plate, di-fit seperti SVG, dan dijumlahkan ke halaman (`plus-lighter`) seperti
plate menambahkan cahaya, dengan kanvas WebGL disembunyikan.

- **Terlihat:** A-texture dan A-svg sama bentuknya. Glyph tekstur tajam dan
  terisi. Glyph tidak rusak sebelum masuk WebGL.
- **Terlihat:** A-svg, yaitu plate datar seperti yang dikirim, membungkus
  setiap kata dengan kabut terang. Di dalam kabut itu ada garis gelap yang
  memeluk tepi huruf. Itu goresan sewarna latar yang ditaruh di bawah label
  (`LABEL_HALO`, `paint-order: stroke`) dan tertangkap `drop-shadow` panggung
  gelap. Hurufnya terbaca sebagai garis luar dalam pendaran. Ini kandidat
  terkuat untuk keluhan "teks kopong".

### B — tekstur pada plane frontal, shader netral, tanpa halo dan scan

`B-neutral.png`: texel saja, dijumlahkan seperti plate.

- **Terlihat:** sama dengan A, hanya sedikit lebih lunak karena sampling mip
  trilinear pada perkecilan sekitar 3×. Bentuk dan bagian dalam huruf tetap.
  Upload dan sampling tidak mengubah bentuk huruf.
- **Terlihat:** latarnya lebih terang daripada A. A menyembunyikan kanvas,
  sedangkan B memperlihatkan wash hero yang digambar kanvas yang sama di
  seluruh viewport (lihat temuan sampingan).

### C — alpha normal dengan coverage yang benar, lawan additive

Folder `…-al-alpha-on-the-dark-ground-desktop`, berkas `C-normal-dark.png`:
kanal merah sebagai coverage, tinta kertas, alpha lurus, blending normal.

- **Terlihat (latar gelap):** C-normal-dark hampir tak bisa dibedakan dari B.
  Di latar gelap, additive dan alpha normal memberi bentuk yang sama. Tidak
  ada tepi yang memutih atau isi yang menipis karena compositing.
- **Latar kertas: tidak terukur di run #367.** Baris `C-additive-paper` dan
  `C-normal-paper` tidak pernah mendapat latar kertas: wash hero menutupi latar
  halaman di belakang plate. Spec sekarang menahan wash selama latar kertas
  dipasang (commit `8141195`). Gambar kertasnya ada di artefak run berikutnya
  pada PR ini, bukan di dokumen ini. Dari matematikanya: cahaya yang
  dijumlahkan ke kertas tidak bisa terlihat, sedangkan alpha normal dengan
  tinta gelap bisa.

### D — halo saja, lalu scan saja

Folder `…-D-the-halo-alone-desktop` dan `…-D-the-scan-alone-desktop`.

- **Terlihat:** `D-halo.png` membuat setiap goresan dan setiap huruf membengkak
  dan berpendar. Isi huruf ikut terisi kabut, dan judul "DENAH LANTAI 1"
  memancarkan cahaya. Gambarnya sama dengan plate apa adanya saat datar
  (`F-shipped-held-0.png`), karena di progres 0 scan mati dan kedalaman netral,
  sehingga yang tersisa adalah halo.
- **Terlihat:** `D-scan.png`, dengan pita ditahan di 0,45 tiap bagian, menebalkan
  dan menerangkan apa yang dilaluinya. Pada denah itu baris label "ALUR
  PELANGGAN RUANG DUDUK" dan garis potong A-A; pada potongan, lantai +3,60.
- Kesimpulan baris D: halo dan scan sama-sama menurunkan keterbacaan, dan halo
  bekerja di setiap frame.

### E — perspektif awal, tengah, maksimum, tanpa gerak

`B-neutral.png` (awal), `E-middle.png` (progres 0,3), `E-lean.png` (0,6),
`E-end.png` (1). Semua memakai shader netral.

- **Terlihat:** saat denah rebah, labelnya luruh. "ALUR PELANGGAN RUANG DUDUK",
  "TANGGA NAIK", dan "SAJI" tidak lagi terbaca sebagai huruf
  (`denah-condong.png`). Label potongan yang berdiri masih berbentuk huruf,
  tetapi kecil.
- **Dihitung:** sesuai tabel di atas, label denah sekitar 3–4 px CSS saat
  condong.
- Kesimpulan baris E: sudut model memang mengecilkan glyph di bawah ukuran
  baca. Ini tidak bisa diperbaiki oleh shader mana pun. Kata-kata penting
  harus dibaca di luar gambar.

### F — gerak pada pipeline yang dikirim, dengan nomor frame

Folder `…-ate-moving-and-then-at-rest-desktop`: `F-shipped-held-0/0.3/0.6.png`
ditahan, `F-shipped-moving-1…6.png` sambil roda menggulir, dan
`F-shipped-stopped.png`. Setiap gambar bergerak dicap nomor frame GL
(`facts.json`: frame 101, 118, 134, 152, 169, 186).

- **Terlihat:** selama berbelok, halo dan pita scan membuat bagian yang
  dilalui pita menyala hampir putih, dan label di dalamnya kehilangan
  bentuk. Sesudah berhenti, plate kembali ke rupa D-halo.
- **Tidak terukur:** apakah urutan update membuatnya terasa bergetar. Urutan
  frame diukur terpisah di PR #105 (log per frame). Kelancaran tidak bisa
  dinilai dari SwiftShader.

### G — H1 DOM tanpa TextReveal atau filter, lalu satu per satu

Folder `…-eadline-one-layer-at-a-time-desktop`. G hanya mengamati; hero dan
`TextReveal` milik G1.

- **Terlihat:** `G-moving.png` (baris masih naik di balik mask, tertangkap
  saat tirai entrance terangkat), `G-settled.png`, `G-no-layer.png` (tanpa
  `will-change`), `G-no-mask.png` (tanpa mask dan transform), dan
  `G-unsplit.png` (reduced motion, tidak pernah di-split). Semua glyph padat.
  Tidak ada keadaan yang membuat headline kopong.
- **Terukur** (`facts.json`): headline terbagi menjadi 3 baris. Satu-satunya
  lapisan komposit di atasnya adalah `will-change: transform` di `h1` dan
  `overflow: clip` di section hero. Tidak ada `filter`, `mix-blend-mode`,
  `backdrop-filter`, atau opasitas di bawah 1.
- Catatan untuk G1: kelas `.split-line` dan `.split-word` di
  `text-reveal.module.css` tidak pernah cocok, karena SplitText tidak memberi
  kelas pada baris. Mask tetap bekerja karena SplitText memasang
  `overflow: clip` inline.

## Kesimpulan untuk perbaikan (Jalur A, PR #106)

1. **Plate datar:** buang `drop-shadow` panggung gelap. Goresan latar di
   bawah label tetap ada, karena gunanya membersihkan garis di belakang kata,
   dan tanpa pendaran ia tidak terlihat sama sekali.
2. **Plate WebGL:** tanpa halo dan tanpa scan. Tekstur adalah data coverage,
   kanal merah dibaca sekali, lalu dicetak dengan tinta halaman sebagai alpha
   lurus dengan blending normal. Baris C menunjukkan blending normal tidak
   menipiskan huruf di latar gelap. Di latar terang hanya blending normal yang
   bisa terlihat.
3. **Kata-kata:** baris E membuktikan label di dalam gambar tidak bisa dibaca
   saat model condong, apa pun shadernya. Kata-kata plate disajikan ulang
   sebagai HTML stabil di samping gambar (16 px untuk isi, 14 px untuk judul
   dan catatan).
4. **Tetap:** `document.fonts.ready`, mipmap, filter trilinear, anisotropi,
   fallback SVG, serah-terima frame pertama, gerbang reduced motion, disposal,
   pemulihan context loss, dan clip plate.

Yang **tidak** diklaim: `smoothstep` yang dibalik (sudah diperbaiki di PR ini)
tidak menyembuhkan teks kopong. Di driver yang menghitung rumusnya apa adanya
hasilnya sama, karena `t²(3 − 2t)` simetris di `t = ½`, dan baris D-scan
memakai bentuk yang sudah benar.
