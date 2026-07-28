import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonDataGrid from '../../components/common/CommonDataGrid';

export const ExpenseCategoryTable = ({ categories = [], loading = false, onEdit, onDelete, onCreateClick }) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Category Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'GL Account Notes',
      flex: 2,
      minWidth: 220,
      renderCell: (params) => (
        <Tooltip title={params.value || ''} placement="top-start" arrow disableHoverListener={!params.value || params.value.length < 40}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.value || 'General Overhead'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? new Date(params.value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <Tooltip title="Edit Category">
            <IconButton size="small" color="primary" onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Category">
            <IconButton size="small" color="error" onClick={() => onDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <CommonDataGrid
      rows={categories}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id || row._id}
    />
  );
};

export default ExpenseCategoryTable;
