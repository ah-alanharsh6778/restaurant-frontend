import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import TableStatusChip from './TableStatusChip';

export const TableDetailsDialog = ({ open, onClose, table = null }) => {
  if (!table) return null;

  const numberVal = table.tableNumber || table.number || `Table #${table.id}`;

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Table Details - {numberVal}
      </DialogTitle>
      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={2.5}>
          <Grid xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Table Number
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {numberVal}
            </Typography>
          </Grid>

          <Grid xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <TableStatusChip status={table.status} size="medium" />
            </Box>
          </Grid>

          <Grid xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Seating Capacity
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {table.capacity} Guests
            </Typography>
          </Grid>

          <Grid xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              System ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
              {table.id || 'N/A'}
            </Typography>
          </Grid>

          <Grid xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDateTime(table.createdAt || table.created_at)}
            </Typography>
          </Grid>

          <Grid xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDateTime(table.updatedAt || table.updated_at)}
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

export default TableDetailsDialog;
