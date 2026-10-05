import { expect, test } from '@playwright/test'

/**
 * The journal index says how long each entry takes, and says what the entry
 * itself says (`app/[locale]/journal/page.tsx`, from the count in
 * `lib/content/reading-time`).
 */
for (const [locale, pattern] of [
  ['en', /^\d+ min read$/],
  ['id', /^\d+ menit baca$/],
] as const) {
  test(`/${locale}/journal: each row's reading time is its entry's`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/journal`)

    const rows = page.locator('[data-epic="journal-index"] article')
    const count = await rows.count()
    expect(count, 'the index lists no entries').toBeGreaterThan(0)

    const listed: { href: string; label: string }[] = []
    for (let index = 0; index < count; index++) {
      const row = rows.nth(index)
      const href = await row.locator('h2 a').getAttribute('href')
      const label = (
        await row.locator('[data-reading-time]').textContent()
      )?.trim()
      expect(label ?? '').toMatch(pattern)
      listed.push({ href: href ?? '', label: label ?? '' })
    }

    for (const { href, label } of listed) {
      await page.goto(href)
      await expect(
        page.locator('header[data-epic="journal-transport"]'),
        `${href} says a different length from its row`
      ).toContainText(label)
    }
  })
}
