import React from 'react';
import { Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import dayjs from 'dayjs';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import ActionMenu from '../../components/common/ActionMenu';
import ExpenseStatusChip from './ExpenseStatusChip';
import EmptyExpenseState from './EmptyExpenseState';

export const ExpenseTable = ({
  expenses = [],
  loading = false,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onOpenPreviewInvoice,
}) => {
  const columns = [
    {
      field: 'invoiceNumber',
      headerName: 'Invoice Number',
      width: 170,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
          onClick={() => onOpenDetails(params.row)}
        >
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'supplier',
      headerName: 'Supplier / Vendor',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.row.supplier?.name || params.row.supplierName || '—'}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.row.category?.name || 'Uncategorized'}
        </Typography>
      ),
    },
    {
      field: 'invoiceDate',
      headerName: 'Invoice Date',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? dayjs(params.value).format('MMM DD, YYYY') : 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'Subtotal',
      width: 120,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          ${Number(params.value || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 100,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          ${Number(params.value || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      width: 130,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
          ${Number(params.value || (Number(params.row.amount || 0) + Number(params.row.tax || 0))).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => <ExpenseStatusChip status={params.value} />,
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? dayjs(params.value).format('MMM DD, YYYY') : 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const rowActions = [
          {
            label: 'View Details',
            icon: <VisibilityIcon fontSize="small" />,
            color: 'info',
            onClick: () => onOpenDetails(params.row),
          },
        ];

        if (params.row.filePath) {
          rowActions.push({
            label: 'Preview Document',
            icon: <DescriptionIcon fontSize="small" />,
            color: 'success',
            onClick: () => onOpenPreviewInvoice(params.row),
          });
        }

        rowActions.push(
          {
            label: 'Edit Expense',
            icon: <EditIcon fontSize="small" />,
            color: 'primary',
            onClick: () => onOpenEdit(params.row),
          },
          {
            label: 'Delete Expense',
            icon: <DeleteIcon fontSize="small" />,
            color: 'error',
            onClick: () => onOpenDelete(params.row),
          }
        );

        return <ActionMenu actions={rowActions} />;
      },
    },
  ];

  return (
    <CommonDataGrid
      rows={expenses}
      columns={columns}
      loading={loading}
      emptyComponent={
        <EmptyExpenseState
          title="No Expenses Found"
          description="No expense records match your current search or filter criteria."
        />
      }
    />
  );
};

export default ExpenseTable;
