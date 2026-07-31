import api from './api';

export const purchaseOrderService = {
  getPurchaseOrders: async (params = {}) => {
    const response = await api.get('/purchase-orders', { params });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/purchase-orders', { params });
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

  approvePurchaseOrder: async (id) => {
    const response = await api.patch(`/purchase-orders/${id}/approve`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/purchase-orders/${id}/status`, { status });
    return response.data;
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    const response = await api.patch(`/purchase-orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  },

  receiveItems: async (id, data) => {
    const response = await api.post(`/purchase-orders/${id}/receive`, data);
    return response.data;
  },

  uploadSupplierInvoice: async (id, formData) => {
    const response = await api.post(`/purchase-orders/${id}/upload-invoice`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createPayment: async (id, data) => {
    const response = await api.post(`/purchase-orders/${id}/payments`, data);
    return response.data;
  },

  getPrintData: async (id) => {
    const response = await api.get(`/purchase-orders/${id}/print`, {
      headers: { Accept: 'text/html' },
    });
    return response.data;
  },

  getPdfData: async (id) => {
    const response = await api.get(`/purchase-orders/${id}/pdf`);
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
};

export default purchaseOrderService;
