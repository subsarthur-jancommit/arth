# PROSEDUR KERJA — dari branch ke produksi

> **Mengikat.** Berlaku untuk setiap agen dan setiap sesi, cloud maupun lokal.
> Ditulis 2026-10-07 atas permintaan pemilik repo, sesudah audit kesiapan sesi
> cloud. `CLAUDE.md` merujuknya sebagai aturan keras #22–#26.
>
> Untuk merge, produksi, dan kredensial, dokumen ini menggantikan aturan merge
> di `docs/HANDOFF.md` §4.8 dan daftar perintah di
> `.claude/agents/HOUSE-RULES.md` §5. `docs/FORK.md` tidak mengatur hal ini,
> jadi keduanya tidak bertabrakan.

---

## 0. Kenapa dokumen ini ada

Empat fakta, diukur 2026-10-07:

| fakta                                                  | bukti                                                                                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `main` tidak dilindungi apa pun                        | `gh api repos/subsarthur-jancommit/arth/branches/main` → `"protected": false`; `…/rules/branches/main` → `[]`                                                            |
| Setiap commit di `main` langsung tayang                | Vercel men-deploy `main` ke Production secara otomatis, dan `next.config.ts` memasang `typescript.ignoreBuildErrors: true`, jadi build Vercel tidak memeriksa tipe       |
| Merge pernah terjadi pada head yang tidak pernah di-CI | PR #8 dan #9 di-merge dengan head `672923d` dan `187614b`, keduanya commit `[skip ci]`. Check-run di kedua SHA itu hanya `Vercel Preview Comments`, tanpa `ci` dan `e2e` |
| Sesi Claude bertindak dengan identitas pemilik         | `get_me` → `subsarthur-jancommit`, izin repo `admin: true`, dan alat GitHub di sesi mencakup merge dan push berkas                                                       |

Artinya, satu-satunya yang mencegah kode rusak tayang hanyalah niat baik agen.
Prosedur ini menggantinya dengan dua pengaman: aturan yang ditegakkan GitHub
(§5), dan izin pemilik yang terikat ke satu SHA (§3 langkah 7).

---

## 1. Peran

|                                      | pemilik                                      | Claude                                           |
| ------------------------------------ | -------------------------------------------- | ------------------------------------------------ |
| memutuskan merge                     | ya, dengan `ok merge #<n>`                   | tidak; hanya melaksanakan                        |
| setelan GitHub, Vercel, Sanity       | ya, satu-satunya                             | tidak pernah                                     |
| token dan secret                     | membuat, mengisi, mencabut                   | memakai yang diberikan, tidak pernah menampilkan |
| branch, commit, PR, menjaga CI hijau | —                                            | ya                                               |
| verifikasi produksi sesudah merge    | membaca laporannya                           | ya, wajib                                        |
| mundur kalau produksi rusak          | Instant Rollback di Vercel, atau izin revert | mengusulkan, dan menyiapkan PR revert            |

Pemilik boleh merge sendiri di GitHub; ruleset di §5 tetap berlaku untuknya.

---

## 2. Prasyarat sesi — dicek sebelum commit pertama

1. **Bun 1.3.5.** `bun --version` harus mencetak `1.3.5`, versi
   `"packageManager"` di `package.json` dan versi yang dipakai CI. Kalau
   berbeda, berhenti dan lapor.

   Ini bukan formalitas. Bun 1.4.2 memasang `postcss` 8.5.28 di root dan
   menyisakan 8.5.26 di dalam `@tailwindcss/postcss`, padahal `bun.lock`
   menetapkan 8.5.26 di root. `tsc --noEmit` lalu gagal dengan TS2321 di
   `lib/styles/scripts/utility-layering.test.ts:80`, dan hook pre-commit
   menolak setiap commit `.ts`. Dengan Bun 1.3.5, `bun run check` lolos.
   Diukur 2026-10-07.

   Kalau `node_modules` sempat dipasang dengan versi lain:
   `rm -rf node_modules && bun install --frozen-lockfile`.

2. **Mulai dari `main` terbaru:** `git fetch origin main`, lalu branch baru
   dari `origin/main`.

3. **Tidak ada `NEXT_PUBLIC_SANITY_*` di environment sesi.** Nilai itu hanya
   diberikan pada perintah build (§3 langkah 2). Kalau terpasang global,
   `bun test` ikut menjangkau Sanity dan satu tes gagal
   (`buildMarkdownDocument > returns a recoverable Markdown 404`). Diukur
   2026-10-07: 557 lulus, 1 gagal. Penjelasan teknisnya ada di komentar
   `.github/workflows/ci.yml`.

---

## 3. Alur per perubahan

1. **Branch** `claude/<topik>` dari `origin/main`. Satu PR berisi satu
   perubahan yang bisa di-revert utuh. PR bertumpuk boleh, tetapi yang menuju
   `main` tetap menempuh langkah 4–9 sendiri.

2. **Gerbang lokal sebelum push** — semuanya, hasilnya ditulis di PR:

   ```bash
   bun run check
   ```

   Ini gerbang yang sama dengan langkah "Run checks" di CI: oxlint, oxfmt,
   lint type-aware, tsc, unit test, tes plugin oxlint, cek aset. Diukur di sesi
   cloud 2026-10-07: 35 detik.

   Kalau perubahan menyentuh `app/`, `lib/`, `components/`, `vault/`,
   `proxy.ts` atau `next.config.ts`, jalankan juga satu build produksi:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=az53j4l1 NEXT_PUBLIC_SANITY_DATASET=production \
   NEXT_PUBLIC_SANITY_API_VERSION=2025-03-01 bun run build
   ```

   Diukur di sesi cloud 2026-10-07: 66 detik, memori terpakai di puncaknya
   sekitar 4,5 GB dari 15 GB. Tidak ada `bun dev` atau `next start` yang
   dibiarkan menyala, dan e2e hanya berjalan di CI.

3. **Push, lalu buka PR sebagai draft**, base `main`. Isinya mengikuti
   `.github/PULL_REQUEST_TEMPLATE.md`: ringkasan, perubahan, hasil gerbang
   lokal, risiko, dan cara mundur.

4. **CI pada head SHA.** Tunggu `ci` dan `e2e` selesai untuk SHA terakhir PR.
   Kalau merah, perbaiki lalu push. Re-run hanya untuk job yang mati sebelum
   tes berjalan (checkout, install, runner hilang), dan paling banyak sekali.
   Tes tidak pernah dimatikan, dilewati, atau dikarantina.

5. **Preview Vercel.** Status `Vercel` sukses pada head SHA. Isi preview
   dilihat oleh pemilik, karena preview dilindungi login Vercel.

6. **Siap ditinjau.** Tandai PR "ready for review" dan laporkan ke pemilik:
   nomor PR, head SHA, nomor run CI beserta hitungan tesnya, tautan preview,
   dan risikonya.

7. **Izin pemilik.** Pemilik menulis `ok merge #<n>` di percakapan. Izin itu
   berlaku untuk head SHA yang dilaporkan di langkah 6. Commit apa pun
   sesudahnya, termasuk satu baris dokumen, menggugurkan izin, dan alur
   kembali ke langkah 4.

   Satu pengecualian: commit yang hanya menggabungkan `main` terbaru tanpa
   konflik tidak menggugurkan izin, tetapi `ci` dan `e2e` harus hijau lagi
   pada head barunya sebelum merge.

8. **Merge.** Tepat sebelum merge, periksa ulang: head SHA masih yang
   diizinkan, `ci` dan `e2e` berstatus `success` pada SHA itu, dan PR bisa
   di-merge tanpa konflik. Metodenya merge commit, dengan pesan
   `Merge <ringkasan> (#<n>)` yang menyebut izin pemilik dan nomor run CI.

9. **Sesudah merge — wajib, di sesi yang sama:**
   - run CI `push` di `main` untuk merge SHA hijau;
   - deployment Production untuk merge SHA berstatus READY
     (`gh api repos/subsarthur-jancommit/arth/deployments`, atau Vercel MCP);
   - pemeriksaan asap terhadap produksi:

     ```bash
     SITE=https://arth-test-01.vercel.app   # ganti saat domain sendiri aktif
     curl -sSI "$SITE/" | grep -i '^location'                    # → /en
     for p in /en /id /sitemap.xml /cms; do
       curl -sSo /dev/null -w "$p %{http_code}\n" "$SITE$p"      # → 200
     done
     curl -sSo /dev/null -w '%{http_code}\n' -X POST "$SITE/api/revalidate"
     # → 401: secret webhook terpasang. 503 berarti hilang.
     ```

   - laporkan hasilnya ke pemilik.

10. **Kalau produksi rusak:** lapor segera dengan buktinya. Ada dua jalan
    mundur: Instant Rollback di Vercel oleh pemilik (paling cepat), atau PR
    revert yang menempuh langkah 2–9. Claude tidak melakukan promote,
    rollback, atau redeploy di Vercel.

---

## 4. Larangan

1. Push langsung ke `main`, force-push ke `main`, atau menghapusnya.
2. Merge tanpa `ok merge #<n>` untuk PR itu. "Lanjut", "bagus", atau izin
   untuk PR lain bukan izin merge.
3. Merge ketika `ci` atau `e2e` merah, masih berjalan, dibatalkan, atau hijau
   pada SHA lain.
4. `[skip ci]`, `[ci skip]`, atau sejenisnya di commit mana pun yang menuju
   `main`.
5. Mematikan, melewati, atau mengkarantina tes; membuat commit kosong atau
   menutup lalu membuka PR untuk memicu CI.
6. Mengubah `.github/workflows/` supaya sebuah check lolos. Setiap perubahan
   workflow butuh izin pemilik yang menyebutnya secara khusus.
7. Mengubah setelan GitHub (ruleset, secret, kolaborator), Vercel (env,
   domain, proteksi, promote, rollback, deploy manual), atau Sanity (CORS,
   webhook, token, anggota, dataset).
8. Menulis ke Sanity di luar §6.
9. Menampilkan, menyalin, atau menulis nilai rahasia ke berkas, commit, PR,
   log, atau percakapan. Yang boleh disebut hanya namanya, dan apakah ia
   "terset" atau "tidak terset".

---

## 5. Penegakan di GitHub — dikerjakan pemilik, sekali

Larangan di §4 ditulis untuk agen. Bagian ini membuat GitHub yang
menegakkannya, sehingga ia tetap berlaku ketika agen keliru.

**Settings → Rules → Rulesets → New ruleset → New branch ruleset:**

| setelan                                          | nilai                                     | alasan                                                                                                                                                                                 |
| ------------------------------------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enforcement status                               | Active                                    |                                                                                                                                                                                        |
| Target branches                                  | Include default branch (`main`)           |                                                                                                                                                                                        |
| Bypass list                                      | **kosong**                                | sesi Claude bertindak atas nama pemilik; kalau peran pemilik ada di daftar ini, sesi kemungkinan besar ikut bisa melewatinya (tidak diuji)                                             |
| Restrict deletions                               | ✓                                         |                                                                                                                                                                                        |
| Block force pushes                               | ✓                                         |                                                                                                                                                                                        |
| Require a pull request before merging            | ✓, required approvals **0**               | PR dibuka atas nama akun pemilik, dan GitHub tidak mengizinkan orang menyetujui PR-nya sendiri; 1 approval akan mengunci semua PR. Izin pemilik diberikan di percakapan (§3 langkah 7) |
| Require status checks to pass                    | ✓: `ci` dan `e2e` (sumber GitHub Actions) | nama job di `.github/workflows/ci.yml`. `e2e` selalu melapor, juga ketika isinya dilewati untuk perubahan dokumen                                                                      |
| Require branches to be up to date before merging | ✓                                         | CI harus lulus terhadap `main` terbaru, bukan terhadap `main` saat branch dibuat                                                                                                       |
| Allowed merge methods                            | jangan dibatasi                           | `.github/workflows/automerge-dependabot.yml` memakai squash                                                                                                                            |

Tidak dicentang sebagai check wajib: `lighthouse` dan `react-doctor` (keduanya
penasihat). `Vercel` opsional; centang kalau merge harus menunggu preview
berhasil dibangun.

**Verifikasi oleh Claude sesudah pemilik menyimpan:**

```bash
gh api repos/subsarthur-jancommit/arth/rules/branches/main
```

Hasil yang benar memuat aturan `deletion`, `non_fast_forward`, `pull_request`,
dan `required_status_checks` yang menyebut `ci` dan `e2e`. Hasil `[]` berarti
ruleset belum aktif. Sampai hasilnya benar, komentar di `ci.yml` yang menyebut
`e2e` sebagai "REQUIRED branch-protection check" belum benar.

**Darurat.** Kalau CI sendiri rusak dan sebuah perbaikan harus tayang,
pemilik menonaktifkan ruleset, merge, lalu mengaktifkannya kembali, dan
mencatatnya di PR. Claude tidak melakukannya (§4 nomor 7). Apakah sesi secara
teknis mampu mengubah ruleset belum diuji: membaca proteksi branch klasik
ditolak (`403 Resource not accessible by integration`), sedangkan membaca
ruleset diizinkan. Diukur 2026-10-07.

---

## 6. Kredensial dan Sanity

**Bawaan sesi cloud: tidak ada token tulis.** Dataset `production` bisa dibaca
publik tanpa token (diukur 2026-10-07: 20 dokumen, 0 draft terlihat tanpa
token), jadi pekerjaan fitur biasa tidak membutuhkan token apa pun.

Yang boleh ada di environment sesi:

| variabel                | isi                                                            | gunanya                                              |
| ----------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| `SANITY_API_READ_TOKEN` | token **Viewer** baru, khusus sesi, terpisah dari milik Vercel | membaca draft, dan menguji draft mode di build lokal |

Yang **tidak pernah** ditaruh di environment sesi: `SANITY_REVALIDATE_SECRET`,
`VERCEL_TOKEN`, PAT GitHub, token Sanity berperan Developer atau
Administrator, dan `NEXT_PUBLIC_SANITY_API_READ_TOKEN`.

**Menulis ke Sanity** hanya dengan urutan ini:

1. Pemilik membuat token **Editor** baru untuk satu pekerjaan, menamainya
   dengan tujuan dan tanggal, lalu mengisinya sebagai
   `SANITY_SESSION_WRITE_TOKEN`. Nama ini sengaja tidak dibaca kode aplikasi,
   supaya build dan `bun test` tidak pernah berjalan dengan hak tulis.
2. Claude menulis rencana mutasinya: dokumen mana, field mana, berapa banyak,
   dan cara membatalkannya. Untuk perubahan lebih dari satu dokumen, dataset
   diekspor dulu ke luar repo sebagai cadangan.
3. Pemilik membalas `ok tulis <ringkasan>`. Izin itu berlaku untuk rencana
   itu saja.
4. Claude menjalankan mutasi itu, lalu melaporkan hasilnya dengan bukti: query
   sebelum dan sesudah.
5. Pemilik mencabut token di sanity.io/manage → API → Tokens dan menghapus
   variabelnya dari environment.

Penghapusan (`delete`, `--clean`, menghapus aset atau dataset) selalu disebut
terpisah dalam rencana, dan butuh izin yang menyebutnya.

`lib/scripts/seed-fixtures.ts` membaca `SANITY_API_WRITE_TOKEN` dan jatuh ke
dataset `production` kalau `NEXT_PUBLIC_SANITY_DATASET` kosong. Ia hanya
dijalankan di langkah 4, dengan semua nilainya diberikan eksplisit di
perintah:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=az53j4l1 NEXT_PUBLIC_SANITY_DATASET=production \
SANITY_API_WRITE_TOKEN="$SANITY_SESSION_WRITE_TOKEN" bun lib/scripts/seed-fixtures.ts
```

---

## 7. Mengubah prosedur ini

Prosedur ini diubah lewat PR dengan alur yang sama, dan izin merge-nya harus
menyebut dokumen ini. Kalau sebuah langkah ternyata salah, ia dikoreksi di
tempat dengan menyebut apa yang keliru (`.claude/agents/HOUSE-RULES.md` §6).
