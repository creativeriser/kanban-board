import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/docs/',
  title: "GoalFlow Docs",
  description: "Personal Goal Management Kanban Platform",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: 'GoalFlow SDD',
        items: [
          { text: 'Documentation', link: '/' }
        ]
      }
    ]
  }
})
