import api from './api';

export const expenseService = {
  // Categories
  getExpenseCategories: async () => {
    const response = await api.get('/expenses/categories');
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/expenses/categories');
    return response.data;
  },
  createExpenseCategory: async (data) => {
    const response = await api.post('/expenses/categories', data);
    return response.data;
  },
  createCategory: async (data) => {
    const response = await api.post('/expenses/categories', data);
    return response.data;
  },
  updateExpenseCategory: async (id, data) => {
    const response = await api.put(`/expenses/categories/${id}`, data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await api.put(`/expenses/categories/${id}`, data);
    return response.data;
  },
  deleteExpenseCategory: async (id) => {
    const response = await api.delete(`/expenses/categories/${id}`);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/expenses/categories/${id}`);
    return response.data;
  },

  // Expenses
  getExpenses: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
  getAllExpenses: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
  getExpenseById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },
  getExpense: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },
  createExpense: async (data) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },
  updateExpense: async (id, data) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Invoice Upload
  uploadInvoices: async (formData) => {
    const response = await api.post('/expenses/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  uploadInvoice: async (formData) => {
    const response = await api.post('/expenses/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Excel Export
  exportExpenses: async () => {
    const response = await api.get('/expenses/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default expenseService;
