import React from 'react';
import { Chip, Box } from '@mui/material';

/**
 * RestaurantOS Badge Component
 * Status badge & tag component supporting variants ('success', 'warning', 'danger', 'info', 'primary', 'secondary', 'neutral', 'glass'), dot indicators, and fills.
 */
export const Badge = ({
  label,
  variant = 'primary', // 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary' | 'neutral' | 'glass'
  size = 'small',
  dot = false,
  icon,
  onDelete,
  onClick,
  sx = {},
  ...props
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          border: '1px solid var(--color-success)',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--color-warning-bg)',
          color: 'var(--color-warning)',
          border: '1px solid var(--color-warning)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          border: '1px solid var(--color-danger)',
        };
      case 'info':
        return {
          backgroundColor: 'var(--color-info-bg)',
          color: 'var(--color-info)',
          border: '1px solid var(--color-info)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--secondary-50)',
          color: 'var(--secondary-600)',
          border: '1px solid var(--secondary-300)',
        };
      case 'glass':
        return {
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          color: 'var(--text-primary)',
          border: '1px solid var(--glass-border)',
        };
      case 'neutral':
        return {
          backgroundColor: 'var(--bg-subtle)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-default)',
        };
      case 'primary':
      default:
        return {
          backgroundColor: 'var(--primary-50)',
          color: 'var(--primary-600)',
          border: '1px solid var(--primary-300)',
        };
    }
  };

  return (
    <Chip
      label={
        dot ? (
          <Box display="flex" alignItems="center" gap={0.8}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
              }}
            />
            <span>{label}</span>
          </Box>
        ) : (
          label
        )
      }
      size={size}
      icon={icon}
      onDelete={onDelete}
      onClick={onClick}
      sx={{
        borderRadius: '10px',
        fontWeight: 800,
        fontSize: size === 'small' ? '0.75rem' : '0.85rem',
        height: size === 'small' ? 24 : 30,
        letterSpacing: '0.01em',
        ...getBadgeStyle(),
        ...sx,
      }}
      {...props}
    />
  );
};

export default Badge;
