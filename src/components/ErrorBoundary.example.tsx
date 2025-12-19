/**
 * ErrorBoundary Usage Examples
 *
 * This file demonstrates how to use the ErrorBoundary component in various scenarios.
 * DO NOT import this file in production code - it's for reference only.
 */

import React from 'react'
import { ErrorBoundary, withErrorBoundary, useErrorBoundary } from './ErrorBoundary'
import { ErrorCategory } from '@/lib/error-tracking'

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

function Example1() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  )
}

// ============================================================================
// Example 2: Custom Error UI
// ============================================================================

function Example2() {
  return (
    <ErrorBoundary
      fallback={(error, reset, category) => (
        <div className="error-container">
          <h2>Oops! {category} error occurred</h2>
          <p>{error.message}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
    >
      <YourComponent />
    </ErrorBoundary>
  )
}

// ============================================================================
// Example 3: Custom Error Handler
// ============================================================================

function Example3() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Send to analytics
    console.log('Error occurred:', error)
    console.log('Component stack:', errorInfo.componentStack)

    // Send to external monitoring service
    // yourMonitoringService.captureException(error, errorInfo)
  }

  return (
    <ErrorBoundary onError={handleError}>
      <YourComponent />
    </ErrorBoundary>
  )
}

// ============================================================================
// Example 4: Using Higher-Order Component (HOC)
// ============================================================================

function MyComponent() {
  return <div>My Component Content</div>
}

// Wrap component with error boundary
const MyComponentWithErrorBoundary = withErrorBoundary(MyComponent, {
  onError: (error, errorInfo) => {
    console.error('MyComponent error:', error, errorInfo)
  },
})

function Example4() {
  return <MyComponentWithErrorBoundary />
}

// ============================================================================
// Example 5: Programmatic Error Throwing
// ============================================================================

function Example5() {
  const { showBoundary } = useErrorBoundary()

  const handleClick = async () => {
    try {
      await riskyOperation()
    } catch (error) {
      // Throw error to nearest error boundary
      showBoundary(error as Error)
    }
  }

  return (
    <ErrorBoundary>
      <button onClick={handleClick}>Perform Risky Operation</button>
    </ErrorBoundary>
  )
}

// ============================================================================
// Example 6: Nested Error Boundaries (Granular Error Handling)
// ============================================================================

function Example6() {
  return (
    <ErrorBoundary>
      <Header />

      {/* Separate error boundary for main content */}
      <ErrorBoundary
        fallback={(error, reset) => (
          <div className="content-error">
            <p>Main content failed to load</p>
            <button onClick={reset}>Reload Content</button>
          </div>
        )}
      >
        <MainContent />
      </ErrorBoundary>

      {/* Separate error boundary for sidebar */}
      <ErrorBoundary
        fallback={(error, reset) => (
          <div className="sidebar-error">
            <p>Sidebar unavailable</p>
            <button onClick={reset}>Reload Sidebar</button>
          </div>
        )}
      >
        <Sidebar />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}

// ============================================================================
// Example 7: Show Error Details in Development Only
// ============================================================================

function Example7() {
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <YourComponent />
    </ErrorBoundary>
  )
}

// ============================================================================
// Example 8: Different Fallbacks Based on Error Category
// ============================================================================

function Example8() {
  return (
    <ErrorBoundary
      fallback={(error, reset, category) => {
        // Custom UI based on error type
        if (category === ErrorCategory.NETWORK) {
          return (
            <div className="network-error">
              <h3>Network Issue</h3>
              <p>Please check your internet connection</p>
              <button onClick={reset}>Retry</button>
            </div>
          )
        }

        if (category === ErrorCategory.API) {
          return (
            <div className="api-error">
              <h3>Service Unavailable</h3>
              <p>Our services are temporarily down. Please try again later.</p>
              <button onClick={reset}>Retry</button>
            </div>
          )
        }

        // Default fallback
        return (
          <div className="generic-error">
            <h3>Something went wrong</h3>
            <p>{error.message}</p>
            <button onClick={reset}>Try Again</button>
          </div>
        )
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  )
}

// ============================================================================
// Example 9: Wrapping Async Components
// ============================================================================

function Example9() {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingSpinner />}>
        <AsyncComponent />
      </React.Suspense>
    </ErrorBoundary>
  )
}

// ============================================================================
// Example 10: Full Page Error Boundary (Layout Level)
// ============================================================================

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Log to monitoring service
            console.error('Root level error:', error, errorInfo)
          }}
        >
          <Header />
          <main>{children}</main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
}

// ============================================================================
// Helper Components (for examples above)
// ============================================================================

function YourComponent() {
  return <div>Your component</div>
}

function Header() {
  return <header>Header</header>
}

function MainContent() {
  return <div>Main Content</div>
}

function Sidebar() {
  return <aside>Sidebar</aside>
}

function Footer() {
  return <footer>Footer</footer>
}

function LoadingSpinner() {
  return <div>Loading...</div>
}

function AsyncComponent() {
  return <div>Async Component</div>
}

async function riskyOperation() {
  throw new Error('Something went wrong')
}
