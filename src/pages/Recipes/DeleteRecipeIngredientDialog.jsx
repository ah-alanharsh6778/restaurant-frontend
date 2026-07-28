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

export const DeleteRecipeIngredientDialog = ({
  open,
  onClose,
  onConfirm,
  ingredientItem = null,
  loading = false,
}) => {
  const name = ingredientItem?.ingredient?.name || ingredientItem?.name || 'this ingredient';

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
        Remove Ingredient?
      </DialogTitle>

      <DialogContent>
        <DialogContentText color="text.secondary">
          Are you sure you want to remove <strong>{name}</strong> from this recipe?
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
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Remove'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRecipeIngredientDialog;
