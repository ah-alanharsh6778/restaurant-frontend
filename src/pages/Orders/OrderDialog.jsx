import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const OrderDialog = ({
  open,
  order = null,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      status: 'PENDING',
    },
  });

  useEffect(() => {
    if (order) {
      setValue('status', order.status || 'PENDING');
    }
  }, [order, setValue, open]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
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
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ pt: 1 }}>
          <TextField
            margin="normal"
            select
            fullWidth
            id="status"
            label="Ticket Workflow Status"
            {...register('status')}
          >
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
            <MenuItem value="PREPARING">PREPARING (KITCHEN)</MenuItem>
            <MenuItem value="READY">READY</MenuItem>
            <MenuItem value="SERVED">SERVED</MenuItem>
            <MenuItem value="PAID">PAID & COMPLETED</MenuItem>
            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
          </TextField>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={1.5}>
            <Button onClick={onClose} color="inherit" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 120 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Save Status'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
