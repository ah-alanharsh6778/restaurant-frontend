/**
 * RestaurantOS — Enterprise RBAC Utility
 *
 * Role names are sourced directly from the backend Prisma RoleName enum:
 *   ADMIN | MANAGER | CHEF | WAITER | STAFF | INVENTORY_MANAGER
 *
 * DO NOT add roles that do not exist in the backend enum.
 * DO NOT hardcode permissions — use the AuthContext permission array.
 */

// ─── Real Backend Role Enum Values ──────────────────────────────────────────
export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CHEF: 'CHEF',
  WAITER: 'WAITER',
  STAFF: 'STAFF',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
};

// ─── Route Access Matrix (role → allowed paths) ──────────────────────────────
// Sourced from backend role.routes.js, permission.routes.js, user.routes.js
// ADMIN has full access to everything
export const ROLE_ROUTE_ACCESS = {
  [ROLES.ADMIN]: ['*'],
  [ROLES.MANAGER]: [
    '/dashboard',
    '/tables',
    '/orders',
    '/menu',
    '/recipes',
    '/ingredients',
    '/suppliers',
    '/purchase-orders',
    '/inventory',
    '/waste',
    '/expenses',
    '/reports',
    '/users',
    '/customers',
    '/profile',
    '/settings',
  ],
  [ROLES.CHEF]: [
    '/dashboard',
    '/orders',
    '/menu',
    '/recipes',
    '/ingredients',
    '/inventory',
    '/waste',
    '/profile',
  ],
  [ROLES.WAITER]: [
    '/dashboard',
    '/tables',
    '/orders',
    '/menu',
    '/customers',
    '/profile',
  ],
  [ROLES.STAFF]: [
    '/dashboard',
    '/orders',
    '/profile',
  ],
  [ROLES.INVENTORY_MANAGER]: [
    '/dashboard',
    '/inventory',
    '/purchase-orders',
    '/suppliers',
    '/ingredients',
    '/profile',
  ],
};

/**
 * Check if a role has access to a given route path.
 * Normalises role name to uppercase to handle mixed-case values from backend.
 *
 * @param {string|object} userRole - Role name string or role object { id, name }
 * @param {string} path - Route path (e.g. '/orders')
 * @returns {boolean}
 */
export const hasRoleAccess = (userRole = '', path = '') => {
  const roleName =
    typeof userRole === 'object' && userRole !== null
      ? userRole.name
      : String(userRole || '');

  const roleUpper = roleName.toUpperCase();

  // ADMIN bypasses all checks
  if (roleUpper === ROLES.ADMIN) return true;

  const allowedPaths = ROLE_ROUTE_ACCESS[roleUpper];
  if (!allowedPaths) return false;
  if (allowedPaths.includes('*')) return true;

  return allowedPaths.some((p) => path === p || path.startsWith(p + '/'));
};

/**
 * Normalise any role value (string or object) to uppercase string.
 */
export const normaliseRole = (role) => {
  if (!role) return '';
  if (typeof role === 'object' && role !== null) return (role.name || '').toUpperCase();
  return String(role).toUpperCase();
};

export default hasRoleAccess;
