import { Paper, Box, Typography, Button, Divider } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

export const OrderCart = ({
  cartItems = [],
  tableName = 'Takeout Order',
  subtotal = 0,
  loading = false,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        borderRadius: 3.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Cart Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" pb={1.5}>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            POS Order Cart
          </Typography>
          <Typography variant="caption" color="primary" fontWeight={700}>
            Target: {tableName}
          </Typography>
        </Box>

        {cartItems.length > 0 && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={onClearCart}
          >
            Clear Cart
          </Button>
        )}
      </Box>

      <Divider />

      {/* Cart Items List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', my: 2, pr: 0.5 }}>
        {cartItems.length === 0 ? (
          <Box
            py={6}
            textAlign="center"
            color="text.secondary"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="subtitle2" fontWeight={700}>
              Cart is Empty
            </Typography>
            <Typography variant="caption">
              Select dishes from the menu to build the dining order ticket.
            </Typography>
          </Box>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.id || item._id}
              item={item}
              onIncrease={onIncreaseQuantity}
              onDecrease={onDecreaseQuantity}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </Box>

      <Divider />

      {/* Order Math & Submit Button */}
      <OrderSummary subtotal={subtotal} loading={loading} onPlaceOrder={onPlaceOrder} />
    </Paper>
  );
};

export default OrderCart;
