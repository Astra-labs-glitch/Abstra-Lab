# Security and privacy (Oct 2026)

What the site does to protect members and applicants, and where it lives in the code.

| Area | What it does | Where |
| --- | --- | --- |
| Privacy policy & terms | Plain-language pages, editable with **Edit website** (keys `privacy.*`, `terms.*`). Linked in the footer. | `app/privacy`, `app/terms`, `app/legal-page.tsx` |
| Consent | Required checkbox on the Apply form and Sign up; checked again on the server. Google sign-in shows an "agree" line. | `app/volunteer/role-list.tsx`, `app/volunteer/actions.ts`, `app/accounts/signup/page.tsx` |
| Workshop waitlist | Consent and (for high school) guardian checkboxes enforced on the server, honeypot, shared rate limit, 12-month auto-delete, staff-only list and CSV (formula-safe). | `app/workshop/actions.ts`, `lib/workshop.ts`, `app/dashboard/workshop` |
| Public documents | The Hivemind proposal is published only as a truly redacted copy; the viewer shows images of that copy. | `public/docs/hivemind/` |
| Résumé retention | Applications older than 12 months are deleted whenever an exec opens Overview or Applications, and logged. | `lib/audit.ts` → `purgeOldApplications` |
| Fonts | Archivo is self-hosted with `next/font`, so visitors never contact Google Fonts. | `app/layout.tsx` |
| CSP | Only this site's scripts, styles, fonts and images load. Previews also allow vercel.live. | `next.config.ts` |
| Sessions | Timing-safe signature check; staff sessions last 7 days, members 14. | `lib/auth.ts` |
| Rate limits | Counters in the `astra_rate_limit` table, shared by every serverless instance (memory fallback if the DB is down). | `lib/rate-limit.ts` |
| Audit log | Admin changes (roles, applications, members, events, team spots, page switches, site text) go to `astra_audit`; latest show on Overview. | `lib/audit.ts`, `app/dashboard/admin-actions.ts` |
| Schema changes | `prisma db push` runs on **production** builds only, so a pull request's preview can't change the live database. | `scripts/db-push-if-production.mjs` |

**Forgot password** is not built: the site has no email service. Members who forget a password can use Continue with Google (same email), or an admin can reset them.

**Tradeoff of production-only schema pushes:** a preview that adds a new table won't have it until the PR is merged. Code that uses new tables must cope with them missing (both new tables here do). For full preview testing, give previews their own Neon branch.
