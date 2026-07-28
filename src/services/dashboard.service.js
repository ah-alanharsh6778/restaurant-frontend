import axiosInstance from '../config/axios';

/**
 * Dashboard Service
 * Connects directly to backend /api/dashboard and related operational entity APIs.
 */
export const dashboardService = {
  // GET /api/dashboard/summary
  getSummary: async () => {
    const res = await axiosInstance.get('/dashboard/summary');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/weekly-sales
  getWeeklySales: async () => {
    const res = await axiosInstance.get('/dashboard/weekly-sales');
    return res.data?.data || res.data || [];
  },

  // GET /api/dashboard/monthly-sales
  getMonthlySales: async () => {
    const res = await axiosInstance.get('/dashboard/monthly-sales');
    return res.data?.data || res.data || [];
  },

  // GET /api/dashboard/top-selling-menu
  getTopSellingMenu: async (limit = 5) => {
    const res = await axiosInstance.get(`/dashboard/top-selling-menu?limit=${limit}`);
    return res.data?.data || res.data || [];
  },

  // GET /api/customers
  getCustomers: async () => {
    const res = await axiosInstance.get('/customers');
    return res.data?.data || res.data || [];
  },

  // GET /api/expenses
  getExpenses: async () => {
    const res = await axiosInstance.get('/expenses');
    return res.data?.data || res.data || [];
  },

  // GET /api/invoices
  getInvoices: async () => {
    const res = await axiosInstance.get('/invoices');
    return res.data?.data || res.data || { invoices: [], pagination: { total: 0 } };
  },

  // GET /api/suppliers
  getSuppliers: async () => {
    const res = await axiosInstance.get('/suppliers');
    return res.data?.data || res.data || [];
  },

  // GET /api/activity-logs
  getActivityLogs: async () => {
    const res = await axiosInstance.get('/activity-logs').catch(() => ({ data: [] }));
    return res.data?.data || res.data || [];
  },
};

export default dashboardService;
