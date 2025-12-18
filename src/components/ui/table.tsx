import * as React from 'react'
import { cn } from '@/lib/utils'

type TableElement = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableElement>, HTMLTableElement>

export function Table({ className, ...props }: TableElement) {
  return <table className={cn('w-full border-collapse text-sm', className)} {...props} />
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-muted/40 text-left border-b-2 border-border/50', className)} {...props} />
}

export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-t last:border-b-0', className)} {...props} />
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('px-4 py-3.5 font-semibold text-xs uppercase tracking-wider text-foreground/70', className)} {...props} />
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3 align-middle', className)} {...props} />
}

export function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn('sr-only', className)} {...props} />
}
