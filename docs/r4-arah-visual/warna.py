"""Warna dan kontras untuk gambar diam R4.

oklch() diubah ke sRGB 8-bit seperti yang dilukis browser, lalu rasio kontras
dihitung dengan rumus WCAG 2.x. Warna transparan dikomposit di sRGB, sama
seperti `color-mix(in oklab, X 75%, transparent)` dilukis di atas latarnya.

Arah B dan A memakai dua netral yang sudah ada saja; situs tetap monokrom.
"""

import math

GAMUT = []


def _enc(c):
    c = min(max(c, 0.0), 1.0)
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


def oklch(L, C, h, name):
    a = C * math.cos(math.radians(h))
    b = C * math.sin(math.radians(h))
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_**3, m_**3, s_**3
    lin = (
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    )
    if any(v < -1e-4 or v > 1 + 1e-4 for v in lin):
        GAMUT.append(name)
    return tuple(round(_enc(v) * 255) / 255 for v in lin)


def over(fg, alpha, bg):
    """`fg` pada `alpha` di atas `bg`, dikomposit seperti browser."""
    return tuple(
        round((f * alpha + b * (1 - alpha)) * 255) / 255 for f, b in zip(fg, bg)
    )


def hexc(c):
    return '#%02x%02x%02x' % tuple(round(v * 255) for v in c)


def _lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(c):
    r, g, b = (_lin(v) for v in c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    hi, lo = sorted((luminance(a), luminance(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


# Dua netral yang sudah dipakai situs (lib/styles/colors.ts).
INK = oklch(0.17, 0.006, 66, 'ink')
PAPER = oklch(0.964, 0.006, 92, 'paper')
SURFACE = over(INK, 0.04, PAPER)  # --surface di tema terang

X = dict(
    ink=hexc(INK),
    paper=hexc(PAPER),
    muted_a=hexc(over(INK, 0.75, PAPER)),
    muted_b=hexc(over(PAPER, 0.75, INK)),
    surface_g=hexc(SURFACE),
)

SUMBER = dict(
    ink='--color-ink, oklch(0.17 0.006 66)',
    paper='--color-paper, oklch(0.964 0.006 92)',
)

# Setiap pasangan teks dan latar yang tampil di gambar diam. 'teks' perlu
# 4,5:1 (WCAG 1.4.3); 'non' adalah garis yang membawa arti dan perlu 3:1
# (WCAG 1.4.11).
PAIRS = {
    'a': [
        ('Judul, isi, label pelat: tinta di atas kertas', INK, PAPER, 'teks'),
        ('Keterangan dan isi kop: tinta 75% (--text-muted)', over(INK, 0.75, PAPER), PAPER, 'teks'),
        ('Tombol: kertas di atas tinta', PAPER, INK, 'teks'),
        ('Garis dinding, jalur, dan label: tinta', INK, PAPER, 'non'),
        ('Garis perabot: tinta 72%', over(INK, 0.72, PAPER), PAPER, 'non'),
        ('Garis bantu as dan arsiran: tinta 45%', over(INK, 0.45, PAPER), PAPER, 'non'),
    ],
    'b': [
        ('Judul dan isi: kertas di atas tinta', PAPER, INK, 'teks'),
        ('Keterangan: kertas 75%', over(PAPER, 0.75, INK), INK, 'teks'),
        ('Label pelat dekat: kertas 82%', over(PAPER, 0.82, INK), INK, 'teks'),
        ('Label pelat di kejauhan: kertas 45%', over(PAPER, 0.45, INK), INK, 'teks'),
        ('Tombol saat disorot: tinta di atas kertas', INK, PAPER, 'teks'),
        ('Teks di atas pendar garis: kertas di atas pendar 30%', PAPER, over(PAPER, 0.30, INK), 'teks'),
        ('Garis pelat: kertas di atas tinta', PAPER, INK, 'non'),
        ('Garis redup: kertas 45%', over(PAPER, 0.45, INK), INK, 'non'),
    ],
    'g': [
        ('Panggung (B): kertas di atas tinta', PAPER, INK, 'teks'),
        ('Panggung: keterangan kertas 75%', over(PAPER, 0.75, INK), INK, 'teks'),
        ('Panggung: tombol ajakan, tinta di atas kertas', INK, PAPER, 'teks'),
        ('Dokumen (A): tinta di atas kertas', INK, PAPER, 'teks'),
        ('Dokumen: keterangan tinta 75%', over(INK, 0.75, PAPER), PAPER, 'teks'),
        ('Dokumen: tinta di atas blok langkah pertama (--surface)', INK, SURFACE, 'teks'),
        ('Dokumen: keterangan tinta 75% di atas blok langkah pertama',
         over(INK, 0.75, SURFACE), SURFACE, 'teks'),
        ('Dokumen: tombol ajakan, kertas di atas tinta', PAPER, INK, 'teks'),
        ('Garis pelat dokumen: tinta', INK, PAPER, 'non'),
        ('Garis pelat panggung: kertas di atas tinta', PAPER, INK, 'non'),
    ],
}


def rows(arah):
    out = []
    for label, fg, bg, kind in PAIRS[arah]:
        r = ratio(fg, bg)
        need = 4.5 if kind == 'teks' else 3.0
        out.append(
            dict(label=label, fg=hexc(fg), bg=hexc(bg), r=r, need=need,
                 ok=r >= need, kind=kind)
        )
    return out


def fmt_ratio(r):
    return ('%.2f' % r).replace('.', ',') + ':1'
