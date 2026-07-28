import { Chip, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const IngredientStatusChip = ({
  quantity = 0,
  minimumStock = 0,
  minStock = 0,
  isActive = true,
  status = 'ACTIVE',
  size = 'small',
}) => {
  const qty = Number(quantity || 0);
  const min = Number(minimumStock !== undefined && minimumStock !== 0 ? minimumStock : minStock || 0);

  const normStatus = typeof status === 'object' ? status?.name : String(status).toUpperCase();
  const isInactive = isActive === false || normStatus === 'INACTIVE' || normStatus === 'DISCONTINUED';

  if (isInactive) {
    return (
      <Chip
        label="INACTIVE"
        color="default"
        size={size}
        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
      />
    );
  }

  const isLowStock = qty <= min;

  if (isLowStock) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          icon={<WarningAmberIcon fontSize="small" />}
          label="LOW STOCK"
          color="warning"
          size={size}
          sx={{
            fontWeight: 800,
            fontSize: '0.7rem',
            bgcolor: '#F97316',
            color: '#FFFFFF',
            '& .MuiChip-icon': { color: '#FFFFFF' },
          }}
        />
      </Box>
    );
  }

  return (
    <Chip
      label="IN STOCK"
      color="success"
      size={size}
      sx={{ fontWeight: 800, fontSize: '0.7rem' }}
    />
  );
};

export default IngredientStatusChip;
