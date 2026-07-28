import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorIcon from '@mui/icons-material/Error';
import StatusChip from '../../components/common/StatusChip';

export const ExpenseStatusChip = ({ status = 'PENDING' }) => {
  const upperStatus = String(status).toUpperCase();

  let label = 'PENDING';
  let color = 'warning';
  let icon = <HourglassEmptyIcon fontSize="small" />;

  if (upperStatus === 'PROCESSED') {
    label = 'PROCESSED';
    color = 'success';
    icon = <CheckCircleIcon fontSize="small" />;
  } else if (upperStatus === 'FAILED') {
    label = 'FAILED';
    color = 'error';
    icon = <ErrorIcon fontSize="small" />;
  }

  return <StatusChip label={label} color={color} icon={icon} />;
};

export default ExpenseStatusChip;
