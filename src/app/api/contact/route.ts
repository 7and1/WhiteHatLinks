import { NextResponse } from 'next/server'
import { validateContact } from '@/lib/validation'
import { checkRateLimit, getClientIp, createRateLimitKey } from '@/lib/rate-limit-factory'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'
import type { CloudflareEnv } from '@/types/cloudflare'

export async function POST(request: Request) {
  try {
    // Get Cloudflare bindings (available via @opennextjs/cloudflare)
    const env = (request as { env?: CloudflareEnv }).env

    // Rate limiting
    const rateLimitKey = createRateLimitKey(request, 'contact')
    const rateLimitResult = await checkRateLimit(request, rateLimitKey, {
      maxRequests: 3,
      windowMs: 60 * 1000, // 3 requests per minute (stricter than inquiry)
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
      name: formData.get('name')?.toString() || '',
      subject: formData.get('subject')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      company_name: formData.get('company_name')?.toString() || '', // Honeypot
    }

    // Validation
    const validation = validateContact(data)
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
      console.log('Honeypot triggered (contact)', { ip: clientIp })
      return NextResponse.json({ ok: true, message: 'Thank you for your message. We will respond within 24 hours.' })
    }

    // Log the contact submission
    const clientIp = getClientIp(request)
    console.log('Contact form submission received', {
      email: validation.data.email,
      name: validation.data.name,
      subject: validation.data.subject,
      message: validation.data.message?.substring(0, 100),
      ip: clientIp,
      timestamp: new Date().toISOString(),
    })

    // Send email notifications
    const emailData = {
      email: validation.data.email,
      name: validation.data.name,
      subject: validation.data.subject,
      message: validation.data.message,
    }

    // Send notification to team (non-blocking)
    sendContactNotification(emailData).catch(err => {
      console.error('Failed to send contact team notification:', err)
    })

    // Send confirmation to customer (non-blocking)
    sendContactConfirmation(emailData).catch(err => {
      console.error('Failed to send contact confirmation:', err)
    })

    return NextResponse.json(
      { ok: true, message: 'Thank you for your message. We will respond within 24 hours.' },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.resetTime),
        },
      }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
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
