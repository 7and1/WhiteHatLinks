import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateNonce, buildCSP, CSP_HEADER, CSP_NONCE_HEADER } from '@/lib/csp'

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  // ==========================================
  // URL Canonicalization
  // ==========================================

  let needsRedirect = false
  let newPathname = url.pathname

  // 1. Remove trailing slash (except for root path)
  if (newPathname !== '/' && newPathname.endsWith('/')) {
    newPathname = newPathname.slice(0, -1)
    needsRedirect = true
  }

  // 2. Normalize multiple slashes to single slash
  if (newPathname.includes('//')) {
    newPathname = newPathname.replace(/\/+/g, '/')
    needsRedirect = true
  }

  // 3. Lowercase URL paths (SEO best practice)
  // Skip for admin panel to preserve case-sensitive routes
  if (!url.pathname.startsWith('/admin') && newPathname !== newPathname.toLowerCase()) {
    newPathname = newPathname.toLowerCase()
    needsRedirect = true
  }

  // Perform redirect if needed
  if (needsRedirect) {
    const redirectUrl = new URL(newPathname + url.search, url.origin)
    return NextResponse.redirect(redirectUrl, 308) // 308 Permanent Redirect (preserves method)
  }

  // Generate nonce for CSP
  const nonce = generateNonce()

  // Determine environment and path
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isPayloadAdmin = request.nextUrl.pathname.startsWith('/admin')

  // Clone the response
  const response = NextResponse.next()

  // Security headers
  const headers = response.headers

  // Pass nonce to the page via custom header
  headers.set(CSP_NONCE_HEADER, nonce)

  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff')

  // Enable XSS protection (legacy browsers)
  headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // Content Security Policy - Production-grade with nonce
  const csp = buildCSP({
    nonce,
    isDevelopment,
    isPayloadAdmin,
  })
  headers.set(CSP_HEADER, csp)

  // Strict Transport Security (HSTS)
  // Only enable in production with HTTPS
  if (!isDevelopment) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  return response
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - API routes that need different handling
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
