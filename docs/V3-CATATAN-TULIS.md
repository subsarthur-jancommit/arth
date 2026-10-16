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
