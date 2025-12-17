'use client'

export type ToastInput = { title?: string; description?: string }

export function useToast() {
  const toast = ({ title, description }: ToastInput) => {
    const message = [title, description].filter(Boolean).join(' - ')
    if (typeof window !== 'undefined') {
      // lightweight fallback instead of full toast system
      window.alert(message || 'Action completed')
    } else {
      console.log(message)
    }
  }
  return { toast }
}
