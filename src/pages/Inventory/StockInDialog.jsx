import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, CircularProgress, Autocomplete } from '@mui/material';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { toast } from 'react-toastify';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import inventoryService from '../../services/inventory.service';

export const StockInDialog = ({
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
      await inventoryService.stockIn(payload);
      toast.success(`Successfully added ${quantity} ${selectedProduct.unit || 'unit(s)'} to stock!`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error performing stock in:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to add stock.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Stock In"
      subtitle="Receive and record incoming inventory stock"
      icon={MoveToInboxIcon}
      iconColor="success.main"
      actions={
        <>
          <Button onClick={onClose} disabled={loading} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="success"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            Confirm Stock In
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
            label="Stock Quantity *"
            type="number"
            inputProps={{ min: 1 }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            required
            helperText={
              selectedProduct
                ? `Current Stock: ${selectedProduct.currentStock ?? 0} ${selectedProduct.unit || ''}`
                : ''
            }
          />

          <TextField
            label="Remarks / Notes"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            multiline
            rows={2}
            placeholder="e.g., Supplier shipment #PO-104"
          />
        </Box>
      </form>
    </ResponsiveDialog>
  );
};

export default StockInDialog;
