import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Package } from 'lucide-react'
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Snackbar, TextField } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import PageHeader from '../components/PageHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { Loading, ErrorState } from '../components/LoadingState'
import { useApp } from '../context/AppContext'
import { api, type Product, type AllStockEntry } from '../services/api'

type FormMode = { kind: 'closed' } | { kind: 'create' } | { kind: 'edit'; product: Product }

export default function Products() {
  const { products, loading: ctxLoading, error: ctxError, refresh } = useApp()
  const [stock, setStock] = useState<AllStockEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<FormMode>({ kind: 'closed' })
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    api.stock.listAll()
      .then(setStock)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [])

  const closeForm = () => setFormMode({ kind: 'closed' })

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    const target = pendingDelete
    setPendingDelete(null)
    try {
      await api.products.remove(target.id)
      refresh()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to delete')
    }
  }

  if (ctxLoading || loading) return <Loading />
  if (ctxError || error) return <ErrorState message={ctxError || error || ''} />

  const totalStockFor = (productId: string) =>
    stock.filter(s => s.productId === productId).reduce((sum, s) => sum + s.quantity, 0)

  const rows = products.map(p => ({ ...p, totalStock: totalStockFor(p.id) }))

  const columns: GridColDef<typeof rows[number]>[] = [
    { field: 'name', headerName: 'Product Name', flex: 1.5, minWidth: 200 },
    {
      field: 'category', headerName: 'Category', width: 130,
      renderCell: ({ value }) => <Chip label={value} size="small" variant="outlined" />
    },
    { field: 'unit', headerName: 'Type', width: 100 },
    {
      field: 'weightValue', headerName: 'Net Weight', width: 120,
      renderCell: ({ row }) => <span className="font-medium">{row.weightValue} {row.weightUnit}</span>,
    },
    {
      field: 'unitPrice', headerName: 'Unit Price', width: 140,
      renderCell: ({ row }) => <span>₹ {row.unitPrice} / {row.unit}</span>
    },
    {
      field: 'totalStock', headerName: 'Total Stock', type: 'number', width: 130,
      renderCell: ({ row }) => (
        <span className={`font-medium ${row.totalStock < 50 ? 'text-red-600' : 'text-slate-900'}`}>
          {row.totalStock} {row.unit}{row.totalStock !== 1 ? 's' : ''}
        </span>
      )
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false, filterable: false,
      align: 'right', headerAlign: 'right',
      renderCell: ({ row }) => (
        <Box>
          <IconButton size="small" onClick={() => setFormMode({ kind: 'edit', product: row })}>
            <Edit2 className="w-4 h-4" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setPendingDelete(row)}>
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </Box>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in catalog`}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus className="w-4 h-4" />}
            onClick={() => setFormMode({ kind: 'create' })}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Add Product
          </Button>
        }
      />

      <Paper sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', overflow: 'hidden' }} elevation={0}>
        <DataGrid
          rows={rows}
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
      </Paper>

      <ProductFormDialog
        open={formMode.kind !== 'closed'}
        product={formMode.kind === 'edit' ? formMode.product : null}
        onClose={closeForm}
        onSaved={() => { refresh(); closeForm() }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${pendingDelete?.name ?? ''}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
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

function ProductFormDialog({ open, product, onClose, onSaved }: {
  open: boolean
  product: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!product
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Snacks')
  const [unit, setUnit] = useState('pack')
  const [unitPrice, setUnitPrice] = useState('')
  const [weightValue, setWeightValue] = useState('')
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('g')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName(product?.name ?? '')
    setCategory(product?.category ?? 'Snacks')
    setUnit(product?.unit ?? 'pack')
    setUnitPrice(product?.unitPrice?.toString() ?? '')
    setWeightValue(product?.weightValue?.toString() ?? '')
    setWeightUnit(product?.weightUnit ?? 'g')
    setErr(null)
    setSubmitting(false)
  }, [open, product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErr(null)
    try {
      const body: Product = {
        id: product?.id ?? '',
        sku: product?.sku ?? '',
        name,
        category,
        unitPrice: parseFloat(unitPrice),
        unit,
        weightValue: parseFloat(weightValue) || 0,
        weightUnit,
      }
      if (isEdit && product) await api.products.update(product.id, body)
      else                   await api.products.create(body)
      onSaved()
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Failed')
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Package className="w-5 h-5" />
          {isEdit ? 'Edit Product' : 'Add Product'}
        </Box>
        <IconButton size="small" onClick={onClose}><X className="w-4 h-4" /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isEdit && product && (
            <Box sx={{ display: 'flex', gap: 2, fontSize: 13, color: '#64748b' }}>
              <span><b>ID:</b> {product.id}</span>
              <span><b>SKU:</b> {product.sku}</span>
            </Box>
          )}
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} required size="small" />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField select label="Category" value={category} onChange={e => setCategory(e.target.value)} size="small">
              <MenuItem value="Snacks">Snacks</MenuItem>
              <MenuItem value="Beverages">Beverages</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Biscuits">Biscuits</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
            </TextField>
            <TextField label="Type" value={unit} onChange={e => setUnit(e.target.value)} placeholder="pack" required size="small" />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Net Weight"
              type="number"
              slotProps={{ htmlInput: { step: 0.001, min: 0 } }}
              value={weightValue}
              onChange={e => setWeightValue(e.target.value)}
              required
              size="small"
              sx={{ flex: 2 }}
              placeholder="100"
            />
            <TextField
              select
              label="Unit"
              value={weightUnit}
              onChange={e => setWeightUnit(e.target.value as 'g' | 'kg')}
              size="small"
              sx={{ flex: 1, minWidth: 90 }}
            >
              <MenuItem value="g">g</MenuItem>
              <MenuItem value="kg">kg</MenuItem>
            </TextField>
          </Box>
          <TextField label="Unit Price (₹)" type="number" slotProps={{ htmlInput: { step: 0.01 } }} value={unitPrice} onChange={e => setUnitPrice(e.target.value)} required size="small" />
          {err && <Box sx={{ color: 'error.main', fontSize: 14 }}>{err}</Box>}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting} sx={{ textTransform: 'none', fontWeight: 600 }}>
            {submitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
