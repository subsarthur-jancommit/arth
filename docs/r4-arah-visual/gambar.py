"""Alat SVG kecil: elemen, teks, proyeksi, dan gaya garis per arah."""

import math

from warna import X

FAM = {
    'syne': "'Syne', 'Avenir Next', 'Segoe UI', sans-serif",
    'mono': "'Geist Mono', ui-monospace, 'Cascadia Mono', Consolas, monospace",
    'arch': "'Archivo', 'Segoe UI', Arial, sans-serif",
    'bar': "'Barlow', 'Segoe UI', Arial, sans-serif",
    'barc': "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
}

# Lebar rata-rata satu huruf, dalam em. Hanya untuk memecah baris; sengaja
# sedikit lebih lebar dari aslinya supaya teks tidak keluar dari kotaknya.
ADV = {'mono': 0.6, 'syne': 0.6, 'arch': 0.7, 'bar': 0.5, 'barc': 0.43}


def tw(s, size, fam, ls=0.0):
    k = ADV[fam]
    if fam != 'mono' and s.upper() == s:
        k *= 1.14
    return len(s) * (size * k + ls)


def wrap(s, size, fam, width, ls=0.0):
    lines, cur = [], ''
    for word in s.split():
        t = (cur + ' ' + word).strip()
        if cur and tw(t, size, fam, ls) > width:
            lines.append(cur)
            cur = word
        else:
            cur = t
    if cur:
        lines.append(cur)
    return '\n'.join(lines)


def num(v):
    s = ('%.2f' % v).rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def _attr(k, v):
    k = {'class_': 'class', 'href': 'href'}.get(k, k).rstrip('_').replace('_', '-')
    if isinstance(v, (int, float)) and not isinstance(v, bool):
        v = num(v)
    v = str(v).replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')
    return '%s="%s"' % (k, v)


def el(name, body=None, **kw):
    a = ' '.join(_attr(k, v) for k, v in kw.items() if v is not None)
    head = '<' + name + (' ' + a if a else '')
    return head + '/>' if body is None else head + '>' + body + '</' + name + '>'


def P(points):
    return ' '.join(num(x) + ',' + num(y) for x, y in points)


def poly(points, **kw):
    return el('polygon', points=P(points), **kw)


def pline(points, **kw):
    kw.setdefault('fill', 'none')
    return el('polyline', points=P(points), **kw)


def line(a, b, **kw):
    return el('line', x1=num(a[0]), y1=num(a[1]), x2=num(b[0]), y2=num(b[1]), **kw)


def rect(x, y, w, h, **kw):
    return el('rect', x=num(x), y=num(y), width=num(w), height=num(h), **kw)


def circle(c, r, **kw):
    return el('circle', cx=num(c[0]), cy=num(c[1]), r=num(r), **kw)


def g(body, **kw):
    return el('g', body, **kw)


def text(x, y, s, size, fam, fill, weight=None, anchor=None, ls=None,
         op=None, halo=None, rot=None, transform=None, lh=1.25,
         stretch=None, upper=False, central=False):
    if upper:
        s = s.upper()
    if transform is None:
        ox, oy = x, y
        tf = 'rotate(%s %s %s)' % (num(rot), num(x), num(y)) if rot else None
    else:
        ox, oy, tf = 0, 0, transform
    lines = s.split('\n')
    if len(lines) == 1:
        body = esc(s)
    else:
        body = ''.join(
            el('tspan', esc(t), x=num(ox), dy=num(0 if i == 0 else size * lh))
            for i, t in enumerate(lines)
        )
    kw = dict(
        x=num(ox), y=num(oy), font_family=FAM[fam], font_size=num(size),
        font_weight=weight, fill=fill, fill_opacity=op, text_anchor=anchor,
        letter_spacing=num(ls) if ls else None, transform=tf,
        dominant_baseline='central' if central else None,
        style='font-stretch:%s' % stretch if stretch else None,
    )
    if halo:
        kw.update(stroke=halo, stroke_width=num(max(2.5, size * 0.3)),
                  stroke_linejoin='round', paint_order='stroke')
    return el('text', body, **kw)


def ts(x, y, s, st, **kw):
    """Teks dengan kamus gaya `st` (size, fam, fill, dan sisanya)."""
    a = dict(st)
    a.update(kw)
    return text(x, y, s, a.pop('size'), a.pop('fam'), a.pop('fill'), **a)


def arrowhead(a, b, size=10.0, width=0.5):
    dx, dy = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dy) or 1.0
    ux, uy = dx / L, dy / L
    bx, by = b[0] - ux * size, b[1] - uy * size
    px, py = -uy * size * width, ux * size * width
    return [b, (bx + px, by + py), (bx - px, by - py)]


# ------------------------------------------------------------ proyeksi

class OrthoXY:
    """Denah: x ke kanan, y ke bawah, s piksel per meter."""

    def __init__(self, ox, oy, s):
        self.ox, self.oy, self.s = ox, oy, s

    def pt(self, a, b):
        return (self.ox + a * self.s, self.oy + b * self.s)

    def tattrs(self, a, b, rot=0):
        x, y = self.pt(a, b)
        return dict(x=x, y=y, rot=rot)


class OrthoXZ(OrthoXY):
    """Potongan: x ke kanan, z ke atas dari garis tanah gy."""

    def pt(self, a, b):
        return (self.ox + a * self.s, self.oy - b * self.s)


class Axo:
    """Aksonometri arah B. x menjauh ke kanan atas, y mendekat ke kanan
    bawah, z tegak. Bidang denah tidak berubah bentuk selain dimiringkan."""

    EX = (0.94, -0.342)
    EY = (0.35, 0.606)
    EZ = (0.0, -0.95)
    EYU = (0.5, 0.866)

    def __init__(self, X0=0.0, Y0=0.0, k=1.0):
        self.X0, self.Y0, self.k = X0, Y0, k

    def p(self, x, y, z=0.0):
        return (
            self.X0 + self.k * (x * self.EX[0] + y * self.EY[0] + z * self.EZ[0]),
            self.Y0 + self.k * (x * self.EX[1] + y * self.EY[1] + z * self.EZ[1]),
        )

    @classmethod
    def fit(cls, pts3, box):
        unit = cls()
        q = [unit.p(*v) for v in pts3]
        xs, ys = [v[0] for v in q], [v[1] for v in q]
        x0, y0, x1, y1 = box
        w, h = max(xs) - min(xs), max(ys) - min(ys)
        k = min((x1 - x0) / w, (y1 - y0) / h)
        X0 = x0 - min(xs) * k + ((x1 - x0) - w * k) / 2
        Y0 = y0 - min(ys) * k + ((y1 - y0) - h * k) / 2
        return cls(X0, Y0, k)


def _mat(ax, ay, bx, by, x, y, rot):
    if rot:
        c, s = math.cos(math.radians(rot)), math.sin(math.radians(rot))
        ax, ay, bx, by = ax * c + bx * s, ay * c + by * s, -ax * s + bx * c, -ay * s + by * c
    return 'matrix(%s)' % ' '.join(num(v) for v in (ax, ay, bx, by, x, y))


class AxoFloor:
    """Bidang datar pada ketinggian z. Teks rebah di lantai."""

    def __init__(self, axo, z=0.0, du=None):
        self.axo, self.z, self.du = axo, z, du

    def pt(self, a, b):
        if self.du:
            a, b = self.du(a, b)
        return self.axo.p(a, b, self.z)

    def tattrs(self, a, b, rot=0):
        x, y = self.pt(a, b)
        ex, ey = Axo.EX, Axo.EYU
        return dict(transform=_mat(ex[0], ex[1], ey[0], ey[1], x, y, rot))


class AxoPlane:
    """Bidang tegak y = y0 (potongan). Teks berdiri di bidang itu."""

    def __init__(self, axo, y0):
        self.axo, self.y0 = axo, y0

    def pt(self, a, b):
        return self.axo.p(a, self.y0, b)

    def tattrs(self, a, b, rot=0):
        x, y = self.pt(a, b)
        return dict(transform=_mat(Axo.EX[0], Axo.EX[1], 0.0, 1.0, x, y, rot))


# ---------------------------------------------------------------- gaya


def _roles(c, cut, furn_cut, earth, glow_w=1.0):
    return dict(
        cut=cut,
        column=dict(fill=c),
        glass=dict(stroke=c, stroke_width=0.9 * glow_w),
        furn=dict(fill='none', stroke=c, stroke_width=1.15 * glow_w, stroke_opacity=0.72),
        furn_cut=furn_cut,
        hidden=dict(fill='none', stroke=c, stroke_width=0.9, stroke_opacity=0.55,
                    stroke_dasharray='6 4'),
        stair=dict(stroke=c, stroke_width=1.1),
        door=dict(),
        door_leaf=dict(stroke=c, stroke_width=1.5),
        door_arc=dict(stroke=c, stroke_width=0.8, stroke_opacity=0.55),
        guest=dict(stroke=c, stroke_width=2.4, stroke_dasharray='10 6',
                   stroke_linecap='round'),
        kitchen=dict(stroke=c, stroke_width=2.8, stroke_dasharray='0.5 6.5',
                     stroke_linecap='round'),
        elev=dict(fill='none', stroke=c, stroke_width=1.05, stroke_opacity=0.72),
        elev_wall=dict(fill=c, fill_opacity=0.06, stroke=c, stroke_width=1,
                       stroke_opacity=0.6),
        ground=dict(stroke=c, stroke_width=2.4),
        earth=earth,
    )


def _common(c, ground, halo, label_fam='mono', title_fam='syne', title_w=700,
            node_fam='syne', node_w=600, stretch=None):
    return dict(
        ink=c, ground=ground, halo=halo, arrow=11,
        label=dict(fam=label_fam, size=14.5, fill=c, weight=500, ls=1.0,
                   halo=halo, upper=True),
        axis=dict(stroke=c, stroke_width=0.9, stroke_opacity=0.45,
                  stroke_dasharray='22 5 3 5'),
        dim=dict(stroke=c, stroke_width=0.9, stroke_opacity=0.8),
        dim_tick=dict(stroke=c, stroke_width=1.6),
        dimtext=dict(size=13, fam='mono', fill=c),
        cutline=dict(stroke=c, stroke_width=1.4, stroke_dasharray='20 5 3 5'),
        bubble=dict(fill=ground, stroke=c, stroke_width=1.4),
        title=dict(size=24, fam=title_fam, fill=c, weight=title_w, ls=0.5,
                   upper=True, stretch=stretch),
        small=dict(size=12, fam='mono', fill=c, op=0.75),
        lane=dict(stroke=c, stroke_width=1, stroke_opacity=0.3),
        edge=dict(stroke=c, stroke_width=1.6),
        edge_dash=dict(stroke=c, stroke_width=1.6, stroke_dasharray='7 5'),
        node=dict(fill=ground, stroke=c, stroke_width=1.6),
        node_title=dict(size=17, fam=node_fam, fill=c, weight=node_w,
                        stretch=stretch),
        node_sub=dict(size=13, fam='mono', fill=c, op=0.75),
        card=dict(fill=ground, stroke=c, stroke_width=1.3),
    )


def style_a():
    c = X['ink']
    s = _common(c, X['paper'], X['paper'])
    s['roles'] = _roles(
        c,
        cut=dict(fill='url(#a-hatch)', stroke=c, stroke_width=2.2),
        furn_cut=dict(fill='url(#a-hatch-fine)', stroke=c, stroke_width=1.6),
        earth=dict(fill='url(#a-earth)'),
    )
    return s


def style_b(flat=False):
    c = X['paper']
    s = _common(c, X['ink'], X['ink'] if flat else None, title_fam='arch',
                title_w=800, node_fam='arch', node_w=600, stretch='118%')
    s['roles'] = _roles(
        c,
        cut=dict(fill=c, fill_opacity=0.16, stroke=c, stroke_width=1.7),
        furn_cut=dict(fill=c, fill_opacity=0.1, stroke=c, stroke_width=1.3),
        earth=None,
    )
    s['roles']['furn'].update(stroke_opacity=0.58)
    s['roles']['elev'].update(stroke_opacity=0.55)
    s['roles']['hidden'].update(stroke_opacity=0.32)
    s['label'].update(op=0.82)
    s['node'] = dict(fill=c, fill_opacity=0.05, stroke=c, stroke_width=1.5,
                     stroke_opacity=0.85)
    s['card'] = dict(fill=c, fill_opacity=0.05, stroke=c, stroke_width=1.2,
                     stroke_opacity=0.8)
    s['bubble'] = dict(fill=X['ink'], stroke=c, stroke_width=1.3)
    s['lane'].update(stroke_opacity=0.22)
    s['grid'] = dict(stroke=c, stroke_width=0.7, stroke_opacity=0.08)
    s['plane'] = dict(fill=c, fill_opacity=0.045, stroke=c, stroke_width=1,
                      stroke_opacity=0.35)
    s['proj'] = dict(stroke=c, stroke_width=0.8, stroke_opacity=0.3,
                     stroke_dasharray='2 5')
    return s


def style_c():
    c = X['ungu']
    s = _common(c, X['kertas'], X['kertas'], title_fam='barc', title_w=800,
                node_fam='bar', node_w=600)
    s['roles'] = _roles(
        c,
        cut=dict(fill=c, fill_opacity=0.9, stroke=c, stroke_width=1.2),
        furn_cut=dict(fill=c, fill_opacity=0.35, stroke=c, stroke_width=1.4),
        earth=dict(fill=c, fill_opacity=0.14),
    )
    s['roles']['furn'].update(stroke_opacity=0.9)
    s['roles']['elev'].update(stroke_opacity=0.82)
    s['title'].update(size=27, ls=0.8)
    s['node_title'].update(size=18, fill=X['tinta'])
    s['node_sub'].update(fill=X['tinta'], op=0.72, size=12.5)
    s['lane'].update(stroke_opacity=0.4)
    return s
