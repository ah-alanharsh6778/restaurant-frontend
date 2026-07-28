import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Skeleton, Avatar } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';

export const StockSummaryCards = ({
  products = [],
  categories = [],
  warehouses = [],
  stockHistory = [],
  loading = false,
}) => {
  // Calculations
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalWarehouses = warehouses.length;

  const lowStockCount = products.filter(
    (p) => Number(p.currentStock || 0) <= Number(p.minimumStock || 0)
  ).length;

  const totalValue = products.reduce((acc, item) => {
    const cost = Number(item.costPrice || 0);
    const stock = Number(item.currentStock || 0);
    return acc + cost * stock;
  }, 0);

  const totalTransactions = stockHistory.length;

  const cards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <InventoryIcon sx={{ color: '#2563EB' }} />,
      bgColor: '#EFF6FF',
      borderColor: '#93C5FD',
    },
    {
      title: 'Total Categories',
      value: totalCategories,
      icon: <CategoryIcon sx={{ color: '#7C3AED' }} />,
      bgColor: '#F5F3FF',
      borderColor: '#C4B5FD',
    },
    {
      title: 'Total Warehouses',
      value: totalWarehouses,
      icon: <WarehouseIcon sx={{ color: '#0D9488' }} />,
      bgColor: '#F0FDFA',
      borderColor: '#99F6E4',
    },
    {
      title: 'Low Stock Products',
      value: lowStockCount,
      icon: <WarningIcon sx={{ color: '#D97706' }} />,
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      isWarning: lowStockCount > 0,
    },
    {
      title: 'Current Inventory Value',
      value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <AttachMoneyIcon sx={{ color: '#059669' }} />,
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
    },
    {
      title: 'Recent Transactions',
      value: totalTransactions,
      icon: <HistoryIcon sx={{ color: '#4F46E5' }} />,
      bgColor: '#EEF2FF',
      borderColor: '#C7D2FE',
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <Card
            elevation={0}
            sx={{
              p: 1,
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
              {loading ? (
                <Box>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={32} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: card.isWarning ? 'warning.main' : 'text.primary' }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: card.bgColor,
                      width: 46,
                      height: 46,
                      borderRadius: 2.5,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StockSummaryCards;
