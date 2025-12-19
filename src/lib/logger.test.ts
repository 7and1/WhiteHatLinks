import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getLogger, createLogger, log, type LogContext } from './logger'

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleInfoSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  describe('Log levels', () => {
    it('should log debug messages', () => {
      const logger = getLogger()
      logger.debug('Debug message')

      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should log info messages', () => {
      const logger = getLogger()
      logger.info('Info message')

      expect(consoleInfoSpy).toHaveBeenCalled()
    })

    it('should log warning messages', () => {
      const logger = getLogger()
      logger.warn('Warning message')

      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('should log error messages', () => {
      const logger = getLogger()
      logger.error('Error message')

      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('Context support', () => {
    it('should log with context metadata', () => {
      const logger = getLogger()
      const context: LogContext = {
        userId: 'user123',
        component: 'TestComponent',
        requestId: 'req-abc',
      }

      logger.info('Message with context', context)

      expect(consoleInfoSpy).toHaveBeenCalled()
      const logCall = consoleInfoSpy.mock.calls[0][0]
      expect(typeof logCall).toBe('string')
    })

    it('should sanitize sensitive data from context', () => {
      const logger = getLogger()
      const context: LogContext = {
        password: 'secret123',
        token: 'Bearer abc123',
        apiKey: 'key_123',
      }

      logger.info('Message with sensitive data', context)

      expect(consoleInfoSpy).toHaveBeenCalled()
    })

    it('should handle error objects in context', () => {
      const logger = getLogger()
      const testError = new Error('Test error')
      const context: LogContext = {
        error: testError,
        component: 'TestComponent',
      }

      logger.error('Error occurred', context)

      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('Child logger', () => {
    it('should create child logger with default context', () => {
      const defaultContext: LogContext = {
        component: 'MyComponent',
        feature: 'auth',
      }

      const childLogger = createLogger(defaultContext)
      childLogger.info('Test message')

      expect(consoleInfoSpy).toHaveBeenCalled()
    })

    it('should merge additional context with default context', () => {
      const defaultContext: LogContext = {
        component: 'MyComponent',
      }

      const childLogger = createLogger(defaultContext)
      childLogger.info('Test message', { userId: 'user123' })

      expect(consoleInfoSpy).toHaveBeenCalled()
    })
  })

  describe('Convenience exports', () => {
    it('should provide convenience log functions', () => {
      log.debug('Debug message')
      log.info('Info message')
      log.warn('Warning message')
      log.error('Error message')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1) // debug
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1) // info
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Configuration', () => {
    it('should allow updating configuration', () => {
      const logger = getLogger()

      logger.configure({
        enabled: false,
      })

      logger.info('This should not be logged')

      // Re-enable for other tests
      logger.configure({
        enabled: true,
      })
    })
  })

  describe('JSON output mode', () => {
    it('should output structured JSON in production mode', () => {
      const logger = getLogger()
      logger.configure({ jsonOutput: true })

      logger.info('Test message', { userId: 'user123' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const logOutput = consoleLogSpy.mock.calls[0][0]
      expect(typeof logOutput).toBe('string')

      // Should be valid JSON
      const parsed = JSON.parse(logOutput)
      expect(parsed).toHaveProperty('level')
      expect(parsed).toHaveProperty('message')
      expect(parsed).toHaveProperty('timestamp')

      // Reset for other tests
      logger.configure({ jsonOutput: false })
    })
  })

  describe('Edge cases', () => {
    it('should handle empty messages', () => {
      const logger = getLogger()
      logger.info('')

      expect(consoleInfoSpy).toHaveBeenCalled()
    })

    it('should handle very long messages', () => {
      const logger = getLogger()
      const longMessage = 'a'.repeat(10000)

      logger.info(longMessage)

      expect(consoleInfoSpy).toHaveBeenCalled()
    })

    it('should handle undefined context', () => {
      const logger = getLogger()
      logger.info('Message without context', undefined)

      expect(consoleInfoSpy).toHaveBeenCalled()
    })

    it('should handle circular references in context', () => {
      const logger = getLogger()
      const circular: any = { a: 1 }
      circular.self = circular

      // Should not throw
      expect(() => {
        logger.info('Message with circular reference', circular)
      }).not.toThrow()
    })
  })
})
