import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Input = forwardRef(function Input({ className, label, id, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'h-10 rounded border border-border/80 bg-canvas dark:bg-surface/50 px-3 text-[14px] text-ink-900 placeholder:text-ink-400 shadow-xs',
          'transition-all outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface/50',
          className
        )}
        {...props}
      />
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ className, label, id, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'rounded border border-border/80 bg-canvas dark:bg-surface/50 px-3 py-2 text-[14px] text-ink-900 placeholder:text-ink-400 shadow-xs',
          'transition-all outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-0 resize-none',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface/50',
          className
        )}
        {...props}
      />
    </div>
  )
})

export const Select = forwardRef(function Select({ className, label, id, children, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn(
            'h-10 w-full appearance-none rounded border border-border/80 bg-canvas dark:bg-surface/50 px-3 pr-9 text-[14px] text-ink-900 shadow-xs',
            'transition-all outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface/50',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
      </div>
    </div>
  )
})
