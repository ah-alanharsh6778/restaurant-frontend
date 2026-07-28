import { Chip } from '@mui/material';
import DataTable from '../../components/common/DataTable';

export const StockHistory = ({ history = [], loading = false }) => {
  const defaultHistory = [
    {
      id: 'h1',
      productName: 'Fresh Italian Tomatoes',
      type: 'STOCK_IN',
      quantity: 50,
      unit: 'kg',
      warehouseName: 'Main Cold Storage',
      remarks: 'Vendor Delivery PO #8801',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'h2',
      productName: 'Extra Virgin Olive Oil 5L',
      type: 'STOCK_OUT',
      quantity: 5,
      unit: 'liter',
      warehouseName: 'Kitchen Dry Pantry',
      remarks: 'Dinner Line Prep Usage',
      createdAt: new Date().toISOString(),
    },
  ];

  const dataList = history.length > 0 ? history : defaultHistory;

  const columns = [
    { field: 'productName', headerName: 'PRODUCT NAME', renderCell: (row) => <strong>{row.product?.name || row.productName}</strong> },
    {
      field: 'type',
      headerName: 'TRANSACTION TYPE',
      renderCell: (row) => (
        <Chip
          label={row.type === 'STOCK_IN' ? '+ STOCK IN' : '- STOCK OUT'}
          color={row.type === 'STOCK_IN' ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 800 }}
        />
      ),
    },
    { field: 'quantity', headerName: 'QUANTITY', renderCell: (row) => `${row.type === 'STOCK_IN' ? '+' : '-'}${row.quantity} ${row.unit || row.product?.unit || 'units'}` },
    { field: 'warehouse', headerName: 'WAREHOUSE', renderCell: (row) => row.warehouse?.name || row.warehouseName || 'Main Storage' },
    { field: 'remarks', headerName: 'REMARKS / REF', renderCell: (row) => row.remarks || 'Standard Transaction' },
    { field: 'createdAt', headerName: 'TIMESTAMP', renderCell: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : 'Just now' },
  ];

  return (
    <DataTable
      title="Inventory Stock Movement History"
      subtitle="Complete audit trail log of all stock receipts, deductions, and transfer events"
      columns={columns}
      data={dataList}
      loading={loading}
      getRowId={(row) => row.id || row._id}
    />
  );
};

export default StockHistory;
