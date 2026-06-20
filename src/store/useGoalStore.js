import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  goals as seedGoals,
  milestones as seedMilestones,
  initialGoalOrder,
  activityFeed,
  CATEGORIES,
  STATUSES,
} from '../lib/mockData'
import { uid, triggerConfetti } from '../lib/utils'

export const useGoalStore = create(
  persist(
    (set, get) => ({
      goals: seedGoals,
      milestones: seedMilestones,
      order: initialGoalOrder, // { [status]: [goalId, ...] }
      activity: activityFeed,

  addActivity: (text, type = 'status', goalId = null) =>
    set((s) => ({
      activity: [
        { id: uid('a'), goalId, text, type, time: new Date().toISOString() },
        ...s.activity,
      ].slice(0, 20),
    })),

  user: {
    name: 'Jordan Avery',
    email: 'jordan@example.com',
    timezone: 'pst',
  },

  preferences: {
    notifications: {
      deadline: true,
      weekly: true,
      streak: true,
      celebrations: true,
    },
    appearance: {
      theme: 'light',
      accent: '#1B6F5C',
      density: 'comfortable',
    },
    privacy: {
      publicProfile: false,
      shareAnalytics: false,
    }
  },

  ui: {
    search: '',
    priorityFilter: null, // 'high' | 'medium' | 'low' | null
    categoryFilter: null, // category id | null
    sortBy: 'priority', // 'priority' | 'dueDate' | 'alphabetical'
    mobileSidebarOpen: false,
    newGoalModalOpen: false,
  },

  setSearch: (search) => set((s) => ({ ui: { ...s.ui, search } })),
  setPriorityFilter: (priorityFilter) =>
    set((s) => ({ ui: { ...s.ui, priorityFilter: s.ui.priorityFilter === priorityFilter ? null : priorityFilter } })),
  setCategoryFilter: (categoryFilter) =>
    set((s) => ({ ui: { ...s.ui, categoryFilter: s.ui.categoryFilter === categoryFilter ? null : categoryFilter } })),
  setSortBy: (sortBy) => set((s) => ({ ui: { ...s.ui, sortBy } })),
  setMobileSidebarOpen: (open) => set((s) => ({ ui: { ...s.ui, mobileSidebarOpen: open } })),
  setNewGoalModalOpen: (open) => set((s) => ({ ui: { ...s.ui, newGoalModalOpen: open } })),
  clearFilters: () => set((s) => ({ ui: { ...s.ui, search: '', priorityFilter: null, categoryFilter: null } })),

  // Move a goal to a new status/column, optionally at a specific index
  moveGoal: (goalId, toStatus, toIndex = null) =>
    set((s) => {
      const fromStatus = s.goals[goalId].status
      const order = { ...s.order }
      order[fromStatus] = order[fromStatus].filter((id) => id !== goalId)
      const targetList = [...(order[toStatus] || [])]
      if (toIndex === null || toIndex >= targetList.length) {
        targetList.push(goalId)
      } else {
        targetList.splice(toIndex, 0, goalId)
      }
      order[toStatus] = targetList

      const newActivity = {
        id: uid('a'),
        goalId: goalId,
        text: `Moved "${s.goals[goalId].title}" to ${STATUSES.find(st => st.id === toStatus)?.label || toStatus}`,
        type: toStatus === 'achieved' ? 'achieved' : 'status',
        time: new Date().toISOString()
      }

      // Fire confetti outside state setter loop if applicable
      if (toStatus === 'achieved' && fromStatus !== 'achieved' && s.preferences?.notifications?.celebrations) {
        setTimeout(triggerConfetti, 50)
      }

      return {
        order,
        goals: {
          ...s.goals,
          [goalId]: { ...s.goals[goalId], status: toStatus },
        },
        activity: [newActivity, ...s.activity].slice(0, 20)
      }
    }),

  // Reorder within the same column (drag preview)
  reorderWithinColumn: (status, fromIndex, toIndex) =>
    set((s) => {
      const list = [...s.order[status]]
      const [moved] = list.splice(fromIndex, 1)
      list.splice(toIndex, 0, moved)
      return { order: { ...s.order, [status]: list } }
    }),

  toggleMilestone: (milestoneId) =>
    set((s) => {
      const m = s.milestones[milestoneId]
      const nowDone = !m.done
      const updates = {
        milestones: {
          ...s.milestones,
          [milestoneId]: {
            ...m,
            done: nowDone,
            completedAt: nowDone ? new Date().toISOString() : null,
          },
        },
      }

      if (nowDone) {
        updates.activity = [
          {
            id: uid('a'),
            goalId: m.goalId,
            text: `Completed milestone: "${m.title}"`,
            type: 'achieved',
            time: new Date().toISOString()
          },
          ...s.activity
        ].slice(0, 20)
      }

      return updates
    }),

  addMilestone: (goalId, title) =>
    set((s) => {
      const id = uid('m')
      return {
        milestones: { ...s.milestones, [id]: { id, goalId, title, done: false, completedAt: null } },
        goals: {
          ...s.goals,
          [goalId]: { ...s.goals[goalId], milestoneIds: [...s.goals[goalId].milestoneIds, id] },
        },
      }
    }),

  updateMilestone: (milestoneId, title) =>
    set((s) => ({
      milestones: {
        ...s.milestones,
        [milestoneId]: { ...s.milestones[milestoneId], title },
      },
    })),

  deleteMilestone: (goalId, milestoneId) =>
    set((s) => {
      const newMilestones = { ...s.milestones }
      delete newMilestones[milestoneId]
      return {
        milestones: newMilestones,
        goals: {
          ...s.goals,
          [goalId]: {
            ...s.goals[goalId],
            milestoneIds: s.goals[goalId].milestoneIds.filter((id) => id !== milestoneId),
          },
        },
      }
    }),

  deleteGoal: (goalId) =>
    set((s) => {
      const goal = s.goals[goalId]
      if (!goal) return s

      // Clean up orphaned milestones
      const newMilestones = { ...s.milestones }
      goal.milestoneIds.forEach((id) => delete newMilestones[id])

      // Remove from goals
      const newGoals = { ...s.goals }
      delete newGoals[goalId]

      // Remove from order tracking
      const newOrder = {
        ...s.order,
        [goal.status]: (s.order[goal.status] || []).filter((id) => id !== goalId),
      }

      const newActivity = {
        id: uid('a'),
        goalId: goalId,
        text: `Deleted goal: "${goal.title}"`,
        type: 'amber',
        time: new Date().toISOString()
      }

      return { 
        goals: newGoals, 
        milestones: newMilestones, 
        order: newOrder,
        activity: [newActivity, ...s.activity].slice(0, 20)
      }
    }),

  updateGoal: (goalId, patch) =>
    set((s) => ({ goals: { ...s.goals, [goalId]: { ...s.goals[goalId], ...patch } } })),

  updateGoalNotes: (goalId, notes) =>
    set((s) => ({ goals: { ...s.goals, [goalId]: { ...s.goals[goalId], notes } } })),

  updateUser: (patch) =>
    set((s) => ({ user: { ...s.user, ...patch } })),

  updatePreferences: (category, patch) =>
    set((s) => ({
      preferences: {
        ...(s.preferences || {}),
        [category]: { ...((s.preferences || {})[category] || {}), ...patch },
      },
    })),

  categories: CATEGORIES,

  addCategory: (label) => {
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (!id) return null
    const s = get()
    if (s.categories.find((c) => c.id === id)) return id
    
    // Deterministic hash to assign a theme color automatically
    const TONES = ['moss', 'ember', 'indigo', 'amber']
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    const color = TONES[Math.abs(hash) % TONES.length]
    
    set({ categories: [...s.categories, { id, label, color }] })
    return id
  },

  addGoal: ({ title, description, category, priority, dueDate }) =>
    set((s) => {
      const id = uid('g')
      const goal = {
        id,
        title,
        description,
        status: 'planning',
        priority,
        category,
        dueDate,
        createdAt: new Date().toISOString(),
        milestoneIds: [],
        notes: '',
      }
      const newActivity = {
        id: uid('a'),
        goalId: id,
        text: `Created new goal: "${title}"`,
        type: 'status',
        time: new Date().toISOString()
      }

      return {
        goals: { ...s.goals, [id]: goal },
        order: { ...s.order, planning: [...(s.order.planning || []), id] },
        activity: [newActivity, ...s.activity].slice(0, 20)
      }
    }),
    
  resetData: () => {
    set({
      goals: seedGoals,
      milestones: seedMilestones,
      order: initialGoalOrder,
      activity: activityFeed,
    })
  }
  }),
  {
    name: 'goalflow-storage',
  }
))

export { STATUSES }
