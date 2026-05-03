import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Package } from 'lucide-react'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, TextField } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import PageHeader from '../components/PageHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { useApp } from '../context/AppContext'
import type { Product } from '../types'

type FormMode = { kind: 'closed' } | { kind: 'create' } | { kind: 'edit'; product: Product }

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp()
  const [formMode, setFormMode] = useState<FormMode>({ kind: 'closed' })
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const closeForm = () => setFormMode({ kind: 'closed' })

  const handleSave = (input: FormInput) => {
    if (formMode.kind === 'edit') updateProduct(formMode.product.id, input)
    else if (formMode.kind === 'create') addProduct(input)
    closeForm()
  }

  const handleConfirmDelete = () => {
    if (pendingDelete) deleteProduct(pendingDelete.id)
    setPendingDelete(null)
  }

  const columns: GridColDef<Product>[] = [
    { field: 'name', headerName: 'Product Name', flex: 1.5, minWidth: 200 },
    {
      field: 'category', headerName: 'Category', width: 130,
      renderCell: ({ value }) => <Chip label={value} size="small" variant="outlined" />,
    },
    { field: 'unit', headerName: 'Type', width: 100 },
    {
      field: 'weightValue', headerName: 'Net Weight', width: 130,
      renderCell: ({ row }) => <span className="font-medium">{row.weightValue} {row.weightUnit}</span>,
    },
    {
      field: 'unitPrice', headerName: 'Unit Price', width: 140,
      renderCell: ({ row }) => <span>₹ {row.unitPrice} / {row.unit}</span>,
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
      ),
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

      <Paper
        sx={{
          borderRadius: 2.5,
          border: '2px solid #1F1F1F',
          overflow: 'hidden',
          boxShadow: '6px 6px 0 0 #FCD835',
          backgroundColor: '#FFFFFF',
          backdropFilter: 'none',
        }}
        elevation={0}
      >
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={r => r.id}
          disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          sx={{
            border: 0,
            backgroundColor: '#FFFFFF',
            color: '#1F1F1F',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#FCD835', color: '#1F1F1F', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', borderBottom: '2px solid #1F1F1F' },
            '& .MuiDataGrid-row': { bgcolor: '#FFFFFF' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#FFF8DC' },
            '& .MuiDataGrid-cell': { borderColor: '#FFF1B3' },
            '& .MuiDataGrid-footerContainer': { bgcolor: '#FFF8DC', borderTop: '2px solid #1F1F1F' },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
          }}
        />
      </Paper>

      <ProductFormDialog
        open={formMode.kind !== 'closed'}
        product={formMode.kind === 'edit' ? formMode.product : null}
        onClose={closeForm}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${pendingDelete?.name ?? ''}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

type FormInput = Omit<Product, 'id' | 'sku'>

function ProductFormDialog({ open, product, onClose, onSave }: {
  open: boolean
  product: Product | null
  onClose: () => void
  onSave: (input: FormInput) => void
}) {
  const isEdit = !!product
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Snacks')
  const [unit, setUnit] = useState('pack')
  const [unitPrice, setUnitPrice] = useState('')
  const [weightValue, setWeightValue] = useState('')
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('g')
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
  }, [open, product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = parseFloat(unitPrice)
    const weightNum = parseFloat(weightValue)
    if (!name.trim()) {
      setErr('Enter a product name')
      return
    }
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      setErr('Enter a valid unit price')
      return
    }
    if (Number.isNaN(weightNum) || weightNum <= 0) {
      setErr('Enter a valid net weight')
      return
    }
    onSave({
      name: name.trim(),
      category,
      unit: unit.trim() || 'pack',
      unitPrice: priceNum,
      weightValue: weightNum,
      weightUnit,
    })
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
          <TextField
            label="Unit Price (₹)"
            type="number"
            slotProps={{ htmlInput: { step: 0.01, min: 0 } }}
            value={unitPrice}
            onChange={e => setUnitPrice(e.target.value)}
            required
            size="small"
          />
          {err && <Box sx={{ color: 'error.main', fontSize: 14 }}>{err}</Box>}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined" color="secondary" sx={{ textTransform: 'none', fontWeight: 500 }}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 600 }}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
