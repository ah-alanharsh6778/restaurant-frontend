import axios from 'axios';
import { getToken, clearAuth } from '../utils/storage';
import { getCachedData, setCachedData, invalidateCachePattern } from '../utils/apiCache';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Authorization Bearer token & return SWR cached response
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Auto-invalidate cache on mutation methods
    const method = String(config.method).toUpperCase();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const path = config.url || '';
      const resource = path.split('/')[1] || path.split('/')[0] || '';
      if (resource) {
        invalidateCachePattern(resource);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for caching GET responses and global error handling
api.interceptors.response.use(
  (response) => {
    const method = String(response.config?.method || '').toUpperCase();
    const url = response.config?.url || '';

    // Cache successful GET responses
    if (method === 'GET' && response.data) {
      setCachedData(url, response.data);
    }

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
