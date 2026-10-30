"""Bingkai untuk gambar diam layar: ukuran tetap (misalnya 1440 x 900) yang
diperkecil ke lebar kolom oleh skrip halaman."""

import html

# Teks tayang yang dipakai lebih dari satu layar (situs, 24 Oktober 2026).
H1 = ('Proyek jalan.', 'Sistem bekerja.', 'Pasar bertambah.')
SUB = ('Konstruksi sipil, sistem teknologi, dan agency marketshare untuk Subang, '
       'Purwakarta, dan Bandung.')
CTA_HERO = 'Pilih situasi Anda'
CTA = 'Ceritakan masalahnya'
UNITS = (
    ('Konstruksi', 'Isi celahnya. Bangun sampai jadi. Rawat sesudahnya.'),
    ('Teknologi', 'Buka pasar baru. Otomatiskan sisanya.'),
    ('Peekabo', 'Rebut perhatian. Bangun kepercayaan. Biarkan jaringan yang menjual.'),
)
PAGES = ('Cara kami bekerja', 'Kontak')
STEP2 = ('Unit Teknologi memasang pemesanan dan pembayaran dari meja, sehingga '
         'pesanan langsung masuk ke dapur.')
CARD = dict(
    entry='Mulai dari sini',
    title='Bot pesan-antar WhatsApp',
    body='Bot mencatat dan menagih setiap pesanan WhatsApp, juga saat tidak ada '
         'admin yang berjaga.',
    who='Untuk pemilik warung dan kedai',
    read='Baca halamannya',
    ask='Tanyakan pekerjaan ini',
)


def attr(s):
    return html.escape(s, quote=True)


def frame(w, h, inner, label, cls):
    return ('<div class="fw" data-w="%d" style="--w:%d;--h:%d" data-besar role="img" '
            'aria-label="%s"><div class="fr %s">%s</div></div>'
            % (w, w, h, attr(label), cls, inner))


def svgbox(x, y, w, inner, vb=(1600, 1120), style=''):
    h = w * vb[1] / vb[0]
    return ('<svg class="pl" viewBox="0 0 %d %d" style="left:%.1fpx;top:%.1fpx;'
            'width:%.1fpx;height:%.1fpx;%s" aria-hidden="true" focusable="false">%s</svg>'
            % (vb[0], vb[1], x, y, w, h, style, inner))


def use(sym, x=0, y=0, s=1.0, rot=0, extra=''):
    tf = 'translate(%.1f %.1f) scale(%.4f)' % (x, y, s)
    if rot:
        tf += ' rotate(%.2f 800 560)' % rot
    return '<use href="#%s" width="1600" height="1120" transform="%s" %s/>' % (sym, tf, extra)


def h1_lines(sep='<br>'):
    return sep.join(H1)
