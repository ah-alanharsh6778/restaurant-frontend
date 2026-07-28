import axiosInstance from '../config/axios';

/**
 * Report & Telemetry Service
 * Connects directly to backend /api/dashboard and export endpoints.
 */
export const reportService = {
  // GET /api/dashboard/summary
  getSummary: async () => {
    const res = await axiosInstance.get('/dashboard/summary');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/sales-overview
  getSalesOverview: async () => {
    const res = await axiosInstance.get('/dashboard/sales-overview');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/orders
  getOrdersBreakdown: async () => {
    const res = await axiosInstance.get('/dashboard/orders');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/revenue
  getRevenueMetrics: async () => {
    const res = await axiosInstance.get('/dashboard/revenue');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/profit
  getProfitMetrics: async () => {
    const res = await axiosInstance.get('/dashboard/profit');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/table-occupancy
  getTableOccupancy: async () => {
    const res = await axiosInstance.get('/dashboard/table-occupancy');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/low-stock
  getLowStockItems: async () => {
    const res = await axiosInstance.get('/dashboard/low-stock');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/purchase-summary
  getPurchaseSummary: async () => {
    const res = await axiosInstance.get('/dashboard/purchase-summary');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/monthly-expense
  getMonthlyExpenses: async () => {
    const res = await axiosInstance.get('/dashboard/monthly-expense');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/supplier-summary
  getSupplierSummary: async () => {
    const res = await axiosInstance.get('/dashboard/supplier-summary');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/top-selling-menu
  getTopSellingMenu: async (limit = 10) => {
    const res = await axiosInstance.get(`/dashboard/top-selling-menu?limit=${limit}`);
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/weekly-sales
  getWeeklySales: async () => {
    const res = await axiosInstance.get('/dashboard/weekly-sales');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/monthly-sales
  getMonthlySales: async () => {
    const res = await axiosInstance.get('/dashboard/monthly-sales');
    return res.data?.data || res.data;
  },

  // GET /api/dashboard/yearly-sales
  getYearlySales: async () => {
    const res = await axiosInstance.get('/dashboard/yearly-sales');
    return res.data?.data || res.data;
  },

  // GET /api/expenses/export -> Excel Spreadsheet
  exportExpenseExcel: async () => {
    const res = await axiosInstance.get('/expenses/export', { responseType: 'blob' });
    return res.data;
  },

  // GET /api/activity-logs -> Audit Telemetry Logs
  getActivityLogs: async (params = {}) => {
    const res = await axiosInstance.get('/activity-logs', { params });
    return res.data?.data?.activityLogs || res.data?.activityLogs || res.data || [];
  },

  // GET /api/invoices -> AI Invoice OCR Report Data
  getInvoices: async () => {
    const res = await axiosInstance.get('/invoices');
    return res.data?.data || res.data || [];
  },
};

export default reportService;
