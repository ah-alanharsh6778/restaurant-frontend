import { Chip, Typography } from '@mui/material';
import OrderStatusChip from './OrderStatusChip';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import EmptyOrderState from './EmptyOrderState';
import { getCleanTableName, getCleanOrderNumber } from '../../utils/formatters';

export const OrderTable = ({
  orders = [],
  loading = false,
  onView,
  onEditStatus,
  onDelete,
  onAddItem,
  onCheckout,
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
      field: 'orderNumber',
      headerName: 'Order Number',
      flex: 1.4,
      minWidth: 170,
      renderCell: (params) => (
        <Chip
          label={getCleanOrderNumber(params.value, params.row.id || params.row._id)}
          size="small"
          sx={{ fontWeight: 800, bgcolor: 'primary.50', color: 'primary.main', border: '1px solid', borderColor: 'primary.200' }}
        />
      ),
    },
    {
      field: 'table',
      headerName: 'Restaurant Table',
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => {
        const labelStr = getCleanTableName(params.value, params.row.tableId);
        return <Chip label={labelStr} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800 }} />;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => <OrderStatusChip status={params.value} />,
    },
    {
      field: 'itemsCount',
      headerName: 'Items',
      flex: 0.9,
      minWidth: 110,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      valueGetter: (value, row) => row.orderItems?.length || row.items?.length || 0,
      renderCell: (params) => {
        const count = params.row.orderItems?.length || params.row.items?.length || 0;
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
      headerName: 'Created Date',
      flex: 1.3,
      minWidth: 160,
      renderCell: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '—',
    },
  ];

  return (
    <CommonDataGrid
      rows={orders}
      columns={columns}
      loading={loading}
      onRowClick={(params) => onView && onView(params.row)}
      emptyComponent={<EmptyOrderState />}
    />
  );
};

export default OrderTable;
