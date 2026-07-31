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

export const PurchaseOrderItemDialog = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  ingredientsList = [],
  loading = false,
}) => {
  const isEdit = Boolean(initialData?.id || initialData?.ingredientId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ingredient: null,
      quantity: 1,
      price: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        const ingId = initialData.ingredientId || initialData.ingredient?.id || initialData.ingredient?._id;
        const foundIng = initialData.ingredient || ingredientsList.find((i) => String(i.id || i._id) === String(ingId)) || null;
        reset({
          ingredient: foundIng,
          quantity: initialData.quantity || 1,
          price: initialData.price !== undefined ? initialData.price : (foundIng?.costPerUnit || 0),
        });
      } else {
        reset({
          ingredient: null,
          quantity: 1,
          price: 0,
        });
      }
    }
  }, [open, initialData, ingredientsList, reset]);

  const handleFormSubmit = (data) => {
    if (!data.ingredient) return;
    onSubmit({
      id: initialData?.id,
      ingredient: data.ingredient,
      ingredientId: data.ingredient.id || data.ingredient._id,
      quantity: Number(data.quantity),
      price: Number(data.price),
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
        {isEdit ? 'Edit Line Item' : 'Add Item to Purchase Order'}
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
              isOptionEqualToValue={(option, val) => (option?.id || option?._id) === (val?.id || val?._id)}
              getOptionLabel={(option) =>
                option ? `${option.name} (${option.unit || 'unit'})` : ''
              }
              value={value}
              onChange={(_, newValue) => {
                onChange(newValue);
                if (newValue && newValue.costPerUnit !== undefined && !isEdit) {
                  setValue('price', newValue.costPerUnit);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Raw Ingredient"
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
          sx={{ mb: 2.5 }}
        />

        <TextField
          fullWidth
          id="price"
          label="Unit Price ($)"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: 'any' } }}
          {...register('price', {
            required: 'Unit Price is required',
            validate: (val) => Number(val) >= 0 || 'Price must be greater than or equal to 0',
          })}
          error={!!errors.price}
          helperText={errors.price?.message}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : isEdit ? 'Save Item' : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderItemDialog;
