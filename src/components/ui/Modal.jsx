import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { MdClose } from 'react-icons/md';

/**
 * RestaurantOS Modal (Dialog) Component
 * Solid rectangular popup modal with header close button and footer actions.
 */
export const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  disableBackdropClick = false,
  sx = {},
  PaperProps,
  ...props
}) => {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return;
    }
    if (onClose) onClose();
  };

  const paperSx = {
    borderRadius: '4px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subdued)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    ...PaperProps?.sx,
    ...sx,
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{
        paper: {
          elevation: 0,
          sx: paperSx,
        },
        backdrop: {
          sx: {
            backgroundColor: 'var(--bg-overlay)',
          },
        },
      }}
      {...props}
    >
      {/* Header */}
      {title && (
        <DialogTitle
          sx={{
            p: 3,
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subdued)',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={800} color="var(--text-primary)">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="var(--text-secondary)">
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'var(--text-secondary)',
              borderRadius: '4px',
              '&:hover': { backgroundColor: 'var(--bg-subtle)' },
            }}
          >
            <MdClose size={20} />
          </IconButton>
        </DialogTitle>
      )}

      {/* Body */}
      <DialogContent sx={{ p: 3, color: 'var(--text-primary)' }}>{children}</DialogContent>

      {/* Footer Actions */}
      {actions && (
        <DialogActions
          sx={{
            p: 2.5,
            pt: 1.5,
            borderTop: '1px solid var(--border-subdued)',
            backgroundColor: 'var(--bg-subtle)',
            gap: 1.5,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
