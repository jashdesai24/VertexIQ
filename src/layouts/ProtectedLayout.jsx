import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

// Shell for every authenticated page: Sidebar + Navbar + <Outlet /> for the
// active route. Owns only the mobile-drawer open/close state — pages know nothing about it.
export function ProtectedLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
