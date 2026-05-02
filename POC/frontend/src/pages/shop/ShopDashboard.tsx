import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ClipboardList, AlertTriangle, ShoppingBag, ArrowRight } from 'lucide-react'
import StatCard from '../../components/StatCard'
import { Loading, ErrorState } from '../../components/LoadingState'
import { useApp } from '../../context/AppContext'
import { api, type Order, type StockEntry } from '../../services/api'

export default function ShopDashboard() {
  const { currentUser } = useApp()
  const shopId = currentUser?.role === 'ShopUser' ? currentUser.shopId : null

  const [orders, setOrders] = useState<Order[]>([])
  const [stock, setStock] = useState<StockEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shopId) return
    Promise.all([
      api.orders.list({ shopId }),
      api.stock.byShop(shopId),
    ])
      .then(([o, s]) => { setOrders(o); setStock(s) })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [shopId])

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} />

  const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Approved').length
  const lowStock = stock.filter(s => s.quantity < 30).length
  const totalItems = stock.reduce((sum, s) => sum + s.quantity, 0)

  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const statusColor: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-sky-100 text-sky-700',
    Dispatched: 'bg-indigo-100 text-indigo-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Hello, {currentUser?.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening at <span className="font-medium text-slate-700">{currentUser?.role === 'ShopUser' ? currentUser.shopName : ''}</span>
          </p>
        </div>
        <Link
          to="/shop/request"
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Request Stock
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Stock Items" value={totalItems} icon={Package} iconColor="bg-amber-100 text-amber-600" />
        <StatCard label="Pending Requests" value={pending} icon={ClipboardList} iconColor="bg-amber-100 text-amber-600" />
        <StatCard label="Low Stock Items" value={lowStock} icon={AlertTriangle} iconColor="bg-red-100 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent Requests</h2>
            <Link to="/shop/requests" className="text-sm text-amber-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No requests yet. <Link to="/shop/request" className="text-amber-600 hover:underline">Create your first one</Link>.</p>
          ) : (
            <div className="space-y-2">
              {recent.map(o => (
                <Link
                  key={o.id}
                  to={`/shop/requests/${o.id}`}
                  className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50"
                >
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{o.id}</div>
                    <div className="text-xs text-slate-500">
                      {o.items.reduce((s, i) => s + i.qty, 0)} items · {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span>
                    <span className="font-semibold text-slate-900 text-sm">₹ {o.total.toLocaleString('en-IN')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Top Stock</h2>
          {stock.length === 0 ? (
            <p className="text-sm text-slate-500">No stock yet.</p>
          ) : (
            <div className="space-y-3">
              {stock.slice(0, 6).map(s => (
                <div key={s.productId}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-slate-900 truncate">{s.productName}</span>
                    <span className="text-slate-700 ml-2">{s.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
