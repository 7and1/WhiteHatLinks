import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Toaster } from 'sonner'
import './globals.css'
import { OrganizationSchema, WebSiteSchema } from '@/components/seo'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b5bdb',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://whitehatlink.org'),
  title: {
    default: 'WhiteHatLinks | Premium Backlinks Without Spam',
    template: '%s | WhiteHatLinks',
  },
  description:
    'Buy vetted, high-authority backlinks with transparent metrics. No PBNs, no spam. Manual outreach, real editorial placements.',
  keywords: [
    'backlinks',
    'guest posts',
    'link building',
    'SEO',
    'link insertions',
    'digital PR',
    'high DR backlinks',
    'white hat SEO',
  ],
  authors: [{ name: 'WhiteHatLinks' }],
  creator: 'WhiteHatLinks',
  publisher: 'WhiteHatLinks',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://whitehatlink.org',
    siteName: 'WhiteHatLinks',
    title: 'WhiteHatLinks | Premium Backlinks Without Spam',
    description:
      'Buy vetted, high-authority backlinks with transparent metrics. No PBNs, no spam.',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'WhiteHatLinks - Premium Backlink Acquisition',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhiteHatLinks | Premium Backlinks Without Spam',
    description:
      'Buy vetted, high-authority backlinks with transparent metrics. No PBNs, no spam.',
    images: ['/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://whitehatlink.org',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <OrganizationSchema />
        <WebSiteSchema />
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
            >
              <img src="/favicon.svg" alt="" width={28} height={28} className="shrink-0" />
              WhiteHatLinks
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
          {children}
        </main>

        <footer className="border-t bg-secondary/50 py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <div className="font-bold text-lg">WhiteHatLinks</div>
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
              <p>&copy; 2025 WhiteHatLinks. All rights reserved.</p>
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
