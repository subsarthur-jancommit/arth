# R7: rencana tulis ke Sanity

Disusun 15 November 2026 menurut `docs/PROSEDUR-KERJA.md` §6 langkah 2.
**Belum ada yang ditulis ke Sanity.** Rencana ini menunggu `ok tulis` pemilik
untuk tiga langkah di bawah, dengan angka uji kering yang tercantum di sini.

Proyek `az53j4l1`, dataset `production`. Tidak ada penghapusan dokumen, tidak
ada teks Indonesia yang berubah, dan tidak ada deploy skema atau Studio.

## Dasar

- Copy Inggris R7 disetujui pemilik 15 November 2026: "Setujui semua", untuk
  57 blok di 14 halaman (`docs/R7-SERAH-INGGRIS.md`, #91, `d24a6ea`).
- Migrasi medan `language`: keputusan arah pemilik 31 Oktober 2026, "Ya,
  migrasikan". Rencana dan alasannya ada di
  `_cadangan-sanity/2026-10-31-medan-language/RENCANA-MUTASI.md`.
- Segmen `/en` tetap dialihkan 307 sampai Inggrisnya tertulis dan segmennya
  dikeluarkan dari `UNTRANSLATED_SEGMENTS` di PR kode tersendiri (K2).

## Skrip

Di luar repo, `ARTH/_cadangan-sanity/2026-11-15-r7/skrip/`, Python pustaka
standar saja. Membaca tanpa token, karena dataset terbaca publik. Menulis hanya
dengan `--write`, token Editor di `SANITY_SESSION_WRITE_TOKEN`, dan cadangan yang
memuat setiap dokumen sasaran pada revisi yang sama dengan yang tayang. Setiap
patch dijaga `ifRevisionID`, 20 dokumen per transaksi. Skrip berhenti bila ada
draf untuk dokumen sasaran.

| Berkas                | sha256 (12 awal) | Gunanya                                                   |
| --------------------- | ---------------- | --------------------------------------------------------- |
| `umum.py`             | `1858e0d076d0`   | Baca ekspor, kirim mutasi, periksa cadangan dan draf      |
| `ekspor.py`           | `d63ecf17b32e`   | Cadangan NDJSON dan sha256-nya                            |
| `migrasi_language.py` | `a41c979fdde4`   | `language` = `_key` pada nilai berbahasa, `_key` tetap    |
| `tulis_inggris.py`    | `5506a631fc01`   | Inggris yang disetujui, dibaca dari `R7-SERAH-INGGRIS.md` |

`tulis_inggris.py` membaca file yang disetujui itu sendiri, bukan salinannya:
setiap medan bagian 2 sampai 14, kartu situasi dengan id `bab` dan `offer`
pembukanya, tabel label J1, dan Portable Text P1. B6, L4, P2, dan UI1 bukan isi
Sanity dan dilewati. Sebelum menulis, setiap teks ID di rencana dicocokkan kata
demi kata dengan dokumen yang tayang; satu saja yang berbeda membuatnya berhenti.

## Urutan sesudah `ok tulis`

1. **Cadangan.** Dengan token terpasang, supaya draf ikut. Hasilnya
   `production-export-<waktu UTC>.ndjson` dan `.sha256`.
2. **Migrasi `language`**, terhadap cadangan langkah 1.
3. **Cadangan kedua.** Langkah 2 mengubah revisi 360 dokumen, jadi ekspor lagi
   sebelum langkah 4; skrip Inggris menolak cadangan yang revisinya tertinggal.
4. **Inggris**, terhadap cadangan langkah 3.
5. **Bukti.** Uji kering keduanya dijalankan ulang: migrasi harus menemukan 0
   nilai, dan Inggris harus melaporkan setiap medan sudah tertulis. Dilaporkan
   bersama hitungan GROQ sebelum dan sesudah, misalnya
   `count(*[_type == "offer" && defined(jenis[_key == "en"])])`.

```bash
cd ARTH/_cadangan-sanity/2026-11-15-r7/skrip
python -I ekspor.py ../cadangan                                    # langkah 1
python -I migrasi_language.py --write --cadangan ../cadangan/<ekspor 1>.ndjson
python -I ekspor.py ../cadangan                                    # langkah 3
python -I tulis_inggris.py --rencana <repo>/docs/R7-SERAH-INGGRIS.md \
  --write --cadangan ../cadangan/<ekspor 3>.ndjson
```

**Cara membatalkan.** Setiap uji kering juga menulis mutasi kebalikannya:
`migrasi-language.undo.json` melepas `language` di jalur yang sama, dan
`tulis-inggris.undo.json` melepas setiap nilai `[_key == "en"]` yang ditambahkan.
Cadangan langkah 1 dan 3 adalah jalan terakhir.

## Hasil uji kering, 15 November 2026

Dijalankan terhadap dataset yang tayang, tanpa token: 391 dokumen, sama persis
dengan ekspor 31 Oktober.

**Migrasi `language`:** 360 dokumen, 2.187 nilai, semuanya `language: "id"`.

| Tipe       | Dokumen | Nilai     |
| ---------- | ------- | --------- |
| `offer`    | 305     | 1.810     |
| `bab`      | 51      | 363       |
| `sequence` | 2       | 10        |
| `page`     | 2       | 4         |
| **Total**  | **360** | **2.187** |

Tidak disentuh: 7 dokumen fixture (98 nilai, termasuk 49 nilai `en` yang sudah
ada) dan 11 dokumen yang sudah berlabel (261 nilai: 3 unit, 6 sisi, `howWeWork`,
dan `siteSettings`). Mutasinya 360 patch dalam 18 transaksi.

**Inggris:** 776 medan di 370 dokumen; pemeriksaan gagal 0. Ke-791 teks
Inggrisnya (775 medan teks dan 16 blok Portable Text) lolos aturan gerbang gaya:
tanpa tanda pisah, tanda seru, apostrof lurus, kontraksi, atau kata terlarang.

| Blok               | Medan   | Dokumen                                  |
| ------------------ | ------- | ---------------------------------------- |
| B1 sampai B5       | 30      | `siteSettings`                           |
| UK1 sampai UP5     | 83      | 3 `unit`                                 |
| SK-A1 sampai SP-A3 | 104     | 5 `side`                                 |
| SK-A4 sampai SP-A4 | 200     | 50 `bab`, 50 `offer`                     |
| SP-B1 sampai SP-B5 | 21      | `side` jaringan, `bab` kreator           |
| J1                 | 305     | setiap `offer` (`jenis`)                 |
| M1, M2             | 15      | `howWeWork`                              |
| L1 sampai L3       | 16      | 2 `sequence`, 6 `offer`                  |
| P1                 | 2       | `page` cara kami dibayar (16 blok `isi`) |
| **Total**          | **776** | **370**                                  |

Dokumen yang disentuh: 305 `offer`, 51 `bab`, 6 `side`, 3 `unit`, 2 `sequence`,
1 `page`, `howWeWork`, dan `siteSettings`. Mutasinya 370 patch dalam 19
transaksi. Daftar lengkap setiap medan dan nilainya ada di
`_cadangan-sanity/2026-11-15-r7/uji-kering/tulis-inggris.txt` (854 baris).
Contoh:

```text
[B1] siteSettings :: heroJudul = Projects move. Systems work. Markets grow.
[SK-A4] arthur-bab-konstruksi-pelaku-proyek-hulu-hilir :: nama = One subcontractor for the whole scope
[SP-B4] 3222fab5-dc6f-40c5-a96e-5f231bc76e48 :: langkahPertama.label = Sign up free as a creator or host
[J1] arthur-offer-adm-01 :: jenis = The part of the project we take on
[P1] arthur-page-cara-kami-dibayar :: isi block 2 (normal) = Scope, price, targets, and reports are agreed in writing before work starts.
```

## Yang tidak termasuk

- Teks antarmuka (UI1), tombol P2, dan label gambar L4: PR kode, bukan Sanity.
- Mengeluarkan segmen dari `UNTRANSLATED_SEGMENTS`: PR kode sesudah langkah 5,
  satu segmen per halaman yang Inggrisnya sudah lengkap.
- Dokumen fixture, Kebijakan, halaman situasi, dan halaman pekerjaan.
