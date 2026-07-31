import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import dayjs from 'dayjs';
import CommonDataGrid from '../../components/common/CommonDataGrid';
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
      field: 'sNo',
      headerName: 'S.No.',
      width: 70,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const rowIndex = params.api?.getRowIndexRelativeToVisibleRows
          ? params.api.getRowIndexRelativeToVisibleRows(params.id)
          : undefined;
        return (
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#9CA3AF' }}>
            {rowIndex !== undefined && rowIndex !== null ? rowIndex + 1 : '—'}
          </Typography>
        );
      },
    },
    {
      field: 'invoiceNumber',
      headerName: 'Invoice Number',
      width: 170,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 800,
            color: '#7C6CFF',
            cursor: 'pointer',
            fontSize: '0.875rem',
            '&:hover': { textDecoration: 'underline', color: '#6854FF' },
          }}
          onClick={() => onOpenDetails && onOpenDetails(params.row)}
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
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.875rem' }}>
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
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#9CA3AF', fontSize: '0.85rem' }}>
          {params.row.category?.name || 'Uncategorized'}
        </Typography>
      ),
    },
    {
      field: 'invoiceDate',
      headerName: 'Invoice Date',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
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
        <Typography variant="body2" sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.85rem' }}>
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
        <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.85rem' }}>
          ${Number(params.value || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      width: 140,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: '#10B981', fontSize: '0.9rem' }}>
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
        <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
          {params.value ? dayjs(params.value).format('MMM DD, YYYY') : 'N/A'}
        </Typography>
      ),
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '20px',
        backgroundColor: '#131A24',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <CommonDataGrid
        rows={expenses}
        columns={columns}
        loading={loading}
        onRowClick={(params) => onOpenDetails && onOpenDetails(params.row)}
        emptyComponent={
          <EmptyExpenseState
            title="No Expenses Found"
            description="No expense records match your current search or filter criteria."
          />
        }
      />
    </Paper>
  );
};

export default ExpenseTable;
