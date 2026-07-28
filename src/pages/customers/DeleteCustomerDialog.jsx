import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { Modal, Button } from '../../components/ui';

export const DeleteCustomerDialog = ({
  open,
  onClose,
  onConfirm,
  customer = null,
  isDeleting = false,
}) => {
  const [error, setError] = useState('');

  if (!customer) return null;

  const handleConfirmDelete = async () => {
    setError('');
    try {
      await onConfirm(customer.id);
    } catch (err) {
      console.error('Delete Customer Error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete customer record.';
      setError(msg);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Customer Account"
      subtitle="Are you sure you want to remove this customer record?"
      maxWidth="xs"
    >
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
            borderRadius: '12px',
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
          }}
        >
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="var(--text-secondary)" mb={3}>
        You are about to soft delete customer record{' '}
        <Typography component="span" fontWeight={800} color="var(--text-primary)">
          "{customer.fullName}"
        </Typography>
        . This action will deactivate their account in the database.
      </Typography>

      <Box display="flex" justifyContent="flex-end" gap={1.5}>
        <Button variant="outlined" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmDelete} loading={isDeleting}>
          Delete Customer
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteCustomerDialog;
