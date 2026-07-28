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
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import IngredientStatusChip from './IngredientStatusChip';

export const IngredientDetailsDialog = ({ open, onClose, ingredient = null }) => {
  if (!ingredient) return null;

  const qty = Number(ingredient.quantity !== undefined ? ingredient.quantity : 0);
  const min = Number(ingredient.minimumStock !== undefined ? ingredient.minimumStock : (ingredient.minStock || 0));
  const isLowStock = qty <= min;
  const isActive = ingredient.isActive !== undefined ? ingredient.isActive : ingredient.status !== 'INACTIVE';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Ingredient Details
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
              bgcolor: isLowStock ? '#FEE2E2' : 'primary.light',
              color: isLowStock ? 'error.main' : 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RiceBowlIcon sx={{ fontSize: 32 }} />
          </Paper>

          <Box>
            <Typography variant="h5" fontWeight={800}>
              {ingredient.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <IngredientStatusChip
                quantity={qty}
                minimumStock={min}
                isActive={isActive}
                status={ingredient.status}
              />
            </Box>
          </Box>
        </Box>

        {isLowStock && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2.5, fontWeight: 600 }}>
            Low Stock Warning: Current quantity ({qty} {ingredient.unit}) is at or below minimum stock threshold ({min} {ingredient.unit}).
          </Alert>
        )}

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              INGREDIENT NAME
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {ingredient.name}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              UNIT
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {ingredient.unit || '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              AVAILABLE QUANTITY
            </Typography>
            <Typography variant="h6" fontWeight={800} color={isLowStock ? '#EF4444' : 'inherit'}>
              {qty} {ingredient.unit || ''}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              MINIMUM STOCK
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              {min} {ingredient.unit || ''}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              STATUS
            </Typography>
            <Box mt={0.5}>
              <IngredientStatusChip
                quantity={qty}
                minimumStock={min}
                isActive={isActive}
                status={ingredient.status}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              ACTIVE STATUS
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              COST PER UNIT
            </Typography>
            <Typography variant="h6" fontWeight={800} color="primary.main">
              ${Number(ingredient.costPerUnit || 0).toFixed(2)} / {ingredient.unit || 'unit'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CREATED DATE
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {ingredient.createdAt ? new Date(ingredient.createdAt).toLocaleString() : '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              UPDATED DATE
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {ingredient.updatedAt ? new Date(ingredient.updatedAt).toLocaleString() : '—'}
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

export default IngredientDetailsDialog;
