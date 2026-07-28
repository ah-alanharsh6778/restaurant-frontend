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

export const RecipeIngredientDialog = ({
  open,
  onClose,
  onSubmit,
  ingredientsList = [],
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
      ingredient: null,
      quantity: 1,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        ingredient: null,
        quantity: 1,
      });
    }
  }, [open, reset]);

  const handleFormSubmit = (data) => {
    if (!data.ingredient) return;
    onSubmit({
      ingredientId: data.ingredient.id || data.ingredient._id,
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
        Add Recipe Ingredient
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
          name="ingredient"
          control={control}
          rules={{ required: 'Ingredient is required' }}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={ingredientsList}
              getOptionLabel={(option) =>
                option ? `${option.name} (${option.unit || 'unit'})` : ''
              }
              value={value}
              onChange={(_, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Ingredient"
                  placeholder="Search ingredient..."
                  error={!!errors.ingredient}
                  helperText={errors.ingredient?.message}
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
          slotProps={{ htmlInput: { min: 0.01, step: 'any' } }}
          {...register('quantity', {
            required: 'Quantity is required',
            validate: (val) => Number(val) > 0 || 'Quantity must be greater than 0',
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Ingredient'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeIngredientDialog;
