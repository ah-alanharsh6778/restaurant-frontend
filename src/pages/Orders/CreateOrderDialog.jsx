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
import { getCleanTableName } from '../../utils/formatters';

export const CreateOrderDialog = ({
  open,
  onClose,
  onSubmit,
  tables = [],
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
      table: null,
      items: [{ menuItem: null, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (open) {
      reset({
        table: null,
        items: [{ menuItem: null, quantity: 1 }],
      });
    }
  }, [open, reset]);

  const handleFormSubmit = (data) => {
    if (!data.table) return;

    const validItems = data.items
      .filter((item) => item.menuItem && Number(item.quantity) >= 1)
      .map((item) => ({
        menuItemId: item.menuItem.id || item.menuItem._id,
        quantity: Number(item.quantity),
      }));

    if (validItems.length === 0) return;

    onSubmit({
      tableId: data.table.id || data.table._id,
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
        Create New POS Order
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Table Selector */}
        <Controller
          name="table"
          control={control}
          rules={{ required: 'Restaurant Table is required' }}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={tables}
              getOptionLabel={(option) =>
                option
                  ? `${getCleanTableName(option)} (${option.capacity || 4} Seats)`
                  : ''
              }
              value={value}
              onChange={(_, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Restaurant Table"
                  placeholder="Search table by number..."
                  error={!!errors.table}
                  helperText={errors.table?.message}
                  sx={{ mb: 3 }}
                />
              )}
            />
          )}
        />

        <Divider sx={{ my: 2 }} />

        {/* Order Items Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            Order Items ({fields.length})
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => append({ menuItem: null, quantity: 1 })}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Add Row
          </Button>
        </Box>

        {/* Dynamic Order Item Rows */}
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
              <Box sx={{ flex: 1, minWidth: 240 }}>
                <Controller
                  name={`items.${index}.menuItem`}
                  control={control}
                  rules={{ required: 'Menu Item is required' }}
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
                          size="small"
                          label={`Item #${index + 1}`}
                          placeholder="Select menu item..."
                          error={!!errors.items?.[index]?.menuItem}
                          helperText={errors.items?.[index]?.menuItem?.message}
                        />
                      )}
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: 120 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Quantity"
                  type="number"
                  slotProps={{ htmlInput: { min: 1, step: 1 } }}
                  {...register(`items.${index}.quantity`, {
                    required: 'Qty >= 1',
                    validate: (val) => Number(val) >= 1 || 'Min 1',
                  })}
                  error={!!errors.items?.[index]?.quantity}
                  helperText={errors.items?.[index]?.quantity?.message}
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
            At least one order item is required.
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderDialog;
