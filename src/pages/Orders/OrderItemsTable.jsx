import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const OrderItemsTable = ({
  orderItems = [],
  onRemoveItem,
}) => {
  if (!orderItems || orderItems.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed grey', borderRadius: 2, bgcolor: 'action.hover' }}>
        <Typography variant="body2" color="text.secondary">
          No items added to this order yet.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>MENU ITEM</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>QUANTITY</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>PRICE</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>SUBTOTAL</TableCell>
            {onRemoveItem && (
              <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                ACTION
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {orderItems.map((item) => {
            const itemName = item.menuItem?.name || item.name || 'Unknown Item';
            const unitPrice = Number(item.price || item.menuItem?.price || 0);
            const qty = Number(item.quantity || 1);
            const subtotal = Number(item.subtotal || unitPrice * qty);

            return (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={700}>
                    {itemName}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight={700}>
                    {qty}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="text.secondary">
                    ${unitPrice.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={800} color="primary">
                    ${subtotal.toFixed(2)}
                  </Typography>
                </TableCell>
                {onRemoveItem && (
                  <TableCell align="right">
                    <Tooltip title="Remove Item">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemoveItem(item)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderItemsTable;
