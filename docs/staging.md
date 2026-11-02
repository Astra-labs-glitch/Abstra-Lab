# Staging / DEV site (`dev.alsp.ca`)

Production stays on **[alsp.ca](https://alsp.ca)**. Staging is a separate host for reviewing site changes before promoting to production.

Repo-side prep is ready (env template + npm scripts). **DNS + Vercel domain still need a logged-in Vercel account and DNS access.**

## One-time setup (operator checklist)

### 0. Auth

```sh
npx vercel login
npx vercel link          # team "daveta", project "astra-lab" (or the club project after handover)
```

### 1. DNS

At the registrar for `alsp.ca`, add:

| Type    | Name  | Value                                                                          |
| ------- | ----- | ------------------------------------------------------------------------------ |
| `CNAME` | `dev` | The target Vercel shows when you add the domain (often `cname.vercel-dns.com`) |

If the apex already uses Vercel nameservers, you can add `dev.alsp.ca` in the Vercel Domains UI and accept the suggested record.

### 2. Add the domain on Vercel

```sh
npx vercel domains add dev.alsp.ca
```

Or: Vercel → Project → Settings → Domains → Add `dev.alsp.ca`.

**Assign it to Preview / a `dev` git branch**, not the Production deployment for `alsp.ca`.

### 3. Preview environment variables

Use [`.env.staging.example`](../.env.staging.example) as the checklist. In Vercel, set at least:

| Variable               | Preview / Staging value               |
| ---------------------- | ------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://dev.alsp.ca`                 |
| `DATABASE_URL`         | Separate Neon DB/branch (recommended) |
| `AUTH_SECRET`          | Different from production             |

```sh
# Example (after link): pull prod for reference, then edit Preview vars in the dashboard
npx vercel env pull .env.vercel.local
```

Do **not** commit pulled secrets.

### 4. Deploy a preview

```sh
npm run deploy:preview
```

That runs `npx vercel` (preview, not `--prod`). After DNS verifies, open `https://dev.alsp.ca`.

Optional long-term workflow: push a `dev` branch and let Vercel Git previews update the domain automatically (enable Git deploys on the project if not already).

### 5. Verify

```sh
npm run e2e:staging
# same as: BASE_URL=https://dev.alsp.ca npm run e2e
```

## Local equivalent

```sh
npm run dev
# http://localhost:3000
```

## Notes

- SSL is automatic once DNS verifies on Vercel.
- Keep Production (`alsp.ca`) and Preview (`dev.alsp.ca`) env vars separate.
- After club handover ([handover.md](./handover.md)), transfer both domains’ DNS ownership.
