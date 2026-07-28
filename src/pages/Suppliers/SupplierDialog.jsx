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

export const SupplierDialog = ({
  open,
  onClose,
  onSubmit,
  supplier = null,
  loading = false,
}) => {
  const isEditing = !!supplier;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      gstNumber: '',
      address: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name || '',
        contactPerson: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        gstNumber: supplier.gstNumber || '',
        address: supplier.address || '',
        status: supplier.isActive === false || supplier.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
    } else {
      reset({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        gstNumber: '',
        address: '',
        status: 'ACTIVE',
      });
    }
  }, [supplier, reset, open]);

  const handleFormSubmit = (data) => {
    onSubmit({
      name: data.name,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      gstNumber: data.gstNumber || null,
      address: data.address || '',
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
        {isEditing ? `Edit Supplier: ${supplier?.name}` : 'Add Supplier Profile'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="name"
              label="Supplier / Company Name"
              placeholder="e.g. Fresh Farms Organics Ltd."
              autoFocus
              {...register('name', {
                required: 'Supplier Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="contactPerson"
              label="Contact Representative"
              placeholder="e.g. John Doe"
              {...register('contactPerson', {
                required: 'Contact Person is required',
              })}
              error={!!errors.contactPerson}
              helperText={errors.contactPerson?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="phone"
              label="Phone Number"
              placeholder="e.g. +1 555 123 4567"
              {...register('phone', {
                required: 'Phone Number is required',
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              placeholder="e.g. vendor@freshfarms.com"
              {...register('email', {
                required: 'Email Address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="gstNumber"
              label="GST / Tax Identification Number (Optional)"
              placeholder="e.g. 22AAAAA0000A1Z5"
              {...register('gstNumber')}
              error={!!errors.gstNumber}
              helperText={errors.gstNumber?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              id="address"
              label="Warehouse / Business Address (Optional)"
              placeholder="e.g. 100 Agriculture Way, Building B, Sector 4..."
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              id="status"
              label="Status"
              {...register('status', {
                required: 'Status is required',
              })}
              error={!!errors.status}
              helperText={errors.status?.message}
            >
              <MenuItem value="ACTIVE">Active Supplier</MenuItem>
              <MenuItem value="INACTIVE">Inactive Supplier</MenuItem>
            </TextField>
          </Grid>
        </Grid>
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
          {loading ? <CircularProgress size={24} color="inherit" /> : isEditing ? 'Save Changes' : 'Create Supplier'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierDialog;
