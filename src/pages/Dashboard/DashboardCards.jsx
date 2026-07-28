import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TableBarIcon from '@mui/icons-material/TableBar';
import WarningIcon from '@mui/icons-material/Warning';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const DashboardCards = ({ stats = {} }) => {
  const netProfit = Number(stats.monthlySales || 0) - Number(stats.monthlyExpenses || 0);

  const cards = [
    {
      title: "Sales Overview (Today)",
      value: `$${Number(stats.todaySales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <AttachMoneyIcon sx={{ color: '#059669' }} />,
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
    },
    {
      title: 'Monthly Revenue',
      value: `$${Number(stats.monthlySales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <CalendarMonthIcon sx={{ color: '#2563EB' }} />,
      bgColor: '#EFF6FF',
      borderColor: '#93C5FD',
    },
    {
      title: 'Profit Overview',
      value: `$${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <TrendingUpIcon sx={{ color: netProfit >= 0 ? '#10B981' : '#EF4444' }} />,
      bgColor: netProfit >= 0 ? '#ECFDF5' : '#FEF2F2',
      borderColor: netProfit >= 0 ? '#6EE7B7' : '#FCA5A5',
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders ?? 0,
      icon: <ShoppingCartIcon sx={{ color: '#D97706' }} />,
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders ?? 0,
      icon: <CheckCircleIcon sx={{ color: '#16A34A' }} />,
      bgColor: '#F0FDF4',
      borderColor: '#86EFAC',
    },
    {
      title: 'Table Occupancy',
      value: `${stats.occupiedTables ?? 0} Occupied / ${stats.availableTables ?? 0} Available`,
      icon: <TableBarIcon sx={{ color: '#DC2626' }} />,
      bgColor: '#FEF2F2',
      borderColor: '#FCA5A5',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts ?? 0,
      icon: <WarningIcon sx={{ color: '#EA580C' }} />,
      bgColor: '#FFF7ED',
      borderColor: '#FFEDD5',
      isWarning: Number(stats.lowStockProducts || 0) > 0,
    },
    {
      title: 'Monthly Expenses',
      value: `$${Number(stats.monthlyExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <ReceiptIcon sx={{ color: '#7C3AED' }} />,
      bgColor: '#F5F3FF',
      borderColor: '#C4B5FD',
    },
    {
      title: 'Purchase Summary',
      value: `${stats.pendingPurchaseOrders ?? 0} Pending POs`,
      icon: <AssignmentIcon sx={{ color: '#4F46E5' }} />,
      bgColor: '#EEF2FF',
      borderColor: '#C7D2FE',
    },
    {
      title: 'Supplier Summary',
      value: `${stats.totalSuppliers ?? 0} Active Vendors`,
      icon: <LocalShippingIcon sx={{ color: '#0891B2' }} />,
      bgColor: '#ECFEFF',
      borderColor: '#A5F3FC',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: card.borderColor,
              bgcolor: '#FFFFFF',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
              },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, color: card.isWarning ? 'warning.main' : 'text.primary' }}>
                    {card.value}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: card.bgColor,
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                  }}
                >
                  {card.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
