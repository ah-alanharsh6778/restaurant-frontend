/**
 * RestaurantOS — Axios Instance
 *
 * Configured with:
 *  - Bearer token injection on every request
 *  - 401 handling: attempt token refresh once, then logout
 *  - Structured error objects with status + message
 */

import axios from 'axios';
import { getToken, getRefreshToken, setTokens, clearAuth } from '../utils/storage';

// Use relative /api so ALL requests go through Vite's built-in proxy.
// This means the browser sends to http://localhost:5174/api/... (same origin, no CORS)
// and Vite forwards server-side to http://localhost:5000/api/...
//
// NEVER use an absolute localhost:5000 URL from the browser — that crosses origins
// and triggers CORS rejection, regardless of the backend's CORS config.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor — Inject Bearer Token ────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Handle 401 with Refresh Attempt ──────────────────
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Build structured error
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    const customError = {
      status,
      message: backendMessage,
      originalError: error,
    };

    // ── 401 Handling: Try token refresh once ──────────────────────────────
    if (status === 401 && !originalRequest._retry) {
      const refreshTokenStr = getRefreshToken();

      // No refresh token available → clear and redirect
      if (!refreshTokenStr) {
        clearAuth();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(customError);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axiosInstance.post('/auth/refresh', {
          refreshToken: refreshTokenStr,
        });

        const { accessToken, refreshToken: newRefresh } = refreshRes.data?.data || {};

        if (!accessToken) throw new Error('Refresh failed');

        setTokens(accessToken, newRefresh);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        onRefreshed(accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        // Refresh failed — log out
        isRefreshing = false;
        refreshSubscribers = [];
        clearAuth();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(customError);
      }
    }

    // ── Other error status codes ──────────────────────────────────────────
    switch (status) {
      case 400: customError.message = backendMessage || 'Bad Request'; break;
      case 403: customError.message = backendMessage || 'Access forbidden'; break;
      case 404: customError.message = backendMessage || 'Resource not found'; break;
      case 409: customError.message = backendMessage || 'Conflict occurred'; break;
      case 429: customError.message = backendMessage || 'Too many requests. Please wait a moment and try again.'; break;
      case 500: customError.message = backendMessage || 'Internal server error'; break;
      default: break;
    }

    return Promise.reject(customError);
  }
);

export default axiosInstance;
