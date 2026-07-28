import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import { toast } from 'react-toastify';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import inventoryService from '../../services/inventory.service';

export const ProductDialog = ({
  open,
  onClose,
  onSuccess,
  product = null,
  categories = [],
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    unit: 'PCS',
    costPrice: 0,
    sellingPrice: 0,
    minimumStock: 0,
    currentStock: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        categoryId: product.categoryId || (product.category?.id || ''),
        unit: product.unit || 'PCS',
        costPrice: product.costPrice ?? 0,
        sellingPrice: product.sellingPrice ?? 0,
        minimumStock: product.minimumStock ?? 0,
        currentStock: product.currentStock ?? 0,
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        categoryId: categories.length > 0 ? categories[0].id : '',
        unit: 'PCS',
        costPrice: 0,
        sellingPrice: 0,
        minimumStock: 0,
        currentStock: 0,
        isActive: true,
      });
    }
  }, [product, open, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Product name is required.');
      return;
    }
    if (!formData.sku.trim()) {
      toast.error('SKU is required.');
      return;
    }

    const payload = {
      ...formData,
      costPrice: Number(formData.costPrice || 0),
      sellingPrice: Number(formData.sellingPrice || 0),
      minimumStock: Number(formData.minimumStock || 0),
      currentStock: Number(formData.currentStock || 0),
    };

    try {
      setLoading(true);
      if (product && product.id) {
        await inventoryService.updateProduct(product.id, payload);
        toast.success('Product updated successfully!');
      } else {
        await inventoryService.createProduct(payload);
        toast.success('Product created successfully!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save product.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={product ? 'Edit Product' : 'Add New Product'}
      subtitle={product ? 'Update product details and stock threshold' : 'Register a new product in the inventory database'}
      icon={InventoryIcon}
      iconColor="primary.main"
      actions={
        <>
          <Button onClick={onClose} disabled={loading} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2.5} sx={{ py: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g., Premium Coffee Beans"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="SKU Code *"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g., SKU-COF-001"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="product-category-label">Category</InputLabel>
              <Select
                labelId="product-category-label"
                name="categoryId"
                value={formData.categoryId}
                label="Category"
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="product-unit-label">Unit of Measurement</InputLabel>
              <Select
                labelId="product-unit-label"
                name="unit"
                value={formData.unit}
                label="Unit of Measurement"
                onChange={handleChange}
              >
                <MenuItem value="PCS">PCS (Pieces)</MenuItem>
                <MenuItem value="KG">KG (Kilograms)</MenuItem>
                <MenuItem value="GRAM">GRAM (Grams)</MenuItem>
                <MenuItem value="LTR">LTR (Liters)</MenuItem>
                <MenuItem value="ML">ML (Milliliters)</MenuItem>
                <MenuItem value="BOX">BOX (Boxes)</MenuItem>
                <MenuItem value="PACKET">PACKET (Packets)</MenuItem>
                <MenuItem value="BOTTLE">BOTTLE (Bottles)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Cost Price ($)"
              name="costPrice"
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
              value={formData.costPrice}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Selling Price ($)"
              name="sellingPrice"
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
              value={formData.sellingPrice}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Minimum Stock Threshold"
              name="minimumStock"
              type="number"
              inputProps={{ min: 0 }}
              value={formData.minimumStock}
              onChange={handleChange}
              fullWidth
              helperText="Alert when current stock falls below or equal to this level"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Initial Stock Quantity"
              name="currentStock"
              type="number"
              inputProps={{ min: 0 }}
              value={formData.currentStock}
              onChange={handleChange}
              fullWidth
              disabled={Boolean(product)}
              helperText={product ? 'Use Stock In / Stock Out to adjust current stock' : 'Starting stock balance'}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="product-status-label">Status</InputLabel>
              <Select
                labelId="product-status-label"
                name="isActive"
                value={formData.isActive}
                label="Status"
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.value === true || e.target.value === 'true' }))}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </ResponsiveDialog>
  );
};

export default ProductDialog;
