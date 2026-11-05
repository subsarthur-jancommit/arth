import { expect, test } from '@playwright/test'

/**
 * "Satu klien, tiga unit" on the home page (`app/[locale]/home-sequence.tsx`):
 * one sequence, read from Sanity, and the way to the rest of them on
 * `/layanan`.
 *
 * Which sequence is `lib/content/home-sequence.ts`'s decision and is
 * unit-tested there; this holds what a reader gets. The route sweep already
 * audits `/id` with axe, so the block's markup is checked there too.
 *
 * The plates repeat the passage's, which already gives them their alt text,
 * so here they must be hidden from assistive technology: a screen reader is
 * not read the same three long descriptions twice.
 */
test.describe('the home page shows one sequence of the three units', () => {
  test('three steps, the way to /layanan, and the repeated plates kept quiet', async ({
    page,
  }) => {
    await page.goto('/id')

    const sequence = page.locator('#rangkaian')
    await expect(sequence).toHaveAttribute('data-epic', 'three-unit-splice')
    await expect(sequence.locator('ol > li[data-unit]')).toHaveCount(3)

    await expect(
      page.locator('#rangkaian + p a[href="/id/layanan"]'),
      'the block offers no way to the rest of the sequences'
    ).toHaveCount(1)

    const plates = await sequence.evaluate((root) =>
      [...root.querySelectorAll('svg[role="img"]')].map((svg) =>
        Boolean(svg.closest('[aria-hidden="true"]'))
      )
    )
    // Anti-vacuum: the café's three steps are the three plates' own jobs.
    expect(plates.length, 'no plate heads a step').toBeGreaterThan(0)
    expect(
      plates.every(Boolean),
      'a repeated plate is read out again to assistive technology'
    ).toBe(true)
  })
})
