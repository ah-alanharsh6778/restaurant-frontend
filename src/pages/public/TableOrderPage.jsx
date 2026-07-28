import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button as MuiButton,
  IconButton,
  Badge as MuiBadge,
  InputBase,
  Paper,
  Tabs,
  Tab,
  Drawer,
  Divider,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Alert,
  TextField,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TableBarIcon from '@mui/icons-material/TableBar';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';

import tableService from '../../services/table.service';
import menuService from '../../services/menu.service';
import orderService from '../../services/order.service';
import paymentService from '../../services/payment.service';
import { Button, Loader, showToast } from '../../components/ui';

const ORDER_STEPS = ['PENDING', 'PREPARING', 'READY', 'SERVED', 'COMPLETED'];

export const TableOrderPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  // State
  const [table, setTable] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State: { [menuItemId]: { menuItem, quantity, notes } }
  const [cart, setCart] = useState({});
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Active Submitted Order State
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Fetch Table, Categories, and Menu Items
  const loadGuestData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tableRes, catRes, itemRes] = await Promise.all([
        tableService.getPublicTableById(tableId).catch(() => null),
        menuService.getPublicCategories().catch(() => []),
        menuService.getPublicMenuItems().catch(() => []),
      ]);

      const tObj = tableRes?.data || tableRes;
      if (!tObj || !tObj.id) {
        setError('Table not found. Please scan a valid restaurant table QR Code.');
        return;
      }
      setTable(tObj);

      const cList = Array.isArray(catRes) ? catRes : catRes?.data || [];
      setCategories(cList);

      const iList = Array.isArray(itemRes) ? itemRes : itemRes?.data || [];
      setMenuItems(iList.filter((m) => m.isAvailable !== false));
    } catch (err) {
      console.error('Error loading guest menu:', err);
      setError('Failed to load table details. Please refresh or ask restaurant staff.');
    } finally {
      setLoading(false);
    }
  }, [tableId]);

  useEffect(() => {
    loadGuestData();
  }, [loadGuestData]);

  // Cart Helpers
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const current = prev[item.id] || { menuItem: item, quantity: 0, notes: '' };
      return {
        ...prev,
        [item.id]: { ...current, quantity: current.quantity + 1 },
      };
    });
    showToast.success(`Added ${item.name} to your order!`);
  };

  const handleUpdateQty = (itemId, delta) => {
    setCart((prev) => {
      const current = prev[itemId];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: { ...current, quantity: newQty },
      };
    });
  };

  const cartList = useMemo(() => Object.values(cart), [cart]);
  const totalCartCount = useMemo(() => cartList.reduce((acc, c) => acc + c.quantity, 0), [cartList]);
  const subtotal = useMemo(() => cartList.reduce((acc, c) => acc + c.menuItem.price * c.quantity, 0), [cartList]);
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const grandTotal = useMemo(() => subtotal + tax, [subtotal, tax]);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === 'ALL' ||
        item.categoryId === selectedCategory ||
        item.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, selectedCategory]);

  // Submit Order via POST /api/orders/public
  const handlePlaceOrder = async () => {
    if (cartList.length === 0) return;
    setIsSubmitting(true);
    try {
      const orderPayload = {
        tableId: table.id,
        items: cartList.map((c) => ({
          menuItemId: c.menuItem.id,
          quantity: c.quantity,
          notes: c.notes || undefined,
        })),
      };

      const res = await orderService.createPublicOrder(orderPayload);
      const newOrder = res.data || res;
      setPlacedOrder(newOrder);
      setCart({});
      setCartDrawerOpen(false);
      showToast.success(`Order #${newOrder.orderNumber} sent directly to the kitchen!`);
    } catch (err) {
      console.error('Error submitting order:', err);
      showToast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Printable Invoice PDF/HTML
  const handleDownloadInvoice = async () => {
    if (!placedOrder?.id) return;
    try {
      const res = await orderService.getInvoicePdf(placedOrder.id);
      const invoiceData = res.data || res;

      const printWin = window.open('', '_blank');
      if (printWin && invoiceData.html) {
        printWin.document.write(invoiceData.html);
        printWin.document.close();
      } else {
        showToast.success('Receipt loaded successfully!');
      }
    } catch (err) {
      console.error('Error fetching invoice PDF:', err);
      showToast.error('Failed to generate invoice receipt.');
    }
  };

  // Customer Pay & Table Release
  const handlePayOrder = async () => {
    if (!placedOrder?.id) return;
    setIsPaying(true);
    try {
      await paymentService.processPayment({
        orderId: placedOrder.id,
        paymentMethod: 'CASH',
        amountPaid: placedOrder.finalAmount || grandTotal,
      });

      showToast.success('Payment completed! Table released. Thank you for dining with us!');
      setPlacedOrder((prev) => ({ ...prev, status: 'COMPLETED' }));
    } catch (err) {
      console.error('Error processing payment:', err);
      showToast.error(err.response?.data?.message || 'Payment processing failed.');
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#F8FAFC">
        <Loader size="large" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ borderRadius: 4, mb: 3 }}>
          {error}
        </Alert>
        <Button variant="primary" onClick={loadGuestData}>
          Retry Table Identification
        </Button>
      </Container>
    );
  }

  const activeStep = ORDER_STEPS.indexOf(placedOrder?.status || 'PENDING');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', color: '#1E293B', pb: 10 }}>
      {/* Sticky Mobile Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E2E8F0',
          color: '#1E293B',
        }}
      >
        <Container maxWidth="md">
          <Box display="flex" alignItems="center" justifyContent="space-between" py={1.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  bgcolor: '#4F46E5',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RestaurantIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1, fontSize: '1.1rem' }}>
                  RestaurantOS
                </Typography>
                <Chip
                  icon={<TableBarIcon style={{ fontSize: 14 }} />}
                  label={`Table #${table?.tableNumber || 'N/A'}`}
                  size="small"
                  color="primary"
                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 800, mt: 0.3 }}
                />
              </Box>
            </Box>

            <IconButton color="primary" onClick={() => setCartDrawerOpen(true)}>
              <MuiBadge badgeContent={totalCartCount} color="error">
                <ShoppingBagIcon />
              </MuiBadge>
            </IconButton>
          </Box>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 3 }}>
        {/* Active Placed Order Tracker Banner */}
        {placedOrder && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              bgcolor: '#FFFFFF',
              border: '2px solid #4F46E5',
              boxShadow: '0 10px 30px rgba(79, 70, 229, 0.12)',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                  Active Order #{placedOrder.orderNumber}
                </Typography>
                <Typography variant="h6" fontWeight={900} color="primary.main">
                  Status: {placedOrder.status}
                </Typography>
              </Box>
              <Chip label={`Total: $${(placedOrder.finalAmount || grandTotal).toFixed(2)}`} color="success" sx={{ fontWeight: 800 }} />
            </Box>

            <Stepper activeStep={activeStep >= 0 ? activeStep : 0} alternativeLabel sx={{ my: 2 }}>
              {ORDER_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Stack direction="row" spacing={2} mt={3}>
              <Button variant="outlined" size="small" startIcon={<ReceiptLongIcon />} onClick={handleDownloadInvoice}>
                View Invoice Receipt
              </Button>
              {placedOrder.status !== 'COMPLETED' && (
                <Button variant="primary" size="small" startIcon={<PaymentIcon />} onClick={handlePayOrder} loading={isPaying}>
                  Pay & Complete Order
                </Button>
              )}
            </Stack>
          </Paper>
        )}

        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{
            p: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 3,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            mb: 3,
          }}
        >
          <SearchIcon sx={{ color: '#94A3B8', mr: 1 }} />
          <InputBase
            placeholder="Search appetizers, main courses, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '100%', fontSize: '0.95rem' }}
          />
        </Paper>

        {/* Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: '0.95rem' },
            }}
          >
            <Tab label="All Categories" value="ALL" />
            {categories.map((cat) => (
              <Tab key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Tabs>
        </Box>

        {/* Menu Items Grid */}
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          Chef's Specials & Menu
        </Typography>

        {filteredItems.length === 0 ? (
          <Box py={6} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              No menu items match your search filter.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filteredItems.map((item) => {
              const inCartQty = cart[item.id]?.quantity || 0;
              return (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      p: 2.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#818CF8',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                      },
                    }}
                  >
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                          {item.name}
                        </Typography>
                        <Chip
                          label={`$${parseFloat(item.price).toFixed(2)}`}
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 900, borderRadius: 2 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                        {item.description || 'Delicious chef prepared dish with authentic fresh ingredients.'}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" justifyContent="space-between" pt={1}>
                      {inCartQty > 0 ? (
                        <Box display="flex" alignItems="center" gap={1} bgcolor="#F1F5F9" borderRadius={3} px={1} py={0.5}>
                          <IconButton size="small" onClick={() => handleUpdateQty(item.id, -1)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="subtitle2" fontWeight={800}>
                            {inCartQty}
                          </Typography>
                          <IconButton size="small" onClick={() => handleUpdateQty(item.id, 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddToCart(item)}
                          sx={{ fontWeight: 800, textTransform: 'none' }}
                        >
                          Add to Order
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Floating Bottom View Cart Bar */}
      {totalCartCount > 0 && !cartDrawerOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1000,
            px: 2,
          }}
        >
          <MuiButton
            variant="contained"
            color="primary"
            onClick={() => setCartDrawerOpen(true)}
            sx={{
              width: '100%',
              maxWidth: 500,
              py: 1.8,
              px: 3,
              borderRadius: 4,
              boxShadow: '0 12px 36px rgba(79, 70, 229, 0.4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 900,
              fontSize: '1rem',
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <ShoppingBagIcon />
              <span>{totalCartCount} Items in Order</span>
            </Box>
            <span>View Order (${grandTotal.toFixed(2)})</span>
          </MuiButton>
        </Box>
      )}

      {/* Slide-Over Shopping Cart Drawer */}
      <Drawer
        anchor="bottom"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '85vh',
            p: 3,
          },
        }}
      >
        <Container maxWidth="md" disableGutters>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={900}>
              Your Table #{table?.tableNumber} Order
            </Typography>
            <IconButton onClick={() => setCartDrawerOpen(false)}>
              <RemoveIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2} mb={3}>
            {cartList.map(({ menuItem, quantity }) => (
              <Box key={menuItem.id} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" fontWeight={800}>
                    {menuItem.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ${menuItem.price} × {quantity}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton size="small" onClick={() => handleUpdateQty(menuItem.id, -1)}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="subtitle2" fontWeight={800}>
                    {quantity}
                  </Typography>
                  <IconButton size="small" onClick={() => handleUpdateQty(menuItem.id, 1)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="subtitle2" fontWeight={900} ml={1}>
                    ${(menuItem.price * quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" fontWeight={700}>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">Tax (10%)</Typography>
              <Typography variant="body2" fontWeight={700}>${tax.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" pt={1} borderTop="1px solid #E2E8F0">
              <Typography variant="h6" fontWeight={900}>Grand Total</Typography>
              <Typography variant="h6" fontWeight={900} color="primary.main">${grandTotal.toFixed(2)}</Typography>
            </Box>
          </Box>

          <Button
            variant="primary"
            fullWidth
            size="large"
            onClick={handlePlaceOrder}
            loading={isSubmitting}
            sx={{ py: 1.8, fontSize: '1rem', fontWeight: 900, borderRadius: 3 }}
          >
            Send Order to Kitchen
          </Button>
        </Container>
      </Drawer>
    </Box>
  );
};

export default TableOrderPage;
