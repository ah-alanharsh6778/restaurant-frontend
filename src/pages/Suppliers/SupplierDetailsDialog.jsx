import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Grid,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupplierStatusChip from './SupplierStatusChip';

export const SupplierDetailsDialog = ({ open, onClose, supplier = null }) => {
  if (!supplier) return null;

  const isActive = supplier.isActive !== undefined ? supplier.isActive : supplier.status !== 'INACTIVE';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Supplier Profile Specification
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
          <Paper
            elevation={2}
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalShippingIcon sx={{ fontSize: 32 }} />
          </Paper>

          <Box>
            <Typography variant="h5" fontWeight={800}>
              {supplier.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <SupplierStatusChip isActive={isActive} status={supplier.status} />
              {supplier.gstNumber && (
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  GST: {supplier.gstNumber}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              SUPPLIER NAME
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {supplier.name}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CONTACT PERSON
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {supplier.contactPerson || '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              EMAIL ADDRESS
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary">
              {supplier.email || '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              PHONE NUMBER
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {supplier.phone || '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              GST NUMBER
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {supplier.gstNumber || 'N/A'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              STATUS
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <SupplierStatusChip isActive={isActive} status={supplier.status} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              ADDRESS
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {supplier.address || 'No physical address provided.'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CREATED DATE
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {supplier.createdAt ? new Date(supplier.createdAt).toLocaleString() : '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              LAST UPDATED
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {supplier.updatedAt ? new Date(supplier.updatedAt).toLocaleString() : '—'}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained" sx={{ px: 3, fontWeight: 800 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierDetailsDialog;
