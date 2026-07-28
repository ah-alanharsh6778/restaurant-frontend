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
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import LowStockChip from './LowStockChip';

export const ProductDetailsDialog = ({
  open,
  onClose,
  product = null,
  onOpenEdit,
  onOpenStockIn,
  onOpenStockOut,
}) => {
  if (!product) return null;

  const createdDateStr = product.createdAt
    ? dayjs(product.createdAt).format('MMM DD, YYYY hh:mm A')
    : 'N/A';

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Product Details"
      subtitle="Complete specification and stock parameters"
      icon={VisibilityIcon}
      iconColor="info.main"
      actions={
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<MoveToInboxIcon />}
              onClick={() => {
                onClose();
                onOpenStockIn(product);
              }}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Stock In
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              startIcon={<OutboxIcon />}
              onClick={() => {
                onClose();
                onOpenStockOut(product);
              }}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Stock Out
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => {
                onClose();
                onOpenEdit(product);
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
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
            SKU: {product.sku || 'N/A'}
          </Typography>
        </Box>
        <LowStockChip currentStock={product.currentStock} minimumStock={product.minimumStock} />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Category
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {product.category?.name || 'Uncategorized'}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Unit of Measure
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {product.unit || 'PCS'}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Current Stock Level
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5 }}>
              {product.currentStock ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Minimum Stock Level
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main', mt: 0.5 }}>
              {product.minimumStock ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Cost Price
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            ${Number(product.costPrice || 0).toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Selling Price
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
            ${Number(product.sellingPrice || 0).toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Status
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: product.isActive !== false ? 'success.main' : 'error.main' }}>
            {product.isActive !== false ? 'Active' : 'Inactive'}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Created Date
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {createdDateStr}
          </Typography>
        </Grid>
      </Grid>
    </ResponsiveDialog>
  );
};

export default ProductDetailsDialog;
