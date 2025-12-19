import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getRateLimiter, checkRateLimit } from './rate-limit-factory'
import type { RateLimitConfig } from './rate-limit-factory'

// Mock KV Namespace
class MockKVNamespace implements KVNamespace {
  private store = new Map<string, { value: string; expiration?: number }>()

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key)
    if (!entry) return null

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

  async getWithMetadata(): Promise<{ value: string | null; metadata: unknown }> {
    return { value: null, metadata: null }
  }

  async list(): Promise<{ keys: { name: string }[] }> {
    return { keys: [] }
  }

  clear() {
    this.store.clear()
  }
}

describe('Rate Limit Factory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRateLimiter', () => {
    it('should return KV rate limiter when KV namespace is provided', () => {
      const mockKV = new MockKVNamespace()
      const env = { RATE_LIMIT_KV: mockKV }

      const limiter = getRateLimiter(env)

      // KV limiter should have these methods
      expect(limiter.checkLimit).toBeDefined()
      expect(limiter.reset).toBeDefined()
      expect(limiter.getStatus).toBeDefined()
    })

    it('should return memory rate limiter when no KV namespace', () => {
      const limiter = getRateLimiter()

      // Memory limiter should have these methods
      expect(limiter.checkLimit).toBeDefined()
      expect(limiter.reset).toBeDefined()
      expect(limiter.getStatus).toBeDefined()
    })

    it('should return memory rate limiter when env is undefined', () => {
      const limiter = getRateLimiter(undefined)

      expect(limiter.checkLimit).toBeDefined()
    })

    it('should return memory rate limiter when env.RATE_LIMIT_KV is undefined', () => {
      const env = { RATE_LIMIT_KV: undefined }
      const limiter = getRateLimiter(env)

      expect(limiter.checkLimit).toBeDefined()
    })
  })

  describe('KV Rate Limiter Integration', () => {
    it('should use KV limiter for rate limiting', async () => {
      const mockKV = new MockKVNamespace()
      const env = { RATE_LIMIT_KV: mockKV }
      const limiter = getRateLimiter(env)

      const config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 }

      // Make requests
      const result1 = await limiter.checkLimit('user-123', config)
      const result2 = await limiter.checkLimit('user-123', config)
      const result3 = await limiter.checkLimit('user-123', config)
      const result4 = await limiter.checkLimit('user-123', config)

      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(2)

      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(1)

      expect(result3.success).toBe(true)
      expect(result3.remaining).toBe(0)

      expect(result4.success).toBe(false)
      expect(result4.remaining).toBe(0)
    })

    it('should support reset operation', async () => {
      const mockKV = new MockKVNamespace()
      const env = { RATE_LIMIT_KV: mockKV }
      const limiter = getRateLimiter(env)

      const config: RateLimitConfig = { maxRequests: 2, windowMs: 60000 }

      // Use up limit
      await limiter.checkLimit('user-456', config)
      await limiter.checkLimit('user-456', config)
      const result1 = await limiter.checkLimit('user-456', config)
      expect(result1.success).toBe(false)

      // Reset
      await limiter.reset?.('user-456')

      // Should work again
      const result2 = await limiter.checkLimit('user-456', config)
      expect(result2.success).toBe(true)
    })

    it('should support getStatus operation', async () => {
      const mockKV = new MockKVNamespace()
      const env = { RATE_LIMIT_KV: mockKV }
      const limiter = getRateLimiter(env)

      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      // Make some requests
      await limiter.checkLimit('user-789', config)
      await limiter.checkLimit('user-789', config)

      // Get status without incrementing
      const status1 = await limiter.getStatus?.('user-789', config)
      expect(status1?.remaining).toBe(3)

      // Verify not incremented
      const status2 = await limiter.getStatus?.('user-789', config)
      expect(status2?.remaining).toBe(3)
    })
  })

  describe('Memory Rate Limiter Integration', () => {
    it('should use memory limiter for rate limiting', async () => {
      const limiter = getRateLimiter()

      const config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 }

      // Make requests with unique identifier
      const testId = `user-memory-${Date.now()}`
      const result1 = await limiter.checkLimit(testId, config)
      const result2 = await limiter.checkLimit(testId, config)
      const result3 = await limiter.checkLimit(testId, config)
      const result4 = await limiter.checkLimit(testId, config)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result3.success).toBe(true)
      expect(result4.success).toBe(false)
    })

    it('should support reset operation (no-op)', async () => {
      const limiter = getRateLimiter()

      // Should not throw
      await expect(limiter.reset?.('user-456')).resolves.toBeUndefined()
    })

    it('should support getStatus operation (optimistic)', async () => {
      const limiter = getRateLimiter()

      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      // Get status
      const status = await limiter.getStatus?.('user-789', config)
      expect(status?.success).toBe(true)
      expect(status?.remaining).toBeGreaterThanOrEqual(0)
    })
  })

  describe('checkRateLimit helper', () => {
    it('should check rate limit with KV when available', async () => {
      const mockKV = new MockKVNamespace()
      const env = { RATE_LIMIT_KV: mockKV }

      const request = new Request('https://example.com', {
        headers: { 'cf-connecting-ip': '203.0.113.1' },
      })

      const config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 }

      const result1 = await checkRateLimit(request, 'api:203.0.113.1', config, env)
      const result2 = await checkRateLimit(request, 'api:203.0.113.1', config, env)
      const result3 = await checkRateLimit(request, 'api:203.0.113.1', config, env)
      const result4 = await checkRateLimit(request, 'api:203.0.113.1', config, env)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result3.success).toBe(true)
      expect(result4.success).toBe(false)
    })

    it('should check rate limit with memory when KV not available', async () => {
      const request = new Request('https://example.com')

      const config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 }

      // Use unique identifier to avoid test interference
      const testId = `user-check-${Date.now()}`
      const result1 = await checkRateLimit(request, testId, config)
      const result2 = await checkRateLimit(request, testId, config)
      const result3 = await checkRateLimit(request, testId, config)
      const result4 = await checkRateLimit(request, testId, config)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result3.success).toBe(true)
      expect(result4.success).toBe(false)
    })

    it('should handle different identifiers independently', async () => {
      const mockKV = new MockKVNamespace()
      const env = { RATE_LIMIT_KV: mockKV }

      const request = new Request('https://example.com')
      const config: RateLimitConfig = { maxRequests: 2, windowMs: 60000 }

      // User A
      await checkRateLimit(request, 'user-a', config, env)
      await checkRateLimit(request, 'user-a', config, env)
      const resultA = await checkRateLimit(request, 'user-a', config, env)
      expect(resultA.success).toBe(false)

      // User B should be independent
      const resultB = await checkRateLimit(request, 'user-b', config, env)
      expect(resultB.success).toBe(true)
    })
  })

  describe('Cross-implementation consistency', () => {
    it('should have consistent behavior between KV and memory', async () => {
      const mockKV = new MockKVNamespace()
      const kvEnv = { RATE_LIMIT_KV: mockKV }

      const kvLimiter = getRateLimiter(kvEnv)
      const memoryLimiter = getRateLimiter()

      const config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 }

      // Test KV limiter
      const kvResult1 = await kvLimiter.checkLimit('user-kv', config)
      const kvResult2 = await kvLimiter.checkLimit('user-kv', config)
      const kvResult3 = await kvLimiter.checkLimit('user-kv', config)
      const kvResult4 = await kvLimiter.checkLimit('user-kv', config)

      // Test memory limiter
      const memResult1 = await memoryLimiter.checkLimit('user-mem', config)
      const memResult2 = await memoryLimiter.checkLimit('user-mem', config)
      const memResult3 = await memoryLimiter.checkLimit('user-mem', config)
      const memResult4 = await memoryLimiter.checkLimit('user-mem', config)

      // Both should have same success pattern
      expect(kvResult1.success).toBe(memResult1.success)
      expect(kvResult2.success).toBe(memResult2.success)
      expect(kvResult3.success).toBe(memResult3.success)
      expect(kvResult4.success).toBe(memResult4.success)

      // Both should block the 4th request
      expect(kvResult4.success).toBe(false)
      expect(memResult4.success).toBe(false)
    })
  })
})
