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

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }> }) {
  const { onOpenChange } = useContext(DialogContext)
  if (!onOpenChange) return children
  const child = React.Children.only(children) as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange?.(false)
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={cn('relative w-full max-w-lg rounded-lg border bg-white p-6 shadow-xl', className)}>
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => onOpenChange?.(false)}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
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
