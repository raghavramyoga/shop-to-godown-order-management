import { useEffect, useState } from 'react'
import { Chip, Box, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import PageHeader from '../components/PageHeader'
import { Loading, ErrorState } from '../components/LoadingState'
import { useApp } from '../context/AppContext'
import { api, type StockEntry } from '../services/api'

export default function Stock() {
  const { shops, loading: ctxLoading, error: ctxError } = useApp()
  const [selectedShop, setSelectedShop] = useState<string>('')
  const [stock, setStock] = useState<StockEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (shops.length > 0 && !selectedShop) setSelectedShop(shops[0].id)
  }, [shops, selectedShop])

  useEffect(() => {
    if (!selectedShop) return
    setLoading(true)
    api.stock.byShop(selectedShop)
      .then(setStock)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [selectedShop])

  if (ctxLoading) return <Loading />
  if (ctxError) return <ErrorState message={ctxError} />

  const columns: GridColDef<StockEntry>[] = [
    { field: 'productName', headerName: 'Product', flex: 1.5, minWidth: 180 },
    { field: 'sku', headerName: 'SKU', width: 130, renderCell: ({ value }) => <code className="text-xs text-slate-500">{value}</code> },
    {
      field: 'category', headerName: 'Category', width: 140,
      renderCell: ({ value }) => <Chip label={value} size="small" variant="outlined" />
    },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 110 },
    {
      field: 'status', headerName: 'Status', width: 140,
      renderCell: ({ value }) => {
        const color = value === 'In Stock' ? 'success' : value === 'Low Stock' ? 'warning' : 'error'
        return <Chip label={value} size="small" color={color} variant="filled" />
      },
    },
  ]

  return (
    <div>
      <PageHeader title="Stock by Shop" subtitle="View stock levels at each shop" />

      {shops.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={selectedShop}
            exclusive
            onChange={(_, val) => val && setSelectedShop(val)}
            size="small"
            color="primary"
          >
            {shops.map(shop => (
              <ToggleButton key={shop.id} value={shop.id} sx={{ textTransform: 'none', fontWeight: 500 }}>
                {shop.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      )}

      {error && <ErrorState message={error} />}

      {!error && (
        <Paper sx={{ overflow: 'hidden', borderRadius: 2.5, border: '1px solid #e2e8f0' }} elevation={0}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
            <h2 className="font-semibold text-slate-900">
              Stock at {shops.find(s => s.id === selectedShop)?.name ?? '—'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {loading ? 'Loading stock…' : `${stock.length} products`}
            </p>
          </Box>
          <DataGrid
            rows={stock}
            columns={columns}
            loading={loading}
            getRowId={r => r.productId}
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
        </Paper>
      )}
    </div>
  )
}
