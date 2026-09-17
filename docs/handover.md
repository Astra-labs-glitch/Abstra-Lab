# Handover: services, owners, and decommissioning

Everything the site depends on, so ownership can move to the club and personal accounts can be shut down cleanly. Work top to bottom; each step is safe alone and the site can keep running throughout.

## Domain status

| Domain           | Status                                                                          |
| ---------------- | ------------------------------------------------------------------------------- |
| **`alsp.ca`**    | **Current production domain**                                                   |
| `astralab.space` | Previous public domain — transfer or decommission; do not treat as live primary |

Ensure `NEXT_PUBLIC_SITE_URL=https://alsp.ca` in Vercel and that DNS for `alsp.ca` points at the Vercel project.

## Service inventory

| Service                                                 | What it does                                           | Currently under                      | Transfer to                                      |
| ------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------ | ------------------------------------------------ |
| **GitHub** `Davedat-110105/Abstra-Lab`                  | Source code                                            | Dat's personal GitHub                | Club-owned GitHub org (e.g. `astra-labs-seneca`) |
| **Vercel** team `daveta`, project `astra-lab`           | Builds and hosts the site                              | Dat's Vercel team                    | Club Vercel team (Saiprasad as owner)            |
| **Domain** `alsp.ca`                                    | Public address                                         | Confirm registrar/account with leads | Club-owned registrar or Vercel Domains           |
| **Domain** `astralab.space` (legacy)                    | Old address (Porkbun, renews ~2027-01-16 historically) | Dat's / prior account                | Club account, redirect to `alsp.ca`, or cancel   |
| **Neon** Postgres                                       | Users, posts, events, telemetry                        | Dat's Neon account                   | Club Neon account (free tier OK)                 |
| **AWS S3** bucket `astra-labs-uploads` (`ca-central-1`) | Private member uploads                                 | Dat's AWS account                    | Club AWS, or drop S3 (see below)                 |
| **Discord**                                             | Member chat                                            | Club (Saiprasad)                     | Already club-owned — keep invite non-expiring    |
| **Forgejo** mirror                                      | Private git mirror                                     | Dat's home server                    | Remove remote; decommission                      |
| **Email** `astralabsengineering@gmail.com`              | Public contact                                         | Club                                 | Already club-owned                               |

Exact Neon host / project IDs may change after transfer — update this table when ownership moves.

## Transfer order

### 1. GitHub

Create the club org, then Settings → General → Transfer ownership. Collaborators update `origin`. Do this first so other systems point at the club repo.

### 2. Vercel

In the club team: import the repo, copy every production env var (see [Deploying](./deploying.md)), enable Git deploys on `main` if desired. Verify with a preview deploy and:

```sh
BASE_URL=<preview-url> npm run e2e
```

Attach **`alsp.ca`** (and `www` if used) under Domains. Then delete the old project from team `daveta`.

### 3. Domains

- **`alsp.ca`:** ensure DNS and registrar ownership are club-controlled.
- **`astralab.space`:** add redirects to `https://alsp.ca` if you keep the name, or let it lapse after confirming nothing critical still depends on it.

### 4. Database

Prefer Neon **Transfer project** to the club org (same connection string). Fallback dump/restore:

```sh
pg_dump "$OLD_DATABASE_URL" --no-owner --no-privileges -Fc -f astra.dump
pg_restore --no-owner --no-privileges -d "$NEW_DATABASE_URL" astra.dump
```

Update `DATABASE_URL` in Vercel and redeploy during a quiet hour. Keep the old project ~1 week, then delete.

### 5. Uploads (S3)

Check contents:

```sh
aws s3 ls s3://astra-labs-uploads --recursive --summarize
```

If empty or nearly empty, create a club bucket, set `S3_*` / `AWS_*` in Vercel, sync if needed. If the club does not want AWS, leave `S3_BUCKET` unset: public uploads can still use the filesystem path in some setups; private uploads are refused; the site otherwise runs.

### 6. Master admin and secrets

After Saiprasad (and other leads) have logged in once, they are active + staff + superuser via `ADMIN_EMAILS`. Then rotate `AUTH_SECRET` and `TELEMETRY_INGEST_TOKEN` in Vercel (rotating `AUTH_SECRET` logs everyone out once).

## Decommission checklist

After transfer is verified with:

```sh
BASE_URL=https://alsp.ca npm run e2e
```

and a staff member has published a test post:

- [ ] Delete old Vercel project from team `daveta`
- [ ] Delete old Neon project (after fallback window)
- [ ] Empty/delete old S3 bucket and IAM keys
- [ ] Remove personal owners from GitHub / Vercel
- [ ] `git remote remove forgejo` in clones; shut down Forgejo mirror
- [ ] Delete local `.env.local` copies of old secrets
- [ ] Confirm `alsp.ca` renewal billing is club-owned
- [ ] Confirm `astralab.space` is redirected or cancelled intentionally
- [ ] Update this doc and [Deploying](./deploying.md) with new team/project names

## Local Docker is not production

`docker-compose.yml`, `Dockerfile`, and `docker/` are for offline/self-host only. Safe to delete if unused.
