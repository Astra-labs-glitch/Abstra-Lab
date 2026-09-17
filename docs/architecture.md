# Architecture

## Purpose

The site is both a **public showcase** (Pioneer, Launch Canada, sponsorship, join) and a **member platform** (accounts, dashboard, staff CMS, telemetry ingest). Marketing copy is mostly static TypeScript; dynamic content (posts, events, resources, users) lives in Postgres.

## High-level diagram

```
Browser
  │
  ▼
Next.js App Router (Vercel / local)
  ├── Static pages  ← app/content.ts + page-sections + globals.css
  ├── Accounts      ← lib/accounts.ts + lib/auth.ts (HMAC session cookie)
  ├── Dashboard     ← server actions in app/dashboard/actions.ts
  └── API routes    ← app/api/*
        │
        ├── Neon Postgres (Prisma)
        └── S3 / SeaweedFS (optional uploads)
```

## Directory layout

```
app/
  page.tsx                 Home
  layout.tsx               Root layout + SiteShell + metadata
  content.ts               Site copy, galleries, partners, FAQs, sponsorship
  page-sections.tsx        Shared building blocks (PageHero, Gallery, …)
  site-shell.tsx           Header, burger menu (navItems), footer
  globals.css              All styles (no Tailwind)
  seo.ts / sitemap.ts / robots.ts
  pioneer/                 Vehicle page
  launch-canada/           Competition page (+ videos.tsx)
  sponsorship/             Sponsor deck and tiers
  about/ contact/ join/ events/ posts/ members/ discord/
  accounts/                login, signup, pending, logout
  dashboard/               Member area; staff/ is the CMS
  api/                     auth, upload, files, telemetry, public feeds
lib/
  accounts.ts              registerUser / authenticate / ADMIN_EMAILS
  auth.ts                  Session cookie, password hashing, guards
  prisma.ts                Prisma client + hasDatabase()
  s3.ts                    Upload / presign helpers
  public-content.ts        Published posts/events for pages + JSON feeds
  rate-limit.ts            In-memory rate limiter (auth routes)
prisma/
  schema.prisma            Data models (Django-era table names)
  sql/                     Hand-run SQL notes
public/
  images/pick/             Site photography
  media/events/            Video clips + posters
  docs/                    Sponsorship PDF
scripts/
  e2e-smoke.mjs            Dependency-free public-site smoke test
docker/                    SeaweedFS S3 config for local compose
```

## Request layers

### Public pages

Most marketing routes are Server Components that import constants from `app/content.ts` and render via `page-sections.tsx`. They do not require auth. Posts and events pages call `lib/public-content.ts`, which queries Prisma when `DATABASE_URL` is set.

### Shell and styling

- `app/site-shell.tsx` wraps every page (client component for burger menu + scroll).
- Nav items live in `navItems` inside that file.
- All visual design is in `app/globals.css` — there is no Tailwind or CSS-in-JS library.

### Auth

Custom session cookies (HMAC-signed), not NextAuth. See [Authentication](./authentication.md).

### Dashboard

`app/dashboard/layout.tsx` calls `requireUser()` and redirects to login. Staff-only UI and mutations use `requireStaff()` / server actions. See [Dashboard](./dashboard.md).

### API

Route handlers under `app/api/` for JSON auth, uploads, private file access, public feeds, and telemetry. See [API reference](./api.md).

## Redirects and security headers

Configured in `next.config.ts`:

| From | To |
|---|---|
| `/work`, `/projects` | `/pioneer` (permanent) |
| `/sponsor` | `/sponsorship` (permanent) |
| `/admin/*` | `/dashboard` (temporary) |

Security headers applied site-wide: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.

`output: "standalone"` supports Docker/self-host builds; production on Vercel does not require Docker.

## Data stores

| Store | Role |
|---|---|
| **Neon Postgres** | Users, profiles, posts, events, materials, library assets, telemetry frames |
| **Git `public/`** | Public images, videos, sponsorship PDF |
| **S3** (optional) | Staff uploads; `public/` and `private/` key prefixes |

Table names are mapped to the original Django names (`auth_user`, `core_blogpost`, …). Do not rename them casually — see [Data model](./data-model.md).

## Design principles (site)

From `PROJECT_CONTEXT.md`: engineering-forward but approachable; journal + projects + members; documentation of the Launch Canada journey for sponsors, recruits, and the rocketry community.
