import { expect, test } from '@playwright/test'

/**
 * The footer's index says which page this is
 * (`components/layout/footer/index-link.tsx`): one line marked
 * `aria-current="page"`, and marked by more than ink.
 */
for (const [path, name] of [
  ['/id/peekabo', 'Peekabo'],
  // The contact column links the contact page until K5 names a channel.
  ['/id/kontak', 'Kontak'],
  ['/id/konstruksi', 'Konstruksi'],
  ['/id/teknologi', 'Teknologi'],
  // Every fixed page is in the index since R4 (route names, 2026-10-30).
  ['/id/metode', 'Metode kerja'],
  ['/id/layanan', 'Layanan'],
  ['/id/pembayaran', 'Pembayaran'],
] as const) {
  test(`${path}: the footer marks its own line, and only it`, async ({
    page,
  }) => {
    await page.goto(path)

    const current = page.locator('footer [aria-current="page"]')
    await expect(current).toHaveCount(1)
    await expect(current).toHaveText(name)
    expect(
      await current.evaluate((el) => getComputedStyle(el).textDecorationLine)
    ).toBe('underline')
  })
}
