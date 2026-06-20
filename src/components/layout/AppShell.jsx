import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { NewGoalDialog } from '../goals/NewGoalDialog'
import { CommandMenu } from '../ui/CommandMenu'
import { useGoalStore } from '../../store/useGoalStore'
import { motion, AnimatePresence } from 'framer-motion'

export function AppShell({ children }) {
  const mobileSidebarOpen = useGoalStore((s) => s.ui.mobileSidebarOpen)
  const setMobileSidebarOpen = useGoalStore((s) => s.setMobileSidebarOpen)
  const newGoalModalOpen = useGoalStore((s) => s.ui.newGoalModalOpen)
  const setNewGoalModalOpen = useGoalStore((s) => s.setNewGoalModalOpen)
  const theme = useGoalStore((s) => s.preferences?.appearance?.theme || 'light')

  useEffect(() => {
    const root = document.documentElement
    
    function applyTheme() {
      if (theme === 'dark') {
        root.classList.add('dark')
      } else if (theme === 'light') {
        root.classList.remove('dark')
      } else {
        // System
        const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (systemIsDark) root.classList.add('dark')
        else root.classList.remove('dark')
      }
    }

    applyTheme()
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => applyTheme()
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [theme])

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar />
      <div className="min-w-0 flex-1">
        {children}
      </div>

      <NewGoalDialog open={newGoalModalOpen} onClose={() => setNewGoalModalOpen(false)} />
      <CommandMenu />
    </div>
  )
}
