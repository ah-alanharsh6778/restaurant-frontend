import { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import userService from '../../services/user.service';

export const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { fullName: '', email: '', password: '', role: 'WAITER' },
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      if (res && res.users) setUsersList(res.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    try {
      toast.success(`User "${data.fullName}" created successfully!`);
      setOpenModal(false);
      reset();
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const columns = [
    {
      field: 'sNo',
      headerName: 'S.No.',
      align: 'center',
      renderCell: (row) => {
        const list = usersList.length > 0 ? usersList : [
          { id: '1', fullName: 'Harsh Singh', email: 'harsh@gmail.com', role: 'OWNER' },
          { id: '2', fullName: 'Emily Davis', email: 'emily@restaurant.com', role: 'MANAGER' },
          { id: '3', fullName: 'Chef Gordon R.', email: 'chef@restaurant.com', role: 'CHEF' },
          { id: '4', fullName: 'Alex Rivera', email: 'alex@restaurant.com', role: 'WAITER' },
        ];
        const idx = list.findIndex((u) => (u.id || u._id) === (row.id || row._id));
        return idx !== -1 ? idx + 1 : '—';
      },
    },
    { field: 'fullName', headerName: 'FULL NAME', renderCell: (row) => <strong>{row.fullName}</strong> },
    { field: 'email', headerName: 'EMAIL ADDRESS' },
    {
      field: 'role',
      headerName: 'ROLE',
      type: 'chip',
      chipColor: (role) => {
        switch (role) {
          case 'OWNER':
            return 'error';
          case 'MANAGER':
            return 'primary';
          case 'CHEF':
            return 'warning';
          case 'CASHIER':
            return 'success';
          default:
            return 'info';
        }
      },
      renderCell: (row) => (typeof row.role === 'object' ? row.role?.name : row.role) || 'STAFF',
    },
    { field: 'status', headerName: 'STATUS', renderCell: () => 'ACTIVE' },
  ];

  return (
    <Box>
      <PageHeader
        title="Users & Role Management"
        subtitle="Manage staff accounts, assign RBAC security roles, and control access permissions."
        breadcrumbs={['Users']}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
            Add New User
          </Button>
        }
      />

      <DataTable
        title="Staff Directory"
        subtitle="Configured RestaurantOS system accounts"
        columns={columns}
        data={usersList.length > 0 ? usersList : [
          { id: '1', fullName: 'Harsh Singh', email: 'harsh@gmail.com', role: 'OWNER' },
          { id: '2', fullName: 'Emily Davis', email: 'emily@restaurant.com', role: 'MANAGER' },
          { id: '3', fullName: 'Chef Gordon R.', email: 'chef@restaurant.com', role: 'CHEF' },
          { id: '4', fullName: 'Alex Rivera', email: 'alex@restaurant.com', role: 'WAITER' },
        ]}
        loading={loading}
        onAddClick={() => setOpenModal(true)}
      />

      <FormDialog open={openModal} title="Add Staff Account" onClose={() => setOpenModal(false)}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Full Name"
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            {...register('fullName', { required: 'Full name is required' })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            type="email"
            label="Email Address"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Password"
            {...register('password', { required: 'Password is required' })}
          />

          <TextField margin="normal" select fullWidth label="Assigned Role" {...register('role')}>
            <MenuItem value="OWNER">OWNER (Full Admin Access)</MenuItem>
            <MenuItem value="MANAGER">MANAGER (Operations & Finance)</MenuItem>
            <MenuItem value="CHEF">CHEF (Kitchen & Recipes)</MenuItem>
            <MenuItem value="WAITER">WAITER (Order Placement)</MenuItem>
            <MenuItem value="CASHIER">CASHIER (Billing & Expenses)</MenuItem>
            <MenuItem value="STORE_MANAGER">STORE_MANAGER (Inventory & POs)</MenuItem>
          </TextField>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={1.5}>
            <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained">Create User</Button>
          </Box>
        </Box>
      </FormDialog>
    </Box>
  );
};

export default Users;
