import React, { useState, useEffect, useCallback } from 'react';
import { Box, Alert, Button, Typography, IconButton, Fab } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';

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
  const canManageCustomers = ['ADMIN', 'MANAGER', 'STAFF'].includes(userRole.toUpperCase());

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

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleAddClick = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleViewClick = (customer) => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedCustomer?.id) {
        const res = await customerService.update(selectedCustomer.id, formData);
        showToast.success(res?.message || 'Customer updated successfully!');
      } else {
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
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0B0D14',
        color: '#FFFFFF',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ maxWidth: '1440px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Desktop Page Header */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: '32px',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Customer Directory
            </Typography>
            <Typography variant="body1" sx={{ color: '#9CA3AF', fontSize: '15px', mt: 0.5 }}>
              Manage guest profiles, seating assignments, POS orders & loyalty points directly with backend database.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => fetchCustomers(pagination.page, searchTerm)}
              sx={{
                borderRadius: '14px',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                backgroundColor: '#131A24',
                color: '#FFFFFF',
                px: 2.5,
                py: 1,
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 250ms ease',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                },
              }}
            >
              Refresh
            </Button>
            {canManageCustomers && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{
                  borderRadius: '14px',
                  backgroundColor: '#7C6CFF',
                  color: '#FFFFFF',
                  px: 3,
                  py: 1,
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(124, 108, 255, 0.35)',
                  '&:hover': {
                    backgroundColor: '#6854FF',
                  },
                }}
              >
                Add Customer
              </Button>
            )}
          </Box>
        </Box>

        {/* Mobile Page Header (Rendered above prompt on mobile view) */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(124, 108, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PeopleIcon sx={{ color: '#7C6CFF', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '22px', color: '#FFFFFF' }}>
                  Customer Directory
                </Typography>
                <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '13px', display: 'block' }}>
                  {pagination.total || customers.length} Registered Guest Profiles
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={() => fetchCustomers(pagination.page, searchTerm)}
              sx={{
                color: '#FFFFFF',
                backgroundColor: '#131A24',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                p: 1.2,
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Error Banner with Retry Button */}
        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
            }}
            action={
              <Button size="small" variant="contained" color="error" onClick={() => fetchCustomers(1, searchTerm)}>
                Retry
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

        {/* Customer Data Table / Mobile Card Grid */}
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

        {/* Mobile Floating Action Button (FAB) */}
        {canManageCustomers && (
          <Fab
            onClick={handleAddClick}
            aria-label="add customer"
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'fixed',
              bottom: '24px',
              right: '20px',
              zIndex: 1000,
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#7C6CFF',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(124, 108, 255, 0.4)',
              '&:hover': {
                backgroundColor: '#6854FF',
              },
            }}
          >
            <AddIcon sx={{ fontSize: 28 }} />
          </Fab>
        )}

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
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          canManage={['ADMIN', 'MANAGER'].includes(userRole)}
        />

        {/* Soft Delete Confirmation Dialog */}
        <DeleteCustomerDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          customer={selectedCustomer}
          isDeleting={isDeleting}
        />
      </Box>
    </Box>
  );
};

export default CustomersPage;
