import { useState, useMemo } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DataTable from '../../components/common/DataTable';
import OrderStatusChip from './OrderStatusChip';
import OrderFilter from './OrderFilter';

export const OrderHistory = ({
  orders = [],
  loading = false,
  onEditStatus,
  onDeleteOrder,
  onNewOrderClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const defaultHistoryData = [
    { id: '1', orderNumber: '#ORD-101', tableNumber: 'Table 4', totalAmount: 48.50, status: 'PAID', createdAt: new Date().toISOString() },
    { id: '2', orderNumber: '#ORD-102', tableNumber: 'Table 2', totalAmount: 124.00, status: 'PREPARING', createdAt: new Date().toISOString() },
    { id: '3', orderNumber: '#ORD-103', tableNumber: 'Takeout #3', totalAmount: 32.80, status: 'SERVED', createdAt: new Date().toISOString() },
  ];

  const displayOrders = orders.length > 0 ? orders : defaultHistoryData;

  const filteredOrders = useMemo(() => {
    return displayOrders.filter((ord) => {
      const ordNum = ord.orderNumber || `#ORD-${ord.id?.slice(0, 5)}`;
      const matchesSearch =
        !searchTerm.trim() ||
        ordNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ord.tableNumber && ord.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesFilter = true;
      if (statusFilter === 'PENDING') {
        matchesFilter = ord.status === 'PENDING' || ord.status === 'PREPARING';
      } else if (statusFilter === 'COMPLETED') {
        matchesFilter = ord.status === 'PAID' || ord.status === 'COMPLETED';
      } else if (statusFilter === 'CANCELLED') {
        matchesFilter = ord.status === 'CANCELLED';
      }

      return matchesSearch && matchesFilter;
    });
  }, [displayOrders, searchTerm, statusFilter]);

  const columns = [
    { field: 'orderNumber', headerName: 'ORDER #', renderCell: (row) => <strong>{row.orderNumber || `#ORD-${row.id?.slice(0, 5)}`}</strong> },
    { field: 'tableNumber', headerName: 'TABLE / TYPE', renderCell: (row) => row.table?.tableNumber || row.tableNumber || 'Takeout' },
    { field: 'totalAmount', headerName: 'TOTAL AMOUNT ($)', renderCell: (row) => `$${Number(row.totalAmount || 0).toFixed(2)}` },
    { field: 'status', headerName: 'STATUS', renderCell: (row) => <OrderStatusChip status={row.status} /> },
    { field: 'createdAt', headerName: 'DATE / TIME', renderCell: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : 'Just now' },
  ];

  const actions = [
    { label: 'Update Status', icon: <EditIcon fontSize="small" />, onClick: (row) => onEditStatus(row) },
    { label: 'Delete Order', icon: <DeleteIcon fontSize="small" />, onClick: (row) => onDeleteOrder(row), color: 'error.main' },
  ];

  return (
    <>
      <OrderFilter selectedFilter={statusFilter} onFilterChange={setStatusFilter} />

      <DataTable
        title="Order History Ledger"
        subtitle="Complete record of dining room and takeaway transactions"
        columns={columns}
        data={filteredOrders}
        loading={loading}
        onAddClick={onNewOrderClick}
        addButtonLabel="New POS Ticket"
        actions={actions}
        getRowId={(row) => row.id || row._id}
      />
    </>
  );
};

export default OrderHistory;
