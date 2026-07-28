# CHANGELOG.md — RestaurantOS Project Changelog

All notable changes to the RestaurantOS codebase are documented in this file.

## [2.4.0] - 2026-07-28

### Verified & Refactored
- **Application-Wide Table UI Standard Refactoring (`CommonDataGrid` & `Table`)**:
  - Unified all data grid and table UI components across the application ([OrderTable.jsx](file:///e:/restaurant-frontends/src/pages/Orders/OrderTable.jsx), [PurchaseOrderTable.jsx](file:///e:/restaurant-frontends/src/pages/PurchaseOrders/PurchaseOrderTable.jsx), [SupplierTable.jsx](file:///e:/restaurant-frontends/src/pages/Suppliers/SupplierTable.jsx), [TableDataGrid.jsx](file:///e:/restaurant-frontends/src/pages/Tables/TableDataGrid.jsx), [ProductTable.jsx](file:///e:/restaurant-frontends/src/pages/Inventory/ProductTable.jsx), [IngredientTable.jsx](file:///e:/restaurant-frontends/src/pages/Ingredients/IngredientTable.jsx), [CategoryTable.jsx](file:///e:/restaurant-frontends/src/pages/Menu/CategoryTable.jsx), [MenuItemTable.jsx](file:///e:/restaurant-frontends/src/pages/Menu/MenuItemTable.jsx), [RecipeTable.jsx](file:///e:/restaurant-frontends/src/pages/Recipes/RecipeTable.jsx), [ExpenseCategoryTable.jsx](file:///e:/restaurant-frontends/src/pages/Expenses/ExpenseCategoryTable.jsx), [UserManagementPage.jsx](file:///e:/restaurant-frontends/src/pages/Users/UserManagementPage.jsx), [CustomerTable.jsx](file:///e:/restaurant-frontends/src/pages/customers/CustomerTable.jsx), [ReportsPage.jsx](file:///e:/restaurant-frontends/src/pages/Dashboard/ReportsPage.jsx)).
  - Guaranteed zero text overflow, zero text clipping, auto-sized columns with proper tooltips on hover for truncated content.
  - Aligned all user avatars, names, and emails vertically with explicit row height (64px) and 18px cell padding (`px: 2.25`).
  - Standardized sticky table headers, auto-fit role badges, fixed-width status badges, and consistent date formatting.

## [2.3.0] - 2026-07-28

### Verified & Completed
- **Reports & Operational Telemetry Module (`/reports`)**:
  - Full end-to-end real backend analytics and audit telemetry integration across 9 dedicated register tabs:
    1. Sales Register (`GET /api/orders`)
    2. Expense Register (`GET /api/expenses`)
    3. Inventory Telemetry (`GET /api/inventory/products`)
    4. Purchase Orders (`GET /api/purchase-orders`)
    5. Supplier Register (`GET /api/suppliers`)
    6. Customer Register (`GET /api/customers`)
    7. Waste Incidents (`GET /api/waste`)
    8. Audit Telemetry (`GET /api/activity-logs`)
    9. AI Invoice OCR Register (`GET /api/invoices`)
  - Integrated Excel report export (`GET /api/expenses/export`) and printable PDF rendering.
  - Added `getActivityLogs` and `getInvoices` methods to [report.service.js](file:///e:/restaurant-frontends/src/services/report.service.js).
  - Zero hardcoded figures, zero mock data. Fully verified with backend integration tests.

---

## [2.2.0] - 2026-07-28

### Verified & Completed
- **Restaurant Table Management Module (`/tables` & `/orders`)**:
  - Verified and enhanced the complete backend Table Management suite:
    1. Added `GET /api/tables/availability` returning summary metrics for total, available, occupied, reserved, and maintenance tables.
    2. Added `PATCH /api/tables/:id/status` endpoint allowing direct table status state transitions (`AVAILABLE`, `OCCUPIED`, `RESERVED`, `MAINTENANCE`).
    3. Updated role access on `PUT /api/tables/:id` and `PATCH /api/tables/:id/status` to grant `WAITER` role access for real-time POS floor table management.
    4. Verified `POST /api/tables`, `GET /api/tables`, `GET /api/tables/:id`, `GET /api/tables/public/:id`, and `DELETE /api/tables/:id`.
    5. Integrated clean table naming (`Table 1`, `Table 2`) and clean order numbering (`#ORD-101`) across POS Live Orders via [formatters.js](file:///e:/restaurant-frontends/src/utils/formatters.js).
  - Added comprehensive backend integration tests in `tests/api.test.js` (23 / 23 Jest tests PASSED).

---

## [2.1.0] - 2026-07-28

### Added & Completed
- **Restaurant Table QR Code Ordering System (`/table-order/:tableId` & `/tables`)**:
  - Built complete end-to-end QR ordering pipeline:
    1. Table QR Code Generator Modal ([TableQrModal.jsx](file:///e:/restaurant-frontends/src/components/tables/TableQrModal.jsx)) on `/tables` with high-res QR rendering, link copying, and printable QR card generator.
    2. Mobile-first Public Customer Ordering Page ([TableOrderPage.jsx](file:///e:/restaurant-frontends/src/pages/public/TableOrderPage.jsx)) at `/table-order/:tableId`.
    3. Public Backend APIs: `GET /api/tables/public/:id`, `GET /api/menu/public/categories`, `GET /api/menu/public/items`, `POST /api/orders/public`.
    4. Automatic Table Occupancy: order creation automatically sets `RestaurantTable.status = OCCUPIED`.
    5. Printable Receipt / Invoice PDF API: `GET /api/orders/:id/invoice-pdf` generating formatted HTML & printable receipt layout.
    6. Payment & Table Release: processing payment automatically sets order status to `COMPLETED` and releases dining table (`Table.status = AVAILABLE`).
    7. Automated Dashboard Synchronization: Table occupancy rate, weekly revenue, and top-selling dishes update dynamically.
  - Added comprehensive integration test in `tests/api.test.js` (22 / 22 Jest tests PASSED).

---

## [2.0.0] - 2026-07-28

### Added & Refactored
- **Executive Dashboard Enterprise SaaS UI Refactor (`/dashboard`)**:
  - Complete UI/UX refactoring to Enterprise SaaS ERP standards while strictly retaining 100% real backend API integration (`GET /api/dashboard/summary`, `GET /api/dashboard/weekly-sales`, `GET /api/dashboard/top-selling-menu`, `GET /api/tables`, `GET /api/expenses`, `GET /api/customers`, `GET /api/suppliers`).
  - Standardized unified layout system across fixed sidebar (`260px` / `72px`), sticky glass topbar (`Navbar.jsx`), and content wrapper (`PageContainer.jsx`).
  - Applied strict grid spacing (`spacing={3.5}`), card height uniformity (`height: '100%'`), `24px` card padding, `24px` border radius, and `20px` backdrop blur (`backdropFilter: 'blur(20px) saturate(180%)'`).
  - Resolved dark mode opacity glitches, removed debug API route subtitle strings, and fixed trend chip text wrapping in [StatCard.jsx](file:///e:/restaurant-frontends/src/components/ui/StatCard.jsx), [GlassCard.jsx](file:///e:/restaurant-frontends/src/components/ui/GlassCard.jsx), and [Card.jsx](file:///e:/restaurant-frontends/src/components/ui/Card.jsx).
  - Added live Open Tables POS indicator card displaying occupied vs available tables ratio and instant table map navigation.
  - Removed Waste Management item from sidebar navigation ([Sidebar.jsx](file:///e:/restaurant-frontends/src/layout/Sidebar.jsx)), unmounted `/waste` route from [AppRoutes.jsx](file:///e:/restaurant-frontends/src/routes/AppRoutes.jsx), and deleted `WastePage.jsx` component as requested.
  - Zero mock data or fake statistics added. Full loading, error, empty, and success state handling verified.

---

## [1.9.0] - 2026-07-28

### Added & Refactored
- **Ingredient & Stock Management Module (`/ingredients` & `/inventory`)**:
  - Verified full end-to-end stock workflow: Ingredient CRUD → Low Stock Warning Alerts → Stock In increment via Purchase Orders → Stock Decrement via Recipe Consumption & Waste Logging → Stock Movement History.
  - Backend fixes: added `costPerUnit` to `IngredientDTO` in [dtos/index.js](file:///e:/restaurant-backend/src/dtos/index.js) and case-insensitive name searching in [ingredient.repository.js](file:///e:/restaurant-backend/src/modules/ingredient/ingredient.repository.js).
  - UI layout update: removed the card header title block in [IngredientToolbar.jsx](file:///e:/restaurant-frontends/src/pages/Ingredients/IngredientToolbar.jsx) and left-aligned the Search input, Status filter, Unit filter, and Low Stock Alert button.
  - Added `Cost / Unit` column to [IngredientTable.jsx](file:///e:/restaurant-frontends/src/pages/Ingredients/IngredientTable.jsx) and input/detail fields to [IngredientDialog.jsx](file:///e:/restaurant-frontends/src/pages/Ingredients/IngredientDialog.jsx) & [IngredientDetailsDialog.jsx](file:///e:/restaurant-frontends/src/pages/Ingredients/IngredientDetailsDialog.jsx).
  - Added comprehensive backend integration test suite in `tests/api.test.js`.

---

## [1.8.0] - 2026-07-28

### Added & Completed
- **AI Invoice Processing & OCR Workflow (`/invoices`)**:
  - Audited and verified complete end-to-end user flow: Drag & Drop Upload (PDF/Image) → Client-side File Validation → OCR Processing → AI Data Extraction → Duplicate Detection (HTTP 409 Conflict) → Atomic Invoice & Line Items Storage → Auto-created Expense Entry → Invoice History & Details Drawer.
  - Added static file serving (`app.use('/uploads', express.static(...))`) in Express backend [app.js](file:///e:/restaurant-backend/src/app.js).
  - Added **View / Download Original Invoice File** button in [InvoiceDetailDrawer.jsx](file:///e:/restaurant-frontends/src/pages/invoices/InvoiceDetailDrawer.jsx) linking to uploaded asset files.
  - Fully handled all UI states: Loading, Processing, Success, Validation Errors, OCR Errors, Duplicate Invoice Errors (409 Conflict modal), API Errors, and Empty States.
  - Zero mock data used. Integrated pure Axios calls to `/api/invoices` endpoints with QueryClient cache synchronization.

---

## [1.7.0] - 2026-07-28

### Added & Completed
- **Order → Invoice → Payment → Table Release Workflow (`/orders`)**:
  - Built [OrderInvoicePaymentDialog.jsx](file:///e:/restaurant-frontends/src/pages/orders/OrderInvoicePaymentDialog.jsx) modal for complete end-to-end checkout.
  - Added **Generate Invoice & Pay** action button to `OrderTable.jsx` and `OrderDetailsDialog.jsx`.
  - Integrated `paymentService.processPayment({ orderId, paymentMethod, amountPaid })` with backend `payment.repository.js` transaction.
  - Enhanced backend `payment.repository.js` transaction to automatically release assigned restaurant table (`Occupied` → `AVAILABLE`) upon payment completion.
  - Added discount & tax amount adjustment support in `order.service.js` and `order.repository.js`.
  - Auto-refreshes linked QueryClient caches (`orders`, `tables`, `invoices`, `dashboard`).

---

## [1.6.1] - 2026-07-28

### Fixed & Audited
- **Customer Directory Module (`/customers`)**:
  - Fixed root cause of Delete issue in [customer.repository.js](file:///e:/restaurant-backend/src/modules/customer/customer.repository.js): added `{ isDeleted: false }` filter to `findAll` database query so soft-deleted customers are removed from list views immediately upon deletion.
  - Aligned RBAC permissions in [CustomerTable.jsx](file:///e:/restaurant-frontends/src/pages/customers/CustomerTable.jsx) with backend Express middleware (`ADMIN` and `MANAGER` roles).
  - Verified 100% real Axios backend API integration for `GET /api/customers`, `POST /api/customers`, `GET /api/customers/:id`, `PUT /api/customers/:id`, and `DELETE /api/customers/:id` with zero mock data.

---

## [1.6.0] - 2026-07-28

### Refactored & Verified
- **AI Invoice OCR & Expense Pipeline (`/invoices`)**:
  - Refactored [InvoicesPage.jsx](file:///e:/restaurant-frontends/src/pages/invoices/InvoicesPage.jsx) using the master `PageContainer` layout and design system.
  - Fixed runtime `ReferenceError` when clicking header Refresh button by integrating `useQueryClient` cache invalidation.
  - Verified full pipeline: Drag & Drop Upload → Tesseract OCR Text Extraction → OpenAI JSON Parsing → HTTP 409 Conflict Duplicate Warning Modal → Automatic Expense Entry Creation.
  - Verified invoice line item breakdown in [InvoiceDetailDrawer.jsx](file:///e:/restaurant-frontends/src/pages/invoices/InvoiceDetailDrawer.jsx).

---

## [1.5.0] - 2026-07-28

### Added & Completed
- **Reports & Operational Telemetry (`/reports`)**:
  - Connected `ReportsPage.jsx` directly to backend Express analytics endpoints (`reportService`, `orderService`, `expenseService`, `inventoryService`, `purchaseOrderService`, `supplierService`, `customerService`, `wasteService`).
  - Created [report.service.js](file:///e:/restaurant-frontends/src/services/report.service.js) to connect to real backend dashboard and export APIs (`GET /api/dashboard/...` and `GET /api/expenses/export`).
  - Implemented 7 live report registers: Sales, Expenses, Inventory, Purchase Orders, Suppliers, Customers, and Waste Incidents.
  - Real Excel export powered by backend endpoint `GET /api/expenses/export` and Print/PDF report register generation.
  - Placed **Reports & Telemetry** under **Analytics & Reports** section near the bottom of [Sidebar.jsx](file:///e:/restaurant-frontends/src/layout/Sidebar.jsx).

---

## [1.4.1] - 2026-07-28

### Refactored & Enhanced
- **User & Staff Management (`/users`)**:
  - Connected `UserManagementPage.jsx` directly to backend Express `/api/staff` endpoints (`GET /api/staff`, `POST /api/staff`, `PUT /api/staff/:id`, `DELETE /api/staff/:id`) and `/api/users` / `/api/auth/register`.
  - Refactored [staff.service.js](file:///e:/restaurant-frontends/src/services/staff.service.js) to execute real `/api/staff` HTTP requests with zero dummy or mock fallbacks.
  - Implemented dual-tab view (**User Accounts** vs **Staff Employment Profiles**) with complete creation, editing, deletion, and role assignment.
  - Fixed DataGrid table overlapping and container clipping issues by applying clean responsive overflow wrappers (`width: 100%`, `overflowX: auto`).

---

## [1.4.0] - 2026-07-28

### Added & Completed
- **Food Waste Telemetry Module (`/waste`)**:
  - Built `WastePage.jsx` and connected to backend endpoints `GET /api/waste`, `POST /api/waste`, and `GET /api/waste/stats`.
  - Created `waste.service.js` for pure Axios backend integration with zero mock data.
  - Automatically calculates financial loss (`costLost`) and deducts ingredient stock in a database transaction when waste is logged.
  - Supports all Prisma `WasteReason` enum values (`EXPIRED`, `SPOILED`, `COOKING_ERROR`, `CUSTOMER_RETURN`, `DAMAGE`).
  - Added route protection for `ADMIN`, `MANAGER`, and `CHEF` roles.
  - Added **Waste Management** menu item with `DeleteSweepIcon` under Inventory section in `Sidebar.jsx`.

---

## [1.3.1] - 2026-07-28

### Changed & Fixed
- **User Management (`/users`)**:
  - Renamed sidebar menu item from `"Staff & Users"` to `"User Management"`.
  - Updated route protection in [AppRoutes.jsx](file:///e:/restaurant-frontends/src/routes/AppRoutes.jsx) to explicitly allow `ADMIN` and `MANAGER` roles, fixing the 403 redirect issue when opening the User Management page.

---

## [1.3.0] - 2026-07-28

### Added & Refactored
- **Restaurant Table Management (`/tables`)**:
  - Connected `TablesPage.jsx` directly to backend endpoints `GET /api/tables`, `POST /api/tables`, `PUT /api/tables/:id`, and `DELETE /api/tables/:id`.
  - Refactored `table.service.js` to eliminate fake error fallbacks and pass real backend errors cleanly up to callers.
  - Supports all valid Prisma `TableStatus` enum values (`AVAILABLE`, `OCCUPIED`, `RESERVED`, `MAINTENANCE`).
  - Added role-based access control (RBAC): `ADMIN` & `MANAGER` can create and delete tables; `ADMIN`, `MANAGER`, `STAFF`, and `WAITER` can update table status.
  - Verified loading spinners, empty state dialogs, error alerts, and far-right top header actions (`Refresh` and `Add New Table`).

---

## [1.2.2] - 2026-07-28

### Removed & Refactored
- **Help Center (`/help`)**:
  - Deleted `HelpCenterPage.jsx` and removed `src/pages/help/` directory as requested.
  - Removed Help Center entries from `Sidebar.jsx`, `Navbar.jsx`, `AppRoutes.jsx`, and `rbac.js`.
  - Fixed React 19 object child rendering errors across DataGrid components (`OrderTable.jsx`, `RecipeTable.jsx`, `PurchaseOrderTable.jsx`, `MenuItemTable.jsx`, `ProductsPage.jsx`).
  - Standardized far-right shift alignment for header action buttons (`Refresh` & `Add/Create`) across all module pages.

---

## [1.2.1] - 2026-07-28

### Fixed & Enhanced
- **User Accounts Directory (`/users`)**:
  - Connected `UserManagementPage.jsx` to real backend endpoints `GET /api/users`, `GET /api/roles`, and `POST /api/auth/register`.
  - Registration form dynamically fetches real backend Role UUIDs (`roleId`) and required fields (`fullName`, `email`, `password`, `phone`, `roleId`).
  - Removed unsupported fake user update/delete methods that failed on the backend.
  - Clean data grid rendering with active status indicators, role chips, and member creation dates.

---

## [1.2.0] - 2026-07-28

### Added & Enhanced
- **RBAC & Permission Module (`/roles`, `Sidebar.jsx`, `ProtectedRoute.jsx`)**:
  - Connected `RoleManagementPage.jsx` to real backend APIs (`GET /api/roles`, `GET /api/permissions`, `GET /api/permissions/role/:roleId`, `POST /api/permissions/assign-role`).
  - Added real-time permission toggling & role creation/updates using backend Prisma RoleName enum (`ADMIN`, `MANAGER`, `CHEF`, `WAITER`, `STAFF`, `INVENTORY_MANAGER`).
  - Dynamically filters sidebar nav sections & items according to authenticated user role and permissions.
  - Enforced strict client-side & server-side access control with proper `/401` Unauthorized and `/403` Forbidden HTTP status handling.

---

## [1.1.0] - 2026-07-28

### Added
- Created complete documentation suite in `docs/`:
  - `MASTER_RULES.md`
  - `PROJECT_ARCHITECTURE.md`
  - `DATABASE_SCHEMA.md`
  - `API_MAPPING.md`
  - `AUTH_FLOW.md`
  - `RBAC.md`
  - `INVOICE_FLOW.md`
  - `FRONTEND_PROGRESS.md`
  - `CHANGELOG.md`
  - `TODO.md`
  - `BACKEND_PROGRESS.md`
  - `README.md`
  - `UI_DESIGN_SYSTEM.md`
  - `FOLDER_STRUCTURE.md`
  - `COMPONENT_STRUCTURE.md`
  - `API_STATUS.md`

### Enhanced
- **User Profile Module (`/profile`)**:
  - Integrated `GET /api/users/profile` to load real user profile data.
  - Integrated `GET /api/sessions/my-sessions` to fetch live active sessions for the user.
  - Integrated `DELETE /api/sessions/:id` for individual session revocation.
  - Integrated `POST /api/sessions/revoke-all` to revoke all other user sessions.
  - Integrated `GET /api/activity-logs` to render real user audit logs.

### Fixed
- Fixed missing `Typography` import in `src/layout/Navbar.jsx`.
- Removed redundant "Refresh Data" button from `src/pages/Dashboard/index.jsx`.
- Removed "Upload OCR Invoice" and "Processed OCR Invoices" section from `src/pages/Dashboard/AnalyticsDashboard.jsx`.
- Fixed invalid empty `actions={}` JSX syntax in `AnalyticsDashboard.jsx` causing Vite parse errors.
