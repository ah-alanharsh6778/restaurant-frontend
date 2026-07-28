import React from 'react';
import { Box, Typography } from '@mui/material';
import ExpenseTable from './ExpenseTable';

export const ExpensesPage = ({
  expenses = [],
  loading = false,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onOpenPreviewInvoice,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Expense Records ({expenses.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track and review all uploaded invoices and manually logged expense vouchers.
        </Typography>
      </Box>

      <ExpenseTable
        expenses={expenses}
        loading={loading}
        onOpenDetails={onOpenDetails}
        onOpenEdit={onOpenEdit}
        onOpenDelete={onOpenDelete}
        onOpenPreviewInvoice={onOpenPreviewInvoice}
      />
    </Box>
  );
};

export default ExpensesPage;
