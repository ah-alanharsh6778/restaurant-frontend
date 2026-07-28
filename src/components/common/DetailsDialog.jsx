import React from 'react';
import { Button, Box, Typography, Divider } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ResponsiveDialog from './ResponsiveDialog';

export const DetailsDialog = ({
  open,
  onClose,
  title = 'Item Details',
  subtitle = 'Complete item specifications',
  icon = VisibilityIcon,
  children,
  actions,
}) => {
  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={title}
      subtitle={subtitle}
      icon={icon}
      iconColor="info.main"
      actions={
        actions || (
          <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
            Close
          </Button>
        )
      }
    >
      <Box sx={{ py: 1 }}>{children}</Box>
    </ResponsiveDialog>
  );
};

export default DetailsDialog;
