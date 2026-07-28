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

export const PurchaseOrderItemsTable = ({
  purchaseItems = [],
  onRemoveItem,
}) => {
  if (!purchaseItems || purchaseItems.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed grey', borderRadius: 2, bgcolor: 'action.hover' }}>
        <Typography variant="body2" color="text.secondary">
          No items added to this purchase order yet.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem' }}>INGREDIENT</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>QUANTITY</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>UNIT PRICE</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>SUBTOTAL</TableCell>
            {onRemoveItem && (
              <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                ACTION
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {purchaseItems.map((item) => {
            const ingName = item.ingredient?.name || item.name || 'Unknown Ingredient';
            const unit = item.ingredient?.unit || item.unit || '';
            const qty = Number(item.quantity || 1);
            const price = Number(item.price || 0);
            const subtotal = Number(item.subtotal || qty * price);

            return (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={700}>
                    {ingName}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight={700}>
                    {qty} {unit}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="text.secondary">
                    ${price.toFixed(2)}
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

export default PurchaseOrderItemsTable;
