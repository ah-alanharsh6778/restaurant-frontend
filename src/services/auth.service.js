/**
 * RestaurantOS — Auth Service
 *
 * Thin wrapper around raw API calls for login, register, refresh.
 * Profile fetching and permission loading are handled inside AuthContext.
 *
 * Endpoints:
 *   POST /api/auth/login     → { success, data: { accessToken, refreshToken, user } }
 *   POST /api/auth/register  → { success, message, data: UserDTO }
 *   POST /api/auth/refresh   → { success, data: { accessToken, refreshToken } }
 *   GET  /api/users/profile  → { success, data: UserDTO }
 */

import axiosInstance from '../config/axios';
import { clearAuth, setTokens, setUser, getRefreshToken } from '../utils/storage';

export const authService = {
  /**
   * POST /api/auth/login
   * On success stores tokens and user in localStorage.
   */
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    const data = response.data;

    if (data?.success && data?.data) {
      const { accessToken, refreshToken, user } = data.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
    }

    return data;
  },

  /**
   * POST /api/auth/register
   * Requires roleId (UUID of the role from GET /api/roles).
   * Body: { fullName, email, password, phone?, roleId }
   */
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  /**
   * POST /api/auth/refresh
   * Uses the stored refreshToken to obtain a new accessToken.
   */
  refresh: async () => {
    const refreshTokenStr = getRefreshToken();
    if (!refreshTokenStr) throw new Error('No refresh token available');

    const response = await axiosInstance.post('/auth/refresh', { refreshToken: refreshTokenStr });
    const data = response.data;

    if (data?.success && data?.data) {
      setTokens(data.data.accessToken, data.data.refreshToken);
    }
    return data;
  },

  /**
   * GET /api/users/profile
   * Validates the current JWT and returns the authenticated user.
   */
  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  /**
   * Client-side logout.
   * Backend has no logout endpoint — we clear tokens locally.
   */
  logout: () => {
    clearAuth();
  },
};

export default authService;
