import axiosInstance from '../config/axios';

export const categoryService = {
  getCategories: async () => {
    const response = await axiosInstance.get('/menu/category');
    return response.data;
  },

  createCategory: async (data) => {
    const response = await axiosInstance.post('/menu/category', data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await axiosInstance.put(`/menu/category/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/menu/category/${id}`);
    return response.data;
  },
};

export default categoryService;
