'use client'
import React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'outline' | 'ghost'

type Size = 'sm' | 'md'

const base = 'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 disabled:cursor-not-allowed'
const variants: Record<Variant, string> = {
  default: 'bg-primary text-white hover:bg-primary/90',
  outline: 'border border-border hover:bg-muted/60',
  ghost: 'hover:bg-muted/50',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  ),
)
Button.displayName = 'Button'
