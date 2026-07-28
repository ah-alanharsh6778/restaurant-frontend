import React, { useState, useEffect, useCallback } from 'react';
import { Box, Alert, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

import PageContainer from '../../layout/PageContainer';
import customerService from '../../services/customer.service';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../components/ui';

import CustomerToolbar from './CustomerToolbar';
import CustomerTable from './CustomerTable';
import CustomerDialog from './CustomerDialog';
import CustomerDetailsDialog from './CustomerDetailsDialog';
import DeleteCustomerDialog from './DeleteCustomerDialog';

export const CustomersPage = () => {
  const { user } = useAuth();
  const rawRole = user?.role;
  const userRole = typeof rawRole === 'object' && rawRole !== null ? rawRole.name : String(rawRole || 'ADMIN');

  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch real customers from backend API
  const fetchCustomers = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const res = await customerService.getAll({
          page,
          limit: pagination.limit,
          search: search.trim() || undefined,
        });

        if (res?.success) {
          setCustomers(res.data || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        } else {
          setCustomers(Array.isArray(res) ? res : res?.data || []);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err?.message || 'Failed to fetch customer records from backend.');
        showToast.error('Failed to load customers from backend.');
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  useEffect(() => {
    fetchCustomers(1, searchTerm);
  }, [fetchCustomers, searchTerm]);

  // Handle Search Input Change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Open Create Modal
  const handleAddClick = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  // Open Edit Modal
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  // Open Details Modal
  const handleViewClick = (customer) => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  // Open Delete Modal
  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  };

  // Submit Create / Edit Form to real backend API
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedCustomer?.id) {
        // PUT /api/customers/:id
        const res = await customerService.update(selectedCustomer.id, formData);
        showToast.success(res?.message || 'Customer updated successfully!');
      } else {
        // POST /api/customers
        const res = await customerService.create(formData);
        showToast.success(res?.message || 'Customer created successfully!');
      }
      setDialogOpen(false);
      fetchCustomers(pagination.page, searchTerm);
    } catch (err) {
      console.error('Customer Submit Error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Operation failed';
      showToast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete in real backend API
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await customerService.delete(id);
      showToast.success(res?.message || 'Customer removed successfully!');
      setDeleteOpen(false);
      fetchCustomers(pagination.page, searchTerm);
    } catch (err) {
      console.error('Delete Customer Error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete customer';
      showToast.error(msg);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer
      title="Customer Directory"
      subtitle="Manage guest profiles, contact info & loyalty points directly with backend database."
      breadcrumbs={[{ label: 'Executive Dashboard', path: '/dashboard' }, { label: 'Customers' }]}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={() => fetchCustomers(pagination.page, searchTerm)}>
            Refresh
          </Button>
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={handleAddClick} sx={{ fontWeight: 700 }}>
            Add Customer
          </Button>
        </Box>
      }
    >
      {/* Error Banner with Retry Button */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: '16px',
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger)',
            color: 'var(--color-danger)',
          }}
          action={
            <Button size="small" variant="danger" onClick={() => fetchCustomers(1, searchTerm)}>
              Retry Fetching Customers
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Search Toolbar */}
      <CustomerToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      {/* Customer Data Table */}
      <CustomerTable
        customers={customers}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchCustomers(page, searchTerm)}
        onRowsPerPageChange={(limit) => setPagination((prev) => ({ ...prev, limit }))}
        onViewClick={handleViewClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        userRole={userRole}
      />

      {/* Create / Edit Dialog */}
      <CustomerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCustomer}
        isSubmitting={isSubmitting}
      />

      {/* View Profile Details Dialog */}
      <CustomerDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        customer={selectedCustomer}
      />

      {/* Soft Delete Confirmation Dialog */}
      <DeleteCustomerDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        customer={selectedCustomer}
        isDeleting={isDeleting}
      />
    </PageContainer>
  );
};

export default CustomersPage;
