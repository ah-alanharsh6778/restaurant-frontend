import { Chip } from '@mui/material';

export const PO_STATUS_CONFIG = {
  PENDING: { label: 'PENDING', color: '#3B82F6', bgcolor: '#DBEAFE' },
  ORDERED: { label: 'ORDERED', color: '#F97316', bgcolor: '#FFEDD5' },
  RECEIVED: { label: 'RECEIVED', color: '#10B981', bgcolor: '#D1FAE5' },
  CANCELLED: { label: 'CANCELLED', color: '#EF4444', bgcolor: '#FEE2E2' },
};

export const PurchaseOrderStatusChip = ({ status = 'PENDING', size = 'small' }) => {
  const normStatus = String(status || 'PENDING').toUpperCase();
  const config = PO_STATUS_CONFIG[normStatus] || {
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

export default PurchaseOrderStatusChip;
