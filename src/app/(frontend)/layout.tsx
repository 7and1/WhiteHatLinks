import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import './globals.css'
import { OrganizationSchema, WebSiteSchema, AggregateRatingSchema } from '@/components/seo'
import { ClientErrorBoundary } from '@/components/ClientErrorBoundary'
import { CloudflareAnalytics } from '@/components/CloudflareAnalytics'
import { siteConfig, siteTitle, siteTitleTemplate } from '@/config/site'

// Dynamic import for Toaster - only load when needed (user interactions)
const Toaster = dynamic(() => import('sonner').then(mod => ({ default: mod.Toaster })))

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: siteConfig.themeColor,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteTitle,
    template: siteTitleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'SEO Services',
  classification: 'Business',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteTitle,
    description: siteConfig.description,
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Premium Backlink Acquisition Service with Transparent Metrics`,
        type: 'image/png',
      },
    ],
    countryName: siteConfig.country,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteConfig.description,
    images: ['/og'],
    creator: siteConfig.social.twitter,
    site: siteConfig.social.twitter,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: siteConfig.themeColor,
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': `${siteConfig.url}/rss.xml`,
    },
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteConfig.name,
  },
}

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Font optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Resource hints for third-party services */}
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />
        {process.env.NEXT_PUBLIC_SENTRY_DSN && (
          <link rel="dns-prefetch" href="https://o0.ingest.sentry.io" />
        )}

        <OrganizationSchema />
        <WebSiteSchema />
        <AggregateRatingSchema />
        <CloudflareAnalytics />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Toaster position="top-right" richColors closeButton />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>

        <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container flex items-center justify-between py-5">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground hover:text-primary transition-colors"
              aria-label={`${siteConfig.name} home`}
            >
              <img
                src="/favicon.svg"
                alt={`${siteConfig.name} logo`}
                width={28}
                height={28}
                className="shrink-0"
                loading="eager"
                fetchPriority="high"
              />
              <span>{siteConfig.name}</span>
            </Link>
            <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </header>

        <main id="main-content" className="pb-16">
          <ClientErrorBoundary>{children}</ClientErrorBoundary>
        </main>

        <footer className="border-t bg-secondary/50 py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <div className="font-bold text-lg">{siteConfig.name}</div>
                <p className="text-sm text-muted-foreground">
                  Transparent link building. No PBNs. Real traffic. Manual outreach only.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Services</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/services" className="hover:text-primary transition-colors">
                      Guest Posts
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:text-primary transition-colors">
                      Link Insertions
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:text-primary transition-colors">
                      Digital PR
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/blog" className="hover:text-primary transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-primary transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/inventory" className="hover:text-primary transition-colors">
                      Inventory
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/about" className="hover:text-primary transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-primary transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-primary transition-colors">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
