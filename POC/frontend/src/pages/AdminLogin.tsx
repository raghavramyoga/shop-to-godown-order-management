import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { setCurrentUser } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const user = await api.auth.adminLogin({ username, password })
      setCurrentUser(user)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FFF8E1] flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-[#FFD54F] rounded-full blur-3xl opacity-30" />
      <div className="pointer-events-none absolute -bottom-32 -left-40 w-[28rem] h-[28rem] bg-[#FFE082] rounded-full blur-3xl opacity-30" />

      <header className="relative z-10 px-6 sm:px-8 py-5">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#6D4C41] hover:text-[#3E2723] font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pb-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl shadow-[#6D4C41]/15 ring-1 ring-[#EFEBE9] overflow-hidden">
          <div className="bg-[#FFD54F] px-8 pt-7 pb-6 text-center">
            <div className="w-14 h-14 bg-[#6D4C41] rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-md shadow-black/15">
              <ShieldCheck className="w-7 h-7 text-[#FFD54F]" />
            </div>
            <h1 className="text-2xl font-semibold text-[#3E2723] mb-0.5">Admin Login</h1>
            <p className="text-sm text-[#5D4037]">Manage products, shops and user accounts</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2.5 border border-[#D7CCC8] rounded-lg text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
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
                className="w-full px-3 py-2.5 border border-[#D7CCC8] rounded-lg text-sm text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!username || !password || submitting}
              className="w-full bg-[#FFD54F] hover:bg-[#FFC107] disabled:bg-[#FFF8E1] disabled:text-[#A1887F] text-[#3E2723] py-2.5 rounded-lg text-sm font-bold transition shadow-md shadow-[#FFC107]/30"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="mt-2 p-3 bg-[#FFF8E1] border border-[#FFE082] rounded-lg text-xs text-[#5D4037]">
              <p className="font-medium text-[#3E2723] mb-1">Demo credentials:</p>
              <code className="text-[#3E2723] font-medium">admin / admin123</code>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
