'use client'

import { toast as sonnerToast } from 'sonner'

export type ToastInput = {
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
}

export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastInput) => {
    const message = title || 'Notification'

    switch (variant) {
      case 'success':
        sonnerToast.success(message, { description })
        break
      case 'error':
        sonnerToast.error(message, { description })
        break
      case 'warning':
        sonnerToast.warning(message, { description })
        break
      default:
        sonnerToast(message, { description })
    }
  }

  return { toast }
}
