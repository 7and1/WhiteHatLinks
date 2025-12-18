import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Package, BookOpen, HelpCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
}

const suggestedPages = [
  {
    href: '/',
    icon: Home,
    title: 'Home',
    description: 'Go back to the homepage',
  },
  {
    href: '/inventory',
    icon: Package,
    title: 'Inventory',
    description: 'Browse our backlink inventory',
  },
  {
    href: '/blog',
    icon: BookOpen,
    title: 'Blog',
    description: 'Read our latest articles',
  },
  {
    href: '/faq',
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Get answers to common questions',
  },
]

export default function NotFound() {
  return (
    <div className="container py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-10">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        {/* Primary actions */}
        <div className="flex justify-center gap-4 mb-12">
          <Link
            href="/"
            className="rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/contact"
            className="rounded-md border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Contact us
          </Link>
        </div>

        {/* Suggested pages */}
        <div className="border-t pt-10">
          <p className="text-sm font-medium text-muted-foreground mb-6">
            Or check out these pages:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {suggestedPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-start gap-4 rounded-lg border p-4 text-left hover:border-primary hover:shadow-sm transition-all group"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <page.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {page.title}
                  </div>
                  <div className="text-sm text-muted-foreground">{page.description}</div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
