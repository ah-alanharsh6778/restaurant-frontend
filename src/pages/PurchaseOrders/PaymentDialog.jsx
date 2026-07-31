import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  TextField,
  MenuItem,
  Paper,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PaymentsIcon from '@mui/icons-material/Payments';

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'UPI', label: 'UPI / Online' },
  { value: 'NET_BANKING', label: 'Net Banking' },
  { value: 'DUE', label: 'Due / Credit' },
];

export const PaymentDialog = ({
  open,
  onClose,
  onSubmit,
  purchaseOrder = null,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amountPaid: 0,
      paymentMethod: 'CASH',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && purchaseOrder) {
      reset({
        amountPaid: purchaseOrder.grandTotal || purchaseOrder.totalAmount || 0,
        paymentMethod: 'CASH',
        notes: `Payment settlement for PO ${purchaseOrder.poNumber}`,
      });
    }
  }, [open, purchaseOrder, reset]);

  const handleFormSubmit = (data) => {
    if (!purchaseOrder) return;
    onSubmit({
      amountPaid: Number(data.amountPaid),
      paymentMethod: data.paymentMethod,
      notes: data.notes || '',
    });
  };

  if (!purchaseOrder) return null;

  const totalAmount = purchaseOrder.grandTotal || purchaseOrder.totalAmount || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PaymentsIcon color="success" />
        Record Payment ({purchaseOrder.poNumber})
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Total Amount Summary */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, background: (theme) => theme.palette.action.hover, borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Vendor Supplier:
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {purchaseOrder.supplier ? purchaseOrder.supplier.name : 'Supplier'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Current Payment Status:
            </Typography>
            <Typography variant="body2" fontWeight={700} color="warning.main">
              {purchaseOrder.paymentStatus || 'PENDING'}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight={800}>
              Total Order Balance:
            </Typography>
            <Typography variant="subtitle1" fontWeight={800} color="primary.main">
              ${totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="Payment Amount ($)"
            type="number"
            slotProps={{ htmlInput: { min: 0.01, step: 'any' } }}
            {...register('amountPaid', {
              required: 'Payment amount is required',
              validate: (val) => Number(val) > 0 || 'Amount must be greater than 0',
            })}
            error={!!errors.amountPaid}
            helperText={errors.amountPaid?.message}
          />

          <Controller
            name="paymentMethod"
            control={control}
            rules={{ required: 'Select payment method' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Payment Method"
                error={!!errors.paymentMethod}
                helperText={errors.paymentMethod?.message}
              >
                {PAYMENT_METHODS.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Transaction Remarks / Notes"
            placeholder="e.g. Bank Ref #99212"
            {...register('notes')}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          color="success"
          disabled={loading}
          sx={{ px: 3, fontWeight: 800 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Record Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
