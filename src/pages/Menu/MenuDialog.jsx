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
  FormControlLabel,
  Switch,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const MenuDialog = ({
  open,
  onClose,
  onSubmit,
  item = null,
  categories = [],
  loading = false,
}) => {
  const isEditing = !!item;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const isAvailableValue = watch('isAvailable');

  useEffect(() => {
    if (item) {
      reset({
        name: item.name || '',
        description: item.description || '',
        categoryId: item.categoryId || item.category?.id || (categories[0]?.id || ''),
        price: item.price || '',
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      });
    } else {
      reset({
        name: '',
        description: '',
        categoryId: categories[0]?.id || categories[0]?._id || '',
        price: '',
        isAvailable: true,
      });
    }
  }, [item, categories, reset, open]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      price: Number(data.price),
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
        {isEditing ? `Edit Menu Item: ${item?.name}` : 'Create New Menu Item'}
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
          label="Item Name"
          placeholder="e.g. Grilled Salmon Steak, Truffle Pasta"
          autoFocus
          {...register('name', {
            required: 'Item name is required',
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
          select
          fullWidth
          id="categoryId"
          label="Category"
          {...register('categoryId', {
            required: 'Category is required',
          })}
          error={!!errors.categoryId}
          helperText={errors.categoryId?.message}
          sx={{ mb: 2.5 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          margin="normal"
          fullWidth
          id="price"
          label="Price ($)"
          type="number"
          step="0.01"
          {...register('price', {
            required: 'Price is required',
            min: {
              value: 0.01,
              message: 'Price must be greater than zero',
            },
          })}
          error={!!errors.price}
          helperText={errors.price?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2.5 }}
        />

        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Description / Ingredients Summary"
          multiline
          rows={3}
          placeholder="Detailed dish description, allergen flags, and side choices"
          {...register('description')}
          sx={{ mb: 2.5 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isAvailableValue}
              onChange={(e) => setValue('isAvailable', e.target.checked)}
              color="primary"
            />
          }
          label="Available for POS Order Taking"
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
          {loading ? <CircularProgress size={24} color="inherit" /> : isEditing ? 'Save Changes' : 'Create Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuDialog;
