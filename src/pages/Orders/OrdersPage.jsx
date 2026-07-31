import { useState, useEffect, useCallback, useMemo } from 'react';
import { Paper, Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import orderService from '../../services/order.service';
import tableService from '../../services/table.service';
import menuService from '../../services/menu.service';
import PageContainer from '../../components/layout/PageContainer';
import OrderSummaryCard from './OrderSummaryCard';
import OrderToolbar from './OrderToolbar';
import OrderTable from './OrderTable';
import OrderKanbanBoard from './OrderKanbanBoard';
import CreateOrderDialog from './CreateOrderDialog';
import EditOrderDialog from './EditOrderDialog';
import OrderDetailsDialog from './OrderDetailsDialog';
import AddOrderItemDialog from './AddOrderItemDialog';
import DeleteOrderDialog from './DeleteOrderDialog';
import DeleteOrderItemDialog from './DeleteOrderItemDialog';
import OrderInvoicePaymentDialog from './OrderInvoicePaymentDialog';
import EmptyOrderState from './EmptyOrderState';
import ErrorState from '../../components/common/ErrorState';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tableFilter, setTableFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordRes, tabRes, menuRes] = await Promise.all([
        orderService.getOrders(),
        tableService.getTables(),
        menuService.getMenuItems(),
      ]);

      const oList = Array.isArray(ordRes) ? ordRes : ordRes?.data || ordRes?.orders || [];
      const tList = Array.isArray(tabRes) ? tabRes : tabRes?.data || tabRes?.tables || [];
      const mList = Array.isArray(menuRes) ? menuRes : menuRes?.data || menuRes?.items || menuRes?.menuItems || [];

      setOrders(oList);
      setTables(tList);
      setMenuItems(mList);
    } catch (err) {
      const status = err.response?.status;
      const msg =
        err.response?.data?.message ||
        (status === 400 ? 'Bad Request' :
         status === 401 ? 'Unauthorized Access' :
         status === 403 ? 'Access Forbidden' :
         status === 404 ? 'Orders resource not found' :
         status === 409 ? 'Conflict Error' :
         status === 500 ? 'Internal Server Error' : 'Failed to fetch orders data');

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // 1. Search by Order Number
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const numMatch = ord.orderNumber?.toLowerCase().includes(term);
        if (!numMatch) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        if (String(ord.status).toUpperCase() !== statusFilter) return false;
      }

      // 3. Table Filter
      if (tableFilter !== 'ALL') {
        const ordTableId = typeof ord.table === 'object' ? ord.table?.id : ord.tableId;
        if (ordTableId !== tableFilter) return false;
      }

      return true;
    });
  }, [orders, searchTerm, statusFilter, tableFilter]);

  // Handlers for opening dialogs
  const handleOpenCreateDialog = () => {
    setSelectedOrder(null);
    setCreateDialogOpen(true);
  };

  const handleOpenEditStatusDialog = (order) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (order) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const handleOpenDetailsDialog = async (order) => {
    try {
      const res = await orderService.getOrderById(order.id || order._id);
      const detail = res?.data || res || order;
      setSelectedOrder(detail);
    } catch (err) {
      setSelectedOrder(order);
    }
    setDetailsDialogOpen(true);
  };

  const handleOpenAddItemDialog = (order) => {
    setSelectedOrder(order);
    setAddItemDialogOpen(true);
  };

  const handleOpenRemoveItemDialog = (item) => {
    setSelectedOrderItem(item);
    setDeleteItemDialogOpen(true);
  };

  // CRUD Actions
  const handleCreateOrder = async (orderPayload) => {
    setSubmitting(true);
    try {
      const res = await orderService.createOrder(orderPayload);
      const created = res?.data || res;
      toast.success(`Order ${created?.orderNumber || ''} created successfully!`);
      setCreateDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create order';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (statusPayload) => {
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      const id = selectedOrder.id || selectedOrder._id;
      await orderService.updateOrder(id, statusPayload);
      toast.success(`Order status updated to ${statusPayload.status}!`);
      setEditDialogOpen(false);

      if (detailsDialogOpen) {
        const res = await orderService.getOrderById(id);
        if (res?.data) setSelectedOrder(res.data);
      }

      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update order status';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      const id = selectedOrder.id || selectedOrder._id;
      await orderService.deleteOrder(id);
      toast.success(`Order ${selectedOrder.orderNumber} deleted!`);
      setDeleteDialogOpen(false);
      setDetailsDialogOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Delete order failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddOrderItem = async (itemPayload) => {
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      const payload = {
        orderId: selectedOrder.id || selectedOrder._id,
        menuItemId: itemPayload.menuItemId,
        quantity: itemPayload.quantity,
      };
      await orderService.addOrderItem(payload);
      toast.success('Item added to order!');
      setAddItemDialogOpen(false);

      // Refresh current order details
      const res = await orderService.getOrderById(selectedOrder.id || selectedOrder._id);
      const updated = res?.data || res;
      if (updated) setSelectedOrder(updated);

      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to add item to order';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrderItem = async () => {
    if (!selectedOrderItem) return;
    setSubmitting(true);
    try {
      const id = selectedOrderItem.id || selectedOrderItem._id;
      await orderService.deleteOrderItem(id);
      toast.success('Item removed from order!');
      setDeleteItemDialogOpen(false);

      if (selectedOrder) {
        const res = await orderService.getOrderById(selectedOrder.id || selectedOrder._id);
        const updated = res?.data || res;
        if (updated) setSelectedOrder(updated);
      }

      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove item';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (error && orders.length === 0) {
    return (
      <PageContainer title="Order Management" breadcrumbs={['Dashboard', 'Orders']}>
        <ErrorState
          title="Failed to Load Orders"
          description={error}
          onRetry={fetchData}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Order Management"
      breadcrumbs={['Dashboard', 'Orders']}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto', alignItems: 'center' }}>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
            Refresh
          </Button>
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog} sx={{ fontWeight: 700 }}>
            Create New Order
          </Button>
        </Box>
      }
    >
      {/* Metrics Summary Header */}
      <OrderSummaryCard orders={orders} />

      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          mb: 4,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#131A24' : '#FFFFFF',
        }}
      >
        <OrderToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          tableFilter={tableFilter}
          onTableFilterChange={setTableFilter}
          availableTables={tables}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <Box p={3}>
          {!loading && filteredOrders.length === 0 ? (
            <EmptyOrderState onCreateOrder={handleOpenCreateDialog} />
          ) : viewMode === 'kanban' ? (
            <OrderKanbanBoard
              orders={filteredOrders}
              onView={handleOpenDetailsDialog}
              onEditStatus={(ord, newStatus) => {
                setSelectedOrder(ord);
                handleUpdateStatus({ status: newStatus });
              }}
              onCheckout={(ord) => {
                setSelectedOrder(ord);
                setCheckoutDialogOpen(true);
              }}
            />
          ) : (
            <OrderTable
              orders={filteredOrders}
              loading={loading}
              onView={handleOpenDetailsDialog}
              onEditStatus={handleOpenEditStatusDialog}
              onDelete={handleOpenDeleteDialog}
              onAddItem={handleOpenAddItemDialog}
              onCheckout={(ord) => {
                setSelectedOrder(ord);
                setCheckoutDialogOpen(true);
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Dialog Modals */}
      <OrderInvoicePaymentDialog
        open={checkoutDialogOpen}
        onClose={() => setCheckoutDialogOpen(false)}
        order={selectedOrder}
        onWorkflowComplete={() => {
          fetchData();
        }}
      />

      <CreateOrderDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateOrder}
        tables={tables}
        menuItems={menuItems}
        loading={submitting}
      />

      <EditOrderDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleUpdateStatus}
        order={selectedOrder}
        loading={submitting}
      />

      <OrderDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        order={selectedOrder}
        onAddItemClick={handleOpenAddItemDialog}
        onRemoveItemClick={handleOpenRemoveItemDialog}
        onEditStatus={handleOpenEditStatusDialog}
        onDelete={handleOpenDeleteDialog}
        onCheckout={(ord) => {
          setSelectedOrder(ord);
          setCheckoutDialogOpen(true);
        }}
      />

      <AddOrderItemDialog
        open={addItemDialogOpen}
        onClose={() => setAddItemDialogOpen(false)}
        onSubmit={handleAddOrderItem}
        menuItems={menuItems}
        loading={submitting}
      />

      <DeleteOrderDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteOrder}
        order={selectedOrder}
        loading={submitting}
      />

      <DeleteOrderItemDialog
        open={deleteItemDialogOpen}
        onClose={() => setDeleteItemDialogOpen(false)}
        onConfirm={handleDeleteOrderItem}
        orderItem={selectedOrderItem}
        loading={submitting}
      />
    </PageContainer>
  );
};

export default OrdersPage;
