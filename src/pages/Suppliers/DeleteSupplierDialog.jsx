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

export const DeleteSupplierDialog = ({
  open,
  onClose,
  onConfirm,
  supplier = null,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 5,
          sx: { borderRadius: 3.5, p: 1, minWidth: { xs: 300, sm: 420 } },
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
        Delete Supplier?
      </DialogTitle>

      <DialogContent>
        <DialogContentText color="text.secondary">
          Are you sure you want to delete supplier <strong>{supplier?.name || 'this supplier'}</strong>? This action will permanently remove the supplier profile from the directory.
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
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSupplierDialog;
