import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const DeleteOrderItemDialog = ({
  open,
  onClose,
  onConfirm,
  orderItem = null,
  loading = false,
}) => {
  const name = orderItem?.menuItem?.name || orderItem?.name || 'this item';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 5,
          sx: { borderRadius: 3.5, p: 1, minWidth: { xs: 300, sm: 400 } },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'error.light',
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningAmberIcon />
        </Box>
        Remove Item from Order?
      </DialogTitle>

      <DialogContent>
        <DialogContentText color="text.secondary">
          Are you sure you want to remove <strong>{name}</strong> from this order?
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{ minWidth: 110, fontWeight: 800 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Remove Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteOrderItemDialog;
