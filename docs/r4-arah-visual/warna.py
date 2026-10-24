"""Warna dan kontras untuk gambar diam R4.

oklch() diubah ke sRGB 8-bit seperti yang dilukis browser, lalu rasio kontras
dihitung dengan rumus WCAG 2.x. Warna transparan dikomposit di sRGB, sama
seperti `color-mix(in oklab, X 75%, transparent)` dilukis di atas latarnya.
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

# Usulan arah C saja.
PAPAN = oklch(0.905, 0.012, 248, 'papan')
KERTAS = oklch(0.985, 0.004, 248, 'kertas')
TINTA = oklch(0.21, 0.02, 275, 'tinta')
UNGU = oklch(0.47, 0.165, 290, 'ungu')
UNGU_TERANG = oklch(0.8, 0.1, 290, 'ungu-terang')
MALAM = oklch(0.2, 0.02, 275, 'malam')

X = dict(
    ink=hexc(INK),
    paper=hexc(PAPER),
    papan=hexc(PAPAN),
    kertas=hexc(KERTAS),
    tinta=hexc(TINTA),
    ungu=hexc(UNGU),
    ungu_terang=hexc(UNGU_TERANG),
    malam=hexc(MALAM),
    lubang=hexc(over(TINTA, 0.22, PAPAN)),
    muted_a=hexc(over(INK, 0.75, PAPER)),
    muted_b=hexc(over(PAPER, 0.75, INK)),
    muted_c=hexc(over(TINTA, 0.72, KERTAS)),
)

# Sumber token untuk tabel: nama token atau resepnya.
SUMBER = dict(
    ink='--color-ink, oklch(0.17 0.006 66)',
    paper='--color-paper, oklch(0.964 0.006 92)',
    papan='usulan --papan, oklch(0.905 0.012 248)',
    kertas='usulan --kertas, oklch(0.985 0.004 248)',
    tinta='usulan --tinta, oklch(0.21 0.02 275)',
    ungu='usulan --ungu, oklch(0.47 0.165 290)',
    ungu_terang='usulan --ungu-terang, oklch(0.8 0.1 290)',
    malam='usulan --malam, oklch(0.2 0.02 275)',
)

# Setiap pasangan teks dan latar yang tampil di gambar diam, per arah.
# 'teks' perlu 4,5:1 (WCAG 1.4.3); 'non' adalah garis yang membawa arti dan
# perlu 3:1 (WCAG 1.4.11).
PAIRS = {
    'a': [
        ('Judul, isi, label pelat: tinta di atas kertas', INK, PAPER, 'teks'),
        ('Keterangan dan isi kop: tinta 75% (--text-muted)', over(INK, 0.75, PAPER), PAPER, 'teks'),
        ('Tombol Ceritakan masalahnya: kertas di atas tinta', PAPER, INK, 'teks'),
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
    'c': [
        ('Judul dan navigasi: tinta di atas papan', TINTA, PAPAN, 'teks'),
        ('Isi kartu dan label: tinta di atas kertas', TINTA, KERTAS, 'teks'),
        ('Keterangan: tinta 72% di atas kertas', over(TINTA, 0.72, KERTAS), KERTAS, 'teks'),
        ('Keterangan di papan: tinta 72% di atas papan', over(TINTA, 0.72, PAPAN), PAPAN, 'teks'),
        ('Label pelat dan stempel: ungu di atas kertas', UNGU, KERTAS, 'teks'),
        ('Stempel di papan: ungu di atas papan', UNGU, PAPAN, 'teks'),
        ('Tombol: kertas di atas ungu', KERTAS, UNGU, 'teks'),
        ('Pita label: kertas di atas tinta', KERTAS, TINTA, 'teks'),
        ('Tema gelap (usulan): kertas di atas malam', KERTAS, MALAM, 'teks'),
        ('Tema gelap (usulan): ungu terang di atas malam', UNGU_TERANG, MALAM, 'teks'),
        ('Garis cetak: ungu di atas kertas', UNGU, KERTAS, 'non'),
        ('Coretan: tinta di atas kertas', TINTA, KERTAS, 'non'),
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
