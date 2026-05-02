import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Minus, Trash2, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { api } from '../../services/api'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, updateQty, removeFromCart, getProduct, clearCart, currentUser } = useApp()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const cartWithDetails = cart.map(c => {
    const product = getProduct(c.productId)
    if (!product) return null
    return { ...c, product, subtotal: product.unitPrice * c.qty }
  }).filter((x): x is NonNullable<typeof x> => x !== null)

  const total = cartWithDetails.reduce((sum, item) => sum + item.subtotal, 0)

  const submitRequest = async () => {
    if (!currentUser || currentUser.role !== 'ShopUser' || cart.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      const created = await api.orders.create({
        shopId: currentUser.shopId,
        shopUserId: currentUser.userId,
        notes: notes || undefined,
        items: cart.map(c => ({ productId: c.productId, qty: c.qty })),
      })
      clearCart()
      navigate(`/shop/requests/${created.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit')
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Your request cart is empty</h2>
        <p className="text-slate-500 mb-6">Add products to build a stock request</p>
        <Link
          to="/shop/request"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Review Stock Request</h1>
      <p className="text-sm text-slate-500 mb-6">Review items before submitting to godown</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {cartWithDetails.map(item => (
              <div key={item.productId} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-slate-100 rounded-lg flex items-center justify-center text-2xl">
                  {item.product.category === 'Snacks' && '🥨'}
                  {item.product.category === 'Beverages' && '🥤'}
                  {item.product.category === 'Food' && '🍜'}
                  {item.product.category === 'Biscuits' && '🍪'}
                  {item.product.category === 'Dairy' && '🧈'}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900">{item.product.name}</h3>
                  <p className="text-xs text-slate-500">{item.product.category}</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">₹ {item.product.unitPrice} / {item.product.unit}</p>
                </div>

                <div className="inline-flex items-center border border-slate-200 rounded-lg">
                  <button onClick={() => updateQty(item.productId, -1)} className="p-2 hover:bg-slate-50 text-slate-600">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-medium min-w-[2rem] text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="p-2 hover:bg-slate-50 text-slate-600">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[5rem]">
                  <p className="font-semibold text-slate-900">₹ {item.subtotal.toLocaleString('en-IN')}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Notes (optional)</h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any special instructions for the godown..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 h-fit sticky top-20">
          <h2 className="font-semibold text-slate-900 mb-4">Request Summary</h2>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-slate-600">
              <span>Total products</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total quantity</span>
              <span>{cart.reduce((s, c) => s + c.qty, 0)}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 mb-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Estimated Value</span>
              <span className="text-xl font-bold text-slate-900">₹ {total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

          <button
            onClick={submitRequest}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 rounded-lg text-sm font-semibold"
          >
            {submitting ? 'Submitting…' : <><CheckCircle2 className="w-4 h-4" /> Submit Request</>}
          </button>

          <Link to="/shop/request" className="block text-center text-sm text-slate-500 hover:text-slate-700 mt-3">
            ← Add more products
          </Link>
        </div>
      </div>
    </div>
  )
}
