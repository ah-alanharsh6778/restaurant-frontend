import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonDataGrid from '../../components/common/CommonDataGrid';

export const MenuItemTable = ({
  menuItems = [],
  onViewDetails,
  onEditMenuItem,
  onDeleteMenuItem,
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

  const formatPrice = (val) => {
    const num = Number(val) || 0;
    return `₹${num.toFixed(2)}`;
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Item Name',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
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
          <Chip
            label={catName}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 600, borderRadius: 2 }}
          />
        );
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      minWidth: 110,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800 }}>
          {formatPrice(params.value)}
        </Typography>
      ),
    },
    {
      field: 'isAvailable',
      headerName: 'Availability',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const isAvail = Boolean(params.row.isAvailable ?? params.row.available);
        return (
          <Chip
            label={isAvail ? 'Available' : 'Unavailable'}
            color={isAvail ? 'success' : 'error'}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700, borderRadius: 2 }}
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 140,
      valueGetter: (value, row) => formatDate(row.createdAt || row.created_at),
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

          <Tooltip title="Edit Menu Item">
            <IconButton size="small" color="primary" onClick={() => onEditMenuItem(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Menu Item">
            <IconButton size="small" color="error" onClick={() => onDeleteMenuItem(params.row)}>
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
        {menuItems.map((item) => {
          const isAvail = Boolean(item.isAvailable ?? item.available);
          return (
            <Grid item xs={12} sm={6} key={item.id || item.name}>
              <Card elevation={2} sx={{ borderRadius: 3, p: 2, bgcolor: 'background.paper' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {item.name}
                    </Typography>
                    <Chip
                      label={isAvail ? 'Available' : 'Unavailable'}
                      color={isAvail ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
                    {formatPrice(item.price)}
                  </Typography>

                  <Chip
                    label={item.category?.name || 'Uncategorized'}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ mb: 2 }}
                  />

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
                      Created: {formatDate(item.createdAt)}
                    </Typography>

                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small" color="info" onClick={() => onViewDetails(item)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => onEditMenuItem(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => onDeleteMenuItem(item)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  // Desktop DataGrid View
  return (
    <CommonDataGrid
      rows={menuItems}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id || row.name}
    />
  );
};

export default MenuItemTable;
