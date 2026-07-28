import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

export const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const itemTotal = (Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py={1.5}
      borderBottom="1px solid rgba(0, 0, 0, 0.08)"
    >
      <Box sx={{ flexGrow: 1, pr: 1 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
          {item.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ${Number(item.price || 0).toFixed(2)} each
        </Typography>
      </Box>

      {/* Quantity Increment/Decrement Controls */}
      <Box display="flex" alignItems="center" gap={0.5} sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 0.2 }}>
        <IconButton size="small" onClick={() => onDecrease(item)}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" fontWeight={800} sx={{ minWidth: 20, textAlign: 'center' }}>
          {item.quantity}
        </Typography>
        <IconButton size="small" onClick={() => onIncrease(item)}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Line Item Total & Remove */}
      <Box display="flex" alignItems="center" gap={1} ml={1.5}>
        <Typography variant="subtitle2" fontWeight={800} color="primary">
          ${itemTotal}
        </Typography>

        <IconButton size="small" color="error" onClick={() => onRemove(item)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CartItem;
