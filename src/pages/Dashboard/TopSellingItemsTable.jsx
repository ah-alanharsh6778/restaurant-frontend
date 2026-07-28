import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CommonDataGrid from '../../components/common/CommonDataGrid';

export const TopSellingItemsTable = ({ orders = [] }) => {
  const topItems = useMemo(() => {
    const itemMap = {};

    orders.forEach((order) => {
      if (Array.isArray(order.orderItems)) {
        order.orderItems.forEach((oi) => {
          const name = oi.menuItem?.name || oi.name || `Item #${oi.menuItemId || oi.id}`;
          if (!itemMap[name]) {
            itemMap[name] = { id: name, name, quantity: 0, revenue: 0 };
          }
          itemMap[name].quantity += Number(oi.quantity || 1);
          itemMap[name].revenue += Number(oi.subtotal || oi.price * oi.quantity || 0);
        });
      }
    });

    return Object.values(itemMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [orders]);

  const columns = [
    {
      field: 'name',
      headerName: 'Menu Item Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Qty Sold',
      width: 110,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      width: 130,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          ${Number(params.value || 0).toFixed(2)}
        </Typography>
      ),
    },
  ];

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Top Selling Menu Items ({topItems.length})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Most popular dishes and beverages by volume sold
        </Typography>
      </Box>

      <CommonDataGrid
        rows={topItems}
        columns={columns}
        getRowId={(row) => row.id}
        height={340}
        pageSize={5}
      />
    </Paper>
  );
};

export default TopSellingItemsTable;
