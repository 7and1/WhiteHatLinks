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
 * Root-level error page for Next.js 15
 * Handles global application errors with user-friendly UI
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const errorCategory = categorizeError(error)
  const userMessage = getUserFriendlyErrorMessage(errorCategory)

  useEffect(() => {
    // Track error when component mounts
    trackError(error, {
      digest: error.digest,
    })
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl w-full">
        <div className="rounded-xl border border-red-200 bg-white shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <svg
                  className="h-7 w-7 text-white"
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
              <div>
                <h1 className="text-2xl font-bold text-white">Application Error</h1>
                <p className="text-red-100 text-sm mt-1">Something unexpected happened</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* User-friendly message */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">What happened?</h2>
              <p className="text-gray-700 leading-relaxed">{userMessage}</p>
            </div>

            {/* Error ID */}
            {error.digest && (
              <div className="mb-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Error ID:</span>{' '}
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {error.digest}
                  </code>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Reference this ID when contacting support
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
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Error Name</p>
                    <p className="text-sm font-mono">{error.name}</p>
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
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={reset}
                className="flex-1 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="flex-1 text-center rounded-lg border-2 border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go Home
              </Link>
            </div>

            {/* Support Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-gray-400 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Need assistance?</h3>
                  <p className="text-sm text-gray-600">
                    Our team has been automatically notified. For immediate help, contact us at{' '}
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
          </div>
        </div>

        {/* Additional Help Links */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-gray-600">
            <Link href="/faq" className="hover:text-primary transition-colors hover:underline">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors hover:underline">
              Contact Support
            </Link>
            <Link href="/blog" className="hover:text-primary transition-colors hover:underline">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
