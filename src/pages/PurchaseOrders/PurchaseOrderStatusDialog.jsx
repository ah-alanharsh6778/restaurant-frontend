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
import PurchaseOrderStatusChip from './PurchaseOrderStatusChip';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'ORDERED', label: 'ORDERED' },
  { value: 'RECEIVED', label: 'RECEIVED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
];

export const PurchaseOrderStatusDialog = ({
  open,
  onClose,
  onSubmit,
  purchaseOrder = null,
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
    if (purchaseOrder) {
      reset({
        status: String(purchaseOrder.status || 'PENDING').toUpperCase(),
      });
    }
  }, [purchaseOrder, reset, open]);

  const handleFormSubmit = (data) => {
    onSubmit({ status: data.status });
  };

  if (!purchaseOrder) return null;

  const supplierName = typeof purchaseOrder.supplier === 'object' ? purchaseOrder.supplier?.name : (purchaseOrder.supplierName || 'Unknown Vendor');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Update PO Status
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
            {purchaseOrder.poNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supplier: {supplierName} • Total: ${Number(purchaseOrder.totalAmount || 0).toFixed(2)}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <PurchaseOrderStatusChip status={purchaseOrder.status} />
          </Box>
        </Box>

        <TextField
          select
          fullWidth
          id="status"
          label="Purchase Order Status"
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

export default PurchaseOrderStatusDialog;
