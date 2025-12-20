import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getCanonicalUrl,
  getHreflangLinks,
  getOpenGraphLocale,
  normalizePath,
  isCanonicalUrl,
  BASE_URL,
} from './seo'

describe('SEO Utilities', () => {
  describe('getCanonicalUrl', () => {
    it('should generate canonical URL for root path', () => {
      const url = getCanonicalUrl('/')
      expect(url).toBe(`${BASE_URL}/`)
    })

    it('should generate canonical URL for simple path', () => {
      const url = getCanonicalUrl('/about')
      expect(url).toBe(`${BASE_URL}/about`)
    })

    it('should remove trailing slash from path', () => {
      const url = getCanonicalUrl('/about/')
      expect(url).toBe(`${BASE_URL}/about`)
    })

    it('should add leading slash if missing', () => {
      const url = getCanonicalUrl('about')
      expect(url).toBe(`${BASE_URL}/about`)
    })

    it('should convert path to lowercase', () => {
      const url = getCanonicalUrl('/About')
      expect(url).toBe(`${BASE_URL}/about`)
    })

    it('should handle nested paths', () => {
      const url = getCanonicalUrl('/blog/my-post')
      expect(url).toBe(`${BASE_URL}/blog/my-post`)
    })

    it('should handle paths with query parameters', () => {
      const url = getCanonicalUrl('/inventory?page=2')
      expect(url).toBe(`${BASE_URL}/inventory?page=2`)
    })

    it('should trim whitespace', () => {
      const url = getCanonicalUrl('  /about  ')
      expect(url).toBe(`${BASE_URL}/about`)
    })
  })

  describe('getHreflangLinks', () => {
    it('should generate hreflang links for default locale', () => {
      const links = getHreflangLinks('/about')

      expect(links).toContainEqual({
        hrefLang: 'en-US',
        href: `${BASE_URL}/about`,
      })

      expect(links).toContainEqual({
        hrefLang: 'x-default',
        href: `${BASE_URL}/about`,
      })
    })

    it('should include current locale', () => {
      const links = getHreflangLinks('/about', 'en-US')

      const currentLocaleLink = links.find((l) => l.hrefLang === 'en-US')
      expect(currentLocaleLink).toBeDefined()
      expect(currentLocaleLink?.href).toBe(`${BASE_URL}/about`)
    })

    it('should always include x-default', () => {
      const links = getHreflangLinks('/about')

      const xDefaultLink = links.find((l) => l.hrefLang === 'x-default')
      expect(xDefaultLink).toBeDefined()
    })

    it('should normalize paths in hreflang links', () => {
      const links = getHreflangLinks('/About/')

      links.forEach((link) => {
        expect(link.href).toBe(`${BASE_URL}/about`)
      })
    })

    it('should handle root path', () => {
      const links = getHreflangLinks('/')

      expect(links).toContainEqual({
        hrefLang: 'en-US',
        href: `${BASE_URL}/`,
      })
    })
  })

  describe('getOpenGraphLocale', () => {
    it('should return OpenGraph locale with underscores', () => {
      const og = getOpenGraphLocale('en-US')

      expect(og.locale).toBe('en_US')
    })

    it('should return alternate locales', () => {
      const og = getOpenGraphLocale('en-US')

      expect(og.alternateLocale).toBeInstanceOf(Array)
      // Currently only one locale, so alternates should be empty
      // When more locales are added, this test will need updating
    })

    it('should exclude current locale from alternates', () => {
      const og = getOpenGraphLocale('en-US')

      expect(og.alternateLocale).not.toContain('en_US')
    })
  })

  describe('normalizePath', () => {
    it('should normalize simple path', () => {
      const path = normalizePath('/about')
      expect(path).toBe('/about')
    })

    it('should remove trailing slash', () => {
      const path = normalizePath('/about/')
      expect(path).toBe('/about')
    })

    it('should preserve root slash', () => {
      const path = normalizePath('/')
      expect(path).toBe('/')
    })

    it('should add leading slash', () => {
      const path = normalizePath('about')
      expect(path).toBe('/about')
    })

    it('should convert to lowercase', () => {
      const path = normalizePath('/About')
      expect(path).toBe('/about')
    })

    it('should remove multiple slashes', () => {
      const path = normalizePath('//about//page//')
      expect(path).toBe('/about/page')
    })

    it('should trim whitespace', () => {
      const path = normalizePath('  /about  ')
      expect(path).toBe('/about')
    })

    it('should handle complex paths', () => {
      const path = normalizePath('  /Blog/My-Post/  ')
      expect(path).toBe('/blog/my-post')
    })
  })

  describe('isCanonicalUrl', () => {
    it('should return true for canonical URL', () => {
      const url = `${BASE_URL}/about`
      const isCanonical = isCanonicalUrl(url, '/about')

      expect(isCanonical).toBe(true)
    })

    it('should return false for URL with trailing slash', () => {
      const url = `${BASE_URL}/about/`
      const isCanonical = isCanonicalUrl(url, '/about')

      expect(isCanonical).toBe(false)
    })

    it('should return false for uppercase URL', () => {
      const url = `${BASE_URL}/About`
      const isCanonical = isCanonicalUrl(url, '/about')

      expect(isCanonical).toBe(false)
    })

    it('should return false for wrong domain', () => {
      const url = 'https://example.com/about'
      const isCanonical = isCanonicalUrl(url, '/about')

      expect(isCanonical).toBe(false)
    })

    it('should return false for wrong path', () => {
      const url = `${BASE_URL}/contact`
      const isCanonical = isCanonicalUrl(url, '/about')

      expect(isCanonical).toBe(false)
    })

    it('should handle root path', () => {
      const url = `${BASE_URL}/`
      const isCanonical = isCanonicalUrl(url, '/')

      expect(isCanonical).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      const isCanonical = isCanonicalUrl('not-a-url', '/about')

      expect(isCanonical).toBe(false)
    })

    it('should handle paths with different cases', () => {
      const url = `${BASE_URL}/about`
      const isCanonical = isCanonicalUrl(url, '/About')

      expect(isCanonical).toBe(true) // Should normalize both and compare
    })
  })

  describe('Edge cases', () => {
    it('should handle empty string path', () => {
      const url = getCanonicalUrl('')
      expect(url).toBe(`${BASE_URL}/`)
    })

    it('should handle path with special characters', () => {
      const url = getCanonicalUrl('/blog/hello-world-2024')
      expect(url).toBe(`${BASE_URL}/blog/hello-world-2024`)
    })

    it('should handle path with numbers', () => {
      const url = getCanonicalUrl('/niches/123')
      expect(url).toBe(`${BASE_URL}/niches/123`)
    })

    it('should handle very long paths', () => {
      const longPath = '/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p'
      const url = getCanonicalUrl(longPath)
      expect(url).toBe(`${BASE_URL}${longPath}`)
    })
  })
})
