# Daftar pendek offer

Usulan agen per bab, sesuai `docs/RENCANA-KONTEKS-V2.md` V2 dan Peta website, “Memilih offer yang tayang”: 3 sampai 7 offer, dipilih terhadap kutipan pembeli bab, satu per jenis sebelum yang kedua, offer lingkup terkecil sebagai pintu masuk, offer ‡ dan yang bergantung pada keputusan terbuka tidak diusulkan, offer † hanya dengan rumusan aman.

Dokumen ini internal: ID katalog dan tanda † boleh ada di sini dan tidak pernah tampil di situs. Isi kolom **Keputusan Anda**, atau balas per bab. Sesudah keputusan dan “ok tulis”, agen menyetel status di Sanity: `dipilih` atau `ditahan`. Dokumen ini dihasilkan oleh `lib/scripts/shortlist-report.ts`; usulan tersimpan di `lib/content/shortlist.ts`.

## Teknologi · Siap pakai

### Kuliner dan F&B

> “Pesanan saya bercampur di chat, kasir kewalahan saat ramai, dan bahan sering habis atau terbuang.”

7 dari 11 offer. Pintu masuk: **KUL-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                           | Dampak untuk web                                                                                       | Jenis                                  | †   | Alasan                                                       | Keputusan Anda |
| --- | -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------- | --- | ------------------------------------------------------------ | -------------- |
| 1   | KUL-01 (pintu masuk) | Bot pesan-antar WhatsApp                  | Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada admin yang berjaga.              | Bot yang bekerja sendiri               |     | “Pesanan saya bercampur di chat”                             | tayang / tahan |
| 2   | KUL-02               | Pesan dan bayar dari meja                 | Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur.                                  | Alur kerja yang berjalan tanpa dikejar |     | “kasir kewalahan saat ramai”                                 | tayang / tahan |
| 3   | KUL-07               | Buka langganan makan harian               | Pekerja kantor dan penghuni kos bisa berlangganan makan harian, dengan tagihan yang terkirim otomatis. | Kanal pendapatan baru                  |     | Kanal pendapatan; halamannya sudah disetujui di R1           | tayang / tahan |
| 4   | KUL-03               | Layar pesanan di dapur                    | Setiap pesanan tampil di layar dapur saat itu juga, berikut urutan dan waktu sajinya.                  | Angka yang memberi tahu lebih dulu     |     | Kasir dan dapur saat ramai; halamannya sudah disetujui di R1 | tayang / tahan |
| 5   | KUL-08               | Bot stok bahan dan pesan ulang ke pemasok | Stok bahan tercatat, dan pesanan ke pemasok terkirim sendiri saat bahan menipis.                       | Bot yang bekerja sendiri               |     | “bahan sering habis atau terbuang”                           | tayang / tahan |
| 6   | KUL-05               | Workflow pesanan, produksi, dan antar     | Pesanan acara berubah sendiri menjadi daftar belanja, jadwal masak, dan jadwal antar                   | Alur kerja yang berjalan tanpa dikejar |     | Katering: pesanan acara menjadi jadwal masak dan antar       | tayang / tahan |
| 7   | KUL-06               | Buka toko makanan beku ke luar kota       | Toko makanan beku untuk pembeli luar kota, dengan ongkir, resi, dan pelacakan yang berjalan sendiri.   | Kanal pendapatan baru                  |     | Produsen makanan: pasar di luar kota                         | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                           | Alasan                                                          |
| ------ | ----------------------------------------------- | --------------------------------------------------------------- |
| KUL-04 | Bot reservasi dengan uang muka                  | Tidak dipilih: jenis Bot sudah diwakili tiga kali               |
| KUL-09 | Bot ulasan setelah kunjungan                    | Tidak dipilih: tidak menjawab kutipan bab                       |
| KUL-10 | Buka jaringan waralaba dengan aplikasi bermerek | Tidak dipilih: untuk franchise, bukan pembeli utama bab         |
| KUL-11 | Dasbor penjualan per jam                        | Tidak dipilih: Layar pesanan di dapur sudah mewakili jenis Data |

</details>

Catatan: Bab ini sudah tayang dengan 11 offer. Keempat offer yang tidak dipilih perlu dicabut dari tayang (unpublish) di Studio; itu tindakan terbit, jadi menunggu izin Anda tersendiri.

## Konstruksi · Pemilik bangunan

### Rumah tinggal dan konsumen akhir (lapis 1)

> “Saya takut anggaran membengkak dan pekerjaan tidak diawasi.”

6 dari 16 offer. Pintu masuk: **RMH-10**. Aturan: lolos.

| #   | ID                   | Judul untuk web                            | Dampak untuk web                                                              | Jenis                          | †   | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------ | --- | ---------------------------------------------------------- | -------------- |
| 1   | RMH-10 (pintu masuk) | RAB dan estimasi biaya sebelum membangun   | Anggaran dihitung dari gambar dan harga pasar sebelum Anda memutuskan         | Bagian proyek yang kami ambil  |     | “Saya takut anggaran membengkak”: angka sebelum memutuskan | tayang / tahan |
| 2   | RMH-01               | Bangun rumah dari hulu ke hilir            | Rumah jadi sesuai anggaran dengan jadwal dan garansi yang tertulis            | Proyek utuh dari hulu ke hilir |     | Rumah pertama, dari hulu ke hilir, garansi tertulis        | tayang / tahan |
| 3   | RMH-16               | Garansi dan perbaikan setelah serah terima | Cacat yang muncul setelah serah terima diperbaiki dalam masa garansi          | Perawatan berkala              |     | Sesudah serah terima: garansi                              | tayang / tahan |
| 4   | RMH-09               | Pengawasan proyek pribadi                  | Ada pihak independen yang mengawasi mutu dan biaya atas nama pemilik          | Bagian proyek yang kami ambil  |     | “pekerjaan tidak diawasi”: pengawas atas nama pemilik      | tayang / tahan |
| 5   | RMH-14               | Survei kondisi bangunan sebelum renovasi   | Retak, kebocoran, dan kerusakan tersembunyi terdata sebelum biaya dikeluarkan | Bagian proyek yang kami ambil  |     | Biaya tersembunyi terdata sebelum renovasi                 | tayang / tahan |
| 6   | RMH-02               | Renovasi dengan estimasi terukur           | Biaya dan jadwal renovasi diketahui sebelum pekerjaan dimulai                 | Proyek utuh dari hulu ke hilir |     | Pemilik rumah lama: renovasi dengan estimasi               | tayang / tahan |

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

5 dari 10 offer. Pintu masuk: **ITR-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                  | Dampak untuk web                                                          | Jenis                          | †   | Alasan                                            | Keputusan Anda |
| --- | -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------- | -------------- |
| 1   | ITR-01 (pintu masuk) | Analisis kebutuhan ruang                         | Kebutuhan, kebiasaan, dan batas anggaran dirumuskan sebelum gambar dibuat | Bagian proyek yang kami ambil  |     | Langkah terkecil: kebutuhan ruang dirumuskan dulu | tayang / tahan |
| 2   | ITR-10               | Interior lengkap dari visual sampai serah terima | Satu pihak mengurus visual, gambar, pekerjaan, dan serah terima           | Proyek utuh dari hulu ke hilir |     | Satu pihak dari visual sampai serah terima        | tayang / tahan |
| 3   | ITR-02               | Visualisasi tiga dimensi interior                | Ruangan terlihat jadi sebelum satu tukang pun dipanggil                   | Bagian proyek yang kami ambil  |     | “tidak bisa membayangkannya”                      | tayang / tahan |
| 4   | ITR-04               | Gambar kerja interior untuk tukang               | Tukang bekerja dari gambar yang jelas ukuran dan detailnya                | Bagian proyek yang kami ambil  |     | “tukang tidak paham maksud saya”                  | tayang / tahan |
| 5   | ITR-05               | RAB interior dari gambar                         | Biaya interior dihitung dari volume yang tergambar                        | Bagian proyek yang kami ambil  |     | Biaya interior dari gambar, bukan tebakan         | tayang / tahan |

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

6 dari 10 offer. Pintu masuk: **FNB-06**. Aturan: lolos.

| #   | ID                   | Judul untuk web                          | Dampak untuk web                                                          | Jenis                          | †   | Alasan                                                                         | Keputusan Anda |
| --- | -------------------- | ---------------------------------------- | ------------------------------------------------------------------------- | ------------------------------ | --- | ------------------------------------------------------------------------------ | -------------- |
| 1   | FNB-06 (pintu masuk) | Alur dapur yang mempercepat penyajian    | Posisi kompor, bar, dan pass-out mengurangi langkah dan waktu tunggu      | Bangunan yang lebih produktif  |     | “alur dapurnya belum jalan”: lingkup terkecil                                  | tayang / tahan |
| 2   | FNB-01               | Kafe siap buka dari lokasi sewa          | Lokasi kosong menjadi kafe yang alur pelanggan dan dapurnya sudah bekerja | Proyek utuh dari hulu ke hilir |     | “Lokasinya sudah dapat”: kafe siap buka; jembatan ke Pesan dan bayar dari meja | tayang / tahan |
| 3   | FNB-10               | Perawatan outlet berkala                 | Kerusakan kecil di outlet ditangani berkala, sebelum menjadi besar.       | Perawatan berkala              |     | Sesudah buka: perawatan outlet                                                 | tayang / tahan |
| 4   | FNB-05               | Tata letak yang menambah kapasitas duduk | Tata letak meja dan sirkulasi memuat lebih banyak tamu tanpa terasa sesak | Bangunan yang lebih produktif  |     | Kafe yang menarik: kapasitas duduk                                             | tayang / tahan |
| 5   | FNB-03               | Dapur produksi higienis                  | Alur bahan, olah, dan saji tidak bersilang dan mudah dibersihkan          | Proyek utuh dari hulu ke hilir |     | Katering dan produsen: dapur produksi                                          | tayang / tahan |
| 6   | FNB-09               | Makeover kedai yang sudah berjalan       | Kedai lama tampil baru dengan waktu tutup yang sesingkat mungkin          | Bangunan yang lebih produktif  |     | Kedai lama yang sudah berjalan                                                 | tayang / tahan |

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

6 dari 10 offer. Pintu masuk: **STD-03**. Aturan: lolos.

| #   | ID                   | Judul untuk web                           | Dampak untuk web                                                | Jenis                          | †                                                        | Alasan                                                           | Keputusan Anda |
| --- | -------------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------- | -------------- |
| 1   | STD-03 (pintu masuk) | Pencahayaan set siaran                    | Wajah dan produk tampil jelas tanpa silau                       | Proyek utuh dari hulu ke hilir |                                                          | Langkah terkecil: pencahayaan set                                | tayang / tahan |
| 2   | STD-04               | Backdrop dan set siaran                   | Latar siaran berkarakter dan mudah dibongkar atau diubah        | Bangunan yang lebih produktif  |                                                          | “set saya berantakan”                                            | tayang / tahan |
| 3   | STD-01               | Ruang siaran kedap gema                   | Suara bersih tanpa gema dan gangguan dari luar                  | Proyek utuh dari hulu ke hilir |                                                          | “Siaran saya terganggu gema”                                     | tayang / tahan |
| 4   | STD-09               | Makeover ruangan menjadi studio           | Ruangan biasa menjadi studio siap pakai tanpa merombak bangunan | Bangunan yang lebih produktif  |                                                          | Ruangan biasa jadi studio; jembatan ke Peekabo live              | tayang / tahan |
| 5   | STD-02               | Kelistrikan stabil untuk perangkat siaran | Perangkat menyala stabil dan aman untuk pemakaian berjam-jam    | Proyek utuh dari hulu ke hilir | Instalasi listrik dikerjakan mitra instalatir berwenang. | “dan listrik”: bertanda †, dikerjakan mitra instalatir berwenang | tayang / tahan |
| 6   | STD-08               | Studio podcast kecil                      | Ruang rekam sederhana dengan akustik yang terkendali            | Proyek utuh dari hulu ke hilir |                                                          | Podcaster                                                        | tayang / tahan |

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

6 dari 10 offer. Pintu masuk: **HOS-09**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                | Dampak untuk web                                                              | Jenis                          | †   | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------ | --- | ----------------------------------------------------- | -------------- |
| 1   | HOS-09 (pintu masuk) | Makeover cepat antarpenyewa                    | Unit dibenahi segera setelah penyewa pergi, sebelum penyewa berikutnya masuk. | Bangunan yang lebih produktif  |     | Langkah terkecil: unit dibenahi di antara dua penyewa | tayang / tahan |
| 2   | HOS-05               | Kamar mandi dan sanitasi yang layak            | Kamar mandi bersih, kering, dan tahan lama                                    | Proyek utuh dari hulu ke hilir |     | Kamar mandi yang layak                                | tayang / tahan |
| 3   | HOS-02               | Kontrakan siap sewa kembali                    | Kontrakan kusam dibenahi sampai layak disewakan kembali.                      | Bangunan yang lebih produktif  |     | “Properti saya kusam dan sulit disewakan”             | tayang / tahan |
| 4   | HOS-07               | Atap dan lapisan kedap air untuk musim hujan   | Kebocoran tidak mengganggu tamu                                               | Proyek utuh dari hulu ke hilir |     | Kebocoran musim hujan yang mengganggu tamu            | tayang / tahan |
| 5   | HOS-01               | Makeover villa yang siap difoto dan ditawarkan | Villa dibenahi sampai layak tampil di foto dan siap ditawarkan ulang.         | Bangunan yang lebih produktif  |     | Villa yang siap difoto dan ditawarkan                 | tayang / tahan |
| 6   | HOS-10               | Bangun kos siap huni                           | Bangunan kos baru selesai dengan anggaran yang terkendali                     | Proyek utuh dari hulu ke hilir |     | Investor: kos baru                                    | tayang / tahan |

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

5 dari 12 offer. Pintu masuk: **RWT-02**. Aturan: lolos.

| #   | ID                   | Judul untuk web                               | Dampak untuk web                                                     | Jenis             | †   | Alasan                                                     | Keputusan Anda |
| --- | -------------------- | --------------------------------------------- | -------------------------------------------------------------------- | ----------------- | --- | ---------------------------------------------------------- | -------------- |
| 1   | RWT-02 (pintu masuk) | Inspeksi bulanan dengan laporan foto          | Kondisi bangunan terlihat tanpa Anda harus datang                    | Perawatan berkala |     | “tidak ada yang merawatnya secara rutin”: inspeksi bulanan | tayang / tahan |
| 2   | RWT-04               | Perawatan atap dan talang sebelum musim hujan | Kebocoran dicegah sebelum terjadi                                    | Perawatan berkala |     | Kebocoran dicegah sebelum musim hujan                      | tayang / tahan |
| 3   | RWT-10               | Laporan kondisi berkala                       | Data kondisi bangunan menjadi dasar keputusan perawatan dan renovasi | Perawatan berkala |     | Laporan kondisi yang bisa dibaca                           | tayang / tahan |
| 4   | RWT-05               | Perawatan cat dan fasad berkala               | Bangunan tetap segar dan nilainya terjaga                            | Perawatan berkala |     | “cepat kusam”: cat dan fasad berkala                       | tayang / tahan |
| 5   | RWT-03               | Tim siaga perbaikan darurat                   | Kerusakan mendadak ditangani dalam waktu yang disepakati             | Perawatan berkala |     | Kerusakan mendadak                                         | tayang / tahan |

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

3 dari 6 offer. Pintu masuk: **KOM-01**. Aturan: lolos.

| #   | ID                   | Judul untuk web                                       | Dampak untuk web                                                               | Jenis                                | †                                                                         | Alasan                                                | Keputusan Anda |
| --- | -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------- | -------------- |
| 1   | KOM-01 (pintu masuk) | Pembiayaan renovasi lewat mitra                       | Renovasi dibiayai lewat mitra pembiayaan dengan syarat yang dijelaskan terbuka | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | “Saya butuh pembiayaan”: renovasi lewat mitra berizin | tayang / tahan |
| 2   | KOM-06               | Pembiayaan peralatan usaha lewat mitra                | Peralatan dapur atau studio dibiayai lewat mitra                               | Modal, alat, dan jaminan lewat mitra | Kami tidak memberi pinjaman; pembiayaan dan syaratnya dari mitra berizin. | Peralatan dapur atau studio lewat mitra               | tayang / tahan |
| 3   | KOM-03               | Jual atau sewakan properti hasil makeover lewat mitra | Properti hasil makeover dipasarkan lewat mitra properti                        | Modal, alat, dan jaminan lewat mitra | Penjualan dan sewa dijalankan perantara properti berizin.                 | Properti hasil makeover lewat perantara berizin       | tayang / tahan |

<details><summary>Tidak diusulkan</summary>

| ID     | Judul                                        | Alasan                                                              |
| ------ | -------------------------------------------- | ------------------------------------------------------------------- |
| KOM-02 | Asuransi bangunan lewat mitra                | Mitra asuransi belum ada (master brief, jalur komisi)               |
| KOM-04 | Penilaian nilai properti sebelum dan sesudah | “Kenaikan nilai terukur” adalah hasil pasar, bukan pekerjaan Arthur |
| KOM-05 | Sewa alat berat untuk kavling lewat mitra    | Mitra sewa alat berat belum ada                                     |

</details>

Catatan: Bab ini tepat tiga offer. Halaman memuat kalimat wajib pembiayaan dan pengungkapan komisi; mitra tidak disebut namanya. Bila Anda lebih suka menahan bab ini sampai kartu komisi ada, bab tampil sebagai situasi tanpa halaman.
