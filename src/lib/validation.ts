import { z } from 'zod'

export const inquirySchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email is required')
    .max(255, 'Email is too long'),
  url: z
    .string()
    .url('Please enter a valid URL')
    .min(10, 'URL is required')
    .max(500, 'URL is too long')
    .optional()
    .or(z.literal('')),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .optional()
    .or(z.literal('')),
  message: z.string().max(5000, 'Message is too long').optional().or(z.literal('')),
  budget: z.string().max(50, 'Budget selection is too long').optional().or(z.literal('')),
  itemId: z.string().max(50, 'Item ID is too long').optional().or(z.literal('')),
  source: z.string().max(50, 'Source is too long').optional().or(z.literal('')),
  // Honeypot field - should be empty
  company_name: z.string().max(0, 'This field should be empty').optional().or(z.literal('')),
})

export type InquiryInput = z.infer<typeof inquirySchema>

export function validateInquiry(data: unknown) {
  return inquirySchema.safeParse(data)
}

// Contact form validation schema
export const contactSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email is required')
    .max(255, 'Email is too long'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject is too long')
    .optional()
    .or(z.literal(''))
    .transform(val => val || 'General inquiry'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long'),
  // Honeypot field - should be empty
  company_name: z.string().max(0, 'This field should be empty').optional().or(z.literal('')),
})

export type ContactInput = z.infer<typeof contactSchema>

export function validateContact(data: unknown) {
  return contactSchema.safeParse(data)
}
