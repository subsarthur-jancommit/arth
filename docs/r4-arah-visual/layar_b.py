"""Layar arah B, Maket cahaya."""

from layar_a import rgba
from layar_dasar import (CARD, CTA, CTA_HERO, PAGES, STEP2, SUB, UNITS, frame,
                         h1_lines, svgbox, use)
from warna import X

I, P, M = X['ink'], X['paper'], X['muted_b']
MONO = "'Geist Mono',ui-monospace,Consolas,monospace"

CSS = """
.sb{position:absolute;inset:0;background:{I};color:{P};font-family:'Archivo','Segoe UI',Arial,sans-serif;overflow:hidden}
.sb .x{font-stretch:125%}
.sb .m{font-family:{MONO}}
.sb .pl{position:absolute;overflow:visible}
.bn{position:absolute;left:0;right:0;top:0;height:76px;display:flex;align-items:center;padding:0 28px;background:{I};border-bottom:1px solid {P18};z-index:3;white-space:nowrap}
.bn .wm{font-stretch:125%;font-weight:800;font-size:21px;letter-spacing:.06em;margin-right:34px}
.bn .seg{display:flex;align-items:stretch;height:44px;border:1px solid {P25};border-radius:999px;padding:0 6px}
.bn .seg span{position:relative;display:flex;align-items:center;padding:0 18px;font-size:15px;font-weight:600;color:{M}}
.bn .seg span.on{color:{P}}
.bn .seg span.on::after{content:"";position:absolute;left:50%;bottom:6px;width:46px;height:2px;margin-left:-23px;background:{P};box-shadow:0 0 12px 2px {P50}}
.bn .pg{margin-left:24px;font-size:15px;font-weight:500;color:{M}}
.bn .sp{flex:1}
.bn .pill{display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;border:1px solid {P25};border-radius:999px;font-family:{MONO};font-size:13px;color:{M};margin-left:10px}
.bn kbd{font-family:inherit;font-size:12px;border:1px solid {P25};padding:1px 6px;border-radius:4px}
.bn .lang{padding:0;overflow:hidden;gap:0}
.bn .lang b,.bn .lang i{display:flex;align-items:center;height:100%;padding:0 14px;font-style:normal}
.bn .lang b{background:{P};color:{I};font-weight:600}
.bn .cta{margin-left:10px;display:flex;align-items:center;gap:12px;height:44px;padding:0 20px;border:1px solid {P};border-radius:999px;font-weight:600;font-size:15px;box-shadow:0 0 22px {P18}}
.b-fade{position:absolute;inset:0;background:linear-gradient(90deg,{I} 0,{I} 44%,{I0} 58%);z-index:1}
.b-h1{position:absolute;left:56px;top:118px;margin:0;font-weight:800;font-size:60px;line-height:1;letter-spacing:-.015em;z-index:2}
.b-p{position:absolute;left:56px;top:332px;width:470px;margin:0;font-size:18px;line-height:1.5;color:{M};z-index:2}
.b-cta{position:absolute;left:56px;top:432px;display:flex;align-items:center;gap:12px;height:48px;padding:0 22px;border:1px solid {P};border-radius:999px;font-weight:600;font-size:16px;z-index:2}
.b-depth{position:absolute;left:56px;top:612px;margin:0;padding:0 0 0 28px;list-style:none;border-left:1px solid {P25};z-index:2}
.b-depth li{position:relative;padding:0 0 22px}
.b-depth li::before{content:"";position:absolute;left:-34px;top:6px;width:11px;height:11px;border-radius:50%;border:1px solid {P50};background:{I}}
.b-depth li.on::before{background:{P};box-shadow:0 0 14px 3px {P50}}
.b-depth b{font-family:{MONO};font-size:12px;font-weight:500;color:{M};margin-right:12px}
.b-depth span{font-stretch:125%;font-weight:700;font-size:18px}
.b-depth em{display:block;font-style:normal;font-size:13px;color:{M};margin-top:4px}
.b-cap{position:absolute;left:0;bottom:0;width:640px;height:300px;background:radial-gradient(120% 100% at 0 100%,{I} 0,{I} 45%,{I0} 75%);z-index:1}
.b-capt{position:absolute;left:56px;bottom:56px;width:470px;z-index:2}
.b-capt b{display:block;font-stretch:125%;font-weight:800;font-size:54px;line-height:1}
.b-capt span{display:block;font-family:{MONO};font-size:13px;letter-spacing:.18em;text-transform:uppercase;margin-top:10px;color:{M}}
.b-capt p{margin:10px 0 0;font-size:17px;line-height:1.45}
.b-gauge{position:absolute;right:48px;top:150px;height:600px;width:60px;z-index:2}
.b-card{position:absolute;left:48px;top:40px;width:624px;height:380px;border:1px solid {P25};border-radius:4px;background:{P04};padding:26px 30px;box-sizing:border-box;display:flex;flex-direction:column;box-shadow:0 0 40px {P06}}
.b-card .top{display:flex;justify-content:space-between;align-items:flex-start}
.b-card .entry{display:flex;align-items:center;gap:10px;font-family:{MONO};font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.b-card .entry i{width:8px;height:8px;border-radius:50%;background:{P};box-shadow:0 0 10px 2px {P50}}
.b-card h3{margin:4px 0 0;font-stretch:125%;font-weight:800;font-size:29px;line-height:1.08}
.b-card p{margin:12px 0 0;font-size:17px;line-height:1.5;color:{M};max-width:470px}
.b-card .who{margin-top:10px;font-family:{MONO};font-size:13px;color:{M}}
.b-card .act{margin-top:auto;display:flex;gap:10px}
.b-card .act span{display:flex;align-items:center;gap:10px;height:44px;padding:0 18px;border:1px solid {P25};border-radius:999px;font-weight:600;font-size:15px}
.b-card .act span.o{border-color:{P}}
.b-page{position:absolute;left:56px;top:110px}
.b-page span{font-family:{MONO};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:{M}}
.b-page b{display:block;font-stretch:125%;font-weight:800;font-size:72px;line-height:1;margin-top:10px}
.bnp{position:absolute;left:0;right:0;top:0;height:64px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid {P18};background:{I};z-index:3}
.bnp .wm{font-stretch:125%;font-weight:800;font-size:18px;letter-spacing:.06em}
.bnp .sp{flex:1}
.bnp .pill{display:flex;align-items:center;justify-content:center;min-width:44px;height:44px;padding:0 14px;margin-left:8px;border:1px solid {P25};border-radius:999px;font-family:{MONO};font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.bp-h1{position:absolute;left:18px;top:96px;width:354px;margin:0;font-stretch:118%;font-weight:800;font-size:28px;line-height:1.06;z-index:2}
.bp-p{position:absolute;left:18px;top:206px;width:340px;margin:0;font-size:15.5px;line-height:1.5;color:{M};z-index:2}
.bm{position:absolute;left:0;right:0;top:64px;bottom:96px;display:flex;flex-direction:column}
.bm .door{position:relative;height:124px;border-bottom:1px solid {P18};padding:18px 18px 0;overflow:hidden}
.bm .door b{display:block;font-stretch:125%;font-weight:800;font-size:30px;position:relative;z-index:1}
.bm .door em{display:block;font-style:normal;font-size:13px;line-height:1.4;color:{M};width:220px;margin-top:6px;position:relative;z-index:1}
.bm .pg{display:flex;flex-direction:column;gap:6px;padding:18px;font-weight:600;font-size:22px}
.bm .f{margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding:0 18px 14px;font-family:{MONO};font-size:13px;color:{M}}
.bm .f .lang b{color:{P};font-weight:600}
.bm .f .lang i{font-style:normal;margin-left:14px}
.bm-cta{position:absolute;left:18px;right:18px;bottom:26px;height:56px;border:1px solid {P};border-radius:999px;display:flex;align-items:center;justify-content:center;gap:12px;font-weight:600;font-size:17px;box-shadow:0 0 22px {P18}}
"""


def css():
    return (CSS.replace('{MONO}', MONO).replace('{P04}', rgba(P, 0.035))
            .replace('{P06}', rgba(P, 0.06)).replace('{P18}', rgba(P, 0.18))
            .replace('{P25}', rgba(P, 0.25)).replace('{P50}', rgba(P, 0.5))
            .replace('{I0}', rgba(I, 0)).replace('{I}', I).replace('{P}', P).replace('{M}', M))


def nav(active=None):
    units = ''.join('<span class="%s">%s</span>' % ('on' if u == active else '', u)
                    for u, _ in UNITS)
    pages = ''.join('<span class="pg">%s</span>' % p for p in PAGES)
    return ('<header class="bn"><span class="wm">ARTHUR</span><span class="seg">%s</span>%s'
            '<span class="sp"></span><span class="pill">Cari <kbd>⌘K</kbd></span>'
            '<span class="pill lang"><b>ID</b><i>EN</i></span>'
            '<span class="cta">%s <span>→</span></span></header>' % (units, pages, CTA))


def _scene_home():
    return svgbox(0, 0, 1440, (
        '<rect width="1440" height="900" fill="url(#b-pool)"/>'
        + use('p-b-peekabo-scene', 1190, 64, 0.2, extra='opacity=".2" filter="url(#b-blur-2)"')
        + use('p-b-teknologi-scene', 980, 30, 0.3, extra='opacity=".26" filter="url(#b-blur-2)"')
        + use('p-b-konstruksi-scene', 560, 70, 0.68)), vb=(1440, 900))


def _hero(cls_h1='b-h1'):
    depth = ''.join('<li class="%s"><b>%02d</b><span>%s</span><em>%s</em></li>'
                    % ('on' if i == 0 else '', i + 1, u, h) for i, (u, h) in enumerate(UNITS))
    return ('<h1 class="%s x">%s</h1><p class="b-p">%s</p><span class="b-cta">%s <span>↓</span>'
            '</span><ol class="b-depth">%s</ol>' % (cls_h1, h1_lines(), SUB, CTA_HERO, depth))


def home():
    inner = _scene_home() + '<div class="b-fade"></div>' + nav() + _hero()
    return frame(1440, 900, '<div class="sb">%s</div>' % inner,
                 'Arah B, beranda layar pertama: judul lebar di kiri di atas tinta, maket '
                 'Konstruksi bercahaya di kanan, pelat Teknologi dan Peekabo samar di kejauhan.', '')


def _gauge():
    ticks = ''.join(
        '<line x1="22" y1="%d" x2="38" y2="%d" stroke="%s" stroke-opacity=".7"/>'
        '<text x="46" y="%d" fill="%s" fill-opacity=".7" font-family="%s" font-size="12">%02d</text>'
        % (y, y, P, y + 4, P, MONO.replace("'", ''), i + 1) for i, y in enumerate((20, 300, 580)))
    return ('<svg class="b-gauge" viewBox="0 0 60 600" aria-hidden="true"><line x1="30" y1="20" '
            'x2="30" y2="580" stroke="%s" stroke-opacity=".35"/>%s<circle cx="30" cy="300" r="6" '
            'fill="%s" filter="url(#b-glow-strong)"/></svg>' % (P, ticks, P))


def path():
    scene = svgbox(0, 0, 1440, (
        '<rect width="1440" height="900" fill="url(#b-pool)"/>'
        + use('p-b-peekabo-scene', 1110, 64, 0.22, extra='opacity=".32" filter="url(#b-blur-2)"')
        + use('p-b-teknologi-scene', 60, 40, 0.86)
        + use('p-b-konstruksi-scene', -1760, -980, 2.05, extra='opacity=".4" filter="url(#b-blur-6)"')),
        vb=(1440, 900))
    cap = ('<div class="b-cap"></div><div class="b-capt"><b>02 / 03</b><span>Teknologi</span>'
           '<p>%s</p></div>' % STEP2)
    inner = scene + nav() + cap + _gauge()
    return frame(1440, 900, '<div class="sb">%s</div>' % inner,
                 'Arah B, satu bingkai lintasan yang di-pin: kamera melewati maket Konstruksi, '
                 'diagram Teknologi tajam di tengah dengan paket cahaya di jalurnya, Peekabo '
                 'menunggu di kabut.', '')


def fallback():
    inner = (nav() + _hero()
             + svgbox(780, 110, 640, use('p-b-konstruksi-datar'))
             + svgbox(56, 1000, 1328, use('p-b-teknologi-datar')))
    return frame(1440, 1800, '<div class="sb">%s</div>' % inner,
                 'Arah B tanpa WebGL, dengan reduced motion, atau tanpa JavaScript: pelat yang '
                 'sama digambar datar sebagai SVG dan tampil berurutan.', '')


MARK = ('<svg width="96" height="80" viewBox="0 0 96 80" aria-hidden="true"><g fill="none" '
        'stroke="{P}" stroke-width="1.2" filter="url(#b-glow)">'
        '<path d="M8 50 L40 38 L58 46 L26 58 Z" fill="{P}" fill-opacity=".08"/>'
        '<path d="M8 50 v8 L26 66 v-8 M26 66 L58 54 v-8"/>'
        '<path d="M44 26 L72 16 L88 23 L60 33 Z" fill="{P}" fill-opacity=".08"/>'
        '<path d="M44 26 v7 L60 40 v-7 M60 40 L88 30 v-7"/>'
        '<path d="M40 44 L52 30" stroke-dasharray="3 3"/></g>'
        '<circle cx="47" cy="37" r="3" fill="{P}" filter="url(#b-glow-strong)"/></svg>')


def card():
    c = CARD
    inner = ('<svg class="pl" viewBox="0 0 720 460" style="left:0;top:0;width:720px;height:460px">'
             '<rect width="720" height="460" fill="url(#b-pool)"/></svg>'
             '<article class="b-card"><div class="top"><span class="entry"><i></i>%s</span>%s</div>'
             '<h3>%s</h3><p>%s</p><span class="who">%s</span><div class="act"><span>%s</span>'
             '<span class="o">%s <span>→</span></span></div></article>'
             % (c['entry'], MARK.replace('{P}', P), c['title'], c['body'], c['who'], c['read'],
                c['ask']))
    return frame(720, 460, '<div class="sb">%s</div>' % inner,
                 'Arah B, kartu pekerjaan Bot pesan-antar WhatsApp di atas tinta, dengan lempeng '
                 'kecil bercahaya sebagai tanda gambar kerja.', '')


def nav_desktop():
    inner = nav('Teknologi') + '<div class="b-page"><span>Unit</span><b>Teknologi</b></div>'
    return frame(1440, 230, '<div class="sb">%s</div>' % inner,
                 'Arah B, navbar desktop di halaman Teknologi: tiga unit dalam satu jalur dengan '
                 'garis cahaya di bawah yang aktif, dua halaman, lalu Cari, ID dan EN, dan tombol '
                 'bergaris.', '')


def nav_phone():
    closed = ('<header class="bnp"><span class="wm">ARTHUR</span><span class="sp"></span>'
              '<span class="pill">Cari</span><span class="pill">Menu</span></header>'
              + svgbox(-60, 360, 640, '<rect width="1600" height="1120" fill="url(#b-pool)"/>'
                       + use('p-b-konstruksi-scene'))
              + '<h1 class="bp-h1">%s</h1><p class="bp-p">%s</p>' % (h1_lines(), SUB))
    syms = ('p-b-konstruksi-scene', 'p-b-teknologi-scene', 'p-b-peekabo-scene')
    doors = ''.join('<div class="door">%s<b>%s</b><em>%s</em></div>'
                    % (svgbox(150, -10, 300, use(s), style='opacity:.85'), u, h)
                    for s, (u, h) in zip(syms, UNITS))
    opened = ('<header class="bnp"><span class="wm">ARTHUR</span><span class="sp"></span>'
              '<span class="pill">Tutup</span></header><div class="bm">%s<div class="pg">%s</div>'
              '<div class="f"><span>Cari ⌘K</span><span class="lang"><b>ID</b><i>EN</i></span>'
              '</div></div><span class="bm-cta">%s <span>→</span></span>'
              % (doors, ''.join('<span>%s</span>' % p for p in PAGES), CTA))
    return (frame(390, 844, '<div class="sb">%s</div>' % closed,
                  'Arah B, ponsel dengan menu tertutup.', ''),
            frame(390, 844, '<div class="sb">%s</div>' % opened,
                  'Arah B, menu ponsel terbuka: tiga pintu unit dengan maket kecilnya, dua '
                  'halaman, Cari, ID dan EN, dan tombol.', ''))
