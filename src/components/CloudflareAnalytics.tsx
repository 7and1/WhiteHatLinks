/**
 * Cloudflare Web Analytics Component
 *
 * Privacy-first analytics without cookies
 * - GDPR compliant
 * - No personal data collection
 * - Minimal performance impact
 *
 * Setup:
 * 1. Get your analytics token from Cloudflare Dashboard
 * 2. Set NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN in .env
 * 3. Add static.cloudflareinsights.com to CSP connect-src
 */

export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN

  // Only load in production with valid token
  if (process.env.NODE_ENV !== 'production' || !token) {
    return null
  }

  // External scripts don't need nonce - they're allowed by CSP src directive
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  )
}
