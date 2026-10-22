# PROSEDUR KERJA — dari branch ke produksi

> **Mengikat.** Berlaku untuk setiap agen dan setiap sesi, cloud maupun lokal.
> Ditulis 2026-10-07 atas permintaan pemilik repo, sesudah audit kesiapan sesi
> cloud. `CLAUDE.md` merujuknya sebagai aturan keras #22–#26. Diubah
> 2026-10-22 atas instruksi pemilik: gerbang berjalan di GitHub Actions, bukan
> di laptop pemilik (§3 langkah 2–3).
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
Prosedur ini menetapkan pengaman berupa PR, `ci` dan `e2e` pada head SHA yang
tepat, serta tinjauan pemilik atas pratinjau Vercel yang terlindungi. Jika
ruleset §5 belum aktif, GitHub belum menegakkan syarat itu secara otomatis;
agen tetap wajib mematuhinya dan pemilik yang mengaktifkan setelan tersebut.

---

## 1. Peran

|                                      | pemilik                                      | Claude                                           |
| ------------------------------------ | -------------------------------------------- | ------------------------------------------------ |
| meninjau pratinjau sebelum merge     | ya                                           | menunggu konfirmasi tinjauan; tanpa frasa merge  |
| melaksanakan merge                   | —                                            | ya, setelah semua gerbang §3 terpenuhi           |
| setelan GitHub, Vercel, Sanity       | ya, satu-satunya                             | tidak pernah                                     |
| token dan secret                     | membuat, mengisi, mencabut                   | memakai yang diberikan, tidak pernah menampilkan |
| branch, commit, PR, menjaga CI hijau | —                                            | ya                                               |
| verifikasi produksi sesudah merge    | membaca laporannya                           | ya, wajib                                        |
| mundur kalau produksi rusak          | Instant Rollback di Vercel, atau izin revert | mengusulkan, dan menyiapkan PR revert            |

Pemilik boleh merge sendiri di GitHub; ruleset di §5 tetap berlaku untuknya.

---

## 2. Prasyarat sesi — dicek sebelum commit pertama

1. **Bun 1.3.5, kalau bun dijalankan lokal**, termasuk lewat hook `oxc`.
   `bun --version` harus mencetak `1.3.5`, versi `"packageManager"` di
   `package.json` dan versi yang dipakai CI. Kalau berbeda, berhenti dan
   lapor. Sesi yang hanya mengedit, commit, push, dan membaca CI tidak
   menjalankan bun (§3 langkah 2); CI memasang versinya sendiri dari
   `package.json`.

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
   diberikan pada perintah build (di CI: langkah `Build` dan
   `Run e2e tests`). Kalau terpasang global,
   `bun test` ikut menjangkau Sanity dan satu tes gagal
   (`buildMarkdownDocument > returns a recoverable Markdown 404`). Diukur
   2026-10-07: 557 lulus, 1 gagal. Penjelasan teknisnya ada di komentar
   `.github/workflows/ci.yml`.

---

## 3. Alur per perubahan

1. **Branch** `claude/<topik>` dari `origin/main`. Satu PR berisi satu
   perubahan yang bisa di-revert utuh. PR bertumpuk boleh, tetapi yang menuju
   `main` tetap menempuh langkah 4–9 sendiri.

2. **Gerbang di GitHub Actions, bukan di laptop.** Instruksi pemilik,
   2026-10-22: "SAYA INGIN KAMU MENGGUNAKAN KEKUATAN KOMPUTASI DARI GITHUB
   UNTUK MELAKUKAN CI dan VERIFIKASI. HINDARI MENGGUNAKAN KEKUATAN KOMPUTASI
   LAPTOP SAYA YANG TERBATAS."

   Push branch dan buka PR draft segera (langkah 3), karena CI hanya berjalan
   untuk PR. Gerbangnya adalah dua job GitHub Actions di PR itu:

   - `ci`: `bun run build`, lalu `bun run check` (oxlint, oxfmt, lint
     type-aware, tsc, unit test, tes plugin oxlint, cek aset, cek salinan
     publik);
   - `e2e`: Playwright beserta axe, kalau ada berkas yang bisa mengubah
     halaman. Untuk perubahan dokumen saja, job ini melapor sukses tanpa
     menjalankan tes (`e2e skipped, no UI-affecting changes`).

   Hasilnya dibaca lewat `gh api` (REST), untuk head SHA PR:

   ```bash
   SHA=$(git rev-parse HEAD)
   gh api "repos/subsarthur-jancommit/arth/commits/$SHA/check-runs" \
     --jq '.check_runs[] | "\(.name) \(.status) \(.conclusion)"'
   gh api "repos/subsarthur-jancommit/arth/actions/runs?head_sha=$SHA" \
     --jq '.workflow_runs[] | "#\(.run_number) \(.conclusion) \(.html_url)"'
   ```

   Hitungan tes ada di log job:
   `gh api repos/subsarthur-jancommit/arth/actions/jobs/<id>/logs`.

   Di laptop pemilik tidak ada yang dijalankan demi gerbang atau hook:

   - commit dengan `LEFTHOOK_EXCLUDE=typecheck,unit-tests git commit …`, jadi
     hook tidak menjalankan tsc; `oxc` (oxfmt dan oxlint pada berkas yang
     di-stage) tetap berjalan;
   - push dengan `LEFTHOOK=0 git push …`, jadi hook tidak menjalankan seluruh
     unit test;
   - merge atau pull dengan `LEFTHOOK=0`, karena hook post-merge
     `install-deps` menjalankan `bun i`;
   - jangan menjalankan `bun install` hanya supaya gerbang atau hook bisa
     berjalan. Di worktree tanpa `node_modules`, `oxc` pun gagal dengan
     `error: Script not found "oxfmt"`, jadi commit di sana memakai
     `LEFTHOOK=0`; format diperiksa oleh `oxfmt --check` di `ci`.

   Diukur 2026-10-22 di worktree OneDrive laptop pemilik, ketika beberapa sesi
   menjalankan gerbang lokal bersamaan: `bun install` sekitar 355 detik, unit
   suite sekitar 190 detik, dan `bun test` di hook pre-push habis waktu tiga
   kali sehingga push untuk PR #36 tertahan.

3. **Push, lalu buka PR sebagai draft**, base `main`, segera sesudah commit
   pertama. Isinya mengikuti `.github/PULL_REQUEST_TEMPLATE.md`: ringkasan,
   perubahan, gerbang (run CI pada head SHA), risiko, dan cara mundur.

   Sesudah PR draft terbuka, sesi melaporkan nomor PR dan head SHA, lalu
   mengakhiri gilirannya tanpa menunggu CI; sesi koordinator yang membaca
   hasil CI dan menandai PR siap (langkah 4–6). Sesi tidak memulai sesi baru
   atau mengusulkan kartu tugas kecuali pemilik memintanya; tindak lanjut
   ditulis di laporan akhirnya. Disetujui pemilik 2026-10-22.

4. **CI pada head SHA.** Tunggu `ci` dan `e2e` selesai untuk SHA terakhir PR.
   Kalau merah, perbaiki lalu push. Re-run hanya untuk job yang mati sebelum
   tes berjalan (checkout, install, runner hilang), dan paling banyak sekali.
   Tes tidak pernah dimatikan, dilewati, atau dikarantina.

5. **Preview Vercel.** Status `Vercel` sukses pada head SHA. Isi preview
   dilihat oleh pemilik, karena preview dilindungi login Vercel.

6. **Siap ditinjau.** Tandai PR "ready for review" dan laporkan ke pemilik:
   nomor PR, head SHA, nomor run CI beserta hitungan tesnya, tautan preview,
   dan risikonya.

7. **Tinjauan pemilik.** Pemilik meninjau pratinjau Vercel yang terlindungi
   sebelum merge dan memberi tahu agen bahwa tinjauan selesai, melalui komentar
   PR atau percakapan. Status Vercel sukses bukan bukti bahwa isi pratinjau
   sudah ditinjau. Tidak diperlukan frasa izin merge terpisah.

   Setelah tinjauan pemilik selesai, agen boleh merge hanya jika PR mutakhir
   dengan `main`, dapat digabung tanpa konflik, dan `ci` serta `e2e` sukses pada
   head SHA yang tepat. Commit apa pun setelahnya mewajibkan kedua check hijau
   lagi pada SHA baru. Jika branch perlu diperbarui dengan `main`, periksa
   ulang seluruh syarat ini sebelum merge.

8. **Merge.** Tepat sebelum merge, periksa ulang: pemilik sudah meninjau
   pratinjau, PR mutakhir terhadap `main`, `ci` dan `e2e` berstatus `success`
   pada head SHA persis itu, dan PR bisa digabung tanpa konflik. Metodenya
   merge commit, dengan pesan `Merge <ringkasan> (#<n>)` yang menyebut nomor
   run CI.

9. **Sesudah merge — wajib, di sesi yang sama:**
   - run CI `push` di `main` untuk merge SHA hijau;
   - deployment Production untuk merge SHA berstatus READY
     (`gh api repos/subsarthur-jancommit/arth/deployments`, atau Vercel MCP);
   - pemeriksaan asap terhadap produksi:

     ```bash
     SITE=https://arth-test-01.vercel.app   # ganti saat domain sendiri aktif
     curl -sSI "$SITE/" | grep -i '^location'                    # → /id
     curl -sSI "$SITE/en" | grep -i '^location'                  # → /id
     for p in /id /sitemap.xml; do
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
2. Merge sebelum pemilik menyatakan tinjauan pratinjau terlindungi selesai.
3. Merge ketika `ci` atau `e2e` merah, masih berjalan, dibatalkan, atau hijau
   pada SHA lain.
4. `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, `[actions skip]`,
   atau trailer `skip-checks: true` di pesan commit mana pun yang menuju
   `main` — **termasuk sekadar menyebutnya di badan pesan.** GitHub mencari
   string itu di seluruh pesan commit head, bukan hanya di judulnya. Diukur
   2026-10-07: commit pertama PR #10 (`aac63ed`) menyebut `[skip ci]` di badan
   pesannya untuk menjelaskan larangan ini, dan tidak satu pun workflow
   berjalan untuk PR itu; pesannya lalu diperbaiki. Kalau perlu menyebutnya
   di pesan commit, tulis tanpa kurung siku.
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

**Lewat konektor Sanity (MCP).** Pemilik menerima, pada 2026-10-09, bahwa sesi
memakai konektor Sanity yang login sebagai akun manusianya, dengan seluruh hak
akun itu. Membaca lewatnya bebas. Menulis lewatnya — membuat, mengubah,
menerbitkan, membuang draft, deploy skema atau Studio, CORS, dataset — memakai
langkah 2–4 di atas; langkah 1 dan 5 tidak berlaku karena tidak ada token yang
dibuat atau dicabut.

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

Prosedur ini diubah lewat PR dengan alur yang sama; tinjauan pemilik atas
pratinjau terlindungi tetap menjadi gerbang sebelum merge. Kalau sebuah
langkah ternyata salah, ia dikoreksi di tempat dengan menyebut apa yang
keliru (`.claude/agents/HOUSE-RULES.md` §6).
