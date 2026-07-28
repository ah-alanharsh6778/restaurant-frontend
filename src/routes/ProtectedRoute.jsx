/**
 * RestaurantOS — Production ProtectedRoute
 *
 * Enforces two layers of access control that mirror the backend:
 *   1. Authentication — must have valid JWT (via isAuthenticated)
 *   2. Role-Based — must be in allowedRoles array (exact backend enum names)
 *   3. Permission-Based — must have required permission (optional, for fine-grained control)
 *
 * Role names MUST match the backend Prisma RoleName enum:
 *   ADMIN | MANAGER | CHEF | WAITER | STAFF | INVENTORY_MANAGER
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { normaliseRole } from '../utils/rbac';

/**
 * @param {string[]} [allowedRoles]    - Allowed roles (backend enum names). If empty, any role passes.
 * @param {object}   [requiredPermission] - { action, resource } — checked against real permission array.
 * @param {React.ReactNode} [children] - If provided, renders children instead of Outlet.
 */
export const ProtectedRoute = ({ allowedRoles, requiredPermission, children }) => {
  const { user, isAuthenticated, loading, hasPermission } = useAuth();
  const location = useLocation();

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-canvas)',
        }}
      >
        <CircularProgress color="primary" size={40} />
      </Box>
    );
  }

  // ── Not authenticated → redirect to login ────────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── Role check ────────────────────────────────────────────────────────────
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = normaliseRole(user?.role);

    // ADMIN bypasses all role checks (mirrors backend behaviour)
    const isAdmin = userRole === 'ADMIN';

    // Compare using normalised uppercase (backend enum is uppercase)
    const isAllowed = isAdmin || allowedRoles.some((r) => r.toUpperCase() === userRole);

    if (!isAllowed) {
      return <Navigate to="/403" state={{ from: location }} replace />;
    }
  }

  // ── Fine-grained permission check ─────────────────────────────────────────
  if (requiredPermission) {
    const { action, resource } = requiredPermission;
    if (!hasPermission(action, resource)) {
      return <Navigate to="/403" state={{ from: location }} replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
