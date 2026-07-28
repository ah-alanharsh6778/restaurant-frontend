import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

export const DeleteMenuItemDialog = ({
  open,
  onClose,
  onConfirm,
  menuItem = null,
  isDeleting = false,
}) => {
  return (
    <Dialog open={open} onClose={isDeleting ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>
        Delete Menu Item
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete menu item <strong>{menuItem?.name}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isDeleting} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isDeleting}
          sx={{ fontWeight: 700, minWidth: 100 }}
        >
          {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMenuItemDialog;
