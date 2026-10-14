# Authentication and roles

Auth is custom (not NextAuth). Core logic lives in `lib/auth.ts` and `lib/accounts.ts`.

## Session model

- Cookie name: `astra_session`
- Payload: `{ userId, isStaff, exp }` (14-day expiry)
- Signed with HMAC using `AUTH_SECRET`
- Flags: `httpOnly`, `sameSite=lax`, `secure` in production (or when `AUTH_SECURE_COOKIE=1`)

If `AUTH_SECRET` is missing or left at the insecure default in production, the app refuses to start sessions.

Passwords use Django-compatible **PBKDF2-SHA256** (`pbkdf2_sha256$iterations$salt$digest`) so legacy hashes from the old site still verify.

## Guards

| Helper           | Behavior                                                    |
| ---------------- | ----------------------------------------------------------- |
| `currentUser()`  | Reads cookie; returns user or `null` (also `null` if no DB) |
| `requireUser()`  | Active, non-banned user only                                |
| `requireStaff()` | User with `isStaff` or `isSuperuser`                        |

Dashboard layout uses `requireUser()`. Staff CMS and `POST /api/upload` use `requireStaff()`.

## Signup and login flow

1. Anyone can register at `/accounts/signup` (also aliased via `/signup`).
2. New accounts are **inactive** (`isActive: false`) unless the email is a master admin.
3. Inactive users land on `/accounts/pending` after signup.
4. Staff approve members at `/dashboard/staff` (`approveMember` server action).
5. Login accepts **username or email** + password (`authenticate` in `lib/accounts.ts`).
6. Banned profiles (`MemberProfile.isBanned`) cannot authenticate.

API equivalents: `POST /api/auth/signup`, `POST /api/auth/login` (rate-limited). Logout: `/accounts/logout`.

## Roles

| Role        | Flags               | Capabilities                                                               |
| ----------- | ------------------- | -------------------------------------------------------------------------- |
| **Pending** | `isActive: false`   | No dashboard                                                               |
| **Member**  | `isActive: true`    | Dashboard home, events, resources, posts (read)                            |
| **Staff**   | `isStaff: true`     | Approve members; create/edit/delete posts, events, resources; upload files |
| **Admin**   | `isSuperuser: true` | Same as staff; UI label "Admin"                                            |

Promoting someone to staff after approval is currently a **manual SQL** step (Neon console):

```sql
UPDATE auth_user SET is_staff = TRUE WHERE email = 'person@example.com';
```

## Master admin (`ADMIN_EMAILS`)

Comma-separated emails (default includes `saipdhodi@gmail.com` when unset).

- Signup with a listed email → created **active + staff + superuser**
- Existing account with a listed email → **promoted on next successful login**

Hand-run SQL equivalent: `prisma/sql/2026-09-09-master-admin.sql`.

## Sign in with Google

Login and sign-up show **Continue with Google** once `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set (the button stays hidden otherwise).

- An existing account whose email matches the Google email is signed straight in, so people who forgot their password can use Google instead.
- A new email creates an account that waits for admin approval, like a normal sign-up. Emails on the master-admin list are active and admin immediately.
- Google must report the email as verified.

Setup (Google Cloud Console → APIs & Services):

1. **OAuth consent screen:** External, app name "Astra Labs", support email `astralabsengineering@gmail.com`, scopes `openid`, `email`, `profile`. Publish the app so anyone can sign in.
2. **Credentials → Create credentials → OAuth client ID → Web application.**
   - Authorized redirect URIs: `https://www.alsp.ca/api/auth/google/callback` (add `http://localhost:3001/api/auth/google/callback` for local testing).
3. In Vercel → Settings → Environment Variables, add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (Production), then redeploy.

The redirect URI is built from `NEXT_PUBLIC_SITE_URL`, so it must match that domain exactly.

## Rate limiting

`lib/rate-limit.ts` provides an in-memory token bucket used by auth API routes. Limits reset per process — fine for single-instance / Vercel functions but not a global distributed limiter.

## Security notes

- Never commit real `.env.local` secrets.
- Rotating `AUTH_SECRET` in production logs everyone out.
- Private S3 objects are only reachable via `/api/files/private/…` after `requireUser()`.
