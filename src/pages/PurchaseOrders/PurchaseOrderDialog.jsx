import { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export const PurchaseOrderDialog = ({
  open,
  onClose,
  onSubmit,
  suppliers = [],
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
      supplier: null,
      items: [{ ingredient: null, quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (open) {
      reset({
        supplier: null,
        items: [{ ingredient: null, quantity: 1, price: 0 }],
      });
    }
  }, [open, reset]);

  const handleFormSubmit = (data) => {
    if (!data.supplier) return;

    const validItems = data.items
      .filter((item) => item.ingredient && Number(item.quantity) > 0 && Number(item.price) >= 0)
      .map((item) => ({
        ingredientId: item.ingredient.id || item.ingredient._id,
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));

    if (validItems.length === 0) return;

    onSubmit({
      supplierId: data.supplier.id || data.supplier._id,
      items: validItems,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Create Purchase Order
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Supplier Selector */}
        <Controller
          name="supplier"
          control={control}
          rules={{ required: 'Supplier is required' }}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={suppliers}
              getOptionLabel={(option) =>
                option ? `${option.name} (${option.contactPerson || 'Vendor'})` : ''
              }
              value={value}
              onChange={(_, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Supplier"
                  placeholder="Search vendor by company name..."
                  error={!!errors.supplier}
                  helperText={errors.supplier?.message}
                  sx={{ mb: 3 }}
                />
              )}
            />
          )}
        />

        <Divider sx={{ my: 2 }} />

        {/* PO Items Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            Purchase Order Items ({fields.length})
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => append({ ingredient: null, quantity: 1, price: 0 })}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Add Item
          </Button>
        </Box>

        {/* Dynamic Items Rows */}
        {fields.map((fieldItem, index) => (
          <Paper
            key={fieldItem.id}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2.5,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1.5, minWidth: 200 }}>
                <Controller
                  name={`items.${index}.ingredient`}
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
                          size="small"
                          label={`Ingredient #${index + 1}`}
                          placeholder="Select raw ingredient..."
                          error={!!errors.items?.[index]?.ingredient}
                          helperText={errors.items?.[index]?.ingredient?.message}
                        />
                      )}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 100 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Quantity"
                  type="number"
                  slotProps={{ htmlInput: { min: 0.01, step: 'any' } }}
                  {...register(`items.${index}.quantity`, {
                    required: 'Qty > 0',
                    validate: (val) => Number(val) > 0 || 'Min > 0',
                  })}
                  error={!!errors.items?.[index]?.quantity}
                  helperText={errors.items?.[index]?.quantity?.message}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 110 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Unit Price ($)"
                  type="number"
                  slotProps={{ htmlInput: { min: 0, step: 'any' } }}
                  {...register(`items.${index}.price`, {
                    required: 'Price >= 0',
                    validate: (val) => Number(val) >= 0 || 'Min >= 0',
                  })}
                  error={!!errors.items?.[index]?.price}
                  helperText={errors.items?.[index]?.price?.message}
                />
              </Box>

              {fields.length > 1 && (
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => remove(index)}
                  sx={{ mt: 0.5 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Paper>
        ))}

        {fields.length === 0 && (
          <Typography variant="body2" color="error" textAlign="center" sx={{ mt: 2 }}>
            At least one item is required for the purchase order.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading || fields.length === 0}
          sx={{ px: 3, fontWeight: 800 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Purchase Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderDialog;
