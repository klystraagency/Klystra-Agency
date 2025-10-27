# TODO: Switch to JWT Authentication

## Tasks
- [x] Install jsonwebtoken package
- [x] Update backend to use JWT instead of sessions
- [x] Update login route to generate and return JWT token
- [x] Update /api/auth/me to verify JWT token
- [x] Update frontend to store JWT token and send in headers
- [x] Update logout to remove token
- [x] Test login flow with JWT

## Files to Edit
- [x] server/app.ts: Remove session/passport, add JWT middleware
- [x] server/routes.ts: Update auth routes for JWT
- [x] client/src/lib/queryClient.ts: Add Authorization header
- [x] client/src/pages/admin-login.tsx: Store token on login
- [x] client/src/pages/admin-dashboard.tsx: Update auth check

## Followup Steps
- [ ] Deploy and test on production
- [ ] Verify token persistence across page reloads
- [ ] Test login flow with axios interceptors
- [ ] Verify 401 handling redirects to login
