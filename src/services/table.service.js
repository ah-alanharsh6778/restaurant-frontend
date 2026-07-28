import api from './api';

export const tableService = {
  // GET /api/tables (with optional status filter)
  getTables: async (params = {}) => {
    const response = await api.get('/tables', { params });
    return response.data;
  },

  // GET /api/tables/:id
  getTableById: async (id) => {
    const response = await api.get(`/tables/${id}`);
    return response.data;
  },

  // GET /api/tables/public/:id (Unauthenticated Guest QR Scan)
  getPublicTableById: async (id) => {
    const response = await api.get(`/tables/public/${id}`);
    return response.data;
  },

  // POST /api/tables (ADMIN, MANAGER)
  createTable: async (data) => {
    const response = await api.post('/tables', {
      tableNumber: String(data.tableNumber).trim(),
      capacity: parseInt(data.capacity, 10),
      status: data.status || 'AVAILABLE',
    });
    return response.data;
  },

  // PUT /api/tables/:id (ADMIN, MANAGER, STAFF, WAITER)
  updateTable: async (id, data) => {
    const payload = {};
    if (data.tableNumber !== undefined) payload.tableNumber = String(data.tableNumber).trim();
    if (data.capacity !== undefined) payload.capacity = parseInt(data.capacity, 10);
    if (data.status !== undefined) payload.status = data.status;

    const response = await api.put(`/tables/${id}`, payload);
    return response.data;
  },

  // DELETE /api/tables/:id (ADMIN, MANAGER)
  deleteTable: async (id) => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  },

  // GET /api/tables/availability
  getTableAvailability: async () => {
    const response = await api.get('/tables/availability');
    return response.data;
  },

  // PATCH /api/tables/:id/status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/tables/${id}/status`, { status });
    return response.data;
  },
};

export default tableService;
