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
} from '@mui/material';

export const TableDialog = ({
  open,
  onClose,
  onSubmit,
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
      number: '',
      capacity: 4,
      status: 'AVAILABLE',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        number: initialData.tableNumber || initialData.number || '',
        capacity: initialData.capacity || 4,
        status: initialData.status || 'AVAILABLE',
      });
    } else {
      reset({
        number: '',
        capacity: 4,
        status: 'AVAILABLE',
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data) => {
    onSubmit({
      tableNumber: String(data.number).trim(),
      number: String(data.number).trim(),
      capacity: Number(data.capacity),
      status: data.status,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? 'Edit Restaurant Table' : 'Add New Restaurant Table'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Table Number */}
            <Grid xs={12}>
              <Controller
                name="number"
                control={control}
                rules={{
                  required: 'Table number is required',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Table Number / Name"
                    placeholder="e.g. Table 1, T-05, VIP 2"
                    fullWidth
                    required
                    error={Boolean(errors.number)}
                    helperText={errors.number?.message}
                  />
                )}
              />
            </Grid>

            {/* Capacity */}
            <Grid xs={12} sm={6}>
              <Controller
                name="capacity"
                control={control}
                rules={{
                  required: 'Capacity is required',
                  min: {
                    value: 1,
                    message: 'Capacity must be at least 1 guest',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Seating Capacity"
                    placeholder="e.g. 4"
                    fullWidth
                    required
                    onFocus={(e) => e.target.select()}
                    slotProps={{
                      htmlInput: { min: 1 },
                    }}
                    error={Boolean(errors.capacity)}
                    helperText={errors.capacity?.message}
                  />
                )}
              />
            </Grid>

            {/* Status */}
            <Grid xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                rules={{
                  required: 'Status is required',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    fullWidth
                    required
                    error={Boolean(errors.status)}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
                    <MenuItem value="RESERVED">RESERVED</MenuItem>
                    <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
                    <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
                  </TextField>
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

export default TableDialog;
