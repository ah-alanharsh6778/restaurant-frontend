import { Chip } from '@mui/material';

export const StockStatusChip = ({ status, quantity = 0, minThreshold = 10 }) => {
  const getStatusConfig = () => {
    if (quantity <= 0 || status === 'OUT_OF_STOCK' || status === 'OUT OF STOCK') {
      return { label: 'OUT OF STOCK', color: 'error' };
    }
    if (quantity <= minThreshold || status === 'LOW_STOCK' || status === 'LOW STOCK') {
      return { label: 'LOW STOCK', color: 'warning' };
    }
    return { label: 'IN STOCK', color: 'success' };
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 800, fontSize: '0.7rem' }}
    />
  );
};

export default StockStatusChip;
