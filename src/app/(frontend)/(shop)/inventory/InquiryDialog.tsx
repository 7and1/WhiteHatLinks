'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export function InquiryDialog({ item }: { item: any }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    formData.append('itemId', item.id)
    try {
      await fetch('/api/inquire', { method: 'POST', body: formData })
      toast({ title: 'Request received', description: `We will send the domain and invoice for ${item.niche}.` })
    } catch (err) {
      toast({ title: 'Failed to send', description: 'Please email hello@whitehatlink.org' })
    }
    setOpen(false)
  }

  return (
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
            <Input id="email" name="email" type="email" required placeholder="name@company.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">Target URL</Label>
            <Input id="url" name="url" required placeholder="https://your-site.com/pricing" />
          </div>
          <DialogFooter>
            <Button type="submit">Submit request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
