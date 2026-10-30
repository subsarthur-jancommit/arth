"""Layar hasil akhir: B panggung, A dokumen, dengan sistem huruf akhir.

Archivo untuk judul (lebar 125 di panggung, 100 di dokumen), Geist untuk
teks, Instrument Serif miring untuk kutipan suara pembeli, Geist Mono untuk
label teknis. Semua teks dari situs tayang, 24 Oktober 2026."""

import gabungan
import layar_b
from layar_a import rgba
from layar_dasar import SUB, frame, svgbox, use
from warna import X

I, P, MA, MB = X['ink'], X['paper'], X['muted_a'], X['muted_b']
ARCH = "'Archivo','Segoe UI',Arial,sans-serif"
GEIST = "'Geist',system-ui,'Segoe UI',sans-serif"
SERIF = "'Instrument Serif',Georgia,serif"
MONO = "'Geist Mono',ui-monospace,Consolas,monospace"

CSS = """
.fx{font-family:{GEIST}}
.fx .x,.fx .wm,.fx .b-h1,.fx .bp-h1,.fx .b-depth span,.fx .b-capt b,.fx .door b,.fx .g-bb h2,.fx .disp{font-family:{ARCH}}
.fx .g-head h1,.fx .gp-head h1,.fx .g-pkt h3,.fx .g-lp h3,.fx .gp-lp h3,.fx .doc{font-family:{ARCH}}
.fx .bn .seg span,.fx .bn .pg,.fx .bn .cta{font-weight:500}
.fx .q{font-family:{SERIF};font-style:italic;font-weight:400}
.fx .lbl{font-family:{MONO};font-size:13px;font-weight:500;letter-spacing:.11em;text-transform:uppercase}
.fu-hero{position:absolute;left:56px;top:150px;width:620px}
.fu-hero h1{margin:16px 0 0;font-stretch:125%;font-weight:800;font-size:116px;line-height:.95;letter-spacing:-.02em}
.fu-hero h2{margin:26px 0 0;font-stretch:112%;font-weight:700;font-size:34px;line-height:1.15}
.fu-hero p{margin:18px 0 0;font-size:20px;line-height:1.5;color:{MB}}
.fu-doc{position:absolute;left:0;right:0;top:960px;bottom:0}
.fu-cols{position:absolute;left:56px;top:70px;width:600px}
.fu-cols h3{margin:30px 0 0;font-family:{ARCH};font-weight:700;font-size:30px;letter-spacing:-.01em}
.fu-cols p{margin:10px 0 0;font-size:18px;line-height:1.55}
.fu-masalah{position:absolute;left:56px;top:640px;width:1328px}
.fu-masalah h2{margin:12px 0 0;font-family:{ARCH};font-weight:700;font-size:40px}
.fu-masalah ol{list-style:none;margin:18px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 28px}
.fu-masalah li{display:flex;gap:16px;padding:14px 0;border-top:1px solid {I28};font-size:18px;line-height:1.4}
.fu-masalah li b{font-family:{MONO};font-size:12px;font-weight:500;padding-top:4px}
.fs-head{position:absolute;left:56px;top:140px;width:1328px}
.fs-head h1{margin:12px 0 0;font-family:{ARCH};font-weight:700;font-size:72px;letter-spacing:-.02em;line-height:1}
.fs-head .q{display:block;margin:22px 0 0;font-size:50px;line-height:1.12;max-width:1150px}
.fs-head p{margin:20px 0 0;font-size:20px;line-height:1.5;max-width:820px}
.fs-list{position:absolute;left:56px;top:600px;width:1328px}
.fs-chips{display:flex;gap:8px;margin-top:14px}
.fs-chips span{font-size:14px;font-weight:500;padding:9px 14px;border:1px solid {I28};border-radius:999px}
.fs-chips span.on{background:{I};color:{P};border-color:{I}}
.fs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;margin-top:26px;align-items:start}
.fs-grid .grp{font-family:{MONO};font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:{MA};margin-bottom:10px;min-height:16px}
.fs-card{border:1.5px solid {I};padding:22px 24px;display:flex;flex-direction:column;gap:10px}
.fs-card .top{display:flex;justify-content:space-between;align-items:flex-start;min-height:30px}
.fs-card .entry{font-family:{MONO};font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;border:1px solid {I};padding:5px 8px}
.fs-card h3{margin:0;font-family:{ARCH};font-weight:700;font-size:26px;line-height:1.1}
.fs-card p{margin:0;font-size:16.5px;line-height:1.5}
.fs-card .who{font-family:{MONO};font-size:12.5px;color:{MA}}
.fs-card .act{display:flex;justify-content:space-between;gap:12px;border-top:1px solid {I28};padding-top:12px;margin-top:6px;font-size:14.5px;font-weight:600}
.fk{position:absolute;inset:0}
.fk-head{position:absolute;left:56px;top:116px;width:1328px}
.fk-head h1{margin:12px 0 0;font-stretch:125%;font-weight:800;font-size:60px;line-height:1}
.fk-head p{margin:16px 0 0;font-size:21px;line-height:1.45;color:{MB};max-width:900px}
.fk-col{position:absolute;top:330px;width:416px}
.fk-col .pan{position:relative;height:291px;border:1px solid {P18};overflow:hidden}
.fk-col b{display:block;margin-top:18px;font-family:{MONO};font-size:12px;font-weight:500;color:{MB}}
.fk-col h2{margin:6px 0 0;font-family:{ARCH};font-stretch:125%;font-weight:800;font-size:28px}
.fk-col p{margin:8px 0 0;font-size:17px;line-height:1.45}
.fk-col .lbl{display:block;margin-top:14px;font-size:11px;color:{MB}}
.fk-col span.k{display:block;margin-top:4px;font-size:16px;font-weight:600}
.fk-foot{position:absolute;left:56px;top:852px;font-family:{MONO};font-size:12.5px;color:{MB}}
"""


def css():
    return (CSS.replace('{GEIST}', GEIST).replace('{ARCH}', ARCH).replace('{SERIF}', SERIF)
            .replace('{MONO}', MONO).replace('{I28}', rgba(I, 0.28))
            .replace('{P18}', rgba(P, 0.18)).replace('{I}', I).replace('{P}', P)
            .replace('{MA}', MA).replace('{MB}', MB))


def _fx(html, label=None, new_label=None):
    html = (html.replace('<div class="sb">', '<div class="sb fx">')
            .replace('<div class="sb g-b">', '<div class="sb fx">')
            .replace('<div class="sg">', '<div class="sg fx">'))
    if label:
        html = html.replace('aria-label="%s' % label, 'aria-label="%s' % new_label, 1)
    return html


def beranda():
    return _fx(layar_b.home(), 'Arah B, beranda layar pertama', 'Hasil akhir, beranda (panggung)')


def unit():
    dark = (svgbox(0, 0, 1440, '<rect width="1440" height="960" fill="url(#b-pool)"/>'
                   + use('p-b-konstruksi-scene', 520, 70, 0.62), vb=(1440, 960))
            + layar_b.nav('Konstruksi')
            + '<div class="fu-hero"><span class="lbl" style="color:%s">Unit</span><h1>Konstruksi</h1>'
              '<h2>Isi celahnya. Bangun sampai jadi. Rawat sesudahnya.</h2><p>Konstruksi sipil '
              'dari hulu ke hilir untuk Subang, Purwakarta, dan Bandung.</p></div>' % MB)
    kerja = (('Kami mengisi celah.', 'Bagi kontraktor utama, subkontraktor, developer, dan penyedia '
              'barang, kami mengambil bagian yang tidak sempat atau tidak sanggup Anda tangani: '
              'administrasi dengan pemerintah, tenaga kerja, material, alat, laporan proyek, sampai '
              'penjembatanan modal kerja.'),
             ('Kami membangun sampai jadi.', 'Bagi pemilik rumah, pemilik usaha, dan pemilik '
              'properti, kami mengurus proyek dari hulu ke hilir: estimasi, desain teknis dan '
              'visualisasi interior, pekerjaan lapangan, sampai serah terima.'),
             ('Kami merawat sesudahnya.', 'Lewat Membership Care, pekerja kami menjaga kondisi dan '
              'estetika properti Anda secara berkala dan melaporkannya, sehingga nilai bangunan '
              'tidak turun karena dibiarkan.'))
    masalah = ('Dokumen tender, termin, dan izin belum siap.',
               'Tukang tidak datang tepat waktu dan tidak ada pengendalinya.',
               'Harga material bergeser dan barang datang terlambat.',
               'Uang muka belum cair, padahal material harus dibayar dulu.',
               'Laporan lewat chat dan biaya lapangan tidak terpantau.',
               'Anggaran rumah membengkak dan pekerjaannya tidak diawasi.')
    light = ('<div class="fu-cols"><span class="lbl" style="color:%s">Yang kami kerjakan</span>%s'
             '</div>' % (MA, ''.join('<h3>%s</h3><p>%s</p>' % kv for kv in kerja))
             + svgbox(700, 64, 684, use('p-g-a-konstruksi'))
             + '<div class="fu-masalah"><span class="lbl" style="color:%s">Masalah yang dijawab</span>'
               '<h2>Yang biasanya menahan pekerjaan Anda.</h2><ol>%s</ol></div>'
               % (MA, ''.join('<li><b>%02d</b>%s</li>' % (i + 1, m) for i, m in enumerate(masalah))))
    inner = ('<div class="sb fx" style="height:960px;bottom:auto">%s</div>'
             '<div class="sg fx fu-doc">%s</div>' % (dark, light))
    return frame(1440, 1860, inner,
                 'Hasil akhir, halaman unit Konstruksi: pembuka gelap dengan maket bercahaya, lalu '
                 'isi terang seperti lembar kerja dengan pelat denah dan potongan.', '')


CARDS = (
    ('', 'Mulai dari sini', 'Bot pesan-antar WhatsApp',
     'Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada admin yang berjaga.',
     'Untuk pemilik warung dan kedai', True),
    ('Alur kerja yang berjalan tanpa dikejar', '', 'Pesan dan bayar dari meja',
     'Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur.',
     'Untuk pemilik kafe dan resto', True),
    ('Angka yang memberi tahu lebih dulu', '', 'Layar pesanan di dapur',
     'Setiap pesanan tampil di layar dapur saat itu juga, berikut urutan dan waktu sajinya.',
     'Untuk pemilik kafe dan resto', False),
)


def situasi():
    import layar_a
    mark = layar_a.MARK.replace('{I}', I).replace('width="84" height="84"', 'width="56" height="56"')
    cards = ''
    for grp, entry, title, body, who, page in CARDS:
        act = ('<span>Baca halamannya →</span>' if page else '') + '<span>Tanyakan pekerjaan ini →</span>'
        cards += ('<div><div class="grp">%s</div><article class="fs-card"><div class="top">%s%s</div>'
                  '<h3>%s</h3><p>%s</p><span class="who">%s</span><div class="act">%s</div>'
                  '</article></div>' % (grp, '<span class="entry">%s</span>' % entry if entry else
                                        '<span></span>', mark, title, body, who, act))
    inner = (layar_b.nav('Teknologi')
             + '<div class="g-crumb"><span>Teknologi</span><span>Hasil siap pakai</span></div>'
             + '<div class="fs-head"><span class="lbl" style="color:%s">Situasi</span>'
               '<h1>Kuliner dan F&amp;B</h1><span class="q">“Pesanan saya bercampur di chat, kasir '
               'kewalahan saat ramai, dan bahan sering habis atau terbuang.”</span><p>Untuk warung, '
               'kafe, katering, produsen makanan, dan usaha dengan banyak outlet. Pesanan di chat '
               'bercampur, dan kasir kewalahan saat ramai.</p></div>' % MA
             + '<div class="fs-list"><span class="lbl" style="color:%s">Pekerjaan untuk situasi '
               'ini</span><div class="fs-chips"><span class="on">Semua proyek</span><span>Proyek '
               'pemerintah</span><span>Proyek swasta</span></div><div class="fs-grid">%s</div></div>'
               % (MA, cards))
    return frame(1440, 1180, '<div class="sg fx">%s</div>' % inner,
                 'Hasil akhir, halaman situasi Kuliner dan F&B: kutipan pembeli dalam huruf serif '
                 'miring, lalu kartu pekerjaan bergaya lembar kerja.', '')


def pekerjaan():
    return _fx(gabungan.pekerjaan(), 'Sistem yang disetujui, halaman pekerjaan',
               'Hasil akhir, halaman pekerjaan')


STEPS = (
    ('p-b-konstruksi-scene', 'Konstruksi',
     'Unit Konstruksi menyiapkan lokasi sewa sampai alur pelanggan dan dapurnya bekerja.',
     'Kafe siap buka dari lokasi sewa'),
    ('p-b-teknologi-scene', 'Teknologi',
     'Unit Teknologi memasang pemesanan dan pembayaran dari meja, sehingga pesanan langsung '
     'masuk ke dapur.', 'Pesan dan bayar dari meja'),
    ('p-b-peekabo-scene', 'Peekabo', 'Peekabo mengundang warga sekitar lebih dulu, sebelum kafe '
     'dibuka.', 'Pembukaan cabang atau gerai'),
)


def satu_klien():
    cols = ''
    for i, (sym, unit_, step, work) in enumerate(STEPS):
        cols += ('<div class="fk-col" style="left:%dpx"><div class="pan">%s</div><b>%02d</b>'
                 '<h2>%s</h2><p>%s</p><span class="lbl">Pekerjaan dalam langkah ini</span>'
                 '<span class="k">%s</span></div>'
                 % (56 + i * 456, svgbox(-1, -1, 418, use(sym), vb=(1600, 1120)), i + 1, unit_,
                    step, work))
    inner = (svgbox(0, 0, 1440, '<rect width="1440" height="900" fill="url(#b-pool)"/>',
                    vb=(1440, 900))
             + layar_b.nav()
             + '<div class="fk-head"><span class="lbl" style="color:%s">Satu klien, tiga unit</span>'
               '<h1>Tiga unit. Satu urutan kerja.</h1><p>Anda menyewa tempat untuk kafe baru dan '
               'ingin kafe itu siap melayani sejak hari pertama dibuka.</p></div>%s'
               '<div class="fk-foot">Ini rangkaian yang mungkin, bukan proyek yang pernah kami '
               'kerjakan. Setiap unit tetap bisa dibeli sendiri.</div>' % (MB, cols))
    return frame(1440, 900, '<div class="sb fx">%s</div>' % inner,
                 'Hasil akhir, halaman Satu klien, tiga unit sebagai panggung: tiga maket '
                 'bercahaya berurutan, seperti presentasi untuk klien.', '')


def navbar():
    gelap = frame(1440, 160, '<div class="sb fx">%s</div>' % layar_b.nav('Konstruksi'),
                  'Navbar di halaman panggung (gelap).', '')
    terang = frame(1440, 160, '<div class="sg fx">%s</div>' % layar_b.nav('Teknologi'),
                   'Navbar di halaman dokumen (terang).', '')
    return gelap, terang


def ponsel():
    menu = _fx(layar_b.nav_phone()[1])
    kerja = _fx(gabungan.pekerjaan_ponsel()[0])
    return menu, kerja
