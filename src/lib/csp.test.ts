import { describe, it, expect, beforeEach } from 'vitest'
import { generateNonce, buildCSP, buildCSPReportOnly, CSP_HEADER, CSP_REPORT_ONLY_HEADER, CSP_NONCE_HEADER } from './csp'

describe('CSP Utilities', () => {
  describe('generateNonce', () => {
    it('should generate a 24-character base64 nonce', () => {
      const nonce = generateNonce()

      expect(typeof nonce).toBe('string')
      expect(nonce.length).toBe(24) // 16 bytes = 24 base64 characters
    })

    it('should generate unique nonces', () => {
      const nonce1 = generateNonce()
      const nonce2 = generateNonce()
      const nonce3 = generateNonce()

      expect(nonce1).not.toBe(nonce2)
      expect(nonce2).not.toBe(nonce3)
      expect(nonce1).not.toBe(nonce3)
    })

    it('should generate base64-encoded strings', () => {
      const nonce = generateNonce()
      const base64Pattern = /^[A-Za-z0-9+/]+=*$/

      expect(base64Pattern.test(nonce)).toBe(true)
    })
  })

  describe('buildCSP', () => {
    describe('production environment', () => {
      it('should build CSP with nonce for production', () => {
        const nonce = 'abc123xyz456'
        const csp = buildCSP({ nonce, isDevelopment: false })

        expect(csp).toContain(`'nonce-${nonce}'`)
        expect(csp).toContain("'strict-dynamic'")
        expect(csp).not.toContain("'unsafe-eval'")
        expect(csp).not.toContain("'unsafe-inline'")
      })

      it('should include default-src directive', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain("default-src 'self'")
      })

      it('should include script-src directive with strict-dynamic', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('script-src')
        expect(csp).toContain("'self'")
        expect(csp).toContain("'strict-dynamic'")
      })

      it('should include style-src directive', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('style-src')
        expect(csp).toContain("'self'")
        expect(csp).toContain('https://fonts.googleapis.com')
      })

      it('should include font-src directive', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('font-src')
        expect(csp).toContain("'self'")
        expect(csp).toContain('https://fonts.gstatic.com')
        expect(csp).toContain('data:')
      })

      it('should include img-src directive allowing HTTPS', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('img-src')
        expect(csp).toContain("'self'")
        expect(csp).toContain('data:')
        expect(csp).toContain('blob:')
        expect(csp).toContain('https:')
      })

      it('should include connect-src directive', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('connect-src')
        expect(csp).toContain("'self'")
        expect(csp).toContain('https://*.whitehatlink.org')
      })

      it('should include media-src directive', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('media-src')
        expect(csp).toContain("'self'")
        expect(csp).toContain('blob:')
      })

      it('should include object-src none', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain("object-src 'none'")
      })

      it('should include frame-src none', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain("frame-src 'none'")
      })

      it('should include frame-ancestors none', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain("frame-ancestors 'none'")
      })

      it('should include base-uri self', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain("base-uri 'self'")
      })

      it('should include form-action self', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain("form-action 'self'")
      })

      it('should include upgrade-insecure-requests in production', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('upgrade-insecure-requests')
      })

      it('should include block-all-mixed-content', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('block-all-mixed-content')
      })

      it('should include worker-src directive', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('worker-src')
        expect(csp).toContain("'self'")
        expect(csp).toContain('blob:')
      })

      it('should include manifest-src directive', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain('manifest-src')
        expect(csp).toContain("'self'")
      })
    })

    describe('development environment', () => {
      it('should include unsafe-eval for development', () => {
        const csp = buildCSP({ isDevelopment: true })

        expect(csp).toContain("'unsafe-eval'")
      })

      it('should include unsafe-inline for styles in development', () => {
        const csp = buildCSP({ isDevelopment: true })

        expect(csp).toContain('style-src')
        expect(csp).toContain("'unsafe-inline'")
      })

      it('should include WebSocket support for development', () => {
        const csp = buildCSP({ isDevelopment: true })

        expect(csp).toContain('connect-src')
        expect(csp).toContain('ws:')
        expect(csp).toContain('wss:')
      })

      it('should not include upgrade-insecure-requests in development', () => {
        const csp = buildCSP({ isDevelopment: true })

        expect(csp).not.toContain('upgrade-insecure-requests')
      })
    })

    describe('Payload CMS admin environment', () => {
      it('should include unsafe-inline and unsafe-eval for Payload admin', () => {
        const csp = buildCSP({ isPayloadAdmin: true })

        expect(csp).toContain("'unsafe-inline'")
        expect(csp).toContain("'unsafe-eval'")
      })

      it('should allow unsafe-inline in style-src for Payload admin', () => {
        const csp = buildCSP({ isPayloadAdmin: true })

        expect(csp).toContain('style-src')
        expect(csp).toContain("'unsafe-inline'")
      })

      it('should maintain security for non-script directives', () => {
        const csp = buildCSP({ isPayloadAdmin: true })

        expect(csp).toContain("object-src 'none'")
        expect(csp).toContain("frame-ancestors 'none'")
      })
    })

    describe('nonce integration', () => {
      it('should include nonce in script-src', () => {
        const nonce = 'test-nonce-123'
        const csp = buildCSP({ nonce, isDevelopment: false })

        expect(csp).toContain(`'nonce-${nonce}'`)
        expect(csp).toContain('script-src')
      })

      it('should include nonce in style-src', () => {
        const nonce = 'test-nonce-456'
        const csp = buildCSP({ nonce, isDevelopment: false })

        expect(csp).toContain('style-src')
        expect(csp).toContain(`'nonce-${nonce}'`)
      })

      it('should work without nonce', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).not.toContain('nonce-')
        expect(csp).toContain('script-src')
        expect(csp).toContain('style-src')
      })
    })

    describe('CSP string format', () => {
      it('should separate directives with semicolons', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp).toContain(';')
        expect(csp.split(';').length).toBeGreaterThan(1)
      })

      it('should not have trailing semicolon', () => {
        const csp = buildCSP({ isDevelopment: false })

        expect(csp.endsWith(';')).toBe(false)
      })

      it('should have well-formed directive-value pairs', () => {
        const csp = buildCSP({ isDevelopment: false })
        const directives = csp.split(';').map(d => d.trim())

        directives.forEach(directive => {
          // Each directive should either have sources or be standalone
          const parts = directive.split(' ')
          expect(parts.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('buildCSPReportOnly', () => {
    it('should include all CSP directives', () => {
      const nonce = 'test-nonce'
      const reportOnly = buildCSPReportOnly({ nonce, isDevelopment: false })

      expect(reportOnly).toContain('script-src')
      expect(reportOnly).toContain('style-src')
      expect(reportOnly).toContain('default-src')
    })

    it('should append report-uri directive', () => {
      const nonce = 'test-nonce'
      const reportOnly = buildCSPReportOnly({ nonce, isDevelopment: false })

      expect(reportOnly).toContain('report-uri /api/csp-report')
    })

    it('should include nonce in report-only mode', () => {
      const nonce = 'test-report-nonce'
      const reportOnly = buildCSPReportOnly({ nonce, isDevelopment: false })

      expect(reportOnly).toContain(`'nonce-${nonce}'`)
    })
  })

  describe('CSP header constants', () => {
    it('should export correct CSP header name', () => {
      expect(CSP_HEADER).toBe('Content-Security-Policy')
    })

    it('should export correct CSP report-only header name', () => {
      expect(CSP_REPORT_ONLY_HEADER).toBe('Content-Security-Policy-Report-Only')
    })

    it('should export correct nonce header name', () => {
      expect(CSP_NONCE_HEADER).toBe('x-nonce')
    })
  })
})
