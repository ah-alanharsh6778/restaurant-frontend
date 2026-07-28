# FRONTEND_PROGRESS.md — RestaurantOS Frontend Implementation Status

## Module Progress Matrix

| Module / Page | Route | Status | Backend APIs Integrated | Roles Allowed |
|---|---|---|---|---|
| **Auth (Login/Register)** | `/login`, `/register` | ✅ Completed | `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh` | Public |
| **User Profile** | `/profile` | ✅ Completed | `GET /users/profile`, `GET /sessions/my-sessions`, `DELETE /sessions/:id`, `POST /sessions/revoke-all`, `GET /activity-logs` | Any Authenticated |
| **Users Directory** | `/users` | ✅ Completed | `GET /users`, `GET /roles`, `POST /auth/register` | MANAGER (requires MANAGE/USERS permission) |
| **Roles & RBAC Matrix** | `/roles` | ✅ Completed | `GET /roles`, `POST /roles`, `PUT /roles/:id`, `DELETE /roles/:id`, `GET /permissions`, `GET /permissions/role/:roleId`, `POST /permissions/assign-role` | ADMIN |
| **Executive Dashboard** | `/dashboard` | ✅ Completed | `GET /dashboard/summary`, `GET /dashboard/weekly-sales`, `GET /dashboard/top-selling-menu`, `GET /customers`, `GET /expenses`, `GET /suppliers` | Any Authenticated |
| **Tables Management (POS)** | `/tables` | ✅ Completed | `GET /tables`, `POST /tables`, `PUT /tables/:id`, `PATCH /tables/:id/status`, `DELETE /tables/:id`, `GET /tables/availability`, `GET /tables/public/:id` | ADMIN, MANAGER, STAFF, WAITER |
| **Orders & POS Ticketing** | `/orders` | ✅ Completed | `GET /orders`, `POST /orders`, `PUT /orders/:id`, `DELETE /orders/:id`, `POST /orders/items`, `DELETE /orders/items/:id` | ADMIN, MANAGER, CHEF, WAITER |
| **Menu Catalog** | `/menu` | ✅ Completed | `GET /menu`, `POST /menu`, `PUT /menu/:id`, `DELETE /menu/:id`, `GET /menu/categories`, `POST /menu/categories` | ADMIN, MANAGER, CHEF, WAITER |
| **Ingredients Catalog** | `/ingredients` | ✅ Completed | `GET /ingredients`, `POST /ingredients`, `PUT /ingredients/:id`, `DELETE /ingredients/:id` | ADMIN, MANAGER, CHEF, INVENTORY_MANAGER |
| **Recipes & Formulations** | `/recipes` | ✅ Completed | `GET /recipes`, `POST /recipes`, `PUT /recipes/:id`, `DELETE /recipes/:id` | ADMIN, MANAGER, CHEF |
| **Suppliers Directory** | `/suppliers` | ✅ Completed | `GET /suppliers`, `POST /suppliers`, `PUT /suppliers/:id`, `DELETE /suppliers/:id` | ADMIN, MANAGER, INVENTORY_MANAGER |
| **Purchase Orders** | `/purchase-orders` | ✅ Completed | `GET /purchase-orders`, `POST /purchase-orders`, `PUT /purchase-orders/:id`, `DELETE /purchase-orders/:id` | ADMIN, MANAGER, INVENTORY_MANAGER |
| **Stock & Warehouses** | `/inventory` | ✅ Completed | `GET /inventory/products`, `POST /inventory/products`, `PUT /inventory/products/:id`, `DELETE /inventory/products/:id`, `GET /inventory/warehouses`, `POST /inventory/stock-in`, `POST /inventory/stock-out`, `GET /inventory/stock-history` | ADMIN, MANAGER, CHEF, INVENTORY_MANAGER |
| **Expenses Dashboard** | `/expenses` | ✅ Completed | `GET /expenses`, `POST /expenses`, `PUT /expenses/:id`, `DELETE /expenses/:id`, `POST /expenses/upload`, `GET /expenses/export` | ADMIN, MANAGER |
| **Invoice AI OCR** | `/invoices` | ✅ Completed | `GET /invoices`, `POST /invoices/upload`, `POST /invoices/:id/process`, `POST /invoices/:id/reprocess`, `DELETE /invoices/:id` | ADMIN, MANAGER |
| **Customer Directory** | `/customers` | ✅ Completed | `GET /customers`, `POST /customers`, `PUT /customers/:id`, `DELETE /customers/:id` | ADMIN, MANAGER, WAITER |
| **Reports & Telemetry** | `/reports` | ✅ Completed | `GET /dashboard/summary`, `GET /dashboard/sales-overview`, `GET /dashboard/orders`, `GET /dashboard/revenue`, `GET /dashboard/profit`, `GET /dashboard/monthly-expense`, `GET /dashboard/weekly-sales`, `GET /expenses/export`, `GET /activity-logs`, `GET /invoices` | ADMIN, MANAGER |
| **Settings Dashboard** | `/settings` | ✅ Completed | Integrates theme preferences, system configuration & RBAC rules | ADMIN, MANAGER |
| **Table QR Ordering (Guest)** | `/table-order/:tableId` | ✅ Completed | `GET /tables/public/:id`, `GET /menu/public/categories`, `GET /menu/public/items`, `POST /orders/public`, `GET /orders/:id/invoice-pdf` | Public (No auth required) |
| **Error Pages** | `/401`, `/403`, `/404`, `/500` | ✅ Completed | Error handling & HTTP status routing | Public |

---

## Last Completed Feature
- **Restaurant Table QR Code Ordering System (`/table-order/:tableId` & `/tables`)**:
  - Full end-to-end QR code table ordering flow: Table QR Code Modal Generation (`TableQrModal.jsx` on `/tables`) → Public Customer Mobile Page (`TableOrderPage.jsx`) → Public Table Fetch (`GET /api/tables/public/:id`) → Public Menu Categories & Dishes (`GET /api/menu/public/...`) → Slide-over Cart → Public Order Submission (`POST /api/orders/public`) → Auto Table Occupancy (`Table.status = OCCUPIED`) → Kitchen Queue Sync → Printable Invoice PDF Receipt (`GET /api/orders/:id/invoice-pdf`) → Payment Processing (`POST /api/payments`) → Automatic Table Release (`Table.status = AVAILABLE`).
  - Zero mock data. Fully tested with backend integration test suite in `tests/api.test.js`.
- **Executive Dashboard Enterprise SaaS Refactor (`/dashboard`)**:
  - Refactored the Executive Dashboard UI to meet Enterprise SaaS ERP standards while preserving pure real backend API integration (`GET /api/dashboard/summary`, `GET /api/dashboard/weekly-sales`, `GET /api/dashboard/top-selling-menu`, `GET /api/tables`, `GET /api/expenses`, `GET /api/customers`, `GET /api/suppliers`).
  - Standardized grid system and container layout with `24px` - `32px` page padding, `24px` - `32px` inter-section gaps (`mb: 4`), `24px` card padding, `24px` border radius, backdrop blur (`20px`), and subtle elevation shadows.
  - Eliminated card overlap, flex-wrap text collisions (e.g. trend badges), and debug API route text strings in subtitles.
  - Fixed dark mode translucent glass backdrop rendering across StatCards, GlassCards, and standard surface Cards.
  - Zero mock data used. Fully tested with Vite build and Jest backend integration tests.
