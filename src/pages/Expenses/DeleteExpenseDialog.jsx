import React, { useState } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { toast } from 'react-toastify';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import expenseService from '../../services/expense.service';

export const DeleteExpenseDialog = ({
  open,
  onClose,
  onSuccess,
  itemType = 'expense', // 'expense' | 'category'
  item = null,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!item || !item.id) return;

    try {
      setLoading(true);
      if (itemType === 'category') {
        await expenseService.deleteExpenseCategory(item.id);
        toast.success(`Category "${item.name}" deleted successfully!`);
      } else {
        await expenseService.deleteExpense(item.id);
        toast.success(`Expense record "${item.invoiceNumber || item.id}" deleted successfully!`);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      const msg = error.response?.data?.message || error.message || `Failed to delete ${itemType}.`;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return itemType === 'category' ? 'Delete Expense Category' : 'Delete Expense Record';
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={getTitle()}
      subtitle="Permanent deletion confirmation"
      icon={WarningIcon}
      iconColor="error.main"
      actions={
        <>
          <Button onClick={onClose} disabled={loading} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            Delete
          </Button>
        </>
      }
    >
      <Typography variant="body1" color="text.secondary" sx={{ py: 1 }}>
        Are you sure you want to delete <strong>{item?.name || item?.invoiceNumber || 'this item'}</strong>? This action cannot be undone.
      </Typography>
    </ResponsiveDialog>
  );
};

export default DeleteExpenseDialog;
