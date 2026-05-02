import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Minus, Trash2, ShoppingCart, CheckCircle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Loading, ErrorState } from '../components/LoadingState'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'

type CartItem = { productId: string; qty: number }

export default function NewOrder() {
  const navigate = useNavigate()
  const { products, shops, loading: ctxLoading, error: ctxError } = useApp()
  const activeShops = shops.filter(s => s.active)
  const [shopId, setShopId] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (ctxLoading) return <Loading />
  if (ctxError) return <ErrorState message={ctxError} />

  const effectiveShopId = shopId || activeShops[0]?.id || ''

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === productId)
      if (existing) return prev.map(c => c.productId === productId ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { productId, qty: 1 }]
    })
  }

  const updateQty = (productId: string, delta: number) =>
    setCart(prev => prev.map(c => c.productId === productId ? { ...c, qty: Math.max(1, c.qty + delta) } : c))

  const removeFromCart = (productId: string) =>
    setCart(prev => prev.filter(c => c.productId !== productId))

  const cartWithDetails = cart.map(c => {
    const product = products.find(p => p.id === c.productId)!
    return { ...c, product, subtotal: product.unitPrice * c.qty }
  })

  const total = cartWithDetails.reduce((sum, item) => sum + item.subtotal, 0)
  const itemCount = cart.reduce((sum, c) => sum + c.qty, 0)

  const handleSubmit = async () => {
    if (cart.length === 0 || !effectiveShopId) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await api.orders.create({
        shopId: effectiveShopId,
        items: cart.map(c => ({ productId: c.productId, qty: c.qty })),
      })
      setSubmitted(true)
      setTimeout(() => navigate('/admin/requests'), 1800)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to create request')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    const shop = activeShops.find(s => s.id === effectiveShopId)
    return (
      <div className="max-w-lg mx-auto mt-12 bg-white border border-slate-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Stock Request Created!</h2>
        <p className="text-slate-600 text-sm mb-1">
          {itemCount} items requested for <span className="font-medium">{shop?.name}</span>
        </p>
        <p className="text-slate-600 text-sm">Total: ₹ {total.toLocaleString('en-IN')}</p>
        <p className="text-xs text-slate-400 mt-4">Redirecting…</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="New Stock Request" subtitle="Create a stock request on behalf of a shop" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Request For Shop</h2>
            <select
              value={effectiveShopId}
              onChange={e => setShopId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {activeShops.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Add Products</h2>
            {products.length === 0 ? (
              <p className="text-sm text-slate-500">No products available. Add products first.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-500">₹ {p.unitPrice} / {p.unit}</div>
                    </div>
                    <button onClick={() => addToCart(p.id)} className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 h-fit sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-900">Request Cart</h2>
            <span className="ml-auto bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{itemCount}</span>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No items added yet</p>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {cartWithDetails.map(item => (
                  <div key={item.productId} className="border-b border-slate-100 pb-3 last:border-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-slate-500">₹ {item.product.unitPrice} each</p>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg">
                        <button onClick={() => updateQty(item.productId, -1)} className="p-1.5 hover:bg-slate-50 text-slate-600">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateQty(item.productId, 1)} className="p-1.5 hover:bg-slate-50 text-slate-600">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">₹ {item.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Total</span>
                  <span className="text-xl font-bold text-slate-900">₹ {total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </>
          )}

          {submitError && <p className="text-xs text-red-600 mb-3">{submitError}</p>}

          <button
            onClick={handleSubmit}
            disabled={cart.length === 0 || submitting}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            {submitting ? 'Creating…' : 'Create Request'}
          </button>
        </div>
      </div>
    </div>
  )
}
