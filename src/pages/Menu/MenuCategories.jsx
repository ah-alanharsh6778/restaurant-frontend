import { useState, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import menuService from '../../services/menu.service';

export const MenuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', description: '' },
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await menuService.getCategories();
      if (res && res.categories) {
        setCategories(res.categories);
      }
    } catch (error) {
      toast.error('Failed to load menu categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      await menuService.createCategory(data);
      toast.success(`Category "${data.name}" created successfully`);
      setOpenModal(false);
      reset();
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to create category');
    }
  };

  const columns = [
    { field: 'name', headerName: 'CATEGORY NAME', renderCell: (row) => <strong>{row.name}</strong> },
    { field: 'description', headerName: 'DESCRIPTION' },
    { field: 'itemCount', headerName: 'TOTAL ITEMS', renderCell: (row) => row.itemCount || row.items?.length || 0 },
  ];

  return (
    <Box>
      <PageHeader
        title="Menu Categories"
        subtitle="Organize dishes into starter, main course, beverage, and dessert categories."
        breadcrumbs={['Menu', 'Categories']}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
            Add Category
          </Button>
        }
      />

      <DataTable
        title="Category Catalog"
        subtitle="Active restaurant menu categories"
        columns={columns}
        data={categories.length > 0 ? categories : [
          { id: '1', name: 'Starters & Appetizers', description: 'Fresh salads, soups, and bite-sized snacks', itemCount: 12 },
          { id: '2', name: 'Main Course', description: 'Chef special entrées, steaks, and pasta', itemCount: 24 },
          { id: '3', name: 'Beverages & Mocktails', description: 'Cold drinks, juices, and hot coffee', itemCount: 18 },
          { id: '4', name: 'Desserts & Sweets', description: 'Cakes, ice creams, and artisanal pastries', itemCount: 9 },
        ]}
        loading={loading}
      />

      <FormDialog open={openModal} title="Add Category" onClose={() => setOpenModal(false)}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Category Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={3}
            label="Description"
            {...register('description')}
          />
          <Box mt={3} display="flex" justifyContent="flex-end" gap={1.5}>
            <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained">Create Category</Button>
          </Box>
        </Box>
      </FormDialog>
    </Box>
  );
};

export default MenuCategories;
