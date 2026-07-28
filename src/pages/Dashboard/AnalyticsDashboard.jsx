import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Alert,
  Stack,
  Avatar,
  Button,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TableBarIcon from '@mui/icons-material/TableBar';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import dayjs from 'dayjs';

import { useNavigate } from 'react-router-dom';
import PageContainer from '../../layout/PageContainer';
import { ResponsiveGrid, ResponsiveGridItem } from '../../layout/ResponsiveGrid';
import dashboardService from '../../services/dashboard.service';
import tableService from '../../services/table.service';
import orderService from '../../services/order.service';
import { useAuth } from '../../hooks/useAuth';
import {
  StatCard,
  GlassCard,
  Card,
  Table,
  Badge,
  Loader,
  showToast,
} from '../../components/ui';

const extractArrayData = (res, keys = []) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.orders)) return res.orders;
  if (Array.isArray(res?.items)) return res.items;
  for (const k of keys) {
    if (Array.isArray(res?.[k])) return res[k];
    if (Array.isArray(res?.data?.[k])) return res.data[k];
  }
  return [];
};

export const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Data states directly fetched from real backend APIs
  const [summaryData, setSummaryData] = useState(null);
  const [weeklySalesData, setWeeklySalesData] = useState([]);
  const [topSellingData, setTopSellingData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [recentOrdersData, setRecentOrdersData] = useState([]);
  const [tablesData, setTablesData] = useState([]);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch telemetry directly from live backend
  const fetchDashboardTelemetry = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        summaryRes,
        weeklySalesRes,
        topSellingRes,
        customersRes,
        expensesRes,
        suppliersRes,
        ordersRes,
        tablesRes,
      ] = await Promise.all([
        dashboardService.getSummary().catch(() => null),
        dashboardService.getWeeklySales().catch(() => []),
        dashboardService.getTopSellingMenu(5).catch(() => []),
        dashboardService.getCustomers().catch(() => []),
        dashboardService.getExpenses().catch(() => []),
        dashboardService.getSuppliers().catch(() => []),
        orderService.getOrders().catch(() => []),
        tableService.getTables().catch(() => []),
      ]);

      setSummaryData(summaryRes);
      setWeeklySalesData(extractArrayData(weeklySalesRes, ['weeklySales']));
      setTopSellingData(extractArrayData(topSellingRes, ['items', 'menuItems']));
      setCustomersData(extractArrayData(customersRes, ['customers']));
      setExpensesData(extractArrayData(expensesRes, ['expenses']));
      setSuppliersData(extractArrayData(suppliersRes, ['suppliers']));
      setRecentOrdersData(extractArrayData(ordersRes, ['orders']));
      setTablesData(extractArrayData(tablesRes, ['tables', 'items']));

      showToast.success('Live dashboard telemetry synced with backend!');
    } catch (err) {
      console.error('Error loading dashboard telemetry:', err);
      setError(err?.message || 'Failed to fetch backend telemetry. Please check API server connection.');
      showToast.error('Telemetry fetch failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardTelemetry();
  }, [fetchDashboardTelemetry]);

  // Derived metrics from real API responses
  const profitMetrics = summaryData?.profitMetrics || { totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMarginPercent: 0 };
  
  // Real-time table calculations
  const totalTablesCount = tablesData.length > 0 ? tablesData.length : (summaryData?.tableOccupancy?.totalTables || 0);
  const occupiedTablesCount = tablesData.length > 0
    ? tablesData.filter((t) => t.status === 'OCCUPIED' || t.status === 'IN_USE' || t.status === 'RESERVED').length
    : (summaryData?.tableOccupancy?.occupiedTables || 0);
  const availableTablesCount = tablesData.length > 0
    ? tablesData.filter((t) => t.status === 'AVAILABLE' || !t.status).length
    : (summaryData?.tableOccupancy?.availableTables || 0);
  const occupancyRate = totalTablesCount > 0 ? Math.round((occupiedTablesCount / totalTablesCount) * 100) : (summaryData?.tableOccupancy?.occupancyRatePercent || 0);

  const userDisplayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'Administrator';
  const formattedDate = currentDateTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = currentDateTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Quick Action Buttons
  const quickActions = [
    { label: 'Tables POS', icon: <TableBarIcon />, route: '/tables', color: '#16A34A', sub: `${occupiedTablesCount} Open` },
    { label: 'POS Orders', icon: <PointOfSaleIcon />, route: '/orders', color: '#2563EB', sub: `${recentOrdersData.length} Total` },
    { label: 'Stock ERP', icon: <InventoryIcon />, route: '/inventory', color: '#8B5CF6', sub: 'Inventory Balance' },
    { label: 'Suppliers', icon: <LocalShippingIcon />, route: '/suppliers', color: '#F59E0B', sub: `${suppliersData.length} Vendors` },
    { label: 'Purchase POs', icon: <ReceiptLongIcon />, route: '/purchase-orders', color: '#EC4899', sub: 'Procurement' },
    { label: 'Expenses & OCR', icon: <AccountBalanceWalletIcon />, route: '/expenses', color: '#0284C7', sub: `${expensesData.length} Records` },
  ];

  return (
    <PageContainer
      title={`Welcome back, ${userDisplayName}`}
      subtitle="Real-Time Analytics & Live Backend Telemetry for RestaurantOS."
      breadcrumbs={[{ label: 'Executive Dashboard' }]}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto', alignItems: 'center' }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, px: 2, py: 0.8, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary', fontSize: '0.8rem', fontWeight: 600 }}>
              <CalendarTodayIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              {formattedDate}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'primary.main', fontSize: '0.85rem', fontWeight: 800, fontFamily: 'monospace' }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              {formattedTime}
            </Box>
          </Box>

          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDashboardTelemetry}
            sx={{ fontWeight: 700, borderRadius: 2.5 }}
          >
            Sync Live Data
          </Button>
        </Box>
      }
    >
      {/* Error Banner with Retry Action */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: '16px',
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger)',
            color: 'var(--color-danger)',
          }}
          action={
            <Button size="small" variant="danger" onClick={fetchDashboardTelemetry}>
              Retry Telemetry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <Loader variant="skeleton" rows={4} height={120} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>

          {/* Section 1: KPI Stat Cards Grid */}
          <ResponsiveGrid spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {/* Total Revenue Card */}
            <ResponsiveGridItem xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={`$${profitMetrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtitle="Completed order sales"
                trend={profitMetrics.netProfit >= 0 ? `+${profitMetrics.profitMarginPercent}% Margin` : `${profitMetrics.profitMarginPercent}% Margin`}
                trendDirection={profitMetrics.netProfit >= 0 ? 'up' : 'down'}
                color="primary"
                icon={<AttachMoneyIcon sx={{ fontSize: 28 }} />}
              />
            </ResponsiveGridItem>

            {/* Total Expenses Card */}
            <ResponsiveGridItem xs={12} sm={6} md={3}>
              <StatCard
                title="Total Expenses"
                value={`$${profitMetrics.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtitle={`${expensesData.length} Recorded ledger bills`}
                color="danger"
                icon={<ReceiptLongIcon sx={{ fontSize: 28 }} />}
              />
            </ResponsiveGridItem>

            {/* Active Customers & Suppliers Card */}
            <ResponsiveGridItem xs={12} sm={6} md={3}>
              <StatCard
                title="Customers & Suppliers"
                value={`${customersData.length} / ${suppliersData.length}`}
                subtitle={`${customersData.length} Registered Diners, ${suppliersData.length} Vendors`}
                color="secondary"
                icon={<PeopleIcon sx={{ fontSize: 28 }} />}
              />
            </ResponsiveGridItem>

            {/* Open & Occupied Tables Card (Glassmorphism Styled) */}
            <ResponsiveGridItem xs={12} sm={6} md={3}>
              <GlassCard
                gradient
                glowOnHover
                padding={2.5}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/tables')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        bgcolor: 'rgba(34, 197, 94, 0.15)',
                        color: '#16A34A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TableBarIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Dining Layout
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.1 }}>
                        {occupiedTablesCount} Open
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`${occupancyRate}% Occupied`}
                    size="small"
                    color={occupancyRate > 75 ? 'error' : occupancyRate > 40 ? 'warning' : 'success'}
                    sx={{ fontWeight: 800, borderRadius: 2 }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                  {availableTablesCount} Available / {totalTablesCount} Total Dining Tables
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${Math.min(occupancyRate, 100)}%`,
                      height: '100%',
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #16A34A 0%, #EAB308 100%)',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </Box>
              </GlassCard>
            </ResponsiveGridItem>
          </ResponsiveGrid>

          {/* Section 2: Quick Action Modules Navigation */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'text.secondary', mb: 2 }}>
              Quick Operational Actions
            </Typography>
            <ResponsiveGrid spacing={2}>
              {quickActions.map((act) => (
                <ResponsiveGridItem key={act.label} xs={6} sm={4} md={2}>
                  <Box
                    onClick={() => navigate(act.route)}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                        borderColor: act.color,
                        bgcolor: `${act.color}08`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        bgcolor: `${act.color}15`,
                        color: act.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1,
                      }}
                    >
                      {act.icon}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.85rem' }} noWrap>
                      {act.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.725rem' }} noWrap>
                      {act.sub}
                    </Typography>
                  </Box>
                </ResponsiveGridItem>
              ))}
            </ResponsiveGrid>
          </Paper>

          {/* Section 3: Weekly Sales & Top Selling Dishes */}
          <ResponsiveGrid spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {/* Weekly Sales Breakdown */}
            <ResponsiveGridItem xs={12} md={7}>
              <Card
                title="Weekly Sales Performance"
                subtitle="Daily revenue breakdown for the active week"
                hoverable={false}
                sx={{ height: '100%' }}
              >
                {weeklySalesData.length === 0 ? (
                  <Box py={4} textAlign="center">
                    <Typography variant="body2" color="var(--text-secondary)">
                      No sales records recorded for this week.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2} pt={1}>
                    {weeklySalesData.map((item) => {
                      const salesVal = Number(item.sales || 0);
                      const maxSales = Math.max(...weeklySalesData.map((w) => Number(w.sales || 0)), 1);
                      const barWidth = Math.round((salesVal / maxSales) * 100);

                      return (
                        <Box key={item.day} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: salesVal > 0 ? '#16A34A' : 'text.disabled',
                                }}
                              />
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                {item.day}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                              ${salesVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', height: 6, borderRadius: 3, bgcolor: 'action.hover', overflow: 'hidden' }}>
                            <Box
                              sx={{
                                width: `${Math.max(barWidth, 2)}%`,
                                height: '100%',
                                borderRadius: 3,
                                bgcolor: salesVal > 0 ? 'primary.main' : 'action.disabledBackground',
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Card>
            </ResponsiveGridItem>

            {/* Top Selling Menu Items */}
            <ResponsiveGridItem xs={12} md={5}>
              <GlassCard
                title="Top Selling Dishes"
                subtitle="Most popular menu items by sales volume"
                gradient
                sx={{ height: '100%' }}
              >
                {topSellingData.length === 0 ? (
                  <Box py={4} textAlign="center">
                    <Typography variant="body2" color="var(--text-secondary)">
                      No menu sales recorded yet. Place orders to populate analytics.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.5} pt={1}>
                    {topSellingData.map((item, idx) => (
                      <Box
                        key={item.menuItemId || item.id || idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5,
                          borderRadius: 2.5,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box sx={{ minWidth: 0, pr: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
                            {idx + 1}. {item.name || item.menuItemName || 'Menu Item'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {item.category || 'General'} • ${Number(item.price || 0).toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                            {item.totalQuantitySold || item.quantity || 0} Sold
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 800 }}>
                            ${Number(item.totalRevenueGenerated || item.revenue || 0).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </GlassCard>
            </ResponsiveGridItem>
          </ResponsiveGrid>

          {/* Section 4: Recent Orders Table Feed */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Recent POS Orders
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Latest transactions recorded by point of sale ticketing
                </Typography>
              </Box>
              <Button size="small" variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/orders')}>
                View All Orders
              </Button>
            </Box>

            <Table
              columns={[
                {
                  id: 'orderNumber',
                  label: 'Order #',
                  minWidth: 150,
                  render: (row) => (
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
                      {row.orderNumber || `ORD-${String(row.id || '').substring(0, 6)}`}
                    </Typography>
                  ),
                },
                {
                  id: 'table',
                  label: 'Table',
                  minWidth: 130,
                  render: (row) => row.table?.name || (row.table?.tableNumber ? `Table #${row.table.tableNumber}` : 'Takeaway'),
                },
                {
                  id: 'totalAmount',
                  label: 'Total ($)',
                  minWidth: 120,
                  render: (row) => (
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
                      ${Number(row.totalAmount || row.total || 0).toFixed(2)}
                    </Typography>
                  ),
                },
                {
                  id: 'status',
                  label: 'Status',
                  minWidth: 130,
                  render: (row) => (
                    <Badge
                      label={String(row.status || 'PENDING')}
                      variant={row.status === 'COMPLETED' || row.status === 'SERVED' ? 'success' : row.status === 'PREPARING' ? 'warning' : 'info'}
                      dot
                    />
                  ),
                },
                {
                  id: 'createdAt',
                  label: 'Timestamp',
                  minWidth: 140,
                  render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'),
                },
              ]}
              rows={recentOrdersData.slice(0, 5)}
              totalCount={recentOrdersData.length}
              emptyMessage="No recent orders recorded in backend database."
            />
          </Box>

          {/* Section 5: Recent Expenses Table Feed */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Recent Operational Expenses
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Latest recorded operational expenses and GL bills
                </Typography>
              </Box>
              <Button size="small" variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/expenses')}>
                View Expense Ledger
              </Button>
            </Box>

            <Table
              columns={[
                { id: 'invoiceNumber', label: 'Invoice #', minWidth: 140, render: (row) => row.invoiceNumber || 'N/A' },
                {
                  id: 'invoiceDate',
                  label: 'Date',
                  minWidth: 130,
                  render: (row) => (row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'),
                },
                { id: 'amount', label: 'Subtotal', minWidth: 110, render: (row) => `$${Number(row.amount || 0).toFixed(2)}` },
                { id: 'tax', label: 'Tax', minWidth: 90, render: (row) => `$${Number(row.tax || 0).toFixed(2)}` },
                {
                  id: 'total',
                  label: 'Total Amount',
                  minWidth: 120,
                  render: (row) => (
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main' }}>
                      ${Number(row.total || row.amount || 0).toFixed(2)}
                    </Typography>
                  ),
                },
                {
                  id: 'status',
                  label: 'Status',
                  minWidth: 110,
                  render: (row) => (
                    <Badge
                      label={row.status || 'PAID'}
                      variant={row.status === 'PAID' ? 'success' : row.status === 'PENDING' ? 'warning' : 'info'}
                      dot
                    />
                  ),
                },
              ]}
              rows={expensesData.slice(0, 5)}
              totalCount={expensesData.length}
              emptyMessage="No expense records found in backend database."
            />
          </Box>

        </Box>
      )}
    </PageContainer>
  );
};

export default AnalyticsDashboard;
