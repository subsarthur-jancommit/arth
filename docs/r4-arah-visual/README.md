# Arah visual R4: gambar diam

Tanggal: 24 Oktober 2026. Untuk keputusan P2 di
[`docs/RENCANA-REVISI-F3.md`](../RENCANA-REVISI-F3.md): pemilik memilih arah
visual sebelum R4 dibangun. Folder ini hanya berisi dokumen dan gambar.
Produksi, Sanity, dan kode `main` tidak berubah.

Permintaan pemilik, 24 Oktober 2026: "Ya, mulai satu sesi untuk menyiapkan 2–3
pilihan arah visual R4 sebagai gambar diam sesuai RENCANA-REVISI-F3, tanpa
mengubah produksi. Saya yang memilih."

## Keputusan pemilik, 24 Oktober 2026

1. Dari tiga arah yang ditunjukkan, pemilik memilih **arah B, Maket cahaya**:
   "Saya pilih arah B, Maket cahaya."
2. Pemilik lalu bertanya apakah ketiganya bisa dipakai dengan tupoksi berbeda,
   dan meminta gambar diamnya.
3. Sesudah melihatnya, pemilik menyetujui **B dan A sebagai dasar utama** dan
   **mencabut arah C, Papan proyek**: "SAYA SETUJU UNTUK MENJADIKAN ARAH B dan
   ARAH A sebagai DASARAN UTAMANYA. ITU SUDAH SANGAT SEMPURNA. Yang jadi
   masalah adalah ARAH VISUAL C yang terkesan NORAK dan TIDAK SESUAI DENGAN
   BRAND FILOSOFI. CABUT ARAH VISUAL C."

Gambar arah C sudah dihapus dari folder ini. Bila perlu dilihat lagi, ia ada
di riwayat git, commit `917219c`.

## Sistem yang disetujui

- **B, Maket cahaya, sebagai panggung:** beranda, pembuka tiga halaman unit,
  lintasan yang di-pin, dan perpindahan antarhalaman. Tema gelap; pelat
  digambar aksonometri dengan garis berpendar dan menjadi material WebGL.
- **A, Lembar kerja, sebagai dokumen:** halaman situasi dan pekerjaan, Cara
  kami bekerja, Cara kami dibayar, Kebijakan, versi cetak, dan jalur tanpa
  WebGL. Tema terang; pelat digambar dengan garis biasa; kepala halaman
  seperti kop.
- **Penyatunya:** satu navbar bentuk B, satu keluarga huruf (lebar di
  panggung, normal di dokumen), dan satu gambar kafe yang digambar dua cara.
  Situs tetap monokrom: tinta dan kertas, tanpa warna aksen.

Yang masih perlu diputuskan: pembagian halaman terang dan gelap, dan huruf
judul berlisensi (atau tetap Archivo, yang berlisensi OFL).

## Isi folder

- `index.html`: sistem yang disetujui di bagian atas, lalu arah B dan A
  berdampingan seperti semula diusulkan. Di ponsel satu kolom.
- `pelat/`: sembilan pelat SVG. `a-*` dan `b-*` untuk Konstruksi (denah dan
  potongan), Teknologi (diagram alur), dan Peekabo (papan kampanye);
  `b-*-datar` adalah jalur tanpa WebGL arah B. Setiap berkas membawa `title`
  dan `desc` yang menyebut isi gambar.
- `kontras.md`: rasio kontras WCAG setiap pasangan teks dan latar, dihitung dari
  token. Dibuat oleh skrip; jangan disunting tangan.
- `bangun.py` dan modul Python di sebelahnya: pembuat semua berkas di atas.
  Hanya pustaka standar Python. `gabungan.py` menggambar sistem yang disetujui.

## Membuat ulang

```bash
python docs/r4-arah-visual/bangun.py
```

Sesudah itu format `index.html` dan `kontras.md` dengan `bun run format` (atau
`oxfmt` dengan konfigurasi repo). `oxfmt --check` di CI ikut memeriksa HTML,
dan keluaran skrip belum berformat.

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
  kerja (Denah, Potongan, Skala, as 1 sampai 4, peil ±0,00) adalah konvensi
  gambar, bukan teks tayang. Kata baru di kop arah A (Isi lembar, Catatan,
  Wilayah, Skala, Lembar) perlu masuk glosarium sebelum dipakai di situs.
- **Ukuran di gambar** (4,60, 5,00, +3,60, dan seterusnya) adalah ukuran gambar
  itu sendiri, konsisten dengan skalanya, bukan data proyek. Setiap pelat
  memuat kalimat tayang "Rangkaian yang mungkin, bukan proyek yang pernah kami
  kerjakan."
- **Warna.** Hanya `ink` dan `paper` dari `lib/styles/colors.ts`, dan
  turunannya (`--text-muted`, `--surface`). Tidak ada warna baru.
- **Huruf.** Dimuat dari Google Fonts saat halaman dilihat; tidak ada berkas
  huruf yang disalin ke repositori. Lisensi dibaca dari `OFL.txt` masing-masing
  di github.com/google/fonts pada 24 Oktober 2026, semuanya SIL Open Font
  License 1.1: Syne (Copyright 2017 The Syne Project Authors), Geist dan Geist
  Mono (Copyright 2024 The Geist Project Authors), dan Archivo (Copyright 2020
  The Archivo Project Authors). Archivo adalah pengganti sementara untuk huruf
  judul. Belum ada huruf berlisensi yang dipilih.
- **Rujukan, bukan salinan.** Kosakata gerak dari `docs/MOTION-SPEC.md` §12
  (datum, dimension, set-depth). `docs/TEARDOWN.md` dibaca sebagai bukti, tidak
  ada yang disalin. Konvensi dunia nyata yang menjadi inspirasi: kop gambar
  kerja dan maket arsitektur. Tidak ada karya tertentu yang ditiru.
- Nama TikTok, Meta, Google, dan WhatsApp hanya muncul sebagai teks dari copy
  situs; tidak ada logo.

## Yang diperiksa dan yang tidak

- Dilihat sebagai gambar dengan satu Chrome headless lokal, tanpa server dan
  tanpa build: pada lebar 1600 px, dan pada lebar 390 px dengan memuat halaman
  di dalam iframe selebar itu (jendela Chrome headless tidak bisa sesempit
  ponsel). Belum dilihat di ponsel sungguhan.
- Kontras di `kontras.md` adalah hitungan dari token, bukan pengukuran di
  halaman yang dirender. Bila sistem ini dibangun, `contrast.test.ts` dan
  `e2e/contrast-situ.e2e.ts` tetap yang menentukan (aturan #11).
- Tidak ada angka kinerja. "Berat di ponsel" untuk arah B adalah perkiraan
  (aturan #19).
- axe tidak dijalankan pada halaman pembanding ini; ia bukan halaman situs.
