# Rencana visual dan gerak

17 November 2026 · Status: berjalan · Rencana aktif sesudah
[`RENCANA-REVISI-F3.md`](./RENCANA-REVISI-F3.md), yang selesai di R7

Rujukan teknisnya
[`SOLUSI-TEKNIS-VISUAL-GERAK.md`](./SOLUSI-TEKNIS-VISUAL-GERAK.md), addendum
pemilik 17 November 2026. Rencana ini memakainya sebagai rujukan dan tidak
mengulang auditnya. Gambar konsep hero dari pemilik disimpan di luar repo.

## Tujuan

Beranda dan navbar memakai satu bahasa material: tinta dan kertas, huruf padat,
permukaan matte, dan satu ilustrasi berkarakter. Target utamanya estetika,
dengan animasi yang kompleks.

Tiga pegangan:

1. **Lapisan baca diam, lapisan ilustrasi ekspresif.** Judul, teks, tombol, dan
   label tidak ikut gerak dekoratif. Kerumitan animasi ditaruh di ilustrasi:
   perakitan bertahap, kamera, dan perubahan per kebutuhan.
2. **Diam dulu, lalu bergerak.** Setiap goal lebih dulu lulus sebagai tampilan
   diam: struktur jelas, tulisan penuh, dan jalur layanan mudah ditemukan.
3. **Dinilai dengan melihat.** Setiap PR menyertakan tangkapan layar dari CI di
   1440 × 900 dan 390 × 844, dalam bahasa Indonesia dan Inggris. Durasi dan
   amplitudo di rujukan adalah titik awal, bukan batas.

## Goal

| Goal                        | Isi                                                                                                                                                  | Selesai bila                                                                                                                                                                                                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **G0 Kontak nyata**         | Kanal kontak K5 (rujukan §8 urutan 0)                                                                                                                | Ajakan berakhir di kanal nyata. Menunggu data pemilik; sampai itu setiap ajakan menuju `/kontak`                                                                                                                                                                                                  |
| **G1 Fondasi visual**       | Navbar pill, hero, pemilih kebutuhan, dan kontrak bentuk, huruf, dan jarak (rujukan §3–4)                                                            | Tampilan diam beranda benar di 360, 390, 768, 1024, dan 1440 px, ID dan EN, tanpa gulir mendatar. Navbar tiga zona punya state lengkap dan `aria-current` yang benar. Urutan ponsel: H1, cakupan, ajakan, tiga kebutuhan. Lima rute pembeli tercapai lewat tiga kebutuhan, dan Bergabung terpisah |
| **G2 Kejernihan render**    | Plate tanpa halo dan scan di atas teks, perbaikan `smoothstep`, matriks A–G, label HTML, dan urutan scheduler (rujukan §2, §5 jalur A, §6)           | Matriks A–G dijalankan di CI pada DPR 1 dan 2, hasilnya ada di PR. Label penting tampil sebagai HTML yang diam. Penulis frame (Lenis, GSAP) berjalan sebelum perender GL, dibuktikan dengan log frame                                                                                             |
| **G3 Ilustrasi hero matte** | Model kafe 3D bermaterial matte, dibuat dari kode, dengan satu key light, fill, dan bayangan kontak (rujukan §5 jalur B)                             | Model dirakit bertahap sekali, lalu diam. Tanpa WebGL atau dengan reduced motion, gambar diam yang setara tampil. Sumber daya GPU dibuang saat unmount                                                                                                                                            |
| **G4 Koreografi**           | SceneShell berlapis, satu contoh interaktif menggantikan passage ganda, parallax, tilt, dan navigasi rutin yang langsung (rujukan §6, §8 urutan 3–4) | Setiap properti transform punya satu pemilik. Ilustrasi berubah per kebutuhan dan bisa disela. Back, Forward, dan fokus tetap benar                                                                                                                                                               |
| **G5 Peta Kebutuhan**       | Tiga langkah opsional yang menyusun ilustrasi lapis demi lapis (rujukan §7)                                                                          | Ringkasan teks berubah tanpa menunggu animasi. Ubah, Lewati, Mulai ulang, dan Ceritakan kebutuhan selalu tersedia. Tanpa skor, hadiah, atau kontak yang dikunci                                                                                                                                   |
| **G6 Gerbang kualitas**     | Checklist rilis (rujukan §8)                                                                                                                         | Dijalankan dan direkam: tata letak, keyboard, bentuk glyph, navigasi cepat, reduced motion, tanpa WebGL, dan waktu frame di perangkat sasaran                                                                                                                                                     |

## Urutan

- G1 dan G2 berjalan bersamaan, karena berkasnya berbeda.
- G3 mulai begitu G1 menyediakan tempat ilustrasi di hero.
- G4 sesudah G2 dan G3. G5 sesudah G4.
- G6 dijalankan di setiap PR, lalu sekali lagi di akhir.
- G0 masuk kapan pun data pemilik tersedia.

## Aturan kerja

- [`PROSEDUR-KERJA.md`](./PROSEDUR-KERJA.md) berlaku: draft PR, gerbang di
  GitHub Actions, dan merge sesudah `ci` dan `e2e` hijau. Untuk perubahan
  tampilan, pemilik melihat tangkapan layar CI atau preview lebih dulu
  (`CLAUDE.md` #23).
- Aturan keras `CLAUDE.md` tetap: gerak (#4–#7), kontras (#11), grid (#12),
  WebGL (#14, #15), dan kejujuran (#19–#21).
- Teks hero tetap memakai copy yang sudah disetujui. String baru hanya yang
  disebut rujukan §4: tiga kebutuhan, Bergabung, Ceritakan kebutuhan, dan Cara
  kerja. Padanan Inggrisnya didaftar di PR untuk disetujui pemilik. Variasi copy
  di gambar konsep bukan keputusan isi.
- `/work` dan katalog fotonya tidak diubah.
- Setiap PR menambah barisnya sendiri di
  [`PROGRES-ARTHUR.md`](./PROGRES-ARTHUR.md).

## Keputusan pemilik yang terbuka

| Keputusan                                                                       | Sampai diputuskan              |
| ------------------------------------------------------------------------------- | ------------------------------ |
| H1 beranda: tetap "Proyek jalan. Sistem bekerja. Pasar bertambah." atau H1 baru | H1 yang sekarang dipakai       |
| Padanan Inggris untuk string baru G1                                            | Draf didaftar di PR G1         |
| Data kontak K5                                                                  | Setiap ajakan menuju `/kontak` |
