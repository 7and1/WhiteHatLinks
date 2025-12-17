'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface DialogContextValue {
  open: boolean
  onOpenChange?: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue>({ open: false })

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  const value = useMemo(() => ({ open, onOpenChange }), [open, onOpenChange])
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const { onOpenChange } = useContext(DialogContext)
  if (!onOpenChange) return children
  const child = React.Children.only(children)
  const props = {
    onClick: (e: React.MouseEvent) => {
      child.props.onClick?.(e)
      onOpenChange(true)
    },
  }
  return asChild ? React.cloneElement(child, props) : <button {...props}>{children}</button>
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, onOpenChange } = useContext(DialogContext)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className={cn('w-full max-w-lg rounded-lg border bg-white p-6 shadow-xl', className)}>
        <button className="absolute right-4 top-4 text-sm" onClick={() => onOpenChange?.(false)} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 space-y-1">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold leading-none tracking-tight">{children}</h3>
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>
}
