'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import {
  trackError,
  createStructuredError,
  getUserFriendlyErrorMessage,
  getErrorDetails,
  categorizeError,
  type ErrorCategory,
} from '@/lib/error-tracking'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void, category: ErrorCategory) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorCategory: ErrorCategory | null
  errorCount: number
}

/**
 * Production-grade Error Boundary component
 * Catches React component errors and provides user-friendly error UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeout: NodeJS.Timeout | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorCategory: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render shows the fallback UI
    const category = categorizeError(error)
    return {
      hasError: true,
      error,
      errorCategory: category,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Track error with component stack
    trackError(error, {
      componentStack: errorInfo.componentStack ?? undefined,
    })

    // Increment error count
    this.setState((prevState) => ({
      errorCount: prevState.errorCount + 1,
    }))

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Auto-reset after multiple errors (prevent infinite error loop)
    if (this.state.errorCount >= 3) {
      this.scheduleAutoReset()
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout)
    }
  }

  private scheduleAutoReset = (): void => {
    // Auto-reset after 10 seconds if too many errors occur
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout)
    }
    this.resetTimeout = setTimeout(() => {
      this.handleReset()
    }, 10000)
  }

  private handleReset = (): void => {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout)
      this.resetTimeout = null
    }

    this.setState({
      hasError: false,
      error: null,
      errorCategory: null,
      errorCount: 0,
    })
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  private handleGoHome = (): void => {
    window.location.href = '/'
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error && this.state.errorCategory) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset, this.state.errorCategory)
      }

      // Default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorCategory={this.state.errorCategory}
          errorCount={this.state.errorCount}
          onReset={this.handleReset}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
          showDetails={this.props.showDetails ?? process.env.NODE_ENV === 'development'}
        />
      )
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error: Error
  errorCategory: ErrorCategory
  errorCount: number
  onReset: () => void
  onReload: () => void
  onGoHome: () => void
  showDetails: boolean
}

function DefaultErrorFallback({
  error,
  errorCategory,
  errorCount,
  onReset,
  onReload,
  onGoHome,
  showDetails,
}: DefaultErrorFallbackProps) {
  const userMessage = getUserFriendlyErrorMessage(errorCategory)
  const [showErrorDetails, setShowErrorDetails] = React.useState(false)

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          {/* Error Icon */}
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

          {/* Error Message */}
          <h2 className="mb-2 text-2xl font-bold text-red-900">Something went wrong</h2>
          <p className="mb-6 text-red-700">{userMessage}</p>

          {/* Error Count Warning */}
          {errorCount >= 2 && (
            <div className="mb-6 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              <p className="font-semibold">Multiple errors detected</p>
              <p className="text-xs mt-1">
                If the problem persists, please try reloading the page or contact support.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {errorCount < 2 && (
              <button
                onClick={onReset}
                className="rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onReload}
              className="rounded-md border border-red-300 bg-white px-6 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reload Page
            </button>
            <button
              onClick={onGoHome}
              className="rounded-md border border-red-300 bg-white px-6 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Go Home
            </button>
          </div>

          {/* Error Details (Development Mode) */}
          {showDetails && (
            <div className="mt-6 border-t border-red-200 pt-6">
              <button
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="mb-3 text-sm font-semibold text-red-700 hover:text-red-800 transition-colors underline focus:outline-none"
              >
                {showErrorDetails ? 'Hide' : 'Show'} Error Details
              </button>

              {showErrorDetails && (
                <div className="rounded-md bg-gray-900 p-4 text-left">
                  <pre className="overflow-x-auto text-xs text-gray-100 font-mono whitespace-pre-wrap">
                    {getErrorDetails(error)}
                  </pre>
                </div>
              )}

              <p className="mt-3 text-xs text-red-600">
                Error Category: {errorCategory} | Name: {error.name}
              </p>
            </div>
          )}

          {/* Support Message */}
          <p className="mt-6 text-xs text-red-600">
            Need help? Contact our support team at{' '}
            <a
              href="mailto:support@whitehatlink.org"
              className="font-semibold underline hover:text-red-700"
            >
              support@whitehatlink.org
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook version of Error Boundary for functional components
 * Note: This is a convenience wrapper and still uses the class-based ErrorBoundary
 */
export function useErrorBoundary(): {
  ErrorBoundary: typeof ErrorBoundary
  showBoundary: (error: Error) => void
} {
  const showBoundary = (error: Error): void => {
    throw error
  }

  return {
    ErrorBoundary,
    showBoundary,
  }
}

/**
 * Higher-order component to wrap any component with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>,
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
