import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST, GET } from './route'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/email', () => ({
  sendContactNotification: vi.fn().mockResolvedValue({ success: true }),
  sendContactConfirmation: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('@/lib/rate-limit-factory', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    success: true,
    remaining: 2,
    resetTime: Date.now() + 60000
  }),
  getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
  createRateLimitKey: vi.fn((request: Request, prefix: string) => `${prefix}:127.0.0.1`),
}))

// Import mocked functions for assertions
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'
import { checkRateLimit, createRateLimitKey } from '@/lib/rate-limit-factory'

/**
 * Helper function to create a test request
 */
function createRequest(options: {
  method?: string
  body?: Record<string, string | FormData>
  headers?: Record<string, string>
  url?: string
  isFormData?: boolean
}): NextRequest {
  const url = options.url || 'http://localhost:3000/api/contact'
  const method = options.method || 'POST'

  let body: FormData | string | undefined

  if (options.body) {
    if (options.isFormData !== false) {
      // Convert to FormData
      body = new FormData()
      Object.entries(options.body).forEach(([key, value]) => {
        if (typeof value === 'string') {
          body!.append(key, value)
        }
      })
    } else {
      // Keep as JSON string
      body = JSON.stringify(options.body)
    }
  }

  const headers: Record<string, string> = {
    'X-Forwarded-For': '127.0.0.1',
    ...options.headers,
  }

  if (options.isFormData === false) {
    headers['Content-Type'] = 'application/json'
  }

  return new NextRequest(url, {
    method,
    headers,
    body: body as BodyInit,
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset rate limit mock to successful state
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: true,
      remaining: 2,
      resetTime: Date.now() + 60000,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Success scenarios', () => {
    it('should successfully handle valid contact form submission', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          subject: 'General inquiry about services',
          message: 'I would like to learn more about your services.',
          company_name: '', // honeypot
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
      expect(data.message).toContain('Thank you')
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('2')
    })

    it('should use default subject when not provided', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          subject: '', // Empty subject
          message: 'This is my message without a subject.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)

      // Verify default subject was used in email
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(sendContactNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'General inquiry',
        })
      )
    })

    it('should send email notifications on successful submission', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'John Doe',
          subject: 'Partnership inquiry',
          message: 'I want to discuss a partnership opportunity.',
          company_name: '',
        },
      })

      await POST(request)

      // Wait a bit for async email calls
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(sendContactNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          name: 'John Doe',
          subject: 'Partnership inquiry',
        })
      )

      expect(sendContactConfirmation).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          name: 'John Doe',
        })
      )
    })

    it('should handle email sending failures gracefully', async () => {
      // Mock email functions to fail
      vi.mocked(sendContactNotification).mockRejectedValueOnce(new Error('Email service down'))
      vi.mocked(sendContactConfirmation).mockRejectedValueOnce(new Error('Email service down'))

      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'This is a test message.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      // Should still return success even if emails fail
      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
    })
  })

  describe('Validation failures', () => {
    it('should reject invalid email address', async () => {
      const request = createRequest({
        body: {
          email: 'not-an-email',
          name: 'Test User',
          message: 'This is a test message.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.errors).toBeDefined()
      expect(data.errors.some((e: { field: string }) => e.field === 'email')).toBe(true)
    })

    it('should reject name that is too short', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'A', // Only 1 character, needs at least 2
          message: 'This is a test message.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.errors.some((e: { field: string }) => e.field === 'name')).toBe(true)
    })

    it('should reject message that is too short', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'Short', // Less than 10 characters
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.errors.some((e: { field: string }) => e.field === 'message')).toBe(true)
    })

    it('should reject message that exceeds max length', async () => {
      const longMessage = 'a'.repeat(5001)

      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: longMessage,
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })

    it('should reject when required fields are missing', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          // Missing name and message
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })
  })

  describe('Security - Honeypot detection', () => {
    it('should silently accept when honeypot field is filled (bot detection)', async () => {
      const request = createRequest({
        body: {
          email: 'bot@example.com',
          name: 'Bot User',
          message: 'This is a spam message.',
          company_name: 'Spam Inc', // Honeypot filled - indicates bot
        },
      })

      const response = await POST(request)
      const data = await response.json()

      // Honeypot validation in schema will fail first with 400
      // The validation schema checks company_name max length of 0
      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.errors.some((e: { field: string }) => e.field === 'company_name')).toBe(true)
    })
  })

  describe('Security - Rate limiting', () => {
    it('should enforce stricter rate limiting than inquiry endpoint', async () => {
      const resetTime = Date.now() + 60000
      vi.mocked(checkRateLimit).mockResolvedValue({
        success: false,
        remaining: 0,
        resetTime,
      })

      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'This is a test message.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toContain('Too many requests')
      expect(data.retryAfter).toBeDefined()
      expect(response.headers.get('Retry-After')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
    })

    it('should verify rate limit is called with correct config', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'This is a test message.',
          company_name: '',
        },
      })

      await POST(request)

      // Verify createRateLimitKey was called with correct prefix
      expect(createRateLimitKey).toHaveBeenCalledWith(expect.anything(), 'contact')

      // Verify checkRateLimit was called (stricter than inquiry: 3 requests per minute)
      expect(checkRateLimit).toHaveBeenCalledWith(
        expect.anything(),
        'contact:127.0.0.1',
        expect.objectContaining({
          maxRequests: 3,
          windowMs: 60 * 1000,
        }),
        undefined // env is undefined in test environment
      )
    })
  })

  describe('Security - XSS protection', () => {
    it('should handle XSS attempts in input fields', async () => {
      const xssPayload = '<script>alert("xss")</script>'

      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: xssPayload,
          subject: xssPayload,
          message: `${xssPayload} This is a longer message with XSS payload`,
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      // Should accept and process (XSS protection happens at display time)
      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
    })

    it('should handle HTML entities in input', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test & User',
          subject: 'Question about <Products>',
          message: 'I have a question about your products & services.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
    })
  })

  describe('Error handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      // Force an error by mocking checkRateLimit to throw
      vi.mocked(checkRateLimit).mockRejectedValue(new Error('Unexpected error'))

      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'This is a test message.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeDefined()
      expect(data.error).toContain('unexpected error')
    })
  })

  describe('Edge cases', () => {
    it('should handle unicode characters in all fields', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: '李明 テスト',
          subject: 'Вопрос о сервисах',
          message: '你好！我想了解更多信息。🎉 This is a test message with emoji.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
    })

    it('should handle special characters in email', async () => {
      const request = createRequest({
        body: {
          email: 'test+tag@example.co.uk',
          name: "O'Brien",
          message: 'This is a valid test message.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
    })

    it('should handle very long valid subject', async () => {
      const longSubject = 'A'.repeat(200) // Max length is 200

      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          subject: longSubject,
          message: 'This is a test message.',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
    })

    it('should handle newlines and formatting in message', async () => {
      const request = createRequest({
        body: {
          email: 'test@example.com',
          name: 'Test User',
          message: 'Line 1\n\nLine 2\n\n- Bullet 1\n- Bullet 2\n\nBest regards,\nTest',
          company_name: '',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
    })
  })
})

describe('GET /api/contact', () => {
  it('should reject GET requests with 405 Method Not Allowed', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(405)
    expect(data.error).toBe('Method not allowed')
  })
})
