import api from './api';

export const orderService = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  updateOrder: async (id, data) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  addOrderItem: async (data) => {
    const response = await api.post('/orders/items', data);
    return response.data;
  },

  deleteOrderItem: async (id) => {
    const response = await api.delete(`/orders/items/${id}`);
    return response.data;
  },

  createPublicOrder: async (data) => {
    const response = await api.post('/orders/public', data);
    return response.data;
  },

  getPublicOrderById: async (id) => {
    const response = await api.get(`/orders/public/${id}`);
    return response.data;
  },

  getInvoicePdf: async (id) => {
    const response = await api.get(`/orders/${id}/invoice-pdf`);
    return response.data;
  },
};

export default orderService;
