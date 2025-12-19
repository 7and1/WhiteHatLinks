import { Resend } from 'resend'

// Lazy initialization of Resend client to avoid build-time errors
// In production, set RESEND_API_KEY as a Cloudflare Worker secret using:
// wrangler secret put RESEND_API_KEY
let resendInstance: Resend | null = null

function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

// Email addresses
const FROM_EMAIL = 'notifications@whitehatlink.org'
const TO_EMAIL = 'hello@whitehatlink.org'
const REPLY_TO_EMAIL = 'hello@whitehatlink.org'

export interface InquiryEmailData {
  email: string
  name: string | undefined
  url: string | undefined
  message: string | undefined
  budget?: string
  itemId?: string
  source?: string
}

export interface ContactEmailData {
  email: string
  name: string
  subject: string
  message: string
}

/**
 * Send inquiry notification to team
 */
export async function sendInquiryNotification(data: InquiryEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping email.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const emailContent = generateInquiryEmailHTML(data)
    const resend = getResendClient()

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email,
      subject: `New Inquiry from ${data.name} - ${data.budget || 'No budget specified'}`,
      html: emailContent,
      text: generateInquiryEmailText(data),
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send inquiry notification:', error)
    return { success: false, error }
  }
}

/**
 * Send confirmation email to customer
 */
export async function sendInquiryConfirmation(data: InquiryEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping email.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const resend = getResendClient()
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      replyTo: REPLY_TO_EMAIL,
      subject: 'We received your inquiry - WhiteHatLinks',
      html: generateConfirmationEmailHTML(data),
      text: generateConfirmationEmailText(data),
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    return { success: false, error }
  }
}

/**
 * Send contact form notification to team
 */
export async function sendContactNotification(data: ContactEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping email.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const resend = getResendClient()
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email,
      subject: `Contact Form: ${data.subject} - ${data.name}`,
      html: generateContactEmailHTML(data),
      text: generateContactEmailText(data),
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send contact notification:', error)
    return { success: false, error }
  }
}

/**
 * Send contact form confirmation to customer
 */
export async function sendContactConfirmation(data: ContactEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping email.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const resend = getResendClient()
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      replyTo: REPLY_TO_EMAIL,
      subject: 'We received your message - WhiteHatLinks',
      html: generateContactConfirmationHTML(data),
      text: generateContactConfirmationText(data),
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send contact confirmation:', error)
    return { success: false, error }
  }
}

// HTML Email Templates
function generateInquiryEmailHTML(data: InquiryEmailData): string {
  const name = data.name || 'Not provided'
  const url = data.url || 'Not provided'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Inquiry Received</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #667eea; margin-top: 0; margin-bottom: 20px; font-size: 18px;">Contact Information</h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${data.email}" style="color: #667eea;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Website:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${url === 'Not provided' ? url : `<a href="${url}" style="color: #667eea;" target="_blank">${url}</a>`}</td>
        </tr>
        ${data.budget ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Budget:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.budget}</td>
        </tr>
        ` : ''}
        ${data.itemId ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Item ID:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.itemId}</td>
        </tr>
        ` : ''}
        ${data.source ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Source:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.source}</td>
        </tr>
        ` : ''}
      </table>

      <h2 style="color: #667eea; margin-top: 30px; margin-bottom: 15px; font-size: 18px;">Message</h2>
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea;">
        <p style="margin: 0; white-space: pre-wrap;">${data.message || 'No message provided'}</p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <a href="mailto:${data.email}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Reply to ${name}</a>
      </div>
    </div>

    <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p>This inquiry was submitted via WhiteHatLinks inventory.</p>
      <p style="margin-top: 10px;">
        <a href="https://whitehatlink.org" style="color: #667eea; text-decoration: none;">WhiteHatLinks.org</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function generateInquiryEmailText(data: InquiryEmailData): string {
  const name = data.name || 'Not provided'
  const url = data.url || 'Not provided'

  return `
New Inquiry Received

Contact Information:
-------------------
Name: ${name}
Email: ${data.email}
Website: ${url}
${data.budget ? `Budget: ${data.budget}` : ''}
${data.itemId ? `Item ID: ${data.itemId}` : ''}
${data.source ? `Source: ${data.source}` : ''}

Message:
--------
${data.message || 'No message provided'}

---
Reply to: ${data.email}
WhiteHatLinks.org
  `.trim()
}

function generateConfirmationEmailHTML(data: InquiryEmailData): string {
  const name = data.name || 'there'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for your inquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">We Received Your Inquiry!</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <p style="margin-top: 0; font-size: 16px;">Hi ${name},</p>

      <p>Thank you for your interest in WhiteHatLinks! We've received your inquiry and our team will review it shortly.</p>

      <div style="background: #f0f9ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: 500; color: #667eea;">⏱️ Expected Response Time: Within 12 hours</p>
      </div>

      <h3 style="color: #667eea; margin-top: 25px; margin-bottom: 10px;">What happens next?</h3>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li>Our team will review your requirements</li>
        <li>We'll prepare a customized proposal with relevant opportunities</li>
        <li>You'll receive a detailed response via email</li>
      </ul>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px;"><strong>📧 Add us to your contacts:</strong> To ensure you receive our response, please add <strong>hello@whitehatlink.org</strong> to your contacts or safe senders list.</p>
      </div>

      <p>In the meantime, feel free to:</p>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li><a href="https://whitehatlink.org/inventory" style="color: #667eea;">Browse our inventory</a></li>
        <li><a href="https://whitehatlink.org/services" style="color: #667eea;">Learn about our services</a></li>
        <li><a href="https://whitehatlink.org/blog" style="color: #667eea;">Read our blog</a></li>
      </ul>

      <p style="margin-top: 25px;">If you have any urgent questions, please reply to this email.</p>

      <p style="margin-bottom: 0;">Best regards,<br><strong>The WhiteHatLinks Team</strong></p>
    </div>

    <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p>
        <a href="https://whitehatlink.org" style="color: #667eea; text-decoration: none;">WhiteHatLinks.org</a> |
        <a href="mailto:hello@whitehatlink.org" style="color: #667eea; text-decoration: none;">hello@whitehatlink.org</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function generateConfirmationEmailText(data: InquiryEmailData): string {
  const name = data.name || 'there'

  return `
We Received Your Inquiry!

Hi ${name},

Thank you for your interest in WhiteHatLinks! We've received your inquiry and our team will review it shortly.

Expected Response Time: Within 12 hours

What happens next?
- Our team will review your requirements
- We'll prepare a customized proposal with relevant opportunities
- You'll receive a detailed response via email

Add us to your contacts: To ensure you receive our response, please add hello@whitehatlink.org to your contacts or safe senders list.

In the meantime, feel free to:
- Browse our inventory: https://whitehatlink.org/inventory
- Learn about our services: https://whitehatlink.org/services
- Read our blog: https://whitehatlink.org/blog

If you have any urgent questions, please reply to this email.

Best regards,
The WhiteHatLinks Team

WhiteHatLinks.org | hello@whitehatlink.org
  `.trim()
}

function generateContactEmailHTML(data: ContactEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #667eea; margin-top: 0; margin-bottom: 20px; font-size: 18px;">Contact Details</h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${data.email}" style="color: #667eea;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Subject:</strong></td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.subject}</td>
        </tr>
      </table>

      <h2 style="color: #667eea; margin-top: 30px; margin-bottom: 15px; font-size: 18px;">Message</h2>
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea;">
        <p style="margin: 0; white-space: pre-wrap;">${data.message || 'No message provided'}</p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <a href="mailto:${data.email}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Reply to ${data.name}</a>
      </div>
    </div>

    <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p>This message was submitted via the WhiteHatLinks contact form.</p>
      <p style="margin-top: 10px;">
        <a href="https://whitehatlink.org" style="color: #667eea; text-decoration: none;">WhiteHatLinks.org</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function generateContactEmailText(data: ContactEmailData): string {
  return `
New Contact Form Submission

Contact Details:
---------------
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
--------
${data.message || 'No message provided'}

---
Reply to: ${data.email}
WhiteHatLinks.org
  `.trim()
}

function generateContactConfirmationHTML(data: ContactEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for contacting us</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Thank You for Contacting Us!</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <p style="margin-top: 0; font-size: 16px;">Hi ${data.name},</p>

      <p>Thank you for reaching out to WhiteHatLinks! We've received your message and will get back to you as soon as possible.</p>

      <div style="background: #f0f9ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: 500; color: #667eea;">⏱️ Expected Response Time: Within 24 hours</p>
      </div>

      <p>Our team is reviewing your message regarding: <strong>${data.subject}</strong></p>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px;"><strong>📧 Check your spam folder:</strong> Sometimes our replies end up in spam. Please check there if you don't see our response in your inbox.</p>
      </div>

      <p style="margin-top: 25px;">If you have any urgent questions, feel free to reply to this email.</p>

      <p style="margin-bottom: 0;">Best regards,<br><strong>The WhiteHatLinks Team</strong></p>
    </div>

    <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p>
        <a href="https://whitehatlink.org" style="color: #667eea; text-decoration: none;">WhiteHatLinks.org</a> |
        <a href="mailto:hello@whitehatlink.org" style="color: #667eea; text-decoration: none;">hello@whitehatlink.org</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function generateContactConfirmationText(data: ContactEmailData): string {
  return `
Thank You for Contacting Us!

Hi ${data.name},

Thank you for reaching out to WhiteHatLinks! We've received your message and will get back to you as soon as possible.

Expected Response Time: Within 24 hours

Our team is reviewing your message regarding: ${data.subject}

Check your spam folder: Sometimes our replies end up in spam. Please check there if you don't see our response in your inbox.

If you have any urgent questions, feel free to reply to this email.

Best regards,
The WhiteHatLinks Team

WhiteHatLinks.org | hello@whitehatlink.org
  `.trim()
}
