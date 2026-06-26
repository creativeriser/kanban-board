import { cn } from '../../lib/utils'

export function Card({ className, children, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn('rounded-lg border border-border bg-surface dark:bg-surface/95 dark:backdrop-blur-xl shadow-card dark:shadow-dark-card transition-colors', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
