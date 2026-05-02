import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, User } from 'lucide-react'
import { Alert, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Paper, Snackbar, Switch, TextField } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import PageHeader from '../components/PageHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { Loading, ErrorState } from '../components/LoadingState'
import { useApp } from '../context/AppContext'
import { api, type ShopUserAccount } from '../services/api'

type FormMode = { kind: 'closed' } | { kind: 'create' } | { kind: 'edit'; user: ShopUserAccount }

export default function ShopUsers() {
  const { shops, loading: ctxLoading, error: ctxError } = useApp()
  const [users, setUsers] = useState<ShopUserAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<FormMode>({ kind: 'closed' })
  const [pendingDelete, setPendingDelete] = useState<ShopUserAccount | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api.shopUsers.list()
      .then(setUsers)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const closeForm = () => setFormMode({ kind: 'closed' })

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    const target = pendingDelete
    setPendingDelete(null)
    try {
      await api.shopUsers.remove(target.id)
      load()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to delete')
    }
  }

  if (ctxLoading || loading) return <Loading />
  if (ctxError || error) return <ErrorState message={ctxError || error || ''} />

  const columns: GridColDef<ShopUserAccount>[] = [
    {
      field: 'fullName', headerName: 'User', flex: 1.2, minWidth: 180,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.dark', fontSize: 13, fontWeight: 600 }}>
            {row.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <span className="font-medium">{row.fullName}</span>
        </Box>
      ),
    },
    {
      field: 'username', headerName: 'Username', width: 130,
      renderCell: ({ value }) => <code className="text-xs">{value}</code>,
    },
    { field: 'shopName', headerName: 'Shop', flex: 1, minWidth: 150 },
    {
      field: 'active', headerName: 'Status', width: 110,
      renderCell: ({ value }) => (
        <Chip label={value ? 'Active' : 'Inactive'} size="small" color={value ? 'success' : 'default'} variant="filled" />
      ),
    },
    {
      field: 'createdAt', headerName: 'Created', width: 130,
      valueFormatter: (v) => new Date(v as string).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      field: 'actions', headerName: 'Actions', width: 110, sortable: false, filterable: false,
      align: 'right', headerAlign: 'right',
      renderCell: ({ row }) => (
        <Box>
          <IconButton size="small" onClick={() => setFormMode({ kind: 'edit', user: row })}><Edit2 className="w-4 h-4" /></IconButton>
          <IconButton size="small" color="error" onClick={() => setPendingDelete(row)}><Trash2 className="w-4 h-4" /></IconButton>
        </Box>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Shop Users"
        subtitle={`${users.length} users across ${shops.length} shops`}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus className="w-4 h-4" />}
            disabled={shops.length === 0}
            onClick={() => setFormMode({ kind: 'create' })}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Add Shop User
          </Button>
        }
      />

      <Paper sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', overflow: 'hidden' }} elevation={0}>
        <DataGrid
          rows={users}
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

      <ShopUserFormDialog
        open={formMode.kind !== 'closed'}
        user={formMode.kind === 'edit' ? formMode.user : null}
        shops={shops}
        onClose={closeForm}
        onSaved={() => { load(); closeForm() }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete shop user"
        message={`Are you sure you want to delete user "${pendingDelete?.fullName ?? ''}" (@${pendingDelete?.username ?? ''})? This action cannot be undone.`}
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

function ShopUserFormDialog({ open, user, shops, onClose, onSaved }: {
  open: boolean
  user: ShopUserAccount | null
  shops: { id: string; name: string; active: boolean }[]
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!user
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [shopId, setShopId] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setUsername(user?.username ?? '')
    setPassword('')
    setFullName(user?.fullName ?? '')
    setShopId(user?.shopId ?? shops.find(s => s.active)?.id ?? '')
    setActive(user?.active ?? true)
    setErr(null)
    setSubmitting(false)
  }, [open, user, shops])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErr(null)
    try {
      if (isEdit && user) {
        await api.shopUsers.update(user.id, { fullName, password: password || undefined, shopId, active })
      } else {
        await api.shopUsers.create({ username, password, fullName, shopId })
      }
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
          <User className="w-5 h-5" />
          {isEdit ? 'Edit Shop User' : 'Add Shop User'}
        </Box>
        <IconButton size="small" onClick={onClose}><X className="w-4 h-4" /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} disabled={isEdit} required size="small" />
          <TextField
            label={isEdit ? 'Password (leave blank to keep)' : 'Password'}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required={!isEdit}
            size="small"
          />
          <TextField label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required size="small" />
          <TextField select label="Assigned Shop" value={shopId} onChange={e => setShopId(e.target.value)} required size="small">
            {shops.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
          {isEdit && (
            <FormControlLabel
              control={<Switch checked={active} onChange={e => setActive(e.target.checked)} />}
              label="Active"
            />
          )}
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
