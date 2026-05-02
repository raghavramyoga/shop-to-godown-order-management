import { Link } from 'react-router-dom'
// import { Warehouse, Store, ShieldCheck, ArrowRight, Truck } from 'lucide-react' // Store + Truck kept for future Shop / Third-role cards
import { Warehouse, ShieldCheck, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[#FFF8E1] flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-[#FFD54F] rounded-full blur-3xl opacity-25" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-[#FFA000] rounded-full blur-3xl opacity-15" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 w-96 h-96 bg-[#FFE082] rounded-full blur-3xl opacity-30" />

      <header className="relative z-10 px-6 sm:px-8 py-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#6D4C41] rounded-xl flex items-center justify-center shadow-md shadow-[#6D4C41]/20">
          <Warehouse className="w-5 h-5 text-[#FFD54F]" />
        </div>
        <div>
          <div className="font-semibold text-[#3E2723]">Kovilpatti Murukku &amp; Snacks kadai</div>
          <div className="text-xs text-[#6D4C41]">Inventory Management System</div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl sm:text-5xl text-[#3E2723] mb-3 leading-tight">
              Kovilpatti Murukku <span className="text-[#C62828]">&amp;</span> Snacks kadai
            </h1>
            <p className="text-[#6D4C41] text-lg">Welcome — sign in to continue</p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Link
              to="/admin/login"
              className="group relative overflow-hidden bg-[#FFD54F] text-[#3E2723] rounded-2xl p-7 hover:bg-[#FFC107] hover:shadow-2xl hover:shadow-[#FFC107]/40 ring-1 ring-[#FFC107]/40 transition-all"
            >
              <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 bg-[#FFE082] rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />

              <div className="relative">
                <div className="w-12 h-12 bg-[#6D4C41] rounded-xl flex items-center justify-center mb-4 shadow-md shadow-black/10">
                  <ShieldCheck className="w-6 h-6 text-[#FFD54F]" />
                </div>
                <h2 className="text-xl font-bold mb-1.5 tracking-tight text-[#3E2723]">Admin</h2>
                <p className="text-[#5D4037] text-sm mb-5 leading-relaxed">
                  Manage products, rates, shops, and shop user accounts. Full system access.
                </p>
                <div className="flex items-center text-[#3E2723] font-semibold text-sm">
                  Admin Login
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/*
              ---- Shop User and Third-role cards (kept for future use) ----
              When restoring:
              1. Re-add `Store` and `Truck` to the lucide-react import above.
              2. Change `max-w-md` → `max-w-5xl` on the wrapper above.
              3. Change `grid-cols-1` → `grid-cols-1 md:grid-cols-3` on the grid.
              4. Change "Sign in to continue" → "Choose your role to continue".
              5. Uncomment the two blocks below.

              <Link
                to="/shop/login"
                className="group bg-white border border-[#EFEBE9] rounded-2xl p-7 hover:border-[#FFC107] hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-[#FFE082] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FFC107] transition-colors">
                  <Store className="w-6 h-6 text-[#3E2723]" />
                </div>
                <h2 className="text-lg font-semibold text-[#3E2723] mb-1.5">Shop User</h2>
                <p className="text-[#6D4C41] text-sm mb-5 leading-relaxed">
                  Access your shop. Browse products and request stock quantities from the godown.
                </p>
                <div className="flex items-center text-[#6D4C41] font-medium text-sm">
                  Shop Login
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <div className="bg-[#EFEBE9] border-2 border-dashed border-[#D7CCC8] rounded-2xl p-7 opacity-70 cursor-not-allowed">
                <div className="w-12 h-12 bg-[#D7CCC8] rounded-xl flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-[#8D6E63]" />
                </div>
                <h2 className="text-lg font-semibold text-[#5D4037] mb-1.5">Third Role</h2>
                <p className="text-[#8D6E63] text-sm mb-5 leading-relaxed">
                  Reserved for future role (delivery / godown staff). Coming soon.
                </p>
                <span className="inline-flex items-center text-[#A1887F] font-medium text-sm">
                  Coming soon
                </span>
              </div>
            */}
          </div>

          <p className="text-center text-xs text-[#8D6E63] mt-8">
            POC demo — credentials are seeded. See login page for sample logins.
          </p>
        </div>
      </main>
    </div>
  )
}
