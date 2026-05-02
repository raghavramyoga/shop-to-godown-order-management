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
    <aside
      className="relative w-64 flex flex-col h-screen overflow-hidden text-[#3E2723]"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '8px 0 32px -8px rgba(30, 41, 59, 0.2)',
      }}
    >
      <div className="relative z-10 px-6 py-5 border-b border-white/40 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFD54F] rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/40 flex-shrink-0">
          <Warehouse className="w-5 h-5 text-[#3E2723]" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm leading-tight text-[#3E2723]">Kovilpatti Murukku &amp; Snacks kadai</div>
          <div className="text-xs text-[#5D4037] font-medium">Admin Console</div>
        </div>
      </div>

      <nav className="relative z-10 flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#FFD54F] text-[#3E2723] shadow-lg shadow-amber-400/40'
                  : 'text-[#3E2723] hover:bg-white/40'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="relative z-10 px-4 py-4 border-t border-white/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-[#FFD54F] text-[#3E2723] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md shadow-amber-400/30">
            {currentUser?.fullName.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="text-sm flex-1 min-w-0">
            <div className="font-semibold truncate text-[#3E2723]">{currentUser?.fullName ?? 'Admin'}</div>
            <div className="text-xs text-[#5D4037]">Admin</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#5D4037] hover:bg-white/40 hover:text-[#3E2723] font-semibold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
