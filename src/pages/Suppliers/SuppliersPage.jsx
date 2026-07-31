import { useState, useEffect, useCallback, useMemo } from 'react';
import { Paper, Box, Button, Grid } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import supplierService from '../../services/supplier.service';
import PageContainer from '../../components/layout/PageContainer';
import SupplierToolbar from './SupplierToolbar';
import SupplierTable from './SupplierTable';
import SupplierCard from './SupplierCard';
import SupplierDialog from './SupplierDialog';
import SupplierDetailsDialog from './SupplierDetailsDialog';
import DeleteSupplierDialog from './DeleteSupplierDialog';
import EmptySupplierState from './EmptySupplierState';
import ErrorState from '../../components/common/ErrorState';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InvoiceUploadDialog from '../Expenses/InvoiceUploadDialog';

export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await supplierService.getSuppliers();
      const list = Array.isArray(res) ? res : res?.data || res?.suppliers || [];
      setSuppliers(list);
    } catch (err) {
      const status = err.response?.status;
      const msg =
        err.response?.data?.message ||
        (status === 400 ? 'Bad Request' :
         status === 401 ? 'Unauthorized Access' :
         status === 403 ? 'Access Forbidden' :
         status === 404 ? 'Suppliers resource not found' :
         status === 409 ? 'Conflict Error' :
         status === 500 ? 'Internal Server Error' : 'Failed to fetch suppliers data');

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered Suppliers by Name, Email, Phone & Status
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((sup) => {
      // 1. Search Filter (Name, Email, Phone)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const nameMatch = sup.name?.toLowerCase().includes(term);
        const emailMatch = sup.email?.toLowerCase().includes(term);
        const phoneMatch = sup.phone?.toLowerCase().includes(term);
        if (!nameMatch && !emailMatch && !phoneMatch) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        const isActive = sup.isActive !== undefined ? sup.isActive : sup.status !== 'INACTIVE';
        if (statusFilter === 'ACTIVE' && !isActive) return false;
        if (statusFilter === 'INACTIVE' && isActive) return false;
      }

      return true;
    });
  }, [suppliers, searchTerm, statusFilter]);

  // Dialog Handlers
  const handleOpenAddDialog = () => {
    setSelectedSupplier(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (supplier) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (supplier) => {
    setSelectedSupplier(supplier);
    setDeleteDialogOpen(true);
  };

  const handleOpenUploadDialog = (supplier = null) => {
    setSelectedSupplier(supplier);
    setUploadDialogOpen(true);
  };

  const handleOpenDetailsDialog = async (supplier) => {
    try {
      const res = await supplierService.getSupplierById(supplier.id || supplier._id);
      const detail = res?.data || res || supplier;
      setSelectedSupplier(detail);
    } catch (err) {
      setSelectedSupplier(supplier);
    }
    setDetailsDialogOpen(true);
  };

  // CRUD Actions
  const handleSaveSupplier = async (formData) => {
    setSubmitting(true);
    try {
      if (selectedSupplier) {
        const id = selectedSupplier.id || selectedSupplier._id;
        await supplierService.updateSupplier(id, formData);
        toast.success(`Supplier "${formData.name}" updated successfully!`);
      } else {
        await supplierService.createSupplier(formData);
        toast.success(`Supplier "${formData.name}" created successfully!`);
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;
    setSubmitting(true);
    try {
      const id = selectedSupplier.id || selectedSupplier._id;
      await supplierService.deleteSupplier(id);
      toast.success(`Supplier "${selectedSupplier.name}" deleted!`);
      setDeleteDialogOpen(false);
      setDetailsDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Delete failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSupplierStatus = async (supplier) => {
    if (!supplier) return;
    setSubmitting(true);
    try {
      const id = supplier.id || supplier._id;
      const currentIsActive = supplier.isActive !== undefined ? supplier.isActive : supplier.status !== 'INACTIVE';
      const newIsActive = !currentIsActive;
      const newStatus = newIsActive ? 'ACTIVE' : 'INACTIVE';

      await supplierService.updateSupplier(id, {
        ...supplier,
        isActive: newIsActive,
        status: newStatus,
      });

      toast.success(
        `Supplier "${supplier.name}" has been ${newIsActive ? 're-activated (OPEN)' : 'closed & deactivated (INACTIVE)'}!`
      );
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Status toggle failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (error && suppliers.length === 0) {
    return (
      <PageContainer title="Supplier Management" breadcrumbs={['Dashboard', 'Suppliers']}>
        <ErrorState
          title="Failed to Load Suppliers"
          description={error}
          onRetry={fetchData}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Supplier Management"
      subtitle="Manage raw food suppliers, contact representatives, GST numbers, and vendor profiles"
      breadcrumbs={['Dashboard', 'Suppliers']}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="info"
            size="small"
            startIcon={<CloudUploadIcon />}
            onClick={() => handleOpenUploadDialog(null)}
            sx={{ fontWeight: 700, borderRadius: 2.5, px: 2 }}
          >
            Upload Invoice OCR
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ fontWeight: 800, borderRadius: 2.5, px: 2.5 }}
          >
            Add Supplier
          </Button>
        </Box>
      }
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3.5,
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        <SupplierToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onRefresh={fetchData}
          loading={loading}
        />

        <Box p={3}>
          {!loading && filteredSuppliers.length === 0 ? (
            <EmptySupplierState onCreateSupplier={handleOpenAddDialog} />
          ) : (
            <SupplierTable
              suppliers={filteredSuppliers}
              loading={loading}
              onView={handleOpenDetailsDialog}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
              onToggleStatus={handleToggleSupplierStatus}
              onUploadInvoice={handleOpenUploadDialog}
            />
          )}
        </Box>
      </Paper>

      {/* Dialog Modals */}
      <SupplierDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveSupplier}
        supplier={selectedSupplier}
        loading={submitting}
      />

      <DeleteSupplierDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteSupplier}
        supplier={selectedSupplier}
        loading={submitting}
      />

      <SupplierDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        supplier={selectedSupplier}
        onToggleStatus={handleToggleSupplierStatus}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
        onUploadInvoice={handleOpenUploadDialog}
      />

      <InvoiceUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSuccess={() => {
          fetchData();
          toast.success('Supplier invoice auto-processed into Invoice OCR and Expenses!');
        }}
      />
    </PageContainer>
  );
};

export default SuppliersPage;
