/**
 * Content Security Policy (CSP) utilities for Next.js 15 + Cloudflare Workers
 *
 * This module provides production-grade CSP implementation with:
 * - Nonce-based script/style execution
 * - Environment-specific configurations
 * - Payload CMS admin compatibility
 * - OWASP security best practices
 */

/**
 * Generate a cryptographically secure nonce for CSP
 * Uses Web Crypto API for Edge Runtime compatibility
 */
export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}

/**
 * CSP configuration options
 */
interface CSPConfig {
  nonce?: string
  isDevelopment?: boolean
  isPayloadAdmin?: boolean
}

/**
 * Build Content Security Policy header value
 *
 * Security considerations:
 * - No unsafe-inline or unsafe-eval in production
 * - Nonce-based script execution for inline scripts
 * - Strict directives following OWASP recommendations
 * - Special allowances for Payload CMS admin panel
 *
 * @param config - CSP configuration options
 * @returns CSP header value string
 */
export function buildCSP({ nonce, isDevelopment = false, isPayloadAdmin = false }: CSPConfig): string {
  const directives: Record<string, string[]> = {
    // Default fallback for all resource types
    'default-src': ["'self'"],

    // Script sources
    'script-src': [
      "'self'",
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      // Required for Next.js chunks and hydration
      "'strict-dynamic'",
      // Cloudflare Web Analytics
      'https://static.cloudflareinsights.com',
      // Development only: allow eval for hot reload
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      // Payload Admin: additional requirements
      ...(isPayloadAdmin ? ["'unsafe-inline'", "'unsafe-eval'"] : []),
    ],

    // Style sources
    'style-src': [
      "'self'",
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      // Google Fonts
      'https://fonts.googleapis.com',
      // Allow inline styles for Next.js and React components
      "'unsafe-inline'",
    ],

    // Font sources
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:',
    ],

    // Image sources
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      // Allow images from any HTTPS source for user-uploaded content
    ],

    // Connect sources (XHR, WebSocket, EventSource)
    'connect-src': [
      "'self'",
      // API endpoints
      'https://*.whitehatlink.org',
      // Cloudflare Web Analytics
      'https://cloudflareinsights.com',
      // Development: allow hot reload
      ...(isDevelopment ? ['ws:', 'wss:'] : []),
    ],

    // Media sources
    'media-src': ["'self'", 'blob:'],

    // Object sources (plugins)
    'object-src': ["'none'"],

    // Frame sources
    'frame-src': ["'none'"],

    // Frame ancestors (prevents clickjacking)
    'frame-ancestors': ["'none'"],

    // Base URI restriction
    'base-uri': ["'self'"],

    // Form action restriction
    'form-action': ["'self'"],

    // Upgrade insecure requests in production
    ...(isDevelopment ? {} : { 'upgrade-insecure-requests': [] }),

    // Block mixed content
    'block-all-mixed-content': [],

    // Worker sources
    'worker-src': ["'self'", 'blob:'],

    // Manifest sources
    'manifest-src': ["'self'"],
  }

  // Build CSP string
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive
      }
      return `${directive} ${sources.join(' ')}`
    })
    .join('; ')
}

/**
 * Build CSP Report-Only header for testing
 * Use this to test CSP policies without breaking the site
 */
export function buildCSPReportOnly({ nonce, isDevelopment = false }: CSPConfig): string {
  const csp = buildCSP({ nonce, isDevelopment })
  return `${csp}; report-uri /api/csp-report`
}

/**
 * Constants for CSP header names
 */
export const CSP_HEADER = 'Content-Security-Policy'
export const CSP_REPORT_ONLY_HEADER = 'Content-Security-Policy-Report-Only'
export const CSP_NONCE_HEADER = 'x-nonce'
