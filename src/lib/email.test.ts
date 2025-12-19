import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Resend } from 'resend'
import {
  sendInquiryNotification,
  sendInquiryConfirmation,
  sendContactNotification,
  sendContactConfirmation,
  type InquiryEmailData,
  type ContactEmailData,
} from './email'

// Create a mock send function at module level
const mockSend = vi.fn()

// Mock Resend
vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = {
        send: mockSend,
      }
    },
  }
})

describe('Email Service', () => {
  const originalEnv = process.env.RESEND_API_KEY

  beforeEach(() => {
    vi.clearAllMocks()
    mockSend.mockReset()
    // Reset environment variable
    process.env.RESEND_API_KEY = 'test-resend-api-key'
  })

  afterEach(() => {
    // Restore environment variable
    process.env.RESEND_API_KEY = originalEnv
  })

  describe('sendInquiryNotification', () => {
    it('should send inquiry notification successfully', async () => {
      mockSend.mockResolvedValue({ id: 'test-email-id-123' })

      const inquiryData: InquiryEmailData = {
        email: 'customer@example.com',
        name: 'John Doe',
        url: 'https://example.com',
        message: 'I am interested in your service',
        budget: '$1000-$5000',
        itemId: 'item-123',
        source: 'website',
      }

      const result = await sendInquiryNotification(inquiryData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual({ id: 'test-email-id-123' })
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'notifications@whitehatlink.org',
          to: 'hello@whitehatlink.org',
          replyTo: 'customer@example.com',
          subject: 'New Inquiry from John Doe - $1000-$5000',
        })
      )
    })

    it('should skip email when RESEND_API_KEY is not configured', async () => {
      delete process.env.RESEND_API_KEY

      const inquiryData: InquiryEmailData = {
        email: 'customer@example.com',
        name: 'John Doe',
        url: 'https://example.com',
        message: 'Test message',
      }

      const result = await sendInquiryNotification(inquiryData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email service not configured')
    })

    it('should handle Resend API errors gracefully', async () => {
      mockSend.mockRejectedValue(new Error('API rate limit exceeded'))

      const inquiryData: InquiryEmailData = {
        email: 'customer@example.com',
        name: 'John Doe',
        url: 'https://example.com',
        message: 'Test message',
      }

      const result = await sendInquiryNotification(inquiryData)

      expect(result.success).toBe(false)
      expect(result.error).toBeInstanceOf(Error)
    })

    it('should handle optional fields correctly', async () => {
      mockSend.mockResolvedValue({ id: 'test-email-id' })

      const inquiryData: InquiryEmailData = {
        email: 'customer@example.com',
        name: undefined,
        url: undefined,
        message: undefined,
      }

      const result = await sendInquiryNotification(inquiryData)

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'New Inquiry from undefined - No budget specified',
        })
      )
    })
  })

  describe('sendInquiryConfirmation', () => {
    it('should send confirmation email successfully', async () => {
      mockSend.mockResolvedValue({ id: 'confirm-email-id' })

      const inquiryData: InquiryEmailData = {
        email: 'customer@example.com',
        name: 'John Doe',
        url: 'https://example.com',
        message: 'Test message',
      }

      const result = await sendInquiryConfirmation(inquiryData)

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'notifications@whitehatlink.org',
          to: 'customer@example.com',
          replyTo: 'hello@whitehatlink.org',
          subject: 'We received your inquiry - WhiteHatLinks',
        })
      )
    })

    it('should skip email when RESEND_API_KEY is not configured', async () => {
      delete process.env.RESEND_API_KEY

      const inquiryData: InquiryEmailData = {
        email: 'customer@example.com',
        name: 'John Doe',
        url: 'https://example.com',
        message: 'Test message',
      }

      const result = await sendInquiryConfirmation(inquiryData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email service not configured')
    })

    it('should handle errors during confirmation send', async () => {
      mockSend.mockRejectedValue(new Error('Network error'))

      const inquiryData: InquiryEmailData = {
        email: 'customer@example.com',
        name: 'John Doe',
        url: 'https://example.com',
        message: 'Test message',
      }

      const result = await sendInquiryConfirmation(inquiryData)

      expect(result.success).toBe(false)
      expect(result.error).toBeInstanceOf(Error)
    })
  })

  describe('sendContactNotification', () => {
    it('should send contact notification successfully', async () => {
      mockSend.mockResolvedValue({ id: 'contact-notify-id' })

      const contactData: ContactEmailData = {
        email: 'customer@example.com',
        name: 'Jane Smith',
        subject: 'Partnership Inquiry',
        message: 'I would like to discuss a partnership opportunity',
      }

      const result = await sendContactNotification(contactData)

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'notifications@whitehatlink.org',
          to: 'hello@whitehatlink.org',
          replyTo: 'customer@example.com',
          subject: 'Contact Form: Partnership Inquiry - Jane Smith',
        })
      )
    })

    it('should skip email when RESEND_API_KEY is not configured', async () => {
      delete process.env.RESEND_API_KEY

      const contactData: ContactEmailData = {
        email: 'customer@example.com',
        name: 'Jane Smith',
        subject: 'Partnership Inquiry',
        message: 'Test message',
      }

      const result = await sendContactNotification(contactData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email service not configured')
    })

    it('should handle API errors', async () => {
      mockSend.mockRejectedValue(new Error('Invalid API key'))

      const contactData: ContactEmailData = {
        email: 'customer@example.com',
        name: 'Jane Smith',
        subject: 'Partnership Inquiry',
        message: 'Test message',
      }

      const result = await sendContactNotification(contactData)

      expect(result.success).toBe(false)
      expect(result.error).toBeInstanceOf(Error)
    })
  })

  describe('sendContactConfirmation', () => {
    it('should send contact confirmation successfully', async () => {
      mockSend.mockResolvedValue({ id: 'contact-confirm-id' })

      const contactData: ContactEmailData = {
        email: 'customer@example.com',
        name: 'Jane Smith',
        subject: 'Partnership Inquiry',
        message: 'Test message',
      }

      const result = await sendContactConfirmation(contactData)

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'notifications@whitehatlink.org',
          to: 'customer@example.com',
          replyTo: 'hello@whitehatlink.org',
          subject: 'We received your message - WhiteHatLinks',
        })
      )
    })

    it('should skip email when RESEND_API_KEY is not configured', async () => {
      delete process.env.RESEND_API_KEY

      const contactData: ContactEmailData = {
        email: 'customer@example.com',
        name: 'Jane Smith',
        subject: 'Partnership Inquiry',
        message: 'Test message',
      }

      const result = await sendContactConfirmation(contactData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email service not configured')
    })

    it('should handle errors during confirmation send', async () => {
      mockSend.mockRejectedValue(new Error('Timeout'))

      const contactData: ContactEmailData = {
        email: 'customer@example.com',
        name: 'Jane Smith',
        subject: 'Partnership Inquiry',
        message: 'Test message',
      }

      const result = await sendContactConfirmation(contactData)

      expect(result.success).toBe(false)
      expect(result.error).toBeInstanceOf(Error)
    })
  })
})
