import { useState } from 'react'
import { Plus, Search, Check } from 'lucide-react'
import { Loading, ErrorState } from '../../components/LoadingState'
import { useApp } from '../../context/AppContext'

const categories = ['All', 'Snacks', 'Beverages', 'Food', 'Biscuits', 'Dairy']

export default function RequestStock() {
  const { products, addToCart, cart, loading, error } = useApp()
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null)

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} />

  const visible = products.filter(p => {
    if (category !== 'All' && p.category !== category) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleAdd = (productId: string) => {
    addToCart(productId)
    setRecentlyAdded(productId)
    setTimeout(() => setRecentlyAdded(null), 1200)
  }

  const inCartQty = (productId: string) => cart.find(c => c.productId === productId)?.qty ?? 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Request Stock from Godown</h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse the catalog and add products to your request. Submit when ready.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition ${
                category === cat ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map(p => {
          const cartQty = inCartQty(p.id)
          const justAdded = recentlyAdded === p.id

          return (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col">
              <div className="aspect-square bg-gradient-to-br from-amber-50 to-slate-100 rounded-lg mb-3 flex items-center justify-center">
                <div className="text-3xl">
                  {p.category === 'Snacks' && '🥨'}
                  {p.category === 'Beverages' && '🥤'}
                  {p.category === 'Food' && '🍜'}
                  {p.category === 'Biscuits' && '🍪'}
                  {p.category === 'Dairy' && '🧈'}
                </div>
              </div>

              <div className="flex-1 mb-3">
                <span className="text-xs text-slate-500">{p.category}</span>
                <h3 className="font-medium text-slate-900 text-sm leading-tight mt-0.5">{p.name}</h3>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  ₹ {p.unitPrice} <span className="text-xs font-normal text-slate-500">/ {p.unit}</span>
                </p>
              </div>

              <button
                onClick={() => handleAdd(p.id)}
                className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : cartQty > 0
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                {justAdded ? (<><Check className="w-4 h-4" /> Added!</>) :
                 cartQty > 0 ? (<><Plus className="w-4 h-4" /> In cart ({cartQty})</>) :
                 (<><Plus className="w-4 h-4" /> Add to request</>)}
              </button>
            </div>
          )
        })}
      </div>

      {visible.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          No products match your search.
        </div>
      )}
    </div>
  )
}
