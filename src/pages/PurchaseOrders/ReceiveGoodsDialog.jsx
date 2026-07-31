import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  TextField,
  Autocomplete,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';

export const ReceiveGoodsDialog = ({
  open,
  onClose,
  onSubmit,
  purchaseOrder = null,
  warehouses = [],
  loading = false,
}) => {
  const [targetWarehouse, setTargetWarehouse] = useState(null);
  const [receivedQtyMap, setReceivedQtyMap] = useState({});

  useEffect(() => {
    if (open && purchaseOrder) {
      const defaultWh = warehouses.find((w) => w.id === purchaseOrder.warehouseId) || warehouses[0] || null;
      setTargetWarehouse(defaultWh);

      const initialQtyMap = {};
      (purchaseOrder.purchaseItems || []).forEach((item) => {
        const remainingToReceive = Math.max(0, (item.quantity || 0) - (item.receivedQuantity || 0));
        initialQtyMap[item.id] = remainingToReceive;
      });
      setReceivedQtyMap(initialQtyMap);
    }
  }, [open, purchaseOrder, warehouses]);

  const handleQtyChange = (itemId, val) => {
    setReceivedQtyMap((prev) => ({
      ...prev,
      [itemId]: parseFloat(val) || 0,
    }));
  };

  const handleFormSubmit = () => {
    if (!targetWarehouse || !purchaseOrder) return;

    const receivedItems = Object.entries(receivedQtyMap)
      .map(([itemId, receivedQty]) => ({
        itemId,
        receivedQty: Number(receivedQty),
      }))
      .filter((i) => i.receivedQty > 0);

    if (receivedItems.length === 0) return;

    onSubmit({
      warehouseId: targetWarehouse.id || targetWarehouse._id,
      receivedItems,
    });
  };

  if (!purchaseOrder) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { elevation: 5, sx: { borderRadius: 3.5 } } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
        <MoveToInboxIcon color="primary" />
        Receive Goods & Stock Inbound ({purchaseOrder.poNumber})
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Warehouse Selection */}
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            options={warehouses}
            getOptionLabel={(option) => (option ? `${option.name} (${option.location || 'Main'})` : '')}
            value={targetWarehouse}
            onChange={(_, newValue) => setTargetWarehouse(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Receiving Warehouse Destination"
                placeholder="Select inventory warehouse..."
                helperText="Received stock will be automatically incremented in this warehouse"
              />
            )}
          />
        </Box>

        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
          Line Items Inbound Receiving
        </Typography>

        <Paper elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <Table size="small">
            <TableHead sx={{ background: (theme) => theme.palette.action.hover }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Ordered</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Previously Received</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Receiving Now</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(purchaseOrder.purchaseItems || []).map((item) => {
                const itemName = item.ingredient ? item.ingredient.name : (item.product ? item.product.name : 'Item');
                const unit = item.ingredient ? item.ingredient.unit : (item.product ? item.product.unit : 'unit');

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {itemName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${(item.price || 0).toFixed(2)} / {unit}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {item.quantity} {unit}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={(item.receivedQuantity || 0) >= item.quantity ? 'success.main' : 'warning.main'}
                      >
                        {item.receivedQuantity || 0} {unit}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ width: 140 }}>
                      <TextField
                        size="small"
                        type="number"
                        slotProps={{ htmlInput: { min: 0, max: item.quantity, step: 'any' } }}
                        value={receivedQtyMap[item.id] !== undefined ? receivedQtyMap[item.id] : 0}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          color="success"
          disabled={loading || !targetWarehouse}
          sx={{ px: 3, fontWeight: 800 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Stock Receipt'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiveGoodsDialog;
