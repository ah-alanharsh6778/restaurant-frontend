import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, CircularProgress, Autocomplete, Alert } from '@mui/material';
import OutboxIcon from '@mui/icons-material/Outbox';
import { toast } from 'react-toastify';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import inventoryService from '../../services/inventory.service';

export const StockOutDialog = ({
  open,
  onClose,
  onSuccess,
  products = [],
  warehouses = [],
  preselectedProduct = null,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (preselectedProduct) {
        setSelectedProduct(preselectedProduct);
      } else {
        setSelectedProduct(products.length > 0 ? products[0] : null);
      }
      setSelectedWarehouse(warehouses.length > 0 ? warehouses[0] : null);
      setQuantity(1);
      setRemarks('');
    }
  }, [open, preselectedProduct, products, warehouses]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error('Product is required.');
      return;
    }
    if (!selectedWarehouse) {
      toast.error('Warehouse is required.');
      return;
    }
    if (Number(quantity) <= 0) {
      toast.error('Quantity must be greater than 0.');
      return;
    }

    const payload = {
      productId: selectedProduct.id,
      warehouseId: selectedWarehouse.id,
      quantity: Number(quantity),
      remarks: remarks.trim() || undefined,
    };

    try {
      setLoading(true);
      await inventoryService.stockOut(payload);
      toast.success(`Successfully removed ${quantity} ${selectedProduct.unit || 'unit(s)'} from stock!`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error performing stock out:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to remove stock.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isQuantityExcessive =
    selectedProduct && Number(quantity) > Number(selectedProduct.currentStock || 0);

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Stock Out"
      subtitle="Deduct inventory items for kitchen usage, sales, or transfers"
      icon={OutboxIcon}
      iconColor="warning.main"
      actions={
        <>
          <Button onClick={onClose} disabled={loading} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="warning"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            Confirm Stock Out
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => `${option.name} (${option.sku}) - Current: ${option.currentStock ?? 0}`}
            value={selectedProduct}
            onChange={(_, newValue) => setSelectedProduct(newValue)}
            renderInput={(params) => <TextField {...params} label="Select Product *" required />}
          />

          <Autocomplete
            options={warehouses}
            getOptionLabel={(option) => `${option.name} ${option.location ? `(${option.location})` : ''}`}
            value={selectedWarehouse}
            onChange={(_, newValue) => setSelectedWarehouse(newValue)}
            renderInput={(params) => <TextField {...params} label="Select Warehouse *" required />}
          />

          <TextField
            label="Deduct Quantity *"
            type="number"
            inputProps={{ min: 1 }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            required
            error={Boolean(isQuantityExcessive)}
            helperText={
              selectedProduct
                ? `Current Stock: ${selectedProduct.currentStock ?? 0} ${selectedProduct.unit || ''}`
                : ''
            }
          />

          {isQuantityExcessive && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Requested quantity ({quantity}) exceeds current available stock ({selectedProduct?.currentStock ?? 0}).
              Backend will validate and return stock shortage if insufficient.
            </Alert>
          )}

          <TextField
            label="Remarks / Reason for Stock Out"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            multiline
            rows={2}
            placeholder="e.g., Kitchen usage, Spoilage, Waste transfer"
          />
        </Box>
      </form>
    </ResponsiveDialog>
  );
};

export default StockOutDialog;
