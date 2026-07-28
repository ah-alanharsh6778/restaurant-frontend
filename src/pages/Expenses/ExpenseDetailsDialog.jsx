import React from 'react';
import {
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  Stack,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import ExpenseStatusChip from './ExpenseStatusChip';

export const ExpenseDetailsDialog = ({
  open,
  onClose,
  expense = null,
  onOpenEdit,
  onOpenPreviewInvoice,
}) => {
  if (!expense) return null;

  const invoiceDateStr = expense.invoiceDate
    ? dayjs(expense.invoiceDate).format('MMM DD, YYYY')
    : 'N/A';
  const createdDateStr = expense.createdAt
    ? dayjs(expense.createdAt).format('MMM DD, YYYY hh:mm A')
    : 'N/A';
  const updatedDateStr = expense.updatedAt
    ? dayjs(expense.updatedAt).format('MMM DD, YYYY hh:mm A')
    : 'N/A';

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={`Expense Details - ${expense.invoiceNumber || 'N/A'}`}
      subtitle="Complete voucher parameters and file association"
      icon={VisibilityIcon}
      iconColor="info.main"
      actions={
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          {expense.filePath && (
            <Button
              size="small"
              variant="outlined"
              color="info"
              startIcon={<VisibilityIcon />}
              onClick={() => {
                onClose();
                onOpenPreviewInvoice(expense);
              }}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Preview Invoice File
            </Button>
          )}

          <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => {
                onClose();
                onOpenEdit(expense);
              }}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Edit
            </Button>
            <Button size="small" onClick={onClose} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
              Close
            </Button>
          </Stack>
        </Box>
      }
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
            {expense.invoiceNumber || 'No Invoice Number'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Supplier: {expense.supplier?.name || expense.supplierName || 'N/A'}
          </Typography>
        </Box>
        <ExpenseStatusChip status={expense.status} />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <Typography variant="caption" color="text.secondary" display="block">
            Category
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {expense.category?.name || 'Uncategorized'}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={4}>
          <Typography variant="caption" color="text.secondary" display="block">
            Invoice Date
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {invoiceDateStr}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography variant="caption" color="text.secondary" display="block">
            Attached File
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: expense.filePath ? 'primary.main' : 'text.disabled' }}>
            {expense.filePath ? 'Invoice Attached' : 'No File Uploaded'}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Subtotal Amount
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5 }}>
              ${Number(expense.amount || 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Tax Amount
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'warning.main', mt: 0.5 }}>
              ${Number(expense.tax || 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#ECFDF5', borderRadius: 2.5, border: '1px solid', borderColor: '#A7F3D0' }}>
            <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }} display="block">
              Total Expense
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#047857', mt: 0.5 }}>
              ${Number(expense.total || (Number(expense.amount || 0) + Number(expense.tax || 0))).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" display="block">
            Remarks / Remarks
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {expense.remarks || '—'}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Created Timestamp
          </Typography>
          <Typography variant="caption" display="block" color="text.primary">
            {createdDateStr}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Updated Timestamp
          </Typography>
          <Typography variant="caption" display="block" color="text.primary">
            {updatedDateStr}
          </Typography>
        </Grid>
      </Grid>
    </ResponsiveDialog>
  );
};

export default ExpenseDetailsDialog;
