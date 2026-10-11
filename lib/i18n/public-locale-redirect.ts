/**
 * The English root is not an approved language landing page yet.
 */
export function publicLocaleRedirect(pathname: string): string | null {
  return pathname === '/en' ? '/id' : null
}
