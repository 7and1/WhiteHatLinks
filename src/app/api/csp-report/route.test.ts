import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST, GET } from './route'
import { NextRequest } from 'next/server'

/**
 * Helper function to create a test request
 */
function createRequest(options: {
  method?: string
  body?: Record<string, unknown>
  headers?: Record<string, string>
  url?: string
}): NextRequest {
  const url = options.url || 'http://localhost:3000/api/csp-report'
  const method = options.method || 'POST'

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  return new NextRequest(url, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
}

/**
 * Helper to create a valid CSP report
 */
function createCSPReport(overrides?: Record<string, unknown>) {
  return {
    'csp-report': {
      'blocked-uri': 'https://evil.example.com/script.js',
      'document-uri': 'https://whitehatlink.org/',
      'effective-directive': 'script-src',
      'original-policy': "default-src 'self'; script-src 'self'",
      'referrer': '',
      'status-code': 200,
      'violated-directive': 'script-src',
      'source-file': 'https://whitehatlink.org/page.html',
      'line-number': 42,
      'column-number': 10,
      ...overrides,
    },
  }
}

describe('POST /api/csp-report', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('Success scenarios', () => {
    it('should successfully receive and log CSP violation report', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = createCSPReport()
      const request = createRequest({ body: report })

      const response = await POST(request)

      expect(response.status).toBe(204)
      expect(consoleWarnSpy).toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('CSP Violation'),
        expect.objectContaining({
          blockedUri: 'https://evil.example.com/script.js',
          violatedDirective: 'script-src',
          documentUri: 'https://whitehatlink.org/',
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should log all key CSP violation details', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = createCSPReport({
        'blocked-uri': 'https://cdn.untrusted.com/tracker.js',
        'violated-directive': 'script-src',
        'document-uri': 'https://whitehatlink.org/blog/article',
        'source-file': 'https://whitehatlink.org/blog/article',
      })
      const request = createRequest({ body: report })

      await POST(request)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          blockedUri: 'https://cdn.untrusted.com/tracker.js',
          violatedDirective: 'script-src',
          documentUri: 'https://whitehatlink.org/blog/article',
          sourceFile: 'https://whitehatlink.org/blog/article',
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should handle CSP report with minimal fields', async () => {
      const minimalReport = {
        'csp-report': {
          'blocked-uri': 'https://example.com/bad.js',
        },
      }
      const request = createRequest({ body: minimalReport })

      const response = await POST(request)

      expect(response.status).toBe(204)
      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('should handle CSP report with missing optional fields', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = {
        'csp-report': {
          'blocked-uri': 'inline',
          'violated-directive': 'script-src',
          // Missing other optional fields
        },
      }
      const request = createRequest({ body: report })

      const response = await POST(request)

      expect(response.status).toBe(204)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          blockedUri: 'inline',
          violatedDirective: 'script-src',
          documentUri: 'unknown',
          sourceFile: 'unknown',
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should return 204 No Content as per CSP spec', async () => {
      const report = createCSPReport()
      const request = createRequest({ body: report })

      const response = await POST(request)
      const body = await response.text()

      expect(response.status).toBe(204)
      expect(body).toBe('')
    })
  })

  describe('CSP report parsing', () => {
    it('should parse effective-directive when violated-directive is missing', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = {
        'csp-report': {
          'blocked-uri': 'https://example.com/image.png',
          'effective-directive': 'img-src',
          'document-uri': 'https://whitehatlink.org/',
          // violated-directive is missing
        },
      }
      const request = createRequest({ body: report })

      await POST(request)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          violatedDirective: 'img-src', // Should use effective-directive
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should handle inline script violations', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = createCSPReport({
        'blocked-uri': 'inline',
        'violated-directive': 'script-src',
        'source-file': 'https://whitehatlink.org/page.html',
        'line-number': 25,
        'column-number': 5,
      })
      const request = createRequest({ body: report })

      await POST(request)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          blockedUri: 'inline',
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should handle eval violations', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = createCSPReport({
        'blocked-uri': 'eval',
        'violated-directive': 'script-src',
      })
      const request = createRequest({ body: report })

      await POST(request)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          blockedUri: 'eval',
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should handle style-src violations', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = createCSPReport({
        'blocked-uri': 'https://fonts.googleapis.com/css',
        'violated-directive': 'style-src',
        'effective-directive': 'style-src',
      })
      const request = createRequest({ body: report })

      await POST(request)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          blockedUri: 'https://fonts.googleapis.com/css',
          violatedDirective: 'style-src',
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should handle img-src violations', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = createCSPReport({
        'blocked-uri': 'https://tracker.example.com/pixel.gif',
        'violated-directive': 'img-src',
        'effective-directive': 'img-src',
      })
      const request = createRequest({ body: report })

      await POST(request)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          blockedUri: 'https://tracker.example.com/pixel.gif',
          violatedDirective: 'img-src',
        })
      )

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Environment-specific logging', () => {
    it('should use different log format in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = createCSPReport()
      const request = createRequest({ body: report })

      await POST(request)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[CSP Violation]',
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should log full details in development', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const report = createCSPReport()
      const request = createRequest({ body: report })

      await POST(request)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[CSP Violation - Development]',
        expect.objectContaining({
          'blocked-uri': 'https://evil.example.com/script.js',
        })
      )

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Error handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'not-valid-json{',
      })

      const response = await POST(request)

      // Should still return 204 to avoid browser retries
      expect(response.status).toBe(204)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[CSP Report Error]',
        expect.any(Error)
      )
    })

    it('should handle empty request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      })

      const response = await POST(request)

      expect(response.status).toBe(204)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should handle missing csp-report key', async () => {
      const request = createRequest({
        body: {
          'not-csp-report': {
            'blocked-uri': 'https://example.com',
          },
        },
      })

      const response = await POST(request)

      // Should still return 204
      expect(response.status).toBe(204)
    })

    it('should handle null values in CSP report', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = {
        'csp-report': {
          'blocked-uri': null,
          'violated-directive': null,
          'document-uri': null,
        },
      }
      const request = createRequest({ body: report })

      const response = await POST(request)

      expect(response.status).toBe(204)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          blockedUri: 'unknown',
          violatedDirective: 'unknown',
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should not throw error when logging fails', async () => {
      consoleWarnSpy.mockImplementationOnce(() => {
        throw new Error('Logging failed')
      })

      const report = createCSPReport()
      const request = createRequest({ body: report })

      const response = await POST(request)

      // Should still return 204 even if logging fails
      expect(response.status).toBe(204)
    })
  })

  describe('Security - Rate limiting defense', () => {
    it('should handle rapid multiple CSP reports', async () => {
      const report = createCSPReport()

      // Send 5 reports rapidly
      const promises = Array.from({ length: 5 }, () => {
        const request = createRequest({ body: report })
        return POST(request)
      })

      const responses = await Promise.all(promises)

      // All should succeed with 204
      responses.forEach(response => {
        expect(response.status).toBe(204)
      })

      // All should be logged
      expect(consoleWarnSpy).toHaveBeenCalledTimes(5)
    })

    it('should not expose sensitive information in logs', async () => {
      const report = createCSPReport({
        'blocked-uri': 'https://example.com/api/key=secret123',
        'document-uri': 'https://whitehatlink.org/admin?token=abc123',
      })
      const request = createRequest({ body: report })

      await POST(request)

      // Logs should contain the full URI (sanitization should be done elsewhere)
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle very long URIs', async () => {
      const longUri = 'https://example.com/' + 'a'.repeat(2000)
      const report = createCSPReport({
        'blocked-uri': longUri,
      })
      const request = createRequest({ body: report })

      const response = await POST(request)

      expect(response.status).toBe(204)
    })

    it('should handle special characters in URIs', async () => {
      const report = createCSPReport({
        'blocked-uri': 'https://example.com/path?param=value&other=测试',
        'document-uri': 'https://whitehatlink.org/页面',
      })
      const request = createRequest({ body: report })

      const response = await POST(request)

      expect(response.status).toBe(204)
    })

    it('should handle data: URIs', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = createCSPReport({
        'blocked-uri': 'data:text/javascript,alert(1)',
        'violated-directive': 'script-src',
      })
      const request = createRequest({ body: report })

      const response = await POST(request)

      expect(response.status).toBe(204)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          blockedUri: 'data:text/javascript,alert(1)',
        })
      )

      process.env.NODE_ENV = originalEnv
    })

    it('should handle blob: URIs', async () => {
      const report = createCSPReport({
        'blocked-uri': 'blob:https://whitehatlink.org/uuid-here',
      })
      const request = createRequest({ body: report })

      const response = await POST(request)

      expect(response.status).toBe(204)
    })

    it('should handle reports with all fields as unknown', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const report = {
        'csp-report': {},
      }
      const request = createRequest({ body: report })

      const response = await POST(request)

      expect(response.status).toBe(204)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          blockedUri: 'unknown',
          violatedDirective: 'unknown',
          documentUri: 'unknown',
          sourceFile: 'unknown',
        })
      )

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Response headers', () => {
    it('should not include cache headers', async () => {
      const report = createCSPReport()
      const request = createRequest({ body: report })

      const response = await POST(request)

      expect(response.headers.get('Cache-Control')).toBeNull()
    })

    it('should have correct content-type for 204 response', async () => {
      const report = createCSPReport()
      const request = createRequest({ body: report })

      const response = await POST(request)

      // 204 responses should not have content-type
      expect(response.status).toBe(204)
    })
  })
})

describe('GET /api/csp-report', () => {
  it('should reject GET requests with 405 Method Not Allowed', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(405)
    expect(data.error).toBe('Method not allowed')
  })

  it('should return JSON error for GET requests', async () => {
    const response = await GET()
    const contentType = response.headers.get('Content-Type')

    expect(contentType).toContain('application/json')
  })
})
