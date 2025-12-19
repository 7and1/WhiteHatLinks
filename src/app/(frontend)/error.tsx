'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  trackError,
  getUserFriendlyErrorMessage,
  categorizeError,
  getErrorDetails,
} from '@/lib/error-tracking'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Frontend route group error page
 * Handles errors within the (frontend) route group
 */
export default function Error({ error, reset }: ErrorPageProps) {
  const errorCategory = categorizeError(error)
  const userMessage = getUserFriendlyErrorMessage(errorCategory)

  useEffect(() => {
    // Track error with digest
    trackError(error, {
      digest: error.digest,
    })
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="container py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">{userMessage}</p>
        </div>

        {/* Error ID */}
        {error.digest && (
          <div className="mb-6 rounded-lg bg-secondary border px-4 py-3 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Error ID:</span>{' '}
              <code className="text-xs bg-background px-2 py-1 rounded font-mono">
                {error.digest}
              </code>
            </p>
          </div>
        )}

        {/* Development Details */}
        {isDevelopment && (
          <details className="mb-6 rounded-lg bg-gray-900 text-white overflow-hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold hover:bg-gray-800 transition-colors">
              Developer Details
            </summary>
            <div className="px-4 py-3 border-t border-gray-700">
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Category</p>
                <p className="text-sm font-mono">{errorCategory}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Stack Trace</p>
                <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap bg-gray-950 p-3 rounded">
                  {getErrorDetails(error)}
                </pre>
              </div>
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={reset}
            className="rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go home
          </Link>
        </div>

        {/* Support Message */}
        <div className="text-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            We apologize for the inconvenience. Our team has been notified and is working on a fix.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Need help? Contact{' '}
            <a
              href="mailto:support@whitehatlink.org"
              className="text-primary font-semibold hover:underline"
            >
              support@whitehatlink.org
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
