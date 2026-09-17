# Astra Labs website documentation

Documentation for the **Abstra-Lab** repository — the public site and member dashboard for Astra Labs (Seneca Polytechnic student rocketry club, Team 06, Launch Canada 2026).

| | |
|---|---|
| **Production** | [https://alsp.ca](https://alsp.ca) |
| **Code** | [github.com/Davedat-110105/Abstra-Lab](https://github.com/Davedat-110105/Abstra-Lab) |
| **Stack** | Next.js 16 · React 19 · Prisma 6 · Neon Postgres · S3-compatible uploads |
| **Hosting** | Vercel project `astra-lab` |

Club mission and onboarding context (non-code): [`../PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md).

## Docs map

| Doc | Who it is for |
|---|---|
| [Getting started](./getting-started.md) | New developers setting up locally |
| [Architecture](./architecture.md) | Anyone who needs the system map |
| [Content editing](./content-editing.md) | Editing copy, galleries, nav, media |
| [Authentication & roles](./authentication.md) | Login, signup, staff, master admin |
| [Data model](./data-model.md) | Prisma schema and database workflow |
| [API reference](./api.md) | Auth, upload, files, public feeds, telemetry |
| [Dashboard & CMS](./dashboard.md) | Member area and staff publishing |
| [Deploying](./deploying.md) | Vercel, env vars, production checks |
| [Testing](./testing.md) | Typecheck, build, e2e smoke |
| [Local Docker](./local-docker.md) | Optional offline Postgres + SeaweedFS |
| [Handover](./handover.md) | Service ownership and club transfer |
| [Contributing](./contributing.md) | Conventions and common workflows |

## Domain note

**`alsp.ca` is the current production domain.**  
`astralab.space` was the previous domain and may still appear in older handover notes or registrar accounts until fully decommissioned.
