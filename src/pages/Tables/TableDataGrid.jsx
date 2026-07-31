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
  ];

  return (
    <CommonDataGrid
      rows={tables}
      columns={columns}
      loading={loading}
      onRowClick={(params) => onView && onView(params.row)}
      emptyComponent={<EmptyTableState searchOrFilterActive={false} />}
    />
  );
};

export default TableDataGrid;
