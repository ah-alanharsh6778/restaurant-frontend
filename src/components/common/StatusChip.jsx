import React from 'react';
import { Chip } from '@mui/material';

export const StatusChip = ({
  label,
  color = 'default', // 'success' | 'warning' | 'error' | 'info' | 'default' | 'primary'
  icon = null,
  variant = 'outlined',
  size = 'small',
  sx = {},
}) => {
  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      size={size}
      variant={variant}
      sx={{
        fontWeight: 700,
        borderRadius: '8px',
        fontSize: '0.75rem',
        px: 0.5,
        letterSpacing: 0.2,
        ...sx,
      }}
    />
  );
};

export default StatusChip;
