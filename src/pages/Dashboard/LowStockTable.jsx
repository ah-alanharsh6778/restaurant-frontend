import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import LowStockChip from '../Inventory/LowStockChip';

export const LowStockTable = ({ products = [] }) => {
  const lowStockProducts = products.filter(
    (p) => Number(p.currentStock || 0) <= Number(p.minimumStock || 0)
  );

  const columns = [
    {
      field: 'sku',
      headerName: 'SKU',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 600 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'currentStock',
      headerName: 'Current',
      width: 100,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main' }}>
          {params.value ?? 0} {params.row.unit || ''}
        </Typography>
      ),
    },
    {
      field: 'minimumStock',
      headerName: 'Min Level',
      width: 100,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ?? 0}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <LowStockChip currentStock={params.row.currentStock} minimumStock={params.row.minimumStock} />
      ),
    },
  ];

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: lowStockProducts.length > 0 ? 'warning.main' : 'text.primary' }}>
          Low Stock Products ({lowStockProducts.length})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Products that have reached or fallen below minimum stock threshold
        </Typography>
      </Box>

      <CommonDataGrid
        rows={lowStockProducts}
        columns={columns}
        height={340}
        pageSize={5}
      />
    </Paper>
  );
};

export default LowStockTable;
