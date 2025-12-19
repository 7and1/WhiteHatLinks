import { describe, it, expect, beforeEach, vi } from 'vitest'
import { rateLimit, getClientIp, createRateLimitKey, type RateLimitConfig } from './rate-limit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rateLimit', () => {
    it('should allow requests within limit', () => {
      const identifier = 'user-123'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      const result1 = rateLimit(identifier, config)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(4)

      const result2 = rateLimit(identifier, config)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(3)

      const result3 = rateLimit(identifier, config)
      expect(result3.success).toBe(true)
      expect(result3.remaining).toBe(2)
    })

    it('should block requests exceeding limit', () => {
      const identifier = 'user-456'
      const config: RateLimitConfig = { maxRequests: 3, windowMs: 60000 }

      // Make 3 requests (should all succeed)
      const result1 = rateLimit(identifier, config)
      const result2 = rateLimit(identifier, config)
      const result3 = rateLimit(identifier, config)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result3.success).toBe(true)

      // 4th request should be blocked
      const result4 = rateLimit(identifier, config)
      expect(result4.success).toBe(false)
      expect(result4.remaining).toBe(0)

      // 5th request should also be blocked
      const result5 = rateLimit(identifier, config)
      expect(result5.success).toBe(false)
      expect(result5.remaining).toBe(0)
    })

    it('should reset after time window expires', () => {
      vi.useFakeTimers()
      const identifier = 'user-789'
      const config: RateLimitConfig = { maxRequests: 2, windowMs: 1000 } // 1 second window

      // Use up the limit
      const result1 = rateLimit(identifier, config)
      const result2 = rateLimit(identifier, config)
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)

      // Should be blocked now
      const result3 = rateLimit(identifier, config)
      expect(result3.success).toBe(false)

      // Fast forward past the window
      vi.advanceTimersByTime(1001)

      // Should allow new requests
      const result4 = rateLimit(identifier, config)
      expect(result4.success).toBe(true)
      expect(result4.remaining).toBe(1)

      vi.useRealTimers()
    })

    it('should have independent limits for different identifiers', () => {
      const config: RateLimitConfig = { maxRequests: 2, windowMs: 60000 }

      // User A makes 2 requests
      const resultA1 = rateLimit('user-a', config)
      const resultA2 = rateLimit('user-a', config)
      expect(resultA1.success).toBe(true)
      expect(resultA2.success).toBe(true)

      // User A is now limited
      const resultA3 = rateLimit('user-a', config)
      expect(resultA3.success).toBe(false)

      // User B should still be able to make requests
      const resultB1 = rateLimit('user-b', config)
      const resultB2 = rateLimit('user-b', config)
      expect(resultB1.success).toBe(true)
      expect(resultB2.success).toBe(true)
    })

    it('should use default config if not provided', () => {
      const identifier = 'user-default'

      // Default is 5 requests per 60 seconds
      const result1 = rateLimit(identifier)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(4)
    })

    it('should return correct reset time', () => {
      const identifier = 'user-reset-time'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      const beforeTime = Date.now()
      const result = rateLimit(identifier, config)
      const afterTime = Date.now()

      expect(result.resetTime).toBeGreaterThanOrEqual(beforeTime + config.windowMs)
      expect(result.resetTime).toBeLessThanOrEqual(afterTime + config.windowMs)
    })

    it('should maintain same reset time across requests in same window', () => {
      const identifier = 'user-same-reset'
      const config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

      const result1 = rateLimit(identifier, config)
      const result2 = rateLimit(identifier, config)
      const result3 = rateLimit(identifier, config)

      expect(result2.resetTime).toBe(result1.resetTime)
      expect(result3.resetTime).toBe(result1.resetTime)
    })

    it('should handle rapid successive requests correctly', () => {
      const identifier = 'user-rapid'
      const config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }

      // Make 10 rapid requests
      const results = Array.from({ length: 10 }, () => rateLimit(identifier, config))

      // All should succeed
      results.forEach((result, index) => {
        expect(result.success).toBe(true)
        expect(result.remaining).toBe(9 - index)
      })

      // 11th should fail
      const result11 = rateLimit(identifier, config)
      expect(result11.success).toBe(false)
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
          'x-forwarded-for': '203.0.113.4, 192.168.1.1',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('203.0.113.3')
    })

    it('should extract IP from X-Real-IP header', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-real-ip': '203.0.113.5',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('203.0.113.5')
    })

    it('should prefer CF-Connecting-IP over X-Real-IP', () => {
      const request = new Request('https://example.com', {
        headers: {
          'cf-connecting-ip': '203.0.113.6',
          'x-real-ip': '203.0.113.7',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('203.0.113.6')
    })

    it('should prefer X-Forwarded-For over X-Real-IP', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.8',
          'x-real-ip': '203.0.113.9',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('203.0.113.8')
    })

    it('should return unknown-client when no IP headers present', () => {
      const request = new Request('https://example.com')

      const ip = getClientIp(request)
      expect(ip).toBe('unknown-client')
    })

    it('should handle X-Forwarded-For with multiple IPs and extract first', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-forwarded-for': '  203.0.113.10  , 192.168.1.2, 10.0.0.1  ',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('203.0.113.10')
    })

    it('should handle IPv6 addresses', () => {
      const request = new Request('https://example.com', {
        headers: {
          'cf-connecting-ip': '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
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

    it('should create key with unknown-client when no IP headers', () => {
      const request = new Request('https://example.com')

      const key = createRateLimitKey(request, 'contact')
      expect(key).toBe('contact:unknown-client')
    })

    it('should extract IP from various headers', () => {
      const request = new Request('https://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.22, 192.168.1.1',
        },
      })

      const key = createRateLimitKey(request, 'api')
      expect(key).toBe('api:203.0.113.22')
    })

    it('should create different keys for different prefixes with same IP', () => {
      const request = new Request('https://example.com', {
        headers: {
          'cf-connecting-ip': '203.0.113.23',
        },
      })

      const key1 = createRateLimitKey(request, 'inquiry')
      const key2 = createRateLimitKey(request, 'contact')

      expect(key1).toBe('inquiry:203.0.113.23')
      expect(key2).toBe('contact:203.0.113.23')
      expect(key1).not.toBe(key2)
    })
  })

  describe('integration tests', () => {
    it('should rate limit based on request IP and prefix', () => {
      const request1 = new Request('https://example.com', {
        headers: { 'cf-connecting-ip': '203.0.113.30' },
      })
      const request2 = new Request('https://example.com', {
        headers: { 'cf-connecting-ip': '203.0.113.31' },
      })

      const config: RateLimitConfig = { maxRequests: 2, windowMs: 60000 }

      // User 1 makes requests
      const key1 = createRateLimitKey(request1, 'inquiry')
      const result1 = rateLimit(key1, config)
      const result2 = rateLimit(key1, config)
      const result3 = rateLimit(key1, config)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result3.success).toBe(false)

      // User 2 should not be affected
      const key2 = createRateLimitKey(request2, 'inquiry')
      const result4 = rateLimit(key2, config)
      expect(result4.success).toBe(true)
    })

    it('should allow separate limits for different API endpoints', () => {
      const request = new Request('https://example.com', {
        headers: { 'cf-connecting-ip': '203.0.113.32' },
      })

      const config: RateLimitConfig = { maxRequests: 2, windowMs: 60000 }

      // Inquiry endpoint
      const inquiryKey1 = createRateLimitKey(request, 'inquiry')
      rateLimit(inquiryKey1, config)
      rateLimit(inquiryKey1, config)
      const inquiryResult3 = rateLimit(inquiryKey1, config)
      expect(inquiryResult3.success).toBe(false)

      // Contact endpoint should have separate limit
      const contactKey = createRateLimitKey(request, 'contact')
      const contactResult1 = rateLimit(contactKey, config)
      const contactResult2 = rateLimit(contactKey, config)
      expect(contactResult1.success).toBe(true)
      expect(contactResult2.success).toBe(true)
    })
  })
})
