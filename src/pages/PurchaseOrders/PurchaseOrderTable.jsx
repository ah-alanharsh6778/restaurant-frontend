import { Chip, Typography } from '@mui/material';
import PurchaseOrderStatusChip from './PurchaseOrderStatusChip';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import EmptyPurchaseOrderState from './EmptyPurchaseOrderState';

export const PurchaseOrderTable = ({
  purchaseOrders = [],
  loading = false,
  onView,
  onEdit,
  onReceive,
  onUploadInvoice,
  onRecordPayment,
  onPrint,
  onDelete,
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
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {rowIndex !== undefined && rowIndex !== null ? rowIndex + 1 : '—'}
          </Typography>
        );
      },
    },
    {
      field: 'poNumber',
      headerName: 'PO Number',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {params.value || `PO-${String(params.row.id || '').substring(0, 6)}`}
        </Typography>
      ),
    },
    {
      field: 'supplier',
      headerName: 'Supplier Vendor',
      flex: 1.4,
      minWidth: 160,
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
      headerName: 'PO Status',
      flex: 1.1,
      minWidth: 130,
      renderCell: (params) => <PurchaseOrderStatusChip status={params.value} />,
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      flex: 1.0,
      minWidth: 110,
      renderCell: (params) => {
        const pStatus = params.value || 'PENDING';
        const isPaid = pStatus === 'PAID';
        const isPartial = pStatus === 'PARTIAL';
        return (
          <Chip
            label={pStatus}
            size="small"
            color={isPaid ? 'success' : isPartial ? 'warning' : 'default'}
            sx={{ fontWeight: 800 }}
          />
        );
      },
    },
    {
      field: 'grandTotal',
      headerName: 'Grand Total',
      flex: 1.1,
      minWidth: 120,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      valueGetter: (value, row) => row.grandTotal || row.totalAmount || 0,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
          ${Number(params.value || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date Created',
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
