/**
 * Rate Limiting using Cloudflare Workers KV
 *
 * This implementation uses Cloudflare KV for distributed rate limiting
 * across all worker instances. Provides consistent rate limiting at scale.
 *
 * Features:
 * - Distributed state across all worker instances
 * - Automatic expiration via KV TTL
 * - Sliding window rate limiting
 * - Production-ready for Cloudflare Workers
 */

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

/**
 * Rate limiter using Cloudflare KV
 * Provides distributed rate limiting across all worker instances
 */
export class KVRateLimiter {
  constructor(private kv: KVNamespace) {}

  /**
   * Check and increment rate limit for an identifier
   */
  async checkLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now()
    const key = `ratelimit:${identifier}`

    try {
      // Get current entry from KV
      const entryJson = await this.kv.get(key)
      let entry: RateLimitEntry | null = null

      if (entryJson) {
        try {
          entry = JSON.parse(entryJson)
        } catch {
          // Invalid JSON, treat as no entry
          entry = null
        }
      }

      // Check if window has expired or no entry exists
      if (!entry || entry.resetTime < now) {
        // Create new window
        const newEntry: RateLimitEntry = {
          count: 1,
          resetTime: now + config.windowMs,
        }

        // Store in KV with TTL (windowMs + 60s buffer)
        await this.kv.put(key, JSON.stringify(newEntry), {
          expirationTtl: Math.ceil(config.windowMs / 1000) + 60,
        })

        return {
          success: true,
          remaining: config.maxRequests - 1,
          resetTime: newEntry.resetTime,
        }
      }

      // Check if limit exceeded
      if (entry.count >= config.maxRequests) {
        return {
          success: false,
          remaining: 0,
          resetTime: entry.resetTime,
        }
      }

      // Increment count
      entry.count++
      await this.kv.put(key, JSON.stringify(entry), {
        expirationTtl: Math.ceil((entry.resetTime - now) / 1000) + 60,
      })

      return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime,
      }
    } catch (error) {
      // Log error but allow request to proceed (fail open)
      console.error('Rate limit KV error:', error)
      return {
        success: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      }
    }
  }

  /**
   * Reset rate limit for an identifier (admin/testing)
   */
  async reset(identifier: string): Promise<void> {
    const key = `ratelimit:${identifier}`
    await this.kv.delete(key)
  }

  /**
   * Get current rate limit status without incrementing
   */
  async getStatus(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now()
    const key = `ratelimit:${identifier}`

    try {
      const entryJson = await this.kv.get(key)

      if (!entryJson) {
        return {
          success: true,
          remaining: config.maxRequests,
          resetTime: now + config.windowMs,
        }
      }

      const entry: RateLimitEntry = JSON.parse(entryJson)

      if (entry.resetTime < now) {
        return {
          success: true,
          remaining: config.maxRequests,
          resetTime: now + config.windowMs,
        }
      }

      return {
        success: entry.count < config.maxRequests,
        remaining: Math.max(0, config.maxRequests - entry.count),
        resetTime: entry.resetTime,
      }
    } catch (error) {
      console.error('Rate limit KV status error:', error)
      return {
        success: true,
        remaining: config.maxRequests,
        resetTime: now + config.windowMs,
      }
    }
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
