# MASTER_RULES.md — RestaurantOS Single Source of Truth

> **⚠️ CRITICAL:** This file is the PERMANENT source of truth. Every future task MUST begin by reading this file. Do NOT re-analyze the backend unless backend files were explicitly changed.

---

## 1. PROJECT OVERVIEW

| Field | Value |
|---|---|
| **Project** | RestaurantOS — Enterprise Restaurant Management System |
| **Stack** | Node.js + Express + Prisma + PostgreSQL (Backend) · React 19 + Vite + MUI v9 (Frontend) |
| **Backend Port** | 5000 |
| **Frontend Port** | 5173 (Vite dev) |
| **API Prefix** | `/api` |
| **DB Engine** | PostgreSQL (`restaurant_os` schema) |
| **ORM** | Prisma v5.22 |
| **Auth** | JWT (Access Token 1d · Refresh Token 7d) |
| **Frontend Proxy** | Vite proxies `/api → http://localhost:5000` (origin/referer stripped) |
| **Swagger Docs** | `http://localhost:5000/api/docs` |

---

## 2. CURRENT PROJECT STATUS

| Layer | Status |
|---|---|
| Backend API | ✅ Complete — 27 modules deployed |
| Prisma Schema | ✅ Complete — 24 models, 10 enums |
| Auth / JWT | ✅ Complete |
| RBAC (Role + Permission Middleware) | ✅ Complete |
| Dashboard Analytics | ✅ Complete |
| Frontend Dashboard | ✅ Complete |
| Frontend Auth (Login/Register) | ✅ Complete |
| Frontend Tables Page | ✅ Complete |
| Frontend Orders Page | ✅ Complete |
| Frontend Menu Page | ✅ Complete |
| Frontend Ingredients Page | ✅ Complete |
| Frontend Recipes Page | ✅ Complete |
| Frontend Inventory Page | ✅ Complete |
| Frontend Suppliers Page | ✅ Complete |
| Frontend Purchase Orders | ✅ Complete |
| Frontend Expenses Page | ✅ Complete |
| Frontend Invoices Page | ✅ Complete |
| Frontend Customers Page | ✅ Complete |
| Frontend Reports Page | ✅ Complete |
| Frontend Users Management | ✅ Complete |
| Frontend Role Management | ✅ Complete |
| Frontend Profile Page | ✅ Complete |
| Frontend Settings Page | ✅ Complete |
| Frontend Help Center | ✅ Complete |
| Frontend Error Pages (401/403/404/500) | ✅ Complete |
| Frontend Design System | ✅ Complete |
| Waste Page (Frontend) | ⚠️ Not yet routed in AppRoutes.jsx |
| AI Intelligence Page (Frontend) | ⚠️ Not yet routed in AppRoutes.jsx |
| Staff Management Page (Frontend) | ⚠️ Not yet built |
| Payment Processing Page (Frontend) | ⚠️ Not yet built |

---

## 3. COMPLETED BACKEND MODULES (27/27)

auth · user · role · permission · staff · userSession · customer · table · menu · ingredient · recipe · order · payment · supplier · purchaseOrder · supplierInvoice · inventory · stock · waste · expense · invoice · dashboard · ai · notification · activityLog · auditLog · fileUpload

---

## 4. PENDING FRONTEND MODULES

| Module | Priority | Route | Roles |
|---|---|---|---|
| Waste Management Page | HIGH | `/waste` | MANAGER, CHEF |
| AI Intelligence Page | HIGH | `/ai` | ADMIN, MANAGER |
| Staff Management Page | MEDIUM | `/staff` | ADMIN, MANAGER |
| Payment Processing Page | MEDIUM | `/payments` | ADMIN, MANAGER |
| Supplier Invoices Page | MEDIUM | `/supplier-invoices` | ADMIN, MANAGER |
| Audit Log Page | LOW | `/audit-logs` | ADMIN |

---

## 5. FOLDER STRUCTURE

### Backend: `e:/restaurant-backend/`
```
src/
├── app.js                     # Express app, all routes mounted
├── server.js                  # Entry, port 5000
├── config/                    # prisma.js, swagger.js, logger.js
├── middleware/
│   ├── auth.middleware.js     # JWT verification → req.user
│   ├── role.middleware.js     # authorizeRoles(...roles)
│   ├── permission.middleware.js # requirePermission(action, resource)
│   ├── error.middleware.js    # Global error handler
│   └── rateLimit.middleware.js # apiLimiter + authLimiter
├── utils/
│   ├── errors.js              # AppError, BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError
│   ├── jwt.js                 # generateToken, verifyToken, generateRefreshToken, verifyRefreshToken
│   ├── asyncHandler.js        # Async route wrapper
│   └── cache.js               # In-memory cache (60s TTL for dashboard)
├── dtos/index.js              # UserDTO
└── modules/                   # 27 feature modules (controller+service+repository+routes+validation)
```

### Frontend: `e:/restaurant-frontends/`
```
src/
├── config/axios.js            # Axios instance (baseURL=/api, Bearer token interceptor)
├── context/
│   ├── AuthContext.jsx        # login, logout, refresh, hasPermission, hasRole
│   └── ThemeContext.jsx       # Dark/Light mode toggle
├── routes/
│   ├── AppRoutes.jsx          # All route definitions with RBAC guards
│   └── ProtectedRoute.jsx     # Auth + role guard component
├── layout/
│   ├── DashboardLayout.jsx    # Shell: Sidebar + Navbar
│   ├── Navbar.jsx             # Top bar (search, notifications, user menu)
│   ├── Sidebar.jsx            # Side navigation (260px / 72px collapsed)
│   └── PageContainer.jsx      # Page wrapper (breadcrumbs, title, actions slot)
├── pages/                     # 23 page directories (see AppRoutes.jsx)
├── components/ui/             # 17 primitives: Button, Card, Table, Modal, Badge, StatCard, etc.
├── services/                  # 20 API service files
├── styles/
│   ├── designTokens.js        # Master color/spacing/typography tokens
│   ├── global.css             # CSS custom properties, dark mode vars
│   └── theme.js               # MUI theme overrides
└── utils/                     # storage.js, rbac.js, etc.
```

---

## 6. CODING STANDARDS

### Backend Rules
- Module pattern: `controller → service → repository → prisma`
- Always use `asyncHandler(async (req, res) => { ... })`
- Always throw `AppError` subclasses — never raw `Error`
- Validation: `express-validator` on all write endpoints
- Response: `{ success: true, data: ... }` or `{ success: false, message: ... }`
- Soft deletes: `isDeleted = true`, `deletedAt = now()` — never hard delete
- Winston logger for all info/warn/error events

### Frontend Rules
- All API calls via service files — never inline `axios.get()` in components
- All pages use `PageContainer` as root wrapper
- No fake/mock data — only real backend responses
- Loading + error states required on every data fetch
- MUI `sx` prop or CSS variables — no inline styles
- Dark/light mode must work on every component
- Breadcrumbs required on all protected pages
- Toast notifications for all success/error feedback

---

## 7. DESIGN STANDARDS

### Color Palette
| Name | Light | Dark |
|---|---|---|
| Primary | `#6366F1` (Indigo 500) | `#818CF8` |
| Brand Main | `#4F46E5` (Indigo 600) | `#6366F1` |
| Secondary | `#06B6D4` (Cyan) | `#22D3EE` |
| Success | `#10B981` | `#34D399` |
| Warning | `#F59E0B` | `#FBBF24` |
| Danger | `#EF4444` | `#F87171` |
| Canvas | `#F8FAFC` | `#090D16` |
| Surface | `#FFFFFF` | `#111827` |

### Typography
- Font: "Plus Jakarta Sans", "Inter", system-ui
- Weights: 400 / 500 / 600 / 700 / 800

### Layout
- Sidebar: 260px expanded, 72px collapsed, 280px mobile
- Navbar: 70px desktop, 60px mobile
- Max width: 1440px
- Container padding: 32px desktop, 24px tablet, 16px mobile
- Glassmorphism: `backdrop-filter: blur(16px) saturate(180%)`

---

## 8. AUTH FLOW (JWT)

```
1. POST /api/auth/login → { data: { accessToken, refreshToken, user } }
2. setTokens(accessToken, refreshToken) → localStorage
3. Axios interceptor auto-attaches: Authorization: Bearer <token>
4. On mount: GET /api/users/profile → validate session
5. On 401: POST /api/auth/refresh → new tokens
6. If refresh fails: clearAuth() + redirect /login
7. Permissions: GET /api/permissions/role/:roleId → loaded into AuthContext.permissions[]
8. hasPermission(action, resource) → checks permissions[]
9. ADMIN always returns true (bypass)
```

---

## 9. RBAC RULES

**Roles (Prisma enum):** `ADMIN | MANAGER | CHEF | WAITER | STAFF | INVENTORY_MANAGER`

| Resource | ADMIN | MANAGER | CHEF | WAITER | STAFF | INV_MGR |
|---|---|---|---|---|---|---|
| Dashboard/Analytics | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Users/Roles CRUD | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Orders | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Menu | ✅ | ✅ | ✅ | ✅(R) | ❌ | ❌ |
| Tables | ✅ | ✅ | ❌ | ✅ | ✅(U) | ❌ |
| Customers | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Ingredients | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Recipes | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Inventory | ✅ | ✅ | ✅(R) | ❌ | ❌ | ✅ |
| Suppliers | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Purchase Orders | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Expenses | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Invoices/OCR | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Waste Logs | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| AI Insights | ✅ | ✅ | ✅(waste) | ❌ | ❌ | ✅(stock) |
| Reports | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

**ADMIN bypass:** Both backend middleware and frontend `hasPermission()` return true for ADMIN unconditionally.

---

## 10. BACKEND API ENDPOINTS SUMMARY

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

GET    /api/users/profile        [Any]
GET    /api/users                [ADMIN, MANAGER]

GET    /api/roles                [ADMIN]
POST   /api/roles                [ADMIN]
PUT    /api/roles/:id            [ADMIN]
DELETE /api/roles/:id            [ADMIN]

GET    /api/permissions          [ADMIN]
GET    /api/permissions/role/:roleId [Any auth]

GET/POST   /api/customers        [ADMIN, MANAGER, WAITER, STAFF]
GET/POST   /api/tables           [ADMIN, MANAGER, STAFF]
GET/POST   /api/menu             [Any auth]
GET/POST   /api/orders           [Any auth]
GET/POST   /api/ingredients      [Any auth]
GET/POST   /api/recipes          [Any auth]
GET/POST   /api/suppliers        [Public GET; any auth write]

GET/POST   /api/purchase-orders  [ADMIN, MANAGER]
GET/POST   /api/supplier-invoices [ADMIN, MANAGER]
GET/POST   /api/inventory/products [ADMIN, MANAGER]
GET/POST   /api/inventory/warehouses [ADMIN, MANAGER]
POST       /api/inventory/stock-in   [ADMIN, MANAGER, STAFF]
POST       /api/inventory/stock-out  [ADMIN, MANAGER, STAFF]

GET/POST   /api/expenses         [ADMIN, MANAGER]
POST       /api/expenses/upload  [ADMIN, MANAGER] — Multi-file OCR upload
GET        /api/expenses/export  [ADMIN, MANAGER] — Excel export

GET/POST   /api/invoices         [ADMIN, MANAGER]
POST       /api/invoices/upload  [ADMIN, MANAGER] — AI OCR pipeline
POST       /api/invoices/:id/process [ADMIN, MANAGER]
POST       /api/invoices/:id/reprocess [ADMIN, MANAGER]

GET/POST   /api/waste            [ADMIN, MANAGER, CHEF]
GET        /api/waste/stats      [ADMIN, MANAGER]

GET /api/dashboard/summary       [ADMIN, MANAGER]
GET /api/dashboard/weekly-sales  [ADMIN, MANAGER]
GET /api/dashboard/monthly-sales [ADMIN, MANAGER]
GET /api/dashboard/top-selling-menu [ADMIN, MANAGER]
GET /api/dashboard/revenue       [ADMIN, MANAGER]
GET /api/dashboard/profit        [ADMIN, MANAGER]
GET /api/dashboard/table-occupancy [ADMIN, MANAGER]
GET /api/dashboard/low-stock     [ADMIN, MANAGER]
GET /api/dashboard/purchase-summary [ADMIN, MANAGER]
GET /api/dashboard/monthly-expense [ADMIN, MANAGER]
GET /api/dashboard/supplier-summary [ADMIN, MANAGER]

GET /api/ai/predict-stock        [ADMIN, MANAGER, INVENTORY_MANAGER]
GET /api/ai/menu-pricing         [ADMIN, MANAGER]
GET /api/ai/food-waste           [ADMIN, MANAGER, CHEF]
GET /api/ai/prep-time            [Any auth]

GET    /api/notifications/my-notifications [Any auth]
PUT    /api/notifications/:id/read [Any auth]
PUT    /api/notifications/read-all [Any auth]
POST   /api/notifications         [ADMIN, MANAGER]

GET    /api/activity-logs         [ADMIN, MANAGER]
GET    /api/audit-logs            [ADMIN, MANAGER]

POST   /api/files/upload          [Any auth]
GET    /api/files                 [Any auth]

GET    /api/health                [Public]
```

---

## 11. UI COMPONENT LIBRARY (`src/components/ui/`)

| Component | Purpose |
|---|---|
| `Button` | Primary/outlined/ghost/danger/glow variants |
| `Card` | Content card with optional header/footer |
| `GlassCard` | Glassmorphism card (backdrop blur) |
| `StatCard` | KPI metric card with icon, value, trend |
| `Table` | Data table with sorting, pagination, empty state |
| `Modal` | Accessible modal dialog |
| `Badge` | Status badge (success/warning/danger/info/default) |
| `Input` | Text input with label, error state |
| `Select` | Dropdown select |
| `Search` | Search input |
| `Avatar` | User avatar with initials fallback |
| `Loader` | Spinner/skeleton loading states |
| `Toast` | Toast notification wrapper |
| `Tabs` | Tab navigation |
| `Progress` | Progress bar |
| `Dropdown` | Context menu dropdown |
| `index.js` | Barrel export |

---

## 12. TESTING RULES

- Backend: Jest + Supertest (`/tests/` directory exists)
- Command: `cd e:/restaurant-backend && npm test`
- Test: Login flow → API response format → RBAC → 401/403/404/500
- Frontend: Manual browser testing on both dark/light modes

---

## 13. DEPLOYMENT

- **Backend**: `node src/server.js` (prod) · `nodemon src/server.js` (dev)
- **Docker**: `docker-compose up` (docker-compose.yml present)
- **Frontend**: `npm run dev` (dev) · `npm run build` (prod)
- **DB Migrations**: `npx prisma migrate deploy`
- **DB Seed**: `node prisma/seed.js`
- **CORS Origins**: `http://localhost:3000,5173,5174,5175,5000`

---

## 14. LAST COMPLETED TASKS

| Task | Date |
|---|---|
| Fixed Typography import in Navbar.jsx | 2026-07-28 |
| Removed Refresh Template button from Dashboard index.jsx | 2026-07-28 |
| Removed OCR Invoice button + Processed OCR Invoices section from AnalyticsDashboard | 2026-07-28 |
| Fixed empty actions={} JSX parse error in AnalyticsDashboard | 2026-07-28 |
| Generated complete project documentation (16 docs/ files) | 2026-07-28 |

---

## 15. NEXT CONTINUATION POINT

**Next task:** Build Waste Management Frontend Page
- File: `src/pages/waste/WastePage.jsx` (create new)
- Route: Add `/waste` to `AppRoutes.jsx` with roles `[ROLES.MANAGER, ROLES.CHEF]`
- Backend APIs to use:
  - `GET /api/waste` — list all waste logs
  - `POST /api/waste` — log new waste (ingredientId, quantity, unit, reason, remarks)
  - `GET /api/waste/stats` — analytics (totalCostLost, wasteByReason)
- Existing service file: `src/services/` — needs `waste.service.js` (create)
