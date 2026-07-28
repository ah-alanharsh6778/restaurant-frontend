import axiosInstance from '../config/axios';

export const menuService = {
  getMenuItems: async () => {
    const response = await axiosInstance.get('/menu');
    return response.data;
  },

  getMenuItemById: async (id) => {
    const response = await axiosInstance.get(`/menu/${id}`);
    return response.data;
  },

  createMenuItem: async (data) => {
    const response = await axiosInstance.post('/menu', data);
    return response.data;
  },

  updateMenuItem: async (id, data) => {
    const response = await axiosInstance.put(`/menu/${id}`, data);
    return response.data;
  },

  deleteMenuItem: async (id) => {
    const response = await axiosInstance.delete(`/menu/${id}`);
    return response.data;
  },

  getPublicMenuItems: async () => {
    const response = await axiosInstance.get('/menu/public/items');
    return response.data;
  },

  getPublicCategories: async () => {
    const response = await axiosInstance.get('/menu/public/categories');
    return response.data;
  },
};

export default menuService;
