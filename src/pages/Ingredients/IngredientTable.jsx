import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IngredientStatusChip from './IngredientStatusChip';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import EmptyIngredientState from './EmptyIngredientState';

export const IngredientTable = ({
  ingredients = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Ingredient Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Available Quantity',
      flex: 1,
      minWidth: 140,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        const qty = Number(params.row.quantity !== undefined ? params.row.quantity : 0);
        const min = Number(params.row.minimumStock !== undefined ? params.row.minimumStock : params.row.minStock || 0);
        const isLow = qty <= min;
        return (
          <Typography variant="body2" sx={{ fontWeight: 800, color: isLow ? 'error.main' : 'text.primary' }}>
            {qty} {params.row.unit || ''}
          </Typography>
        );
      },
    },
    {
      field: 'minimumStock',
      headerName: 'Minimum Stock',
      flex: 1,
      minWidth: 130,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        const min = Number(params.row.minimumStock !== undefined ? params.row.minimumStock : params.row.minStock || 0);
        return (
          <Typography variant="body2" color="text.secondary">
            {min} {params.row.unit || ''}
          </Typography>
        );
      },
    },
    {
      field: 'costPerUnit',
      headerName: 'Cost / Unit',
      flex: 0.9,
      minWidth: 110,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        const cost = Number(params.row.costPerUnit || 0);
        return (
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {cost > 0 ? `$${cost.toFixed(2)}` : '—'}
          </Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => {
        const qty = Number(params.row.quantity !== undefined ? params.row.quantity : 0);
        const min = Number(params.row.minimumStock !== undefined ? params.row.minimumStock : params.row.minStock || 0);
        const isActive = params.row.isActive !== undefined ? params.row.isActive : params.row.status !== 'INACTIVE';
        return (
          <IngredientStatusChip
            quantity={qty}
            minimumStock={min}
            isActive={isActive}
            status={params.row.status}
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '—',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.9,
      minWidth: 110,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Edit Ingredient">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(params.row);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Ingredient">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(params.row);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <CommonDataGrid
      rows={ingredients}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id || row._id}
      onRowClick={(params) => onView && onView(params.row)}
      emptyComponent={<EmptyIngredientState />}
    />
  );
};

export default IngredientTable;
