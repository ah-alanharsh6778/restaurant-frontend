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

import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AnalyticsDashboard from '../pages/Dashboard/AnalyticsDashboard';
import TablesPage from '../pages/Tables/TablesPage';
import MenuPage from '../pages/Menu/MenuPage';
import IngredientsPage from '../pages/Ingredients/IngredientsPage';
import RecipesPage from '../pages/Recipes/RecipesPage';
import OrdersPage from '../pages/Orders/OrdersPage';
import SuppliersPage from '../pages/Suppliers/SuppliersPage';
import PurchaseOrdersPage from '../pages/PurchaseOrders/PurchaseOrdersPage';
import InventoryDashboard from '../pages/Inventory/InventoryDashboard';
import ExpensesDashboard from '../pages/Expenses/ExpensesDashboard';
import InvoicesPage from '../pages/invoices/InvoicesPage';
import ReportsPage from '../pages/Dashboard/ReportsPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import UserProfilePage from '../pages/profile/UserProfilePage';
import RoleManagementPage from '../pages/roles/RoleManagementPage';
import UserManagementPage from '../pages/Users/UserManagementPage';
import CustomersPage from '../pages/customers/CustomersPage';
import TableOrderPage from '../pages/public/TableOrderPage';

import UnauthorizedPage from '../pages/error/UnauthorizedPage';
import ForbiddenPage from '../pages/error/ForbiddenPage';
import NotFoundPage from '../pages/error/NotFoundPage';
import ServerErrorPage from '../pages/error/ServerErrorPage';
import DesignSystemShowcase from '../components/design-system/DesignSystemShowcase';
import LayoutShowcase from '../components/design-system/LayoutShowcase';
import ComponentShowcase from '../components/design-system/ComponentShowcase';
import ProtectedRoute from './ProtectedRoute';

// Real backend role enum values
const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CHEF: 'CHEF',
  WAITER: 'WAITER',
  STAFF: 'STAFF',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
};

const AppRoutes = () => {
  return (
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
  );
};

export default AppRoutes;
