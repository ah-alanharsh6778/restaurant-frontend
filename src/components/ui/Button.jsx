import React from 'react';
import { Button as MuiButton, CircularProgress, Box } from '@mui/material';

/**
 * RestaurantOS Button Component
 * Supports variants: 'contained' | 'outlined' | 'glass' | 'soft' | 'danger' | 'success' | 'warning' | 'text'
 * Supports sizes: 'small' | 'medium' | 'large'
 * Supports loading state, start/end icons, glow effects, spring hover physics.
 */
export const Button = ({
  children,
  variant = 'contained',
  size = 'medium',
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  fullWidth = false,
  glow = false,
  onClick,
  sx = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: 'var(--text-primary)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-sm)',
          '&:hover': {
            backgroundColor: 'var(--glass-hover-bg)',
            borderColor: 'var(--primary-400)',
            boxShadow: glow ? 'var(--shadow-glow-primary)' : 'var(--shadow-md)',
          },
        };
      case 'soft':
        return {
          backgroundColor: 'var(--primary-50)',
          color: 'var(--primary-600)',
          border: '1px solid transparent',
          '&:hover': {
            backgroundColor: 'var(--primary-100)',
          },
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger)',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'var(--color-danger-dark, #DC2626)',
            boxShadow: 'var(--shadow-glow-danger)',
          },
        };
      case 'success':
        return {
          backgroundColor: 'var(--color-success)',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'var(--color-success-dark, #059669)',
            boxShadow: 'var(--shadow-glow-success)',
          },
        };
      case 'warning':
        return {
          backgroundColor: 'var(--color-warning)',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'var(--color-warning-dark, #D97706)',
          },
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
          '&:hover': {
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--primary-500)',
          },
        };
      case 'contained':
      default:
        return {
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
          color: '#FFFFFF',
          boxShadow: glow ? 'var(--shadow-glow-primary)' : 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%)',
            boxShadow: 'var(--shadow-glow-primary)',
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { py: '6px', px: '14px', fontSize: '0.8125rem' };
      case 'large':
        return { py: '12px', px: '28px', fontSize: '1rem' };
      case 'medium':
      default:
        return { py: '9px', px: '20px', fontSize: '0.925rem' };
    }
  };

  return (
    <MuiButton
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      sx={{
        borderRadius: '12px',
        fontWeight: 700,
        textTransform: 'none',
        letterSpacing: '0.01em',
        transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        '&:hover': {
          transform: disabled || loading ? 'none' : 'translateY(-2px)',
        },
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={18} color="inherit" />
          <span>Loading...</span>
        </Box>
      ) : (
        children
      )}
    </MuiButton>
  );
};

export default Button;
