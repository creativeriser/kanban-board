import { differenceInCalendarDays, format } from 'date-fns'

export function goalProgress(goal, milestonesById) {
  if (!goal.milestoneIds.length) return 0
  const done = goal.milestoneIds.filter((id) => milestonesById[id]?.done).length
  return Math.round((done / goal.milestoneIds.length) * 100)
}

export function milestoneCounts(goal, milestonesById) {
  const done = goal.milestoneIds.filter((id) => milestonesById[id]?.done).length
  return { done, total: goal.milestoneIds.length }
}

export function formatDueDate(isoDate) {
  if (!isoDate) return 'No date'
  const d = new Date(isoDate)
  if (isNaN(d.getTime())) return 'Invalid date'
  return format(d, 'MMM d')
}

export function dueMeta(isoDate) {
  if (!isoDate) return { label: 'No date', tone: 'normal' }
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return { label: 'Invalid date', tone: 'normal' }
  
  const days = differenceInCalendarDays(date, new Date())
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, tone: 'overdue' }
  if (days === 0) return { label: 'Due today', tone: 'soon' }
  if (days <= 7) return { label: `Due in ${days}d`, tone: 'soon' }
  return { label: format(date, 'MMM d'), tone: 'normal' }
}

export function isUpcoming(isoDate, withinDays = 14) {
  const days = differenceInCalendarDays(new Date(isoDate), new Date())
  return days >= 0 && days <= withinDays
}

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 }
export function sortGoalIds(ids, goalsById, sortBy) {
  const arr = [...ids]
  if (sortBy === 'priority') {
    arr.sort((a, b) => PRIORITY_WEIGHT[goalsById[b].priority] - PRIORITY_WEIGHT[goalsById[a].priority])
  } else if (sortBy === 'dueDate') {
    arr.sort((a, b) => new Date(goalsById[a].dueDate) - new Date(goalsById[b].dueDate))
  } else if (sortBy === 'alphabetical') {
    arr.sort((a, b) => goalsById[a].title.localeCompare(goalsById[b].title))
  }
  return arr
}

export function categoryDistribution(goalsById) {
  const counts = {}
  Object.values(goalsById).forEach((g) => {
    counts[g.category] = (counts[g.category] || 0) + 1
  })
  return counts
}

export function completionRateByMonth(goalsById, milestonesById) {
  // simple deterministic mock-friendly aggregate used by Analytics charts
  const rates = Object.values(goalsById).map((g) => goalProgress(g, milestonesById))
  const avg = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0
  return avg
}

export function calculateStreaks(milestonesById) {
  const dates = Object.values(milestonesById)
    .filter((m) => m.done && m.completedAt)
    .map((m) => new Date(m.completedAt))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())

  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 }

  const uniqueDays = []
  const seen = new Set()
  for (const d of dates) {
    const key = format(d, 'yyyy-MM-dd')
    if (!seen.has(key)) {
      seen.add(key)
      uniqueDays.push(d)
    }
  }

  const today = new Date()
  let currentStreak = 0
  
  const diffFirst = differenceInCalendarDays(today, uniqueDays[0])
  if (diffFirst === 0 || diffFirst === 1) {
    currentStreak = 1
    for (let i = 0; i < uniqueDays.length - 1; i++) {
      if (differenceInCalendarDays(uniqueDays[i], uniqueDays[i+1]) === 1) {
        currentStreak++
      } else {
        break
      }
    }
  }

  let longestStreak = 1
  let currentRun = 1
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    if (differenceInCalendarDays(uniqueDays[i], uniqueDays[i+1]) === 1) {
      currentRun++
    } else {
      if (currentRun > longestStreak) longestStreak = currentRun
      currentRun = 1
    }
  }
  if (currentRun > longestStreak) longestStreak = currentRun

  return { currentStreak, longestStreak }
}

export function calculateWeeklyMomentum(milestonesById) {
  // Last 8 weeks
  const weeks = []
  const today = new Date()
  
  // Create buckets for the last 8 weeks (newest is W8, oldest is W1)
  for (let i = 7; i >= 0; i--) {
    const end = new Date(today)
    end.setDate(today.getDate() - (i * 7))
    const start = new Date(end)
    start.setDate(end.getDate() - 7)
    
    // label something like W8, W7, etc... but let's do "W1" to "W8"
    weeks.push({
      week: `W${8 - i}`,
      start: start.getTime(),
      end: end.getTime(),
      completed: 0
    })
  }

  Object.values(milestonesById).forEach(m => {
    if (!m.done || !m.completedAt) return
    const time = new Date(m.completedAt).getTime()
    if (isNaN(time)) return
    
    for (const w of weeks) {
      if (time > w.start && time <= w.end) {
        w.completed++
        break
      }
    }
  })

  // return just the week label and completed count
  return weeks.map(w => ({ week: w.week, completed: w.completed }))
}

export function calculateMonthlyAchievements(goalsById, milestonesById) {
  const months = []
  const today = new Date()
  
  // Last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.push({
      month: format(d, 'MMM'),
      monthNum: d.getMonth(),
      yearNum: d.getFullYear(),
      achieved: 0
    })
  }

  Object.values(goalsById).forEach(g => {
    if (g.status !== 'achieved') return
    
    // Figure out WHEN it was achieved. Proxy = last milestone date, or due date, or created date
    let time = 0
    if (g.milestoneIds.length > 0) {
      const ms = g.milestoneIds.map(id => milestonesById[id]).filter(m => m?.done && m.completedAt)
      if (ms.length > 0) {
        ms.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        time = new Date(ms[0].completedAt).getTime()
      }
    }
    
    if (time === 0 && g.dueDate) time = new Date(g.dueDate).getTime()
    if (time === 0 && g.createdAt) time = new Date(g.createdAt).getTime()
    
    if (isNaN(time) || time === 0) return
    
    const d = new Date(time)
    const mNum = d.getMonth()
    const yNum = d.getFullYear()
    
    const bucket = months.find(m => m.monthNum === mNum && m.yearNum === yNum)
    if (bucket) {
      bucket.achieved++
    }
  })

  return months.map(m => ({ month: m.month, achieved: m.achieved }))
}
