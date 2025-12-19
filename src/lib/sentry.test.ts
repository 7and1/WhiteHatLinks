import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { captureError, captureMessage, isSentryEnabled } from './sentry'

// Mock fetch globally
global.fetch = vi.fn()

describe('Sentry Integration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Configuration', () => {
    it('should be disabled in development', () => {
      process.env.NODE_ENV = 'development'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://key@host/123'

      expect(isSentryEnabled()).toBe(false)
    })

    it('should be disabled without DSN', () => {
      process.env.NODE_ENV = 'production'
      delete process.env.NEXT_PUBLIC_SENTRY_DSN

      expect(isSentryEnabled()).toBe(false)
    })

    it('should be enabled in production with DSN', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://key@host/123'

      expect(isSentryEnabled()).toBe(true)
    })
  })

  describe('captureError', () => {
    it('should not send to Sentry when disabled', async () => {
      process.env.NODE_ENV = 'development'

      const error = new Error('Test error')
      await captureError(error)

      expect(fetch).not.toHaveBeenCalled()
    })

    it('should send error to Sentry when enabled', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://publickey@sentry.io/123'

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

      const error = new Error('Test error')
      await captureError(error, {
        component: 'TestComponent',
        userId: 'user123',
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      const [url, options] = (fetch as any).mock.calls[0]

      expect(url).toContain('sentry.io')
      expect(options.method).toBe('POST')
      expect(options.headers['Content-Type']).toBe('application/json')
      expect(options.headers['X-Sentry-Auth']).toContain('sentry_key=publickey')

      const body = JSON.parse(options.body)
      expect(body).toHaveProperty('event_id')
      expect(body).toHaveProperty('exception')
      expect(body.exception.values[0].value).toBe('Test error')
    })

    it('should handle string errors', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://publickey@sentry.io/123'

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

      await captureError('String error message')

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should include context in Sentry event', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://publickey@sentry.io/123'

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

      const error = new Error('Test error')
      await captureError(error, {
        component: 'TestComponent',
        userId: 'user123',
        path: '/test',
        method: 'GET',
        tags: {
          feature: 'authentication',
        },
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      const [, options] = (fetch as any).mock.calls[0]
      const body = JSON.parse(options.body)

      expect(body.tags).toMatchObject({
        component: 'TestComponent',
        feature: 'authentication',
      })
      expect(body.user).toMatchObject({
        id: 'user123',
      })
      expect(body.request).toMatchObject({
        url: '/test',
        method: 'GET',
      })
    })

    it('should handle Sentry API errors gracefully', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://publickey@sentry.io/123'

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      const error = new Error('Test error')

      // Should not throw
      await expect(captureError(error)).resolves.not.toThrow()
    })

    it('should handle network errors gracefully', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://publickey@sentry.io/123'

      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      const error = new Error('Test error')

      // Should not throw
      await expect(captureError(error)).resolves.not.toThrow()
    })
  })

  describe('captureMessage', () => {
    it('should not send to Sentry when disabled', async () => {
      process.env.NODE_ENV = 'development'

      await captureMessage('Test message')

      expect(fetch).not.toHaveBeenCalled()
    })

    it('should send message to Sentry when enabled', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://publickey@sentry.io/123'

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

      await captureMessage('Test message', 'info', {
        component: 'TestComponent',
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      const [, options] = (fetch as any).mock.calls[0]
      const body = JSON.parse(options.body)

      expect(body.message.formatted).toBe('Test message')
      expect(body.level).toBe('info')
    })

    it('should support different severity levels', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://publickey@sentry.io/123'

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
      })

      await captureMessage('Fatal message', 'fatal')
      await captureMessage('Error message', 'error')
      await captureMessage('Warning message', 'warning')
      await captureMessage('Info message', 'info')
      await captureMessage('Debug message', 'debug')

      expect(fetch).toHaveBeenCalledTimes(5)
    })
  })

  describe('DSN parsing', () => {
    it('should handle invalid DSN format', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'invalid-dsn'

      const error = new Error('Test error')

      // Should not throw
      await expect(captureError(error)).resolves.not.toThrow()
    })

    it('should parse valid DSN correctly', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://abc123@o12345.ingest.sentry.io/67890'

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

      const error = new Error('Test error')
      await captureError(error)

      expect(fetch).toHaveBeenCalledTimes(1)
      const [url, options] = (fetch as any).mock.calls[0]

      expect(url).toBe('https://o12345.ingest.sentry.io/api/67890/store/')
      expect(options.headers['X-Sentry-Auth']).toContain('sentry_key=abc123')
    })
  })

  describe('Stack trace parsing', () => {
    it('should parse error stack traces', async () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://publickey@sentry.io/123'

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

      const error = new Error('Test error')
      error.stack = `Error: Test error
    at functionName (file.ts:10:5)
    at anotherFunction (another.ts:20:10)`

      await captureError(error)

      expect(fetch).toHaveBeenCalledTimes(1)
      const [, options] = (fetch as any).mock.calls[0]
      const body = JSON.parse(options.body)

      expect(body.exception.values[0].stacktrace).toBeDefined()
      expect(body.exception.values[0].stacktrace.frames.length).toBeGreaterThan(0)
    })
  })
})
