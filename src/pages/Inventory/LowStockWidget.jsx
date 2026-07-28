import { Paper, Box, Typography, Button, Chip, Stack } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export const LowStockWidget = ({ products = [], onRestockClick }) => {
  const lowStockItems = products.filter(
    (p) => (p.stockQuantity || 0) <= (p.minThreshold || 10)
  );

  const defaultLowStock = [
    { id: '1', name: 'Fresh Italian Tomatoes', stockQuantity: 4, minThreshold: 15, unit: 'kg' },
    { id: '2', name: 'Extra Virgin Olive Oil 5L', stockQuantity: 2, minThreshold: 10, unit: 'liter' },
    { id: '3', name: 'Mozzarella Cheese Blocks', stockQuantity: 5, minThreshold: 12, unit: 'kg' },
  ];

  const items = lowStockItems.length > 0 ? lowStockItems : defaultLowStock;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3.5,
        border: (theme) => `1px solid ${theme.palette.warning.main}`,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.05)' : '#FFFBEB',
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <WarningAmberIcon color="warning" fontSize="large" />
        <Box>
          <Typography variant="h6" fontWeight={800} color="warning.dark">
            Critical Low Stock Warnings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Products below safety reorder threshold requiring purchase orders
          </Typography>
        </Box>
      </Box>

      <Stack spacing={1.5}>
        {items.map((item) => (
          <Box
            key={item.id || item._id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={1.5}
            borderRadius={2.5}
            sx={{
              backgroundColor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={800}>
                {item.name}
              </Typography>
              <Typography variant="caption" color="error" fontWeight={700}>
                Stock: {item.stockQuantity || 0} {item.unit || 'kg'} (Min: {item.minThreshold || 10})
              </Typography>
            </Box>

            <Button
              size="small"
              variant="contained"
              color="warning"
              startIcon={<AddShoppingCartIcon />}
              onClick={() => onRestockClick(item)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Restock
            </Button>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default LowStockWidget;
