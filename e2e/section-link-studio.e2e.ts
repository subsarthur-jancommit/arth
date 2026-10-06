import { expect, type Page, test } from '@playwright/test'

/**
 * A step of the studio's process can be pointed at
 * (`vault/blocks/step-sequence`, `linkSteps`).
 *
 * Every step carries an id built from its key, so the same address works in
 * both languages; the step an address arrives at is marked; and the held
 * column copies the step at the reading line at the moment it is pressed.
 */
const STEPS = ['scope', 'read', 'decide', 'deliver'] as const

/** Brings the third step's top past the reading line, the fourth's not. */
async function readToDecide(page: Page) {
  await page.locator('#process-decide').evaluate((step) => {
    window.scrollTo(
      0,
      window.scrollY +
        step.getBoundingClientRect().top -
        window.innerHeight * 0.3
    )
  })
}

async function copiedLink(page: Page) {
  const sequence = page.locator('[data-step-sequence]')
  await sequence.getByRole('button', { name: 'Copy section link' }).click()
  await expect(sequence.getByRole('status')).toHaveText(/copied/i)
  return page.evaluate(() => navigator.clipboard.readText())
}

test.describe('a step of the studio process can be pointed at', () => {
  test('every step carries its id, the same in both languages', async ({
    page,
  }) => {
    for (const locale of ['en', 'id']) {
      await page.goto(`/${locale}/studio`)
      const ids = await page
        .locator('[data-step-sequence] li[data-step]')
        .evaluateAll((items) => items.map((item) => item.id))
      expect(ids, `/${locale}/studio`).toEqual(
        STEPS.map((key) => `process-${key}`)
      )
    }
  })

  test('arriving by a step link marks that step, and only it', async ({
    page,
  }) => {
    await page.goto('/id/studio#process-decide')

    const arrived = page.locator('[data-step-sequence] li[data-arrived]')
    await expect(arrived).toHaveCount(1)
    await expect(arrived).toHaveAttribute('id', 'process-decide')
  })

  test('copying puts this page and the step being read on the clipboard', async ({
    context,
    page,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/en/studio')
    await readToDecide(page)

    expect(await copiedLink(page)).toMatch(/\/en\/studio#process-decide$/)
  })
})

test.describe('under reduced motion', () => {
  /*
   * No trigger leads the steps under the preference, so the held counter
   * stays at the first. The copy is read from layout at the press instead,
   * and must still name the step the reader is at.
   */
  test('the copy still names the step being read', async ({
    context,
    page,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/en/studio')
    await readToDecide(page)

    expect(await copiedLink(page)).toMatch(/\/en\/studio#process-decide$/)
  })
})
