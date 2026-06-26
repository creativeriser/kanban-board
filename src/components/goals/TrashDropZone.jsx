import { useDroppable } from '@dnd-kit/core'
import { Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

export function TrashDropZone({ isDragging }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'trash-zone',
    data: { type: 'trash' }
  })

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div
            ref={setNodeRef}
            className={cn(
              "flex items-center gap-3 px-7 py-3.5 rounded-full transition-all duration-300 pointer-events-auto backdrop-blur-xl border",
              isOver 
                ? "bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400 scale-[1.08] shadow-[0_10px_40px_rgba(239,68,68,0.25)]" 
                : "bg-canvas/90 border-ink-200/60 dark:border-white/10 text-ink-500 shadow-floating"
            )}
          >
            <div className={cn("transition-transform duration-300", isOver && "scale-110")}>
               <Trash2 size={20} strokeWidth={isOver ? 2.5 : 2} />
            </div>
            <span className={cn(
               "font-display font-medium tracking-wide transition-all duration-300", 
               isOver ? "text-[15px] font-semibold" : "text-[14.5px]"
            )}>
               {isOver ? "Release to Delete" : "Drop here to Delete"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
