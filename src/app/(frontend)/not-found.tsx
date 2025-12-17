import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="container py-20">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/inventory"
            className="rounded-md border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Browse inventory
          </Link>
        </div>
      </div>
    </div>
  )
}
