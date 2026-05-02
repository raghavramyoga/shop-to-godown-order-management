import { useEffect, useState } from 'react'
import { Plus, Eye } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Chip, IconButton, MenuItem, Paper, Select, Snackbar, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import PageHeader from '../components/PageHeader'
import { Loading, ErrorState } from '../components/LoadingState'
import { api, type Order, type OrderStatus } from '../services/api'

const allStatuses: (OrderStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Dispatched', 'Completed', 'Cancelled']

export default function Orders() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api.orders.list(filter === 'All' ? undefined : { status: filter })
      .then(setOrders)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      await api.orders.updateStatus(orderId, newStatus)
      load()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const statusToColor: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error' | 'default'> = {
    Pending: 'warning',
    Approved: 'info',
    Dispatched: 'primary',
    Completed: 'success',
    Cancelled: 'error',
  }

  const columns: GridColDef<Order>[] = [
    { field: 'id', headerName: 'Request ID', width: 160 },
    {
      field: 'createdAt', headerName: 'Date', width: 130,
      valueFormatter: (v) => new Date(v as string).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    { field: 'shopName', headerName: 'Shop', flex: 1, minWidth: 150 },
    { field: 'shopUserName', headerName: 'Requested by', flex: 1, minWidth: 140, valueGetter: v => v ?? '—' },
    {
      field: 'items', headerName: 'Items', flex: 1.5, minWidth: 200, sortable: false,
      valueGetter: (_v, row) => row.items.map(i => `${i.qty} × ${i.productName}`).join(', '),
    },
    {
      field: 'status', headerName: 'Status', width: 160,
      renderCell: ({ row }) => (
        <Select
          value={row.status}
          size="small"
          disabled={updatingId === row.id}
          onChange={(e) => handleStatusChange(row.id, e.target.value as OrderStatus)}
          sx={{ height: 30, fontSize: 12, fontWeight: 600, '& .MuiSelect-select': { py: 0.25 } }}
          renderValue={(v) => <Chip label={v as string} size="small" color={statusToColor[v as string]} />}
        >
          {(['Pending', 'Approved', 'Dispatched', 'Completed', 'Cancelled'] as OrderStatus[]).map(s =>
            <MenuItem key={s} value={s}>{s}</MenuItem>
          )}
        </Select>
      ),
    },
    {
      field: 'total', headerName: 'Total', type: 'number', width: 120,
      renderCell: ({ value }) => <span className="font-medium">₹ {Number(value).toLocaleString('en-IN')}</span>,
    },
    {
      field: 'actions', headerName: 'Actions', width: 90, sortable: false, filterable: false,
      align: 'right', headerAlign: 'right',
      renderCell: ({ row }) => (
        <IconButton size="small" onClick={() => navigate(`/admin/requests/${row.id}`)} title="View details">
          <Eye className="w-4 h-4" />
        </IconButton>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Stock Requests"
        subtitle={loading ? 'Loading…' : `${orders.length} ${filter === 'All' ? 'total' : filter.toLowerCase()} requests`}
        action={
          <Button
            component={Link}
            to="/admin/requests/new"
            variant="contained"
            color="primary"
            startIcon={<Plus className="w-4 h-4" />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            New Request
          </Button>
        }
      />

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => val && setFilter(val)}
          size="small"
        >
          {allStatuses.map(s => (
            <ToggleButton
              key={s}
              value={s}
              sx={{ textTransform: 'none', fontWeight: 500, '&.Mui-selected': { bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.main' } } }}
            >
              {s}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {error && <ErrorState message={error} />}

      {!error && (
        <Paper sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', overflow: 'hidden' }} elevation={0}>
          {loading ? (
            <Loading label="Loading requests..." />
          ) : (
            <DataGrid
              rows={orders}
              columns={columns}
              getRowId={r => r.id}
              disableRowSelectionOnClick
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[10, 25, 50]}
              sx={{
                border: 0,
                '& .MuiDataGrid-columnHeaders': { bgcolor: '#f8fafc' },
                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
                '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
              }}
            />
          )}
        </Paper>
      )}

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
