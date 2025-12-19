/**
 * Sentry Error Tracking Integration
 *
 * This module provides error tracking for production environments.
 * Compatible with Cloudflare Workers through manual error reporting.
 *
 * Note: Due to Cloudflare Workers limitations, we use a lightweight
 * approach that sends errors to Sentry's API directly rather than
 * using the full SDK.
 */

import { logger, type LogContext } from './logger'

export interface SentryConfig {
  dsn: string
  environment: string
  release?: string
  enabled: boolean
}

export interface ErrorContext extends LogContext {
  tags?: Record<string, string>
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
  fingerprint?: string[]
}

/**
 * Get Sentry configuration from environment
 */
function getSentryConfig(): SentryConfig {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
    release: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
    enabled:
      process.env.NODE_ENV === 'production' &&
      Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  }
}

/**
 * Sentry Event Payload (simplified for API submission)
 */
interface SentryEvent {
  event_id: string
  timestamp: number
  platform: 'javascript'
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
  logger?: string
  transaction?: string
  server_name?: string
  release?: string
  environment?: string
  message?: {
    formatted: string
  }
  exception?: {
    values: Array<{
      type: string
      value: string
      stacktrace?: {
        frames: Array<{
          filename: string
          function: string
          lineno?: number
          colno?: number
        }>
      }
    }>
  }
  tags?: Record<string, string>
  extra?: Record<string, unknown>
  user?: {
    id?: string
    ip_address?: string
    username?: string
  }
  request?: {
    url?: string
    method?: string
    headers?: Record<string, string>
  }
  contexts?: {
    runtime?: {
      name: string
      version?: string
    }
  }
  fingerprint?: string[]
}

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
}

/**
 * Stacktrace type
 */
type Stacktrace = {
  frames: Array<{
    filename: string
    function: string
    lineno?: number
    colno?: number
  }>
}

/**
 * Parse error stack trace
 */
function parseStackTrace(stack?: string): Stacktrace | undefined {
  if (!stack) return undefined

  const frames = stack
    .split('\n')
    .slice(1) // Skip error message line
    .map((line) => {
      // Parse stack trace line (e.g., "at functionName (file.ts:10:5)")
      const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/)
      if (match) {
        return {
          function: match[1].trim(),
          filename: match[2],
          lineno: parseInt(match[3], 10),
          colno: parseInt(match[4], 10),
        }
      }

      // Fallback for simpler format
      const simpleMatch = line.match(/at\s+(.+):(\d+):(\d+)/)
      if (simpleMatch) {
        return {
          function: '<anonymous>',
          filename: simpleMatch[1],
          lineno: parseInt(simpleMatch[2], 10),
          colno: parseInt(simpleMatch[3], 10),
        }
      }

      return {
        function: line.trim(),
        filename: 'unknown',
      }
    })
    .filter((frame) => frame.filename !== 'unknown')

  return frames.length > 0 ? { frames } : undefined
}

/**
 * Capture an error and send to Sentry
 */
export async function captureError(
  error: Error | string,
  context?: ErrorContext
): Promise<void> {
  const config = getSentryConfig()

  // Always log to structured logger
  logger.error(typeof error === 'string' ? error : error.message, {
    ...context,
    error: error instanceof Error ? error : undefined,
  })

  // Skip Sentry if not enabled
  if (!config.enabled || !config.dsn) {
    return
  }

  try {
    const errorObj = error instanceof Error ? error : new Error(error)

    // Build Sentry event
    const event: SentryEvent = {
      event_id: generateEventId(),
      timestamp: Math.floor(Date.now() / 1000),
      platform: 'javascript',
      level: context?.level || 'error',
      logger: 'javascript',
      transaction: context?.path,
      release: config.release,
      environment: config.environment,
      exception: {
        values: [
          {
            type: errorObj.name || 'Error',
            value: errorObj.message,
            stacktrace: parseStackTrace(errorObj.stack),
          },
        ],
      },
      tags: {
        component: context?.component || 'unknown',
        ...context?.tags,
      },
      extra: {
        ...context,
        errorCode: context?.errorCode,
      },
      user: context?.userId
        ? {
            id: context.userId,
            ip_address: context.ip,
          }
        : undefined,
      request: context?.path
        ? {
            url: context.path,
            method: context.method,
          }
        : undefined,
      contexts: {
        runtime: {
          name: 'cloudflare-workers',
          version: '1.0.0',
        },
      },
      fingerprint: context?.fingerprint,
    }

    // Send to Sentry API
    await sendToSentry(config.dsn, event)
  } catch (e) {
    // Don't let Sentry errors break the application
    logger.warn('Failed to send error to Sentry', {
      error: e instanceof Error ? e : undefined,
    })
  }
}

/**
 * Send event to Sentry API
 */
async function sendToSentry(dsn: string, event: SentryEvent): Promise<void> {
  // Parse Sentry DSN
  const dsnMatch = dsn.match(/^https:\/\/(.+?)@(.+?)\/(.+)$/)
  if (!dsnMatch) {
    throw new Error('Invalid Sentry DSN format')
  }

  const [, publicKey, host, projectId] = dsnMatch
  const endpoint = `https://${host}/api/${projectId}/store/`

  // Send event to Sentry
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${publicKey}, sentry_client=custom/1.0.0`,
    },
    body: JSON.stringify(event),
  })

  if (!response.ok) {
    throw new Error(`Sentry API error: ${response.status} ${response.statusText}`)
  }
}

/**
 * Capture a message (non-error event)
 */
export async function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: ErrorContext
): Promise<void> {
  const config = getSentryConfig()

  // Map Sentry levels to logger levels
  const logLevel =
    level === 'fatal' || level === 'error'
      ? 'error'
      : level === 'warning'
        ? 'warn'
        : level

  // Log to structured logger
  logger[logLevel](message, context)

  // Skip Sentry if not enabled
  if (!config.enabled || !config.dsn) {
    return
  }

  try {
    const event: SentryEvent = {
      event_id: generateEventId(),
      timestamp: Math.floor(Date.now() / 1000),
      platform: 'javascript',
      level,
      logger: 'javascript',
      transaction: context?.path,
      release: config.release,
      environment: config.environment,
      message: {
        formatted: message,
      },
      tags: context?.tags,
      extra: context,
      user: context?.userId
        ? {
            id: context.userId,
            ip_address: context.ip,
          }
        : undefined,
      fingerprint: context?.fingerprint,
    }

    await sendToSentry(config.dsn, event)
  } catch (e) {
    logger.warn('Failed to send message to Sentry', {
      error: e instanceof Error ? e : undefined,
    })
  }
}

/**
 * Add breadcrumb for better error context
 * Note: Since we're not using the full SDK, breadcrumbs are logged only
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  data?: Record<string, unknown>
): void {
  logger.debug(`[Breadcrumb] ${category || 'default'}: ${message}`, data)
}

/**
 * Set user context for error reporting
 */
export function setUser(user: { id: string; email?: string; username?: string }): void {
  logger.debug('User context set', { userId: user.id, username: user.username })
  // In a full SDK implementation, this would persist user context
  // For our lightweight implementation, we'll pass it with each error
}

/**
 * Clear user context
 */
export function clearUser(): void {
  logger.debug('User context cleared')
}

/**
 * Check if Sentry is enabled
 */
export function isSentryEnabled(): boolean {
  const config = getSentryConfig()
  return config.enabled
}
