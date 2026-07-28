import { DataGrid } from '@mui/x-data-grid';
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
import QrCode2Icon from '@mui/icons-material/QrCode2';
import TableStatusChip from './TableStatusChip';

export const TableList = ({
  tables = [],
  onViewDetails,
  onEditTable,
  onDeleteTable,
  onOpenQrModal,
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

  const handleActionClick = (handler, row, event) => {
    if (event?.currentTarget) {
      event.currentTarget.blur();
    }
    handler(row, event);
  };

  const columns = [
    {
      field: 'number',
      headerName: 'Table Number',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const numberVal = params.row.tableNumber || params.row.number || `Table #${params.row.id}`;
        return (
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {numberVal}
          </Typography>
        );
      },
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.row.capacity} Guests
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => <TableStatusChip status={params.value} />,
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
      width: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="QR Code">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => handleActionClick(onOpenQrModal, params.row, e)}
            >
              <QrCode2Icon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={(e) => handleActionClick(onViewDetails, params.row, e)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Table">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => handleActionClick(onEditTable, params.row, e)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Table">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => handleActionClick(onDeleteTable, params.row, e)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // Mobile View: Cards Grid
  if (isMobile) {
    return (
      <Grid container spacing={2}>
        {tables.map((table) => {
          const numberVal = table.tableNumber || table.number || `Table #${table.id}`;
          return (
            <Grid xs={12} sm={6} key={table.id || numberVal}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  p: 2,
                  backgroundColor: '#FFFFFF',
                }}
              >
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {numberVal}
                    </Typography>
                    <TableStatusChip status={table.status} />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Capacity: <strong>{table.capacity} Guests</strong>
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
                      Created: {formatDate(table.createdAt)}
                    </Typography>

                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small" color="info" onClick={(e) => handleActionClick(onViewDetails, table, e)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={(e) => handleActionClick(onEditTable, table, e)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={(e) => handleActionClick(onDeleteTable, table, e)}>
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

  // Desktop / Tablet View: DataGrid
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      }}
    >
      <DataGrid
        rows={tables}
        columns={columns}
        getRowId={(row) => row.id || row.tableNumber || row.number}
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#F8FAFC',
            fontWeight: 700,
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      />
    </Box>
  );
};

export default TableList;
