const PUBLIC_PLACEHOLDER = /\[PERLU|isi contoh|teks sementara/i

type PublicText = string | null | undefined

export function hasPublicPlaceholder(values: readonly PublicText[]): boolean {
  return values.some(
    (value) => typeof value === 'string' && PUBLIC_PLACEHOLDER.test(value)
  )
}

/**
 * Keeps editorial placeholders out of a reader response even when a direct
 * API write bypasses Studio's document validation.
 */
export function canRenderPublicContent(
  scope: string,
  values: readonly PublicText[]
): boolean {
  if (!hasPublicPlaceholder(values)) return true

  console.warn(`Arthur public content withheld: ${scope} has a placeholder.`)
  return false
}
