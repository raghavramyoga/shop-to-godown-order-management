import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Package, CheckCircle2, Truck, Home, Clock, XCircle } from 'lucide-react'
import { Loading, ErrorState } from '../../components/LoadingState'
import { api, type Order } from '../../services/api'

const trackingSteps = [
  { status: 'Pending', label: 'Request Submitted', icon: Clock, desc: 'Awaiting godown approval' },
  { status: 'Approved', label: 'Approved', icon: CheckCircle2, desc: 'Approved by godown' },
  { status: 'Dispatched', label: 'Dispatched', icon: Truck, desc: 'Items on the way to your shop' },
  { status: 'Completed', label: 'Delivered', icon: Home, desc: 'Stock received at shop' },
]

const statusOrder = ['Pending', 'Approved', 'Dispatched', 'Completed']

export default function RequestDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.orders.get(id)
      .then(setOrder)
      .catch(e => setError(e instanceof Error ? e.message : 'Request not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} />
  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Request not found.</p>
        <Link to="/shop/requests" className="text-amber-600 hover:underline mt-3 inline-block">View my requests</Link>
      </div>
    )
  }

  const currentStepIndex = statusOrder.indexOf(order.status)
  const isCancelled = order.status === 'Cancelled'

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/shop/requests" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to my requests
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Request {order.id}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Submitted on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-md text-sm font-medium ${
          order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-5">Request Status</h2>

            {isCancelled ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-900">Request Cancelled</p>
                  <p className="text-sm text-red-700">This request has been cancelled.</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon
                  const isComplete = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex
                  const isLast = index === trackingSteps.length - 1
                  return (
                    <div key={step.status} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition ${
                          isComplete
                            ? isCurrent ? 'bg-amber-600 text-white ring-4 ring-amber-100' : 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 my-1 ${index < currentStepIndex ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                        )}
                      </div>
                      <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                        <p className={`font-medium ${isComplete ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                        <p className={`text-sm ${isComplete ? 'text-slate-600' : 'text-slate-400'}`}>{step.desc}</p>
                        {isCurrent && <p className="text-xs text-amber-600 font-medium mt-1">Current status</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Items Requested</h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.productId} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-slate-100 rounded-lg flex items-center justify-center text-xl">
                    📦
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.productName}</p>
                    <p className="text-xs text-slate-500">₹ {item.price} × {item.qty}</p>
                  </div>
                  <p className="font-semibold text-slate-900">₹ {(item.price * item.qty).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Shop</h2>
            <p className="font-medium text-slate-900">{order.shopName}</p>
            {order.shopUserName && <p className="text-sm text-slate-500 mt-1">Submitted by {order.shopUserName}</p>}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total items</span>
                <span>{order.items.reduce((s, i) => s + i.qty, 0)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Products</span>
                <span>{order.items.length}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 mt-2">
                <span className="font-semibold text-slate-900">Estimated value</span>
                <span className="font-bold text-slate-900">₹ {order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="font-semibold text-slate-900 mb-2">Notes</h2>
              <p className="text-sm text-slate-600">{order.notes}</p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <Package className="w-5 h-5 text-amber-600 mb-2" />
            <p className="text-sm font-medium text-amber-900 mb-1">Need help?</p>
            <p className="text-xs text-amber-700">Contact the godown for any questions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
