import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const ResponsiveDialog = ({
  open,
  onClose,
  title,
  subtitle,
  icon: TitleIcon,
  iconColor = 'primary.main',
  children,
  actions,
  maxWidth = 'sm',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableRestoreFocus
      fullScreen={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '4px',
            width: { xs: '95%', sm: '90%', md: maxWidth === 'md' ? 800 : maxWidth === 'xs' ? 440 : 600 },
            maxWidth: '100%',
            m: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 48px)',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
          },
        },
      }}
    >
      {/* Sticky Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2.5, sm: 3 },
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {TitleIcon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '4px',
                bgcolor: 'action.hover',
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TitleIcon />
            </Box>
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.15rem' }, lineHeight: 1.2 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.2, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close dialog"
          sx={{
            color: 'text.secondary',
            borderRadius: '4px',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Scrollable Content */}
      <DialogContent
        dividers
        sx={{
          p: { xs: 2.5, sm: 3 },
          overflowY: 'auto',
          bgcolor: 'background.paper',
        }}
      >
        {children}
      </DialogContent>

      {/* Sticky Actions Footer */}
      {actions && (
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3 },
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ResponsiveDialog;
