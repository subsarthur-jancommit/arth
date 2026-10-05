import { expect, test } from '@playwright/test'

/**
 * The colophon names the commit only where a build can
 * (`vault/blocks/build-stamp`).
 *
 * CI builds outside Vercel, so nothing is inlined and there is no stamp — the
 * colophon reads as it did before the block existed. The other half, a
 * Vercel build showing `Build <hash> <day>`, is looked at on the preview and
 * on production (`CLAUDE.md`, "Melihat hasil"): no CI build has a commit of
 * Vercel's to name. The rules for that half are unit-tested in `build.test.ts`.
 */
for (const [locale, colophon, builtOn] of [
  ['en', 'Colophon', 'Built on Satūs'],
  ['id', 'Kolofon', 'Dibangun di atas Satūs'],
] as const) {
  test(`/${locale}: no stamp without a build to name`, async ({ page }) => {
    await page.goto(`/${locale}`)

    const column = page
      .locator('footer section')
      .filter({ has: page.getByRole('heading', { name: colophon }) })
    // Anti-vacuum: the colophon itself is there, with its sentence.
    await expect(column.getByText(builtOn)).toHaveCount(1)

    await expect(page.locator('[data-epic="build-stamp"]')).toHaveCount(0)
  })
}
