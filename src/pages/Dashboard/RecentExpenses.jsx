import DataTable from '../../components/common/DataTable';

export const RecentExpenses = ({ expenses = [], loading = false, onAddClick }) => {
  const columns = [
    { field: 'title', headerName: 'EXPENSE TITLE', renderCell: (row) => <strong>{row.title}</strong> },
    { field: 'category', headerName: 'CATEGORY', renderCell: (row) => row.category?.name || row.categoryName || 'Utilities & Rent' },
    { field: 'amount', headerName: 'AMOUNT ($)', renderCell: (row) => `$${Number(row.amount || 0).toFixed(2)}` },
    {
      field: 'paymentStatus',
      headerName: 'PAYMENT STATUS',
      type: 'chip',
      chipColor: (status) => (status === 'PAID' ? 'success' : 'warning'),
      renderCell: (row) => row.paymentStatus || 'PAID',
    },
  ];

  const defaultData = [
    { id: '1', title: 'Monthly Electricity & Gas Bill', categoryName: 'Utilities & Rent', amount: 1450.00, paymentStatus: 'PAID' },
    { id: '2', title: 'Kitchen Staff Bi-Weekly Payroll', categoryName: 'Staff Payroll', amount: 4800.00, paymentStatus: 'PAID' },
    { id: '3', title: 'Commercial Dishwasher Maintenance', categoryName: 'Equipment', amount: 350.00, paymentStatus: 'PENDING' },
  ];

  return (
    <DataTable
      title="Latest Operational Expenses"
      subtitle="Recent bills, utilities, and payroll records"
      columns={columns}
      data={expenses.length > 0 ? expenses : defaultData}
      loading={loading}
      onAddClick={onAddClick}
      addButtonLabel="Add Expense"
    />
  );
};

export default RecentExpenses;
