# RestaurantOS Documentation Hub

Welcome to the RestaurantOS documentation suite. Below is an index of all architecture, API, and status documents.

---

## Documentation Index

| File | Purpose |
|---|---|
| [MASTER_RULES.md](./MASTER_RULES.md) | **Permanent Single Source of Truth** — rules, workflow, coding standards |
| [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) | Full system design, middleware chain, component hierarchy |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Complete 3NF Prisma schema models & enums reference |
| [API_MAPPING.md](./API_MAPPING.md) | Complete backend API endpoint reference & frontend mappings |
| [AUTH_FLOW.md](./AUTH_FLOW.md) | JWT authentication, refresh tokens, & session lifecycle |
| [RBAC.md](./RBAC.md) | Roles, permissions, access matrix & ADMIN bypass rules |
| [INVOICE_FLOW.md](./INVOICE_FLOW.md) | Invoice AI OCR parsing & batch upload pipeline |
| [FRONTEND_PROGRESS.md](./FRONTEND_PROGRESS.md) | Frontend implementation status across all pages |
| [BACKEND_PROGRESS.md](./BACKEND_PROGRESS.md) | Backend implementation status across 27 modules |
| [UI_DESIGN_SYSTEM.md](./UI_DESIGN_SYSTEM.md) | Design tokens, color palette, glassmorphism & typography |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Repository directory maps for frontend and backend |
| [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md) | UI component library & page container hierarchy |
| [API_STATUS.md](./API_STATUS.md) | Backend vs frontend API integration breakdown |
| [CHANGELOG.md](./CHANGELOG.md) | Project modification history & version updates |
| [TODO.md](./TODO.md) | Backlog & next tasks |

---

## Quick Reference

- **Backend Port**: `5000` (`http://localhost:5000/api`)
- **Frontend Port**: `5173` (Vite dev server)
- **Swagger Docs**: `http://localhost:5000/api/docs`
- **Database Engine**: PostgreSQL (`restaurant_os` schema)
- **ORM**: Prisma v5.22
