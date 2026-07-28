# AUTH_FLOW.md — RestaurantOS Authentication & Session Flow

## Overview

RestaurantOS uses **JWT-based stateless authentication** with access tokens (1 day) and refresh tokens (7 days). Sessions are tracked in the database for security auditing.

---

## 1. Registration Flow

```
POST /api/auth/register
Body: { fullName, email, password, phone?, roleId }

Backend:
  1. Check email uniqueness
  2. Validate roleId exists in Role table
  3. bcrypt.hash(password, 10)
  4. prisma.user.create({ ...data, role: include })
  5. prisma.activityLog.create({ action: 'REGISTER' })
  6. Return: UserDTO (id, fullName, email, role)

Frontend:
  RegisterPage → authService.register() → redirect /login
```

---

## 2. Login Flow

```
POST /api/auth/login
Body: { email, password }

Backend:
  1. prisma.user.findUnique({ email, include: { role } })
  2. bcrypt.compare(password, user.password)
  3. Check user.isActive === true
  4. generateToken({ id, email, role.name }) → JWT (1d)
  5. generateRefreshToken({ id, email, role.name }) → JWT (7d)
  6. prisma.refreshToken.create({ userId, token, expiresAt })
  7. prisma.userSession.create({ userId, refreshTokenId, ip, userAgent })
  8. prisma.activityLog.create({ action: 'LOGIN' })
  9. Return: { accessToken, refreshToken, user: UserDTO }

Frontend (AuthContext.login):
  1. POST /api/auth/login
  2. setTokens(accessToken, refreshToken) → localStorage
  3. setUser(user) → localStorage
  4. GET /api/permissions/role/:roleId → permissions[]
  5. setState: user, token, permissions, isAuthenticated = true
  6. Redirect to /dashboard
```

---

## 3. Session Validation on Mount

```
AuthContext useEffect (on app load):
  1. Read accessToken from localStorage
  2. If no token → clearAuth(), setLoading(false), show login
  3. If token exists:
     a. GET /api/users/profile (uses token)
     b. If 200 → setUser, loadPermissions, setLoading(false)
     c. If 401 → try refresh flow (step 4)
     d. If refresh fails → clearAuth(), redirect /login
```

---

## 4. Token Refresh Flow

```
POST /api/auth/refresh
Body: { refreshToken }

Backend:
  1. verifyRefreshToken(refreshToken) → decoded payload
  2. prisma.user.findUnique({ id: decoded.id })
  3. Check user.isActive
  4. generateToken(payload) → new accessToken
  5. generateRefreshToken(payload) → new refreshToken
  6. Return: { accessToken, refreshToken }

Frontend (Axios response interceptor):
  On 401 response:
  1. clearAuth()
  2. Redirect to /login (if not already on /login)

Frontend (AuthContext.refresh):
  1. POST /api/auth/refresh with stored refreshToken
  2. setTokens(newAccessToken, newRefreshToken)
  3. Return new accessToken
```

---

## 5. Logout Flow

```
Frontend (AuthContext.logout):
  1. clearAuth() → remove from localStorage
  2. setState: user=null, token=null, permissions=[]
  3. Navigate('/login', { replace: true })

Note: Backend has no explicit logout endpoint.
Refresh tokens are NOT revoked on logout (by design).
They expire naturally after 7 days.
```

---

## 6. Permission Loading

```
After login, AuthContext fetches role permissions:
  GET /api/permissions/role/:roleId
  → Returns: [ { id, name, action, resource, description } ]

Stored in: AuthContext.permissions[]

Usage:
  hasPermission('CREATE', 'ORDERS') → true/false
  hasRole('ADMIN') → true/false
  ADMIN always returns true (bypass)
```

---

## 7. Token Storage (localStorage)

| Key | Value |
|---|---|
| `accessToken` | JWT string |
| `refreshToken` | JWT string |
| `user` | JSON stringified UserDTO |

Helper: `src/utils/storage.js`
- `getToken()` / `setTokens()` / `clearAuth()` / `getUser()` / `setUser()` / `getRefreshToken()`

---

## 8. Axios Interceptors

```javascript
// Request: Auto-attach token
config.headers.Authorization = `Bearer ${getToken()}`;

// Response: Handle 401
if (error.response.status === 401) {
  clearAuth();
  window.location.href = '/login';
}
```

---

## 9. Protected Route Guard

```jsx
<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} requiredPermission={{ action: 'READ', resource: 'EXPENSES' }}>
  <ExpensesPage />
</ProtectedRoute>

Guard logic:
  1. If !isAuthenticated → redirect /login
  2. If allowedRoles specified → check hasRole(allowedRoles) (ADMIN bypasses)
  3. If requiredPermission → check hasPermission(action, resource)
  4. If any check fails → redirect /403
  5. Otherwise → render children (Outlet)
```

---

## 10. JWT Structure

### Access Token Payload
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### JWT Config (`.env`)
```
JWT_SECRET=restaurant_os_secret_key
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d
```

---

## 11. Security Features

| Feature | Implementation |
|---|---|
| Password Hashing | bcrypt (salt rounds: 10) |
| Token Validation | jsonwebtoken.verify() |
| Rate Limiting | Auth: 15 req/15min · API: 100 req/15min |
| Security Headers | Helmet.js (CSP disabled for Swagger) |
| CORS | Strict whitelist: localhost:3000,5173,5174,5175,5000 |
| Soft Deletes | isDeleted flag — deactivated users cannot login |
| Session Tracking | UserSession + RefreshToken stored in DB |
| ADMIN Bypass | ADMIN role bypasses all granular permission checks |
