'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { ReactNode } from 'react'

/**
 * Client-side wrapper for ErrorBoundary
 * Use this in server components that need error boundary protection
 */
export function ClientErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
