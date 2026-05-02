import { AlertTriangle } from 'lucide-react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  onConfirm, onCancel,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600 }}>
        <Box sx={{ width: 36, height: 36, bgcolor: '#fee2e2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle className="w-5 h-5" />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent>
        <p className="text-sm text-[#5D4037]">{message}</p>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} variant="outlined" color="secondary" sx={{ textTransform: 'none', fontWeight: 500 }}>{cancelLabel}</Button>
        <Button onClick={onConfirm} variant="contained" color="error" sx={{ textTransform: 'none', fontWeight: 600 }}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  )
}
