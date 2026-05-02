import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import { Drawer, IconButton } from '@mui/material'
import Sidebar from './Sidebar'
import { useApp } from '../context/AppContext'

export default function Layout() {
  const { currentUser } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!currentUser) return <Navigate to="/admin/login" replace />

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: 256, boxSizing: 'border-box', border: 'none' },
        }}
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-3 sticky top-0 z-10 border-b border-white/40"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: '0 4px 24px -4px rgba(30, 41, 59, 0.15)',
          }}
        >
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { lg: 'none' }, color: '#3E2723' }}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </IconButton>

          <div className="ml-auto flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              className="relative p-2 rounded-lg flex-shrink-0 transition"
              style={{ background: 'rgba(255, 255, 255, 0.4)' }}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#6D4C41]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C62828] rounded-full" />
            </button>
            <div className="text-sm text-[#5D4037] hidden xl:block truncate glass-title">
              <span className="font-semibold text-[#3E2723]">Kovilpatti Murukku &amp; Snacks kadai</span> — Chennai
            </div>
            <div className="text-sm text-[#5D4037] hidden md:block xl:hidden truncate">
              <span className="font-semibold text-[#3E2723]">Chennai</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
