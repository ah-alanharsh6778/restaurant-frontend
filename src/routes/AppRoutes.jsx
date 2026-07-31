/**
 * RestaurantOS — Application Routes
 *
 * All allowedRoles values use EXACT backend Prisma RoleName enum values:
 *   ADMIN | MANAGER | CHEF | WAITER | STAFF | INVENTORY_MANAGER
 *
 * Route access matrix is derived from backend role.routes.js and the
 * ROLE_ROUTE_ACCESS map in rbac.js.
 *
 * ADMIN always has full access (ADMIN bypass is applied in ProtectedRoute).
 */

import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import ProtectedRoute from './ProtectedRoute';

// Pre-load route functions
const prefetchRoutes = () => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      import('../pages/Dashboard/AnalyticsDashboard');
      import('../pages/Tables/TablesPage');
      import('../pages/Orders/OrdersPage');
      import('../pages/Menu/MenuPage');
      import('../pages/Inventory/InventoryDashboard');
      import('../pages/customers/CustomersPage');
      import('../pages/Expenses/ExpensesDashboard');
    });
  }
};

// Lazy-loaded pages for optimal bundle splitting & instant login load
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const AnalyticsDashboard = lazy(() => import('../pages/Dashboard/AnalyticsDashboard'));
const TablesPage = lazy(() => import('../pages/Tables/TablesPage'));
const MenuPage = lazy(() => import('../pages/Menu/MenuPage'));
const IngredientsPage = lazy(() => import('../pages/Ingredients/IngredientsPage'));
const RecipesPage = lazy(() => import('../pages/Recipes/RecipesPage'));
const OrdersPage = lazy(() => import('../pages/Orders/OrdersPage'));
const SuppliersPage = lazy(() => import('../pages/Suppliers/SuppliersPage'));
const PurchaseOrdersPage = lazy(() => import('../pages/PurchaseOrders/PurchaseOrdersPage'));
const InventoryDashboard = lazy(() => import('../pages/Inventory/InventoryDashboard'));
const ExpensesDashboard = lazy(() => import('../pages/Expenses/ExpensesDashboard'));
const InvoicesPage = lazy(() => import('../pages/invoices/InvoicesPage'));
const ReportsPage = lazy(() => import('../pages/Dashboard/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const UserProfilePage = lazy(() => import('../pages/profile/UserProfilePage'));
const RoleManagementPage = lazy(() => import('../pages/roles/RoleManagementPage'));
const UserManagementPage = lazy(() => import('../pages/Users/UserManagementPage'));
const CustomersPage = lazy(() => import('../pages/customers/CustomersPage'));
const TableOrderPage = lazy(() => import('../pages/public/TableOrderPage'));

const UnauthorizedPage = lazy(() => import('../pages/error/UnauthorizedPage'));
const ForbiddenPage = lazy(() => import('../pages/error/ForbiddenPage'));
const NotFoundPage = lazy(() => import('../pages/error/NotFoundPage'));
const ServerErrorPage = lazy(() => import('../pages/error/ServerErrorPage'));
const DesignSystemShowcase = lazy(() => import('../components/design-system/DesignSystemShowcase'));
const LayoutShowcase = lazy(() => import('../components/design-system/LayoutShowcase'));
const ComponentShowcase = lazy(() => import('../components/design-system/ComponentShowcase'));

// Real backend role enum values
const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CHEF: 'CHEF',
  WAITER: 'WAITER',
  STAFF: 'STAFF',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
};

// Page loading fallback indicator
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      width: '100%',
    }}
  >
    <CircularProgress color="primary" size={36} />
  </Box>
);

const AppRoutes = () => {
  useEffect(() => {
    prefetchRoutes();
  }, []);
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/table-order/:tableId" element={<TableOrderPage />} />
        <Route path="/design-system" element={<DesignSystemShowcase />} />
        <Route path="/layout-demo" element={<LayoutShowcase />} />
        <Route path="/components-demo" element={<ComponentShowcase />} />

        {/* Protected Dashboard & App Routes — Requires authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* Universal Authenticated Routes — Any valid role */}
            <Route path="/dashboard" element={<AnalyticsDashboard />} />
            <Route path="/profile" element={<UserProfilePage />} />

            {/* Customer Directory — ADMIN, MANAGER, WAITER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.WAITER]} />}>
              <Route path="/customers" element={<CustomersPage />} />
            </Route>

            {/* Table POS Management — ADMIN, MANAGER, WAITER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.WAITER]} />}>
              <Route path="/tables" element={<TablesPage />} />
            </Route>

            {/* POS Live Orders — ADMIN, MANAGER, CHEF, WAITER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.CHEF, ROLES.WAITER]} />}>
              <Route path="/orders" element={<OrdersPage />} />
            </Route>

            {/* Menu Catalog — ADMIN, MANAGER, CHEF, WAITER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.CHEF, ROLES.WAITER]} />}>
              <Route path="/menu" element={<MenuPage />} />
            </Route>

            {/* Recipes & Prep — ADMIN, MANAGER, CHEF */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.CHEF]} />}>
              <Route path="/recipes" element={<RecipesPage />} />
            </Route>

            {/* Ingredient Stock — ADMIN, MANAGER, CHEF, INVENTORY_MANAGER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.CHEF, ROLES.INVENTORY_MANAGER]} />}>
              <Route path="/ingredients" element={<IngredientsPage />} />
            </Route>

            {/* Supplier Register — ADMIN, MANAGER, INVENTORY_MANAGER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.INVENTORY_MANAGER]} />}>
              <Route path="/suppliers" element={<SuppliersPage />} />
            </Route>

            {/* Purchase Orders — ADMIN, MANAGER, INVENTORY_MANAGER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.INVENTORY_MANAGER]} />}>
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            </Route>

            {/* Stock Inventory — ADMIN, MANAGER, CHEF, INVENTORY_MANAGER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.CHEF, ROLES.INVENTORY_MANAGER]} />}>
              <Route path="/inventory" element={<InventoryDashboard />} />
            </Route>

            {/* Expenses & AI OCR — ADMIN, MANAGER (backend: READ/EXPENSES permission) */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} requiredPermission={{ action: 'READ', resource: 'EXPENSES' }} />}>
              <Route path="/expenses" element={<ExpensesDashboard />} />
            </Route>

            {/* Invoice OCR Module — ADMIN, MANAGER only (backend enforces 403 for others) */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}>
              <Route path="/invoices" element={<InvoicesPage />} />
            </Route>

            {/* Reports — ADMIN, MANAGER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}>
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            {/* User Management — ADMIN, MANAGER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]} />}>
              <Route path="/users" element={<UserManagementPage />} />
            </Route>

            {/* Roles & RBAC — ADMIN only (backend: only ADMIN can manage roles) */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/roles" element={<RoleManagementPage />} />
            </Route>

            {/* Settings — ADMIN, MANAGER */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}>
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

          </Route>
        </Route>

        {/* Error Pages */}
        <Route path="/401" element={<UnauthorizedPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/500" element={<ServerErrorPage />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
