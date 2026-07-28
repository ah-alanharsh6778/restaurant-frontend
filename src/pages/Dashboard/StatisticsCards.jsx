import { Grid } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  ShoppingBag as OrderIcon,
  PendingActions as PendingIcon,
  CheckCircle as CompleteIcon,
  TableBar as TableIcon,
  EventSeat as SeatIcon,
  Receipt as ExpenseIcon,
  LocalShipping as SupplierIcon,
  Inventory as InventoryIcon,
  Warning as LowStockIcon,
  ShoppingCart as POIcon,
  People as UserIcon,
} from '@mui/icons-material';
import DashboardCard from './DashboardCard';

export const StatisticsCards = ({ stats = {} }) => {
  const cards = [
    { title: "Today's Revenue", value: `$${(stats.todayRevenue || 14850).toLocaleString()}`, icon: <RevenueIcon />, color: 'primary', trend: 16.4, trendText: 'vs yesterday' },
    { title: "Today's Orders", value: stats.todayOrders || 142, icon: <OrderIcon />, color: 'info', trend: 8.2, trendText: 'vs yesterday' },
    { title: 'Pending Orders', value: stats.pendingOrders || 6, icon: <PendingIcon />, color: 'warning', subtitle: 'In Kitchen Queue' },
    { title: 'Completed Orders', value: stats.completedOrders || 136, icon: <CompleteIcon />, color: 'success', trend: 12.1 },
    { title: 'Occupied Tables', value: stats.occupiedTables || 8, icon: <TableIcon />, color: 'error', subtitle: 'Live Dining' },
    { title: 'Available Tables', value: stats.availableTables || 12, icon: <SeatIcon />, color: 'success', subtitle: 'Ready for Seating' },
    { title: 'Monthly Expenses', value: `$${(stats.monthlyExpenses || 4200).toLocaleString()}`, icon: <ExpenseIcon />, color: 'secondary', trend: -1.8 },
    { title: 'Active Suppliers', value: stats.suppliersCount || 14, icon: <SupplierIcon />, color: 'info', subtitle: 'Approved Vendors' },
    { title: 'Inventory Products', value: stats.productsCount || 86, icon: <InventoryIcon />, color: 'primary', subtitle: 'Tracked Items' },
    { title: 'Low Stock Alerts', value: stats.lowStockCount || 3, icon: <LowStockIcon />, color: 'error', subtitle: 'Requires Reorder' },
    { title: 'Purchase Orders', value: stats.poCount || 18, icon: <POIcon />, color: 'warning', subtitle: 'Active Vendor POs' },
    { title: 'Active Staff Users', value: stats.usersCount || 9, icon: <UserIcon />, color: 'success', subtitle: 'Logged-in Accounts' },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, idx) => (
        <Grid xs={12} sm={6} md={4} lg={3} key={idx}>
          <DashboardCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsCards;
