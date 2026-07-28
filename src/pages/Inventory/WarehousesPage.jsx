import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import dayjs from 'dayjs';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import ActionMenu from '../../components/common/ActionMenu';
import StatusChip from '../../components/common/StatusChip';
import EmptyInventoryState from './EmptyInventoryState';

export const WarehousesPage = ({
  warehouses = [],
  loading = false,
  onOpenAdd,
  onOpenEdit,
  onOpenDelete,
}) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Warehouse Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || 'Main Premises'}
        </Typography>
      ),
    },
    {
      field: 'manager',
      headerName: 'Manager / Contact',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: () => <StatusChip label="ACTIVE" color="success" />,
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? dayjs(params.value).format('MMM DD, YYYY') : 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const rowActions = [
          {
            label: 'Edit Warehouse',
            icon: <EditIcon fontSize="small" />,
            color: 'primary',
            onClick: () => onOpenEdit(params.row),
          },
          {
            label: 'Delete Warehouse',
            icon: <DeleteIcon fontSize="small" />,
            color: 'error',
            onClick: () => onOpenDelete(params.row),
          },
        ];
        return <ActionMenu actions={rowActions} />;
      },
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Warehouses ({warehouses.length})
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onOpenAdd}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Add Warehouse
        </Button>
      </Box>

      <CommonDataGrid
        rows={warehouses}
        columns={columns}
        loading={loading}
        emptyComponent={
          <EmptyInventoryState
            title="No Warehouses Found"
            description="Get started by registering a new warehouse location."
            icon={WarehouseIcon}
            actionLabel="Add Warehouse"
            onAction={onOpenAdd}
          />
        }
      />
    </Box>
  );
};

export default WarehousesPage;
