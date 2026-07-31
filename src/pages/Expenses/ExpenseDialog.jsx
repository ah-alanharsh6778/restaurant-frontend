import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { toast } from 'react-toastify';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import expenseService from '../../services/expense.service';

export const ExpenseDialog = ({
  open,
  onClose,
  onSuccess,
  expense = null,
  categories = [],
}) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    categoryId: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    amount: 0,
    tax: 0,
    total: 0,
    remarks: '',
    status: 'PROCESSED',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        supplierName: expense.supplierName || expense.supplier?.name || '',
        categoryId: expense.categoryId || expense.category?.id || '',
        invoiceNumber: expense.invoiceNumber || '',
        invoiceDate: expense.invoiceDate
          ? new Date(expense.invoiceDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        amount: expense.amount ?? 0,
        tax: expense.tax ?? 0,
        total: expense.total ?? 0,
        remarks: expense.remarks || '',
        status: expense.status || 'PROCESSED',
      });
    } else {
      setFormData({
        supplierName: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        amount: 0,
        tax: 0,
        total: 0,
        remarks: '',
        status: 'PROCESSED',
      });
    }
  }, [expense, open, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: Number(formData.amount || 0),
      tax: Number(formData.tax || 0),
      total: Number(formData.total || (Number(formData.amount || 0) + Number(formData.tax || 0))),
    };

    try {
      setLoading(true);
      if (expense && expense.id) {
        await expenseService.updateExpense(expense.id, payload);
        toast.success('Expense record updated successfully!');
      } else {
        await expenseService.createExpense(payload);
        toast.success('Expense record created successfully!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save expense.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={expense ? 'Edit Expense' : 'Create Expense'}
      subtitle={expense ? 'Update expense entry' : 'Register a new expense invoice manually'}
      icon={ReceiptLongIcon}
      iconColor="primary.main"
      actions={
        <>
          <Button onClick={onClose} disabled={loading} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            {expense ? 'Update Expense' : 'Create Expense'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2.5} sx={{ py: 1 }}>
          <Grid xs={12} sm={6}>
            <TextField
              label="Invoice Number *"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g., INV-2026-001"
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              label="Supplier / Vendor"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              fullWidth
              placeholder="e.g., Metro Wholesale Inc."
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="expense-dialog-category-label">Category</InputLabel>
              <Select
                labelId="expense-dialog-category-label"
                name="categoryId"
                value={formData.categoryId}
                label="Category"
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              label="Invoice Date"
              name="invoiceDate"
              type="date"
              value={formData.invoiceDate}
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid xs={12} sm={4}>
            <TextField
              label="Subtotal Amount ($)"
              name="amount"
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
              value={formData.amount}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid xs={12} sm={4}>
            <TextField
              label="Tax Amount ($)"
              name="tax"
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
              value={formData.tax}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid xs={12} sm={4}>
            <TextField
              label="Total Amount ($)"
              name="total"
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
              value={formData.total}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="expense-status-select-label">Status</InputLabel>
              <Select
                labelId="expense-status-select-label"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="PROCESSED">PROCESSED</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="FAILED">FAILED</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              label="Remarks / Notes"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              fullWidth
              placeholder="e.g., Monthly electricity bill"
            />
          </Grid>
        </Grid>
      </form>
    </ResponsiveDialog>
  );
};

export default ExpenseDialog;
