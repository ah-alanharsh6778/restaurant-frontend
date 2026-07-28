import React from 'react';
import { toast } from 'react-toastify';
import { Box, Typography, Paper } from '@mui/material';
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md';

/**
 * Custom Toast Content Component for ReactToastify
 */
export const ToastContent = ({ title, message, type = 'success' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheckCircle color="var(--color-success)" size={22} />;
      case 'error':
        return <MdError color="var(--color-danger)" size={22} />;
      case 'warning':
        return <MdWarning color="var(--color-warning)" size={22} />;
      case 'info':
      default:
        return <MdInfo color="var(--color-info)" size={22} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box sx={{ pt: 0.2 }}>{getIcon()}</Box>
      <Box sx={{ flexGrow: 1 }}>
        {title && (
          <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {title}
          </Typography>
        )}
        {message && (
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block', mt: 0.2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

/**
 * Toast Helper Functions to trigger styled notifications throughout RestaurantOS
 */
export const showToast = {
  success: (message, title = 'Success') => {
    toast(<ToastContent type="success" title={title} message={message} />, {
      icon: false,
    });
  },
  error: (message, title = 'Error') => {
    toast(<ToastContent type="error" title={title} message={message} />, {
      icon: false,
    });
  },
  warning: (message, title = 'Warning') => {
    toast(<ToastContent type="warning" title={title} message={message} />, {
      icon: false,
    });
  },
  info: (message, title = 'Notice') => {
    toast(<ToastContent type="info" title={title} message={message} />, {
      icon: false,
    });
  },
};

/**
 * Standalone Inline Toast Alert Box Component
 */
export const ToastAlert = ({ title, message, type = 'info', onClose, sx = {} }) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: 'var(--color-success-bg)', border: 'var(--color-success)', color: 'var(--color-success)' };
      case 'error':
        return { bg: 'var(--color-danger-bg)', border: 'var(--color-danger)', color: 'var(--color-danger)' };
      case 'warning':
        return { bg: 'var(--color-warning-bg)', border: 'var(--color-warning)', color: 'var(--color-warning)' };
      case 'info':
      default:
        return { bg: 'var(--color-info-bg)', border: 'var(--color-info)', color: 'var(--color-info)' };
    }
  };

  const colors = getColors();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '14px',
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        position: 'relative',
        ...sx,
      }}
    >
      <ToastContent type={type} title={title} message={message} />
    </Paper>
  );
};

export default ToastAlert;
