import { Box, Chip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import ActionMenu from '../../components/common/ActionMenu';
import StockStatusChip from './StockStatusChip';
import EmptyInventoryState from './EmptyInventoryState';

export const ProductTable = ({ products = [], loading = false, onEdit, onDelete, onCreateClick }) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Chip
          label={params.row.category?.name || params.row.categoryName || 'General Produce'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      field: 'stockQuantity',
      headerName: 'Stock On Hand',
      flex: 1,
      minWidth: 140,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 800,
            color: (params.value || 0) <= (params.row.minThreshold || 10) ? 'error.main' : 'text.primary',
          }}
        >
          {params.value || 0} {params.row.unit || 'kg'}
        </Typography>
      ),
    },
    {
      field: 'minThreshold',
      headerName: 'Min Threshold',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || 10} {params.row.unit || 'kg'}
        </Typography>
      ),
    },
    {
      field: 'unitCost',
      headerName: 'Unit Cost ($)',
      flex: 1,
      minWidth: 120,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          ${Number(params.value || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Stock Status',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <StockStatusChip
          status={params.value}
          quantity={params.row.stockQuantity}
          minThreshold={params.row.minThreshold}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit Product',
              icon: <EditIcon fontSize="small" />,
              onClick: () => onEdit(params.row),
            },
            {
              label: 'Delete Product',
              icon: <DeleteIcon fontSize="small" />,
              color: 'error',
              onClick: () => onDelete(params.row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <CommonDataGrid
      rows={products}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id || row._id}
      emptyComponent={
        <EmptyInventoryState
          title="No Products Found"
          description="No inventory products have been added yet."
        />
      }
    />
  );
};

export default ProductTable;
