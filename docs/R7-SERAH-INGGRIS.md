# Serah Inggris R7, batch pertama (disetujui)

Tanggal: 1 November 2026, ditinjau ulang 14 November 2026 · Status:
**disetujui pemilik 15 November 2026, "Setujui semua"**, untuk ke-57 blok di
14 halaman; penulisan ke Sanity menunggu `ok tulis` · Dasar: R7 di
`docs/RENCANA-REVISI-F3.md`, K2 di `docs/PROGRES-ARTHUR.md`, dan
`docs/R1-GLOSARIUM-PEMBACA.md`

**Persetujuan.** Pemilik menjawab "Setujui semua" pada 15 November 2026,
lewat sesi koordinator, atas pertanyaan cara menangani copy Inggris R7.
Persetujuan itu berlaku untuk setiap blok seperti tertulis di dokumen tinjauan
rev 21 dan di file ini sejak #91 (`d24a6ea`). Status semua blok di dokumen
tinjauan kini "Setuju". Blok mana pun yang diubah sesudah ini butuh
persetujuan baru.

**Persetujuan L-meta dan P-meta.** Dua blok kepala halaman ditambahkan
sesudah itu: L-meta untuk `/layanan` dan P-meta untuk `/pembayaran`. Pemilik
menyetujui keempat teksnya pada 15 November 2026, lewat sesi koordinator, atas
pertanyaan "Approve the four English meta texts to open /layanan and
/pembayaran?": "Setujui keempatnya". Keduanya masuk lewat PR kode
(`messages/en.json`), bukan Sanity.

Dokumen ini berisi aturan suara Inggris dan copy Inggris untuk halaman yang
copy Indonesianya sudah disetujui dan tayang: beranda, tiga unit, enam halaman
pembaca (termasuk `/peekabo/jaringan`), `/metode`, `/layanan`, `/pembayaran`,
dan `/kontak`. Dasarnya jawaban pemilik pada 31 Oktober 2026 lewat sesi
koordinator: "Ya, siapkan draf".

Pemilik meninjaunya di dokumen “R7, tinjauan copy Inggris”
(https://claude.ai/artifact/RvcTKpzFugRCxHnsZKQSJh) dengan kode blok yang sama. File
ini mengikuti dokumen itu per 14 November 2026: 57 blok di 14 halaman, 45
tetap sejak 1 November, 3 disesuaikan (S, B3, UI1), dan 9 baru (B6, SK-A4,
SK-B4, ST-B4, ST-A4, SP-A4, J1, L4, P2). Blok yang tidak bertanda tetap sejak
1 November. Bila dokumen dan file ini berbeda, kata pemilik di dokumen yang
berlaku, lalu file ini disusulkan.

Dokumen ini sendiri tidak menulis ke Sanity dan tidak mengubah kode. Blok yang
disetujui ditulis di langkah sesudahnya: isi Sanity dengan izin `ok tulis`
tersendiri (`docs/PROSEDUR-KERJA.md` §6), teks antarmuka lewat PR kode. K2
kini diubah tertulis (`docs/PROGRES-ARTHUR.md`): satu segmen `/en` dibuka
sesudah Inggrisnya tertulis di Sanity, dan sampai itu tetap dialihkan 307 ke
`/id`. Pengalih bahasa hanya tampil di halaman yang punya padanan `/en`.

## Cara menyetujui

- Setiap blok punya kode, misalnya **B1** atau **SK-A2**. Jawaban cukup
  "setujui semua", atau "setujui semua kecuali UT2: …" disertai perubahan yang
  diminta. Di dokumen tinjauan, Setuju juga bisa dipilih di baris Status setiap
  blok.
- Setiap baris memuat jalur medan Sanity atau kunci `messages`, teks Indonesia
  yang tayang (ID), dan usulan Inggris (EN). Jalur itu dipakai apa adanya saat
  menulis.
- Blok **S** (aturan suara) disetujui lebih dulu atau bersamaan, karena blok
  lain ditulis menurutnya.
- Teks antarmuka (UI1), tombol P2, dan label gambar L4 masuk lewat PR kode,
  bukan Sanity.

## Sumber

- Teks Indonesia dibaca 31 Oktober 2026 sekitar 14.30 UTC dari ekspor publik
  dataset `production` (391 dokumen, sha256 `2bec92cb366d…`) dan dari 14
  halaman produksi (`https://arth-test-01.vercel.app/id/…`), supaya teks yang
  dirender dari kode ikut terbaca.
- Dicocokkan ulang 14 November 2026. Ekspor publik hari itu berisi 391
  dokumen yang sama persis dengan ekspor 31 Oktober; hanya urutannya berbeda,
  dan `_updatedAt` terakhir di dataset 24 Oktober 2026. `messages/id.json`
  hanya bertambah `home.sequenceLink` (B6). Setiap teks ID di file ini cocok
  kata demi kata dengan Sanity, `messages/id.json`, atau `lib/plates`.
- Kebijakan tidak termasuk: teks Indonesianya masih bertanda tinjauan hukum.
- Alamat contoh di `siteSettings.alamat` tidak diterjemahkan karena tidak
  tampil (P4).

## 1. Aturan suara Inggris (blok S)

Berlaku untuk semua teks Inggris di situs, baik isi Sanity maupun
`messages/en.json`.

_Disesuaikan 14 November._ Aturan 5 diperjelas untuk "data layer".

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
5. **Kata katalog tidak tampil** (glosarium §1): side, chapter, offer, layer
   dan tier dalam arti lapis katalog, kode modul, dan kode katalog. Penggantinya
   label pembaca (§3), "situation", dan "work". "Data layer" untuk "lapisan
   data" (UT2, ST-A4) adalah istilah teknis, bukan kata katalog. Bila teks
   Indonesia yang tayang masih memuat kata katalog, Inggrisnya memakai
   pengganti glosarium dan temuannya dicatat di bagian 16.
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

Ringkasan (`ringkas`) tidak tampil di halaman sekarang; Inggrisnya tetap
disiapkan supaya medannya lengkap.

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

_Disesuaikan._ Teks Indonesia sama. Rangkaian Kafe baru (B6) kini tampil di atas blok ini dan sudah memperkenalkan ketiga unit, jadi kalimat pilar 1 sampai 3 memakai bentuk “The Konstruksi unit” seperti “Unit Konstruksi”, tanpa mengulang penjelas (S4).

- `heroPembuka`
  - ID: Usaha jarang berhenti karena satu masalah besar. Usaha tersendat di tiga tempat: proyek yang macet di celah administrasi, tenaga, material, dan modal; pekerjaan berulang yang masih dikerjakan tangan; dan pasar yang belum cukup mengenal, memercayai, dan membeli. Kami bekerja di ketiga tempat itu lewat tiga unit.
  - EN: A business rarely stops because of one big problem. It stalls in three places: projects stuck in gaps of paperwork, labour, materials, and capital; repetitive work still done by hand; and a market that does not yet know, trust, or buy from you enough. We work in all three places through three units.
- `pilar[pilar-1].lead`
  - ID: Kami mengisi celah proyek dan membangun sampai jadi.
  - EN: We fill project gaps and see the build through.
- `pilar[pilar-1].isi`
  - ID: Unit Konstruksi mengambil bagian proyek yang tidak sempat atau tidak sanggup Anda tangani, dari administrasi dengan pemerintah sampai tenaga, material, alat, dan modal kerja yang dijembatani mitra. Bagi pemilik bangunan, kami membangun dari hulu ke hilir, lalu merawatnya lewat Membership Care.
  - EN: The Konstruksi unit takes on the parts of a project you have no time for or cannot handle: from paperwork with the government to labour, materials, equipment, and working capital bridged through partners. For building owners, we build from start to finish, then look after the building through Membership Care.
- `pilar[pilar-2].lead`
  - ID: Kami membuka pasar baru dan mengotomatiskan sisanya.
  - EN: We open new markets and automate the rest.
- `pilar[pilar-2].isi`
  - ID: Unit Teknologi membuka kanal pendapatan yang berjalan di samping usaha Anda, lalu memasang bot dan workflow yang menjawab, menagih, dan memantau tanpa menunggu diingatkan.
  - EN: The Teknologi unit opens revenue channels that run alongside your business, then sets up bots and workflows that reply, bill, and monitor without waiting to be reminded.
- `pilar[pilar-3].lead`
  - ID: Kami merebut pasar.
  - EN: We win market share.
- `pilar[pilar-3].isi`
  - ID: Unit Agency, Peekabo, membuat usaha Anda dikenal lewat iklan dan aset yang diproduksi massal, dipercaya lewat kampanye di lapangan, lalu dibeli lewat kreator, host live, sales, dan komunitas yang ikut menjualkan.
  - EN: Our agency unit, Peekabo, makes your business known through ads and assets produced in volume, trusted through campaigns on the ground, then bought through creators, live hosts, sales staff, and a community that sells for you.
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

### B6 · Rangkaian di beranda

_Baru._ Beranda kini menampilkan rangkaian Kafe baru di antara situasi pembaca dan Tentang Arthur. Isinya sama dengan L1, judul pekerjaan di L3, dan gambar kerja di L4, jadi disetujui di sana; yang baru di beranda hanya tautan ke `/layanan`.

Inggris di `messages/en.json` sekarang: “See every sequence”.

- `home.sequenceLink` (`messages`)
  - ID: Lihat semua rangkaian
  - EN: See all sequences

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
pertama; padanan glosarium dipakai untuk nama situasinya di SK-A4.

### SK-A3 · Langkah pertama

- `langkahPertama.label`
  - ID: Ceritakan bagian yang macet
  - EN: Tell us what is stuck
- `langkahPertama.sesudahnya`
  - ID: Kami mulai dari satu bagian proyek yang tak sanggup Anda tangani. Seluruh lingkup atau paket menurut posisi Anda bisa menyusul.
  - EN: We start with one part of the project you cannot handle. The whole scope, or a package for your role, can follow.

### SK-A4 · Kartu situasi

_Baru._ 12 kartu di bagian “Temukan situasinya”: nama situasi, kalimat situasinya, lalu pekerjaan “Mulai dari sini” dan hasilnya. Label jenis pekerjaan di kartu ada di J1.

Nama kartu pertama memakai padanan glosarium “One subcontractor for the whole scope”. “Unit” untuk rumah di kartu developer menjadi “home”, supaya tidak tertukar dengan unit Arthur. TKDN diberi penjelas “local content certification”.

**1.** `bab` `arthur-bab-konstruksi-pelaku-proyek-hulu-hilir`, pekerjaan pembuka `offer` `arthur-offer-hhk-03`

- `nama`
  - ID: Satu subkon untuk seluruh lingkup
  - EN: One subcontractor for the whole scope
- `situasi`
  - ID: Paketnya sudah menang, tetapi belum ada subkon yang sanggup memegang semuanya. Satu subkon memegang tenaga, material, alat, dan laporan untuk satu lingkup pekerjaan, dari hulu ke hilir.
  - EN: The package is won, but no subcontractor can take charge of all of it. One subcontractor takes charge of labour, materials, equipment, and reports for one scope of work, from start to finish.
- `offer.judul`
  - ID: Subkontrak hulu-hilir: toilet dan sanitasi sekolah
  - EN: Start-to-finish subcontract: school toilets and sanitation
- `offer.dampak`
  - ID: Toilet, air bersih, dan septic tank selesai sebagai satu paket yang fungsinya teruji sebelum serah terima.
  - EN: Toilets, clean water, and the septic tank are finished as one package, tested to work before handover.

**2.** `bab` `arthur-bab-konstruksi-pelaku-proyek-administrasi-pemerintah`, pekerjaan pembuka `offer` `arthur-offer-adm-01`

- `nama`
  - ID: Administrasi dengan pemerintah
  - EN: Paperwork with the government
- `situasi`
  - ID: Dokumen menumpuk, tender terlewat, dan berkas termin selalu terlambat. Paket dipantau setiap minggu, berkas kualifikasi dan penawaran disiapkan, dan berkas termin dijaga lengkap.
  - EN: Documents pile up, tenders are missed, and progress payment claims are always late. Packages are tracked every week, qualification and bid documents are prepared, and progress payment claims are kept complete.
- `offer.judul`
  - ID: Pemantauan paket tender regional
  - EN: Tracking regional tender packages
- `offer.dampak`
  - ID: Paket baru di Subang, Purwakarta, dan Bandung terkumpul setiap minggu sehingga tidak ada yang terlewat.
  - EN: New packages in Subang, Purwakarta, and Bandung are gathered every week, so none are missed.

**3.** `bab` `arthur-bab-konstruksi-pelaku-proyek-tenaga-kerja`, pekerjaan pembuka `offer` `arthur-offer-tnk-01`

- `nama`
  - ID: Tenaga kerja
  - EN: Labour
- `situasi`
  - ID: Tukang tidak datang tepat waktu dan tidak ada yang mengendalikan mereka di lapangan. Tukang datang sesuai jadwal, mandor mengendalikan mereka setiap hari, dan upahnya tercatat tertib.
  - EN: Workers do not turn up on time, and nobody keeps them in check on site. Workers arrive on schedule, a foreman supervises them every day, and their wages are recorded properly.
- `offer.judul`
  - ID: Tukang harian
  - EN: Day labourers
- `offer.dampak`
  - ID: Tukang batu, kayu, besi, atau cat datang sesuai jadwal.
  - EN: Masons, carpenters, steel fixers, or painters arrive on schedule.

**4.** `bab` `arthur-bab-konstruksi-pelaku-proyek-material`, pekerjaan pembuka `offer` `arthur-offer-mat-01`

- `nama`
  - ID: Material: harga dan penjadwalan
  - EN: Materials: prices and scheduling
- `situasi`
  - ID: Harga material bergeser, barang telat, dan jadwalnya tidak sinkron dengan pekerjaan. Harga di tiga wilayah dipegang sebagai acuan, dan material dijadwalkan tiba per tahap.
  - EN: Material prices shift, deliveries are late, and their timing does not match the work. Prices in the three areas are kept as a reference, and materials are scheduled to arrive in stages.
- `offer.judul`
  - ID: Daftar harga material regional
  - EN: Regional material price list
- `offer.dampak`
  - ID: Harga material di tiga wilayah diperbarui berkala sebagai pegangan RAB dan negosiasi.
  - EN: Material prices in the three areas are updated regularly, as a basis for bills of quantities and negotiation.

**5.** `bab` `arthur-bab-konstruksi-pelaku-proyek-modal-kerja`, pekerjaan pembuka `offer` `arthur-offer-mod-06`

- `nama`
  - ID: Modal kerja lewat penjembatanan
  - EN: Working capital through bridging
- `situasi`
  - ID: Uang muka belum cair, material harus dibayar dulu, dan tagihan termin belum turun. Kami tidak memberi pinjaman; kebutuhan kas dipetakan lebih dulu, lalu dijembatani lewat tempo material dan mitra pembiayaan berizin. Bila Anda memakai mitra lewat kami, mitra membayar kami komisi, dan kami menyebutkannya sejak awal.
  - EN: The down payment has not been released, materials must be paid for first, and the progress payment has not come through. We do not lend money; cash needs are mapped first, then bridged through supplier credit terms and licensed financing partners. If you use a partner through us, the partner pays us a commission, and we tell you this from the start.
- `offer.judul`
  - ID: Rencana arus kas proyek
  - EN: Project cash flow plan
- `offer.dampak`
  - ID: Kebutuhan kas dan jadwal termin terproyeksi sebelum kerja dimulai.
  - EN: Cash needs and the progress payment schedule are projected before work starts.

**6.** `bab` `arthur-bab-konstruksi-pelaku-proyek-alat`, pekerjaan pembuka `offer` `arthur-offer-alt-02`

- `nama`
  - ID: Alat dan peralatan
  - EN: Tools and equipment
- `situasi`
  - ID: Anda butuh alat hanya beberapa hari dan tidak mau membelinya. Peralatan ringan disewakan per hari, diantar ke lokasi, dan diperiksa sebelum dipakai.
  - EN: You need equipment for only a few days and do not want to buy it. Light equipment is rented out by the day, delivered to the site, and checked before use.
- `offer.judul`
  - ID: Sewa peralatan ringan
  - EN: Light equipment rental
- `offer.dampak`
  - ID: Molen, stamper, dan perancah tersedia per hari.
  - EN: Concrete mixers, compactors, and scaffolding are available by the day.

**7.** `bab` `arthur-bab-konstruksi-pelaku-proyek-administrasi-proyek`, pekerjaan pembuka `offer` `arthur-offer-prj-04`

- `nama`
  - ID: Administrasi internal proyek
  - EN: Internal project administration
- `situasi`
  - ID: Laporan lewat chat, kurva S tidak jelas, dan biaya lapangan tidak terpantau. Laporan disusun dalam format pemberi kerja, kurva S diperbarui setiap minggu, dan anggaran dibandingkan dengan realisasinya.
  - EN: Reports arrive by chat, the S-curve is unclear, and site costs go untracked. Reports are written in the client’s format, the S-curve is updated every week, and the budget is compared with actual spending.
- `offer.judul`
  - ID: Dokumentasi foto progres
  - EN: Progress photo records
- `offer.dampak`
  - ID: Foto 0, 50, dan 100 persen tersusun rapi sebagai bukti.
  - EN: Photos at 0, 50, and 100 per cent are filed neatly as evidence.

**8.** `bab` `arthur-bab-konstruksi-pelaku-proyek-konsultan-pengadaan`, pekerjaan pembuka `offer` `arthur-offer-pny-01`

- `nama`
  - ID: Konsultan pengadaan untuk penyedia barang
  - EN: Procurement consulting for goods suppliers
- `situasi`
  - ID: Anda penyedia, tetapi sulit mencari barang dengan margin sehat dan mengurus TKDN. Sumber barang dan harga pembanding dicari sebelum Anda menawar, dan pengajuan TKDN didampingi.
  - EN: You are a supplier, but it is hard to find goods with a healthy margin and to handle local content certification (TKDN). Sources of goods and comparison prices are found before you bid, and we assist with your TKDN application.
- `offer.judul`
  - ID: Riset sumber barang
  - EN: Sourcing research
- `offer.dampak`
  - ID: Pemasok dan produsen dengan harga pembanding ditemukan sebelum Anda menawar.
  - EN: Suppliers and manufacturers, with comparison prices, are found before you bid.

**9.** `bab` `arthur-bab-konstruksi-pelaku-proyek-penyedia-instansi`, pekerjaan pembuka `offer` `arthur-offer-gov-03`

- `nama`
  - ID: Arthur sebagai penyedia untuk instansi
  - EN: Arthur as a supplier to government agencies
- `situasi`
  - ID: Instansi butuh barang sesuai spesifikasi, tepat waktu, dan dengan dokumen lengkap. Kami menjadi penyedia: barang dibuat menurut spesifikasi, dipasang bila perlu, dan klaim garansinya ditangani.
  - EN: A government agency needs goods to specification, on time, and with complete documents. We act as the supplier: goods are made to specification, installed when needed, and warranty claims are handled.
- `offer.judul`
  - ID: Pengadaan papan nama, signage, dan papan informasi
  - EN: Supplying name boards, signage, and information boards
- `offer.dampak`
  - ID: Papan dan penanda dibuat sesuai ukuran dan spesifikasi.
  - EN: Boards and signs are made to size and specification.

**10.** `bab` `arthur-bab-konstruksi-pelaku-proyek-developer-perumahan`, pekerjaan pembuka `offer` `arthur-offer-dev-05`

- `nama`
  - ID: Developer perumahan
  - EN: Housing developers
- `situasi`
  - ID: Unit selesai, tetapi finishing telat, komplain menumpuk, dan laporan untuk bank belum siap. Setiap unit diperiksa sebelum serah terima, komplain pembeli diperbaiki, dan laporan progres per unit disusun untuk bank.
  - EN: The homes are built, but finishing runs late, complaints pile up, and reports for the bank are not ready. Every home is inspected before handover, buyers’ complaints are fixed, and a progress report for each home is prepared for the bank.
- `offer.judul`
  - ID: Pemeriksaan sebelum serah terima
  - EN: Inspection before handover
- `offer.dampak`
  - ID: Daftar periksa dan perbaikan tiap unit sebelum diserahkan.
  - EN: A checklist and repairs for each home before it is handed over.

**11.** `bab` `arthur-bab-konstruksi-pelaku-proyek-kontraktor-swasta`, pekerjaan pembuka `offer` `arthur-offer-ksw-01`

- `nama`
  - ID: Kontraktor swasta
  - EN: Private contractors
- `situasi`
  - ID: Proyek swasta Anda kekurangan tenaga dan material yang datang tepat waktu. Tukang dengan mandor, material per tahap, dan tim finishing tersedia untuk proyek klien Anda.
  - EN: Your private project is short of labour and of materials that arrive on time. Workers with a foreman, materials in stages, and a finishing team are available for your clients’ projects.
- `offer.judul`
  - ID: Tim tukang dan mandor untuk proyek renovasi
  - EN: A crew of workers and a foreman for renovation projects
- `offer.dampak`
  - ID: Tenaga renovasi tersedia dengan pengendali lapangan.
  - EN: Renovation workers are available, with someone in charge on site.

**12.** `bab` `arthur-bab-konstruksi-pelaku-proyek-paket-rakitan`, pekerjaan pembuka `offer` `arthur-offer-rak-09`

- `nama`
  - ID: Paket yang disusun menurut posisi Anda di proyek
  - EN: A package put together for your role
- `situasi`
  - ID: Anda butuh paket yang cocok dengan posisi Anda sekarang, bukan semua layanan. Setiap paket dimulai dari satu posisi dan satu masalah, lalu diisi layanan seminimal mungkin.
  - EN: You need a package that fits your role right now, not every service. Each package starts from one role and one problem, then holds as few services as possible.
- `offer.judul`
  - ID: Paket Tenaga Siaga
  - EN: Standby Labour package
- `offer.dampak`
  - ID: Tenaga terkendali dan terbayar tertib.
  - EN: Workers are supervised and paid properly.

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

### SK-B4 · Kartu situasi

_Baru._ 7 kartu di bagian “Temukan situasinya”: nama situasi, kalimat situasinya, lalu pekerjaan “Mulai dari sini” dan hasilnya. Label jenis pekerjaan di kartu ada di J1.

“Unit kontrakan” menjadi “rental homes”, supaya kata “unit” hanya dipakai untuk unit Arthur.

**1.** `bab` `arthur-bab-konstruksi-pemilik-bangunan-rumah-tinggal`, pekerjaan pembuka `offer` `arthur-offer-rmh-10`

- `nama`
  - ID: Rumah tinggal dan konsumen akhir
  - EN: Homes and end customers
- `situasi`
  - ID: Anda ingin rumah jadi tanpa anggaran yang membengkak. Anggaran dihitung dari gambar sebelum Anda memutuskan, dan pekerjaannya diawasi satu pihak sampai serah terima.
  - EN: You want your house finished without the budget ballooning. The budget is worked out from the drawings before you decide, and one party supervises the work until handover.
- `offer.judul`
  - ID: RAB dan estimasi biaya sebelum membangun
  - EN: Bill of quantities and cost estimate before building
- `offer.dampak`
  - ID: Anggaran dihitung dari gambar dan harga pasar sebelum Anda memutuskan.
  - EN: The budget is worked out from the drawings and market prices before you decide.

**2.** `bab` `arthur-bab-konstruksi-pemilik-bangunan-desain-interior`, pekerjaan pembuka `offer` `arthur-offer-itr-01`

- `nama`
  - ID: Desain interior: teknis lapangan dan visualisasi
  - EN: Interior design: technical site work and visuals
- `situasi`
  - ID: Anda tahu ruangan yang Anda mau, tetapi sulit menjelaskannya kepada tukang. Kebutuhan ruang dirumuskan dulu, ruangannya divisualisasikan, lalu tukang bekerja dari gambar yang jelas.
  - EN: You know the room you want, but it is hard to explain to the workers. Space requirements are set out first, the room is visualised, then the workers build from clear drawings.
- `offer.judul`
  - ID: Analisis kebutuhan ruang
  - EN: Space requirements analysis
- `offer.dampak`
  - ID: Kebutuhan, kebiasaan, dan batas anggaran dirumuskan sebelum gambar dibuat.
  - EN: Requirements, habits, and budget limits are set out before any drawing is made.

**3.** `bab` `arthur-bab-konstruksi-pemilik-bangunan-fnb`, pekerjaan pembuka `offer` `arthur-offer-fnb-06`

- `nama`
  - ID: Konstruksi F&B
  - EN: Food and beverage construction
- `situasi`
  - ID: Lokasinya sudah dapat, tetapi belum berbentuk kafe dan alur dapurnya belum jalan. Kami menata dapur, ruang duduk, dan tampilannya sampai alur pelanggan dan dapurnya bekerja.
  - EN: You have the site, but it does not look like a café yet and the kitchen flow does not work. We lay out the kitchen, the seating area, and the look until the customer flow and the kitchen both work.
- `offer.judul`
  - ID: Alur dapur yang mempercepat penyajian
  - EN: A kitchen flow that serves faster
- `offer.dampak`
  - ID: Posisi kompor, bar, dan pass-out mengurangi langkah dan waktu tunggu.
  - EN: The positions of the stove, the bar, and the pass cut steps and waiting time.

**4.** `bab` `arthur-bab-konstruksi-pemilik-bangunan-studio-streaming`, pekerjaan pembuka `offer` `arthur-offer-std-03`

- `nama`
  - ID: Studio streaming dan workshop media
  - EN: Streaming studios and media workshops
- `situasi`
  - ID: Siaran Anda terganggu gema, listrik yang tidak stabil, atau set yang berantakan. Akustik, kelistrikan, cahaya, dan set ditangani satu pihak sampai ruangannya siap siaran.
  - EN: Your broadcasts suffer from echo, unstable power, or a messy set. Acoustics, electrics, lighting, and the set are handled by one party until the room is ready to broadcast.
- `offer.judul`
  - ID: Pencahayaan set siaran
  - EN: Lighting for the broadcast set
- `offer.dampak`
  - ID: Wajah dan produk tampil jelas tanpa silau.
  - EN: Faces and products show clearly, without glare.

**5.** `bab` `arthur-bab-konstruksi-pemilik-bangunan-makeover-villa`, pekerjaan pembuka `offer` `arthur-offer-hos-09`

- `nama`
  - ID: Makeover villa, kontrakan, hotel, dan hostel
  - EN: Makeovers for villas, rental houses, hotels, and hostels
- `situasi`
  - ID: Properti Anda kusam dan sulit disewakan dengan tarif yang pantas. Kamar mandi, atap, dan tampilannya dibenahi, dan unit kontrakan atau kos bisa dibenahi di sela pergantian penyewa.
  - EN: Your property looks tired and is hard to rent out at a fair rate. Bathrooms, roofs, and the look are put right, and rental homes or boarding rooms can be refreshed between tenants.
- `offer.judul`
  - ID: Makeover cepat antarpenyewa
  - EN: Quick makeovers between tenants
- `offer.dampak`
  - ID: Unit dibenahi segera setelah penyewa pergi, sebelum penyewa berikutnya masuk.
  - EN: The place is refreshed as soon as one tenant leaves, before the next one moves in.

**6.** `bab` `arthur-bab-konstruksi-pemilik-bangunan-membership-care`, pekerjaan pembuka `offer` `arthur-offer-rwt-02`

- `nama`
  - ID: Membership Care
  - EN: Membership Care
- `situasi`
  - ID: Properti Anda cepat kusam karena tidak ada yang merawatnya secara rutin. Kondisinya diperiksa setiap bulan dan dilaporkan dengan foto, jadi perawatan diputuskan dari data.
  - EN: Your property quickly looks tired because nobody looks after it regularly. Its condition is checked every month and reported with photos, so upkeep is decided from the data.
- `offer.judul`
  - ID: Inspeksi bulanan dengan laporan foto
  - EN: Monthly inspection with a photo report
- `offer.dampak`
  - ID: Kondisi bangunan terlihat tanpa Anda harus datang.
  - EN: You can see the building’s condition without having to visit.

**7.** `bab` `arthur-bab-konstruksi-pemilik-bangunan-lewat-mitra`, pekerjaan pembuka `offer` `arthur-offer-kom-01`

- `nama`
  - ID: Nilai tambah lewat mitra
  - EN: Added value through partners
- `situasi`
  - ID: Anda butuh pembiayaan untuk renovasi atau peralatan, atau ingin properti hasil makeover dipasarkan. Kami tidak memberi pinjaman; kami menghubungkan Anda dengan mitra berizin dan menjelaskan syaratnya secara terbuka. Bila Anda memakai mitra lewat kami, mitra membayar kami komisi, dan kami menyebutkannya sejak awal.
  - EN: You need financing for a renovation or equipment, or you want the property marketed after its makeover. We do not lend money; we connect you with licensed partners and explain their terms openly. If you use a partner through us, the partner pays us a commission, and we tell you this from the start.
- `offer.judul`
  - ID: Pembiayaan renovasi lewat mitra
  - EN: Renovation financing through partners
- `offer.dampak`
  - ID: Renovasi dibiayai lewat mitra pembiayaan dengan syarat yang dijelaskan terbuka.
  - EN: The renovation is financed through a financing partner, with the terms explained openly.

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

### ST-B4 · Kartu situasi

_Baru._ 17 kartu di bagian “Temukan situasinya”: nama situasi, kalimat situasinya, lalu pekerjaan “Mulai dari sini” dan hasilnya. Label jenis pekerjaan di kartu ada di J1.

“Unit” di kartu properti menjadi “listing”. “SPP” menjadi “school fees”.

**1.** `bab` `arthur-bab-teknologi-siap-pakai-kuliner`, pekerjaan pembuka `offer` `arthur-offer-kul-01`

- `nama`
  - ID: Kuliner dan F&B
  - EN: Food and beverage
- `situasi`
  - ID: Untuk warung, kafe, katering, produsen makanan, dan usaha dengan banyak outlet. Pesanan di chat bercampur, dan kasir kewalahan saat ramai.
  - EN: For food stalls, cafés, caterers, food producers, and businesses with many outlets. Orders get mixed up in chat, and the cashier is swamped at busy times.
- `offer.judul`
  - ID: Bot pesan-antar WhatsApp
  - EN: WhatsApp delivery order bot
- `offer.dampak`
  - ID: Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada admin yang berjaga.
  - EN: The bot records and bills every WhatsApp order, even when no admin is on duty.

**2.** `bab` `arthur-bab-teknologi-siap-pakai-ritel`, pekerjaan pembuka `offer` `arthur-offer-rit-01`

- `nama`
  - ID: Ritel, fesyen, dan e-commerce
  - EN: Retail, fashion, and e-commerce
- `situasi`
  - ID: Anda bergantung pada marketplace, stok tidak sinkron, dan pelanggan datang sekali lalu hilang. Stok di semua kanal diambil dari satu sumber, dan toko brand sendiri menyimpan data pembeli Anda.
  - EN: You depend on marketplaces, stock is out of sync, and customers come once and then disappear. Stock on every channel comes from one source, and your own brand store keeps your buyers’ data.
- `offer.judul`
  - ID: Bot sinkron stok lintas marketplace
  - EN: Stock sync bot across marketplaces
- `offer.dampak`
  - ID: Stok di semua kanal berasal dari satu sumber, sehingga barang yang habis tidak tampil tersedia.
  - EN: Stock on every channel comes from one source, so sold-out items do not show as available.

**3.** `bab` `arthur-bab-teknologi-siap-pakai-distributor`, pekerjaan pembuka `offer` `arthur-offer-dis-01`

- `nama`
  - ID: Distributor, grosir, dan toko bangunan
  - EN: Distributors, wholesalers, and building supply stores
- `situasi`
  - ID: Pesanan sales masuk lewat chat, stok selisih, dan piutang telat. Pesanan sales masuk langsung ke gudang, stok dicocokkan berkala, dan pengingat piutang terkirim bertahap.
  - EN: Sales staff send orders by chat, stock counts do not match, and receivables are paid late. Sales orders go straight to the warehouse, stock is reconciled regularly, and payment reminders go out in stages.
- `offer.judul`
  - ID: Bot pesanan sales lapangan
  - EN: Field sales order bot
- `offer.dampak`
  - ID: Pesanan sales masuk langsung ke gudang tanpa lewat chat dan tanpa salah ketik.
  - EN: Sales orders go straight to the warehouse, without chat and without typing errors.

**4.** `bab` `arthur-bab-teknologi-siap-pakai-jasa-lokal`, pekerjaan pembuka `offer` `arthur-offer-jas-01`

- `nama`
  - ID: Jasa lokal: salon, bengkel, laundry, kos, dan rental
  - EN: Local services: salons, repair shops, laundries, boarding houses, and rentals
- `situasi`
  - ID: Jadwal bentrok, pelanggan lupa datang, tagihan kos menunggak, dan mesin harus dijaga terus. Pelanggan memesan jadwal lewat bot, tagihan kos berjalan sendiri, dan mesin laundry menyala setelah bayar QRIS.
  - EN: Bookings clash, customers forget to come, boarding house rent goes unpaid, and machines need constant watching. Customers book through a bot, rent bills go out on their own, and laundry machines start after a QRIS payment.
- `offer.judul`
  - ID: Bot booking dan pengingat
  - EN: Booking and reminder bot
- `offer.dampak`
  - ID: Pelanggan memesan jadwal lewat bot dan menerima pengingat sebelum datang.
  - EN: Customers book through the bot and get a reminder before they come.

**5.** `bab` `arthur-bab-teknologi-siap-pakai-klinik`, pekerjaan pembuka `offer` `arthur-offer-kes-01`

- `nama`
  - ID: Klinik dan kesehatan
  - EN: Clinics and health care
- `situasi`
  - ID: Telepon janji temu menumpuk, data pasien diketik berulang, dan pasien lupa kontrol. Pasien membuat janji lewat bot, datanya tidak diketik ulang di setiap meja, dan pengingat kontrol dikirim kepada pasien yang setuju.
  - EN: Appointment calls pile up, patient data is typed again and again, and patients forget follow-up visits. Patients book through a bot, their data is not retyped at every desk, and follow-up reminders go to patients who agree to receive them.
- `offer.judul`
  - ID: Bot janji temu
  - EN: Appointment bot
- `offer.dampak`
  - ID: Pasien membuat janji sendiri lewat bot, tanpa menunggu telepon dijawab.
  - EN: Patients book their own appointments through the bot, without waiting for the phone to be answered.

**6.** `bab` `arthur-bab-teknologi-siap-pakai-pendidikan`, pekerjaan pembuka `offer` `arthur-offer-edu-01`

- `nama`
  - ID: Pendidikan dan pelatihan
  - EN: Education and training
- `situasi`
  - ID: SPP menunggak, pendaftaran masih kertas, dan pendapatan hanya dari kelas tatap muka. Tagihan SPP terkirim ke orang tua, pendaftaran berjalan online, dan kelas berlangganan dibuka di samping kelas tatap muka.
  - EN: School fees go unpaid, enrolment is still on paper, and income comes only from in-person classes. Fee bills go to parents, enrolment runs online, and subscription classes open alongside in-person classes.
- `offer.judul`
  - ID: Bot pengingat SPP dan tagihan
  - EN: School fee and bill reminder bot
- `offer.dampak`
  - ID: Orang tua menerima tagihan dan kode bayar SPP tanpa datang ke sekolah.
  - EN: Parents receive the school fee bill and payment code without coming to the school.

**7.** `bab` `arthur-bab-teknologi-siap-pakai-properti`, pekerjaan pembuka `offer` `arthur-offer-pro-01`

- `nama`
  - ID: Properti, dealer, dan showroom
  - EN: Property, dealers, and showrooms
- `situasi`
  - ID: Prospek tercecer, pengajuan leasing tidak terpantau, dan pelanggan lama tak pernah dihubungi lagi. Pertanyaan calon pembeli dijawab seketika, tahap prospek terlihat, dan pelanggan lama menerima pengingat.
  - EN: Prospects slip through the cracks, leasing applications go untracked, and past customers are never contacted again. Questions from potential buyers are answered at once, each prospect’s stage is visible, and past customers receive reminders.
- `offer.judul`
  - ID: Bot penjawab calon pembeli 24 jam
  - EN: 24-hour reply bot for potential buyers
- `offer.dampak`
  - ID: Pertanyaan unit dijawab seketika dan survei langsung terjadwal.
  - EN: Questions about a listing are answered at once, and viewings are booked straight away.

**8.** `bab` `arthur-bab-teknologi-siap-pakai-keuangan`, pekerjaan pembuka `offer` `arthur-offer-keu-09`

- `nama`
  - ID: Keuangan, trading, dan pembiayaan
  - EN: Financial services, trading, and financing
- `situasi`
  - ID: Angsuran dikejar manual dan berkas menumpuk. Angsuran dan iuran ditagih serta dicocokkan otomatis, dan berkas pemohon diverifikasi dengan setiap keputusan tercatat.
  - EN: Instalments are chased by hand, and files pile up. Instalments and dues are billed and reconciled automatically, and applicants’ files are verified, with every decision recorded.
- `offer.judul`
  - ID: Bot angsuran dan iuran
  - EN: Instalment and dues bot
- `offer.dampak`
  - ID: Angsuran dan iuran ditagih dan dicocokkan otomatis.
  - EN: Instalments and dues are billed and reconciled automatically.

**9.** `bab` `arthur-bab-teknologi-siap-pakai-konstruksi`, pekerjaan pembuka `offer` `arthur-offer-kon-01`

- `nama`
  - ID: Konstruksi dan kontraktor
  - EN: Construction and contractors
- `situasi`
  - ID: Tender terlewat, dokumen tidak siap, laporan lapangan lewat chat, dan termin lambat cair. Paket baru dipantau setiap hari, laporan lapangan terkirim walau tanpa sinyal, dan berkas termin terkumpul dari laporannya.
  - EN: Tenders are missed, documents are not ready, site reports come by chat, and progress payments are slow to arrive. New packages are tracked every day, site reports get through even without signal, and progress payment claims are assembled from those reports.
- `offer.judul`
  - ID: Bot pemantau tender regional
  - EN: Regional tender tracking bot
- `offer.dampak`
  - ID: Paket tender baru yang sesuai kualifikasi dikirim setiap hari.
  - EN: New tender packages that match your qualifications are sent every day.

**10.** `bab` `arthur-bab-teknologi-siap-pakai-travel`, pekerjaan pembuka `offer` `arthur-offer-trv-04`

- `nama`
  - ID: Travel, hospitality, dan event
  - EN: Travel, hospitality, and events
- `situasi`
  - ID: Booking bentrok, DP dikejar manual, dan tiket event dijual manual. Ketersediaan kamar sinkron di semua kanal, tamu membayar DP dan check-in mandiri, dan tiket event dijual online dengan QR.
  - EN: Bookings clash, deposits are chased by hand, and event tickets are sold by hand. Room availability syncs across channels, guests pay the deposit and check in themselves, and event tickets sell online with QR codes.
- `offer.judul`
  - ID: Sinkron ketersediaan lintas kanal
  - EN: Availability sync across channels
- `offer.dampak`
  - ID: Kamar tidak dobel pesan di banyak platform.
  - EN: Rooms are not double-booked across platforms.

**11.** `bab` `arthur-bab-teknologi-siap-pakai-media`, pekerjaan pembuka `offer` `arthur-offer-med-05`

- `nama`
  - ID: Media, kreator, dan komunitas
  - EN: Media, creators, and communities
- `situasi`
  - ID: Audiens Anda besar tetapi pendapatan tipis, dan konten serta komunitas dikelola manual. Komunitas disambut dan ditagih otomatis, produk digital dan membership dijual berulang, dan jadwal konten terkoordinasi.
  - EN: Your audience is large but income is thin, and content and community are managed by hand. Community members are welcomed and billed automatically, digital products and memberships are sold on a recurring basis, and the content schedule is coordinated.
- `offer.judul`
  - ID: Bot komunitas Telegram atau Discord
  - EN: Telegram or Discord community bot
- `offer.dampak`
  - ID: Sambutan anggota, aturan, dan iuran berjalan otomatis.
  - EN: Member welcomes, rules, and dues run automatically.

**12.** `bab` `arthur-bab-teknologi-siap-pakai-logistik`, pekerjaan pembuka `offer` `arthur-offer-log-02`

- `nama`
  - ID: Logistik, armada, dan gudang
  - EN: Logistics, fleets, and warehouses
- `situasi`
  - ID: Pelanggan bertanya paketnya di mana, rute boros, dan klaim kerusakan tanpa bukti. Pelanggan diberi kabar di setiap tahap, rute disusun lebih efisien, dan serah terima tercatat dengan foto serta tanda tangan.
  - EN: Customers ask where their parcel is, routes are wasteful, and damage claims have no proof. Customers get an update at every stage, routes are planned more efficiently, and handovers are recorded with a photo and a signature.
- `offer.judul`
  - ID: Bot status kiriman ke pelanggan
  - EN: Delivery status bot for customers
- `offer.dampak`
  - ID: Pelanggan diberi kabar di setiap tahap pengiriman.
  - EN: Customers get an update at every stage of delivery.

**13.** `bab` `arthur-bab-teknologi-siap-pakai-manufaktur-ringan`, pekerjaan pembuka `offer` `arthur-offer-man-03`

- `nama`
  - ID: Manufaktur ringan, agro, dan UMKM produksi
  - EN: Light manufacturing, agriculture, and small producers
- `situasi`
  - ID: Biaya pokok tidak diketahui, mesin berhenti mendadak, dan hasil tani lewat banyak perantara. Panen dan biaya tercatat lewat WhatsApp, biaya pokok tiap batch terkontrol, dan hasil tani dijual langsung ke pembeli.
  - EN: The cost of goods is unknown, machines stop without warning, and farm produce passes through many middlemen. Harvests and costs are recorded through WhatsApp, the cost of each batch is kept under control, and produce is sold straight to buyers.
- `offer.judul`
  - ID: Bot pencatat panen lewat WhatsApp
  - EN: WhatsApp harvest log bot
- `offer.dampak`
  - ID: Hasil panen dan biaya tercatat dari foto atau suara tanpa buku.
  - EN: Harvests and costs are recorded from a photo or a voice note, without a ledger.

**14.** `bab` `arthur-bab-teknologi-siap-pakai-instansi`, pekerjaan pembuka `offer` `arthur-offer-pub-10`

- `nama`
  - ID: Instansi, desa, dan organisasi publik
  - EN: Government agencies, villages, and public organisations
- `situasi`
  - ID: Warga harus datang untuk urusan sederhana, surat menumpuk, dan laporan wajib disusun manual. Syarat layanan dijawab kapan pun, surat diurus online, dan disposisi bergerak dengan jejak yang jelas.
  - EN: Residents must come in person for simple matters, letters pile up, and required reports are compiled by hand. Questions about service requirements are answered at any hour, letters are handled online, and each letter’s routing leaves a clear trail.
- `offer.judul`
  - ID: Bot informasi layanan publik
  - EN: Public service information bot
- `offer.dampak`
  - ID: Syarat dan alur layanan dijawab kapan pun.
  - EN: Questions on service requirements and steps are answered at any hour.

**15.** `bab` `arthur-bab-teknologi-siap-pakai-jasa-profesional`, pekerjaan pembuka `offer` `arthur-offer-prf-01`

- `nama`
  - ID: Jasa profesional dan agensi
  - EN: Professional services and agencies
- `situasi`
  - ID: Prospek tidak ditindaklanjuti, laporan klien disusun manual, dan tenggat klien terlewat. Prospek disaring dan dijadwalkan bot, laporan bulanan terbit sendiri, dan tenggat klien diingatkan.
  - EN: Prospects are not followed up, client reports are compiled by hand, and client deadlines are missed. A bot screens and schedules prospects, monthly reports go out on their own, and client deadlines come with reminders.
- `offer.judul`
  - ID: Bot kualifikasi lead
  - EN: Lead qualification bot
- `offer.dampak`
  - ID: Prospek disaring dan dijadwalkan demo tanpa admin.
  - EN: Prospects are screened and booked for a demo without an admin.

**16.** `bab` `arthur-bab-teknologi-siap-pakai-kebugaran`, pekerjaan pembuka `offer` `arthur-offer-fit-03`

- `nama`
  - ID: Kebugaran, olahraga, dan rekreasi
  - EN: Fitness, sport, and recreation
- `situasi`
  - ID: Jadwal lapangan bentrok, iuran anggota menunggak, dan lampu serta loker harus dijaga orang. Lapangan dipesan dengan DP, iuran diingatkan, dan lampu menyala setelah pembayaran.
  - EN: Court bookings clash, members’ dues go unpaid, and lights and lockers need someone watching them. Courts are booked with a deposit, dues come with reminders, and the lights switch on after payment.
- `offer.judul`
  - ID: Bot pengingat iuran dan kelas
  - EN: Dues and class reminder bot
- `offer.dampak`
  - ID: Anggota diingatkan membayar dan jadwal kelas, dan anggota yang tak aktif dihubungi.
  - EN: Members are reminded to pay and of their class schedule, and inactive members are contacted.

**17.** `bab` `arthur-bab-teknologi-siap-pakai-lintas-sektor`, pekerjaan pembuka `offer` `arthur-offer-lin-17`

- `nama`
  - ID: Lintas sektor: untuk usaha apa pun
  - EN: Across sectors: for any business
- `situasi`
  - ID: Pekerjaan berulang menyita waktu tim Anda, dan pendapatan bergantung pada satu sumber. Laporan, persetujuan, dan rekonsiliasi berjalan sendiri, dan peluang model bisnis baru dipetakan dengan perhitungan terbuka.
  - EN: Repetitive work eats up your team’s time, and income depends on a single source. Reports, approvals, and reconciliation run on their own, and new business model opportunities are mapped with open numbers.
- `offer.judul`
  - ID: Sesi pemetaan peluang model bisnis baru
  - EN: A session to map new business model opportunities
- `offer.dampak`
  - ID: Dari sembilan model dipilih yang cocok dengan aset dan pelanggan Anda, dengan perhitungan terbuka.
  - EN: Out of nine models, those that fit your assets and customers are chosen, with open numbers.

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

### ST-A4 · Kartu situasi

_Baru._ 6 kartu di bagian “Temukan situasinya”: nama situasi, kalimat situasinya, lalu pekerjaan “Mulai dari sini” dan hasilnya. Label jenis pekerjaan di kartu ada di J1.

“Optimasi” menjadi “tuning”, karena “optimise” termasuk kata yang tidak dipakai (S8). “Data layer” istilah teknis (S5).

**1.** `bab` `arthur-bab-teknologi-paham-teknis-individu`, pekerjaan pembuka `offer` `arthur-offer-ind-18`

- `nama`
  - ID: Individu dan pembelajar
  - EN: Individuals and learners
- `situasi`
  - ID: Anda punya selera atau rasa ingin tahu yang spesifik dan ingin membuatnya berjalan. Ide Anda dipetakan dalam satu jam, lalu bot, dasbor, atau portofolionya dapat dibangun.
  - EN: You have a specific interest or curiosity and want to make it work. Your idea is mapped out in one hour, then the bot, dashboard, or portfolio can be built.
- `offer.judul`
  - ID: Sesi klinik arsitektur satu jam
  - EN: One-hour architecture clinic
- `offer.dampak`
  - ID: Ide Anda dipetakan: pakai apa, bangun apa, dan apa yang tidak perlu dibangun.
  - EN: Your idea is mapped out: what to use, what to build, and what does not need building.

**2.** `bab` `arthur-bab-teknologi-paham-teknis-freelancer`, pekerjaan pembuka `offer` `arthur-offer-frl-06`

- `nama`
  - ID: Freelancer dan agensi kecil
  - EN: Freelancers and small agencies
- `situasi`
  - ID: Proyeknya besar, tangan Anda kurang, dan Anda tidak mau menolak klien. Biaya dan jadwal penawaran dihitung lebih dulu, proyeknya kami kerjakan atas nama Anda, lalu dijaga setelah serah terima.
  - EN: The project is big, you are short of hands, and you do not want to turn the client down. The cost and timeline for your bid are worked out first, we build the project under your name, and we maintain it after handover.
- `offer.judul`
  - ID: Estimasi dan lingkup untuk penawaran Anda
  - EN: Estimate and scope for your bid
- `offer.dampak`
  - ID: Penawaran Anda punya biaya dan jadwal yang bisa dipertanggungjawabkan.
  - EN: Your bid has a cost and timeline you can stand behind.

**3.** `bab` `arthur-bab-teknologi-paham-teknis-software-house`, pekerjaan pembuka `offer` `arthur-offer-swh-06`

- `nama`
  - ID: Software house dan perusahaan IT
  - EN: Software houses and IT companies
- `situasi`
  - ID: Tenggat Anda ketat dan spesialis sulit dicari. Proyek bermasalah dinilai jujur lebih dulu, lalu spesialis bekerja mengikuti ritme Anda atau menambah kapasitas saat puncak.
  - EN: Your deadlines are tight and specialists are hard to find. A troubled project gets an honest assessment first, then specialists work at your pace or add capacity at peak times.
- `offer.judul`
  - ID: Audit kode dan pengambilalihan proyek
  - EN: Code audit and project takeover
- `offer.dampak`
  - ID: Proyek bermasalah dinilai jujur lalu dilanjutkan.
  - EN: A troubled project is assessed honestly, then carried on.

**4.** `bab` `arthur-bab-teknologi-paham-teknis-startup`, pekerjaan pembuka `offer` `arthur-offer-sta-02`

- `nama`
  - ID: Startup dan CTO
  - EN: Startups and CTOs
- `situasi`
  - ID: Anda harus rilis cepat dengan uang dan orang yang terbatas. Minat diukur sebelum kode ditulis, MVP dibangun dengan biaya dan tenggat terkunci, dan keputusan teknologi diarahkan tanpa CTO tetap.
  - EN: You have to release fast with limited money and people. Demand is tested before code is written, and the MVP is built at a fixed cost and deadline; technology decisions are guided without a permanent CTO.
- `offer.judul`
  - ID: Uji minat sebelum membangun
  - EN: Test demand before building
- `offer.dampak`
  - ID: Halaman tunggu dan pembayaran uji mengukur minat sebelum satu baris kode ditulis.
  - EN: A waiting list page and test payments measure demand before a single line of code is written.

**5.** `bab` `arthur-bab-teknologi-paham-teknis-tim-it`, pekerjaan pembuka `offer` `arthur-offer-tim-10`

- `nama`
  - ID: Tim IT internal perusahaan
  - EN: In-house company IT teams
- `situasi`
  - ID: Pekerjaan operasional menumpuk dan sistem lama tidak ada yang berani menyentuh. Sistem lama dipetakan dan ditulis lebih dulu, lalu laporan rutin terbit sendiri dan aplikasi diperbarui bertahap.
  - EN: Operational work piles up, and nobody dares touch the old system. The old system is mapped and documented first, then routine reports go out on their own and applications are updated step by step.
- `offer.judul`
  - ID: Dokumentasi ulang sistem tanpa dokumen
  - EN: Documenting a system that has no documents
- `offer.dampak`
  - ID: Sistem yang tak ada yang memahaminya dipetakan dan ditulis.
  - EN: A system nobody understands is mapped and written down.

**6.** `bab` `arthur-bab-teknologi-paham-teknis-lapisan-data`, pekerjaan pembuka `offer` `arthur-offer-dat-03`

- `nama`
  - ID: Lapisan data: SQL, realtime, dan graf
  - EN: Data layer: SQL, real time, and graphs
- `situasi`
  - ID: Data Anda lambat, terlambat, atau tidak terhubung satu sama lain. Query dan indeks dirapikan, peristiwa penting sampai seketika, dan data dari banyak sumber menyatu setiap malam.
  - EN: Your data is slow, late, or not connected. Queries and indexes are tidied up, important events arrive instantly, and data from many sources comes together every night.
- `offer.judul`
  - ID: Optimasi query dan indeks
  - EN: Query and index tuning
- `offer.dampak`
  - ID: Halaman dan laporan yang lambat menjadi cepat.
  - EN: Slow pages and reports become fast.

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

### SP-A4 · Kartu situasi

_Baru._ 8 kartu di bagian “Temukan situasinya”: nama situasi, kalimat situasinya, lalu pekerjaan “Mulai dari sini” dan hasilnya. Label jenis pekerjaan di kartu ada di J1.

“Agency solusi kreatif” menjadi “Creative concept agency”, karena “solution” termasuk kata yang tidak dipakai (S8).

**1.** `bab` `arthur-bab-peekabo-pemilik-usaha-agency-marketing`, pekerjaan pembuka `offer` `arthur-offer-1a-01`

- `nama`
  - ID: Agency marketing
  - EN: Marketing agency
- `situasi`
  - ID: Produk Anda bagus, tetapi yang tahu baru itu-itu saja. Platform, sasaran, dan pesan dipilih sebelum uang iklan keluar, lalu akun, peluncuran, dan kreator dijalankan untuk menjangkau orang baru.
  - EN: Your product is good, but only the same few people know about it. Platforms, audiences, and messages are chosen before any ad money is spent, then accounts, launches, and creators are run to reach new people.
- `offer.judul`
  - ID: Sesi strategi ads: teori dan penerapan pemasarannya
  - EN: Ads strategy session: marketing theory and how to apply it
- `offer.dampak`
  - ID: Anda tahu platform, sasaran, dan pesan mana yang layak dibiayai sebelum uang iklan keluar.
  - EN: You know which platforms, audiences, and messages are worth paying for before any ad money is spent.

**2.** `bab` `arthur-bab-peekabo-pemilik-usaha-produksi-kreatif`, pekerjaan pembuka `offer` `arthur-offer-1b-04`

- `nama`
  - ID: Produksi kreatif
  - EN: Creative production
- `situasi`
  - ID: Kontennya harus keluar setiap minggu, tetapi tidak ada yang membuatnya. Satu hari syuting dirancang untuk mengisi stok konten sebulan, dan kuota bulanan menjaga konten keluar tanpa negosiasi ulang per proyek.
  - EN: Content has to go out every week, but nobody makes it. One shoot day is planned to fill a month of content, and a monthly quota keeps content coming without renegotiating each project.
- `offer.judul`
  - ID: Foto produk dan lifestyle
  - EN: Product and lifestyle photography
- `offer.dampak`
  - ID: Produk tampil layak jual di etalase, iklan, dan katalog.
  - EN: Products look ready to sell in storefronts, ads, and catalogues.

**3.** `bab` `arthur-bab-peekabo-pemilik-usaha-agency-solusi-kreatif`, pekerjaan pembuka `offer` `arthur-offer-1b-01`

- `nama`
  - ID: Agency solusi kreatif
  - EN: Creative concept agency
- `situasi`
  - ID: Anda tidak tahu harus bilang apa supaya orang peduli. Isu, sudut cerita, dan pesan inti disepakati dalam workshop, lalu arah kreatifnya dijaga setiap bulan.
  - EN: You do not know what to say to make people care. The issue, the story angle, and the core message are agreed in a workshop, then the creative direction is kept on track every month.
- `offer.judul`
  - ID: Workshop isu dan framing video
  - EN: Workshop on issues and video framing
- `offer.dampak`
  - ID: Anda pulang membawa isu dan sudut cerita yang menaikkan perhatian, siap diproduksi.
  - EN: You leave with an issue and a story angle that draw attention, ready to produce.

**4.** `bab` `arthur-bab-peekabo-pemilik-usaha-live-commerce`, pekerjaan pembuka `offer` `arthur-offer-liv-01`

- `nama`
  - ID: Live commerce untuk brand
  - EN: Live selling for brands
- `situasi`
  - ID: Anda tidak punya host dan tidak sanggup siaran setiap hari. Live dicoba per jam dengan host dan operator kami, lalu dapat naik menjadi siaran rutin dengan jadwal tetap dan laporan bulanan.
  - EN: You have no host and cannot broadcast every day. Live selling is tried by the hour with our host and operator. It can then become regular broadcasts with a fixed schedule and a monthly report.
- `offer.judul`
  - ID: Live per jam dengan host dan operator
  - EN: Live selling by the hour, with a host and an operator
- `offer.dampak`
  - ID: Anda mencoba live tanpa kontrak panjang, dibayar per jam siaran.
  - EN: You try live selling without a long contract, billed per hour of broadcast.

**5.** `bab` `arthur-bab-peekabo-pemilik-usaha-event`, pekerjaan pembuka `offer` `arthur-offer-2a-06`

- `nama`
  - ID: Experiential dan event
  - EN: Experiential and events
- `situasi`
  - ID: Anda ingin warga datang, mencoba, lalu bercerita. Produk dicoba di tempat orang sudah berkumpul, dibawa ke banyak titik, atau menjadi tujuan event hunting kota.
  - EN: You want local people to come, try, and then talk about it. Your product is tried where people already gather, taken to many spots, or made the goal of a city hunt event.
- `offer.judul`
  - ID: Aktivasi di lokasi mitra: booth, sampling, demo
  - EN: Activations at partner locations: booths, sampling, demos
- `offer.dampak`
  - ID: Produk dicoba langsung di tempat orang sudah berkumpul.
  - EN: The product is tried on the spot where people already gather.

**6.** `bab` `arthur-bab-peekabo-pemilik-usaha-talenta`, pekerjaan pembuka `offer` `arthur-offer-2a-03`

- `nama`
  - ID: Talenta dan kreator untuk brand
  - EN: Talent and creators for brands
- `situasi`
  - ID: Anda butuh orang yang terlatih membawakan produk Anda. Promotor dan host dilatih membawakan produk Anda, dan kreator yang kami kelola membangun cerita brand secara konsisten.
  - EN: You need people trained to present your product. Promoters and hosts are trained to present your product, and creators we manage build your brand story consistently.
- `offer.judul`
  - ID: Campaign talent: promotor, ambassador, host
  - EN: Campaign talent: promoters, ambassadors, hosts
- `offer.dampak`
  - ID: Wajah brand di lapangan yang terlatih membawakan produk Anda.
  - EN: Faces of your brand on the ground, trained to present your product.

**7.** `bab` `arthur-bab-peekabo-pemilik-usaha-outsourcing-penjualan`, pekerjaan pembuka `offer` `arthur-offer-3a-08`

- `nama`
  - ID: Outsourcing penjualan
  - EN: Sales outsourcing
- `situasi`
  - ID: Leads masuk, tetapi tidak ada yang menindaklanjuti sampai jadi. Chat calon pembeli dijawab dan ditutup menjadi pesanan, dan tim sales lapangan mendatangi calon pembeli dengan target harian.
  - EN: Leads come in, but nobody follows them up until the sale closes. Chats from potential buyers are answered and closed into orders, and a field sales team visits potential buyers with daily targets.
- `offer.judul`
  - ID: Admin chat dan penutupan penjualan lewat percakapan
  - EN: Chat admin and closing sales through conversation
- `offer.dampak`
  - ID: Chat calon pembeli dijawab dan ditutup menjadi pesanan.
  - EN: Chats from potential buyers are answered and closed into orders.

**8.** `bab` `arthur-bab-peekabo-pemilik-usaha-ekosistem-marketplace`, pekerjaan pembuka `offer` `arthur-offer-eko-04`

- `nama`
  - ID: Ekosistem marketplace dan jaringan komisi
  - EN: Marketplace ecosystems and commission networks
- `situasi`
  - ID: Anda ingin produk dijualkan banyak orang, tetapi tidak tahu cara mengelola afiliasinya. Harga jual dan komisi afiliasi dihitung ulang setiap biaya platform berubah, dan produk masuk etalase komunitas seller.
  - EN: You want many people selling your product, but you do not know how to manage the affiliates. Selling prices and affiliate commissions are recalculated whenever platform fees change, and your product goes into the seller community’s storefronts.
- `offer.judul`
  - ID: Hitung ulang margin setiap biaya platform berubah
  - EN: Recalculating margins whenever platform fees change
- `offer.dampak`
  - ID: Harga jual dan komisi afiliasi disesuaikan setiap kali biaya komisi, proses, atau logistik platform berubah.
  - EN: Selling prices and affiliate commissions are adjusted whenever the platform’s commission, processing, or logistics fees change.

## 11. Peekabo, untuk jaringan penjual

Dokumen `side` `3222fab5-dc6f-40c5-a96e-5f231bc76e48`, `/peekabo/jaringan`.

### SP-B1 · Kepala dan pembeli

Label halaman mengikuti label Indonesia yang tayang (S6, catatan 16.2).

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

Tampil di bawah judul "Cara kerja": kalimat cara kerja (`jaringan.caraKerja`,
baris terakhir) lebih dulu, lalu empat langkah sebagai "nama. keterangan",
satu baris per langkah.

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

Belum tampil di halaman: blok pendaftaran baru muncul setelah pendaftaran
dibuka (keputusan P4). `langkahPertama.sesudahnya` sudah dipakai sebagai
deskripsi halaman di hasil pencarian, jadi Inggrisnya tetap disiapkan.

- `jaringan.ajakanDaftar.label` dan `langkahPertama.label`
  - ID: Daftar gratis sebagai kreator atau host
  - EN: Sign up free as a creator or host
- `jaringan.ajakanDaftar.sesudahnya` dan `langkahPertama.sesudahnya`
  - ID: Bentuk kerja dan bayarannya, per jam, per bulan, atau dari kontrak brand, disepakati tertulis sebelum kerja dimulai.
  - EN: How you work and are paid, by the hour, by the month, or through a brand contract, is agreed in writing before work starts.

### SP-B5 · Jalur kreator dan host

Satu-satunya situasi di halaman ini, dari dokumen `bab`
`arthur-bab-peekabo-jaringan-kreator`. Ia tampil sebagai jalur ketiga, "Jadi
kreator atau host"; judul jalur dan dua jalur lainnya adalah teks antarmuka
(UI1). Kutipan dan isi halaman situasinya menunggu batch 2b.

- `nama`
  - ID: Kreator, streamer, dan host
  - EN: Creators, streamers, and hosts
- `situasi`
  - ID: Anda bisa live berjam-jam, tetapi penghasilannya belum menentu. Anda dibayar per jam atau per bulan sebagai host toko brand, dilatih menutup penjualan, dan kontrak brand dicarikan untuk Anda.
  - EN: You can go live for hours, but the income is unpredictable. You are paid by the hour or by the month as a host for brand shops. You are trained to close sales, and we look for brand contracts for you.

## 11a. Label jenis pekerjaan di kartu situasi

Medan `jenis` dokumen `offer`. Kartu situasi menampilkan jenis yang berbeda
dari pekerjaan yang disetujui di situasinya (`sideChapterFields` di
`lib/integrations/sanity/queries.ts`). Kolom terakhir menghitung pekerjaan
di dataset yang memuat label itu, yaitu dokumen yang ditulis untuk satu baris.

### J1 · Label jenis pekerjaan

_Baru._ Setiap kartu situasi di SK-A4, SK-B4, ST-B4, ST-A4, dan SP-A4 menampilkan “Jenis pekerjaan”, lalu jenis dari pekerjaan di situasinya. Ada 18 label di kartu: 17 dari glosarium §5 dan satu nama paket Konstruksi (baris 7, catatan 16.7). Label “Alatnya kami jalankan” tidak tampil di kartu mana pun, jadi menunggu batch halaman pekerjaan.

Inggrisnya dari kolom draf glosarium §5, kecuali baris 9: draf “Workflows that move without chasing” diperjelas supaya terbaca polos (S1). Satu label dipakai di banyak pekerjaan, jadi satu baris yang disetujui berlaku di semua kartu dan halaman yang memuatnya.

| Indonesia                                        | Inggris                                             | Pekerjaan yang memuatnya |
| ------------------------------------------------ | --------------------------------------------------- | ------------------------ |
| Bagian proyek yang kami ambil                    | The part of the project we take on                  | 43                       |
| Proyek utuh dari hulu ke hilir                   | Whole projects, start to finish                     | 25                       |
| Barang dan material                              | Goods and materials                                 | 9                        |
| Modal, alat, dan jaminan lewat mitra             | Capital, equipment, and guarantees through partners | 8                        |
| Bangunan yang lebih produktif                    | More productive buildings                           | 8                        |
| Perawatan berkala                                | Scheduled upkeep                                    | 8                        |
| Paket yang disusun menurut posisi Anda di proyek | A package put together for your role                | 7                        |
| Bot yang bekerja sendiri                         | Bots that run on their own                          | 43                       |
| Alur kerja yang berjalan tanpa dikejar           | Workflows that run without anyone chasing them      | 37                       |
| Kanal pendapatan baru                            | New revenue channels                                | 30                       |
| Angka yang memberi tahu lebih dulu               | Numbers that tell you first                         | 25                       |
| Pekerjaan teknis di balik layar                  | Technical work behind the scenes                    | 15                       |
| Konten dan aset jadi                             | Finished content and assets                         | 9                        |
| Arah, strategi, dan kelas                        | Direction, strategy, and training                   | 10                       |
| Kampanye berbatas waktu                          | Time-bound campaigns                                | 8                        |
| Dikelola setiap bulan                            | Managed every month                                 | 6                        |
| Kreator, host, dan sales                         | Creators, hosts, and sales staff                    | 11                       |
| Dijualkan oleh jaringan                          | Sold through a network                              | 3                        |

## 12. `/metode`

Dokumen `howWeWork`. Nama wilayah tetap.

### M1 · Pembuka dan janji

Baris pertama adalah pembuka halaman; sesudahnya lima janji, masing-masing
judul lalu kalimatnya. Judul bagian dan cap "Tertulis" adalah teks antarmuka
(UI1).

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

Urutannya: hak milik klien, pengungkapan komisi, yang tidak kami jual, lalu
format kerja.

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

Dokumen `arthur-rangkaian-kafe-baru`. Rangkaian ini juga tampil di beranda
(B6). Ini sebutan pertama ketiga unit di halaman, jadi namanya diberi
penjelas (S4).

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

Dokumen `arthur-rangkaian-studio-siaran`. Unit sudah diperkenalkan di L1, jadi
kalimatnya memakai "The Konstruksi unit" tanpa penjelas.

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
label gambar kerja `plates.*.job` di `messages/en.json`, tampil juga di beranda
(B6), dan sama dengan nama pekerjaan di gambar kerja (L4).

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

### L4 · Gambar kerja

_Baru._ Setiap langkah Kafe baru, di `/layanan` dan di beranda, memuat gambar kerja unitnya. Judul dan uraian gambar dibacakan pembaca layar dan sudah punya Inggris di `messages/en.json`; dua uraian disesuaikan supaya satu kata Indonesia punya satu padanan. Label di dalam gambar tertulis di kode (`lib/plates`) dan belum punya Inggris, jadi `/en` masih menampilkan label Indonesia sampai kodenya diubah (catatan 16.6).

Baris tebal memisahkan tiga gambar. Di setiap gambar: judul, uraian, nama gambar, lalu label di dalam gambar. Uraian Konstruksi kini memakai “customer flow” seperti L1, dan uraian Peekabo memakai “audience” untuk “sasaran” seperti SP-A4.

**Konstruksi: denah dan potongan**

| Sumber                          | Indonesia                                                                                                                                                                                                                                                                                                                                                        | Inggris                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plates.konstruksi.title`       | Gambar kerja Konstruksi: denah lantai 1 dan potongan sebuah kafe di ruko sewa                                                                                                                                                                                                                                                                                    | Konstruksi working drawing: the ground floor plan and a section of a café in a rented shophouse                                                                                                                                                                                                                                                                                                                                             |
| `plates.konstruksi.description` | Denah memperlihatkan teras, ruang duduk, tangga, bar, loket saji, dapur dengan kompor dan meja olah, gudang bahan, dan tempat cuci. Garis putus menandai alur pelanggan dari jalan ke meja. Garis titik menandai alur bahan, olah, dan saji. Potongan memperlihatkan dua lantai, kanopi, bar, kompor dengan cerobong sampai atap, dan meja di sepanjang dinding. | The plan shows the terrace, the seating, the stair, the bar, the serving hatch, the kitchen with its stove and preparation table, the store, and the sink. A dashed line marks the customer flow from the street to a table. A dotted line marks the route of stock, preparation, and service. The section shows two floors, the canopy, the bar, the stove with its flue up through the roof, and the tables along the wall. (disesuaikan) |
| `plates.konstruksi.drawing`     | Denah lantai 1 dan potongan A-A                                                                                                                                                                                                                                                                                                                                  | Ground floor plan and section A-A                                                                                                                                                                                                                                                                                                                                                                                                           |
| `lib/plates/konstruksi.ts`      | DENAH LANTAI 1                                                                                                                                                                                                                                                                                                                                                   | GROUND FLOOR PLAN                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `lib/plates/konstruksi.ts`      | POTONGAN A-A                                                                                                                                                                                                                                                                                                                                                     | SECTION A-A                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `lib/plates/konstruksi.ts`      | Teras                                                                                                                                                                                                                                                                                                                                                            | Terrace                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/konstruksi.ts`      | Jalan                                                                                                                                                                                                                                                                                                                                                            | Street                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `lib/plates/konstruksi.ts`      | Alur pelanggan                                                                                                                                                                                                                                                                                                                                                   | Customer flow                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `lib/plates/konstruksi.ts`      | Ruang duduk                                                                                                                                                                                                                                                                                                                                                      | Seating                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/konstruksi.ts`      | Tangga naik                                                                                                                                                                                                                                                                                                                                                      | Stairs up                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `lib/plates/konstruksi.ts`      | Tangga                                                                                                                                                                                                                                                                                                                                                           | Stairs                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `lib/plates/konstruksi.ts`      | Bar                                                                                                                                                                                                                                                                                                                                                              | Bar                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `lib/plates/konstruksi.ts`      | Loket saji                                                                                                                                                                                                                                                                                                                                                       | Serving hatch                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `lib/plates/konstruksi.ts`      | Dapur                                                                                                                                                                                                                                                                                                                                                            | Kitchen                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/konstruksi.ts`      | Kompor                                                                                                                                                                                                                                                                                                                                                           | Stove                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `lib/plates/konstruksi.ts`      | Olah                                                                                                                                                                                                                                                                                                                                                             | Prep                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `lib/plates/konstruksi.ts`      | Gudang                                                                                                                                                                                                                                                                                                                                                           | Store                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `lib/plates/konstruksi.ts`      | Cuci                                                                                                                                                                                                                                                                                                                                                             | Sink                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `lib/plates/konstruksi.ts`      | Bahan                                                                                                                                                                                                                                                                                                                                                            | Stock                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `lib/plates/konstruksi.ts`      | Saji                                                                                                                                                                                                                                                                                                                                                             | Service                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/konstruksi.ts`      | Kanopi                                                                                                                                                                                                                                                                                                                                                           | Canopy                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `lib/plates/konstruksi.ts`      | Cerobong                                                                                                                                                                                                                                                                                                                                                         | Flue                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `lib/plates/konstruksi.ts`      | Lantai 2                                                                                                                                                                                                                                                                                                                                                         | Upper floor                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `lib/plates/konstruksi.ts`      | U (penunjuk utara)                                                                                                                                                                                                                                                                                                                                               | N                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `lib/plates/konstruksi.ts`      | ±0,00 · +3,60 · +7,00 · 5,00 (ketinggian dan ukuran, koma desimal)                                                                                                                                                                                                                                                                                               | ±0.00 · +3.60 · +7.00 · 5.00                                                                                                                                                                                                                                                                                                                                                                                                                |

**Teknologi: alur pesanan**

| Sumber                         | Indonesia                                                                                                                                                                                                                                                                                                                                                     | Inggris                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plates.teknologi.title`       | Gambar kerja Teknologi: diagram alur pesanan di kafe yang sama, dari tamu sampai pemasok                                                                                                                                                                                                                                                                      | Teknologi working drawing: the flow of an order in the same café, from the guest to the supplier                                                                                                                                                                                                                                                                                       |
| `plates.teknologi.description` | Empat lajur: tamu, sistem, dapur, dan pemasok. Tamu memesan lewat WhatsApp atau dari meja, lalu membayar dari meja. Pesanan dicatat dengan harga dan promo menurut aturan Anda, dan uang yang masuk cocok dengan catatannya. Layar di dapur menyusun urutan saji. Stok bahan ikut tercatat, dan saat bahan menipis pesanan ulang terkirim sendiri ke pemasok. | Four lanes: guest, system, kitchen, and supplier. Guests order on WhatsApp or at the table, then pay at the table. Each order is recorded with prices and promotions set by your rules, and the money received matches the record. A screen in the kitchen sets the order of service. Stock is recorded too, and when an ingredient runs low a reorder goes to the supplier by itself. |
| `plates.teknologi.drawing`     | Diagram alur pesanan                                                                                                                                                                                                                                                                                                                                          | Order flow diagram                                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/teknologi.ts`      | Tamu                                                                                                                                                                                                                                                                                                                                                          | Guest                                                                                                                                                                                                                                                                                                                                                                                  |
| `lib/plates/teknologi.ts`      | Sistem                                                                                                                                                                                                                                                                                                                                                        | System                                                                                                                                                                                                                                                                                                                                                                                 |
| `lib/plates/teknologi.ts`      | Dapur                                                                                                                                                                                                                                                                                                                                                         | Kitchen                                                                                                                                                                                                                                                                                                                                                                                |
| `lib/plates/teknologi.ts`      | Pemasok                                                                                                                                                                                                                                                                                                                                                       | Supplier                                                                                                                                                                                                                                                                                                                                                                               |
| `lib/plates/teknologi.ts`      | Pesan lewat WhatsApp                                                                                                                                                                                                                                                                                                                                          | Order on WhatsApp                                                                                                                                                                                                                                                                                                                                                                      |
| `lib/plates/teknologi.ts`      | juga saat tidak ada admin yang berjaga                                                                                                                                                                                                                                                                                                                        | even when no admin is on duty                                                                                                                                                                                                                                                                                                                                                          |
| `lib/plates/teknologi.ts`      | Memesan dari meja                                                                                                                                                                                                                                                                                                                                             | Order at the table                                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/teknologi.ts`      | Membayar dari meja                                                                                                                                                                                                                                                                                                                                            | Pay at the table                                                                                                                                                                                                                                                                                                                                                                       |
| `lib/plates/teknologi.ts`      | Harga dan promo                                                                                                                                                                                                                                                                                                                                               | Prices and promotions                                                                                                                                                                                                                                                                                                                                                                  |
| `lib/plates/teknologi.ts`      | menurut aturan Anda                                                                                                                                                                                                                                                                                                                                           | set by your rules                                                                                                                                                                                                                                                                                                                                                                      |
| `lib/plates/teknologi.ts`      | Pesanan dicatat                                                                                                                                                                                                                                                                                                                                               | Order recorded                                                                                                                                                                                                                                                                                                                                                                         |
| `lib/plates/teknologi.ts`      | Uang yang masuk cocok dengan catatan pesanan.                                                                                                                                                                                                                                                                                                                 | The money received matches the order record.                                                                                                                                                                                                                                                                                                                                           |
| `lib/plates/teknologi.ts`      | Stok bahan tercatat                                                                                                                                                                                                                                                                                                                                           | Stock recorded                                                                                                                                                                                                                                                                                                                                                                         |
| `lib/plates/teknologi.ts`      | Layar pesanan di dapur                                                                                                                                                                                                                                                                                                                                        | Kitchen order screen                                                                                                                                                                                                                                                                                                                                                                   |
| `lib/plates/teknologi.ts`      | berikut urutan dan waktu sajinya                                                                                                                                                                                                                                                                                                                              | with the order and time of service                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/teknologi.ts`      | Saji ke meja                                                                                                                                                                                                                                                                                                                                                  | Served to the table                                                                                                                                                                                                                                                                                                                                                                    |
| `lib/plates/teknologi.ts`      | Saji                                                                                                                                                                                                                                                                                                                                                          | Serve                                                                                                                                                                                                                                                                                                                                                                                  |
| `lib/plates/teknologi.ts`      | Bahan menipis?                                                                                                                                                                                                                                                                                                                                                | Stock running low?                                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/teknologi.ts`      | Ya                                                                                                                                                                                                                                                                                                                                                            | Yes                                                                                                                                                                                                                                                                                                                                                                                    |
| `lib/plates/teknologi.ts`      | Tidak                                                                                                                                                                                                                                                                                                                                                         | No                                                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/teknologi.ts`      | Bahan                                                                                                                                                                                                                                                                                                                                                         | Stock                                                                                                                                                                                                                                                                                                                                                                                  |
| `lib/plates/teknologi.ts`      | Pesan ulang ke pemasok                                                                                                                                                                                                                                                                                                                                        | Reorder from the supplier                                                                                                                                                                                                                                                                                                                                                              |
| `lib/plates/teknologi.ts`      | terkirim sendiri saat bahan menipis                                                                                                                                                                                                                                                                                                                           | sent by itself when stock runs low                                                                                                                                                                                                                                                                                                                                                     |

**Peekabo: papan kampanye pembukaan**

| Sumber                       | Indonesia                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Inggris                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `plates.peekabo.title`       | Gambar kerja Peekabo: papan kampanye pembukaan kafe yang sama                                                                                                                                                                                                                                                                                                                                                                                                                                                | Peekabo working drawing: the opening campaign board for the same café                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `plates.peekabo.description` | Kolomnya waktu: sebelum kafe dibuka, hari pertama, dan sesudahnya. Barisnya tujuan: perhatian, kepercayaan, dan penjualan. Perhatian datang dari sasaran dan pesan, iklan di TikTok, Meta, dan Google, satu hari syuting untuk stok konten sebulan, dan media sosial yang dikelola. Kepercayaan datang dari warga sekitar yang diundang lebih dulu, booth dan sampling, dan temu pelanggan. Penjualan datang dari kreator dan host live yang ikut menjual. Target, lingkup, dan laporan disepakati tertulis. | The columns are time: before the café opens, the first day, and after. The rows are aims: attention, trust, and sales. Attention comes from the audience and the message, ads on TikTok, Meta, and Google, one day of shooting for a month of content, and managed social media. Trust comes from inviting the neighbours first, a booth and sampling, and meeting customers. Sales come from creators and live hosts who sell. Targets, scope, and reports are agreed in writing. (disesuaikan) |
| `plates.peekabo.drawing`     | Papan kampanye pembukaan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Opening campaign board                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `lib/plates/peekabo.ts`      | Pembukaan cabang atau gerai                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Opening a branch or an outlet                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `lib/plates/peekabo.ts`      | Untuk usaha F&B, ritel, jasa                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | For food and beverage, retail, and service businesses                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `lib/plates/peekabo.ts`      | Sebelum kafe dibuka                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Before the café opens                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `lib/plates/peekabo.ts`      | Hari pertama dibuka                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Opening day                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `lib/plates/peekabo.ts`      | Sesudahnya                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Afterwards                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `lib/plates/peekabo.ts`      | Perhatian                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Attention                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `lib/plates/peekabo.ts`      | Kepercayaan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Trust                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `lib/plates/peekabo.ts`      | Penjualan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Sales                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `lib/plates/peekabo.ts`      | Sasaran dan pesan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Audience and message                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `lib/plates/peekabo.ts`      | Platform, sasaran, dan pesan dipilih sebelum uang iklan keluar.                                                                                                                                                                                                                                                                                                                                                                                                                                              | Platforms, audiences, and messages are chosen before any ad money is spent.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `lib/plates/peekabo.ts`      | Satu hari syuting                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | One shoot day                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `lib/plates/peekabo.ts`      | menghasilkan stok konten untuk sebulan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | produces a month of content.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `lib/plates/peekabo.ts`      | Iklan di TikTok, Meta, dan Google                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Ads on TikTok, Meta, and Google                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `lib/plates/peekabo.ts`      | dengan aset yang diproduksi massal                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | with assets produced in volume                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `lib/plates/peekabo.ts`      | Manajemen media sosial                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Social media management                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `lib/plates/peekabo.ts`      | Akun aktif dan konsisten setiap minggu tanpa Anda memikirkan apa yang diunggah.                                                                                                                                                                                                                                                                                                                                                                                                                              | Your accounts stay active and consistent every week, without you thinking about what to post.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `lib/plates/peekabo.ts`      | Pendampingan ads bulanan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Monthly ads guidance                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `lib/plates/peekabo.ts`      | Tim Anda tetap memegang akun, sementara kami mengarahkan dan memeriksa hasilnya setiap bulan.                                                                                                                                                                                                                                                                                                                                                                                                                | Your team keeps the accounts, while we guide the work and check the results every month.                                                                                                                                                                                                                                                                                                                                                                                                         |
| `lib/plates/peekabo.ts`      | Warga sekitar diundang lebih dulu                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | The neighbours are invited first                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `lib/plates/peekabo.ts`      | kafe                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | café                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `lib/plates/peekabo.ts`      | Booth, sampling, demo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Booths, sampling, demos                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `lib/plates/peekabo.ts`      | Produk dicoba langsung di tempat orang sudah berkumpul.                                                                                                                                                                                                                                                                                                                                                                                                                                                      | The product is tried on the spot where people already gather.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `lib/plates/peekabo.ts`      | Temu pelanggan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Customer meet-ups                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `lib/plates/peekabo.ts`      | Pelanggan bertemu langsung dan merasa menjadi bagian dari brand.                                                                                                                                                                                                                                                                                                                                                                                                                                             | Customers meet in person and feel part of the brand.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `lib/plates/peekabo.ts`      | Pasokan creator dan influencer                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | A supply of creators and influencers                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `lib/plates/peekabo.ts`      | Anda mendapat kreator yang cocok dengan audiens Anda tanpa mencari satu per satu.                                                                                                                                                                                                                                                                                                                                                                                                                            | You get creators who suit your audience, without searching for them one by one.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `lib/plates/peekabo.ts`      | Kreator, host live, dan sales ikut menjual                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Creators, live hosts, and sales staff sell for you                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `lib/plates/peekabo.ts`      | Mereka dibayar dari penjualan yang terjadi.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | They are paid from the sales that happen.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `lib/plates/peekabo.ts`      | Target, lingkup, dan laporan disepakati tertulis.                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Targets, scope, and reports are agreed in writing.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `lib/plates/peekabo.ts`      | Kami tidak menjanjikan jangkauan atau penjualan.                                                                                                                                                                                                                                                                                                                                                                                                                                                             | We do not promise reach or sales.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### L-meta · Kepala halaman

_Baru, disetujui tersendiri._ Judul dan deskripsi di kepala halaman: `<title>`, `meta description`, dan kartu bagikan `og:` dan `twitter:`, termasuk teks alternatif gambarnya. Halaman membacanya dari rangkaian pertama, `arthur-rangkaian-kafe-baru`. Di Sanity keduanya medan teks biasa, bukan larik per bahasa, jadi hanya memuat satu bahasa, yaitu Indonesia; karena itu `/en/layanan` belum dibuka bersama dua belas halaman lain di #97. Kepala Inggris membaca kunci `messages` di bawah, seperti judul `/metode` membaca `methodPage.title` (UI1). Kepala Indonesia tetap membaca Sanity.

- `metadata.title`, Inggrisnya di `servicesPage.metaTitle`
  - ID: Satu klien, tiga unit: konstruksi, sistem, dan pemasaran
  - EN: One client, three units: construction, systems, and marketing
- `metadata.description`, Inggrisnya di `servicesPage.metaDescription`
  - ID: Rangkaian yang mungkin dari tiga unit Arthur di Subang, Purwakarta, dan Bandung. Setiap unit tetap bisa dibeli sendiri.
  - EN: A possible sequence across Arthur’s three units in Subang, Purwakarta, and Bandung. Each unit can also be hired on its own.

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

### P2 · Tombol halaman

_Baru._ Tombol di akhir halaman. Pada draf 1 November tombol ini hanya disebut di catatan, karena teksnya tertulis langsung di kode (`app/[locale]/pembayaran/page.tsx`), bukan di messages. Langkah kode sesudah persetujuan memindahkannya ke kunci pesan (catatan 16.5). Inggrisnya sama dengan tombol utama situs (`nav.cta`) dan tombol di `/layanan`.

- Tombol di `app/[locale]/pembayaran/page.tsx`, belum punya kunci `messages`
  - ID: Ceritakan masalahnya
  - EN: Tell us the problem

### P-meta · Kepala halaman

_Baru, disetujui tersendiri._ Sama dengan L-meta: `metadata.title` dan `metadata.description` dokumen `arthur-page-cara-kami-dibayar` adalah medan teks biasa yang memuat Indonesia saja. Kepala Inggris membaca kunci `messages` di bawah; kepala Indonesia tetap membaca Sanity. Judul Inggrisnya sama dengan `judul` di P1.

- `metadata.title`, Inggrisnya di `paymentPage.metaTitle`
  - ID: Cara kami dibayar, tertulis sebelum kerja dimulai
  - EN: How we are paid, set in writing before work starts
- `metadata.description`, Inggrisnya di `paymentPage.metaDescription`
  - ID: Dari mana kami dibayar dan apa yang Anda tanggung, tertulis sebelum kerja dimulai.
  - EN: Where our pay comes from and what costs fall on you, set in writing before work starts.

## 15. Teks antarmuka (blok UI1)

_Disesuaikan._ Empat belas baris pertama tetap sejak 1 November. Tujuh baris terakhir baru: teks Inggris yang sekarang melanggar S2 atau S7 (tanda pisah, kontraksi, apostrof lurus, koma serial).

`messages/en.json` sudah memuat Inggris untuk setiap kunci. Kunci yang tampil di 14 halaman ini diperiksa satu per satu; yang tidak disebut di tabel dipakai apa adanya, termasuk teks antarmuka `/peekabo/jaringan` (tiga jalur, empat tahap perujuk, dan judul bagiannya) dan `/metode`. Halaman `/kontak` hanya berisi teks antarmuka dan nama wilayah, jadi isinya ada di sini. Tautan beranda ke `/layanan` ada di B6, teks gambar kerja di L4. Kunci policyPage juga memuat tanda pisah, tetapi Kebijakan di luar dokumen ini.

| Kunci                                              | Indonesia                                                                                                                          | Inggris sekarang                                                                                                                     | Usulan                                                                                                                                                                                | Alasan                                                                                        |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `nav.studio`                                       | Metode kerja                                                                                                                       | Working method                                                                                                                       | How we work                                                                                                                                                                           | Sama dengan judul halamannya (methodPage.title)                                               |
| `side.jaringan`                                    | Jaringan penjual                                                                                                                   | The seller network                                                                                                                   | Sales network                                                                                                                                                                         | Label pendek untuk “For the sales network” (S6)                                               |
| `side.typeLabel`                                   | Jenis pekerjaan                                                                                                                    | Work type                                                                                                                            | Kind of work                                                                                                                                                                          | Kata glosarium §8                                                                             |
| `side.offerCount`                                  | {count} pekerjaan                                                                                                                  | {count} pieces of work                                                                                                               | {count, plural, one {# piece of work} other {# pieces of work}}                                                                                                                       | Bentuk tunggal untuk satu pekerjaan                                                           |
| `unit.examplesEyebrow`                             | Contoh pekerjaan                                                                                                                   | Example work                                                                                                                         | Examples of the work                                                                                                                                                                  | Glosarium §8                                                                                  |
| `home.actionAfterFallback`                         | Kami tentukan unit mana yang bekerja lebih dulu.                                                                                   | We will decide which unit should work first.                                                                                         | We decide which unit works first.                                                                                                                                                     | Kalimat tetap di blok S                                                                       |
| `contactPage.title`                                | Tiga unit. Satu cara memegang pekerjaan.                                                                                           | Three units. One way to hold the work.                                                                                               | Three units. One way of handling the work.                                                                                                                                            | “Hold the work” tidak lazim                                                                   |
| `contactPage.lead`                                 | Arthur adalah payung untuk Konstruksi, Teknologi, dan Peekabo. Masalah dibaca lebih dulu; unit yang bekerja ditentukan sesudahnya. | Arthur is the umbrella for Konstruksi, Teknologi, and Peekabo. The problem is read first; the unit that works is decided afterwards. | Arthur is the umbrella for three units: Konstruksi for construction, Teknologi for systems, and Peekabo, our agency. We read the problem first, then decide which unit does the work. | Sebutan pertama nama unit diberi penjelas (S4)                                                |
| `contactPage.regionsEyebrow`                       | Wilayah kerja                                                                                                                      | Service area                                                                                                                         | Where we work                                                                                                                                                                         | Satu padanan untuk “Wilayah kerja”, sama dengan `methodPage.regionsTitle`                     |
| `contactPage.regionsIntro`                         | Arthur bekerja untuk kebutuhan di Subang, Purwakarta, dan Bandung. Daftar ini menyatakan jangkauan kerja, bukan alamat kantor.     | Arthur works for needs in Subang, Purwakarta, and Bandung. This is a service area, not an office address.                            | Arthur takes on work in Subang, Purwakarta, and Bandung. This list shows where we work, not an office address.                                                                        | “Works for needs in” tidak lazim                                                              |
| `contactPage.regionsLabel`                         | Wilayah layanan Arthur                                                                                                             | Arthur service areas                                                                                                                 | Arthur’s service areas                                                                                                                                                                | Tata bahasa                                                                                   |
| `methodPage.regionCount`                           | {count} wilayah                                                                                                                    | {count} regions                                                                                                                      | {count, plural, one {# area} other {# areas}}                                                                                                                                         | “Area” seperti di `/kontak`; bentuk tunggal                                                   |
| `network.terms.condition`                          | Syarat pembayaran                                                                                                                  | Payment condition                                                                                                                    | Payment conditions                                                                                                                                                                    | Isinya dua syarat                                                                             |
| `footer.contact`                                   | Pesanan                                                                                                                            | Commissions                                                                                                                          | Enquiries                                                                                                                                                                             | “Commissions” sisa situs lama (catatan 16.4)                                                  |
| `home.practiceTitle`                               | Tiga unit Arthur                                                                                                                   | Arthur's three units                                                                                                                 | Arthur’s three units                                                                                                                                                                  | Apostrof tipografis (S7)                                                                      |
| `footer.builtOn`                                   | Dibangun di atas Satūs oleh darkroom.engineering, berlisensi MIT. Hurufnya Onest, Inter, dan Geist Mono.                           | Built on Satūs by darkroom.engineering, MIT licensed. Type is Onest, Inter and Geist Mono.                                           | Built on Satūs by darkroom.engineering, MIT licensed. Type is Onest, Inter, and Geist Mono.                                                                                           | Koma serial (S7); tampil di kaki setiap halaman                                               |
| `home.copyFailed` dan `contactPage.copyFailed`     | Tidak bisa menyalin. Pilih alamat di atas.                                                                                         | Couldn't copy — select the address above                                                                                             | Could not copy. Select the address above.                                                                                                                                             | Tanda pisah dan kontraksi (S2, S7); tampil bila menyalin alamat gagal                         |
| `home.draftPreview` dan `contactPage.draftPreview` | Pratinjau draf Sanity: isi ini belum diterbitkan.                                                                                  | Sanity draft preview — this content is not published.                                                                                | Sanity draft preview: this content is not published.                                                                                                                                  | Tanda pisah (S7); hanya tampil di pratinjau draf                                              |
| `contactPage.ownerTitle`                           | Dari pemilik Arthur.                                                                                                               | From Arthur's owner.                                                                                                                 | From Arthur’s owner.                                                                                                                                                                  | Apostrof tipografis (S7); tampil bila pernyataan pemilik terbit                               |
| `contactPage.metaDescription`                      | Struktur Arthur, wilayah kerja, dan status kanal kontaknya.                                                                        | Arthur's structure, service area, and current contact status.                                                                        | Arthur’s structure, where we work, and the status of our contact channels.                                                                                                            | Apostrof tipografis (S7) dan satu padanan untuk “wilayah kerja”; deskripsi di hasil pencarian |
| `notFound.description`                             | Halaman yang Anda cari tidak ada atau sudah dipindahkan.                                                                           | The page you’re looking for doesn’t exist or has been moved.                                                                         | The page you are looking for does not exist or has been moved.                                                                                                                        | Tanpa kontraksi (S2); tampil di halaman yang tidak ditemukan                                  |

## 16. Catatan untuk teks Indonesia

Temuan ini tidak diubah oleh dokumen ini. Mengubah teks Indonesia di Sanity
butuh `ok tulis` tersendiri, dan medan pilar serta ajakan unit adalah kata
pemilik sendiri. Blok lain merujuk catatan ini dengan nomornya, misalnya 16.1.

1. **Kata katalog yang masih tayang.** Glosarium §1 menetapkan kata ini tidak
   pernah tampil, tetapi tiga medan masih memuatnya. Inggrisnya sudah memakai
   pengganti. Usulan Indonesianya:
   - Teknologi `pilar[pilar-5].isi` (UT2), "masuklah lewat Sisi A" dan
     "masuklah lewat Sisi B": "masuklah lewat “Untuk yang paham teknis”" dan
     "masuklah lewat “Untuk yang ingin hasil siap pakai”".
   - Konstruksi `caraKerja[kerja-2].teks` (UK4), "Kami tentukan sisinya":
     "Kami tentukan posisi Anda: pelaku proyek atau pemilik bangunan."
   - Peekabo `caraKerja[kerja-2].teks` dan `ajakan.sesudahnya` (UP4, UP5),
     "lapis mana yang bekerja lebih dulu": "pekerjaan mana yang berjalan lebih
     dulu".
2. **Label Peekabo untuk penjual.** Glosarium §3 dan §9.5 menyebut "Untuk yang
   ingin ikut menjualkan"; yang tayang sekarang "Untuk jaringan penjual"
   (`nama`, SP-B1) dan "Jaringan penjual" (`side.jaringan`, UI1). Inggrisnya
   mengikuti yang tayang. Bila glosarium yang berlaku, padanannya "For people
   who want to help sell".
3. **Susunan `/peekabo/jaringan`.** Judul "Setiap rujukan harus dapat
   ditelusuri." berada di atas teks tentang bayaran host, dan "Tiga cara masuk
   ke jaringan." menampilkan tiga jalur, padahal hanya jalur kreator yang punya
   situasi (SP-B5). Diterjemahkan apa adanya; layak dilihat lagi.
4. **Judul footer "Pesanan".** Padanan lamanya "Commissions" berasal dari
   situs studio sebelumnya (UI1). Judul Indonesia ini mungkin juga sisa situs
   lama.
5. **Teks yang tertulis di kode.** Tombol `/pembayaran` (P2) belum punya kunci
   pesan, jadi `/en/pembayaran` belum bisa seluruhnya Inggris sampai langkah
   kode R7 memindahkannya.
6. **Label di dalam gambar kerja.** Tiga gambar kerja (L4) memuat 75 baris
   label yang tertulis di `lib/plates/*.ts` dalam bahasa Indonesia, termasuk
   huruf U untuk utara dan angka berkoma desimal. Gambar yang sama dipakai di
   `/layanan` dan beranda untuk kedua bahasa, jadi `/en` tetap memuat label
   Indonesia sampai gambar menerima label per bahasa. Ini pekerjaan kode, bukan
   isi Sanity.
7. **Nama paket sebagai label jenis.** Situasi ke-12 di
   `/konstruksi/pelaku-proyek` memakai "Paket yang disusun menurut posisi Anda
   di proyek" sebagai `jenis` pekerjaannya. Itu nama cara membeli dan nama
   situasinya, bukan label glosarium §5. Bila jenisnya diganti salah satu label
   §5, baris 7 di J1 tidak diperlukan lagi.
8. **"creator" dan "kreator".** Gambar kerja Peekabo menulis "Pasokan creator
   dan influencer", sedangkan teks lain memakai "kreator". Inggrisnya tidak
   terpengaruh; Indonesianya bisa diseragamkan di langkah kode yang sama dengan
   16.6.

## 17. Yang belum tercakup

- **Halaman situasi dan halaman pekerjaan.** 51 halaman situasi (kutipan,
  pembeli, batas, ajakan, jembatan, dan kartu pekerjaannya) dan 52 halaman
  pekerjaan. Kartu situasi di lima halaman pembaca kini tercakup (SK-A4 sampai
  SP-A4, dengan J1), tetapi tautan kartunya menuju halaman situasi dan
  pekerjaan yang masih Indonesia.
- **Label jenis "Alatnya kami jalankan".** Tidak tampil di kartu mana pun;
  ikut batch halaman pekerjaan.
- Kebijakan, alamat contoh, dan kanal kontak K5.

## 18. Usul batch berikutnya

Ukuran dihitung dari ekspor yang sama, dalam kata Indonesia.

| Batch | Isi                                                                                                                                                               | Ukuran | Membuka                                       |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------- |
| 2a    | Lapisan kartu situasi: 50 nama dan baris situasi, 50 judul pekerjaan "Mulai dari sini", dan 18 label jenis (glosarium §5)                                         | ±1.830 | Sudah masuk file ini (SK-A4 sampai SP-A4, J1) |
| 2b    | 51 halaman situasi: kutipan, pembeli, batas, ajakan, dan jembatan, ditambah kartu pekerjaan di setiap halaman (judul, dampak, dan untuk siapa dari 305 pekerjaan) | ±9.400 | Semua halaman situasi                         |
| 3     | 52 halaman pekerjaan: situasi, dua paket (nama, kalimat, poin), batas, syarat, langkah, serahan, dan langkah pertama                                              | ±7.200 | Semua halaman pekerjaan                       |

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

| Bagian               | Sumber                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1                    | Glosarium pembaca §1 sampai §10; `lib/content/style-gate.ts` (`ERROR_RULES`, `BANNED_PHRASES`, `VERBATIM_FIELDS`, 25 kata per kalimat)                                                                                                                                               |
| 2 sampai 14          | Ekspor publik `production`, 31 Oktober 2026 14.27 UTC, sha256 `2bec92cb366d…`; teks 14 halaman produksi pada waktu yang sama                                                                                                                                                         |
| 15                   | `messages/id.json` dan `messages/en.json` di `7d08f34`; kunci yang dipakai halaman di `app/[locale]/`                                                                                                                                                                                |
| 16, 17               | Glosarium §1, §3, §9; `app/[locale]/pembayaran/page.tsx`; halaman produksi                                                                                                                                                                                                           |
| Tinjauan 14 November | Dokumen tinjauan pemilik (rev 21); ekspor publik `production` 14 November 2026 (391 dokumen, sama dengan 31 Oktober); `messages/*.json` dan `lib/plates/*.ts` di `438eeec`; halaman produksi `/id/peekabo/jaringan`, `/id/metode`, `/id/layanan`, `/id/pembayaran`, dan `/id/kontak` |
| L-meta, P-meta       | Persetujuan pemilik 15 November 2026, "Setujui keempatnya"; teks Indonesia dari API publik `production` hari itu (`metadata.title`, `metadata.description`), sama dengan kepala `/id/layanan` dan `/id/pembayaran` di produksi                                                       |
| 18                   | Hitungan kata dari ekspor yang sama: `bab` 5.560 kata (kartu 1.591), judul 51 pekerjaan pembuka 237 kata, kartu 305 pekerjaan 5.391 kata, 52 halaman pekerjaan 7.164 kata                                                                                                            |
