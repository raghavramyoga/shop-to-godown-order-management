import { AlertTriangle } from 'lucide-react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'error' | 'primary' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  confirmColor = 'error',
  onConfirm, onCancel,
}: Props) {
  const iconColors: Record<string, { bg: string; fg: string }> = {
    error:   { bg: '#fee2e2', fg: '#dc2626' },
    primary: { bg: '#fef3c7', fg: '#d97706' },
    warning: { bg: '#fef3c7', fg: '#d97706' },
  }
  const c = iconColors[confirmColor]

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600 }}>
        <Box sx={{ width: 36, height: 36, bgcolor: c.bg, color: c.fg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle className="w-5 h-5" />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent>
        <p className="text-sm text-slate-600">{message}</p>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ textTransform: 'none' }}>{cancelLabel}</Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor} sx={{ textTransform: 'none', fontWeight: 600 }}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  )
}
