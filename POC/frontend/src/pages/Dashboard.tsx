import { useEffect, useState } from 'react'
// import { Package, Store, ClipboardList, AlertTriangle } from 'lucide-react' // ClipboardList kept for future "Pending Requests" stat
import { Package, Store, AlertTriangle } from 'lucide-react'
// MuiLink kept for future "View all" link to Stock Requests page
// import { Paper, Chip, Box, Link as MuiLink } from '@mui/material'
import { Paper, Chip, Box } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import { Loading, ErrorState } from '../components/LoadingState'
import { useApp } from '../context/AppContext'
import { api, type Order, type AllStockEntry } from '../services/api'

export default function Dashboard() {
  const { products, shops, loading: ctxLoading, error: ctxError } = useApp()
  const [orders, setOrders] = useState<Order[]>([])
  const [stock, setStock] = useState<AllStockEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.orders.list(), api.stock.listAll()])
      .then(([o, s]) => { if (!cancelled) { setOrders(o); setStock(s) } })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Failed') })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  if (ctxLoading || loading) return <Loading />
  if (ctxError || error) return <ErrorState message={ctxError || error || ''} />

  const activeShops = shops.filter(s => s.active).length
  const lowStock = stock.filter(s => s.quantity < 30).length

  // const pendingRequests = orders.filter(o => o.status === 'Pending' || o.status === 'Approved').length

  const recentRequests = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // const requestsByShop = shops.filter(s => s.active).map(shop => {
  //   const shopOrders = orders.filter(o => o.shopId === shop.id)
  //   const itemsCount = shopOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0)
  //   return { shop, count: shopOrders.length, itemsCount }
  // })
  // const maxCount = Math.max(1, ...requestsByShop.map(x => x.count))

  const statusToChipColor: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error' | 'default'> = {
    Pending: 'warning',
    Approved: 'info',
    Dispatched: 'primary',
    Completed: 'success',
    Cancelled: 'error',
  }

  const recentColumns: GridColDef<Order>[] = [
    { field: 'id', headerName: 'Request ID', flex: 1, minWidth: 160 },
    { field: 'shopName', headerName: 'Shop', flex: 1.2, minWidth: 160 },
    { field: 'shopUserName', headerName: 'Requested by', flex: 1, minWidth: 140, valueGetter: (v) => v ?? '—' },
    {
      field: 'status', headerName: 'Status', width: 130,
      renderCell: ({ value }) => <Chip label={value} size="small" color={statusToChipColor[value as string]} />,
    },
    {
      field: 'total', headerName: 'Total', type: 'number', width: 130,
      renderCell: ({ value }) => <span className="font-medium">₹ {Number(value).toLocaleString('en-IN')}</span>,
    },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of stock, requests and shops" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Products" value={products.length} icon={Package} iconColor="bg-[#FFE082] text-[#5D4037]" />
        <StatCard label="Active Shops" value={activeShops} icon={Store} iconColor="bg-[#FFD54F] text-[#3E2723]" />
        {/* <StatCard label="Pending Requests" value={pendingRequests} icon={ClipboardList} iconColor="bg-amber-100 text-amber-600" /> */}
        <StatCard label="Low Stock Alerts" value={lowStock} icon={AlertTriangle} iconColor="bg-red-100 text-red-700" />
      </div>

      <Paper sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', overflow: 'hidden' }} elevation={0}>
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
          <h2 className="font-semibold text-slate-900">Recent Stock Requests</h2>
          {/* Hidden while Stock Requests menu is disabled — restore once that menu is re-enabled */}
          {/* <MuiLink href="/admin/requests" underline="hover" sx={{ fontSize: 14, color: 'primary.main', fontWeight: 500 }}>View all</MuiLink> */}
        </Box>
        <DataGrid
          rows={recentRequests}
          columns={recentColumns}
          getRowId={r => r.id}
          hideFooter
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#f8fafc' },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
          }}
        />
      </Paper>

      {/*
        ---- Requests by Shop widget (kept for future use) ----
        To re-enable: uncomment requestsByShop calculation above, replace the
        single-column wrapper around "Recent Stock Requests" with a 3-col grid,
        and add this section as the third column:

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Requests by Shop</h2>
          {requestsByShop.length === 0 ? (
            <p className="text-sm text-slate-500">No data.</p>
          ) : (
            <div className="space-y-4">
              {requestsByShop.map(({ shop, count, itemsCount }) => (
                <div key={shop.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-slate-900">{shop.name}</span>
                    <span className="text-slate-500">{count} requests</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1.5">{itemsCount} items requested</div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600" style={{ width: `${(count / maxCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        Wrapper layout (when both widgets are active):
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">...recent requests table...</div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">...requests by shop...</div>
        </div>

        Also re-enable the stat-card grid: change `md:grid-cols-3` back to `md:grid-cols-2 lg:grid-cols-4`.
      */}
    </div>
  )
}
