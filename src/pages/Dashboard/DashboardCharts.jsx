import React from 'react';
import { Grid, Box } from '@mui/material';
import SalesChart from './SalesChart';
import ExpenseChart from './ExpenseChart';
import OrdersChart from './OrdersChart';
import InventoryChart from './InventoryChart';

export const DashboardCharts = ({ chartsData = {} }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <SalesChart data={chartsData.salesTrend || []} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ExpenseChart data={chartsData.monthlyExpenses || []} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <OrdersChart data={chartsData.ordersStatus || []} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <InventoryChart data={chartsData.inventoryStatus || []} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardCharts;
