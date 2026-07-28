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

export const RecipeDialog = ({
  open,
  onClose,
  onSubmit,
  recipe = null,
  menuItems = [],
  loading = false,
}) => {
  const isEditing = !!recipe;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      menuItem: null,
    },
  });

  useEffect(() => {
    if (recipe) {
      const matchedMenuItem = menuItems.find(
        (item) => item.id === recipe.menuItemId || item.id === recipe.menuItem?.id
      ) || recipe.menuItem || null;

      reset({
        name: recipe.name || '',
        description: recipe.description || '',
        menuItem: matchedMenuItem,
      });
    } else {
      reset({
        name: '',
        description: '',
        menuItem: null,
      });
    }
  }, [recipe, menuItems, reset, open]);

  const handleFormSubmit = (data) => {
    if (!isEditing && !data.menuItem) return;

    const payload = {
      name: data.name,
      description: data.description || '',
    };

    if (!isEditing) {
      payload.menuItemId = data.menuItem.id || data.menuItem._id;
    }

    onSubmit(payload);
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
        {isEditing ? `Edit Recipe: ${recipe?.name}` : 'Create Recipe Specification'}
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
          label="Recipe Name"
          placeholder="e.g. Signature Margherita Pizza Recipe"
          autoFocus
          {...register('name', {
            required: 'Recipe Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mb: 2.5 }}
        />

        <Controller
          name="menuItem"
          control={control}
          rules={{ required: isEditing ? false : 'Menu Item is required' }}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={menuItems}
              getOptionLabel={(option) =>
                option ? `${option.name} ($${Number(option.price || 0).toFixed(2)})` : ''
              }
              value={value}
              disabled={isEditing}
              onChange={(_, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Linked Menu Item"
                  placeholder="Select dish from menu..."
                  error={!!errors.menuItem}
                  helperText={
                    errors.menuItem?.message ||
                    (isEditing ? 'Linked Menu Item cannot be changed after creation' : '')
                  }
                  sx={{ mb: 2.5 }}
                />
              )}
            />
          )}
        />

        <TextField
          margin="normal"
          fullWidth
          multiline
          rows={3}
          id="description"
          label="Description / Preparation Instructions"
          placeholder="e.g. Dough preparation, baking temperature, and topping order..."
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : isEditing ? 'Save Changes' : 'Create Recipe'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeDialog;
