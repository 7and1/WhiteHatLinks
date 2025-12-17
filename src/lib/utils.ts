import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind class names with predictable override order
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
