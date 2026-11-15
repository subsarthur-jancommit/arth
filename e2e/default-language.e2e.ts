import { expect, test } from '@playwright/test'

test('the public default is Indonesian regardless of browser language', async ({
  request,
}) => {
  const response = await request.get('/', {
    headers: { 'Accept-Language': 'en-US,en;q=0.9' },
    maxRedirects: 0,
  })

  expect(response.status()).toBe(307)
  expect(response.headers().location).toBe('/id')
})

// R7 opened the English home page; until then `/en` answered 307 to `/id`.
// What it says is read in `e2e/english-pages.e2e.ts`.
test('the bare English locale is the English home page', async ({
  request,
}) => {
  const response = await request.get('/en', { maxRedirects: 0 })

  expect(response.status()).toBe(200)
  expect(await response.text()).toContain('<html lang="en-US"')
})
