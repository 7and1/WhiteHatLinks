import { describe, it, expect, beforeEach, vi } from 'vitest'
import { KVRateLimiter, getClientIp, createRateLimitKey } from './rate-limit-kv'
import type { RateLimitConfig } from './rate-limit-kv'

// Mock KV Namespace
class MockKVNamespace implements KVNamespace {
  private store = new Map<string, { value: string; expiration?: number }>()

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key)
    if (!entry) return null

    // Check expiration
    if (entry.expiration && entry.expiration < Date.now()) {
      this.store.delete(key)
      return null
    }

    return entry.value
  }

  async put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
    const expiration = options?.expirationTtl ? Date.now() + options.expirationTtl * 1000 : undefined
    this.store.set(key, { value, expiration })
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  // Required methods for KVNamespace interface (not used in tests)
  async getWithMetadata(): Promise<{ value: string | null; metadata: unknown }> {
    return { value: null, metadata: null }
  }

  async list(): Promise<{ keys: { name: string }[] }> {
    return { keys: [] }
  }

  // Helper method for testing
  clear() {
    this.store.clear()
  }
}

describe('KVRateLimiter', () => {
  let mockKV: MockKVNamespace
  let rateLimiter: KVRateLimiter

  beforeEach(() => {
    mockKV = new MockKVNamespace()
    rateLimiter = new KVRateLimiter(mockKV)
    vi.clearAllMocks()
  })

  describe('checkLimit', () => {
    it('should allow requests within limit', async () => {
      const identifier = 'user-123'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      const result1 = await rateLimiter.checkLimit(identifier, config)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(4)

      const result2 = await rateLimiter.checkLimit(identifier, config)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(3)

      const result3 = await rateLimiter.checkLimit(identifier, config)
      expect(result3.success).toBe(true)
      expect(result3.remaining).toBe(2)
    })

    it('should block requests exceeding limit', async () => {
      const identifier = 'user-456'
      const config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 }

      // Make 3 requests (should all succeed)
      const result1 = await rateLimiter.checkLimit(identifier, config)
      const result2 = await rateLimiter.checkLimit(identifier, config)
      const result3 = await rateLimiter.checkLimit(identifier, config)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result3.success).toBe(true)

      // 4th request should be blocked
      const result4 = await rateLimiter.checkLimit(identifier, config)
      expect(result4.success).toBe(false)
      expect(result4.remaining).toBe(0)

      // 5th request should also be blocked
      const result5 = await rateLimiter.checkLimit(identifier, config)
      expect(result5.success).toBe(false)
      expect(result5.remaining).toBe(0)
    })

    it('should reset after time window expires', async () => {
      vi.useFakeTimers()
      const identifier = 'user-789'
      const config: RateLimitConfig = { maxRequests: 2, windowMs: 1000 } // 1 second window

      // Use up the limit
      const result1 = await rateLimiter.checkLimit(identifier, config)
      const result2 = await rateLimiter.checkLimit(identifier, config)
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)

      // Should be blocked now
      const result3 = await rateLimiter.checkLimit(identifier, config)
      expect(result3.success).toBe(false)

      // Fast forward past the window
      vi.advanceTimersByTime(1001)

      // Should allow new requests
      const result4 = await rateLimiter.checkLimit(identifier, config)
      expect(result4.success).toBe(true)
      expect(result4.remaining).toBe(1)

      vi.useRealTimers()
    })

    it('should have independent limits for different identifiers', async () => {
      const config: RateLimitConfig = { maxRequests: 2, windowMs: 60000 }

      // User A makes 2 requests
      const resultA1 = await rateLimiter.checkLimit('user-a', config)
      const resultA2 = await rateLimiter.checkLimit('user-a', config)
      expect(resultA1.success).toBe(true)
      expect(resultA2.success).toBe(true)

      // User A is now limited
      const resultA3 = await rateLimiter.checkLimit('user-a', config)
      expect(resultA3.success).toBe(false)

      // User B should still be able to make requests
      const resultB1 = await rateLimiter.checkLimit('user-b', config)
      const resultB2 = await rateLimiter.checkLimit('user-b', config)
      expect(resultB1.success).toBe(true)
      expect(resultB2.success).toBe(true)
    })

    it('should return correct reset time', async () => {
      const identifier = 'user-reset-time'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      const beforeTime = Date.now()
      const result = await rateLimiter.checkLimit(identifier, config)
      const afterTime = Date.now()

      expect(result.resetTime).toBeGreaterThanOrEqual(beforeTime + config.windowMs)
      expect(result.resetTime).toBeLessThanOrEqual(afterTime + config.windowMs + 100) // 100ms tolerance
    })

    it('should maintain same reset time across requests in same window', async () => {
      const identifier = 'user-same-reset'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      const result1 = await rateLimiter.checkLimit(identifier, config)
      const result2 = await rateLimiter.checkLimit(identifier, config)
      const result3 = await rateLimiter.checkLimit(identifier, config)

      expect(result2.resetTime).toBe(result1.resetTime)
      expect(result3.resetTime).toBe(result1.resetTime)
    })

    it('should handle rapid successive requests correctly', async () => {
      const identifier = 'user-rapid'
      const config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }

      // Make 10 rapid requests sequentially to avoid race conditions in mock KV
      const results = []
      for (let i = 0; i < 10; i++) {
        results.push(await rateLimiter.checkLimit(identifier, config))
      }

      // All should succeed
      const successCount = results.filter((r) => r.success).length
      expect(successCount).toBe(10)

      // Next request should fail
      const result11 = await rateLimiter.checkLimit(identifier, config)
      expect(result11.success).toBe(false)
    })

    it('should handle KV errors gracefully (fail open)', async () => {
      const identifier = 'user-error'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      // Mock KV error
      vi.spyOn(mockKV, 'get').mockRejectedValueOnce(new Error('KV unavailable'))

      // Should allow request despite error
      const result = await rateLimiter.checkLimit(identifier, config)
      expect(result.success).toBe(true)
    })

    it('should handle invalid JSON in KV gracefully', async () => {
      const identifier = 'user-invalid-json'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      // Put invalid JSON
      await mockKV.put('ratelimit:user-invalid-json', 'invalid json{')

      // Should treat as new window
      const result = await rateLimiter.checkLimit(identifier, config)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
    })
  })

  describe('reset', () => {
    it('should reset rate limit for identifier', async () => {
      const identifier = 'user-reset'
      const config: RateLimitConfig = { maxRequests: 2, windowMs: 60000 }

      // Use up the limit
      await rateLimiter.checkLimit(identifier, config)
      await rateLimiter.checkLimit(identifier, config)
      const result1 = await rateLimiter.checkLimit(identifier, config)
      expect(result1.success).toBe(false)

      // Reset
      await rateLimiter.reset(identifier)

      // Should allow requests again
      const result2 = await rateLimiter.checkLimit(identifier, config)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(1)
    })
  })

  describe('getStatus', () => {
    it('should get status without incrementing counter', async () => {
      const identifier = 'user-status'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      // Make 2 requests
      await rateLimiter.checkLimit(identifier, config)
      await rateLimiter.checkLimit(identifier, config)

      // Check status (should not increment)
      const status1 = await rateLimiter.getStatus(identifier, config)
      expect(status1.remaining).toBe(3)

      // Verify counter wasn't incremented
      const status2 = await rateLimiter.getStatus(identifier, config)
      expect(status2.remaining).toBe(3)
    })

    it('should return full quota for new identifier', async () => {
      const identifier = 'user-new'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      const status = await rateLimiter.getStatus(identifier, config)
      expect(status.success).toBe(true)
      expect(status.remaining).toBe(5)
    })

    it('should handle expired window correctly', async () => {
      vi.useFakeTimers()
      const identifier = 'user-expired'
      const config: RateLimitConfig = { maxRequests: 3, windowMs: 1000 }

      // Use up limit
      await rateLimiter.checkLimit(identifier, config)
      await rateLimiter.checkLimit(identifier, config)
      await rateLimiter.checkLimit(identifier, config)

      // Check status (should show 0 remaining)
      const status1 = await rateLimiter.getStatus(identifier, config)
      expect(status1.remaining).toBe(0)

      // Fast forward past window
      vi.advanceTimersByTime(1001)

      // Should show full quota
      const status2 = await rateLimiter.getStatus(identifier, config)
      expect(status2.remaining).toBe(3)

      vi.useRealTimers()
    })

    it('should handle KV errors gracefully', async () => {
      const identifier = 'user-status-error'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      // Mock KV error
      vi.spyOn(mockKV, 'get').mockRejectedValueOnce(new Error('KV unavailable'))

      // Should return optimistic result
      const status = await rateLimiter.getStatus(identifier, config)
      expect(status.success).toBe(true)
      expect(status.remaining).toBe(5)
    })
  })

  describe('getClientIp', () => {
    it('should extract IP from CF-Connecting-IP header', () => {
      const request = new Request('https://example.com', {
        headers: {
          'cf-connecting-ip': '203.0.113.1',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('203.0.113.1')
    })

    it('should extract IP from X-Forwarded-For header', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.2, 192.168.1.1',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('203.0.113.2')
    })

    it('should prefer CF-Connecting-IP over X-Forwarded-For', () => {
      const request = new Request('https://example.com', {
        headers: {
          'cf-connecting-ip': '203.0.113.3',
          'x-forwarded-for': '203.0.113.4',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('203.0.113.3')
    })

    it('should return unknown-client when no IP headers present', () => {
      const request = new Request('https://example.com')

      const ip = getClientIp(request)
      expect(ip).toBe('unknown-client')
    })
  })

  describe('createRateLimitKey', () => {
    it('should create key with default prefix', () => {
      const request = new Request('https://example.com', {
        headers: {
          'cf-connecting-ip': '203.0.113.20',
        },
      })

      const key = createRateLimitKey(request)
      expect(key).toBe('default:203.0.113.20')
    })

    it('should create key with custom prefix', () => {
      const request = new Request('https://example.com', {
        headers: {
          'cf-connecting-ip': '203.0.113.21',
        },
      })

      const key = createRateLimitKey(request, 'api-inquiry')
      expect(key).toBe('api-inquiry:203.0.113.21')
    })
  })
})
