import { Package, Tags } from 'lucide-react'
import { Paper, Chip, Box } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import type { Product } from '../types'

export default function Dashboard() {
  const { products } = useApp()

  const totalProducts = products.length
  const categoriesCount = new Set(products.map(p => p.category)).size

  const recentProducts = [...products].slice(-5).reverse()

  const columns: GridColDef<Product>[] = [
    { field: 'name', headerName: 'Product Name', flex: 1.5, minWidth: 200 },
    {
      field: 'category', headerName: 'Category', width: 130,
      renderCell: ({ value }) => <Chip label={value} size="small" variant="outlined" />,
    },
    {
      field: 'weightValue', headerName: 'Net Weight', width: 130,
      renderCell: ({ row }) => <span className="font-medium">{row.weightValue} {row.weightUnit}</span>,
    },
    {
      field: 'unitPrice', headerName: 'Unit Price', width: 140,
      renderCell: ({ row }) => <span>₹ {row.unitPrice} / {row.unit}</span>,
    },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your product catalog" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard label="Total Products" value={totalProducts} icon={Package} iconColor="bg-[#FFE082] text-[#5D4037]" />
        <StatCard label="Categories" value={categoriesCount} icon={Tags} iconColor="bg-[#FFD54F] text-[#3E2723]" />
      </div>

      <Paper
        sx={{
          borderRadius: 2.5,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          overflow: 'hidden',
          boxShadow: '0 12px 32px -8px rgba(62, 39, 35, 0.18)',
        }}
        elevation={0}
      >
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.4)', bgcolor: 'rgba(255, 213, 79, 0.45)' }}>
          <h2 className="font-semibold text-[#3E2723]">Recently Added Products</h2>
        </Box>
        <DataGrid
          rows={recentProducts}
          columns={columns}
          getRowId={r => r.id}
          hideFooter
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 0,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            color: '#3E2723',
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(255, 255, 255, 0.45)', color: '#1E293B', fontWeight: 600 },
            '& .MuiDataGrid-row': { bgcolor: 'rgba(255, 255, 255, 0.4)' },
            '& .MuiDataGrid-row:hover': { bgcolor: 'rgba(255, 213, 79, 0.45)' },
            '& .MuiDataGrid-cell': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
          }}
        />
      </Paper>
    </div>
  )
}
