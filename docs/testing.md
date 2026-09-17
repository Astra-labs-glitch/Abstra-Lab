# Testing

## Typecheck and build

```sh
npm run typecheck    # tsc --noEmit
npm run build        # full production Next.js build
```

There is no separate Jest/Vitest suite in this repo today. Correctness for the public site is covered by the smoke script below.

## End-to-end smoke test

`scripts/e2e-smoke.mjs` is **dependency-free** (Node `fetch` only).

```sh
# Against a local server you started on port 3005
npm run e2e

# Against production
BASE_URL=https://alsp.ca npm run e2e
```

Default `BASE_URL` is `http://localhost:3005` (override if your `next dev` uses 3000).

### What it checks

- Every entry in `PUBLIC_ROUTES` returns **200**
- Permanent redirects: `/sponsor` → `/sponsorship`, `/projects` and `/work` → `/pioneer`
- Specific content regressions (gallery photos, judging copy, contact mailto, Discord links)
- Burger menu labels / hrefs
- Sitemap includes key paths
- Linked images and assets resolve
- Auth endpoints stay closed / behave safely without writing to the DB

### What it never does

- Sign up or log in with real credentials
- Write to the database
- Mutate production content

### When you add a page

1. Create the route under `app/`
2. Add the path to `PUBLIC_ROUTES` in `scripts/e2e-smoke.mjs`
3. Add content assertions only if the page has must-not-regress requirements
4. Run the smoke test locally and against production after deploy

## Manual QA checklist (auth / CMS)

1. Signup → lands on pending
2. Staff approve → member can open `/dashboard`
3. Staff create unpublished post → not on `/posts`
4. Publish → appears on `/posts` and `/api/public/posts`
5. Upload public image via `/api/upload` → URL works
6. Telemetry POST with bad token → 401; with good token → 201
