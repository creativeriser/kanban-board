import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Trophy, Flame, Star, Target, Crown, Sparkles, Share } from 'lucide-react'
import { toast } from 'sonner'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { CategoryTag } from '../components/goals/PriorityDot'
import { useGoalStore } from '../store/useGoalStore'
import { calculateStreaks } from '../lib/calculations'
import { cn } from '../lib/utils'



export default function Achievements() {
  const goals = useGoalStore((s) => s.goals)
  const milestonesById = useGoalStore((s) => s.milestones)
  const user = useGoalStore((s) => s.user)
  const publicProfile = useGoalStore((s) => s.preferences?.privacy?.publicProfile)
  
  const { currentStreak, longestStreak } = calculateStreaks(milestonesById)
  const goalList = Object.values(goals)
  const achieved = goalList
    .filter((g) => g.status === 'achieved')
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    
  const activeGoals = goalList.filter(g => g.status !== 'achieved').length
  const achievedGoals = achieved.length
  const milestonesHit = Object.values(milestonesById).filter(m => m.done).length

  const BADGES = [
    { id: 'b1', icon: Flame, label: '10-Day Streak', tone: 'ember', earned: longestStreak >= 10 },
    { id: 'b2', icon: Star, label: 'First Goal Achieved', tone: 'amber', earned: achievedGoals >= 1 },
    { id: 'b3', icon: Target, label: '5 Goals Active', tone: 'indigo', earned: activeGoals >= 5 },
    { id: 'b4', icon: Crown, label: '3 Goals Achieved', tone: 'moss', earned: achievedGoals >= 3 },
    { id: 'b5', icon: Sparkles, label: '25 Milestones Hit', tone: 'indigo', earned: milestonesHit >= 25 },
    { id: 'b6', icon: Trophy, label: '30-Day Streak', tone: 'ember', earned: longestStreak >= 30 },
  ]

  function handleShare() {
    if (!publicProfile) {
      toast.error('Profile is private', {
        description: 'Enable "Public achievement profile" in Settings to share your trophy case.'
      })
      return
    }
    
    // Simulate copying link
    const username = user?.name?.toLowerCase().replace(/\\s+/g, '') || 'guest'
    navigator.clipboard.writeText(`https://goalflow.app/u/${username}`)
    toast.success('Link copied!', {
      description: 'Your public trophy case link has been copied to your clipboard.'
    })
  }

  return (
    <div>
      <TopBar 
        title="Achievements" 
        subtitle="Every goal you've carried across the finish line." 
        action={
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            <Share size={15} /> Share Profile
          </button>
        }
      />

      <div className="px-8 py-8">
        {goalList.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-500">
              <Trophy size={32} />
            </div>
            <h2 className="mb-2 font-display text-xl font-semibold tracking-tight text-ink-900">Your trophy case is empty</h2>
            <p className="max-w-sm text-sm text-ink-600">
              Create and complete goals to start building your streak, earning badges, and collecting trophies here.
            </p>
          </div>
        ) : (
          <>
            {/* Streak hero */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <Card className="overflow-hidden p-6">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-moss-300">Growth streak</p>
                    <p className="mt-2 font-display text-4xl font-semibold leading-none tracking-tight text-ink-900">{currentStreak} days</p>
                    <p className="mt-2 text-sm text-ink-400">Longest streak: {longestStreak} days. Keep showing up daily.</p>
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scaleY: 0.3, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ delay: i * 0.025 }}
                        className={cn('h-8 w-2.5 rounded-full', i < currentStreak % 14 || i < 14 ? 'bg-brand-500' : 'bg-ink-900/5')}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Badges */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="mt-6">
              <p className="mb-3 font-display text-[15px] font-semibold tracking-tight text-ink-900">Badges</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {BADGES.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                  >
                    <Card className={cn('flex flex-col items-center gap-2 p-4 text-center', !b.earned && 'opacity-40')}>
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-full', TONE_BG[b.tone])}>
                        <b.icon size={20} className={TONE_TEXT[b.tone]} />
                      </div>
                      <p className="text-xs font-medium leading-tight text-ink-900">{b.label}</p>
                      {!b.earned && <p className="text-[10px] text-ink-400">Locked</p>}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Trophy case */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="mt-8">
              <p className="mb-4 font-display text-[15px] font-semibold tracking-tight text-ink-900">Completed Goals</p>
              {achieved.length === 0 ? (
                <Card className="p-10 text-center text-sm text-ink-400">No goals achieved yet — your first trophy is waiting.</Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {achieved.map((g, i) => (
                    <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                      <Card className="p-6">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                            <Trophy size={15} />
                          </div>
                          <CategoryTag category={g.category} />
                        </div>
                        <p className="font-display text-[15px] font-semibold leading-snug tracking-tight text-ink-900">{g.title}</p>
                        <p className="mt-1 font-mono text-[11px] text-ink-400">Achieved {format(new Date(g.dueDate), 'MMM d, yyyy')}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

const TONE_BG = {
  ember: 'bg-ember-100',
  amber: 'bg-amber-100',
  indigo: 'bg-indigo-100',
  moss: 'bg-moss-100',
}
const TONE_TEXT = {
  ember: 'text-ember-600',
  amber: 'text-amber-600',
  indigo: 'text-indigo-600',
  moss: 'text-moss-700',
}
