import { cn } from '../../lib/utils'
import { useGoalStore } from '../../store/useGoalStore'

const PRIORITY_CONFIG = {
  high: { color: 'bg-ember-500', label: 'High' },
  medium: { color: 'bg-amber-500', label: 'Medium' },
  low: { color: 'bg-moss-500', label: 'Low' },
}

export function PriorityDot({ priority, showLabel = false, className, onClick }) {
  const cfg = PRIORITY_CONFIG[priority]
  const Comp = onClick ? 'button' : 'span'
  return (
    <Comp 
      onClick={onClick}
      className={cn('inline-flex items-center gap-1.5', onClick && 'cursor-pointer hover:bg-ink-900/5 rounded px-1.5 py-0.5 -ml-1.5 transition-colors', className)}
    >
      <span className={cn('h-2 w-2 rounded-full', cfg.color)} />
      {showLabel && <span className="text-[12px] font-medium text-ink-600">{cfg.label}</span>}
    </Comp>
  )
}

const CAT_TONE = {
  moss: 'bg-moss-100 text-moss-700',
  ember: 'bg-ember-100 text-ember-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  amber: 'bg-amber-100 text-amber-600',
}

export function CategoryTag({ category, className }) {
  const categories = useGoalStore((s) => s.categories)
  const cfg = categories.find((c) => c.id === category)
  
  if (!cfg) return null
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium', CAT_TONE[cfg.color] || 'bg-ink-900/5 text-ink-700 dark:bg-white/5 dark:text-ink-300', className)}>
      {cfg.label}
    </span>
  )
}
