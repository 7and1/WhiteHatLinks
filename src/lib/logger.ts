/**
 * Structured Logger for Production-Grade Logging
 *
 * Features:
 * - Structured JSON logging for production
 * - Human-readable console logs for development
 * - Contextual metadata support
 * - Log levels with filtering
 * - Performance-friendly (minimal overhead)
 * - Cloudflare Workers compatible
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  // Request context
  requestId?: string
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  path?: string
  method?: string

  // Application context
  component?: string
  function?: string
  feature?: string

  // Error context
  error?: Error
  errorCode?: string
  stack?: string

  // Performance context
  duration?: number
  timestamp?: string

  // Custom metadata
  [key: string]: unknown
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  /**
   * Minimum log level to output
   * debug: Log everything
   * info: Log info, warn, error
   * warn: Log warn, error
   * error: Log only errors
   */
  minLevel: LogLevel
  /**
   * Enable JSON output (production)
   * If false, uses human-readable console output (development)
   */
  jsonOutput: boolean
  /**
   * Enable console output
   */
  enabled: boolean
}

// Log level priorities for filtering
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  jsonOutput: process.env.NODE_ENV === 'production',
  enabled: true,
}

/**
 * Logger class for structured logging
 */
class Logger {
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel]
  }

  /**
   * Format log entry
   */
  private formatLog(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context ? this.sanitizeContext(context) : undefined,
    }
  }

  /**
   * Sanitize context to remove sensitive data
   */
  private sanitizeContext(context: LogContext): LogContext {
    const sanitized = { ...context }

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'authorization']
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]'
      }
    }

    // Extract error information
    if (context.error instanceof Error) {
      sanitized.error = {
        name: context.error.name,
        message: context.error.message,
        stack: context.error.stack,
      } as any
    }

    return sanitized
  }

  /**
   * Safe JSON stringify that handles circular references
   */
  private safeStringify(obj: unknown): string {
    const seen = new Set()
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]'
          }
          seen.add(value)
        }
        return value
      },
      this.config.jsonOutput ? undefined : 2
    )
  }

  /**
   * Output log entry
   */
  private output(entry: LogEntry): void {
    if (this.config.jsonOutput) {
      // Production: JSON output for log aggregation
      console.log(this.safeStringify(entry))
    } else {
      // Development: Human-readable output
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[entry.level]

      const contextStr = entry.context ? ` ${this.safeStringify(entry.context)}` : ''
      console[entry.level === 'debug' ? 'log' : entry.level](
        `${emoji} [${entry.level.toUpperCase()}] ${entry.message}${contextStr}`
      )
    }
  }

  /**
   * Debug log (verbose information for debugging)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return
    this.output(this.formatLog('debug', message, context))
  }

  /**
   * Info log (general information)
   */
  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return
    this.output(this.formatLog('info', message, context))
  }

  /**
   * Warning log (potential issues)
   */
  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) return
    this.output(this.formatLog('warn', message, context))
  }

  /**
   * Error log (errors that need attention)
   */
  error(message: string, context?: LogContext): void {
    if (!this.shouldLog('error')) return
    this.output(this.formatLog('error', message, context))
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

// Global logger instance
let loggerInstance: Logger | null = null

/**
 * Get the global logger instance
 */
export function getLogger(): Logger {
  if (!loggerInstance) {
    loggerInstance = new Logger()
  }
  return loggerInstance
}

/**
 * Create a child logger with default context
 */
export function createLogger(defaultContext: LogContext): Logger {
  const logger = getLogger()

  // Return a logger with context automatically added
  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { ...defaultContext, ...context }),
    info: (message: string, context?: LogContext) =>
      logger.info(message, { ...defaultContext, ...context }),
    warn: (message: string, context?: LogContext) =>
      logger.warn(message, { ...defaultContext, ...context }),
    error: (message: string, context?: LogContext) =>
      logger.error(message, { ...defaultContext, ...context }),
    configure: (config: Partial<LoggerConfig>) => logger.configure(config),
  } as Logger
}

/**
 * Convenience exports for common use cases
 */
export const logger = getLogger()
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, context?: LogContext) => logger.error(message, context),
}
