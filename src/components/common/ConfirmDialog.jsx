import React from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ResponsiveDialog from './ResponsiveDialog';

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'error', // 'error' | 'primary' | 'warning'
  loading = false,
  icon = WarningIcon,
}) => {
  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={title}
      subtitle="Action confirmation required"
      icon={icon}
      iconColor={`${confirmColor}.main`}
      actions={
        <>
          <Button onClick={onClose} disabled={loading} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color={confirmColor}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Typography variant="body1" color="text.secondary" sx={{ py: 1 }}>
        {message}
      </Typography>
    </ResponsiveDialog>
  );
};

export default ConfirmDialog;
