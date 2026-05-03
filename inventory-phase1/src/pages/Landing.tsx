import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="relative z-10 px-6 sm:px-8 py-5 flex items-center justify-between gap-3">
        <img src="/logo.png" alt="Kovilpatti Murukku & Snacks" className="h-12 sm:h-14 w-auto" />
        <div
          className="px-4 py-2 rounded-lg hidden sm:block"
          style={{
            backgroundColor: '#1F1F1F',
            boxShadow: '4px 4px 0 0 #FCD835',
          }}
        >
          <div className="text-xs text-[#FCD835] font-bold uppercase tracking-widest">Inventory Management System</div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-12">
        <div className="max-w-md w-full">
          <div
            className="text-center mb-8 px-6 py-8 rounded-2xl bg-white"
            style={{
              border: '2px solid #1F1F1F',
              boxShadow: '8px 8px 0 0 #FCD835',
            }}
          >
            <img src="/logo.png" alt="Kovilpatti Murukku & Snacks" className="mx-auto w-56 sm:w-64 h-auto mb-4" />
            <p className="text-[#1F1F1F] text-base font-bold uppercase tracking-widest">Welcome — sign in to continue</p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Link
              to="/admin/login"
              className="group relative overflow-hidden text-[#1F1F1F] rounded-2xl p-7 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
              style={{
                backgroundColor: '#FCD835',
                border: '2px solid #1F1F1F',
                boxShadow: '8px 8px 0 0 #1F1F1F',
              }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-[#1F1F1F] rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-[#FCD835]" />
                </div>
                <h2 className="text-2xl font-bold mb-1.5 tracking-wide text-[#1F1F1F] uppercase">Admin</h2>
                <p className="text-[#1F1F1F]/75 text-sm mb-5 leading-relaxed font-medium">
                  Manage products, rates and inventory. Full system access.
                </p>
                <div className="flex items-center text-[#1F1F1F] font-bold text-sm uppercase tracking-widest">
                  Admin Login
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          <p
            className="text-center text-xs text-[#1F1F1F]/75 mt-8 px-4 py-2 rounded-lg inline-block w-full font-medium"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #1F1F1F/20' }}
          >
            Phase 1 demo — sample login: <code className="text-[#1F1F1F] font-bold">admin / admin123</code>
          </p>
        </div>
      </main>
    </div>
  )
}
