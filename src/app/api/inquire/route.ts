import { NextResponse } from 'next/server'
import { validateInquiry } from '@/lib/validation'
import { checkRateLimit, getClientIp, createRateLimitKey } from '@/lib/rate-limit-factory'
import { sendInquiryNotification, sendInquiryConfirmation } from '@/lib/email'
import type { CloudflareEnv } from '@/types/cloudflare'

export async function POST(request: Request) {
  try {
    // Get Cloudflare bindings (available via @opennextjs/cloudflare)
    const env = (request as { env?: CloudflareEnv }).env

    // Rate limiting
    const rateLimitKey = createRateLimitKey(request, 'inquire')
    const rateLimitResult = await checkRateLimit(request, rateLimitKey, {
      maxRequests: 5,
      windowMs: 60 * 1000, // 5 requests per minute
    }, env)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          },
        }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const data = {
      email: formData.get('email')?.toString() || '',
      url: formData.get('url')?.toString() || '',
      name: formData.get('name')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      budget: formData.get('budget')?.toString() || '',
      itemId: formData.get('itemId')?.toString() || '',
      source: formData.get('source')?.toString() || '',
      company_name: formData.get('company_name')?.toString() || '', // Honeypot
    }

    // Validation
    const validation = validateInquiry(data)
    if (!validation.success) {
      const errors = validation.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 })
    }

    // Honeypot check - if company_name is filled, it's likely a bot
    if (data.company_name) {
      // Silently accept but don't process
      const clientIp = getClientIp(request)
      console.log('Honeypot triggered', { ip: clientIp })
      return NextResponse.json({ ok: true })
    }

    // Log the inquiry
    const clientIp = getClientIp(request)
    console.log('Inquiry received', {
      email: validation.data.email,
      url: validation.data.url,
      name: validation.data.name,
      message: validation.data.message?.substring(0, 100),
      budget: validation.data.budget,
      itemId: validation.data.itemId,
      source: validation.data.source,
      ip: clientIp,
      timestamp: new Date().toISOString(),
    })

    // Send email notifications
    const emailData = {
      email: validation.data.email,
      name: validation.data.name,
      url: validation.data.url,
      message: validation.data.message,
      budget: validation.data.budget,
      itemId: validation.data.itemId,
      source: validation.data.source,
    }

    // Send notification to team (non-blocking - don't wait for it)
    sendInquiryNotification(emailData).catch(err => {
      console.error('Failed to send team notification:', err)
    })

    // Send confirmation to customer (non-blocking)
    sendInquiryConfirmation(emailData).catch(err => {
      console.error('Failed to send customer confirmation:', err)
    })

    return NextResponse.json(
      { ok: true, message: 'Your request has been received. We will respond within 12 hours.' },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.resetTime),
        },
      }
    )
  } catch (error) {
    console.error('Error processing inquiry:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or email hello@whitehatlink.org' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
