# COMPONENT_STRUCTURE.md — Component Hierarchy & Design Library

## System Hierarchy

```
[main.jsx]
  └── BrowserRouter
      └── AuthProvider (AuthContext)
          └── ThemeProvider (MUI Theme)
              └── [App.jsx]
                  └── [AppRoutes.jsx]
                      ├── Public Pages (LoginPage, RegisterPage)
                      └── ProtectedRoute
                          └── DashboardLayout
                              ├── Sidebar
                              ├── Navbar
                              └── [Outlet]
                                  └── PageContainer
                                      └── Feature Page Content
```

---

## Page Layout System (`src/layout/`)

### 1. `DashboardLayout.jsx`
- Main application shell
- Holds `Sidebar` (left side) and `Navbar` (top fixed)
- Calculates margin-left based on `SIDEBAR_WIDTH` (260px) or `COLLAPSED_SIDEBAR_WIDTH` (72px)
- Rendered for all protected routes

### 2. `PageContainer.jsx`
- Standard wrapper for every internal page
- Responsive padding scale: `32px` (desktop), `24px` (tablet), `16px` (mobile)
- Max content width cap: `1440px`
- Renders page header, breadcrumbs, and `actions` slot

### 3. `Navbar.jsx`
- Top navigation bar
- Search bar (global search trigger)
- Color mode toggle button (Dark / Light mode via `ThemeContext`)
- Notifications trigger (opens `NotificationDrawer`)
- User profile avatar dropdown menu (navigate to `/profile`, `/settings`, `/roles`, `/help`, logout)

### 4. `Sidebar.jsx`
- Side navigation drawer
- Collapsible via toggle button (260px ↔ 72px)
- Role-aware menu items (filters routes based on `AuthContext.hasRole()`)

---

## Design System Primitives (`src/components/ui/`)

| Component | Description | Export Name |
|---|---|---|
| `Button.jsx` | Multi-variant button with glow, loading & icon support | `Button` |
| `Card.jsx` | Content card container | `Card` |
| `GlassCard.jsx` | Glassmorphism container with backdrop blur | `GlassCard` |
| `StatCard.jsx` | KPI metric card with trend badge & icon | `StatCard` |
| `Table.jsx` | Custom data table with pagination & empty states | `Table` |
| `Modal.jsx` | Accessible dialog modal wrapper | `Modal` |
| `Badge.jsx` | Status badge component | `Badge` |
| `Input.jsx` | Input field with error handling | `Input` |
| `Select.jsx` | Custom dropdown select | `Select` |
| `Search.jsx` | Search input box | `Search` |
| `Avatar.jsx` | User avatar component | `Avatar` |
| `Loader.jsx` | Circular loader & skeleton components | `Loader` |
| `Toast.jsx` | Toast notification wrapper | `Toast`, `showToast` |
| `Tabs.jsx` | Tab bar component | `Tabs` |
| `Progress.jsx` | Progress bar component | `Progress` |
| `Dropdown.jsx` | Action dropdown menu | `Dropdown` |
