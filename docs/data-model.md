# Data model

Prisma schema: `prisma/schema.prisma`.  
Client singleton: `lib/prisma.ts` (`hasDatabase()` returns whether `DATABASE_URL` is set).

Production database: **Neon Postgres** (free tier is enough for current load).

## Important: Django table names

Models use `@@map(...)` to keep the original Django table names from the previous site. **Do not rename tables** without a deliberate migration plan — the live data depends on these names.

| Prisma model     | Database table             |
| ---------------- | -------------------------- |
| `User`           | `auth_user`                |
| `MemberProfile`  | `core_memberprofile`       |
| `BlogPost`       | `core_blogpost`            |
| `ClubEvent`      | `core_clubevent`           |
| `BuildMaterial`  | `core_buildmaterial`       |
| `LibraryFolder`  | `core_libraryfolder`       |
| `LibraryAsset`   | `core_libraryasset`        |
| `TelemetryFrame` | `telemetry_telemetryframe` |

## Entity overview

```
User ──┬── MemberProfile (1:1)
       ├── BlogPost[]
       ├── ClubEvent[]
       ├── BuildMaterial[]
       └── LibraryAsset[]

LibraryFolder ── LibraryAsset[]

TelemetryFrame  (standalone ingest records; optional flight_session_id)
```

### User

Identity and permissions: `username`, `email` (unique), names, password hash, `isActive`, `isStaff`, `isSuperuser`, `dateJoined`.

### MemberProfile

Per-user club profile flags: `isBanned`, `bannedAt`. Created automatically on signup.

### BlogPost

Public journal entries: `title`, unique `slug`, `excerpt`, `content`, optional `featuredImage`, `published`, author FK, timestamps.

### ClubEvent

Club events: `title`, unique `slug`, `dateLabel`, `summary`, `description`, `location`, optional `startsAt` / `image`, `published`.

### BuildMaterial

Member resources (hardware docs, purchase links, etc.): type, summary, access notes, `purchaseUrl`, `published`, `sortOrder`.

### LibraryFolder / LibraryAsset

Structured library of files/assets for the member area (title, kind, description, optional image / reference file, `sourcePath`, `published`).

### TelemetryFrame

Ground-station ingest: station id, packet kind, sequence, rocket time, altitude/velocity/accel, lat/lon, battery, temperature, pressure, RSSI, plus full JSON `raw` envelope.

## Workflows

```sh
npm run db:generate   # after editing schema.prisma
npm run db:push       # apply schema to DB (dev / small changes)
npm run db:migrate    # create a named migration (preferred for shared work)
```

### Hand-run SQL

`prisma/sql/` holds dated notes for one-off operations (e.g. email uniqueness, master-admin promotion). Prefer Prisma migrations for anything that should be reviewed in git; use hand SQL for emergencies or Neon console ops.

## Public reads without DB

`lib/public-content.ts` returns `[]` when `DATABASE_URL` is unset or queries fail, so marketing pages still render.
