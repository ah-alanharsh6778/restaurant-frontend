import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Grid,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddIcon from '@mui/icons-material/Add';
import OrderStatusChip from './OrderStatusChip';
import OrderItemsTable from './OrderItemsTable';
import { getCleanTableName, getCleanOrderNumber } from '../../utils/formatters';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const OrderDetailsDialog = ({
  open,
  onClose,
  order = null,
  onAddItemClick,
  onRemoveItemClick,
  onCheckout,
  onEditStatus,
  onDelete,
}) => {
  if (!order) return null;

  const tableNameStr = getCleanTableName(order.table, order.tableId);
  const orderNumStr = getCleanOrderNumber(order.orderNumber, order.id);
  const items = order.orderItems || order.items || [];
  const totalAmount = Number(order.totalAmount || 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Order Details & Receipt
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
          <Paper
            elevation={2}
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 32 }} />
          </Paper>

          <Box>
            <Typography variant="h5" fontWeight={800}>
              {orderNumStr}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={tableNameStr}
                color="primary"
                size="small"
                sx={{ fontWeight: 800 }}
              />
              <OrderStatusChip status={order.status} />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              ORDER NUMBER
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {orderNumStr}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              RESTAURANT TABLE
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {tableNameStr}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CREATED DATE
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              LAST UPDATED
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : '—'}
            </Typography>
          </Grid>
        </Grid>

        {/* Items Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            Order Items ({items.length})
          </Typography>

          {onAddItemClick && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => onAddItemClick(order)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Add Item
            </Button>
          )}
        </Box>

        <OrderItemsTable
          orderItems={items}
          onRemoveItem={onRemoveItemClick}
        />

        <Divider sx={{ my: 3 }} />

        {/* Backend Calculated Totals */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '100%', sm: 280 } }}>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              Subtotal:
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              ${totalAmount.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '100%', sm: 280 } }}>
            <Typography variant="h6" fontWeight={800} color="primary">
              Grand Total:
            </Typography>
            <Typography variant="h6" fontWeight={800} color="primary">
              ${totalAmount.toFixed(2)}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            * Totals strictly returned from backend server API
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {onEditStatus && (
            <Button
              onClick={() => {
                onClose();
                onEditStatus(order);
              }}
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Update Status
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={() => {
                onClose();
                onDelete(order);
              }}
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Cancel Order
            </Button>
          )}
          {onCheckout && (
            <Button
              onClick={() => {
                onClose();
                onCheckout(order);
              }}
              variant="contained"
              color="warning"
              sx={{ px: 3, fontWeight: 800, borderRadius: 2 }}
            >
              Generate Invoice & Pay
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
