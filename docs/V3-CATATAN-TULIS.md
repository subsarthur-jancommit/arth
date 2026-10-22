# Catatan tulis V3

Setiap penulisan isi V3 ke Sanity, satu baris per "ok tulis". Agen hanya menulis
draf berstatus `perlu-anda`; pemilik yang menyetujui dan menerbitkan.

## W2: Konstruksi, untuk pemilik bangunan

- **Izin:** "ok tulis: tujuh bab Konstruksi Pemilik bangunan dan offer-nya sesuai
  docs/V3-SERAH-W2.md, sebagai draf berstatus perlu Anda.", 16 Oktober 2026.
- **Sumber:** `bun lib/scripts/chapter-wave.ts <master brief> --wave W2 --drafts
<file> --side-id fc1cd0dc-9511-4cf7-bd06-d4867a2ef8a7`, dari commit d7b516c
  (PR #27). Skrip lolos gerbang gaya dan kelengkapan sebelum menulis file draf.
- **Ditulis:** 44 draf baru, 7 bab dan 37 offer. Semuanya berawalan
  `drafts.arthur-bab-konstruksi-pemilik-bangunan-` atau `drafts.arthur-offer-`,
  dan semuanya berstatus `perlu-anda`. Sebelum menulis, tidak ada dokumen dengan
  id itu, jadi tidak ada yang ditimpa dan tidak ada cadangan yang perlu dibuat.
- **Diperiksa sesudahnya:** panjang setiap medan teks, `urutan`, dan
  `pintuMasuk` di ke-44 draf sama dengan file draf. Isi terbit tidak berubah:
  1 bab dan 11 offer, semuanya Kuliner.

### Urutan terbit untuk pemilik

1. Sisi Pemilik bangunan (draf W1), karena bab merujuk ke sisi itu.
2. Ketujuh bab.
3. Ke-37 offer.

Bab baru tampil bila punya paling sedikit tiga offer yang disetujui. Pintu masuk
di halaman sisi tampil tanpa tautan sampai offer itu punya halaman sendiri (V4).

## W3: Konstruksi, untuk pelaku proyek

- **Izin:** "ok tulis: dua belas bab Konstruksi Pelaku proyek dan offer-nya
  sesuai docs/V3-SERAH-W3.md, sebagai draf berstatus perlu Anda.", 16 Oktober 2026.
- **Sumber:** `bun lib/scripts/chapter-wave.ts <master brief> --wave W3 --drafts
<file> --side-id 833ca4b1-3ce9-419f-a479-26fd5270af85`, dari commit 90e331d
  (PR #28).
- **Ditulis:** 83 draf baru, 12 bab dan 71 offer, semuanya berstatus
  `perlu-anda`. Setiap offer membawa `pasar` dari katalog. Sebelum menulis,
  tidak ada dokumen dengan id itu.
- **Diperiksa sesudahnya:** panjang setiap medan teks, `pasar`, `urutan`, dan
  `pintuMasuk` di ke-83 draf sama dengan file draf. Isi terbit tidak berubah:
  1 bab dan 11 offer, semuanya Kuliner.

### Urutan terbit untuk pemilik

1. Sisi Pelaku proyek (draf W1).
2. Kedua belas bab.
3. Ke-71 offer.

## W4: Teknologi, siap pakai

- **Izin:** "ok tulis: enam belas bab Teknologi Siap pakai dan offer-nya sesuai
  docs/V3-SERAH-W4.md, sebagai draf berstatus perlu Anda.", 16 Oktober 2026.
- **Sumber:** `bun lib/scripts/chapter-wave.ts <master brief> --wave W4 --drafts
<file> --side-id 6eae7a7f-d2bc-4650-ba1c-0f2834727189`, dari commit d99630c
  (PR #29). Kuliner tidak ikut; babnya sudah terbit dengan `urutan` 0, dan
  keenam belas bab ini memakai `urutan` 1 sampai 16.
- **Ditulis:** 114 draf baru, 16 bab dan 98 offer, semuanya berstatus
  `perlu-anda`. Bab Konstruksi membawa satu jembatan ke offer ADM-03. `pasar`
  kosong di semua offer, sama seperti di file draf.
- **Diperiksa sesudahnya:** panjang setiap medan teks, `urutan`, `pintuMasuk`,
  `model`, rujukan bab, dan jumlah jembatan di ke-114 draf sama dengan file draf.
  Jumlah draf naik tepat 16 bab dan 98 offer (dari 19 dan 112 menjadi 35 dan
  210), jadi tidak ada draf lama yang tertimpa. Isi terbit tidak berubah: 1 bab
  dan 11 offer, semuanya Kuliner.
- **Untuk ditinjau:** dampak KON-01 menyebut Subang, Purwakarta, dan Bandung,
  dan dampak KON-07 menyebut "tiga wilayah". Keduanya tertulis begitu di
  V3-SERAH-W4.md yang disetujui, padahal wilayah Teknologi belum diputuskan.

### Urutan terbit untuk pemilik

1. Sisi Siap pakai sudah terbit, jadi langsung ke keenam belas bab.
2. Ke-98 offer.

Jembatan di bab Konstruksi menunjuk ADM-03, yang masih draf dari W3. Jembatan
itu baru bermakna setelah ADM-03 juga terbit.

## W5: Peekabo, untuk pemilik usaha dan brand

- **Izin:** "ok tulis: delapan bab Peekabo Pemilik usaha dan offer-nya sesuai
  docs/V3-SERAH-W5.md, sebagai draf berstatus perlu Anda.", 17 Oktober 2026.
- **Sumber:** `bun lib/scripts/chapter-wave.ts <master brief> --wave W5 --drafts
<file> --side-id 05e811a2-2475-468d-958f-c0064923c798`, dari commit 94b742b
  (PR #30). Sebelum menulis, kode internal bab diperbaiki: offer Peekabo seperti
  1A-01 tidak membawa kode bab, jadi kodenya kini diambil dari judul bab (MKT,
  PRD, dan seterusnya). Medan itu tidak tampil di situs.
- **Ditulis:** 51 draf baru, 8 bab dan 43 offer, semuanya berstatus
  `perlu-anda`. Operator SaaS niche dan Akademi ditahan utuh dan tidak ditulis,
  jadi `urutan` bab melompati 3 dan 8. Empat bab membawa jembatan, ke FNB-01,
  STD-09, TRV-05, dan RIT-02. Sebelum menulis, tidak ada dokumen dengan id itu.
- **Diperiksa sesudahnya:** panjang setiap medan teks, `urutan`, `pintuMasuk`,
  `model`, rujukan bab, dan jumlah jembatan di ke-51 draf sama dengan file draf.
  Jumlah draf naik tepat 8 bab dan 43 offer (dari 35 dan 210 menjadi 43 dan
  253). Isi terbit tidak berubah: 1 bab dan 11 offer, semuanya Kuliner.
- **Untuk ditinjau:** tiga dampak kartu Produksi kreatif berasal dari katalog
  dan masih terdengar seperti hasil yang dipegang audiens: 1B-05 ("membuat
  orang percaya sebelum membeli"), 1B-03 ("audiens menunggu episode
  berikutnya"), dan PRD-01 ("menghasilkan stok konten untuk sebulan").
  Ketiganya tertulis seperti di serah yang disetujui.

### Urutan terbit untuk pemilik

1. Sisi Pemilik usaha (draf W1), karena bab merujuk ke sisi itu.
2. Kedelapan bab.
3. Ke-43 offer.

Keempat jembatan menunjuk offer yang masih draf dari W2 dan W4. Jembatan itu
baru bermakna setelah offer tujuannya terbit.

## W6: Teknologi, untuk yang paham teknis

- **Izin:** "ok tulis: enam bab Teknologi Paham teknis dan offer-nya sesuai
  docs/V3-SERAH-W6.md, sebagai draf berstatus perlu Anda.", 17 Oktober 2026.
- **Sumber:** `bun lib/scripts/chapter-wave.ts <master brief> --wave W6 --drafts
<file> --side-id a136c8f3-4663-4160-aebd-eee8b0a87dcb`, dari commit 84f0300
  (PR #31).
- **Ditulis:** 47 draf baru, 6 bab dan 41 offer, semuanya berstatus
  `perlu-anda`. Langkah pertama setiap bab sama dengan halaman sisi Paham
  teknis. Dampak SWH-02, SWH-09, TIM-03, dan TIM-04 tertulis dalam versi yang
  sudah ditulis ulang. Tidak ada jembatan. Sebelum menulis, tidak ada dokumen
  dengan id itu.
- **Diperiksa sesudahnya:** panjang setiap medan teks, `urutan`, `pintuMasuk`,
  `model`, dan rujukan bab di ke-47 draf sama dengan file draf. Jumlah draf naik
  tepat 6 bab dan 41 offer (dari 43 dan 253 menjadi 49 dan 294). Isi terbit
  tidak berubah: 1 bab dan 11 offer, semuanya Kuliner.

### Urutan terbit untuk pemilik

1. Sisi Paham teknis (draf W1), karena bab merujuk ke sisi itu.
2. Keenam bab.
3. Ke-41 offer.

## W7: Peekabo, untuk jaringan penjual

- **Izin:** "ok tulis: bab Kreator, streamer, dan host dan offer-nya sesuai
  docs/V3-SERAH-W7.md, serta revisi sisi Jaringan sesuai
  docs/V3-SERAH-W7-HALAMAN.md bagian 1, sebagai draf berstatus perlu Anda.",
  17 Oktober 2026.
- **Sumber bab:** `bun lib/scripts/chapter-wave.ts <master brief> --wave W7
--drafts <file> --side-id 3222fab5-dc6f-40c5-a96e-5f231bc76e48`, dari commit
  0ef9412 (PR #32).
- **Ditulis, bab:** 5 draf baru, 1 bab dan 4 offer, semuanya berstatus
  `perlu-anda`. Sales lepas (OCS) dan Anggota komunitas (MBR) ditahan utuh dan
  tidak ditulis. Sebelum menulis, tidak ada dokumen dengan id itu.
- **Ditulis, sisi:** draf sisi Jaringan (W1) direvisi di tempat: untuk siapa,
  langkah pertama, cara bergabung, dan blok jaringan kini hanya membuka jalur
  kreator dan host. Judul tidak diubah. Revisi dijalankan dengan kunci revisi
  `c9YS92QsSfhgAktxgcEXiz`, dan isi lama disimpan sebagai cadangan di luar
  repositori sebelum ditimpa. Jejak sumber `src-w7-revisi` ditambahkan.
- **Diperiksa sesudahnya:** panjang setiap medan teks, `urutan`, `pintuMasuk`,
  `model`, dan rujukan bab di kelima draf sama dengan file draf. Sisi Jaringan
  tidak lagi memuat kartu komisi atau jalur rujuk dan anggota. Jumlah draf naik
  tepat 1 bab dan 4 offer (dari 49 dan 294 menjadi 50 dan 298). Isi terbit
  tidak berubah: 1 bab dan 11 offer, semuanya Kuliner.

### Urutan terbit untuk pemilik

1. Sisi Jaringan (draf W1 yang sudah direvisi).
2. Bab Kreator, streamer, dan host.
3. Keempat offer.

## W7: Satu klien, tiga unit dan Cara kami bekerja

- **Izin:** "ok tulis: dua rangkaian Satu klien, tiga unit dan dua perubahan
  Cara kami bekerja sesuai docs/V3-SERAH-W7-HALAMAN.md bagian 2 dan 3, sebagai
  draf berstatus perlu Anda.", 17 Oktober 2026.
- **Ditulis, rangkaian:** 2 draf baru, `drafts.arthur-rangkaian-kafe-baru` dan
  `drafts.arthur-rangkaian-studio-siaran`, berstatus `perlu-anda`. Setiap
  rangkaian punya tiga langkah, Konstruksi, Teknologi, lalu Peekabo, masing-masing
  merujuk unitnya dan satu offer: FNB-01, KUL-02, 2B-03 untuk Kafe baru, dan
  STD-09, MED-01, LIV-02 untuk Studio siaran. Rujukan itu lemah selama draf dan
  menjadi kuat saat terbit. Sebelum menulis, belum ada dokumen rangkaian sama
  sekali.
- **Ditulis, Cara kami bekerja:** draf yang sudah ada direvisi di tempat dengan
  kunci revisi `MTVa8wqBVj3WOA5necBSiC`. Janji kelima "Menjembatani, tidak
  meminjamkan" ditambahkan di akhir, dan kalimat pengungkapan komisi diganti.
  Keempat janji lama tidak diubah. Isi lama disimpan sebagai cadangan di luar
  repositori sebelum ditimpa. Jejak sumber `src-w7-revisi` ditambahkan.
- **Diperiksa sesudahnya:** situasi, kalimat setiap langkah, keterangan, unit,
  dan offer di kedua rangkaian sama kata per kata dengan serah. Cara kami
  bekerja kini punya lima janji dan kalimat komisi yang baru. Jumlah draf bab
  dan offer tidak berubah (50 dan 298). Isi terbit tidak berubah: 1 bab dan 11
  offer, semuanya Kuliner; belum ada rangkaian atau Cara kami bekerja yang
  terbit.

### Urutan terbit untuk pemilik

1. Unit Konstruksi dan Peekabo, yang masih draf, karena setiap langkah merujuk
   unitnya.
2. Keenam offer yang dirujuk; hanya KUL-02 yang sudah terbit.
3. Kedua rangkaian.
4. Cara kami bekerja, kapan saja; halaman itu tidak merujuk dokumen lain.

## Persetujuan dan terbit

- **Izin:** "SETUJUI SEMUA DRAFT LANGSUNG KE SANITY. KEMUDIAN MERGE DAN DEPLOY KE
  VERCEL", 17 Oktober 2026. Atas pertanyaan sesudahnya, pemilik memilih:
  keempat offer Kuliner yang ditahan diterbitkan sebagai ditahan, dan kartu yang
  ditandai untuk ditinjau (KON-01, KON-07, 1B-05, 1B-03, PRD-01) ikut disetujui
  apa adanya.
- **Cadangan:** dataset diekspor ke luar repositori sebelum mutasi, 386
  dokumen termasuk 365 draf.
- **Ditulis:** 357 draf `perlu-anda` diberi `statusTinjauan: disetujui` dan
  `tanggalDisetujui: 2026-10-17`, lalu diterbitkan berurutan: 3 unit, 6 sisi,
  siteSettings, Cara kami bekerja, 50 bab, 294 offer, 2 rangkaian. Draf ditahan
  KUL-04, KUL-09, KUL-10, dan KUL-11 diterbitkan tanpa diubah, jadi keempatnya
  turun dari situs.
- **Diperiksa sesudahnya:** tidak ada draf isi Arthur yang tersisa. Yang terbit:
  3 unit, 6 sisi, siteSettings, Cara kami bekerja, 51 bab, dan 301 offer
  berstatus `disetujui`, 4 offer berstatus `ditahan`, dan 2 rangkaian. Rujukan
  rangkaian ke unit dan offer sudah menjadi rujukan kuat.

Kebijakan (`docs/V3-SERAH-W7-HALAMAN.md` bagian 4) belum ditulis. Halaman itu
menunggu tinjauan ahli hukum, lalu "ok tulis" sendiri. Rangkaian Villa dan
Perumahan developer menunggu offer yang masih ditahan.

## Contoh format di Cara kami bekerja

- **Izin:** "ok tulis: contohFormat Cara kami bekerja Versi A, setujui dan
  terbitkan.", 17 Oktober 2026.
- **Ditulis:** `contohFormat` di dokumen `howWeWork` diisi "Setiap pekerjaan
  dimulai dari satu kesepakatan tertulis. Isinya lingkup, harga, target, bentuk
  laporan, pemilik hasil kerja, dan komisi dari mitra bila ada." Sumbernya
  master brief: Cara kami bekerja baris 23, aturan main 2, 4, dan 10, dan baris 142. Jejak sumber `src-contoh-format` ditambahkan, dan dokumen langsung
  disetujui lalu diterbitkan. Versi terbit sebelumnya disimpan sebagai cadangan
  di luar repositori.
- **Diperiksa sesudahnya:** kueri situs atas API publik Sanity mengembalikan
  semua medan halaman terisi. `/id/cara-kerja` tetap 404 karena rutenya ada di
  `lib/seo/awaiting-content.ts`. PR yang mengeluarkannya dari daftar itu
  membuka halaman tersebut.

## Metadata mesin pencari di Satu klien, tiga unit

- **Izin:** "ok tulis metadata mesin pencari kedua rangkaian Satu klien, tiga
  unit sesuai RENCANA-MUTASI.md, langsung terbit", 22 Oktober 2026. Rencana
  mutasinya disimpan bersama cadangan di luar repositori.
- **Sebelumnya:** penulisan W7 mengisi situasi, langkah, dan keterangan kedua
  rangkaian, tetapi tidak judul dan deskripsi mesin pencari dari
  `docs/V3-SERAH-W7-HALAMAN.md` bagian 2. Kedua dokumen tidak punya medan
  `metadata`, jadi kepala halaman memakai judul dan deskripsi cadangan dari
  kode.
- **Cadangan:** sebelum mutasi, dataset diekspor ke luar repositori: 389
  dokumen terbit dari ekspor publik, ditambah kedua rangkaian secara terpisah.
  Empat draf `sanity.previewUrlSecret` tidak ikut karena berisi rahasia
  pratinjau, dan mutasi tidak menyentuhnya.
- **Ditulis:** `arthur-rangkaian-kafe-baru` dan `arthur-rangkaian-studio-siaran`
  diberi metadata yang sama: judul "Satu klien, tiga unit: konstruksi, sistem,
  dan pemasaran" dan deskripsi "Rangkaian yang mungkin dari tiga unit Arthur di
  Subang, Purwakarta, dan Bandung. Setiap unit tetap bisa dibeli sendiri."
  Keduanya diberi isi yang sama karena halaman membaca metadata dari rangkaian
  pertama menurut `_createdAt`, sedangkan kedua dokumen dibuat pada detik yang
  sama. Jejak sumber `metadata` ditambahkan. Mutasi dikunci ke revisi
  `JbEcLtv325wEBDy8e4ow8h`, ditulis sebagai draf, lalu diterbitkan. Status dan
  tanggal persetujuan tidak diubah.
- **Diperiksa sesudahnya:** kedua dokumen kini di revisi
  `G8ZeF7tvpW3E8RQnFAii4e`. Dibanding cadangan, yang berubah hanya `metadata`,
  entri jejak sumber keempat, dan medan sistem Sanity (`_rev`, `_updatedAt`,
  `_system`). Kueri dan parser situs atas API publik mengembalikan kedua
  rangkaian dengan judul dan deskripsi itu, tanpa ada yang ditahan. Tidak ada
  draf rangkaian yang tersisa. Sesudah PR #34 merge, produksi menjawab
  `/id/satu-klien-tiga-unit` 200 dengan judul dan deskripsi itu di kepala
  halaman.
- **Di kode:** deskripsi `/satu-klien-tiga-unit` di `lib/seo/route-catalog.ts`
  disamakan dengan deskripsi ini, sehingga `llms.txt` dan pencarian situs
  memakai kalimat yang sama dengan kepala halaman.
