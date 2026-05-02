import { Outlet, NavLink, useNavigate, Navigate, Link } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, ShoppingCart, ClipboardList, LogOut, Store } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ShopLayout() {
  const navigate = useNavigate()
  const { currentUser, cart, logout } = useApp()

  if (!currentUser) return <Navigate to="/shop/login" replace />
  if (currentUser.role !== 'ShopUser') return <Navigate to="/" replace />

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/shop" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">{currentUser.shopName}</div>
              <div className="text-xs text-slate-500">Shop Portal</div>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink to="/shop" end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </NavLink>

            <NavLink to="/shop/request"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }>
              <ShoppingBag className="w-4 h-4" />
              Request Stock
            </NavLink>

            <NavLink to="/shop/requests"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }>
              <ClipboardList className="w-4 h-4" />
              My Requests
            </NavLink>

            <NavLink to="/shop/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }>
              <ShoppingCart className="w-4 h-4" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">{currentUser.fullName}</div>
              <div className="text-xs text-slate-500">@{currentUser.username}</div>
            </div>
            <div className="w-9 h-9 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-semibold">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500" title="Log out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
