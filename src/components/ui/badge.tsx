import { cn } from '@/lib/utils'

type Variant = 'default' | 'outline'

const variants: Record<Variant, string> = {
  default: 'bg-primary text-white',
  outline: 'border border-border text-foreground bg-transparent',
}

export function Badge({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string; variant?: Variant }) {
  return <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold', variants[variant], className)}>{children}</span>
}
