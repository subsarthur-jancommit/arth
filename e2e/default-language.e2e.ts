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

test('the bare English locale redirects to the Indonesian homepage', async ({
  request,
}) => {
  const response = await request.get('/en', { maxRedirects: 0 })

  expect(response.status()).toBe(307)
  expect(response.headers().location).toBe('/id')
})
