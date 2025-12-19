/**
 * Rate Limit Factory
 *
 * Provides a unified interface for rate limiting that automatically
 * selects the appropriate implementation based on environment:
 * - Cloudflare Workers with KV: Uses KVRateLimiter
 * - Development/Testing: Uses in-memory rate limiter
 */

import { KVRateLimiter } from './rate-limit-kv'
import { rateLimit as memoryRateLimit } from './rate-limit'
import type { RateLimitConfig, RateLimitResult } from './rate-limit-kv'

/**
 * Unified rate limiter interface
 */
export interface RateLimiter {
  checkLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult>
  reset?(identifier: string): Promise<void>
  getStatus?(identifier: string, config: RateLimitConfig): Promise<RateLimitResult>
}

/**
 * Memory-based rate limiter wrapper (for development)
 */
class MemoryRateLimiter implements RateLimiter {
  async checkLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    // Wrap synchronous memory rate limiter in Promise
    return Promise.resolve(memoryRateLimit(identifier, config))
  }

  async reset(identifier: string): Promise<void> {
    // Memory rate limiter doesn't expose reset, but we can implement it
    // by just returning - it will expire naturally
    return Promise.resolve()
  }

  async getStatus(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    // For memory limiter, we can't check without incrementing
    // Return optimistic result
    return Promise.resolve({
      success: true,
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
    })
  }
}

/**
 * Get rate limiter instance based on environment
 *
 * @param env - Cloudflare Workers environment bindings
 * @returns RateLimiter instance (KV or Memory)
 */
export function getRateLimiter(env?: { RATE_LIMIT_KV?: KVNamespace }): RateLimiter {
  // Check if KV namespace is available
  if (env?.RATE_LIMIT_KV) {
    return new KVRateLimiter(env.RATE_LIMIT_KV)
  }

  // Fallback to memory-based rate limiter (development)
  return new MemoryRateLimiter()
}

/**
 * Helper function for rate limiting in API routes
 *
 * @param request - The incoming request
 * @param identifier - Rate limit key (e.g., IP address or user ID)
 * @param config - Rate limit configuration
 * @param env - Cloudflare Workers environment bindings
 * @returns Rate limit result
 */
export async function checkRateLimit(
  request: Request,
  identifier: string,
  config: RateLimitConfig,
  env?: { RATE_LIMIT_KV?: KVNamespace }
): Promise<RateLimitResult> {
  const limiter = getRateLimiter(env)
  return limiter.checkLimit(identifier, config)
}

// Re-export types and utilities
export type { RateLimitConfig, RateLimitResult }
export { getClientIp, createRateLimitKey } from './rate-limit-kv'
