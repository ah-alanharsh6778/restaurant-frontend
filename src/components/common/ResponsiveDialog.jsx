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
  maxWidth = 'sm', // 'xs' | 'sm' | 'md' | 'lg'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            width: { xs: '95%', sm: '90%', md: maxWidth === 'md' ? 800 : maxWidth === 'xs' ? 440 : 600 },
            maxWidth: '100%',
            m: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 48px)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
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
          bgcolor: '#FFFFFF',
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {TitleIcon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
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
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' }, lineHeight: 1.2 }}>
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
            borderRadius: 2,
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
          bgcolor: '#FFFFFF',
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
            bgcolor: '#FAFAFA',
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
