import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Pencil, Trash2, GripVertical } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '../../lib/utils'

export function MilestoneRow({ milestone, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(milestone.title)

  function handleSave(e) {
    e.preventDefault()
    if (!draft.trim()) return
    onUpdate(milestone.id, draft.trim())
    setIsEditing(false)
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: milestone.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 rounded-lg border bg-surface px-4 py-3 transition-colors',
        isDragging ? 'border-brand-500 shadow-floating' : 'border-border hover:border-ink-200'
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-ink-200 hover:text-ink-400 active:cursor-grabbing shrink-0" aria-label="Drag to reorder">
        <GripVertical size={16} />
      </button>
      <button
        onClick={() => !isEditing && onToggle(milestone.id)}
        disabled={isEditing}
        aria-label={milestone.done ? 'Mark milestone incomplete' : 'Mark milestone complete'}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          milestone.done ? 'border-brand-600 bg-brand-600 text-canvas' : 'border-ink-200 hover:border-brand-500'
        )}
      >
        {milestone.done && <Check size={12} strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <form onSubmit={handleSave} className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                setDraft(milestone.title)
                setIsEditing(false)
              }}
              className="w-full font-sans rounded border border-brand-500 bg-surface px-2 py-0.5 text-sm font-medium text-ink-900 outline-none"
            />
          </form>
        ) : (
          <>
            <p className={cn('text-sm font-medium transition-colors', milestone.done ? 'text-ink-400 line-through' : 'text-ink-900')}>
              {milestone.title}
            </p>
            {milestone.done && milestone.completedAt && (
              <p className="font-mono text-[11px] text-ink-400">Completed {formatDistanceToNow(new Date(milestone.completedAt), { addSuffix: true })}</p>
            )}
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-900/5 dark:hover:bg-white/5 hover:text-ink-900"
            aria-label="Edit milestone"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(milestone.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Delete milestone"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
