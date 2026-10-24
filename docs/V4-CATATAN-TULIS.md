# Catatan tulis V4 dan V5

Setiap penulisan isi ke Sanity untuk fase V4 (halaman pekerjaan) dan sisa V5
(Kebijakan) dari `docs/RENCANA-KONTEKS-V2.md`, ditambah perbaikan temuan
kelompok A, satu entri per tulisan. Gaya dan urutannya sama dengan
`docs/V3-CATATAN-TULIS.md`.

**Izin untuk semua entri di bawah.** Izin tetap pemilik, ditulis di sesi
koordinator pada 23 Oktober 2026: "Saya konfirmasi izin tetap untuk sisa
RENCANA-KONTEKS-V2 seperti kamu jelaskan: tulis dan terbitkan ke Sanity sesuai
rencana, merge setelah CI hijau tanpa tinjauan preview saya, Kebijakan terbit
bertanda tinjauan hukum. Hapus dummy saya lakukan sendiri." Izin ini
menggantikan "ok tulis" per tulisan untuk pekerjaan yang mengikuti rencana. Tidak
ada dokumen yang dihapus.

**Cara kerja yang sama untuk setiap entri.** Proyek `az53j4l1`, dataset
`production`, lewat konektor Sanity (akun pemilik). Sebelum menulis: rencana
mutasi dan ekspor publik dataset disimpan di luar repositori, di
`_cadangan-sanity/2026-10-23-<topik>/`, bersama dokumen sasaran sebelum diubah.
Isi diperiksa gerbang gaya (`lib/content/style-gate.ts`) dan penjaga placeholder:
semua entri 0 galat dan 0 peringatan. Patch memakai kunci revisi, masuk sebagai
draf, lalu diterbitkan dengan kunci revisi draf. Sesudah terbit, dokumen dibaca
ulang dari API publik dan dibandingkan kata per kata dengan rencana. Medan lain
dibandingkan dengan cadangan, dan kueri halaman situs dijalankan untuk setiap
rute.

## V5: tanya jawab

- **Keadaan:** dataset tidak punya dokumen `faq`, terbit maupun draf (dibaca 23
  Oktober 2026).
- **Ditulis:** tidak ada. Rencana dan kedua serah W7 tidak memuat isi tanya jawab
  yang sudah disetujui. Menulisnya sekarang berarti mengarang isi di luar
  rencana, jadi keputusan isinya tetap pada pemilik.

## V5: Kebijakan

- **Sumber:** `docs/V3-SERAH-W7-HALAMAN.md` bagian 4, kata per kata.
- **Ditulis:** 1 dokumen baru, `arthur-page-kebijakan` (tipe `page`, slug
  `kebijakan`). Isinya judul "Kebijakan" dan tiga bagian bertajuk: Komisi dan
  jaringan penjual, Data pribadi dan pesan, serta Pajak komisi dan honor, dengan
  tujuh paragraf. Metadata mesin pencari mengikuti serah, dengan
  `noIndex: true`. Status `disetujui` dan tanggal 2026-10-23, karena kueri
  publik hanya membaca halaman yang disetujui.
- **Tanda tinjauan hukum:** di halaman, templat `/kebijakan` selalu menampilkan
  "Masih menunggu tinjauan ahli hukum." dan memaksa `noindex`. Di dokumen, entri
  jejak sumber pertama berbunyi "Tinjauan ahli hukum: Perlu tinjauan ahli hukum.
  Belum final dan bukan nasihat hukum." Aturan yang dikutip berasal dari riset
  master brief bertanggal 7 Oktober 2026 dan perlu diperiksa ulang terhadap
  aturan yang berlaku.
- **Cadangan:** ekspor 389 dokumen terbit, sha256 `503525ddb9cc…`.
- **Diperiksa sesudahnya:** revisi `DM0rCgydrDs4G5gFF7kWhv`. Kueri `pageQuery`
  situs atas API publik mengembalikan 10 blok, metadata, dan `noIndex: true`.
  Tidak ada draf yang tersisa.
- **Di situs:** `/id/kebijakan` tetap 404 sampai PR #40 merge, karena rutenya
  masih ada di `lib/seo/awaiting-content.ts`. Sesudah PR #40 merge, halaman itu
  tampil 200, tetap `noindex`, dan tidak masuk sitemap.

## V4: halaman pekerjaan

Setiap bab yang terbit kini punya satu halaman pekerjaan untuk offer pintu
masuknya. Ada 50 halaman baru, ditambah dua halaman Kuliner yang sudah ada
(Bot pesan-antar WhatsApp dan Pesan dan bayar dari meja), jadi totalnya 52
halaman pekerjaan di 51 bab.

Setiap halaman diisi `situasi`, dua tingkat (`tingkat`) atau langkah dan serahan
(`langkah`, `serahan`), `batas`, `metadata`, dan `halamanSendiri: true`, ditambah
satu entri jejak sumber `halaman-v4`. Tiga sisi juga diberi `langkahPertama`
sendiri, dengan alasan di entri sisinya. Judul, dampak, untuk siapa, jenis,
syarat, slug, urutan, status, dan tanggal disetujui tidak diubah.

Bentuk halaman mengikuti `docs/RENCANA-KONTEKS-V2.md` §5.2 dan
`docs/R1-PENDEKATAN-POLA-OFFER.md` bagian 2. Teknologi memakai Paket Starter dan
Paket Integrator, seperti halaman Kuliner yang sudah disetujui. Konstruksi dan
Peekabo memakai bahasa tingkatnya sendiri, yaitu langkah kecil lalu lingkup
penuh. Pekerjaan yang menurut pola tidak cocok dengan dua paket memakai blok
"Yang kami kerjakan" dan "Yang Anda terima". Itu pekerjaan bulanan, lewat mitra,
barang pesanan, dan jaringan.

### Konstruksi, untuk pemilik bangunan

- **Ditulis:** 7 offer, semuanya di revisi `NiFNgPRBJdj6UaLSsgYAZY`.
- **Bentuk:** dua tingkat "Satu bagian" dan "Dari hulu ke hilir" (Alur kerja Sisi
  B; pemilik bangunan membeli proyek utuh, dengan eceran sesuai kondisi
  lapangan). Inspeksi bulanan dan Pembiayaan renovasi lewat mitra memakai
  langkah dan serahan.
- **Langkah pertama:** dari sisi, "Ceritakan bangunannya".
- **Cadangan:** ekspor 390 dokumen, sha256 `f3f2331d97ee…`; dokumen sasaran
  `b4a1e1f821f0…`.

| Bab                          | Halaman pekerjaan                        | Bentuk              |
| ---------------------------- | ---------------------------------------- | ------------------- |
| Rumah tinggal                | RAB dan estimasi biaya sebelum membangun | dua tingkat         |
| Desain interior              | Analisis kebutuhan ruang                 | dua tingkat         |
| Konstruksi F&B               | Alur dapur yang mempercepat penyajian    | dua tingkat         |
| Studio streaming             | Pencahayaan set siaran                   | dua tingkat         |
| Makeover villa sampai hostel | Makeover cepat antarpenyewa              | dua tingkat         |
| Membership Care              | Inspeksi bulanan dengan laporan foto     | langkah dan serahan |
| Nilai tambah lewat mitra     | Pembiayaan renovasi lewat mitra          | langkah dan serahan |

### Konstruksi, untuk pelaku proyek

- **Ditulis:** 12 offer, semuanya di revisi `NiFNgPRBJdj6UaLSsgZsrI`.
- **Bentuk:** "Satu bagian" lalu "Paket menurut posisi Anda". Isi tingkat kedua
  diambil dari paket rakitan master brief yang memuat pekerjaan itu. Nama paket
  hanya disebut bila paket itu sendiri terbit: Paket Tenaga Siaga, Paket Termin
  Lancar, Paket Harga Material Terpegang, dan Paket Serah Terima Unit. Subkontrak
  toilet sekolah memakai "Dari hulu ke hilir". Sewa peralatan ringan memakai
  "Paket alat siap kerja", offer saudaranya yang terbit. Pengadaan papan nama
  memakai langkah dan serahan.
- **Langkah pertama:** sendiri, "Ceritakan bagian yang macet" (glosarium bagian
  6). Ajakan sisi dan bab di sisi ini memakai kata katalog yang menurut glosarium
  bagian 1 tidak tampil: "eceran per masalah", "paket hulu-hilir", dan "paket
  rakitan". Karena itu halaman pekerjaan tidak memakai ajakan tersebut.
  Pengadaan papan nama memakai "Ceritakan barang yang dibutuhkan", karena
  pembacanya instansi yang membeli barang.
- **Cadangan:** ekspor 390 dokumen, sha256 `bea30376b995…`; dokumen sasaran
  `acd01b8ec68f…`.

| Bab                            | Halaman pekerjaan                                  | Bentuk              |
| ------------------------------ | -------------------------------------------------- | ------------------- |
| Paket hulu-hilir               | Subkontrak hulu-hilir: toilet dan sanitasi sekolah | dua tingkat         |
| Administrasi dengan pemerintah | Pemantauan paket tender regional                   | dua tingkat         |
| Tenaga kerja                   | Tukang harian                                      | dua tingkat         |
| Material                       | Daftar harga material regional                     | dua tingkat         |
| Modal kerja                    | Rencana arus kas proyek                            | dua tingkat         |
| Alat dan peralatan             | Sewa peralatan ringan                              | dua tingkat         |
| Administrasi internal proyek   | Dokumentasi foto progres                           | dua tingkat         |
| Konsultan pengadaan            | Riset sumber barang                                | dua tingkat         |
| Penyedia untuk instansi        | Pengadaan papan nama, signage, dan papan informasi | langkah dan serahan |
| Developer perumahan            | Pemeriksaan sebelum serah terima                   | dua tingkat         |
| Kontraktor swasta              | Tim tukang dan mandor untuk proyek renovasi        | dua tingkat         |
| Paket rakitan                  | Paket Tenaga Siaga                                 | dua tingkat         |

### Teknologi, untuk yang ingin hasil siap pakai

- **Ditulis:** 16 offer, semuanya di revisi `NiFNgPRBJdj6UaLSsgbCFO`. Kuliner tidak
  ikut, karena halamannya sudah ada.
- **Bentuk:** Paket Starter dan Paket Integrator, dengan pola halaman Kuliner.
  Paket Starter memegang dampak inti baris katalog, dan Paket Integrator memegang
  sambungan dari bidang di baris itu. Batas memuat kalimat komisi dari halaman
  Cara kami dibayar (Aturan isi 8), karena Paket Starter menyarankan layanan
  jadi.
- **Langkah pertama:** sendiri, "Minta sesi diagnosis", dengan kalimat sesudahnya
  seperti halaman Kuliner. Langkah pertama sisi ini memuat kata "penyaring", yang
  menurut glosarium bagian 1 tidak tampil.
- **Wilayah:** tidak disebut di metadata, karena wilayah Teknologi belum
  diputuskan.
- **Cadangan:** ekspor 390 dokumen, sha256 `ccf23b480862…`; dokumen sasaran
  `cd6329e4157e…`.

| Bab               | Halaman pekerjaan                       |
| ----------------- | --------------------------------------- |
| Ritel             | Bot sinkron stok lintas marketplace     |
| Distributor       | Bot pesanan sales lapangan              |
| Jasa lokal        | Bot booking dan pengingat               |
| Klinik            | Bot janji temu                          |
| Pendidikan        | Bot pengingat SPP dan tagihan           |
| Properti          | Bot penjawab calon pembeli 24 jam       |
| Keuangan          | Bot angsuran dan iuran                  |
| Konstruksi        | Bot pemantau tender regional            |
| Travel            | Sinkron ketersediaan lintas kanal       |
| Media             | Bot komunitas Telegram atau Discord     |
| Logistik          | Bot status kiriman ke pelanggan         |
| Manufaktur ringan | Bot pencatat panen lewat WhatsApp       |
| Instansi          | Bot informasi layanan publik            |
| Jasa profesional  | Bot kualifikasi lead                    |
| Kebugaran         | Bot pengingat iuran dan kelas           |
| Lintas sektor     | Sesi pemetaan peluang model bisnis baru |

### Teknologi, untuk yang paham teknis

- **Ditulis:** 6 offer, semuanya di revisi `DM0rCgydrDs4G5gFF7pFdX`.
- **Bentuk:** Paket Starter berupa audit singkat dengan harga tetap. Paket
  Integrator berupa satu layanan atau proyek utuh (Lima cara mulai). Batas
  memuat penyerahan kode, data, dan dokumentasi.
- **Langkah pertama:** dari sisi, "Mulai dengan audit singkat".
- **Cadangan:** ekspor 390 dokumen, sha256 `b02d5c2bdc96…`; dokumen sasaran
  `f48e2769ac52…`.

| Bab            | Halaman pekerjaan                         |
| -------------- | ----------------------------------------- |
| Individu       | Sesi klinik arsitektur satu jam           |
| Freelancer     | Estimasi dan lingkup untuk penawaran Anda |
| Software house | Audit kode dan pengambilalihan proyek     |
| Startup        | Uji minat sebelum membangun               |
| Tim IT         | Dokumentasi ulang sistem tanpa dokumen    |
| Lapisan data   | Optimasi query dan indeks                 |

### Peekabo, untuk pemilik usaha dan brand

- **Ditulis:** 8 offer, semuanya di revisi `NiFNgPRBJdj6UaLSsgc7PM`.
- **Bentuk:** dua tingkat dalam bahasa Cara membeli dan Tangga nilai Peekabo.
  Tingkat pertama berupa langkah kecil: sesi strategi, workshop, satu modul, atau
  live per jam. Tingkat kedua berupa kelola bulanan, kampanye utuh, atau tim
  penjualan, dan isinya dari offer saudara yang terbit.
- **Langkah pertama:** dari sisi, "Mulai dari audit atau sesi strategi".
- **Cadangan:** ekspor 390 dokumen, sha256 `caa9786a8d75…`; dokumen sasaran
  `19bb073daf8b…`.

| Bab                   | Halaman pekerjaan                                   | Dua tingkat                   |
| --------------------- | --------------------------------------------------- | ----------------------------- |
| Agency marketing      | Sesi strategi ads: teori dan penerapan pemasarannya | Sesi strategi, Kelola bulanan |
| Agency solusi kreatif | Workshop isu dan framing video                      | Workshop, Kelola bulanan      |
| Produksi kreatif      | Foto produk dan lifestyle                           | Satu modul, Kelola bulanan    |
| Talenta               | Campaign talent: promotor, ambassador, host         | Satu modul, Kampanye utuh     |
| Event                 | Aktivasi di lokasi mitra: booth, sampling, demo     | Satu modul, Kampanye utuh     |
| Outsourcing penjualan | Admin chat dan penutupan penjualan lewat percakapan | Satu modul, Tim penjualan     |
| Ekosistem marketplace | Hitung ulang margin setiap biaya platform berubah   | Satu modul, Kelola bulanan    |
| Live commerce         | Live per jam dengan host dan operator               | Live per jam, Kelola bulanan  |

### Peekabo, untuk yang ingin ikut menjualkan

- **Ditulis:** 1 offer, Host untuk toko brand mitra, di revisi
  `DM0rCgydrDs4G5gFF7puV5`.
- **Bentuk:** langkah dan serahan, karena halaman jaringan tidak memakai paket.
  Batasnya memakai kalimat jaringan yang sudah disetujui di serah W7: tanpa biaya
  masuk, target rekrutmen, bonus rekrutmen, atau janji penghasilan. Bentuk
  kerjanya disepakati tertulis, dan kelas tidak menjadi syarat bergabung.
- **Langkah pertama:** dari sisi, "Daftar gratis sebagai kreator atau host".
- **Cadangan:** ekspor 390 dokumen, sha256 `781e80443847…`; dokumen sasaran
  `6d902e0eecb7…`.

### Diperiksa sesudahnya, keenam sisi

- Ke-50 dokumen terbit sama kata per kata dengan rencana. Medan yang tidak
  ditulis sama dengan cadangan, selain medan sistem Sanity.
- Kueri halaman pekerjaan situs (`offerPageQuery`) atas API publik
  mengembalikan ke-50 halaman, dan syarat render `offerIsSafe` terpenuhi untuk
  semuanya.
- Setiap bab terbit punya paling sedikit satu halaman pekerjaan, dan tidak ada
  offer pintu masuk yang tanpa halaman. Tidak ada draf isi Arthur yang tersisa.
- Produksi menampilkan halaman baru tanpa deploy. Diperiksa pada satu halaman
  per sisi: 200, isinya tampil, dan tidak ada tampilan tidak-ditemukan. Halaman
  bab menautkan kartu "Mulai dari sini" ke halamannya.

## Untuk ditinjau pemilik

1. **Kalimat jujur Teknologi.** Glosarium bagian 10 aturan 5 meminta kalimat
   "Kami tidak membangun dari nol bila layanan yang sudah matang menyelesaikan
   masalahnya; …" tampil apa adanya di setiap halaman pekerjaan Teknologi. Di
   serah Kuliner, kalimat itu ada di blok "Cara kami bekerja". Templat halaman
   pekerjaan tidak merender blok itu, dan skema `offer` tidak punya medannya.
   Karena itu kalimat tersebut tidak tampil di halaman Kuliner maupun di 22
   halaman Teknologi yang baru. Perbaikannya perlu keputusan pemilik: blok
   templat atau medan baru.
2. **Ajakan sisi dan bab yang memuat kata katalog.** Langkah pertama sisi Pelaku
   proyek dan ajakan kedua belas babnya memakai "eceran per masalah", "paket
   hulu-hilir", dan "paket rakitan". Langkah pertama sisi Siap pakai memakai
   "penyaring". Ini isi W1 dan W3 yang sudah terbit. Halaman pekerjaan baru
   tidak mewarisinya, tetapi halaman sisi dan bab masih menampilkannya.
3. **Label yang tidak tertulis di glosarium.** "Ceritakan barang yang dibutuhkan"
   dipakai untuk pengadaan papan nama, dan nama tingkat "Tim penjualan" dipakai
   untuk admin chat.
4. **Wilayah di halaman Teknologi.** Bot pemantau tender menyebut Subang,
   Purwakarta, dan Bandung, seperti dampaknya yang sudah disetujui, padahal
   wilayah Teknologi belum diputuskan. Catatan ini sama dengan catatan W4.
5. **Medan `language` di Studio.** Validasi skema yang terpasang meminta medan
   `language` pada setiap nilai dua bahasa. Data Arthur, termasuk semua dokumen
   yang terbit sebelum V4, menyimpan bahasa di `_key`, dan kueri situs membacanya
   dari sana. Tulisan V4 dan V5 mengikuti data yang ada. Menyeragamkannya butuh
   migrasi tersendiri.

Butir 1, 2, dan 4 ditangani di bagian Temuan kelompok A di bawah. Butir 3 dan
5 tetap terbuka.

## Temuan kelompok A

Lima temuan dari pekerjaan V4 sampai V6 diperbaiki dalam satu sesi: kata
katalog di halaman, jalur jaringan Peekabo, kalimat jujur Teknologi, teks
editorial yang tersisa di kode, dan sebutan wilayah Teknologi. Kodenya ada di
PR #43. Dua tulisan ke Sanity dicatat di bawah. Cara kerjanya sama dengan
entri V4, dan cadangan serta rencananya ada di
`_cadangan-sanity/2026-10-23-temuan-a/`.

### Tulis 1: kata katalog dan wilayah Teknologi

- **Izin:** izin tetap pemilik, 23 Oktober 2026: "Saya konfirmasi izin tetap
  untuk sisa RENCANA-KONTEKS-V2 seperti kamu jelaskan: tulis dan terbitkan ke
  Sanity sesuai rencana, merge setelah CI hijau tanpa tinjauan preview saya,
  Kebijakan terbit bertanda tinjauan hukum. Hapus dummy saya lakukan sendiri."
  Permintaan pemilik untuk sesi ini: "Ya, mulai satu sesi baru untuk
  memperbaiki temuan kelompok A sesuai rencana dan izin tetap: kata katalog di
  halaman, bug jalur Peekabo jaringan, kalimat jujur Teknologi, sisa teks
  editorial di kode, dan sebutan wilayah Teknologi yang belum diputuskan."
- **Sumber:** `docs/R1-GLOSARIUM-PEMBACA.md` bagian 1 (kata katalog) dan
  bagian 6 (langkah pertama per pembaca). Untuk wilayah: wilayah layanan
  Teknologi belum diputuskan pemilik.
- **Ditulis:** 15 dokumen terbit, 36 medan, revisi `px20Ric2pGxO5zFljAIZ7S`,
  23 Oktober 2026 pukul 16.24 UTC.
  - **Sisi Untuk pelaku proyek.** Langkah pertamanya kini "Ceritakan bagian
    yang macet", dengan kalimat "Kami mulai dari satu bagian proyek yang tak
    sanggup Anda tangani. Seluruh lingkup atau paket menurut posisi Anda bisa
    menyusul." Kalimat ini sudah tayang di halaman pekerjaan V4 sisi ini. Nama
    tiga cara membeli diganti: Eceran per masalah menjadi "Ambil satu bagian
    proyek", Paket hulu-hilir menjadi "Serahkan seluruh lingkup kepada satu
    subkon", dan Paket rakitan menurut profil menjadi "Paket yang disusun
    menurut posisi Anda di proyek".
  - **Dua belas bab sisi itu.** Ajakannya sama dengan langkah pertama sisi.
    Bab Arthur sebagai penyedia untuk instansi memakai ajakan halaman
    pekerjaannya (GOV-03), "Ceritakan barang yang dibutuhkan", karena
    pembacanya sekolah, dinas, kelurahan, dan desa.
  - **Nama dan batas bab.** "Paket hulu-hilir untuk kontraktor utama" menjadi
    "Satu subkon untuk seluruh lingkup", dari padanan glosarium. "Paket rakitan
    menurut profil pembeli" menjadi "Paket yang disusun menurut posisi Anda di
    proyek". Di batas bab Alat dan peralatan, "Bab ini mencakup" menjadi
    "Pekerjaan di sini mencakup".
  - **Sisi Untuk yang ingin hasil siap pakai.** "Sebagai penyaring" dibuang
    dari langkah pertama dan dari keterangan Sesi diagnosis.
  - **Bot pemantau tender regional (KON-01).** Dampaknya kini "Paket tender
    baru yang sesuai kualifikasi dikirim setiap hari." Situasinya kini dibuka
    dengan "Tender di wilayah Anda sering terlewat". Di Teknologi, hanya
    dokumen ini yang menyebut Subang, Purwakarta, dan Bandung.
  - Setiap dokumen mendapat entri jejak sumber `temuan-a-2026-10-23`. Slug,
    status, metadata, dan medan lain tidak diubah.
- **Cadangan:** ekspor publik 390 dokumen, sha256 `fcecdc254ffe…`; dokumen
  sasaran `d51e8f5390b0…`.
- **Diperiksa sesudahnya:** ke-36 medan sama kata per kata dengan rencana,
  dibaca dari API publik. Tidak ada draf isi Arthur yang tersisa. Halaman bab
  dan halaman pekerjaan di produksi memuat kata baru dalam beberapa menit.
- **Di situs:** kedua halaman sisi masih menampilkan kata lama sampai
  24 Oktober 04.45 UTC. Datanya disimpan dengan `'use cache'` bertag `side`,
  dan tag itu baru dibatalkan oleh webhook Sanity, yang belum menembak
  (keputusan D4). Halaman sisi akan memuat kata baru pada deploy produksi
  berikutnya, yaitu saat PR #43 merge.

### Tulis 2: tiga medan baru dan jembatan Kuliner

- **Izin:** sama dengan tulis 1. Izin tetap pemilik: "Saya konfirmasi izin
  tetap untuk sisa RENCANA-KONTEKS-V2 seperti kamu jelaskan: tulis dan
  terbitkan ke Sanity sesuai rencana, merge setelah CI hijau tanpa tinjauan
  preview saya, Kebijakan terbit bertanda tinjauan hukum. Hapus dummy saya
  lakukan sendiri." Permintaan pemilik untuk sesi ini: "Ya, mulai satu sesi
  baru untuk memperbaiki temuan kelompok A sesuai rencana dan izin tetap: kata
  katalog di halaman, bug jalur Peekabo jaringan, kalimat jujur Teknologi,
  sisa teks editorial di kode, dan sebutan wilayah Teknologi yang belum
  diputuskan." Penugasan sesi ini menyebut bahwa izin tetap juga mencakup
  deploy skema untuk temuan 3.
- **Deploy skema:** `sanity schemas deploy --workspace default`, dijalankan
  dari branch PR #43 (`ad6763a`) pada 24 Oktober 2026 pukul 04.41 UTC, lewat
  CLI yang login sebagai akun pemilik. Dokumen skema `_.schemas.default` kini
  memuat `bab.jalurJaringan`, `unit.kalimatJujur`, dan `howWeWork.pembuka`.
  Tidak ada medan yang dihapus atau diubah. Validasi skema lokal bersih
  sebelum deploy. Catatan skema milik studio terdaftar (aplikasi
  `wzq57r3u1ckmwj8m33n9bern`, dibuat 6 Oktober) tidak ikut berubah, karena
  memperbaruinya berarti deploy Studio, di luar tugas ini.
- **Ditulis:** 4 dokumen terbit, revisi `rjdnMHo0jFlGJGvrNvScoB`, 04.43 UTC.
  - **Unit Teknologi, `kalimatJujur`:** "Kami tidak membangun dari nol bila
    layanan yang sudah matang menyelesaikan masalahnya; kami menyarankannya
    lebih dulu, dan berkata jujur bila sesuatu belum perlu Anda beli." Kalimat
    ini diambil dari glosarium bagian 10 aturan 5, dan sama kata per kata
    dengan header Teknologi di dokumen yang sama.
  - **Bab Kreator, streamer, dan host, `jalurJaringan`:** `creator`, yaitu
    jalur "Jadi kreator atau host".
  - **Cara kami bekerja, `pembuka`:** "Lingkup, harga, target, dan laporan
    disepakati tertulis sebelum kerja dimulai." Ini lead halaman `/cara-kerja`
    yang sebelumnya ada di kode (`HOW_WE_WORK_LEAD`).
  - **Bab Kuliner, `jembatan`:** satu jembatan ke Kafe siap buka dari lokasi
    sewa (FNB-01): "Untuk kafe yang belum buka, unit Konstruksi menyiapkan
    lokasi sewa sampai alur pelanggan dan dapurnya bekerja." Jembatan ini
    disetujui di serah bab Kuliner tetapi belum pernah ditulis. Sampai tulisan
    ini, ia hanya ada di `lib/content/situation-overrides.ts`.
  - Jejak sumber `temuan-a-3-2026-10-23` ada di keempatnya. Nilai dua bahasa
    mengikuti bentuk dokumennya masing-masing.
- **Isi kode yang dicocokkan sebelum dihapus:** ke-51 entri
  `situation-overrides.ts` dibandingkan medan per medan dengan bab terbit.
  Medan yang dibandingkan: situasi, untuk siapa, batas, metadata, jembatan,
  dan pintu masuk. Semuanya sama, kecuali batas bab Alat (di Sanity lebih baru
  sejak tulis 1) dan jembatan Kuliner (ditulis di sini). Jejak sumber bab-bab
  itu masih menyebut berkas tersebut. Isinya tetap ada di riwayat git, di
  `d5128da`.
- **Cadangan:** ekspor publik 390 dokumen, sha256 `b6b1439401fc…`; dokumen
  sasaran ada di `sebelum-2.ndjson`.
- **Diperiksa sesudahnya:** keempat medan sama persis dengan rencana, dibaca
  dari API publik. Lewat proyeksi seperti kueri situs, ke-24 halaman pekerjaan
  Teknologi membaca kalimat jujur yang sama, dan halaman pekerjaan unit lain
  tidak membacanya. Satu-satunya bab jaringan memakai jalur `creator`. Target
  jembatan Kuliner dan babnya berstatus disetujui.
- **Di situs:** jembatan Kuliner langsung tampil di halaman bab Kuliner.
  Kalimat jujur, jalur jaringan, dan lead `/cara-kerja` dari Sanity baru
  tampil setelah PR #43 merge. Sebelum itu, kode di `main` mengabaikan medan
  baru, dan `/cara-kerja` tetap menampilkan lead yang sama dari kode. Studio
  di `main` menampilkan medan baru sebagai "unknown field" sampai PR #43
  merge. Medan itu jangan dihapus dari Studio.

### Untuk diputuskan pemilik

1. **Wilayah layanan Teknologi.** Sebutan Subang, Purwakarta, dan Bandung
   dicabut dari halaman bot pemantau tender, satu-satunya halaman Teknologi
   yang menyebutnya. Bila Teknologi memang hanya melayani tiga wilayah itu,
   kalimatnya bisa dikembalikan.
2. **Kata katalog di teks header yang dipakai apa adanya.** Paragraf "Dua
   pintu masuk." di header Teknologi menyebut "Sisi A" dan "Sisi B". Ajakan
   unit Peekabo dan langkah kerja ketiganya berbunyi "Kami tentukan lapis mana
   yang bekerja lebih dulu". Glosarium bagian 1 melarang kata itu tampil,
   tetapi Aturan isi 11 meminta header siap tayang dipakai apa adanya. Tidak
   diubah. Pilihan pemilik: biarkan, ganti katanya, atau buang paragraf "Dua
   pintu masuk." utuh, yang diizinkan skema unit.
3. **Alamat `/konstruksi/pelaku-proyek/paket-rakitan`.** Slug bab itu masih
   memuat kata katalog. Menggantinya memindahkan alamat bab itu dan alamat
   halaman pekerjaan RAK-09. Tidak diubah.
4. **Ajakan "Ceritakan barang yang dibutuhkan".** Label yang belum ada di
   glosarium ini (butir 3 di atas) kini juga dipakai bab penyedia untuk
   instansi.
