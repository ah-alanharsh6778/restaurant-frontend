import DataTable from '../../components/common/DataTable';

export const PurchaseSummary = ({ purchaseOrders = [], loading = false, onAddClick }) => {
  const columns = [
    { field: 'poNumber', headerName: 'PO NUMBER', renderCell: (row) => <strong>{row.poNumber || `#PO-${row.id?.slice(0, 6)}`}</strong> },
    { field: 'supplier', headerName: 'VENDOR / SUPPLIER', renderCell: (row) => row.supplier?.name || row.supplierName || 'Fresh Produce Direct' },
    { field: 'totalAmount', headerName: 'AMOUNT ($)', renderCell: (row) => `$${Number(row.totalAmount || 0).toFixed(2)}` },
    {
      field: 'status',
      headerName: 'PO STATUS',
      type: 'chip',
      chipColor: (status) => {
        switch (status) {
          case 'RECEIVED':
            return 'success';
          case 'SENT':
          case 'PARTIAL':
            return 'warning';
          case 'DRAFT':
            return 'info';
          case 'CANCELLED':
            return 'error';
          default:
            return 'default';
        }
      },
    },
  ];

  const defaultData = [
    { id: '1', poNumber: '#PO-8801', supplierName: 'Fresh Produce Direct Inc.', totalAmount: 480.00, status: 'RECEIVED' },
    { id: '2', poNumber: '#PO-8802', supplierName: 'Prime Meat Packers LLC', totalAmount: 1250.00, status: 'SENT' },
    { id: '3', poNumber: '#PO-8803', supplierName: 'Artisan Beverage Distributors', totalAmount: 320.00, status: 'DRAFT' },
  ];

  return (
    <DataTable
      title="Latest Purchase Orders"
      subtitle="Vendor supply orders and receiving status"
      columns={columns}
      data={purchaseOrders.length > 0 ? purchaseOrders : defaultData}
      loading={loading}
      onAddClick={onAddClick}
      addButtonLabel="Create PO"
    />
  );
};

export default PurchaseSummary;
