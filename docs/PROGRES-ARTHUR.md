# PROGRES ARTHUR

Satu baris per paket kerja, diperbarui **di dalam PR paket itu sendiri** —
bukan sesudahnya, supaya ia tidak bisa kedaluwarsa tanpa terlihat di diff.

**Untuk sesi berikutnya:** baca berkas ini, lalu baris paket berikutnya di tab
_Backlog implementasi_, lalu tabel keputusan K1–K9. Itu cukup untuk mulai
bekerja — tidak perlu membaca ulang keempat artefak atau dokumen repo.

**Bekerja dari workspace lain?** [`KONTEKS-TIM.md`](./KONTEKS-TIM.md) memuat
tautan keempat dokumen konteks, urutan kewenangannya, pagar yang berlaku terus,
dan keadaan kode hari ini. Itu titik masuknya; berkas ini papan statusnya.

Rencana lengkapnya ada di artefak Claude Docs _Rencana Implementasi Website
Arthur_ (51 paket, enam fase F0–F5) dan urutan kerjanya di _Tahap 2 — Instruksi
Prompting_. Prosedur per PR mengikat di
[`PROSEDUR-KERJA.md`](./PROSEDUR-KERJA.md).

## Keputusan pemilik yang berlaku

| Keputusan          | Isi                                                                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| K1, K2             | Bahasa bawaan Indonesia, `/` → `/id`, Inggris menyusul, `/en` tanpa terjemahan 307 → `/id`                                                                                                                                  |
| K3, K4, K6, K7, K8 | Berlaku sementara pada bawaannya; tidak memblokir                                                                                                                                                                           |
| **K5**             | **Belum diputuskan.** Email/alamat contoh hanya dummy; kanal nyata dan waktu balas belum dipilih. Struktur F3-09 boleh ditinjau dengan dummy ber-NOTE, tetapi aktivasi kanal dan F5-06 tetap berhenti sampai K5 diputuskan. |
| K9                 | Belum diputuskan; jatuh tempo sebelum noindex dilepas di F5-05                                                                                                                                                              |

Urutan paket pertama diubah pemilik dari dokumen Tahap 2: **F0-01 lebih dulu,
baru F0-07**, karena `robots.txt` produksi sedang mengizinkan semua perayap AI
memanen isi contoh, dan F0-01 memblokir F1-01.

## Paket

| Paket                                       | PR  | SHA merge | Status           | Dilewati / ditunda                                                                                                                                                                                                                                    |
| ------------------------------------------- | --- | --------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F0-01 Noindex selama dummy                  | #12 | `2491472` | **Selesai**      | Pengecualian domain dibangun tapi daftarnya kosong (lihat U3); lokasinya pindah dari `proxy.ts` (U4)                                                                                                                                                  |
| F0-07 Dokumen repo diselaraskan             | #13 | `45f220b` | **Selesai**      | FORK.md tidak disunting (U1); `ROADMAP.md` dan `docs/stages/` tidak disentuh (U8)                                                                                                                                                                     |
| F1-01 Merek Arthur dari satu sumber         | #14 | `a052ace` | **Selesai**      | Prosa `SITE` dan `home-fallback` ikut dibereskan di F1-02 (U11)                                                                                                                                                                                       |
| F1-02 Tiga unit menggantikan praktik        | #14 | `a052ace` | **Selesai**      | Medan Sanity masih bernama `practice` (U12); `?practice=` → `?unit=` tanpa pengalih (U13)                                                                                                                                                             |
| F1-03 Rute unit                             | #14 | `a052ace` | **Selesai**      | Halaman CMS pindah ke `/halaman/<slug>` (U14); tiga gerbang e2e melemah (U15)                                                                                                                                                                         |
| F1-04 Rute sisi                             | #16 | —         | **Dalam PR**     | E2E lokal tidak dijalankan; deploy dan uji produksi ditunda atas instruksi pemilik                                                                                                                                                                    |
| F1-05 Cara kami bekerja menggantikan studio | —   | —         | **Dalam branch** | CI dan e2e dilewati atas instruksi pemilik; isi halaman tetap ditandai contoh hingga ditinjau pemilik                                                                                                                                                 |
| F1-06 Navigasi Arthur                       | —   | —         | **Dalam branch** | CI dan e2e dilewati atas instruksi pemilik; `/work` dan `/journal` tetap hidup tetapi tidak dipromosikan                                                                                                                                              |
| F1-07 Bahasa bawaan dan segmen URL          | —   | —         | **Dalam branch** | CI dan e2e dilewati; ID tidak menawarkan EN yang belum disetujui, sementara halaman EN lama/pratinjau tetap menyediakan jalan kembali ke ID; usulan perubahan prosedur §3 langkah 9 menunggu pemilik                                                  |
| F1-08 Kamus gerak dan nama momen            | —   | —         | **Dalam branch** | Dokumentasi spesifikasi saja; implementasi tujuh momen tetap untuk F3/F4; PR ditunda selama e2e dilarang                                                                                                                                              |
| F2-01 Pengaturan situs                      | —   | —         | **Dalam branch** | Skema production sudah dideploy dan satu `siteSettings` ditulis sebagai draft `perlu-anda`; **NOTE:** `kontak@arth.invalid` dan alamat Contoh tetap dummy, wajib diganti sebelum publikasi kontak (U28)                                               |
| F2-02 Unit dan sisi                         | —   | —         | **Dalam branch** | Tiga unit dan enam sisi ditulis sebagai draft `perlu-anda`; sisi memakai referensi yang menguat saat unit kelak diterbitkan; delapan `project.practice` lama belum dimigrasikan (U28)                                                                 |
| F2-03 Bab                                   | —   | —         | **Dalam branch** | Skema `bab`, query pembaca, relasi kuat ke sisi, dan jembatan weak yang ditambahkan bersama target F2-04 tersedia; tidak ada dokumen Sanity yang ditulis                                                                                              |
| F2-04 Offer                                 | —   | —         | **Dalam branch** | Skema delapan blok, grup Internal yang aman dibaca publik, query dengan allowlist medan, serta jembatan weak tersedia; belum ada impor atau penulisan Sanity                                                                                          |
| F2-05 Rangkaian, cara kerja, FAQ, dan page  | —   | —         | **Dalam branch** | Satu `howWeWork` ditulis sebagai draft `perlu-anda`; sequence, FAQ, dan page belum ditulis, dan field page lama tetap tersembunyi-baca saja hingga rencana mutasi §6 disetujui (U28)                                                                  |
| F2-06 Struktur Studio                       | —   | —         | **Dalam branch** | Studio mengurutkan Unit → Sisi → Bab → Offer, menyediakan daftar `Perlu Anda`, dan membuka singleton Cara kami bekerja; tidak ada pengaturan atau isi jarak jauh diubah                                                                               |
| F2-07 Kendali terbit dan medan internal     | —   | —         | **Dalam branch** | Query Arthur hanya memilih dokumen `disetujui`; medan internal tidak diproyeksikan; aksi Studio memakai administrator sebagai proxy pemilik (U27); tidak ada isi Sanity ditulis dan e2e dilewati atas instruksi pemilik                               |
| F2-10 Pratinjau di Studio                   | —   | —         | **Dalam branch** | Presentation memetakan Pengaturan situs, Cara kami bekerja, Rangkaian, Unit, Sisi, Bab, dan Offer ke rute nyata; FAQ belum dipetakan karena tidak memiliki halaman mandiri                                                                            |
| F2-11 Panduan Studio                        | —   | —         | **Dalam branch** | Panduan Studio ditulis ulang untuk Unit → Sisi → Bab → Offer, alur status, urutan terbit, daftar pendek, dummy kontak, dan batas pratinjau; tidak ada isi atau setelan Sanity diubah                                                                  |
| F3-01 Beranda payung                        | —   | —         | **Dalam branch** | Hero Arthur, tiga pintu unit dari datum, situasi yang menunjuk unit, rangkaian tiga unit, cara kerja, dan ajakan sudah tersusun; jalur publik hanya membaca dokumen disetujui, sedangkan draft `perlu-anda` tampil hanya dalam draft mode (U30)       |
| F3-02 Template unit                         | —   | —         | **Dalam branch** | Susunan hero, dua pintu sisi, masalah pembeli, offer kondisional, cara kerja, jembatan kondisional, CTA, dan unit berikutnya sudah selesai; copy fallback identik dengan draft awal yang disetujui, dengan Sanity tetap menjadi sumber utama (U31)    |
| F3-03 Template sisi                         | —   | —         | **Dalam branch** | Jalur pembelian, tabel bab semantik, crosshair/cover-preview, dan pertukaran lembar antarsisi sudah selesai; tabel jujur menampilkan keadaan kosong sampai bab punya tiga sampai tujuh offer yang disetujui (U32)                                     |
| F3-04 Template bab dan kartu offer          | —   | —         | **Dalam branch** | Kutipan bab, tiga–tujuh kartu offer tanpa foto, batas, jembatan, ajakan, penyaring pasar Konstruksi, serta momen bekisting/FLIP sudah selesai; belum ada dokumen bab/offer untuk menampilkan rute nyata (U33)                                         |
| F3-05 Template offer                        | —   | —         | **Dalam branch** | Delapan blok offer, langkah tanpa pin, garis lingkup, batas dipaku, langkah pertama, jembatan aman, dan lembar cetak sudah selesai; belum ada dokumen offer untuk menampilkan rute nyata (U34)                                                        |
| F3-06 Halaman jaringan                      | —   | —         | **Dalam branch** | Tiga jalur, cara kerja, alur uang empat langkah, asal komisi, larangan, syarat, dan gerbang pendaftaran sudah selesai; tautan bab baru muncul setelah 3–7 offer jalurnya disetujui, dan pendaftaran ditahan sampai kartu komisi siap (U35)            |
| F3-07 Satu klien, tiga unit                 | —   | —         | **Dalam branch** | Situasi, tiga langkah unit, offer per langkah, keterangan kemungkinan, CTA, serta momen `splice` lalu `level` sudah selesai; production belum memiliki dokumen `sequence`, jadi rute publik tetap pada tampilan tidak ditemukan dan noindex (U36)     |
| F3-08 Cara kami bekerja                     | —   | —         | **Dalam branch** | Template membaca hanya `howWeWork` yang disetujui untuk publik dan membuka draft `perlu-anda` hanya di draft mode; janji dicap satu kali saat dibaca, hak milik/komisi/batas memakai garis tegak, wilayah diukur, tanpa testimoni; e2e dilewati (U29) |
| F3-09 Tentang dan kontak                    | —   | —         | **Dalam branch** | Rute tetap, pernyataan pemilik bersyarat, tiga wilayah, ledger kontak, navigasi, pencarian, dan Presentation sudah selesai; dummy tetap teks ber-NOTE tanpa aksi dan halaman noindex sampai K5 serta fakta nyata tersedia (U37)                       |
| F3-10 Kebijakan                             | —   | —         | Belum mulai      | Draf membutuhkan tinjauan ahli hukum sebelum noindex dapat dilepas                                                                                                                                                                                    |
| F3-11 Penjaga saat render                   | —   | —         | **Dalam branch** | Penjaga menahan siteSettings, unit, sisi, bab, dan offer dengan placeholder dari HTML serta metadata; build/check menolak literal placeholder di luar fallback dan validator yang ditinjau                                                            |
| F3-12 Uji rute dinamis dan ponsel           | —   | —         | Ditunda          | Bergantung F2-09 dan dilarang selama semua e2e—lokal maupun GitHub Actions—dihindari atas instruksi pemilik                                                                                                                                           |
| F0-02 Uji terbit menampilkan isi baru       | —   | —         | Belum mulai      | Bergantung F0-06                                                                                                                                                                                                                                      |
| F0-03 Token produksi hanya Viewer           | —   | —         | Menunggu pemilik | Tindakan dasbor                                                                                                                                                                                                                                       |
| F0-04 Token dev dicabut                     | —   | —         | Menunggu pemilik | Tindakan dasbor; paling lambat sebelum F5-05                                                                                                                                                                                                          |
| F0-05 Ruleset cabang `main`                 | —   | —         | Menunggu pemilik | Tindakan dasbor. Terakhir diukur `gh api …/rules/branches/main` → `[]`, belum aktif                                                                                                                                                                   |
| F0-06 Dataset `ci` terpisah                 | —   | —         | Menunggu pemilik | Tindakan dasbor; memblokir F0-02 dan F2-09                                                                                                                                                                                                            |

F1-05 sampai F2-01 telah dipisah ke branch paket masing-masing. Checks dari PR
lain bukan validasi bagi branch baru. Paket selanjutnya lihat Backlog.

**F1-01, F1-02 dan F1-03 berada di satu PR**, dan itu penyimpangan dari "satu
PR per paket" yang disebut terang-terangan di sini dan di deskripsi PR-nya.
Alasannya mekanis, bukan kenyamanan: kriteria "selesai bila" F1-02 menuntut
`UNITS` menggerakkan **sitemap**, dan kriteria F1-03 yang membangun halaman
`/{unit}`. Memisahkannya berarti satu PR yang sitemap dan chip-nya menunjuk
halaman yang belum menjawab — mengiklankan 404. Pemilik boleh meminta ini
dipecah; pemecahan yang jujur hanya mungkin dengan menunda baris sitemap, bukan
dengan menunda halamannya.

**Verifikasi produksi F0-01**, diukur 2026-10-10 sesudah merge `2491472`: CI
`push` di `main` hijau (`ci` dan `e2e`, run 38017067555); deployment untuk SHA
itu READY; uji asap §3 langkah 9 lulus (`/` → `/en`, `/en` dan `/id` 200,
`/cms` 200, hreflang dan sitemap pada domain sebenarnya). `X-Robots-Tag:
noindex, nofollow` terbit di `/`, `/id`, `/robots.txt`, `/sitemap.xml`,
`/icon.png` dan `/en/journal/feed.xml`; `robots.txt` produksi menolak kedelapan
perayap AI dan tetap `Allow: /` untuk `*`; meta robots ada di `/id`.

**Verifikasi produksi F1-01/F1-02/F1-03**, diukur 2026-10-10 sesudah merge
`a052ace` pada domain publik. CI `push` di `main` hijau (`ci` dan `e2e`);
deployment Production untuk SHA itu `success`. Uji asap §3 langkah 9, diperluas
dengan status-status baru paket ini:

| Diminta                                                   | Jawaban                                   |
| --------------------------------------------------------- | ----------------------------------------- |
| `/`                                                       | 307 → `/en` (diukur sebelum F1-07)        |
| `/en`, `/id`                                              | 200 (diukur sebelum F1-07)                |
| `/{en,id}/konstruksi`, `/teknologi`, `/peekabo`           | 200, keenamnya                            |
| `/en/practice`, `/id/praktik`                             | **410**                                   |
| `/en/practice/consulting`, `/en/work/practice/commission` | **410**                                   |
| `/en/no-such-page-here`, `/id/tidak-ada`                  | **404**                                   |
| `/en/halaman`                                             | 404 (tidak ada dokumen `page` di dataset) |
| `/en/work`, `/cms`, `/robots.txt`, `/sitemap.xml`         | 200                                       |

Isi yang diperiksa, bukan hanya statusnya: halaman unit membawa
`data-sample-content` dan satu `PERLU PEMILIK`; halaman 410 adalah dokumen
lengkap (`<!doctype html>`) yang memuat wordmark Arthur, angka `410`, ketiga
tautan unit, dan `noindex, nofollow`; `X-Robots-Tag: noindex, nofollow` masih
terbit; dan `sitemap.xml` memuat keenam URL unit dan **tidak satu pun**
`/practice/`.

## Utang dokumen

Hal yang sengaja **tidak** dikerjakan, dengan alasannya, supaya tidak hilang
diam-diam.

**U1 — `docs/FORK.md` memuat pernyataan produksi yang kedaluwarsa.** §3.2 dua
kali menyatakan katalog produksi kosong "sampai env Sanity dipasang". Diukur
pada 2026-10-10: `/en/work` mengembalikan 6 karya dan `sitemap.xml` memuat 32
URL pada domain sebenarnya, jadi env Sanity sudah terpasang dan kedua
pernyataan itu tinggal sisa masa lalu. Konsekuensi lain yang ikut terjawab:
perbaikan L1 dan L6 yang di FORK.md masih bertanda "Belum diverifikasi:
produksi sesudah merge" sebetulnya sudah terbukti jalan. **Pemilik melarang
menyunting FORK.md**, karena F0-07 memakainya sebagai sumber kebenaran. Dicatat
saja.

**U2 — ekspektasi uji asap prosedur diselaraskan dalam PR dokumentasi
gerbang.** `PROSEDUR-KERJA.md` kini mengharapkan `/` → `/id`, `/en` → `/id`
(307), dan `/id` 200. `docs/DEPLOYMENT.md` diperbarui dalam F1-07 sesuai
keputusan pemilik.

F1-07 mengubah bawaan aplikasi ke Indonesia, mematikan deteksi bahasa
peramban, mengalihkan `/en` ke `/id`, memakai `id` sebagai fallback GROQ,
tidak menawarkan Inggris dari halaman Indonesia sampai terjemahannya
disetujui, dan mengeluarkan hanya halaman Indonesia dari sitemap serta
hreflang. Halaman Inggris lama atau pratinjau tetap menampilkan jalan kembali
ke Indonesia agar pembaca tidak terperangkap di locale yang belum diterbitkan.
Pemeriksaan lokal lulus; verifikasi produksi menunggu F1-07 masuk `main`.

**U3 — daftar `INDEXABLE_HOSTS` kosong.** F0-01 membangun mekanisme
pengecualian domain, tapi daftarnya kosong karena K4 (domain akhir) belum
diputuskan. Jadi hari ini tidak ada host yang dikecualikan dan seluruh situs
noindex — arah yang aman. Mengisinya adalah tindakan pemilik di F5-05.
Mekanisme `missing: [{ type: 'host' }]` di `next.config.ts` **belum teruji
dengan daftar berisi**; yang teruji sekarang adalah pembangkitan kondisinya
(`lib/seo/robots-policy.test.ts`).

**U4 — kriteria F0-01 menyebut `proxy.ts`, implementasinya di
`next.config.ts`.** Kriteria "selesai bila" di Backlog berbunyi "**proxy.ts**
memasang X-Robots-Tag noindex pada setiap respons … **termasuk berkas mesin**".
Kedua paruh itu tidak bisa dipenuhi bersamaan: `config.matcher` di `proxy.ts`
justru mengecualikan `robots.txt`, `sitemap.xml`, `favicon.ico` dan setiap
ekstensi gambar dan huruf, dan `proxy.test.ts` menegaskan pengecualian itu
sebagai keputusan yang diuji. Diukur pada produksi 2026-10-10: blok
`headers()` di `next.config.ts` **sudah** menjangkau keempat berkas mesin itu.
Pemilik memilih `next.config.ts` saja, jadi `proxy.ts` tidak disentuh.

**U5 — F5-01 sebagian sudah jalan, statusnya bilang belum.** Backlog memberi
F5-01 "Daftar pendek offer" status "Belum mulai", padahal daftar pendek bab
Kuliner dan F&B sudah disetujui pemilik sebagai syarat masuk Tahap 2. Perlu
diluruskan sebelum F5, karena F5-02 bergantung padanya.

**U6 — tiga premis di Tahap 2 salah alamat seksinya**, ditemukan saat
memverifikasi ketujuh butir F0-07 terhadap repo. Substansinya benar, lokasinya
tidak: gerbang 85% tidak ada di `DESIGN-SYSTEM.md` §3 (hanya 800px; "85%" di
berkas itu adalah _line-height_ tipografi §2) tapi di `DIREKSI.md` §2.1; dial
token pensiun ada di `DESIGN-SYSTEM.md` §0, yang **sudah** menyebut dirinya
tidak lagi menggerbangi apa pun, sedangkan yang masih mengklaim sebagai aturan
ada di §4–§6; dan `RESOURCES.md` tidak menyebut **dirinya** mengikat, ia
menyebut MOTION-SPEC mengikat. Dikerjakan menurut substansinya di F0-07.

**U7 — `PANDUAN-STUDIO.md` akan ditulis ulang dua kali.** Pemilik memilih
menulis ulang istilah `discipline` ke unit/sisi/bab di F0-07 sekarang. Biayanya
dicatat: §6b mendokumentasikan URL filter yang hidup hari ini
(`/id/work/discipline/mural`) dan medan Sanity `Discipline` yang masih berisi
Lukisan/Mural/Ilustrasi, sedangkan rute unit/sisi baru ada setelah F1-03/F1-04
dan tipe Sanity setelah F2-02/F2-03. Dan F2-11 memang sudah ditugasi menulis
ulang bab itu, jadi pekerjaannya dua kali.

**U8 — `docs/ROADMAP.md` dan `docs/stages/TAHAP-*.md` tidak disunting.**
Keduanya memuat "discipline" dan klaim identitas lama, tapi tidak ada di
ketujuh butir F0-07, dan `CLAUDE.md` menyatakan `docs/stages/` arsip yang
tidak ditambah lagi. Dicatat, tidak dikerjakan.

**U9 — alamat di `PANDUAN-STUDIO.md` §6b sudah mati dua kali, bukan sekali.**
Bagian itu mendokumentasikan field `Discipline` dengan nilai Lukisan / Mural /
Ilustrasi dan alamat `/id/work/discipline/…`. Tahap 13 sudah mengganti medannya
ke `practice` dengan nilai agency (`lib/content/practices.ts` mencatat
alasannya sendiri), jadi alamat-alamat itu mati jauh sebelum Arthur. F0-07
menulis ulang bagian itu ke keadaan yang benar hari ini plus ke mana ia
berpindah; F2-11 masih akan menulis ulang babnya penuh, jadi pekerjaannya tetap
dua kali seperti dicatat di U7.

**U10 — klaim fixture di `arth-auditor.md` belum diverifikasi.** Definisi agen
itu menyatakan "ada tiga fixture karya (`fixture-*`) di dataset Sanity".
Katalog produksi hari ini menampilkan enam karya dengan slug biasa
(`arus-balik`, `bacaan-mesin`, `lantai-dua`, `pelabuhan`, `pusat-beban`,
`takar`), bukan berawalan `fixture-`, dan tab Audit menyebut 20 dokumen
fixture. Ketiga angka itu tidak bisa dicocokkan tanpa membaca dataset, dan
konektor Sanity di sesi ini belum terotorisasi. Tidak disentuh di F0-07 karena
di luar ketujuh butir dan tidak terverifikasi; F2-09 (fixture bentuk Arthur)
yang akan menyentuhnya.

**U11 — F1-01 meninggalkan prosa yang masih menyebut "Arth".** Kriterianya
berbunyi "SITE … memakai Arthur", dan `SITE.name` memang sudah membaca
`BRAND_NAME`. Yang tertinggal adalah prosa di dalamnya: `SITE.description` dan
keempat kalimat `agentGuidance` masih menulis "Arth" sebagai kata, begitu juga
`lib/content/home-fallback.ts`. Dibereskan di F1-02, karena kalimat yang sama
juga menyebut ketiga praktik lama dan harus ditulis ulang sekali saja. Yang
**belum** dibereskan: berkas `*.stories.tsx` di `vault/` (argumen demo
Storybook, bukan permukaan pembaca) dan beberapa komentar sejarah. Dicatat,
tidak dikerjakan.

**U12 — medan Sanity masih bernama `practice`, nilainya sudah kunci unit.**
Daftar tertutupnya sekarang diturunkan dari `UNITS`
(`lib/integrations/sanity/schemas/project.ts` dan `journalEntry.ts`), dan
fixture-nya sudah dipindahkan ke nilai unit. Nama medannya tidak: ada delapan
dokumen `project` yang memakainya, jadi mengganti nama medan adalah migrasi
data yang butuh `ok tulis`. `journalEntry` nol dokumen dan karenanya gratis,
tapi mengganti satu dan bukan yang lain membuat dua paruh kosakata yang sama
berselisih. **F2-02 mengganti nama kedua medan bersama datanya.** Sampai saat
itu kode membaca `entry.practice` dan `project.practice` dan setiap tempatnya
mencatat kenapa.

**U13 — `?practice=` menjadi `?unit=`, dan satu parameter query berubah
alamat.** Katalog `/work` menyaring dengan `?unit=<kunci>` sekarang. Tidak ada
yang menautkan bentuk lama dari luar situs sejauh yang bisa diukur, dan `/work`
sendiri keluar dari navigasi di F1-06, jadi tidak dibuatkan pengalih. Kalau
pemilik ingin bentuk lama tetap bekerja, itu satu baris di
`lib/seo/route-status.ts` dan perlu diminta.

**U14 — halaman CMS pindah dari `/<slug>` ke `/halaman/<slug>`.** Sebuah unit
adalah segmen **satu tingkat**, dan `app/[locale]/[unit]` segmen **dinamis**.
Next menyelesaikan satu segmen dinamis sebelum catch-all, jadi `[unit]`
menangkap `/about` lebih dulu dan dokumen `page` Sanity menjadi tak terjangkau
tanpa error apa pun. Daftar slug terlarang tidak bisa memperbaikinya: ia harus
menyebut setiap slug yang mungkin pernah diterbitkan. Pemilik memilih prefiks
`halaman`. Biayanya: setiap URL halaman CMS berubah. Diukur 2026-10-10 —
dataset memuat **nol** dokumen `page`, jadi tidak ada alamat yang sedang
dipakai yang rusak. Konsekuensi yang ikut: `RESERVED_SLUGS` tidak punya lagi
pekerjaan dan dihapus, begitu juga penjaga slug di `project.ts` yang sebelumnya
salah memakainya (slug proyek hidup di `/work/<slug>`, jadi `konstruksi` di
sana tidak pernah bertemu `/konstruksi`).

**U15 — tiga gerbang e2e melemah karena subjeknya pensiun, dan satu dihapus.**
Disebut satu per satu supaya tidak terbaca seperti pembersihan:

- `e2e/visual-substance.e2e.ts` — halaman `/practice/<value>` adalah salah satu
  rute terkaya di situs dan ada di sapuan "substansi" serta satu-satunya rute
  selain beranda yang menyatakan `[data-accent-region]`. Halaman unit
  penggantinya memuat judul, satu blok isi contoh, dan dua tautan unit lain.
  Memasukkannya berarti menurunkan lantai gerbang ke apa pun yang kebetulan
  diukur sebuah kerangka. Jadi halaman unit **tidak** masuk sapuan itu sampai
  F3-02 memberinya isi, dan `ACCENT_ROUTES` tinggal satu entri.
- `e2e/practice-capabilities.e2e.ts` — **dihapus**. Yang diukurnya adalah momen
  tersemat `capability-set` di halaman praktik, dan momen itu hilang bersama
  rutenya. `/studio` merender baris yang sama sebagai `<dl>` biasa, yang
  dijaga `lib/content/units.test.ts` (isi) dan `route-sweep` (render). Momen
  geraknya butuh gerbang baru, dan F3-04 yang akan membutuhkannya.
- `e2e/practice-trail.e2e.ts` → `e2e/breadcrumb-trail.e2e.ts` — cacatnya
  (jejak remah roti tertutup header tetap, WCAG 2.2 SC 2.4.11) tidak pernah
  soal rute itu; ia soal header dan `components/ui/breadcrumbs`. Dialihkan ke
  halaman entri jurnal, yang `journal-fallback.ts` menjamin ada di kedua
  bahasa, jadi gerbangnya tidak bisa lulus dengan melewati.
- `e2e/practice-page.e2e.ts` → `e2e/unit-page.e2e.ts` — dua dari tiga
  asersinya bertahan (halaman ada dan menamai dirinya; satu URL kanonik).
  Asersi "menyaring katalog ke karyanya sendiri" **tidak**, karena halaman unit
  bukan daftar; penyaringnya tetap diukur di `/work?unit=<kunci>`. Ditambah
  satu asersi baru: label isi contoh harus ada di halaman yang dilayani.
- `vault/vault-api.test.ts` — empat prop kehilangan satu-satunya pemanggilnya
  (halaman praktik) dan masuk daftar `DELIBERATE` dengan alasannya, bukan
  dihapus: `vault/` perpustakaan, dan `data-epic` justru akan punya lebih
  banyak pemanggil setelah kamus gerak F1-08.

**U16 — isi contoh jurnal tidak lagi tercatat di bawah unit mana pun.** Ketiga
entri cadangan di `lib/content/journal-fallback.ts` ditulis untuk situs lama
dan membahas praktik lama. Aturan isi melarang menyunting isi contoh menjadi
isi Arthur, jadi prosanya dibiarkan apa adanya dan medan `practice`-nya diisi
`null` — memilih satu unit untuknya berarti mengarang klaim tentang unit mana
yang menerbitkan apa. Tabel di `/journal` tetap menampilkan satu baris per
unit, dengan nol entri masing-masing, yang justru tepat.

**U17 — `areaServed` pernah menyebut "Worldwide". Selesai di F2-01.** Aturan
isi menyebut wilayah yang boleh diklaim: Subang, Purwakarta, dan Bandung.
`lib/seo/site.ts` kini memakai daftar itu; `siteSettings.wilayah` menjadi tempat
pemilik menyunting wilayah setelah konten Sanity disiapkan.

**U18 — dua setengah dari kosakata lolos `typecheck` dan hanya CI yang
menangkapnya.** Dicatat karena F1-04 sampai F1-06 akan mengganti kosakata
lagi, dan ini bentuk cacat yang akan terulang.

Penggantian `practices` → `units` di F1-02/F1-03 menghasilkan sebelas
kegagalan e2e yang `bun run check` tidak bisa lihat, dari empat sebab:

1. **`?practice=` → `?unit=` ditulis di dokumen dan tidak diimplementasikan.**
   `app/[locale]/work/page.tsx` masih mendestruktur `practice` dari
   `searchParams` dan `hrefs.ts` masih menyusun `?practice=`. Tidak ada tipe
   yang dilanggar — sebuah kunci query yang tidak ada hanya bernilai
   `undefined` — jadi katalog diam-diam jatuh ke keadaan "tanpa penyaring".
2. **Ejaan Indonesia sebuah rute pensiun terlewat.** `/en/practice` menjawab
   410 sementara `/id/praktik` menjawab 404, karena `GONE_PREFIXES` hanya
   memuat ejaan Inggris.
3. **Keputusan isi yang benar menghapus sebuah lapisan visual.** Mencatat
   entri jurnal contoh di bawah "tidak ada unit" (U16) membuat
   `coversByPractice` kehilangan kolamnya, dan setiap baris `/en/journal`
   kehilangan gambarnya.
4. **Memindahkan `loading.tsx` ikut memindahkan jalan keluar tanpa
   JavaScript.** Diukur di build: tanpa berkas itu rute 404 dalam chrome
   menjawab `status: 404` asli tapi hanya 1657 bita HTML, tanpa judul, tautan,
   atau teks 404.

Pelajaran yang berlaku untuk paket berikutnya: **kunci query, ejaan kedua
sebuah segmen, dan berkas `loading.tsx` tidak dijaga tipe.** Grep untuk nilai
lamanya di seluruh `e2e/` sebelum push — empat belas spesifikasi menunjuk rute
praktik dan tidak satu pun mengimpor modulnya, jadi `tsc` tidak punya apa pun
untuk dikatakan tentang mereka.

**U19 — migrasi singleton Sanity F2-01 menunggu izin §6.** Query baca-saja
menemukan satu dokumen lama di dataset `production`: `fixture-studioSettings`.
Kode kini membaca `siteSettings` lebih dahulu dan tetap membaca tipe lama agar
konten tidak hilang sementara. Tidak ada mutasi yang dijalankan. Sebelum
perubahan skema digabung, pemilik perlu meninjau rencana pemetaan
`headline` → `heroJudul`, `subline` → `heroSubjudul`, `statement` →
`pernyataanPemilik`, `email` → `kanal.email`, `socials` → `akunSosial`, dan
menyetujui rencana tulis §6; email lama `.example` tidak dipindahkan sebagai
alamat sungguhan. Rollback memakai ekspor sebelum mutasi dan memulihkan
`fixture-studioSettings`. Dummy `kontak@arth.invalid` bukan keputusan K5 dan
harus diganti sebelum kontak diterbitkan. Pemilik mengizinkan alamat contoh
`Jl. Contoh No. 00, Kota Contoh, Indonesia` dengan NOTE bahwa itu bukan lokasi
nyata atau tempat kunjungan; ganti sebelum publikasi. Wilayah layanan yang
bersumber dari konteks adalah Subang, Purwakarta, dan Bandung.

**U20 — `rangkaianPilihan` sekarang mengarah weak ke `sequence`.** F2-05
menambahkan relasi ini setelah targetnya tersedia. Kunci `sisi` dan `bab` pada
`siteSettings.situasi` tetap berupa teks agar data lama tidak berubah tanpa
rencana mutasi §6; F2-07 akan menetapkan bentuk migrasi dan penjaga terbitnya.
Wilayah dan situasi tersedia di Studio, tetapi pemakaian halaman lengkap datang
di F3-01 dan F3-09.

**U21 — F2-02 menunggu mutasi `practice` → `unit` yang disetujui.** Delapan
dokumen `project` memakai medan lama `practice`; `journalEntry` tercatat nol.
Skema dan query sementara membaca `unit` lebih dulu lalu `practice`, dan medan
lama tetap baca-saja supaya halaman tidak kosong saat migrasi belum berjalan.
Rencana tulis §6 yang diperlukan: ekspor cadangan di luar repo; query jumlah
dan nilai `practice` sebelum mutasi; patch masing-masing `project` ke `unit`
dengan nilai sama; pastikan jumlah, slug, dan hasil query katalog sebelum/sesudah
tetap sama; baru kosongkan medan lama setelah izin penghapusan terpisah. Tidak
ada mutasi atau penghapusan Sanity dilakukan di branch ini.

**U22 — cache incremental TypeScript tidak aman untuk registry TypeGen
Sanity.** Setelah skema atau query Sanity berubah, TypeScript 7 dapat memakai
`tsconfig.tsbuildinfo` lama dan menurunkan semua hasil `defineQuery()` menjadi
`unknown`, meski pemeriksaan tanpa cache lulus. Ini bukan galat data Sanity;
hasil sumbernya tetap benar. `check`, `typecheck`, dan hook pre-commit sekarang
menonaktifkan incremental agar registry selalu dibaca ulang. Biayanya adalah
pemeriksaan lokal lebih lambat; biayanya lebih kecil daripada false negative
yang menyamarkan perubahan skema.

**U23 — ekstraksi skema Sanity memakai Node, bukan Bun.** Bun 1.3.5 tetap
runtime proyek dan menjalankan pemeriksaan, tetapi worker `sanity schema
extract` menghasilkan `Attempted to assign to readonly property` saat
dijalankan melalui Bun. CLI yang sama melalui Node 26 mengekstrak 31 tipe,
termasuk `unit` dan `side`, lalu TypeGen selesai normal. Skrip
`sanity:extract` dan `sanity:typegen` karena itu memanggil binary Sanity
dengan Node; biaya keputusan ini adalah satu pengecualian runtime yang dicatat
terang, bukan skema yang tampak diterapkan tetapi tidak pernah masuk
`schema.json`.

**U24 — relasi weak dari unit ke offer ditambahkan oleh F2-04.**
`contohOffer` dan `jembatan.offer` baru didaftarkan sesudah tipe `offer`
tersedia, sehingga Studio tidak pernah menawarkan target semu. Kedua relasi
tetap weak karena bukan hubungan induk-anak; biaya pilihan ini adalah query
halaman hanya boleh merender target yang telah lolos kendali terbit F2-07.

**U25 — jembatan dari bab ke offer ditambahkan oleh F2-04.** `bab.jembatan[]`
sekarang memuat referensi weak serta satu kalimat, dengan batas dua jembatan.
Tidak ada dokumen bab yang ditulis atau diubah; referensi baru hanya menjadi
dapat diedit setelah target `offer` hadir.

**U26 — page lama → halaman dua bahasa menunggu mutasi §6.** F2-05 membaca
`judul`/`isi` lebih dulu dan jatuh kembali ke `title`/`content`, sementara
medan lama disembunyikan-baca saja dan `link` tidak lagi diproyeksikan. Rencana
tulis yang harus ditinjau sebelum mutasi: hitung dokumen `page` yang hanya
memiliki medan lama; ekspor dataset ke luar repo; dry-run pemetaan
`title → judul[id]` dan `content → isi[id]`; lakukan patch hanya pada dokumen
yang belum memiliki nilai baru; lalu bandingkan jumlah sebelum/sesudah dan
verifikasi query lama maupun baru memberi teks yang sama. Medan lama baru boleh
dikosongkan setelah izin penghapusan terpisah. Tidak ada jumlah yang diasumsikan
dan tidak ada mutasi dilakukan di branch ini.

**U27 — pemilik Studio belum dapat dikenali dengan identitas khusus di source
control.** F2-07 menggunakan peran bawaan Sanity `administrator` sebagai proxy
pemilik untuk aksi **Setujui** dan **Terbitkan**. Biayanya jelas: administrator
tambahan di masa depan akan ikut memiliki kuasa itu. Aksi penerbitan standar
untuk tipe Arthur diganti sehingga draf harus berstatus `disetujui`; query
pembaca juga hanya mengambil status tersebut dan tidak memproyeksikan
`idKatalog`, jejak sumber, status, atau data internal lain. Peran dan token
tetap merupakan setelan dasbor pemilik—perubahan API dengan token yang dapat
menulis tidak bisa diamankan oleh tombol Studio saja. Tidak ada dokumen,
token, atau setelan Sanity yang diubah. Pemeriksaan e2e tidak dijalankan atas
instruksi pemilik; pengujian yang dijalankan hanya schema/typegen, typecheck,
dan test unit non-e2e.

**U28 — skema production dan isi awal Arthur sudah ditulis, tetapi belum ada
yang diterbitkan.** Atas izin tertulis pemilik pada 2026-10-12, skema lokal
dideploy ke dataset `production` sebagai `_.schemas.default`, lalu sebelas
dokumen dibuat dengan status `perlu-anda`: satu `siteSettings`, tiga `unit`,
enam `side`, dan satu `howWeWork`. Snapshot raw 38 dokumen sebelum penulisan
disimpan di luar repo dengan SHA-256
`F76F18A72C5C2FA0EB45DEF5903C82A65195E0EBD1CC211D837DA2CC07DE6704`.
Query perspektif published sesudah penulisan tetap menemukan **nol** dokumen
untuk empat tipe tersebut. Karena unit juga masih draft, enam sisi memakai
referensi `_strengthenOnPublish`: relasinya lemah sementara dan baru menguat
ketika unit kelak diterbitkan. Validator menyatakan lima dokumen sasaran lain
valid; keenam sisi hanya tertahan oleh target unit yang belum published.

**NOTE kontak:** `kontak@arth.invalid` dan `Jl. Contoh No. 00, Kota Contoh,
Indonesia` sengaja disimpan hanya sebagai dummy draft sesuai izin pemilik.
Keduanya bukan kanal atau lokasi nyata, dan wajib diganti sebelum halaman
kontak diterbitkan. Validasi dataset juga menemukan 150 galat format bahasa
pada tujuh fixture lama (`project` dan `studioSettings`); data lama itu tidak
termasuk izin tulis ini dan tidak diubah.

**U29 — template Cara kami bekerja selesai di branch, sedangkan isi tetap
draft.** F3-08 sekarang memakai satu query publik yang tetap mensyaratkan
`statusTinjauan == "disetujui"` dan query pratinjau terpisah yang hanya dipakai
dengan perspektif draft. Keduanya memproyeksikan allowlist medan pembaca yang
sama; status dan medan Internal tidak masuk HTML. Empat janji memakai blok
`promise-stamp`: setiap baris diamati sendiri, cap memakai timing primitif
`stamp`, tidak diputar ulang, dan sudah terlihat pada no-JavaScript maupun
reduced motion. Bagian hak milik, komisi, dan batas memakai `plumb`; wilayah
memakai `dimension`; tidak ada testimoni. Header memakai kalimat siap tayang
dari Master Brief tanpa perubahan. `bun run check` lulus 633 uji non-e2e dan
build produksi menyelesaikan 97/97 halaman. Studio lokal menyatakan origin
`http://localhost:3000` belum terdaftar di CORS; setelan tidak diubah sesuai
pagar, sehingga pemeriksaan visual isi draft harus dilakukan lewat Presentation
yang sudah terhubung atau setelah pemilik menambahkan origin. Tidak ada e2e,
publish, push, atau perubahan production lain pada paket ini.

**U30 — beranda Arthur tidak lagi mempromosikan fixture studio lama.** F3-01
mengganti karya pilihan, jurnal, dan istilah Praktik pada beranda dengan urutan
yang ditetapkan kerangka: hero payung, tiga pintu unit, pilih situasi, satu
klien–tiga unit, cara kami bekerja, dan ajakan. Hero memuat tiga elemen teks;
pintu unit memakai `datum` dan lintasan `arth-passage`; setiap situasi tetap
menamai unit tujuannya tanpa JavaScript, memakai `leader` pada hover/fokus atau
saat masuk layar sentuh, dan menghilangkan garis di reduced motion. Query
publik berhenti membaca `studioSettings`; hanya `siteSettings` dan unit
berstatus `disetujui` yang boleh menang. Query pratinjau terpisah membaca 11
draft awal melalui perspektif terautentikasi tanpa memproyeksikan status atau
medan Internal. Sampai pemilik menerbitkan isi, fallback beranda mengambil
teks siap tayang yang sama dari Master Brief—bukan proyek, klien, atau hasil
fiktif. Kanal dan alamat tetap dummy berlabel sesuai NOTE U28. E2e tidak
dijalankan atas instruksi pemilik.

**U31 — template unit sekarang memulai dari masalah pembeli, bukan daftar
layanan.** F3-02 mengganti scaffold contoh dengan hero unit, dua pintu sisi,
masalah yang dibaca, cara kerja unit, CTA, dan sirkuit ke unit berikutnya.
Copy fallback identik dengan draft awal yang telah disetujui pemilik;
published Sanity tetap menang pada jalur publik dan draft hanya dapat dibaca
dalam draft mode. Offer contoh dan jembatan tidak dikarang: bloknya baru
muncul jika referensinya lengkap dan dapat membentuk rute yang sah. Urutan
sisi Teknologi pada draft berlawanan dengan keputusan peta situs, sehingga
renderer mengunci urutan kanonis `siap-pakai` lalu `paham-teknis` dari
`SIDES`; data production tidak dimutasi. CTA tetap memakai
`kontak@arth.invalid` dengan NOTE bahwa alamat itu dummy dan harus diganti
sebelum publikasi. Spesifikasi e2e diselaraskan, tetapi Playwright tidak
dijalankan sesuai instruksi pemilik.

**U32 — template sisi membawa pembaca dari alur ke bab, tanpa mengarang
katalog.** F3-03 mengganti scaffold sampel dengan urutan beli dari sisi,
tabel bab yang semantik, dan satu langkah pertama yang mengambil copy dari
draft Sanity yang sudah tersedia atau fallback siap tayang yang identik.
Crosshair dan cover-preview hanya melapisi tabel; tautan bab dan offer tetap
dapat dibaca tanpa JavaScript. Query publik membatasi daftar pada bab dan
offer berstatus `disetujui`, serta membutuhkan tiga sampai tujuh offer per bab.
Saat pemeriksaan ini belum ada dokumen `bab` atau `offer` di production, jadi
keadaan kosong adalah hasil yang disengaja—bukan katalog fiktif. Pertukaran
sisi memakai transisi `sheet`, tetapi tetap menjadi tautan biasa tanpa
JavaScript dan langsung berpindah saat reduced motion. Query draft divalidasi
secara baca-saja; tidak ada data Sanity ditulis atau diterbitkan. Spesifikasi
e2e diselaraskan, tetapi Playwright tidak dijalankan sesuai instruksi pemilik.

**U33 — template bab hanya muncul bila katalog siap dibaca.** F3-04
menambahkan kutipan pembeli, kartu offer tanpa foto, batas, jembatan, dan
langkah pertama yang kembali ke langkah sisi bila bab tidak mengisinya. Jalur
publik menerima tepat tiga sampai tujuh offer yang `disetujui`; setiap kartu
harus memiliki slug, judul, dampak, pembaca, dan jenis, serta medan Internal
tidak diproyeksikan. Penyaring hanya aktif di Konstruksi › Pelaku proyek,
menampilkan offer `keduanya` di dua pilihan pasar, dan tersembunyi tanpa
JavaScript. Formwork dan FLIP menamai momen `bab-formwork` dan `bab-sift`;
reduced motion menyisakan hasil akhirnya. Saat implementasi ini dibuat,
production tidak memiliki dokumen `bab` atau `offer`, sehingga rute nyata
belum dapat ditinjau secara visual tanpa fixture atau draf bersumber. Query
Sanity diuji baca-saja dan tidak ada isi ditulis atau
diterbitkan. Playwright tidak dijalankan sesuai instruksi pemilik.

**U34 — halaman offer adalah lembar kerja, bukan brosur.** F3-05 merender
delapan blok tetap: judul dan dampak, pembaca, situasi, pekerjaan, serahan,
batas, langkah pertama, lalu jembatan opsional. Judul dibatasi delapan kata
pada gerbang render; langkah dan serahan harus lengkap dan tidak memakai pin.
Garis dimensi menjelaskan rentang masalah sampai serahan, sedangkan empat
tanda `offer-fixings` mengunci batas dalam urutan searah jarum jam. Tombol
cetak memakai lembar browser dengan navigasi dan chrome situs disembunyikan.
Query publik kini menuntut offer beserta bab, sisi, dan unit induknya berstatus
`disetujui`; target jembatan juga harus mempunyai rantai induk yang disetujui.
Query pratinjau draft dipisahkan dan kedua jalur hanya memproyeksikan medan
pembaca. Saat paket ini dibuat production masih tidak memiliki dokumen
`offer`, sehingga bentuk nyata belum dapat ditinjau tanpa fixture atau draf
bersumber. Query production diuji baca-saja; tidak ada isi ditulis atau
diterbitkan. Playwright tidak dijalankan sesuai instruksi pemilik.

**U35 — halaman jaringan menjelaskan uang sebelum membuka pendaftaran.**
F3-06 memberi Peekabo › Jaringan susunan khusus: tiga jalur masuk, cara kerja,
alur uang perujuk, asal komisi, hal yang tidak ada, syarat pembayaran, lalu
gerbang pendaftaran. Jalur bab hanya menjadi tautan bila query sisi menemukan
bab dengan tiga sampai tujuh offer yang dapat dirender; production belum
memiliki dokumen `bab` atau `offer`, jadi tidak ada tautan kosong atau katalog
karangan. Alur perujuk memakai empat langkah yang ditetapkan spesifikasi,
`plumb` berbasis CSS view timeline, dan `stamp` per langkah; tidak ada pin,
loop JavaScript, angka, tarif, atau simulasi penghasilan. Copy bisnis berasal
dari draft awal sisi Jaringan yang sudah disetujui untuk ditulis, dengan
fallback lokal identik; medan Internal tetap tidak diproyeksikan. Mengikuti
usul keputusan 6 di Kerangka Pemandu, tombol pendaftaran sengaja tidak dibuat
sampai kartu komisi pertama siap. Biayanya adalah tidak mengumpulkan calon
pendaftar sekarang; manfaatnya, Arthur tidak meminta orang bergabung sebelum
sumber, pemicu, jumlah, dan waktu pembayaran komisi dapat ditunjukkan
tertulis. Tidak ada isi Sanity ditulis atau diterbitkan. Playwright/e2e tidak
dijalankan sesuai instruksi pemilik.

**U36 — rangkaian tiga unit hanya tampil bila seluruh urutannya dapat
dipertanggungjawabkan.** F3-07 mengganti daftar mentah dengan situasi, tepat
tiga langkah unit, satu atau dua offer per langkah, keterangan bahwa rangkaian
itu mungkin, dan ajakan “Ceritakan masalahnya”. Dua `splice` menyambung langkah
secara berurutan dan `level` menutup rangkaian; tanpa JavaScript maupun pada
reduced motion semua sambungan sudah terpasang. Query publik menuntut dokumen
sequence dan ketiga unit berstatus `disetujui`, lalu hanya membaca offer yang
seluruh rantai offer → bab → sisi → unit juga disetujui. Jumlah referensi asli
dibandingkan dengan hasil proyeksi supaya offer yang tertahan tidak diam-diam
menghasilkan rangkaian yang lebih pendek. Query draft dipisahkan, medan
Internal tidak diproyeksikan, dan gerbang Zod menolak langkah yang tidak utuh
serta placeholder editorial. Saat implementasi ini dibuat, dataset production
memiliki nol dokumen `sequence`; rute publik karena itu tetap menampilkan
keadaan tidak ditemukan dengan `noindex`, bukan contoh karangan. Pada Cache
Components dokumen ini berstatus HTTP 200 setelah shell statis terkirim—trade
yang sudah dicatat untuk 404 dalam-chrome—sehingga catatan ini tidak mengklaim
status HTTP 404. Tidak ada isi Sanity ditulis atau diterbitkan. Playwright/e2e
tidak dijalankan sesuai instruksi pemilik.

**U37 — halaman Tentang dan kontak selesai secara struktur tanpa memutuskan
K5 secara diam-diam.** F3-09 menambahkan rute tetap `/id/kontak`, memindahkan
tautan header dari jangkar beranda ke rute itu, lalu menyelaraskan daftar rute,
pencarian, penjaga 404, tebakan `/contact`, dan Presentation Studio. Query
publik hanya membaca `siteSettings` berstatus `disetujui`; draft mode memakai
query terpisah, dan keduanya memproyeksikan hanya pernyataan, wilayah, kanal,
alamat, akun resmi, dan metadata yang dibutuhkan pembaca. Batas Zod serta
penjaga placeholder menahan dokumen rusak, tautan sosial berskema tidak aman,
nomor WhatsApp tidak sah, dan penanda editorial. Pengukuran dataset production
pada 14 Oktober 2026 menemukan satu draft `siteSettings`: nama Arthur serta
Subang, Purwakarta, dan Bandung sudah ada; pernyataan pemilik, WhatsApp, waktu
balas, akun resmi, dan metadata masih kosong; email dan alamat masih dummy yang
diizinkan. Karena itu email dummy dan alamat contoh tampil sebagai teks
ber-NOTE, tidak menjadi `mailto:`, tombol salin, lokasi nyata, atau janji bahwa
kontak telah dibuka. Halaman tetap `noindex`; formulir tidak dibuat, sehingga
tidak ada route handler, env, atau permukaan penyimpanan data baru yang
memerlukan tinjauan keamanan F5-06. Tidak ada isi Sanity ditulis atau
diterbitkan. Playwright/e2e tidak dijalankan sesuai instruksi pemilik.
