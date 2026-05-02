import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Store, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'

export default function ShopLogin() {
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
      const user = await api.auth.shopLogin({ username, password })
      setCurrentUser(user)
      navigate('/shop')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-300 via-amber-400 via-orange-400 to-rose-400 flex flex-col overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/2 -left-40 w-[28rem] h-[28rem] bg-orange-300 rounded-full blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 w-96 h-96 bg-rose-300 rounded-full blur-3xl opacity-40" />

      <header className="relative z-10 px-8 py-5">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-900 hover:text-slate-700 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-5 mx-auto">
            <Store className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 text-center mb-1">Shop Login</h1>
          <p className="text-sm text-slate-500 text-center mb-6">Sign in to access your shop</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="anna"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-2.5 rounded-lg text-sm font-medium transition"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Demo credentials (5 shops):</p>
            <ul className="space-y-0.5">
              <li><code>anna</code> / shop123 → Anna Nagar</li>
              <li><code>tnagar</code> / shop123 → T. Nagar</li>
              <li><code>velachery</code> / shop123 → Velachery</li>
              <li><code>adyar</code> / shop123 → Adyar</li>
              <li><code>omr</code> / shop123 → OMR</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
