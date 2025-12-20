'use client'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Script from 'next/script'
import type { InventoryItem } from '@/lib/inventory-source'

// Cloudflare Turnstile global type
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string
        callback?: (token: string) => void
        'error-callback'?: () => void
        'expired-callback'?: () => void
        theme?: 'light' | 'dark' | 'auto'
        size?: 'normal' | 'compact'
      }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export function InquiryDialog({ item }: { item: InventoryItem }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileLoaded, setTurnstileLoaded] = useState(false)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  // Default target URL to item's domain
  const defaultTargetUrl = item.domain ? `https://${item.domain}` : ''

  // Initialize Turnstile when dialog opens
  useEffect(() => {
    if (open && turnstileLoaded && turnstileRef.current && !widgetIdRef.current) {
      const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

      if (window.turnstile) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey,
          callback: (token: string) => {
            setTurnstileToken(token)
          },
          'error-callback': () => {
            setTurnstileToken(null)
            toast.error('Verification failed', {
              description: 'Please try again'
            })
          },
          'expired-callback': () => {
            setTurnstileToken(null)
          },
          theme: 'auto',
          size: 'normal'
        })
      }
    }

    // Cleanup when dialog closes
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [open, turnstileLoaded])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate Turnstile token
    if (!turnstileToken) {
      toast.error('Verification required', {
        description: 'Please complete the verification'
      })
      return
    }

    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('itemId', item.id)
    formData.append('cf-turnstile-response', turnstileToken)

    try {
      const response = await fetch('/api/inquire', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit request')
      }

      toast.success('Request received!', {
        description: `We will send the domain and invoice for ${item.niche}.`
      })

      setOpen(false)
      e.currentTarget.reset()
      setTurnstileToken(null)
    } catch (err) {
      toast.error('Failed to send request', {
        description: err instanceof Error ? err.message : 'Please try again or email hello@whitehatlink.org'
      })

      // Reset Turnstile on error
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
        setTurnstileToken(null)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Load Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        onLoad={() => setTurnstileLoaded(true)}
        strategy="lazyOnload"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">Request Slot</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request access · {item.niche} (DR {item.dr})</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                name="url"
                required
                defaultValue={defaultTargetUrl}
                placeholder="https://your-site.com/pricing"
                disabled={isSubmitting}
              />
            </div>

            {/* Turnstile widget */}
            <div className="flex justify-center">
              <div ref={turnstileRef} />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || !turnstileToken}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
