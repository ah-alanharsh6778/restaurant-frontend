import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

export const DeleteTableDialog = ({
  open,
  onClose,
  onConfirm,
  table = null,
  isDeleting = false,
}) => {
  const numberVal = table?.tableNumber || table?.number || `Table #${table?.id}`;

  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>
        Delete Restaurant Table
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <strong>{numberVal}</strong>? This action cannot be undone and will permanently remove this table record.
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

export default DeleteTableDialog;
