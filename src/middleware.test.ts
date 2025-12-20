import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from './middleware'

// Helper to create a test request
function createRequest(path: string, host = 'localhost:3000'): NextRequest {
  return new NextRequest(new URL(path, `http://${host}`))
}

describe('Middleware', () => {
  describe('URL Canonicalization', () => {
    describe('Trailing slash removal', () => {
      it('should redirect /about/ to /about', () => {
        const request = createRequest('/about/')
        const response = middleware(request)

        expect(response.status).toBe(308) // Permanent redirect
        const location = response.headers.get('location')
        expect(location).toBeTruthy()
        // Check that the path was normalized (no trailing slash)
        expect(location).toMatch(/\/about$/)
      })

      it('should not redirect root path', () => {
        const request = createRequest('/')
        const response = middleware(request)

        expect(response.status).not.toBe(308)
      })

      it('should handle nested paths with trailing slash', () => {
        const request = createRequest('/blog/my-post/')
        const response = middleware(request)

        expect(response.status).toBe(308)
        const location = response.headers.get('location')
        expect(location).toMatch(/\/blog\/my-post$/)
      })
    })

    describe('Multiple slash normalization', () => {
      it('should handle URL with double slashes in path', () => {
        // Note: Browser URL parsing normalizes // in protocol position
        // This test verifies the middleware handles paths correctly
        const request = createRequest('/about//page')
        const response = middleware(request)

        expect(response.status).toBe(308)
        expect(response.headers.get('location')).toBe('http://localhost:3000/about/page')
      })

      it('should normalize paths with multiple slashes', () => {
        const request = createRequest('/blog//post//123')
        const response = middleware(request)

        expect(response.status).toBe(308)
        expect(response.headers.get('location')).toContain('/blog/post/123')
      })
    })

    describe('Lowercase normalization', () => {
      it('should redirect /About to /about', () => {
        const request = createRequest('/About')
        const response = middleware(request)

        expect(response.status).toBe(308)
        expect(response.headers.get('location')).toBe('http://localhost:3000/about')
      })

      it('should redirect /BLOG/MY-POST to /blog/my-post', () => {
        const request = createRequest('/BLOG/MY-POST')
        const response = middleware(request)

        expect(response.status).toBe(308)
        expect(response.headers.get('location')).toBe('http://localhost:3000/blog/my-post')
      })

      it('should not redirect admin panel paths', () => {
        const request = createRequest('/admin/Dashboard')
        const response = middleware(request)

        // Should not redirect admin paths to maintain case-sensitive routes
        expect(response.status).not.toBe(308)
      })

      it('should preserve query parameters during lowercase redirect', () => {
        const request = createRequest('/About?page=1')
        const response = middleware(request)

        expect(response.status).toBe(308)
        expect(response.headers.get('location')).toBe('http://localhost:3000/about?page=1')
      })
    })

    describe('Combined normalizations', () => {
      it('should handle uppercase + trailing slash', () => {
        const request = createRequest('/About/')
        const response = middleware(request)

        expect(response.status).toBe(308)
        // Will redirect to remove trailing slash first
        const location = response.headers.get('location')
        expect(location).toMatch(/\/about/i)
      })

      it('should handle all normalizations at once', () => {
        const request = createRequest('//BLOG//My-Post/')
        const response = middleware(request)

        expect(response.status).toBe(308)
        // Will be redirected and normalized in steps
      })
    })
  })

  describe('Security Headers', () => {
    it('should set CSP header', () => {
      const request = createRequest('/about')
      const response = middleware(request)

      expect(response.headers.get('Content-Security-Policy')).toBeDefined()
      expect(response.headers.get('Content-Security-Policy')).toContain('default-src')
    })

    it('should set nonce header', () => {
      const request = createRequest('/about')
      const response = middleware(request)

      expect(response.headers.get('x-nonce')).toBeDefined()
      expect(response.headers.get('x-nonce')).toHaveLength(24) // base64 encoded 16 bytes
    })

    it('should set X-Frame-Options header', () => {
      const request = createRequest('/about')
      const response = middleware(request)

      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
    })

    it('should set X-Content-Type-Options header', () => {
      const request = createRequest('/about')
      const response = middleware(request)

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
    })

    it('should set X-XSS-Protection header', () => {
      const request = createRequest('/about')
      const response = middleware(request)

      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block')
    })

    it('should set Referrer-Policy header', () => {
      const request = createRequest('/about')
      const response = middleware(request)

      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    })

    it('should set Permissions-Policy header', () => {
      const request = createRequest('/about')
      const response = middleware(request)

      const policy = response.headers.get('Permissions-Policy')
      expect(policy).toContain('camera=()')
      expect(policy).toContain('microphone=()')
      expect(policy).toContain('geolocation=()')
    })

    it('should set different CSP for admin panel', () => {
      const adminRequest = createRequest('/admin/dashboard')
      const publicRequest = createRequest('/about')

      const adminResponse = middleware(adminRequest)
      const publicResponse = middleware(publicRequest)

      const adminCSP = adminResponse.headers.get('Content-Security-Policy')
      const publicCSP = publicResponse.headers.get('Content-Security-Policy')

      // Admin CSP should have unsafe-inline and unsafe-eval for Payload CMS
      expect(adminCSP).toContain('unsafe-inline')
      expect(adminCSP).toContain('unsafe-eval')

      // Public CSP should NOT have these
      expect(publicCSP).not.toContain('unsafe-inline')
      expect(publicCSP).not.toContain('unsafe-eval')
    })
  })

  describe('Edge Cases', () => {
    it('should handle paths with query parameters', () => {
      const request = createRequest('/inventory?page=1&sort=dr')
      const response = middleware(request)

      // Should not redirect if path is already canonical
      expect(response.status).not.toBe(308)
    })

    it('should handle paths with hash fragments', () => {
      const request = createRequest('/about#section')
      const response = middleware(request)

      // Should not redirect if path is already canonical
      expect(response.status).not.toBe(308)
    })

    it('should handle empty path', () => {
      const request = createRequest('/')
      const response = middleware(request)

      // Root path should work fine
      expect(response.status).not.toBe(308)
    })

    it('should handle very long paths', () => {
      const longPath = '/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p'
      const request = createRequest(longPath)
      const response = middleware(request)

      // Should not redirect if already canonical
      expect(response.status).not.toBe(308)
    })

    it('should handle paths with special characters', () => {
      const request = createRequest('/blog/hello-world-2024')
      const response = middleware(request)

      // Should not redirect if already canonical
      expect(response.status).not.toBe(308)
    })

    it('should handle paths with numbers', () => {
      const request = createRequest('/niches/123')
      const response = middleware(request)

      // Should not redirect if already canonical
      expect(response.status).not.toBe(308)
    })
  })

  describe('Redirect Status Code', () => {
    it('should use 308 Permanent Redirect', () => {
      const request = createRequest('/about/')
      const response = middleware(request)

      // 308 preserves the request method (POST stays POST)
      expect(response.status).toBe(308)
    })
  })
})
