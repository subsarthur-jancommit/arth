# Konteks tim — Arthur

Berkas ini untuk **ashamoon-lang**, dan untuk siapa pun yang melanjutkan
pekerjaan ini dari workspace lain. Kita tidak berbagi sesi dan tidak berbagi
mesin; yang kita bagi adalah repositori ini. Jadi apa pun yang perlu kamu tahu
harus ada di dalam Git, bukan di dalam riwayat percakapan salah satu dari kita.

Ditulis 2026-10-10 oleh sesi Claude Code (cloud) yang mengerjakan F0 dan F1.

---

## 1. Yang sedang dibangun

Repositori ini **dulu** situs portofolio studio seni, lalu situs agency
bernama "Arth", dan isinya sampai sekarang masih sebagian besar isi contoh dari
masa itu. Yang sedang dibangun sekarang adalah situs **Arthur**: satu payung di
atas **tiga unit** —

| Unit         | Isi                         | Dua sisinya                         |
| ------------ | --------------------------- | ----------------------------------- |
| `konstruksi` | pekerjaan konstruksi        | `pelaku-proyek`, `pemilik-bangunan` |
| `teknologi`  | pekerjaan teknologi         | `siap-pakai`, `paham-teknis`        |
| `peekabo`    | agency-nya Arthur, bermerek | `pemilik-usaha`, `jaringan`         |

Tiga unit itu, dua sisi masing-masing, dan nama-nama kuncinya ada di satu
tempat: [`lib/content/units.ts`](../lib/content/units.ts). Berkas itu yang
menggerakkan rute, sitemap, daftar tertutup di Sanity, penyaring katalog, dan
data terstruktur. **Jangan menulis ulang daftarnya di tempat lain** — itu
persis cacat yang berkas itu ada untuk mencegah, dan
`lib/content/units.test.ts` adalah separuh lainnya.

Di bawah unit nanti ada **sisi → bab → offer**, dikurasi dari katalog 688
offer. Itu fase F2 dan F3; belum dibangun.

---

## 2. Empat dokumen konteks (sumber kebenaran)

Semuanya Claude Docs, sudah dipublikasikan pemilik, dan **dibaca dengan alat
Claude Docs — bukan WebFetch**. Pola bacanya: `read` pada project id dulu untuk
melihat daftar tab, lalu baca node tab yang kamu butuhkan saja. Jangan baca
semuanya; keempatnya besar.

| #   | Dokumen                                 | Untuk apa                                                                                                                                      | Tautan                                                            |
| --- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | **Rencana Implementasi Website Arthur** | **APA** yang dibangun. 51 paket di tab _Backlog implementasi_, kriteria "selesai bila" per paket, keputusan K1–K9, model isi Sanity, peta rute | <https://claude.ai/artifact/BabbqwLWbezTPt3BTEWdzN#2eed40e6-671d> |
| 2   | **Tahap 2 — Instruksi Prompting**       | **URUTAN** kerja dan **DI MANA BERHENTI**. Tabel status keputusan pemilik                                                                      | <https://claude.ai/artifact/6ArCzw6X7MTjkiDvEp75YB#77701c08-d6c7> |
| 3   | **Kerangka Pemandu Agen**               | Aturan isi, suara dan gaya, peta website. **Mengikat untuk setiap kalimat** yang dibaca pengunjung                                             | <https://claude.ai/artifact/6J5GMBUeZFEQwrr5tuUAqP#5757f1ab-1f34> |
| 4   | **Master Brief Katalog Offer**          | Bahan isi: header unit siap tayang, offer per bab, tanda † dan ‡. **Hanya dipakai di paket F2-08**                                             | <https://claude.ai/artifact/986ZYqL4f1En1uhcWDwCMu#eef9f87e-9306> |

### Urutan kewenangan, kalau ada yang bertabrakan

Yang di atas menang:

1. [`docs/PROSEDUR-KERJA.md`](./PROSEDUR-KERJA.md) dan aturan keras
   `CLAUDE.md` #22–#26
2. [`docs/FORK.md`](./FORK.md)
3. dokumen (2) Tahap 2
4. dokumen (1) Rencana
5. dokumen (3) Kerangka
6. dokumen (4) Master Brief

**Pertentangan nyata jangan diputuskan sendiri.** Laporkan ke pemilik dengan
kutipan kedua sisinya. Itu instruksi pemilik, bukan saran.

---

## 3. Rencana yang sudah ditulis

Dua hal yang sudah dituangkan dan sebaiknya kamu tinjau sebelum menambah
rencana baru:

- **[`docs/PROGRES-ARTHUR.md`](./PROGRES-ARTHUR.md)** — satu baris per paket:
  PR, SHA merge, status, apa yang dilewati. Di bawahnya bagian **Utang
  dokumen** (U1…) berisi hal yang sengaja **tidak** dikerjakan beserta
  alasannya. Baca ini dulu, selalu. Ia diperbarui **di dalam PR paket itu
  sendiri**, jadi ia tidak bisa kedaluwarsa tanpa terlihat di diff.
- **Rencana F0-01 dan F0-07** ditulis sebagai rencana sesi, dan isi
  pentingnya sudah dipindahkan ke `PROGRES-ARTHUR.md` (lihat U3 dan U4 untuk
  rancangan noindex, dan U6–U9 untuk tiga premis Tahap 2 yang salah alamat).
  Tidak ada rencana lain yang hidup di luar repo.

**Cara mulai sebuah sesi, hemat konteks:** baca `PROGRES-ARTHUR.md` (±120
baris), lalu satu baris paket berikutnya di tab _Backlog implementasi_, lalu
tabel keputusan K1–K9 di dokumen (2). Itu cukup. Tambahan hanya kalau paketnya
menulis teks yang dibaca pengunjung — maka tab **Aturan isi** dan **Suara dan
gaya** di dokumen (3) wajib dibaca dulu.

---

## 4. Pagar yang berlaku terus (dari pemilik)

Ini bukan preferensi. Ini instruksi pemilik yang masih berlaku:

- **Tidak ada yang masuk `main` selain PR dengan `ci` dan `e2e` hijau pada
  head SHA persis yang digabung.** Tanpa pengecualian. (`CLAUDE.md` #22)
- **Merge:** pemilik mencabut kewajiban menunggu `ok merge #<n>` —
  "LANGSUNG LAKUKAN MERGE SAJA KEDEPANNYA". Yang dicabut **hanya** jabat
  tangan itu. Syarat CI hijau di atas tetap.
- **Menulis ke Sanity hanya setelah pemilik menulis `ok tulis <ringkasan>`.**
  Masih berlaku penuh.
- **Jangan pernah mengubah setelan GitHub, Vercel, atau Sanity.**
- **Jangan promote, rollback, atau redeploy di Vercel.** Usulkan ke pemilik.
- **Jangan cetak nilai rahasia.** Nama variabel dan "set / tidak set" cukup.
- **Sebut terang-terangan apa pun yang gagal atau dilewati.** Jangan
  menyempitkan lingkup diam-diam.
- **`docs/FORK.md` jangan disunting** (ada pernyataan kedaluwarsa di sana;
  dicatat sebagai utang U1).

Keputusan pemilik yang sudah diambil dan keputusan yang **belum** (terutama
**K5, kanal kontak — paket yang membutuhkannya harus berhenti dan bertanya**)
ada di tabel di `PROGRES-ARTHUR.md`.

---

## 5. Cara kita bekerja bersama lewat repo ini

Kita tidak bisa saling melihat sesi. Jadi:

1. **Satu PR per paket**, dengan nomor paketnya di judul (`F1-04 …`).
   Deskripsi PR memuat bukti sesuai `PROSEDUR-KERJA.md` §3 langkah 6: nomor
   run `ci` dan `e2e`, hitungan tesnya, head SHA, risiko, dan daftar eksplisit
   apa yang tidak dikerjakan.
2. **Perbarui `PROGRES-ARTHUR.md` di dalam PR itu.** Itu papan status kita
   satu-satunya.
3. **Cabang:** jangan push ke `main`. Cabang sesi ini
   `claude/affectionate-shannon-u2xbvu`. Kalau kamu melanjutkan di cabang
   lain, sebutkan di deskripsi PR cabang mana yang kamu teruskan.
4. **Kalau kamu tidak setuju dengan keputusan yang sudah diambil di sini**,
   tulis di komentar PR, jangan diam-diam membalikkannya — alasan setiap
   keputusan ada di docstring berkasnya, dan docstring itu memang panjang
   dengan sengaja.
5. **Jangan jalankan server dev dan jangan jalankan suite e2e lokal.**
   `CLAUDE.md` bagian "Melihat hasil" mengikat: CI di GitHub Actions
   satu-satunya tempat `playwright test` berjalan. Di sesi: `bun run check`,
   dan satu `bun run build` kalau perubahannya menyentuh rendering.
6. **Bun harus tepat `1.3.5`** (`bun --version`). Bun lain menata
   `node_modules` berbeda dan `tsc` gagal. (`CLAUDE.md` #26)

---

## 6. Keadaan kode hari ini, yang perlu kamu tahu

Sudah digabung ke `main`:

- **F0-01** seluruh situs `noindex` selama isinya masih contoh, dan kedelapan
  perayap AI `Disallow: /` (PR #12, `2491472`).
- **F0-07** dokumen repo diselaraskan ke identitas Arthur (PR #13,
  `45f220b`).

Sedang dalam PR (cabang di atas): **F1-01, F1-02, F1-03** — merek, kosakata
unit, dan rute unit. Yang berubah dan mudah mengejutkan:

| Hal                               | Sebelum                                                            | Sekarang                                                                                |
| --------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Kosakata                          | `lib/content/practices.ts` (`consulting`, `ai-data`, `commission`) | `lib/content/units.ts` (`konstruksi`, `teknologi`, `peekabo`) — berkas lama **dihapus** |
| Halaman unit                      | `/practice/<value>`                                                | `/{unit}`, mis. `/id/konstruksi` (`app/[locale]/[unit]/page.tsx`)                       |
| Halaman CMS                       | `/<slug>` lewat `[...slug]`                                        | `/halaman/<slug>` (`app/[locale]/halaman/[slug]/`)                                      |
| `[...slug]`                       | halaman CMS **dan** 404 dalam chrome                               | hanya 404 dalam chrome, dua segmen ke bawah                                             |
| `/practice/*`, `/work/practice/*` | halaman hidup                                                      | **410 Gone**, status asli, halaman bermerek                                             |
| Satu segmen yang tak dikenal      | 404 lunak (status 200)                                             | **404 asli** dari `proxy.ts`                                                            |
| Penyaring katalog                 | `?practice=`                                                       | `?unit=`                                                                                |

Dua hal yang paling mudah membuat kamu bingung, jadi disebut terang-terangan:

- **Halaman CMS pindah ke `/halaman/<slug>` karena `[unit]` segmen dinamis.**
  Next menyelesaikan satu segmen dinamis sebelum catch-all, jadi `[unit]`
  menangkap `/about` lebih dulu dan halaman CMS jadi tak terjangkau — tanpa
  error apa pun. Pemilik memilih prefiks `halaman`. Alasan lengkapnya ada di
  docstring `app/[locale]/halaman/[slug]/page.tsx`.
- **Medan Sanity masih bernama `practice`**, padahal nilainya sudah kunci unit
  (`konstruksi` dan seterusnya). Mengganti nama medan berarti migrasi data —
  ada delapan dokumen `project` yang memakainya — jadi F2-02 yang mengganti
  nama medan **bersama** datanya. Jangan ganti separuh.

Daftar lengkap apa yang dilewati ada di deskripsi [PR #14](https://github.com/subsarthur-jancommit/arth/pull/14)
dan di `PROGRES-ARTHUR.md`.

### Satu peringatan praktis untuk penggantian kosakata berikutnya

F1-04 sampai F1-06 akan mengganti kosakata lagi (sisi, navigasi). Penggantian
`practices` → `units` menghasilkan **sebelas kegagalan e2e** yang
`bun run check` tidak bisa lihat sama sekali. Tiga hal yang tidak dijaga tipe,
dan yang sebaiknya kamu grep sendiri sebelum push:

1. **Kunci query.** `?practice=` → `?unit=` tertulis di dokumen dan tidak
   diimplementasikan di `app/[locale]/work/page.tsx`. Kunci query yang tidak
   ada hanya bernilai `undefined`, jadi penyaringnya diam-diam mati.
2. **Ejaan kedua sebuah segmen.** `/en/practice` menjawab 410, `/id/praktik`
   menjawab 404, karena hanya ejaan Inggris yang terdaftar.
3. **Berkas `loading.tsx`.** Memindahkannya ikut memindahkan `<noscript>`
   jalan keluar di `components/ui/route-loading` — diukur di build: rute 404
   dalam chrome tinggal 1657 bita HTML tanpa judul maupun tautan.

Dan yang paling penting: **empat belas spesifikasi `e2e/` menunjuk rute
praktik tanpa mengimpor modulnya**, jadi `tsc` tidak punya apa pun untuk
dikatakan. Grep nilai lama di seluruh `e2e/`, bukan hanya ikuti galat
typecheck. Rinciannya di `PROGRES-ARTHUR.md` U18.

---

## 7. Peta dokumen repo

| Dokumen                                         | Isi                                                                                             |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [`CLAUDE.md`](../CLAUDE.md)                     | Aturan keras. Baca lebih dulu. Nomornya dikutip di kode, jadi lubang di penomoran itu disengaja |
| [`AGENTS.md`](../AGENTS.md)                     | Standar rekayasa: React 19 / Next 16 / Tailwind v4, perintah, integrasi                         |
| [`docs/PROSEDUR-KERJA.md`](./PROSEDUR-KERJA.md) | **Mengikat.** Cabang → PR → CI → merge → produksi, dan kredensial                               |
| [`docs/FORK.md`](./FORK.md)                     | Apa yang fork ini hapus dan apa yang dipertahankan. **Jangan disunting**                        |
| [`docs/PROGRES-ARTHUR.md`](./PROGRES-ARTHUR.md) | Papan status per paket + utang dokumen                                                          |
| [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md)         | Env, host, daftar periksa keamanan                                                              |
| [`docs/DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md)   | Token yang ada. Idiom bawaan, bukan kewajiban                                                   |
| [`docs/MOTION-SPEC.md`](./MOTION-SPEC.md)       | Cara gerak yang ada dibangun. Referensi, bukan hukum                                            |
| [`docs/PANDUAN-STUDIO.md`](./PANDUAN-STUDIO.md) | Panduan editor Sanity. Akan ditulis ulang di F2-11                                              |
| [`docs/PROVENANCE.md`](./PROVENANCE.md)         | Lisensi. Baca sebelum menyalin apa pun                                                          |

Situs tayang di <https://arth-test-01.vercel.app>, produksi adalah `main`.
Pratinjau per PR ada di balik login Vercel, jadi **pemilik** yang membukanya.
