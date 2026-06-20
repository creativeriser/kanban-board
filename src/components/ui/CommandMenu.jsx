import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { useGoalStore } from '../../store/useGoalStore'
import { LayoutDashboard, Kanban, LineChart, Trophy, Settings, Plus, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const goals = useGoalStore((s) => s.goals)
  const setNewGoalModalOpen = useGoalStore((s) => s.setNewGoalModalOpen)

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command) => {
    setOpen(false)
    command()
  }

  const goalList = Object.values(goals)

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-border bg-surface shadow-floating outline-none"
    >
      <div className="flex items-center border-b border-border px-4 py-3">
        <Command.Input
          placeholder="Type a command or search goals..."
          className="w-full bg-transparent font-sans text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
        <Command.Empty className="p-6 text-center text-[13.5px] text-ink-600">
          No results found.
        </Command.Empty>

        <Command.Group heading="Actions" className="px-2 py-1.5 text-[12px] font-semibold text-ink-400">
          <Command.Item
            onSelect={() => runCommand(() => setNewGoalModalOpen(true))}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-ink-900 aria-selected:bg-moss-100 aria-selected:text-moss-700"
          >
            <Plus size={16} /> Create new goal
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Navigation" className="mt-2 px-2 py-1.5 text-[12px] font-semibold text-ink-400">
          <Command.Item
            onSelect={() => runCommand(() => navigate('/'))}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-ink-900 aria-selected:bg-ink-900/5"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => navigate('/board'))}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-ink-900 aria-selected:bg-ink-900/5"
          >
            <Kanban size={16} /> Board
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => navigate('/analytics'))}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-ink-900 aria-selected:bg-ink-900/5"
          >
            <LineChart size={16} /> Analytics
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => navigate('/achievements'))}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-ink-900 aria-selected:bg-ink-900/5"
          >
            <Trophy size={16} /> Achievements
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => navigate('/settings'))}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-ink-900 aria-selected:bg-ink-900/5"
          >
            <Settings size={16} /> Settings
          </Command.Item>
        </Command.Group>

        {goalList.length > 0 && (
          <Command.Group heading="Your Goals" className="mt-2 px-2 py-1.5 text-[12px] font-semibold text-ink-400">
            {goalList.map((goal) => (
              <Command.Item
                key={goal.id}
                onSelect={() => runCommand(() => navigate(`/goals/${goal.id}`))}
                className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-[13.5px] font-medium text-ink-900 aria-selected:bg-ink-900/5"
              >
                <div className="flex items-center gap-3 truncate">
                  <ArrowRight size={16} className="shrink-0 text-ink-400" />
                  <span className="truncate">{goal.title}</span>
                </div>
                <span className="shrink-0 text-[11px] text-ink-400 uppercase tracking-wide ml-4">Goal</span>
              </Command.Item>
            ))}
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  )
}
