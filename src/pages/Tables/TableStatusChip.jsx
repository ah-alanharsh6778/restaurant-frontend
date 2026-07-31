import React from 'react';
import { Chip } from '@mui/material';

export const TableStatusChip = ({ status = 'AVAILABLE', size = 'small' }) => {
  const statusUpper = String(status).toUpperCase();

  let badgeBg = 'rgba(16, 185, 129, 0.12)';
  let color = '#10B981';
  let borderColor = 'rgba(16, 185, 129, 0.3)';
  let label = 'Available';

  if (statusUpper === 'OCCUPIED') {
    badgeBg = 'rgba(239, 68, 68, 0.12)';
    color = '#EF4444';
    borderColor = 'rgba(239, 68, 68, 0.3)';
    label = 'Occupied';
  } else if (statusUpper === 'RESERVED') {
    badgeBg = 'rgba(245, 158, 11, 0.12)';
    color = '#F59E0B';
    borderColor = 'rgba(245, 158, 11, 0.3)';
    label = 'Reserved';
  } else if (statusUpper === 'MAINTENANCE' || statusUpper === 'CLOSED') {
    badgeBg = 'rgba(107, 114, 128, 0.12)';
    color = '#9CA3AF';
    borderColor = 'rgba(107, 114, 128, 0.3)';
    label = statusUpper === 'CLOSED' ? 'Closed' : 'Maintenance';
  }

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        fontWeight: 700,
        fontSize: '13px',
        height: 26,
        borderRadius: '10px',
        px: 1,
        bgcolor: badgeBg,
        color: color,
        border: '1px solid',
        borderColor: borderColor,
        letterSpacing: '0.02em',
        boxShadow: 'none',
      }}
    />
  );
};

export default TableStatusChip;
