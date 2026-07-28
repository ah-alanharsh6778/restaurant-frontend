import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  CircularProgress,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const IngredientDialog = ({
  open,
  onClose,
  onSubmit,
  ingredient = null,
  loading = false,
}) => {
  const isEditing = !!ingredient;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      unit: '',
      quantity: 0,
      minimumStock: 0,
      costPerUnit: 0,
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (ingredient) {
      reset({
        name: ingredient.name || '',
        unit: ingredient.unit || '',
        quantity: ingredient.quantity !== undefined ? ingredient.quantity : 0,
        minimumStock: ingredient.minimumStock !== undefined ? ingredient.minimumStock : (ingredient.minStock || 0),
        costPerUnit: ingredient.costPerUnit !== undefined ? ingredient.costPerUnit : 0,
        status: ingredient.isActive === false || ingredient.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
    } else {
      reset({
        name: '',
        unit: '',
        quantity: 0,
        minimumStock: 0,
        costPerUnit: 0,
        status: 'ACTIVE',
      });
    }
  }, [ingredient, reset, open]);

  const handleFormSubmit = (data) => {
    onSubmit({
      name: data.name,
      unit: data.unit,
      quantity: Number(data.quantity),
      minimumStock: Number(data.minimumStock),
      costPerUnit: Number(data.costPerUnit || 0),
      isActive: data.status === 'ACTIVE',
    });
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
        {isEditing ? `Edit Ingredient: ${ingredient?.name}` : 'Add Ingredient'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <TextField
          margin="normal"
          fullWidth
          id="name"
          label="Ingredient Name"
          placeholder="e.g. Extra Virgin Olive Oil, All-Purpose Flour"
          autoFocus
          {...register('name', {
            required: 'Ingredient Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mb: 2.5 }}
        />

        <TextField
          margin="normal"
          fullWidth
          id="unit"
          label="Unit"
          placeholder="e.g. kg, liters, grams, pcs, oz"
          {...register('unit', {
            required: 'Unit is required',
          })}
          error={!!errors.unit}
          helperText={errors.unit?.message}
          sx={{ mb: 2.5 }}
        />

        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              id="quantity"
              label="Available Quantity"
              type="number"
              slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              {...register('quantity', {
                required: 'Available Quantity is required',
                min: {
                  value: 0,
                  message: 'Quantity must be >= 0',
                },
              })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              id="minimumStock"
              label="Minimum Stock"
              type="number"
              slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              {...register('minimumStock', {
                required: 'Minimum Stock is required',
                min: {
                  value: 0,
                  message: 'Min Stock must be >= 0',
                },
              })}
              error={!!errors.minimumStock}
              helperText={errors.minimumStock?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              id="costPerUnit"
              label="Cost / Unit ($)"
              type="number"
              slotProps={{ htmlInput: { min: 0, step: 'any' } }}
              {...register('costPerUnit', {
                min: {
                  value: 0,
                  message: 'Cost must be >= 0',
                },
              })}
              error={!!errors.costPerUnit}
              helperText={errors.costPerUnit?.message}
            />
          </Grid>
        </Grid>

        <TextField
          margin="normal"
          select
          fullWidth
          id="status"
          label="Status"
          value={watch('status') || 'ACTIVE'}
          {...register('status', {
            required: 'Status is required',
          })}
          error={!!errors.status}
          helperText={errors.status?.message}
        >
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
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
          {loading ? <CircularProgress size={24} color="inherit" /> : isEditing ? 'Save Changes' : 'Create Ingredient'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IngredientDialog;
