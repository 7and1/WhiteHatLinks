/**
 * Utility to retrieve CSP nonce from request headers
 *
 * In Next.js 15, we can access headers in Server Components
 * to retrieve the nonce generated in middleware.
 */

import { headers } from 'next/headers'
import { CSP_NONCE_HEADER } from './csp'

/**
 * Get the CSP nonce from request headers
 *
 * This should be called in Server Components to retrieve
 * the nonce generated in middleware for inline scripts/styles.
 *
 * @returns The nonce value or undefined if not found
 */
export async function getNonce(): Promise<string | undefined> {
  const headersList = await headers()
  return headersList.get(CSP_NONCE_HEADER) || undefined
}
