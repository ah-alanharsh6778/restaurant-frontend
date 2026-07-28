import React from 'react';
import { Box, Typography } from '@mui/material';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import dayjs from 'dayjs';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import StatusChip from '../../components/common/StatusChip';
import EmptyInventoryState from './EmptyInventoryState';

export const StockHistoryTable = ({ stockHistory = [], loading = false }) => {
  const columns = [
    {
      field: 'type',
      headerName: 'Transaction Type',
      width: 170,
      renderCell: (params) => {
        const isStockIn = params.value === 'STOCK_IN';
        return (
          <StatusChip
            icon={isStockIn ? <MoveToInboxIcon fontSize="small" /> : <OutboxIcon fontSize="small" />}
            label={isStockIn ? 'STOCK IN' : 'STOCK OUT'}
            color={isStockIn ? 'success' : 'warning'}
            variant="contained"
          />
        );
      },
    },
    {
      field: 'product',
      headerName: 'Product',
      flex: 1.2,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            {params.row.product?.name || 'Unknown Product'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
            {params.row.product?.sku || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'warehouse',
      headerName: 'Warehouse',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.row.warehouse?.name || 'Main Warehouse'}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 800,
            color: params.row.type === 'STOCK_IN' ? 'success.main' : 'warning.main',
          }}
        >
          {params.row.type === 'STOCK_IN' ? `+${params.value}` : `-${params.value}`}
        </Typography>
      ),
    },
    {
      field: 'currentStock',
      headerName: 'Stock Level',
      width: 120,
      renderCell: (params) => {
        const currStock = params.row.currentStock ?? params.row.product?.currentStock ?? '—';
        return (
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {currStock}
          </Typography>
        );
      },
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      width: 150,
      renderCell: (params) => {
        const user = params.row.createdBy || params.row.user?.name || params.row.userName || 'System Admin';
        return <Typography variant="body2">{user}</Typography>;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 170,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? dayjs(params.value).format('MMM DD, YYYY hh:mm A') : 'N/A'}
        </Typography>
      ),
    },
  ];

  return (
    <CommonDataGrid
      rows={stockHistory}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id || Math.random().toString()}
      emptyComponent={
        <EmptyInventoryState
          title="No Stock History Found"
          description="There are no stock movement transactions recorded yet."
        />
      }
    />
  );
};

export default StockHistoryTable;
