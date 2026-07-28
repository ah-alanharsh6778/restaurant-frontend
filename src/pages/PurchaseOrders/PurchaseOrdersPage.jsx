import { useState, useEffect, useCallback, useMemo } from 'react';
import { Paper, Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import purchaseOrderService from '../../services/purchaseOrder.service';
import supplierService from '../../services/supplier.service';
import ingredientService from '../../services/ingredient.service';
import PageContainer from '../../components/layout/PageContainer';
import PurchaseOrderSummaryCard from './PurchaseOrderSummaryCard';
import PurchaseOrderToolbar from './PurchaseOrderToolbar';
import PurchaseOrderTable from './PurchaseOrderTable';
import PurchaseOrderDialog from './PurchaseOrderDialog';
import PurchaseOrderStatusDialog from './PurchaseOrderStatusDialog';
import PurchaseOrderDetailsDialog from './PurchaseOrderDetailsDialog';
import PurchaseOrderItemDialog from './PurchaseOrderItemDialog';
import DeletePurchaseOrderDialog from './DeletePurchaseOrderDialog';
import DeletePurchaseOrderItemDialog from './DeletePurchaseOrderItemDialog';
import EmptyPurchaseOrderState from './EmptyPurchaseOrderState';
import ErrorState from '../../components/common/ErrorState';

export const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [supplierFilter, setSupplierFilter] = useState('ALL');

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);

  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedPOItem, setSelectedPOItem] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [poRes, supRes, ingRes] = await Promise.all([
        purchaseOrderService.getPurchaseOrders(),
        supplierService.getSuppliers ? supplierService.getSuppliers() : supplierService.getAll(),
        ingredientService.getIngredients ? ingredientService.getIngredients() : ingredientService.getAll(),
      ]);

      const poList = Array.isArray(poRes) ? poRes : poRes?.data || poRes?.purchaseOrders || [];
      const sList = Array.isArray(supRes) ? supRes : supRes?.data || supRes?.suppliers || [];
      const iList = Array.isArray(ingRes) ? ingRes : ingRes?.data || ingRes?.ingredients || [];

      setPurchaseOrders(poList);
      setSuppliers(sList);
      setIngredientsList(iList);
    } catch (err) {
      const status = err.response?.status;
      const msg =
        err.response?.data?.message ||
        (status === 400 ? 'Bad Request' :
         status === 401 ? 'Unauthorized Access' :
         status === 403 ? 'Access Forbidden' :
         status === 404 ? 'Purchase Orders resource not found' :
         status === 409 ? 'Conflict Error' :
         status === 500 ? 'Internal Server Error' : 'Failed to fetch purchase orders data');

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered Purchase Orders
  const filteredPurchaseOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      // 1. Search Filter (PO Number or Supplier Name)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const poMatch = po.poNumber?.toLowerCase().includes(term);
        const supName = typeof po.supplier === 'object' ? po.supplier?.name : (po.supplierName || '');
        const supMatch = supName.toLowerCase().includes(term);
        if (!poMatch && !supMatch) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        if (String(po.status).toUpperCase() !== statusFilter) return false;
      }

      // 3. Supplier Filter
      if (supplierFilter !== 'ALL') {
        const poSupId = typeof po.supplier === 'object' ? po.supplier?.id : po.supplierId;
        if (poSupId !== supplierFilter) return false;
      }

      return true;
    });
  }, [purchaseOrders, searchTerm, statusFilter, supplierFilter]);

  // Dialog Handlers
  const handleOpenCreateDialog = () => {
    setSelectedPO(null);
    setCreateDialogOpen(true);
  };

  const handleOpenStatusDialog = (po) => {
    setSelectedPO(po);
    setStatusDialogOpen(true);
  };

  const handleOpenDeleteDialog = (po) => {
    setSelectedPO(po);
    setDeleteDialogOpen(true);
  };

  const handleOpenDetailsDialog = async (po) => {
    try {
      const res = await purchaseOrderService.getPurchaseOrderById(po.id || po._id);
      const detail = res?.data || res || po;
      setSelectedPO(detail);
    } catch (err) {
      setSelectedPO(po);
    }
    setDetailsDialogOpen(true);
  };

  const handleOpenAddItemDialog = (po) => {
    setSelectedPO(po);
    setAddItemDialogOpen(true);
  };

  const handleOpenRemoveItemDialog = (item) => {
    setSelectedPOItem(item);
    setDeleteItemDialogOpen(true);
  };

  // CRUD Actions
  const handleCreatePO = async (poPayload) => {
    setSubmitting(true);
    try {
      const res = await purchaseOrderService.createPurchaseOrder(poPayload);
      const created = res?.data || res;
      toast.success(`Purchase Order ${created?.poNumber || ''} created successfully!`);
      setCreateDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create purchase order';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (statusPayload) => {
    if (!selectedPO) return;
    setSubmitting(true);
    try {
      const id = selectedPO.id || selectedPO._id;
      await purchaseOrderService.updatePurchaseOrder(id, statusPayload);
      toast.success(`PO status updated to ${statusPayload.status}!`);
      setStatusDialogOpen(false);

      if (detailsDialogOpen) {
        const res = await purchaseOrderService.getPurchaseOrderById(id);
        if (res?.data) setSelectedPO(res.data);
      }

      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update PO status';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePO = async () => {
    if (!selectedPO) return;
    setSubmitting(true);
    try {
      const id = selectedPO.id || selectedPO._id;
      await purchaseOrderService.deletePurchaseOrder(id);
      toast.success(`Purchase Order ${selectedPO.poNumber} deleted!`);
      setDeleteDialogOpen(false);
      setDetailsDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Delete PO failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPOItem = async (itemPayload) => {
    if (!selectedPO) return;
    setSubmitting(true);
    try {
      const payload = {
        purchaseOrderId: selectedPO.id || selectedPO._id,
        ingredientId: itemPayload.ingredientId,
        quantity: itemPayload.quantity,
        price: itemPayload.price,
      };
      await purchaseOrderService.addPurchaseOrderItem(payload);
      toast.success('Item added to purchase order!');
      setAddItemDialogOpen(false);

      // Refresh current PO details
      const res = await purchaseOrderService.getPurchaseOrderById(selectedPO.id || selectedPO._id);
      const updated = res?.data || res;
      if (updated) setSelectedPO(updated);

      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to add item to PO';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePOItem = async () => {
    if (!selectedPOItem) return;
    setSubmitting(true);
    try {
      const id = selectedPOItem.id || selectedPOItem._id;
      await purchaseOrderService.deletePurchaseOrderItem(id);
      toast.success('Item removed from purchase order!');
      setDeleteItemDialogOpen(false);

      if (selectedPO) {
        const res = await purchaseOrderService.getPurchaseOrderById(selectedPO.id || selectedPO._id);
        const updated = res?.data || res;
        if (updated) setSelectedPO(updated);
      }

      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove item from PO';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (error && purchaseOrders.length === 0) {
    return (
      <PageContainer title="Purchase Order Management" breadcrumbs={['Dashboard', 'Purchase Orders']}>
        <ErrorState
          title="Failed to Load Purchase Orders"
          description={error}
          onRetry={fetchData}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Purchase Order Management"
      breadcrumbs={['Dashboard', 'Purchase Orders']}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
            Refresh
          </Button>
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog} sx={{ fontWeight: 700 }}>
            Create Purchase Order
          </Button>
        </Box>
      }
    >
      {/* Metrics Summary Header */}
      <PurchaseOrderSummaryCard purchaseOrders={purchaseOrders} />

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3.5,
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        <PurchaseOrderToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          supplierFilter={supplierFilter}
          onSupplierFilterChange={setSupplierFilter}
          availableSuppliers={suppliers}
          onRefresh={fetchData}
          onAddClick={handleOpenCreateDialog}
          loading={loading}
        />

        <Box p={3}>
          {!loading && filteredPurchaseOrders.length === 0 ? (
            <EmptyPurchaseOrderState onCreatePO={handleOpenCreateDialog} />
          ) : (
            <PurchaseOrderTable
              purchaseOrders={filteredPurchaseOrders}
              loading={loading}
              onView={handleOpenDetailsDialog}
              onEditStatus={handleOpenStatusDialog}
              onDelete={handleOpenDeleteDialog}
              onAddItem={handleOpenAddItemDialog}
            />
          )}
        </Box>
      </Paper>

      {/* Dialog Modals */}
      <PurchaseOrderDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreatePO}
        suppliers={suppliers}
        ingredientsList={ingredientsList}
        loading={submitting}
      />

      <PurchaseOrderStatusDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onSubmit={handleUpdateStatus}
        purchaseOrder={selectedPO}
        loading={submitting}
      />

      <PurchaseOrderDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        purchaseOrder={selectedPO}
        onAddItemClick={handleOpenAddItemDialog}
        onRemoveItemClick={handleOpenRemoveItemDialog}
      />

      <PurchaseOrderItemDialog
        open={addItemDialogOpen}
        onClose={() => setAddItemDialogOpen(false)}
        onSubmit={handleAddPOItem}
        ingredientsList={ingredientsList}
        loading={submitting}
      />

      <DeletePurchaseOrderDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeletePO}
        purchaseOrder={selectedPO}
        loading={submitting}
      />

      <DeletePurchaseOrderItemDialog
        open={deleteItemDialogOpen}
        onClose={() => setDeleteItemDialogOpen(false)}
        onConfirm={handleDeletePOItem}
        purchaseOrderItem={selectedPOItem}
        loading={submitting}
      />
    </PageContainer>
  );
};

export default PurchaseOrdersPage;
