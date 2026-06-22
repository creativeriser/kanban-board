import { create } from 'zustand'

const useGoalStore = create((set) => ({
  preferences: {
    notifications: { deadline: true },
    appearance: { theme: 'light', accent: '#1B6F5C', density: 'comfortable' },
    privacy: {}
  },
  updatePreferences: (category, patch) =>
    set((s) => ({
      preferences: {
        ...(s.preferences || {}),
        [category]: { ...((s.preferences || {})[category] || {}), ...patch },
      },
    })),
}))

useGoalStore.getState().updatePreferences('appearance', { theme: 'dark' })
console.log(useGoalStore.getState().preferences)
