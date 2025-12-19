/**
 * Error Tracking and Monitoring Utilities
 * Provides structured error logging, categorization, and Sentry integration
 */

import { logger, type LogContext } from './logger'
import { captureError, captureMessage, type ErrorContext } from './sentry'

export enum ErrorCategory {
  NETWORK = 'NETWORK',
  API = 'API',
  RENDER = 'RENDER',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ErrorMetadata {
  category: ErrorCategory
  severity: ErrorSeverity
  url?: string
  userId?: string
  userAgent?: string
  timestamp: string
  componentStack?: string
  digest?: string
  [key: string]: unknown
}

export interface StructuredError {
  message: string
  stack?: string
  name: string
  metadata: ErrorMetadata
}

/**
 * Categorize error based on error message and type
 */
export function categorizeError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase()
  const errorName = error.name.toLowerCase()

  // Network errors
  if (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('connection') ||
    errorName.includes('networkerror')
  ) {
    return ErrorCategory.NETWORK
  }

  // API errors
  if (
    message.includes('api') ||
    message.includes('endpoint') ||
    message.includes('response') ||
    message.includes('status code')
  ) {
    return ErrorCategory.API
  }

  // Authentication errors
  if (
    message.includes('auth') ||
    message.includes('login') ||
    message.includes('token') ||
    message.includes('unauthorized')
  ) {
    return ErrorCategory.AUTHENTICATION
  }

  // Authorization errors
  if (message.includes('forbidden') || message.includes('permission')) {
    return ErrorCategory.AUTHORIZATION
  }

  // Not Found errors
  if (message.includes('not found') || message.includes('404')) {
    return ErrorCategory.NOT_FOUND
  }

  // Database errors
  if (
    message.includes('database') ||
    message.includes('query') ||
    message.includes('sql') ||
    message.includes('d1')
  ) {
    return ErrorCategory.DATABASE
  }

  // Validation errors
  if (message.includes('invalid') || message.includes('validation') || message.includes('required')) {
    return ErrorCategory.VALIDATION
  }

  // React render errors
  if (
    message.includes('render') ||
    message.includes('hydration') ||
    message.includes('react') ||
    errorName.includes('invariant')
  ) {
    return ErrorCategory.RENDER
  }

  return ErrorCategory.UNKNOWN
}

/**
 * Determine error severity based on category and context
 */
export function determineErrorSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
  // Critical errors that require immediate attention
  if (
    category === ErrorCategory.DATABASE ||
    category === ErrorCategory.AUTHENTICATION ||
    error.message.includes('crash') ||
    error.message.includes('fatal')
  ) {
    return ErrorSeverity.CRITICAL
  }

  // High severity errors that significantly impact user experience
  if (
    category === ErrorCategory.API ||
    category === ErrorCategory.AUTHORIZATION ||
    category === ErrorCategory.RENDER
  ) {
    return ErrorSeverity.HIGH
  }

  // Medium severity errors that partially impact functionality
  if (category === ErrorCategory.NETWORK || category === ErrorCategory.NOT_FOUND) {
    return ErrorSeverity.MEDIUM
  }

  // Low severity errors that have minimal impact
  return ErrorSeverity.LOW
}

/**
 * Create structured error object with metadata
 */
export function createStructuredError(
  error: Error,
  additionalMetadata: Partial<ErrorMetadata> = {},
): StructuredError {
  const category = categorizeError(error)
  const severity = determineErrorSeverity(error, category)

  const metadata: ErrorMetadata = {
    category,
    severity,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    ...additionalMetadata,
  }

  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
    metadata,
  }
}

/**
 * Log error using structured logger
 */
export function logError(structuredError: StructuredError): void {
  const { message, name, metadata } = structuredError

  // Convert error metadata to log context
  const logContext: LogContext = {
    component: metadata.category,
    errorCode: name,
    ...metadata,
  }

  // Use appropriate log level based on severity
  if (metadata.severity === ErrorSeverity.CRITICAL || metadata.severity === ErrorSeverity.HIGH) {
    logger.error(`[${metadata.category}] ${name}: ${message}`, logContext)
  } else if (metadata.severity === ErrorSeverity.MEDIUM) {
    logger.warn(`[${metadata.category}] ${name}: ${message}`, logContext)
  } else {
    logger.info(`[${metadata.category}] ${name}: ${message}`, logContext)
  }
}

/**
 * Track error with logging and Sentry integration
 */
export async function trackError(
  error: Error,
  additionalMetadata: Partial<ErrorMetadata> = {}
): Promise<void> {
  const structuredError = createStructuredError(error, additionalMetadata)
  const { metadata } = structuredError

  // Log error using structured logger
  logError(structuredError)

  // Send to Sentry if error should be reported
  const category = metadata.category as ErrorCategory
  if (shouldReportError(error, category)) {
    const errorContext: ErrorContext = {
      component: metadata.category,
      userId: metadata.userId,
      userAgent: metadata.userAgent,
      path: metadata.url,
      tags: {
        category: metadata.category,
        severity: metadata.severity,
      },
      level:
        metadata.severity === ErrorSeverity.CRITICAL
          ? 'fatal'
          : metadata.severity === ErrorSeverity.HIGH
            ? 'error'
            : metadata.severity === ErrorSeverity.MEDIUM
              ? 'warning'
              : 'info',
      ...additionalMetadata,
    }

    // Capture error in Sentry (non-blocking)
    captureError(error, errorContext).catch((e) => {
      logger.warn('Failed to send error to Sentry', {
        error: e instanceof Error ? e : undefined,
      })
    })
  }

  // Store error in sessionStorage for debugging (development only)
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      const errors = JSON.parse(sessionStorage.getItem('app_errors') || '[]')
      errors.push({
        ...structuredError,
        timestamp: structuredError.metadata.timestamp,
      })
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.shift()
      }
      sessionStorage.setItem('app_errors', JSON.stringify(errors))
    } catch (e) {
      // Ignore sessionStorage errors
    }
  }
}

/**
 * Create user-friendly error message based on error category
 */
export function getUserFriendlyErrorMessage(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Network connection issue. Please check your internet connection and try again.'
    case ErrorCategory.API:
      return 'Service temporarily unavailable. Please try again in a moment.'
    case ErrorCategory.AUTHENTICATION:
      return 'Authentication failed. Please log in again.'
    case ErrorCategory.AUTHORIZATION:
      return "You don't have permission to access this resource."
    case ErrorCategory.NOT_FOUND:
      return 'The requested resource was not found.'
    case ErrorCategory.DATABASE:
      return 'Database error occurred. Our team has been notified.'
    case ErrorCategory.VALIDATION:
      return 'Invalid input. Please check your data and try again.'
    case ErrorCategory.RENDER:
      return 'Display error occurred. Please refresh the page.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

/**
 * Get error details for development mode
 */
export function getErrorDetails(error: Error): string {
  if (process.env.NODE_ENV === 'development') {
    return `${error.name}: ${error.message}\n\n${error.stack || 'No stack trace available'}`
  }
  return error.message
}

/**
 * Check if error should be reported to monitoring service
 */
export function shouldReportError(error: Error, category: ErrorCategory): boolean {
  // Don't report low-severity errors
  if (category === ErrorCategory.VALIDATION || category === ErrorCategory.NOT_FOUND) {
    return false
  }

  // Don't report client-side network errors (user's internet issue)
  if (category === ErrorCategory.NETWORK && typeof window !== 'undefined') {
    return false
  }

  return true
}
