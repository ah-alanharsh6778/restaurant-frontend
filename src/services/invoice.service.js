/**
 * RestaurantOS — Invoice Service
 *
 * All calls use the real backend endpoints verified live (13/13 PASS).
 *
 * Endpoints (all require JWT Bearer, ADMIN/MANAGER roles):
 *   POST   /api/invoices/upload          → multipart/form-data field: "file"
 *   POST   /api/invoices/:id/process     → trigger OCR+AI
 *   POST   /api/invoices/:id/reprocess   → re-trigger OCR+AI
 *   GET    /api/invoices                 → list (status, search, page, limit)
 *   GET    /api/invoices/:id             → detail with items + expense
 *   DELETE /api/invoices/:id             → delete
 *
 * Upload config: field="file", types=PDF/PNG/JPG/JPEG, max=10MB
 * Duplicate detection: backend returns HTTP 409 Conflict
 * Auto-processing: upload auto-runs OCR+AI+Expense in one atomic call
 */

import axiosInstance from '../config/axios';

export const invoiceService = {
  /**
   * Upload an invoice file.
   * Backend auto-runs OCR → AI Parsing → Duplicate Check → Creates Expense.
   * @param {File} file - PDF, PNG, JPG, or JPEG, max 10 MB
   * @param {function} [onUploadProgress] - axios progress callback
   * @returns {Promise<{ success, data: InvoiceDTO }>}
   */
  uploadInvoice: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/invoices/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...(onUploadProgress ? { onUploadProgress } : {}),
    });
    return response.data;
  },

  /**
   * Trigger OCR + AI processing on an existing uploaded invoice.
   * @param {string} id - Invoice UUID
   */
  processInvoice: async (id) => {
    const response = await axiosInstance.post(`/invoices/${id}/process`);
    return response.data;
  },

  /**
   * Re-trigger OCR + AI processing (alias for process, used for retry UI).
   * @param {string} id - Invoice UUID
   */
  reprocessInvoice: async (id) => {
    const response = await axiosInstance.post(`/invoices/${id}/reprocess`);
    return response.data;
  },

  /**
   * Get paginated + filtered invoice list.
   * @param {object} params - { page?, limit?, status?, search? }
   * @returns {Promise<{ success, data: { invoices: InvoiceDTO[], pagination } }>}
   */
  getInvoices: async (params = {}) => {
    const cleanParams = {};
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
    if (params.status && params.status !== 'ALL') cleanParams.status = params.status;
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    const response = await axiosInstance.get('/invoices', { params: cleanParams });
    return response.data;
  },

  getAllInvoices: async (params = {}) => {
    const cleanParams = {};
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
    if (params.status && params.status !== 'ALL') cleanParams.status = params.status;
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    const response = await axiosInstance.get('/invoices', { params: cleanParams });
    return response.data;
  },

  /**
   * Get single invoice — includes items[] and expense (with supplier + category).
   * @param {string} id - Invoice UUID
   * @returns {Promise<{ success, data: InvoiceDTO }>}
   */
  getInvoiceById: async (id) => {
    const response = await axiosInstance.get(`/invoices/${id}`);
    return response.data;
  },

  /**
   * Delete an invoice by ID (ADMIN/MANAGER only).
   * @param {string} id - Invoice UUID
   */
  deleteInvoice: async (id) => {
    const response = await axiosInstance.delete(`/invoices/${id}`);
    return response.data;
  },

  /**
   * Get expense detail linked to an invoice.
   * @param {string} expenseId - Expense UUID
   */
  getExpenseById: async (expenseId) => {
    const response = await axiosInstance.get(`/expenses/${expenseId}`);
    return response.data;
  },
};

export default invoiceService;
