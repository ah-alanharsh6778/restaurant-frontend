# PROJECT_ARCHITECTURE.md — RestaurantOS System Architecture

## System Overview

RestaurantOS is a full-stack enterprise restaurant management system with a Node.js/Express REST API backend and a React 19 SPA frontend.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                        │
│                 React 19 + Vite + MUI                   │
│                  http://localhost:5173                   │
└─────────────────┬───────────────────────────────────────┘
                  │  Vite Proxy /api → :5000
                  │  (strips Origin/Referer headers)
┌─────────────────▼───────────────────────────────────────┐
│              EXPRESS.JS REST API                         │
│                  http://localhost:5000                   │
│                                                         │
│  Middleware Stack (in order):                           │
│  Helmet → CORS → Morgan → CookieParser → JSON Body     │
│  → Rate Limiter → Auth Middleware → Role Middleware     │
│  → Route Handler → Error Handler                        │
└─────────────────┬───────────────────────────────────────┘
                  │  Prisma ORM
┌─────────────────▼───────────────────────────────────────┐
│              PostgreSQL Database                         │
│           restaurant_os schema                          │
│           24 models, 10 enums                           │
└─────────────────────────────────────────────────────────┘
```

---

## Backend Architecture Pattern

### Module Structure (per feature)
```
modules/<feature>/
├── <feature>.routes.js      # Express router + middleware chain
├── <feature>.controller.js  # asyncHandler → calls service → send response
├── <feature>.service.js     # Business logic, validation, orchestration
├── <feature>.repository.js  # Prisma queries (data layer)
└── <feature>.validation.js  # express-validator rules
```

### Request Lifecycle
```
HTTP Request
    → Helmet (security headers)
    → CORS (origin whitelist)
    → Morgan (HTTP logging)
    → Rate Limiter (apiLimiter: 100/15min, authLimiter: 15/15min)
    → authenticateToken (JWT → req.user)
    → authorizeRoles (role check)
    → requirePermission (granular permission check — optional)
    → express-validator (input validation)
    → Controller (asyncHandler wrapper)
        → Service (business logic)
            → Repository (Prisma queries)
    → JSON Response { success, data/message }
    → [Error] Global Error Handler → { success: false, message, stack? }
```

---

## Frontend Architecture Pattern

### Component Hierarchy
```
main.jsx
└── BrowserRouter
    └── AuthProvider (AuthContext — JWT, permissions, RBAC)
        └── ThemeProvider (MUI theme — dark/light)
            └── App.jsx
                └── AppRoutes.jsx
                    ├── Public Routes (/login, /register)
                    └── ProtectedRoute (auth guard)
                        └── DashboardLayout
                            ├── Sidebar (navigation)
                            ├── Navbar (top bar)
                            └── Outlet → Page Components
                                └── PageContainer (content wrapper)
                                    └── Feature Components
```

### Data Flow
```
Page Component
    → useEffect / useCallback
    → service.js (e.g., orderService.getAll())
    → axiosInstance (auto-attaches Bearer token)
    → Backend API /api/<endpoint>
    → Response data → setState
    → Render with MUI components + design system
```

---

## Authentication Architecture

```
┌─────────────┐    POST /api/auth/login    ┌─────────────────┐
│   Login Page │ ─────────────────────────▶│  Auth Controller │
└─────────────┘                            └────────┬────────┘
                                                    │ bcrypt.compare
                                                    │ generateToken (1d)
                                                    │ generateRefreshToken (7d)
                                                    │ Store RefreshToken + UserSession
                                           ┌────────▼────────┐
                                           │ { accessToken,  │
                                           │ refreshToken,   │
                                           │ user }          │
                                           └────────┬────────┘
┌─────────────┐                                     │
│ AuthContext  │◀────────────────────────────────────┘
│ setTokens() │    localStorage: accessToken, refreshToken, user
│ setUser()   │
│ loadPerms() │──▶ GET /api/permissions/role/:roleId
└─────────────┘    → permissions[] loaded into context
```

---

## RBAC Architecture

```
Backend Layer:
  authenticateToken  →  req.user = { id, email, role }
  authorizeRoles('ADMIN', 'MANAGER')  →  checks req.user.role
  requirePermission('CREATE', 'ORDERS')  →  DB lookup RolePermission

Frontend Layer:
  AuthContext.hasRole('ADMIN')  →  normaliseRole(user.role) check
  AuthContext.hasPermission('READ', 'EXPENSES')  →  permissions[] check
  ProtectedRoute allowedRoles  →  redirects 403 if role not in list
  ADMIN bypass  →  always true (mirrors backend behavior)
```

---

## Invoice AI OCR Pipeline

```
Client Upload (PDF/PNG/JPEG)
    → POST /api/expenses/upload (up to 20 files)
    OR
    → POST /api/invoices/upload (single file)
    ↓
Multer (file save to /uploads/invoices/)
    ↓
InvoiceService.uploadInvoice()
    ↓
OCR Engine (pdf-parse / fallback text extraction)
    → rawText extraction
    ↓
AI Parser (microservice call or fallback)
    → Parse rawText → structured InvoiceDTO
    → { invoiceNumber, supplierName, totalAmount, items[], invoiceDate }
    ↓
Duplicate check (invoiceNumber + supplierName unique constraint)
    ↓
Create Invoice record (status: PROCESSED)
    ↓
Create Expense record (linked to Invoice)
    ↓
Response: { invoiceId, expenseId, extractedData }
```

---

## Database Architecture

### Key Relationships
```
User ──── Role ──── RolePermission ──── Permission
User ──── Staff (1:1)
User ──── UserSession
User ──── RefreshToken

Order ──── RestaurantTable
Order ──── User (waiter)
Order ──── Customer
Order ──── OrderItem ──── MenuItem ──── Recipe ──── RecipeIngredient ──── Ingredient

Supplier ──── PurchaseOrder ──── PurchaseOrderItem ──── Ingredient
Supplier ──── SupplierInvoice ──── SupplierInvoiceItem
Supplier ──── Expense

Expense ──── Invoice (AI OCR processed)
Invoice ──── InvoiceItem

Product ──── Stock ──── Warehouse
Ingredient ──── Stock ──── Warehouse
StockTransaction ──── Product/Ingredient ──── Warehouse

FoodWasteLog ──── Ingredient ──── User (reportedBy)
```

---

## Caching Strategy

- **Dashboard endpoints**: 60-second in-memory cache via `src/utils/cache.js`
- **Cache keys**: `dashboard:summary`, `dashboard:weekly-sales`, etc.
- **Invalidation**: Time-based TTL (no manual invalidation)
- **Frontend**: No client-side caching — every mount re-fetches

---

## Error Response Standard

```json
// Success
{ "success": true, "data": { ... } }
{ "success": true, "message": "Created successfully", "data": { ... } }

// Error
{ "success": false, "message": "Error description" }
{ "success": false, "message": "Validation failed", "errors": [ ... ] }

// HTTP Status Codes:
// 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized
// 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error
```
