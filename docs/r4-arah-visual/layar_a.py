"""Layar arah A, Lembar kerja."""

from layar_dasar import (CARD, CTA, CTA_HERO, PAGES, STEP2, SUB, UNITS, frame,
                         h1_lines, svgbox, use)
from warna import X


def rgba(hx, a):
    return 'rgba(%d,%d,%d,%s)' % (int(hx[1:3], 16), int(hx[3:5], 16), int(hx[5:7], 16), a)


I, P, M = X['ink'], X['paper'], X['muted_a']
MONO = "'Geist Mono',ui-monospace,Consolas,monospace"

CSS = """
.sa{position:absolute;inset:0;background:{P};color:{I};font-family:'Syne','Avenir Next','Segoe UI',sans-serif;overflow:hidden}
.sa .m{font-family:{MONO}}
.sa .pl{position:absolute;overflow:visible}
.an{position:absolute;left:0;top:0;right:0;height:72px;display:flex;background:{P};border-bottom:1.5px solid {I};font-size:16px;z-index:3}
.an>*{display:flex;align-items:center;border-right:1px solid {I28};padding:0 22px;white-space:nowrap}
.an .wm{font-weight:800;font-size:27px;letter-spacing:-.02em;padding:0 30px}
.an .u{width:132px;justify-content:center;font-weight:600;position:relative;padding:0}
.an .u.on::after{content:"";position:absolute;left:50%;bottom:-1.5px;transform:translateX(-50%);border:8px solid transparent;border-bottom-color:{I}}
.an .pg{font-weight:500}
.an .sp{flex:1;padding:0;border-right:0}
.an .cari{font-family:{MONO};font-size:13px;gap:10px;border-left:1px solid {I28}}
.an kbd{font-family:inherit;font-size:12px;border:1px solid {I28};padding:2px 6px;border-radius:3px}
.an .lang{padding:0;font-family:{MONO};font-size:13px}
.an .lang b,.an .lang i{display:flex;align-items:center;height:100%;padding:0 14px;font-style:normal}
.an .lang b{font-weight:600}
.an .lang i{color:{M};border-left:1px solid {I14}}
.an .cta{background:{I};color:{P};font-weight:600;gap:12px;border-right:0;padding:0 28px}
.a-h1{position:absolute;left:56px;top:112px;margin:0;font-weight:800;font-size:78px;line-height:.9;letter-spacing:-.045em}
.a-side{position:absolute;left:1000px;top:116px;width:384px}
.a-side p{margin:0;font-size:19px;line-height:1.42}
.a-cta{display:inline-flex;gap:12px;margin-top:22px;font-family:{MONO};font-size:13px;letter-spacing:.08em;text-transform:uppercase;border-bottom:1.5px solid {I};padding-bottom:6px}
.a-idx{list-style:none;margin:24px 0 0;padding:0;border-top:1px solid {I28}}
.a-idx li{display:flex;align-items:baseline;gap:16px;padding:8px 0;border-bottom:1px solid {I28};font-weight:700;font-size:18px}
.a-idx b{font-family:{MONO};font-size:12px;font-weight:500}
.a-bar{position:absolute;left:0;right:0;top:73.5px;height:48px;display:flex;align-items:center;gap:18px;padding:0 56px;border-bottom:1px solid {I28};background:{P};z-index:2}
.a-bar b{font-weight:800;font-size:22px;letter-spacing:-.02em}
.a-bar .u{font-weight:700;font-size:18px}
.a-bar .s{font-size:15px;color:{M};flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.a-card{position:absolute;left:48px;top:40px;width:624px;height:380px;border:1.5px solid {I};background:{P};padding:26px 30px;box-sizing:border-box;display:flex;flex-direction:column}
.a-card .top{display:flex;justify-content:space-between;align-items:flex-start}
.a-card .entry{font-family:{MONO};font-size:12px;letter-spacing:.1em;text-transform:uppercase;border:1px solid {I};padding:5px 8px}
.a-card h3{margin:2px 0 0;font-weight:700;font-size:34px;letter-spacing:-.02em;line-height:1.05}
.a-card p{margin:12px 0 0;font-size:18px;line-height:1.42;max-width:480px}
.a-card .who{margin-top:10px;font-family:{MONO};font-size:13px;color:{M}}
.a-card .act{margin-top:auto;display:flex;justify-content:space-between;border-top:1px solid {I28};padding-top:14px;font-family:{MONO};font-size:13px;letter-spacing:.05em;text-transform:uppercase}
.a-page{position:absolute;left:56px;top:104px}
.a-page span{font-family:{MONO};font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:{M}}
.a-page b{display:block;font-weight:800;font-size:88px;letter-spacing:-.045em;line-height:.9;margin-top:10px}
.anp{position:absolute;left:0;right:0;top:0;height:64px;display:flex;border-bottom:1.5px solid {I};background:{P};z-index:2}
.anp .wm{display:flex;align-items:center;padding:0 18px;font-weight:800;font-size:24px}
.anp .sp{flex:1}
.anp .b{display:flex;align-items:center;justify-content:center;min-width:72px;padding:0 14px;border-left:1px solid {I28};font-family:{MONO};font-size:13px;letter-spacing:.08em;text-transform:uppercase}
.ap-h1{position:absolute;left:18px;top:94px;width:354px;margin:0;font-weight:800;font-size:24px;line-height:1;letter-spacing:-.03em}
.ap-p{position:absolute;left:18px;top:200px;width:340px;margin:0;font-size:16px;line-height:1.42}
.ap-cta{position:absolute;left:18px;top:300px}
.am{position:absolute;left:18px;right:18px;top:78px;bottom:96px;display:flex;flex-direction:column}
.am ol{list-style:none;margin:0;padding:0}
.am li{border-bottom:1px solid {I28};padding:6px 0 12px}
.am li span{display:block;font-weight:800;line-height:.95;letter-spacing:-.04em;white-space:nowrap}
.am li em{display:block;font-style:normal;font-family:{MONO};font-size:11.5px;color:{M};margin-top:6px;line-height:1.35}
.am .pg{display:flex;flex-direction:column;gap:4px;margin-top:18px;font-weight:600;font-size:24px}
.am .f{margin-top:auto;display:flex;justify-content:space-between;align-items:center;font-family:{MONO};font-size:13px;border-top:1px solid {I28};padding-top:14px}
.am .f .lang b{font-weight:600}
.am .f .lang i{font-style:normal;color:{M};margin-left:14px}
.am-cta{position:absolute;left:18px;right:18px;bottom:26px;height:56px;background:{I};color:{P};display:flex;align-items:center;justify-content:center;gap:12px;font-weight:600;font-size:17px}
"""


def css():
    return (CSS.replace('{MONO}', MONO).replace('{I28}', rgba(I, 0.28))
            .replace('{I14}', rgba(I, 0.14)).replace('{I}', I).replace('{P}', P)
            .replace('{M}', M))


def nav(active=None):
    units = ''.join('<span class="u%s">%s</span>' % (' on' if u == active else '', u)
                    for u, _ in UNITS)
    pages = ''.join('<span class="pg">%s</span>' % p for p in PAGES)
    return ('<header class="an"><span class="wm">Arthur</span>%s%s<span class="sp"></span>'
            '<span class="cari">Cari <kbd>⌘K</kbd></span>'
            '<span class="lang"><b>ID</b><i>EN</i></span>'
            '<span class="cta">%s <span>→</span></span></header>' % (units, pages, CTA))


def _band(drawn=True):
    if drawn:
        inner = use('p-a-konstruksi')
    else:
        inner = ('<g opacity=".13">%s</g><g mask="url(#a-mask-58)">%s</g>'
                 '<line x1="944" y1="40" x2="944" y2="1080" stroke="%s" stroke-width="1.5" '
                 'stroke-opacity=".35"/><circle cx="944" cy="300" r="7" fill="%s"/>'
                 % (use('p-a-konstruksi'), use('p-a-konstruksi'), I, I))
    return svgbox(56, 412, 1328, inner)


def _hero():
    idx = ''.join('<li><b>%02d</b>%s</li>' % (i + 1, u) for i, (u, _) in enumerate(UNITS))
    return ('<h1 class="a-h1">%s</h1><div class="a-side"><p>%s</p>'
            '<span class="a-cta">%s <span>↓</span></span><ol class="a-idx">%s</ol></div>'
            % (h1_lines(), SUB, CTA_HERO, idx))


def home():
    inner = nav() + _hero() + _band(drawn=False)
    return frame(1440, 900, '<div class="sa">%s</div>' % inner,
                 'Arah A, beranda layar pertama: judul besar di kiri, tiga unit di kanan, '
                 'dan lembar gambar Konstruksi yang sedang digambar di bawah garis lipatan.', '')


def path():
    strip = ('<g>%s</g><g transform="translate(1600 0)"><g opacity=".13">%s</g>'
             '<g mask="url(#a-mask-80)">%s</g><line x1="1288" y1="40" x2="1288" y2="1080" '
             'stroke="%s" stroke-width="1.5" stroke-opacity=".35"/><circle cx="1288" cy="560" '
             'r="7" fill="%s"/></g><g transform="translate(3200 0)" opacity=".13">%s</g>'
             % (use('p-a-konstruksi'), use('p-a-teknologi'), use('p-a-teknologi'), I, I,
                use('p-a-peekabo')))
    prog = ('<svg width="150" height="20" viewBox="0 0 150 20"><line x1="2" y1="10" x2="148" '
            'y2="10" stroke="%s" stroke-width="1"/>%s<polygon points="75,4 81,14 69,14" '
            'fill="%s"/></svg>' % (I, ''.join(
                '<line x1="%d" y1="4" x2="%d" y2="16" stroke="%s" stroke-width="1.4"/>'
                % (x, x, I) for x in (2, 75, 148)), I))
    bar = ('<div class="a-bar"><b>02 / 03</b><span class="u">Teknologi</span>'
           '<span class="s">%s</span>%s</div>' % (STEP2, prog))
    inner = nav() + bar + svgbox(-936, 124, 3312, strip, vb=(4800, 1120))
    return frame(1440, 900, '<div class="sa">%s</div>' % inner,
                 'Arah A, satu bingkai lintasan yang di-pin: lembar panjang bergeser ke kiri, '
                 'pelat 02 Teknologi sedang digambar, pelat 03 masih tipis.', '')


def fallback():
    inner = (nav() + _hero() + _band(drawn=True)
             + svgbox(56, 1384, 1328, use('p-a-teknologi')))
    return frame(1440, 1800, '<div class="sa">%s</div>' % inner,
                 'Arah A tanpa gerak: tidak di-pin, pelat tampil utuh dan berurutan ke bawah.', '')


MARK = ('<svg class="mk" width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">'
        '<g fill="none" stroke="{I}" stroke-width="1.4">'
        '<path d="M2 14V2h12M70 2h12v12M82 70v12H70M14 82H2V70"/>'
        '<rect x="14" y="20" width="22" height="14"/><rect x="48" y="20" width="22" height="14"/>'
        '<rect x="31" y="52" width="22" height="14"/><path d="M36 27h12M59 34v8H42v10"/></g>'
        '<path d="M48 24l-5 3 5 3zM39 52l3-5 3 5z" fill="{I}"/></svg>')


def card():
    c = CARD
    mark = MARK.replace('{I}', I)
    inner = ('<article class="a-card"><div class="top"><span class="entry">%s</span>%s</div>'
             '<h3>%s</h3><p>%s</p><span class="who">%s</span><div class="act">'
             '<span>%s →</span><span>%s →</span></div></article>'
             % (c['entry'], mark, c['title'], c['body'], c['who'], c['read'], c['ask']))
    return frame(720, 460, '<div class="sa">%s</div>' % inner,
                 'Arah A, kartu pekerjaan Bot pesan-antar WhatsApp dengan tanda gambar kerja '
                 'diagram alur di sudut kanan atas.', '')


def nav_desktop():
    inner = (nav('Teknologi') + '<div class="a-page"><span>Unit</span><b>Teknologi</b></div>')
    return frame(1440, 230, '<div class="sa">%s</div>' % inner,
                 'Arah A, navbar desktop di halaman Teknologi: lima tujuan dalam sel bergaris, '
                 'penanda segitiga di bawah unit yang aktif, lalu Cari, ID dan EN, dan tombol '
                 'Ceritakan masalahnya.', '')


def nav_phone():
    closed = ('<header class="anp"><span class="wm">Arthur</span><span class="sp"></span>'
              '<span class="b">Cari</span><span class="b">Menu</span></header>'
              '<h1 class="ap-h1">%s</h1><p class="ap-p">%s</p>'
              '<span class="a-cta ap-cta">%s <span>↓</span></span>%s'
              % (h1_lines(), SUB, CTA_HERO, svgbox(-30, 372, 640, use('p-a-konstruksi'))))
    sizes = (43, 48, 51)
    units = ''.join('<li><span style="font-size:%dpx">%s</span><em>%s</em></li>' % (s, u, h)
                    for s, (u, h) in zip(sizes, UNITS))
    opened = ('<header class="anp"><span class="wm">Arthur</span><span class="sp"></span>'
              '<span class="b">Tutup</span></header><div class="am"><ol>%s</ol>'
              '<div class="pg">%s</div><div class="f"><span>Cari ⌘K</span>'
              '<span class="lang"><b>ID</b><i>EN</i></span></div></div>'
              '<span class="am-cta">%s <span>→</span></span>'
              % (units, ''.join('<span>%s</span>' % p for p in PAGES), CTA))
    return (frame(390, 844, '<div class="sa">%s</div>' % closed,
                  'Arah A, ponsel dengan menu tertutup.', ''),
            frame(390, 844, '<div class="sa">%s</div>' % opened,
                  'Arah A, menu ponsel terbuka: tiga unit, masing-masing selebar layar menurut '
                  'panjang katanya sendiri, lalu dua halaman, Cari, ID dan EN, dan tombol.', ''))
