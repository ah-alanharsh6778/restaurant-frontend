import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonDataGrid from '../../components/common/CommonDataGrid';

export const CategoryTable = ({
  categories = [],
  onViewDetails,
  onEditCategory,
  onDeleteCategory,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Category Name',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || ''} placement="top-start" arrow disableHoverListener={!params.value || params.value.length < 40}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.value || 'No description'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 140,
      valueGetter: (value, row) => formatDate(row.createdAt || row.created_at),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated Date',
      flex: 1,
      minWidth: 140,
      valueGetter: (value, row) => formatDate(row.updatedAt || row.updated_at),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="View Details">
            <IconButton size="small" color="info" onClick={() => onViewDetails(params.row)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Category">
            <IconButton size="small" color="primary" onClick={() => onEditCategory(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Category">
            <IconButton size="small" color="error" onClick={() => onDeleteCategory(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // Mobile Card View
  if (isMobile) {
    return (
      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} key={cat.id || cat.name}>
            <Card elevation={2} sx={{ borderRadius: 3, p: 2, bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  {cat.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {cat.description || 'No description provided.'}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 1.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(cat.createdAt)}
                  </Typography>

                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" color="info" onClick={() => onViewDetails(cat)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => onEditCategory(cat)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDeleteCategory(cat)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Desktop DataGrid View
  return (
    <CommonDataGrid
      rows={categories}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id || row.name}
    />
  );
};

export default CategoryTable;
