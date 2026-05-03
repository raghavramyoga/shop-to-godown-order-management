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
      navigate('/admin/products')
    } else {
      setError('Invalid admin credentials')
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="relative z-10 px-6 sm:px-8 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-[#FCD835] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white transition"
          style={{ border: '2px solid #1F1F1F' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pb-12">
        <div
          className="max-w-md w-full rounded-2xl overflow-hidden bg-white"
          style={{
            border: '2px solid #1F1F1F',
            boxShadow: '8px 8px 0 0 #FCD835',
          }}
        >
          <div
            className="px-8 pt-7 pb-6 text-center"
            style={{
              backgroundColor: '#FCD835',
              borderBottom: '2px solid #1F1F1F',
            }}
          >
            <div className="w-14 h-14 bg-[#1F1F1F] rounded-2xl flex items-center justify-center mb-3 mx-auto">
              <ShieldCheck className="w-7 h-7 text-[#FCD835]" />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-wide text-[#1F1F1F] mb-0.5">Admin Login</h1>
            <p className="text-sm text-[#1F1F1F]/75 font-medium">Manage products and inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1F1F1F]/75 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#FCD835] bg-white"
                style={{ border: '2px solid #1F1F1F' }}
                required
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1F1F1F]/75 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#FCD835] bg-white"
                style={{ border: '2px solid #1F1F1F' }}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-50 border-2 border-red-700 rounded-lg text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!username || !password}
              className="w-full bg-[#1F1F1F] hover:bg-[#0A0A0A] disabled:bg-gray-300 disabled:text-gray-500 text-[#FCD835] py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition"
              style={{ border: '2px solid #1F1F1F' }}
            >
              Sign In
            </button>

            <div
              className="mt-2 p-3 rounded-lg text-xs text-[#1F1F1F]/75"
              style={{ backgroundColor: '#FFF8DC', border: '1px solid #1F1F1F' }}
            >
              <p className="font-bold uppercase tracking-wide text-[#1F1F1F] mb-1">Demo credentials:</p>
              <code className="text-[#1F1F1F] font-bold">admin / admin123</code>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
