import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Box,
  Divider,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const MenuItemDetailsDialog = ({ open, onClose, menuItem = null, onEdit, onDelete }) => {
  if (!menuItem) return null;

  const isAvail = Boolean(menuItem.isAvailable ?? menuItem.available);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  const formatPrice = (val) => {
    const num = Number(val) || 0;
    return `₹${num.toFixed(2)}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Menu Item Details - {menuItem.name}
      </DialogTitle>
      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Item Name
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {menuItem.name}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Category
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={menuItem.category?.name || 'Uncategorized'}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Price
            </Typography>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
              {formatPrice(menuItem.price)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Availability Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={isAvail ? 'Available' : 'Unavailable'}
                color={isAvail ? 'success' : 'error'}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: menuItem.description ? 'text.primary' : 'text.secondary' }}>
              {menuItem.description || 'No description provided.'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDateTime(menuItem.createdAt || menuItem.created_at)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDateTime(menuItem.updatedAt || menuItem.updated_at)}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {onEdit && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => {
              onClose();
              onEdit(menuItem);
            }}
            sx={{ borderRadius: 2 }}
          >
            Edit Item
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => {
              onClose();
              onDelete(menuItem);
            }}
            sx={{ borderRadius: 2 }}
          >
            Delete Item
          </Button>
        )}
        <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuItemDetailsDialog;
