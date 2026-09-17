# Getting started

You need **Node.js 22+** and npm. You do **not** need Docker for normal development — the production database is hosted Neon Postgres.

## 1. Clone and install

```sh
git clone https://github.com/Davedat-110105/Abstra-Lab.git
cd Abstra-Lab
npm install
cp .env.example .env.local
```

## 2. Environment variables

Open `.env.local` and set at least:

| Variable | Value for local |
|---|---|
| `DATABASE_URL` | Neon connection string (ask a lead, or pull from Vercel) |
| `AUTH_SECRET` | Long random string, e.g. `openssl rand -base64 48` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |

Optional but useful:

| Variable | Purpose |
|---|---|
| `ADMIN_EMAILS` | Comma-separated master-admin emails |
| `NEXT_PUBLIC_DISCORD_INVITE_URL` | Overrides Discord invite in code |
| `TELEMETRY_INGEST_TOKEN` | Required for telemetry writes in production |
| `S3_BUCKET` / `AWS_*` | Only needed for private uploads |

Full variable reference: [Deploying → Environment variables](./deploying.md#environment-variables).

### Fastest path: pull from Vercel

If you have access to the Vercel project:

```sh
npm i -g vercel
vercel link            # team "daveta", project "astra-lab"
vercel env pull .env.local
```

Then set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` for local browsing.

## 3. Generate Prisma client and run

```sh
npm run db:generate   # builds client from prisma/schema.prisma
npm run dev           # http://localhost:3000
```

## What works without a database?

| Feature | Needs `DATABASE_URL`? |
|---|---|
| Public marketing pages (home, Pioneer, Launch Canada, …) | No |
| Static content from `app/content.ts` | No |
| Login / signup / dashboard | Yes |
| Posts / events from the CMS | Yes (empty lists if missing) |
| Telemetry ingest | Yes |

`lib/prisma.ts` exposes `hasDatabase()`; public content helpers return empty arrays when the DB is unavailable.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:generate` | `prisma generate` |
| `npm run db:push` | Push schema to DB (small/local changes) |
| `npm run db:migrate` | Create a migration (preferred for shared changes) |
| `npm run e2e` | Smoke test (defaults to `http://localhost:3005`) |

## Next steps

- Edit site copy: [Content editing](./content-editing.md)
- Understand the layout: [Architecture](./architecture.md)
- Optional offline stack: [Local Docker](./local-docker.md)
