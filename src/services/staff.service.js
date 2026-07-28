import axiosInstance from '../config/axios';

/**
 * Staff Service
 * Connects directly to real backend /api/staff endpoints.
 * Endpoints:
 *   GET    /api/staff       → List staff members (ADMIN, MANAGER)
 *   POST   /api/staff       → Create staff profile (ADMIN, MANAGER)
 *   GET    /api/staff/:id   → Get staff details (ADMIN, MANAGER)
 *   PUT    /api/staff/:id   → Update staff profile (ADMIN, MANAGER)
 *   DELETE /api/staff/:id   → Delete staff member (ADMIN only)
 */
export const staffService = {
  // GET /api/staff
  getAllStaff: async (params = {}) => {
    const res = await axiosInstance.get('/staff', { params });
    return res.data;
  },

  // GET /api/staff/:id
  getStaffById: async (id) => {
    const res = await axiosInstance.get(`/staff/${id}`);
    return res.data;
  },

  // POST /api/staff
  // Body: { userId, employeeCode, department, designation, shift?, hireDate, salary?, emergencyContact? }
  createStaff: async (staffData) => {
    const res = await axiosInstance.post('/staff', staffData);
    return res.data;
  },

  // PUT /api/staff/:id
  // Body: { employeeCode?, department?, designation?, shift?, hireDate?, salary?, emergencyContact? }
  updateStaff: async (id, staffData) => {
    const res = await axiosInstance.put(`/staff/${id}`, staffData);
    return res.data;
  },

  // DELETE /api/staff/:id
  deleteStaff: async (id) => {
    const res = await axiosInstance.delete(`/staff/${id}`);
    return res.data;
  },
};

export default staffService;
