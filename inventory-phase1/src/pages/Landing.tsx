import { Link } from 'react-router-dom'
import { Warehouse, ShieldCheck, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="relative z-10 px-6 sm:px-8 py-5 flex items-center gap-3">
        <div className="w-11 h-11 bg-[#FFD54F] rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/40">
          <Warehouse className="w-5 h-5 text-[#3E2723]" />
        </div>
        <div
          className="px-4 py-2 rounded-xl border border-white/40"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div className="font-bold text-[#3E2723]">Kovilpatti Murukku &amp; Snacks kadai</div>
          <div className="text-xs text-[#5D4037] font-medium">Inventory Management System</div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-12">
        <div className="max-w-md w-full">
          <div
            className="text-center mb-8 px-6 py-6 rounded-2xl border border-white/40"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              boxShadow: '0 24px 64px -16px rgba(0, 0, 0, 0.55)',
            }}
          >
            <h1 className="font-display text-4xl sm:text-5xl text-[#3E2723] mb-2 leading-tight">
              Kovilpatti Murukku <span className="text-[#C62828]">&amp;</span> Snacks kadai
            </h1>
            <p className="text-[#5D4037] text-lg font-medium">Welcome — sign in to continue</p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Link
              to="/admin/login"
              className="group relative overflow-hidden text-[#3E2723] rounded-2xl p-7 border border-white/40 hover:shadow-2xl transition-all"
              style={{
                backgroundColor: 'rgba(255, 213, 79, 0.45)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.55)',
              }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-[#3E2723] rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <ShieldCheck className="w-6 h-6 text-[#FFD54F]" />
                </div>
                <h2 className="text-xl font-bold mb-1.5 tracking-tight text-[#3E2723]">Admin</h2>
                <p className="text-[#5D4037] text-sm mb-5 leading-relaxed">
                  Manage products, rates and inventory. Full system access.
                </p>
                <div className="flex items-center text-[#3E2723] font-semibold text-sm">
                  Admin Login
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          <p
            className="text-center text-xs text-[#5D4037] mt-8 px-4 py-2 rounded-lg inline-block w-full border border-white/40"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(12px)' }}
          >
            Phase 1 demo — sample login: <code className="text-[#3E2723] font-semibold">admin / admin123</code>
          </p>
        </div>
      </main>
    </div>
  )
}
