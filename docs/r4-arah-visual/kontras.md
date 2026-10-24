# Kontras arah visual R4

Dibuat oleh `bangun.py`; jangan disunting tangan. Warna `oklch()` diubah ke sRGB 8-bit seperti yang dilukis browser, warna transparan dikomposit di atas latarnya, lalu rasio dihitung dengan rumus WCAG 2.x. Teks perlu 4,5:1 (WCAG 1.4.3); garis yang membawa arti perlu 3:1 (WCAG 1.4.11).

Ini hitungan, bukan pengukuran di halaman yang dirender. Bila satu arah dibangun, `contrast.test.ts` dan `e2e/contrast-situ.e2e.ts` tetap yang menentukan (aturan #11).

## Sistem yang disetujui: B panggung, A dokumen

| Pasangan                                                   | Depan     | Latar     | Rasio   | Ambang | Hasil |
| ---------------------------------------------------------- | --------- | --------- | ------- | ------ | ----- |
| Panggung (B): kertas di atas tinta                         | `#f4f3ef` | `#110f0d` | 17,23:1 | 4,5:1  | Lulus |
| Panggung: keterangan kertas 75%                            | `#bbbab6` | `#110f0d` | 9,85:1  | 4,5:1  | Lulus |
| Panggung: tombol ajakan, tinta di atas kertas              | `#110f0d` | `#f4f3ef` | 17,23:1 | 4,5:1  | Lulus |
| Dokumen (A): tinta di atas kertas                          | `#110f0d` | `#f4f3ef` | 17,23:1 | 4,5:1  | Lulus |
| Dokumen: keterangan tinta 75%                              | `#4a4846` | `#f4f3ef` | 8,20:1  | 4,5:1  | Lulus |
| Dokumen: tinta di atas blok langkah pertama (--surface)    | `#110f0d` | `#ebeae6` | 15,89:1 | 4,5:1  | Lulus |
| Dokumen: keterangan tinta 75% di atas blok langkah pertama | `#484643` | `#ebeae6` | 7,81:1  | 4,5:1  | Lulus |
| Dokumen: tombol ajakan, kertas di atas tinta               | `#f4f3ef` | `#110f0d` | 17,23:1 | 4,5:1  | Lulus |
| Garis pelat dokumen: tinta                                 | `#110f0d` | `#f4f3ef` | 17,23:1 | 3:1    | Lulus |
| Garis pelat panggung: kertas di atas tinta                 | `#f4f3ef` | `#110f0d` | 17,23:1 | 3:1    | Lulus |

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

## Arah A, Lembar kerja

| Pasangan                                         | Depan     | Latar     | Rasio   | Ambang | Hasil |
| ------------------------------------------------ | --------- | --------- | ------- | ------ | ----- |
| Judul, isi, label pelat: tinta di atas kertas    | `#110f0d` | `#f4f3ef` | 17,23:1 | 4,5:1  | Lulus |
| Keterangan dan isi kop: tinta 75% (--text-muted) | `#4a4846` | `#f4f3ef` | 8,20:1  | 4,5:1  | Lulus |
| Tombol: kertas di atas tinta                     | `#f4f3ef` | `#110f0d` | 17,23:1 | 4,5:1  | Lulus |
| Garis dinding, jalur, dan label: tinta           | `#110f0d` | `#f4f3ef` | 17,23:1 | 3:1    | Lulus |
| Garis perabot: tinta 72%                         | `#514f4c` | `#f4f3ef` | 7,35:1  | 3:1    | Lulus |
| Garis bantu as dan arsiran: tinta 45%            | `#8e8c89` | `#f4f3ef` | 3,02:1  | 3:1    | Lulus |

Token sumber:

- `#110f0d`: --color-ink, oklch(0.17 0.006 66)
- `#f4f3ef`: --color-paper, oklch(0.964 0.006 92)
