import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Warehouse, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
]

type Props = { onNavigate?: () => void }

export default function Sidebar({ onNavigate }: Props) {
  const navigate = useNavigate()
  const { currentUser, logout } = useApp()

  const handleLogout = () => {
    logout()
    navigate('/')
    onNavigate?.()
  }

  return (
    <aside className="relative w-64 bg-[#6D4C41] text-[#FFF8E1] flex flex-col h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-24 w-72 h-72 bg-[#FFD54F] rounded-full blur-3xl opacity-15" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 w-64 h-64 bg-[#FFA000] rounded-full blur-3xl opacity-15" />

      <div className="relative z-10 px-6 py-5 border-b border-[#5D4037] flex items-center gap-3">
        <div className="w-9 h-9 bg-[#FFD54F] rounded-lg flex items-center justify-center shadow-md shadow-black/10 flex-shrink-0">
          <Warehouse className="w-5 h-5 text-[#3E2723]" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight text-[#FFF8E1]">Kovilpatti Murukku &amp; Snacks kadai</div>
          <div className="text-xs text-[#FFD54F]">Admin Console</div>
        </div>
      </div>

      <nav className="relative z-10 flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#FFD54F] text-[#3E2723] shadow-md shadow-black/20'
                  : 'text-[#FFF8E1] hover:bg-[#5D4037] hover:text-[#FFD54F]'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="relative z-10 px-4 py-4 border-t border-[#5D4037]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#FFD54F] text-[#3E2723] rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {currentUser?.fullName.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="text-sm flex-1 min-w-0">
            <div className="font-medium truncate text-[#FFF8E1]">{currentUser?.fullName ?? 'Admin'}</div>
            <div className="text-xs text-[#FFD54F]">Admin</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#FFD54F] hover:bg-[#5D4037] hover:text-[#FFF8E1] font-medium transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
