import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Slide,
  Fade,
} from '@mui/material';
import { MdClose } from 'react-icons/md';

/**
 * RestaurantOS Modal (Dialog) Component
 * Glassmorphic popup modal with backdrop blur, scale entrance animation, header close button, and footer actions.
 */
export const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'sm', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth = true,
  disableBackdropClick = false,
  sx = {},
  ...props
}) => {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return;
    }
    if (onClose) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '24px',
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'scaleIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          ...sx,
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'var(--bg-overlay)',
            backdropFilter: 'blur(6px)',
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
              borderRadius: '10px',
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
