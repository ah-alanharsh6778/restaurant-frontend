import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import dayjs from 'dayjs';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import StatusChip from '../../components/common/StatusChip';

export const RecentOrdersTable = ({ orders = [] }) => {
  const columns = [
    {
      field: 'orderNumber',
      headerName: 'Order Number',
      width: 170,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}>
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'table',
      headerName: 'Table',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.row.table?.tableNumber || 'Takeaway'}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => {
        const st = (params.value || 'PENDING').toUpperCase();
        let color = 'warning';
        if (st === 'COMPLETED') color = 'success';
        if (st === 'CANCELLED') color = 'error';
        if (st === 'PREPARING') color = 'info';
        return <StatusChip label={st} color={color} />;
      },
    },
    {
      field: 'totalAmount',
      headerName: 'Amount',
      width: 120,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          ${Number(params.value || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? dayjs(params.value).format('MMM DD, hh:mm A') : 'N/A'}
        </Typography>
      ),
    },
  ];

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Recent Customer Orders ({orders.length})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Latest orders submitted in the restaurant POS
        </Typography>
      </Box>

      <CommonDataGrid
        rows={orders.slice(0, 10)}
        columns={columns}
        height={340}
        pageSize={5}
      />
    </Paper>
  );
};

export default RecentOrdersTable;
