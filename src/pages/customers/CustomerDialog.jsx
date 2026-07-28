import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid, Alert } from '@mui/material';
import { MdPerson, MdEmail, MdPhone, MdStar } from 'react-icons/md';

import { customerSchema } from '../../utils/customer.validation';
import { Modal, Input, Button } from '../../components/ui';

export const CustomerDialog = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const isEdit = Boolean(initialData?.id);
  const [backendError, setBackendError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      loyaltyPoints: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        loyaltyPoints: Number(initialData.loyaltyPoints || 0),
      });
    } else {
      reset({
        fullName: '',
        email: '',
        phone: '',
        loyaltyPoints: 0,
      });
    }
    setBackendError('');
  }, [initialData, reset, open]);

  const handleFormSubmit = async (data) => {
    setBackendError('');
    try {
      await onSubmit(data);
    } catch (err) {
      console.error('Customer Form Error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save customer details. Please verify your inputs.';
      setBackendError(msg);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Customer Profile' : 'Add New Customer'}
      subtitle={
        isEdit
          ? `Update customer details for ${initialData?.fullName}`
          : 'Register a new customer account in RestaurantOS'
      }
      maxWidth="sm"
    >
      {backendError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: '12px',
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            border: '1px solid var(--color-danger)',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          {backendError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Input
              label="Full Name *"
              placeholder="John Doe"
              startIcon={<MdPerson size={20} />}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
              {...register('fullName')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Input
              label="Email Address"
              placeholder="john@example.com"
              type="email"
              startIcon={<MdEmail size={20} />}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Input
              label="Phone Number"
              placeholder="+1-555-0199"
              startIcon={<MdPhone size={20} />}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              {...register('phone')}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              label="Loyalty Points"
              placeholder="0"
              type="number"
              startIcon={<MdStar size={20} />}
              error={Boolean(errors.loyaltyPoints)}
              helperText={errors.loyaltyPoints?.message}
              {...register('loyaltyPoints', { valueAsNumber: true })}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3.5}>
          <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting} glow>
            {isEdit ? 'Save Changes' : 'Create Customer'}
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default CustomerDialog;
