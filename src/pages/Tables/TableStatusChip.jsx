import React from 'react';
import { Chip } from '@mui/material';

export const TableStatusChip = ({ status = 'AVAILABLE', size = 'small' }) => {
  const statusUpper = String(status).toUpperCase();

  let bgColor = '#DCFCE7';
  let color = '#15803D';
  let borderColor = '#86EFAC';
  let label = 'Available';

  if (statusUpper === 'OCCUPIED') {
    bgColor = '#FEE2E2';
    color = '#B91C1C';
    borderColor = '#FCA5A5';
    label = 'Occupied';
  } else if (statusUpper === 'RESERVED') {
    bgColor = '#FEF3C7';
    color = '#B45309';
    borderColor = '#FDE68A';
    label = 'Reserved';
  } else if (statusUpper === 'CLOSED') {
    bgColor = '#F1F5F9';
    color = '#475569';
    borderColor = '#CBD5E1';
    label = 'Closed';
  }

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        fontWeight: 800,
        fontSize: size === 'small' ? '0.72rem' : '0.82rem',
        height: size === 'small' ? 24 : 30,
        borderRadius: 2,
        px: 0.5,
        bgcolor: bgColor,
        color: color,
        border: '1px solid',
        borderColor: borderColor,
      }}
    />
  );
};

export default TableStatusChip;
