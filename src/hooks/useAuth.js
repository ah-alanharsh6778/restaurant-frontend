/**
 * useAuth — Re-export from usePermission for backward compatibility.
 * Existing imports of useAuth from hooks/useAuth.js will continue to work.
 */
export { useAuth as default, useAuth } from './usePermission';
