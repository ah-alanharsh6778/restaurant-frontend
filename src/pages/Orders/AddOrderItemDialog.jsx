import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const AddOrderItemDialog = ({
  open,
  onClose,
  onSubmit,
  menuItems = [],
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
      menuItem: null,
      quantity: 1,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        menuItem: null,
        quantity: 1,
      });
    }
  }, [open, reset]);

  const handleFormSubmit = (data) => {
    if (!data.menuItem) return;
    onSubmit({
      menuItemId: data.menuItem.id || data.menuItem._id,
      quantity: Number(data.quantity),
    });
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
        Add Item to Order
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Controller
          name="menuItem"
          control={control}
          rules={{ required: 'Menu item is required' }}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={menuItems}
              getOptionLabel={(option) =>
                option ? `${option.name} ($${Number(option.price || 0).toFixed(2)})` : ''
              }
              value={value}
              onChange={(_, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Menu Item"
                  placeholder="Search menu catalog..."
                  error={!!errors.menuItem}
                  helperText={errors.menuItem?.message}
                  sx={{ mb: 2.5 }}
                />
              )}
            />
          )}
        />

        <TextField
          fullWidth
          id="quantity"
          label="Quantity"
          type="number"
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          {...register('quantity', {
            required: 'Quantity is required',
            validate: (val) => Number(val) >= 1 || 'Quantity must be at least 1',
          })}
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
        />
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrderItemDialog;
