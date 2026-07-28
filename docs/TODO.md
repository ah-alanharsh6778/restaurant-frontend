# TODO.md — RestaurantOS Pending Tasks & Backlog

## Next Up (In Priority Order)

### 1. AI Intelligence Page (`/ai`)
- [ ] Create `src/pages/ai/AIPredictionsPage.jsx` component using `ai.service.js` endpoints:
  - `GET /api/ai/predict-stock`
  - `GET /api/ai/menu-pricing`
  - `GET /api/ai/food-waste`
  - `GET /api/ai/prep-time`
- [ ] Register `/ai` route in `AppRoutes.jsx` with roles `[ROLES.MANAGER]`.

### 2. Staff Management Page (`/staff`)
- [ ] Create `src/pages/staff/StaffPage.jsx` component using `staff.service.js` endpoints:
  - `GET /api/staff`
  - `POST /api/staff`
  - `GET /api/staff/:id`
  - `PUT /api/staff/:id`
  - `DELETE /api/staff/:id`
- [ ] Register `/staff` route in `AppRoutes.jsx` with roles `[ROLES.MANAGER]`.

---

## Completed Tasks
- [x] Fixed `Navbar.jsx` missing `Typography` import.
- [x] Cleaned up obsolete OCR buttons and empty `actions={}` from `AnalyticsDashboard.jsx`.
- [x] Generated master project documentation suite in `docs/`.
- [x] Fully integrated User Profile module (`/profile`) with real backend profile, sessions, and activity logs APIs.
- [x] Built Food Waste Telemetry Module (`/waste`) connected to `GET /api/waste`, `POST /api/waste`, `GET /api/waste/stats`.
- [x] Refactored Reports & Telemetry Module (`/reports`) connected to `reportService` (`GET /api/dashboard/...`, `GET /api/expenses/export`), live multi-tab registers, and bottom sidebar placement.
- [x] Completed Restaurant Table QR Ordering System (`/table-order/:tableId` & `/tables`) with public guest QR scanning, mobile ordering page, kitchen sync, printable invoice PDF receipts, payment processing, and auto table release.
