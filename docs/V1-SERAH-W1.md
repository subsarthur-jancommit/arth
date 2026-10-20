# Serah W1: beranda, tiga unit, enam sisi

Tanggal: 16 Oktober 2026 · Status: perlu Anda · Placeholder: tidak ada

Gelombang W1 dari `docs/RENCANA-KONTEKS-V2.md` §8.4. Header siap tayang dipakai **kata demi kata**, diambil dengan skrip dari master brief, bukan diketik ulang. Yang ditulis agen hanya tiga hal per unit: masalah yang dijawab, langkah kerja, dan (beranda) daftar situasi; masing-masing dengan jejak sumbernya.

Gerbang isi: lolos. Gerbang gaya otomatis (`lib/content/style-gate.ts`): **bersih** untuk keempat dokumen.

## Yang dipotong dari teks siap tayang

| Header                                       | Kalimat yang dipotong utuh                                                                                                                                       | Alasan                                                                                                                                               |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Teknologi, “Kami mengotomatiskan pekerjaan.” | Bagi pemilik akun trading, bot yang sama menjalankan strategi yang sudah Anda tetapkan dengan batas risiko yang tegas, sementara dana tetap berada di akun Anda. | Posisi bot trading belum diputuskan (master brief, keputusan per unit Teknologi); Kerangka pemandu menyebut kalimat ini sebagai contoh yang dipotong |

Tidak ada kata lain yang diubah.

## Beranda (siteSettings)

- **Judul:** Proyek jalan. Sistem bekerja. Pasar bertambah.
- **Subjudul:** Konstruksi sipil, sistem teknologi, dan agency marketshare untuk Subang, Purwakarta, dan Bandung.
- **Pembuka:** Usaha jarang berhenti karena satu masalah besar. Usaha tersendat di tiga tempat: proyek yang macet di celah administrasi, tenaga, material, dan modal; pekerjaan berulang yang masih dikerjakan tangan; dan pasar yang belum cukup mengenal, memercayai, dan membeli. Kami bekerja di ketiga tempat itu lewat tiga unit.
- **Versi ringkas:** Arthur mengisi celah proyek konstruksi, membangun sistem yang membuka pasar dan bekerja sendiri, lalu merebut pasar lewat agency Peekabo, di Subang, Purwakarta, dan Bandung.
- **Ajakan:** Ceritakan masalahnya. Kami tentukan unit mana yang bekerja lebih dulu.

**Paragraf berlabel (apa adanya):**

1. **Kami mengisi celah proyek dan membangun sampai jadi.** Unit Konstruksi mengambil bagian proyek yang tidak sempat atau tidak sanggup Anda tangani, dari administrasi dengan pemerintah sampai tenaga, material, alat, dan modal kerja yang dijembatani mitra. Bagi pemilik bangunan, kami membangun dari hulu ke hilir, lalu merawatnya lewat Membership Care.
2. **Kami membuka pasar baru dan mengotomatiskan sisanya.** Unit Teknologi membuka kanal pendapatan yang berjalan di samping usaha Anda, lalu memasang bot dan workflow yang menjawab, menagih, dan memantau tanpa menunggu diingatkan.
3. **Kami merebut pasar.** Unit Agency, Peekabo, membuat usaha Anda dikenal lewat iklan dan aset yang diproduksi massal, dipercaya lewat kampanye di lapangan, lalu dibeli lewat kreator, host live, sales, dan komunitas yang ikut menjualkan.
4. **Satu klien, tiga unit.** Kafe yang kami bangun bisa langsung memakai pemesanan dan pembayaran dari meja, lalu dibuka dengan kampanye pembukaan gerai. Studio siaran yang kami bangun bisa langsung dipakai host live. Setiap unit tetap bisa dibeli sendiri.
5. **Cara kami bekerja.** Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai. Tenaga ahli bekerja di lapangan proyek Anda; nama atau sertifikat tidak dipinjamkan. Sistem, data, kode, dan merek tetap milik Anda. Komisi dari mitra kami ungkapkan, dan jaringan penjual kami dibayar dari penjualan yang benar-benar terjadi. Kami tidak menjanjikan keuntungan instan.

**Pilih situasi Anda (14, dari tabel Cara memakai di master brief):**

| Situasi                                                                                         | Unit       | Sisi             |
| ----------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| Kontraktor utama sudah menang paket, tetapi belum punya subkon yang sanggup dari hulu ke hilir. | konstruksi | pelaku-proyek    |
| Subkon kekurangan tenaga, material, alat, atau modal kerja.                                     | konstruksi | pelaku-proyek    |
| Penyedia barang pemerintah bingung soal sumber barang dan margin.                               | konstruksi | pelaku-proyek    |
| Pemilik rumah ingin membangun atau merenovasi tanpa repot.                                      | konstruksi | pemilik-bangunan |
| Pemilik kafe, studio, atau penginapan ingin bangunannya lebih produktif.                        | konstruksi | pemilik-bangunan |
| Pemilik properti ingin nilai bangunannya terjaga.                                               | konstruksi | pemilik-bangunan |
| Pemilik usaha kewalahan dengan pekerjaan berulang: pesanan, tagihan, laporan.                   | teknologi  | siap-pakai       |
| Pemilik usaha ingin kanal pendapatan baru di samping usahanya.                                  | teknologi  | siap-pakai       |
| Developer, agensi, atau tim IT tersendat di titik teknis tertentu.                              | teknologi  | paham-teknis     |
| Usaha belum dikenal, belum dipercaya, atau pembelinya tidak kembali.                            | peekabo    | pemilik-usaha    |
| Leads masuk, tetapi tidak ada yang menindaklanjuti sampai closing.                              | peekabo    | pemilik-usaha    |
| Seller ingin live atau afiliasi di TikTok Shop dan Shopee.                                      | peekabo    | pemilik-usaha    |
| Brand ingin hadir di tengah warga.                                                              | peekabo    | pemilik-usaha    |
| Seseorang ingin ikut menjual, menjadi anggota komunitas, atau menjadi host.                     | peekabo    | jaringan         |

Situasi menautkan halaman sisinya sampai bab tujuannya terbit; tautan ke bab diisi lewat `babTujuan` saat bab itu terbit.

## Unit Konstruksi

- **Judul:** Isi celahnya. Bangun sampai jadi. Rawat sesudahnya.
- **Subjudul:** Konstruksi sipil dari hulu ke hilir untuk Subang, Purwakarta, dan Bandung.
- **Pembuka:** Proyek konstruksi jarang tersendat karena tidak ada yang mampu membangun. Proyek tersendat di celah-celah: dokumen yang belum siap, tukang yang belum datang, material yang belum tiba atau harganya bergeser, modal yang belum cair, dan laporan yang belum jadi. Kami bekerja di celah-celah itu.
- **Versi ringkas:** Kami mengisi celah di proyek konstruksi, membangun sampai jadi, dan merawatnya sesudahnya, di Subang, Purwakarta, dan Bandung.
- **Ajakan:** Ceritakan bangunan atau proyeknya. Kami tentukan celah mana yang kami isi.

**Paragraf berlabel (apa adanya):**

1. **Kami mengisi celah.** Bagi kontraktor utama, subkontraktor, developer, dan penyedia barang, kami mengambil bagian yang tidak sempat atau tidak sanggup Anda tangani: administrasi dengan pemerintah, tenaga kerja, material, alat, laporan proyek, sampai penjembatanan modal kerja. Anda membeli per masalah, atau menyerahkan seluruh lingkup pekerjaan dari hulu ke hilir dalam satu paket.
2. **Kami membangun sampai jadi.** Bagi pemilik rumah, pemilik usaha, dan pemilik properti, kami mengurus proyek dari hulu ke hilir: estimasi, desain teknis dan visualisasi interior, pekerjaan lapangan, sampai serah terima. Anda tidak perlu mengurus tukang, material, dan jadwal satu per satu.
3. **Kami membuat bangunan bekerja lebih produktif.** Bagi pemilik kafe dan dapur produksi, studio streaming dan workshop media, serta villa, kontrakan, hotel, dan hostel, kami menyesuaikan bangunan dengan cara industrinya mencari uang: alur pelanggan yang lebih cepat, ruang yang lebih tenang, kamar yang lebih layak jual.
4. **Kami merawat sesudahnya.** Lewat Membership Care, pekerja kami menjaga kondisi dan estetika properti Anda secara berkala dan melaporkannya, sehingga nilai bangunan tidak turun karena dibiarkan.
5. **Kami bekerja di tiga wilayah yang kami kenal.** Subang, Purwakarta, dan Bandung. Kepercayaan di proyek lapangan dibangun satu wilayah demi satu wilayah, bersama pemasok, tukang, dan kebiasaan pengadaan yang sudah kami kenal.
6. **Cara kami bekerja.** Kami berkata jujur tentang apa yang bisa dan tidak bisa kami kerjakan. Tenaga ahli kami bekerja di lapangan proyek Anda; kami tidak meminjamkan nama atau sertifikat untuk memenuhi syarat tender. Layanan administrasi membantu Anda menyiapkan dan memahami aturan, bukan mengatur hasil. Lingkup dan harga disepakati tertulis sebelum kerja dimulai.

**Masalah yang dijawab (ditulis agen):**

| Teks                                                         | Sumber                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Dokumen tender, termin, dan izin belum siap.                 | ADM: “Dokumen menumpuk, tender terlewat, dan berkas termin selalu terlambat.”               |
| Tukang tidak datang tepat waktu dan tidak ada pengendalinya. | TNK: “Tukang tidak datang tepat waktu dan tidak ada yang mengendalikan mereka di lapangan.” |
| Harga material bergeser dan barang datang terlambat.         | MAT: “Harga material bergeser, barang telat, dan jadwalnya tidak sinkron dengan pekerjaan.” |
| Uang muka belum cair, padahal material harus dibayar dulu.   | MOD: “Uang muka belum cair, material harus dibayar dulu, dan tagihan termin belum turun.”   |
| Laporan lewat chat dan biaya lapangan tidak terpantau.       | PRJ: “Laporan lewat chat, kurva S tidak jelas, dan biaya lapangan tidak terpantau.”         |
| Anggaran rumah membengkak dan pekerjaannya tidak diawasi.    | RMH: “Saya takut anggaran membengkak dan pekerjaan tidak diawasi.”                          |

**Langkah kerja (ditulis agen):**

| Teks                                                             | Sumber                                           |
| ---------------------------------------------------------------- | ------------------------------------------------ |
| Ceritakan bangunan atau proyeknya, dengan bahasa Anda sendiri.   | Header Konstruksi, ajakan                        |
| Kami tentukan sisinya: pelaku proyek atau pemilik bangunan.      | Footer Konstruksi, Cara memakainya di lapangan 1 |
| Kondisi lapangan dilihat langsung sebelum angka apa pun disebut. | Sisi B, Alur kerja 2                             |
| Lingkup dan harga disepakati tertulis sebelum kerja dimulai.     | Header Konstruksi, Cara kami bekerja             |

## Unit Teknologi

- **Judul:** Buka pasar baru. Otomatiskan sisanya.
- **Subjudul:** Bot dan workflow yang bekerja dua puluh empat jam untuk bisnis Anda, di sektor apa pun.
- **Pembuka:** Kebanyakan bisnis tidak kekurangan aplikasi. Yang mereka kekurangan ada dua: pasar yang belum terbuka, dan pekerjaan berulang yang masih dikerjakan tangan manusia. Kami bekerja tepat di dua titik itu.
- **Versi ringkas:** Kami membuka pasar baru dan mengotomatiskan pekerjaan berulang lewat bot dan workflow, di sektor apa pun.
- **Ajakan:** Sampaikan masalahnya. Kami tentukan bot, workflow, atau pasar barunya.

**Paragraf berlabel (apa adanya):**

1. **Kami membuka pasar.** Dari usaha yang sudah berjalan, kami membuka kanal pendapatan yang berjalan berdampingan dengannya: lini pulsa dan tagihan, langganan, marketplace, toko produk digital, agen tiket dan travel, layanan yang menyatukan beberapa vendor, merek putih yang disewakan, sampai mesin bayar-per-pakai. Tujuannya bukan menggantikan usaha Anda hari ini, melainkan membuat pendapatan Anda tidak bergantung pada satu sumber.
2. **Kami mengotomatiskan pekerjaan.** Bot kami menjawab, menagih, memantau, dan bertransaksi pukul tiga pagi, ketika tidak ada orang yang berjaga. Workflow kami memindahkan pesanan, permohonan, dan tagihan dari satu tangan ke tangan berikutnya tanpa menunggu diingatkan.
3. **Sektornya bisa apa saja, karena mesinnya sama.** Kuliner, ritel, pendidikan, kesehatan, properti, konstruksi, logistik, keuangan, sampai instansi: yang berbeda hanya masalahnya. Karena itu kami tidak memulai dari daftar layanan. Kami memulai dari masalah yang Anda ceritakan, lalu menentukan apakah jawabannya bot, workflow, atau pasar baru.
4. **Di balik layar ada lapisan data yang menentukan umur semuanya.** Basis data relasional untuk transaksi yang tidak boleh salah, data waktu nyata untuk hal yang tidak boleh terlambat, dan graf relasi untuk hal yang tersembunyi di dalam hubungan: rekomendasi, pola kecurangan, peta pemasok, dan pengetahuan perusahaan yang bisa ditanya.
5. **Dua pintu masuk.** Jika Anda memahami teknis, seperti developer, agensi, software house, atau CTO, masuklah lewat Sisi A: spesialis untuk titik macet yang sedang menghambat Anda. Jika Anda menginginkan hasil akhir yang siap dipakai, masuklah lewat Sisi B: kami mulai dari pasar yang ingin Anda buka atau pekerjaan yang ingin Anda lepaskan dari tangan manusia.
6. **Cara kami bekerja.** Kami tidak membangun dari nol bila layanan yang sudah matang menyelesaikan masalahnya; kami menyarankannya lebih dulu, dan berkata jujur bila sesuatu belum perlu Anda beli. Bisnisnya milik Anda, mereknya milik Anda, datanya milik Anda; kode, akses, dan dokumentasi diserahkan kepada Anda. Kami tidak menjanjikan keuntungan instan. Yang kami berikan adalah perhitungan yang terbuka, otomatisasi yang bekerja, dan pendampingan sampai berjalan. Pembayaran fleksibel: biaya pembangunan, atau kemitraan bagi hasil.

**Masalah yang dijawab (ditulis agen):**

| Teks                                                         | Sumber                                                                                    |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Pendapatan masih bergantung pada satu sumber.                | LIN: “… pendapatan saya bergantung pada satu sumber.”                                     |
| Pesanan, tagihan, dan laporan masih dikerjakan tangan.       | Master brief, Cara memakai: pekerjaan berulang                                            |
| Pekerjaan berulang menyita waktu tim Anda.                   | LIN: “Pekerjaan berulang menyita waktu tim saya …”                                        |
| Data lambat, terlambat, atau tidak terhubung satu sama lain. | Sisi A, Lapisan data: “Data kami lambat, terlambat, atau tidak terhubung satu sama lain.” |
| Tenggat ketat dan spesialis sulit dicari.                    | Sisi A, Software house: “Tenggat ketat dan spesialis sulit dicari.”                       |

**Langkah kerja (ditulis agen):**

| Teks                                                       | Sumber                              |
| ---------------------------------------------------------- | ----------------------------------- |
| Ceritakan masalahnya dengan bahasa Anda sendiri.           | Sisi B, Alur kerja 1                |
| Kami tentukan jawabannya: bot, workflow, atau pasar baru.  | Header Teknologi, ajakan            |
| Layanan yang sudah matang disarankan lebih dulu.           | Header Teknologi, Cara kami bekerja |
| Kode, akses, data, dan dokumentasi diserahkan kepada Anda. | Header Teknologi, Cara kami bekerja |

## Unit Peekabo

- **Judul:** Rebut perhatian. Bangun kepercayaan. Biarkan jaringan yang menjual.
- **Subjudul:** Agency marketshare untuk usaha dan brand, berbasis di Subang, Purwakarta, dan Bandung.
- **Pembuka:** Usaha jarang kalah karena produknya buruk. Usaha kalah karena terlalu sedikit orang yang tahu, belum cukup orang yang percaya, dan tidak ada yang ikut menjualkan. Kami bekerja di ketiga titik itu.
- **Versi ringkas:** Peekabo membuat usaha Anda dikenal, dipercaya, dan dibeli, lalu menghadirkan kreator, host, sales, dan komunitas yang ikut menjualkannya.
- **Ajakan:** Ceritakan pasar yang ingin Anda rebut. Kami tentukan lapis mana yang bekerja lebih dulu.

**Paragraf berlabel (apa adanya):**

1. **Kami merebut perhatian.** Iklan di TikTok, Meta, dan Google dijalankan dengan aset yang diproduksi massal: video, foto, animasi, dan desain. Satu hari produksi dirancang untuk mengisi stok konten sebulan.
2. **Kami membangun kepercayaan di dunia nyata.** Kampanye lapangan membawa brand Anda ke tengah warga: event hunting kota, aktivasi di lokasi mitra, sales lapangan, dan campaign talent. Anda bisa membeli satu modul atau menyerahkan kampanye utuh.
3. **Kami menghadirkan orang yang menjualkan.** Kreator, streamer, host live, sales lepas, dan anggota komunitas ikut menjual produk Anda. Mereka dibayar dari penjualan yang benar-benar terjadi.
4. **Kami mengoperasikan alatnya untuk Anda.** Kami melanggan platform pesan dan CRM, lalu menjalankannya untuk satu jenis usaha: leads dibalas, ditindaklanjuti, dan dicatat sampai closing. Anda membeli hasilnya, bukan lisensinya.
5. **Kami bekerja di dalam ekosistem platform.** Toko, kampanye afiliasi, dan siaran live dikelola mengikuti aturan Shopee dan TikTok Shop by Tokopedia yang terus berubah. Biaya dan komisi platform kami hitung ulang setiap kali aturannya bergeser.
6. **Cara kami bekerja.** Target, lingkup, dan laporan disepakati tertulis. Komisi dari mitra kami ungkapkan kepada klien dan anggota. Jaringan kami dibayar dari penjualan, tanpa biaya masuk, tanpa bonus rekrutmen, dan tanpa janji penghasilan.

**Masalah yang dijawab (ditulis agen):**

| Teks                               | Sumber                          |
| ---------------------------------- | ------------------------------- |
| Belum banyak yang tahu usaha Anda. | Sisi A, Lima masalah: Dikenal   |
| Yang tahu belum yakin.             | Sisi A, Lima masalah: Dipercaya |
| Yang yakin belum membeli.          | Sisi A, Lima masalah: Dibeli    |
| Pembeli tidak kembali.             | Sisi A, Lima masalah: Kembali   |
| Belum ada yang ikut menjualkan.    | Sisi A, Lima masalah: Tersebar  |

**Langkah kerja (ditulis agen):**

| Teks                                                      | Sumber                                          |
| --------------------------------------------------------- | ----------------------------------------------- |
| Ceritakan pasar yang ingin Anda rebut.                    | Header Peekabo, ajakan                          |
| Kami tentukan lapis mana yang bekerja lebih dulu.         | Header Peekabo, ajakan                          |
| Mulai dari audit, sesi strategi, workshop, atau playbook. | Pola pikir Arthur, Pintu masuk ringan: Agency A |
| Target, lingkup, dan laporan disepakati tertulis.         | Header Peekabo, Cara kami bekerja               |

## Enam sisi

Judul sisi sudah teks siap tayang (Judul Sisi A/B) dan tidak berubah. Langkah dan pembeli ditulis lewat migrasi V0 (`lib/scripts/migrate-v2-sides.ts`), dengan isi yang sama dengan `lib/content/side-fallback.ts` di PR #24.

## Rencana tulis (menunggu “ok tulis”)

| Dokumen                                       | Yang disetel                                | Catatan                                                                                                       |
| --------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `drafts.siteSettings`                         | header payung, 14 situasi, ajakan           | Draf yang ada; status `perlu-anda`                                                                            |
| `drafts.9064604d-6421-4247-a7cf-93f01dd29529` | header unit, masalah, langkah kerja, ajakan | Draf yang ada; status `perlu-anda`                                                                            |
| `1614a52e-6c90-4f9a-a8d9-a0c513140aba`        | header unit, masalah, langkah kerja, ajakan | Versi terbit: patch masuk ke drafnya, halaman tayang tidak berubah sampai Anda terbitkan; status `perlu-anda` |
| `drafts.6f2b716f-2de9-4185-b0fe-0a1f27ced80e` | header unit, masalah, langkah kerja, ajakan | Draf yang ada; status `perlu-anda`                                                                            |
| enam dokumen `side`                           | langkah dan pembeli                         | Migrasi V0, patch sudah disiapkan                                                                             |

Setiap patch hanya menyetel medan di atas, dijaga dengan revisi yang dibaca, dan tidak pernah menulis `disetujui`. Pemeriksa grafik isi dijalankan sebelum dan sesudahnya.

## Yang perlu kode (PR V1, sesudah PR #24 digabung)

- Beranda: blok “Pilih situasi Anda” dan paragraf berlabel payung di dalam komposisi `main`; grid karya fixture dicabut (keputusan D1).
- Unit: label “Langkah kerja” untuk daftar langkah, karena paragraf “Cara kami bekerja.” sudah tampil utuh di blok paragraf berlabel.
- Fallback unit di kode diganti teks siap tayang apa adanya, supaya halaman tetap benar sebelum dokumen terbit.

## Catatan tulis

16 Oktober 2026, atas “ok tulis” pemilik. Sepuluh dokumen ditulis lewat konektor Sanity sebagai draf berstatus `perlu-anda`: enam sisi, tiga unit, dan `siteSettings`. Versi terbit Teknologi dan Siap pakai tidak tersentuh (revisi terbitnya tetap). Cadangan nilai lama untuk setiap medan yang ditimpa disimpan di luar repo sebelum menulis. Pemeriksa grafik isi terhadap isi terbit: 0 error, 1 peringatan (bab Kuliner 11 offer).

Langkah Anda di Studio: tinjau tiap draf, tekan Setujui, lalu Terbitkan. Urutan aman: unit, lalu sisi, lalu pengaturan beranda.
