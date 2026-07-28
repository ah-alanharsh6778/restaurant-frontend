/**
 * RestaurantOS — PermissionGuard
 *
 * Conditionally renders children based on the current user's real permissions
 * fetched from the backend (`GET /permissions/role/:roleId`).
 *
 * Usage:
 *   <PermissionGuard action="CREATE" resource="ORDERS">
 *     <Button>New Order</Button>
 *   </PermissionGuard>
 *
 *   <PermissionGuard action="MANAGE" resource="USERS" fallback={<DisabledButton />}>
 *     <Button>Add User</Button>
 *   </PermissionGuard>
 *
 * Actions:  CREATE | READ | UPDATE | DELETE | MANAGE
 * Resources: ORDERS | INVENTORY | USERS | EXPENSES | STAFF
 */

import { useAuth } from '../../hooks/useAuth';

/**
 * @param {string}          action    - Permission action (e.g. 'CREATE')
 * @param {string}          resource  - Permission resource (e.g. 'ORDERS')
 * @param {React.ReactNode} children  - Content to show when permission granted
 * @param {React.ReactNode} [fallback]- Optional content when permission denied (default: null)
 */
const PermissionGuard = ({ action, resource, children, fallback = null }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(action, resource)) {
    return fallback;
  }

  return children;
};

export default PermissionGuard;
