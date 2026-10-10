# PROGRES ARTHUR

Satu baris per paket kerja, diperbarui **di dalam PR paket itu sendiri** —
bukan sesudahnya, supaya ia tidak bisa kedaluwarsa tanpa terlihat di diff.

**Untuk sesi berikutnya:** baca berkas ini, lalu baris paket berikutnya di tab
_Backlog implementasi_, lalu tabel keputusan K1–K9. Itu cukup untuk mulai
bekerja — tidak perlu membaca ulang keempat artefak atau dokumen repo.

Rencana lengkapnya ada di artefak Claude Docs _Rencana Implementasi Website
Arthur_ (51 paket, enam fase F0–F5) dan urutan kerjanya di _Tahap 2 — Instruksi
Prompting_. Prosedur per PR mengikat di
[`PROSEDUR-KERJA.md`](./PROSEDUR-KERJA.md).

## Keputusan pemilik yang berlaku

| Keputusan          | Isi                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------ |
| K1, K2             | Bahasa bawaan Indonesia, `/` → `/id`, Inggris menyusul, `/en` tanpa terjemahan 307 → `/id` |
| K3, K4, K6, K7, K8 | Berlaku sementara pada bawaannya; tidak memblokir                                          |
| **K5**             | **Belum diputuskan.** Paket yang membutuhkannya berhenti dan bertanya. Pertama kali: F2-01 |
| K9                 | Belum diputuskan; jatuh tempo sebelum noindex dilepas di F5-05                             |

Urutan paket pertama diubah pemilik dari dokumen Tahap 2: **F0-01 lebih dulu,
baru F0-07**, karena `robots.txt` produksi sedang mengizinkan semua perayap AI
memanen isi contoh, dan F0-01 memblokir F1-01.

## Paket

| Paket                                 | PR  | SHA merge | Status           | Dilewati / ditunda                                                                                   |
| ------------------------------------- | --- | --------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| F0-01 Noindex selama dummy            | #12 | `2491472` | **Selesai**      | Pengecualian domain dibangun tapi daftarnya kosong (lihat U3); lokasinya pindah dari `proxy.ts` (U4) |
| F0-07 Dokumen repo diselaraskan       | —   | —         | PR siap tinjau   | FORK.md tidak disunting (U1); `ROADMAP.md` dan `docs/stages/` tidak disentuh (U8)                    |
| F0-02 Uji terbit menampilkan isi baru | —   | —         | Belum mulai      | Bergantung F0-06                                                                                     |
| F0-03 Token produksi hanya Viewer     | —   | —         | Menunggu pemilik | Tindakan dasbor                                                                                      |
| F0-04 Token dev dicabut               | —   | —         | Menunggu pemilik | Tindakan dasbor; paling lambat sebelum F5-05                                                         |
| F0-05 Ruleset cabang `main`           | —   | —         | Menunggu pemilik | Tindakan dasbor. Terakhir diukur `gh api …/rules/branches/main` → `[]`, belum aktif                  |
| F0-06 Dataset `ci` terpisah           | —   | —         | Menunggu pemilik | Tindakan dasbor; memblokir F0-02 dan F2-09                                                           |

Paket F1 ke atas belum mulai; lihat Backlog.

**Verifikasi produksi F0-01**, diukur 2026-10-10 sesudah merge `2491472`: CI
`push` di `main` hijau (`ci` dan `e2e`, run 38017067555); deployment untuk SHA
itu READY; uji asap §3 langkah 9 lulus (`/` → `/en`, `/en` dan `/id` 200,
`/cms` 200, hreflang dan sitemap pada domain sebenarnya). `X-Robots-Tag:
noindex, nofollow` terbit di `/`, `/id`, `/robots.txt`, `/sitemap.xml`,
`/icon.png` dan `/en/journal/feed.xml`; `robots.txt` produksi menolak kedelapan
perayap AI dan tetap `Allow: /` untuk `*`; meta robots ada di `/id`.

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

**U2 — uji asap `/` → `/en` menunggu F1-07.** `docs/DEPLOYMENT.md` §3 dan §6
serta `PROSEDUR-KERJA.md` §3 langkah 9 sama-sama mengharapkan `/` mengarah ke
`/en`. F1-07 mengubahnya ke `/id`. Keputusan pemilik: DEPLOYMENT.md diperbaiki
**langsung di PR F1-07** karena ia panduan, bukan dokumen mengikat; hanya
PROSEDUR-KERJA §3 langkah 9 yang lewat jalur §7. Diukur 2026-10-10: `/` masih
307 ke `/en`, jadi keduanya masih benar hari ini.

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
