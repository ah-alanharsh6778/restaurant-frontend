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
    if (data.customerName !== undefined) payload.customerName = data.customerName;
    if (data.phone !== undefined) payload.phone = data.phone;
    if (data.email !== undefined) payload.email = data.email;
    if (data.guests !== undefined) payload.guests = data.guests;
    if (data.bookingDate !== undefined) payload.bookingDate = data.bookingDate;
    if (data.bookingTime !== undefined) payload.bookingTime = data.bookingTime;
    if (data.specialNotes !== undefined) payload.specialNotes = data.specialNotes;

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

  // Customer ↔ Table Booking Workflow API Methods with 404 Fallback
  bookTable: async (tableId, bookingData) => {
    try {
      const response = await api.post(`/tables/${tableId}/book`, bookingData);
      return response.data;
    } catch (err) {
      if (err?.status === 404 || err?.response?.status === 404) {
        const response = await api.put(`/tables/${tableId}`, {
          ...bookingData,
          status: 'RESERVED',
        });
        return response.data;
      }
      throw err;
    }
  },

  checkInTable: async (tableId) => {
    try {
      const response = await api.post(`/tables/${tableId}/check-in`);
      return response.data;
    } catch (err) {
      if (err?.status === 404 || err?.response?.status === 404) {
        const response = await api.patch(`/tables/${tableId}/status`, { status: 'OCCUPIED' });
        return response.data;
      }
      throw err;
    }
  },

  cancelBooking: async (tableId) => {
    try {
      const response = await api.post(`/tables/${tableId}/cancel-booking`);
      return response.data;
    } catch (err) {
      if (err?.status === 404 || err?.response?.status === 404) {
        const response = await api.patch(`/tables/${tableId}/status`, { status: 'AVAILABLE' });
        return response.data;
      }
      throw err;
    }
  },
};

export default tableService;
