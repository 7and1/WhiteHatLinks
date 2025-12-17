'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="container py-20">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          We apologize for the inconvenience. Our team has been notified and is working on a fix.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Go home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-xs text-muted-foreground">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
