import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Box,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';

export const MenuItemDialog = ({
  open,
  onClose,
  onSubmit,
  categories = [],
  initialData = null,
  isSubmitting = false,
}) => {
  const isEdit = Boolean(initialData?.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: '',
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        categoryId: initialData.categoryId || initialData.category?.id || (categories[0]?.id || ''),
        price: initialData.price || 0,
        isAvailable: Boolean(initialData.isAvailable ?? initialData.available ?? true),
      });
    } else {
      reset({
        name: '',
        description: '',
        categoryId: categories[0]?.id || '',
        price: '',
        isAvailable: true,
      });
    }
  }, [initialData, categories, reset, open]);

  const handleFormSubmit = (data) => {
    onSubmit({
      name: data.name.trim(),
      description: data.description ? data.description.trim() : null,
      categoryId: data.categoryId,
      price: Number(data.price),
      isAvailable: Boolean(data.isAvailable),
    });
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Item Name */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Item name is required',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Item Name"
                    placeholder="e.g. Paneer Butter Masala, Chicken Tikka, Spring Rolls"
                    fullWidth
                    required
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            {/* Category Dropdown */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="categoryId"
                control={control}
                rules={{
                  required: 'Category is required',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category"
                    fullWidth
                    required
                    error={Boolean(errors.categoryId)}
                    helperText={errors.categoryId?.message}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: 'Price is required',
                  min: {
                    value: 0,
                    message: 'Price must be 0 or greater',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Price (₹)"
                    placeholder="e.g. 250"
                    fullWidth
                    required
                    onFocus={(e) => e.target.select()}
                    slotProps={{
                      htmlInput: { min: 0, step: 'any' },
                    }}
                    error={Boolean(errors.price)}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    placeholder="Ingredients, preparation style or taste details..."
                    fullWidth
                    multiline
                    rows={2}
                  />
                )}
              />
            </Grid>

            {/* Available Switch */}
            <Grid item xs={12}>
              <Controller
                name="isAvailable"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                        color="success"
                      />
                    }
                    label={
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {value ? 'Available for Ordering' : 'Currently Unavailable'}
                      </Box>
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ fontWeight: 700, minWidth: 100 }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default MenuItemDialog;
