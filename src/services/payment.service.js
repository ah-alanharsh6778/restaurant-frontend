import axiosInstance from '../config/axios';

/**
 * Payment Service
 * Connects directly to real backend /api/payments endpoints.
 * Endpoints:
 *   POST /api/payments                → Process payment (ADMIN, MANAGER, WAITER, STAFF)
 *   GET  /api/payments                → List all payments (ADMIN, MANAGER)
 *   GET  /api/payments/:id            → Get payment details by ID (ADMIN, MANAGER)
 *   GET  /api/payments/order/:orderId → Get payment records by order ID
 */
export const paymentService = {
  // POST /api/payments
  processPayment: async (paymentData) => {
    const res = await axiosInstance.post('/payments', paymentData);
    return res.data?.data || res.data;
  },

  // GET /api/payments
  getAllPayments: async (params = {}) => {
    const res = await axiosInstance.get('/payments', { params });
    return res.data;
  },

  // GET /api/payments/:id
  getPaymentById: async (id) => {
    const res = await axiosInstance.get(`/payments/${id}`);
    return res.data?.data || res.data;
  },

  // GET /api/payments/order/:orderId
  getPaymentsByOrderId: async (orderId) => {
    const res = await axiosInstance.get(`/payments/order/${orderId}`);
    return res.data?.data || res.data || [];
  },
};

export default paymentService;
