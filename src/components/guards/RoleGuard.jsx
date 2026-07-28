/**
 * RestaurantOS — RoleGuard
 *
 * Conditionally renders children based on the current user's role.
 * Role names must match backend Prisma RoleName enum exactly.
 *
 * Usage:
 *   <RoleGuard role="ADMIN">
 *     <DeleteButton />
 *   </RoleGuard>
 *
 *   <RoleGuard role={['ADMIN', 'MANAGER']}>
 *     <ExportButton />
 *   </RoleGuard>
 *
 * Valid roles: ADMIN | MANAGER | CHEF | WAITER | STAFF | INVENTORY_MANAGER
 */

import { useAuth } from '../../hooks/useAuth';

/**
 * @param {string|string[]}  role      - Required role(s)
 * @param {React.ReactNode}  children  - Rendered when role matches
 * @param {React.ReactNode}  [fallback]- Rendered when role does not match (default: null)
 */
const RoleGuard = ({ role, children, fallback = null }) => {
  const { hasRole } = useAuth();

  if (!hasRole(role)) {
    return fallback;
  }

  return children;
};

export default RoleGuard;
