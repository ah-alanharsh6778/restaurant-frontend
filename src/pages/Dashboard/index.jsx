import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper, Chip, Avatar } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import PageContainer from '../../components/layout/PageContainer';
import QuickActions from './QuickActions';
import StatisticsCards from './StatisticsCards';
import RevenueChart from './RevenueChart';
import ExpenseChart from './ExpenseChart';
import InventoryChart from './InventoryChart';
import OrderStatusChart from './OrderStatusChart';
import RecentOrders from './RecentOrders';
import RecentExpenses from './RecentExpenses';
import PurchaseSummary from './PurchaseSummary';
import LowStockTable from './LowStockTable';

import orderService from '../../services/order.service';
import tableService from '../../services/table.service';
import expenseService from '../../services/expense.service';
import inventoryService from '../../services/inventory.service';
import supplierService from '../../services/supplier.service';
import purchaseOrderService from '../../services/purchaseOrder.service';
import userService from '../../services/user.service';

const getList = (res, key) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (key && Array.isArray(res[key])) return res[key];
  if (Array.isArray(res.data)) return res.data;
  return [];
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const userRoleName = useMemo(() => {
    if (!user) return 'OWNER';
    if (typeof user.role === 'string' && user.role) return user.role;
    if (typeof user.role === 'object' && user.role !== null) {
      return user.role.name || user.role.title || 'OWNER';
    }
    return 'OWNER';
  }, [user]);

  const currentDateFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordRes, tabRes, expRes, prodRes, supRes, poRes, usrRes] = await Promise.allSettled([
        orderService.getAll ? orderService.getAll() : orderService.getOrders(),
        tableService.getAll ? tableService.getAll() : tableService.getAllTables(),
        expenseService.getAll ? expenseService.getAll() : expenseService.getExpenses(),
        inventoryService.getProducts ? inventoryService.getProducts() : inventoryService.getAllProducts(),
        supplierService.getAll ? supplierService.getAll() : supplierService.getSuppliers(),
        purchaseOrderService.getAll ? purchaseOrderService.getAll() : purchaseOrderService.getPurchaseOrders(),
        userService.getAllUsers ? userService.getAllUsers() : userService.getUsers(),
      ]);

      if (ordRes.status === 'fulfilled') setOrders(getList(ordRes.value, 'orders'));
      if (tabRes.status === 'fulfilled') setTables(getList(tabRes.value, 'tables'));
      if (expRes.status === 'fulfilled') setExpenses(getList(expRes.value, 'expenses'));
      if (prodRes.status === 'fulfilled') setProducts(getList(prodRes.value, 'products'));
      if (supRes.status === 'fulfilled') setSuppliers(getList(supRes.value, 'suppliers'));
      if (poRes.status === 'fulfilled') setPurchaseOrders(getList(poRes.value, 'purchaseOrders'));
      if (usrRes.status === 'fulfilled') setUsersList(getList(usrRes.value, 'users'));
    } catch (error) {
      toast.error('Failed to load live backend statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Aggregated Real Backend Statistics
  const aggregatedStats = useMemo(() => {
    const todayRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);
    const todayOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'PREPARING').length;
    const completedOrders = orders.filter((o) => o.status === 'PAID' || o.status === 'COMPLETED' || o.status === 'SERVED').length;

    const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED').length;
    const availableTables = tables.filter((t) => t.status === 'AVAILABLE' || !t.status).length;

    const monthlyExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const suppliersCount = suppliers.length;
    const productsCount = products.length;
    const lowStockCount = products.filter((p) => Number(p.stockQuantity || p.quantity || 0) <= Number(p.minThreshold || 10)).length;

    const poCount = purchaseOrders.length;
    const usersCount = usersList.length;

    return {
      todayRevenue,
      todayOrders,
      pendingOrders,
      completedOrders,
      occupiedTables,
      availableTables,
      monthlyExpenses,
      suppliersCount,
      productsCount,
      lowStockCount,
      poCount,
      usersCount,
    };
  }, [orders, tables, expenses, products, suppliers, purchaseOrders, usersList]);

  return (
    <PageContainer
      breadcrumbs={['Dashboard']}
    >
      {/* Welcome Header Banner */}
      <Paper
        elevation={3}
        sx={{
          p: 3.5,
          mb: 4,
          borderRadius: 4,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
              : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.4rem',
            }}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
          </Avatar>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em">
                {greeting}, {user?.fullName || 'Executive Manager'}
              </Typography>
              <Chip
                label={userRoleName}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              RestaurantOS Executive Management System | Real-Time Operations
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(0, 0, 0, 0.15)',
            px: 2,
            py: 1,
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <CalendarTodayIcon fontSize="small" sx={{ opacity: 0.8 }} />
          <Typography variant="subtitle2" fontWeight={700}>
            {currentDateFormatted}
          </Typography>
        </Box>
      </Paper>

      {/* Quick Action Shortcuts */}
      <QuickActions />

      {/* Statistics Metric Cards */}
      <StatisticsCards stats={aggregatedStats} />

      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} lg={8}>
          <RevenueChart />
        </Grid>
        <Grid xs={12} lg={4}>
          <OrderStatusChart />
        </Grid>
        <Grid xs={12} lg={8}>
          <ExpenseChart />
        </Grid>
        <Grid xs={12} lg={4}>
          <InventoryChart />
        </Grid>
      </Grid>

      {/* Tables Grid */}
      <Grid container spacing={3}>
        <Grid xs={12} lg={6}>
          <RecentOrders orders={orders} loading={loading} onAddClick={() => navigate('/orders')} />
        </Grid>
        <Grid xs={12} lg={6}>
          <LowStockTable products={products} loading={loading} onReorderClick={() => navigate('/inventory')} />
        </Grid>
        <Grid xs={12} lg={6}>
          <RecentExpenses expenses={expenses} loading={loading} onAddClick={() => navigate('/expenses')} />
        </Grid>
        <Grid xs={12} lg={6}>
          <PurchaseSummary purchaseOrders={purchaseOrders} loading={loading} onAddClick={() => navigate('/purchase-orders')} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;
