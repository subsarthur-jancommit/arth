# Arah visual R4: gambar diam

Tanggal: 24 Oktober 2026. Untuk keputusan P2 di
[`docs/RENCANA-REVISI-F3.md`](../RENCANA-REVISI-F3.md): pemilik memilih satu
dari tiga arah sebelum R4 dibangun. Folder ini hanya berisi dokumen dan gambar.
Produksi, Sanity, dan kode `main` tidak berubah.

Permintaan pemilik, 24 Oktober 2026: "Ya, mulai satu sesi untuk menyiapkan 2–3
pilihan arah visual R4 sebagai gambar diam sesuai RENCANA-REVISI-F3, tanpa
mengubah produksi. Saya yang memilih."

**Keputusan pemilik, 24 Oktober 2026: arah B, Maket cahaya.** Kata pemilik:
"Saya pilih arah B, Maket cahaya." R4 dibangun dari arah ini. Arah A dan C
tetap di folder ini sebagai catatan pilihan yang tidak diambil.

**Usulan lanjutan, 24 Oktober 2026, menunggu persetujuan.** Pemilik bertanya
apakah ketiganya bisa dipakai dengan tupoksi berbeda, lalu meminta gambar
diamnya. Usulannya: B sebagai panggung (beranda, pembuka unit, lintasan), A
sebagai dokumen (halaman situasi dan pekerjaan, cara kerja, cara dibayar,
kebijakan, versi cetak), dan C untuk janji dan ajakan (stempel, coretan, tombol).
Penyatunya satu navbar, satu keluarga huruf pada tiga lebar, satu gambar kafe,
dan ungu sebagai satu-satunya warna aksen. Gambarnya ada di bagian Usulan di
`index.html` dan dibuat oleh `gabungan.py`; kontrasnya di `kontras.md`, bagian
Sistem gabungan.

## Tiga arah

- **A, Lembar kerja.** Tinta di atas kertas. Pelat digambar seperti lembar
  gambar kerja dengan kop di kanan. Monokrom, token yang sudah ada, tanpa WebGL.
- **B, Maket cahaya.** Ruang gelap. Pelat digambar aksonometri dengan garis
  berpendar dan menjadi material WebGL yang dilalui kamera. Monokrom. Versi
  datarnya adalah jalur tanpa WebGL.
- **C, Papan proyek.** Lembar cetak ungu ditempel di papan berlubang, dicap, dan
  dicoret. Menambah satu warna (ungu stempel), tanpa WebGL.

Ketiganya menggambar isi yang sama: rangkaian kafe baru di halaman Satu klien,
tiga unit. Alasan per arah (suasana, cara pelat digambar, huruf, gerak, WebGL,
kontras, risiko) ada di `index.html`, bagian Alasan per arah.

## Isi folder

- `index.html`: halaman pembanding. Ketiga arah berdampingan; di ponsel satu
  kolom, dengan tombol untuk menampilkan satu arah saja.
- `pelat/`: dua belas pelat SVG. `a-*`, `b-*`, dan `c-*` untuk Konstruksi
  (denah dan potongan), Teknologi (diagram alur), dan Peekabo (papan kampanye);
  `b-*-datar` adalah jalur tanpa WebGL arah B. Setiap berkas membawa `title` dan
  `desc` yang menyebut isi gambar.
- `kontras.md`: rasio kontras WCAG setiap pasangan teks dan latar, dihitung dari
  token. Dibuat oleh skrip; jangan disunting tangan.
- `bangun.py` dan modul Python di sebelahnya: pembuat semua berkas di atas.
  Hanya pustaka standar Python.

## Membuat ulang

```bash
python docs/r4-arah-visual/bangun.py
```

Sesudah itu format `index.html` dengan `bun run format` (atau `oxfmt` dengan
konfigurasi repo). `oxfmt --check` di CI ikut memeriksa HTML, dan keluaran
skrip belum berformat.

## Asal-usul

- **Gambar dan kode: karya asli untuk proyek ini.** Pelat, layar, dan halaman
  digambar oleh `bangun.py` dari koordinat yang ditulis di `model.py`. Tidak ada
  kode, gambar, ikon, atau logo pihak ketiga yang disalin.
- **Teks: dari situs yang tayang**, https://arth-test-01.vercel.app, diambil 24
  Oktober 2026 dari halaman beranda, tiga halaman unit, Satu klien tiga unit,
  bab Kuliner dan F&B, Konstruksi F&B, Agency marketing, Produksi kreatif,
  Experiential dan event, dan halaman pekerjaan Bot pesan-antar WhatsApp serta
  Pesan dan bayar dari meja. Nama unit dan pembaca mengikuti
  [`docs/R1-GLOSARIUM-PEMBACA.md`](../R1-GLOSARIUM-PEMBACA.md). Label gambar
  kerja (Denah, Potongan, Kop, Skala, as 1 sampai 4, peil ±0,00) adalah
  konvensi gambar, bukan teks tayang. Kata baru di kop arah A (Isi lembar,
  Catatan, Wilayah, Skala, Lembar) perlu masuk glosarium bila arah itu dipilih.
- **Ukuran di gambar** (4,60, 5,00, +3,60, dan seterusnya) adalah ukuran gambar
  itu sendiri, konsisten dengan skalanya, bukan data proyek. Setiap pelat
  memuat kalimat tayang "Rangkaian yang mungkin, bukan proyek yang pernah kami
  kerjakan."
- **Warna.** `ink` dan `paper` dari `lib/styles/colors.ts`. Warna arah C
  (`papan`, `kertas`, `tinta`, `ungu`, `ungu-terang`, `malam`) adalah usulan
  baru, dicatat di `kontras.md`.
- **Huruf.** Dimuat dari Google Fonts saat halaman dilihat; tidak ada berkas
  huruf yang disalin ke repositori. Lisensi dibaca dari `OFL.txt` masing-masing
  di github.com/google/fonts pada 24 Oktober 2026, semuanya SIL Open Font
  License 1.1: Syne (Copyright 2017 The Syne Project Authors), Geist dan Geist
  Mono (Copyright 2024 The Geist Project Authors), Archivo (Copyright 2020 The
  Archivo Project Authors), Barlow dan Barlow Condensed (Copyright 2017 The
  Barlow Project Authors). Archivo dan Barlow hanya pengganti sementara. Belum
  ada huruf berlisensi yang dipilih.
- **Rujukan, bukan salinan.** Kosakata gerak dari `docs/MOTION-SPEC.md` §12
  (datum, dimension, fixings, stamp, set-depth). `docs/TEARDOWN.md` dibaca
  sebagai bukti, tidak ada yang disalin. Konvensi dunia nyata yang menjadi
  inspirasi: kop gambar kerja, cetak biru, stempel ungu kantor, papan berlubang,
  dan pita label huruf timbul. Tidak ada karya tertentu yang ditiru.
- Nama TikTok, Meta, Google, Shopee, dan WhatsApp hanya muncul sebagai teks dari
  copy situs; tidak ada logo.

## Yang diperiksa dan yang tidak

- Dilihat sebagai gambar dengan satu Chrome headless lokal, tanpa server dan
  tanpa build: pada lebar 1600 px, dan pada lebar 390 px dengan memuat halaman
  di dalam iframe selebar itu (jendela Chrome headless tidak bisa sesempit
  ponsel). Belum dilihat di ponsel sungguhan.
- Kontras di `kontras.md` adalah hitungan dari token, bukan pengukuran di
  halaman yang dirender. Bila satu arah dibangun, `contrast.test.ts` dan
  `e2e/contrast-situ.e2e.ts` tetap yang menentukan (aturan #11).
- Tidak ada angka kinerja. "Berat di ponsel" untuk arah B adalah perkiraan
  (aturan #19).
- axe tidak dijalankan pada halaman pembanding ini; ia bukan halaman situs.
