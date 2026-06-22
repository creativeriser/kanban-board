import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Kanban, BarChart3, Trophy, Settings, Sprout, ChevronsLeft } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useGoalStore } from '../../store/useGoalStore'
import { calculateStreaks } from '../../lib/calculations'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/board', label: 'Goals Board', icon: Kanban },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const mobileSidebarOpen = useGoalStore((s) => s.ui.mobileSidebarOpen)
  const setMobileSidebarOpen = useGoalStore((s) => s.setMobileSidebarOpen)
  const milestonesById = useGoalStore((s) => s.milestones)
  const { currentStreak } = calculateStreaks(milestonesById)

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-surface border-r border-border transition-all duration-300 ease-in-out lg:sticky lg:top-0',
        mobileSidebarOpen ? 'w-[250px] translate-x-0' : '-translate-x-full lg:translate-x-0',
        collapsed && !mobileSidebarOpen ? 'lg:w-[72px]' : 'lg:w-[250px]',
        mobileSidebarOpen && 'shadow-2xl'
      )}
    >
      <div className="flex h-[72px] items-center gap-3 px-5 border-b border-border">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-canvas">
          <Sprout size={17} />
        </div>
        {!collapsed && <span className="font-display text-[17px] font-semibold tracking-wide text-ink-900">GoalFlow</span>}
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1.5 px-3 relative">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors outline-none',
                isActive ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900 hover:bg-ink-900/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Highlight Background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-lg bg-ink-900/5 border border-ink-900/10"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                  />
                )}
                
                {/* Active Left Pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-moss-500"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                  />
                )}
                
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn("shrink-0 relative z-10 transition-colors duration-200", isActive ? "text-moss-400" : "text-ink-500 group-hover:text-ink-300")}
                />
                {!collapsed && <span className="truncate relative z-10">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5">
        {!collapsed && (
          <div className="mb-4 relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-ink-900/[0.02] to-transparent p-4 shadow-sm">
            {/* Ambient glow */}
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-ember-500/10 blur-[24px]"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base drop-shadow-sm">{currentStreak >= 3 ? '🔥' : '🌱'}</span>
                <p className="font-display text-[13px] font-semibold tracking-wide text-ink-900">{currentStreak}-Day Streak</p>
              </div>
              <p className="text-[12px] leading-relaxed text-ink-600">Consistency builds momentum. Keep showing up!</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="group hidden lg:flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-ink-600 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
        >
          <ChevronsLeft size={18} className={cn('shrink-0 transition-transform duration-300', collapsed && 'rotate-180')} />
          {!collapsed && 'Collapse sidebar'}
        </button>
      </div>
    </aside>
  )
}
