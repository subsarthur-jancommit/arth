import { expect, test } from '@playwright/test'

/**
 * The footer's index says which page this is
 * (`components/layout/footer/index-link.tsx`): one line marked
 * `aria-current="page"`, and marked by more than ink.
 */
for (const [path, name] of [
  ['/en/work', 'Work'],
  ['/en/studio', 'Studio'],
  ['/id/journal', 'Jurnal'],
  ['/id/konstruksi', 'Konstruksi'],
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

test('a page the index does not name marks nothing there', async ({ page }) => {
  await page.goto('/en/journal/scope-is-the-deliverable')
  // Anti-vacuum: the index is there, with its links.
  await expect(
    page.locator('footer a[href="/en/journal"]').first()
  ).toBeAttached()
  await expect(page.locator('footer [aria-current]')).toHaveCount(0)
})
