import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export const MenuDetailsDialog = ({ open, onClose, item = null }) => {
  if (!item) return null;

  const isAvailable = item.isAvailable !== false;
  const categoryName = typeof item.category === 'object' ? item.category?.name : (item.categoryName || 'General');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Menu Item Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2.5} mb={3}>
          <Paper
            elevation={2}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 3,
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 40 }} />
          </Paper>

          <Box>
            <Typography variant="h5" fontWeight={800}>
              {item.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Chip label={categoryName} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
              <Chip
                label={isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                size="small"
                color={isAvailable ? 'success' : 'error'}
                sx={{ fontWeight: 800 }}
              />
            </Box>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'action.hover', borderRadius: 3, mb: 3 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
            Description / Dish Ingredients
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
            {item.description || 'No detailed description provided for this menu item.'}
          </Typography>
        </Paper>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              PRICE PER ITEM
            </Typography>
            <Typography variant="h6" fontWeight={800} color="primary.main">
              ${Number(item.price || 0).toFixed(2)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              STATUS
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {isAvailable ? 'Active POS Item' : 'Out of Stock / Inactive'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CREATED DATE
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              LAST UPDATED
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—'}
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

export default MenuDetailsDialog;
