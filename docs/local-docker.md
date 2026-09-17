# Local Docker stack

Optional. Normal development uses Neon + `npm run dev` without Docker.

`docker-compose.yml` brings up:

| Service     | Purpose                      | Host ports                              |
| ----------- | ---------------------------- | --------------------------------------- |
| `db`        | Postgres 16                  | `127.0.0.1:55432` → 5432 (configurable) |
| `seaweedfs` | S3-compatible object storage | `8333` (S3), `8888` (filer UI)          |
| `s3init`    | One-shot bucket create       | —                                       |
| `frontend`  | Built Next.js image          | `3001` → 3000 (configurable)            |

## When to use it

- Fully offline development
- Testing private uploads against a real S3 API without AWS
- Self-hosting experiments

Production on Vercel does **not** use this stack. Compose, Dockerfile, and `docker/` can be removed if the club never intends to self-host.

## Quick start

1. Copy `.env.example` → `.env` (compose reads `.env`; Next local often uses `.env.local`).
2. Set strong `POSTGRES_PASSWORD` and `AUTH_SECRET`.
3. For Next talking to SeaweedFS from the host:

```env
S3_ENDPOINT=http://localhost:8333
S3_BUCKET=astra-labs-uploads
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_REGION=ca-central-1
```

Credentials must match `docker/seaweedfs-s3.json` (admin identity). Anonymous read is limited to the `public/` prefix.

4. Start:

```sh
docker compose up --build -d
```

5. Point `DATABASE_URL` at the published Postgres port if running `next dev` on the host instead of the `frontend` service.

## Notes

- SeaweedFS is used because MinIO’s OSS edition was archived; comments in compose explain volume slots (`-volume.max=100`).
- Leave `S3_ENDPOINT` **unset** on Vercel so the SDK talks to real AWS S3.
