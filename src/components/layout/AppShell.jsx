import { Sidebar } from './Sidebar'

export function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  )
}
