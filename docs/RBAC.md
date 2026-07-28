# RBAC.md — RestaurantOS Role-Based Access Control

## Overview

RestaurantOS uses a two-layer RBAC system:
1. **Role-based middleware** (`authorizeRoles`) — coarse-grained, per-route
2. **Permission-based middleware** (`requirePermission`) — fine-grained, per action+resource

---

## Roles (Prisma `RoleName` Enum)

| Role | Description | Access Level |
|---|---|---|
| `ADMIN` | Full system access, bypasses all checks | Highest |
| `MANAGER` | Operations management, financial, reports | High |
| `CHEF` | Kitchen operations, recipes, ingredients, waste | Medium |
| `INVENTORY_MANAGER` | Stock, inventory, suppliers, purchase orders | Medium |
| `WAITER` | Orders, tables, customers, menu view | Low |
| `STAFF` | Limited: tables, customers, stock-in/out | Lowest |

---

## Permission Model

Permissions are stored in the `Permission` table:
```
Permission = { action: string, resource: string }

Actions:  CREATE | READ | UPDATE | DELETE | MANAGE
Resources: ORDERS | INVENTORY | EXPENSES | USERS | MENU | TABLES | CUSTOMERS | REPORTS | SUPPLIERS | WASTE | AI
```

Permissions are assigned to roles via `RolePermission` junction table.

---

## Backend Middleware

### 1. `authenticateToken` (auth.middleware.js)
```javascript
// Verifies JWT, attaches req.user = { id, email, role }
// Applied first on all protected routes via router.use(authenticateToken)
```

### 2. `authorizeRoles(...roles)` (role.middleware.js)
```javascript
// Checks req.user.role against allowed roles
authorizeRoles('ADMIN', 'MANAGER')
// DOES NOT bypass for ADMIN — must explicitly list ADMIN in allowedRoles
```

### 3. `requirePermission(action, resource)` (permission.middleware.js)
```javascript
// ADMIN → always passes (bypass)
// Others → DB query: RolePermission where roleId + action + resource
requirePermission('CREATE', 'ORDERS')
```

---

## Route Access Matrix

### Auth
| Endpoint | Access |
|---|---|
| POST /auth/register | 🔓 Public |
| POST /auth/login | 🔓 Public |
| POST /auth/refresh | 🔓 Public |

### Users & Staff
| Endpoint | Access |
|---|---|
| GET /users/profile | Any authenticated |
| GET /users | ADMIN, MANAGER |
| GET/POST /staff | ADMIN, MANAGER |
| DELETE /staff/:id | ADMIN |

### RBAC Management
| Endpoint | Access |
|---|---|
| GET/POST /roles | ADMIN |
| PUT/DELETE /roles/:id | ADMIN |
| POST /roles/:id/permissions | ADMIN |
| GET /permissions | Any authenticated |
| GET /permissions/role/:roleId | Any authenticated |

### Dining Operations
| Endpoint | Create | Read | Update | Delete |
|---|---|---|---|---|
| /customers | MGR,WTR,STF | MGR,WTR,STF | MGR,WTR,STF | ADM,MGR |
| /tables | ADM,MGR | Any auth | ADM,MGR,STF | ADM,MGR |
| /menu | ADM,MGR | Any auth | ADM,MGR | ADM,MGR |
| /orders | Any auth | Any auth | Any auth | ADM,MGR |
| /orders/items | Any auth | - | - | Any auth |
| /payments | Any auth | Any auth | - | - |

### Kitchen & Recipes
| Endpoint | Create | Read | Update | Delete |
|---|---|---|---|---|
| /ingredients | Any auth | Any auth | Any auth | ADM,MGR |
| /recipes | Any auth | Any auth | Any auth | Any auth |

### Supply Chain
| Endpoint | Create | Read | Update | Delete |
|---|---|---|---|---|
| /suppliers | Public | Public | Public | Public |
| /purchase-orders | ADM,MGR | Any auth | ADM,MGR | ADM,MGR |
| /supplier-invoices | Any auth | Any auth | Any auth | Any auth |

### Inventory
| Endpoint | Access |
|---|---|
| /inventory/categories | POST: ADM,MGR · GET: Any auth |
| /inventory/products | POST/PUT/DELETE: ADM,MGR · GET: Any auth |
| /inventory/warehouses | POST/PUT/DELETE: ADM,MGR · GET: Any auth |
| /inventory/stock-in | ADM,MGR,STF |
| /inventory/stock-out | ADM,MGR,STF |
| /inventory/stock-history | Any auth |

### Financial
| Endpoint | Access |
|---|---|
| /expenses | POST/PUT/DELETE: ADM,MGR · GET: Any auth |
| /expenses/upload | ADM,MGR |
| /expenses/export | ADM,MGR |
| /expenses/categories | POST/PUT/DELETE: ADM,MGR · GET: Any auth |

### Invoice OCR
| Endpoint | Access |
|---|---|
| /invoices/upload | ADM,MGR |
| /invoices/:id/process | ADM,MGR |
| /invoices/:id/reprocess | ADM,MGR |
| GET /invoices | ADM,MGR |
| DELETE /invoices/:id | ADM,MGR |

### Waste Management
| Endpoint | Access |
|---|---|
| POST /waste | ADM,MGR,CHEF |
| GET /waste | ADM,MGR,CHEF |
| GET /waste/stats | ADM,MGR |

### Dashboard & Analytics
| Endpoint | Access |
|---|---|
| All /dashboard/* | ADM,MGR (enforced via `router.use(authorizeRoles)`) |

### AI Intelligence
| Endpoint | Access |
|---|---|
| /ai/predict-stock | ADM,MGR,INV_MGR |
| /ai/menu-pricing | ADM,MGR |
| /ai/food-waste | ADM,MGR,CHEF |
| /ai/prep-time | Any auth |

### System
| Endpoint | Access |
|---|---|
| /notifications | POST: ADM,MGR · GET/PUT: Any auth |
| /activity-logs | ADM,MGR |
| /audit-logs | ADM,MGR |
| /files | Any auth |

---

## Frontend RBAC Guard

### ProtectedRoute Component
```jsx
<ProtectedRoute
  allowedRoles={['MANAGER', 'CHEF']}
  requiredPermission={{ action: 'READ', resource: 'EXPENSES' }}
/>

// Logic:
// 1. !isAuthenticated → /login
// 2. allowedRoles && !hasRole(allowedRoles) && !hasRole('ADMIN') → /403
// 3. requiredPermission && !hasPermission(action, resource) → /403
// 4. Pass → render Outlet
```

### ADMIN Bypass Rule
```javascript
// Backend: permission.middleware.js
if (userRole === 'ADMIN') return next(); // bypass DB check

// Frontend: AuthContext.hasPermission()
if (role === 'ADMIN') return true; // bypass permission array check

// Frontend: ProtectedRoute
// ADMIN is always implicitly in allowedRoles (never blocked)
```

---

## Frontend Route Role Matrix

| Route | Roles (+ ADMIN always) |
|---|---|
| `/dashboard` | Any authenticated |
| `/profile` | Any authenticated |
| `/help` | Any authenticated |
| `/customers` | MANAGER, WAITER |
| `/tables` | MANAGER, WAITER |
| `/orders` | MANAGER, CHEF, WAITER |
| `/menu` | MANAGER, CHEF, WAITER |
| `/recipes` | MANAGER, CHEF |
| `/ingredients` | MANAGER, CHEF, INVENTORY_MANAGER |
| `/suppliers` | MANAGER, INVENTORY_MANAGER |
| `/purchase-orders` | MANAGER, INVENTORY_MANAGER |
| `/inventory` | MANAGER, CHEF, INVENTORY_MANAGER |
| `/expenses` | MANAGER (+ permission: READ/EXPENSES) |
| `/invoices` | MANAGER |
| `/reports` | MANAGER |
| `/users` | MANAGER (+ permission: MANAGE/USERS) |
| `/roles` | ADMIN only |
| `/settings` | MANAGER |

---

## Role Seeding

Roles are seeded via `prisma/seed.js`. Default roles:
- ADMIN
- MANAGER  
- CHEF
- WAITER
- STAFF
- INVENTORY_MANAGER

Default test users (seeded):
- `admin@restaurant.com` — ADMIN role
- `chef@restaurant.com` — CHEF role
- `manager@restaurant.com` — MANAGER role
- `inventory@restaurant.com` — INVENTORY_MANAGER role
