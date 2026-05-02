import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (login(username, password)) {
      navigate('/admin')
    } else {
      setError('Invalid admin credentials')
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="relative z-10 px-6 sm:px-8 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#3E2723] hover:text-[#1E293B] font-semibold px-3 py-1.5 rounded-lg border border-white/40"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pb-12">
        <div
          className="max-w-md w-full rounded-2xl shadow-2xl ring-1 ring-white/40 overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            boxShadow: '0 32px 80px -16px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div
            className="px-8 pt-7 pb-6 text-center border-b border-white/40"
            style={{
              backgroundColor: 'rgba(255, 213, 79, 0.55)',
              backdropFilter: 'blur(12px) saturate(180%)',
              WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            }}
          >
            <div className="w-14 h-14 bg-[#3E2723] rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-md shadow-black/20">
              <ShieldCheck className="w-7 h-7 text-[#FFD54F]" />
            </div>
            <h1 className="text-2xl font-semibold text-[#3E2723] mb-0.5">Admin Login</h1>
            <p className="text-sm text-[#5D4037]">Manage products and inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2.5 border border-white/60 rounded-lg text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-white/60 rounded-lg text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-50/80 border border-red-200 rounded-lg text-sm text-red-700 backdrop-blur-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!username || !password}
              className="w-full bg-[#FFD54F] hover:bg-[#FFC107] disabled:bg-white/40 disabled:text-[#A1887F] text-[#3E2723] py-2.5 rounded-lg text-sm font-bold transition shadow-md shadow-[#FFC107]/40"
            >
              Sign In
            </button>

            <div
              className="mt-2 p-3 border border-white/50 rounded-lg text-xs text-[#5D4037]"
              style={{ backgroundColor: 'rgba(255, 248, 225, 0.5)', backdropFilter: 'blur(8px)' }}
            >
              <p className="font-medium text-[#3E2723] mb-1">Demo credentials:</p>
              <code className="text-[#3E2723] font-semibold">admin / admin123</code>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
