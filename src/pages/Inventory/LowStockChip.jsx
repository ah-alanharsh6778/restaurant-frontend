import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import StatusChip from '../../components/common/StatusChip';

export const LowStockChip = ({ currentStock = 0, minimumStock = 0, statusOverride }) => {
  let label = 'IN STOCK';
  let color = 'success';
  let icon = <CheckCircleIcon fontSize="small" />;

  if (statusOverride) {
    label = statusOverride.toUpperCase();
  } else if (Number(currentStock) <= 0) {
    label = 'OUT OF STOCK';
    color = 'error';
    icon = <ErrorIcon fontSize="small" />;
  } else if (Number(currentStock) <= Number(minimumStock)) {
    label = 'LOW STOCK';
    color = 'warning';
    icon = <WarningAmberIcon fontSize="small" />;
  }

  if (label === 'OUT OF STOCK') {
    color = 'error';
    icon = <ErrorIcon fontSize="small" />;
  } else if (label === 'LOW STOCK') {
    color = 'warning';
    icon = <WarningAmberIcon fontSize="small" />;
  } else {
    color = 'success';
    icon = <CheckCircleIcon fontSize="small" />;
  }

  return <StatusChip label={label} color={color} icon={icon} />;
};

export default LowStockChip;
