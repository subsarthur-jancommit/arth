# Kontras arah visual R4

Dibuat oleh `bangun.py`; jangan disunting tangan. Warna `oklch()` diubah ke sRGB 8-bit seperti yang dilukis browser, warna transparan dikomposit di atas latarnya, lalu rasio dihitung dengan rumus WCAG 2.x. Teks perlu 4,5:1 (WCAG 1.4.3); garis yang membawa arti perlu 3:1 (WCAG 1.4.11).

Ini hitungan, bukan pengukuran di halaman yang dirender. Bila satu arah dibangun, `contrast.test.ts` dan `e2e/contrast-situ.e2e.ts` tetap yang menentukan (aturan #11).

## Arah A, Lembar kerja

| Pasangan                                          | Depan     | Latar     | Rasio   | Ambang | Hasil |
| ------------------------------------------------- | --------- | --------- | ------- | ------ | ----- |
| Judul, isi, label pelat: tinta di atas kertas     | `#110f0d` | `#f4f3ef` | 17,23:1 | 4,5:1  | Lulus |
| Keterangan dan isi kop: tinta 75% (--text-muted)  | `#4a4846` | `#f4f3ef` | 8,20:1  | 4,5:1  | Lulus |
| Tombol Ceritakan masalahnya: kertas di atas tinta | `#f4f3ef` | `#110f0d` | 17,23:1 | 4,5:1  | Lulus |
| Garis dinding, jalur, dan label: tinta            | `#110f0d` | `#f4f3ef` | 17,23:1 | 3:1    | Lulus |
| Garis perabot: tinta 72%                          | `#514f4c` | `#f4f3ef` | 7,35:1  | 3:1    | Lulus |
| Garis bantu as dan arsiran: tinta 45%             | `#8e8c89` | `#f4f3ef` | 3,02:1  | 3:1    | Lulus |

## Arah B, Maket cahaya

| Pasangan                                             | Depan     | Latar     | Rasio   | Ambang | Hasil           |
| ---------------------------------------------------- | --------- | --------- | ------- | ------ | --------------- |
| Judul dan isi: kertas di atas tinta                  | `#f4f3ef` | `#110f0d` | 17,23:1 | 4,5:1  | Lulus           |
| Keterangan: kertas 75%                               | `#bbbab6` | `#110f0d` | 9,85:1  | 4,5:1  | Lulus           |
| Label pelat dekat: kertas 82%                        | `#cbcac6` | `#110f0d` | 11,66:1 | 4,5:1  | Lulus           |
| Label pelat di kejauhan: kertas 45%                  | `#777673` | `#110f0d` | 4,21:1  | 4,5:1  | Di bawah ambang |
| Tombol saat disorot: tinta di atas kertas            | `#110f0d` | `#f4f3ef` | 17,23:1 | 4,5:1  | Lulus           |
| Teks di atas pendar garis: kertas di atas pendar 30% | `#f4f3ef` | `#555351` | 6,90:1  | 4,5:1  | Lulus           |
| Garis pelat: kertas di atas tinta                    | `#f4f3ef` | `#110f0d` | 17,23:1 | 3:1    | Lulus           |
| Garis redup: kertas 45%                              | `#777673` | `#110f0d` | 4,21:1  | 3:1    | Lulus           |

## Arah C, Papan proyek

| Pasangan                                       | Depan     | Latar     | Rasio   | Ambang | Hasil |
| ---------------------------------------------- | --------- | --------- | ------- | ------ | ----- |
| Judul dan navigasi: tinta di atas papan        | `#151822` | `#dae1e7` | 13,41:1 | 4,5:1  | Lulus |
| Isi kartu dan label: tinta di atas kertas      | `#151822` | `#f8fafd` | 16,94:1 | 4,5:1  | Lulus |
| Keterangan: tinta 72% di atas kertas           | `#55575f` | `#f8fafd` | 6,89:1  | 4,5:1  | Lulus |
| Keterangan di papan: tinta 72% di atas papan   | `#4c5059` | `#dae1e7` | 6,12:1  | 4,5:1  | Lulus |
| Label pelat dan stempel: ungu di atas kertas   | `#5d42af` | `#f8fafd` | 7,01:1  | 4,5:1  | Lulus |
| Stempel di papan: ungu di atas papan           | `#5d42af` | `#dae1e7` | 5,55:1  | 4,5:1  | Lulus |
| Tombol: kertas di atas ungu                    | `#f8fafd` | `#5d42af` | 7,01:1  | 4,5:1  | Lulus |
| Pita label: kertas di atas tinta               | `#f8fafd` | `#151822` | 16,94:1 | 4,5:1  | Lulus |
| Tema gelap (usulan): kertas di atas malam      | `#f8fafd` | `#13151f` | 17,39:1 | 4,5:1  | Lulus |
| Tema gelap (usulan): ungu terang di atas malam | `#bcb3fa` | `#13151f` | 9,50:1  | 4,5:1  | Lulus |
| Garis cetak: ungu di atas kertas               | `#5d42af` | `#f8fafd` | 7,01:1  | 3:1    | Lulus |
| Coretan: tinta di atas kertas                  | `#151822` | `#f8fafd` | 16,94:1 | 3:1    | Lulus |

Token sumber:

- `#110f0d`: --color-ink, oklch(0.17 0.006 66)
- `#f4f3ef`: --color-paper, oklch(0.964 0.006 92)
- `#dae1e7`: usulan --papan, oklch(0.905 0.012 248)
- `#f8fafd`: usulan --kertas, oklch(0.985 0.004 248)
- `#151822`: usulan --tinta, oklch(0.21 0.02 275)
- `#5d42af`: usulan --ungu, oklch(0.47 0.165 290)
- `#bcb3fa`: usulan --ungu-terang, oklch(0.8 0.1 290)
- `#13151f`: usulan --malam, oklch(0.2 0.02 275)
