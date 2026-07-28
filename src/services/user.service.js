/**
 * RestaurantOS — User Service
 *
 * All calls use real backend APIs. No fallback mock data.
 *
 * Backend endpoints used:
 *   GET /api/users/profile   → Any authenticated user
 *   GET /api/users           → ADMIN, MANAGER only
 *
 * Note: User CRUD (PUT/DELETE /users/:id) is NOT implemented in the backend.
 * Creating new users goes through POST /api/auth/register (requires roleId).
 */

import axiosInstance from '../config/axios';

export const userService = {
  /**
   * GET /api/users/profile
   * Returns: { success: true, data: UserDTO }
   * UserDTO: { id, fullName, email, phone, isActive, roleId, role: { id, name }, createdAt }
   */
  getUserProfile: async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  /**
   * GET /api/users
   * Returns: { success: true, data: UserDTO[] }
   * Requires: ADMIN or MANAGER role
   */
  getUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  /**
   * POST /api/auth/register
   * Creates a new user with a required roleId.
   * Body: { fullName, email, password, phone?, roleId }
   * Returns: { success: true, message, data: UserDTO }
   */
  createUser: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  /**
   * GET /api/sessions/my-sessions
   * Returns: { success: true, data: UserSession[] }
   */
  getMySessions: async () => {
    const response = await axiosInstance.get('/sessions/my-sessions');
    return response.data;
  },

  /**
   * DELETE /api/sessions/:id
   * Revokes a single user session
   */
  revokeSession: async (sessionId) => {
    const response = await axiosInstance.delete(`/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * POST /api/sessions/revoke-all
   * Revokes all user sessions
   */
  revokeAllSessions: async () => {
    const response = await axiosInstance.post('/sessions/revoke-all');
    return response.data;
  },

  /**
   * GET /api/activity-logs
   * Returns: { success: true, data: ActivityLog[], pagination }
   */
  getActivityLogs: async () => {
    const response = await axiosInstance.get('/activity-logs');
    return response.data;
  },
};

export default userService;
