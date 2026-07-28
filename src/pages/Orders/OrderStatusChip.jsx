import { Chip } from '@mui/material';

export const ORDER_STATUS_CONFIG = {
  PENDING: { label: 'PENDING', color: '#3B82F6', bgcolor: '#DBEAFE' },
  CONFIRMED: { label: 'CONFIRMED', color: '#6366F1', bgcolor: '#E0E7FF' },
  PREPARING: { label: 'PREPARING', color: '#F97316', bgcolor: '#FFEDD5' },
  READY: { label: 'READY', color: '#8B5CF6', bgcolor: '#EDE9FE' },
  SERVED: { label: 'SERVED', color: '#10B981', bgcolor: '#D1FAE5' },
  COMPLETED: { label: 'COMPLETED', color: '#047857', bgcolor: '#A7F3D0' },
  CANCELLED: { label: 'CANCELLED', color: '#EF4444', bgcolor: '#FEE2E2' },
};

export const OrderStatusChip = ({ status = 'PENDING', size = 'small' }) => {
  const normStatus = String(status || 'PENDING').toUpperCase();
  const config = ORDER_STATUS_CONFIG[normStatus] || {
    label: normStatus,
    color: '#6B7280',
    bgcolor: '#F3F4F6',
  };

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        fontWeight: 800,
        fontSize: '0.7rem',
        color: config.color,
        backgroundColor: config.bgcolor,
        border: `1px solid ${config.color}33`,
      }}
    />
  );
};

export default OrderStatusChip;
