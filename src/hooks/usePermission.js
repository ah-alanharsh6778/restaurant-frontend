/**
 * RestaurantOS — usePermission Hook
 *
 * Reads real permission data from AuthContext.
 * Uses the exact same logic as the backend permission.middleware.js:
 *   - ADMIN bypasses all checks
 *   - Others require explicit permission in their role's permission set
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// ─── useAuth ─────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ─── usePermission ────────────────────────────────────────────────────────────
/**
 * Check if the current user has a specific permission.
 *
 * @param {string} action   - 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE'
 * @param {string} resource - 'ORDERS' | 'INVENTORY' | 'USERS' | 'EXPENSES' | 'STAFF'
 * @returns {boolean}
 *
 * @example
 * const canCreateOrder = usePermission('CREATE', 'ORDERS');
 * const canManageUsers = usePermission('MANAGE', 'USERS');
 */
export const usePermission = (action, resource) => {
  const { hasPermission } = useAuth();
  return hasPermission(action, resource);
};

// ─── useRole ──────────────────────────────────────────────────────────────────
/**
 * Check if the current user has a specific role (or one of many roles).
 *
 * @param {string|string[]} roleName - 'ADMIN' | ['ADMIN', 'MANAGER']
 * @returns {boolean}
 *
 * @example
 * const isAdmin = useRole('ADMIN');
 * const isAdminOrManager = useRole(['ADMIN', 'MANAGER']);
 */
export const useRole = (roleName) => {
  const { hasRole } = useAuth();
  return hasRole(roleName);
};

// ─── usePermissions ───────────────────────────────────────────────────────────
/**
 * Returns the full permission array for the current user.
 * Each permission: { id, name, action, resource, description }
 *
 * @returns {Array}
 */
export const usePermissions = () => {
  const { permissions } = useAuth();
  return permissions;
};

export default usePermission;
