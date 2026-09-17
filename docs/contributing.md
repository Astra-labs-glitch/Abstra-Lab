# Contributing

## Before you change code

1. Read [Getting started](./getting-started.md) and [Architecture](./architecture.md).
2. Prefer the smallest change that solves the problem.
3. Match existing patterns: Server Components by default, plain CSS in `globals.css`, Prisma for data, server actions for dashboard mutations.

## Where to put changes

| Kind of change                                 | Prefer                           |
| ---------------------------------------------- | -------------------------------- |
| Marketing copy, galleries, FAQs, sponsor tiers | `app/content.ts`                 |
| Nav labels / order                             | `app/site-shell.tsx`             |
| Shared section UI                              | `app/page-sections.tsx`          |
| Styles                                         | `app/globals.css`                |
| Auth / sessions                                | `lib/auth.ts`, `lib/accounts.ts` |
| Schema                                         | `prisma/schema.prisma` + migrate |
| Public JSON / upload / telemetry               | `app/api/...`                    |
| CMS mutations                                  | `app/dashboard/actions.ts`       |

## Style conventions

- TypeScript strictness as configured in `tsconfig.json`
- No Tailwind — use existing CSS class patterns (`sx-*`, `dash-*`, gallery modifiers)
- Do not add UI libraries unless the team agrees
- Keep Django-mapped table names in Prisma
- Never commit secrets, phone-original photos with EXIF/GPS, or the git-ignored `references/` PDFs

## Media

Resize and strip metadata before commit — see [Content editing](./content-editing.md).

## Verification

```sh
npm run typecheck
npm run build          # for larger changes
npm run e2e            # after starting a server, or use BASE_URL
```

If you add a public route, update `scripts/e2e-smoke.mjs`.

## Pull requests / review

- Describe **why** the change exists
- Note env vars or migrations required
- Link screenshots for visual/content work
- Call out anything that needs staff testing on production after deploy (`vercel --prod`)

## Deployments

Only people with Vercel access should run production deploys. See [Deploying](./deploying.md). Prefer deploying a known commit after review.

## Questions

- Club / competition context: `PROJECT_CONTEXT.md` and team leads
- Rules/DTEG PDFs: ask for `references/` (not in git)
- Secrets / Neon / Vercel access: current project owners (see [Handover](./handover.md))
