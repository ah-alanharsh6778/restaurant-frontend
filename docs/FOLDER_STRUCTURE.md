# FOLDER_STRUCTURE.md — Repository Directory Layout

## Overview

The repository consists of two primary root directories:
- `e:/restaurant-backend/` — Express.js + Prisma REST API Service
- `e:/restaurant-frontends/` — React 19 + Vite + MUI Web Client Application

---

## Backend Directory Map (`e:/restaurant-backend/`)

```
e:/restaurant-backend/
├── .env                        # Environment configuration (DB, JWT, Ports)
├── docker-compose.yml          # Docker Compose specification
├── Dockerfile                  # Container definition
├── package.json                # Dependencies & scripts
├── prisma/
│   ├── schema.prisma           # 3NF Prisma database schema
│   ├── migrations/             # SQL migration files
│   └── seed.js                 # Initial database seeding script
├── logs/                       # Server logs (combined.log, error.log)
├── uploads/                    # Uploaded invoice files & receipts
└── src/
    ├── server.js               # Entry point (port 5000)
    ├── app.js                  # Express app setup & route mounting
    ├── config/
    │   ├── prisma.js           # Prisma client singleton
    │   ├── swagger.js          # Swagger OpenAPI documentation generator
    │   └── logger.js           # Winston logger instance
    ├── middleware/
    │   ├── auth.middleware.js  # JWT Bearer token authentication
    │   ├── role.middleware.js  # Role authorization (authorizeRoles)
    │   ├── permission.middleware.js # Granular permission authorization
    │   ├── error.middleware.js # Global error handler
    │   └── rateLimit.middleware.js # API rate limiters
    ├── dtos/
    │   └── index.js            # Data Transfer Objects
    ├── utils/
    │   ├── errors.js           # Custom AppError classes
    │   ├── jwt.js              # Token signing & verification
    │   ├── asyncHandler.js    # Controller async wrapper
    │   └── cache.js            # In-memory cache helper
    └── modules/                # 27 feature modules (controller, service, repository, routes, validation)
```

---

## Frontend Directory Map (`e:/restaurant-frontends/`)

```
e:/restaurant-frontends/
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite configuration (proxying /api → http://localhost:5000)
├── index.html                  # HTML entry point
├── docs/                       # Project documentation suite (16 files)
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # App root component
    ├── index.css               # Global CSS
    ├── config/
    │   └── axios.js            # Axios client with interceptors
    ├── context/
    │   ├── AuthContext.jsx     # Auth state, login/logout, permissions
    │   └── ThemeContext.jsx    # Dark/light color mode context
    ├── hooks/
    │   ├── useAuth.js          # AuthContext hook
    │   └── ...
    ├── routes/
    │   ├── AppRoutes.jsx       # Route definitions & RBAC guards
    │   └── ProtectedRoute.jsx  # Auth & role guard wrapper
    ├── layout/
    │   ├── DashboardLayout.jsx # Dashboard shell layout
    │   ├── Navbar.jsx          # Top navigation bar
    │   ├── Sidebar.jsx         # Collapsible side navigation
    │   ├── PageContainer.jsx   # Standardized page container
    │   └── ResponsiveGrid.jsx  # Responsive grid helper
    ├── pages/                  # Page modules
    │   ├── Dashboard/          # Analytics dashboard
    │   ├── Orders/             # POS & Live orders page
    │   ├── Tables/             # Table layout management
    │   ├── Menu/               # Menu catalog
    │   ├── Ingredients/        # Ingredient stock page
    │   ├── Recipes/            # Recipe formulation page
    │   ├── Inventory/          # Product & warehouse inventory
    │   ├── Suppliers/          # Vendor directory page
    │   ├── PurchaseOrders/     # PO management page
    │   ├── Expenses/           # Financial expenses page
    │   ├── Invoices/           # AI OCR invoice page
    │   ├── Customers/          # Customer directory
    │   ├── Reports/            # Operational reports
    │   ├── Users/              # User account management
    │   ├── Roles/              # Role & RBAC matrix page
    │   ├── Profile/            # User profile & session page
    │   ├── Settings/           # Settings page
    │   ├── Help/               # Help center
    │   └── Error/              # Error pages (401, 403, 404, 500)
    ├── components/
    │   ├── ui/                 # 17 design system UI primitives
    │   ├── common/             # Common components (NotificationDrawer, etc.)
    │   └── design-system/      # Design system showcases
    ├── services/               # 20 API service clients
    ├── styles/
    │   ├── designTokens.js     # Color, spacing, typography tokens
    │   ├── global.css          # Global styling & CSS variables
    │   └── theme.js            # MUI theme customization
    └── utils/                  # Utility helpers (storage, rbac, etc.)
```
