import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, CircularProgress } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { toast } from 'react-toastify';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import expenseService from '../../services/expense.service';

export const ExpenseCategoryDialog = ({ open, onClose, onSuccess, category = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [category, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required.');
      return;
    }

    try {
      setLoading(true);
      if (category && category.id) {
        await expenseService.updateExpenseCategory(category.id, formData);
        toast.success('Expense category updated successfully!');
      } else {
        await expenseService.createExpenseCategory(formData);
        toast.success('Expense category created successfully!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving expense category:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save expense category.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title={category ? 'Edit Expense Category' : 'Create Expense Category'}
      subtitle={category ? 'Update category parameters' : 'Add a new expense category for accounting'}
      icon={CategoryIcon}
      iconColor="secondary.main"
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
            {category ? 'Update Category' : 'Create Category'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
          <TextField
            label="Category Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            placeholder="e.g., Ingredients, Utilities, Salaries"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            placeholder="Optional category description..."
          />
        </Box>
      </form>
    </ResponsiveDialog>
  );
};

export default ExpenseCategoryDialog;
