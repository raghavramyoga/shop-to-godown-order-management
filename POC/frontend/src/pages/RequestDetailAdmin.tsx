import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, CheckCircle2, Truck, Home, Clock, XCircle, Store, User } from 'lucide-react'
import { Alert, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material'
import PageHeader from '../components/PageHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { Loading, ErrorState } from '../components/LoadingState'
import { api, type Order, type OrderStatus } from '../services/api'

const trackingSteps = [
  { status: 'Pending', label: 'Submitted', icon: Clock, desc: 'Awaiting godown approval' },
  { status: 'Approved', label: 'Approved', icon: CheckCircle2, desc: 'Approved by godown' },
  { status: 'Dispatched', label: 'Dispatched', icon: Truck, desc: 'On the way to shop' },
  { status: 'Completed', label: 'Delivered', icon: Home, desc: 'Stock received at shop' },
]

const statusOrder = ['Pending', 'Approved', 'Dispatched', 'Completed']

export default function RequestDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const load = () => {
    if (!id) return
    setLoading(true)
    api.orders.get(id)
      .then(setOrder)
      .catch(e => setError(e instanceof Error ? e.message : 'Request not found'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!id) return
    setUpdating(true)
    try {
      await api.orders.updateStatus(id, newStatus)
      load()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleConfirmCancel = () => {
    setConfirmCancel(false)
    updateStatus('Cancelled')
  }

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} />
  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Request not found.</p>
        <Link to="/admin/requests" className="text-amber-600 hover:underline mt-3 inline-block">View all requests</Link>
      </div>
    )
  }

  const currentStepIndex = statusOrder.indexOf(order.status)
  const isCancelled = order.status === 'Cancelled'

  const statusColor: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-sky-100 text-sky-700',
    Dispatched: 'bg-indigo-100 text-indigo-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-red-100 text-red-700',
  }

  const nextActions: Record<string, OrderStatus | null> = {
    Pending: 'Approved',
    Approved: 'Dispatched',
    Dispatched: 'Completed',
    Completed: null,
    Cancelled: null,
  }
  const nextAction = nextActions[order.status]

  return (
    <div>
      <button onClick={() => navigate('/admin/requests')} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to all requests
      </button>

      <PageHeader
        title={`Request ${order.id}`}
        subtitle={`Submitted on ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
        action={
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-md text-sm font-medium ${statusColor[order.status]}`}>
              {order.status}
            </span>
            {nextAction && (
              <button
                onClick={() => updateStatus(nextAction)}
                disabled={updating}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
              >
                Mark as {nextAction}
              </button>
            )}
            {!isCancelled && order.status !== 'Completed' && (
              <button
                onClick={() => setConfirmCancel(true)}
                disabled={updating}
                className="border border-red-300 text-red-600 hover:bg-red-50 px-4 py-1.5 rounded-lg text-sm font-medium"
              >
                Cancel Request
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-5">Status Timeline</h2>

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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
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
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Product</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Unit Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map(item => (
                    <TableRow key={item.productId} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{item.productName}</TableCell>
                      <TableCell align="right">{item.qty}</TableCell>
                      <TableCell align="right">₹ {item.price}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>₹ {(item.price * item.qty).toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 600, color: '#0f172a', borderBottom: 'none' }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontSize: 18, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                      ₹ {order.total.toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-600" />
              Shop
            </h2>
            <p className="font-medium text-slate-900">{order.shopName}</p>
            <p className="text-xs text-slate-500 mt-1">{order.shopId}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              Requested By
            </h2>
            <p className="font-medium text-slate-900">{order.shopUserName ?? '—'}</p>
            {order.shopUserId && <p className="text-xs text-slate-500 mt-1">User ID: {order.shopUserId}</p>}
          </div>

          {order.notes && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="font-semibold text-slate-900 mb-2">Notes</h2>
              <p className="text-sm text-slate-600">{order.notes}</p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <Package className="w-5 h-5 text-amber-600 mb-2" />
            <p className="text-sm font-medium text-amber-900 mb-1">Quick actions</p>
            <p className="text-xs text-amber-700">Use the buttons above to advance the request, or use the status dropdown on the requests list page.</p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel request"
        message={`Are you sure you want to cancel request ${order.id}? The shop will be notified and the request will not proceed.`}
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Request"
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmCancel(false)}
      />

      <Snackbar
        open={!!actionError}
        autoHideDuration={5000}
        onClose={() => setActionError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      </Snackbar>
    </div>
  )
}
