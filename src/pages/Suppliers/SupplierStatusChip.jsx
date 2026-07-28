import { Chip } from '@mui/material';

export const SupplierStatusChip = ({ isActive = true, status = 'ACTIVE', size = 'small' }) => {
  const normStatus = typeof status === 'object' ? status?.name : String(status).toUpperCase();
  const active = isActive !== undefined ? Boolean(isActive) : normStatus !== 'INACTIVE';

  if (!active || normStatus === 'INACTIVE') {
    return (
      <Chip
        label="INACTIVE"
        color="default"
        size={size}
        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
      />
    );
  }

  return (
    <Chip
      label="ACTIVE"
      color="success"
      size={size}
      sx={{ fontWeight: 800, fontSize: '0.7rem' }}
    />
  );
};

export default SupplierStatusChip;
