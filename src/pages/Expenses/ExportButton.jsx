import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';

export const ExportButton = ({ expenses = [], filename = 'ExpenseRegister.xlsx' }) => {
  const handleExport = () => {
    if (expenses.length === 0) {
      toast.warning('No expenses available to export');
      return;
    }

    const headers = ['ID', 'Title', 'Vendor', 'Category', 'Amount ($)', 'Status', 'Invoice Date'];
    const rows = expenses.map((e) => [
      e.id || e._id || '',
      `"${e.title || ''}"`,
      `"${e.supplierName || e.supplier?.name || ''}"`,
      `"${e.categoryName || e.category?.name || ''}"`,
      e.amount || 0,
      e.status || 'PROCESSED',
      e.invoiceDate ? `"${new Date(e.invoiceDate).toISOString().slice(0, 10)}"` : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${expenses.length} records to ${filename}`);
  };

  return (
    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
      Export Excel Register
    </Button>
  );
};

export default ExportButton;
