import api from './api';

export const recipeService = {
  getRecipes: async () => {
    const response = await api.get('/recipes');
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/recipes');
    return response.data;
  },

  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (data) => {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  updateRecipe: async (id, data) => {
    const response = await api.put(`/recipes/${id}`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/recipes/${id}`, data);
    return response.data;
  },

  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  addIngredient: async (data) => {
    const response = await api.post('/recipes/ingredient', data);
    return response.data;
  },

  removeIngredient: async (id) => {
    const response = await api.delete(`/recipes/ingredient/${id}`);
    return response.data;
  },
};

export default recipeService;
