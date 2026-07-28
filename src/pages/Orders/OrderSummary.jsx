import { Paper, Box, Typography, Divider } from '@mui/material';

export const OrderSummary = ({ items = [], taxRate = 0.08 }) => {
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price || item.menuItem?.price || 0);
    const qty = Number(item.quantity || 1);
    return sum + price * qty;
  }, 0);

  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;

  return (
    <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'action.hover', borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="text.secondary">
          Subtotal ({items.length} items):
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          ${subtotal.toFixed(2)}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1.5}>
        <Typography variant="body2" color="text.secondary">
          Estimated Tax ({(taxRate * 100).toFixed(0)}%):
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          ${taxAmount.toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle1" fontWeight={800}>
          Grand Total:
        </Typography>
        <Typography variant="subtitle1" fontWeight={800} color="primary.main">
          ${grandTotal.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default OrderSummary;
