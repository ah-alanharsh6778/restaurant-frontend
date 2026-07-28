import axiosInstance from '../config/axios';

/**
 * Waste Service
 * Connects directly to backend /api/waste endpoints.
 */
export const wasteService = {
  // GET /api/waste?page=1&limit=50&ingredientId=...&reason=...
  getAll: async (params = {}) => {
    const res = await axiosInstance.get('/waste', { params });
    return res.data;
  },

  // POST /api/waste
  // Body: { ingredientId, quantity, unit, reason, remarks }
  logWaste: async (wasteData) => {
    const res = await axiosInstance.post('/waste', wasteData);
    return res.data;
  },

  // GET /api/waste/stats
  getStats: async () => {
    const res = await axiosInstance.get('/waste/stats');
    return res.data;
  },
};

export default wasteService;
