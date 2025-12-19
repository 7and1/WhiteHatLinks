import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  categorizeError,
  determineErrorSeverity,
  createStructuredError,
  logError,
  trackError,
  getUserFriendlyErrorMessage,
  getErrorDetails,
  shouldReportError,
  ErrorCategory,
  ErrorSeverity,
} from './error-tracking'

describe('Error Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('categorizeError', () => {
    it('should categorize network errors', () => {
      const errors = [
        new Error('fetch failed'),
        new Error('network connection lost'),
        new Error('Request timeout'),
        new Error('connection refused'),
      ]

      errors.forEach((error) => {
        expect(categorizeError(error)).toBe(ErrorCategory.NETWORK)
      })
    })

    it('should categorize API errors', () => {
      const errors = [
        new Error('API endpoint not found'),
        new Error('invalid response from server'),
        new Error('status code 500'),
      ]

      errors.forEach((error) => {
        expect(categorizeError(error)).toBe(ErrorCategory.API)
      })
    })

    it('should categorize authentication errors', () => {
      const errors = [
        new Error('authentication failed'),
        new Error('invalid token'),
        new Error('unauthorized access'),
        new Error('login required'),
      ]

      errors.forEach((error) => {
        expect(categorizeError(error)).toBe(ErrorCategory.AUTHENTICATION)
      })
    })

    it('should categorize authorization errors', () => {
      const errors = [
        new Error('forbidden resource'),
        new Error('insufficient permissions'),
      ]

      errors.forEach((error) => {
        expect(categorizeError(error)).toBe(ErrorCategory.AUTHORIZATION)
      })
    })

    it('should categorize not found errors', () => {
      const errors = [
        new Error('resource not found'),
        new Error('404 page'),
      ]

      errors.forEach((error) => {
        expect(categorizeError(error)).toBe(ErrorCategory.NOT_FOUND)
      })
    })

    it('should categorize database errors', () => {
      const errors = [
        new Error('database error occurred'),
        new Error('SQL query syntax error'),
        new Error('D1 execution error'),
      ]

      errors.forEach((error) => {
        expect(categorizeError(error)).toBe(ErrorCategory.DATABASE)
      })
    })

    it('should categorize validation errors', () => {
      const errors = [
        new Error('invalid email format'),
        new Error('validation failed'),
        new Error('required field missing'),
      ]

      errors.forEach((error) => {
        expect(categorizeError(error)).toBe(ErrorCategory.VALIDATION)
      })
    })

    it('should categorize render errors', () => {
      const errors = [
        new Error('React render error'),
        new Error('hydration mismatch'),
      ]

      errors.forEach((error) => {
        expect(categorizeError(error)).toBe(ErrorCategory.RENDER)
      })
    })

    it('should categorize unknown errors', () => {
      const error = new Error('something completely unexpected')
      expect(categorizeError(error)).toBe(ErrorCategory.UNKNOWN)
    })
  })

  describe('determineErrorSeverity', () => {
    it('should return CRITICAL for database errors', () => {
      const error = new Error('database connection failed')
      const category = ErrorCategory.DATABASE
      expect(determineErrorSeverity(error, category)).toBe(ErrorSeverity.CRITICAL)
    })

    it('should return CRITICAL for authentication errors', () => {
      const error = new Error('authentication failed')
      const category = ErrorCategory.AUTHENTICATION
      expect(determineErrorSeverity(error, category)).toBe(ErrorSeverity.CRITICAL)
    })

    it('should return CRITICAL for fatal errors', () => {
      const error = new Error('fatal crash detected')
      const category = ErrorCategory.UNKNOWN
      expect(determineErrorSeverity(error, category)).toBe(ErrorSeverity.CRITICAL)
    })

    it('should return HIGH for API errors', () => {
      const error = new Error('API error')
      const category = ErrorCategory.API
      expect(determineErrorSeverity(error, category)).toBe(ErrorSeverity.HIGH)
    })

    it('should return HIGH for authorization errors', () => {
      const error = new Error('forbidden')
      const category = ErrorCategory.AUTHORIZATION
      expect(determineErrorSeverity(error, category)).toBe(ErrorSeverity.HIGH)
    })

    it('should return HIGH for render errors', () => {
      const error = new Error('render failed')
      const category = ErrorCategory.RENDER
      expect(determineErrorSeverity(error, category)).toBe(ErrorSeverity.HIGH)
    })

    it('should return MEDIUM for network errors', () => {
      const error = new Error('network error')
      const category = ErrorCategory.NETWORK
      expect(determineErrorSeverity(error, category)).toBe(ErrorSeverity.MEDIUM)
    })

    it('should return MEDIUM for not found errors', () => {
      const error = new Error('not found')
      const category = ErrorCategory.NOT_FOUND
      expect(determineErrorSeverity(error, category)).toBe(ErrorSeverity.MEDIUM)
    })

    it('should return LOW for validation errors', () => {
      const error = new Error('validation failed')
      const category = ErrorCategory.VALIDATION
      expect(determineErrorSeverity(error, category)).toBe(ErrorSeverity.LOW)
    })
  })

  describe('createStructuredError', () => {
    it('should create structured error with correct metadata', () => {
      const error = new Error('Test error')
      const structuredError = createStructuredError(error)

      expect(structuredError.message).toBe('Test error')
      expect(structuredError.name).toBe('Error')
      expect(structuredError.metadata.category).toBe(ErrorCategory.UNKNOWN)
      expect(structuredError.metadata.severity).toBe(ErrorSeverity.LOW)
      expect(structuredError.metadata.timestamp).toBeDefined()
      expect(typeof structuredError.metadata.timestamp).toBe('string')
    })

    it('should include additional metadata', () => {
      const error = new Error('Test error')
      const additionalMetadata = {
        userId: 'user-123',
        componentStack: 'Component stack trace',
      }

      const structuredError = createStructuredError(error, additionalMetadata)

      expect(structuredError.metadata.userId).toBe('user-123')
      expect(structuredError.metadata.componentStack).toBe('Component stack trace')
    })

    it('should categorize and determine severity correctly', () => {
      const error = new Error('database query failed')
      const structuredError = createStructuredError(error)

      expect(structuredError.metadata.category).toBe(ErrorCategory.DATABASE)
      expect(structuredError.metadata.severity).toBe(ErrorSeverity.CRITICAL)
    })
  })

  describe('logError', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>
    let consoleInfoSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleErrorSpy.mockRestore()
      consoleWarnSpy.mockRestore()
      consoleInfoSpy.mockRestore()
    })

    it('should use console.error for CRITICAL severity', () => {
      const error = new Error('database error')
      const structuredError = createStructuredError(error)

      logError(structuredError)

      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should use console.error for HIGH severity', () => {
      const error = new Error('API error')
      const structuredError = createStructuredError(error)

      logError(structuredError)

      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should use console.warn for MEDIUM severity', () => {
      const error = new Error('network error')
      const structuredError = createStructuredError(error)

      logError(structuredError)

      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('should use console.info for LOW severity', () => {
      const error = new Error('validation error')
      const structuredError = createStructuredError(error)

      logError(structuredError)

      expect(consoleInfoSpy).toHaveBeenCalled()
    })
  })

  describe('trackError', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>
    let consoleInfoSpy: ReturnType<typeof vi.spyOn>
    const originalNodeEnv = process.env.NODE_ENV

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleErrorSpy.mockRestore()
      consoleInfoSpy.mockRestore()
      process.env.NODE_ENV = originalNodeEnv
    })

    it('should track error and log it', () => {
      const error = new Error('Test error')

      trackError(error)

      // Should log with console.info (LOW severity for UNKNOWN category)
      expect(consoleInfoSpy).toHaveBeenCalled()
    })

    it('should include additional metadata when tracking', () => {
      const error = new Error('Test error')
      const additionalMetadata = { userId: 'user-123' }

      trackError(error, additionalMetadata)

      // Should log with console.info (LOW severity for UNKNOWN category)
      expect(consoleInfoSpy).toHaveBeenCalled()
    })

    it('should store errors in sessionStorage in development', () => {
      const originalNodeEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      // Mock sessionStorage
      const mockGetItem = vi.fn().mockReturnValue('[]')
      const mockSetItem = vi.fn()

      // Define sessionStorage on global object
      Object.defineProperty(global, 'sessionStorage', {
        value: {
          getItem: mockGetItem,
          setItem: mockSetItem,
        },
        writable: true,
        configurable: true,
      })

      const error = new Error('Test error')
      trackError(error)

      expect(mockSetItem).toHaveBeenCalledWith(
        'app_errors',
        expect.any(String)
      )

      // Cleanup
      process.env.NODE_ENV = originalNodeEnv
    })
  })

  describe('getUserFriendlyErrorMessage', () => {
    it('should return friendly message for network errors', () => {
      const message = getUserFriendlyErrorMessage(ErrorCategory.NETWORK)
      expect(message).toContain('Network connection')
      expect(message).toContain('internet connection')
    })

    it('should return friendly message for API errors', () => {
      const message = getUserFriendlyErrorMessage(ErrorCategory.API)
      expect(message).toContain('Service temporarily unavailable')
    })

    it('should return friendly message for authentication errors', () => {
      const message = getUserFriendlyErrorMessage(ErrorCategory.AUTHENTICATION)
      expect(message).toContain('Authentication failed')
    })

    it('should return friendly message for authorization errors', () => {
      const message = getUserFriendlyErrorMessage(ErrorCategory.AUTHORIZATION)
      expect(message).toContain('permission')
    })

    it('should return friendly message for not found errors', () => {
      const message = getUserFriendlyErrorMessage(ErrorCategory.NOT_FOUND)
      expect(message).toContain('not found')
    })

    it('should return friendly message for database errors', () => {
      const message = getUserFriendlyErrorMessage(ErrorCategory.DATABASE)
      expect(message).toContain('Database error')
    })

    it('should return friendly message for validation errors', () => {
      const message = getUserFriendlyErrorMessage(ErrorCategory.VALIDATION)
      expect(message).toContain('Invalid input')
    })

    it('should return friendly message for render errors', () => {
      const message = getUserFriendlyErrorMessage(ErrorCategory.RENDER)
      expect(message).toContain('Display error')
    })

    it('should return friendly message for unknown errors', () => {
      const message = getUserFriendlyErrorMessage(ErrorCategory.UNKNOWN)
      expect(message).toContain('unexpected error')
    })
  })

  describe('getErrorDetails', () => {
    const originalNodeEnv = process.env.NODE_ENV

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv
    })

    it('should return full details in development mode', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Test error')
      error.stack = 'Error: Test error\n  at line 1'

      const details = getErrorDetails(error)

      expect(details).toContain('Test error')
      expect(details).toContain('at line 1')
    })

    it('should return only message in production mode', () => {
      process.env.NODE_ENV = 'production'
      const error = new Error('Test error')
      error.stack = 'Error: Test error\n  at line 1'

      const details = getErrorDetails(error)

      expect(details).toBe('Test error')
      expect(details).not.toContain('at line 1')
    })

    it('should handle errors without stack trace', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Test error')
      error.stack = undefined

      const details = getErrorDetails(error)

      expect(details).toContain('Test error')
      expect(details).toContain('No stack trace available')
    })
  })

  describe('shouldReportError', () => {
    it('should not report validation errors', () => {
      const error = new Error('validation error')
      const category = ErrorCategory.VALIDATION

      expect(shouldReportError(error, category)).toBe(false)
    })

    it('should not report not found errors', () => {
      const error = new Error('not found')
      const category = ErrorCategory.NOT_FOUND

      expect(shouldReportError(error, category)).toBe(false)
    })

    it('should not report client-side network errors', () => {
      global.window = {} as any
      const error = new Error('network error')
      const category = ErrorCategory.NETWORK

      expect(shouldReportError(error, category)).toBe(false)
    })

    it('should report database errors', () => {
      const error = new Error('database error')
      const category = ErrorCategory.DATABASE

      expect(shouldReportError(error, category)).toBe(true)
    })

    it('should report API errors', () => {
      const error = new Error('API error')
      const category = ErrorCategory.API

      expect(shouldReportError(error, category)).toBe(true)
    })

    it('should report authentication errors', () => {
      const error = new Error('authentication error')
      const category = ErrorCategory.AUTHENTICATION

      expect(shouldReportError(error, category)).toBe(true)
    })

    it('should report render errors', () => {
      const error = new Error('render error')
      const category = ErrorCategory.RENDER

      expect(shouldReportError(error, category)).toBe(true)
    })
  })
})
