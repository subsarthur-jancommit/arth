# Serah Inggris R7, batch pertama (draf)

Tanggal: 1 November 2026 · Status: draf, menunggu persetujuan pemilik per
blok · Dasar: R7 di `docs/RENCANA-REVISI-F3.md`, K2 di
`docs/PROGRES-ARTHUR.md`, dan `docs/R1-GLOSARIUM-PEMBACA.md`

Dokumen ini berisi aturan suara Inggris dan copy Inggris untuk halaman yang
copy Indonesianya sudah disetujui dan tayang: beranda, tiga unit, enam halaman
pembaca (termasuk `/peekabo/jaringan`), `/metode`, `/layanan`, `/pembayaran`,
dan `/kontak`. Dasarnya jawaban pemilik pada 31 Oktober 2026 lewat sesi
koordinator: "Ya, siapkan draf".

Tidak ada yang ditulis ke Sanity dan tidak ada kode yang berubah. Selama K2
belum diubah tertulis, setiap `/en` tetap dialihkan 307 ke `/id`. Blok yang
disetujui ditulis di langkah sesudahnya: isi Sanity dengan izin `ok tulis`
tersendiri (`docs/PROSEDUR-KERJA.md` §6), teks antarmuka lewat PR kode.
Halaman `/en` baru dibuka bila semua bloknya disetujui, pengalih bahasa
kembali, dan K2 diubah tertulis, sesuai syarat selesai R7.

## Cara menyetujui

- Setiap blok punya kode, misalnya **B1** atau **SK-A2**. Jawaban cukup
  "setuju semua", atau "setuju kecuali UT2: …" disertai perubahan yang diminta.
- Setiap baris memuat jalur medan Sanity atau kunci `messages`, teks Indonesia
  yang tayang (ID), dan usulan Inggris (EN). Jalur itu dipakai apa adanya saat
  menulis.
- Blok **S** (aturan suara) disetujui lebih dulu atau bersamaan, karena blok
  lain ditulis menurutnya.

## Sumber

- Teks Indonesia dibaca 31 Oktober 2026 sekitar 14.30 UTC dari ekspor publik
  dataset `production` (391 dokumen, sha256 `2bec92cb366d…`) dan dari 14
  halaman produksi (`https://arth-test-01.vercel.app/id/…`), supaya teks yang
  dirender dari kode ikut terbaca.
- Kebijakan tidak termasuk: teks Indonesianya masih bertanda tinjauan hukum.
- Alamat contoh di `siteSettings.alamat` tidak diterjemahkan karena tidak
  tampil (P4).

## 1. Aturan suara Inggris (blok S)

Berlaku untuk semua teks Inggris di situs, baik isi Sanity maupun
`messages/en.json`.

1. **Pembaca.** Pemilik usaha dan mitra yang membaca bahasa Inggris, sering
   sebagai bahasa kedua. Bahasa Inggris internasional yang polos: kata umum,
   satu gagasan per kalimat, dan paling banyak 25 kata per kalimat seperti
   gerbang gaya Indonesia. Medan verbatim (S3) mengikuti panjang kalimat
   pemilik; gerbang gaya pun tidak memberi peringatan untuk medan itu. Ejaan
   Britania, mengikuti `messages/en.json` dan glosarium: programme,
   neighbour, labour, licence, organise.
2. **Sapaan.** "We" untuk Arthur dan "you" untuk pembaca (glosarium §7).
   Tanpa kontraksi ("do not", bukan "don't"), karena lebih mudah dibaca
   penutur bahasa kedua dan janji terdengar tegas.
3. **Makna dan suara, bukan kata demi kata.** Susunan kalimat boleh berubah,
   tetapi tidak ada klaim, angka, atau janji yang ditambahkan, dan tidak ada
   batas yang dibuang. Medan yang disalin apa adanya dari header pemilik
   (`VERBATIM_FIELDS` di `lib/content/style-gate.ts`: kepala beranda dan unit,
   pilar, ringkas, ajakan, kalimat jujur, dan judul halaman pembaca)
   diterjemahkan sedekat mungkin.
4. **Nama unit tidak diterjemahkan** (glosarium §2 dan §9.1). Pada sebutan
   pertama di kalimat berjalan di sebuah halaman: "Konstruksi, our
   construction unit", "Teknologi, our systems unit", dan "Peekabo, our
   agency". Sesudahnya cukup namanya. Label, menu, dan judul kecil memakai
   nama saja. Kata "unit" tetap tampil, huruf kecil di tengah kalimat.
5. **Kata katalog tidak tampil** (glosarium §1): side, chapter, offer, layer,
   tier, kode modul, dan kode katalog. Penggantinya label pembaca (§3),
   "situation", dan "work". Bila teks Indonesia yang tayang masih memuat kata
   katalog, Inggrisnya memakai pengganti glosarium dan temuannya dicatat di
   bagian 16.
6. **Label pembaca** mengikuti glosarium §3: For people running projects, For
   building owners, For owners who want it ready to use, For developers and
   technical teams, For business owners and brands. Label Peekabo untuk
   penjual mengikuti label Indonesia yang tayang sekarang: For the sales
   network (catatan 16.2).
7. **Tanda baca** mengikuti gerbang gaya, yang membaca nilai bahasa apa pun
   dan menolak terbit bila menemukan tanda pisah (– dan —), tanda hubung
   berspasi, tanda seru, atau emoji, termasuk di medan verbatim. Koma serial dipakai ("scope, price, and reports"), sama
   dengan pola "A, B, dan C" di teks Indonesia. Apostrof dan tanda kutip
   tipografis (’ “ ”). Judul dan label hanya berhuruf kapital di awal. Titik
   di akhir dipertahankan bila teks Indonesianya bertitik.
8. **Kata yang tidak dipakai.** Gerbang gaya memberi peringatan untuk kata
   Inggris di `BANNED_PHRASES` pada nilai bahasa apa pun: boost, growth,
   leverage, insight, level up, game changer, one-stop, end-to-end, dan
   seamless. Padanan larangan Indonesia juga tidak dipakai walau belum diuji
   mesin: the best, a trusted partner, leading, top, number one, reliable,
   solution, guaranteed,
   maximise, optimise, accelerate, transform, next level, not just, more than
   just, not only, moreover, furthermore, therefore, it is worth noting, your
   needs, various, a wide range of, contact us now, do not miss, very, really,
   truly, fully, significantly, effective and efficient. Begitu pula unlock,
   empower, elevate, cutting-edge, world-class, journey, dan passionate.
   Karena "end-to-end" dilarang, "dari hulu ke hilir" menjadi "from start to
   finish".
9. **Istilah yang tetap:** bot, workflow, Membership Care, Starter package,
   Integrator package, nama platform (TikTok Shop by Tokopedia, Shopee, Meta,
   Google, WhatsApp, QRIS), dan Subang, Purwakarta, Bandung. "Live" untuk
   siaran jualan menjadi "live selling" atau "go live", "host live" menjadi
   "live host", "sales" untuk orang menjadi "sales staff", "leads" tetap, dan
   "closing" menjadi "until the sale closes".
10. **Uang dan janji** memakai satu padanan di seluruh situs, menurut tabel di
    bawah. Komisi selalu disebut. Tidak ada angka penghasilan, tarif, atau
    besar bagian.
11. **Tombol** muat satu baris pada lebar 390 px (glosarium §6). Bila
    padanannya terlalu panjang, versi pendek ditulis di catatan blok.

Kalimat tetap, sama di setiap halaman:

| Indonesia                                                                                                              | Inggris                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai.                                         | Scope, price, targets, and reports are agreed in writing before work starts.                                                                                                      |
| Lingkup dan harga disepakati tertulis sebelum kerja dimulai.                                                           | Scope and price are agreed in writing before work starts.                                                                                                                         |
| Kami tidak menjanjikan keuntungan instan.                                                                              | We do not promise instant profit.                                                                                                                                                 |
| Sistem, data, kode, dan merek tetap milik Anda.                                                                        | The systems, data, code, and brand stay yours.                                                                                                                                    |
| Kode, akses, dan dokumentasi diserahkan kepada Anda.                                                                   | Code, access, and documentation are handed over to you.                                                                                                                           |
| Tenaga ahli bekerja di lapangan proyek Anda; nama atau sertifikat tidak dipinjamkan.                                   | Our experts work on your project site; we do not lend out names or certificates.                                                                                                  |
| Penyedia layanan bisa membayar kami komisi, di luar biaya yang Anda bayar kepada kami. Kami menyebutkannya sejak awal. | A service provider may pay us a commission, separate from what you pay us. We tell you this from the start.                                                                       |
| Kami tidak memberi pinjaman dan tidak mengelola dana Anda.                                                             | We do not lend money and we do not manage your funds.                                                                                                                             |
| Kalimat jujur Teknologi (glosarium §10.5)                                                                              | We do not build from scratch when a mature service already solves the problem; we suggest that service first, and we tell you honestly when you do not need to buy something yet. |
| Ceritakan masalahnya.                                                                                                  | Tell us the problem.                                                                                                                                                              |
| Kami tentukan unit mana yang bekerja lebih dulu.                                                                       | We decide which unit works first.                                                                                                                                                 |
| Setiap unit tetap bisa dibeli sendiri.                                                                                 | Each unit can also be hired on its own.                                                                                                                                           |
| Rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan.                                                        | A possible sequence, not a project we have done.                                                                                                                                  |
| … sebelum angka apa pun disebut                                                                                        | … before any figure is given                                                                                                                                                      |
| dari hulu ke hilir                                                                                                     | from start to finish                                                                                                                                                              |
| biaya pembangunan, kemitraan bagi hasil                                                                                | a build fee, a revenue-share partnership                                                                                                                                          |
| Cocok bila …                                                                                                           | Suits you if …                                                                                                                                                                    |

## 2. Beranda

Dokumen `siteSettings`. Kartu unit di beranda memakai `judul` dan `ringkas`
dokumen unit (blok UK1, UT1, dan UP1).

### B1 · Kepala dan ringkasan

- `heroJudul`
  - ID: Proyek jalan. Sistem bekerja. Pasar bertambah.
  - EN: Projects move. Systems work. Markets grow.
- `heroSubjudul`
  - ID: Konstruksi sipil, sistem teknologi, dan agency marketshare untuk Subang, Purwakarta, dan Bandung.
  - EN: Civil construction, technology systems, and a market-share agency for Subang, Purwakarta, and Bandung.
- `ringkas`
  - ID: Arthur mengisi celah proyek konstruksi, membangun sistem yang membuka pasar dan bekerja sendiri, lalu merebut pasar lewat agency Peekabo, di Subang, Purwakarta, dan Bandung.
  - EN: Arthur fills the gaps in construction projects, builds systems that open markets and run on their own, then wins market share through Peekabo, our agency, in Subang, Purwakarta, and Bandung.

### B2 · Pilih situasi Anda

- `situasi[kontraktor-hulu-hilir].teks`
  - ID: Kontraktor utama sudah menang paket, tetapi belum punya subkon yang sanggup dari hulu ke hilir.
  - EN: A main contractor has won the package but has no subcontractor who can carry it from start to finish.
- `situasi[subkon-kekurangan].teks`
  - ID: Subkon kekurangan tenaga, material, alat, atau modal kerja.
  - EN: A subcontractor is short of labour, materials, equipment, or working capital.
- `situasi[penyedia-barang].teks`
  - ID: Penyedia barang pemerintah bingung soal sumber barang dan margin.
  - EN: A government goods supplier is unsure about sourcing and margins.
- `situasi[rumah-tanpa-repot].teks`
  - ID: Pemilik rumah ingin membangun atau merenovasi tanpa repot.
  - EN: A homeowner wants to build or renovate without the hassle.
- `situasi[bangunan-produktif].teks`
  - ID: Pemilik kafe, studio, atau penginapan ingin bangunannya lebih produktif.
  - EN: A café, studio, or guesthouse owner wants a more productive building.
- `situasi[properti-terjaga].teks`
  - ID: Pemilik properti ingin nilai bangunannya terjaga.
  - EN: A property owner wants the building to hold its value.
- `situasi[pekerjaan-berulang].teks`
  - ID: Pemilik usaha kewalahan dengan pekerjaan berulang: pesanan, tagihan, laporan.
  - EN: A business owner is swamped by repetitive work: orders, invoices, reports.
- `situasi[pendapatan-baru].teks`
  - ID: Pemilik usaha ingin kanal pendapatan baru di samping usahanya.
  - EN: A business owner wants a new revenue channel alongside the business.
- `situasi[titik-teknis].teks`
  - ID: Developer, agensi, atau tim IT tersendat di titik teknis tertentu.
  - EN: A developer, agency, or IT team is stuck at a specific technical point.
- `situasi[belum-dikenal].teks`
  - ID: Usaha belum dikenal, belum dipercaya, atau pembelinya tidak kembali.
  - EN: A business is not yet known, not yet trusted, or its buyers do not come back.
- `situasi[leads-tidak-closing].teks`
  - ID: Leads masuk, tetapi tidak ada yang menindaklanjuti sampai closing.
  - EN: Leads come in, but nobody follows them up until the sale closes.
- `situasi[live-afiliasi].teks`
  - ID: Seller ingin live atau afiliasi di TikTok Shop dan Shopee.
  - EN: A seller wants to go live or run affiliate sales on TikTok Shop and Shopee.
- `situasi[hadir-di-warga].teks`
  - ID: Brand ingin hadir di tengah warga.
  - EN: A brand wants to show up in people’s neighbourhoods.
- `situasi[ikut-menjual].teks`
  - ID: Seseorang ingin ikut menjual, menjadi anggota komunitas, atau menjadi host.
  - EN: Someone wants to help sell, join the community, or become a host.

### B3 · Tentang Arthur

- `heroPembuka`
  - ID: Usaha jarang berhenti karena satu masalah besar. Usaha tersendat di tiga tempat: proyek yang macet di celah administrasi, tenaga, material, dan modal; pekerjaan berulang yang masih dikerjakan tangan; dan pasar yang belum cukup mengenal, memercayai, dan membeli. Kami bekerja di ketiga tempat itu lewat tiga unit.
  - EN: A business rarely stops because of one big problem. It stalls in three places: projects stuck in gaps of paperwork, labour, materials, and capital; repetitive work still done by hand; and a market that does not yet know, trust, or buy from you enough. We work in all three places through three units.
- `pilar[pilar-1].lead`
  - ID: Kami mengisi celah proyek dan membangun sampai jadi.
  - EN: We fill project gaps and see the build through.
- `pilar[pilar-1].isi`
  - ID: Unit Konstruksi mengambil bagian proyek yang tidak sempat atau tidak sanggup Anda tangani, dari administrasi dengan pemerintah sampai tenaga, material, alat, dan modal kerja yang dijembatani mitra. Bagi pemilik bangunan, kami membangun dari hulu ke hilir, lalu merawatnya lewat Membership Care.
  - EN: Konstruksi, our construction unit, takes on the parts of a project you have no time for or cannot handle: from paperwork with the government to labour, materials, equipment, and working capital bridged through partners. For building owners, we build from start to finish, then look after the building through Membership Care.
- `pilar[pilar-2].lead`
  - ID: Kami membuka pasar baru dan mengotomatiskan sisanya.
  - EN: We open new markets and automate the rest.
- `pilar[pilar-2].isi`
  - ID: Unit Teknologi membuka kanal pendapatan yang berjalan di samping usaha Anda, lalu memasang bot dan workflow yang menjawab, menagih, dan memantau tanpa menunggu diingatkan.
  - EN: Teknologi, our systems unit, opens revenue channels that run alongside your business, then sets up bots and workflows that reply, bill, and monitor without waiting to be reminded.
- `pilar[pilar-3].lead`
  - ID: Kami merebut pasar.
  - EN: We win market share.
- `pilar[pilar-3].isi`
  - ID: Unit Agency, Peekabo, membuat usaha Anda dikenal lewat iklan dan aset yang diproduksi massal, dipercaya lewat kampanye di lapangan, lalu dibeli lewat kreator, host live, sales, dan komunitas yang ikut menjualkan.
  - EN: Peekabo, our agency, makes your business known through ads and assets produced in volume, trusted through campaigns on the ground, then bought through creators, live hosts, sales staff, and a community that sells for you.
- `pilar[pilar-4].lead`
  - ID: Satu klien, tiga unit.
  - EN: One client, three units.
- `pilar[pilar-4].isi`
  - ID: Kafe yang kami bangun bisa langsung memakai pemesanan dan pembayaran dari meja, lalu dibuka dengan kampanye pembukaan gerai. Studio siaran yang kami bangun bisa langsung dipakai host live. Setiap unit tetap bisa dibeli sendiri.
  - EN: A café we build can take orders and payments at the table from day one, then open with a launch campaign. A broadcast studio we build is ready for live hosts straight away. Each unit can also be hired on its own.

### B4 · Cara kami bekerja

Tampil sebagai daftar, satu kalimat per baris.

- `pilar[pilar-5].lead`
  - ID: Cara kami bekerja.
  - EN: How we work.
- `pilar[pilar-5].isi`
  - ID: Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai. Tenaga ahli bekerja di lapangan proyek Anda; nama atau sertifikat tidak dipinjamkan. Sistem, data, kode, dan merek tetap milik Anda. Komisi dari mitra kami ungkapkan, dan jaringan penjual kami dibayar dari penjualan yang benar-benar terjadi. Kami tidak menjanjikan keuntungan instan.
  - EN: Scope, price, targets, and reports are agreed in writing before work starts. Our experts work on your project site; we do not lend out names or certificates. The systems, data, code, and brand stay yours. We disclose commission from partners, and our sales network is paid from sales that actually happen. We do not promise instant profit.

### B5 · Langkah pertama

Tampil sebagai satu judul: label, lalu kalimat sesudahnya.

- `ajakan.label`
  - ID: Ceritakan masalahnya.
  - EN: Tell us the problem.
- `ajakan.sesudahnya`
  - ID: Kami tentukan unit mana yang bekerja lebih dulu.
  - EN: We decide which unit works first.

## 3. Unit Konstruksi

Dokumen `unit` `9064604d-6421-4247-a7cf-93f01dd29529`, `/konstruksi`. `nama`
tetap "Konstruksi".

### UK1 · Kepala

- `judul` (juga di beranda)
  - ID: Isi celahnya. Bangun sampai jadi. Rawat sesudahnya.
  - EN: Fill the gaps. See the build through. Then look after it.
- `subjudul`
  - ID: Konstruksi sipil dari hulu ke hilir untuk Subang, Purwakarta, dan Bandung.
  - EN: Civil construction from start to finish for Subang, Purwakarta, and Bandung.
- `pembuka`
  - ID: Proyek konstruksi jarang tersendat karena tidak ada yang mampu membangun. Proyek tersendat di celah-celah: dokumen yang belum siap, tukang yang belum datang, material yang belum tiba atau harganya bergeser, modal yang belum cair, dan laporan yang belum jadi. Kami bekerja di celah-celah itu.
  - EN: Construction projects rarely stall because nobody can build. They stall in the gaps: documents not ready, workers not on site, materials late or changing in price, capital not yet released, and reports not finished. We work in those gaps.
- `ringkas` (kartu di beranda)
  - ID: Kami mengisi celah di proyek konstruksi, membangun sampai jadi, dan merawatnya sesudahnya, di Subang, Purwakarta, dan Bandung.
  - EN: We fill the gaps in construction projects, see the build through, and look after it afterwards, in Subang, Purwakarta, and Bandung.

### UK2 · Yang kami kerjakan

- `pilar[pilar-1].lead`
  - ID: Kami mengisi celah.
  - EN: We fill the gaps.
- `pilar[pilar-1].isi`
  - ID: Bagi kontraktor utama, subkontraktor, developer, dan penyedia barang, kami mengambil bagian yang tidak sempat atau tidak sanggup Anda tangani: administrasi dengan pemerintah, tenaga kerja, material, alat, laporan proyek, sampai penjembatanan modal kerja. Anda membeli per masalah, atau menyerahkan seluruh lingkup pekerjaan dari hulu ke hilir dalam satu paket.
  - EN: For main contractors, subcontractors, developers, and goods suppliers, we take on the parts you have no time for or cannot handle: paperwork with the government, labour, materials, equipment, project reports, and bridging for working capital. You can hire us one problem at a time, or hand over the whole scope of work, from start to finish, in one package.
- `pilar[pilar-2].lead`
  - ID: Kami membangun sampai jadi.
  - EN: We see the build through.
- `pilar[pilar-2].isi`
  - ID: Bagi pemilik rumah, pemilik usaha, dan pemilik properti, kami mengurus proyek dari hulu ke hilir: estimasi, desain teknis dan visualisasi interior, pekerjaan lapangan, sampai serah terima. Anda tidak perlu mengurus tukang, material, dan jadwal satu per satu.
  - EN: For homeowners, business owners, and property owners, we run the project from start to finish: estimates, technical design and interior visuals, site work, and handover. You do not have to manage workers, materials, and schedules one by one.
- `pilar[pilar-3].lead`
  - ID: Kami membuat bangunan bekerja lebih produktif.
  - EN: We make buildings more productive.
- `pilar[pilar-3].isi`
  - ID: Bagi pemilik kafe dan dapur produksi, studio streaming dan workshop media, serta villa, kontrakan, hotel, dan hostel, kami menyesuaikan bangunan dengan cara industrinya mencari uang: alur pelanggan yang lebih cepat, ruang yang lebih tenang, kamar yang lebih layak jual.
  - EN: For owners of cafés and production kitchens, streaming studios and media workshops, and villas, rental houses, hotels, and hostels, we fit the building to the way that trade makes money: a faster flow of customers, quieter spaces, rooms that are easier to rent out.
- `pilar[pilar-4].lead`
  - ID: Kami merawat sesudahnya.
  - EN: We look after it afterwards.
- `pilar[pilar-4].isi`
  - ID: Lewat Membership Care, pekerja kami menjaga kondisi dan estetika properti Anda secara berkala dan melaporkannya, sehingga nilai bangunan tidak turun karena dibiarkan.
  - EN: Through Membership Care, our crew keeps your property’s condition and appearance in shape on a regular schedule and reports on it, so the building does not lose value through neglect.
- `pilar[pilar-5].lead`
  - ID: Kami bekerja di tiga wilayah yang kami kenal.
  - EN: We work in three areas we know.
- `pilar[pilar-5].isi`
  - ID: Subang, Purwakarta, dan Bandung. Kepercayaan di proyek lapangan dibangun satu wilayah demi satu wilayah, bersama pemasok, tukang, dan kebiasaan pengadaan yang sudah kami kenal.
  - EN: Subang, Purwakarta, and Bandung. Trust on site is built one area at a time, with suppliers, workers, and procurement habits we already know.
- `pilar[pilar-6].lead`
  - ID: Cara kami bekerja.
  - EN: How we work.
- `pilar[pilar-6].isi`
  - ID: Kami berkata jujur tentang apa yang bisa dan tidak bisa kami kerjakan. Tenaga ahli kami bekerja di lapangan proyek Anda; kami tidak meminjamkan nama atau sertifikat untuk memenuhi syarat tender. Layanan administrasi membantu Anda menyiapkan dan memahami aturan, bukan mengatur hasil. Lingkup dan harga disepakati tertulis sebelum kerja dimulai.
  - EN: We are honest about what we can and cannot do. Our experts work on your project site; we do not lend out names or certificates to meet tender requirements. Our paperwork service helps you prepare and understand the rules, not arrange the outcome. Scope and price are agreed in writing before work starts.

### UK3 · Masalah yang dijawab

- `masalah[masalah-1].teks`
  - ID: Dokumen tender, termin, dan izin belum siap.
  - EN: Tender documents, progress payment claims, and permits are not ready.
- `masalah[masalah-2].teks`
  - ID: Tukang tidak datang tepat waktu dan tidak ada pengendalinya.
  - EN: Workers do not turn up on time and nobody is in charge of them.
- `masalah[masalah-3].teks`
  - ID: Harga material bergeser dan barang datang terlambat.
  - EN: Material prices shift and deliveries arrive late.
- `masalah[masalah-4].teks`
  - ID: Uang muka belum cair, padahal material harus dibayar dulu.
  - EN: The down payment has not been released, but materials must be paid for first.
- `masalah[masalah-5].teks`
  - ID: Laporan lewat chat dan biaya lapangan tidak terpantau.
  - EN: Reports arrive by chat and site costs go untracked.
- `masalah[masalah-6].teks`
  - ID: Anggaran rumah membengkak dan pekerjaannya tidak diawasi.
  - EN: The house budget balloons and nobody supervises the work.

### UK4 · Langkah kerja

- `caraKerja[kerja-1].teks`
  - ID: Ceritakan bangunan atau proyeknya, dengan bahasa Anda sendiri.
  - EN: Tell us about the building or the project, in your own words.
- `caraKerja[kerja-2].teks`
  - ID: Kami tentukan sisinya: pelaku proyek atau pemilik bangunan.
  - EN: We work out where you stand: running a project, or owning the building.
  - Catatan: "sisi" kata katalog (catatan 16.1).
- `caraKerja[kerja-3].teks`
  - ID: Kondisi lapangan dilihat langsung sebelum angka apa pun disebut.
  - EN: We see the site in person before any figure is given.
- `caraKerja[kerja-4].teks`
  - ID: Lingkup dan harga disepakati tertulis sebelum kerja dimulai.
  - EN: Scope and price are agreed in writing before work starts.

### UK5 · Langkah pertama

- `ajakan.label`
  - ID: Ceritakan bangunan atau proyeknya.
  - EN: Tell us about the building or the project.
- `ajakan.sesudahnya`
  - ID: Kami tentukan celah mana yang kami isi.
  - EN: We decide which gaps we fill.

## 4. Unit Teknologi

Dokumen `unit` `1614a52e-6c90-4f9a-a8d9-a0c513140aba`, `/teknologi`. `nama`
tetap "Teknologi".

### UT1 · Kepala

- `judul` (juga di beranda)
  - ID: Buka pasar baru. Otomatiskan sisanya.
  - EN: Open new markets. Automate the rest.
- `subjudul`
  - ID: Bot dan workflow yang bekerja dua puluh empat jam untuk bisnis Anda, di sektor apa pun.
  - EN: Bots and workflows that work twenty-four hours a day for your business, in any sector.
- `pembuka`
  - ID: Kebanyakan bisnis tidak kekurangan aplikasi. Yang mereka kekurangan ada dua: pasar yang belum terbuka, dan pekerjaan berulang yang masih dikerjakan tangan manusia. Kami bekerja tepat di dua titik itu.
  - EN: Most businesses do not lack apps. What they lack is two things: markets not yet opened, and repetitive work still done by human hands. We work at exactly those two points.
- `ringkas` (kartu di beranda)
  - ID: Kami membuka pasar baru dan mengotomatiskan pekerjaan berulang lewat bot dan workflow, di sektor apa pun.
  - EN: We open new markets and automate repetitive work through bots and workflows, in any sector.

### UT2 · Yang kami kerjakan

- `pilar[pilar-1].lead`
  - ID: Kami membuka pasar.
  - EN: We open markets.
- `pilar[pilar-1].isi`
  - ID: Dari usaha yang sudah berjalan, kami membuka kanal pendapatan yang berjalan berdampingan dengannya: lini pulsa dan tagihan, langganan, marketplace, toko produk digital, agen tiket dan travel, layanan yang menyatukan beberapa vendor, merek putih yang disewakan, sampai mesin bayar-per-pakai. Tujuannya bukan menggantikan usaha Anda hari ini, melainkan membuat pendapatan Anda tidak bergantung pada satu sumber.
  - EN: From a business that is already running, we open revenue channels that run alongside it: mobile top-ups and bill payments, subscriptions, marketplaces, digital product shops, ticket and travel agencies, services that bring several vendors together, white-label brands you lease out, and pay-per-use machines. The aim is not to replace your business today, but to stop your income depending on a single source.
- `pilar[pilar-2].lead`
  - ID: Kami mengotomatiskan pekerjaan.
  - EN: We automate the work.
- `pilar[pilar-2].isi`
  - ID: Bot kami menjawab, menagih, memantau, dan bertransaksi pukul tiga pagi, ketika tidak ada orang yang berjaga. Workflow kami memindahkan pesanan, permohonan, dan tagihan dari satu tangan ke tangan berikutnya tanpa menunggu diingatkan.
  - EN: Our bots reply, bill, monitor, and transact at three in the morning, when nobody is on watch. Our workflows move orders, requests, and invoices from one pair of hands to the next without waiting to be reminded.
- `pilar[pilar-3].lead`
  - ID: Sektornya bisa apa saja, karena mesinnya sama.
  - EN: The sector can be anything, because the engine is the same.
- `pilar[pilar-3].isi`
  - ID: Kuliner, ritel, pendidikan, kesehatan, properti, konstruksi, logistik, keuangan, sampai instansi: yang berbeda hanya masalahnya. Karena itu kami tidak memulai dari daftar layanan. Kami memulai dari masalah yang Anda ceritakan, lalu menentukan apakah jawabannya bot, workflow, atau pasar baru.
  - EN: Food, retail, education, health, property, construction, logistics, finance, and public agencies: only the problem differs. So we do not start from a list of services. We start from the problem you tell us, then decide whether the answer is a bot, a workflow, or a new market.
- `pilar[pilar-4].lead`
  - ID: Di balik layar ada lapisan data yang menentukan umur semuanya.
  - EN: Behind the scenes, a data layer decides how long everything lasts.
- `pilar[pilar-4].isi`
  - ID: Basis data relasional untuk transaksi yang tidak boleh salah, data waktu nyata untuk hal yang tidak boleh terlambat, dan graf relasi untuk hal yang tersembunyi di dalam hubungan: rekomendasi, pola kecurangan, peta pemasok, dan pengetahuan perusahaan yang bisa ditanya.
  - EN: Relational databases for transactions that must not be wrong, real-time data for what must not be late, and relationship graphs for what hides in connections: recommendations, fraud patterns, supplier maps, and company knowledge that answers your questions.
- `pilar[pilar-5].lead`
  - ID: Dua pintu masuk.
  - EN: Two ways in.
- `pilar[pilar-5].isi`
  - ID: Jika Anda memahami teknis, seperti developer, agensi, software house, atau CTO, masuklah lewat Sisi A: spesialis untuk titik macet yang sedang menghambat Anda. Jika Anda menginginkan hasil akhir yang siap dipakai, masuklah lewat Sisi B: kami mulai dari pasar yang ingin Anda buka atau pekerjaan yang ingin Anda lepaskan dari tangan manusia.
  - EN: If you are technical, such as a developer, an agency, a software house, or a CTO, start with “For developers and technical teams”: specialists for the sticking point that is holding you back. If you want a finished result that is ready to use, start with “For owners who want it ready to use”: we begin with the market you want to open or the work you want to take off human hands.
  - Catatan: "Sisi A" dan "Sisi B" kata katalog; Inggrisnya memakai label pembaca (catatan 16.1).
- `pilar[pilar-6].lead`
  - ID: Cara kami bekerja.
  - EN: How we work.
- `pilar[pilar-6].isi`
  - ID: Kami tidak membangun dari nol bila layanan yang sudah matang menyelesaikan masalahnya; kami menyarankannya lebih dulu, dan berkata jujur bila sesuatu belum perlu Anda beli. Bisnisnya milik Anda, mereknya milik Anda, datanya milik Anda; kode, akses, dan dokumentasi diserahkan kepada Anda. Kami tidak menjanjikan keuntungan instan. Yang kami berikan adalah perhitungan yang terbuka, otomatisasi yang bekerja, dan pendampingan sampai berjalan. Pembayaran fleksibel: biaya pembangunan, atau kemitraan bagi hasil.
  - EN: We do not build from scratch when a mature service already solves the problem; we suggest that service first, and we tell you honestly when you do not need to buy something yet. The business is yours, the brand is yours, the data is yours; code, access, and documentation are handed over to you. We do not promise instant profit. What we give you is open numbers, automation that works, and support until it runs. Payment is flexible: a build fee, or a revenue-share partnership.

### UT3 · Masalah yang dijawab

- `masalah[masalah-1].teks`
  - ID: Pendapatan masih bergantung pada satu sumber.
  - EN: Income still depends on a single source.
- `masalah[masalah-2].teks`
  - ID: Pesanan, tagihan, dan laporan masih dikerjakan tangan.
  - EN: Orders, invoices, and reports are still done by hand.
- `masalah[masalah-3].teks`
  - ID: Pekerjaan berulang menyita waktu tim Anda.
  - EN: Repetitive work eats up your team’s time.
- `masalah[masalah-4].teks`
  - ID: Data lambat, terlambat, atau tidak terhubung satu sama lain.
  - EN: Data is slow, late, or not connected.
- `masalah[masalah-5].teks`
  - ID: Tenggat ketat dan spesialis sulit dicari.
  - EN: Deadlines are tight and specialists are hard to find.

### UT4 · Langkah kerja

- `caraKerja[kerja-1].teks`
  - ID: Ceritakan masalahnya dengan bahasa Anda sendiri.
  - EN: Tell us the problem in your own words.
- `caraKerja[kerja-2].teks`
  - ID: Kami tentukan jawabannya: bot, workflow, atau pasar baru.
  - EN: We decide the answer: a bot, a workflow, or a new market.
- `caraKerja[kerja-3].teks`
  - ID: Layanan yang sudah matang disarankan lebih dulu.
  - EN: A mature service is suggested first.
- `caraKerja[kerja-4].teks`
  - ID: Kode, akses, data, dan dokumentasi diserahkan kepada Anda.
  - EN: Code, access, data, and documentation are handed over to you.

### UT5 · Langkah pertama dan kalimat jujur

- `ajakan.label`
  - ID: Sampaikan masalahnya.
  - EN: Tell us the problem.
- `ajakan.sesudahnya`
  - ID: Kami tentukan bot, workflow, atau pasar barunya.
  - EN: We decide on the bot, the workflow, or the new market.
- `kalimatJujur`
  - ID: Kami tidak membangun dari nol bila layanan yang sudah matang menyelesaikan masalahnya; kami menyarankannya lebih dulu, dan berkata jujur bila sesuatu belum perlu Anda beli.
  - EN: We do not build from scratch when a mature service already solves the problem; we suggest that service first, and we tell you honestly when you do not need to buy something yet.

## 5. Unit Peekabo

Dokumen `unit` `6f2b716f-2de9-4185-b0fe-0a1f27ced80e`, `/peekabo`. `nama`
tetap "Peekabo".

### UP1 · Kepala

- `judul` (juga di beranda)
  - ID: Rebut perhatian. Bangun kepercayaan. Biarkan jaringan yang menjual.
  - EN: Win attention. Build trust. Let the network sell.
- `subjudul`
  - ID: Agency marketshare untuk usaha dan brand, berbasis di Subang, Purwakarta, dan Bandung.
  - EN: A market-share agency for businesses and brands, based in Subang, Purwakarta, and Bandung.
- `pembuka`
  - ID: Usaha jarang kalah karena produknya buruk. Usaha kalah karena terlalu sedikit orang yang tahu, belum cukup orang yang percaya, dan tidak ada yang ikut menjualkan. Kami bekerja di ketiga titik itu.
  - EN: A business rarely loses because its product is bad. It loses because too few people know about it, not enough people trust it, and nobody else is selling it. We work at all three points.
- `ringkas` (kartu di beranda)
  - ID: Peekabo membuat usaha Anda dikenal, dipercaya, dan dibeli, lalu menghadirkan kreator, host, sales, dan komunitas yang ikut menjualkannya.
  - EN: Peekabo makes your business known, trusted, and bought, then brings in creators, hosts, sales staff, and a community that sells it for you.

### UP2 · Yang kami kerjakan

- `pilar[pilar-1].lead`
  - ID: Kami merebut perhatian.
  - EN: We win attention.
- `pilar[pilar-1].isi`
  - ID: Iklan di TikTok, Meta, dan Google dijalankan dengan aset yang diproduksi massal: video, foto, animasi, dan desain. Satu hari produksi dirancang untuk mengisi stok konten sebulan.
  - EN: Ads on TikTok, Meta, and Google run on assets produced in volume: video, photos, animation, and design. One production day is planned to fill a month of content.
- `pilar[pilar-2].lead`
  - ID: Kami membangun kepercayaan di dunia nyata.
  - EN: We build trust in the real world.
- `pilar[pilar-2].isi`
  - ID: Kampanye lapangan membawa brand Anda ke tengah warga: event hunting kota, aktivasi di lokasi mitra, sales lapangan, dan campaign talent. Anda bisa membeli satu modul atau menyerahkan kampanye utuh.
  - EN: Field campaigns take your brand out among local residents: city hunt events, activations at partner locations, field sales, and campaign talent. You can buy one module or hand over the whole campaign.
- `pilar[pilar-3].lead`
  - ID: Kami menghadirkan orang yang menjualkan.
  - EN: We bring in people who sell for you.
- `pilar[pilar-3].isi`
  - ID: Kreator, streamer, host live, sales lepas, dan anggota komunitas ikut menjual produk Anda. Mereka dibayar dari penjualan yang benar-benar terjadi.
  - EN: Creators, streamers, live hosts, freelance sales staff, and community members sell your product too. They are paid from sales that actually happen.
- `pilar[pilar-4].lead`
  - ID: Kami mengoperasikan alatnya untuk Anda.
  - EN: We run the tools for you.
- `pilar[pilar-4].isi`
  - ID: Kami melanggan platform pesan dan CRM, lalu menjalankannya untuk satu jenis usaha: leads dibalas, ditindaklanjuti, dan dicatat sampai closing. Anda membeli hasilnya, bukan lisensinya.
  - EN: We subscribe to messaging platforms and CRMs, then run them for one kind of business: leads get a reply, a follow-up, and a record until the sale closes. You buy the result, not the licence.
- `pilar[pilar-5].lead`
  - ID: Kami bekerja di dalam ekosistem platform.
  - EN: We work inside the platforms.
- `pilar[pilar-5].isi`
  - ID: Toko, kampanye afiliasi, dan siaran live dikelola mengikuti aturan Shopee dan TikTok Shop by Tokopedia yang terus berubah. Biaya dan komisi platform kami hitung ulang setiap kali aturannya bergeser.
  - EN: Shops, affiliate campaigns, and live broadcasts are run by the rules of Shopee and TikTok Shop by Tokopedia, which keep changing. We recalculate platform fees and commissions every time the rules shift.
- `pilar[pilar-6].lead`
  - ID: Cara kami bekerja.
  - EN: How we work.
- `pilar[pilar-6].isi`
  - ID: Target, lingkup, dan laporan disepakati tertulis. Komisi dari mitra kami ungkapkan kepada klien dan anggota. Jaringan kami dibayar dari penjualan, tanpa biaya masuk, tanpa bonus rekrutmen, dan tanpa janji penghasilan.
  - EN: Targets, scope, and reports are agreed in writing. We disclose commission from partners to clients and members. Our network is paid from sales, with no joining fee, no recruitment bonus, and no promise of income.

### UP3 · Masalah yang dijawab

- `masalah[masalah-1].teks`
  - ID: Belum banyak yang tahu usaha Anda.
  - EN: Not many people know your business yet.
- `masalah[masalah-2].teks`
  - ID: Yang tahu belum yakin.
  - EN: Those who know are not convinced yet.
- `masalah[masalah-3].teks`
  - ID: Yang yakin belum membeli.
  - EN: Those who are convinced have not bought yet.
- `masalah[masalah-4].teks`
  - ID: Pembeli tidak kembali.
  - EN: Buyers do not come back.
- `masalah[masalah-5].teks`
  - ID: Belum ada yang ikut menjualkan.
  - EN: Nobody else is selling for you yet.

### UP4 · Langkah kerja

- `caraKerja[kerja-1].teks`
  - ID: Ceritakan pasar yang ingin Anda rebut.
  - EN: Tell us the market you want to win.
- `caraKerja[kerja-2].teks`
  - ID: Kami tentukan lapis mana yang bekerja lebih dulu.
  - EN: We decide which part of the work comes first.
  - Catatan: "lapis" kata katalog (catatan 16.1).
- `caraKerja[kerja-3].teks`
  - ID: Mulai dari audit, sesi strategi, workshop, atau playbook.
  - EN: Start with an audit, a strategy session, a workshop, or a playbook.
- `caraKerja[kerja-4].teks`
  - ID: Target, lingkup, dan laporan disepakati tertulis.
  - EN: Targets, scope, and reports are agreed in writing.

### UP5 · Langkah pertama

- `ajakan.label`
  - ID: Ceritakan pasar yang ingin Anda rebut.
  - EN: Tell us the market you want to win.
- `ajakan.sesudahnya`
  - ID: Kami tentukan lapis mana yang bekerja lebih dulu.
  - EN: We decide which part of the work comes first.
  - Catatan: "lapis" kata katalog (catatan 16.1).

## 6. Konstruksi, untuk pelaku proyek

Dokumen `side` `833ca4b1-3ce9-419f-a479-26fd5270af85`,
`/konstruksi/pelaku-proyek`.

### SK-A1 · Kepala dan pembeli

- `nama`
  - ID: Untuk pelaku proyek
  - EN: For people running projects
- `judul` (juga di kartu halaman unit)
  - ID: Bagian mana dari proyek Anda yang belum ada yang mengerjakan? Kami isi.
  - EN: Which part of your project has nobody working on it? We fill it.
- `pembeli[pembeli-1].teks`
  - ID: Kontraktor utama
  - EN: Main contractors
- `pembeli[pembeli-2].teks`
  - ID: Subkontraktor
  - EN: Subcontractors
- `pembeli[pembeli-3].teks`
  - ID: Penyedia barang untuk pemerintah
  - EN: Suppliers of goods to the government
- `pembeli[pembeli-4].teks`
  - ID: Instansi pembeli barang
  - EN: Government agencies that buy goods
- `pembeli[pembeli-5].teks`
  - ID: Developer perumahan
  - EN: Housing developers
- `pembeli[pembeli-6].teks`
  - ID: Kontraktor swasta
  - EN: Private contractors

### SK-A2 · Cara membeli

- `caraMembeli[cara-eceran].nama`
  - ID: Ambil satu bagian proyek
  - EN: Hand us one part of the project
- `caraMembeli[cara-eceran].keterangan`
  - ID: Cocok bila Anda tahu bagian mana yang tak sanggup Anda tangani.
  - EN: Suits you if you know which part you cannot handle.
- `caraMembeli[cara-hulu-hilir].nama`
  - ID: Serahkan seluruh lingkup kepada satu subkon
  - EN: Hand the whole scope to one subcontractor
- `caraMembeli[cara-hulu-hilir].keterangan`
  - ID: Cocok bila Anda ingin satu subkon memegang seluruh lingkup pekerjaan.
  - EN: Suits you if you want one subcontractor to hold the whole scope of work.
- `caraMembeli[cara-rakitan].nama`
  - ID: Paket yang disusun menurut posisi Anda di proyek
  - EN: A package put together for your role
- `caraMembeli[cara-rakitan].keterangan`
  - ID: Cocok bila Anda ingin kombinasi layanan yang sudah disesuaikan dengan posisi Anda.
  - EN: Suits you if you want a combination of services already fitted to your role.
- `caraMembeli[cara-konsultan].nama`
  - ID: Konsultan atau penyedia
  - EN: Consultant or supplier
- `caraMembeli[cara-konsultan].keterangan`
  - ID: Cocok bila Anda membeli atau menjual barang untuk pemerintah.
  - EN: Suits you if you buy or sell goods for the government.

Catatan: glosarium §1 mengusulkan "One subcontractor for the whole scope"
untuk cara kedua. Di sini dipakai bentuk perintah supaya sejajar dengan cara
pertama; padanan glosarium tetap dipakai untuk nama situasinya di batch 2.

### SK-A3 · Langkah pertama

- `langkahPertama.label`
  - ID: Ceritakan bagian yang macet
  - EN: Tell us what is stuck
- `langkahPertama.sesudahnya`
  - ID: Kami mulai dari satu bagian proyek yang tak sanggup Anda tangani. Seluruh lingkup atau paket menurut posisi Anda bisa menyusul.
  - EN: We start with one part of the project you cannot handle. The whole scope, or a package for your role, can follow.

## 7. Konstruksi, untuk pemilik bangunan

Dokumen `side` `fc1cd0dc-9511-4cf7-bd06-d4867a2ef8a7`,
`/konstruksi/pemilik-bangunan`.

### SK-B1 · Kepala dan pembeli

- `nama`
  - ID: Untuk pemilik bangunan
  - EN: For building owners
- `judul` (juga di kartu halaman unit)
  - ID: Ceritakan bangunan yang Anda inginkan. Kami urus dari hulu ke hilir.
  - EN: Tell us about the building you want. We handle it from start to finish.
- `pembeli[pembeli-1].teks`
  - ID: Keluarga dan pemilik rumah
  - EN: Families and homeowners
- `pembeli[pembeli-2].teks`
  - ID: Pemilik kafe, resto, dan dapur produksi
  - EN: Owners of cafés, restaurants, and production kitchens
- `pembeli[pembeli-3].teks`
  - ID: Streamer, kreator, dan workshop media
  - EN: Streamers, creators, and media workshops
- `pembeli[pembeli-4].teks`
  - ID: Pemilik villa, kontrakan, hotel, dan hostel
  - EN: Owners of villas, rental houses, hotels, and hostels
- `pembeli[pembeli-5].teks`
  - ID: Pemilik properti
  - EN: Property owners

### SK-B2 · Alur kerja

- `caraMembeli[alur-cerita].nama`
  - ID: Ceritakan bangunan atau masalahnya
  - EN: Tell us about the building or the problem
- `caraMembeli[alur-cerita].keterangan`
  - ID: Kami mencari pekerjaan yang paling dekat dengan bangunan Anda.
  - EN: We find the work closest to your building.
- `caraMembeli[alur-survei].nama`
  - ID: Survei kondisi lapangan
  - EN: Site survey
- `caraMembeli[alur-survei].keterangan`
  - ID: Kondisi bangunan dan lokasi dilihat langsung sebelum angka apa pun disebut.
  - EN: We see the building and the site in person before any figure is given.
- `caraMembeli[alur-estimasi].nama`
  - ID: Estimasi dan visual
  - EN: Estimate and visuals
- `caraMembeli[alur-estimasi].keterangan`
  - ID: Anggaran dihitung dan, bila perlu, ruangan divisualisasikan sebelum dikerjakan.
  - EN: The budget is worked out and, if needed, the rooms are visualised before work begins.
- `caraMembeli[alur-lingkup].nama`
  - ID: Lingkup dan harga tertulis
  - EN: Scope and price in writing
- `caraMembeli[alur-lingkup].keterangan`
  - ID: Disepakati sebelum kerja dimulai.
  - EN: Agreed before work starts.
- `caraMembeli[alur-kerja].nama`
  - ID: Pekerjaan dan pengawasan
  - EN: Work and supervision
- `caraMembeli[alur-kerja].keterangan`
  - ID: Tenaga, material, dan jadwal dikelola satu pihak.
  - EN: Labour, materials, and schedule are managed by one party.
- `caraMembeli[alur-serah].nama`
  - ID: Serah terima dan garansi
  - EN: Handover and warranty
- `caraMembeli[alur-serah].keterangan`
  - ID: Hasil diperiksa terhadap gambar sebelum diserahkan.
  - EN: The result is checked against the drawings before handover.
- `caraMembeli[alur-rawat].nama`
  - ID: Perawatan
  - EN: Upkeep
- `caraMembeli[alur-rawat].keterangan`
  - ID: Bila Anda mau, Membership Care menjaga nilai bangunan sesudahnya.
  - EN: If you want, Membership Care keeps up the building’s value afterwards.

### SK-B3 · Langkah pertama

- `langkahPertama.label`
  - ID: Ceritakan bangunannya
  - EN: Tell us about the building
- `langkahPertama.sesudahnya`
  - ID: Kami survei kondisi lapangan sebelum angka apa pun disebut.
  - EN: We survey the site before any figure is given.

## 8. Teknologi, untuk yang ingin hasil siap pakai

Dokumen `side` `6eae7a7f-d2bc-4650-ba1c-0f2834727189`,
`/teknologi/siap-pakai`.

### ST-B1 · Kepala dan pembeli

- `nama`
  - ID: Untuk yang ingin hasil siap pakai
  - EN: For owners who want it ready to use
- `judul` (juga di kartu halaman unit)
  - ID: Ceritakan pasar yang ingin dibuka atau pekerjaan yang ingin dilepas. Sisanya kami jalankan.
  - EN: Tell us the market you want to open or the work you want off your hands. We run the rest.
- `pembeli[pembeli-1].teks`
  - ID: Pemilik warung, toko, salon, dan bengkel
  - EN: Owners of food stalls, shops, salons, and repair shops
- `pembeli[pembeli-2].teks`
  - ID: Pemilik usaha menengah, franchise, dan multi-cabang
  - EN: Owners of mid-sized, franchise, and multi-branch businesses
- `pembeli[pembeli-3].teks`
  - ID: Klinik, sekolah, koperasi, dan desa
  - EN: Clinics, schools, cooperatives, and villages
- `pembeli[pembeli-4].teks`
  - ID: Trader dan investor individu
  - EN: Traders and individual investors
- `pembeli[pembeli-5].teks`
  - ID: Kreator dan pengelola komunitas
  - EN: Creators and community managers
- `pembeli[pembeli-6].teks`
  - ID: Kontraktor, developer perumahan, dan penyedia barang
  - EN: Contractors, housing developers, and goods suppliers
- `pembeli[pembeli-7].teks`
  - ID: Pemilik konter, agen, dan reseller
  - EN: Owners of phone-credit kiosks, agents, and resellers
- `pembeli[pembeli-8].teks`
  - ID: Pemilik usaha yang mencari pendapatan tambahan
  - EN: Business owners looking for extra income

### ST-B2 · Alur kerja

- `caraMembeli[alur-cerita].nama`
  - ID: Ceritakan masalahnya
  - EN: Tell us the problem
- `caraMembeli[alur-cerita].keterangan`
  - ID: Kami mencari pekerjaan yang paling dekat dengan usaha Anda.
  - EN: We find the work closest to your business.
- `caraMembeli[alur-diagnosis].nama`
  - ID: Sesi diagnosis
  - EN: Diagnosis session
- `caraMembeli[alur-diagnosis].keterangan`
  - ID: Kami membedah masalahnya dan menyajikan pilihan yang paling sesuai. Biaya konsultasi bersifat opsional.
  - EN: We take the problem apart and set out the options that fit best. The consultation fee is optional.
- `caraMembeli[alur-jalur].nama`
  - ID: Pilih jalur
  - EN: Choose a route
- `caraMembeli[alur-jalur].keterangan`
  - ID: Pakai layanan yang sudah matang, rakit ringan dari beberapa layanan, atau bangun penuh untuk usaha multi-cabang dan perusahaan besar.
  - EN: Use a mature service, put together a light build from several services, or build in full for multi-branch businesses and large companies.
- `caraMembeli[alur-bayar].nama`
  - ID: Pilih cara bayar
  - EN: Choose how to pay
- `caraMembeli[alur-bayar].keterangan`
  - ID: Biaya pembangunan, atau kemitraan bagi hasil.
  - EN: A build fee, or a revenue-share partnership.
- `caraMembeli[alur-persiapan].nama`
  - ID: Bila belum waktunya
  - EN: If it is not time yet
- `caraMembeli[alur-persiapan].keterangan`
  - ID: Kami menyampaikannya terus terang dan menyarankan langkah persiapan selama satu sampai tiga bulan.
  - EN: We tell you plainly and suggest one to three months of preparation.

### ST-B3 · Langkah pertama

- `langkahPertama.label`
  - ID: Mulai dengan sesi diagnosis
  - EN: Start with a diagnosis session
- `langkahPertama.sesudahnya`
  - ID: Kami membedah masalahnya dan menyajikan pilihan yang paling sesuai; biaya konsultasi bersifat opsional.
  - EN: We take the problem apart and set out the options that fit best; the consultation fee is optional.

## 9. Teknologi, untuk yang paham teknis

Dokumen `side` `a136c8f3-4663-4160-aebd-eee8b0a87dcb`,
`/teknologi/paham-teknis`.

### ST-A1 · Kepala dan pembeli

- `nama`
  - ID: Untuk yang paham teknis
  - EN: For developers and technical teams
- `judul` (juga di kartu halaman unit)
  - ID: Spesialis untuk titik macet teknis Anda, dari basis data sampai rilis otomatis.
  - EN: Specialists for your technical sticking point, from databases to automated releases.
- `pembeli[pembeli-1].teks`
  - ID: Individu, pembelajar, dan hobbyist
  - EN: Individuals, learners, and hobbyists
- `pembeli[pembeli-2].teks`
  - ID: Freelancer dan agensi kecil
  - EN: Freelancers and small agencies
- `pembeli[pembeli-3].teks`
  - ID: Software house dan perusahaan IT
  - EN: Software houses and IT companies
- `pembeli[pembeli-4].teks`
  - ID: Startup founder dan CTO
  - EN: Startup founders and CTOs
- `pembeli[pembeli-5].teks`
  - ID: Tim IT internal
  - EN: In-house IT teams

### ST-A2 · Lima cara mulai

- `caraMembeli[cara-audit].nama`
  - ID: Audit singkat harga tetap
  - EN: A short fixed-price audit
- `caraMembeli[cara-audit].keterangan`
  - ID: Cocok bila Anda belum yakin penyebab masalahnya.
  - EN: Suits you if you are not sure what is causing the problem.
- `caraMembeli[cara-spesifik].nama`
  - ID: Satu layanan spesifik
  - EN: One specific service
- `caraMembeli[cara-spesifik].keterangan`
  - ID: Cocok bila Anda tahu masalahnya dan lingkup serta tenggatnya jelas.
  - EN: Suits you if you know the problem and the scope and deadline are clear.
- `caraMembeli[cara-proyek].nama`
  - ID: Proyek utuh lintas spesialis
  - EN: A whole project across specialists
- `caraMembeli[cara-proyek].keterangan`
  - ID: Cocok bila Anda butuh hasil dari rancangan sampai rilis.
  - EN: Suits you if you need a result from design to release.
- `caraMembeli[cara-tim].nama`
  - ID: Tim khusus di bawah arahan Anda
  - EN: A dedicated team under your direction
- `caraMembeli[cara-tim].keterangan`
  - ID: Cocok bila Anda butuh tenaga yang mengikuti ritme Anda.
  - EN: Suits you if you need people who work at your pace.
- `caraMembeli[cara-rawat].nama`
  - ID: Kontrak pemeliharaan bulanan
  - EN: A monthly maintenance contract
- `caraMembeli[cara-rawat].keterangan`
  - ID: Cocok bila sistem sudah berjalan dan harus dijaga.
  - EN: Suits you if the system is running and needs looking after.

### ST-A3 · Langkah pertama

- `langkahPertama.label`
  - ID: Mulai dengan audit singkat
  - EN: Start with a short audit
- `langkahPertama.sesudahnya`
  - ID: Kami mencari penyebab masalah sebelum Anda memilih satu layanan, proyek utuh, tim khusus, atau pemeliharaan.
  - EN: We find the cause of the problem before you choose one service, a whole project, a dedicated team, or maintenance.

## 10. Peekabo, untuk pemilik usaha dan brand

Dokumen `side` `05e811a2-2475-468d-958f-c0064923c798`,
`/peekabo/pemilik-usaha`.

### SP-A1 · Kepala dan pembeli

- `nama`
  - ID: Untuk pemilik usaha dan brand
  - EN: For business owners and brands
- `judul` (juga di kartu halaman unit)
  - ID: Pasar mana yang ingin Anda rebut? Kami siapkan perhatian, kepercayaan, dan penjualnya.
  - EN: Which market do you want to win? We bring the attention, the trust, and the people who sell.
- `pembeli[pembeli-1].teks`
  - ID: UMKM dan usaha lokal
  - EN: Small and local businesses
- `pembeli[pembeli-2].teks`
  - ID: Brand dan seller marketplace
  - EN: Brands and marketplace sellers
- `pembeli[pembeli-3].teks`
  - ID: Usaha F&B, penginapan, dan studio
  - EN: Food and beverage businesses, guesthouses, and studios
- `pembeli[pembeli-4].teks`
  - ID: Dealer, properti, klinik, salon, bengkel, dan kursus
  - EN: Dealers, property businesses, clinics, salons, repair shops, and course providers
- `pembeli[pembeli-5].teks`
  - ID: Instansi, desa wisata, dan program CSR
  - EN: Government agencies, tourism villages, and CSR programmes
- `pembeli[pembeli-6].teks`
  - ID: Pendiri dan tim produk
  - EN: Founders and product teams
- `pembeli[pembeli-7].teks`
  - ID: Agensi lain
  - EN: Other agencies
- `pembeli[pembeli-8].teks`
  - ID: Vendor dan pemilik program komisi
  - EN: Vendors and owners of commission programmes

### SP-A2 · Cara membeli

- `caraMembeli[cara-partial].nama`
  - ID: Satu modul
  - EN: One module
- `caraMembeli[cara-partial].keterangan`
  - ID: Cocok bila Anda sudah punya sebagian dan hanya butuh satu bagian, misalnya talenta, aset, atau laporan saja.
  - EN: Suits you if you already have part of it and need just one piece, such as talent, assets, or reporting.
- `caraMembeli[cara-full].nama`
  - ID: Kampanye utuh
  - EN: A whole campaign
- `caraMembeli[cara-full].keterangan`
  - ID: Cocok bila Anda ingin kampanye dari konsep sampai laporan dipegang satu tim.
  - EN: Suits you if you want one team to hold the campaign from concept to report.
- `caraMembeli[cara-bulanan].nama`
  - ID: Kelola bulanan
  - EN: Monthly management
- `caraMembeli[cara-bulanan].keterangan`
  - ID: Cocok bila Anda ingin akun, iklan, toko, atau siaran berjalan setiap bulan tanpa tim sendiri.
  - EN: Suits you if you want accounts, ads, shops, or broadcasts running every month without your own team.
- `caraMembeli[cara-operator].nama`
  - ID: Operator
  - EN: Operator
- `caraMembeli[cara-operator].keterangan`
  - ID: Cocok bila Anda ingin hasil dari alat pemasaran tanpa membeli dan menjalankan alatnya sendiri.
  - EN: Suits you if you want the results of marketing tools without buying and running the tools yourself.
- `caraMembeli[cara-hasil].nama`
  - ID: Sebagian dari hasil
  - EN: Partly from results
- `caraMembeli[cara-hasil].keterangan`
  - ID: Cocok bila Anda ingin sebagian biaya dikaitkan dengan leads atau penjualan.
  - EN: Suits you if you want part of the fee tied to leads or sales.

### SP-A3 · Langkah pertama

- `langkahPertama.label`
  - ID: Mulai dari audit atau sesi strategi
  - EN: Start with an audit or a strategy session
- `langkahPertama.sesudahnya`
  - ID: Langkah awal dapat berupa audit, sesi strategi, workshop, atau playbook; produksi, kampanye, tim, talenta, dan jaringan menyusul bila dibutuhkan.
  - EN: The first step can be an audit, a strategy session, a workshop, or a playbook; production, campaigns, teams, talent, and the network follow when needed.

Catatan: label tombol Inggris 41 karakter, label Indonesianya 35. Bila tidak
muat satu baris pada 390 px, versi pendeknya "Start with an audit".

## 11. Peekabo, untuk jaringan penjual

Dokumen `side` `3222fab5-dc6f-40c5-a96e-5f231bc76e48`, `/peekabo/jaringan`.

### SP-B1 · Kepala dan pembeli

- `nama`
  - ID: Untuk jaringan penjual
  - EN: For the sales network
- `judul` (juga di kartu halaman unit)
  - ID: Punya audiens, jaringan, atau bakat menjual? Dapatkan bagian dari setiap penjualan yang Anda bawa.
  - EN: Have an audience, a network, or a knack for selling? Get a share of every sale you bring in.
- `pembeli[pembeli-3].teks`
  - ID: Kreator, streamer, dan host
  - EN: Creators, streamers, and hosts

### SP-B2 · Cara kerja

Tampil sebagai "nama. keterangan", satu baris per langkah.

- `caraMembeli[alur-daftar].nama`
  - ID: Daftar gratis sebagai kreator atau host
  - EN: Sign up free as a creator or host
- `caraMembeli[alur-daftar].keterangan`
  - ID: Tidak ada biaya untuk bergabung.
  - EN: There is no fee to join.
- `caraMembeli[alur-bentuk-kerja].nama`
  - ID: Sepakati bentuk kerjanya
  - EN: Agree how you will work
- `caraMembeli[alur-bentuk-kerja].keterangan`
  - ID: Per jam, per bulan, atau dari kontrak brand, disepakati tertulis sebelum kerja dimulai.
  - EN: By the hour, by the month, or through a brand contract, agreed in writing before work starts.
- `caraMembeli[alur-bayaran].nama`
  - ID: Terima bayaran Anda
  - EN: Receive your pay
- `caraMembeli[alur-bayaran].keterangan`
  - ID: Honor dipotong pajak sesuai aturan.
  - EN: Tax is withheld from your fee as the rules require.
- `caraMembeli[alur-rekrut].nama`
  - ID: Tanpa target rekrutmen
  - EN: No recruitment targets
- `caraMembeli[alur-rekrut].keterangan`
  - ID: Tidak ada bonus dari orang yang Anda ajak.
  - EN: There is no bonus for people you bring in.
- `jaringan.caraKerja`
  - ID: Host dibayar per jam atau per bulan untuk toko brand yang kami layani. Untuk kontrak brand yang kami bawa, biaya manajemen diambil dari kontrak itu.
  - EN: Hosts are paid by the hour or by the month for the brand shops we serve. For brand contracts we bring in, a management fee is taken from that contract.

### SP-B3 · Aturan jaringan

- `jaringan.asalKomisi`
  - ID: Bayaran Anda datang dari brand yang memakai jasa Anda, bukan dari merekrut orang lain.
  - EN: Your pay comes from the brands that use your services, not from recruiting other people.
- `jaringan.yangTidakAda`
  - ID: Tidak ada biaya masuk, target rekrutmen, bonus rekrutmen, atau janji penghasilan.
  - EN: There is no joining fee, no recruitment target, no recruitment bonus, and no promise of income.
- `jaringan.syarat`
  - ID: Bentuk kerja disepakati tertulis sebelum mulai, dan honor dipotong pajak sesuai aturan. Kelas dijual terpisah dan tidak menjadi syarat bergabung.
  - EN: How you work is agreed in writing before you start, and tax is withheld from your fee as the rules require. Classes are sold separately and are not a condition of joining.

### SP-B4 · Ajakan daftar dan langkah pertama

- `jaringan.ajakanDaftar.label` dan `langkahPertama.label`
  - ID: Daftar gratis sebagai kreator atau host
  - EN: Sign up free as a creator or host
- `jaringan.ajakanDaftar.sesudahnya` dan `langkahPertama.sesudahnya`
  - ID: Bentuk kerja dan bayarannya, per jam, per bulan, atau dari kontrak brand, disepakati tertulis sebelum kerja dimulai.
  - EN: How you work and are paid, by the hour, by the month, or through a brand contract, is agreed in writing before work starts.

### SP-B5 · Jalur kreator dan host

Satu-satunya situasi di halaman ini, dari dokumen `bab`
`arthur-bab-peekabo-jaringan-kreator`. Ikut batch ini supaya
`/peekabo/jaringan` lengkap; kutipan dan isi halaman situasinya menunggu
batch 2.

- `nama`
  - ID: Kreator, streamer, dan host
  - EN: Creators, streamers, and hosts
- `situasi`
  - ID: Anda bisa live berjam-jam, tetapi penghasilannya belum menentu. Anda dibayar per jam atau per bulan sebagai host toko brand, dilatih menutup penjualan, dan kontrak brand dicarikan untuk Anda.
  - EN: You can go live for hours, but the income is unpredictable. You are paid by the hour or by the month as a host for brand shops. You are trained to close sales, and we look for brand contracts for you.

## 12. `/metode`

Dokumen `howWeWork`. Nama wilayah tetap.

### M1 · Pembuka dan janji

- `pembuka`
  - ID: Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai.
  - EN: Scope, price, targets, and reports are agreed in writing before work starts.
- `janji[janji-tertulis].judul`
  - ID: Tertulis sebelum kerja
  - EN: In writing before work
- `janji[janji-tertulis].kalimat`
  - ID: Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai.
  - EN: Scope, price, targets, and reports are agreed in writing before work starts.
- `janji[janji-lapangan].judul`
  - ID: Tenaga ahli hadir
  - EN: Experts on site
- `janji[janji-lapangan].kalimat`
  - ID: Tenaga ahli bekerja di lapangan proyek Anda; nama atau sertifikat tidak dipinjamkan.
  - EN: Our experts work on your project site; we do not lend out names or certificates.
- `janji[janji-perlu].judul`
  - ID: Bangun hanya bila perlu
  - EN: Build only when needed
- `janji[janji-perlu].kalimat`
  - ID: Kami menyarankan layanan yang sudah matang lebih dulu dan berkata jujur bila sesuatu belum perlu Anda beli.
  - EN: We suggest a mature service first and tell you honestly when you do not need to buy something yet.
- `janji[janji-komisi].judul`
  - ID: Terbuka soal komisi
  - EN: Open about commission
- `janji[janji-komisi].kalimat`
  - ID: Komisi dari mitra kami ungkapkan kepada klien dan anggota.
  - EN: We disclose commission from partners to clients and members.
- `janji[janji-menjembatani].judul`
  - ID: Menjembatani, tidak meminjamkan
  - EN: Bridging, not lending
- `janji[janji-menjembatani].kalimat`
  - ID: Kami tidak memberi pinjaman dan tidak mengelola dana Anda. Modal kerja, pembiayaan, dan asuransi berjalan lewat mitra berizin.
  - EN: We do not lend money and we do not manage your funds. Working capital, financing, and insurance go through licensed partners.

### M2 · Hak milik, komisi, batas, dan format kerja

- `hakMilikKlien`
  - ID: Sistem, data, kode, dan merek tetap milik Anda. Kode, akses, dan dokumentasi diserahkan kepada Anda.
  - EN: The systems, data, code, and brand stay yours. Code, access, and documentation are handed over to you.
- `pengungkapanKomisi`
  - ID: Penyedia layanan bisa membayar kami komisi, di luar biaya yang Anda bayar kepada kami. Kami menyebutkannya sejak awal.
  - EN: A service provider may pay us a commission, separate from what you pay us. We tell you this from the start.
- `yangTidakDijual`
  - ID: Kami tidak meminjamkan nama atau sertifikat, mengatur hasil administrasi, menjanjikan keuntungan instan, memungut biaya masuk jaringan, atau memberi bonus rekrutmen.
  - EN: We do not lend out names or certificates, arrange the outcome of paperwork, promise instant profit, charge joining fees, or pay recruitment bonuses.
- `contohFormat`
  - ID: Setiap pekerjaan dimulai dari satu kesepakatan tertulis. Isinya lingkup, harga, target, bentuk laporan, pemilik hasil kerja, dan komisi dari mitra bila ada.
  - EN: Every piece of work starts from one written agreement. It sets out the scope, price, targets, report format, who owns the work, and any commission from partners.

## 13. `/layanan`

Dua dokumen `sequence`, lalu judul enam pekerjaan yang tampil di langkahnya.

### L1 · Kafe baru

Dokumen `arthur-rangkaian-kafe-baru`.

- `situasi`
  - ID: Anda menyewa tempat untuk kafe baru dan ingin kafe itu siap melayani sejak hari pertama dibuka.
  - EN: You are renting a space for a new café and want it ready to serve from the day it opens.
- `langkah[konstruksi].kalimat`
  - ID: Unit Konstruksi menyiapkan lokasi sewa sampai alur pelanggan dan dapurnya bekerja.
  - EN: Konstruksi, our construction unit, prepares the rented space until the customer flow and the kitchen both work.
- `langkah[teknologi].kalimat`
  - ID: Unit Teknologi memasang pemesanan dan pembayaran dari meja, sehingga pesanan langsung masuk ke dapur.
  - EN: Teknologi, our systems unit, sets up ordering and payment at the table, so orders go straight to the kitchen.
- `langkah[peekabo].kalimat`
  - ID: Peekabo mengundang warga sekitar lebih dulu, sebelum kafe dibuka.
  - EN: Peekabo, our agency, invites the neighbours first, before the café opens.
- `keterangan`
  - ID: Ini rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan. Setiap unit tetap bisa dibeli sendiri.
  - EN: This is a possible sequence, not a project we have done. Each unit can also be hired on its own.

### L2 · Studio siaran

Dokumen `arthur-rangkaian-studio-siaran`.

- `situasi`
  - ID: Anda ingin satu ruangan di tempat usaha menjadi studio siaran yang dipakai setiap hari.
  - EN: You want one room at your business to become a broadcast studio that is used every day.
- `langkah[konstruksi].kalimat`
  - ID: Unit Konstruksi mengubah ruangan biasa menjadi studio siap pakai tanpa merombak bangunan.
  - EN: The Konstruksi unit turns an ordinary room into a studio that is ready to use, without overhauling the building.
- `langkah[teknologi].kalimat`
  - ID: Unit Teknologi memasang overlay yang menampilkan donasi, follow, dan pesan di layar siaran.
  - EN: The Teknologi unit sets up an overlay that shows donations, follows, and messages on the broadcast screen.
- `langkah[peekabo].kalimat`
  - ID: Peekabo menjalankan siaran rutin dengan jadwal tetap dan laporan bulanan.
  - EN: Peekabo runs regular broadcasts on a fixed schedule, with a monthly report.
- `keterangan`
  - ID: Ini rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan. Setiap unit tetap bisa dibeli sendiri.
  - EN: This is a possible sequence, not a project we have done. Each unit can also be hired on its own.

### L3 · Judul enam pekerjaan

Medan `judul` dokumen `offer`. Judul ini juga H1 halaman pekerjaannya di batch
3; menyetujuinya di sini menetapkannya di sana. Tiga yang pertama sama dengan
label gambar kerja `plates.*.job` di `messages/en.json`.

- `arthur-offer-fnb-01`
  - ID: Kafe siap buka dari lokasi sewa
  - EN: A café ready to open in a rented space
- `arthur-offer-kul-02`
  - ID: Pesan dan bayar dari meja
  - EN: Order and pay at the table
- `arthur-offer-2b-03`
  - ID: Pembukaan cabang atau gerai
  - EN: Opening a branch or an outlet
- `arthur-offer-std-09`
  - ID: Makeover ruangan menjadi studio
  - EN: Turning a room into a studio
- `arthur-offer-med-01`
  - ID: Overlay donasi dan alert langsung di layar
  - EN: On-screen donation overlays and live alerts
- `arthur-offer-liv-02`
  - ID: Paket live bulanan 2, 4, atau 8 jam
  - EN: Monthly live packages of 2, 4, or 8 hours

## 14. `/pembayaran`

Dokumen `page` `arthur-page-cara-kami-dibayar`. Isinya Portable Text; versi
Inggris memakai urutan dan gaya blok yang sama.

### P1 · Cara kami dibayar

- `judul`
  - ID: Cara kami dibayar, tertulis sebelum kerja dimulai
  - EN: How we are paid, set in writing before work starts
- `isi`, blok 1 (paragraf)
  - ID: Sebelum memutuskan, Anda perlu tahu dari mana kami dibayar dan apa yang Anda tanggung. Angkanya disebut setelah kami memahami masalahnya, tidak sebelumnya.
  - EN: Before you decide, you should know where our pay comes from and what costs fall on you. We give figures after we understand the problem, not before.
- `isi`, blok 2 (paragraf)
  - ID: Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai.
  - EN: Scope, price, targets, and reports are agreed in writing before work starts.
- `isi`, blok 3 (h2)
  - ID: Biaya pembangunan
  - EN: Build fee
- `isi`, blok 4 (paragraf)
  - ID: Anda membayar pekerjaannya sesuai lingkup tertulis, dari memasang layanan jadi sampai membangun sistem. Bayaran ini tidak bergantung pada hasil penjualan Anda.
  - EN: You pay for the work according to the written scope, from setting up a ready-made service to building a system. This fee does not depend on your sales.
- `isi`, blok 5 (paragraf)
  - ID: Bisnisnya milik Anda, mereknya milik Anda, datanya milik Anda; kode, akses, dan dokumentasi diserahkan kepada Anda.
  - EN: The business is yours, the brand is yours, the data is yours; code, access, and documentation are handed over to you.
- `isi`, blok 6 (h2)
  - ID: Kemitraan bagi hasil
  - EN: Revenue-share partnership
- `isi`, blok 7 (paragraf)
  - ID: Biaya di awal lebih ringan, karena sebagian bayaran kami diambil dari pendapatan yang dihasilkan sistemnya. Besar bagiannya dan cara menghitungnya tertulis di kontrak sebelum kerja dimulai. Bagi hasil dihitung dari pendapatan, bukan dari kepemilikan usaha Anda.
  - EN: The upfront cost is lower, because part of our pay comes from the revenue the system brings in. The size of our share and how it is calculated are written into the contract before work starts. The share is calculated from revenue, not from ownership of your business.
- `isi`, blok 8 (h2)
  - ID: Komisi dari mitra
  - EN: Commission from partners
- `isi`, blok 9 (paragraf)
  - ID: Bila layanan yang sudah jadi cukup untuk masalah Anda, kami menyarankannya lebih dulu. Penyedia layanan itu bisa membayar kami komisi, di luar biaya yang Anda bayar kepada kami. Kami menyebutkannya sejak awal.
  - EN: When a ready-made service is enough for your problem, we suggest it first. That service provider may pay us a commission, separate from what you pay us. We tell you this from the start.
- `isi`, blok 10 (h2)
  - ID: Sebelum ada yang dibangun
  - EN: Before anything is built
- `isi`, blok 11 (paragraf)
  - ID: Biaya konsultasinya bersifat pilihan. Bila belum waktunya, kami mengatakannya terus terang dan menyarankan persiapan satu sampai tiga bulan.
  - EN: The consultation fee is optional. If it is not time yet, we say so plainly and suggest one to three months of preparation.
- `isi`, blok 12 (paragraf)
  - ID: Untuk proyek bangunan, angka disebut setelah survei kondisi lapangan.
  - EN: For building projects, figures are given after a site survey.
- `isi`, blok 13 (h2)
  - ID: Yang tidak kami lakukan
  - EN: What we do not do
- `isi`, blok 14 (paragraf)
  - ID: Kami tidak memberi pinjaman dan tidak mengelola dana Anda. Kami tidak menjanjikan keuntungan instan.
  - EN: We do not lend money and we do not manage your funds. We do not promise instant profit.
- `isi`, blok 15 (h2)
  - ID: Langkah pertama
  - EN: First step
- `isi`, blok 16 (paragraf)
  - ID: Kami tentukan unit mana yang bekerja lebih dulu, lalu cara bayar yang cocok untuk pekerjaan itu.
  - EN: We decide which unit works first, then the way of paying that suits that work.

Tombol "Ceritakan masalahnya" di halaman ini tertulis langsung di
`app/[locale]/pembayaran/page.tsx`, bukan di `messages`. Inggrisnya "Tell us
the problem", dan langkah kode R7 perlu memindahkannya ke kunci pesan
(catatan 16.5).

## 15. Teks antarmuka (blok UI1)

`messages/en.json` sudah memuat Inggris untuk setiap kunci. Kunci yang tampil
di halaman batch ini diperiksa satu per satu (`nav`, `footer`, `home`, `unit`,
`side`, `network`, `plates`, `servicesPage`, `methodPage`, dan
`contactPage`). Yang tidak disebut di tabel ini dipakai apa adanya. Halaman
`/kontak` hanya berisi teks antarmuka dan nama wilayah, jadi isinya ada di
tabel ini.

| Kunci                        | Indonesia                                                                                                                          | Inggris sekarang                                                                                                                     | Usulan                                                                                                                                                                                | Alasan                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `nav.studio`                 | Metode kerja                                                                                                                       | Working method                                                                                                                       | How we work                                                                                                                                                                           | Sama dengan judul halamannya (`methodPage.title`)                         |
| `side.jaringan`              | Jaringan penjual                                                                                                                   | The seller network                                                                                                                   | Sales network                                                                                                                                                                         | Label pendek untuk "For the sales network" (S6)                           |
| `side.typeLabel`             | Jenis pekerjaan                                                                                                                    | Work type                                                                                                                            | Kind of work                                                                                                                                                                          | Kata glosarium (§8, `search.emptyHint`)                                   |
| `side.offerCount`            | {count} pekerjaan                                                                                                                  | {count} pieces of work                                                                                                               | {count, plural, one {# piece of work} other {# pieces of work}}                                                                                                                       | Bentuk tunggal untuk satu pekerjaan                                       |
| `unit.examplesEyebrow`       | Contoh pekerjaan                                                                                                                   | Example work                                                                                                                         | Examples of the work                                                                                                                                                                  | Glosarium §8                                                              |
| `home.actionAfterFallback`   | Kami tentukan unit mana yang bekerja lebih dulu.                                                                                   | We will decide which unit should work first.                                                                                         | We decide which unit works first.                                                                                                                                                     | Kalimat tetap (S10)                                                       |
| `contactPage.title`          | Tiga unit. Satu cara memegang pekerjaan.                                                                                           | Three units. One way to hold the work.                                                                                               | Three units. One way of handling the work.                                                                                                                                            | "Hold the work" tidak lazim                                               |
| `contactPage.lead`           | Arthur adalah payung untuk Konstruksi, Teknologi, dan Peekabo. Masalah dibaca lebih dulu; unit yang bekerja ditentukan sesudahnya. | Arthur is the umbrella for Konstruksi, Teknologi, and Peekabo. The problem is read first; the unit that works is decided afterwards. | Arthur is the umbrella for three units: Konstruksi for construction, Teknologi for systems, and Peekabo, our agency. We read the problem first, then decide which unit does the work. | Sebutan pertama nama unit diberi penjelas (S4)                            |
| `contactPage.regionsEyebrow` | Wilayah kerja                                                                                                                      | Service area                                                                                                                         | Where we work                                                                                                                                                                         | Satu padanan untuk "Wilayah kerja", sama dengan `methodPage.regionsTitle` |
| `contactPage.regionsIntro`   | Arthur bekerja untuk kebutuhan di Subang, Purwakarta, dan Bandung. Daftar ini menyatakan jangkauan kerja, bukan alamat kantor.     | Arthur works for needs in Subang, Purwakarta, and Bandung. This is a service area, not an office address.                            | Arthur takes on work in Subang, Purwakarta, and Bandung. This list shows where we work, not an office address.                                                                        | "Works for needs in" tidak lazim                                          |
| `contactPage.regionsLabel`   | Wilayah layanan Arthur                                                                                                             | Arthur service areas                                                                                                                 | Arthur’s service areas                                                                                                                                                                | Tata bahasa                                                               |
| `methodPage.regionCount`     | {count} wilayah                                                                                                                    | {count} regions                                                                                                                      | {count, plural, one {# area} other {# areas}}                                                                                                                                         | "Area" seperti di `/kontak`; bentuk tunggal                               |
| `network.terms.condition`    | Syarat pembayaran                                                                                                                  | Payment condition                                                                                                                    | Payment conditions                                                                                                                                                                    | Isinya dua syarat                                                         |
| `footer.contact`             | Pesanan                                                                                                                            | Commissions                                                                                                                          | Enquiries                                                                                                                                                                             | "Commissions" sisa situs lama (catatan 16.4)                              |

## 16. Catatan untuk teks Indonesia

Temuan ini tidak diubah oleh dokumen ini. Mengubah teks Indonesia di Sanity
butuh `ok tulis` tersendiri, dan medan pilar serta ajakan unit adalah kata
pemilik sendiri.

1. **Kata katalog yang masih tayang.** Glosarium §1 menetapkan kata ini tidak
   pernah tampil, tetapi tiga medan masih memuatnya. Inggrisnya sudah memakai
   pengganti. Usulan Indonesianya:
   - Teknologi `pilar[pilar-5].isi`, "masuklah lewat Sisi A" dan "masuklah
     lewat Sisi B": "masuklah lewat “Untuk yang paham teknis”" dan "masuklah
     lewat “Untuk yang ingin hasil siap pakai”".
   - Konstruksi `caraKerja[kerja-2].teks`, "Kami tentukan sisinya": "Kami
     tentukan posisi Anda: pelaku proyek atau pemilik bangunan."
   - Peekabo `caraKerja[kerja-2].teks` dan `ajakan.sesudahnya`, "lapis mana
     yang bekerja lebih dulu": "pekerjaan mana yang berjalan lebih dulu".
2. **Label Peekabo untuk penjual.** Glosarium §3 dan §9.5 menyebut "Untuk yang
   ingin ikut menjualkan"; yang tayang sekarang "Untuk jaringan penjual"
   (`nama`) dan "Jaringan penjual" (`side.jaringan`). Inggrisnya mengikuti
   yang tayang. Bila glosarium yang berlaku, padanannya "For people who want
   to help sell".
3. **Susunan `/peekabo/jaringan`.** Judul "Setiap rujukan harus dapat
   ditelusuri." berada di atas teks tentang bayaran host, dan "Tiga cara masuk
   ke jaringan." menampilkan tiga jalur, padahal hanya jalur kreator yang punya
   situasi. Diterjemahkan apa adanya; layak dilihat lagi di R5 atau R6.
4. **Judul footer "Pesanan".** Padanan lamanya "Commissions" berasal dari
   situs studio sebelumnya. Judul Indonesia ini mungkin juga sisa situs lama.
5. **Teks yang tertulis di kode.** Tombol `/pembayaran` (bagian 14) belum
   punya kunci pesan, jadi `/en/pembayaran` belum bisa seluruhnya Inggris
   sampai langkah kode R7 memindahkannya.

## 17. Yang belum tercakup

- **Kartu situasi di lima halaman pembaca.** Halaman pembaca menampilkan kartu
  dari dokumen `bab` dan `offer`: nama situasi, satu baris situasi, label
  jenis, jumlah pekerjaan, dan judul pekerjaan "Mulai dari sini". Jumlahnya
  12 di pelaku proyek, 7 di pemilik bangunan, 17 di siap pakai, 6 di paham
  teknis, dan 8 di pemilik usaha. Kelimanya baru bisa dibuka dalam bahasa
  Inggris sesudah batch 2a.
- **Label jenis pekerjaan.** Kolom Inggris glosarium §5 masih draf dan
  disetujui bersama batch 2a.
- Kebijakan, alamat contoh, dan kanal kontak K5.

## 18. Usul batch berikutnya

Ukuran dihitung dari ekspor yang sama, dalam kata Indonesia.

| Batch | Isi                                                                                                                                                               | Ukuran | Membuka                      |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------- |
| 2a    | Lapisan kartu situasi: 50 nama dan baris situasi, 50 judul pekerjaan "Mulai dari sini", dan 18 label jenis (glosarium §5)                                         | ±1.830 | Lima halaman pembaca lainnya |
| 2b    | 51 halaman situasi: kutipan, pembeli, batas, ajakan, dan jembatan, ditambah kartu pekerjaan di setiap halaman (judul, dampak, dan untuk siapa dari 305 pekerjaan) | ±9.400 | Semua halaman situasi        |
| 3     | 52 halaman pekerjaan: situasi, dua paket (nama, kalimat, poin), batas, syarat, langkah, serahan, dan langkah pertama                                              | ±7.200 | Semua halaman pekerjaan      |

Cara kerjanya sama dengan dokumen ini, dengan tiga perbedaan:

- Kolom ID disusun skrip langsung dari ekspor dataset, jadi tidak ada salin
  tangan. Yang ditulis tangan hanya kolom EN.
- Sebelum diserahkan, nilai EN diperiksa skrip terhadap S7 dan S8 (tanda pisah,
  tanda seru, emoji, kata terlarang, dan panjang kalimat).
- 2b dan 3 dipecah per unit (situasi: Konstruksi 19, Teknologi 23, Peekabo 9)
  supaya satu PR bisa ditinjau sekali duduk. Halaman pekerjaan Teknologi
  memakai kalimat tetap paket Starter dan Integrator serta kalimat jujur, jadi
  bagian itu cepat.

Penulisan ke Sanity untuk batch mana pun dilakukan sesudah migrasi medan
`language` dan PR query-nya, dengan bentuk
`{ "_key": "en", "language": "en", "value": "…" }`, dengan izin `ok tulis`
per batch.

## Jejak sumber

| Bagian      | Sumber                                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1           | Glosarium pembaca §1 sampai §10; `lib/content/style-gate.ts` (`ERROR_RULES`, `BANNED_PHRASES`, `VERBATIM_FIELDS`, 25 kata per kalimat)                                    |
| 2 sampai 14 | Ekspor publik `production`, 31 Oktober 2026 14.27 UTC, sha256 `2bec92cb366d…`; teks 14 halaman produksi pada waktu yang sama                                              |
| 15          | `messages/id.json` dan `messages/en.json` di `7d08f34`; kunci yang dipakai halaman di `app/[locale]/`                                                                     |
| 16, 17      | Glosarium §1, §3, §9; `app/[locale]/pembayaran/page.tsx`; halaman produksi                                                                                                |
| 18          | Hitungan kata dari ekspor yang sama: `bab` 5.560 kata (kartu 1.591), judul 51 pekerjaan pembuka 237 kata, kartu 305 pekerjaan 5.391 kata, 52 halaman pekerjaan 7.164 kata |
