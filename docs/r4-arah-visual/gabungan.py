"""Sistem gabungan: B sebagai panggung, A sebagai dokumen, C untuk janji dan
ajakan. Satu navbar, satu keluarga huruf (Archivo sebagai pengganti
sementara, pada tiga lebar), satu warna aksen (ungu) hanya untuk stempel dan
tombol ajakan.

Teks halaman pekerjaan dari /id/teknologi/siap-pakai/kuliner/pesan-dan-bayar-dari-meja
dan teks beranda, keduanya diambil 24 Oktober 2026."""

import layar_b
from layar_a import rgba
from layar_dasar import attr, frame, svgbox, use
from warna import X

I, P, U, UT = X['ink'], X['paper'], X['ungu'], X['ungu_terang']
MA, MB = X['muted_a'], X['muted_b']
MONO = "'Geist Mono',ui-monospace,Consolas,monospace"
ARCH = "Archivo, 'Segoe UI', Arial, sans-serif"

CRUMB = ('Teknologi', 'Hasil siap pakai', 'Kuliner dan F&B')
JENIS = 'Alur kerja yang berjalan tanpa dikejar'
JUDUL = 'Pesan dan bayar dari meja'
DAMPAK = 'Tamu memesan dan membayar dari meja; pesanan langsung masuk ke dapur.'
KOP = (('Untuk siapa', 'Untuk pemilik kafe dan resto'), ('Unit', 'Teknologi'),
       ('Situasi', 'Kuliner dan F&B'))
SIT = ('Di jam ramai, tamu kafe Anda ', 'mengantre di kasir', ' untuk memesan dan membayar. '
       'Kasir kewalahan.')
PAKET = (
    ('Paket Starter', ('Menu pesan dari meja memakai layanan yang sudah jadi.',
                       'Tamu memesan dan membayar dari meja.',
                       'Pesanan masuk ke dapur dengan pembayaran sudah selesai.')),
    ('Paket Integrator', ('Pesanan dari meja disambungkan ke catatan dan aturan kafe Anda.',
                          'Uang yang masuk cocok dengan catatan pesanan.',
                          'Harga dan promo berjalan menurut aturan Anda.')),
)
BATAS = 'Perangkat keras di kafe Anda, seperti tablet atau printer, tidak termasuk.'
LP_JUDUL = 'Minta sesi diagnosis'
LP_ISI = ('Di sesi itu kami melihat alur pesanan di kafe Anda hari ini dan menentukan paket '
          'yang cukup. Bila belum waktunya, kami mengatakannya terus terang dan menyarankan '
          'persiapan satu sampai tiga bulan. Biaya konsultasinya bersifat pilihan.')
JUJUR = ('Kami tidak membangun dari nol bila layanan yang sudah matang menyelesaikan '
         'masalahnya; kami menyarankannya lebih dulu, dan berkata jujur bila sesuatu belum '
         'perlu Anda beli.')
JANJI = ('Lingkup, harga, target, dan laporan disepakati tertulis sebelum kerja dimulai.',
         'Tenaga ahli bekerja di lapangan proyek Anda; nama atau sertifikat tidak dipinjamkan.',
         'Sistem, data, kode, dan merek tetap milik Anda.',
         'Komisi dari mitra kami ungkapkan, dan jaringan penjual kami dibayar dari penjualan '
         'yang benar-benar terjadi.',
         'Kami tidak menjanjikan keuntungan instan.')

CSS = """
.sb.g-b .bn .cta{background:{UT};color:{I};border-color:{UT};box-shadow:0 0 22px {UT25}}
.sg{position:absolute;inset:0;background:{P};color:{I};font-family:'Archivo','Segoe UI',Arial,sans-serif;overflow:hidden}
.sg .m{font-family:{MONO}}
.sg .pl{position:absolute;overflow:visible}
.sg .bn{background:{P};border-bottom:1px solid {I25}}
.sg .bn .seg{border-color:{I25}}
.sg .bn .seg span{color:{MA}}
.sg .bn .seg span.on{color:{I}}
.sg .bn .seg span.on::after{background:{I};box-shadow:none}
.sg .bn .pg{color:{MA}}
.sg .bn .pill{border-color:{I25};color:{MA}}
.sg .bn kbd{border-color:{I25}}
.sg .bn .lang b{background:{I};color:{P}}
.sg .bn .cta{background:{U};color:{P};border-color:{U};box-shadow:none}
.sg .bnp{background:{P};border-bottom:1px solid {I25}}
.sg .bnp .pill{border-color:{I25}}
.g-crumb{position:absolute;left:56px;top:102px;font-family:{MONO};font-size:13px;color:{MA}}
.g-crumb span+span::before{content:"/";margin:0 10px;color:{I25}}
.g-head{position:absolute;left:56px;top:152px;width:830px}
.g-eye{font-family:{MONO};font-size:13px;font-weight:500;letter-spacing:.11em;text-transform:uppercase;color:{MA}}
.g-head h1{margin:14px 0 0;font-weight:700;font-size:70px;line-height:1.02;letter-spacing:-.02em}
.g-head p{margin:22px 0 0;font-size:24px;line-height:1.42;max-width:720px}
.g-kop{position:absolute;left:944px;top:152px;width:440px;margin:0;border-top:1.5px solid {I}}
.g-kop div{display:grid;grid-template-columns:120px minmax(0,1fr);gap:12px;padding:13px 0;border-bottom:1px solid {I28}}
.g-kop dt{font-family:{MONO};font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:{MA};padding-top:4px}
.g-kop dd{margin:0;font-size:17px}
.g-sec{position:absolute;left:56px;width:1328px}
.g-sec>h2{margin:0;font-family:{MONO};font-weight:500;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:{MA}}
.g-sit p{margin:14px 0 0;font-size:30px;line-height:1.4;max-width:1000px}
.coret{position:relative;white-space:nowrap}
.coret svg{position:absolute;left:-18px;top:-12px;width:calc(100% + 36px);height:calc(100% + 24px);overflow:visible}
.g-cap{position:absolute;left:56px;font-family:{MONO};font-size:12.5px;color:{MA}}
.g-pkt>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin-top:14px}
.g-pkt article{border:1.5px solid {I};padding:24px 28px}
.g-pkt h3{margin:0;font-weight:700;font-size:30px}
.g-pkt ul{list-style:none;margin:14px 0 0;padding:0}
.g-pkt li{position:relative;padding:11px 0 11px 30px;border-top:1px solid {I14};font-size:19px;line-height:1.4}
.g-pkt li::before{content:"";position:absolute;left:2px;top:23px;width:14px;height:1.5px;background:{I}}
.g-batas p{margin:12px 0 0;font-size:20px;line-height:1.5}
.g-lp{background:{SURF};padding:40px 44px;box-sizing:border-box}
.g-lp h3{margin:12px 0 0;font-weight:700;font-size:52px;letter-spacing:-.02em;line-height:1.05}
.g-lp p{margin:16px 0 0;font-size:20px;line-height:1.5;max-width:860px}
.g-lp p.muted{color:{MA};font-size:17px;max-width:820px}
.g-act{display:flex;gap:22px;margin-top:24px;align-items:center}
.g-btn{display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 26px;background:{U};color:{P};font-weight:600;font-size:18px;border-radius:999px}
.g-link{font-weight:600;font-size:17px;text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1.5px}
.g-foot{display:flex;gap:28px;font-family:{MONO};font-size:13px;color:{MA}}
.g-foot span{text-decoration:underline;text-underline-offset:4px}
.stp{position:absolute;overflow:visible}
.g-bb{position:absolute;top:126px}
.g-bb .eye{font-family:{MONO};font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:{MB}}
.g-janji{list-style:none;margin:18px 0 0;padding:0;border-top:1px solid {P25}}
.g-janji li{padding:15px 0;border-bottom:1px solid {P18};font-size:20px;line-height:1.45}
.g-bb h2{margin:16px 0 0;font-stretch:125%;font-weight:800;font-size:44px;line-height:1.1}
.g-btn-d{display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 26px;margin-top:32px;background:{UT};color:{I};font-weight:700;font-size:18px;border-radius:999px;box-shadow:0 0 24px {UT25}}
.g-story{position:absolute;inset:0;background:#dcdbd6;color:{I};font-family:'Archivo','Segoe UI',Arial,sans-serif}
.g-story .pan{position:absolute;top:56px;width:430px;height:301px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.12)}
.g-story p{position:absolute;top:378px;width:430px;margin:0;font-size:17px;line-height:1.42}
.g-story p b{display:block;font-family:{MONO};font-size:12px;font-weight:600;letter-spacing:.12em;margin-bottom:6px}
.g-story i{position:absolute;top:190px;font-style:normal;font-size:30px}
.gp-crumb{position:absolute;left:18px;top:80px;font-family:{MONO};font-size:11px;color:{MA}}
.gp-crumb span+span::before{content:"/";margin:0 6px;color:{I25}}
.gp-head{position:absolute;left:18px;top:112px;width:354px}
.gp-head h1{margin:10px 0 0;font-weight:700;font-size:36px;line-height:1.04;letter-spacing:-.02em}
.gp-head p{margin:12px 0 0;font-size:17px;line-height:1.42}
.gp-head dl{margin:16px 0 0;border-top:1.5px solid {I}}
.gp-head dl div{display:grid;grid-template-columns:96px minmax(0,1fr);gap:8px;padding:9px 0;border-bottom:1px solid {I28}}
.gp-head dt{font-family:{MONO};font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:{MA};padding-top:3px}
.gp-head dd{margin:0;font-size:15px}
.gp-lp{position:absolute;left:0;right:0;top:64px;bottom:0;background:{SURF};padding:28px 18px;box-sizing:border-box}
.gp-lp h3{margin:10px 0 0;font-weight:700;font-size:34px;line-height:1.05}
.gp-lp p{margin:12px 0 0;font-size:16px;line-height:1.5}
.gp-lp p.muted{color:{MA};font-size:14.5px}
.gp-lp .g-btn{display:flex;justify-content:center;margin-top:20px;height:54px}
.gp-lp .g-link{display:block;margin-top:16px;text-align:center}
"""


def css():
    return (CSS.replace('{MONO}', MONO).replace('{UT25}', rgba(UT, 0.25))
            .replace('{I25}', rgba(I, 0.25)).replace('{I28}', rgba(I, 0.28))
            .replace('{I14}', rgba(I, 0.14)).replace('{P25}', rgba(P, 0.25))
            .replace('{P18}', rgba(P, 0.18)).replace('{SURF}', X['surface_g'])
            .replace('{UT}', UT).replace('{U}', U).replace('{I}', I).replace('{P}', P)
            .replace('{MA}', MA).replace('{MB}', MB))


def stempel(x, y, w, warna, rot=-7, top='DISEPAKATI TERTULIS', bottom='SEBELUM KERJA DIMULAI'):
    """Stempel bertekstur dalam Archivo sempit. Teks yang sama juga ada di DOM
    di dekatnya; stempel ini gambar, jadi aria-hidden."""
    h = w * 0.27
    return ('<svg class="stp" viewBox="0 0 300 81" style="left:%dpx;top:%dpx;width:%dpx;'
            'height:%.0fpx;transform:rotate(%sdeg)" aria-hidden="true"><g filter="url(#c-ink)" '
            'opacity=".93"><rect x="3" y="3" width="294" height="75" rx="3" fill="none" stroke="%s" '
            'stroke-width="4.5"/><rect x="10" y="10" width="280" height="61" rx="2" fill="none" '
            'stroke="%s" stroke-width="1.4"/><text x="150" y="45" text-anchor="middle" '
            'font-family="%s" font-weight="800" font-size="34" letter-spacing="1" '
            'style="font-stretch:72%%" fill="%s">%s</text><text x="150" y="64" text-anchor="middle" '
            'font-family="%s" font-size="11" font-weight="600" letter-spacing="2" fill="%s">%s</text>'
            '</g></svg>' % (x, y, w, h, rot, warna, warna, ARCH, warna, top,
                            MONO.replace("'", ''), warna, bottom))


CORET = ('<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">'
         '<path d="M8 22 C4 9 30 3 52 4 C78 5 98 11 96 22 C94 33 70 38 46 37 C22 36 6 31 9 18 '
         'C11 11 20 7 30 6" fill="none" stroke="{I}" stroke-width="3" stroke-linecap="round" '
         'vector-effect="non-scaling-stroke"/></svg>')


def beranda():
    html = layar_b.home().replace('<div class="sb">', '<div class="sb g-b">', 1)
    return html.replace('aria-label="Arah B, beranda layar pertama', 'aria-label="Sistem '
                        'gabungan, beranda: panggung arah B dengan tombol ajakan ungu', 1)


def beranda_bawah():
    janji = ''.join('<li>%s</li>' % j for j in JANJI)
    inner = (svgbox(0, 0, 1440, '<rect width="1440" height="900" fill="url(#b-pool)"/>'
                    + use('p-b-peekabo-scene', 760, 430, 0.5, extra='opacity=".22"'), vb=(1440, 900))
             + layar_b.nav()
             + '<div class="g-bb" style="left:56px;width:640px"><span class="eye">Cara kami '
               'bekerja</span><ul class="g-janji">%s</ul></div>' % janji
             + '<div class="g-bb" style="left:790px;width:594px"><span class="eye">Langkah '
               'pertama</span><h2>Ceritakan masalahnya. Kami tentukan unit mana yang bekerja '
               'lebih dulu.</h2><span class="g-btn-d">Ke halaman kontak <span>→</span></span></div>'
             + stempel(800, 540, 270, UT, rot=-7))
    return frame(1440, 900, '<div class="sb g-b">%s</div>' % inner,
                 'Sistem gabungan, bagian bawah beranda: janji cara kami bekerja dengan stempel '
                 'ungu di tanah gelap, dan langkah pertama dengan tombol ungu.', '')


def transisi():
    pans = (
        ('#110f0d', use('p-b-teknologi-scene', 0, 0, 430 / 1600)),
        ('#110f0d', use('p-b-teknologi-datar', 0, 0, 430 / 1600)),
        (P, use('p-g-a-teknologi', 0, 0, 430 / 1600)),
    )
    notes = (
        ('1 · BERANDA', 'Maket bercahaya; kamera bergerak di antara pelat.'),
        ('2 · KAMERA TURUN', 'Kamera menghadap tegak lurus; pelat rebah menjadi gambar datar.'),
        ('3 · HALAMAN PEKERJAAN', 'Tinta dan kertas bertukar: pelat yang sama menjadi lembar kerja.'),
    )
    out = ''
    for i, ((bg, u), (h, t)) in enumerate(zip(pans, notes)):
        x = 40 + i * 470
        out += ('<div class="pan" style="left:%dpx;background:%s">%s</div><p style="left:%dpx">'
                '<b>%s</b>%s</p>' % (x, bg, svgbox(0, 0, 430, u, vb=(430, 301)), x, h, t))
        if i < 2:
            out += '<i style="left:%dpx">→</i>' % (x + 440)
    return frame(1440, 520, '<div class="g-story">%s</div>' % out,
                 'Sistem gabungan, perpindahan dari beranda ke halaman pekerjaan dalam tiga '
                 'bingkai: maket bercahaya, pelat rebah, lalu lembar kerja di kertas.', '')


def _crumb(cls):
    return '<div class="%s">%s</div>' % (cls, ''.join('<span>%s</span>' % attr(c) for c in CRUMB))


def _situasi_p():
    a, b, c = SIT
    return '<p>%s<span class="coret">%s%s</span>%s</p>' % (a, b, CORET.replace('{I}', I), c)


def pekerjaan():
    kop = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % kv for kv in KOP)
    paket = ''.join('<article><h3>%s</h3><ul>%s</ul></article>'
                    % (t, ''.join('<li>%s</li>' % p for p in pts)) for t, pts in PAKET)
    inner = (
        layar_b.nav('Teknologi') + _crumb('g-crumb')
        + '<div class="g-head"><span class="g-eye">%s</span><h1>%s</h1><p>%s</p></div>'
          % (JENIS, JUDUL, DAMPAK)
        + '<dl class="g-kop">%s</dl>' % kop
        + '<section class="g-sec g-sit" style="top:470px"><h2>Situasinya</h2>%s</section>'
          % _situasi_p()
        + svgbox(56, 690, 1328, use('p-g-a-teknologi'))
        + '<span class="g-cap" style="top:1632px">Lembar 02 / 03 · Diagram alur pesanan · '
          'Rangkaian yang mungkin, bukan proyek yang pernah kami kerjakan.</span>'
        + '<section class="g-sec g-pkt" style="top:1700px"><h2>Dua paket</h2><div>%s</div>'
          '</section>' % paket
        + '<section class="g-sec g-batas" style="top:2010px"><h2>Batas dan syarat</h2><p>%s</p>'
          '</section>' % BATAS
        + '<section class="g-sec g-lp" style="top:2130px"><h2>Langkah pertama</h2><h3>%s</h3>'
          '<p>%s</p><p class="muted">%s</p><div class="g-act"><span class="g-btn">Mulai '
          'percakapan <span>→</span></span><span class="g-link">Cara kami dibayar</span></div>'
          '</section>' % (LP_JUDUL, LP_ISI, JUJUR)
        + stempel(1080, 2178, 270, U, rot=-6)
        + '<div class="g-sec g-foot" style="top:2560px"><span>Kembali ke situasi</span>'
          '<span>Kembali ke daftar situasi</span><span>Cetak halaman ini</span></div>')
    return frame(1440, 2620, '<div class="sg">%s</div>' % inner,
                 'Sistem gabungan, halaman pekerjaan Pesan dan bayar dari meja dalam gaya arah A: '
                 'kepala halaman seperti kop, pelat diagram alur sebagai lembar kerja, dua paket, '
                 'batas dan syarat, lalu langkah pertama dengan tombol dan stempel ungu.', '')


def pekerjaan_ponsel():
    kop = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % kv for kv in KOP)
    head = ('<header class="bnp"><span class="wm">ARTHUR</span><span class="sp"></span>'
            '<span class="pill">Cari</span><span class="pill">Menu</span></header>')
    atas = (head + _crumb('gp-crumb')
            + '<div class="gp-head"><span class="g-eye" style="font-size:11px">%s</span><h1>%s</h1>'
              '<p>%s</p><dl>%s</dl></div>' % (JENIS, JUDUL, DAMPAK, kop)
            + svgbox(-6, 462, 402, use('p-g-a-teknologi')))
    bawah = (head + '<div class="gp-lp"><span class="g-eye" style="font-size:11px">Langkah '
             'pertama</span><h3>%s</h3><p>%s</p><p class="muted">%s</p><span class="g-btn">Mulai '
             'percakapan <span>→</span></span><span class="g-link">Cara kami dibayar</span></div>'
             % (LP_JUDUL, LP_ISI, JUJUR) + stempel(90, 652, 210, U, rot=-6))
    return (frame(390, 844, '<div class="sg">%s</div>' % atas,
                  'Sistem gabungan, halaman pekerjaan di ponsel: kepala halaman dan awal pelat.', ''),
            frame(390, 844, '<div class="sg">%s</div>' % bawah,
                  'Sistem gabungan, langkah pertama di ponsel dengan tombol dan stempel ungu.', ''))
