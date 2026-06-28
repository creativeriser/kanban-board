import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const VARIANTS = {
  primary: 'bg-ink-900 text-canvas hover:bg-ink-900/90 shadow-sm border border-transparent dark:border-white/10',
  brand: 'bg-brand-600 text-canvas hover:bg-brand-700 shadow-sm border border-transparent dark:border-white/10',
  secondary: 'bg-surface text-ink-900 border border-border/80 hover:bg-ink-900/5 dark:hover:bg-white/5 shadow-sm',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-900/5 dark:hover:bg-white/5 hover:text-ink-900 dark:hover:text-ink-900',
  danger: 'bg-surface text-ember-600 border border-ember-200 hover:bg-ember-100/50 shadow-sm dark:border-ember-500/20 dark:hover:bg-ember-500/10 dark:text-ember-400',
}

const SIZES = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-9 px-4 text-[14px] gap-2',
  lg: 'h-11 px-5 text-[15px] gap-2.5',
  icon: 'h-9 w-9 justify-center',
}

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-canvas',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
