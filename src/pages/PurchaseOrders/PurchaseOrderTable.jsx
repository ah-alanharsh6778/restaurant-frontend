import { Box, IconButton, Tooltip, Chip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PurchaseOrderStatusChip from './PurchaseOrderStatusChip';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import EmptyPurchaseOrderState from './EmptyPurchaseOrderState';

export const PurchaseOrderTable = ({
  purchaseOrders = [],
  loading = false,
  onView,
  onEditStatus,
  onDelete,
  onAddItem,
}) => {
  const columns = [
    {
      field: 'poNumber',
      headerName: 'PO Number',
      flex: 1.4,
      minWidth: 170,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {params.value || `PO-${String(params.row.id || '').substring(0, 6)}`}
        </Typography>
      ),
    },
    {
      field: 'supplier',
      headerName: 'Supplier',
      flex: 1.4,
      minWidth: 170,
      renderCell: (params) => {
        const val = params.value;
        let supName = 'Unknown Vendor';
        if (val && typeof val === 'object') {
          const n = val.name;
          supName = typeof n === 'object' ? String(n?.name || n?.id || 'Unknown Vendor') : String(n || 'Unknown Vendor');
        } else if (val != null) {
          supName = String(val);
        } else if (params.row.supplierName) {
          supName = String(params.row.supplierName);
        }
        return <Chip label={supName} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => <PurchaseOrderStatusChip status={params.value} />,
    },
    {
      field: 'itemsCount',
      headerName: 'Items',
      flex: 0.9,
      minWidth: 110,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      valueGetter: (value, row) => row.purchaseItems?.length || row.items?.length || 0,
      renderCell: (params) => {
        const count = params.row.purchaseItems?.length || params.row.items?.length || 0;
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
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1.2,
      minWidth: 140,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
          ${Number(params.value || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'PO Date',
      flex: 1.3,
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
      flex: 1.1,
      minWidth: 140,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Add Item to PO">
            <IconButton
              size="small"
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                onAddItem(params.row);
              }}
            >
              <AddCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update PO Status">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onEditStatus(params.row);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete PO">
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
      rows={purchaseOrders}
      columns={columns}
      loading={loading}
      onRowClick={(params) => onView && onView(params.row)}
      emptyComponent={<EmptyPurchaseOrderState />}
    />
  );
};

export default PurchaseOrderTable;
