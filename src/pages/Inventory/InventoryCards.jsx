import { Grid } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardCard from '../Dashboard/DashboardCard';

export const InventoryCards = ({ stats = {} }) => {
  const cards = [
    { title: 'Total Products', value: stats.totalProducts || 86, icon: <InventoryIcon />, color: 'primary', subtitle: 'SKU Items Tracked' },
    { title: 'Low Stock Products', value: stats.lowStockCount || 3, icon: <WarningIcon />, color: 'warning', subtitle: 'Near Minimum Reorder' },
    { title: 'Out of Stock Items', value: stats.outOfStockCount || 1, icon: <RemoveCircleIcon />, color: 'error', subtitle: 'Zero Quantity Balance' },
    { title: 'Active Warehouses', value: stats.warehousesCount || 3, icon: <WarehouseIcon />, color: 'info', subtitle: 'Storage Locations' },
    { title: "Today's Stock In", value: `+${stats.todayStockIn || 120} units`, icon: <ArrowDownwardIcon />, color: 'success', subtitle: 'Received Deliveries' },
    { title: "Today's Stock Out", value: `-${stats.todayStockOut || 45} units`, icon: <ArrowUpwardIcon />, color: 'secondary', subtitle: 'Kitchen Usage' },
    { title: 'Total Asset Value', value: `$${(stats.totalValue || 48500).toLocaleString()}`, icon: <AttachMoneyIcon />, color: 'primary', trend: 4.2 },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {cards.map((card, idx) => (
        <Grid xs={12} sm={6} md={3} lg={idx === 6 ? 6 : 3} key={idx}>
          <DashboardCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default InventoryCards;
