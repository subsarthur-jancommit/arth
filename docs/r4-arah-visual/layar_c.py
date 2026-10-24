"""Layar arah C, Papan proyek."""

from layar_a import rgba
from layar_dasar import (CARD, CTA, CTA_HERO, PAGES, STEP2, SUB, UNITS, frame,
                         svgbox, use)
from warna import X

T, K, PA, U, L, M = X['tinta'], X['kertas'], X['papan'], X['ungu'], X['lubang'], X['muted_c']
MONO = "'Geist Mono',ui-monospace,Consolas,monospace"
BARC = "'Barlow Condensed','Arial Narrow',Arial,sans-serif"

CSS = """
.sc{position:absolute;inset:0;background-color:{PA};background-image:radial-gradient(circle,{L} 2.6px,transparent 3px);background-size:28px 28px;color:{T};font-family:'Barlow','Segoe UI',Arial,sans-serif;overflow:hidden}
.sc .m{font-family:{MONO}}
.sc .k{font-family:{BARC}}
.sc .pl{position:absolute;overflow:visible}
.cn{position:absolute;left:0;right:0;top:0;height:84px;display:flex;align-items:stretch;padding:0 28px;background:{K};border-bottom:2px solid {T};z-index:3;white-space:nowrap}
.cn .wm{display:flex;align-items:center;margin-right:30px;font-family:{BARC};font-weight:800;font-size:32px;letter-spacing:.02em}
.cn .tabs{display:flex;align-items:flex-end;gap:6px}
.cn .tabs span{display:flex;align-items:center;height:46px;padding:0 22px;margin-bottom:-2px;border:2px solid {T};border-bottom:0;border-radius:8px 8px 0 0;background:{K};font-weight:600;font-size:16px}
.cn .tabs span.on{height:54px;background:{PA}}
.cn .pg{display:flex;align-items:center;margin-left:24px;font-weight:600;font-size:16px;text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1.5px}
.cn .sp{flex:1}
.cn .r{display:flex;align-items:center;gap:10px}
.cn .box{display:flex;align-items:center;gap:10px;height:42px;padding:0 12px;border:1.5px solid {T};border-radius:3px;font-family:{MONO};font-size:13px}
.cn kbd{font-family:inherit;font-size:12px;border:1px solid {T};padding:1px 5px;border-radius:2px}
.cn .lang{padding:0;gap:0;overflow:hidden}
.cn .lang b{display:flex;align-items:center;height:100%;padding:0 12px;background:{T};color:{K};font-weight:600}
.cn .lang i{display:flex;align-items:center;height:100%;padding:0 12px;font-style:normal}
.cn .cta,.c-cta,.cm-cta{display:flex;align-items:center;gap:12px;height:46px;padding:0 20px;background:{U};color:{K};font-weight:700;font-size:16px;border-radius:3px;box-shadow:inset 0 0 0 3px {U},inset 0 0 0 4.5px {K}}
.c-sign{position:absolute;left:40px;top:116px;width:860px;height:420px;background:{K};box-shadow:0 6px 14px {T20};padding:40px 44px;box-sizing:border-box}
.c-sign i{position:absolute;width:14px;height:14px;border-radius:50%;background:{PA};box-shadow:inset 0 0 0 1.5px {T}}
.c-sign i::after{content:"";position:absolute;left:3px;right:3px;top:6px;height:1.5px;background:{T};transform:rotate(-30deg)}
.c-sign h1{margin:0;font-family:{BARC};font-weight:800;font-size:96px;line-height:.88;text-transform:uppercase;letter-spacing:.005em}
.c-sign p{margin:22px 0 0;max-width:600px;font-size:19px;line-height:1.42}
.c-cta{position:absolute;left:40px;top:572px;height:52px;font-size:18px}
.c-units{position:absolute;left:40px;top:658px;display:grid;gap:14px}
.c-units div{display:flex;align-items:center;gap:16px}
.dy{display:inline-flex;align-items:center;height:30px;padding:0 13px;background:{T};color:{K};font-family:{MONO};font-size:13px;font-weight:600;letter-spacing:.17em;border-radius:2px}
.c-units em{font-style:normal;font-size:16px}
.c-capt{position:absolute;left:40px;top:690px;width:470px;padding:24px 26px;background:{K};box-shadow:0 6px 14px {T20};transform:rotate(-1deg);z-index:2}
.c-capt p{margin:12px 0 0;font-size:18px;line-height:1.42}
.c-card{position:absolute;left:60px;top:58px;width:600px;height:350px;background:{K};box-shadow:0 6px 14px {T20};transform:rotate(-1deg);padding:30px 32px;box-sizing:border-box;display:flex;flex-direction:column}
.c-card h3{margin:16px 0 0;font-family:{BARC};font-weight:700;font-size:38px;line-height:1}
.c-card p{margin:12px 0 0;font-size:18px;line-height:1.42;max-width:440px}
.c-card .who{margin-top:10px;font-family:{MONO};font-size:13px;color:{M}}
.c-card .act{margin-top:auto;display:flex;gap:28px;font-weight:700;font-size:16px}
.c-card .act span{text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:2px}
.c-page{position:absolute;left:40px;top:118px}
.c-page b{display:block;margin-top:10px;font-family:{BARC};font-weight:800;font-size:80px;text-transform:uppercase;line-height:.9}
.cnp{position:absolute;left:0;right:0;top:0;height:64px;display:flex;align-items:center;padding:0 14px;background:{K};border-bottom:2px solid {T};z-index:3}
.cnp .wm{font-family:{BARC};font-weight:800;font-size:28px}
.cnp .sp{flex:1}
.cnp .box{display:flex;align-items:center;justify-content:center;min-width:44px;height:44px;padding:0 12px;margin-left:8px;border:1.5px solid {T};border-radius:3px;font-family:{MONO};font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.cp-sign{position:absolute;left:14px;top:84px;width:362px;padding:22px;box-sizing:border-box;background:{K};box-shadow:0 6px 14px {T20}}
.cp-sign h1{margin:0;font-family:{BARC};font-weight:800;font-size:46px;line-height:.9;text-transform:uppercase}
.cp-sign p{margin:12px 0 0;font-size:15px;line-height:1.42}
.cm{position:absolute;left:14px;right:14px;top:84px;bottom:100px;display:flex;flex-direction:column}
.cm .fold{position:relative;margin-top:-6px;padding:30px 18px 16px;background:{K};border:2px solid {T};border-radius:0 6px 6px 6px;box-shadow:0 4px 10px {T20}}
.cm .fold:first-child{margin-top:22px}
.cm .fold b{position:absolute;left:-2px;top:-30px;height:30px;display:flex;align-items:center;padding:0 16px;background:{K};border:2px solid {T};border-bottom:0;border-radius:6px 6px 0 0;font-weight:700;font-size:15px}
.cm .fold em{display:block;font-style:normal;font-size:14px;line-height:1.4}
.cm .fold + .fold{margin-top:34px}
.cm .pg{display:flex;gap:18px;margin-top:22px;font-weight:700;font-size:20px;text-decoration:underline;text-underline-offset:5px}
.cm .f{margin-top:auto;display:flex;justify-content:space-between;align-items:center}
.cm-cta{position:absolute;left:14px;right:14px;bottom:26px;height:56px;justify-content:center;font-size:17px}
"""


def css():
    return (CSS.replace('{MONO}', MONO).replace('{BARC}', BARC)
            .replace('{T20}', rgba(T, 0.2)).replace('{PA}', PA).replace('{T}', T)
            .replace('{K}', K).replace('{U}', U).replace('{L}', L).replace('{M}', M))


def nav(active=None):
    tabs = ''.join('<span class="%s">%s</span>' % ('on' if u == active else '', u)
                   for u, _ in UNITS)
    pages = ''.join('<span class="pg">%s</span>' % p for p in PAGES)
    return ('<header class="cn"><span class="wm">ARTHUR</span><span class="tabs">%s</span>%s'
            '<span class="sp"></span><span class="r"><span class="box">Cari <kbd>⌘K</kbd></span>'
            '<span class="box lang"><b>ID</b><i>EN</i></span><span class="cta">%s</span></span>'
            '</header>' % (tabs, pages, CTA))


SCREWS = ''.join('<i style="%s"></i>' % p for p in (
    'left:14px;top:14px', 'right:14px;top:14px', 'left:14px;bottom:14px', 'right:14px;bottom:14px'))


def _hero():
    units = ''.join('<div><span class="dy">%s</span><em>%s</em></div>' % (u.upper(), h)
                    for u, h in UNITS)
    return ('<div class="c-sign">%s<h1>%s</h1><p>%s</p></div>'
            '<span class="c-cta">%s <span>↓</span></span><div class="c-units">%s</div>'
            % (SCREWS, '<br>'.join(h.upper() for h in ('Proyek jalan.', 'Sistem bekerja.',
                                                        'Pasar bertambah.')),
               SUB, CTA_HERO, units))


def _sheets():
    return svgbox(0, 0, 1440, (
        use('p-c-teknologi-lembar', 930, 420, 0.31, rot=3)
        + use('p-c-konstruksi-lembar', 890, 104, 0.34)), vb=(1440, 900))


def home():
    inner = nav() + _hero() + _sheets()
    return frame(1440, 900, '<div class="sc">%s</div>' % inner,
                 'Arah C, beranda layar pertama: judul huruf besar di papan nama yang disekrup, '
                 'pita label tiga unit, dan lembar cetak ungu yang ditempel dan dicap di kanan.', '')


def path():
    scene = svgbox(0, 0, 1440, (
        use('p-c-peekabo-lepas', 1236, 250, 0.42, rot=4)
        + use('p-c-konstruksi-lembar', -540, 110, 0.62, rot=-2)
        + use('p-c-teknologi-gerak', 300, 92, 0.67, rot=-3.5)), vb=(1440, 900))
    cap = ('<div class="c-capt"><span class="dy">02 / 03 TEKNOLOGI</span><p>%s</p></div>' % STEP2)
    inner = nav() + scene + cap
    return frame(1440, 900, '<div class="sc">%s</div>' % inner,
                 'Arah C, satu bingkai lintasan yang di-pin: lembar 01 sudah ditempel dan dicap, '
                 'lembar 02 Teknologi sedang mendarat dengan coretan yang baru separuh, lembar 03 '
                 'menunggu di kanan.', '')


def fallback():
    inner = nav() + _hero() + _sheets() + svgbox(40, 940, 1360, use('p-c-konstruksi'))
    return frame(1440, 1800, '<div class="sc">%s</div>' % inner,
                 'Arah C tanpa gerak atau tanpa JavaScript: papan sudah terisi, stempel dan '
                 'coretan sudah ada, lembar tersusun ke bawah.', '')


MARK = ('<svg width="88" height="60" viewBox="0 0 88 60" aria-hidden="true">'
        '<g fill="none" stroke="{U}" stroke-width="1.6"><rect x="2" y="6" width="26" height="16"/>'
        '<rect x="44" y="6" width="26" height="16"/><rect x="23" y="38" width="26" height="16"/>'
        '<path d="M28 14h16M57 22v8H36v8"/></g><path d="M44 10l-6 4 6 4zM32 38l4-6 4 6z" '
        'fill="{U}"/></svg>')


def card():
    c = CARD
    stamp = ('<svg class="pl" viewBox="0 0 220 64" style="left:470px;top:34px;width:190px;'
             'height:55px;transform:rotate(-8deg)" aria-hidden="true"><g filter="url(#c-ink)" '
             'opacity=".92"><rect x="3" y="3" width="214" height="58" rx="3" fill="none" '
             'stroke="{U}" stroke-width="4"/><text x="110" y="42" text-anchor="middle" '
             'font-family="{F}" font-weight="800" font-size="27" fill="{U}" letter-spacing="1.2">'
             'MULAI DARI SINI</text></g></svg>').replace('{U}', U).replace('{F}', BARC.replace("'", ''))
    tape = ('<svg class="pl" viewBox="0 0 112 30" style="left:304px;top:42px;width:112px;height:30px;'
            'transform:rotate(-3deg)" aria-hidden="true"><rect width="112" height="30" '
            'fill="#ffffff" fill-opacity=".6"/></svg>')
    inner = ('<article class="c-card"><h3>%s</h3><p>%s</p>'
             '<span class="who">%s</span><div class="act"><span>%s</span><span>%s</span>'
             '<span style="margin-left:auto;text-decoration:none">%s</span></div></article>%s%s'
             % (c['title'], c['body'], c['who'], c['read'], c['ask'],
                MARK.replace('{U}', U), tape, stamp))
    return frame(720, 460, '<div class="sc">%s</div>' % inner,
                 'Arah C, kartu pekerjaan Bot pesan-antar WhatsApp sebagai kartu kertas yang '
                 'ditempel, dengan stempel ungu Mulai dari sini dan diagram alur kecil tercetak.', '')


def nav_desktop():
    inner = nav('Teknologi') + '<div class="c-page"><span class="dy">UNIT</span><b>Teknologi</b></div>'
    return frame(1440, 230, '<div class="sc">%s</div>' % inner,
                 'Arah C, navbar desktop di halaman Teknologi: tiga unit sebagai tab map, tab '
                 'yang aktif menyatu dengan papan, dua halaman bergaris bawah, lalu Cari, ID dan '
                 'EN, dan tombol ungu.', '')


def nav_phone():
    closed = ('<header class="cnp"><span class="wm">ARTHUR</span><span class="sp"></span>'
              '<span class="box">Cari</span><span class="box">Menu</span></header>'
              '<div class="cp-sign"><h1>%s</h1><p>%s</p></div>%s'
              % ('<br>'.join(h.upper() for h in ('Proyek jalan.', 'Sistem bekerja.',
                                                  'Pasar bertambah.')), SUB,
                 svgbox(-20, 470, 520, use('p-c-konstruksi-lembar'))))
    folds = ''.join('<div class="fold"><b>%s</b><em>%s</em></div>' % (u, h) for u, h in UNITS)
    opened = ('<header class="cnp"><span class="wm">ARTHUR</span><span class="sp"></span>'
              '<span class="box">Tutup</span></header><div class="cm">%s<div class="pg">%s</div>'
              '<div class="f"><span class="dy">CARI ⌘K</span><span class="dy">ID · EN</span></div>'
              '</div><span class="cm-cta">%s</span>'
              % (folds, ''.join('<span>%s</span>' % p for p in PAGES), CTA))
    return (frame(390, 844, '<div class="sc">%s</div>' % closed,
                  'Arah C, ponsel dengan menu tertutup.', ''),
            frame(390, 844, '<div class="sc">%s</div>' % opened,
                  'Arah C, menu ponsel terbuka: tiga unit sebagai map bertab, dua halaman, Cari, '
                  'ID dan EN, dan tombol ungu.', ''))
