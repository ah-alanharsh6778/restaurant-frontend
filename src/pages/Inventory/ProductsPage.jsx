import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import ActionMenu from '../../components/common/ActionMenu';
import LowStockChip from './LowStockChip';
import EmptyInventoryState from './EmptyInventoryState';

export const ProductsPage = ({
  products = [],
  loading = false,
  onOpenAdd,
  onOpenEdit,
  onOpenDelete,
  onOpenDetails,
  onOpenStockIn,
  onOpenStockOut,
}) => {
  const columns = [
    {
      field: 'sNo',
      headerName: 'S.No.',
      width: 80,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {rowIndex !== undefined && rowIndex !== null ? rowIndex + 1 : '—'}
          </Typography>
        );
      },
    },
    {
      field: 'sku',
      headerName: 'SKU',
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'text.secondary' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => onOpenDetails(params.row)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const cat = params.row.category || params.value;
        let catName = 'Uncategorized';
        if (cat && typeof cat === 'object') {
          const n = cat.name;
          catName = typeof n === 'object' ? String(n?.name || n?.id || 'Uncategorized') : String(n || 'Uncategorized');
        } else if (cat != null) {
          catName = String(cat);
        }
        return (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {catName}
          </Typography>
        );
      },
    },
    {
      field: 'currentStock',
      headerName: 'Current Stock',
      width: 130,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        const u = params.row.unit;
        let uStr = '';
        if (u && typeof u === 'object') {
          uStr = String(u.name || u.symbol || u.unit || '');
        } else if (u != null) {
          uStr = String(u);
        }
        return (
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {params.value ?? 0} {uStr ? <Typography component="span" variant="caption" color="text.secondary">({uStr})</Typography> : ''}
          </Typography>
        );
      },
    },
    {
      field: 'minimumStock',
      headerName: 'Min Stock',
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
      headerName: 'Stock Status',
      width: 150,
      renderCell: (params) => (
        <LowStockChip currentStock={params.row.currentStock} minimumStock={params.row.minimumStock} />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? dayjs(params.value).format('MMM DD, YYYY') : 'N/A'}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Products List ({products.length})
        </Typography>
      </Box>

      <CommonDataGrid
        rows={products}
        columns={columns}
        loading={loading}
        onRowClick={(params) => onOpenDetails && onOpenDetails(params.row)}
        emptyComponent={
          <EmptyInventoryState
            title="No Products Found"
            description="No inventory products match your current search or filter criteria."
            actionLabel="Add Product"
            onAction={onOpenAdd}
          />
        }
      />
    </Box>
  );
};

export default ProductsPage;
