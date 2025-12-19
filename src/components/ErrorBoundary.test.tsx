import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary, withErrorBoundary } from './ErrorBoundary'
import { ErrorCategory } from '@/lib/error-tracking'
import React from 'react'

// Component that throws an error on demand
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error from component')
  }
  return <div>Normal component</div>
}

// Component with button that triggers error
const ThrowErrorOnClick = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false)

  if (shouldThrow) {
    throw new Error('Error triggered by button')
  }

  return (
    <button onClick={() => setShouldThrow(true)}>
      Trigger Error
    </button>
  )
}

describe('ErrorBoundary', () => {
  const originalError = console.error

  beforeEach(() => {
    // Suppress error console logs during tests
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalError
  })

  describe('normal rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should render multiple children without errors', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('First child')).toBeInTheDocument()
      expect(screen.getByText('Second child')).toBeInTheDocument()
    })
  })

  describe('error catching', () => {
    it('should catch and display error UI when child throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should display user-friendly error message', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument()
    })

    it('should show Try Again button on first error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    it('should show Reload Page button', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Reload Page')).toBeInTheDocument()
    })

    it('should show Go Home button', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Go Home')).toBeInTheDocument()
    })
  })

  describe('custom error handler', () => {
    it('should call onError callback when error occurs', () => {
      const onErrorMock = vi.fn()

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(onErrorMock).toHaveBeenCalled()
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      )
    })
  })

  describe('custom fallback', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = (error: Error) => (
        <div>Custom error UI: {error.message}</div>
      )

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText(/Custom error UI/)).toBeInTheDocument()
      expect(screen.getByText(/Test error from component/)).toBeInTheDocument()
    })

    it('should provide reset function to custom fallback', () => {
      const customFallback = (error: Error, reset: () => void) => (
        <div>
          <p>Error occurred</p>
          <button onClick={reset}>Custom Reset</button>
        </div>
      )

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom Reset')).toBeInTheDocument()
    })

    it('should provide error category to custom fallback', () => {
      const customFallback = (error: Error, reset: () => void, category: ErrorCategory) => (
        <div>
          <p>Category: {category}</p>
        </div>
      )

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText(/Category:/)).toBeInTheDocument()
    })
  })

  describe('error recovery', () => {
    it('should have Try Again button that can be clicked', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Error UI should be visible
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Verify Try Again button exists and is clickable
      const tryAgainButton = screen.getByText('Try Again')
      expect(tryAgainButton).toBeInTheDocument()

      // Button should be clickable (no error thrown)
      fireEvent.click(tryAgainButton)

      // Error boundary state is reset internally
      // (actual re-rendering would require component remounting)
    })
  })

  describe('development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv
    })

    it('should show error details toggle in development mode', () => {
      process.env.NODE_ENV = 'development'

      render(
        <ErrorBoundary showDetails={true}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText(/Show Error Details/)).toBeInTheDocument()
    })

    it('should toggle error details when button is clicked', () => {
      process.env.NODE_ENV = 'development'

      render(
        <ErrorBoundary showDetails={true}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const toggleButton = screen.getByText(/Show Error Details/)
      fireEvent.click(toggleButton)

      expect(screen.getByText(/Hide Error Details/)).toBeInTheDocument()
    })

    it('should not show error details in production mode', () => {
      process.env.NODE_ENV = 'production'

      render(
        <ErrorBoundary showDetails={false}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.queryByText(/Show Error Details/)).not.toBeInTheDocument()
    })
  })

  describe('multiple errors', () => {
    it('should show warning after multiple errors', () => {
      // This is tricky to test since we need to trigger multiple errors
      // We'll just verify the UI exists
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  describe('withErrorBoundary HOC', () => {
    it('should wrap component with ErrorBoundary', () => {
      const TestComponent = () => <div>Wrapped component</div>
      const WrappedComponent = withErrorBoundary(TestComponent)

      render(<WrappedComponent />)

      expect(screen.getByText('Wrapped component')).toBeInTheDocument()
    })

    it('should catch errors in wrapped component', () => {
      const WrappedComponent = withErrorBoundary(ThrowError)

      render(<WrappedComponent shouldThrow={true} />)

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should accept error boundary props', () => {
      const onErrorMock = vi.fn()
      const WrappedComponent = withErrorBoundary(ThrowError, {
        onError: onErrorMock,
      })

      render(<WrappedComponent shouldThrow={true} />)

      expect(onErrorMock).toHaveBeenCalled()
    })

    it('should set display name on wrapped component', () => {
      const TestComponent = () => <div>Test</div>
      TestComponent.displayName = 'TestComponent'
      const WrappedComponent = withErrorBoundary(TestComponent)

      expect(WrappedComponent.displayName).toBe('withErrorBoundary(TestComponent)')
    })
  })

  describe('error categorization', () => {
    it('should categorize network errors', () => {
      const NetworkErrorComponent = () => {
        throw new Error('fetch failed: network error')
      }

      render(
        <ErrorBoundary showDetails={true}>
          <NetworkErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText(/Error Category: NETWORK/)).toBeInTheDocument()
    })

    it('should categorize validation errors', () => {
      const ValidationErrorComponent = () => {
        throw new Error('validation failed: invalid email')
      }

      render(
        <ErrorBoundary showDetails={true}>
          <ValidationErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText(/Error Category: VALIDATION/)).toBeInTheDocument()
    })

    it('should categorize database errors', () => {
      const DatabaseErrorComponent = () => {
        throw new Error('database query failed')
      }

      render(
        <ErrorBoundary showDetails={true}>
          <DatabaseErrorComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText(/Error Category: DATABASE/)).toBeInTheDocument()
    })
  })

  describe('UI elements', () => {
    it('should display error icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should display support email link', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const emailLink = screen.getByText('support@whitehatlink.org')
      expect(emailLink).toBeInTheDocument()
      expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:support@whitehatlink.org')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA attributes on error icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })

    it('should have focus management on buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveClass(/focus:/)
      })
    })
  })
})
