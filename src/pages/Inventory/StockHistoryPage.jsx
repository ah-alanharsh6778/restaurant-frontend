import React from 'react';
import { Box, Typography } from '@mui/material';
import StockHistoryTable from './StockHistoryTable';

export const StockHistoryPage = ({ stockHistory = [], loading = false }) => {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Stock Transaction History ({stockHistory.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Audit log of all stock in and stock out movements recorded by the system.
        </Typography>
      </Box>

      <StockHistoryTable stockHistory={stockHistory} loading={loading} />
    </Box>
  );
};

export default StockHistoryPage;
