# API_MAPPING.md — RestaurantOS Complete API Reference

> Base URL: `http://localhost:5000/api`
> Auth: `Authorization: Bearer <accessToken>`
> Response format: `{ success: bool, data: any, message?: string }`

---

## Legend
- 🔓 Public (no auth)
- 🔐 Any authenticated role
- 👑 ADMIN only
- 🧑‍💼 ADMIN, MANAGER
- 🍳 ADMIN, MANAGER, CHEF
- 🧑‍🍽️ ADMIN, MANAGER, WAITER, STAFF
- 📦 ADMIN, MANAGER, INVENTORY_MANAGER
- ✅ Frontend service implemented
- ⚠️ Frontend service missing

---

## Auth (`/api/auth`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| POST | `/auth/register` | 🔓 | Register new user | ✅ auth.service.js |
| POST | `/auth/login` | 🔓 | Login → { accessToken, refreshToken, user } | ✅ auth.service.js |
| POST | `/auth/refresh` | 🔓 | Refresh access token | ✅ AuthContext.jsx |

---

## Users (`/api/users`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/users/profile` | 🔐 | Get current user profile | ✅ user.service.js |
| GET | `/users` | 🧑‍💼 | List all users | ✅ user.service.js |

---

## Roles (`/api/roles`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/roles` | 🔐 | List all roles | ✅ role.service.js |
| POST | `/roles` | 👑 | Create role | ✅ role.service.js |
| GET | `/roles/:id` | 🔐 | Get role by ID | ✅ role.service.js |
| PUT | `/roles/:id` | 👑 | Update role | ✅ role.service.js |
| DELETE | `/roles/:id` | 👑 | Delete role | ✅ role.service.js |
| POST | `/roles/:id/permissions` | 👑 | Assign permissions to role | ✅ role.service.js |

---

## Permissions (`/api/permissions`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/permissions` | 🔐 | List all permissions | ✅ (in AuthContext) |
| GET | `/permissions/role/:roleId` | 🔐 | Get permissions for role | ✅ AuthContext.jsx |

---

## Dashboard (`/api/dashboard`) — All require ADMIN or MANAGER

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/dashboard/summary` | 🧑‍💼 | KPI summary (salesOverview, profit, tables, stock) | ✅ dashboard.service.js |
| GET | `/dashboard/weekly-sales` | 🧑‍💼 | Weekly sales data (7 days) | ✅ dashboard.service.js |
| GET | `/dashboard/monthly-sales` | 🧑‍💼 | Monthly sales data | ✅ dashboard.service.js |
| GET | `/dashboard/yearly-sales` | 🧑‍💼 | Yearly sales data | ⚠️ Not called |
| GET | `/dashboard/top-selling-menu` | 🧑‍💼 | Top 5 menu items (limit query param) | ✅ dashboard.service.js |
| GET | `/dashboard/sales-overview` | 🧑‍💼 | Sales by category | ⚠️ Not called |
| GET | `/dashboard/orders` | 🧑‍💼 | Order breakdown by status | ⚠️ Not called |
| GET | `/dashboard/revenue` | 🧑‍💼 | Revenue metrics | ⚠️ Not called |
| GET | `/dashboard/profit` | 🧑‍💼 | Profit metrics | ⚠️ Not called |
| GET | `/dashboard/table-occupancy` | 🧑‍💼 | Table occupancy stats | ⚠️ Not called |
| GET | `/dashboard/low-stock` | 🧑‍💼 | Low stock alerts | ⚠️ Not called |
| GET | `/dashboard/purchase-summary` | 🧑‍💼 | Purchase order summary | ⚠️ Not called |
| GET | `/dashboard/monthly-expense` | 🧑‍💼 | Monthly expense total | ⚠️ Not called |
| GET | `/dashboard/supplier-summary` | 🧑‍💼 | Supplier summary | ⚠️ Not called |

---

## Customers (`/api/customers`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/customers` | 🧑‍🍽️ | List all customers | ✅ customer.service.js |
| POST | `/customers` | 🧑‍🍽️ | Create customer | ✅ customer.service.js |
| GET | `/customers/:id` | 🧑‍🍽️ | Get customer by ID | ✅ customer.service.js |
| PUT | `/customers/:id` | 🧑‍🍽️ | Update customer | ✅ customer.service.js |
| DELETE | `/customers/:id` | 🧑‍💼 | Delete customer | ✅ customer.service.js |

---

## Tables (`/api/tables`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/tables` | 🔐 | List all tables | ✅ table.service.js |
| GET | `/tables/availability` | 🔐 | Get table availability summary metrics | ✅ table.service.js |
| GET | `/tables/public/:id` | 🔓 | Public table info for QR scan | ✅ table.service.js |
| POST | `/tables` | 🧑‍💼 | Create table | ✅ table.service.js |
| GET | `/tables/:id` | 🔐 | Get table by ID | ✅ table.service.js |
| PUT | `/tables/:id` | 🔐 | Update table number & capacity | ✅ table.service.js |
| PATCH | `/tables/:id/status` | 🔐 | Change table status directly | ✅ table.service.js |
| DELETE | `/tables/:id` | 🧑‍💼 | Delete table | ✅ table.service.js |

---

## Menu (`/api/menu`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/menu/public/categories` | 🔓 | Public menu categories | ✅ menu.service.js |
| GET | `/menu/public/items` | 🔓 | Public menu items | ✅ menu.service.js |
| GET | `/menu/categories` | 🔐 | List menu categories | ✅ menu.service.js |
| POST | `/menu/categories` | 🧑‍💼 | Create category | ✅ menu.service.js |
| GET | `/menu` | 🔐 | List all menu items | ✅ menu.service.js |
| POST | `/menu` | 🧑‍💼 | Create menu item | ✅ menu.service.js |
| GET | `/menu/:id` | 🔐 | Get menu item by ID | ✅ menu.service.js |
| PUT | `/menu/:id` | 🧑‍💼 | Update menu item | ✅ menu.service.js |
| DELETE | `/menu/:id` | 🧑‍💼 | Delete menu item | ✅ menu.service.js |

---

## Ingredients (`/api/ingredients`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/ingredients` | 🔐 | List all ingredients | ✅ ingredient.service.js |
| POST | `/ingredients` | 🔐 | Create ingredient | ✅ ingredient.service.js |
| GET | `/ingredients/:id` | 🔐 | Get ingredient by ID | ✅ ingredient.service.js |
| PUT | `/ingredients/:id` | 🔐 | Update ingredient | ✅ ingredient.service.js |
| DELETE | `/ingredients/:id` | 🧑‍💼 | Delete ingredient | ✅ ingredient.service.js |

---

## Recipes (`/api/recipes`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/recipes` | 🔐 | List all recipes | ✅ recipe.service.js |
| POST | `/recipes` | 🔐 | Create recipe | ✅ recipe.service.js |
| GET | `/recipes/:id` | 🔐 | Get recipe by ID | ✅ recipe.service.js |
| PUT | `/recipes/:id` | 🔐 | Update recipe | ✅ recipe.service.js |
| DELETE | `/recipes/:id` | 🔐 | Delete recipe | ✅ recipe.service.js |

---

## Orders (`/api/orders`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/orders` | 🔐 | List all orders | ✅ order.service.js |
| POST | `/orders` | 🔐 | Create order | ✅ order.service.js |
| GET | `/orders/:id` | 🔐 | Get order by ID | ✅ order.service.js |
| PUT | `/orders/:id` | 🔐 | Update order status | ✅ order.service.js |
| DELETE | `/orders/:id` | 🧑‍💼 | Delete order | ✅ order.service.js |
| POST | `/orders/items` | 🔐 | Add item to order | ✅ order.service.js |
| DELETE | `/orders/items/:id` | 🔐 | Remove item from order | ✅ order.service.js |

---

## Payments (`/api/payments`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/payments` | 🔐 | List all payments | ✅ payment.service.js |
| POST | `/payments` | 🔐 | Process payment | ✅ payment.service.js |
| GET | `/payments/:id` | 🔐 | Get payment by ID | ✅ payment.service.js |
| GET | `/payments/order/:orderId` | 🔐 | Get payments by order ID | ✅ payment.service.js |

---

## Suppliers (`/api/suppliers`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/suppliers` | 🔓 | List all suppliers (public) | ✅ supplier.service.js |
| POST | `/suppliers` | 🔓 | Create supplier | ✅ supplier.service.js |
| GET | `/suppliers/:id` | 🔓 | Get supplier by ID | ✅ supplier.service.js |
| PUT | `/suppliers/:id` | 🔓 | Update supplier | ✅ supplier.service.js |
| DELETE | `/suppliers/:id` | 🔓 | Delete supplier | ✅ supplier.service.js |

---

## Purchase Orders (`/api/purchase-orders`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/purchase-orders` | 🔐 | List all POs | ✅ purchaseOrder.service.js |
| POST | `/purchase-orders` | 🧑‍💼 | Create PO | ✅ purchaseOrder.service.js |
| GET | `/purchase-orders/:id` | 🔐 | Get PO by ID | ✅ purchaseOrder.service.js |
| PUT | `/purchase-orders/:id` | 🧑‍💼 | Update PO status | ✅ purchaseOrder.service.js |
| DELETE | `/purchase-orders/:id` | 🧑‍💼 | Delete PO | ✅ purchaseOrder.service.js |

---

## Supplier Invoices (`/api/supplier-invoices`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/supplier-invoices` | 🔐 | List supplier invoices | ⚠️ No page yet |
| POST | `/supplier-invoices` | 🔐 | Create supplier invoice | ⚠️ No page yet |
| GET | `/supplier-invoices/:id` | 🔐 | Get by ID | ⚠️ No page yet |
| PUT | `/supplier-invoices/:id` | 🔐 | Update | ⚠️ No page yet |
| DELETE | `/supplier-invoices/:id` | 🔐 | Delete | ⚠️ No page yet |

---

## Inventory (`/api/inventory`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/inventory/categories` | 🔐 | List product categories | ✅ inventory.service.js |
| POST | `/inventory/categories` | 🧑‍💼 | Create category | ✅ inventory.service.js |
| GET | `/inventory/products` | 🔐 | List all products | ✅ inventory.service.js |
| POST | `/inventory/products` | 🧑‍💼 | Create product | ✅ inventory.service.js |
| GET | `/inventory/products/:id` | 🔐 | Get product by ID | ✅ inventory.service.js |
| PUT | `/inventory/products/:id` | 🧑‍💼 | Update product | ✅ inventory.service.js |
| DELETE | `/inventory/products/:id` | 🧑‍💼 | Delete product | ✅ inventory.service.js |
| GET | `/inventory/warehouses` | 🔐 | List warehouses | ✅ inventory.service.js |
| POST | `/inventory/warehouses` | 🧑‍💼 | Create warehouse | ✅ inventory.service.js |
| PUT | `/inventory/warehouses/:id` | 🧑‍💼 | Update warehouse | ✅ inventory.service.js |
| DELETE | `/inventory/warehouses/:id` | 🧑‍💼 | Delete warehouse | ✅ inventory.service.js |
| POST | `/inventory/stock-in` | 🔐 | Record stock-in | ✅ inventory.service.js |
| POST | `/inventory/stock-out` | 🔐 | Record stock-out | ✅ inventory.service.js |
| GET | `/inventory/stock-history` | 🔐 | Stock transaction history | ✅ inventory.service.js |

---

## Expenses (`/api/expenses`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/expenses/categories` | 🔐 | List expense categories | ✅ expense.service.js |
| POST | `/expenses/categories` | 🧑‍💼 | Create category | ✅ expense.service.js |
| PUT | `/expenses/categories/:id` | 🧑‍💼 | Update category | ✅ expense.service.js |
| DELETE | `/expenses/categories/:id` | 🧑‍💼 | Delete category | ✅ expense.service.js |
| POST | `/expenses/upload` | 🧑‍💼 | Upload invoices (OCR, up to 20) | ✅ expense.service.js |
| GET | `/expenses/export` | 🧑‍💼 | Export expense register (Excel) | ✅ expense.service.js |
| GET | `/expenses` | 🔐 | List all expenses | ✅ expense.service.js |
| POST | `/expenses` | 🧑‍💼 | Create expense manually | ✅ expense.service.js |
| GET | `/expenses/:id` | 🔐 | Get expense by ID | ✅ expense.service.js |
| PUT | `/expenses/:id` | 🧑‍💼 | Update expense | ✅ expense.service.js |
| DELETE | `/expenses/:id` | 🧑‍💼 | Delete expense | ✅ expense.service.js |

---

## Invoices AI OCR (`/api/invoices`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| POST | `/invoices/upload` | 🧑‍💼 | Upload invoice → AI OCR pipeline | ✅ invoice.service.js |
| POST | `/invoices/:id/process` | 🧑‍💼 | Process invoice by ID | ✅ invoice.service.js |
| POST | `/invoices/:id/reprocess` | 🧑‍💼 | Reprocess failed invoice | ✅ invoice.service.js |
| GET | `/invoices` | 🧑‍💼 | List all processed invoices | ✅ invoice.service.js |
| GET | `/invoices/:id` | 🧑‍💼 | Get invoice by ID | ✅ invoice.service.js |
| DELETE | `/invoices/:id` | 🧑‍💼 | Delete invoice | ✅ invoice.service.js |

---

## Waste Management (`/api/waste`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| POST | `/waste` | 🍳 | Log food waste | ✅ waste.service.js |
| GET | `/waste` | 🍳 | List all waste logs | ✅ waste.service.js |
| GET | `/waste/stats` | 🧑‍💼 | Waste analytics | ✅ waste.service.js |

---

## AI Intelligence (`/api/ai`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/ai/predict-stock` | 📦 | Stock demand predictions | ✅ ai.service.js |
| GET | `/ai/menu-pricing` | 🧑‍💼 | Menu pricing recommendations | ✅ ai.service.js |
| GET | `/ai/food-waste` | 🍳 | Food waste analysis | ✅ ai.service.js |
| GET | `/ai/prep-time` | 🔐 | Prep time estimates | ✅ ai.service.js |

---

## Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/notifications/my-notifications` | 🔐 | Get user notifications | ✅ (in NotificationDrawer) |
| PUT | `/notifications/:id/read` | 🔐 | Mark as read | ✅ (in NotificationDrawer) |
| PUT | `/notifications/read-all` | 🔐 | Mark all as read | ✅ (in NotificationDrawer) |
| POST | `/notifications` | 🧑‍💼 | Create notification | ⚠️ No admin UI |

---

## Activity & Audit Logs

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/activity-logs` | 🧑‍💼 | All activity logs | ✅ dashboard.service.js |
| GET | `/audit-logs` | 🧑‍💼 | All audit logs | ⚠️ No page yet |

---

## File Uploads (`/api/files`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| POST | `/files/upload` | 🔐 | Upload generic file | ⚠️ No dedicated UI |
| GET | `/files` | 🔐 | List uploaded files | ⚠️ No dedicated UI |

---

## Staff (`/api/staff`)

| Method | Endpoint | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/staff` | 🧑‍💼 | List all staff | ✅ staff.service.js |
| POST | `/staff` | 🧑‍💼 | Create staff record | ✅ staff.service.js |
| GET | `/staff/:id` | 🧑‍💼 | Get staff by ID | ✅ staff.service.js |
| PUT | `/staff/:id` | 🧑‍💼 | Update staff | ✅ staff.service.js |
| DELETE | `/staff/:id` | 👑 | Delete staff | ✅ staff.service.js |

---

## Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | 🔓 | Server health check → `{ success: true, message: "RestaurantOS Backend Running" }` |
| GET | `/uploads/*` | 🔓 | Static asset server for uploaded PDFs/Images | ✅ Configured in app.js |

---

## API Mismatches & Notes

| Issue / Note | Details |
|---|---|
| `dashboard.service.js` calls `/dashboard/weekly-sales` | Backend route is `/dashboard/weekly-sales` ✅ Match |
| `dashboard.service.js` calls `/dashboard/top-selling-menu` | Backend route is `/dashboard/top-selling-menu` ✅ Match |
| Supplier routes have NO auth middleware | All supplier endpoints are public (no `router.use(authenticateToken)`) |
| Invoice file static serving | Mounted `express.static('uploads')` in Express `app.js` for PDF/Image viewing |
| Invoice pre-save editing endpoint | Backend auto-saves atomically on upload. No `PUT /api/invoices/:id` route exists in backend |
