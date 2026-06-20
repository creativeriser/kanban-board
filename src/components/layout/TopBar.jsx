import { Bell, Menu, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGoalStore } from '../../store/useGoalStore'

export function TopBar({ title, subtitle, action }) {
  const user = useGoalStore((s) => s.user)
  const setMobileSidebarOpen = useGoalStore((s) => s.setMobileSidebarOpen)
  const theme = useGoalStore((s) => s.preferences?.appearance?.theme || 'light')
  const updatePreferences = useGoalStore((s) => s.updatePreferences)
  
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <header className="flex items-center justify-between border-b border-border bg-canvas/80 px-4 md:px-8 py-4 md:py-5 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-900/5"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display text-[20px] md:text-[26px] font-semibold leading-tight text-ink-900">{title}</h1>
          {subtitle && <p className="mt-0.5 hidden md:block text-[13.5px] text-ink-600">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-5">
        {action}
        
        <div className="flex items-center gap-3 pl-2">
          {action && <div className="h-5 w-px bg-ink-200"></div>}
          <button 
            onClick={() => updatePreferences('appearance', { theme: theme === 'dark' ? 'light' : 'dark' })}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-900/5 hover:text-ink-600"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-900/5 hover:text-ink-600" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <Link 
            to="/settings"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-surface border border-ink-900 shadow-sm transition-all hover:bg-ink-900/5 hover:border-ink-700 active:scale-95"
            aria-label="Profile settings"
          >
            <span className="font-display text-[13px] font-bold text-ink-900 tracking-tight">{initials}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
