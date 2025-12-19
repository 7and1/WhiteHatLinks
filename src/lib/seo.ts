/**
 * SEO Utilities for URL Canonicalization and Internationalization
 *
 * This module provides utilities for:
 * - Canonical URL generation
 * - Hreflang tag generation for international SEO
 * - URL normalization for consistency
 */

/**
 * Supported languages and regions
 * Extend this as you add more language support
 */
export const SUPPORTED_LOCALES = {
  'en-US': {
    language: 'en',
    region: 'US',
    name: 'English (US)',
    default: true,
  },
  // Future language support:
  // 'es-ES': {
  //   language: 'es',
  //   region: 'ES',
  //   name: 'Spanish (Spain)',
  //   default: false,
  // },
} as const

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES

/**
 * Base URL for the application
 * In production, this should be set via environment variable
 */
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://whitehatlink.org'

/**
 * Generate canonical URL for a given path
 * Ensures consistent URL format across the site
 *
 * @param path - The path (e.g., '/inventory', '/blog/my-post')
 * @returns Fully qualified canonical URL
 */
export function getCanonicalUrl(path: string): string {
  // Normalize path: remove trailing slash, ensure leading slash
  let normalizedPath = path.trim()

  // Remove trailing slash (except for root)
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1)
  }

  // Ensure leading slash
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath
  }

  // Convert to lowercase for consistency
  normalizedPath = normalizedPath.toLowerCase()

  return `${BASE_URL}${normalizedPath}`
}

/**
 * Generate hreflang alternate links for a page
 *
 * @param path - Current page path
 * @param locale - Current locale (default: 'en-US')
 * @returns Array of hreflang link objects
 */
export function getHreflangLinks(
  path: string,
  locale: SupportedLocale = 'en-US'
): Array<{ hrefLang: string; href: string }> {
  const canonicalPath = getCanonicalUrl(path)
  const links: Array<{ hrefLang: string; href: string }> = []

  // Add link for current locale
  links.push({
    hrefLang: locale,
    href: canonicalPath,
  })

  // Add x-default link (points to default language version)
  const defaultLocale = Object.entries(SUPPORTED_LOCALES).find(
    ([, config]) => config.default
  )?.[0] as SupportedLocale

  if (defaultLocale) {
    links.push({
      hrefLang: 'x-default',
      href: getCanonicalUrl(path), // Points to default language
    })
  }

  // Add links for other supported locales
  // When you add more languages, this will automatically generate hreflang tags
  Object.keys(SUPPORTED_LOCALES).forEach((supportedLocale) => {
    if (supportedLocale !== locale) {
      // For now, all locales point to the same URL
      // When you implement i18n, adjust this to point to localized paths
      // Example: /es/inventory, /fr/inventory, etc.
      links.push({
        hrefLang: supportedLocale,
        href: getCanonicalUrl(path),
      })
    }
  })

  return links
}

/**
 * Generate OpenGraph locale metadata
 *
 * @param locale - Current locale
 * @returns OpenGraph locale string and alternates
 */
export function getOpenGraphLocale(locale: SupportedLocale = 'en-US'): {
  locale: string
  alternateLocale: string[]
} {
  const alternates = Object.keys(SUPPORTED_LOCALES)
    .filter((l) => l !== locale)
    .map((l) => l.replace('-', '_')) // OpenGraph uses underscores

  return {
    locale: locale.replace('-', '_'), // en-US -> en_US
    alternateLocale: alternates,
  }
}

/**
 * Validate and normalize URL path
 *
 * @param path - URL path to normalize
 * @returns Normalized path
 */
export function normalizePath(path: string): string {
  let normalized = path.trim()

  // Ensure leading slash
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized
  }

  // Convert to lowercase
  normalized = normalized.toLowerCase()

  // Remove multiple slashes
  normalized = normalized.replace(/\/+/g, '/')

  // Remove trailing slash (except root) - must be last
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  return normalized
}

/**
 * Check if a URL is canonical
 *
 * @param url - Full URL to check
 * @param expectedPath - Expected canonical path
 * @returns Boolean indicating if URL is canonical
 */
export function isCanonicalUrl(url: string, expectedPath: string): boolean {
  try {
    const urlObj = new URL(url)
    const normalizedPath = normalizePath(urlObj.pathname)
    const expectedNormalized = normalizePath(expectedPath)

    // Check if origins match
    if (urlObj.origin !== BASE_URL) {
      return false
    }

    // Check if paths match after normalization
    if (normalizedPath !== expectedNormalized) {
      return false
    }

    // For root path, trailing slash is allowed
    if (urlObj.pathname === '/') {
      return true
    }

    // For non-root paths, no trailing slash and must be lowercase
    return (
      !urlObj.pathname.endsWith('/') &&
      urlObj.pathname === urlObj.pathname.toLowerCase()
    )
  } catch {
    return false
  }
}
