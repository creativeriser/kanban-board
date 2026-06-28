import { Popover } from './Popover'
import { cn } from '../../lib/utils'

export function DropdownMenu({ trigger, children, align = 'right', className }) {
  return (
    <Popover trigger={trigger} align={align} className={cn("w-56 p-1", className)}>
      {children}
    </Popover>
  )
}

export function DropdownItem({ children, onClick, icon: Icon, className, destructive }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors outline-none",
        destructive 
          ? "text-ember-600 hover:bg-ember-50 dark:hover:bg-ember-500/10" 
          : "text-ink-700 hover:bg-ink-900/5 hover:text-ink-900 dark:hover:bg-white/5",
        className
      )}
    >
      {Icon && <Icon size={15} className={destructive ? "text-ember-500" : "text-ink-400"} />}
      {children}
    </button>
  )
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-border" />
}
