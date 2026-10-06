import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { axeTags } from './axe-tags'

/**
 * The page says when the connection goes, and when it comes back
 * (`vault/blocks/offline-notice`).
 *
 * `context.setOffline` is the browser's own switch: `navigator.onLine` flips
 * and the `offline` and `online` events fire, which is everything the notice
 * listens to. The page is fully loaded first, so nothing it needs is lost.
 */
const NOTICE = '[data-epic="offline-notice"]'

for (const [locale, offline, restored] of [
  ['en', 'You are offline', 'Back online'],
  ['id', 'Anda sedang luring', 'Tersambung kembali'],
] as const) {
  test(`/${locale}: offline, then back online, then quiet`, async ({
    page,
    context,
  }) => {
    await page.goto(`/${locale}/studio`)
    await page.waitForLoadState('networkidle')

    const notice = page.locator(NOTICE)
    // Present and silent while the connection is fine, so the first change is
    // announced by a region that already exists.
    await expect(notice).toHaveAttribute('role', 'status')
    await expect(notice).toHaveText('')

    await context.setOffline(true)
    await expect(notice).toHaveText(offline)
    await expect(notice.locator('p')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .include(NOTICE)
      .withTags(axeTags())
      .analyze()
    const found = results.violations.map(
      (violation) => `${violation.impact}: ${violation.id}`
    )
    expect(found, found.join('\n')).toEqual([])

    await context.setOffline(false)
    await expect(notice).toHaveText(restored)
    // It lets go on its own.
    await expect(notice).toHaveText('', { timeout: 10_000 })
  })
}

test('the notice is never a stop for the keyboard or the pointer', async ({
  page,
  context,
}) => {
  await page.goto('/en/studio')
  await page.waitForLoadState('networkidle')
  await context.setOffline(true)

  const pill = page.locator(`${NOTICE} p`)
  await expect(pill).toBeVisible()
  expect(
    await pill.evaluate((el) => ({
      focusable: el.matches('a, button, [tabindex]'),
      pointer: getComputedStyle(el.parentElement ?? el).pointerEvents,
    }))
  ).toEqual({ focusable: false, pointer: 'none' })

  await context.setOffline(false)
})

test('under reduced motion it neither rises nor fades', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/en/studio')
  await page.waitForLoadState('networkidle')
  await context.setOffline(true)

  const pill = page.locator(`${NOTICE} p`)
  await expect(pill).toBeVisible()
  // Read at once: under reduced motion the first frame is the final state.
  expect(
    await pill.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        opacity: style.opacity,
        transform: style.transform,
        transition: style.transitionDuration,
      }
    })
  ).toEqual({ opacity: '1', transform: 'none', transition: '0s' })

  // And "Back online" goes when its hold ends, without sinking first.
  await context.setOffline(false)
  await expect(pill).toHaveText('Back online')
  expect(await pill.evaluate((el) => getComputedStyle(el).animationName)).toBe(
    'none'
  )
})
