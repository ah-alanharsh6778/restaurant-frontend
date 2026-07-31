import { useState, useEffect, useCallback, useMemo } from 'react';
import { Paper, Box, Grid, Button, IconButton, Fab, useTheme, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { toast } from 'react-toastify';
import purchaseOrderService from '../../services/purchaseOrder.service';
import supplierService from '../../services/supplier.service';
import ingredientService from '../../services/ingredient.service';
import inventoryService from '../../services/inventory.service';
import PageContainer from '../../components/layout/PageContainer';
import PurchaseOrderSummaryCard from './PurchaseOrderSummaryCard';
import PurchaseOrderToolbar from './PurchaseOrderToolbar';
import PurchaseOrderTable from './PurchaseOrderTable';
import PurchaseOrderCard from './PurchaseOrderCard';
import PurchaseOrderDialog from './PurchaseOrderDialog';
import PurchaseOrderStatusDialog from './PurchaseOrderStatusDialog';
import PurchaseOrderDetailsDialog from './PurchaseOrderDetailsDialog';
import PurchaseOrderItemDialog from './PurchaseOrderItemDialog';
import DeletePurchaseOrderItemDialog from './DeletePurchaseOrderItemDialog';
import ReceiveGoodsDialog from './ReceiveGoodsDialog';
import PaymentDialog from './PaymentDialog';
import SupplierInvoiceUploadDialog from './SupplierInvoiceUploadDialog';
import PrintPurchaseOrderDialog from './PrintPurchaseOrderDialog';
import DeletePurchaseOrderDialog from './DeletePurchaseOrderDialog';
import EmptyPurchaseOrderState from './EmptyPurchaseOrderState';
import ErrorState from '../../components/common/ErrorState';
import MobilePurchaseOrderFilterDrawer from './MobilePurchaseOrderFilterDrawer';

export const PurchaseOrdersPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('list');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [uploadInvoiceDialogOpen, setUploadInvoiceDialogOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [poRes, supRes, ingRes, whRes] = await Promise.all([
        purchaseOrderService.getPurchaseOrders(),
        supplierService.getSuppliers ? supplierService.getSuppliers() : supplierService.getAll(),
        ingredientService.getIngredients ? ingredientService.getIngredients() : ingredientService.getAll(),
        inventoryService.getWarehouses ? inventoryService.getWarehouses() : Promise.resolve([]),
      ]);

      const poList = Array.isArray(poRes) ? poRes : poRes?.data || poRes?.purchaseOrders || [];
      const sList = Array.isArray(supRes) ? supRes : supRes?.data || supRes?.suppliers || [];
      const iList = Array.isArray(ingRes) ? ingRes : ingRes?.data || ingRes?.ingredients || [];
      const wList = Array.isArray(whRes) ? whRes : whRes?.data || whRes?.warehouses || [];

      setPurchaseOrders(poList);
      setSuppliers(sList);
      setIngredientsList(iList);
      setWarehouses(wList);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch purchase orders data';
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
        const supId = typeof po.supplier === 'object' ? (po.supplier?.id || po.supplier?._id) : po.supplierId;
        if (String(supId) !== String(supplierFilter)) return false;
      }

      return true;
    });
  }, [purchaseOrders, searchTerm, statusFilter, supplierFilter]);

  // Dialog Handlers
  const handleOpenCreateDialog = () => {
    setSelectedPO(null);
    setCreateDialogOpen(true);
  };

  const handleOpenEditDialog = async (po) => {
    // Always fetch full detail (includes purchaseItems with ingredient) before editing
    try {
      const id = po.id || po._id;
      const detail = await purchaseOrderService.getPurchaseOrderById(id);
      setSelectedPO(detail?.data || detail || po);
    } catch (err) {
      setSelectedPO(po);
    }
    setDetailsDialogOpen(false);
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
      const id = po.id || po._id;
      const detail = await purchaseOrderService.getPurchaseOrderById(id);
      setSelectedPO(detail?.data || detail || po);
    } catch (err) {
      setSelectedPO(po);
    }
    setDetailsDialogOpen(true);
  };

  const handleOpenReceiveDialog = (po) => {
    setSelectedPO(po);
    setReceiveDialogOpen(true);
  };

  const handleOpenPaymentDialog = (po) => {
    setSelectedPO(po);
    setPaymentDialogOpen(true);
  };

  const handleOpenUploadInvoiceDialog = (po) => {
    setSelectedPO(po);
    setUploadInvoiceDialogOpen(true);
  };

  const handleOpenPrintDialog = (po) => {
    setSelectedPO(po);
    setPrintDialogOpen(true);
  };

  const handleOpenAddItemDialog = (po) => {
    setSelectedPO(po);
    setSelectedItem(null);
    setItemDialogOpen(true);
  };

  const handleOpenEditItemDialog = (item, po) => {
    setSelectedPO(po);
    setSelectedItem(item);
    setItemDialogOpen(true);
  };

  const handleOpenDeleteItemDialog = (item, po) => {
    setSelectedPO(po);
    setSelectedItem(item);
    setDeleteItemDialogOpen(true);
  };

  const handleSavePOItem = async (itemPayload) => {
    if (!selectedPO) return;
    setSubmitting(true);
    try {
      const poId = selectedPO.id || selectedPO._id;
      const currentItems = (selectedPO.purchaseItems || selectedPO.items || []).map((it) => ({
        ingredientId: it.ingredientId || it.ingredient?.id || it.ingredient?._id,
        productId: it.productId || it.product?.id || it.product?._id,
        quantity: Number(it.quantity),
        price: Number(it.price),
      }));

      let updatedItems = [];
      const editingIngId = itemPayload.ingredientId;

      if (selectedItem) {
        // Edit existing item in PO
        const targetIngId = selectedItem.ingredientId || selectedItem.ingredient?.id || selectedItem.ingredient?._id;
        updatedItems = currentItems.map((it) => {
          if (String(it.ingredientId) === String(targetIngId)) {
            return { ...it, quantity: itemPayload.quantity, price: itemPayload.price };
          }
          return it;
        });
      } else {
        // Add new item to PO
        const existingIdx = currentItems.findIndex((it) => String(it.ingredientId) === String(editingIngId));
        if (existingIdx >= 0) {
          updatedItems = currentItems.map((it, idx) =>
            idx === existingIdx ? { ...it, quantity: it.quantity + itemPayload.quantity, price: itemPayload.price } : it
          );
        } else {
          updatedItems = [...currentItems, itemPayload];
        }
      }

      const res = await purchaseOrderService.updatePurchaseOrder(poId, { items: updatedItems });
      const updatedDetail = res?.data || res;
      toast.success(selectedItem ? 'Line item updated successfully!' : 'Line item added to Purchase Order!');
      setSelectedPO(updatedDetail);
      setItemDialogOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update purchase order item';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePOItem = async () => {
    if (!selectedPO || !selectedItem) return;
    setSubmitting(true);
    try {
      const poId = selectedPO.id || selectedPO._id;
      const targetIngId = selectedItem.ingredientId || selectedItem.ingredient?.id || selectedItem.ingredient?._id;

      const currentItems = (selectedPO.purchaseItems || selectedPO.items || []).map((it) => ({
        ingredientId: it.ingredientId || it.ingredient?.id || it.ingredient?._id,
        productId: it.productId || it.product?.id || it.product?._id,
        quantity: Number(it.quantity),
        price: Number(it.price),
      }));

      const updatedItems = currentItems.filter((it) => String(it.ingredientId) !== String(targetIngId));

      if (updatedItems.length === 0) {
        toast.error('Purchase Order must contain at least one line item');
        return;
      }

      const res = await purchaseOrderService.updatePurchaseOrder(poId, { items: updatedItems });
      const updatedDetail = res?.data || res;
      toast.success('Line item removed from Purchase Order!');
      setSelectedPO(updatedDetail);
      setDeleteItemDialogOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove line item';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // CRUD Actions
  const handleSavePO = async (poPayload) => {
    setSubmitting(true);
    try {
      const poId = selectedPO?.id || selectedPO?._id;
      if (poId) {
        await purchaseOrderService.updatePurchaseOrder(poId, poPayload);
        toast.success(`Purchase Order ${selectedPO.poNumber || ''} updated successfully!`);
      } else {
        const res = await purchaseOrderService.createPurchaseOrder(poPayload);
        const created = res?.data || res;
        toast.success(`Purchase Order ${created?.poNumber || ''} created successfully!`);
      }
      setCreateDialogOpen(false);
      setDetailsDialogOpen(false);
      setSelectedPO(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || err.message || 'Failed to save purchase order';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprovePO = async (po) => {
    const id = po.id || po._id;
    setSubmitting(true);
    try {
      await purchaseOrderService.approvePurchaseOrder(id);
      toast.success(`Purchase Order ${po.poNumber} APPROVED successfully!`);
      if (detailsDialogOpen) setDetailsDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to approve Purchase Order';
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
      await purchaseOrderService.updateStatus(id, statusPayload.status);
      toast.success(`PO status updated to ${statusPayload.status}!`);
      setStatusDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update PO status';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceiveItems = async (receivePayload) => {
    if (!selectedPO) return;
    setSubmitting(true);
    try {
      const id = selectedPO.id || selectedPO._id;
      await purchaseOrderService.receiveItems(id, receivePayload);
      toast.success(`Inbound stock received for ${selectedPO.poNumber}!`);
      setReceiveDialogOpen(false);
      if (detailsDialogOpen) setDetailsDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to receive goods';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadSupplierInvoice = async (formData) => {
    if (!selectedPO) return;
    setSubmitting(true);
    try {
      const id = selectedPO.id || selectedPO._id;
      const res = await purchaseOrderService.uploadSupplierInvoice(id, formData);
      toast.success(res.message || 'Invoice uploaded & Expense auto-created successfully!');
      setUploadInvoiceDialogOpen(false);
      if (detailsDialogOpen) setDetailsDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload supplier invoice';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePayment = async (paymentPayload) => {
    if (!selectedPO) return;
    setSubmitting(true);
    try {
      const id = selectedPO.id || selectedPO._id;
      const res = await purchaseOrderService.createPayment(id, paymentPayload);
      toast.success(res.message || 'Payment recorded successfully!');
      setPaymentDialogOpen(false);
      if (detailsDialogOpen) setDetailsDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to record payment';
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ fontWeight: 800, borderRadius: 2.5, px: 2.5, py: 1 }}
        >
          Create Purchase Order
        </Button>
      }
    >
      {/* Metrics Summary Header */}
      <PurchaseOrderSummaryCard purchaseOrders={purchaseOrders} />

      {/* Mobile Header Filter Trigger */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Purchase Orders ({filteredPurchaseOrders.length})
        </Typography>

        <IconButton
          onClick={() => setMobileFilterOpen(true)}
          sx={{
            color: 'text.primary',
            backgroundColor: isDark ? '#131A24' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '12px',
            p: 1.2,
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Single Unified Merged Container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: isDark ? '#131A24' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          mb: 4,
          boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <PurchaseOrderToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            supplierFilter={supplierFilter}
            onSupplierFilterChange={setSupplierFilter}
            availableSuppliers={suppliers}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </Box>

        <Box p={{ xs: 2, sm: 3 }}>
          {!loading && filteredPurchaseOrders.length === 0 ? (
            <EmptyPurchaseOrderState onCreatePO={handleOpenCreateDialog} />
          ) : viewMode === 'grid' ? (
            <Grid container spacing={2.5}>
              {filteredPurchaseOrders.map((po) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={po.id || po._id}>
                  <PurchaseOrderCard
                    po={po}
                    onView={handleOpenDetailsDialog}
                    onEdit={handleOpenEditDialog}
                    onReceive={handleOpenReceiveDialog}
                    onUploadInvoice={handleOpenUploadInvoiceDialog}
                    onRecordPayment={handleOpenPaymentDialog}
                    onPrint={handleOpenPrintDialog}
                    onDelete={handleOpenDeleteDialog}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <PurchaseOrderTable
              purchaseOrders={filteredPurchaseOrders}
              loading={loading}
              onView={handleOpenDetailsDialog}
              onEdit={handleOpenEditDialog}
              onReceive={handleOpenReceiveDialog}
              onUploadInvoice={handleOpenUploadInvoiceDialog}
              onRecordPayment={handleOpenPaymentDialog}
              onPrint={handleOpenPrintDialog}
              onDelete={handleOpenDeleteDialog}
            />
          )}
        </Box>
      </Paper>

      {/* Create / Edit PO Dialog */}
      <PurchaseOrderDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleSavePO}
        initialData={selectedPO}
        suppliers={suppliers}
        warehouses={warehouses}
        ingredientsList={ingredientsList}
        loading={submitting}
      />

      {/* PO Details Specification Dialog */}
      <PurchaseOrderDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        purchaseOrder={selectedPO}
        onApprove={handleApprovePO}
        onReceive={handleOpenReceiveDialog}
        onUploadInvoice={handleOpenUploadInvoiceDialog}
        onRecordPayment={handleOpenPaymentDialog}
        onPrint={handleOpenPrintDialog}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
        onAddItem={handleOpenAddItemDialog}
        onEditItem={handleOpenEditItemDialog}
        onDeleteItem={handleOpenDeleteItemDialog}
      />

      {/* Add / Edit PO Item Sub-Dialog */}
      <PurchaseOrderItemDialog
        open={itemDialogOpen}
        onClose={() => setItemDialogOpen(false)}
        onSubmit={handleSavePOItem}
        initialData={selectedItem}
        ingredientsList={ingredientsList}
        loading={submitting}
      />

      {/* Remove PO Item Confirmation Dialog */}
      <DeletePurchaseOrderItemDialog
        open={deleteItemDialogOpen}
        onClose={() => setDeleteItemDialogOpen(false)}
        onConfirm={handleRemovePOItem}
        purchaseOrderItem={selectedItem}
        loading={submitting}
      />

      {/* Receive Goods Inbound Dialog */}
      <ReceiveGoodsDialog
        open={receiveDialogOpen}
        onClose={() => setReceiveDialogOpen(false)}
        onSubmit={handleReceiveItems}
        purchaseOrder={selectedPO}
        warehouses={warehouses}
        loading={submitting}
      />

      {/* Record Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        onSubmit={handleCreatePayment}
        purchaseOrder={selectedPO}
        loading={submitting}
      />

      {/* Upload Supplier Invoice OCR Dialog */}
      <SupplierInvoiceUploadDialog
        open={uploadInvoiceDialogOpen}
        onClose={() => setUploadInvoiceDialogOpen(false)}
        onSubmit={handleUploadSupplierInvoice}
        purchaseOrder={selectedPO}
        loading={submitting}
      />

      {/* Print & PDF Export Dialog */}
      <PrintPurchaseOrderDialog
        open={printDialogOpen}
        onClose={() => setPrintDialogOpen(false)}
        purchaseOrder={selectedPO}
      />

      {/* Status Transition Dialog */}
      <PurchaseOrderStatusDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onSubmit={handleUpdateStatus}
        purchaseOrder={selectedPO}
        loading={submitting}
      />

      {/* Delete PO Confirmation Dialog */}
      <DeletePurchaseOrderDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeletePO}
        purchaseOrder={selectedPO}
        loading={submitting}
      />

      {/* Mobile Floating Action Button (FAB) */}
      <Fab
        onClick={handleOpenCreateDialog}
        aria-label="create purchase order"
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

      {/* Mobile Purchase Order Filter Drawer */}
      <MobilePurchaseOrderFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        supplierFilter={supplierFilter}
        onSupplierFilterChange={setSupplierFilter}
        suppliers={suppliers}
        onResetFilters={() => {
          setSearchTerm('');
          setStatusFilter('ALL');
          setSupplierFilter('ALL');
        }}
      />
    </PageContainer>
  );
};

export default PurchaseOrdersPage;
