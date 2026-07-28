import React from 'react';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableBarIcon from '@mui/icons-material/TableBar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TableStatusChip from './TableStatusChip';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import EmptyTableState from './EmptyTableState';

export const TableDataGrid = ({
  tables = [],
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  canManage = false,
  loading = false,
}) => {
  const columns = [
    {
      field: 'tableNumber',
      headerName: 'Table #',
      width: 130,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Table #{params.row.tableNumber || params.row.id}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Table Name',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }} noWrap>
          {params.row.name || `Table ${params.row.tableNumber || params.row.id}`}
        </Typography>
      ),
    },
    {
      field: 'capacity',
      headerName: 'Seating Capacity',
      width: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {params.row.capacity || 4} Guests
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Current Status',
      width: 160,
      renderCell: (params) => <TableStatusChip status={params.row.status} />,
    },
    {
      field: 'actions',
      headerName: 'Management Actions',
      flex: 1,
      minWidth: 300,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        const statusUpper = String(row.status || 'AVAILABLE').toUpperCase();
        const isAvailable = statusUpper === 'AVAILABLE';
        const isOccupied = statusUpper === 'OCCUPIED';
        const isReserved = statusUpper === 'RESERVED';
        const isMaintenance = statusUpper === 'MAINTENANCE';

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
            {isAvailable && (
              <Button
                variant="contained"
                size="small"
                color="error"
                startIcon={<TableBarIcon fontSize="small" />}
                onClick={() => onUpdateStatus(row.id, 'OCCUPIED')}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 1.5, py: 0.4, flexShrink: 0 }}
              >
                Mark Occupied
              </Button>
            )}

            {(isOccupied || isMaintenance) && (
              <Button
                variant="contained"
                size="small"
                color="success"
                startIcon={<CheckCircleIcon fontSize="small" />}
                onClick={() => onUpdateStatus(row.id, 'AVAILABLE')}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 1.5, py: 0.4, flexShrink: 0 }}
              >
                Release Table
              </Button>
            )}

            {isReserved && (
              <Button
                variant="contained"
                size="small"
                color="error"
                startIcon={<TableBarIcon fontSize="small" />}
                onClick={() => onUpdateStatus(row.id, 'OCCUPIED')}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 1.5, py: 0.4, flexShrink: 0 }}
              >
                Check In Guest
              </Button>
            )}

            <Tooltip title="View Table Details">
              <IconButton
                size="small"
                onClick={() => onView(row)}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, color: 'text.secondary', flexShrink: 0 }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {canManage && (
              <>
                <Tooltip title="Edit Table Config">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(row)}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, color: 'primary.main', flexShrink: 0 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete Table">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(row)}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, color: 'error.main', flexShrink: 0 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <CommonDataGrid
      rows={tables}
      columns={columns}
      loading={loading}
      emptyComponent={<EmptyTableState searchOrFilterActive={false} />}
    />
  );
};

export default TableDataGrid;
