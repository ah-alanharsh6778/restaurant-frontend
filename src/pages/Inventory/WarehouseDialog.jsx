import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, CircularProgress } from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { toast } from 'react-toastify';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import inventoryService from '../../services/inventory.service';

export const WarehouseDialog = ({ open, onClose, onSuccess, warehouse = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    manager: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name || '',
        location: warehouse.location || '',
        manager: warehouse.manager || '',
      });
    } else {
      setFormData({
        name: '',
        location: '',
        manager: '',
      });
    }
  }, [warehouse, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Warehouse name is required.');
      return;
    }

    try {
      setLoading(true);
      if (warehouse && warehouse.id) {
        await inventoryService.updateWarehouse(warehouse.id, formData);
        toast.success('Warehouse updated successfully!');
      } else {
        await inventoryService.createWarehouse(formData);
        toast.success('Warehouse created successfully!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving warehouse:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save warehouse.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title={warehouse ? 'Edit Warehouse' : 'Create Warehouse'}
      subtitle={warehouse ? 'Update warehouse location details' : 'Register a new warehouse storage facility'}
      icon={WarehouseIcon}
      iconColor="info.main"
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
            {warehouse ? 'Update Warehouse' : 'Create Warehouse'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
          <TextField
            label="Warehouse Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            placeholder="e.g., Main Storage, Kitchen Pantry"
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., Building A, Sector 4"
          />
          <TextField
            label="Manager / Contact"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., John Doe"
          />
        </Box>
      </form>
    </ResponsiveDialog>
  );
};

export default WarehouseDialog;
