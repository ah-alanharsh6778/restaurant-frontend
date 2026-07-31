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
  Paper,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PaymentsIcon from '@mui/icons-material/Payments';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PurchaseOrderStatusChip from './PurchaseOrderStatusChip';

import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

export const PurchaseOrderDetailsDialog = ({
  open,
  onClose,
  purchaseOrder = null,
  onApprove,
  onReceive,
  onUploadInvoice,
  onRecordPayment,
  onPrint,
  onEdit,
  onDelete,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  if (!purchaseOrder) return null;

  const supplierName = typeof purchaseOrder.supplier === 'object' ? purchaseOrder.supplier?.name : (purchaseOrder.supplierName || 'Unknown Vendor');
  const supplierContact = typeof purchaseOrder.supplier === 'object' && purchaseOrder.supplier?.contactPerson ? ` (${purchaseOrder.supplier.contactPerson})` : '';
  const warehouseName = purchaseOrder.warehouse ? purchaseOrder.warehouse.name : 'Main Warehouse';
  const items = purchaseOrder.purchaseItems || purchaseOrder.items || [];
  const grandTotal = Number(purchaseOrder.grandTotal || purchaseOrder.totalAmount || 0);

  const canApprove = purchaseOrder.status === 'DRAFT' || purchaseOrder.status === 'PENDING';
  const canReceive = purchaseOrder.status !== 'CANCELLED' && purchaseOrder.status !== 'RECEIVED';
  const canModifyItems = purchaseOrder.status !== 'RECEIVED' && purchaseOrder.status !== 'CANCELLED';

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
        {/* Header Summary */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3, flexWrap: 'wrap' }}>
          <Paper
            elevation={2}
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalShippingIcon sx={{ fontSize: 30 }} />
          </Paper>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={800}>
              {purchaseOrder.poNumber}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              <Chip label={`Supplier: ${supplierName}${supplierContact}`} color="primary" size="small" sx={{ fontWeight: 800 }} />
              <PurchaseOrderStatusChip status={purchaseOrder.status} />
              <Chip
                label={`Payment: ${purchaseOrder.paymentStatus || 'PENDING'}`}
                color={purchaseOrder.paymentStatus === 'PAID' ? 'success' : purchaseOrder.paymentStatus === 'PARTIAL' ? 'warning' : 'default'}
                size="small"
                sx={{ fontWeight: 800 }}
              />
            </Box>
          </Box>

          {/* Top area: Only Workflow action buttons — Approve & Receive */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {canApprove && onApprove && (
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => onApprove(purchaseOrder)}
                sx={{ fontWeight: 700 }}
              >
                Approve PO
              </Button>
            )}
            {canReceive && onReceive && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<MoveToInboxIcon />}
                onClick={() => onReceive(purchaseOrder)}
                sx={{ fontWeight: 700 }}
              >
                Receive Goods
              </Button>
            )}
          </Box>
        </Box>

        {/* Info Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ flex: '1 1 160px', minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              SUPPLIER VENDOR
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {supplierName}
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 160px', minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              DESTINATION WAREHOUSE
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {warehouseName}
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 160px', minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              EXPECTED DELIVERY
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {purchaseOrder.expectedDelivery ? new Date(purchaseOrder.expectedDelivery).toLocaleDateString() : 'Not Specified'}
            </Typography>
          </Box>
        </Box>

        {/* Items Table Header & Action */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={800}>
            Line Items ({items.length})
          </Typography>
          {canModifyItems && onAddItem && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => onAddItem(purchaseOrder)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Add Line Item
            </Button>
          )}
        </Box>

        <Paper elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2, mb: 3 }}>
          <Table size="small">
            <TableHead sx={{ background: (theme) => theme.palette.action.hover }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Item Description</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Ordered</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Received</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Unit Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                {canModifyItems && (onEditItem || onDeleteItem) && (
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const name = item.ingredient ? item.ingredient.name : (item.product ? item.product.name : 'Item');
                const unit = item.ingredient ? item.ingredient.unit : (item.product ? item.product.unit : 'unit');

                return (
                  <TableRow key={item.id || item.ingredientId}>
                    <TableCell fontWeight={600}>{name}</TableCell>
                    <TableCell align="center">{item.quantity} {unit}</TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={(item.receivedQuantity || 0) >= item.quantity ? 'success.main' : 'text.primary'}
                      >
                        {item.receivedQuantity || 0} {unit}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">${(item.price || 0).toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>${(item.subtotal || 0).toFixed(2)}</TableCell>
                    {canModifyItems && (onEditItem || onDeleteItem) && (
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          {onEditItem && (
                            <Tooltip title="Edit Item Quantity / Price">
                              <IconButton size="small" color="warning" onClick={() => onEditItem(item, purchaseOrder)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onDeleteItem && items.length > 1 && (
                            <Tooltip title="Remove Item from Purchase Order">
                              <IconButton size="small" color="error" onClick={() => onDeleteItem(item, purchaseOrder)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        {/* Financial Summary */}
        <Paper elevation={0} sx={{ p: 2, background: (theme) => theme.palette.action.hover, borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
            <Typography variant="body2" fontWeight={600}>${(purchaseOrder.subtotal || 0).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">GST / Tax:</Typography>
            <Typography variant="body2" fontWeight={600}>+${(purchaseOrder.gstAmount || 0).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Shipping:</Typography>
            <Typography variant="body2" fontWeight={600}>+${(purchaseOrder.shippingAmount || 0).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Discount:</Typography>
            <Typography variant="body2" fontWeight={600} color="error.main">-${(purchaseOrder.discountAmount || 0).toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight={800}>Grand Total:</Typography>
            <Typography variant="subtitle1" fontWeight={800} color="primary.main">${grandTotal.toFixed(2)}</Typography>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        {/* Left side: Print, Edit, Delete */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {onPrint && (
            <Button
              size="small"
              startIcon={<PrintIcon />}
              onClick={() => onPrint(purchaseOrder)}
              color="inherit"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            >
              Print / PDF
            </Button>
          )}
          {onEdit && purchaseOrder.status !== 'RECEIVED' && purchaseOrder.status !== 'CANCELLED' && (
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => onEdit(purchaseOrder)}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            >
              Edit Order
            </Button>
          )}
          {onDelete && purchaseOrder.status !== 'RECEIVED' && (
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => { onClose(); onDelete(purchaseOrder); }}
              color="error"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            >
              Delete PO
            </Button>
          )}
        </Box>

        {/* Right side: Payment, Close */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {onRecordPayment && (
            <Button
              size="small"
              startIcon={<PaymentsIcon />}
              onClick={() => onRecordPayment(purchaseOrder)}
              color="success"
              variant="contained"
              sx={{ fontWeight: 700 }}
            >
              Record Payment
            </Button>
          )}
          <Button onClick={onClose} variant="outlined" sx={{ px: 3, fontWeight: 800 }}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderDetailsDialog;
