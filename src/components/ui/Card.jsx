import { cn } from '../../lib/utils'

export function Card({ className, children, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn('rounded-xl border border-border/60 bg-surface/80 backdrop-blur-md shadow-card dark:shadow-dark-card transition-colors', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
