/**
 * Rate Limiting for Cloudflare Workers
 *
 * IMPORTANT: This in-memory rate limiting has limitations in Cloudflare Workers
 * since workers are stateless and may run on different instances.
 *
 * For production, consider:
 * 1. Cloudflare Rate Limiting Rules (Dashboard > Security > WAF > Rate limiting)
 * 2. Cloudflare Workers KV or Durable Objects for shared state
 *
 * This implementation provides basic protection for single-instance scenarios
 * and development environments.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Note: This map is not shared across worker instances
const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up expired entries (runs only within instance lifetime)
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now()
      for (const [key, entry] of rateLimitMap) {
        if (entry.resetTime < now) {
          rateLimitMap.delete(key)
        }
      }
    },
    60 * 1000 // Clean up every minute
  )
}

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60 * 1000 }
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || entry.resetTime < now) {
    // First request or window has reset
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    }
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Get the client IP address from the request
 * Supports Cloudflare-specific headers
 */
export function getClientIp(request: Request): string {
  // Cloudflare's CF-Connecting-IP header (most reliable on Cloudflare)
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // X-Forwarded-For (may contain multiple IPs)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // X-Real-IP header
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback for development
  return 'unknown-client'
}

/**
 * Create a rate limit identifier from request
 * Combines IP with optional additional identifiers for more granular control
 */
export function createRateLimitKey(request: Request, prefix = 'default'): string {
  const ip = getClientIp(request)
  return `${prefix}:${ip}`
}
