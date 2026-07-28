import api from './api';

export const purchaseOrderService = {
  getPurchaseOrders: async () => {
    const response = await api.get('/purchase-orders');
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/purchase-orders');
    return response.data;
  },

  getPurchaseOrderById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data;
  },

  createPurchaseOrder: async (data) => {
    const response = await api.post('/purchase-orders', data);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/purchase-orders', data);
    return response.data;
  },

  updatePurchaseOrder: async (id, data) => {
    const response = await api.put(`/purchase-orders/${id}`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/purchase-orders/${id}`, data);
    return response.data;
  },

  deletePurchaseOrder: async (id) => {
    const response = await api.delete(`/purchase-orders/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/purchase-orders/${id}`);
    return response.data;
  },

  addPurchaseOrderItem: async (data) => {
    const response = await api.post('/purchase-orders/items', data);
    return response.data;
  },

  addItem: async (data) => {
    const response = await api.post('/purchase-orders/items', data);
    return response.data;
  },

  deletePurchaseOrderItem: async (id) => {
    const response = await api.delete(`/purchase-orders/items/${id}`);
    return response.data;
  },

  removeItem: async (id) => {
    const response = await api.delete(`/purchase-orders/items/${id}`);
    return response.data;
  },
};

export default purchaseOrderService;
