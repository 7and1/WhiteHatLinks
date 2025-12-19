/**
 * CSP Violation Report Endpoint
 *
 * This endpoint receives Content Security Policy violation reports
 * from browsers when CSP rules are violated.
 *
 * In production, you should:
 * 1. Log violations to a monitoring service (e.g., Sentry, Datadog)
 * 2. Analyze patterns to identify issues
 * 3. Update CSP rules based on legitimate violations
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * CSP Violation Report structure
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri
 */
interface CSPReport {
  'csp-report': {
    'blocked-uri'?: string
    'document-uri'?: string
    'effective-directive'?: string
    'original-policy'?: string
    'referrer'?: string
    'status-code'?: number
    'violated-directive'?: string
    'source-file'?: string
    'line-number'?: number
    'column-number'?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse CSP violation report
    const report: CSPReport = await request.json()

    // Extract key information
    const violation = report['csp-report']
    const blockedUri = violation['blocked-uri'] || 'unknown'
    const violatedDirective = violation['violated-directive'] || violation['effective-directive'] || 'unknown'
    const documentUri = violation['document-uri'] || 'unknown'
    const sourceFile = violation['source-file'] || 'unknown'

    // In production, send to monitoring service
    // Example with console (replace with your monitoring service)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service
      // await sendToMonitoring({
      //   type: 'csp-violation',
      //   blockedUri,
      //   violatedDirective,
      //   documentUri,
      //   sourceFile,
      //   timestamp: new Date().toISOString(),
      // })

      // For now, just log in production
      console.warn('[CSP Violation]', {
        blockedUri,
        violatedDirective,
        documentUri,
        sourceFile,
        timestamp: new Date().toISOString(),
      })
    } else {
      // In development, log full details
      console.warn('[CSP Violation - Development]', violation)
    }

    // Return 204 No Content (standard for CSP reports)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[CSP Report Error]', error)
    // Still return 204 to avoid browser retries
    return new NextResponse(null, { status: 204 })
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
