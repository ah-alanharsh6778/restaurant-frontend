import { Box, IconButton, Tooltip, Chip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CommonDataGrid from '../../components/common/CommonDataGrid';

export const RecipeTable = ({
  recipes = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onAddIngredient,
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
        const rowIndex = params.api?.getRowIndexRelativeToVisibleRows
          ? params.api.getRowIndexRelativeToVisibleRows(params.id)
          : undefined;
        return (
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {rowIndex !== undefined && rowIndex !== null ? rowIndex + 1 : '—'}
          </Typography>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Recipe Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'menuItem',
      headerName: 'Menu Item',
      flex: 1.3,
      minWidth: 160,
      renderCell: (params) => {
        const val = params.value;
        let itemStr = 'Unlinked';
        if (val && typeof val === 'object') {
          const n = val.name;
          itemStr = typeof n === 'object' ? String(n?.name || n?.id || 'Unlinked') : String(n || 'Unlinked');
        } else if (val != null) {
          itemStr = String(val);
        } else if (params.row.menuItemName) {
          itemStr = String(params.row.menuItemName);
        }
        return <Chip label={itemStr} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />;
      },
    },
    {
      field: 'totalIngredients',
      headerName: 'Total Ingredients',
      flex: 1,
      minWidth: 140,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      valueGetter: (value, row) => {
        return row.recipeIngredients?.length || row.ingredients?.length || 0;
      },
      renderCell: (params) => {
        const count = params.row.recipeIngredients?.length || params.row.ingredients?.length || 0;
        return (
          <Chip
            label={`${count} ${count === 1 ? 'Item' : 'Items'}`}
            size="small"
            color={count === 0 ? 'warning' : 'secondary'}
            sx={{ fontWeight: 800 }}
          />
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.8,
      minWidth: 200,
      renderCell: (params) => params.value || '—',
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1.2,
      minWidth: 130,
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
      flex: 1.1,
      minWidth: 130,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Add Ingredient to Recipe">
            <IconButton
              size="small"
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                onAddIngredient(params.row);
              }}
            >
              <AddCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Recipe">
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
          <Tooltip title="Delete Recipe">
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
      rows={recipes}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id || row._id}
      onRowClick={(params) => onView && onView(params.row)}
    />
  );
};

export default RecipeTable;
