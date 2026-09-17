# Deploying

Production deploys are done with the **Vercel CLI** from a developer machine. Git auto-deploy is not configured on the current project (can be enabled after club handover).

**Production domain:** [https://alsp.ca](https://alsp.ca)  
**Vercel:** team `daveta`, project `astra-lab`  
**Alias note:** `astra-lab-daveta.vercel.app` may sit behind Vercel login; that is expected.

> Previous domain **`astralab.space`** is retired for public traffic. Keep DNS/registrar notes only for ownership transfer or redirects.

## Deploy command

```sh
vercel --prod
```

This uploads the current working tree (committed or not) and promotes it to production. Prefer deploying from a clean, reviewed commit.

## Environment variables

Set in Vercel → Project → Settings → Environment Variables (Production).

| Variable                                      | Required         | Notes                                                          |
| --------------------------------------------- | ---------------- | -------------------------------------------------------------- |
| `DATABASE_URL`                                | Yes              | Neon pooled connection string                                  |
| `AUTH_SECRET`                                 | Yes              | Long random string; sessions fail closed without a real secret |
| `NEXT_PUBLIC_SITE_URL`                        | Yes              | `https://alsp.ca` (canonical links, OG, sitemap)               |
| `TELEMETRY_INGEST_TOKEN`                      | Yes (for ingest) | Bearer token for `POST /api/telemetry`                         |
| `S3_BUCKET`                                   | Optional         | Private uploads; leave unset to refuse private uploads only    |
| `AWS_REGION`                                  | With S3          | Default region in code: `ca-central-1`                         |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | With S3          | Or IAM role elsewhere                                          |
| `S3_PUBLIC_BASE_URL`                          | Optional         | CDN/custom domain for public keys                              |
| `S3_ENDPOINT`                                 | **No on Vercel** | Only for local SeaweedFS / S3-compatible endpoints             |
| `ADMIN_EMAILS`                                | Optional         | Comma-separated master-admin list                              |
| `NEXT_PUBLIC_DISCORD_INVITE_URL`              | Optional         | Overrides Discord invite in `content.ts`                       |
| `AUTH_SECURE_COOKIE`                          | Optional         | Secure cookies; production defaults to secure                  |

Pull locally:

```sh
vercel env pull .env.local
```

## Post-deploy checks

```sh
BASE_URL=https://alsp.ca npm run e2e
```

Manually: load home, Pioneer, Launch Canada, login page; staff smoke-publish if changing CMS code.

## Build locally before shipping

```sh
npm run typecheck
npm run build
```

## Standalone / Docker

`next.config.ts` sets `output: "standalone"`. The repo `Dockerfile` + `docker-compose.yml` can self-host the app with local Postgres; **production on Vercel does not use them**. See [Local Docker](./local-docker.md).
