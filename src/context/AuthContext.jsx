/* eslint-disable react-refresh/only-export-components */
/**
 * RestaurantOS — Production AuthContext
 *
 * Responsibilities:
 *  1. Login / logout / token refresh
 *  2. Profile validation on mount via GET /users/profile
 *  3. Permission loading via GET /permissions/role/:roleId
 *  4. Exposes hasPermission(action, resource) and hasRole(roleName)
 *
 * All data comes from real backend APIs — no mocking.
 */

import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../config/axios';
import { clearAuth, setTokens, setUser, getToken, getUser, getRefreshToken } from '../utils/storage';
import { normaliseRole } from '../utils/rbac';

// ─── Context Shape ────────────────────────────────────────────────────────────
export const AuthContext = createContext({
  user: null,
  token: null,
  permissions: [],     // Array of { id, name, action, resource }
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
  refresh: async () => {},
  hasPermission: (action, resource) => false,
  hasRole: (roleName) => false,
});

// ─── Helper: Fetch user's permissions from backend ───────────────────────────
const fetchUserPermissions = async (roleId) => {
  if (!roleId) return [];
  try {
    const res = await axiosInstance.get(`/permissions/role/${roleId}`);
    // Response: { success: true, data: [ { id, name, action, resource, ... } ] }
    return res.data?.data || [];
  } catch {
    return [];
  }
};

// ─── Helper: Fetch user profile and return user + permissions ─────────────────
const fetchProfileAndPermissions = async () => {
  const res = await axiosInstance.get('/users/profile');
  // Response: { success: true, data: UserDTO }
  const user = res.data?.data || res.data;
  const roleId = user?.roleId;
  const permissions = await fetchUserPermissions(roleId);
  return { user, permissions };
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getUser());
  const [token, setTokenState] = useState(() => getToken());
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // ── On Mount: Validate existing session ──────────────────────────────────
  useEffect(() => {
    isMounted.current = true;

    const initAuth = async () => {
      const existingToken = getToken();
      if (!existingToken) {
        clearAuth();
        if (isMounted.current) {
          setUserState(null);
          setTokenState(null);
          setPermissions([]);
          setLoading(false);
        }
        return;
      }

      try {
        const { user: fetchedUser, permissions: fetchedPerms } = await fetchProfileAndPermissions();

        if (isMounted.current) {
          setTokenState(existingToken);
          setUserState(fetchedUser);
          setUser(fetchedUser);
          setPermissions(fetchedPerms);
        }
      } catch {
        // Token invalid / expired — try refresh
        const refreshTokenStr = getRefreshToken();
        if (refreshTokenStr) {
          try {
            const refreshRes = await axiosInstance.post('/auth/refresh', { refreshToken: refreshTokenStr });
            const { accessToken, refreshToken: newRefresh } = refreshRes.data?.data || {};
            if (accessToken) {
              setTokens(accessToken, newRefresh);
              const { user: refreshedUser, permissions: refreshedPerms } = await fetchProfileAndPermissions();
              if (isMounted.current) {
                setTokenState(accessToken);
                setUserState(refreshedUser);
                setUser(refreshedUser);
                setPermissions(refreshedPerms);
              }
              return;
            }
          } catch {
            // Refresh also failed
          }
        }
        clearAuth();
        if (isMounted.current) {
          setUserState(null);
          setTokenState(null);
          setPermissions([]);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    const data = res.data;

    // Response: { success, message, data: { accessToken, refreshToken, user } }
    if (!data?.success || !data?.data) {
      throw new Error(data?.message || 'Login failed');
    }

    const { accessToken, refreshToken: refreshTokenStr, user: loggedUser } = data.data;

    setTokens(accessToken, refreshTokenStr);
    setUser(loggedUser);

    // Fetch permissions for this user's role
    const perms = await fetchUserPermissions(loggedUser?.roleId);

    if (isMounted.current) {
      setTokenState(accessToken);
      setUserState(loggedUser);
      setPermissions(perms);
    }

    return { user: loggedUser, token: accessToken, permissions: perms };
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearAuth();
    if (isMounted.current) {
      setUserState(null);
      setTokenState(null);
      setPermissions([]);
    }
  }, []);

  // ── Token Refresh ─────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    const refreshTokenStr = getRefreshToken();
    if (!refreshTokenStr) throw new Error('No refresh token available');

    const res = await axiosInstance.post('/auth/refresh', { refreshToken: refreshTokenStr });
    const { accessToken, refreshToken: newRefresh } = res.data?.data || {};

    if (!accessToken) throw new Error('Refresh failed');

    setTokens(accessToken, newRefresh);
    if (isMounted.current) {
      setTokenState(accessToken);
    }
    return accessToken;
  }, []);

  // ── RBAC Helpers ──────────────────────────────────────────────────────────
  /**
   * Check if the current user has a specific permission.
   * Matches against the permission array fetched from the backend.
   * ADMIN bypasses all checks.
   *
   * @param {string} action   - e.g. 'CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'
   * @param {string} resource - e.g. 'ORDERS', 'INVENTORY', 'USERS', 'EXPENSES'
   */
  const hasPermission = useCallback((action, resource) => {
    const role = normaliseRole(user?.role);
    // ADMIN bypasses granular permission checks (mirrors backend behaviour)
    if (role === 'ADMIN') return true;

    return permissions.some(
      (p) =>
        p.action?.toUpperCase() === action?.toUpperCase() &&
        p.resource?.toUpperCase() === resource?.toUpperCase()
    );
  }, [user, permissions]);

  /**
   * Check if the current user has a specific role.
   *
   * @param {string|string[]} roleName - 'ADMIN' or ['ADMIN', 'MANAGER']
   */
  const hasRole = useCallback((roleName) => {
    const currentRole = normaliseRole(user?.role);
    if (!currentRole) return false;

    if (Array.isArray(roleName)) {
      return roleName.some((r) => r.toUpperCase() === currentRole);
    }
    return roleName.toUpperCase() === currentRole;
  }, [user]);

  // ── Context Value ─────────────────────────────────────────────────────────
  const value = {
    user,
    token,
    permissions,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout,
    refresh,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
