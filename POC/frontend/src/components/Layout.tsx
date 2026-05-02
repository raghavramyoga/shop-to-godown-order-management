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
  if (currentUser.role !== 'Admin') return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen bg-[#FFF8E1]">
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
        <header className="bg-white border-b border-[#EFEBE9] px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-3 sticky top-0 z-10">
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { lg: 'none' }, color: '#3E2723' }}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </IconButton>

          <div className="ml-auto flex items-center gap-2 sm:gap-4 min-w-0">
            <button className="relative p-2 hover:bg-[#FFF8E1] rounded-lg flex-shrink-0" aria-label="Notifications">
              <Bell className="w-5 h-5 text-[#6D4C41]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C62828] rounded-full" />
            </button>
            <div className="text-sm text-[#6D4C41] hidden xl:block truncate">
              <span className="font-medium text-[#3E2723]">Kovilpatti Murukku &amp; Snacks kadai</span> — Chennai
            </div>
            <div className="text-sm text-[#6D4C41] hidden md:block xl:hidden truncate">
              <span className="font-medium text-[#3E2723]">Chennai</span>
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
