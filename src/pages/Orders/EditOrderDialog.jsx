import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OrderStatusChip from './OrderStatusChip';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'CONFIRMED', label: 'CONFIRMED' },
  { value: 'PREPARING', label: 'PREPARING' },
  { value: 'READY', label: 'READY' },
  { value: 'SERVED', label: 'SERVED' },
  { value: 'COMPLETED', label: 'COMPLETED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
];

export const EditOrderDialog = ({
  open,
  onClose,
  onSubmit,
  order = null,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: 'PENDING',
    },
  });

  useEffect(() => {
    if (order) {
      reset({
        status: String(order.status || 'PENDING').toUpperCase(),
      });
    }
  }, [order, reset, open]);

  const handleFormSubmit = (data) => {
    onSubmit({ status: data.status });
  };

  if (!order) return null;

  const tableNumber = typeof order.table === 'object' ? (order.table?.tableNumber || order.table?.number || order.table?.name) : (order.tableNumber || 'N/A');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Update Order Status
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={800}>
            {order.orderNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Table {tableNumber} • Total: ${Number(order.totalAmount || 0).toFixed(2)}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <OrderStatusChip status={order.status} />
          </Box>
        </Box>

        <TextField
          select
          fullWidth
          id="status"
          label="Order Status"
          {...register('status', { required: 'Status is required' })}
          error={!!errors.status}
          helperText={errors.status?.message}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading}
          sx={{ px: 3, fontWeight: 800 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrderDialog;
