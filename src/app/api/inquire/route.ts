import { NextResponse } from 'next/server'
import { validateInquiry } from '@/lib/validation'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(clientIp, {
      maxRequests: 5,
      windowMs: 60 * 1000, // 5 requests per minute
    })

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
      console.log('Honeypot triggered', { ip: clientIp })
      return NextResponse.json({ ok: true })
    }

    // Log the inquiry (in production, this would send to CRM/email)
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

    // TODO: Integrate with email service (Resend, etc.) in production
    // Example:
    // await resend.emails.send({
    //   from: 'notifications@whitehatlinks.io',
    //   to: 'team@whitehatlinks.io',
    //   subject: `New inquiry from ${validation.data.email}`,
    //   text: `...`,
    // })

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
      { error: 'An unexpected error occurred. Please try again or email hello@whitehatlinks.io' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
