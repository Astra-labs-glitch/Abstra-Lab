# Astra Labs website

Public site and member dashboard for Astra Labs, the student rocketry club at
Seneca Polytechnic (Team 06, Launch Canada 2026).

- **Live:** [https://alsp.ca](https://alsp.ca) (`astralab.space` was the previous domain)
- **Stack:** Next.js 16 (App Router) · React 19 · Prisma 6 · PostgreSQL (Neon) · S3-compatible uploads
- **Hosting:** Vercel project `astra-lab`
- **Code:** [github.com/Davedat-110105/Abstra-Lab](https://github.com/Davedat-110105/Abstra-Lab)

## Documentation

Full docs live in [`docs/`](./docs/README.md):

| Topic | Link |
|---|---|
| Local setup | [Getting started](./docs/getting-started.md) |
| System map | [Architecture](./docs/architecture.md) |
| Copy, galleries, media | [Content editing](./docs/content-editing.md) |
| Login, roles, master admin | [Authentication](./docs/authentication.md) |
| Prisma / Neon | [Data model](./docs/data-model.md) |
| HTTP APIs | [API reference](./docs/api.md) |
| Member area & staff CMS | [Dashboard](./docs/dashboard.md) |
| Vercel & env vars | [Deploying](./docs/deploying.md) |
| Smoke tests | [Testing](./docs/testing.md) |
| Optional Docker | [Local Docker](./docs/local-docker.md) |
| Ownership transfer | [Handover](./docs/handover.md) |
| Conventions | [Contributing](./docs/contributing.md) |

Club mission and member onboarding (non-code): [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).

## Quick start

Node.js 22+ and npm. Docker is optional; the database is hosted Neon Postgres.

```sh
git clone https://github.com/Davedat-110105/Abstra-Lab.git
cd Abstra-Lab
npm install
cp .env.example .env.local
```

Set at least `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in `.env.local`. Then:

```sh
npm run db:generate
npm run dev
```

Public pages work without a database. Login, signup, and the dashboard need `DATABASE_URL`.

With Vercel access:

```sh
npm i -g vercel
vercel link            # team "daveta", project "astra-lab"
vercel env pull .env.local
```

## Project layout (short)

```
app/           Pages, content.ts, CSS, dashboard, API routes
lib/           Auth, Prisma, S3, public content helpers
prisma/        Schema (Django-era table names) + hand-run SQL notes
public/        Images, videos, sponsorship PDF
scripts/       e2e-smoke.mjs
docs/          Detailed documentation
```

## Common commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local server |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Production build |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Create/apply migrations |
| `npm run e2e` | Public-site smoke test |
| `vercel --prod` | Deploy to production |

```sh
BASE_URL=https://alsp.ca npm run e2e
```

## Editing content quickly

Most marketing copy and galleries: [`app/content.ts`](./app/content.ts).  
Nav: `navItems` in [`app/site-shell.tsx`](./app/site-shell.tsx).  
Details: [Content editing](./docs/content-editing.md).
