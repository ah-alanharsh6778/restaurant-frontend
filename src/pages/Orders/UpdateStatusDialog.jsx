import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const UpdateStatusDialog = ({
  open,
  onClose,
  onUpdateStatus,
  order = null,
  loading = false,
}) => {
  const [status, setStatus] = useState('PENDING');

  useEffect(() => {
    if (order) {
      const current = typeof order.status === 'object' ? order.status?.name : (order.status || 'PENDING');
      setStatus(current);
    }
  }, [order, open]);

  const handleSubmit = () => {
    onUpdateStatus(status);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Update Ticket Status
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <TextField
          select
          fullWidth
          id="status"
          label="Order Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="PENDING">PENDING (New Ticket Received)</MenuItem>
          <MenuItem value="CONFIRMED">CONFIRMED (Accepted by Register)</MenuItem>
          <MenuItem value="PREPARING">PREPARING (Kitchen In Progress)</MenuItem>
          <MenuItem value="READY">READY (Plated / Pass Ready)</MenuItem>
          <MenuItem value="SERVED">SERVED (Delivered to Table)</MenuItem>
          <MenuItem value="COMPLETED">COMPLETED (Paid & Closed)</MenuItem>
          <MenuItem value="CANCELLED">CANCELLED (Ticket Voided)</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ px: 3, fontWeight: 800 }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusDialog;
