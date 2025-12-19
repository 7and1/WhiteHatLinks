import { describe, it, expect } from 'vitest'
import { validateInquiry, validateContact } from './validation'

describe('Validation', () => {
  describe('validateInquiry', () => {
    it('should validate correct inquiry data', () => {
      const validData = {
        email: 'test@example.com',
        url: 'https://example.com',
        name: 'John Doe',
        message: 'Test message',
        budget: '1000-3000',
        itemId: '123',
        source: 'inventory',
        company_name: '',
      }

      const result = validateInquiry(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        url: 'https://example.com',
        name: 'John Doe',
        message: 'Test',
      }

      const result = validateInquiry(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject honeypot filled', () => {
      const spamData = {
        email: 'test@example.com',
        url: 'https://example.com',
        name: 'John Doe',
        message: 'Test',
        company_name: 'Spam Company',
      }

      const result = validateInquiry(spamData)
      expect(result.success).toBe(false)
    })
  })

  describe('validateContact', () => {
    it('should validate correct contact data', () => {
      const validData = {
        email: 'test@example.com',
        name: 'John Doe',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
        company_name: '',
      }

      const result = validateContact(validData)
      expect(result.success).toBe(true)
    })

    it('should require minimum message length', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'John Doe',
        subject: 'Test',
        message: 'Short',
      }

      const result = validateContact(invalidData)
      expect(result.success).toBe(false)
    })

    it('should default subject if empty', () => {
      const data = {
        email: 'test@example.com',
        name: 'John Doe',
        subject: '',
        message: 'This is a test message with enough characters',
        company_name: '',
      }

      const result = validateContact(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.subject).toBe('General inquiry')
      }
    })
  })
})
