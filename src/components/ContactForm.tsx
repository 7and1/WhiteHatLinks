'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/inquire', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast.success('Message sent successfully!', {
        description: 'We will get back to you within 12 hours.'
      })

      // Reset form
      e.currentTarget.reset()
    } catch (err) {
      toast.error('Failed to send message', {
        description: 'Please try again or email hello@whitehatlink.org directly.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="source" value="contact_page" />
      <input
        type="text"
        name="company_name"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isSubmitting}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Work email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isSubmitting}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="name@company.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
          Website URL
        </label>
        <input
          type="url"
          id="website"
          name="url"
          disabled={isSubmitting}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="https://your-website.com"
        />
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
          Monthly budget
        </label>
        <select
          id="budget"
          name="budget"
          disabled={isSubmitting}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select a range</option>
          <option value="1000-3000">$1,000 - $3,000</option>
          <option value="3000-5000">$3,000 - $5,000</option>
          <option value="5000-10000">$5,000 - $10,000</option>
          <option value="10000+">$10,000+</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          disabled={isSubmitting}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Tell us about your link building goals..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Send message'
        )}
      </button>
    </form>
  )
}
