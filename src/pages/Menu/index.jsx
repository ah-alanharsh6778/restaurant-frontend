import { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import menuService from '../../services/menu.service';

export const Menu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { name: '', price: '', categoryId: '', isAvailable: true, description: '' },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catRes] = await Promise.allSettled([
        menuService.getAllItems(),
        menuService.getCategories(),
      ]);

      if (itemsRes.status === 'fulfilled' && itemsRes.value?.items) {
        setItems(itemsRes.value.items);
      }
      if (catRes.status === 'fulfilled' && catRes.value?.categories) {
        setCategories(catRes.value.categories);
      }
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    reset({ name: '', price: '', categoryId: categories[0]?.id || '', isAvailable: true, description: '' });
    setOpenModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setValue('name', item.name);
    setValue('price', item.price);
    setValue('categoryId', item.categoryId || item.category?.id || '');
    setValue('isAvailable', item.isAvailable ?? true);
    setValue('description', item.description || '');
    setOpenModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingItem) {
        await menuService.updateItem(editingItem.id || editingItem._id, data);
        toast.success(`Updated "${data.name}"`);
      } else {
        await menuService.createItem(data);
        toast.success(`Created "${data.name}"`);
      }
      setOpenModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await menuService.deleteItem(deleteId);
      toast.success('Menu item deleted');
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete item');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: 'DISH NAME', renderCell: (row) => <strong>{row.name}</strong> },
    { field: 'category', headerName: 'CATEGORY', renderCell: (row) => row.category?.name || row.categoryName || 'Main Course' },
    { field: 'price', headerName: 'PRICE', renderCell: (row) => `$${Number(row.price || 0).toFixed(2)}` },
    {
      field: 'isAvailable',
      headerName: 'AVAILABILITY',
      type: 'chip',
      chipColor: (val) => (val ? 'success' : 'error'),
      renderCell: (row) => (row.isAvailable ?? true ? 'Available' : 'Out of Stock'),
    },
  ];

  const actions = [
    { label: 'Edit Item', icon: <EditIcon fontSize="small" />, onClick: handleOpenEdit },
    { label: 'Delete Item', icon: <DeleteIcon fontSize="small" />, onClick: (row) => setDeleteId(row.id || row._id), color: 'error.main' },
  ];

  return (
    <Box>
      <PageHeader
        title="Menu Items Catalog"
        subtitle="Manage dish offerings, pricing, categories, and real-time availability."
        breadcrumbs={['Menu', 'Items']}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Add Menu Item
          </Button>
        }
      />

      <DataTable
        title="Restaurant Menu Items"
        subtitle="All dishes currently configured"
        columns={columns}
        data={items.length > 0 ? items : [
          { id: '1', name: 'Truffle Mushroom Pasta', categoryName: 'Main Course', price: 24.50, isAvailable: true },
          { id: '2', name: 'Grilled Salmon Steak', categoryName: 'Main Course', price: 28.00, isAvailable: true },
          { id: '3', name: 'Caesar Salad Supreme', categoryName: 'Starters & Appetizers', price: 14.20, isAvailable: true },
          { id: '4', name: 'Artisanal Chocolate Mousse', categoryName: 'Desserts & Sweets', price: 9.50, isAvailable: false },
        ]}
        loading={loading}
        onAddClick={handleOpenCreate}
        actions={actions}
      />

      <FormDialog open={openModal} title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'} onClose={() => setOpenModal(false)}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Dish Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            inputProps={{ step: '0.01' }}
            label="Price ($)"
            error={!!errors.price}
            helperText={errors.price?.message}
            {...register('price', { required: 'Price is required', min: 0 })}
          />

          {categories.length > 0 && (
            <TextField margin="normal" select fullWidth label="Category" {...register('categoryId')}>
              {categories.map((c) => (
                <MenuItem key={c.id || c._id} value={c.id || c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField margin="normal" fullWidth multiline rows={2} label="Description" {...register('description')} />

          <FormControlLabel
            control={<Switch defaultChecked {...register('isAvailable')} color="primary" />}
            label="Available for Ordering"
            sx={{ mt: 1, display: 'block' }}
          />

          <Box mt={3} display="flex" justifyContent="flex-end" gap={1.5}>
            <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained">Save Item</Button>
          </Box>
        </Box>
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item from your restaurant menu?"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />
    </Box>
  );
};

export default Menu;
