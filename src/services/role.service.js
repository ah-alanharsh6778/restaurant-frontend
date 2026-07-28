/**
 * RestaurantOS — Role & Permission Service
 *
 * All API calls hit the real backend. No mocking. No fake data.
 *
 * Backend endpoints used:
 *   GET    /api/roles                         → ADMIN, MANAGER
 *   GET    /api/roles/:id                     → ADMIN, MANAGER
 *   POST   /api/roles                         → ADMIN only
 *   PUT    /api/roles/:id                     → ADMIN only
 *   DELETE /api/roles/:id                     → ADMIN only
 *   GET    /api/permissions                   → ADMIN, MANAGER
 *   GET    /api/permissions/role/:roleId      → ADMIN, MANAGER
 *   POST   /api/permissions                   → ADMIN only
 *   POST   /api/permissions/assign-role       → ADMIN only
 */

import axiosInstance from '../config/axios';

export const roleService = {
  // ── Roles ──────────────────────────────────────────────────────────────────

  /**
   * GET /api/roles
   * Returns: { success, data: Role[], pagination }
   * Each Role: { id, name, description, userCount, createdAt }
   */
  getRoles: async (params = {}) => {
    const response = await axiosInstance.get('/roles', { params });
    return response.data;
  },

  /**
   * GET /api/roles/:id
   * Returns: { success, data: { id, name, description, users[], createdAt } }
   */
  getRoleById: async (id) => {
    const response = await axiosInstance.get(`/roles/${id}`);
    return response.data;
  },

  /**
   * POST /api/roles
   * Body: { name, description }
   * Returns: { success, message, data: Role }
   */
  createRole: async (roleData) => {
    const response = await axiosInstance.post('/roles', roleData);
    return response.data;
  },

  /**
   * PUT /api/roles/:id
   * Body: { name?, description? }
   * Returns: { success, message, data: Role }
   */
  updateRole: async (id, roleData) => {
    const response = await axiosInstance.put(`/roles/${id}`, roleData);
    return response.data;
  },

  /**
   * DELETE /api/roles/:id
   * Returns: { success, message }
   * Note: Backend rejects deletion if role has active users.
   */
  deleteRole: async (id) => {
    const response = await axiosInstance.delete(`/roles/${id}`);
    return response.data;
  },

  // ── Permissions ────────────────────────────────────────────────────────────

  /**
   * GET /api/permissions
   * Returns: { success, data: Permission[], pagination }
   * Each Permission: { id, name, action, resource, description, createdAt }
   */
  getPermissions: async (params = {}) => {
    const response = await axiosInstance.get('/permissions', { params });
    return response.data;
  },

  /**
   * GET /api/permissions/role/:roleId
   * Returns: { success, data: Permission[] }
   * Used to load the current user's permission set after login.
   */
  getRolePermissions: async (roleId) => {
    const response = await axiosInstance.get(`/permissions/role/${roleId}`);
    return response.data;
  },

  /**
   * POST /api/permissions
   * Body: { name, action, resource, description? }
   * Returns: { success, message, data: Permission }
   */
  createPermission: async (permissionData) => {
    const response = await axiosInstance.post('/permissions', permissionData);
    return response.data;
  },

  /**
   * POST /api/permissions/assign-role
   * Body: { roleId, permissionId }
   * Returns: { success, message, data: RolePermission }
   */
  assignPermissionToRole: async (roleId, permissionId) => {
    const response = await axiosInstance.post('/permissions/assign-role', { roleId, permissionId });
    return response.data;
  },
};

export default roleService;
