# ProptiOS  (API)

Official proptios.com API for property manager dashboard

This service is maintained from the `proptiOS` monorepo.

Contribution policy:
- clone and work from the root monorepo
- do not open feature branches or PRs from this child repository
- changes made here directly do not sync back to the monorepo automatically

Sync test marker: propagated from monorepo on 2026-03-24.

## Local Dev Setup

1. Start MariaDB: `sudo systemctl start mariadb`
2. Import DB: `mariadb -u root proptios_db < dump.sql`
3. Create `.env` (see `.env.example`)
4. Use Node 20 (`nvm use 20`)
5. `pnpm dev` — runs on port 2024
6. Root shortcuts: `pnpm doctor`, `pnpm bootstrap`, `pnpm dev:api-pm`

### .env required vars
```
PORT=2024
PMAPI_MYSQL_HOST=localhost
PMAPI_MYSQL_USER=proptios
PMAPI_MYSQL_PASS=<password>
PMAPI_MYSQL_DB=proptios_db
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
```

## Railway Deploy

This API is ready to run on Railway.

Service settings:
- Root directory: `api.pm.proptios.com`
- Start command: `pnpm start`
- Health check path: `/ping`

Environment variables to add in Railway:
```bash
PMAPI_MYSQL_HOST=<your-db-host>
PMAPI_MYSQL_USER=<your-db-user>
PMAPI_MYSQL_PASS=<your-db-password>
PMAPI_MYSQL_DB=<your-db-name>
JWT_SECRET=<your-jwt-secret>
JWT_REFRESH_SECRET=<your-refresh-secret>
AUTH_AUTO_VERIFY_EMAIL=<true-or-false>
DISABLE_TRANSACTIONAL_EMAIL=<true-or-false>
S3_BUCKET=<your-bucket-name>
S3_REGION=<aws-region-or-auto>
S3_ENDPOINT=<https://s3-compatible-endpoint>
S3_ACCESS_KEY_ID=<your-access-key>
S3_SECRET_ACCESS_KEY=<your-secret-key>
S3_PUBLIC_BASE_URL=<https://public-cdn-or-bucket-base-url>
S3_FORCE_PATH_STYLE=<true-or-false>
```

Notes:
- Do not set `PORT` manually in Railway unless you have a special reason. Railway injects it automatically, and the app already binds to `process.env.PORT`.
- If you use a Railway MySQL service, copy the connection values from that service into the variables above.
- `AUTH_AUTO_VERIFY_EMAIL=true` is useful for staging or automated test environments when fresh signups should be able to log in immediately.
- `DISABLE_TRANSACTIONAL_EMAIL=true` prevents email provider failures from crashing signup and verification flows while you are still wiring delivery.
- If you use a Railway bucket, map `BUCKET`, `REGION`, `ENDPOINT`, `ACCESS_KEY_ID`, and `SECRET_ACCESS_KEY` into the `S3_*` vars above, or let the code read the raw Railway bucket vars directly.
- `S3_PUBLIC_BASE_URL` should be set when you want the database to store a stable public URL for images/documents. For private buckets, use the upload endpoint for writes now and add signed-download reads later.
- After deploy, verify the service returns `200 OK` on `/ping`.

## File Uploads

This API now supports S3-compatible uploads.

- Authenticated upload endpoint: `POST /uploads`
- Form field: `file`
- Optional form field: `folder`
- Response: object `key` and `url`

Onboarding registration (`POST /auth/register`) now uploads `id_card` to the configured bucket and stores the resulting URL in `id_documents.document_url`.
