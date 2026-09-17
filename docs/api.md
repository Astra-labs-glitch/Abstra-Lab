# API reference

All routes are under `app/api/`. Unless noted, responses are JSON.

## Auth

### `POST /api/auth/signup`

Creates a user (inactive unless master-admin email). Body fields align with the signup form (username, email, names, password). Rate-limited.

### `POST /api/auth/login`

Authenticates with username or email + password; sets `astra_session` cookie on success. Rate-limited.

### `GET` / logout

Browser logout is `GET /accounts/logout` (clears the session cookie), not under `/api`.

---

## Public feeds

### `GET /api/public/posts`

Published blog posts (same shape as `getPublicPosts()` in `lib/public-content.ts`).

### `GET /api/public/events`

Published events (same shape as `getPublicEvents()`).

Empty arrays when the database is unavailable.

---

## Uploads

### `POST /api/upload`

**Staff only** (`requireStaff`).

| Form field   | Notes                                       |
| ------------ | ------------------------------------------- |
| `file`       | Required multipart file                     |
| `visibility` | `public` or `private` (default **private**) |

Constraints:

- Max size **10 MB**
- Allowed extensions: png, jpg, jpeg, gif, webp, avif, pdf

Behavior:

| Condition         | Result                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| S3 configured     | Object stored at `{visibility}/{timestamp}-{name}`; public returns CDN/S3 URL; private returns `/api/files/{key}` |
| No S3 + `public`  | Written to `public/uploads/` → URL `/uploads/...`                                                                 |
| No S3 + `private` | **501** — private uploads require `S3_BUCKET`                                                                     |

---

## Private files

### `GET /api/files/[...key]`

**Authenticated members** (`requireUser`).

- Key must start with **`private/`**
- Path traversal (`..`) rejected
- Redirects (302) to a short-lived S3 presigned URL (10 minutes)
- 503 if S3 is not configured

---

## Telemetry

### `POST /api/telemetry` and `POST /api/telemetry/frames`

Same handler (`frames/route.ts` re-exported by `telemetry/route.ts`).

**Auth:** Bearer token or `x-telemetry-token` matching `TELEMETRY_INGEST_TOKEN`.

- Production **without** token configured → **503** `ingest_not_configured` (fails closed)
- Dev without token → writes allowed (for local testing)

Limits: body max **64 KB**. Requires a ground-station identifier (`ground_station`, `station_id`, etc.).

Accepts **snake_case or camelCase** fields, plus a ground-station envelope (`station_id`, `type`, `payload.*`). Full body stored in `raw`.

Example:

```sh
curl -X POST 'https://alsp.ca/api/telemetry' \
  -H 'Authorization: Bearer <TELEMETRY_INGEST_TOKEN>' \
  -H 'Content-Type: application/json' \
  --data '{
    "ground_station": "pi-range-01",
    "sequence_number": 42,
    "rocket_time_ms": 123456,
    "altitude_m": 517.2,
    "velocity_mps": 81.4,
    "battery_v": 11.9,
    "rssi_dbm": -97
  }'
```

Success: **201** with `{ ok: true, id: "<frameId>" }`.

### `GET /api/telemetry/latest`

Returns the newest telemetry frames (implementation returns the latest batch for ops/debug). Requires database.

---

## Error patterns

Common JSON shape: `{ ok: false, error: "<code>" }` with appropriate HTTP status (`401`, `400`, `413`, `415`, `422`, `501`, `502`, `503`).
