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
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddIcon from '@mui/icons-material/Add';
import PurchaseOrderStatusChip from './PurchaseOrderStatusChip';
import PurchaseOrderItemsTable from './PurchaseOrderItemsTable';

export const PurchaseOrderDetailsDialog = ({
  open,
  onClose,
  purchaseOrder = null,
  onAddItemClick,
  onRemoveItemClick,
}) => {
  if (!purchaseOrder) return null;

  const supplierName = typeof purchaseOrder.supplier === 'object' ? purchaseOrder.supplier?.name : (purchaseOrder.supplierName || 'Unknown Vendor');
  const supplierContact = typeof purchaseOrder.supplier === 'object' && purchaseOrder.supplier?.contactPerson ? ` (${purchaseOrder.supplier.contactPerson})` : '';
  const items = purchaseOrder.purchaseItems || purchaseOrder.items || [];
  const totalAmount = Number(purchaseOrder.totalAmount || 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800 }}>
        Purchase Order Specification
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
              {purchaseOrder.poNumber}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={`Supplier: ${supplierName}${supplierContact}`}
                color="primary"
                size="small"
                sx={{ fontWeight: 800 }}
              />
              <PurchaseOrderStatusChip status={purchaseOrder.status} />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              PURCHASE ORDER NUMBER
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {purchaseOrder.poNumber}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              SUPPLIER VENDOR
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {supplierName}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CREATED DATE
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {purchaseOrder.createdAt ? new Date(purchaseOrder.createdAt).toLocaleString() : '—'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              LAST UPDATED
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {purchaseOrder.updatedAt ? new Date(purchaseOrder.updatedAt).toLocaleString() : '—'}
            </Typography>
          </Grid>
        </Grid>

        {/* Items Sub-Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            Purchase Order Items ({items.length})
          </Typography>

          {onAddItemClick && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => onAddItemClick(purchaseOrder)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Add Item
            </Button>
          )}
        </Box>

        <PurchaseOrderItemsTable
          purchaseItems={items}
          onRemoveItem={onRemoveItemClick}
        />

        <Divider sx={{ my: 3 }} />

        {/* Backend Calculated Totals */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '100%', sm: 280 } }}>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              Subtotal:
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              ${totalAmount.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '100%', sm: 280 } }}>
            <Typography variant="h6" fontWeight={800} color="primary">
              Total PO Amount:
            </Typography>
            <Typography variant="h6" fontWeight={800} color="primary">
              ${totalAmount.toFixed(2)}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            * Totals strictly returned from backend server API
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained" sx={{ px: 3, fontWeight: 800 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderDetailsDialog;
