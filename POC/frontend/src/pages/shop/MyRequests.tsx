import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, ChevronRight, ShoppingBag } from 'lucide-react'
import { Loading, ErrorState } from '../../components/LoadingState'
import { useApp } from '../../context/AppContext'
import { api, type Order } from '../../services/api'

export default function MyRequests() {
  const { currentUser } = useApp()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ShopUser') return
    api.orders.list({ shopId: currentUser.shopId })
      .then(setOrders)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [currentUser])

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} />

  const statusColor: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-sky-100 text-sky-700',
    Dispatched: 'bg-indigo-100 text-indigo-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-red-100 text-red-700',
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">My Stock Requests</h1>
        <p className="text-sm text-slate-500 mb-6">All requests for {currentUser?.role === 'ShopUser' ? currentUser.shopName : 'your shop'}</p>

        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="font-semibold text-slate-900 mb-2">No requests yet</h2>
          <p className="text-slate-500 text-sm mb-5">Build your first stock request</p>
          <Link
            to="/shop/request"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            Request Stock
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">My Stock Requests</h1>
      <p className="text-sm text-slate-500 mb-6">{orders.length} {orders.length === 1 ? 'request' : 'requests'} for {currentUser?.role === 'ShopUser' ? currentUser.shopName : 'your shop'}</p>

      <div className="space-y-3">
        {orders.map(order => {
          const itemSummary = order.items.map(i => `${i.qty} × ${i.productName}`).join(', ')
          const totalItems = order.items.reduce((s, i) => s + i.qty, 0)

          return (
            <Link
              key={order.id}
              to={`/shop/requests/${order.id}`}
              className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-sm transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-6 h-6 text-amber-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{itemSummary}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{totalItems} items</span>
                    <span>•</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <p className="font-bold text-slate-900">₹ {order.total.toLocaleString('en-IN')}</p>
                  <ChevronRight className="w-5 h-5 text-slate-400 mt-2" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
