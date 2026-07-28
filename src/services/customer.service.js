import axiosInstance from '../config/axios';

/**
 * Customer Service
 * Connects directly to backend /api/customers endpoints.
 */
export const customerService = {
  // GET /api/customers?page=1&limit=50&search=...
  getAll: async (params = {}) => {
    const res = await axiosInstance.get('/customers', { params });
    return res.data;
  },

  // GET /api/customers/:id
  getById: async (id) => {
    const res = await axiosInstance.get(`/customers/${id}`);
    return res.data;
  },

  // POST /api/customers
  create: async (customerData) => {
    const res = await axiosInstance.post('/customers', customerData);
    return res.data;
  },

  // PUT /api/customers/:id
  update: async (id, customerData) => {
    const res = await axiosInstance.put(`/customers/${id}`, customerData);
    return res.data;
  },

  // DELETE /api/customers/:id
  delete: async (id) => {
    const res = await axiosInstance.delete(`/customers/${id}`);
    return res.data;
  },
};

export default customerService;
