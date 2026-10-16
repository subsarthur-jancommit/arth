# Daftar pendek offer

Usulan agen per bab, sesuai `docs/RENCANA-KONTEKS-V2.md` V2 dan Peta website, “Memilih offer yang tayang”: 3 sampai 7 offer, dipilih terhadap kutipan pembeli bab, satu per jenis sebelum yang kedua, offer lingkup terkecil sebagai pintu masuk, offer ‡ dan yang bergantung pada keputusan terbuka tidak diusulkan, offer † hanya dengan rumusan aman.

Dokumen ini internal: ID katalog dan tanda † boleh ada di sini dan tidak pernah tampil di situs. Isi kolom **Keputusan Anda**, atau balas per bab. Sesudah keputusan dan “ok tulis”, agen menyetel status di Sanity: `dipilih` atau `ditahan`. Dokumen ini dihasilkan oleh `lib/scripts/shortlist-report.ts`; usulan tersimpan di `lib/content/shortlist.ts`.

## Teknologi · Siap pakai

### Kuliner dan F&B

> “Pesanan saya bercampur di chat, kasir kewalahan saat ramai, dan bahan sering habis atau terbuang.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 11 offer. Pintu masuk: **KUL-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                           | Dampak untuk web                                                                                       | Jenis                                  | †   | Alasan                                                       | Keputusan Anda |
| --- | -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------- | --- | ------------------------------------------------------------ | -------------- |
| 1   | KUL-01 (pintu masuk) | Bot pesan-antar WhatsApp                  | Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada admin yang berjaga.              | Bot yang bekerja sendiri               |     | “Pesanan saya bercampur di chat”                             | tayang         |
| 2   | KUL-02               | Pesan dan bayar dari meja                 | Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur.                                  | Alur kerja yang berjalan tanpa dikejar |     | “kasir kewalahan saat ramai”                                 | tayang         |
| 3   | KUL-07               | Buka langganan makan harian               | Pekerja kantor dan penghuni kos bisa berlangganan makan harian, dengan tagihan yang terkirim otomatis. | Kanal pendapatan baru                  |     | Kanal pendapatan; halamannya sudah disetujui di R1           | tayang         |
| 4   | KUL-03               | Layar pesanan di dapur                    | Setiap pesanan tampil di layar dapur saat itu juga, berikut urutan dan waktu sajinya.                  | Angka yang memberi tahu lebih dulu     |     | Kasir dan dapur saat ramai; halamannya sudah disetujui di R1 | tayang         |
| 5   | KUL-08               | Bot stok bahan dan pesan ulang ke pemasok | Stok bahan tercatat, dan pesanan ke pemasok terkirim sendiri saat bahan menipis.                       | Bot yang bekerja sendiri               |     | “bahan sering habis atau terbuang”                           | tayang         |
| 6   | KUL-05               | Workflow pesanan, produksi, dan antar     | Pesanan acara berubah sendiri menjadi daftar belanja, jadwal masak, dan jadwal antar                   | Alur kerja yang berjalan tanpa dikejar |     | Katering: pesanan acara menjadi jadwal masak dan antar       | tayang         |
| 7   | KUL-06               | Buka toko makanan beku ke luar kota       | Toko makanan beku untuk pembeli luar kota, dengan ongkir, resi, dan pelacakan yang berjalan sendiri.   | Kanal pendapatan baru                  |     | Produsen makanan: pasar di luar kota                         | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                           | Alasan                                                          |
| ------ | ----------------------------------------------- | --------------------------------------------------------------- |
| KUL-04 | Bot reservasi dengan uang muka                  | Tidak dipilih: jenis Bot sudah diwakili tiga kali               |
| KUL-09 | Bot ulasan setelah kunjungan                    | Tidak dipilih: tidak menjawab kutipan bab                       |
| KUL-10 | Buka jaringan waralaba dengan aplikasi bermerek | Tidak dipilih: untuk franchise, bukan pembeli utama bab         |
| KUL-11 | Dasbor penjualan per jam                        | Tidak dipilih: Layar pesanan di dapur sudah mewakili jenis Data |

</details>

Catatan: Bab ini sudah tayang dengan 11 offer. Keempat offer yang tidak dipilih perlu dicabut dari tayang (unpublish) di Studio; itu tindakan terbit, jadi menunggu izin Anda tersendiri.

### Ritel, fesyen, dan e-commerce

> “Saya bergantung pada marketplace, stok saya tidak sinkron, dan pelanggan datang sekali lalu hilang.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 11 offer. Pintu masuk: **RIT-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                      | Dampak untuk web                                                                                | Jenis                                  | †   | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------- | --- | ---------------------------------------------------------- | -------------- |
| 1   | RIT-01 (pintu masuk) | Bot sinkron stok lintas marketplace  | Stok di semua kanal berasal dari satu sumber, sehingga barang yang habis tidak tampil tersedia. | Bot yang bekerja sendiri               |     | “stok saya tidak sinkron”                                  | tayang         |
| 2   | RIT-08               | Kasir terhubung toko online          | Penjualan toko dan online tercatat di satu tempat dan stok saling menyesuaikan                  | Alur kerja yang berjalan tanpa dikejar |     | Toko fisik dan online tercatat di satu tempat              | tayang         |
| 3   | RIT-03               | Buka toko brand sendiri              | Toko online milik brand sendiri, dengan data pembeli yang menjadi milik brand.                  | Kanal pendapatan baru                  |     | “Saya bergantung pada marketplace”: toko brand sendiri     | tayang         |
| 4   | RIT-10               | Rekomendasi produk dari pola belanja | Pembeli melihat produk yang sering dibeli bersama, dari pola belanja di toko Anda.              | Angka yang memberi tahu lebih dulu     |     | Produk yang sering dibeli bersama                          | tayang         |
| 5   | RIT-09               | Buka program membership dan poin     | Program poin dan hadiah berjalan untuk pelanggan Anda, dan data belanjanya terkumpul.           | Kanal pendapatan baru                  |     | “pelanggan datang sekali lalu hilang”: poin dan membership | tayang         |
| 6   | RIT-02               | Bot balas chat dan tutup penjualan   | Pertanyaan harga, stok, dan ongkir dijawab seketika dan pesanan ditutup di dalam percakapan     | Bot yang bekerja sendiri               |     | Pertanyaan harga dan ongkir dijawab seketika               | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                      | Alasan                                                                       |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| RIT-04 | Workflow retur dan pengembalian dana       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RIT-05 | Bot pantau harga pesaing                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RIT-06 | Buka jaringan reseller dan dropshipper     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RIT-07 | Workflow pre-order sampai produksi         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RIT-11 | Buka layanan multi-kurir untuk seller lain | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Distributor, grosir, dan toko bangunan

> “Pesanan sales masuk lewat chat, stok selisih, piutang telat, dan harga pemasok naik tanpa kabar.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 11 offer. Pintu masuk: **DIS-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                | Dampak untuk web                                                                 | Jenis                                  | †                                      | Alasan                                                                              | Keputusan Anda |
| --- | -------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------- | -------------- |
| 1   | DIS-01 (pintu masuk) | Bot pesanan sales lapangan                     | Pesanan sales masuk langsung ke gudang tanpa lewat chat dan tanpa salah ketik    | Bot yang bekerja sendiri               |                                        | “Pesanan sales masuk lewat chat”                                                    | tayang         |
| 2   | DIS-09               | Stok opname dengan barcode                     | Stok fisik dan catatan dicocokkan berkala, dan selisihnya tercatat.              | Alur kerja yang berjalan tanpa dikejar |                                        | “stok selisih”: opname dengan barcode                                               | tayang         |
| 3   | DIS-05               | Buka portal pemesanan grosir                   | Pembeli grosir memesan sendiri dengan harga sesuai levelnya, tanpa telepon       | Kanal pendapatan baru                  |                                        | Pembeli grosir memesan sendiri sesuai levelnya                                      | tayang         |
| 4   | DIS-10               | Dasbor sales dan stok yang diperbarui seketika | Penjualan per sales dan stok yang menipis terlihat seketika                      | Angka yang memberi tahu lebih dulu     |                                        | Penjualan per sales dan stok menipis terlihat                                       | tayang         |
| 5   | DIS-04               | Bot penagihan piutang                          | Piutang jatuh tempo diingatkan bertahap lewat WhatsApp sehingga kas lebih lancar | Bot yang bekerja sendiri               |                                        | “piutang telat”: pengingat bertahap lewat WhatsApp                                  | tayang         |
| 6   | DIS-08               | Bot pantau harga pemasok                       | Kenaikan harga pemasok di sumber publik terdeteksi dan dilaporkan lebih dulu.    | Bot yang bekerja sendiri               | Harga jual tetap Anda yang menentukan. | “harga pemasok naik tanpa kabar”: bertanda †, harga jual tetap Anda yang menentukan | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                      | Alasan                                                                       |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| DIS-02 | Bot cek stok dan harga lewat WhatsApp      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DIS-03 | Workflow pesanan, gudang, kirim, dan tagih | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DIS-06 | Buka marketplace material regional         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DIS-07 | Optimasi rute kirim harian                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DIS-11 | Buka toko online B2B                       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Dampak DIS-04 di katalog (“kas lebih lancar”) ditulis ulang di halaman sebagai pekerjaannya: pengingat piutang terkirim bertahap.

### Jasa lokal: salon, bengkel, laundry, kos, dan rental

> “Jadwal bentrok, pelanggan lupa datang, tagihan kos menunggak, dan mesin harus dijaga terus.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **JAS-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                     | Dampak untuk web                                                                  | Jenis                                  | †   | Alasan                                               | Keputusan Anda |
| --- | -------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------- | --- | ---------------------------------------------------- | -------------- |
| 1   | JAS-01 (pintu masuk) | Bot booking dan pengingat                           | Pelanggan memesan jadwal lewat bot dan menerima pengingat sebelum datang.         | Bot yang bekerja sendiri               |     | “Jadwal bentrok, pelanggan lupa datang”              | tayang         |
| 2   | JAS-06               | Workflow tagihan kos bulanan                        | Tagihan, pengingat, dan bukti bayar berjalan sendiri dan tunggakan terlihat jelas | Alur kerja yang berjalan tanpa dikejar |     | “tagihan kos menunggak”                              | tayang         |
| 3   | JAS-04               | Buka mesin laundry koin dengan QRIS                 | Mesin laundry koin menyala setelah pembayaran QRIS, tanpa penjaga.                | Kanal pendapatan baru                  |     | “mesin harus dijaga terus”: laundry koin dengan QRIS | tayang         |
| 4   | JAS-10               | Dasbor mesin dan pendapatan per unit                | Status dan pendapatan tiap mesin terlihat seketika                                | Angka yang memberi tahu lebih dulu     |     | Status dan pendapatan tiap mesin                     | tayang         |
| 5   | JAS-02               | Workflow estimasi, persetujuan, pengerjaan, selesai | Pelanggan menyetujui biaya lewat ponsel dan mendapat kabar di tiap tahap          | Alur kerja yang berjalan tanpa dikejar |     | Bengkel: biaya disetujui lewat ponsel                | tayang         |
| 6   | JAS-03               | Bot pengingat servis berkala                        | Pelanggan menerima pengingat saat servis berkalanya jatuh tempo.                  | Bot yang bekerja sendiri               |     | Pengingat servis berkala                             | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                             | Alasan                                                                       |
| ------ | --------------------------------- | ---------------------------------------------------------------------------- |
| JAS-05 | Buka rental dan photobox otomatis | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| JAS-07 | Akses pintu berbasis kode         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| JAS-08 | Buka paket langganan bulanan      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| JAS-09 | Bot status cucian                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Klinik dan kesehatan

> “Telepon janji temu menumpuk, data pasien diketik berulang, dan pasien lupa kontrol.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 11 offer. Pintu masuk: **KES-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                   | Dampak untuk web                                                        | Jenis                                  | †                                                                           | Alasan                                                            | Keputusan Anda |
| --- | -------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------- |
| 1   | KES-01 (pintu masuk) | Bot janji temu                                    | Pasien membuat janji sendiri lewat bot, tanpa menunggu telepon dijawab. | Bot yang bekerja sendiri               | Data pasien dijaga sebagai data pribadi yang sensitif, sesuai UU PDP.       | “Telepon janji temu menumpuk”: bertanda †, data pasien dijaga     | tayang         |
| 2   | KES-04               | Workflow pendaftaran, pemeriksaan, dan pembayaran | Data pasien tidak diketik ulang di setiap meja                          | Alur kerja yang berjalan tanpa dikejar | Data pasien dijaga sebagai data pribadi yang sensitif, sesuai UU PDP.       | “data pasien diketik berulang”: bertanda †                        | tayang         |
| 3   | KES-08               | Buka membership perawatan                         | Paket perawatan berlangganan dengan pengingat sesi                      | Kanal pendapatan baru                  |                                                                             | Paket perawatan berlangganan                                      | tayang         |
| 4   | KES-03               | Antrean pasien yang terlihat langsung             | Pasien tahu giliran dari ponsel dan ruang tunggu lebih tenang           | Angka yang memberi tahu lebih dulu     |                                                                             | Pasien tahu gilirannya dari ponsel                                | tayang         |
| 5   | KES-02               | Bot pengingat kontrol dan obat                    | Pasien menerima pengingat jadwal kontrol dan obat.                      | Bot yang bekerja sendiri               | Pengingat hanya untuk pasien yang setuju; data pasien dijaga sesuai UU PDP. | “pasien lupa kontrol”: bertanda †, hanya untuk pasien yang setuju | tayang         |
| 6   | KES-06               | Bot stok dan kedaluwarsa obat                     | Obat menipis atau mendekati kedaluwarsa diperingatkan dan dipesan ulang | Bot yang bekerja sendiri               |                                                                             | Apotek: obat menipis dan kedaluwarsa                              | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                 | Alasan                                                                                          |
| ------ | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| KES-05 | Sambungan SATUSEHAT                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                    |
| KES-07 | Buka konsultasi dan pesan obat online | Tidak dipilih: layanan medis online bergantung pada izin fasilitas; lebih aman lewat percakapan |
| KES-09 | Bot tanya jawab layanan               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                    |
| KES-10 | Workflow pengiriman hasil ke pasien   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                    |
| KES-11 | Pelaporan berkala ke instansi         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                    |

</details>

### Pendidikan dan pelatihan

> “SPP menunggak, pendaftaran masih kertas, dan pendapatan hanya dari kelas tatap muka.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 11 offer. Pintu masuk: **EDU-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                       | Dampak untuk web                                                       | Jenis                                  | †   | Alasan                                                              | Keputusan Anda |
| --- | -------------------- | ------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------- | --- | ------------------------------------------------------------------- | -------------- |
| 1   | EDU-01 (pintu masuk) | Bot pengingat SPP dan tagihan         | Orang tua menerima tagihan dan kode bayar SPP tanpa datang ke sekolah. | Bot yang bekerja sendiri               |     | “SPP menunggak”                                                     | tayang         |
| 2   | EDU-02               | Workflow pendaftaran siswa baru       | Formulir, berkas, pembayaran, dan pengumuman berjalan online           | Alur kerja yang berjalan tanpa dikejar |     | “pendaftaran masih kertas”                                          | tayang         |
| 3   | EDU-03               | Buka kelas berlangganan online        | Kelas online berlangganan dibuka di samping kelas tatap muka.          | Kanal pendapatan baru                  |     | “pendapatan hanya dari kelas tatap muka”: kelas berlangganan online | tayang         |
| 4   | EDU-06               | Portal orang tua: kehadiran dan nilai | Orang tua melihat kehadiran dan nilai anak seketika lewat portal.      | Angka yang memberi tahu lebih dulu     |     | Kehadiran dan nilai untuk orang tua                                 | tayang         |
| 5   | EDU-09               | Otomasi rekap nilai dan rapor         | Rapor tersusun dari nilai harian tanpa disalin ulang                   | Alur kerja yang berjalan tanpa dikejar |     | Rapor dari nilai harian                                             | tayang         |
| 6   | EDU-05               | Buka toko bank soal dan modul digital | Modul dijual berulang tanpa stok                                       | Kanal pendapatan baru                  |     | Modul digital dijual berulang                                       | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                | Alasan                                                                       |
| ------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| EDU-04 | Ujian berbasis komputer              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| EDU-07 | Sinkron Dapodik                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| EDU-08 | Bot tanya jawab jadwal dan materi    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| EDU-10 | Rekomendasi belajar dari graf materi | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| EDU-11 | Buka marketplace guru privat lokal   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Properti, dealer, dan showroom

> “Prospek tercecer, pengajuan leasing tidak terpantau, dan pelanggan lama tak pernah dihubungi lagi.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 11 offer. Pintu masuk: **PRO-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                             | Dampak untuk web                                                                                               | Jenis                                  | †                                                               | Alasan                                                                                       | Keputusan Anda |
| --- | -------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------- |
| 1   | PRO-01 (pintu masuk) | Bot penjawab calon pembeli 24 jam           | Pertanyaan unit dijawab seketika dan survei langsung terjadwal                                                 | Bot yang bekerja sendiri               |                                                                 | “Prospek tercecer”: dijawab seketika dan survei terjadwal                                    | tayang         |
| 2   | PRO-02               | Workflow prospek, survei, booking, KPR      | Prospek tidak terlewat dan berkas KPR terkumpul bertahap                                                       | Alur kerja yang berjalan tanpa dikejar |                                                                 | Prospek sampai berkas KPR                                                                    | tayang         |
| 3   | PRO-10               | Dasbor funnel penjualan                     | Tahap prospek dan penyebab gagal terlihat                                                                      | Angka yang memberi tahu lebih dulu     |                                                                 | Tahap prospek dan penyebab gagal terlihat                                                    | tayang         |
| 4   | PRO-06               | Kalkulator cicilan dan pengajuan ke leasing | Calon pembeli menghitung cicilan dan mengajukan ke leasing dari situs, dengan status pengajuan yang terpantau. | Alur kerja yang berjalan tanpa dikejar | Persetujuan pembiayaan di tangan perusahaan pembiayaan berizin. | “pengajuan leasing tidak terpantau”: bertanda †, persetujuan di tangan perusahaan pembiayaan | tayang         |
| 5   | PRO-07               | Bot pengingat servis, pajak, dan asuransi   | Pelanggan lama menerima pengingat servis, pajak, dan asuransi kendaraannya.                                    | Bot yang bekerja sendiri               |                                                                 | “pelanggan lama tak pernah dihubungi lagi”                                                   | tayang         |
| 6   | PRO-05               | Bot penawaran dan jadwal test drive         | Calon pembeli mendapat penawaran dan jadwal tanpa menunggu sales                                               | Bot yang bekerja sendiri               |                                                                 | Dealer: penawaran dan jadwal test drive                                                      | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                           | Alasan                                                                       |
| ------ | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| PRO-03 | Etalase unit yang diperbarui langsung           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRO-04 | Laporan progres untuk pencairan KPR             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRO-08 | Pembagi lead ke sales                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRO-09 | Buka marketplace properti dan kendaraan lokal   | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                       |
| PRO-11 | Pencatat komisi properti, leasing, dan asuransi | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Keuangan, trading, dan pembiayaan

> “Eksekusi strategi saya tidak konsisten, angsuran dikejar manual, dan berkas menumpuk.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 13 offer. Pintu masuk: **KEU-09**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                     | Dampak untuk web                                                                                      | Jenis                                  | †                                                                | Alasan                                                                      | Keputusan Anda |
| --- | -------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------- |
| 1   | KEU-09 (pintu masuk) | Bot angsuran dan iuran                              | Angsuran dan iuran ditagih dan dicocokkan otomatis                                                    | Bot yang bekerja sendiri               |                                                                  | “angsuran dikejar manual”                                                   | tayang         |
| 2   | KEU-08               | Workflow pengajuan, survei, pencairan, dan angsuran | Pinjaman anggota berjalan tertib dan tunggakan diingatkan                                             | Alur kerja yang berjalan tanpa dikejar |                                                                  | Koperasi: pengajuan sampai angsuran tertib                                  | tayang         |
| 3   | KEU-12               | Buka lini pulsa, token listrik, dan tagihan         | Lini pulsa, token listrik, dan tagihan dibuka dari supplier, dengan selisih harga yang Anda tetapkan. | Kanal pendapatan baru                  | Produk yang boleh dijual mengikuti kontrak dengan supplier.      | Konter dan agen: lini pulsa, token, dan tagihan; bertanda †                 | tayang         |
| 4   | KEU-13               | Deteksi pola transaksi janggal dari graf            | Jaringan akun dan transaksi yang mencurigakan terlihat lebih dini                                     | Angka yang memberi tahu lebih dulu     |                                                                  | Pola transaksi janggal terlihat lebih dini                                  | tayang         |
| 5   | KEU-10               | Workflow verifikasi berkas dan skoring sederhana    | Berkas pemohon diverifikasi, dan setiap keputusan tercatat.                                           | Alur kerja yang berjalan tanpa dikejar | Keputusan pembiayaan tetap di tangan pemberi pembiayaan berizin. | “berkas menumpuk”: bertanda †, keputusan tetap di tangan pemberi pembiayaan | tayang         |
| 6   | KEU-11               | Bot pengingat perpanjangan polis                    | Polis yang mendekati jatuh tempo diingatkan kepada agen untuk ditindaklanjuti.                        | Bot yang bekerja sendiri               | Penjualan asuransi tetap oleh agen berlisensi.                   | Agen asuransi: pengingat perpanjangan polis; bertanda †                     | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                              | Alasan                                                                 |
| ------ | -------------------------------------------------- | ---------------------------------------------------------------------- |
| KEU-01 | Bot eksekusi strategi Anda                         | Menunggu keputusan posisi bot trading                                  |
| KEU-02 | Mesin backtest dan akun simulasi                   | Menunggu keputusan posisi bot trading                                  |
| KEU-03 | Bot manajemen risiko                               | Ikut keputusan posisi bot trading: isinya batas rugi dan ukuran posisi |
| KEU-04 | Peringatan harga dan berita                        | Ikut keputusan posisi bot trading: peringatan harga untuk trader       |
| KEU-05 | Jurnal trading otomatis                            | Menunggu keputusan posisi bot trading                                  |
| KEU-06 | Bot pembelian berkala dan penyeimbangan portofolio | Ditahan: bot investasi                                                 |
| KEU-07 | Buka kelas dan komunitas trading berlangganan      | Menunggu keputusan posisi bot trading                                  |

</details>

Catatan: Klausa pertama kutipan bab (“Eksekusi strategi saya tidak konsisten”) tidak dijawab di halaman sampai posisi bot trading diputuskan; saran master brief: hanya lewat percakapan.

### Konstruksi dan kontraktor

> “Tender terlewat, dokumen tidak siap, laporan lapangan lewat chat, harga material naik-turun, dan termin lambat cair.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 13 offer. Pintu masuk: **KON-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                     | Dampak untuk web                                                                          | Jenis                                  | †                                                                            | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------- |
| 1   | KON-01 (pintu masuk) | Bot pemantau tender regional        | Paket baru di Subang, Purwakarta, dan Bandung yang sesuai kualifikasi dikirim setiap hari | Bot yang bekerja sendiri               | Dari situs pengadaan publik; kami membantu menyiapkan, bukan mengatur hasil. | “Tender terlewat”: bertanda †, dari situs pengadaan publik | tayang         |
| 2   | KON-02               | Workflow penyusunan penawaran       | Dokumen kualifikasi, teknis, dan harga tersusun dari data perusahaan                      | Alur kerja yang berjalan tanpa dikejar |                                                                              | “dokumen tidak siap”                                       | tayang         |
| 3   | KON-06               | Dasbor arus kas dan kurva S terkini | Selisih rencana dan realisasi terlihat seketika                                           | Angka yang memberi tahu lebih dulu     |                                                                              | Selisih rencana dan realisasi terlihat                     | tayang         |
| 4   | KON-04               | Laporan lapangan mode offline       | Progres, foto, dan absensi terkirim walau tanpa sinyal                                    | Alur kerja yang berjalan tanpa dikejar |                                                                              | “laporan lapangan lewat chat”: terkirim walau tanpa sinyal | tayang         |
| 5   | KON-07               | Bot pantau harga material regional  | Perubahan harga material di tiga wilayah dikabarkan dan RAB diperbarui                    | Bot yang bekerja sendiri               |                                                                              | “harga material naik-turun”                                | tayang         |
| 6   | KON-05               | Workflow penagihan termin           | Berkas termin terkumpul otomatis dari laporan lapangan                                    | Alur kerja yang berjalan tanpa dikejar |                                                                              | “termin lambat cair”: berkas termin dari laporan lapangan  | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                             | Alasan                                                                       |
| ------ | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| KON-03 | Pengingat masa berlaku SBU, SKK, NIB, dan jaminan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-08 | Buka marketplace tukang dan material regional     | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                       |
| KON-09 | Arsip proyek yang bisa dicari                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-10 | Peta pemenang tender dan pesaing                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-11 | Workflow serah terima unit dan perbaikan komplain | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-12 | Workflow pengadaan barang                         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KON-13 | Absensi dan upah tukang lewat WhatsApp            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Bab ini berpasangan dengan Konstruksi Pelaku proyek (ADM-01 dengan KON-01); jembatannya ditulis di V3.

### Travel, hospitality, dan event

> “Booking bentrok, DP dikejar manual, dan tiket event dijual manual.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **TRV-04**. Aturan: lolos.

| #   | ID                   | Judul untuk web                       | Dampak untuk web                                                                               | Jenis                                  | †                                                           | Alasan                                                        | Keputusan Anda |
| --- | -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- | -------------- |
| 1   | TRV-04 (pintu masuk) | Sinkron ketersediaan lintas kanal     | Kamar tidak dobel pesan di banyak platform                                                     | Alur kerja yang berjalan tanpa dikejar | Lewat sambungan resmi setiap platform.                      | “Booking bentrok”: bertanda †, lewat sambungan resmi platform | tayang         |
| 2   | TRV-05               | Buka tiket event dengan QR            | Tiket event dijual online, dipindai di pintu, dan penjualannya terlihat seketika.              | Kanal pendapatan baru                  |                                                             | “tiket event dijual manual”                                   | tayang         |
| 3   | TRV-07               | Bot check-in dan informasi peserta    | Peserta terverifikasi dan pertanyaannya dijawab di WhatsApp                                    | Bot yang bekerja sendiri               |                                                             | Peserta event terverifikasi di WhatsApp                       | tayang         |
| 4   | TRV-03               | Workflow booking, DP, dan check-in    | Tamu memesan, membayar DP, dan check-in mandiri tanpa resepsionis                              | Alur kerja yang berjalan tanpa dikejar |                                                             | “DP dikejar manual”: booking, DP, dan check-in                | tayang         |
| 5   | TRV-01               | Buka lini agen tiket dan hotel online | Tiket, hotel, dan paket dari supplier ditawarkan lewat situs Anda, dengan komisi atau markup.  | Kanal pendapatan baru                  | Produk yang boleh dijual mengikuti kontrak dengan supplier. | Biro perjalanan: tiket dan hotel dari supplier; bertanda †    | tayang         |
| 6   | TRV-09               | Bot peringatan harga musim ramai      | Hari libur dan lonjakan permintaan diperingatkan lebih dulu, supaya harga bisa Anda sesuaikan. | Bot yang bekerja sendiri               |                                                             | Musim ramai diperingatkan lebih dulu                          | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                  | Alasan                                                                       |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| TRV-02 | Bot rencana perjalanan dan tanya jawab | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TRV-06 | Workflow vendor dan rundown            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TRV-08 | Buka marketplace paket wisata desa     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TRV-10 | Kode akses pintu otomatis              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Media, kreator, dan komunitas

> “Audiens saya besar tetapi pendapatan tipis, dan konten serta komunitas dikelola manual.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 12 offer. Pintu masuk: **MED-05**. Aturan: lolos.

| #   | ID                   | Judul untuk web                            | Dampak untuk web                                               | Jenis                                  | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ------------------------------------------ | -------------------------------------------------------------- | -------------------------------------- | --- | ----------------------------------------------------- | -------------- |
| 1   | MED-05 (pintu masuk) | Bot komunitas Telegram atau Discord        | Sambutan anggota, aturan, dan iuran berjalan otomatis          | Bot yang bekerja sendiri               |     | “komunitas dikelola manual”                           | tayang         |
| 2   | MED-03               | Buka toko produk digital                   | Template, preset, dan ebook dijual berulang tanpa stok         | Kanal pendapatan baru                  |     | “pendapatan tipis”: toko produk digital               | tayang         |
| 3   | MED-06               | Workflow produksi konten                   | Brief, produksi, persetujuan, dan jadwal posting terkoordinasi | Alur kerja yang berjalan tanpa dikejar |     | “konten dikelola manual”: brief sampai jadwal posting | tayang         |
| 4   | MED-01               | Overlay donasi dan alert langsung di layar | Donasi, follow, dan pesan tampil di layar siaran seketika      | Angka yang memberi tahu lebih dulu     |     | Donasi dan alert di layar; jembatan ke studio siaran  | tayang         |
| 5   | MED-04               | Buka membership penggemar                  | Membership penggemar dengan konten eksklusif, ditagih bulanan. | Kanal pendapatan baru                  |     | Membership penggemar                                  | tayang         |
| 6   | MED-07               | Otomasi klip dan jadwal siaran             | Cuplikan siaran dipotong dan dijadwalkan ke banyak platform    | Alur kerja yang berjalan tanpa dikejar |     | Cuplikan siaran ke banyak platform                    | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                          | Alasan                                                                                             |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| MED-02 | Bot chat siaran                                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |
| MED-08 | Dasbor performa lintas platform                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |
| MED-09 | Workflow episode dari rekaman sampai publikasi | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |
| MED-10 | Buka marketplace kreator dan brand             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |
| MED-11 | Bot giveaway dan undian                        | Tidak dipilih: undian tidak dijual di media afiliasi (aturan Agency); lebih aman tidak ditayangkan |
| MED-12 | Bot berita ke WhatsApp atau Telegram           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                       |

</details>

### Logistik, armada, dan gudang

> “Pelanggan bertanya ‘paketku di mana’, rute boros, dan klaim kerusakan tanpa bukti.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **LOG-02**. Aturan: lolos.

| #   | ID                   | Judul untuk web                         | Dampak untuk web                                                                          | Jenis                                  | †   | Alasan                                      | Keputusan Anda |
| --- | -------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- | --- | ------------------------------------------- | -------------- |
| 1   | LOG-02 (pintu masuk) | Bot status kiriman ke pelanggan         | Pelanggan diberi kabar di setiap tahap pengiriman.                                        | Bot yang bekerja sendiri               |     | “Pelanggan bertanya paketku di mana”        | tayang         |
| 2   | LOG-03               | Workflow bukti serah terima digital     | Foto, tanda tangan, dan lokasi serah terima tercatat sebagai bukti.                       | Alur kerja yang berjalan tanpa dikejar |     | “klaim kerusakan tanpa bukti”               | tayang         |
| 3   | LOG-04               | Optimasi rute dan muatan                | Rute dan muatan barang disusun lebih efisien.                                             | Angka yang memberi tahu lebih dulu     |     | “rute boros”                                | tayang         |
| 4   | LOG-08               | Buka agregator multi-kurir untuk seller | Seller memilih kurir termurah lewat agregator Anda, dan Anda menetapkan selisih tarifnya. | Kanal pendapatan baru                  |     | Agregator multi-kurir untuk seller          | tayang         |
| 5   | LOG-01               | Pelacakan armada langsung               | Posisi kendaraan dan estimasi tiba terlihat seketika                                      | Angka yang memberi tahu lebih dulu     |     | Posisi kendaraan terlihat seketika          | tayang         |
| 6   | LOG-05               | Bot jadwal servis dan pajak kendaraan   | Servis dan dokumen kendaraan tidak terlewat                                               | Bot yang bekerja sendiri               |     | Servis dan dokumen kendaraan tidak terlewat | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                    | Alasan                                                                       |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| LOG-06 | Buka marketplace muatan dan truk         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LOG-07 | Workflow terima, simpan, kirim           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LOG-09 | Dasbor ketepatan waktu                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LOG-10 | Sensor suhu dan peringatan rantai dingin | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Manufaktur ringan, agro, dan UMKM produksi

> “Biaya pokok tidak diketahui, mesin berhenti mendadak, dan hasil tani lewat banyak perantara.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **MAN-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                 | Dampak untuk web                                                           | Jenis                                  | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------- | --- | ----------------------------------------------------- | -------------- |
| 1   | MAN-03 (pintu masuk) | Bot pencatat panen lewat WhatsApp               | Hasil panen dan biaya tercatat dari foto atau suara tanpa buku             | Bot yang bekerja sendiri               |     | Lingkup terkecil: panen dan biaya tercatat tanpa buku | tayang         |
| 2   | MAN-01               | Workflow bahan, produksi, dan pemeriksaan mutu  | Biaya pokok dan mutu tiap batch terkontrol                                 | Alur kerja yang berjalan tanpa dikejar |     | “Biaya pokok tidak diketahui”                         | tayang         |
| 3   | MAN-05               | Buka marketplace hasil tani langsung ke pembeli | Hasil tani dijual tanpa perantara berlapis                                 | Kanal pendapatan baru                  |     | “hasil tani lewat banyak perantara”                   | tayang         |
| 4   | MAN-09               | Prediksi kebutuhan bahan                        | Kebutuhan bahan diperkirakan dari pola penjualan, sebagai dasar pembelian. | Angka yang memberi tahu lebih dulu     |     | Kebutuhan bahan dari pola penjualan                   | tayang         |
| 5   | MAN-02               | Sensor mesin dan peringatan                     | Mesin bermasalah terdeteksi sebelum berhenti                               | Bot yang bekerja sendiri               |     | “mesin berhenti mendadak”                             | tayang         |
| 6   | MAN-07               | Workflow perawatan mesin berkala                | Jadwal perawatan tidak terlewat                                            | Alur kerja yang berjalan tanpa dikejar |     | Perawatan mesin berkala                               | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                              | Alasan                                                                       |
| ------ | ---------------------------------- | ---------------------------------------------------------------------------- |
| MAN-04 | Otomasi pakan, pengairan, dan suhu | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAN-06 | Penelusuran asal bahan per batch   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAN-08 | Buka toko online produk kemasan    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAN-10 | Pemeriksaan lapangan mode offline  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Instansi, desa, dan organisasi publik

> “Warga harus datang untuk urusan sederhana, surat menumpuk, dan laporan wajib disusun manual.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 11 offer. Pintu masuk: **PUB-10**. Aturan: lolos.

| #   | ID                   | Judul untuk web                    | Dampak untuk web                                                | Jenis                                  | †                                                    | Alasan                                                        | Keputusan Anda |
| --- | -------------------- | ---------------------------------- | --------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- | -------------- |
| 1   | PUB-10 (pintu masuk) | Bot informasi layanan publik       | Syarat dan alur layanan dijawab kapan pun                       | Bot yang bekerja sendiri               |                                                      | Lingkup terkecil: syarat dan alur layanan dijawab kapan pun   | tayang         |
| 2   | PUB-01               | Layanan surat menyurat online      | Warga mengurus surat tanpa datang dan kantor lebih ringan       | Alur kerja yang berjalan tanpa dikejar |                                                      | “Warga harus datang untuk urusan sederhana”                   | tayang         |
| 3   | PUB-05               | Buka donasi transparan dengan QRIS | Donasi masuk online dengan laporan penggunaan yang terbuka      | Kanal pendapatan baru                  |                                                      | Yayasan dan rumah ibadah: donasi dengan laporan terbuka       | tayang         |
| 4   | PUB-04               | Dasbor aduan dan layanan terkini   | Pimpinan melihat beban kerja dan waktu penyelesaian             | Angka yang memberi tahu lebih dulu     |                                                      | Beban kerja dan waktu penyelesaian terlihat                   | tayang         |
| 5   | PUB-03               | Workflow disposisi dan persetujuan | Surat bergerak antarpejabat dengan jejak yang jelas             | Alur kerja yang berjalan tanpa dikejar |                                                      | “surat menumpuk”: disposisi dengan jejak                      | tayang         |
| 6   | PUB-08               | Pelaporan berkala otomatis         | Laporan wajib tersusun dari data layanan                        | Alur kerja yang berjalan tanpa dikejar | Hanya lewat kerja sama atau jalur resmi instansinya. | “laporan wajib disusun manual”: bertanda †, lewat jalur resmi | tayang         |
| 7   | PUB-02               | Bot pengaduan warga                | Aduan masuk lewat WhatsApp dan langsung dialokasikan ke petugas | Bot yang bekerja sendiri               |                                                      | Aduan warga lewat WhatsApp                                    | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                              | Alasan                                                                       |
| ------ | ---------------------------------- | ---------------------------------------------------------------------------- |
| PUB-06 | Infak QRIS dan pengumuman otomatis | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PUB-07 | Arsip digital dengan pencarian     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PUB-09 | Pemantauan proyek fisik desa       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PUB-11 | Buka marketplace UMKM desa         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Jasa profesional dan agensi

> “Prospek tidak ditindaklanjuti, laporan klien disusun manual, dan tenggat klien terlewat.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 11 offer. Pintu masuk: **PRF-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                            | Dampak untuk web                                           | Jenis                                  | †   | Alasan                              | Keputusan Anda |
| --- | -------------------- | ------------------------------------------ | ---------------------------------------------------------- | -------------------------------------- | --- | ----------------------------------- | -------------- |
| 1   | PRF-01 (pintu masuk) | Bot kualifikasi lead                       | Prospek disaring dan dijadwalkan demo tanpa admin          | Bot yang bekerja sendiri               |     | “Prospek tidak ditindaklanjuti”     | tayang         |
| 2   | PRF-03               | Laporan bulanan klien otomatis             | Laporan kinerja terbit sendiri dari data kanal             | Alur kerja yang berjalan tanpa dikejar |     | “laporan klien disusun manual”      | tayang         |
| 3   | PRF-10               | Buka jasa berulang menjadi paket langganan | Jasa yang berulang dikemas menjadi paket bulanan           | Kanal pendapatan baru                  |     | Jasa berulang menjadi paket bulanan | tayang         |
| 4   | PRF-05               | Bot pengingat tenggat klien                | Tenggat pajak, izin, dan kontrak klien tidak terlewat      | Bot yang bekerja sendiri               |     | “tenggat klien terlewat”            | tayang         |
| 5   | PRF-06               | Timesheet dan penagihan otomatis           | Jam kerja menjadi faktur tanpa rekap manual                | Alur kerja yang berjalan tanpa dikejar |     | Jam kerja menjadi faktur            | tayang         |
| 6   | PRF-02               | Workflow onboarding klien                  | Kontrak, brief, akses, dan tagihan awal berjalan berurutan | Alur kerja yang berjalan tanpa dikejar |     | Onboarding klien berurutan          | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                        | Alasan                                                                       |
| ------ | -------------------------------------------- | ---------------------------------------------------------------------------- |
| PRF-04 | Workflow proposal dari brief                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRF-07 | Portal klien                                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRF-08 | Workflow dokumen dan tanda tangan elektronik | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRF-09 | Asisten pengetahuan internal                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRF-11 | Buka toko template dan aset desain           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Kebugaran, olahraga, dan rekreasi

> “Jadwal lapangan bentrok, iuran anggota menunggak, dan lampu serta loker harus dijaga orang.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **FIT-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                  | Dampak untuk web                                                                   | Jenis                                  | †   | Alasan                                             | Keputusan Anda |
| --- | -------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------- | --- | -------------------------------------------------- | -------------- |
| 1   | FIT-03 (pintu masuk) | Bot pengingat iuran dan kelas                    | Anggota diingatkan membayar dan jadwal kelas, dan anggota yang tak aktif dihubungi | Bot yang bekerja sendiri               |     | “iuran anggota menunggak”                          | tayang         |
| 2   | FIT-01               | Workflow pemesanan lapangan dengan DP            | Jadwal lapangan terisi tanpa telepon dan DP masuk otomatis                         | Alur kerja yang berjalan tanpa dikejar |     | “Jadwal lapangan bentrok”: pemesanan dengan DP     | tayang         |
| 3   | FIT-02               | Buka lampu dan listrik lapangan berbayar per jam | Lampu menyala setelah pembayaran dan mati sendiri saat waktu habis                 | Kanal pendapatan baru                  |     | “lampu harus dijaga orang”: lampu berbayar per jam | tayang         |
| 4   | FIT-07               | Klasemen dan skor langsung                       | Penonton melihat skor dan klasemen langsung di ponsel                              | Angka yang memberi tahu lebih dulu     |     | Skor dan klasemen langsung                         | tayang         |
| 5   | FIT-10               | Buka tiket masuk dan loker bayar QRIS            | Tiket dan loker dibayar dengan QRIS dan terpantau                                  | Kanal pendapatan baru                  |     | “loker harus dijaga orang”: tiket dan loker QRIS   | tayang         |
| 6   | FIT-04               | Buka membership dan paket kelas                  | Keanggotaan dan paket sesi dibuka dengan tagihan berulang.                         | Kanal pendapatan baru                  |     | Membership dan paket kelas                         | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                    | Alasan                                                                       |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| FIT-05 | Bot daftar tunggu kelas                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FIT-06 | Workflow jadwal, skor, dan klasemen      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FIT-08 | Buka marketplace lawan main dan lapangan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FIT-09 | Buka program latihan berlangganan        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Lintas sektor: untuk usaha apa pun

> “Pekerjaan berulang menyita waktu tim saya dan pendapatan saya bergantung pada satu sumber.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 26 offer. Pintu masuk: **LIN-17**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                       | Dampak untuk web                                                                                  | Jenis                                  | †   | Alasan                                                                                    | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------- | --- | ----------------------------------------------------------------------------------------- | -------------- |
| 1   | LIN-17 (pintu masuk) | Sesi pemetaan peluang model bisnis baru               | Dari sembilan model dipilih yang cocok dengan aset dan pelanggan Anda, dengan perhitungan terbuka | Kanal pendapatan baru                  |     | “pendapatan saya bergantung pada satu sumber”: sesi pemetaan, titik mulai di master brief | tayang         |
| 2   | LIN-01               | Bot laporan harian ke pemilik                         | Ringkasan penjualan, kas, dan tugas terkirim setiap pagi                                          | Bot yang bekerja sendiri               |     | Ringkasan penjualan dan kas setiap pagi                                                   | tayang         |
| 3   | LIN-07               | Workflow persetujuan berjenjang                       | Cuti, klaim, dan pembelian bergerak ke atasan tanpa dikejar                                       | Alur kerja yang berjalan tanpa dikejar |     | “Pekerjaan berulang menyita waktu tim saya”: persetujuan berjenjang                       | tayang         |
| 4   | LIN-12               | Dasbor pemilik yang diperbarui seketika               | Kas, penjualan, dan operasi terlihat dalam satu layar                                             | Angka yang memberi tahu lebih dulu     |     | Kas, penjualan, dan operasi dalam satu layar                                              | tayang         |
| 5   | LIN-03               | Bot layanan pelanggan 24 jam                          | Pertanyaan berulang dijawab dari data perusahaan dan sisanya diteruskan ke manusia                | Bot yang bekerja sendiri               |     | Pertanyaan berulang dijawab dari data perusahaan                                          | tayang         |
| 6   | LIN-08               | Workflow faktur, pembayaran, dan rekonsiliasi         | Uang masuk otomatis cocok dengan catatan                                                          | Alur kerja yang berjalan tanpa dikejar |     | Uang masuk cocok dengan catatan                                                           | tayang         |
| 7   | LIN-16               | Kanal jualan WhatsApp dengan katalog dan tautan bayar | Jualan di percakapan punya katalog dan pembayaran                                                 | Kanal pendapatan baru                  |     | Jualan di percakapan dengan katalog dan pembayaran                                        | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                | Alasan                                                                       |
| ------ | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| LIN-02 | Bot peringatan anomali                               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-04 | Bot penagihan dan pengingat jatuh tempo              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-05 | Bot penyaring lead dan penjadwal demo                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-06 | Bot notulen rapat dan tindak lanjut                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-09 | Pembacaan otomatis nota, faktur, dan KTP             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-10 | Bot pengingat kepatuhan pajak, izin, dan kontrak     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-11 | Workflow onboarding karyawan atau pelanggan          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-13 | Sinkron data antaraplikasi                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-14 | Bot survei dan umpan balik                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-15 | Tiket keluhan dengan batas waktu                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-18 | Buka aplikasi pelanggan bermerek                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-19 | Buka pendapatan berulang lewat langganan             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-20 | Bot penyusun draf konten dari data produk            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-21 | Agen AI untuk tugas terdefinisi (masih eksperimen)   | Tidak dipilih: masih eksperimen menurut katalog                              |
| LIN-22 | Buka jaringan reseller dan afiliasi berkomisi        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-23 | Bot penerima telepon                                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-24 | Workflow pembelian dari permintaan sampai pembayaran | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-25 | Workflow penawaran, persetujuan diskon, dan kontrak  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| LIN-26 | Migrasi dari Excel dan chat ke data rapi             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

## Konstruksi · Pemilik bangunan

### Rumah tinggal dan konsumen akhir (lapis 1)

> “Saya takut anggaran membengkak dan pekerjaan tidak diawasi.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 16 offer. Pintu masuk: **RMH-10**. Aturan: lolos.

| #   | ID                   | Judul untuk web                            | Dampak untuk web                                                              | Jenis                          | †   | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------ | --- | ---------------------------------------------------------- | -------------- |
| 1   | RMH-10 (pintu masuk) | RAB dan estimasi biaya sebelum membangun   | Anggaran dihitung dari gambar dan harga pasar sebelum Anda memutuskan         | Bagian proyek yang kami ambil  |     | “Saya takut anggaran membengkak”: angka sebelum memutuskan | tayang         |
| 2   | RMH-01               | Bangun rumah dari hulu ke hilir            | Rumah jadi sesuai anggaran dengan jadwal dan garansi yang tertulis            | Proyek utuh dari hulu ke hilir |     | Rumah pertama, dari hulu ke hilir, garansi tertulis        | tayang         |
| 3   | RMH-16               | Garansi dan perbaikan setelah serah terima | Cacat yang muncul setelah serah terima diperbaiki dalam masa garansi          | Perawatan berkala              |     | Sesudah serah terima: garansi                              | tayang         |
| 4   | RMH-09               | Pengawasan proyek pribadi                  | Ada pihak independen yang mengawasi mutu dan biaya atas nama pemilik          | Bagian proyek yang kami ambil  |     | “pekerjaan tidak diawasi”: pengawas atas nama pemilik      | tayang         |
| 5   | RMH-14               | Survei kondisi bangunan sebelum renovasi   | Retak, kebocoran, dan kerusakan tersembunyi terdata sebelum biaya dikeluarkan | Bagian proyek yang kami ambil  |     | Biaya tersembunyi terdata sebelum renovasi                 | tayang         |
| 6   | RMH-02               | Renovasi dengan estimasi terukur           | Biaya dan jadwal renovasi diketahui sebelum pekerjaan dimulai                 | Proyek utuh dari hulu ke hilir |     | Pemilik rumah lama: renovasi dengan estimasi               | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                           | Alasan                                                                                   |
| ------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| RMH-03 | Tambah lantai dengan pemeriksaan struktur       | Cadangan: bertanda †, rumusan aman sudah ada; pilih bila Anda ingin tambah lantai tampil |
| RMH-04 | Atap dan dak bebas bocor                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-05 | Air bersih dan sanitasi rumah                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-06 | Dapur dan kamar mandi baru                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-07 | Pagar, carport, dan halaman                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-08 | Ruko jadi dengan manajemen konstruksi           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-11 | Pendampingan persetujuan bangunan gedung        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-12 | Paket material rumah dengan pengiriman bertahap | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                                   |
| RMH-13 | Tukang dan mandor harian untuk pemilik          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |
| RMH-15 | Perbaikan cepat sesuai kondisi lapangan         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab             |

</details>

### Desain interior: teknis lapangan dan visualisasi (lapis 1)

> “Saya tahu ruangan yang saya mau, tetapi tidak bisa membayangkannya, dan tukang tidak paham maksud saya.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

5 dari 10 offer. Pintu masuk: **ITR-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                  | Dampak untuk web                                                          | Jenis                          | †   | Alasan                                            | Keputusan Anda |
| --- | -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------- | -------------- |
| 1   | ITR-01 (pintu masuk) | Analisis kebutuhan ruang                         | Kebutuhan, kebiasaan, dan batas anggaran dirumuskan sebelum gambar dibuat | Bagian proyek yang kami ambil  |     | Langkah terkecil: kebutuhan ruang dirumuskan dulu | tayang         |
| 2   | ITR-10               | Interior lengkap dari visual sampai serah terima | Satu pihak mengurus visual, gambar, pekerjaan, dan serah terima           | Proyek utuh dari hulu ke hilir |     | Satu pihak dari visual sampai serah terima        | tayang         |
| 3   | ITR-02               | Visualisasi tiga dimensi interior                | Ruangan terlihat jadi sebelum satu tukang pun dipanggil                   | Bagian proyek yang kami ambil  |     | “tidak bisa membayangkannya”                      | tayang         |
| 4   | ITR-04               | Gambar kerja interior untuk tukang               | Tukang bekerja dari gambar yang jelas ukuran dan detailnya                | Bagian proyek yang kami ambil  |     | “tukang tidak paham maksud saya”                  | tayang         |
| 5   | ITR-05               | RAB interior dari gambar                         | Biaya interior dihitung dari volume yang tergambar                        | Bagian proyek yang kami ambil  |     | Biaya interior dari gambar, bukan tebakan         | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                  | Alasan                                                                       |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| ITR-03 | Tiga pilihan gaya sebelum memutuskan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| ITR-06 | Pekerjaan teknis lapangan interior     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| ITR-07 | Kabinet dan furnitur custom            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| ITR-08 | Pencahayaan dan titik listrik interior | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| ITR-09 | Pengawasan finishing interior          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Halaman bab memuat kalimat wajib desain: visual adalah gambaran rencana, bukan jaminan hasil fisik.

### Konstruksi F&B (lapis 3)

> “Lokasinya sudah dapat, tetapi belum berbentuk kafe yang menarik dan alur dapurnya belum jalan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **FNB-06**. Aturan: lolos.

| #   | ID                   | Judul untuk web                          | Dampak untuk web                                                          | Jenis                          | †   | Alasan                                                                         | Keputusan Anda |
| --- | -------------------- | ---------------------------------------- | ------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------------------------------------ | -------------- |
| 1   | FNB-06 (pintu masuk) | Alur dapur yang mempercepat penyajian    | Posisi kompor, bar, dan pass-out mengurangi langkah dan waktu tunggu      | Bangunan yang lebih produktif  |     | “alur dapurnya belum jalan”: lingkup terkecil                                  | tayang         |
| 2   | FNB-01               | Kafe siap buka dari lokasi sewa          | Lokasi kosong menjadi kafe yang alur pelanggan dan dapurnya sudah bekerja | Proyek utuh dari hulu ke hilir |     | “Lokasinya sudah dapat”: kafe siap buka; jembatan ke Pesan dan bayar dari meja | tayang         |
| 3   | FNB-10               | Perawatan outlet berkala                 | Kerusakan kecil di outlet ditangani berkala, sebelum menjadi besar.       | Perawatan berkala              |     | Sesudah buka: perawatan outlet                                                 | tayang         |
| 4   | FNB-05               | Tata letak yang menambah kapasitas duduk | Tata letak meja dan sirkulasi memuat lebih banyak tamu tanpa terasa sesak | Bangunan yang lebih produktif  |     | Kafe yang menarik: kapasitas duduk                                             | tayang         |
| 5   | FNB-03               | Dapur produksi higienis                  | Alur bahan, olah, dan saji tidak bersilang dan mudah dibersihkan          | Proyek utuh dari hulu ke hilir |     | Katering dan produsen: dapur produksi                                          | tayang         |
| 6   | FNB-09               | Makeover kedai yang sudah berjalan       | Kedai lama tampil baru dengan waktu tutup yang sesingkat mungkin          | Bangunan yang lebih produktif  |     | Kedai lama yang sudah berjalan                                                 | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                     | Alasan                                                                       |
| ------ | ----------------------------------------- | ---------------------------------------------------------------------------- |
| FNB-02 | Fasad dan signage yang menarik dari jalan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FNB-04 | Area makan outdoor                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FNB-07 | Lantai, drainase, dan ventilasi dapur     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| FNB-08 | Desain gerai seragam untuk multi-outlet   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Studio streaming dan workshop media (lapis 3)

> “Siaran saya terganggu gema dan listrik, dan set saya berantakan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **STD-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                           | Dampak untuk web                                                | Jenis                          | †                                                        | Alasan                                                           | Keputusan Anda |
| --- | -------------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------- | -------------- |
| 1   | STD-03 (pintu masuk) | Pencahayaan set siaran                    | Wajah dan produk tampil jelas tanpa silau                       | Proyek utuh dari hulu ke hilir |                                                          | Langkah terkecil: pencahayaan set                                | tayang         |
| 2   | STD-04               | Backdrop dan set siaran                   | Latar siaran berkarakter dan mudah dibongkar atau diubah        | Bangunan yang lebih produktif  |                                                          | “set saya berantakan”                                            | tayang         |
| 3   | STD-01               | Ruang siaran kedap gema                   | Suara bersih tanpa gema dan gangguan dari luar                  | Proyek utuh dari hulu ke hilir |                                                          | “Siaran saya terganggu gema”                                     | tayang         |
| 4   | STD-09               | Makeover ruangan menjadi studio           | Ruangan biasa menjadi studio siap pakai tanpa merombak bangunan | Bangunan yang lebih produktif  |                                                          | Ruangan biasa jadi studio; jembatan ke Peekabo live              | tayang         |
| 5   | STD-02               | Kelistrikan stabil untuk perangkat siaran | Perangkat menyala stabil dan aman untuk pemakaian berjam-jam    | Proyek utuh dari hulu ke hilir | Instalasi listrik dikerjakan mitra instalatir berwenang. | “dan listrik”: bertanda †, dikerjakan mitra instalatir berwenang | tayang         |
| 6   | STD-08               | Studio podcast kecil                      | Ruang rekam sederhana dengan akustik yang terkendali            | Proyek utuh dari hulu ke hilir |                                                          | Podcaster                                                        | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                               | Alasan                                                                       |
| ------ | ----------------------------------- | ---------------------------------------------------------------------------- |
| STD-05 | Ruang multi-set untuk beberapa host | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STD-06 | Ruang produksi dan penyimpanan alat | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STD-07 | Meja kerja dan rak modular          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STD-10 | Studio yang bisa disewakan          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Makeover villa, kontrakan, hotel, dan hostel (lapis 3)

> “Properti saya kusam dan sulit disewakan dengan tarif yang pantas.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **HOS-09**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                | Dampak untuk web                                                              | Jenis                          | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------ | --- | ----------------------------------------------------- | -------------- |
| 1   | HOS-09 (pintu masuk) | Makeover cepat antarpenyewa                    | Unit dibenahi segera setelah penyewa pergi, sebelum penyewa berikutnya masuk. | Bangunan yang lebih produktif  |     | Langkah terkecil: unit dibenahi di antara dua penyewa | tayang         |
| 2   | HOS-05               | Kamar mandi dan sanitasi yang layak            | Kamar mandi bersih, kering, dan tahan lama                                    | Proyek utuh dari hulu ke hilir |     | Kamar mandi yang layak                                | tayang         |
| 3   | HOS-02               | Kontrakan siap sewa kembali                    | Kontrakan kusam dibenahi sampai layak disewakan kembali.                      | Bangunan yang lebih produktif  |     | “Properti saya kusam dan sulit disewakan”             | tayang         |
| 4   | HOS-07               | Atap dan lapisan kedap air untuk musim hujan   | Kebocoran tidak mengganggu tamu                                               | Proyek utuh dari hulu ke hilir |     | Kebocoran musim hujan yang mengganggu tamu            | tayang         |
| 5   | HOS-01               | Makeover villa yang siap difoto dan ditawarkan | Villa dibenahi sampai layak tampil di foto dan siap ditawarkan ulang.         | Bangunan yang lebih produktif  |     | Villa yang siap difoto dan ditawarkan                 | tayang         |
| 6   | HOS-10               | Bangun kos siap huni                           | Bangunan kos baru selesai dengan anggaran yang terkendali                     | Proyek utuh dari hulu ke hilir |     | Investor: kos baru                                    | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                 | Alasan                                                                       |
| ------ | ------------------------------------- | ---------------------------------------------------------------------------- |
| HOS-03 | Kamar hostel yang efisien             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| HOS-04 | Lobi dan area bersama yang meyakinkan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| HOS-06 | Fasad dan kesan pertama               | Tidak dipilih: dampaknya kata sifat (“menarik dari luar”)                    |
| HOS-08 | Taman dan area outdoor                | Tidak dipilih: “area luar menjadi nilai jual” tidak punya pegangan kerja     |

</details>

### Membership Care (lapis 4)

> “Properti saya cepat kusam karena tidak ada yang merawatnya secara rutin.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

5 dari 12 offer. Pintu masuk: **RWT-02**. Aturan: lolos.

| #   | ID                   | Judul untuk web                               | Dampak untuk web                                                     | Jenis             | †   | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | --------------------------------------------- | -------------------------------------------------------------------- | ----------------- | --- | ---------------------------------------------------------- | -------------- |
| 1   | RWT-02 (pintu masuk) | Inspeksi bulanan dengan laporan foto          | Kondisi bangunan terlihat tanpa Anda harus datang                    | Perawatan berkala |     | “tidak ada yang merawatnya secara rutin”: inspeksi bulanan | tayang         |
| 2   | RWT-04               | Perawatan atap dan talang sebelum musim hujan | Kebocoran dicegah sebelum terjadi                                    | Perawatan berkala |     | Kebocoran dicegah sebelum musim hujan                      | tayang         |
| 3   | RWT-10               | Laporan kondisi berkala                       | Data kondisi bangunan menjadi dasar keputusan perawatan dan renovasi | Perawatan berkala |     | Laporan kondisi yang bisa dibaca                           | tayang         |
| 4   | RWT-05               | Perawatan cat dan fasad berkala               | Bangunan tetap segar dan nilainya terjaga                            | Perawatan berkala |     | “cepat kusam”: cat dan fasad berkala                       | tayang         |
| 5   | RWT-03               | Tim siaga perbaikan darurat                   | Kerusakan mendadak ditangani dalam waktu yang disepakati             | Perawatan berkala |     | Kerusakan mendadak                                         | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                    | Alasan                                                                       |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| RWT-01 | Membership perawatan properti menyeluruh | Menunggu keputusan ekonomi Membership Care (D5)                              |
| RWT-06 | Perawatan taman dan area luar            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RWT-07 | Perawatan sanitasi dan saluran           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RWT-08 | Perawatan listrik ringan lewat mitra     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RWT-09 | Membership multi-properti                | Menunggu keputusan ekonomi Membership Care (D5)                              |
| RWT-11 | Membership untuk penginapan              | Membership penginapan ikut keputusan D5                                      |
| RWT-12 | Peremajaan tahunan                       | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                       |

</details>

Catatan: Bentuk hubungan kerja pekerja Membership Care belum diputuskan (keputusan lintas unit 3); halaman bab tidak menyebutnya.

### Nilai tambah lewat mitra (jembatan)

> “Saya butuh pembiayaan dan perlindungan untuk bangunan saya.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

3 dari 6 offer. Pintu masuk: **KOM-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                       | Dampak untuk web                                                               | Jenis                                | †                                                                         | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------- | -------------- |
| 1   | KOM-01 (pintu masuk) | Pembiayaan renovasi lewat mitra                       | Renovasi dibiayai lewat mitra pembiayaan dengan syarat yang dijelaskan terbuka | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | “Saya butuh pembiayaan”: renovasi lewat mitra berizin | tayang         |
| 2   | KOM-06               | Pembiayaan peralatan usaha lewat mitra                | Peralatan dapur atau studio dibiayai lewat mitra                               | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | Peralatan dapur atau studio lewat mitra               | tayang         |
| 3   | KOM-03               | Jual atau sewakan properti hasil makeover lewat mitra | Properti hasil makeover dipasarkan lewat mitra properti                        | Modal, alat, dan jaminan lewat mitra | Penjualan dan sewa dijalankan perantara properti berizin.                 | Properti hasil makeover lewat perantara berizin       | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                        | Alasan                                                              |
| ------ | -------------------------------------------- | ------------------------------------------------------------------- |
| KOM-02 | Asuransi bangunan lewat mitra                | Mitra asuransi belum ada (master brief, jalur komisi)               |
| KOM-04 | Penilaian nilai properti sebelum dan sesudah | “Kenaikan nilai terukur” adalah hasil pasar, bukan pekerjaan Arthur |
| KOM-05 | Sewa alat berat untuk kavling lewat mitra    | Mitra sewa alat berat belum ada                                     |

</details>

Catatan: Bab ini tepat tiga offer. Halaman memuat kalimat wajib pembiayaan dan pengungkapan komisi; mitra tidak disebut namanya. Bila Anda lebih suka menahan bab ini sampai kartu komisi ada, bab tampil sebagai situasi tanpa halaman.

## Konstruksi · Pelaku proyek

### Paket hulu-hilir untuk kontraktor utama

> “Paketnya sudah menang, tetapi saya belum punya subkon yang sanggup menangani semuanya dari hulu ke hilir.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 14 offer. Pintu masuk: **HHK-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                             | Dampak untuk web                                                                                                                  | Jenis                          | †   | Alasan                                                                              | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --- | ----------------------------------------------------------------------------------- | -------------- |
| 1   | HHK-03 (pintu masuk) | Subkontrak hulu-hilir: toilet dan sanitasi sekolah          | Toilet, air bersih, dan septic tank selesai sebagai satu paket yang fungsinya teruji sebelum serah terima                         | Proyek utuh dari hulu ke hilir |     | Lingkup terkecil: toilet dan sanitasi sekolah, fungsinya diuji sebelum serah terima | tayang         |
| 2   | HHK-01               | Subkontrak hulu-hilir: rehabilitasi ruang kelas             | Satu pintu untuk tenaga, material, alat, dan laporan sehingga ruang kelas rusak selesai tanpa Anda mengurus pemasok satu per satu | Proyek utuh dari hulu ke hilir |     | “belum punya subkon yang sanggup menangani semuanya”: rehabilitasi ruang kelas      | tayang         |
| 3   | HHK-04               | Subkontrak hulu-hilir: atap, plafon, dan drainase gedung    | Kebocoran dan genangan tertangani dalam satu lingkup, bukan tiga subkon yang saling menunggu                                      | Proyek utuh dari hulu ke hilir |     | Atap, plafon, dan drainase dalam satu lingkup, bukan tiga subkon                    | tayang         |
| 4   | HHK-07               | Subkontrak hulu-hilir: drainase, gorong-gorong, dan saluran | Saluran air selesai dengan galian, pasangan, dan penutup dalam satu jadwal                                                        | Proyek utuh dari hulu ke hilir |     | Drainase dan saluran                                                                | tayang         |
| 5   | HHK-06               | Subkontrak hulu-hilir: jalan lingkungan cor beton           | Pembesian, pengecoran, dan pengaturan area kerja ditangani satu tim                                                               | Proyek utuh dari hulu ke hilir |     | Jalan lingkungan cor beton                                                          | tayang         |
| 6   | HHK-14               | Subkontrak gabungan lintas pekerjaan                        | Beberapa jenis pekerjaan dalam satu kontrak subkon sehingga Anda hanya mengelola satu pihak                                       | Proyek utuh dari hulu ke hilir |     | Beberapa pekerjaan dalam satu kontrak subkon                                        | tayang         |
| 7   | HHK-11               | Subkontrak hulu-hilir: ruko dan bangunan komersial          | Ruko dan bangunan komersial swasta dikerjakan dari struktur sampai finishing                                                      | Proyek utuh dari hulu ke hilir |     | Proyek swasta: ruko dan bangunan komersial                                          | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                      | Alasan                                                                             |
| ------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| HHK-02 | Subkontrak hulu-hilir: pembangunan ruang kelas baru        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-05 | Subkontrak hulu-hilir: pagar, gapura, dan halaman          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-08 | Subkontrak hulu-hilir: talud dan pasangan batu             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-09 | Subkontrak hulu-hilir: kantor pelayanan dan balai warga    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-10 | Subkontrak hulu-hilir: lapangan dan fasilitas umum         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-12 | Subkontrak hulu-hilir: gudang dan bangunan industri ringan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab       |
| HHK-13 | Subkontrak paket besar lewat kerja sama operasi            | Cadangan: bertanda †, kerja sama operasi; pilih bila Anda ingin paket besar tampil |

</details>

Catatan: Urutan bab di halaman Pelaku proyek mengikuti D2: kontraktor utama lebih dulu, jadi bab ini dibuka pertama.

### Administrasi dengan pemerintah (modul A)

> “Dokumen menumpuk, tender terlewat, dan berkas termin selalu terlambat.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 15 offer. Pintu masuk: **ADM-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                     | Dampak untuk web                                                                                       | Jenis                          | †   | Alasan                                                           | Keputusan Anda |
| --- | -------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ | --- | ---------------------------------------------------------------- | -------------- |
| 1   | ADM-01 (pintu masuk) | Pemantauan paket tender regional                    | Paket baru di Subang, Purwakarta, dan Bandung terkumpul setiap minggu sehingga tidak ada yang terlewat | Bagian proyek yang kami ambil  |     | “tender terlewat”: paket di tiga wilayah terkumpul setiap minggu | tayang         |
| 2   | ADM-15               | Paket administrasi tender lengkap                   | Dari pemantauan sampai penawaran disiapkan satu tim sehingga Anda hanya memutuskan                     | Proyek utuh dari hulu ke hilir |     | Satu tim dari pemantauan sampai penawaran                        | tayang         |
| 3   | ADM-03               | Dokumen kualifikasi siap unggah                     | Berkas kualifikasi tersusun lengkap sebelum tenggat                                                    | Bagian proyek yang kami ambil  |     | “Dokumen menumpuk”: kualifikasi lengkap sebelum tenggat          | tayang         |
| 4   | ADM-12               | Berkas penagihan termin                             | Berkas penagihan termin disusun dan dijaga lengkap sampai diproses pemberi kerja.                      | Bagian proyek yang kami ambil  |     | “berkas termin selalu terlambat”                                 | tayang         |
| 5   | ADM-05               | Penawaran harga dengan RAB dan analisa harga satuan | Harga penawaran dihitung dari volume dan harga pasar yang bisa dipertanggungjawabkan                   | Bagian proyek yang kami ambil  |     | Harga penawaran dari volume dan harga pasar                      | tayang         |
| 6   | ADM-02               | Analisis kelayakan paket                            | Keputusan ikut atau lewati diambil dari syarat dan HPS, bukan dari firasat                             | Bagian proyek yang kami ambil  |     | Ikut atau lewati diputuskan dari syarat dan HPS                  | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                   | Alasan                                                                                      |
| ------ | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| ADM-04 | Dokumen teknis penawaran                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-06 | Pendampingan klarifikasi dan pembuktian | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-07 | Pendampingan sanggah                    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-08 | Pendampingan SBU dan SKK                | Tidak dipilih: bertanda †; sertifikasi lebih aman dibicarakan langsung daripada ditayangkan |
| ADM-09 | Pendampingan perizinan berusaha         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-10 | Pembaruan data penyedia tahunan         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-11 | Penyiapan dokumen kontrak dan adendum   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-13 | Dokumen serah terima pertama dan akhir  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |
| ADM-14 | Pendampingan pemeriksaan                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                |

</details>

Catatan: Halaman bab memuat kalimat wajib tender: kami membantu menyiapkan berkas dan memahami aturan, bukan mengatur hasil; nama dan sertifikat tidak dipinjamkan.

### Tenaga kerja (modul B)

> “Tukang tidak datang tepat waktu dan tidak ada yang mengendalikan mereka di lapangan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 14 offer. Pintu masuk: **TNK-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                 | Dampak untuk web                                                                       | Jenis                         | †                                                                                      | Alasan                                                  | Keputusan Anda |
| --- | -------------------- | ------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------- |
| 1   | TNK-01 (pintu masuk) | Tukang harian                   | Tukang batu, kayu, besi, atau cat datang sesuai jadwal                                 | Bagian proyek yang kami ambil |                                                                                        | “Tukang tidak datang tepat waktu”                       | tayang         |
| 2   | TNK-03               | Mandor pengendali tukang        | Tukang terkendali di lapangan setiap hari                                              | Bagian proyek yang kami ambil |                                                                                        | “tidak ada yang mengendalikan mereka di lapangan”       | tayang         |
| 3   | TNK-05               | Tim finishing                   | Cat, keramik, plafon, dan kusen selesai rapi oleh tim yang terbiasa                    | Bagian proyek yang kami ambil |                                                                                        | Tim finishing yang terbiasa                             | tayang         |
| 4   | TNK-12               | Penggajian tukang               | Absensi, rekap upah, dan pembayaran tukang berjalan tertib tanpa hitung manual         | Bagian proyek yang kami ambil |                                                                                        | Absensi dan upah tukang tertib                          | tayang         |
| 5   | TNK-14               | Tim siaga pekerjaan tambahan    | Kekurangan tenaga saat tenggat ketat ditutup tanpa merekrut tetap                      | Bagian proyek yang kami ambil |                                                                                        | Tenggat ketat tanpa merekrut tetap                      | tayang         |
| 6   | TNK-06               | Pelaksana dan pengawas lapangan | Pekerjaan dijalankan sesuai gambar dan spesifikasi oleh tenaga yang bekerja di lokasi. | Bagian proyek yang kami ambil | Tenaga ahli bekerja di lapangan proyek Anda; nama dan sertifikatnya tidak dipinjamkan. | Pelaksana di lokasi; bertanda †, nama tidak dipinjamkan | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                         | Alasan                                                                       |
| ------ | ----------------------------- | ---------------------------------------------------------------------------- |
| TNK-02 | Tukang las dan fabrikasi besi | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-04 | Borongan upah per pekerjaan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-07 | Petugas K3 lapangan           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-08 | Admin dan logistik lapangan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-09 | Tim survei dan pengukuran     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-10 | Operator alat                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-11 | Tim bongkar dan pembersihan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TNK-13 | Mobilisasi pekerja            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Material: harga dan penjadwalan (modul C)

> “Harga material bergeser, barang telat, dan jadwalnya tidak sinkron dengan pekerjaan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 14 offer. Pintu masuk: **MAT-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                   | Dampak untuk web                                                                     | Jenis                         | †   | Alasan                                                         | Keputusan Anda |
| --- | -------------------- | --------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------- | --- | -------------------------------------------------------------- | -------------- |
| 1   | MAT-01 (pintu masuk) | Daftar harga material regional    | Harga material di tiga wilayah diperbarui berkala sebagai pegangan RAB dan negosiasi | Bagian proyek yang kami ambil |     | “Harga material bergeser”: harga tiga wilayah sebagai pegangan | tayang         |
| 2   | MAT-04               | Pengadaan material harga jaringan | Material dibeli dengan harga jaringan pemasok                                        | Barang dan material           |     | Material dengan harga jaringan pemasok                         | tayang         |
| 3   | MAT-03               | Jadwal material per tahap         | Material tiba saat dibutuhkan, tidak terlalu cepat dan tidak terlambat               | Bagian proyek yang kami ambil |     | “jadwalnya tidak sinkron”: material per tahap                  | tayang         |
| 4   | MAT-08               | Pengiriman material ke lokasi     | Angkutan material sampai lokasi sesuai ritase                                        | Barang dan material           |     | “barang telat”: angkutan sampai lokasi                         | tayang         |
| 5   | MAT-14               | Perbandingan penawaran pemasok    | Tiga penawaran dibandingkan sebelum keputusan membeli                                | Bagian proyek yang kami ambil |     | Tiga penawaran dibandingkan sebelum membeli                    | tayang         |
| 6   | MAT-10               | Stok opname material lapangan     | Material masuk, terpakai, dan sisa tercatat                                          | Bagian proyek yang kami ambil |     | Material masuk, terpakai, dan sisa tercatat                    | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                           | Alasan                                                                       |
| ------ | ------------------------------- | ---------------------------------------------------------------------------- |
| MAT-02 | Kebutuhan material dari RAB     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-05 | Material curah                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-06 | Material pabrikasi              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-07 | Beton siap pakai                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-09 | Gudang material sementara       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-11 | Koordinasi uji mutu material    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-12 | Penjualan sisa material         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MAT-13 | Perabot dan perlengkapan gedung | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Modal kerja lewat penjembatanan (modul D)

> “Uang muka belum cair, material harus dibayar dulu, dan tagihan termin belum turun.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

5 dari 8 offer. Pintu masuk: **MOD-06**. Aturan: lolos.

| #   | ID                   | Judul untuk web                           | Dampak untuk web                                                                       | Jenis                                | †                                                                         | Alasan                                                        | Keputusan Anda |
| --- | -------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------- |
| 1   | MOD-06 (pintu masuk) | Rencana arus kas proyek                   | Kebutuhan kas dan jadwal termin terproyeksi sebelum kerja dimulai                      | Bagian proyek yang kami ambil        |                                                                           | Lingkup terkecil: kebutuhan kas dan jadwal termin terproyeksi | tayang         |
| 2   | MOD-01               | Tempo material                            | Material datang sekarang dan dibayar sesuai termin                                     | Modal, alat, dan jaminan lewat mitra |                                                                           | “material harus dibayar dulu”: tempo material                 | tayang         |
| 3   | MOD-04               | Pembiayaan tagihan termin lewat mitra     | Tagihan termin yang belum cair diajukan ke mitra pembiayaan untuk dibiayai lebih dulu. | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | “tagihan termin belum turun”: bertanda †, lewat mitra berizin | tayang         |
| 4   | MOD-03               | Pembiayaan proyek lewat mitra             | Kebutuhan alat atau proyek dihubungkan ke mitra pembiayaan                             | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | “Uang muka belum cair”: bertanda †, lewat mitra berizin       | tayang         |
| 5   | MOD-08               | Pembiayaan alat dan kendaraan lewat mitra | Alat dan kendaraan kerja dibiayai lewat mitra, sehingga kas proyek tidak tertahan.     | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | Alat dan kendaraan lewat mitra; bertanda †                    | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                 | Alasan                                                |
| ------ | ------------------------------------- | ----------------------------------------------------- |
| MOD-02 | Jaminan proyek lewat mitra penjamin   | Mitra penjamin belum ada (master brief, jalur komisi) |
| MOD-05 | Kerja sama operasi untuk proyek besar | Cadangan: kerja sama operasi bertanda †               |
| MOD-07 | Asuransi proyek lewat mitra           | Mitra asuransi belum ada                              |

</details>

Catatan: Mekanisme modal kerja belum diputuskan; bab ini ditulis sebagai penjembatanan lewat mitra, sesuai saran master brief. Halaman memuat kalimat wajib: kami tidak memberi pinjaman, pembiayaan dan jaminan berjalan lewat mitra berizin, dan komisi mitra diungkapkan.

### Alat dan peralatan (modul E)

> “Saya butuh alat hanya beberapa hari dan tidak mau membelinya.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

4 dari 6 offer. Pintu masuk: **ALT-02**. Aturan: lolos.

| #   | ID                   | Judul untuk web                         | Dampak untuk web                                                           | Jenis                          | †   | Alasan                                                                   | Keputusan Anda |
| --- | -------------------- | --------------------------------------- | -------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------------------------------ | -------------- |
| 1   | ALT-02 (pintu masuk) | Sewa peralatan ringan                   | Molen, stamper, dan perancah tersedia per hari                             | Bagian proyek yang kami ambil  |     | “Saya butuh alat hanya beberapa hari”: molen, stamper, perancah per hari | tayang         |
| 2   | ALT-04               | Paket alat siap kerja                   | Alat lengkap dengan operator dan BBM dalam satu harga harian               | Proyek utuh dari hulu ke hilir |     | Alat dengan operator dan BBM dalam satu harga harian                     | tayang         |
| 3   | ALT-03               | Mobilisasi alat                         | Alat diantar ke lokasi dan dijemput kembali sesuai jadwal yang disepakati. | Bagian proyek yang kami ambil  |     | Alat diantar dan dijemput sesuai jadwal                                  | tayang         |
| 4   | ALT-05               | Pemeriksaan kelaikan alat sebelum kerja | Alat diperiksa sebelum dipakai untuk mencegah henti kerja dan kecelakaan   | Bagian proyek yang kami ambil  |     | Alat diperiksa sebelum dipakai                                           | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                 | Alasan                                                             |
| ------ | ------------------------------------- | ------------------------------------------------------------------ |
| ALT-01 | Sewa alat berat lewat mitra           | Mitra sewa alat berat belum ada (master brief, jalur komisi)       |
| ALT-06 | Pemakaian alat bergantian antarproyek | Tidak dipilih: mengandaikan alat milik sendiri yang belum tercatat |

</details>

Catatan: Paket alat siap kerja ditulis tanpa alat berat sampai mitra sewa alat berat ada.

### Administrasi internal proyek (modul F)

> “Laporan lewat chat, kurva S tidak jelas, dan biaya lapangan tidak terpantau.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 15 offer. Pintu masuk: **PRJ-04**. Aturan: lolos.

| #   | ID                   | Judul untuk web                       | Dampak untuk web                                                                    | Jenis                         | †   | Alasan                                               | Keputusan Anda |
| --- | -------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------- | --- | ---------------------------------------------------- | -------------- |
| 1   | PRJ-04 (pintu masuk) | Dokumentasi foto progres              | Foto 0, 50, dan 100 persen tersusun rapi sebagai bukti                              | Bagian proyek yang kami ambil |     | Lingkup terkecil: foto progres 0, 50, dan 100 persen | tayang         |
| 2   | PRJ-03               | Laporan harian, mingguan, dan bulanan | Laporan disusun dalam format pemberi kerja, sesuai jadwal pelaporannya.             | Bagian proyek yang kami ambil |     | “Laporan lewat chat”: format pemberi kerja           | tayang         |
| 3   | PRJ-02               | Jadwal dan kurva S                    | Rencana dan kemajuan proyek terlihat setiap minggu                                  | Bagian proyek yang kami ambil |     | “kurva S tidak jelas”                                | tayang         |
| 4   | PRJ-07               | Pengendalian biaya proyek             | Anggaran dibandingkan realisasi setiap bulan                                        | Bagian proyek yang kami ambil |     | “biaya lapangan tidak terpantau”                     | tayang         |
| 5   | PRJ-05               | Perhitungan volume dan mutual check   | Opname volume untuk termin dan perubahan disepakati bersama                         | Bagian proyek yang kami ambil |     | Opname volume untuk termin                           | tayang         |
| 6   | PRJ-14               | Sistem laporan proyek digital         | Laporan lapangan dan dasbor progres berjalan dari ponsel, dikerjakan unit teknologi | Bagian proyek yang kami ambil |     | Laporan dari ponsel; jembatan ke unit Teknologi      | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                             | Alasan                                                                       |
| ------ | --------------------------------- | ---------------------------------------------------------------------------- |
| PRJ-01 | RAB pelaksanaan                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-06 | Gambar kerja dan gambar terpasang | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-08 | Buku kas proyek                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-09 | Kontrak subkon dan SPK tukang     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-10 | Pengelolaan perubahan pekerjaan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-11 | Dokumen keselamatan kerja         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-12 | Rapat koordinasi dan notulen      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-13 | Uji fungsi sebelum serah terima   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRJ-15 | Arsip dokumen proyek digital      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Konsultan pengadaan untuk penyedia barang (modul G)

> “Saya penyedia, tetapi bingung mencari barang dengan margin sehat dan mengurus TKDN.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 13 offer. Pintu masuk: **PNY-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                        | Dampak untuk web                                                               | Jenis                         | †                                                              | Alasan                                                 | Keputusan Anda |
| --- | -------------------- | -------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ | -------------- |
| 1   | PNY-01 (pintu masuk) | Riset sumber barang                    | Pemasok dan produsen dengan harga pembanding ditemukan sebelum Anda menawar    | Bagian proyek yang kami ambil |                                                                | “bingung mencari barang”: sumber dan harga pembanding  | tayang         |
| 2   | PNY-02               | Produksi barang lewat mitra            | Barang diproduksi sesuai spesifikasi dengan margin yang terjaga dari efisiensi | Barang dan material           |                                                                | Barang diproduksi lewat mitra sesuai spesifikasi       | tayang         |
| 3   | PNY-07               | Pendampingan TKDN                      | Pengajuan sertifikat tingkat komponen dalam negeri terarah                     | Bagian proyek yang kami ambil |                                                                | “mengurus TKDN”                                        | tayang         |
| 4   | PNY-12               | Analisis margin per barang             | Margin dihitung dari harga sumber, ongkos, dan risiko sebelum menawar.         | Bagian proyek yang kami ambil | Keuntungan dalam HPS dijaga wajar dan dapat diperiksa auditor. | “margin sehat”: bertanda †, keuntungan wajar dalam HPS | tayang         |
| 5   | PNY-08               | Pengelolaan etalase katalog elektronik | Produk tayang dengan harga yang terus diperbarui                               | Bagian proyek yang kami ambil |                                                                | Etalase katalog elektronik terurus                     | tayang         |
| 6   | PNY-03               | Pengendalian mutu sebelum kirim        | Barang diperiksa sebelum diserahkan                                            | Bagian proyek yang kami ambil |                                                                | Barang diperiksa sebelum dikirim                       | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                            | Alasan                                                                       |
| ------ | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| PNY-04 | Pengemasan dan pelabelan                         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-05 | Pengiriman ke instansi                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-06 | Dokumen spesifikasi dan kesesuaian               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-09 | Pendampingan e-purchasing dan pengadaan langsung | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-10 | Garansi dan purna jual barang                    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-11 | Berkas penagihan barang                          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PNY-13 | Konsultasi peran penyedia atau konsultan         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Konsultan pengadaan hanya melayani paket yang bukan milik Arthur (Konstruksi aturan 3); halaman menyebutnya.

### Arthur sebagai penyedia untuk instansi (modul G)

> “Kami butuh barang sesuai spesifikasi, tepat waktu, dan dengan dokumen lengkap.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 8 offer. Pintu masuk: **GOV-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                    | Dampak untuk web                                                            | Jenis                          | †   | Alasan                                                 | Keputusan Anda |
| --- | -------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------------ | -------------- |
| 1   | GOV-03 (pintu masuk) | Pengadaan papan nama, signage, dan papan informasi | Papan dan penanda dibuat sesuai ukuran dan spesifikasi                      | Barang dan material            |     | Lingkup terkecil: papan nama dan signage               | tayang         |
| 2   | GOV-07               | Paket barang dan pemasangan                        | Barang datang bersama pemasangan sehingga instansi menerima yang siap pakai | Proyek utuh dari hulu ke hilir |     | “barang sesuai spesifikasi”: datang bersama pemasangan | tayang         |
| 3   | GOV-01               | Pengadaan perabot sekolah                          | Meja, kursi, dan lemari diadakan sesuai spesifikasi dan jadwal pengadaan.   | Barang dan material            |     | Perabot sekolah                                        | tayang         |
| 4   | GOV-02               | Pengadaan perabot dan perlengkapan kantor          | Perabot kantor dan ruang pelayanan sesuai spesifikasi                       | Barang dan material            |     | Perabot dan perlengkapan kantor                        | tayang         |
| 5   | GOV-06               | Pengadaan lewat e-purchasing                       | Barang tayang di etalase dan dipesan instansi secara langsung               | Barang dan material            |     | Dipesan langsung lewat e-purchasing                    | tayang         |
| 6   | GOV-08               | Purna jual dan garansi untuk instansi              | Klaim garansi ditangani sehingga barang tidak menganggur                    | Barang dan material            |     | Klaim garansi ditangani                                | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                      | Alasan                                                                       |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| GOV-04 | Pengadaan material paket kecil             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| GOV-05 | Pengadaan seragam dan perlengkapan petugas | Mitra konveksi belum ada (master brief, jalur komisi)                        |

</details>

### Developer perumahan (modul H)

> “Unit selesai tetapi finishing telat, komplain menumpuk, dan laporan untuk bank belum siap.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **DEV-05**. Aturan: lolos.

| #   | ID                   | Judul untuk web                     | Dampak untuk web                                                        | Jenis                          | †   | Alasan                                                          | Keputusan Anda |
| --- | -------------------- | ----------------------------------- | ----------------------------------------------------------------------- | ------------------------------ | --- | --------------------------------------------------------------- | -------------- |
| 1   | DEV-05 (pintu masuk) | Pemeriksaan sebelum serah terima    | Daftar periksa dan perbaikan tiap unit sebelum diserahkan               | Bagian proyek yang kami ambil  |     | Lingkup terkecil: daftar periksa tiap unit sebelum serah terima | tayang         |
| 2   | DEV-02               | Finishing per unit                  | Unit sampai siap serah terima dengan finishing rapi                     | Proyek utuh dari hulu ke hilir |     | “finishing telat”                                               | tayang         |
| 3   | DEV-07               | Pemeliharaan kawasan masa jaminan   | Kawasan dirawat sampai diserahkan ke pengelola                          | Perawatan berkala              |     | Kawasan dirawat sampai diserahkan ke pengelola                  | tayang         |
| 4   | DEV-06               | Perbaikan komplain pembeli          | Cacat yang dilaporkan pembeli diperbaiki cepat                          | Bagian proyek yang kami ambil  |     | “komplain menumpuk”                                             | tayang         |
| 5   | DEV-09               | Laporan progres untuk pencairan KPR | Laporan per unit tersusun untuk bank pemberi KPR                        | Bagian proyek yang kami ambil  |     | “laporan untuk bank belum siap”                                 | tayang         |
| 6   | DEV-01               | Borongan per unit rumah             | Tenaga dan material per tipe unit dengan harga per unit yang disepakati | Proyek utuh dari hulu ke hilir |     | Borongan per unit dengan harga yang disepakati                  | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                         | Alasan                                                                       |
| ------ | --------------------------------------------- | ---------------------------------------------------------------------------- |
| DEV-03 | Rumah contoh                                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DEV-04 | Prasarana perumahan                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DEV-08 | Pendampingan PBG                              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| DEV-10 | Pembersihan lahan dan pekerjaan tanah kavling | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Kontraktor swasta (lapis 2)

> “Proyek swasta saya kekurangan tenaga dan material tepat waktu.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 8 offer. Pintu masuk: **KSW-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                             | Dampak untuk web                                      | Jenis                                | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ------------------------------------------- | ----------------------------------------------------- | ------------------------------------ | --- | ----------------------------------------------------- | -------------- |
| 1   | KSW-01 (pintu masuk) | Tim tukang dan mandor untuk proyek renovasi | Tenaga renovasi tersedia dengan pengendali lapangan   | Bagian proyek yang kami ambil        |     | “kekurangan tenaga”: tukang dan mandor untuk renovasi | tayang         |
| 2   | KSW-02               | Material tepat waktu untuk proyek bertahap  | Material dijadwalkan per tahap dan dikirim ke lokasi  | Barang dan material                  |     | “material tepat waktu”                                | tayang         |
| 3   | KSW-04               | Paket finishing untuk proyek klien Anda     | Tim finishing dan material finishing dalam satu paket | Proyek utuh dari hulu ke hilir       |     | Finishing dan materialnya dalam satu paket            | tayang         |
| 4   | KSW-03               | Modal kerja lewat tempo material            | Proyek berjalan tanpa menahan kas                     | Modal, alat, dan jaminan lewat mitra |     | Tempo material lewat mitra                            | tayang         |
| 5   | KSW-08               | Pengawasan mutu untuk proyek Anda           | Mutu pekerjaan tukang diawasi sebelum serah terima    | Bagian proyek yang kami ambil        |     | Mutu diawasi sebelum serah terima                     | tayang         |
| 6   | KSW-06               | RAB dan jadwal untuk penawaran swasta       | Penawaran ke klien swasta dilengkapi RAB dan jadwal   | Bagian proyek yang kami ambil        |     | RAB dan jadwal untuk penawaran ke klien               | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                  | Alasan                                                                       |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| KSW-05 | Alat siap kerja untuk proyek swasta    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| KSW-07 | Cadangan kapasitas untuk proyek swasta | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Paket rakitan menurut profil pembeli

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 17 offer. Pintu masuk: **RAK-09**. Aturan: lolos.

| #   | ID                   | Judul untuk web                | Dampak untuk web                                                                          | Jenis                                            | †   | Alasan                                                             | Keputusan Anda |
| --- | -------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------ | --- | ------------------------------------------------------------------ | -------------- |
| 1   | RAK-09 (pintu masuk) | Paket Tenaga Siaga             | Tenaga terkendali dan terbayar tertib                                                     | Paket yang disusun menurut posisi Anda di proyek |     | Lingkup terkecil: tenaga terkendali dan terbayar tertib            | tayang         |
| 2   | RAK-01               | Paket Tender Pertama           | Proyek pertama berjalan tertib dari kontrak sampai laporan                                | Paket yang disusun menurut posisi Anda di proyek |     | Kontraktor utama dengan tender pertama                             | tayang         |
| 3   | RAK-03               | Paket Termin Lancar            | Opname dan berkas termin disiapkan sebelum termin diajukan.                               | Paket yang disusun menurut posisi Anda di proyek |     | Termin tertunda karena berkas; contoh kalibrasi yang sudah ditulis | tayang         |
| 4   | RAK-08               | Paket Subkon Lepas Landas      | Pekerjaan pertama selesai tanpa kas terkuras                                              | Paket yang disusun menurut posisi Anda di proyek |     | Subkon baru                                                        | tayang         |
| 5   | RAK-10               | Paket Harga Material Terpegang | Pembelian material berdasar harga yang dipantau                                           | Paket yang disusun menurut posisi Anda di proyek |     | Harga material yang terus bergeser                                 | tayang         |
| 6   | RAK-16               | Paket Serah Terima Unit        | Setiap unit diperiksa dan dirapikan, dan keluhan pembeli diperbaiki sebelum serah terima. | Paket yang disusun menurut posisi Anda di proyek |     | Developer menjelang serah terima unit                              | tayang         |
| 7   | RAK-12               | Paket Etalase Siap             | Produk tayang dengan dokumen pendukung                                                    | Paket yang disusun menurut posisi Anda di proyek |     | Penyedia baru di katalog elektronik                                | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                          | Alasan                                                                       |
| ------ | ------------------------------ | ---------------------------------------------------------------------------- |
| RAK-02 | Paket Multi-Proyek             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-04 | Paket Serah Terima Mulus       | Tidak dipilih: dampak “tanpa temuan berulang” ada di tangan pemeriksa        |
| RAK-05 | Paket Siap Pemeriksaan         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-06 | Paket Tender Ramai             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-07 | Paket Modal Berjalan           | Menunggu keputusan mekanisme modal kerja                                     |
| RAK-11 | Paket Administrasi Ringan      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-13 | Paket Mutu Terjaga             | Tidak dipilih: dampak “tanpa retur” ada di tangan instansi                   |
| RAK-14 | Paket Sumber Barang dan Margin | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-15 | Paket Kawasan Perdana          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| RAK-17 | Paket Renovasi Berjalan        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Tujuh paket mewakili tujuh posisi pembeli; paket lain tetap bisa dirakit lewat percakapan.

## Peekabo · Pemilik usaha

### Agency marketing (MKT)

> “Produk saya bagus, tapi yang tahu cuma itu-itu saja.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 29 offer. Pintu masuk: **1A-01**. Aturan: lolos.

| #   | ID                  | Judul untuk web                                       | Dampak untuk web                                                                                      | Jenis                     | †   | Alasan                                                                           | Keputusan Anda |
| --- | ------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------- | --- | -------------------------------------------------------------------------------- | -------------- |
| 1   | 1A-01 (pintu masuk) | Sesi strategi ads: teori dan penerapan pemasarannya   | Anda tahu platform, sasaran, dan pesan mana yang layak dibiayai sebelum uang iklan keluar             | Arah, strategi, dan kelas |     | Anak tangga 1: sesi strategi sebelum uang iklan keluar (asal A)                  | tayang         |
| 2   | 1A-05               | Pendampingan ads bulanan                              | Tim Anda tetap memegang akun, sementara kami mengarahkan dan memeriksa hasilnya setiap bulan          | Dikelola setiap bulan     |     | Tim Anda memegang akun, kami mengarahkan setiap bulan (asal T)                   | tayang         |
| 3   | 2B-02               | Peluncuran produk atau brand lokal                    | Produk baru dikenal di wilayah sasaran sejak minggu pertama, lewat online dan lapangan sekaligus      | Kampanye berbatas waktu   |     | “yang tahu cuma itu-itu saja”: peluncuran online dan lapangan sekaligus (asal T) | tayang         |
| 4   | 3A-02               | Pasokan creator dan influencer untuk kolaborasi brand | Anda mendapat kreator yang cocok dengan audiens Anda tanpa mencari satu per satu                      | Kreator, host, dan sales  |     | Kreator yang cocok dengan audiens Anda (asal A)                                  | tayang         |
| 5   | 1A-02               | Audit akun iklan dan struktur kampanye                | Kebocoran anggaran, sasaran yang tumpang tindih, dan pelacakan yang putus terlihat dalam satu laporan | Arah, strategi, dan kelas |     | Kebocoran anggaran iklan terlihat dalam satu laporan (asal T)                    | tayang         |
| 6   | 2B-03               | Pembukaan cabang atau gerai                           | Warga sekitar diundang lebih dulu, sebelum gerai baru dibuka.                                         | Kampanye berbatas waktu   |     | Pembukaan gerai; jembatan ke rangkaian kafe baru (asal T)                        | tayang         |
| 7   | MKT-01              | Manajemen media sosial                                | Akun aktif dan konsisten setiap minggu tanpa Anda memikirkan apa yang diunggah                        | Dikelola setiap bulan     |     | Akun aktif setiap minggu (tercatat di riset)                                     | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                    | Alasan                                                                       |
| ------ | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1A-03  | Rencana funnel dan pembagian anggaran                    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 1A-06  | Review independen atas kinerja agensi lain               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 1A-08  | Pelaksanaan iklan                                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 1A-09  | Pelacakan dan analitik iklan                             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 2A-05  | Penjemputan peserta lewat sosial media dan ads           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 2A-09  | Laporan dampak: jangkauan, kunjungan, leads              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 2B-04  | Kampanye musiman                                         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 2B-07  | Kampanye publik: instansi, desa wisata, CSR              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 3A-07  | Program seeding: produk ke kreator terpilih              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 3A-10  | Kampanye multi-creator                                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-02 | Manajemen toko marketplace                               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-03 | SEO berlangganan                                         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-04 | Optimasi konversi                                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-05 | Eksekutif pemasaran paruh waktu                          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-06 | Sprint pertumbuhan 90 hari                               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-07 | Retargeting dan pesan pelanggan lewat WhatsApp dan email | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-08 | Manajemen reputasi: ulasan dan profil peta               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-09 | Kampanye promo marketplace musiman                       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-10 | Lead generation berbasis hasil                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-11 | Laporan dan dasbor pemasaran bulanan                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-12 | Paket pemasaran wilayah Subang, Purwakarta, Bandung      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| MKT-13 | Paket pemasaran per industri klien                       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

Catatan: Halaman tidak menjanjikan jangkauan atau penjualan; yang ditulis adalah pekerjaannya (Aturan isi 3).

### Produksi kreatif (PRD)

> “Kontennya harus keluar setiap minggu, tapi tidak ada yang membuatnya.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 23 offer. Pintu masuk: **1B-04**. Aturan: lolos.

| #   | ID                  | Judul untuk web                                      | Dampak untuk web                                                                                                 | Jenis                 | †   | Alasan                                                                                   | Keputusan Anda |
| --- | ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------- | --- | ---------------------------------------------------------------------------------------- | -------------- |
| 1   | 1B-04 (pintu masuk) | Foto produk dan lifestyle (02.B)                     | Produk tampil layak jual di etalase, iklan, dan katalog                                                          | Konten dan aset jadi  |     | Lingkup terkecil: foto produk dan lifestyle (asal A)                                     | tayang         |
| 2   | 1B-12               | Produksi berlangganan dengan kuota bulanan           | Kuota konten setiap bulan dengan antrean prioritas, tanpa negosiasi ulang per proyek                             | Dikelola setiap bulan |     | “Kontennya harus keluar setiap minggu”: kuota konten bulanan                             | tayang         |
| 3   | 1B-07               | Animasi 2D dan mograph (02.C)                        | Produk atau layanan yang sulit difoto dijelaskan lewat animasi singkat                                           | Konten dan aset jadi  |     | Produk yang sulit difoto dijelaskan lewat animasi (asal A)                               | tayang         |
| 4   | 1B-05               | Cinematic shoot dan brand film (02.B)                | Cerita brand dalam film pendek yang membuat orang percaya sebelum membeli                                        | Konten dan aset jadi  |     | Cerita brand dalam film pendek (asal A)                                                  | tayang         |
| 5   | PRD-01              | Hari produksi massal: satu hari syuting, banyak aset | Satu hari syuting menghasilkan stok konten untuk sebulan                                                         | Konten dan aset jadi  |     | “tidak ada yang membuatnya”: satu hari syuting untuk stok sebulan, sesuai header Peekabo | tayang         |
| 6   | 1B-09               | Paket aset per kampanye                              | Semua aset satu kampanye datang sekaligus dalam ukuran setiap platform                                           | Konten dan aset jadi  |     | Semua aset satu kampanye sekaligus (asal T)                                              | tayang         |
| 7   | 1B-03               | Seri konten berbasis isu                             | Konten yang menunggangi isu yang sedang dibicarakan keluar berseri, sehingga audiens menunggu episode berikutnya | Konten dan aset jadi  |     | Seri konten berbasis isu (asal T)                                                        | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                             | Alasan                                                                       |
| ------ | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1B-06  | Dokumentasi event dan lokasi                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 1B-08  | Animasi dan visual 3D (02.C)                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 1B-10  | Varian kreatif untuk uji A/B                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 1B-11  | Perpustakaan aset berlisensi                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 2A-08  | Konten event untuk lapis 1                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-02 | Video produk dan iklan pendek                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-03 | Foto makanan dan minuman                          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-04 | Foto dan video properti, interior, dan eksterior  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-05 | Produksi podcast dan siaran multi-kamera          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-06 | Pasca-produksi white-label untuk agensi lain      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-07 | Adaptasi per platform: ukuran, potongan, subtitel | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-08 | Sistem desain dan template sosial                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-09 | Brand kit dan identitas visual                    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-10 | Suara: voice-over, jingle, desain suara           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-11 | Konten berbahasa Sunda dan lokal                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| PRD-12 | Sewa studio dan kru per hari                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Agency solusi kreatif (SOL)

> “Saya tidak tahu harus bilang apa supaya orang peduli.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 18 offer. Pintu masuk: **1B-01**. Aturan: lolos.

| #   | ID                  | Judul untuk web                                      | Dampak untuk web                                                                   | Jenis                     | †   | Alasan                                                                | Keputusan Anda |
| --- | ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------- | --- | --------------------------------------------------------------------- | -------------- |
| 1   | 1B-01 (pintu masuk) | Workshop isu dan framing video (02.A)                | Anda pulang membawa isu dan sudut cerita yang menaikkan perhatian, siap diproduksi | Arah, strategi, dan kelas |     | “Saya tidak tahu harus bilang apa”: workshop isu dan framing (asal A) | tayang         |
| 2   | SOL-12              | Creative direction berlangganan                      | Arah kreatif dijaga setiap bulan agar semua konten tetap satu suara                | Dikelola setiap bulan     |     | Arah kreatif dijaga setiap bulan                                      | tayang         |
| 3   | 2A-01               | Workshop konsep kampanye                             | Konsep kampanye lapangan disepakati sebelum anggaran keluar                        | Arah, strategi, dan kelas |     | Konsep kampanye lapangan disepakati sebelum anggaran keluar (asal A)  | tayang         |
| 4   | 1B-02               | Naskah dan hook video pendek                         | Detik pertama video menahan jempol orang                                           | Arah, strategi, dan kelas |     | Naskah dan hook video pendek (asal T)                                 | tayang         |
| 5   | SOL-04              | Workshop positioning dan pesan inti                  | Satu kalimat posisi dan tiga pesan inti yang dipakai seluruh tim                   | Arah, strategi, dan kelas |     | “supaya orang peduli”: satu kalimat posisi dan tiga pesan inti        | tayang         |
| 6   | SOL-02              | Riset audiens ringan: social listening dan wawancara | Anda tahu bahasa, keluhan, dan alasan beli audiens dari mulut mereka sendiri       | Arah, strategi, dan kelas |     | Bahasa dan alasan beli audiens dari mulut mereka sendiri              | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                 | Alasan                                                                       |
| ------ | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| 2A-04  | Desain mekanik partisipasi: aturan, rute, pos, hadiah | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-01 | Pemetaan isu dan sudut                                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-03 | Audit citra brand: persepsi dibanding identitas       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-05 | Big idea kampanye                                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-06 | Naming, tagline, dan narasi brand                     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-07 | Pilar konten dan kerangka cerita                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-08 | Konsep acara bermerek berseri (branded show)          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-09 | Konsep produk atau layanan baru                       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-10 | Uji konsep cepat dengan audiens kecil                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-11 | Creative brief dan panduan merek siap eksekusi        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-13 | Sprint kreatif lima hari                              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| SOL-14 | Lisensi kerangka framing isu                          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Operator SaaS niche (OPS)

> “Saya sudah coba aplikasinya, tapi tidak ada yang menjalankan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

**Bab ditahan utuh.** Kelima belas offer bab ini menunggu keputusan SaaS pertama dan niche pertama (master brief, keputusan per unit Agency). Bab ini tampil di halaman sisi sebagai situasi tanpa halaman, dengan tautan ke Kontak.

0 dari 15 offer. Aturan: lolos.

| #   | ID  | Judul untuk web | Dampak untuk web | Jenis | †   | Alasan | Keputusan Anda |
| --- | --- | --------------- | ---------------- | ----- | --- | ------ | -------------- |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                             | Alasan                                                          |
| ------ | ------------------------------------------------- | --------------------------------------------------------------- |
| OPS-01 | Leads dibalas dan ditindaklanjuti lewat WhatsApp  | Menunggu keputusan SaaS pertama dan niche pertama               |
| OPS-02 | CRM dan funnel bermerek Peekabo untuk UMKM        | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-03 | Pengingat dan pesan untuk pelanggan lama          | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-04 | Permintaan ulasan otomatis setelah transaksi      | Menunggu keputusan SaaS pertama; contoh kalibrasi sudah ditulis |
| OPS-05 | Program referral dan afiliasi untuk brand klien   | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-06 | Program poin dan membership untuk pelanggan klien | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-07 | Event hunting berbasis aplikasi misi              | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-08 | Siaran live serentak di beberapa platform         | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-09 | Mekari Qontak lewat reseller resmi plus penerapan | Menunggu keputusan SaaS pertama; nama alat belum boleh tampil   |
| OPS-10 | Toko di beberapa marketplace dari satu dasbor     | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-11 | Paket operator dealer dan showroom                | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-12 | Paket operator properti dan developer             | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-13 | Paket operator klinik, salon, dan bengkel         | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |
| OPS-14 | Paket operator F&B                                | Menunggu keputusan SaaS pertama                                 |
| OPS-15 | Paket operator kursus dan sekolah                 | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini          |

</details>

### Live commerce untuk brand (LIV)

> “Live itu laku, tapi saya tidak punya host dan tidak sanggup siaran setiap hari.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 10 offer. Pintu masuk: **LIV-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                          | Dampak untuk web                                                                                   | Jenis                     | †   | Alasan                                                                         | Keputusan Anda |
| --- | -------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------- | --- | ------------------------------------------------------------------------------ | -------------- |
| 1   | LIV-01 (pintu masuk) | Live per jam dengan host dan operator    | Anda mencoba live tanpa kontrak panjang, dibayar per jam siaran                                    | Kreator, host, dan sales  |     | “tidak sanggup siaran setiap hari”: coba live per jam tanpa kontrak panjang    | tayang         |
| 2   | LIV-02               | Paket live bulanan 2, 4, atau 8 jam      | Siaran rutin setiap hari dengan jadwal tetap dan laporan bulanan                                   | Dikelola setiap bulan     |     | Siaran rutin dengan jadwal tetap                                               | tayang         |
| 3   | LIV-05               | Siapkan studio live di lokasi Anda       | Sudut siaran dengan cahaya, suara, dan latar yang siap dipakai setiap hari                         | Konten dan aset jadi      |     | “tidak punya host”: sudut siaran di lokasi Anda; jembatan ke studio Konstruksi | tayang         |
| 4   | LIV-06               | Audit live dan coaching host internal    | Host Anda sendiri dinilai dari rekaman, lalu dilatih memperbaiki pembuka, penawaran, dan penutupan | Arah, strategi, dan kelas |     | Host Anda sendiri dilatih dari rekaman                                         | tayang         |
| 5   | LIV-09               | Live untuk peluncuran dan tanggal kembar | Siaran khusus di momen besar dengan host tambahan, promo, dan iklan siaran                         | Kampanye berbatas waktu   |     | Siaran khusus di momen besar                                                   | tayang         |
| 6   | LIV-04               | Live dengan bagi hasil penjualan         | Biaya dasar lebih rendah, sisanya dibayar dari penjualan selama live                               | Dikelola setiap bulan     |     | Biaya dasar lebih rendah, sisanya dari penjualan selama live                   | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                    | Alasan                                                                               |
| ------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 3A-05  | Operasi live commerce: host, studio, siaran              | Cadangan: bertanda †, operasi live lengkap; pilih bila Anda ingin paket penuh tampil |
| LIV-03 | Live bergilir sampai 24 jam                              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab         |
| LIV-07 | Kampanye kreator afiliasi lewat program partner platform | Ditahan: nilainya adalah status program partner platform yang belum terdaftar        |
| LIV-08 | Konten pendek dari rekaman live                          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab         |

</details>

Catatan: Urutan bab TAL, KRE, dan LIV menunggu keputusan industri keempat dan kelima; daftar ini tidak bergantung padanya.

### Experiential dan event (EVT)

> “Saya ingin warga datang, mencoba, lalu bercerita.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

5 dari 8 offer. Pintu masuk: **2A-06**. Aturan: lolos.

| #   | ID                  | Judul untuk web                                 | Dampak untuk web                                                                                      | Jenis                   | †                                                                                       | Alasan                                                             | Keputusan Anda |
| --- | ------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------- |
| 1   | 2B-01               | Event hunting kota                              | Warga berburu pos di kota, pos diumumkan lewat media sosial dan ads, dan brand Anda menjadi tujuannya | Kampanye berbatas waktu | Lomba berbasis kemampuan, bukan undian; izin keramaian dan lokasi diurus sebelum acara. | “Saya ingin warga datang”: event hunting kota, bertanda † (asal A) | tayang         |
| 2   | 2B-05               | Roadshow dan sampling keliling                  | Produk dibawa ke banyak titik dalam satu rute                                                         | Kampanye berbatas waktu |                                                                                         | Produk dibawa ke banyak titik dalam satu rute (asal T)             | tayang         |
| 3   | 2B-06               | Event komunitas dan temu pelanggan              | Pelanggan bertemu langsung dan merasa menjadi bagian dari brand                                       | Kampanye berbatas waktu |                                                                                         | “lalu bercerita”: temu pelanggan dan komunitas (asal T)            | tayang         |
| 4   | 2A-06 (pintu masuk) | Aktivasi di lokasi mitra: booth, sampling, demo | Produk dicoba langsung di tempat orang sudah berkumpul                                                | Kampanye berbatas waktu |                                                                                         | Lingkup terkecil: booth dan sampling di lokasi mitra               | tayang         |
| 5   | 2A-07               | Logistik dan perlengkapan event                 | Perlengkapan, izin lokasi, dan alur peserta diurus oleh tim kami.                                     | Kampanye berbatas waktu | Izin keramaian dan keselamatan peserta dipenuhi sebelum acara.                          | Perlengkapan, izin lokasi, dan alur peserta; bertanda †            | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID    | Judul                                       | Alasan                                                                                 |
| ----- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| 2B-08 | Hunt bersponsor multi-brand                 | Tidak dipilih: data peserta dibagikan ke sponsor; lebih aman lewat percakapan (UU PDP) |
| 2B-09 | Seri tiga kota: Subang, Purwakarta, Bandung | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab           |
| 2B-10 | Format event berlisensi untuk kota lain     | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                                 |

</details>

### Talenta dan kreator untuk brand (TAL)

> “Saya butuh orang yang bisa membawakan produk saya, bukan sekadar pengikut banyak.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

5 dari 5 offer. Pintu masuk: **2A-03**. Aturan: lolos.

| #   | ID                  | Judul untuk web                                      | Dampak untuk web                                                              | Jenis                    | †                                                        | Alasan                                                                         | Keputusan Anda |
| --- | ------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------- |
| 1   | 2A-03 (pintu masuk) | Campaign talent: promotor, ambassador, host          | Wajah brand di lapangan yang terlatih membawakan produk Anda                  | Kreator, host, dan sales |                                                          | “orang yang bisa membawakan produk saya”: promotor dan host terlatih (asal A)  | tayang         |
| 2   | 3A-06               | Pool UGC: video kreator per unit                     | Video ulasan dari banyak kreator, dibayar per video                           | Konten dan aset jadi     |                                                          | Video ulasan dari banyak kreator, dibayar per video                            | tayang         |
| 3   | 3A-01               | Pengelolaan creator dan streamer untuk framing brand | Kreator yang kami kelola membangun cerita brand Anda secara konsisten         | Kreator, host, dan sales |                                                          | “bukan sekadar pengikut banyak”: kreator yang kami kelola, bertanda † (asal A) | tayang         |
| 4   | 3A-04               | Rekrutmen dan penempatan sales atau influencer       | Anda mendapat sales atau influencer yang sudah disaring dan siap bekerja      | Kreator, host, dan sales | Bentuk hubungan kerja disepakati tertulis sebelum mulai. | Sales atau influencer yang sudah disaring; bertanda † (asal A)                 | tayang         |
| 5   | 3A-11               | Kontrak ambassador jangka panjang                    | Satu wajah yang dikenal warga melekat pada brand Anda lewat kontrak eksklusif | Kreator, host, dan sales |                                                          | Satu wajah yang dikenal warga                                                  | tayang         |

Catatan: Bentuk hubungan kerja talenta belum diputuskan (keputusan lintas unit 3); halaman memakai rumusan aman “bentuk hubungan kerja disepakati tertulis”.

### Outsourcing penjualan (SLS)

> “Leads masuk, tapi tidak ada yang menindaklanjuti sampai jadi.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

3 dari 3 offer. Pintu masuk: **3A-08**. Aturan: lolos.

| #   | ID                  | Judul untuk web                                     | Dampak untuk web                                                        | Jenis                    | †                                                        | Alasan                                                                    | Keputusan Anda |
| --- | ------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------- | -------------- |
| 1   | 3A-08 (pintu masuk) | Admin chat dan penutupan penjualan lewat percakapan | Chat calon pembeli dijawab dan ditutup menjadi pesanan                  | Kreator, host, dan sales |                                                          | Lingkup terkecil: chat dijawab dan ditutup menjadi pesanan                | tayang         |
| 2   | 2A-02               | Tim sales lapangan                                  | Tim yang mendatangi calon pembeli di wilayah Anda dengan target harian  | Kreator, host, dan sales | Bentuk hubungan kerja disepakati tertulis sebelum mulai. | “tidak ada yang menindaklanjuti”: tim sales lapangan, bertanda † (asal A) | tayang         |
| 3   | 3A-03               | Outsourcing sales                                   | Penjualan dijalankan atas nama Anda, dibayar tetap ditambah bonus hasil | Kreator, host, dan sales | Bentuk hubungan kerja disepakati tertulis sebelum mulai. | Penjualan dijalankan atas nama Anda; bertanda † (asal A)                  | tayang         |

Catatan: Bab ini tepat tiga offer, semuanya yang ada di katalog.

### Akademi untuk tim klien (AKD)

> “Saya mau tim saya bisa sendiri, tidak selamanya bergantung pada agensi.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

**Bab ditahan utuh.** Katalog hanya memuat dua offer (1A-04, 1A-07), kurang dari tiga. Keduanya tetap bisa ditawarkan lewat percakapan sampai ada offer ketiga. Bab ini tampil di halaman sisi sebagai situasi tanpa halaman, dengan tautan ke Kontak.

0 dari 2 offer. Aturan: lolos.

| #   | ID  | Judul untuk web | Dampak untuk web | Jenis | †   | Alasan | Keputusan Anda |
| --- | --- | --------------- | ---------------- | ----- | --- | ------ | -------------- |

<details><summary>Tidak diusulkan</summary>

| ID    | Judul                        | Alasan                                                 |
| ----- | ---------------------------- | ------------------------------------------------------ |
| 1A-04 | Workshop ads untuk tim klien | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini |
| 1A-07 | Playbook ads per industri    | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini |

</details>

### Ekosistem marketplace dan jaringan komisi (EKO)

> “Saya mau produk saya dijualkan banyak orang, tapi tidak tahu cara mengelola afiliasinya.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

4 dari 12 offer. Pintu masuk: **EKO-04**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                    | Dampak untuk web                                                                                            | Jenis                     | †                                                                    | Alasan                                                                                    | Keputusan Anda |
| --- | -------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------- |
| 1   | EKO-04 (pintu masuk) | Hitung ulang margin setiap biaya platform berubah  | Harga jual dan komisi afiliasi disesuaikan setiap kali biaya komisi, proses, atau logistik platform berubah | Arah, strategi, dan kelas |                                                                      | Lingkup terkecil: margin dan komisi afiliasi dihitung ulang setiap biaya platform berubah | tayang         |
| 2   | 3B-04                | Paket referral partner untuk klien                 | Klien mendapat SaaS dan vendor yang tepat lewat kami, lengkap dengan dukungan penerapan                     | Dijualkan oleh jaringan   |                                                                      | SaaS dan vendor yang tepat lewat kami, komisi diungkapkan (asal T)                        | tayang         |
| 3   | 3C-06                | Komunitas bisnis: seller dan UMKM saling mendukung | Seller masuk etalase dan siaran komunitas yang dibaca anggota setiap minggu                                 | Dijualkan oleh jaringan   |                                                                      | “dijualkan banyak orang”: etalase dan siaran komunitas seller                             | tayang         |
| 4   | 3C-09                | Bounty komunitas: tantangan konten didanai brand   | Anggota komunitas membuat konten untuk brand, dan karya yang terpilih dibayar.                              | Dijualkan oleh jaringan   | Tantangan berbasis kemampuan dengan kriteria tertulis, bukan undian. | Anggota komunitas membuat konten untuk brand; bertanda †                                  | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                                     | Alasan                                                                       |
| ------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 3B-05  | Co-selling dengan partner                                                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| 3B-06  | Program agency atau MCN resmi platform                                    | Ditahan: status program partner platform belum terdaftar                     |
| 3C-07  | Membership korporat                                                       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| EKO-01 | Kampanye afiliasi atas nama seller lewat TikTok Shop Partner Center (TAP) | Ditahan: status program partner platform belum terdaftar                     |
| EKO-02 | Pengelolaan toko sebagai TikTok Shop Partner (TSP)                        | Ditahan: status program partner platform belum terdaftar                     |
| EKO-03 | Kampanye kreator lewat Program MCN Shopee                                 | Ditahan: status program partner platform belum terdaftar                     |
| EKO-05 | Program komisi untuk produk Anda di jaringan Peekabo                      | Ditahan: offer ‡, menunggu pilihan sub-agen                                  |
| EKO-06 | Rujukan pembeli ke mitra pembiayaan dan asuransi                          | Mitra asuransi belum ada (master brief, jalur komisi)                        |

</details>

Catatan: Offer yang paling langsung menjawab “mengelola afiliasinya” (TAP, TSP, MCN) tertahan sampai Peekabo terdaftar. Bila Anda lebih suka, bab ini ditahan utuh sampai saat itu.

## Teknologi · Paham teknis

### Individu dan pembelajar

> “Saya punya selera atau rasa ingin tahu yang spesifik dan ingin membuatnya berjalan.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 18 offer. Pintu masuk: **IND-18**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                      | Dampak untuk web                                                               | Jenis                              | †                                                          | Alasan                                                                                  | Keputusan Anda |
| --- | -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------- |
| 1   | IND-18 (pintu masuk) | Sesi klinik arsitektur satu jam                      | Ide Anda dipetakan: pakai apa, bangun apa, dan apa yang tidak perlu dibangun   | Pekerjaan teknis di balik layar    |                                                            | Lingkup terkecil, padanan audit singkat untuk lapis 1: ide dipetakan dalam satu jam     | tayang         |
| 2   | IND-03               | Bot Telegram pribadi                                 | Ringkasan harian, pengingat, dan pencatat pengeluaran berjalan sendiri         | Bot yang bekerja sendiri           |                                                            | “ingin membuatnya berjalan”: bot pribadi yang bekerja sendiri                           | tayang         |
| 3   | IND-17               | Dasbor pribadi untuk keuangan, kebiasaan, dan target | Angka hidup Anda tampil di satu layar dan diperbarui otomatis                  | Angka yang memberi tahu lebih dulu |                                                            | Angka hidup sendiri di satu layar (profesional dan kreator)                             | tayang         |
| 4   | IND-09               | Portofolio web yang membuka pasar klien              | Calon klien bisa melihat karya Anda dan menghubungi Anda langsung.             | Kanal pendapatan baru              |                                                            | Pencari kerja dan kreator: portofolio yang membuka pasar klien                          | tayang         |
| 5   | IND-01               | Panduan eksperimen agen AI dan MCP                   | Anda mencoba agen AI dan MCP pada pekerjaan Anda sendiri, dipandu per sesi.    | Pekerjaan teknis di balik layar    |                                                            | “rasa ingin tahu”: eksperimen agen AI dan MCP, sisi eksperimental bab ini               | tayang         |
| 6   | IND-16               | Pendampingan teknis proyek akhir                     | Anda dibimbing dari rancangan sampai demo dan tetap mengerjakannya sendiri     | Pekerjaan teknis di balik layar    |                                                            | Mahasiswa: dibimbing sampai demo, tetap mengerjakan sendiri                             | tayang         |
| 7   | IND-07               | Bot pemburu lowongan dan beasiswa                    | Lowongan dan beasiswa yang sesuai kriteria Anda dikirim segera setelah terbit. | Bot yang bekerja sendiri           | Hanya dari data publik atau API resmi yang mengizinkannya. | Pencari kerja: lowongan dan beasiswa; bertanda †, hanya dari data publik atau API resmi | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                   | Alasan                                                                                |
| ------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| IND-02 | Panduan SQL, realtime, dan graf lewat proyek nyata      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab          |
| IND-04 | Bot eksekusi strategi pribadi                           | Menunggu keputusan posisi bot trading                                                 |
| IND-05 | Mesin backtest dan jurnal pribadi                       | Menunggu keputusan posisi bot trading                                                 |
| IND-06 | Peringatan harga dan berita ke ponsel                   | Ikut keputusan posisi bot trading: peringatan harga untuk trader, sama seperti KEU-04 |
| IND-08 | Bot pantau harga barang atau tiket                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab          |
| IND-10 | Portofolio interaktif dengan animasi, 3D, atau fitur AI | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab          |
| IND-11 | Template framework siap pakai                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab          |
| IND-12 | Starter kit berbasis stack baru                         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab          |
| IND-13 | Prototipe pembuktian konsep                             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab          |
| IND-14 | Otomasi IoT untuk hobi                                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab          |
| IND-15 | Bot dan overlay siaran pribadi                          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab          |

</details>

Catatan: Pembeli bab ini di katalog menyebut trader mandiri. Sampai posisi bot trading diputuskan, halaman bab tidak menyebut trading, termasuk di daftar pembelinya.

### Freelancer dan agensi kecil

> “Proyeknya besar, tangan saya kurang, dan saya tidak mau menolak klien.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 18 offer. Pintu masuk: **FRL-06**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                | Dampak untuk web                                                             | Jenis                                  | †   | Alasan                                                                                   | Keputusan Anda |
| --- | -------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------- | --- | ---------------------------------------------------------------------------------------- | -------------- |
| 1   | FRL-06 (pintu masuk) | Estimasi dan lingkup untuk penawaran Anda      | Penawaran Anda punya biaya dan jadwal yang bisa dipertanggungjawabkan        | Pekerjaan teknis di balik layar        |     | Lingkup terkecil: biaya dan jadwal penawaran dihitung sebelum Anda menerima proyek besar | tayang         |
| 2   | FRL-02               | Modul bot dan workflow siap pasang untuk klien | Anda menawarkan otomatisasi kepada klien tanpa membangunnya dari awal        | Bot yang bekerja sendiri               |     | Otomatisasi untuk klien tanpa membangun dari awal                                        | tayang         |
| 3   | FRL-08               | QA lepas untuk proyek Anda                     | Rilis Anda diuji tanpa merekrut penguji                                      | Alur kerja yang berjalan tanpa dikejar |     | Rilis diuji tanpa merekrut penguji                                                       | tayang         |
| 4   | FRL-13               | Ubah jasa berulang menjadi produk              | Proyek yang sering diulang dikemas menjadi paket, template, atau langganan   | Kanal pendapatan baru                  |     | Jasa yang sering diulang dikemas menjadi produk                                          | tayang         |
| 5   | FRL-01               | Subkontrak di belakang layar                   | Anda menjual proyeknya, dan kami mengerjakannya atas nama Anda.              | Pekerjaan teknis di balik layar        |     | “tangan saya kurang”: kami mengerjakan di belakang layar atas nama Anda                  | tayang         |
| 6   | FRL-05               | Rapid build dari modul teruji                  | Proyek booking dan checkout klien Anda dirakit dari modul yang sudah teruji. | Pekerjaan teknis di balik layar        |     | “Proyeknya besar”: booking dan checkout dirakit dari modul teruji                        | tayang         |
| 7   | FRL-10               | Pemeliharaan bulanan atas nama Anda            | Klien Anda mendapat standar layanan tanpa Anda menjaga server                | Pekerjaan teknis di balik layar        |     | Klien Anda tetap dijaga setelah serah terima, tanpa Anda menjaga server                  | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                           | Alasan                                                                                                           |
| ------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| FRL-03 | Spesialis pembayaran untuk proyek Anda          | Tidak dipilih: spesialis pembayaran sudah tampil di Software house (SWH-04)                                      |
| FRL-04 | Spesialis WhatsApp API dan notifikasi           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                     |
| FRL-07 | Tinjauan keamanan sebelum serah terima          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                     |
| FRL-09 | DevOps sewaan untuk portofolio klien            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                     |
| FRL-11 | Spesialis mobile sesuai kebutuhan               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                     |
| FRL-12 | Ambil alih proyek klien yang mangkrak           | Tidak dipilih: pengambilalihan proyek sudah tampil di Software house (SWH-06); satu halaman untuk satu pekerjaan |
| FRL-14 | Buka layanan merek putih untuk klien-klien Anda | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                     |
| FRL-15 | Optimasi kecepatan situs klien                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                     |
| FRL-16 | Laporan bulanan otomatis untuk klien Anda       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                     |
| FRL-17 | Modul berlisensi: booking, checkout, komisi     | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                     |
| FRL-18 | Workshop teknis untuk tim Anda                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                     |

</details>

Catatan: “tidak mau menolak klien” dijawab oleh urutan: hitung dulu, kerjakan di belakang layar, lalu jaga setelahnya.

### Software house dan perusahaan IT

> “Tenggat ketat dan spesialis sulit dicari.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 18 offer. Pintu masuk: **SWH-06**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                           | Dampak untuk web                                                          | Jenis                                  | †   | Alasan                                                                        | Keputusan Anda |
| --- | -------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------- | --- | ----------------------------------------------------------------------------- | -------------- |
| 1   | SWH-06 (pintu masuk) | Audit kode dan pengambilalihan proyek                     | Proyek bermasalah dinilai jujur lalu dilanjutkan                          | Pekerjaan teknis di balik layar        |     | Lingkup terkecil, padanan audit singkat: proyek bermasalah dinilai jujur dulu | tayang         |
| 2   | SWH-09               | Rilis otomatis dan pemantauan                             | Setiap rilis aman dan masalah terdeteksi sebelum pengguna mengeluh        | Alur kerja yang berjalan tanpa dikejar |     | Setiap rilis aman dan masalah terdeteksi lebih dulu                           | tayang         |
| 3   | SWH-18               | Pipeline data dan gudang data untuk produk analitik       | Produk analitik Anda punya sumber data yang rapi dan cepat                | Angka yang memberi tahu lebih dulu     |     | Sumber data rapi untuk produk analitik                                        | tayang         |
| 4   | SWH-05               | Arsitektur multi-tenant dan merek putih untuk produk Anda | Satu produk melayani banyak klien dengan merek masing-masing              | Kanal pendapatan baru                  |     | Satu produk melayani banyak klien dengan merek masing-masing                  | tayang         |
| 5   | SWH-02               | Kapasitas tambahan saat puncak                            | Tenggat ketat tetap tercapai tanpa merekrut tenaga tetap                  | Pekerjaan teknis di balik layar        |     | “Tenggat ketat”: kapasitas tambahan saat puncak tanpa merekrut tetap          | tayang         |
| 6   | SWH-01               | Tim khusus di bawah arahan Anda                           | Spesialis bekerja mengikuti ritme Anda seolah bagian dari perusahaan Anda | Pekerjaan teknis di balik layar        |     | “spesialis sulit dicari”: tim khusus mengikuti ritme Anda                     | tayang         |
| 7   | SWH-04               | Spesialis pembayaran dan rekonsiliasi                     | Alur uang produk Anda konsisten dan bisa diaudit                          | Pekerjaan teknis di balik layar        |     | Spesialis pembayaran dan rekonsiliasi                                         | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                          | Alasan                                                                                                       |
| ------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| SWH-03 | Spesialis backend supplier dan host-to-host    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |
| SWH-07 | Modernisasi bertahap                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |
| SWH-08 | Uji beban dan skala                            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |
| SWH-10 | Pentest dan pendampingan kepatuhan PDP dan PSE | Cadangan: bertanda †, pentest dan kepatuhan PDP serta PSE; pilih bila Anda ingin kepatuhan tampil di bab ini |
| SWH-11 | Pustaka modul berlisensi                       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |
| SWH-12 | Ubah proyek pesanan menjadi produk langganan   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |
| SWH-13 | Portal developer dan dokumentasi API           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |
| SWH-14 | QA otomatis dan skenario gagal bayar           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |
| SWH-15 | Code review dan pendampingan tim junior        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |
| SWH-16 | Dukungan level dua atas nama Anda              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |
| SWH-17 | Bawa produk ke marketplace aplikasi besar      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                                 |

</details>

Catatan: Tim khusus dan pemeliharaan bulanan adalah dua dari lima cara mulai sisi ini; SWH-01 mewakili yang pertama.

### Startup dan CTO

> “Kami harus rilis cepat dengan uang dan orang yang terbatas.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 18 offer. Pintu masuk: **STA-02**. Aturan: lolos.

| #   | ID                   | Judul untuk web                      | Dampak untuk web                                                                   | Jenis                                  | †   | Alasan                                                                      | Keputusan Anda |
| --- | -------------------- | ------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------- | --- | --------------------------------------------------------------------------- | -------------- |
| 1   | STA-02 (pintu masuk) | Uji minat sebelum membangun          | Halaman tunggu dan pembayaran uji mengukur minat sebelum satu baris kode ditulis   | Kanal pendapatan baru                  |     | Lingkup terkecil: minat diukur sebelum satu baris kode ditulis              | tayang         |
| 2   | STA-03               | CTO paruh waktu                      | Keputusan teknologi terarah setiap bulan tanpa merekrut CTO tetap                  | Pekerjaan teknis di balik layar        |     | “orang yang terbatas”: keputusan teknologi terarah tanpa merekrut CTO tetap | tayang         |
| 3   | STA-05               | Pendaftaran dan aktivasi mandiri     | Pengguna mendaftar, mencoba, dan aktif tanpa dibantu                               | Alur kerja yang berjalan tanpa dikejar |     | Pengguna mendaftar dan aktif tanpa dibantu                                  | tayang         |
| 4   | STA-10               | Agen AI dan pencarian atas data Anda | Pengguna bertanya dalam bahasa sehari-hari dan mendapat jawaban dari data Anda     | Bot yang bekerja sendiri               |     | Pengguna bertanya dalam bahasa sehari-hari, jawaban dari data Anda          | tayang         |
| 5   | STA-01               | MVP dengan lingkup tetap             | Produk pertama diuji pasar dalam hitungan minggu dengan biaya dan tenggat terkunci | Kanal pendapatan baru                  |     | “harus rilis cepat”: MVP dengan lingkup, biaya, dan tenggat terkunci        | tayang         |
| 6   | STA-04               | Penagihan langganan siap pakai       | Paket, tagihan, dan pengingat berjalan sendiri sejak pengguna pertama              | Kanal pendapatan baru                  |     | Paket dan tagihan berjalan sejak pengguna pertama                           | tayang         |
| 7   | STA-12               | Penghematan biaya cloud              | Pemakaian cloud ditinjau dan dirapikan sebelum ronde pendanaan berikutnya.         | Pekerjaan teknis di balik layar        |     | “uang terbatas”: pemakaian cloud ditinjau sebelum ronde berikutnya          | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                | Alasan                                                                       |
| ------ | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| STA-06 | Multi-tenant sejak awal                              | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STA-07 | Pembayaran lokal dan rekonsiliasi                    | Tidak dipilih: spesialis pembayaran sudah tampil di Software house (SWH-04)  |
| STA-08 | Fitur realtime: chat, kolaborasi, pelacakan langsung | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                       |
| STA-09 | Mesin graf untuk rekomendasi dan deteksi relasi      | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                       |
| STA-11 | Uji beban sebelum peluncuran atau pendanaan          | Tidak dipilih: uji beban mirip SWH-08; lebih tepat lewat percakapan          |
| STA-13 | Due diligence teknologi untuk investor atau akuisisi | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STA-14 | Keamanan siap audit klien besar                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STA-15 | Otomasi outreach yang patuh dan penilaian lead       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STA-16 | Panel admin cepat dari modul                         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STA-17 | Verifikasi identitas pengguna                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| STA-18 | Dokumentasi arsitektur untuk data room               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Tim IT internal perusahaan

> “Pekerjaan operasional menumpuk dan sistem lama tidak ada yang berani menyentuh.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

7 dari 18 offer. Pintu masuk: **TIM-10**. Aturan: lolos.

| #   | ID                   | Judul untuk web                            | Dampak untuk web                                           | Jenis                                  | †   | Alasan                                                                                     | Keputusan Anda |
| --- | -------------------- | ------------------------------------------ | ---------------------------------------------------------- | -------------------------------------- | --- | ------------------------------------------------------------------------------------------ | -------------- |
| 1   | TIM-10 (pintu masuk) | Dokumentasi ulang sistem tanpa dokumen     | Sistem yang tak ada yang memahaminya dipetakan dan ditulis | Pekerjaan teknis di balik layar        |     | “sistem lama tidak ada yang berani menyentuh”: dipetakan dan ditulis dulu sebelum disentuh | tayang         |
| 2   | TIM-08               | Otomasi laporan wajib                      | Laporan rutin terbit sendiri dari sumber data              | Alur kerja yang berjalan tanpa dikejar |     | “Pekerjaan operasional menumpuk”: laporan rutin terbit sendiri                             | tayang         |
| 3   | TIM-03               | Pemantauan dan peringatan terpusat         | Masalah terdeteksi sebelum pengguna mengeluh               | Bot yang bekerja sendiri               |     | Masalah terdeteksi sebelum pengguna mengeluh                                               | tayang         |
| 4   | TIM-05               | Migrasi data dari Excel dan sistem warisan | Data lama pindah utuh dan bisa dilaporkan                  | Angka yang memberi tahu lebih dulu     |     | Data lama pindah utuh dari Excel dan sistem warisan                                        | tayang         |
| 5   | TIM-09               | Modernisasi aplikasi warisan bertahap      | Aplikasi lama diperbarui tanpa menghentikan operasional    | Pekerjaan teknis di balik layar        |     | Aplikasi lama diperbarui bertahap tanpa menghentikan operasional                           | tayang         |
| 6   | TIM-06               | Rekonsiliasi otomatis lintas sistem        | Catatan antarsistem cocok tanpa dicocokkan tangan          | Alur kerja yang berjalan tanpa dikejar |     | Catatan antarsistem cocok tanpa dicocokkan tangan                                          | tayang         |
| 7   | TIM-04               | Bot verifikasi backup dan pemulihan        | Backup terbukti bisa dipulihkan, bukan sekadar ada         | Bot yang bekerja sendiri               |     | Backup terbukti bisa dipulihkan                                                            | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                      | Alasan                                                                       |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| TIM-01 | Bot ChatOps untuk status dan rilis         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TIM-02 | Workflow tiket dan eskalasi insiden        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TIM-07 | Integrasi ERP, POS, dan marketplace        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TIM-11 | Audit hak akses dan jejak aktivitas        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TIM-12 | Gudang data ringan dan BI                  | Tidak dipilih: gudang data tampil di bab Lapisan data (DAT-04)               |
| TIM-13 | Gerbang API untuk mitra                    | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                       |
| TIM-14 | Optimasi database dan indeks               | Tidak dipilih: optimasi database tampil di bab Lapisan data (DAT-03)         |
| TIM-15 | Pelatihan praktik aman untuk tim           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TIM-16 | Alat internal cepat dari modul             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TIM-17 | Asisten AI atas dokumen SOP                | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |
| TIM-18 | Uji penetrasi berkala dan tinjauan tahunan | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab |

</details>

### Lapisan data: SQL, realtime, dan graf

> “Data kami lambat, terlambat, atau tidak terhubung satu sama lain.”

**Keputusan:** Disetujui pemilik seperti diusulkan, 16 Oktober 2026.

6 dari 24 offer. Pintu masuk: **DAT-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                       | Dampak untuk web                                                     | Jenis                              | †   | Alasan                                                            | Keputusan Anda |
| --- | -------------------- | ------------------------------------- | -------------------------------------------------------------------- | ---------------------------------- | --- | ----------------------------------------------------------------- | -------------- |
| 1   | DAT-03 (pintu masuk) | Optimasi query dan indeks             | Halaman dan laporan yang lambat menjadi cepat                        | Angka yang memberi tahu lebih dulu |     | “Data kami lambat”: lingkup terkecil, query dan indeks            | tayang         |
| 2   | DAT-09               | Notifikasi langsung ke pengguna       | Peristiwa penting sampai seketika lewat web, push, atau chat         | Bot yang bekerja sendiri           |     | “terlambat”: peristiwa penting sampai seketika                    | tayang         |
| 3   | DAT-04               | Gudang data ringan dan ETL terjadwal  | Data dari banyak sumber menyatu setiap malam tanpa dikerjakan tangan | Angka yang memberi tahu lebih dulu |     | “tidak terhubung”: banyak sumber menyatu setiap malam             | tayang         |
| 4   | DAT-08               | Dasbor realtime                       | Penjualan, mesin, atau armada terlihat saat itu juga.                | Angka yang memberi tahu lebih dulu |     | Realtime: penjualan, mesin, atau armada terlihat saat itu juga    | tayang         |
| 5   | DAT-16               | Rekomendasi dari graf relasi          | Produk atau konten yang sering muncul bersama tampil relevan         | Angka yang memberi tahu lebih dulu |     | Graf: barang dan konten yang sering muncul bersama                | tayang         |
| 6   | DAT-18               | Peta rantai pasok dan dampak gangguan | Bila satu pemasok terlambat, produk yang terkena langsung tampak     | Angka yang memberi tahu lebih dulu |     | Graf: satu pemasok terlambat, produk yang terkena langsung tampak | tayang         |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                               | Alasan                                                                                                   |
| ------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| DAT-01 | Rancang skema basis data transaksi                  | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-02 | Migrasi Excel dan sistem lama ke SQL                | Tidak dipilih: pekerjaannya sama dengan TIM-05 di bab Tim IT internal; satu halaman untuk satu pekerjaan |
| DAT-05 | Laporan dan BI dari sumber SQL                      | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-06 | Partisi dan arsip data besar                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-07 | Replikasi dan pemulihan bencana database            | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-10 | Antrean dan giliran realtime                        | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-11 | Pelacakan lokasi realtime                           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-12 | Kolaborasi realtime pada dokumen dan papan          | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-13 | Aliran data sensor dengan ambang peringatan         | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-14 | Lelang dan penawaran realtime                       | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                                                   |
| DAT-15 | Papan skor dan overlay siaran                       | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-17 | Deteksi kecurangan dari jaringan akun dan transaksi | Tidak dipilih: deteksi kecurangan lebih aman dibicarakan langsung                                        |
| DAT-19 | Graf pengetahuan untuk asisten AI                   | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-20 | Struktur produk dan dependensi komponen             | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-21 | Analisis jaringan referral dan komisi               | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-22 | Peta pemenang tender dan pesaing                    | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-23 | Pencarian cerdas pada katalog dan dokumen           | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |
| DAT-24 | Pencarian semantik untuk asisten AI                 | Tidak dipilih: jenisnya sudah diwakili offer yang lebih dekat ke kutipan bab                             |

</details>

Catatan: Tiga lapis di judul bab masing-masing terwakili: SQL (DAT-03, DAT-04), realtime (DAT-08, DAT-09), graf (DAT-16, DAT-18).

## Peekabo · Jaringan

### Sales lepas, makelar, dan calo (Open Commission) (OCS)

> “Saya punya kenalan yang mau beli. Saya mau dapat bagian kalau jadi.”

**Bab ditahan utuh.** Langkah 2 cara bergabung menjanjikan kartu komisi untuk setiap produk: siapa membayar, pemicu, besar, dan kapan cair. Kartunya belum disusun (keputusan 5 di master brief), jadi bab ini ditahan utuh sampai kartu pertama ada. Bab ini tampil di halaman sisi sebagai situasi tanpa halaman, dengan tautan ke Kontak.

0 dari 12 offer. Aturan: lolos.

| #   | ID  | Judul untuk web | Dampak untuk web | Jenis | †   | Alasan | Keputusan Anda |
| --- | --- | --------------- | ---------------- | ----- | --- | ------ | -------------- |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                                         | Alasan                                                                                              |
| ------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 3B-01  | Lapisan sub-agen: member mengambil barang dan mendapat komisi | Ditahan: offer ‡, menunggu pilihan sub-agen (keputusan 1)                                           |
| 3B-03  | Etalase produk komisi terkurasi                               | Ditahan: etalase komisi bersinggungan dengan larangan sub-afiliasi platform; ikut keputusan 1 dan 4 |
| 3B-07  | Dasbor komisi untuk sub-agen                                  | Siap saat kartu ada: dasbor rujukan dan komisi                                                      |
| OCS-01 | Komisi referral properti: rumah baru dan rumah bekas          | Siap saat kartu ada: properti lewat perantara berizin; bertanda †                                   |
| OCS-02 | Komisi referral kendaraan: dealer dan showroom                | Siap saat kartu ada: kendaraan, fee setelah unit diserahkan                                         |
| OCS-03 | Rujukan pembiayaan kendaraan dan barang                       | Siap saat kartu ada: pembiayaan, dari insentif yang sah; bertanda †                                 |
| OCS-04 | Rujukan asuransi lewat agen berlisensi                        | Mitra asuransi belum ada (master brief, jalur komisi)                                               |
| OCS-05 | Referral software dan layanan bisnis                          | Siap saat kartu ada: software, komisi berulang selama berlangganan                                  |
| OCS-06 | Referral sewa alat berat                                      | Mitra sewa alat berat belum ada (master brief, jalur komisi)                                        |
| OCS-07 | Referral elektronik bekas dan konveksi                        | Mitra konveksi belum ada (master brief, jalur komisi)                                               |
| OCS-08 | Referral proyek konstruksi, sistem, dan pemasaran Arthur      | Siap saat kartu ada: rujukan ke Arthur sendiri, tanpa mitra luar; calon pintu masuk                 |
| OCS-09 | Kelas menjual untuk mitra baru                                | Siap saat kartu ada: kelas menjual, dijual terpisah dan bukan syarat bergabung                      |

</details>

Catatan: Bila kartu komisi sudah ada, tujuh offer pertama di daftar tahan menjadi daftar pendek bab ini tanpa usulan ulang. Halaman nanti memuat aturan satu tingkat: tanpa biaya bergabung, tanpa bonus rekrutmen, tanpa janji penghasilan.

### Anggota komunitas belanja (membership) (MBR)

> “Kalau saya belanja lewat komunitas, saya dapat apa?”

**Bab ditahan utuh.** Master brief menulis industri komunitas dan membership dibuka setelah ada audiens yang cukup, dan tiga offer intinya (‡) menunggu pilihan sub-agen. Bab ini ditahan utuh sampai keduanya terjawab. Bab ini tampil di halaman sisi sebagai situasi tanpa halaman, dengan tautan ke Kontak.

0 dari 12 offer. Aturan: lolos.

| #   | ID  | Judul untuk web | Dampak untuk web | Jenis | †   | Alasan | Keputusan Anda |
| --- | --- | --------------- | ---------------- | ----- | --- | ------ | -------------- |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                          | Alasan                                                                                 |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| 3C-01  | Membership dengan diskon tetap berbasis komisi | Ditahan: offer ‡, menunggu pilihan sub-agen (keputusan 1)                              |
| 3B-02  | Diskon dari komisi untuk customer dan klien    | Ditahan: offer ‡, menunggu pilihan sub-agen (keputusan 1)                              |
| 3C-02  | Tingkat membership: dasar, pro, mitra          | Siap saat dibuka: tingkat dasar, pro, dan mitra (asal T)                               |
| 3C-03  | Hunt Pass: tiket musiman untuk event           | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                                 |
| 3C-04  | Patungan: pembelian kolektif anggota           | Siap saat dibuka: patungan harga grosir, mengikuti aturan perlindungan konsumen        |
| 3C-05  | Kelas dan workshop khusus anggota              | Siap saat dibuka: kelas khusus anggota                                                 |
| 3C-08  | Merchandise komunitas                          | Tidak dipilih: jenisnya tidak menjawab kutipan bab ini                                 |
| 3B-08  | Kode promo dan tautan khusus komunitas         | Ditahan: kode dan tautan bergantung pada status afiliasi platform yang belum terdaftar |
| MBR-01 | Cashback anggota setelah komisi cair           | Ditahan: offer ‡, menunggu pilihan sub-agen (keputusan 1)                              |
| MBR-02 | Membership tahunan dengan plafon manfaat       | Siap saat dibuka: iuran tahunan dengan plafon manfaat yang jelas                       |
| MBR-03 | Paket membership dengan layanan Arthur         | Ikut keputusan D5 Membership Care: perawatan properti tertahan di Konstruksi           |
| MBR-04 | Membership untuk anggota usaha (UMKM)          | Siap saat dibuka: harga anggota untuk UMKM                                             |

</details>

Catatan: Bila dibuka, lima offer pertama di daftar tahan menjadi daftar pendek bab ini.

### Kreator, streamer, dan host (KRE)

> “Saya bisa live berjam-jam, tapi penghasilannya belum menentu.”

4 dari 7 offer. Pintu masuk: **KRE-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                       | Dampak untuk web                                                                               | Jenis                     | †                                                                         | Alasan                                                                                                                   | Keputusan Anda |
| --- | -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------- |
| 1   | KRE-03 (pintu masuk) | Host untuk toko brand mitra           | Anda dibayar per jam atau per bulan untuk menjadi host toko brand yang kami layani             | Kreator, host, dan sales  | Bentuk kerja disepakati tertulis, dan honor dipotong pajak sesuai aturan. | “penghasilannya belum menentu”: dibayar per jam atau per bulan sebagai host toko brand; bentuk kerja disepakati tertulis | tayang / tahan |
| 2   | 3A-09                | Akademi talenta: host, kreator, sales | Anda dilatih membawakan produk, membaca penonton, dan menutup penjualan                        | Arah, strategi, dan kelas | Kelas dijual terpisah dan tidak menjadi syarat atau biaya masuk jaringan. | “bisa live berjam-jam”: dilatih membaca penonton dan menutup penjualan; kelas dijual terpisah, bukan syarat bergabung    | tayang / tahan |
| 3   | KRE-05               | Layanan produksi untuk kreator        | Rekaman Anda diedit menjadi klip, thumbnail, dan jadwal unggah                                 | Konten dan aset jadi      |                                                                           | Rekaman diedit menjadi klip, thumbnail, dan jadwal unggah                                                                | tayang / tahan |
| 4   | KRE-06               | Manajemen kontrak brand untuk kreator | Kami mencarikan dan mengurus kontrak brand, dengan biaya manajemen dari kontrak yang kami bawa | Kreator, host, dan sales  |                                                                           | Kontrak brand dicarikan dan diurus, biaya manajemen hanya dari kontrak yang kami bawa                                    | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                          | Alasan                                                                              |
| ------ | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| KRE-01 | Bergabung dengan agency LIVE Peekabo di TikTok | Ditahan: status agency LIVE belum terdaftar (keputusan 4)                           |
| KRE-02 | Bergabung dengan MCN Shopee Peekabo            | Ditahan: status MCN belum terdaftar (keputusan 4)                                   |
| KRE-04 | Studio dan alat siaran per jam                 | Ditahan: studio siaran Peekabo belum tercatat ada; jembatannya ke studio Konstruksi |

</details>

Catatan: Industri talenta dibuka lebih dulu menurut master brief. Halaman tidak menjanjikan penghasilan; yang ditulis adalah bentuk bayarannya (per jam, per bulan, dari kontrak).
