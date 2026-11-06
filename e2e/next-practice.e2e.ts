import { expect, test } from '@playwright/test'

import { UNITS, unitTemplate } from '../lib/content/units'
import { localizedPath } from '../lib/i18n/paths'
import { transitionsAtRest } from './settle'

/**
 * `next-practice`, the route out of a unit page, and the rule it broke
 * (`docs/MOTION-SPEC.md` §11.4): a reveal marker never goes on a pressable
 * noun.
 *
 * The reveal contract (`lib/styles/css/global.css`) gives every
 * `[data-reveal-item]` a `transition` shorthand, at a specificity no single
 * component class beats, and a shorthand replaces an element's own transition
 * rather than joining it. The link carried the marker until F4-01's
 * follow-up, so its COMMIT, `transform` at `--duration-micro` (150ms), ran on
 * the reveal's 400ms. The marker now sits on a wrapper inside the `<aside>`.
 *
 * This holds both halves of that: the link is not a reveal item, and once
 * the reveal has arrived a press compresses the link on its own transition.
 * Every unit page, because each speaks its own dialect (F4-02) and a dialect
 * retimes reveal items: the COMMIT is the same on all three.
 */
test.describe('the next-practice link keeps its own COMMIT', () => {
  for (const unit of UNITS)
    test(`/id/${unit}: the reveal moves a wrapper, and a press runs at --duration-micro`, async ({
      page,
    }) => {
      await page.goto(localizedPath('id', unitTemplate(unit)))

      const link = page.locator('[data-next-practice]')
      await expect(link, 'the page has no next-practice link').toHaveCount(1)

      const marker = await link.evaluate((element) => ({
        self: element.hasAttribute('data-reveal-item'),
        wrapper: element.parentElement?.hasAttribute('data-reveal-item'),
      }))
      expect(marker.self, 'the link is a reveal item again').toBe(false)
      expect(marker.wrapper, 'nothing carries the reveal for the link').toBe(
        true
      )

      // On screen, arrived, and at rest: what is measured is the link's own.
      await link.hover()
      await expect(
        page.locator('aside[data-reveal="visible"]:has([data-next-practice])'),
        'the next-practice reveal never arrived'
      ).toHaveCount(1)
      await transitionsAtRest(page)

      const commit = await link.evaluate((element) => {
        const style = getComputedStyle(element)
        const properties = style.transitionProperty
          .split(',')
          .map((property) => property.trim())
        const durations = style.transitionDuration
          .split(',')
          .map((duration) => Number.parseFloat(duration))
        const at = properties.findIndex(
          (property) => property === 'transform' || property === 'all'
        )

        const probe = document.createElement('i')
        probe.style.transitionDuration = 'var(--duration-micro)'
        document.body.append(probe)
        const micro = Number.parseFloat(
          getComputedStyle(probe).transitionDuration
        )
        probe.remove()

        return {
          transform:
            at === -1
              ? null
              : Math.round((durations[at % durations.length] ?? 0) * 1000),
          micro: Math.round(micro * 1000),
          declared: `${style.transitionProperty} ${style.transitionDuration}`,
        }
      })

      expect(
        commit.transform,
        `the link does not transition its transform (${commit.declared})`
      ).not.toBeNull()
      expect(
        commit.transform,
        `the link's COMMIT is not its own (${commit.declared})`
      ).toBe(commit.micro)

      // Released away from the link, so measuring a press never navigates.
      await page.mouse.down()
      await page.waitForTimeout(300)
      const pressed = await link.evaluate((element) => ({
        active: element.matches(':active'),
        scale: new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
      }))
      await page.mouse.move(2, 2)
      await page.mouse.up()

      expect(pressed.active, 'the press did not reach the link').toBe(true)
      expect(pressed.scale, 'a press did not compress the link').toBeLessThan(1)
    })
})
