import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
} from '@mui/material';

export const CategoryDetailsDialog = ({ open, onClose, category = null }) => {
  if (!category) return null;

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Category Details - {category.name}
      </DialogTitle>
      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Category Name
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {category.name}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              System ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
              {category.id || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: category.description ? 'text.primary' : 'text.secondary' }}>
              {category.description || 'No description provided.'}
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
              {formatDateTime(category.createdAt || category.created_at)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDateTime(category.updatedAt || category.updated_at)}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDetailsDialog;
